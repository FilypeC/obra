import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { TLSSocket } from "node:tls";
import type { IncomingMessage, ServerResponse } from "node:http";
import { database } from "./database";

export type AuthSession = {
  funcionarioId: number;
  expiresAt: number;
  precisaTrocarSenha: boolean;
};

export const sessionDurationMs = 12 * 60 * 60 * 1000;
export const sessions = new Map<string, AuthSession>();
export const setupToken = randomBytes(32).toString("hex");

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [saltHex, hashHex] = storedHash.split(":");
  if (!saltHex || !hashHex || !/^[a-f\d]+$/i.test(saltHex) || !/^[a-f\d]+$/i.test(hashHex)) {
    return false;
  }
  const salt = Buffer.from(saltHex, "hex");
  const expectedHash = Buffer.from(hashHex, "hex");
  if (salt.length !== 16 || expectedHash.length !== 64) return false;
  return timingSafeEqual(scryptSync(password, salt, expectedHash.length), expectedHash);
}

export function constantTimeStringEqual(first: string, second: string): boolean {
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

export function getSession(request: IncomingMessage): { token: string; session: AuthSession } | undefined {
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

export function setSessionCookie(
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

export function clearSessionCookie(request: IncomingMessage, response: ServerResponse): void {
  const secure = request.socket instanceof TLSSocket ? "; Secure" : "";
  response.setHeader("Set-Cookie", `obra_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`);
}

export function isSetupAvailable(): boolean {
  const employeeCount = database.prepare(
    "SELECT COUNT(*) AS count FROM funcionarios",
  ).get() as { count: number };
  if (employeeCount.count === 0) return true;
  const pendingCount = database.prepare(
    "SELECT COUNT(*) AS count FROM funcionarios WHERE Ativo = 1 AND SenhaHash IS NULL",
  ).get() as { count: number };
  return pendingCount.count > 0;
}

export function logSetupToken(): void {
  if (isSetupAvailable()) {
    console.info(`Token de configuração inicial do sistema: ${setupToken}`);
  }
}

