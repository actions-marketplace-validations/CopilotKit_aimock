/* global document, localStorage */
(function () {
  var STORAGE_KEY = "aimock-tab-preference";

  var stylesInjected = false;

  function injectStyles() {
    if (stylesInjected) return;
    stylesInjected = true;
    var style = document.createElement("style");
    style.textContent = [
      ".cli-docker-tab-bar {",
      "  display: flex;",
      "  flex-direction: row;",
      "  gap: 0;",
      "  border-bottom: 1px solid var(--border);",
      "  margin-bottom: 0;",
      "}",
      ".cli-docker-tab-bar button {",
      "  padding: 0.5rem 1.25rem;",
      "  font-family: var(--font-mono);",
      "  font-size: 0.75rem;",
      "  font-weight: 500;",
      "  background: transparent;",
      "  border: none;",
      "  border-bottom: 2px solid transparent;",
      "  color: var(--text-dim);",
      "  cursor: pointer;",
      "  transition: color 0.15s, border-color 0.15s;",
      "  outline: none;",
      "}",
      ".cli-docker-tab-bar button:hover {",
      "  color: var(--text-secondary);",
      "}",
      ".cli-docker-tab-bar button.active {",
      "  color: var(--accent);",
      "  border-bottom-color: var(--accent);",
      "  cursor: default;",
      "}",
      ".cli-docker-tabs > .tab-cli,",
      ".cli-docker-tabs > .tab-docker {",
      "  display: none;",
      "}",
      ".cli-docker-tabs > .tab-cli.active,",
      ".cli-docker-tabs > .tab-docker.active {",
      "  display: block;",
      "}",
      "",
      "/* Generic code-tabs */",
      ".code-tab-bar {",
      "  display: flex;",
      "  flex-direction: row;",
      "  gap: 0;",
      "  border-bottom: 1px solid var(--border);",
      "  margin-bottom: 0;",
      "}",
      ".code-tab-bar button {",
      "  padding: 0.5rem 1.25rem;",
      "  font-family: var(--font-mono);",
      "  font-size: 0.75rem;",
      "  font-weight: 500;",
      "  background: transparent;",
      "  border: none;",
      "  border-bottom: 2px solid transparent;",
      "  color: var(--text-dim);",
      "  cursor: pointer;",
      "  transition: color 0.15s, border-color 0.15s;",
      "  outline: none;",
      "}",
      ".code-tab-bar button:hover {",
      "  color: var(--text-secondary);",
      "}",
      ".code-tab-bar button.active {",
      "  color: var(--accent);",
      "  border-bottom-color: var(--accent);",
      "  cursor: default;",
      "}",
      ".code-tabs > [data-tab] {",
      "  display: none;",
      "}",
      ".code-tabs > [data-tab].active {",
      "  display: block;",
      "}",
    ].join("\n");
    document.head.appendChild(style);
  }

  function init() {
    var containers = document.querySelectorAll(".cli-docker-tabs");
    if (!containers.length) return;

    injectStyles();

    var preference = localStorage.getItem(STORAGE_KEY) || "cli";

    containers.forEach(function (container) {
      var cliLabel = container.dataset.cliLabel || "CLI";
      var dockerLabel = container.dataset.dockerLabel || "Docker";

      var tabCli = container.querySelector(".tab-cli");
      var tabDocker = container.querySelector(".tab-docker");
      if (!tabCli || !tabDocker) return;

      // Build tab bar
      var bar = document.createElement("div");
      bar.className = "cli-docker-tab-bar";

      var btnCli = document.createElement("button");
      btnCli.type = "button";
      btnCli.textContent = cliLabel;
      btnCli.dataset.tab = "cli";

      var btnDocker = document.createElement("button");
      btnDocker.type = "button";
      btnDocker.textContent = dockerLabel;
      btnDocker.dataset.tab = "docker";

      bar.appendChild(btnCli);
      bar.appendChild(btnDocker);
      container.insertBefore(bar, container.firstChild);

      // Click handlers
      btnCli.addEventListener("click", function () {
        switchAll("cli");
      });
      btnDocker.addEventListener("click", function () {
        switchAll("docker");
      });

      // Apply initial preference
      applyTab(container, preference);
    });
  }

  function applyTab(container, tab) {
    var tabCli = container.querySelector(".tab-cli");
    var tabDocker = container.querySelector(".tab-docker");
    var btnCli = container.querySelector('.cli-docker-tab-bar button[data-tab="cli"]');
    var btnDocker = container.querySelector('.cli-docker-tab-bar button[data-tab="docker"]');
    if (!tabCli || !tabDocker || !btnCli || !btnDocker) return;

    if (tab === "docker") {
      tabCli.classList.remove("active");
      tabDocker.classList.add("active");
      btnCli.classList.remove("active");
      btnDocker.classList.add("active");
    } else {
      tabCli.classList.add("active");
      tabDocker.classList.remove("active");
      btnCli.classList.add("active");
      btnDocker.classList.remove("active");
    }
  }

  function switchAll(tab) {
    localStorage.setItem(STORAGE_KEY, tab);
    var containers = document.querySelectorAll(".cli-docker-tabs");
    containers.forEach(function (container) {
      applyTab(container, tab);
    });
  }

  /* ── Generic code-tabs ───────────────────────────────────────────── */

  var TAB_LABELS = {
    python: "Python",
    dotnet: ".NET",
    csharp: "C#",
    shell: "Shell",
    cli: "CLI",
    yaml: "YAML",
  };

  function tabLabel(key) {
    if (TAB_LABELS[key]) return TAB_LABELS[key];
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  function storageKeyFor(syncGroup) {
    return "aimock-tab-" + syncGroup;
  }

  function applyCodeTab(container, tabKey) {
    var panels = container.querySelectorAll(":scope > [data-tab]");
    var buttons = container.querySelectorAll(".code-tab-bar button");

    panels.forEach(function (panel) {
      if (panel.dataset.tab === tabKey) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });

    buttons.forEach(function (btn) {
      if (btn.dataset.tab === tabKey) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  function switchCodeTabGroup(syncGroup, tabKey) {
    localStorage.setItem(storageKeyFor(syncGroup), tabKey);
    var containers = document.querySelectorAll('.code-tabs[data-sync="' + syncGroup + '"]');
    containers.forEach(function (container) {
      applyCodeTab(container, tabKey);
    });
  }

  function switchCodeTabSingle(container, tabKey) {
    applyCodeTab(container, tabKey);
  }

  function initCodeTabs() {
    var containers = document.querySelectorAll(".code-tabs");
    if (!containers.length) return;

    injectStyles();

    containers.forEach(function (container) {
      var panels = container.querySelectorAll(":scope > [data-tab]");
      if (!panels.length) return;

      var syncGroup = container.dataset.sync || null;

      // Determine initial tab: saved preference > first tab
      var firstTab = panels[0].dataset.tab;
      var activeTab = firstTab;
      if (syncGroup) {
        var saved = localStorage.getItem(storageKeyFor(syncGroup));
        if (saved) {
          // Verify the saved tab exists in this container
          var exists = false;
          panels.forEach(function (p) {
            if (p.dataset.tab === saved) exists = true;
          });
          if (exists) activeTab = saved;
        }
      }

      // Build tab bar
      var bar = document.createElement("div");
      bar.className = "code-tab-bar";

      panels.forEach(function (panel) {
        var key = panel.dataset.tab;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = tabLabel(key);
        btn.dataset.tab = key;

        btn.addEventListener("click", function () {
          if (syncGroup) {
            switchCodeTabGroup(syncGroup, key);
          } else {
            switchCodeTabSingle(container, key);
          }
        });

        bar.appendChild(btn);
      });

      container.insertBefore(bar, container.firstChild);

      // Apply initial state
      applyCodeTab(container, activeTab);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
      initCodeTabs();
    });
  } else {
    init();
    initCodeTabs();
  }
})();
