import "../styles/style.css";

const form = document.querySelector<HTMLFormElement>("#employee-form");
const dailyForm = document.querySelector<HTMLFormElement>("#daily-form");
const deleteForm = document.querySelector<HTMLFormElement>("#delete-form");
const searchForm = document.querySelector<HTMLFormElement>("#search-form");
const generateReportButton = document.querySelector<HTMLButtonElement>("#generate-report");
const searchMessage = document.querySelector<HTMLParagraphElement>("#search-form-message");
const searchMonth = document.querySelector<HTMLSelectElement>("#search-month");
const searchResults = document.querySelector<HTMLElement>("#search-results");
const searchResultsEmpty = document.querySelector<HTMLParagraphElement>("#search-results-empty");
const searchResultsTable = document.querySelector<HTMLDivElement>("#search-results-table-wrapper");
const searchResultsBody = document.querySelector<HTMLTableSectionElement>("#search-results-body");
const nameInput = document.querySelector<HTMLInputElement>("#employee-name");
const message = document.querySelector<HTMLParagraphElement>("#form-message");
const dailyMessage = document.querySelector<HTMLParagraphElement>("#daily-form-message");
const deleteMessage = document.querySelector<HTMLParagraphElement>("#delete-form-message");
const dailyEmployee = document.querySelector<HTMLSelectElement>("#daily-employee");
const deleteEmployee = document.querySelector<HTMLSelectElement>("#delete-employee");
const searchEmployee = document.querySelector<HTMLSelectElement>("#search-employee");
const dailyDate = document.querySelector<HTMLInputElement>("#daily-date");
const deleteDate = document.querySelector<HTMLInputElement>("#delete-date");
const dailyAmount = document.querySelector<HTMLInputElement>("#daily-amount");
const card = document.querySelector<HTMLElement>(".card");
const pageTitle = document.querySelector<HTMLHeadingElement>("#page-title");
const pageDescription = document.querySelector<HTMLParagraphElement>("#page-description");
const sectionMessage = document.querySelector<HTMLParagraphElement>("#section-message");
const navItems = document.querySelectorAll<HTMLAnchorElement>(".nav-item");

if (
  !form || !dailyForm || !deleteForm || !searchForm || !generateReportButton ||
  !nameInput || !message ||
  !dailyMessage || !deleteMessage || !dailyEmployee || !deleteEmployee || !searchEmployee ||
  !searchMessage || !searchMonth || !searchResults || !searchResultsEmpty ||
  !searchResultsTable || !searchResultsBody || !dailyDate || !deleteDate ||
  !dailyAmount || !pageTitle || !pageDescription ||
  !sectionMessage || !card
) {
  throw new Error("Não foi possível carregar os elementos do formulário.");
}

const dailyFormElement = dailyForm;
const deleteFormElement = deleteForm;
const searchFormElement = searchForm;
const employeeFormElement = form;
const employeeMessageElement = message;
const generateReportButtonElement = generateReportButton;
const searchMessageElement = searchMessage;
const searchResultsElement = searchResults;
const searchResultsEmptyElement = searchResultsEmpty;
const searchResultsTableElement = searchResultsTable;
const searchResultsBodyElement = searchResultsBody;
const dailyMessageElement = dailyMessage;
const deleteMessageElement = deleteMessage;
const dailyEmployeeSelect = dailyEmployee;
const deleteEmployeeSelect = deleteEmployee;
const searchEmployeeSelect = searchEmployee;
const dailyDateInput = dailyDate;
const deleteDateInput = deleteDate;
const dailyAmountInput = dailyAmount;
const cardElement = card;
const pageTitleElement = pageTitle;
const pageDescriptionElement = pageDescription;
const sectionMessageElement = sectionMessage;

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
  pesquisa: {
    title: "Pesquisa",
    description: "Selecione um funcionário e o mês que deseja consultar.",
  },
};

const routes: Record<string, string> = {
  "/cadastro": "cadastro",
  "/diaria": "diaria",
  "/excluir-dados": "excluir",
  "/pesquisa": "pesquisa",
};

function setTodayAsDefault(): void {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  dailyDateInput.value = localDate.toISOString().slice(0, 10);
}

async function loadEmployees(): Promise<void> {
  const loadingOption = () => new Option("Carregando funcionários...", "");
  dailyEmployeeSelect.replaceChildren(loadingOption());
  deleteEmployeeSelect.replaceChildren(loadingOption());
  searchEmployeeSelect.replaceChildren(loadingOption());
  dailyEmployeeSelect.disabled = true;
  deleteEmployeeSelect.disabled = true;
  searchEmployeeSelect.disabled = true;

  try {
    const response = await fetch("/api/funcionarios");
    const result = (await response.json()) as {
      funcionarios?: Array<{ id: number; Nome: string }>;
      error?: string;
    };
    if (!response.ok || !result.funcionarios) {
      throw new Error(result.error ?? "Não foi possível carregar os funcionários.");
    }

    const makeOptions = () => new Option("Selecione um funcionário", "");
    dailyEmployeeSelect.replaceChildren(makeOptions());
    deleteEmployeeSelect.replaceChildren(makeOptions());
    searchEmployeeSelect.replaceChildren(makeOptions());
    result.funcionarios.forEach(({ id, Nome }) => {
      dailyEmployeeSelect.add(new Option(Nome, String(id)));
      deleteEmployeeSelect.add(new Option(Nome, String(id)));
      searchEmployeeSelect.add(new Option(Nome, String(id)));
    });
    dailyEmployeeSelect.disabled = result.funcionarios.length === 0;
    deleteEmployeeSelect.disabled = result.funcionarios.length === 0;
    searchEmployeeSelect.disabled = result.funcionarios.length === 0;
    dailyMessageElement.textContent = result.funcionarios.length === 0
      ? "Cadastre um funcionário antes de lançar uma diária."
      : "";
    dailyMessageElement.classList.toggle("form-message--visible", result.funcionarios.length === 0);
    deleteMessageElement.textContent = result.funcionarios.length === 0
      ? "Não há funcionários cadastrados."
      : "";
    deleteMessageElement.classList.toggle("form-message--visible", result.funcionarios.length === 0);
  } catch (error) {
    console.error("Erro ao carregar funcionários.", error);
    dailyEmployeeSelect.replaceChildren(new Option("Erro ao carregar funcionários", ""));
    deleteEmployeeSelect.replaceChildren(new Option("Erro ao carregar funcionários", ""));
    searchEmployeeSelect.replaceChildren(new Option("Erro ao carregar funcionários", ""));
    dailyMessageElement.textContent = error instanceof Error
      ? error.message
      : "Não foi possível carregar os funcionários.";
    dailyMessageElement.classList.add("form-message--visible");
    deleteMessageElement.textContent = dailyMessageElement.textContent;
    deleteMessageElement.classList.add("form-message--visible");
  }
}

async function renderView(currentView: string): Promise<void> {
  const section = sections[currentView];
  if (!section) {
    throw new Error(`A página "${currentView}" não foi encontrada.`);
  }

  navItems.forEach((item) => {
    const isCurrent = item.dataset.view === currentView;
    item.classList.toggle("nav-item--active", isCurrent);
    if (isCurrent) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });

  pageTitleElement.textContent = section.title;
  pageDescriptionElement.textContent = section.description;
  document.title = section.title;
  employeeFormElement.hidden = currentView !== "cadastro";
  dailyFormElement.hidden = currentView !== "diaria";
  deleteFormElement.hidden = currentView !== "excluir";
  searchFormElement.hidden = currentView !== "pesquisa";
  sectionMessageElement.hidden = true;
  cardElement.classList.toggle("card--wide", currentView === "diaria" || currentView === "pesquisa");
  employeeMessageElement.classList.remove("form-message--visible");
  employeeMessageElement.textContent = "";
  dailyMessageElement.classList.remove("form-message--visible");
  dailyMessageElement.textContent = "";
  deleteMessageElement.classList.remove("form-message--visible");
  deleteMessageElement.textContent = "";
  searchMessageElement.classList.remove("form-message--visible");
  searchMessageElement.textContent = "";
  searchResultsElement.hidden = true;
  searchResultsBodyElement.replaceChildren();

  if (currentView === "diaria" || currentView === "excluir" || currentView === "pesquisa") {
    setTodayAsDefault();
    await loadEmployees();
  } else {
    dailyFormElement.reset();
    deleteFormElement.reset();
    searchFormElement.reset();
  }
}

function getCurrentView(): string {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const currentView = routes[path];
  if (currentView) return currentView;

  window.history.replaceState(null, "", "/cadastro");
  return "cadastro";
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

void renderView(getCurrentView());

deleteEmployeeSelect.addEventListener("change", () => {
  deleteMessageElement.classList.remove("form-message--visible");
  deleteMessageElement.textContent = "";
});

deleteFormElement.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  const funcionarioId = Number(deleteEmployeeSelect.value);
  const data = deleteDateInput.value;
  if (!funcionarioId || !data) {
    deleteFormElement.reportValidity();
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
    deleteMessageElement.textContent = error instanceof Error
      ? error.message
      : "Não foi possível excluir os dados.";
  } finally {
    submitButton.disabled = false;
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
  const funcionarioId = Number(searchEmployeeSelect.value);
  const mes = searchMonth.value;
  if (!funcionarioId || (mes !== "" && !/^(0[1-9]|1[0-2])$/.test(mes))) {
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
      body: JSON.stringify({ funcionarioId, mes }),
    });
    const result = (await response.json()) as {
      registros?: Array<{ Nome: string; Data: string | null; Diaria: number | null }>;
      error?: string;
    };
    if (!response.ok || !result.registros) {
      throw new Error(result.error ?? "Não foi possível gerar o relatório.");
    }

    const employeeName = searchEmployeeSelect.selectedOptions[0]?.textContent?.trim();
    if (!employeeName) {
      throw new Error("Não foi possível identificar o funcionário selecionado.");
    }

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
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Title>Relatório de funcionário</Title><Subject>${escapeXml(employeeName)}</Subject></DocumentProperties>
  <Worksheet ss:Name="Relatório"><Table>
    <Row>${createExcelCell("Relatório de funcionário")}</Row>
    <Row>${createExcelCell("Funcionário")}${createExcelCell(employeeName)}</Row>
    <Row>${createExcelCell("Mês")}${createExcelCell(searchMonth.selectedOptions[0]?.textContent?.trim() ?? "Todos os meses")}</Row>
    ${rows.join("\n    ")}
  </Table></Worksheet>
</Workbook>`;
    const file = new Blob([workbook], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");
    const safeEmployeeName = employeeName.replace(/[<>:"/\\|?*]/g, "_").trim();
    downloadLink.href = url;
    downloadLink.download = `relatorio-${safeEmployeeName || "funcionario"}.xls`;
    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    searchMessageElement.textContent = "Relatório Excel gerado com sucesso.";
  } catch (error) {
    console.error("Erro ao gerar relatório Excel.", error);
    searchMessageElement.textContent = error instanceof Error
      ? error.message
      : "Não foi possível gerar o relatório.";
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
      body: JSON.stringify({ Nome: employeeName }),
    });

    const result = (await response.json()) as { Nome?: string; error?: string };

    if (!response.ok) {
      throw new Error(result.error ?? "Não foi possível salvar o funcionário.");
    }

    message.textContent = `Funcionário ${result.Nome ?? employeeName} salvo com sucesso.`;
    form.reset();
  } catch (error) {
    console.error("Erro ao salvar funcionário.", error);
    message.textContent = error instanceof Error
      ? error.message
      : "Não foi possível salvar o funcionário.";
  } finally {
    submitButton.disabled = false;
  }
});

dailyFormElement.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  const funcionarioId = Number(dailyEmployeeSelect.value);
  const data = dailyDateInput.value;
  const diaria = Number(dailyAmountInput.value);
  if (!funcionarioId || !data || !Number.isFinite(diaria) || diaria <= 0) {
    dailyFormElement.reportValidity();
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
    dailyMessageElement.textContent = error instanceof Error
      ? error.message
      : "Não foi possível salvar a diária.";
  } finally {
    submitButton.disabled = false;
  }
});

searchFormElement.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  const funcionarioId = Number(searchEmployeeSelect.value);
  const mes = searchMonth.value;
  if (!funcionarioId || (mes !== "" && !/^(0[1-9]|1[0-2])$/.test(mes))) {
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
      body: JSON.stringify({ funcionarioId, mes }),
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
    searchMessageElement.textContent = error instanceof Error
      ? error.message
      : "Não foi possível pesquisar os dados.";
    searchMessageElement.classList.add("form-message--visible");
  } finally {
    submitButton.disabled = false;
  }
});
