import { session } from "../state/session";
import type { AccountType } from "../types";
import { formatApiError } from "../utils/errors";

function required<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error("Missing required element: " + selector);
  return element;
}

const authScreenElement = required<HTMLElement>("#auth-screen");
const appElement = required<HTMLElement>("#app");
const loginFormElement = required<HTMLFormElement>("#login-form");
const loginNameInput = required<HTMLInputElement>("#login-name");
const loginPasswordInput = required<HTMLInputElement>("#login-password");
const loginMessageElement = required<HTMLParagraphElement>("#login-message");
const authTitleElement = required<HTMLHeadingElement>("#auth-title");
const authDescriptionElement = required<HTMLParagraphElement>("#auth-description");
const passwordFormElement = required<HTMLFormElement>("#password-form");
const newPasswordInput = required<HTMLInputElement>("#new-password");
const confirmPasswordInput = required<HTMLInputElement>("#confirm-password");
const passwordMessageElement = required<HTMLParagraphElement>("#password-message");
const setupDetailsElement = required<HTMLDetailsElement>("#setup-details");
const setupTokenFormElement = required<HTMLFormElement>("#setup-token-form");
const setupTokenInput = required<HTMLInputElement>("#setup-token");
const setupTokenMessageElement = required<HTMLParagraphElement>("#setup-token-message");
const setupAccountFormElement = required<HTMLFormElement>("#setup-account-form");
const setupEmployeeFieldElement = required<HTMLDivElement>("#setup-employee-field");
const setupEmployeeSelect = required<HTMLSelectElement>("#setup-employee");
const setupNameFieldElement = required<HTMLDivElement>("#setup-name-field");
const setupNameInput = required<HTMLInputElement>("#setup-name");
const setupPasswordInput = required<HTMLInputElement>("#setup-password");
const setupAccountMessageElement = required<HTMLParagraphElement>("#setup-account-message");
const logoutButtonElement = required<HTMLButtonElement>("#logout-button");
const sectionMessageElement = required<HTMLParagraphElement>("#section-message");
const setupDetails = setupDetailsElement;
const setupAccountForm = setupAccountFormElement;

type SetupEmployeesResponse = {
  funcionarios?: Array<{ id: number; Nome: string }>;
  primeiroAcesso?: boolean;
  error?: string;
};

export function initializeAuthentication(options: {
  renderView: (currentView: string) => Promise<void>;
  getCurrentView: () => string;
  updateSidebarUser: () => void;
}): void {
  let setupAvailable = false;

function showLogin(message = ""): void {
  appElement.hidden = true;
  authScreenElement.hidden = false;
  session.accountType = null;
  session.employeeId = null;
  session.employeeName = null;
  options.updateSidebarUser();
  loginFormElement.hidden = false;
  passwordFormElement.hidden = true;
  setupDetailsElement.hidden = !setupAvailable;
  authTitleElement.textContent = "Entrar";
  authDescriptionElement.textContent =
    "Use seu nome de funcionário e sua senha para acessar o sistema.";
  loginMessageElement.textContent = message;
  loginMessageElement.classList.toggle("form-message--visible", Boolean(message));
  loginNameInput.focus();
}

async function enterApp(): Promise<void> {
  authScreenElement.hidden = true;
  appElement.hidden = false;
  setupDetailsElement.hidden = true;
  loginFormElement.reset();
  passwordFormElement.reset();
  await options.renderView(options.getCurrentView());
}

async function loadSetupEmployees(): Promise<void> {
  const response = await fetch("/api/auth/setup", {
    headers: { "X-Setup-Token": setupTokenInput.value },
  });
  const result = (await response.json()) as SetupEmployeesResponse;
  if (!response.ok || !result.funcionarios) {
    throw new Error(result.error ?? "Não foi possível carregar as contas pendentes.");
  }

  const firstAccess = result.primeiroAcesso === true;
  setupEmployeeFieldElement.hidden = firstAccess;
  setupNameFieldElement.hidden = !firstAccess;
  setupEmployeeSelect.required = !firstAccess;
  setupNameInput.required = firstAccess;
  setupEmployeeSelect.replaceChildren(new Option("Selecione um funcionário", ""));
  result.funcionarios.forEach(({ id, Nome }) => {
    setupEmployeeSelect.add(new Option(Nome, String(id)));
  });
  setupAccountFormElement.hidden = false;
  setupAccountMessageElement.textContent = firstAccess
    ? "Crie a primeira conta de funcionário."
    : `${result.funcionarios.length} conta(s) aguardando senha temporária.`;
  setupAccountMessageElement.classList.add("form-message--visible");
  setupTokenMessageElement.textContent = "";
  setupTokenMessageElement.classList.remove("form-message--visible");
}

setupTokenFormElement.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();
  setupTokenMessageElement.classList.remove("form-message--visible");
  setupTokenMessageElement.textContent = "";
  try {
    await loadSetupEmployees();
  } catch (error) {
    console.error("Erro ao validar o token de configuração inicial.", error);
    setupTokenMessageElement.textContent = formatApiError(
      error,
      "Não foi possível validar o token.",
    );
    setupTokenMessageElement.classList.add("form-message--visible");
    setupAccountFormElement.hidden = true;
  }
});

setupAccountForm.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();
  setupAccountMessageElement.classList.remove("form-message--visible");
  setupAccountMessageElement.textContent = "";
  const firstAccess = !setupNameFieldElement.hidden;
  const body: {
    funcionarioId?: number;
    Nome?: string;
    senhaTemporaria: string;
  } = {
    senhaTemporaria: setupPasswordInput.value,
  };
  if (firstAccess) {
    body.Nome = setupNameInput.value.trim();
  } else {
    body.funcionarioId = Number(setupEmployeeSelect.value);
  }

  const submitButton = setupAccountFormElement.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  );
  if (!submitButton) {
    throw new Error("Não foi possível carregar o botão de configuração.");
  }

  submitButton.disabled = true;
  try {
    const response = await fetch("/api/auth/setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Setup-Token": setupTokenInput.value,
      },
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as { restantes?: number; error?: string };
    if (!response.ok || result.restantes === undefined) {
      throw new Error(result.error ?? "Não foi possível definir a senha temporária.");
    }

    setupAccountFormElement.reset();
    if (result.restantes > 0) {
      await loadSetupEmployees();
      setupAccountMessageElement.textContent =
        `Senha temporária definida. Ainda restam ${result.restantes} funcionário(s).`;
    } else {
      setupAvailable = false;
      setupDetails.hidden = true;
      showLogin("Configuração concluída. Entre com o login e a senha temporária.");
    }
    setupAccountMessageElement.classList.add("form-message--visible");
  } catch (error) {
    console.error("Erro ao configurar senha temporária.", error);
    setupAccountMessageElement.textContent = formatApiError(
      error,
      "Não foi possível definir a senha temporária.",
    );
    setupAccountMessageElement.classList.add("form-message--visible");
  } finally {
    submitButton.disabled = false;
  }
});

loginFormElement.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();
  loginMessageElement.classList.remove("form-message--visible");
  loginMessageElement.textContent = "";
  const submitButton = loginFormElement.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!submitButton) {
    throw new Error("Não foi possível carregar o botão de login.");
  }
  submitButton.disabled = true;
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: loginNameInput.value, senha: loginPasswordInput.value }),
    });
    const result = (await response.json()) as {
      id?: number;
      funcionario?: string;
      precisaTrocarSenha?: boolean;
      TipoConta?: AccountType;
      error?: string;
    };
    if (!response.ok) {
      throw new Error(result.error ?? "Não foi possível realizar o login.");
    }
    if (result.TipoConta !== "Funcionário" && result.TipoConta !== "ADM") {
      throw new Error("O servidor não informou um tipo de conta válido.");
    }
    if (
      typeof result.id !== "number" ||
      !Number.isSafeInteger(result.id) ||
      typeof result.funcionario !== "string"
    ) {
      throw new Error("O servidor não informou o usuário conectado.");
    }
    session.accountType = result.TipoConta;
    session.employeeId = result.id;
    session.employeeName = result.funcionario;
    options.updateSidebarUser();
    if (result.precisaTrocarSenha) {
      loginFormElement.hidden = true;
      passwordFormElement.hidden = false;
      setupDetailsElement.hidden = true;
      authTitleElement.textContent = "Crie sua nova senha";
      authDescriptionElement.textContent =
        "Para concluir seu primeiro acesso, escolha uma senha pessoal com pelo menos 8 caracteres.";
      passwordMessageElement.textContent = "";
      passwordMessageElement.classList.remove("form-message--visible");
      newPasswordInput.focus();
    } else {
      await enterApp();
    }
  } catch (error) {
    console.error("Erro ao realizar login.", error);
    loginMessageElement.textContent = formatApiError(
      error,
      "Não foi possível realizar o login.",
    );
    loginMessageElement.classList.add("form-message--visible");
  } finally {
    submitButton.disabled = false;
  }
});

passwordFormElement.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();
  if (newPasswordInput.value !== confirmPasswordInput.value) {
    passwordMessageElement.textContent = "As senhas informadas não coincidem.";
    passwordMessageElement.classList.add("form-message--visible");
    confirmPasswordInput.focus();
    return;
  }
  passwordMessageElement.classList.remove("form-message--visible");
  passwordMessageElement.textContent = "";
  const submitButton = passwordFormElement.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  );
  if (!submitButton) {
    throw new Error("Não foi possível carregar o botão para salvar a senha.");
  }
  submitButton.disabled = true;
  try {
    const response = await fetch("/api/auth/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ novaSenha: newPasswordInput.value }),
    });
    const result = (await response.json()) as { message?: string; error?: string };
    if (!response.ok) {
      throw new Error(result.error ?? "Não foi possível atualizar a senha.");
    }
    await enterApp();
  } catch (error) {
    console.error("Erro ao atualizar senha.", error);
    passwordMessageElement.textContent = formatApiError(
      error,
      "Não foi possível atualizar a senha.",
    );
    passwordMessageElement.classList.add("form-message--visible");
  } finally {
    submitButton.disabled = false;
  }
});

logoutButtonElement.addEventListener("click", async () => {
  logoutButtonElement.disabled = true;
  try {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      throw new Error(result.error ?? "Não foi possível encerrar a sessão.");
    }
    showLogin();
  } catch (error) {
    console.error("Erro ao encerrar sessão.", error);
    sectionMessageElement.textContent = formatApiError(
      error,
      "Não foi possível encerrar a sessão.",
    );
    sectionMessageElement.hidden = false;
  } finally {
    logoutButtonElement.disabled = false;
  }
});

async function initialize(): Promise<void> {
  try {
    const statusResponse = await fetch("/api/auth/status");
    const status = (await statusResponse.json()) as {
      setupAvailable?: boolean;
      error?: string;
    };
    if (!statusResponse.ok) {
      throw new Error(status.error ?? "Não foi possível verificar o acesso.");
    }
    setupAvailable = status.setupAvailable === true;
    setupDetailsElement.hidden = !setupAvailable;

    const response = await fetch("/api/auth/session");
    if (response.ok) {
      const sessionResponse = (await response.json()) as {
        id?: number;
        funcionario?: string;
        precisaTrocarSenha?: boolean;
        TipoConta?: AccountType;
        error?: string;
      };
      if (sessionResponse.TipoConta !== "Funcionário" && sessionResponse.TipoConta !== "ADM") {
        throw new Error("O servidor não informou um tipo de conta válido.");
      }
      if (
        typeof sessionResponse.id !== "number" ||
        !Number.isSafeInteger(sessionResponse.id) ||
        typeof sessionResponse.funcionario !== "string"
      ) {
        throw new Error("O servidor não informou o usuário conectado.");
      }
      session.accountType = sessionResponse.TipoConta;
      session.employeeId = sessionResponse.id;
      session.employeeName = sessionResponse.funcionario;
      options.updateSidebarUser();
      if (sessionResponse.precisaTrocarSenha) {
        loginFormElement.hidden = true;
        passwordFormElement.hidden = false;
        setupDetailsElement.hidden = true;
        authTitleElement.textContent = "Crie sua nova senha";
        authDescriptionElement.textContent =
          "Para concluir seu primeiro acesso, escolha uma senha pessoal com pelo menos 8 caracteres.";
        authScreenElement.hidden = false;
        newPasswordInput.focus();
      } else {
        await enterApp();
      }
      return;
    }
    if (response.status !== 401) {
      const result = (await response.json()) as { error?: string };
      throw new Error(result.error ?? "Não foi possível verificar a sessão.");
    }
    showLogin();
  } catch (error) {
    console.error("Erro ao verificar autenticação.", error);
    showLogin(formatApiError(error, "Não foi possível verificar o acesso."));
  }
}

void initialize();
}
