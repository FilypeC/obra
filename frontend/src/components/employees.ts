import { formatApiError } from "../utils/errors";

function required<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error("Missing required element: " + selector);
  return element;
}

const deactivateConfirmDialogElement = required<HTMLDialogElement>("#deactivate-confirm-dialog");
const deactivateConfirmMessageElement = required<HTMLParagraphElement>("#deactivate-confirm-message");
const deactivateEmployeeSelect = required<HTMLSelectElement>("#deactivate-employee");
const deactivateEmployeeButtonElement = required<HTMLButtonElement>("#deactivate-employee-button");
const reactivateEmployeeButtonElement = required<HTMLButtonElement>("#reactivate-employee-button");
const deactivateMessageElement = required<HTMLParagraphElement>("#deactivate-form-message");
const deactivateFormElement = required<HTMLFormElement>("#deactivate-form");
const accountTypeEmployeeSelect = required<HTMLSelectElement>("#account-type-employee");
const accountTypeSelectElement = required<HTMLSelectElement>("#account-type-select");
const accountTypeFormElement = required<HTMLFormElement>("#account-type-form");
const accountTypeMessageElement = required<HTMLParagraphElement>("#account-type-message");

function confirmEmployeeDeactivation(name: string): Promise<boolean> {
  deactivateConfirmMessageElement.textContent =
    `Tem certeza de que deseja desativar o funcionário "${name}"?`;

  return new Promise((resolve) => {
    deactivateConfirmDialogElement.addEventListener(
      "close",
      () => resolve(deactivateConfirmDialogElement.returnValue === "confirm"),
      { once: true },
    );
    deactivateConfirmDialogElement.showModal();
  });
}

export async function loadEmployeesForDeactivation(): Promise<void> {
  deactivateEmployeeSelect.replaceChildren(new Option("Carregando funcionários...", ""));
  deactivateEmployeeSelect.disabled = true;
  deactivateEmployeeButtonElement.disabled = true;
  reactivateEmployeeButtonElement.disabled = true;

  try {
    const response = await fetch("/api/funcionarios/desativar");
    const result = (await response.json()) as {
      funcionarios?: Array<{ id: number; Nome: string; Ativo: number }>;
      error?: string;
    };
    if (!response.ok || !result.funcionarios) {
      throw new Error(result.error ?? "Não foi possível carregar os funcionários.");
    }

    deactivateEmployeeSelect.replaceChildren(new Option("Selecione um funcionário", ""));
    result.funcionarios.forEach(({ id, Nome, Ativo }) => {
      const status = Ativo === 1 ? "" : " (Desativado)";
      const option = new Option(`${Nome}${status}`, String(id));
      option.dataset.active = String(Ativo === 1);
      deactivateEmployeeSelect.add(option);
    });

    const hasActiveEmployees = result.funcionarios.some(({ Ativo }) => Ativo === 1);
    const hasInactiveEmployees = result.funcionarios.some(({ Ativo }) => Ativo !== 1);
    deactivateEmployeeSelect.disabled = result.funcionarios.length === 0;
    updateEmployeeStatusButtons();
    deactivateMessageElement.textContent = result.funcionarios.length === 0
      ? "Não há funcionários cadastrados."
      : !hasActiveEmployees && hasInactiveEmployees
        ? "Não há funcionários ativos. Selecione uma conta desativada para reativá-la."
        : "";
    deactivateMessageElement.classList.toggle(
      "form-message--visible",
      result.funcionarios.length === 0 || (!hasActiveEmployees && hasInactiveEmployees),
    );
  } catch (error) {
    console.error("Erro ao carregar funcionários para desativação.", error);
    deactivateEmployeeSelect.replaceChildren(new Option("Erro ao carregar funcionários", ""));
    deactivateEmployeeButtonElement.disabled = true;
    reactivateEmployeeButtonElement.disabled = true;
    deactivateMessageElement.textContent = formatApiError(
      error,
      "Não foi possível carregar os funcionários.",
    );
    deactivateMessageElement.classList.add("form-message--visible");
  }
}

function updateEmployeeStatusButtons(): void {
  const selectedIsActive = deactivateEmployeeSelect.selectedOptions[0]?.dataset.active === "true";
  deactivateEmployeeButtonElement.disabled =
    !deactivateEmployeeSelect.value || !selectedIsActive;
  reactivateEmployeeButtonElement.disabled =
    !deactivateEmployeeSelect.value || selectedIsActive;
}

type AccountTypeEmployee = {
  id: number;
  Nome: string;
  Ativo: number;
  TipoConta: "Funcionário" | "ADM";
};

function renderAccountTypeEmployees(employees: AccountTypeEmployee[]): void {
  accountTypeEmployeeSelect.replaceChildren(new Option(
    employees.length === 0 ? "Nenhum funcionário cadastrado" : "Selecione um funcionário",
    "",
  ));
  employees.forEach(({ id, Nome, Ativo, TipoConta }) => {
    const status = Ativo === 1 ? "" : " (Desativado)";
    const option = new Option(`${Nome}${status}`, String(id));
    option.disabled = Ativo !== 1;
    option.dataset.tipoConta = TipoConta;
    accountTypeEmployeeSelect.add(option);
  });

  const hasActiveEmployees = employees.some(({ Ativo }) => Ativo === 1);
  accountTypeEmployeeSelect.disabled = !hasActiveEmployees;
  accountTypeSelectElement.disabled = !hasActiveEmployees;
  const submitButton = accountTypeFormElement.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  );
  if (!submitButton) {
    throw new Error("Não foi possível carregar o botão para atribuir o tipo de conta.");
  }
  submitButton.disabled = !hasActiveEmployees;
  accountTypeSelectElement.value = "Funcionário";
}

export async function loadAccountTypeEmployees(): Promise<void> {
  accountTypeEmployeeSelect.replaceChildren(new Option("Carregando funcionários...", ""));
  accountTypeEmployeeSelect.disabled = true;
  accountTypeSelectElement.disabled = true;
  const submitButton = accountTypeFormElement.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  );
  if (!submitButton) {
    throw new Error("Não foi possível carregar o botão para atribuir o tipo de conta.");
  }
  submitButton.disabled = true;
  accountTypeMessageElement.classList.remove("form-message--visible");
  accountTypeMessageElement.textContent = "";

  try {
    const response = await fetch("/api/funcionarios/tipo-conta");
    const result = (await response.json()) as {
      funcionarios?: AccountTypeEmployee[];
      error?: string;
    };
    if (!response.ok || !result.funcionarios) {
      throw new Error(result.error ?? "Não foi possível carregar os tipos de conta.");
    }
    renderAccountTypeEmployees(result.funcionarios);
  } catch (error) {
    console.error("Erro ao carregar os tipos de conta.", error);
    accountTypeEmployeeSelect.replaceChildren(new Option("Erro ao carregar funcionários", ""));
    accountTypeMessageElement.textContent = formatApiError(
      error,
      "Não foi possível carregar os tipos de conta.",
    );
    accountTypeMessageElement.classList.add("form-message--visible");
  }
}

accountTypeEmployeeSelect.addEventListener("change", () => {
  const selectedOption = accountTypeEmployeeSelect.selectedOptions[0];
  if (selectedOption?.dataset.tipoConta) {
    accountTypeSelectElement.value = selectedOption.dataset.tipoConta;
  }
});

accountTypeFormElement.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  const funcionarioId = Number(accountTypeEmployeeSelect.value);
  const tipoConta = accountTypeSelectElement.value;
  const button = accountTypeFormElement.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!funcionarioId || (tipoConta !== "Funcionário" && tipoConta !== "ADM") || !button) {
    throw new Error("Não foi possível identificar os dados para atribuir o tipo de conta.");
  }

  button.disabled = true;
  accountTypeMessageElement.classList.remove("form-message--visible");
  accountTypeMessageElement.textContent = "";
  try {
    const response = await fetch("/api/funcionarios/tipo-conta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ funcionarioId, tipoConta }),
    });
    const result = (await response.json()) as { message?: string; error?: string };
    if (!response.ok) {
      throw new Error(result.error ?? "Não foi possível atribuir o tipo de conta.");
    }
    accountTypeMessageElement.textContent = result.message ?? "Tipo de conta atribuído com sucesso.";
    accountTypeMessageElement.classList.add("form-message--visible");
  } catch (error) {
    console.error("Erro ao atribuir tipo de conta.", error);
    accountTypeMessageElement.textContent = formatApiError(
      error,
      "Não foi possível atribuir o tipo de conta.",
    );
    accountTypeMessageElement.classList.add("form-message--visible");
  } finally {
    button.disabled = false;
  }
});

deactivateEmployeeSelect.addEventListener("change", () => {
  updateEmployeeStatusButtons();
  deactivateMessageElement.classList.remove("form-message--visible");
  deactivateMessageElement.textContent = "";
});

deactivateFormElement.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();
  const funcionarioId = Number(deactivateEmployeeSelect.value);
  const selectedEmployee = deactivateEmployeeSelect.selectedOptions[0];
  if (!funcionarioId || !selectedEmployee || selectedEmployee.dataset.active !== "true") {
    deactivateEmployeeSelect.reportValidity();
    return;
  }
  if (!await confirmEmployeeDeactivation(selectedEmployee.textContent ?? "este funcionário")) {
    return;
  }

  const submitButton = deactivateFormElement.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  );
  if (!submitButton) {
    throw new Error("Não foi possível carregar o botão de desativação.");
  }

  submitButton.disabled = true;
  deactivateMessageElement.textContent = "Desativando funcionário...";
  deactivateMessageElement.classList.add("form-message--visible");
  try {
    const response = await fetch("/api/funcionarios/desativar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ funcionarioId }),
    });
    const result = (await response.json()) as { error?: string; message?: string };
    if (!response.ok) {
      throw new Error(result.error ?? "Não foi possível desativar o funcionário.");
    }

    await loadEmployeesForDeactivation();
    deactivateEmployeeSelect.value = "";
    deactivateMessageElement.textContent =
      result.message ?? "Funcionário desativado com sucesso.";
    deactivateMessageElement.classList.add("form-message--visible");
  } catch (error) {
    console.error("Erro ao desativar funcionário.", error);
    deactivateMessageElement.textContent = formatApiError(
      error,
      "Não foi possível desativar o funcionário.",
    );
    deactivateMessageElement.classList.add("form-message--visible");
  } finally {
    updateEmployeeStatusButtons();
  }
});

reactivateEmployeeButtonElement.addEventListener("click", async () => {
  const funcionarioId = Number(deactivateEmployeeSelect.value);
  const selectedEmployee = deactivateEmployeeSelect.selectedOptions[0];
  if (!funcionarioId || !selectedEmployee || selectedEmployee.dataset.active !== "false") {
    deactivateEmployeeSelect.reportValidity();
    return;
  }

  deactivateEmployeeButtonElement.disabled = true;
  reactivateEmployeeButtonElement.disabled = true;
  deactivateMessageElement.textContent = "Reativando funcionário...";
  deactivateMessageElement.classList.add("form-message--visible");

  try {
    const response = await fetch("/api/funcionarios/reativar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ funcionarioId }),
    });
    const result = (await response.json()) as { error?: string; message?: string };
    if (!response.ok) {
      throw new Error(result.error ?? "Não foi possível reativar o funcionário.");
    }

    await loadEmployeesForDeactivation();
    deactivateEmployeeSelect.value = "";
    deactivateMessageElement.textContent =
      result.message ?? "Funcionário reativado com sucesso.";
    deactivateMessageElement.classList.add("form-message--visible");
  } catch (error) {
    console.error("Erro ao reativar funcionário.", error);
    deactivateMessageElement.textContent = formatApiError(
      error,
      "Não foi possível reativar o funcionário.",
    );
    deactivateMessageElement.classList.add("form-message--visible");
  } finally {
    updateEmployeeStatusButtons();
  }
});
