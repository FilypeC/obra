import "../styles/style.css";

type AccountType = "Funcionário" | "ADM";

const form = document.querySelector<HTMLFormElement>("#employee-form");
const authScreen = document.querySelector<HTMLElement>("#auth-screen");
const app = document.querySelector<HTMLElement>("#app");
const loginForm = document.querySelector<HTMLFormElement>("#login-form");
const loginName = document.querySelector<HTMLInputElement>("#login-name");
const loginPassword = document.querySelector<HTMLInputElement>("#login-password");
const loginMessage = document.querySelector<HTMLParagraphElement>("#login-message");
const authTitle = document.querySelector<HTMLHeadingElement>("#auth-title");
const authDescription = document.querySelector<HTMLParagraphElement>("#auth-description");
const passwordForm = document.querySelector<HTMLFormElement>("#password-form");
const newPassword = document.querySelector<HTMLInputElement>("#new-password");
const confirmPassword = document.querySelector<HTMLInputElement>("#confirm-password");
const passwordMessage = document.querySelector<HTMLParagraphElement>("#password-message");
const setupDetails = document.querySelector<HTMLDetailsElement>("#setup-details");
const setupTokenForm = document.querySelector<HTMLFormElement>("#setup-token-form");
const setupToken = document.querySelector<HTMLInputElement>("#setup-token");
const setupTokenMessage = document.querySelector<HTMLParagraphElement>("#setup-token-message");
const setupAccountForm = document.querySelector<HTMLFormElement>("#setup-account-form");
const setupEmployeeField = document.querySelector<HTMLDivElement>("#setup-employee-field");
const setupEmployee = document.querySelector<HTMLSelectElement>("#setup-employee");
const setupNameField = document.querySelector<HTMLDivElement>("#setup-name-field");
const setupName = document.querySelector<HTMLInputElement>("#setup-name");
const setupPassword = document.querySelector<HTMLInputElement>("#setup-password");
const setupAccountMessage = document.querySelector<HTMLParagraphElement>("#setup-account-message");
const logoutButton = document.querySelector<HTMLButtonElement>("#logout-button");
const sidebarUserName = document.querySelector<HTMLElement>("#sidebar-user-name");
const sidebarUserType = document.querySelector<HTMLElement>("#sidebar-user-type");
const employeeTemporaryPassword = document.querySelector<HTMLInputElement>(
  "#employee-temporary-password",
);
const dailyForm = document.querySelector<HTMLFormElement>("#daily-form");
const deleteForm = document.querySelector<HTMLFormElement>("#delete-form");
const deactivateForm = document.querySelector<HTMLFormElement>("#deactivate-form");
const deactivateEmployee = document.querySelector<HTMLSelectElement>("#deactivate-employee");
const deactivateEmployeeButton = document.querySelector<HTMLButtonElement>(
  "#deactivate-employee-button",
);
const reactivateEmployeeButton = document.querySelector<HTMLButtonElement>(
  "#reactivate-employee-button",
);
const deactivateMessage = document.querySelector<HTMLParagraphElement>("#deactivate-form-message");
const searchForm = document.querySelector<HTMLFormElement>("#search-form");
const changePasswordForm = document.querySelector<HTMLFormElement>("#change-password-form");
const currentPasswordInput = document.querySelector<HTMLInputElement>("#current-password");
const changeNewPasswordInput = document.querySelector<HTMLInputElement>("#change-new-password");
const changeConfirmPasswordInput = document.querySelector<HTMLInputElement>(
  "#change-confirm-password",
);
const changePasswordMessage = document.querySelector<HTMLParagraphElement>(
  "#change-password-message",
);
const generateReportButton = document.querySelector<HTMLButtonElement>("#generate-report");
const searchMessage = document.querySelector<HTMLParagraphElement>("#search-form-message");
const searchStartDate = document.querySelector<HTMLInputElement>("#search-start-date");
const searchEndDate = document.querySelector<HTMLInputElement>("#search-end-date");
const searchEmployeeDropdown = document.querySelector<HTMLDetailsElement>(
  "#search-employee-dropdown",
);
const searchEmployeeSelection = document.querySelector<HTMLElement>(
  "#search-employee-selection",
);
const searchEmployeeHelp = document.querySelector<HTMLElement>("#search-employee-help");
const searchResults = document.querySelector<HTMLElement>("#search-results");
const searchResultsEmpty = document.querySelector<HTMLParagraphElement>("#search-results-empty");
const searchResultsTable = document.querySelector<HTMLDivElement>("#search-results-table-wrapper");
const searchResultsBody = document.querySelector<HTMLTableSectionElement>("#search-results-body");
const accountTypeSection = document.querySelector<HTMLElement>("#account-type-section");
const accountTypeForm = document.querySelector<HTMLFormElement>("#account-type-form");
const accountTypeEmployee = document.querySelector<HTMLSelectElement>("#account-type-employee");
const accountTypeSelect = document.querySelector<HTMLSelectElement>("#account-type-select");
const accountTypeMessage = document.querySelector<HTMLParagraphElement>("#account-type-message");
const dailyHistorySection = document.querySelector<HTMLElement>("#daily-history-section");
const dailyHistoryEmpty = document.querySelector<HTMLParagraphElement>("#daily-history-empty");
const dailyHistoryTable = document.querySelector<HTMLDivElement>("#daily-history-table-wrapper");
const dailyHistoryBody = document.querySelector<HTMLTableSectionElement>("#daily-history-body");
const generateDailyHistoryReportButton = document.querySelector<HTMLButtonElement>(
  "#generate-daily-history-report",
);
const nameInput = document.querySelector<HTMLInputElement>("#employee-name");
const message = document.querySelector<HTMLParagraphElement>("#form-message");
const deactivateConfirmDialog = document.querySelector<HTMLDialogElement>("#deactivate-confirm-dialog");
const deactivateConfirmMessage = document.querySelector<HTMLParagraphElement>("#deactivate-confirm-message");
const dailyMessage = document.querySelector<HTMLParagraphElement>("#daily-form-message");
const deleteMessage = document.querySelector<HTMLParagraphElement>("#delete-form-message");
const dailyEmployee = document.querySelector<HTMLSelectElement>("#daily-employee");
const deleteEmployee = document.querySelector<HTMLSelectElement>("#delete-employee");
const searchEmployee = document.querySelector<HTMLDivElement>("#search-employee");
const dailyDate = document.querySelector<HTMLInputElement>("#daily-date");
const deleteDate = document.querySelector<HTMLInputElement>("#delete-date");
const dailyAmount = document.querySelector<HTMLInputElement>("#daily-amount");
const card = document.querySelector<HTMLElement>(".card");
const pageTitle = document.querySelector<HTMLHeadingElement>("#page-title");
const pageDescription = document.querySelector<HTMLParagraphElement>("#page-description");
const sectionMessage = document.querySelector<HTMLParagraphElement>("#section-message");
const navItems = document.querySelectorAll<HTMLAnchorElement>(".nav-item");
const sidebarBrandLink = document.querySelector<HTMLAnchorElement>(".sidebar__brand");
let setupAvailable = false;
let currentAccountType: AccountType | null = null;
let currentEmployeeId: number | null = null;
let currentEmployeeName: string | null = null;

if (
  !authScreen || !app || !loginForm || !loginName || !loginPassword || !loginMessage ||
  !authTitle || !authDescription || !passwordForm || !newPassword || !confirmPassword ||
  !passwordMessage || !setupDetails || !setupTokenForm || !setupToken ||
  !setupTokenMessage || !setupAccountForm || !setupEmployeeField || !setupEmployee ||
  !setupNameField || !setupName || !setupPassword || !setupAccountMessage ||
  !logoutButton || !sidebarUserName || !sidebarUserType || !employeeTemporaryPassword ||
  !form || !dailyForm || !deleteForm || !deactivateForm || !deactivateEmployee ||
  !deactivateEmployeeButton || !reactivateEmployeeButton || !deactivateMessage ||
  !searchForm || !generateReportButton ||
  !changePasswordForm || !currentPasswordInput || !changeNewPasswordInput ||
  !changeConfirmPasswordInput || !changePasswordMessage ||
  !nameInput || !message ||
  !deactivateConfirmDialog || !deactivateConfirmMessage ||
  !dailyMessage || !deleteMessage || !dailyEmployee || !deleteEmployee || !searchEmployee ||
  !searchEmployeeDropdown || !searchEmployeeSelection || !searchEmployeeHelp ||
  !searchMessage || !searchStartDate || !searchEndDate || !searchResults || !searchResultsEmpty ||
  !searchResultsTable || !searchResultsBody || !dailyDate || !deleteDate ||
  !accountTypeSection || !accountTypeForm || !accountTypeEmployee ||
  !accountTypeSelect || !accountTypeMessage ||
  !dailyHistorySection || !dailyHistoryEmpty || !dailyHistoryTable || !dailyHistoryBody ||
  !generateDailyHistoryReportButton ||
  !dailyAmount || !pageTitle || !pageDescription ||
  !sectionMessage || !card || !sidebarBrandLink
) {
  throw new Error("Não foi possível carregar os elementos do formulário.");
}

const authScreenElement = authScreen;
const appElement = app;
const loginFormElement = loginForm;
const loginNameInput = loginName;
const loginPasswordInput = loginPassword;
const loginMessageElement = loginMessage;
const authTitleElement = authTitle;
const authDescriptionElement = authDescription;
const passwordFormElement = passwordForm;
const newPasswordInput = newPassword;
const confirmPasswordInput = confirmPassword;
const passwordMessageElement = passwordMessage;
const setupDetailsElement = setupDetails;
const setupTokenFormElement = setupTokenForm;
const setupTokenInput = setupToken;
const setupTokenMessageElement = setupTokenMessage;
const setupAccountFormElement = setupAccountForm;
const setupEmployeeFieldElement = setupEmployeeField;
const setupEmployeeSelect = setupEmployee;
const setupNameFieldElement = setupNameField;
const setupNameInput = setupName;
const setupPasswordInput = setupPassword;
const setupAccountMessageElement = setupAccountMessage;
const logoutButtonElement = logoutButton;
const sidebarUserNameElement = sidebarUserName;
const sidebarUserTypeElement = sidebarUserType;
const employeeTemporaryPasswordInput = employeeTemporaryPassword;

const dailyFormElement = dailyForm;
const deleteFormElement = deleteForm;
const deactivateFormElement = deactivateForm;
const deactivateEmployeeSelect = deactivateEmployee;
const deactivateEmployeeButtonElement = deactivateEmployeeButton;
const reactivateEmployeeButtonElement = reactivateEmployeeButton;
const deactivateMessageElement = deactivateMessage;
const searchFormElement = searchForm;
const changePasswordFormElement = changePasswordForm;
const currentPasswordInputElement = currentPasswordInput;
const changeNewPasswordInputElement = changeNewPasswordInput;
const changeConfirmPasswordInputElement = changeConfirmPasswordInput;
const changePasswordMessageElement = changePasswordMessage;
const employeeFormElement = form;
const employeeMessageElement = message;
const deactivateConfirmDialogElement = deactivateConfirmDialog;
const deactivateConfirmMessageElement = deactivateConfirmMessage;
const generateReportButtonElement = generateReportButton;
const searchMessageElement = searchMessage;
const searchStartDateInput = searchStartDate;
const searchEndDateInput = searchEndDate;
const searchEmployeeDropdownElement = searchEmployeeDropdown;
const searchEmployeeSelectionElement = searchEmployeeSelection;
const searchEmployeeHelpElement = searchEmployeeHelp;
const searchResultsElement = searchResults;
const searchResultsEmptyElement = searchResultsEmpty;
const searchResultsTableElement = searchResultsTable;
const searchResultsBodyElement = searchResultsBody;
const accountTypeSectionElement = accountTypeSection;
const accountTypeFormElement = accountTypeForm;
const accountTypeEmployeeSelect = accountTypeEmployee;
const accountTypeSelectElement = accountTypeSelect;
const accountTypeMessageElement = accountTypeMessage;
const dailyHistorySectionElement = dailyHistorySection;
const dailyHistoryEmptyElement = dailyHistoryEmpty;
const dailyHistoryTableElement = dailyHistoryTable;
const dailyHistoryBodyElement = dailyHistoryBody;
const generateDailyHistoryReportButtonElement = generateDailyHistoryReportButton;
const dailyMessageElement = dailyMessage;
const deleteMessageElement = deleteMessage;
const dailyEmployeeSelect = dailyEmployee;
const deleteEmployeeSelect = deleteEmployee;
const searchEmployeeList = searchEmployee;
const dailyDateInput = dailyDate;
const deleteDateInput = deleteDate;
const dailyAmountInput = dailyAmount;
const cardElement = card;
const pageTitleElement = pageTitle;
const pageDescriptionElement = pageDescription;
const sectionMessageElement = sectionMessage;
const sidebarBrandLinkElement = sidebarBrandLink;

function updateSidebarUser(): void {
  sidebarUserNameElement.textContent = currentEmployeeName ?? "";
  sidebarUserTypeElement.textContent = currentAccountType ?? "";
  sidebarUserTypeElement.hidden = currentAccountType === null;
}

function formatApiError(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    if (/Failed to fetch|fetch/i.test(error.message) || error.name === "TypeError") {
      return "Não foi possível conectar ao servidor. Verifique se a aplicação está em execução.";
    }
    return error.message;
  }
  return fallback;
}

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

const sections: Record<string, { title: string; description: string }> = {
  cadastro: {
    title: "Cadastro",
    description: "Informe o nome do funcionário para iniciar o cadastro.",
  },
  diaria: {
    title: "Diaria",
    description: "Selecione o funcionário e informe a data e o valor da diária.",
  },
  excluir: {
    title: "Excluir dados",
    description: "Selecione o funcionário e a data para excluir a diária correspondente.",
  },
  desativar: {
    title: "Desativar e reativar funcionários",
    description: "Selecione o funcionário que deseja desativar ou reativar.",
  },
  pesquisa: {
    title: "Pesquisa",
    description: "Selecione um ou mais funcionários e o período que deseja consultar.",
  },
  "alterar-senha": {
    title: "Alterar senha",
    description: "Altere a senha da sua conta.",
  },
  "tipo-conta": {
    title: "Tipo de conta",
    description: "Atribua o tipo de conta de cada funcionário cadastrado.",
  },
  "historico-diarias": {
    title: "Histórico de diárias",
    description: "Confira quem modificou cada diária, quando a alteração ocorreu, os valores envolvidos e o tipo de operação.",
  },
};

const routes: Record<string, string> = {
  "/cadastro": "cadastro",
  "/diaria": "diaria",
  "/excluir-dados": "excluir",
  "/desativar-funcionario": "desativar",
  "/pesquisa": "pesquisa",
  "/alterar-senha": "alterar-senha",
  "/tipo-de-conta": "tipo-conta",
  "/historico-diarias": "historico-diarias",
};

function setTodayAsDefault(): void {
  dailyDateInput.value = getTodayLocalDate();
}

function getTodayLocalDate(): string {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

function updateDateLimits(): void {
  const today = getTodayLocalDate();
  dailyDateInput.max = today;
  deleteDateInput.max = today;
  searchStartDateInput.max = today;
  searchEndDateInput.max = today;
}

function getSelectedEmployeeIds(): number[] {
  return Array.from(
    searchEmployeeList.querySelectorAll<HTMLInputElement>(
      'input[name="funcionarioIds"]:checked',
    ),
    ({ value }) => Number(value),
  );
}

function getSearchDateRange(): { dataInicial: string; dataFinal: string } {
  return {
    dataInicial: searchStartDateInput.value,
    dataFinal: searchEndDateInput.value,
  };
}

function isValidSearchDateRange(dataInicial: string, dataFinal: string): boolean {
  const today = getTodayLocalDate();
  return (
    (!dataInicial && !dataFinal) ||
    (Boolean(dataInicial) &&
      Boolean(dataFinal) &&
      isValidCalendarDate(dataInicial) &&
      isValidCalendarDate(dataFinal) &&
      dataInicial <= today &&
      dataFinal <= today &&
      dataInicial <= dataFinal)
  );
}

function isValidCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isDateNotAfterToday(value: string): boolean {
  return isValidCalendarDate(value) && value <= getTodayLocalDate();
}

updateDateLimits();
document.addEventListener("focusin", updateDateLimits);

function renderEmployeeCheckboxes(
  employees: Array<{ id: number; Nome: string }>,
): void {
  const visibleEmployees = currentAccountType === "Funcionário"
    ? employees.filter(({ id }) => id === currentEmployeeId)
    : employees;
  if (currentAccountType === "Funcionário" && visibleEmployees.length !== 1) {
    throw new Error("Não foi possível carregar o usuário conectado para a pesquisa.");
  }
  const options: HTMLElement[] = [];
  if (currentAccountType !== "Funcionário" && visibleEmployees.length > 0) {
    const label = document.createElement("label");
    label.className = "employee-checkbox";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.selectAllEmployees = "true";
    const name = document.createElement("span");
    name.textContent = "Selecionar todos";
    label.append(checkbox, name);
    options.push(label);
  }
  options.push(...visibleEmployees.map(({ id, Nome }) => {
    const label = document.createElement("label");
    label.className = "employee-checkbox";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "funcionarioIds";
    checkbox.value = String(id);
    checkbox.dataset.employeeName = Nome;
    if (currentAccountType === "Funcionário") {
      checkbox.checked = true;
      checkbox.disabled = true;
    }
    const name = document.createElement("span");
    name.textContent = currentAccountType === "Funcionário" ? Nome : `ID: ${id} - ${Nome}`;
    label.append(checkbox, name);
    return label;
  }));
  searchEmployeeList.replaceChildren(...options);
  if (visibleEmployees.length === 0) {
    searchEmployeeList.textContent = "Nenhum funcionário cadastrado.";
  }
  syncSelectAllEmployeesCheckbox();
  updateEmployeeSelectionLabel();
}

function syncSelectAllEmployeesCheckbox(): void {
  const selectAll = searchEmployeeList.querySelector<HTMLInputElement>(
    'input[data-select-all-employees="true"]',
  );
  if (!selectAll) return;

  const employees = Array.from(
    searchEmployeeList.querySelectorAll<HTMLInputElement>(
      'input[name="funcionarioIds"]',
    ),
  );
  const selectedCount = employees.filter(({ checked }) => checked).length;
  selectAll.checked = employees.length > 0 && selectedCount === employees.length;
  selectAll.indeterminate = selectedCount > 0 && selectedCount < employees.length;
}

function updateEmployeeSelectionLabel(): void {
  if (currentAccountType === "Funcionário") {
    searchEmployeeSelectionElement.textContent = currentEmployeeName ?? "Seu usuário";
    return;
  }
  const selectedCount = getSelectedEmployeeIds().length;
  searchEmployeeSelectionElement.textContent = selectedCount === 0
    ? "Selecione um ou mais funcionários"
    : `${selectedCount} funcionário${selectedCount === 1 ? "" : "s"} selecionado${selectedCount === 1 ? "" : "s"}`;
}

async function loadEmployees(): Promise<void> {
  const loadingOption = () => new Option("Carregando funcionários...", "");
  dailyEmployeeSelect.replaceChildren(loadingOption());
  deleteEmployeeSelect.replaceChildren(loadingOption());
  searchEmployeeSelectionElement.textContent = "Carregando funcionários...";
  searchEmployeeDropdownElement.open = false;
  dailyEmployeeSelect.disabled = true;
  deleteEmployeeSelect.disabled = true;

  try {
    const response = await fetch("/api/funcionarios");
    const result = (await response.json()) as {
      funcionarios?: Array<{ id: number; Nome: string; Ativo: number }>;
      error?: string;
    };
    if (!response.ok || !result.funcionarios) {
      throw new Error(result.error ?? "Não foi possível carregar os funcionários.");
    }

    const makeOptions = () => new Option("Selecione um funcionário", "");
    const activeEmployees = result.funcionarios.filter(({ Ativo }) => Ativo === 1);
    dailyEmployeeSelect.replaceChildren(makeOptions());
    activeEmployees.forEach(({ id, Nome }) => {
      dailyEmployeeSelect.add(new Option(`ID: ${id} - ${Nome}`, String(id)));
    });
    deleteEmployeeSelect.replaceChildren(makeOptions());
    renderEmployeeCheckboxes(activeEmployees);
    activeEmployees.forEach(({ id, Nome }) => {
      const optionLabel = `ID: ${id} - ${Nome}`;
      deleteEmployeeSelect.add(new Option(optionLabel, String(id)));
    });
    dailyEmployeeSelect.disabled = activeEmployees.length === 0;
    deleteEmployeeSelect.disabled = activeEmployees.length === 0;
    dailyMessageElement.textContent = "";
    dailyMessageElement.classList.remove("form-message--visible");
    deleteMessageElement.textContent = activeEmployees.length === 0
      ? "Não há funcionários cadastrados."
      : "";
    deleteMessageElement.classList.toggle("form-message--visible", activeEmployees.length === 0);
  } catch (error) {
    console.error("Erro ao carregar funcionários.", error);
    dailyEmployeeSelect.replaceChildren(new Option("Erro ao carregar funcionários", ""));
    deleteEmployeeSelect.replaceChildren(new Option("Erro ao carregar funcionários", ""));
    searchEmployeeSelectionElement.textContent = "Erro ao carregar funcionários.";
    searchEmployeeList.textContent = "";
    dailyMessageElement.textContent = formatApiError(
      error,
      "Não foi possível carregar os funcionários.",
    );
    dailyMessageElement.classList.add("form-message--visible");
    deleteMessageElement.textContent = dailyMessageElement.textContent;
    deleteMessageElement.classList.add("form-message--visible");
  }
}

searchEmployeeList.addEventListener("change", (event: Event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  if (target.dataset.selectAllEmployees === "true") {
    searchEmployeeList.querySelectorAll<HTMLInputElement>(
      'input[name="funcionarioIds"]',
    ).forEach((checkbox) => {
      checkbox.checked = target.checked;
    });
  } else if (target.name !== "funcionarioIds") {
    return;
  }

  syncSelectAllEmployeesCheckbox();
  updateEmployeeSelectionLabel();
});

async function loadEmployeesForDeactivation(): Promise<void> {
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
      const option = new Option(`ID: ${id} - ${Nome}${status}`, String(id));
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
    const option = new Option(`ID: ${id} - ${Nome}${status}`, String(id));
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

async function loadAccountTypeEmployees(): Promise<void> {
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

type DailyHistoryEntry = {
  usuarioId: number;
  usuarioNome: string;
  funcionarioId: number;
  funcionarioNome: string;
  dataDiaria: string;
  dataHora: string;
  diaria: number;
  diariaAnterior: number | null;
  tipo: "insert" | "delete" | "update";
};

let dailyHistoryEntries: DailyHistoryEntry[] = [];

function formatDailyHistoryEntry(entry: DailyHistoryEntry): string[] {
  const currencyFormat = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const dateFormat = new Intl.DateTimeFormat("pt-BR");
  const dateTimeFormat = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  });
  return [
    `${entry.usuarioNome} (ID ${entry.usuarioId})`,
    String(entry.funcionarioId),
    entry.funcionarioNome,
    dateFormat.format(new Date(`${entry.dataDiaria}T00:00:00`)),
    dateTimeFormat.format(new Date(entry.dataHora)),
    entry.diariaAnterior === null ? "—" : currencyFormat.format(entry.diariaAnterior),
    entry.tipo === "delete" ? "Excluída" : currencyFormat.format(entry.diaria),
    entry.tipo === "insert"
      ? "Inclusão"
      : entry.tipo === "update"
        ? "Alteração"
        : "Exclusão",
  ];
}

async function loadDailyHistory(): Promise<void> {
  dailyHistoryEntries = [];
  generateDailyHistoryReportButtonElement.disabled = true;
  sectionMessageElement.textContent = "Carregando histórico...";
  sectionMessageElement.hidden = false;

  try {
    const response = await fetch("/api/diarias/historico");
    const result = (await response.json()) as {
      alteracoes?: DailyHistoryEntry[];
      error?: string;
    };
    if (!response.ok || !result.alteracoes) {
      throw new Error(result.error ?? "Não foi possível carregar o histórico de diárias.");
    }

    dailyHistoryEntries = result.alteracoes;
    const rows = result.alteracoes.map((entry) => {
      const row = document.createElement("tr");
      formatDailyHistoryEntry(entry).forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.append(cell);
      });
      return row;
    });
    dailyHistoryBodyElement.replaceChildren(...rows);
    dailyHistoryEmptyElement.hidden = result.alteracoes.length > 0;
    dailyHistoryTableElement.hidden = result.alteracoes.length === 0;
    generateDailyHistoryReportButtonElement.disabled = false;
    sectionMessageElement.hidden = true;
  } catch (error) {
    console.error("Erro ao carregar o histórico de diárias.", error);
    sectionMessageElement.textContent = formatApiError(
      error,
      "Não foi possível carregar o histórico de diárias.",
    );
    sectionMessageElement.hidden = false;
  }
}

async function renderView(currentView: string): Promise<void> {
  if (
    currentAccountType === "Funcionário" &&
    currentView !== "pesquisa" &&
    currentView !== "alterar-senha"
  ) {
    currentView = "pesquisa";
    window.history.replaceState(null, "", `/${currentView}`);
  }

  const section = sections[currentView];
  if (!section) {
    throw new Error(`A página "${currentView}" não foi encontrada.`);
  }

  navItems.forEach((item) => {
    const isCurrent = item.dataset.view === currentView;
    item.hidden = currentAccountType === "Funcionário" &&
      item.dataset.view !== "pesquisa" &&
      item.dataset.view !== "alterar-senha";
    item.classList.toggle("nav-item--active", isCurrent);
    if (isCurrent) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });

  pageTitleElement.textContent = section.title;
  pageDescriptionElement.textContent = currentAccountType === "Funcionário" &&
      currentView === "pesquisa"
    ? "Pesquise as diárias vinculadas à sua conta."
    : section.description;
  searchEmployeeHelpElement.textContent = currentAccountType === "Funcionário"
    ? "Sua conta só pode consultar dados do próprio usuário."
    : "Selecione um ou mais funcionários para pesquisar.";
  document.title = section.title;
  sidebarBrandLinkElement.href =
    currentAccountType === "Funcionário" ? "/pesquisa" : "/cadastro";
  employeeFormElement.hidden = currentView !== "cadastro";
  dailyFormElement.hidden = currentView !== "diaria";
  deleteFormElement.hidden = currentView !== "excluir";
  deactivateFormElement.hidden = currentView !== "desativar";
  searchFormElement.hidden = currentView !== "pesquisa";
  changePasswordFormElement.hidden = currentView !== "alterar-senha";
  accountTypeSectionElement.hidden = currentView !== "tipo-conta";
  dailyHistorySectionElement.hidden = currentView !== "historico-diarias";
  sectionMessageElement.hidden = true;
  cardElement.classList.toggle(
    "card--wide",
    currentView === "diaria" ||
      currentView === "pesquisa" ||
      currentView === "tipo-conta" ||
      currentView === "historico-diarias",
  );
  employeeMessageElement.classList.remove("form-message--visible");
  employeeMessageElement.textContent = "";
  dailyMessageElement.classList.remove("form-message--visible");
  dailyMessageElement.textContent = "";
  deleteMessageElement.classList.remove("form-message--visible");
  deleteMessageElement.textContent = "";
  deactivateMessageElement.classList.remove("form-message--visible");
  deactivateMessageElement.textContent = "";
  searchMessageElement.classList.remove("form-message--visible");
  searchMessageElement.textContent = "";
  changePasswordMessageElement.classList.remove("form-message--visible");
  changePasswordMessageElement.textContent = "";
  accountTypeMessageElement.classList.remove("form-message--visible");
  accountTypeMessageElement.textContent = "";
  searchResultsElement.hidden = true;
  searchResultsBodyElement.replaceChildren();
  dailyHistoryBodyElement.replaceChildren();
  dailyHistoryEmptyElement.hidden = true;
  dailyHistoryTableElement.hidden = true;
  sectionMessageElement.hidden = true;

  if (currentView === "diaria" || currentView === "excluir" || currentView === "pesquisa") {
    setTodayAsDefault();
    await loadEmployees();
  } else if (currentView === "desativar") {
    await loadEmployeesForDeactivation();
  } else if (currentView === "tipo-conta") {
    await loadAccountTypeEmployees();
  } else if (currentView === "historico-diarias") {
    await loadDailyHistory();
  } else {
    dailyFormElement.reset();
    deleteFormElement.reset();
    deactivateFormElement.reset();
    searchFormElement.reset();
    changePasswordFormElement.reset();
  }
}

generateDailyHistoryReportButtonElement.addEventListener("click", () => {
  const headers = [
    "Usuário que modificou",
    "Código do funcionário",
    "Funcionário",
    "Data da diária",
    "Data e hora da modificação",
    "Valor anterior",
    "Valor modificado",
    "Tipo de alteração",
  ];
  const rows = [
    `<Row>${createExcelCell("Histórico de alterações nas diárias")}</Row>`,
    `<Row>${headers.map(createExcelCell).join("")}</Row>`,
    ...dailyHistoryEntries.map((entry) =>
      `<Row>${formatDailyHistoryEntry(entry).map(createExcelCell).join("")}</Row>`
    ),
  ];
  if (dailyHistoryEntries.length === 0) {
    rows.push(
      `<Row>${createExcelCell("Nenhuma alteração de diária foi registrada.")}</Row>`,
    );
  }

  const workbook = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Title>Histórico de alterações nas diárias</Title></DocumentProperties>
  <Worksheet ss:Name="Histórico"><Table>
    ${rows.join("\n    ")}
  </Table></Worksheet>
</Workbook>`;
  const file = new Blob([workbook], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "historico-de-diarias.xls";
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
});

function getCurrentView(): string {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const currentView = routes[path];
  if (
    currentView &&
    (currentAccountType !== "Funcionário" ||
      currentView === "pesquisa" ||
      currentView === "alterar-senha")
  ) {
    return currentView;
  }

  const defaultView = currentAccountType === "Funcionário" ? "pesquisa" : "cadastro";
  window.history.replaceState(null, "", `/${defaultView}`);
  return defaultView;
}

navItems.forEach((navItem) => {
  navItem.addEventListener("click", (event: MouseEvent) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const route = new URL(navItem.href).pathname;
    const view = routes[route];
    if (!view) {
      throw new Error(`A rota "${route}" não foi encontrada.`);
    }

    event.preventDefault();
    window.history.pushState(null, "", route);
    void renderView(view);
  });
});

window.addEventListener("popstate", () => {
  void renderView(getCurrentView());
});

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

deleteEmployeeSelect.addEventListener("change", () => {
  deleteMessageElement.classList.remove("form-message--visible");
  deleteMessageElement.textContent = "";
});

deleteFormElement.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  updateDateLimits();
  const funcionarioId = Number(deleteEmployeeSelect.value);
  const data = deleteDateInput.value;
  if (!funcionarioId || !data) {
    deleteFormElement.reportValidity();
    return;
  }
  if (!isDateNotAfterToday(data)) {
    deleteMessageElement.textContent = "Não é permitido selecionar uma data futura.";
    deleteMessageElement.classList.add("form-message--visible");
    deleteDateInput.reportValidity();
    return;
  }

  const submitButton = deleteFormElement.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!submitButton) {
    throw new Error("Não foi possível carregar o botão de excluir data.");
  }

  submitButton.disabled = true;
  deleteMessageElement.textContent = "Excluindo data...";
  deleteMessageElement.classList.add("form-message--visible");

  try {
    const response = await fetch("/api/diarias/excluir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ funcionarioId, data }),
    });
    const result = (await response.json()) as { error?: string; message?: string };
    if (!response.ok) {
      throw new Error(result.error ?? "Não foi possível excluir os dados.");
    }

    deleteMessageElement.textContent = result.message ?? "Data e diária excluídas com sucesso.";
  } catch (error) {
    console.error("Erro ao excluir data e diária.", error);
    deleteMessageElement.textContent = formatApiError(
      error,
      "Não foi possível excluir os dados.",
    );
  } finally {
    submitButton.disabled = deactivateEmployeeSelect.disabled;
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

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function createExcelCell(value: string | number): string {
  const type = typeof value === "number" ? "Number" : "String";
  return `<Cell><Data ss:Type="${type}">${escapeXml(String(value))}</Data></Cell>`;
}

generateReportButtonElement.addEventListener("click", async () => {
  const funcionarioIds = getSelectedEmployeeIds();
  const { dataInicial, dataFinal } = getSearchDateRange();
  updateDateLimits();
  if (funcionarioIds.length === 0) {
    searchMessageElement.textContent = "Marque pelo menos um funcionário.";
    searchMessageElement.classList.add("form-message--visible");
    return;
  }
  if (
    funcionarioIds.some((id) => !Number.isSafeInteger(id) || id <= 0) ||
    !isValidSearchDateRange(dataInicial, dataFinal)
  ) {
    searchMessageElement.textContent =
      "Informe um período válido, com as duas datas até hoje e a data inicial não posterior à data final.";
    searchMessageElement.classList.add("form-message--visible");
    searchFormElement.reportValidity();
    return;
  }

  generateReportButtonElement.disabled = true;
  searchMessageElement.textContent = "Gerando relatório...";
  searchMessageElement.classList.add("form-message--visible");

  try {
    const response = await fetch("/api/pesquisa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ funcionarioIds, dataInicial, dataFinal }),
    });
    const result = (await response.json()) as {
      registros?: Array<{ Nome: string; Data: string | null; Diaria: number | null }>;
      error?: string;
    };
    if (!response.ok || !result.registros) {
      throw new Error(result.error ?? "Não foi possível gerar o relatório.");
    }

    const employeeNames = Array.from(
      searchEmployeeList.querySelectorAll<HTMLInputElement>(
        'input[name="funcionarioIds"]:checked',
      ),
      (checkbox) => checkbox.dataset.employeeName ?? "",
    );
    if (employeeNames.some((name) => !name)) {
      throw new Error("Não foi possível identificar os funcionários selecionados.");
    }
    const employeeNamesLabel = employeeNames.join(", ");

    const rows = [
      `<Row>${createExcelCell("Funcionário")}${createExcelCell("Data")}${createExcelCell("Diária (R$)")}</Row>`,
      ...result.registros.map(({ Nome, Data, Diaria }) => {
        const date = Data
          ? new Date(`${Data}T00:00:00`).toLocaleDateString("pt-BR")
          : "Sem diária cadastrada";
        const amount = Diaria === null ? createExcelCell("") : createExcelCell(Diaria);
        return `<Row>${createExcelCell(Nome)}${createExcelCell(date)}${amount}</Row>`;
      }),
    ];
    if (result.registros.length === 0) {
      rows.push(`<Row>${createExcelCell("Nenhum dado encontrado para os filtros selecionados.")}</Row>`);
    }

    const workbook = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Title>Relatório de funcionários</Title><Subject>${escapeXml(employeeNamesLabel)}</Subject></DocumentProperties>
  <Worksheet ss:Name="Relatório"><Table>
    <Row>${createExcelCell("Relatório de funcionários")}</Row>
    <Row>${createExcelCell("Funcionários")}${createExcelCell(employeeNamesLabel)}</Row>
    <Row>${createExcelCell("Período")}${createExcelCell(
      dataInicial && dataFinal
        ? `${new Date(`${dataInicial}T00:00:00`).toLocaleDateString("pt-BR")} a ${new Date(`${dataFinal}T00:00:00`).toLocaleDateString("pt-BR")}`
        : "Todas as datas",
    )}</Row>
    ${rows.join("\n    ")}
  </Table></Worksheet>
</Workbook>`;
    const file = new Blob([workbook], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");
    const safeEmployeeNames = employeeNames.join("-").replace(/[<>:"/\\|?*]/g, "_").trim();
    downloadLink.href = url;
    downloadLink.download = `relatorio-${safeEmployeeNames || "funcionarios"}.xls`;
    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    searchMessageElement.textContent = "Relatório Excel gerado com sucesso.";
  } catch (error) {
    console.error("Erro ao gerar relatório Excel.", error);
    searchMessageElement.textContent = formatApiError(
      error,
      "Não foi possível gerar o relatório.",
    );
  } finally {
    generateReportButtonElement.disabled = false;
  }
});

form.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  const employeeName = nameInput.value.trim();
  if (!employeeName) {
    nameInput.focus();
    return;
  }

  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!submitButton) {
    throw new Error("Não foi possível carregar o botão de salvar.");
  }

  submitButton.disabled = true;
  message.textContent = "Salvando funcionário...";
  message.classList.add("form-message--visible");

  try {
    const response = await fetch("/api/funcionarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Nome: employeeName,
        senhaTemporaria: employeeTemporaryPasswordInput.value,
      }),
    });

    let result = (await response.json()) as {
      Nome?: string;
      error?: string;
    };

    if (!response.ok) {
      throw new Error(result.error ?? "Não foi possível salvar o funcionário.");
    }

    message.textContent = `Funcionário ${result.Nome ?? employeeName} salvo com sucesso.`;
    form.reset();
  } catch (error) {
    console.error("Erro ao salvar funcionário.", error);
    message.textContent = formatApiError(
      error,
      "Não foi possível salvar o funcionário.",
    );
  } finally {
    submitButton.disabled = false;
  }
});

dailyFormElement.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  updateDateLimits();
  const funcionarioId = Number(dailyEmployeeSelect.value);
  const data = dailyDateInput.value;
  const diaria = Number(dailyAmountInput.value);
  if (!funcionarioId || !data || !Number.isFinite(diaria) || diaria <= 0) {
    dailyFormElement.reportValidity();
    return;
  }
  if (!isDateNotAfterToday(data)) {
    dailyMessageElement.textContent = "Não é permitido lançar diária em uma data futura.";
    dailyMessageElement.classList.add("form-message--visible");
    dailyDateInput.reportValidity();
    return;
  }

  const submitButton = dailyFormElement.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!submitButton) {
    throw new Error("Não foi possível carregar o botão de salvar a diária.");
  }

  submitButton.disabled = true;
  dailyMessageElement.textContent = "Salvando diária...";
  dailyMessageElement.classList.add("form-message--visible");

  try {
    const response = await fetch("/api/diarias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ funcionarioId, data, diaria }),
    });

    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      throw new Error(result.error ?? "Não foi possível salvar a diária.");
    }

    dailyMessageElement.textContent = "Diária salva com sucesso.";
    dailyAmountInput.value = "";
    dailyEmployeeSelect.focus();
  } catch (error) {
    console.error("Erro ao salvar diária.", error);
    dailyMessageElement.textContent = formatApiError(
      error,
      "Não foi possível salvar a diária.",
    );
  } finally {
    submitButton.disabled = false;
  }
});

searchFormElement.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  const funcionarioIds = getSelectedEmployeeIds();
  const { dataInicial, dataFinal } = getSearchDateRange();
  updateDateLimits();
  if (funcionarioIds.length === 0) {
    searchMessageElement.textContent = "Marque pelo menos um funcionário.";
    searchMessageElement.classList.add("form-message--visible");
    return;
  }
  if (
    funcionarioIds.some((id) => !Number.isSafeInteger(id) || id <= 0) ||
    !isValidSearchDateRange(dataInicial, dataFinal)
  ) {
    searchMessageElement.textContent =
      "Informe um período válido, com as duas datas até hoje e a data inicial não posterior à data final.";
    searchMessageElement.classList.add("form-message--visible");
    searchFormElement.reportValidity();
    return;
  }

  const submitButton = searchFormElement.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  );
  if (!submitButton) {
    throw new Error("Não foi possível carregar o botão de pesquisa.");
  }

  submitButton.disabled = true;
  searchResultsElement.hidden = true;
  searchMessageElement.textContent = "Pesquisando...";
  searchMessageElement.classList.add("form-message--visible");

  try {
    const response = await fetch("/api/pesquisa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ funcionarioIds, dataInicial, dataFinal }),
    });
    const result = (await response.json()) as {
      registros?: Array<{ Nome: string; Data: string | null; Diaria: number | null }>;
      error?: string;
    };
    if (!response.ok || !result.registros) {
      throw new Error(result.error ?? "Não foi possível pesquisar os dados.");
    }

    searchMessageElement.classList.remove("form-message--visible");
    searchMessageElement.textContent = "";
    searchResultsBodyElement.replaceChildren();

    if (result.registros.length === 0) {
      searchResultsEmptyElement.hidden = false;
      searchResultsTableElement.hidden = true;
    } else {
      searchResultsEmptyElement.hidden = true;
      searchResultsTableElement.hidden = false;
      result.registros.forEach(({ Nome, Data, Diaria }) => {
        const row = document.createElement("tr");
        const employeeCell = document.createElement("td");
        const dateCell = document.createElement("td");
        const amountCell = document.createElement("td");
        employeeCell.textContent = Nome;
        dateCell.textContent = Data
          ? new Date(`${Data}T00:00:00`).toLocaleDateString("pt-BR")
          : "Sem diária cadastrada";
        amountCell.textContent = Diaria === null
          ? "—"
          : new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Diaria);
        row.append(employeeCell, dateCell, amountCell);
        searchResultsBodyElement.append(row);
      });
    }
    searchResultsElement.hidden = false;
  } catch (error) {
    console.error("Erro ao pesquisar dados do funcionário.", error);
    searchMessageElement.textContent = formatApiError(
      error,
      "Não foi possível pesquisar os dados.",
    );
    searchMessageElement.classList.add("form-message--visible");
  } finally {
    submitButton.disabled = false;
  }
});

changePasswordFormElement.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();
  changePasswordMessageElement.classList.remove("form-message--visible");
  changePasswordMessageElement.textContent = "";
  if (changeNewPasswordInputElement.value !== changeConfirmPasswordInputElement.value) {
    changePasswordMessageElement.textContent = "As senhas informadas não coincidem.";
    changePasswordMessageElement.classList.add("form-message--visible");
    changeConfirmPasswordInputElement.focus();
    return;
  }

  const submitButton = changePasswordFormElement.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  );
  if (!submitButton) {
    throw new Error("Não foi possível carregar o botão para alterar a senha.");
  }
  submitButton.disabled = true;
  changePasswordMessageElement.textContent = "Atualizando senha...";
  changePasswordMessageElement.classList.add("form-message--visible");

  try {
    const response = await fetch("/api/auth/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senhaAtual: currentPasswordInputElement.value,
        novaSenha: changeNewPasswordInputElement.value,
      }),
    });
    const result = (await response.json()) as { message?: string; error?: string };
    if (!response.ok) {
      throw new Error(result.error ?? "Não foi possível atualizar a senha.");
    }

    changePasswordFormElement.reset();
    changePasswordMessageElement.textContent = result.message ?? "Senha atualizada com sucesso.";
  } catch (error) {
    console.error("Erro ao alterar a senha.", error);
    changePasswordMessageElement.textContent = formatApiError(
      error,
      "Não foi possível atualizar a senha.",
    );
  } finally {
    changePasswordMessageElement.classList.add("form-message--visible");
    submitButton.disabled = false;
  }
});

type SetupEmployeesResponse = {
  funcionarios?: Array<{ id: number; Nome: string }>;
  primeiroAcesso?: boolean;
  error?: string;
};

function showLogin(message = ""): void {
  appElement.hidden = true;
  authScreenElement.hidden = false;
  currentAccountType = null;
  currentEmployeeId = null;
  currentEmployeeName = null;
  updateSidebarUser();
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
  await renderView(getCurrentView());
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
    setupEmployeeSelect.add(new Option(`ID: ${id} - ${Nome}`, String(id)));
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
    currentAccountType = result.TipoConta;
    currentEmployeeId = result.id;
    currentEmployeeName = result.funcionario;
    updateSidebarUser();
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

async function initializeAuthentication(): Promise<void> {
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
      const session = (await response.json()) as {
        id?: number;
        funcionario?: string;
        precisaTrocarSenha?: boolean;
        TipoConta?: AccountType;
        error?: string;
      };
      if (session.TipoConta !== "Funcionário" && session.TipoConta !== "ADM") {
        throw new Error("O servidor não informou um tipo de conta válido.");
      }
      if (
        typeof session.id !== "number" ||
        !Number.isSafeInteger(session.id) ||
        typeof session.funcionario !== "string"
      ) {
        throw new Error("O servidor não informou o usuário conectado.");
      }
      currentAccountType = session.TipoConta;
      currentEmployeeId = session.id;
      currentEmployeeName = session.funcionario;
      updateSidebarUser();
      if (session.precisaTrocarSenha) {
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

void initializeAuthentication();
