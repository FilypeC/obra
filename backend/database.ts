import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

export const database = new DatabaseSync(
  process.env.OBRA_DATABASE_PATH ??
    fileURLToPath(new URL("./database/cadastro.db", import.meta.url)),
);
let dailyAuditUser: { id: number; name: string } | null = null;
database.function("daily_audit_user_id", () => dailyAuditUser?.id ?? null);
database.function("daily_audit_user_name", () => dailyAuditUser?.name ?? null);

export const normalizeEmployeeName = (name: unknown) => {
  if (typeof name !== "string") {
    throw new TypeError("O nome do funcionário deve ser um texto.");
  }
  return name.trim().normalize("NFC").toLocaleLowerCase("pt-BR");
};
database.function(
  "normalize_employee_name",
  { deterministic: true },
  normalizeEmployeeName,
);
export const auditLogDirectory = fileURLToPath(new URL("./logs/", import.meta.url));
export const auditLogPath = fileURLToPath(new URL("./logs/auditoria.txt", import.meta.url));

database.exec(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    Nome TEXT NOT NULL CHECK (length(trim(Nome)) > 0),
    Ativo INTEGER NOT NULL DEFAULT 1 CHECK (Ativo IN (0, 1)),
    TipoConta TEXT NOT NULL DEFAULT 'Funcionário' CHECK (TipoConta IN ('Funcionário', 'ADM')),
    SenhaHash TEXT,
    PrecisaTrocarSenha INTEGER NOT NULL DEFAULT 1 CHECK (PrecisaTrocarSenha IN (0, 1))
  );
  CREATE TABLE IF NOT EXISTS diarias (
    funcionario_id INTEGER NOT NULL REFERENCES funcionarios(id),
    Data TEXT NOT NULL CHECK (length(Data) = 10),
    Diaria REAL NOT NULL CHECK (Diaria > 0),
    PRIMARY KEY (funcionario_id, Data)
  );
`);

let employeeColumns = database.prepare("PRAGMA table_info(funcionarios)")
  .all() as Array<{ name: string }>;
if (!employeeColumns.some(({ name }) => name === "Ativo")) {
  database.exec(`
    ALTER TABLE funcionarios
    ADD COLUMN Ativo INTEGER NOT NULL DEFAULT 1 CHECK (Ativo IN (0, 1))
  `);
  employeeColumns = database.prepare("PRAGMA table_info(funcionarios)")
    .all() as Array<{ name: string }>;
}
if (!employeeColumns.some(({ name }) => name === "TipoConta")) {
  database.exec(`
    ALTER TABLE funcionarios
    ADD COLUMN TipoConta TEXT NOT NULL DEFAULT 'Funcionário'
      CHECK (TipoConta IN ('Funcionário', 'ADM'))
  `);
  employeeColumns = database.prepare("PRAGMA table_info(funcionarios)")
    .all() as Array<{ name: string }>;
}
if (!employeeColumns.some(({ name }) => name === "SenhaHash")) {
  database.exec("ALTER TABLE funcionarios ADD COLUMN SenhaHash TEXT");
  employeeColumns = database.prepare("PRAGMA table_info(funcionarios)")
    .all() as Array<{ name: string }>;
}
if (!employeeColumns.some(({ name }) => name === "PrecisaTrocarSenha")) {
  database.exec(`
    ALTER TABLE funcionarios
    ADD COLUMN PrecisaTrocarSenha INTEGER NOT NULL DEFAULT 1
      CHECK (PrecisaTrocarSenha IN (0, 1))
  `);
  employeeColumns = database.prepare("PRAGMA table_info(funcionarios)")
    .all() as Array<{ name: string }>;
}
const dailyColumns = database.prepare("PRAGMA table_info(diarias)")
  .all() as Array<{ name: string; pk: number }>;
const dailyForeignKeys = database.prepare("PRAGMA foreign_key_list(diarias)")
  .all() as Array<{ table: string; from: string; to: string }>;
const expectedEmployeeColumns = [
  "id", "Nome", "Ativo", "TipoConta", "SenhaHash", "PrecisaTrocarSenha",
];
const expectedDailyColumns = ["funcionario_id", "Data", "Diaria"];
const schemaIsCurrent =
  employeeColumns.map(({ name }) => name).join(",") === expectedEmployeeColumns.join(",") &&
  dailyColumns.map(({ name }) => name).join(",") === expectedDailyColumns.join(",") &&
  dailyColumns.map(({ pk }) => pk).join(",") === "1,2,0" &&
  dailyForeignKeys.some(
    ({ table, from, to }) => table === "funcionarios" && from === "funcionario_id" && to === "id",
  );

if (!schemaIsCurrent) {
  const legacyDailyColumns = new Set(employeeColumns.map(({ name }) => name));
  const hasLegacyDailyData = legacyDailyColumns.has("Data") && legacyDailyColumns.has("Diaria");

  database.exec("PRAGMA foreign_keys = OFF; BEGIN IMMEDIATE;");
  try {
    database.exec(`
      CREATE TABLE funcionarios_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Nome TEXT NOT NULL CHECK (length(trim(Nome)) > 0),
        Ativo INTEGER NOT NULL DEFAULT 1 CHECK (Ativo IN (0, 1)),
        TipoConta TEXT NOT NULL DEFAULT 'Funcionário'
          CHECK (TipoConta IN ('Funcionário', 'ADM')),
        SenhaHash TEXT,
        PrecisaTrocarSenha INTEGER NOT NULL DEFAULT 1 CHECK (PrecisaTrocarSenha IN (0, 1))
      );
      INSERT INTO funcionarios_new (
        id, Nome, Ativo, TipoConta, SenhaHash, PrecisaTrocarSenha
      ) SELECT id, Nome, Ativo, TipoConta, SenhaHash, PrecisaTrocarSenha FROM funcionarios;

      CREATE TABLE diarias_new (
        funcionario_id INTEGER NOT NULL REFERENCES funcionarios_new(id),
        Data TEXT NOT NULL CHECK (length(Data) = 10),
        Diaria REAL NOT NULL CHECK (Diaria > 0),
        PRIMARY KEY (funcionario_id, Data)
      );
    `);

    const oldDailyTableExists = database.prepare(
      "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'diarias'",
    ).get();
    if (oldDailyTableExists && dailyColumns.some(({ name }) => name === "id")) {
      database.exec(`
        INSERT INTO diarias_new (funcionario_id, Data, Diaria)
          SELECT funcionario_id, Data, Diaria
          FROM diarias
          WHERE 1
          ORDER BY id
          ON CONFLICT (funcionario_id, Data) DO UPDATE SET Diaria = excluded.Diaria;
      `);
    } else if (oldDailyTableExists) {
      database.exec(`
        INSERT INTO diarias_new (funcionario_id, Data, Diaria)
          SELECT funcionario_id, Data, Diaria
          FROM diarias
          WHERE 1
          ON CONFLICT (funcionario_id, Data) DO UPDATE SET Diaria = excluded.Diaria;
      `);
    }

    if (hasLegacyDailyData) {
      database.exec(`
        INSERT INTO diarias_new (funcionario_id, Data, Diaria)
          SELECT id, Data, Diaria
          FROM funcionarios
          WHERE Data IS NOT NULL AND Diaria IS NOT NULL
          ON CONFLICT (funcionario_id, Data) DO UPDATE SET Diaria = excluded.Diaria;
      `);
    }

    database.exec(`
      DROP TABLE diarias;
      DROP TABLE funcionarios;
      ALTER TABLE funcionarios_new RENAME TO funcionarios;
      ALTER TABLE diarias_new RENAME TO diarias;
      COMMIT;
      PRAGMA foreign_keys = ON;
    `);
  } catch (error) {
    if (database.isTransaction) {
      database.exec("ROLLBACK");
    }
    database.exec("PRAGMA foreign_keys = ON");
    throw error;
  }
}

database.exec(`
  CREATE TRIGGER IF NOT EXISTS funcionarios_nome_unico_insert
  BEFORE INSERT ON funcionarios
  WHEN EXISTS (
    SELECT 1 FROM funcionarios
    WHERE normalize_employee_name(Nome) = normalize_employee_name(NEW.Nome)
  )
  BEGIN
    SELECT RAISE(ABORT, 'duplicate employee name');
  END;

  CREATE TRIGGER IF NOT EXISTS funcionarios_nome_unico_update
  BEFORE UPDATE OF Nome ON funcionarios
  WHEN EXISTS (
    SELECT 1 FROM funcionarios
    WHERE id <> NEW.id
      AND normalize_employee_name(Nome) = normalize_employee_name(NEW.Nome)
  )
  BEGIN
    SELECT RAISE(ABORT, 'duplicate employee name');
  END;
`);

const hasLegacyDailyHistoryTable = database.prepare(
  "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'historico_diarias'",
).get();
const hasDailyAuditTable = database.prepare(
  "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'diarias_auditoria'",
).get();
if (hasLegacyDailyHistoryTable && !hasDailyAuditTable) {
  database.exec("ALTER TABLE historico_diarias RENAME TO diarias_auditoria");
}

database.exec(`
  CREATE TABLE IF NOT EXISTS diarias_auditoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    usuario_nome TEXT NOT NULL DEFAULT '',
    funcionario_id INTEGER NOT NULL,
    funcionario_nome TEXT NOT NULL,
    data_diaria TEXT NOT NULL CHECK (length(data_diaria) = 10),
    data_hora TEXT NOT NULL,
    diaria REAL NOT NULL CHECK (diaria > 0),
    diaria_anterior REAL,
    tipo TEXT NOT NULL CHECK (tipo IN ('insert', 'delete', 'update'))
  );
`);

const dailyHistoryColumns = database.prepare("PRAGMA table_info(diarias_auditoria)")
  .all() as Array<{ name: string }>;
if (!dailyHistoryColumns.some(({ name }) => name === "usuario_nome")) {
  database.exec("ALTER TABLE diarias_auditoria ADD COLUMN usuario_nome TEXT NOT NULL DEFAULT ''");
}
if (!dailyHistoryColumns.some(({ name }) => name === "diaria_anterior")) {
  database.exec("ALTER TABLE diarias_auditoria ADD COLUMN diaria_anterior REAL");
}
database.exec(`
  UPDATE diarias_auditoria
  SET usuario_nome = COALESCE(
    (SELECT Nome FROM funcionarios WHERE funcionarios.id = diarias_auditoria.usuario_id),
    'Usuário #' || usuario_id
  )
  WHERE usuario_nome = '';
`);

database.exec(`
  DROP TRIGGER IF EXISTS historico_diarias_after_insert;
  DROP TRIGGER IF EXISTS historico_diarias_after_update;
  DROP TRIGGER IF EXISTS historico_diarias_after_delete;
  DROP TRIGGER IF EXISTS diarias_auditoria_after_insert;
  DROP TRIGGER IF EXISTS diarias_auditoria_after_update;
  DROP TRIGGER IF EXISTS diarias_auditoria_after_delete;

  CREATE TRIGGER diarias_auditoria_after_insert
  AFTER INSERT ON diarias
  BEGIN
    INSERT INTO diarias_auditoria (
      usuario_id, usuario_nome, funcionario_id, funcionario_nome, data_diaria,
      data_hora, diaria, diaria_anterior, tipo
    )
    VALUES (
      daily_audit_user_id(),
      daily_audit_user_name(),
      NEW.funcionario_id,
      COALESCE(
        (SELECT Nome FROM funcionarios WHERE id = NEW.funcionario_id),
        'Funcionário removido #' || NEW.funcionario_id
      ),
      NEW.Data,
      strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
      NEW.Diaria,
      NULL,
      'insert'
    );
  END;

  CREATE TRIGGER diarias_auditoria_after_update
  AFTER UPDATE ON diarias
  WHEN OLD.funcionario_id IS NOT NEW.funcionario_id
    OR OLD.Data IS NOT NEW.Data
    OR OLD.Diaria IS NOT NEW.Diaria
  BEGIN
    INSERT INTO diarias_auditoria (
      usuario_id, usuario_nome, funcionario_id, funcionario_nome, data_diaria,
      data_hora, diaria, diaria_anterior, tipo
    )
    VALUES (
      daily_audit_user_id(),
      daily_audit_user_name(),
      NEW.funcionario_id,
      COALESCE(
        (SELECT Nome FROM funcionarios WHERE id = NEW.funcionario_id),
        'Funcionário removido #' || NEW.funcionario_id
      ),
      NEW.Data,
      strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
      NEW.Diaria,
      OLD.Diaria,
      'update'
    );
  END;

  CREATE TRIGGER diarias_auditoria_after_delete
  AFTER DELETE ON diarias
  BEGIN
    INSERT INTO diarias_auditoria (
      usuario_id, usuario_nome, funcionario_id, funcionario_nome, data_diaria,
      data_hora, diaria, diaria_anterior, tipo
    )
    VALUES (
      daily_audit_user_id(),
      daily_audit_user_name(),
      OLD.funcionario_id,
      COALESCE(
        (SELECT Nome FROM funcionarios WHERE id = OLD.funcionario_id),
        'Funcionário removido #' || OLD.funcionario_id
      ),
      OLD.Data,
      strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
      OLD.Diaria,
      OLD.Diaria,
      'delete'
    );
  END;
`);

export function withDailyAuditUser<T>(usuarioId: number, operation: () => T): T {
  const user = database.prepare(
    "SELECT Nome FROM funcionarios WHERE id = ?",
  ).get(usuarioId) as { Nome: string } | undefined;
  if (!user) {
    throw new Error("Não foi possível identificar o usuário que modificou a diária.");
  }

  dailyAuditUser = { id: usuarioId, name: user.Nome };
  try {
    return operation();
  } finally {
    dailyAuditUser = null;
  }
}
