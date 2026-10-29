import { DatabaseSync } from "node:sqlite";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { appendFileSync, mkdirSync } from "node:fs";
import { TLSSocket } from "node:tls";
import { fileURLToPath } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

const database = new DatabaseSync(
  process.env.OBRA_DATABASE_PATH ??
    fileURLToPath(new URL("./database/cadastro.db", import.meta.url)),
);
const normalizeEmployeeName = (name: unknown) => {
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
const auditLogDirectory = fileURLToPath(new URL("./logs/", import.meta.url));
const auditLogPath = fileURLToPath(new URL("./logs/auditoria.txt", import.meta.url));

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

database.exec(`
  CREATE TABLE IF NOT EXISTS historico_diarias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    funcionario_id INTEGER NOT NULL,
    funcionario_nome TEXT NOT NULL,
    data_diaria TEXT NOT NULL CHECK (length(data_diaria) = 10),
    data_hora TEXT NOT NULL,
    diaria REAL NOT NULL CHECK (diaria > 0),
    tipo TEXT NOT NULL CHECK (tipo IN ('insert', 'delete', 'update'))
  );
`);

function recordDailyHistory(
  usuarioId: number,
  funcionarioId: number,
  funcionarioNome: string,
  date: string,
  amount: number,
  type: "insert" | "delete" | "update",
): void {
  database.prepare(`
    INSERT INTO historico_diarias (
      usuario_id, funcionario_id, funcionario_nome, data_diaria, data_hora, diaria, tipo
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    usuarioId,
    funcionarioId,
    funcionarioNome,
    date,
    new Date().toISOString(),
    amount,
    type,
  );
}

function readBody(
  request: IncomingMessage,
  response: ServerResponse,
  onBody: (body: unknown) => void,
): void {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk: string) => {
      body += chunk;
      if (body.length > 10_000) {
        response.writeHead(413, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Requisição muito grande." }));
        request.destroy();
      }
    });

    request.on("end", () => {
      if (response.writableEnded) return;

      try {
        onBody(JSON.parse(body) as unknown);
      } catch {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Dados inválidos." }));
      }
    });

    request.on("error", (error) => {
      console.error("Erro ao receber os dados da requisição.", error);
      if (!response.writableEnded) {
        sendJson(response, 400, { error: "Não foi possível receber os dados." });
      }
    });
}

function sendJson(response: ServerResponse, status: number, data: unknown): void {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(data));
}

type AuthSession = {
  funcionarioId: number;
  expiresAt: number;
  precisaTrocarSenha: boolean;
};

const sessionDurationMs = 12 * 60 * 60 * 1000;
const sessions = new Map<string, AuthSession>();
const setupToken = randomBytes(32).toString("hex");

function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [saltHex, hashHex] = storedHash.split(":");
  if (!saltHex || !hashHex || !/^[a-f\d]+$/i.test(saltHex) || !/^[a-f\d]+$/i.test(hashHex)) {
    return false;
  }
  const salt = Buffer.from(saltHex, "hex");
  const expectedHash = Buffer.from(hashHex, "hex");
  if (salt.length !== 16 || expectedHash.length !== 64) return false;
  return timingSafeEqual(scryptSync(password, salt, expectedHash.length), expectedHash);
}

function constantTimeStringEqual(first: string, second: string): boolean {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);
  return firstBuffer.length === secondBuffer.length && timingSafeEqual(firstBuffer, secondBuffer);
}

function getSessionToken(request: IncomingMessage): string | undefined {
  const cookie = request.headers.cookie?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("obra_session="));
  return cookie?.slice("obra_session=".length);
}

function getSession(request: IncomingMessage): { token: string; session: AuthSession } | undefined {
  const token = getSessionToken(request);
  if (!token) return undefined;
  const session = sessions.get(token);
  if (!session) return undefined;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return undefined;
  }
  return { token, session };
}

function setSessionCookie(
  request: IncomingMessage,
  response: ServerResponse,
  token: string,
): void {
  const secure = request.socket instanceof TLSSocket ? "; Secure" : "";
  response.setHeader(
    "Set-Cookie",
    `obra_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${sessionDurationMs / 1000}${secure}`,
  );
}

function clearSessionCookie(request: IncomingMessage, response: ServerResponse): void {
  const secure = request.socket instanceof TLSSocket ? "; Secure" : "";
  response.setHeader("Set-Cookie", `obra_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`);
}

function isSetupAvailable(): boolean {
  const employeeCount = database.prepare(
    "SELECT COUNT(*) AS count FROM funcionarios",
  ).get() as { count: number };
  if (employeeCount.count === 0) return true;
  const pendingCount = database.prepare(
    "SELECT COUNT(*) AS count FROM funcionarios WHERE Ativo = 1 AND SenhaHash IS NULL",
  ).get() as { count: number };
  return pendingCount.count > 0;
}

function logSetupToken(): void {
  if (isSetupAvailable()) {
    console.info(`Token de configuração inicial do sistema: ${setupToken}`);
  }
}

function recordAdminAction(
  request: IncomingMessage,
  response: ServerResponse,
  funcionarioId: number,
  nome: string,
): void {
  response.once("finish", () => {
    const path = request.url?.split("?")[0] ?? "/";
    const action = `${request.method ?? "UNKNOWN"} ${path}`;
    const result = response.statusCode < 400 ? "sucesso" : "falha";
    const entry =
      `[${new Date().toISOString()}] ADM id=${funcionarioId} nome=${JSON.stringify(nome)} ` +
      `acao=${JSON.stringify(action)} status=${response.statusCode} resultado=${result}\n`;

    try {
      mkdirSync(auditLogDirectory, { recursive: true });
      appendFileSync(auditLogPath, entry, "utf8");
    } catch (error) {
      console.error("Não foi possível registrar uma ação administrativa.", error);
    }
  });
}

export function employeeApi(): Plugin {
  const auditAdminActions = (
    request: IncomingMessage,
    response: ServerResponse,
    next: (error?: Error) => void,
  ) => {
    if (!request.url?.startsWith("/api/")) {
      next();
      return;
    }

    const current = getSession(request);
    if (current) {
      const employee = database.prepare(
        "SELECT id, Nome, TipoConta FROM funcionarios WHERE id = ? AND Ativo = 1",
      ).get(current.session.funcionarioId) as
        | { id: number; Nome: string; TipoConta: "Funcionário" | "ADM" }
        | undefined;
      if (employee?.TipoConta === "ADM") {
        recordAdminAction(request, response, employee.id, employee.Nome);
      }
    }
    next();
  };

  const authHandler = (
    request: IncomingMessage,
    response: ServerResponse,
    next: (error?: Error) => void,
  ) => {
    const path = request.url?.split("?")[0] ?? "";
    if (!path.startsWith("/api/auth/")) {
      next();
      return;
    }

    if (path === "/api/auth/status" && request.method === "GET") {
      sendJson(response, 200, { setupAvailable: isSetupAvailable() });
      return;
    }

    if (path === "/api/auth/session" && request.method === "GET") {
      const current = getSession(request);
      if (!current) {
        clearSessionCookie(request, response);
        sendJson(response, 401, { error: "Sessão não encontrada." });
        return;
      }
      const employee = database.prepare(
        "SELECT Nome, TipoConta FROM funcionarios WHERE id = ? AND Ativo = 1",
      ).get(current.session.funcionarioId) as
        | { Nome: string; TipoConta: "Funcionário" | "ADM" }
        | undefined;
      if (!employee) {
        sessions.delete(current.token);
        clearSessionCookie(request, response);
        sendJson(response, 401, { error: "Sessão não encontrada." });
        return;
      }
      sendJson(response, 200, {
        id: current.session.funcionarioId,
        funcionario: employee.Nome,
        TipoConta: employee.TipoConta,
        precisaTrocarSenha: current.session.precisaTrocarSenha,
      });
      return;
    }

    if (path === "/api/auth/login" && request.method === "POST") {
      readBody(request, response, (body) => {
        const record = body as { login?: unknown; senha?: unknown } | null;
        if (
          typeof record?.login !== "string" ||
          typeof record.senha !== "string" ||
          record.login.trim().length === 0 ||
          record.login.trim().length > 150 ||
          record.senha.length === 0 ||
          record.senha.length > 256
        ) {
          sendJson(response, 400, { error: "Informe o login e a senha." });
          return;
        }

        try {
          const normalizedLogin = record.login.trim().normalize("NFC").toLocaleLowerCase("pt-BR");
          const employees = database.prepare(
            "SELECT id, Nome, TipoConta, SenhaHash, PrecisaTrocarSenha FROM funcionarios WHERE Ativo = 1",
          ).all() as Array<{
            id: number;
            Nome: string;
            TipoConta: "Funcionário" | "ADM";
            SenhaHash: string | null;
            PrecisaTrocarSenha: number;
          }>;
          const matchingEmployees = employees.filter(({ Nome, SenhaHash }) =>
            SenhaHash !== null &&
            Nome.normalize("NFC").toLocaleLowerCase("pt-BR") === normalizedLogin,
          );
          const matches = matchingEmployees.filter(({ SenhaHash }) =>
            SenhaHash !== null && verifyPassword(record.senha as string, SenhaHash),
          );
          if (matches.length !== 1) {
            sendJson(response, 401, { error: "Login ou senha inválidos." });
            return;
          }

          const employee = matches[0];
          if (employee.TipoConta === "ADM") {
            recordAdminAction(request, response, employee.id, employee.Nome);
          }
          const token = randomBytes(32).toString("hex");
          const precisaTrocarSenha = employee.PrecisaTrocarSenha === 1;
          sessions.set(token, {
            funcionarioId: employee.id,
            expiresAt: Date.now() + sessionDurationMs,
            precisaTrocarSenha,
          });
          setSessionCookie(request, response, token);
          sendJson(response, 200, {
            id: employee.id,
            funcionario: employee.Nome,
            TipoConta: employee.TipoConta,
            precisaTrocarSenha,
          });
        } catch (error) {
          console.error("Não foi possível autenticar o funcionário.", error);
          sendJson(response, 500, { error: "Não foi possível realizar o login." });
        }
      });
      return;
    }

    if (path === "/api/auth/setup" && (request.method === "GET" || request.method === "POST")) {
      const providedToken = request.headers["x-setup-token"];
      if (
        typeof providedToken !== "string" ||
        !constantTimeStringEqual(providedToken, setupToken) ||
        !isSetupAvailable()
      ) {
        sendJson(response, 403, { error: "Token inválido ou configuração já concluída." });
        return;
      }

      if (request.method === "GET") {
        const employees = database.prepare(
          "SELECT id, Nome FROM funcionarios WHERE Ativo = 1 AND SenhaHash IS NULL AND TipoConta <> 'ADM' ORDER BY Nome COLLATE NOCASE",
        ).all();
        const employeeCount = database.prepare(
          "SELECT COUNT(*) AS count FROM funcionarios",
        ).get() as { count: number };
        sendJson(response, 200, {
          funcionarios: employees,
          primeiroAcesso: employeeCount.count === 0,
        });
        return;
      }

      readBody(request, response, (body) => {
        const record = body as {
          funcionarioId?: unknown;
          Nome?: unknown;
          senhaTemporaria?: unknown;
        } | null;
        if (
          typeof record?.senhaTemporaria !== "string" ||
          record.senhaTemporaria.length < 8 ||
          record.senhaTemporaria.length > 256
        ) {
          sendJson(response, 400, { error: "A senha temporária deve ter entre 8 e 256 caracteres." });
          return;
        }

        try {
          const employeeCount = database.prepare(
            "SELECT COUNT(*) AS count FROM funcionarios",
          ).get() as { count: number };
          if (employeeCount.count === 0) {
            if (
              typeof record.Nome !== "string" ||
              !record.Nome.trim() ||
              record.Nome.trim().length > 150
            ) {
              sendJson(response, 400, { error: "Informe um nome com até 150 caracteres." });
              return;
            }
            database.prepare(
              "INSERT INTO funcionarios (Nome, SenhaHash, PrecisaTrocarSenha) VALUES (?, ?, 1)",
            ).run(record.Nome.trim(), hashPassword(record.senhaTemporaria));
          } else {
            if (
              typeof record.funcionarioId !== "number" ||
              !Number.isSafeInteger(record.funcionarioId) ||
              record.funcionarioId <= 0
            ) {
              sendJson(response, 400, { error: "Selecione um funcionário válido." });
              return;
            }
            const result = database.prepare(`
              UPDATE funcionarios
              SET SenhaHash = ?, PrecisaTrocarSenha = 1
              WHERE id = ? AND Ativo = 1 AND SenhaHash IS NULL
            `).run(hashPassword(record.senhaTemporaria), record.funcionarioId);
            if (result.changes === 0) {
              sendJson(response, 404, { error: "Funcionário não encontrado ou já configurado." });
              return;
            }
          }
          const remaining = database.prepare(
            "SELECT COUNT(*) AS count FROM funcionarios WHERE Ativo = 1 AND SenhaHash IS NULL",
          ).get() as { count: number };
          sendJson(response, 200, { restantes: remaining.count });
        } catch (error) {
          console.error("Não foi possível configurar o acesso do funcionário.", error);
          sendJson(response, 500, { error: "Não foi possível configurar o acesso do funcionário." });
        }
      });
      return;
    }

    if (path === "/api/auth/password" && request.method === "POST") {
      const current = getSession(request);
      if (!current || !current.session.precisaTrocarSenha) {
        sendJson(response, 403, { error: "Não há troca de senha pendente." });
        return;
      }
      readBody(request, response, (body) => {
        const record = body as { novaSenha?: unknown } | null;
        if (
          typeof record?.novaSenha !== "string" ||
          record.novaSenha.length < 8 ||
          record.novaSenha.length > 256
        ) {
          sendJson(response, 400, { error: "A nova senha deve ter entre 8 e 256 caracteres." });
          return;
        }
        try {
          const result = database.prepare(
            "UPDATE funcionarios SET SenhaHash = ?, PrecisaTrocarSenha = 0 WHERE id = ? AND Ativo = 1",
          ).run(hashPassword(record.novaSenha), current.session.funcionarioId);
          if (result.changes === 0) {
            sessions.delete(current.token);
            clearSessionCookie(request, response);
            sendJson(response, 401, { error: "Funcionário não encontrado ou desativado." });
            return;
          }
          current.session.precisaTrocarSenha = false;
          sendJson(response, 200, { message: "Senha atualizada com sucesso." });
        } catch (error) {
          console.error("Não foi possível atualizar a senha do funcionário.", error);
          sendJson(response, 500, { error: "Não foi possível atualizar a senha." });
        }
      });
      return;
    }

    if (path === "/api/auth/logout" && request.method === "POST") {
      const current = getSession(request);
      if (current) sessions.delete(current.token);
      clearSessionCookie(request, response);
      sendJson(response, 200, { message: "Sessão encerrada." });
      return;
    }

    response.writeHead(405, { Allow: "GET, POST", "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Método não permitido." }));
  };

  const authGuard = (
    request: IncomingMessage,
    response: ServerResponse,
    next: (error?: Error) => void,
  ) => {
    if (!request.url?.startsWith("/api/") || request.url.startsWith("/api/auth/")) {
      next();
      return;
    }
    const current = getSession(request);
    if (!current) {
      sendJson(response, 401, { error: "Faça login para continuar." });
      return;
    }
    if (current.session.precisaTrocarSenha) {
      sendJson(response, 403, { error: "Cadastre uma nova senha para continuar." });
      return;
    }
    const employee = database.prepare(
      "SELECT TipoConta FROM funcionarios WHERE id = ? AND Ativo = 1",
    ).get(current.session.funcionarioId) as { TipoConta: "Funcionário" | "ADM" } | undefined;
    if (!employee) {
      sessions.delete(current.token);
      clearSessionCookie(request, response);
      sendJson(response, 401, { error: "Funcionário não encontrado ou desativado." });
      return;
    }
    const path = request.url?.split("?")[0] ?? "";
    const isDailyAccess =
      path === "/api/diarias" ||
      (path === "/api/funcionarios" && request.method === "GET");
    if (employee.TipoConta === "Funcionário" && !isDailyAccess) {
      sendJson(response, 403, { error: "Sua conta não tem acesso a esta funcionalidade." });
      return;
    }
    next();
  };

  const employeesHandler = (
    request: IncomingMessage,
    response: ServerResponse,
  ) => {
    if (request.method === "GET") {
      try {
        const funcionarios = database
          .prepare("SELECT id, Nome, Ativo FROM funcionarios WHERE Ativo = 1 AND TipoConta <> 'ADM' ORDER BY Nome COLLATE NOCASE")
          .all();
        sendJson(response, 200, { funcionarios });
      } catch (error) {
        console.error("Não foi possível carregar os funcionários.", error);
        sendJson(response, 500, { error: "Não foi possível carregar os funcionários." });
      }
      return;
    }

    if (request.method !== "POST") {
      response.writeHead(405, { Allow: "GET, POST", "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Método não permitido." }));
      return;
    }

    readBody(request, response, (body) => {
      const employeeRecord = body as {
        Nome?: unknown;
        senhaTemporaria?: unknown;
      } | null;
      const employeeName = employeeRecord?.Nome;
      if (
        typeof employeeName !== "string" ||
        !employeeName.trim() ||
        employeeName.trim().length > 150
      ) {
        sendJson(response, 400, { error: "Informe um nome com até 150 caracteres." });
        return;
      }
      if (
        typeof employeeRecord?.senhaTemporaria !== "string" ||
        employeeRecord.senhaTemporaria.length < 8 ||
        employeeRecord.senhaTemporaria.length > 256
      ) {
        sendJson(response, 400, { error: "A senha temporária deve ter entre 8 e 256 caracteres." });
        return;
      }

      try {
        const name = employeeName.trim();
        const normalizedName = normalizeEmployeeName(name);
        const duplicate = (database.prepare("SELECT Nome FROM funcionarios").all() as Array<{
          Nome: string;
        }>).find(
          ({ Nome }) => normalizeEmployeeName(Nome) === normalizedName,
        );
        if (duplicate) {
          sendJson(response, 409, {
            duplicate: true,
            error: `O usuário "${duplicate.Nome}" já existe.`,
          });
          return;
        }

        database.prepare(`
          INSERT INTO funcionarios (Nome, SenhaHash, PrecisaTrocarSenha)
          VALUES (?, ?, 1)
        `).run(name, hashPassword(employeeRecord.senhaTemporaria));
        sendJson(response, 201, { Nome: name });
      } catch (error) {
        if (error instanceof Error && error.message === "duplicate employee name") {
          sendJson(response, 409, {
            duplicate: true,
            error: "Este nome de usuário já está cadastrado.",
          });
          return;
        }
        console.error("Não foi possível salvar o funcionário no banco de dados.", error);
        sendJson(response, 500, { error: "Não foi possível salvar o funcionário." });
      }
    });
  };

  const deactivateEmployeeHandler = (
    request: IncomingMessage,
    response: ServerResponse,
  ) => {
    if (request.method === "GET") {
      try {
        const funcionarios = database.prepare(
          "SELECT id, Nome, Ativo FROM funcionarios ORDER BY Nome COLLATE NOCASE",
        ).all();
        sendJson(response, 200, { funcionarios });
      } catch (error) {
        console.error("Não foi possível carregar os funcionários para desativação.", error);
        sendJson(response, 500, { error: "Não foi possível carregar os funcionários." });
      }
      return;
    }

    if (request.method !== "POST") {
      response.writeHead(405, { Allow: "GET, POST", "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Método não permitido." }));
      return;
    }

    readBody(request, response, (body) => {
      const record = body as { funcionarioId?: unknown } | null;
      const funcionarioId = record?.funcionarioId;
      if (
        typeof funcionarioId !== "number" ||
        !Number.isSafeInteger(funcionarioId) ||
        funcionarioId <= 0
      ) {
        sendJson(response, 400, { error: "Selecione um funcionário válido." });
        return;
      }

      try {
        const result = database.prepare(
          "UPDATE funcionarios SET Ativo = 0 WHERE id = ? AND Ativo = 1",
        ).run(funcionarioId);
        if (result.changes === 0) {
          sendJson(response, 404, { error: "Funcionário não encontrado ou já desativado." });
          return;
        }
        sendJson(response, 200, { message: "Funcionário desativado com sucesso." });
      } catch (error) {
        console.error("Não foi possível desativar o funcionário.", error);
        sendJson(response, 500, { error: "Não foi possível desativar o funcionário." });
      }
    });
  };

  const deleteEmployeeHandler = (
    request: IncomingMessage,
    response: ServerResponse,
  ) => {
    if (request.method === "GET") {
      try {
        const funcionarios = database.prepare(
          "SELECT id, Nome, Ativo, TipoConta FROM funcionarios ORDER BY Nome COLLATE NOCASE",
        ).all();
        sendJson(response, 200, { funcionarios });
      } catch (error) {
        console.error("Não foi possível carregar os funcionários para exclusão.", error);
        sendJson(response, 500, { error: "Não foi possível carregar os funcionários." });
      }
      return;
    }

    if (request.method !== "POST") {
      response.writeHead(405, { Allow: "GET, POST", "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Método não permitido." }));
      return;
    }

    readBody(request, response, (body) => {
      const record = body as { funcionarioId?: unknown } | null;
      const funcionarioId = record?.funcionarioId;
      if (
        typeof funcionarioId !== "number" ||
        !Number.isSafeInteger(funcionarioId) ||
        funcionarioId <= 0
      ) {
        sendJson(response, 400, { error: "Selecione um funcionário válido." });
        return;
      }

      const current = getSession(request);
      if (!current) {
        sendJson(response, 401, { error: "Faça login para continuar." });
        return;
      }
      if (current?.session.funcionarioId === funcionarioId) {
        sendJson(response, 400, { error: "Não é possível deletar a própria conta." });
        return;
      }

      try {
        database.exec("BEGIN IMMEDIATE");
        const employee = database.prepare(
          "SELECT id, Nome FROM funcionarios WHERE id = ?",
        ).get(funcionarioId) as { id: number; Nome: string } | undefined;
        if (!employee) {
          database.exec("ROLLBACK");
          sendJson(response, 404, { error: "Funcionário não encontrado." });
          return;
        }

        const dailyRecords = database.prepare(
          'SELECT "Data", "Diaria" FROM diarias WHERE funcionario_id = ?',
        ).all(funcionarioId) as Array<{ Data: string; Diaria: number }>;
        for (const daily of dailyRecords) {
          recordDailyHistory(
            current.session.funcionarioId,
            funcionarioId,
            employee.Nome,
            daily.Data,
            daily.Diaria,
            "delete",
          );
        }
        database.prepare("DELETE FROM diarias WHERE funcionario_id = ?").run(funcionarioId);
        database.prepare("DELETE FROM funcionarios WHERE id = ?").run(funcionarioId);
        database.exec("COMMIT");

        for (const [token, session] of sessions) {
          if (session.funcionarioId === funcionarioId) sessions.delete(token);
        }
        sendJson(response, 200, { message: "Funcionário e todos os seus dados foram deletados." });
      } catch (error) {
        if (database.isTransaction) database.exec("ROLLBACK");
        console.error("Não foi possível deletar o funcionário.", error);
        sendJson(response, 500, { error: "Não foi possível deletar o funcionário." });
      }
    });
  };

  const accountTypeHandler = (
    request: IncomingMessage,
    response: ServerResponse,
  ) => {
    if (request.method === "GET") {
      try {
        const funcionarios = database.prepare(
          "SELECT id, Nome, Ativo, TipoConta FROM funcionarios ORDER BY Nome COLLATE NOCASE",
        ).all();
        sendJson(response, 200, { funcionarios });
      } catch (error) {
        console.error("Não foi possível carregar os tipos de conta.", error);
        sendJson(response, 500, { error: "Não foi possível carregar os tipos de conta." });
      }
      return;
    }

    if (request.method !== "POST") {
      response.writeHead(405, { Allow: "GET, POST", "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Método não permitido." }));
      return;
    }

    readBody(request, response, (body) => {
      const record = body as { funcionarioId?: unknown; tipoConta?: unknown } | null;
      const funcionarioId = record?.funcionarioId;
      const tipoConta = record?.tipoConta;
      if (
        typeof funcionarioId !== "number" ||
        !Number.isSafeInteger(funcionarioId) ||
        funcionarioId <= 0 ||
        (tipoConta !== "Funcionário" && tipoConta !== "ADM")
      ) {
        sendJson(response, 400, { error: "Selecione um funcionário e um tipo de conta válido." });
        return;
      }

      try {
        const result = database.prepare(
          "UPDATE funcionarios SET TipoConta = ? WHERE id = ? AND Ativo = 1",
        ).run(tipoConta, funcionarioId);
        if (result.changes === 0) {
          sendJson(response, 404, { error: "Funcionário não encontrado ou desativado." });
          return;
        }
        sendJson(response, 200, { message: "Tipo de conta atribuído com sucesso." });
      } catch (error) {
        console.error("Não foi possível atribuir o tipo de conta.", error);
        sendJson(response, 500, { error: "Não foi possível atribuir o tipo de conta." });
      }
    });
  };

  const dailyHandler = (
    request: IncomingMessage,
    response: ServerResponse,
  ) => {
    const current = getSession(request);
    if (!current) {
      sendJson(response, 401, { error: "Faça login para continuar." });
      return;
    }

    if (request.method !== "POST") {
      response.writeHead(405, { Allow: "POST", "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Método não permitido." }));
      return;
    }

    readBody(request, response, (body) => {
      const record = body as { funcionarioId?: unknown; data?: unknown; diaria?: unknown } | null;
      const funcionarioId = record?.funcionarioId;
      const date = record?.data;
      const amount = record?.diaria;
      if (
        typeof funcionarioId !== "number" ||
        !Number.isSafeInteger(funcionarioId) ||
        funcionarioId <= 0 ||
        typeof date !== "string" ||
        !isValidDate(date) ||
        date > getTodayLocalDate() ||
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        sendJson(response, 400, {
          error: "Informe funcionário, data até hoje e diária maior que zero.",
        });
        return;
      }
      if (funcionarioId !== current.session.funcionarioId) {
        sendJson(response, 403, { error: "Só é permitido lançar diária para a sua própria conta." });
        return;
      }

      try {
        const employee = database.prepare(
          "SELECT id, Nome FROM funcionarios WHERE id = ? AND Ativo = 1",
        ).get(funcionarioId) as { id: number; Nome: string } | undefined;
        if (!employee) {
          sendJson(response, 400, { error: "O funcionário selecionado não está ativo." });
          return;
        }

        database.exec("BEGIN IMMEDIATE");
        const existingDaily = database.prepare(
          'SELECT "Diaria" FROM diarias WHERE funcionario_id = ? AND "Data" = ?',
        ).get(funcionarioId, date) as { Diaria: number } | undefined;
        if (existingDaily) {
          database.prepare(
            'UPDATE diarias SET "Diaria" = ? WHERE funcionario_id = ? AND "Data" = ?',
          ).run(amount, funcionarioId, date);
        } else {
          database.prepare(
            'INSERT INTO diarias (funcionario_id, "Data", "Diaria") VALUES (?, ?, ?)',
          ).run(funcionarioId, date, amount);
        }
        recordDailyHistory(
          current.session.funcionarioId,
          funcionarioId,
          employee.Nome,
          date,
          amount,
          existingDaily ? "update" : "insert",
        );
        database.exec("COMMIT");
        sendJson(response, 200, { message: "Diária salva com sucesso." });
      } catch (error) {
        if (database.isTransaction) database.exec("ROLLBACK");
        console.error("Não foi possível salvar a diária no banco de dados.", error);
        sendJson(response, 500, { error: "Não foi possível salvar a diária." });
      }
    });
  };

  const deleteDailyHandler = (
    request: IncomingMessage,
    response: ServerResponse,
  ) => {
    const current = getSession(request);
    if (!current) {
      sendJson(response, 401, { error: "Faça login para continuar." });
      return;
    }

    if (request.method !== "POST") {
      response.writeHead(405, { Allow: "POST", "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Método não permitido." }));
      return;
    }

    readBody(request, response, (body) => {
      const record = body as { funcionarioId?: unknown; data?: unknown } | null;
      const funcionarioId = record?.funcionarioId;
      const date = record?.data;
      if (
        typeof funcionarioId !== "number" ||
        !Number.isSafeInteger(funcionarioId) ||
        funcionarioId <= 0 ||
        typeof date !== "string" ||
        !isValidDate(date) ||
        date > getTodayLocalDate()
      ) {
        sendJson(response, 400, { error: "Informe funcionário e uma data até hoje." });
        return;
      }

      try {
        database.exec("BEGIN IMMEDIATE");
        const daily = database.prepare(`
          SELECT diarias."Diaria", funcionarios.Nome
          FROM diarias
          JOIN funcionarios ON funcionarios.id = diarias.funcionario_id
          WHERE diarias.funcionario_id = ? AND diarias."Data" = ?
        `).get(funcionarioId, date) as { Diaria: number; Nome: string } | undefined;
        if (!daily) {
          database.exec("ROLLBACK");
          sendJson(response, 404, { error: "Não há dados para esse funcionário e essa data." });
          return;
        }
        database.prepare(
          'DELETE FROM diarias WHERE funcionario_id = ? AND "Data" = ?',
        ).run(funcionarioId, date);
        recordDailyHistory(
          current.session.funcionarioId,
          funcionarioId,
          daily.Nome,
          date,
          daily.Diaria,
          "delete",
        );
        database.exec("COMMIT");
        sendJson(response, 200, { message: "Data e diária excluídas com sucesso." });
      } catch (error) {
        if (database.isTransaction) database.exec("ROLLBACK");
        console.error("Não foi possível excluir os dados da diária.", error);
        sendJson(response, 500, { error: "Não foi possível excluir os dados." });
      }
    });
  };

  const dailyHistoryHandler = (
    request: IncomingMessage,
    response: ServerResponse,
  ) => {
    if (request.method !== "GET") {
      response.writeHead(405, { Allow: "GET", "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Método não permitido." }));
      return;
    }

    const current = getSession(request);
    if (!current) {
      sendJson(response, 401, { error: "Faça login para continuar." });
      return;
    }
    const employee = database.prepare(
      "SELECT TipoConta FROM funcionarios WHERE id = ? AND Ativo = 1",
    ).get(current.session.funcionarioId) as { TipoConta: "Funcionário" | "ADM" } | undefined;
    if (employee?.TipoConta !== "ADM") {
      sendJson(response, 403, { error: "Sua conta não tem acesso ao histórico de diárias." });
      return;
    }

    try {
      const alteracoes = database.prepare(`
        SELECT id, usuario_id AS usuarioId, funcionario_id AS funcionarioId,
          funcionario_nome AS funcionarioNome, data_diaria AS dataDiaria,
          data_hora AS dataHora, diaria, tipo
        FROM historico_diarias
        ORDER BY data_hora DESC, id DESC
      `).all();
      sendJson(response, 200, { alteracoes });
    } catch (error) {
      console.error("Não foi possível carregar o histórico de diárias.", error);
      sendJson(response, 500, { error: "Não foi possível carregar o histórico de diárias." });
    }
  };

  const searchHandler = (
    request: IncomingMessage,
    response: ServerResponse,
  ) => {
    if (request.method !== "POST") {
      response.writeHead(405, { Allow: "POST", "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Método não permitido." }));
      return;
    }

    readBody(request, response, (body) => {
      const record = body as {
        funcionarioIds?: unknown;
        funcionarioId?: unknown;
        dataInicial?: unknown;
        dataFinal?: unknown;
      } | null;
      const funcionarioIds = Array.isArray(record?.funcionarioIds)
        ? record.funcionarioIds
        : typeof record?.funcionarioId === "number"
          ? [record.funcionarioId]
          : [];
      const startDate = record?.dataInicial === undefined ? "" : record.dataInicial;
      const endDate = record?.dataFinal === undefined ? "" : record.dataFinal;
      const hasDateRange = startDate !== "" || endDate !== "";
      const today = getTodayLocalDate();
      if (
        funcionarioIds.length === 0 ||
        funcionarioIds.some((id) =>
          typeof id !== "number" || !Number.isSafeInteger(id) || id <= 0
        ) ||
        new Set(funcionarioIds).size !== funcionarioIds.length ||
        (startDate !== undefined && typeof startDate !== "string") ||
        (endDate !== undefined && typeof endDate !== "string") ||
        (hasDateRange &&
          (typeof startDate !== "string" ||
            typeof endDate !== "string" ||
            !isValidDate(startDate) ||
            !isValidDate(endDate) ||
            startDate > today ||
            endDate > today ||
            startDate > endDate))
      ) {
        sendJson(response, 400, {
          error: "Selecione funcionários e informe um período válido, com as datas até hoje.",
        });
        return;
      }

      try {
        const placeholders = funcionarioIds.map(() => "?").join(", ");
        const registros = hasDateRange
          ? database.prepare(`
          SELECT funcionarios.Nome, diarias."Data", diarias."Diaria"
          FROM diarias
          JOIN funcionarios ON funcionarios.id = diarias.funcionario_id
          WHERE funcionarios.id IN (${placeholders})
            AND funcionarios.Ativo = 1
            AND diarias."Data" BETWEEN ? AND ?
          ORDER BY funcionarios.Nome COLLATE NOCASE, diarias."Data"
        `).all(...funcionarioIds, startDate, endDate)
          : database.prepare(`
          SELECT funcionarios.Nome, diarias."Data", diarias."Diaria"
          FROM funcionarios
          LEFT JOIN diarias
            ON diarias.funcionario_id = funcionarios.id
            AND diarias."Data" <= ?
          WHERE funcionarios.id IN (${placeholders})
            AND funcionarios.Ativo = 1
          ORDER BY funcionarios.Nome COLLATE NOCASE, diarias."Data"
        `).all(today, ...funcionarioIds);
        sendJson(response, 200, { registros });
      } catch (error) {
        console.error("Não foi possível pesquisar os dados do funcionário.", error);
        sendJson(response, 500, { error: "Não foi possível pesquisar os dados." });
      }
    });
  };

  function isValidDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function getTodayLocalDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return {
    name: "employee-sqlite-api",
    configureServer(server) {
      logSetupToken();
      server.middlewares.use(auditAdminActions);
      server.middlewares.use(authHandler);
      server.middlewares.use(authGuard);
      server.middlewares.use("/api/funcionarios/tipo-conta", accountTypeHandler);
      server.middlewares.use("/api/funcionarios/excluir", deleteEmployeeHandler);
      server.middlewares.use("/api/funcionarios/desativar", deactivateEmployeeHandler);
      server.middlewares.use("/api/funcionarios", employeesHandler);
      server.middlewares.use("/api/diarias/excluir", deleteDailyHandler);
      server.middlewares.use("/api/diarias/historico", dailyHistoryHandler);
      server.middlewares.use("/api/diarias", dailyHandler);
      server.middlewares.use("/api/pesquisa", searchHandler);
    },
    configurePreviewServer(server) {
      logSetupToken();
      server.middlewares.use(auditAdminActions);
      server.middlewares.use(authHandler);
      server.middlewares.use(authGuard);
      server.middlewares.use("/api/funcionarios/tipo-conta", accountTypeHandler);
      server.middlewares.use("/api/funcionarios/excluir", deleteEmployeeHandler);
      server.middlewares.use("/api/funcionarios/desativar", deactivateEmployeeHandler);
      server.middlewares.use("/api/funcionarios", employeesHandler);
      server.middlewares.use("/api/diarias/excluir", deleteDailyHandler);
      server.middlewares.use("/api/diarias/historico", dailyHistoryHandler);
      server.middlewares.use("/api/diarias", dailyHandler);
      server.middlewares.use("/api/pesquisa", searchHandler);
    },
  };
}
