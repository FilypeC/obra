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
  )
`);

const employeeColumns = new Set(
  (database.prepare("PRAGMA table_info(funcionarios)").all() as Array<{ name: string }>)
    .map(({ name }) => name),
);
if (!employeeColumns.has("Data")) {
  database.exec('ALTER TABLE funcionarios ADD COLUMN "Data" TEXT');
}
if (!employeeColumns.has("Diaria")) {
  database.exec('ALTER TABLE funcionarios ADD COLUMN "Diaria" REAL');
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
          'UPDATE funcionarios SET "Data" = ?, "Diaria" = ? WHERE id = ?',
        ).run(date, amount, funcionarioId);
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
          'UPDATE funcionarios SET "Data" = NULL, "Diaria" = NULL WHERE id = ? AND "Data" = ?',
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
          SELECT Nome, "Data", "Diaria"
          FROM funcionarios
          WHERE id = ? AND substr("Data", 6, 2) = ?
          ORDER BY "Data"
        `).all(funcionarioId, month)
          : database.prepare(`
          SELECT Nome, "Data", "Diaria"
          FROM funcionarios
          WHERE id = ?
          ORDER BY "Data"
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
