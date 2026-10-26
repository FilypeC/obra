import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

const database = new DatabaseSync(fileURLToPath(new URL("./database/cadastro.db", import.meta.url)));

database.exec(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    Nome TEXT NOT NULL CHECK (length(trim(Nome)) > 0)
  );
  CREATE TABLE IF NOT EXISTS diarias (
    funcionario_id INTEGER NOT NULL REFERENCES funcionarios(id),
    Data TEXT NOT NULL CHECK (length(Data) = 10),
    Diaria REAL NOT NULL CHECK (Diaria > 0),
    PRIMARY KEY (funcionario_id, Data)
  );
`);

const employeeColumns = database.prepare("PRAGMA table_info(funcionarios)")
  .all() as Array<{ name: string }>;
const dailyColumns = database.prepare("PRAGMA table_info(diarias)")
  .all() as Array<{ name: string; pk: number }>;
const dailyForeignKeys = database.prepare("PRAGMA foreign_key_list(diarias)")
  .all() as Array<{ table: string; from: string; to: string }>;
const expectedEmployeeColumns = ["id", "Nome"];
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
        Nome TEXT NOT NULL CHECK (length(trim(Nome)) > 0)
      );
      INSERT INTO funcionarios_new (id, Nome)
        SELECT id, Nome FROM funcionarios;

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
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
}

function employeeApi(): Plugin {
  const employeesHandler = (
    request: IncomingMessage,
    response: ServerResponse,
  ) => {
    if (request.method === "GET") {
      try {
        const funcionarios = database
          .prepare("SELECT id, Nome FROM funcionarios ORDER BY Nome COLLATE NOCASE")
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
      const employeeName = (body as { Nome?: unknown } | null)?.Nome;
      if (
        typeof employeeName !== "string" ||
        !employeeName.trim() ||
        employeeName.trim().length > 150
      ) {
        sendJson(response, 400, { error: "Informe um nome com até 150 caracteres." });
        return;
      }

      try {
        const name = employeeName.trim();
        database.prepare("INSERT INTO funcionarios (Nome) VALUES (?)").run(name);
        sendJson(response, 201, { Nome: name });
      } catch (error) {
        console.error("Não foi possível salvar o funcionário no banco de dados.", error);
        sendJson(response, 500, { error: "Não foi possível salvar o funcionário." });
      }
    });
  };

  const dailyHandler = (
    request: IncomingMessage,
    response: ServerResponse,
  ) => {
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
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        sendJson(response, 400, { error: "Informe funcionário, data válida e diária maior que zero." });
        return;
      }

      try {
        const result = database.prepare(
          `INSERT INTO diarias (funcionario_id, "Data", "Diaria")
           VALUES (?, ?, ?)
           ON CONFLICT (funcionario_id, "Data")
           DO UPDATE SET "Diaria" = excluded."Diaria"`,
        ).run(funcionarioId, date, amount);
        if (result.changes === 0) {
          sendJson(response, 400, { error: "O funcionário selecionado não existe." });
          return;
        }
        sendJson(response, 200, { message: "Diária salva com sucesso." });
      } catch (error) {
        console.error("Não foi possível salvar a diária no banco de dados.", error);
        sendJson(response, 500, { error: "Não foi possível salvar a diária." });
      }
    });
  };

  const deleteDailyHandler = (
    request: IncomingMessage,
    response: ServerResponse,
  ) => {
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
        !isValidDate(date)
      ) {
        sendJson(response, 400, { error: "Informe funcionário e uma data válida." });
        return;
      }

      try {
        const result = database.prepare(
          'DELETE FROM diarias WHERE funcionario_id = ? AND "Data" = ?',
        ).run(funcionarioId, date);
        if (result.changes === 0) {
          sendJson(response, 404, { error: "Não há dados para esse funcionário e essa data." });
          return;
        }
        sendJson(response, 200, { message: "Data e diária excluídas com sucesso." });
      } catch (error) {
        console.error("Não foi possível excluir os dados da diária.", error);
        sendJson(response, 500, { error: "Não foi possível excluir os dados." });
      }
    });
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
      const record = body as { funcionarioId?: unknown; mes?: unknown } | null;
      const funcionarioId = record?.funcionarioId;
      const month = record?.mes;
      if (
        typeof funcionarioId !== "number" ||
        !Number.isSafeInteger(funcionarioId) ||
        funcionarioId <= 0 ||
        (month !== undefined &&
          month !== "" &&
          (typeof month !== "string" || !/^(0[1-9]|1[0-2])$/.test(month)))
      ) {
        sendJson(response, 400, { error: "Selecione um funcionário e, se desejar, um mês válido." });
        return;
      }

      try {
        const registros = month
          ? database.prepare(`
          SELECT funcionarios.Nome, diarias."Data", diarias."Diaria"
          FROM diarias
          JOIN funcionarios ON funcionarios.id = diarias.funcionario_id
          WHERE funcionarios.id = ? AND substr(diarias."Data", 6, 2) = ?
          ORDER BY "Data"
        `).all(funcionarioId, month)
          : database.prepare(`
          SELECT funcionarios.Nome, diarias."Data", diarias."Diaria"
          FROM funcionarios
          LEFT JOIN diarias ON diarias.funcionario_id = funcionarios.id
          WHERE funcionarios.id = ?
          ORDER BY diarias."Data"
        `).all(funcionarioId);
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

  return {
    name: "employee-sqlite-api",
    configureServer(server) {
      server.middlewares.use("/api/funcionarios", employeesHandler);
      server.middlewares.use("/api/diarias/excluir", deleteDailyHandler);
      server.middlewares.use("/api/diarias", dailyHandler);
      server.middlewares.use("/api/pesquisa", searchHandler);
    },
    configurePreviewServer(server) {
      server.middlewares.use("/api/funcionarios", employeesHandler);
      server.middlewares.use("/api/diarias/excluir", deleteDailyHandler);
      server.middlewares.use("/api/diarias", dailyHandler);
      server.middlewares.use("/api/pesquisa", searchHandler);
    },
  };
}

export default defineConfig({
  plugins: [employeeApi()],
});
