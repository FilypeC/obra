export function formatApiError(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    if (/Failed to fetch|fetch/i.test(error.message) || error.name === "TypeError") {
      return "N?o foi poss?vel conectar ao servidor. Verifique se a aplica??o est? em execu??o.";
    }
    return error.message;
  }
  return fallback;
}
