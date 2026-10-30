import { initializeAuthentication } from "./components/auth";
import { loadAccountTypeEmployees, loadEmployeesForDeactivation } from "./components/employees";
import { session } from "./state/session";
import { formatApiError } from "./utils/errors";

export function initializeLegacyUI(): void {
  
  const form = document.querySelector<HTMLFormElement>("#employee-form");
  
  const sidebarUserName = document.querySelector<HTMLElement>("#sidebar-user-name");
  const sidebarUserType = document.querySelector<HTMLElement>("#sidebar-user-type");
  const employeeTemporaryPassword = document.querySelector<HTMLInputElement>(
    "#employee-temporary-password",
  );
  const dailyForm = document.querySelector<HTMLFormElement>("#daily-form");
  const deleteForm = document.querySelector<HTMLFormElement>("#delete-form");
  const deactivateForm = document.querySelector<HTMLFormElement>("#deactivate-form");
  const deactivateEmployee = document.querySelector<HTMLSelectElement>("#deactivate-employee");
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
  const accountTypeMessage = document.querySelector<HTMLParagraphElement>("#account-type-message");
  const dailyHistorySection = document.querySelector<HTMLElement>("#daily-history-section");
  const dailyHistoryEmpty = document.querySelector<HTMLParagraphElement>("#daily-history-empty");
  const dailyHistoryTable = document.querySelector<HTMLDivElement>("#daily-history-table-wrapper");
  const dailyHistoryBody = document.querySelector<HTMLTableSectionElement>("#daily-history-body");
  const generateDailyHistoryReportButton = document.querySelector<HTMLButtonElement>(
    "#generate-daily-history-report",
  );
  const dailyHistorySearchForm = document.querySelector<HTMLFormElement>(
    "#daily-history-search-form",
  );
  const dailyHistoryStartDate = document.querySelector<HTMLInputElement>(
    "#daily-history-start-date",
  );
  const dailyHistoryEndDate = document.querySelector<HTMLInputElement>(
    "#daily-history-end-date",
  );
  const nameInput = document.querySelector<HTMLInputElement>("#employee-name");
  const message = document.querySelector<HTMLParagraphElement>("#form-message");
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
  if (
    !sidebarUserName || !sidebarUserType || !employeeTemporaryPassword ||
    !form || !dailyForm || !deleteForm || !deactivateForm || !deactivateEmployee ||
    !deactivateMessage ||
    !searchForm || !generateReportButton ||
    !changePasswordForm || !currentPasswordInput || !changeNewPasswordInput ||
    !changeConfirmPasswordInput || !changePasswordMessage ||
    !nameInput || !message ||
    !dailyMessage || !deleteMessage || !dailyEmployee || !deleteEmployee || !searchEmployee ||
    !searchEmployeeDropdown || !searchEmployeeSelection || !searchEmployeeHelp ||
    !searchMessage || !searchStartDate || !searchEndDate || !searchResults || !searchResultsEmpty ||
    !searchResultsTable || !searchResultsBody || !dailyDate || !deleteDate ||
    !accountTypeSection || !accountTypeMessage ||
    !dailyHistorySection || !dailyHistoryEmpty || !dailyHistoryTable || !dailyHistoryBody ||
    !generateDailyHistoryReportButton || !dailyHistorySearchForm || !dailyHistoryStartDate ||
    !dailyHistoryEndDate ||
    !dailyAmount || !pageTitle || !pageDescription ||
    !sectionMessage || !card || !sidebarBrandLink
  ) {
    throw new Error("Não foi possível carregar os elementos do formulário.");
  }
  
  const sidebarUserNameElement = sidebarUserName;
  const sidebarUserTypeElement = sidebarUserType;
  const employeeTemporaryPasswordInput = employeeTemporaryPassword;
  
  const dailyFormElement = dailyForm;
  const deleteFormElement = deleteForm;
  const deactivateFormElement = deactivateForm;
  const deactivateEmployeeSelect = deactivateEmployee;
  const deactivateMessageElement = deactivateMessage;
  const searchFormElement = searchForm;
  const changePasswordFormElement = changePasswordForm;
  const currentPasswordInputElement = currentPasswordInput;
  const changeNewPasswordInputElement = changeNewPasswordInput;
  const changeConfirmPasswordInputElement = changeConfirmPasswordInput;
  const changePasswordMessageElement = changePasswordMessage;
  const employeeFormElement = form;
  const employeeMessageElement = message;
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
  const accountTypeMessageElement = accountTypeMessage;
  const dailyHistorySectionElement = dailyHistorySection;
  const dailyHistoryEmptyElement = dailyHistoryEmpty;
  const dailyHistoryTableElement = dailyHistoryTable;
  const dailyHistoryBodyElement = dailyHistoryBody;
  const generateDailyHistoryReportButtonElement = generateDailyHistoryReportButton;
  const dailyHistorySearchFormElement = dailyHistorySearchForm;
  const dailyHistoryStartDateInput = dailyHistoryStartDate;
  const dailyHistoryEndDateInput = dailyHistoryEndDate;
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
    sidebarUserNameElement.textContent = session.employeeName ?? "";
    sidebarUserTypeElement.textContent = session.accountType ?? "";
    sidebarUserTypeElement.hidden = session.accountType === null;
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
    dailyHistoryStartDateInput.max = today;
    dailyHistoryEndDateInput.max = today;
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
    employees: Array<{ id: number; Nome: string; Ativo: number }>,
  ): void {
    const visibleEmployees = session.accountType === "Funcionário"
      ? employees.filter(({ id }) => id === session.employeeId)
      : employees;
    if (session.accountType === "Funcionário" && visibleEmployees.length !== 1) {
      throw new Error("Não foi possível carregar o usuário conectado para a pesquisa.");
    }
    const options: HTMLElement[] = [];
    if (session.accountType !== "Funcionário" && visibleEmployees.length > 0) {
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
    options.push(...visibleEmployees.map(({ id, Nome, Ativo }) => {
      const label = document.createElement("label");
      label.className = "employee-checkbox";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "funcionarioIds";
      checkbox.value = String(id);
      checkbox.dataset.employeeName = Nome;
      if (session.accountType === "Funcionário") {
        checkbox.checked = true;
        checkbox.disabled = true;
      }
      const name = document.createElement("span");
      name.textContent = `${Nome}${Ativo === 1 ? "" : " (Desativado)"}`;
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
    if (session.accountType === "Funcionário") {
      searchEmployeeSelectionElement.textContent = session.employeeName ?? "Seu usuário";
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
        dailyEmployeeSelect.add(new Option(Nome, String(id)));
      });
      deleteEmployeeSelect.replaceChildren(makeOptions());
      renderEmployeeCheckboxes(result.funcionarios);
      activeEmployees.forEach(({ id, Nome }) => {
        deleteEmployeeSelect.add(new Option(Nome, String(id)));
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
    const dataInicial = dailyHistoryStartDateInput.value;
    const dataFinal = dailyHistoryEndDateInput.value;
    dailyHistoryEntries = [];
    generateDailyHistoryReportButtonElement.disabled = true;
    dailyHistoryBodyElement.replaceChildren();
    dailyHistoryEmptyElement.hidden = true;
    dailyHistoryTableElement.hidden = true;
    if (!isValidSearchDateRange(dataInicial, dataFinal)) {
      sectionMessageElement.textContent =
        "Informe as duas datas do período, até hoje, com a data inicial não posterior à data final.";
      sectionMessageElement.hidden = false;
      return;
    }
  
    const searchButton = dailyHistorySearchFormElement.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    );
    if (!searchButton) {
      throw new Error("Não foi possível carregar o botão de pesquisa do histórico.");
    }
    searchButton.disabled = true;
    sectionMessageElement.textContent = "Carregando histórico...";
    sectionMessageElement.hidden = false;
  
    try {
      const query = new URLSearchParams();
      if (dataInicial && dataFinal) {
        query.set("dataInicial", dataInicial);
        query.set("dataFinal", dataFinal);
      }
      const response = await fetch(
        `/api/diarias/historico${query.size > 0 ? `?${query.toString()}` : ""}`,
      );
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
    } finally {
      searchButton.disabled = false;
    }
  }
  
  dailyHistorySearchFormElement.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();
    updateDateLimits();
    void loadDailyHistory();
  });
  
  async function renderView(currentView: string): Promise<void> {
    if (
      session.accountType === "Funcionário" &&
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
      item.hidden = session.accountType === "Funcionário" &&
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
    pageDescriptionElement.textContent = session.accountType === "Funcionário" &&
        currentView === "pesquisa"
      ? "Pesquise as diárias vinculadas à sua conta."
      : section.description;
    searchEmployeeHelpElement.textContent = session.accountType === "Funcionário"
      ? "Sua conta só pode consultar dados do próprio usuário."
      : "Selecione um ou mais funcionários para pesquisar.";
    document.title = section.title;
    sidebarBrandLinkElement.href =
      session.accountType === "Funcionário" ? "/pesquisa" : "/cadastro";
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
      (session.accountType !== "Funcionário" ||
        currentView === "pesquisa" ||
        currentView === "alterar-senha")
    ) {
      return currentView;
    }
  
    const defaultView = session.accountType === "Funcionário" ? "pesquisa" : "cadastro";
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
  
  initializeAuthentication({ renderView, getCurrentView, updateSidebarUser });
  
}
