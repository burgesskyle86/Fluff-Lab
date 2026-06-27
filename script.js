let currentBase = [];
let currentAdditives = [];
let protocols = [];
let experimentLog = [];
let inventory = {};
let experimentNumber = 1;

const STORAGE_KEYS = {
  protocols: "fluffLabsV2Protocols",
  experiments: "fluffLabsV2ExperimentLog",
  inventory: "fluffLabsV2Inventory",
  experimentNumber: "fluffLabsV2ExperimentNumber"
};

const flavorSelect = document.getElementById("flavorSelect");
const baseList = document.getElementById("baseList");
const additiveList = document.getElementById("additiveList");
const caloriesTotal = document.getElementById("caloriesTotal");
const proteinTotal = document.getElementById("proteinTotal");
const hypothesisText = document.getElementById("hypothesisText");
const observationText = document.getElementById("observationText");
const conclusionText = document.getElementById("conclusionText");
const protocolList = document.getElementById("protocolList");
const experimentList = document.getElementById("experimentList");
const inventoryList = document.getElementById("inventoryList");

function clone(items) {
  return items.map(item => ({ ...item }));
}

function start() {
  loadSavedData();
  setupTabs();

  Object.keys(RECIPES).forEach(formula => {
    const option = document.createElement("option");
    option.value = formula;
    option.textContent = formula;
    flavorSelect.appendChild(option);
  });

  flavorSelect.value = "Key Lime Pie";
  loadFormula("Key Lime Pie", false);

  flavorSelect.addEventListener("change", () => loadFormula(flavorSelect.value));
  document.getElementById("resetBtn").addEventListener("click", () => loadFormula(flavorSelect.value));
  document.getElementById("addAdditiveBtn").addEventListener("click", addAdditive);
  document.getElementById("mixBtn").addEventListener("click", mixFormula);
  document.getElementById("saveProtocolBtn").addEventListener("click", saveProtocol);
  document.getElementById("clearProtocolsBtn").addEventListener("click", clearProtocols);
  document.getElementById("clearLogBtn").addEventListener("click", clearExperimentLog);

  renderProtocols();
  renderExperimentLog();
  renderInventory();
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      document.querySelectorAll(".tab").forEach(item => item.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(target).classList.add("active");
    });
  });
}

function loadSavedData() {
  protocols = readJson(STORAGE_KEYS.protocols, []);
  experimentLog = readJson(STORAGE_KEYS.experiments, []);
  inventory = readJson(STORAGE_KEYS.inventory, {});
  experimentNumber = Number(localStorage.getItem(STORAGE_KEYS.experimentNumber) || 1);
}

function saveData() {
  localStorage.setItem(STORAGE_KEYS.protocols, JSON.stringify(protocols));
  localStorage.setItem(STORAGE_KEYS.experiments, JSON.stringify(experimentLog));
  localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(inventory));
  localStorage.setItem(STORAGE_KEYS.experimentNumber, String(experimentNumber));
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (error) {
    return fallback;
  }
}

function loadFormula(formula, shouldLog = true) {
  currentBase = clone(RECIPES[formula].base);
  currentAdditives = clone(RECIPES[formula].mixins || []);
  hypothesisText.value = "";
  observationText.value = "";
  conclusionText.value = "";
  renderAll();
  if (shouldLog) logExperiment(`Loaded formula: ${formula}`);
}

function renderAll() {
  renderList(baseList, currentBase, "base");
  renderList(additiveList, currentAdditives, "additives");
  updateTotals();
}

function renderList(container, items, type) {
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = `<div class="empty">No additives yet.</div>`;
    return;
  }

  items.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "ingredient";

    row.innerHTML = `
      <div class="ingredient-title">${escapeHtml(item.name)}</div>
      <div class="ingredient-bottom">
        <div class="ingredient-meta">${escapeHtml(item.amount)}</div>
        <div class="ingredient-nutrition">C:${Math.round(Number(item.calories || 0))} &nbsp; P:${Math.round(Number(item.protein || 0))}g</div>
      </div>
    `;

    if (type === "additives") {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "ghost";
      remove.style.marginTop = "10px";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        const removed = currentAdditives.splice(index, 1)[0];
        logExperiment(`Removed additive: ${removed.name}`);
        renderAll();
      });
      row.appendChild(remove);
    }

    container.appendChild(row);
  });
}

function updateTotals() {
  const totals = getTotals();
  caloriesTotal.textContent = totals.calories;
  proteinTotal.textContent = `${totals.protein}g`;
}

function getTotals() {
  const all = [...currentBase, ...currentAdditives];
  const calories = all.reduce((sum, item) => sum + Number(item.calories || 0), 0);
  const protein = all.reduce((sum, item) => sum + Number(item.protein || 0), 0);
  return { calories: Math.round(calories), protein: Math.round(protein) };
}

function addAdditive() {
  const name = prompt("Additive name?");
  if (!name) return;

  const amount = prompt("Amount? Example: 50 g, 1 tbsp, 1 cookie") || "custom";
  const calories = Number(prompt("Calories?") || 0);
  const protein = Number(prompt("Protein grams?") || 0);

  currentAdditives.push({ name, amount, calories, protein });
  logExperiment(`Added additive: ${name} — ${amount}`);
  renderAll();
  renderInventory();
}

function mixFormula() {
  const totals = getTotals();
  const hypothesis = hypothesisText.value.trim();
  const observation = observationText.value.trim();
  const conclusion = conclusionText.value.trim();

  let details = `Mixed formula: ${flavorSelect.value}. Result: ${totals.calories} calories, ${totals.protein}g protein.`;
  if (hypothesis) details += ` Hypothesis: ${hypothesis}`;
  if (observation) details += ` Observation: ${observation}`;
  if (conclusion) details += ` Conclusion: ${conclusion}`;

  logExperiment(details);
  renderExperimentLog();
  switchTab("experiments");
}

function saveProtocol() {
  const totals = getTotals();
  const all = [...currentBase, ...currentAdditives];

  protocols.unshift({
    formula: flavorSelect.value,
    calories: totals.calories,
    protein: totals.protein,
    hypothesis: hypothesisText.value.trim(),
    observations: observationText.value.trim(),
    conclusion: conclusionText.value.trim(),
    ingredients: all.map(item => `${item.name} — ${item.amount}`),
    createdAt: new Date().toLocaleString()
  });

  logExperiment(`Saved protocol: ${flavorSelect.value}`);
  saveData();
  renderProtocols();
  renderExperimentLog();
  switchTab("protocols");
}

function renderProtocols() {
  if (!protocols.length) {
    protocolList.className = "empty";
    protocolList.textContent = "No protocols saved yet.";
    return;
  }

  protocolList.className = "";
  protocolList.innerHTML = "";

  protocols.forEach((protocol, index) => {
    const div = document.createElement("div");
    div.className = "saved";
    div.innerHTML = `
      <strong>${escapeHtml(protocol.formula)}</strong>
      <div>${protocol.calories} calories · ${protocol.protein}g protein</div>
      <div class="muted">${escapeHtml(protocol.createdAt || "")}</div>
      ${protocol.observations ? `<p><b>Observations:</b> ${escapeHtml(protocol.observations)}</p>` : ""}
      ${protocol.conclusion ? `<p><b>Conclusion:</b> ${escapeHtml(protocol.conclusion)}</p>` : ""}
      <details>
        <summary>Formula ingredients</summary>
        <ul>${protocol.ingredients.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </details>
    `;

    const cloneBtn = document.createElement("button");
    cloneBtn.type = "button";
    cloneBtn.className = "ghost";
    cloneBtn.style.marginTop = "10px";
    cloneBtn.textContent = "Clone Formula";
    cloneBtn.addEventListener("click", () => cloneProtocol(index));
    div.appendChild(cloneBtn);

    protocolList.appendChild(div);
  });
}

function cloneProtocol(index) {
  const protocol = protocols[index];
  if (!protocol) return;

  flavorSelect.value = protocol.formula;
  loadFormula(protocol.formula, false);
  observationText.value = protocol.observations || "";
  conclusionText.value = protocol.conclusion || "";
  logExperiment(`Cloned protocol into formula: ${protocol.formula}`);
  switchTab("builder");
}

function clearProtocols() {
  if (!confirm("Clear all protocols?")) return;
  protocols = [];
  logExperiment("Cleared all protocols.");
  saveData();
  renderProtocols();
  renderExperimentLog();
}

function logExperiment(description) {
  const totals = getTotals();
  experimentLog.unshift({
    number: experimentNumber++,
    formula: flavorSelect.value || "Formula",
    description,
    calories: totals.calories,
    protein: totals.protein,
    timestamp: new Date().toLocaleString()
  });

  saveData();
  renderExperimentLog();
}

function renderExperimentLog() {
  if (!experimentLog.length) {
    experimentList.className = "empty";
    experimentList.textContent = "No experiments logged yet.";
    return;
  }

  experimentList.className = "";
  experimentList.innerHTML = "";

  experimentLog.forEach(entry => {
    const div = document.createElement("div");
    div.className = "saved";
    div.innerHTML = `
      <strong>Experiment #${entry.number}</strong>
      <div>${escapeHtml(entry.formula)} · ${entry.calories} calories · ${entry.protein}g protein</div>
      <p>${escapeHtml(entry.description)}</p>
      <div class="muted">${escapeHtml(entry.timestamp)}</div>
    `;
    experimentList.appendChild(div);
  });
}

function clearExperimentLog() {
  if (!confirm("Clear the experiment log?")) return;
  experimentLog = [];
  experimentNumber = 1;
  saveData();
  renderExperimentLog();
}

function renderInventory() {
  const names = new Set();
  Object.values(RECIPES).forEach(recipe => {
    [...recipe.base, ...(recipe.mixins || [])].forEach(item => names.add(item.name));
  });
  currentAdditives.forEach(item => names.add(item.name));

  inventoryList.innerHTML = "";
  [...names].sort().forEach(name => {
    const label = document.createElement("label");
    label.className = "inventory-item";
    label.innerHTML = `
      <input type="checkbox" ${inventory[name] ? "checked" : ""} />
      <span>${escapeHtml(name)}</span>
    `;
    label.querySelector("input").addEventListener("change", event => {
      inventory[name] = event.target.checked;
      saveData();
    });
    inventoryList.appendChild(label);
  });
}

function switchTab(target) {
  const tab = document.querySelector(`.tab[data-tab="${target}"]`);
  if (tab) tab.click();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

start();
