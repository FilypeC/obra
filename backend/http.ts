import type { IncomingMessage, ServerResponse } from "node:http";

export function readBody(
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

export function sendJson(response: ServerResponse, status: number, data: unknown): void {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(data));
}
