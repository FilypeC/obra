import { useEffect } from "react";
import "../styles/style.css";

export default function App() {
  useEffect(() => {
    void import("./legacy").then(({ initializeLegacyUI }) => initializeLegacyUI());
  }, []);

  return (
    <>
      
          <Auth />
          <Workspace />
          <DeactivationDialog />
        
    </>
  );
}

function Auth() {
  return (
    <>
      <main id="auth-screen" className="auth-screen">
            <section className="card auth-card" aria-labelledby="auth-title">
              <img className="card__logo" src="/decade.png" alt="" />
              <p className="card__eyebrow">GESTÃO DE EQUIPE</p>
              <h1 id="auth-title">Entrar</h1>
              <p id="auth-description" className="card__description">
                Use seu nome de funcionário e sua senha para acessar o sistema.
              </p>
              <form id="login-form">
                <label htmlFor="login-name">Login (nome do funcionário)</label>
                <input id="login-name" name="login" type="text" autoComplete="username" required />
                <label htmlFor="login-password">Senha</label>
                <input id="login-password" name="senha" type="password" autoComplete="current-password" required />
                <button type="submit">Entrar</button>
                <p id="login-message" className="form-message" role="status" aria-live="polite"></p>
              </form>
              <form id="password-form" hidden>
                <label htmlFor="new-password">Nova senha</label>
                <input id="new-password" name="novaSenha" type="password" autoComplete="new-password" minLength={8} required />
                <label htmlFor="confirm-password">Confirme a nova senha</label>
                <input id="confirm-password" name="confirmacao" type="password" autoComplete="new-password" minLength={8} required />
                <button type="submit">Salvar nova senha</button>
                <p id="password-message" className="form-message" role="status" aria-live="polite"></p>
              </form>
              <details id="setup-details" className="setup-details" hidden>
                <summary>Configuração inicial</summary>
                <p className="field-help">
                  O responsável pelo sistema deve informar o token exibido no terminal do servidor.
                </p>
                <form id="setup-token-form">
                  <label htmlFor="setup-token">Token de configuração</label>
                  <input id="setup-token" name="setupToken" type="password" autoComplete="off" required />
                  <button type="submit">Validar token</button>
                  <p id="setup-token-message" className="form-message" role="status" aria-live="polite"></p>
                </form>
                <form id="setup-account-form" hidden>
                  <div id="setup-employee-field" className="field" hidden>
                    <label htmlFor="setup-employee">Funcionário sem senha</label>
                    <select id="setup-employee" name="funcionarioId" required></select>
                  </div>
                  <div id="setup-name-field" className="field" hidden>
                    <label htmlFor="setup-name">Nome do primeiro funcionário</label>
                    <input id="setup-name" name="Nome" type="text" maxLength={150} autoComplete="name" />
                  </div>
                  <label htmlFor="setup-password">Senha temporária</label>
                  <input id="setup-password" name="senhaTemporaria" type="password" minLength={8} autoComplete="new-password" required />
                  <button type="submit">Definir senha temporária</button>
                  <p id="setup-account-message" className="form-message" role="status" aria-live="polite"></p>
                </form>
              </details>
            </section>
          </main>
    </>
  );
}

function Workspace() {
  return (
    <>
      <div id="app" className="app" hidden>
            <aside className="sidebar">
              <a className="sidebar__brand" href="/cadastro" aria-label="Gestão de equipe">
                <img className="sidebar__brand-logo" src="/decade.png" alt="" />
                <span>Gestão de equipe</span>
              </a>
              <div className="sidebar__user" aria-label="Usuário conectado">
                <span className="sidebar__user-label">Conectado como</span>
                <strong id="sidebar-user-name" className="sidebar__user-name"></strong>
                <span id="sidebar-user-type" className="sidebar__user-type"></span>
              </div>
              <nav className="sidebar__nav" aria-label="Menu principal">
                <a className="nav-item" href="/cadastro" data-view="cadastro">
                  <span className="nav-item__icon" aria-hidden="true">+</span>
                  <span>Cadastro</span>
                </a>
                <a className="nav-item" href="/diaria" data-view="diaria">
                  <span className="nav-item__icon" aria-hidden="true">$</span>
                  <span>Diaria</span>
                </a>
                <a className="nav-item" href="/excluir-dados" data-view="excluir">
                  <span className="nav-item__icon" aria-hidden="true">−</span>
                  <span>Excluir dados</span>
                </a>
                <a className="nav-item" href="/desativar-funcionario" data-view="desativar">
                  <span className="nav-item__icon" aria-hidden="true">×</span>
                  <span>Desativar e reativar funcionários</span>
                </a>
                <a className="nav-item" href="/pesquisa" data-view="pesquisa">
                  <span className="nav-item__icon" aria-hidden="true">⌕</span>
                  <span>Pesquisa</span>
                </a>
                <a className="nav-item" href="/alterar-senha" data-view="alterar-senha">
                  <span className="nav-item__icon" aria-hidden="true">*</span>
                  <span>Alterar senha</span>
                </a>
                <a className="nav-item" href="/tipo-de-conta" data-view="tipo-conta">
                  <span className="nav-item__icon" aria-hidden="true">◉</span>
                  <span>Tipo de conta</span>
                </a>
                <a className="nav-item" href="/historico-diarias" data-view="historico-diarias">
                  <span className="nav-item__icon" aria-hidden="true">↻</span>
                  <span>Histórico de diárias</span>
                </a>
              </nav>
              <button id="logout-button" className="button-secondary button--compact" type="button">Sair</button>
              <p className="sidebar__footer">Cadastro de funcionários</p>
            </aside>
      
            <main className="page">
              <section className="card" aria-labelledby="page-title">
                <img className="card__logo" src="/decade.png" alt="" />
                <p className="card__eyebrow">GESTÃO DE EQUIPE</p>
                <h1 id="page-title">Cadastro</h1>
                <p id="page-description" className="card__description">
                  Informe o nome do funcionário para iniciar o cadastro.
                </p>
      
                <form id="employee-form">
                  <label htmlFor="employee-name">Nome do funcionário</label>
                  <input
                    id="employee-name"
                    name="employeeName"
                    type="text"
                    placeholder="Ex.: Ana Silva"
                    autoComplete="name"
                    required
                  />
                  <label htmlFor="employee-temporary-password">Senha temporária</label>
                  <input
                    id="employee-temporary-password"
                    name="senhaTemporaria"
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                    required
                  />
                  <small className="field-help">Entregue essa senha ao funcionário. No primeiro acesso, ele deverá criar uma senha nova.</small>
                  <button type="submit">Salvar funcionário</button>
                  <p id="form-message" className="form-message" role="status" aria-live="polite"></p>
                </form>
                <form id="daily-form" hidden>
                  <div className="daily-fields">
                    <div className="field">
                      <label htmlFor="daily-employee">Funcionario</label>
                      <select id="daily-employee" name="funcionarioId" required>
                        <option value="">Carregando funcionários...</option>
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="daily-date">Data</label>
                      <input id="daily-date" name="data" type="date" required />
                    </div>
                    <div className="field">
                      <label htmlFor="daily-amount">Diária</label>
                      <input
                        id="daily-amount"
                        name="diaria"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0,00"
                        required
                      />
                    </div>
                  </div>
                  <button type="submit">Salvar</button>
                  <p id="daily-form-message" className="form-message" role="status" aria-live="polite"></p>
                </form>
                <form id="delete-form" hidden>
                  <div className="daily-fields">
                    <div className="field">
                      <label htmlFor="delete-employee">Funcionário</label>
                      <select id="delete-employee" name="funcionarioId" required>
                        <option value="">Carregando funcionários...</option>
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="delete-date">Data</label>
                      <input id="delete-date" name="data" type="date" required />
                    </div>
                  </div>
                  <button className="button--compact" type="submit">Excluir data</button>
                  <p id="delete-form-message" className="form-message" role="status" aria-live="polite"></p>
                </form>
                <form id="deactivate-form" hidden>
                  <label htmlFor="deactivate-employee">Funcionário</label>
                  <select id="deactivate-employee" name="funcionarioId" required>
                    <option value="">Carregando funcionários...</option>
                  </select>
                  <div className="employee-status-actions">
                    <button id="deactivate-employee-button" type="submit" disabled>
                      Desativar funcionário
                    </button>
                    <button
                      id="reactivate-employee-button"
                      className="button-secondary"
                      type="button"
                      disabled
                    >
                      Reativar funcionário
                    </button>
                  </div>
                  <p id="deactivate-form-message" className="form-message" role="status" aria-live="polite"></p>
                </form>
                <form id="search-form" className="search-fields" hidden>
                  <div className="search-fields__filters">
                    <div className="field">
                      <span id="search-employee-label" className="field__label">Funcionários</span>
                      <details id="search-employee-dropdown" className="employee-multiselect">
                        <summary id="search-employee-selection">Carregando funcionários...</summary>
                        <div
                          id="search-employee"
                          className="employee-checkbox-list"
                          role="group"
                          aria-labelledby="search-employee-label"
                          aria-describedby="search-employee-help"
                        ></div>
                      </details>
                      <small id="search-employee-help" className="field-help">
                        Selecione um ou mais funcionários para pesquisar.
                      </small>
                    </div>
                    <div className="field">
                      <span className="field__label">Período</span>
                      <div className="date-range">
                        <div className="field">
                          <label htmlFor="search-start-date">De</label>
                          <input id="search-start-date" name="dataInicial" type="date" />
                        </div>
                        <div className="field">
                          <label htmlFor="search-end-date">Até</label>
                          <input id="search-end-date" name="dataFinal" type="date" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="search-fields__actions">
                    <button type="submit">Pesquisar</button>
                    <button id="generate-report" className="button-secondary" type="button">
                      Gerar relatório
                    </button>
                  </div>
                  <p id="search-form-message" className="form-message" role="status" aria-live="polite"></p>
                </form>
                <form id="change-password-form" hidden>
                  <label htmlFor="current-password">Senha atual</label>
                  <input
                    id="current-password"
                    name="senhaAtual"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                  <label htmlFor="change-new-password">Nova senha</label>
                  <input
                    id="change-new-password"
                    name="novaSenha"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <label htmlFor="change-confirm-password">Confirme a nova senha</label>
                  <input
                    id="change-confirm-password"
                    name="confirmacao"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <button type="submit">Alterar senha</button>
                  <p id="change-password-message" className="form-message" role="status" aria-live="polite"></p>
                </form>
                <section id="account-type-section" className="account-type-section" aria-label="Atribuição de tipo de conta" hidden>
                  <form id="account-type-form">
                    <div className="account-type-fields">
                      <div className="field">
                        <label htmlFor="account-type-employee">Funcionário</label>
                        <select id="account-type-employee" name="funcionarioId" required disabled>
                          <option value="">Carregando funcionários...</option>
                        </select>
                      </div>
                      <div className="field">
                        <label htmlFor="account-type-select">Tipo de conta</label>
                        <select id="account-type-select" name="tipoConta" required disabled>
                          <option value="ADM">ADM</option>
                          <option value="Funcionário">Funcionário</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" disabled>Atribuir</button>
                  </form>
                  <p id="account-type-message" className="form-message" role="status" aria-live="polite"></p>
                </section>
                <section id="search-results" className="search-results" aria-live="polite" hidden>
                  <h2 className="search-results__title">Resultado da pesquisa</h2>
                  <p id="search-results-empty" className="search-results__empty" hidden>
                    Nenhum dado encontrado para os filtros selecionados.
                  </p>
                  <div id="search-results-table-wrapper" className="search-results__table-wrapper" hidden>
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th scope="col">Funcionário</th>
                          <th scope="col">Data</th>
                          <th scope="col">Diária</th>
                        </tr>
                      </thead>
                      <tbody id="search-results-body"></tbody>
                    </table>
                  </div>
                </section>
                <section id="daily-history-section" className="search-results" aria-live="polite" hidden>
                  <form id="daily-history-search-form" className="search-fields">
                    <div className="date-range">
                      <div className="field">
                        <label htmlFor="daily-history-start-date">De</label>
                        <input id="daily-history-start-date" name="dataInicial" type="date" />
                      </div>
                      <div className="field">
                        <label htmlFor="daily-history-end-date">Até</label>
                        <input id="daily-history-end-date" name="dataFinal" type="date" />
                      </div>
                    </div>
                    <div className="daily-history__actions">
                      <button type="submit">Pesquisar</button>
                      <button id="generate-daily-history-report" type="button" disabled>
                        Gerar relatório
                      </button>
                    </div>
                  </form>
                  <div className="daily-history__header">
                    <h2 className="search-results__title">Alterações nas diárias</h2>
                  </div>
                  <p id="daily-history-empty" className="search-results__empty" hidden>
                    Nenhuma alteração de diária foi registrada.
                  </p>
                  <div id="daily-history-table-wrapper" className="search-results__table-wrapper" hidden>
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th scope="col">Usuário que modificou</th>
                          <th scope="col">Código do funcionário</th>
                          <th scope="col">Funcionário</th>
                          <th scope="col">Data da diária</th>
                          <th scope="col">Data e hora da modificação</th>
                          <th scope="col">Valor anterior</th>
                          <th scope="col">Valor modificado</th>
                          <th scope="col">Tipo de alteração</th>
                        </tr>
                      </thead>
                      <tbody id="daily-history-body"></tbody>
                    </table>
                  </div>
                </section>
                <p id="section-message" className="section-message" role="status" aria-live="polite" hidden></p>
              </section>
            </main>
          </div>
    </>
  );
}

function DeactivationDialog() {
  return (
    <>
      <dialog id="deactivate-confirm-dialog" aria-labelledby="deactivate-confirm-title">
            <form method="dialog">
              <h2 id="deactivate-confirm-title">Confirmar desativação</h2>
              <p id="deactivate-confirm-message"></p>
              <div className="duplicate-name-dialog__actions">
                <button type="submit" value="cancel" className="button-secondary">Cancelar</button>
                <button type="submit" value="confirm">Desativar funcionário</button>
              </div>
            </form>
          </dialog>
    </>
  );
}
