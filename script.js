let currentBase = [];
let currentAdditives = [];
let protocols = [];
let experimentLog = [];
let inventory = {};
let experimentNumber = 1;

const STORAGE_KEYS = {
  protocols: "fluffLabsV23Protocols",
  experiments: "fluffLabsV23ExperimentLog",
  inventory: "fluffLabsV23Inventory",
  experimentNumber: "fluffLabsV23ExperimentNumber"
};

const flavorSelect = document.getElementById("flavorSelect");
const baseList = document.getElementById("baseList");
const additiveList = document.getElementById("additiveList");
const caloriesTotal = document.getElementById("caloriesTotal");
const proteinTotal = document.getElementById("proteinTotal");
const observationText = document.getElementById("observationText");
const conclusionText = document.getElementById("conclusionText");
const protocolList = document.getElementById("protocolList");
const experimentList = document.getElementById("experimentList");
const inventoryList = document.getElementById("inventoryList");

function clone(items) {
  return items.map(item => prepareIngredient({ ...item }));
}

function prepareIngredient(item) {
  const baseAmount = item.baseAmount || item.amount || "";
  const baseCalories = Number(item.baseCalories ?? item.calories ?? 0);
  const baseProtein = Number(item.baseProtein ?? item.protein ?? 0);
  const scale = Number(item.scale || 1);
  return {
    ...item,
    baseAmount,
    baseCalories,
    baseProtein,
    scale,
    amount: item.amount || formatScaledAmount(baseAmount, scale),
    calories: Number(item.calories ?? Math.round(baseCalories * scale)),
    protein: Number(item.protein ?? roundProtein(baseProtein * scale))
  };
}

function getAmountOptions(item) {
  const baseAmount = item.baseAmount || item.amount || "custom";
  const scales = [.25, .5, .75, 1, 1.25, 1.5, 2];
  const seen = new Set();
  const options = scales.map(scale => {
    const amount = formatScaledAmount(baseAmount, scale);
    const key = `${scale}|${amount}`;
    if (seen.has(key)) return null;
    seen.add(key);
    return { scale, amount };
  }).filter(Boolean);

  if (!options.some(option => String(option.amount) === String(item.amount))) {
    options.push({ scale: "custom", amount: item.amount || "custom" });
  }
  return options;
}

function formatScaledAmount(baseAmount, scale) {
  const text = String(baseAmount || "custom").trim();
  if (!text || scale === "custom") return text || "custom";

  const fractionMap = { "1/2": .5, "1/3": 1 / 3, "2/3": 2 / 3, "1/4": .25, "3/4": .75 };
  const match = text.match(/^(\d+(?:\.\d+)?|\d+\/\d+)\s*(.*)$/);
  if (!match) return scale === 1 ? text : `${scale}× ${text}`;

  const rawNumber = match[1];
  const unit = match[2].trim();
  let baseNumber;
  if (rawNumber.includes("/")) {
    const [top, bottom] = rawNumber.split("/").map(Number);
    baseNumber = bottom ? top / bottom : Number(rawNumber);
  } else {
    baseNumber = Number(rawNumber);
  }

  if (!Number.isFinite(baseNumber)) return scale === 1 ? text : `${scale}× ${text}`;
  const scaled = baseNumber * Number(scale);
  const display = formatNumber(scaled);
  return `${display}${unit ? " " + unit : ""}`;
}

function formatNumber(value) {
  const commonFractions = [
    [0.25, "1/4"], [0.3333333333, "1/3"], [0.5, "1/2"], [0.6666666667, "2/3"], [0.75, "3/4"]
  ];
  for (const [decimal, label] of commonFractions) {
    if (Math.abs(value - decimal) < .01) return label;
  }
  if (Math.abs(value - Math.round(value)) < .01) return String(Math.round(value));
  return String(Math.round(value * 10) / 10);
}

function roundProtein(value) {
  return Math.round(value * 10) / 10;
}

function start() {
  loadSavedData();
  setupNavigation();

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
  document.getElementById("startExperimentBtn").addEventListener("click", startExperiment);
  document.getElementById("promoteProtocolBtn").addEventListener("click", promoteProtocol);
  document.getElementById("clearProtocolsBtn").addEventListener("click", clearProtocols);
  document.getElementById("clearLogBtn").addEventListener("click", clearExperimentLog);

  renderProtocols();
  renderExperimentLog();
  renderInventory();
  updateHomeCounts();
}

function setupNavigation() {
  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
      const target = button.dataset.go;
      if (button.dataset.filter === "favorites") {
        renderProtocols(true);
      } else if (target === "protocols") {
        renderProtocols(false);
      }
      switchTab(target);
    });
  });
}

function updateHomeCounts() {
  const protocolCount = document.getElementById("protocolCount");
  const favoriteCount = document.getElementById("favoriteCount");
  if (protocolCount) protocolCount.textContent = `(${protocols.length})`;
  if (favoriteCount) favoriteCount.textContent = `(${protocols.filter(protocol => protocol.favorite).length})`;
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
  updateHomeCounts();
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

    const amountOptions = getAmountOptions(item);
    const customSelected = !amountOptions.some(option => option.scale !== "custom" && Number(option.scale) === Number(item.scale));

    row.innerHTML = `
      <div class="ingredient-title">${escapeHtml(item.name)}</div>
      <div class="edit-grid amount-grid">
        <label>
          <span>Amount</span>
          <select class="ingredient-input amount-select" data-field="amountScale">
            ${amountOptions.map(option => `<option value="${option.scale}" ${String(option.scale) === String(item.scale) ? "selected" : ""}>${escapeHtml(option.amount)}</option>`).join("")}
            <option value="custom" ${customSelected ? "selected" : ""}>Custom</option>
          </select>
        </label>
        <label class="custom-amount-wrap ${customSelected ? "" : "hidden"}">
          <span>Custom Amount</span>
          <input type="text" class="ingredient-input" data-field="amount" value="${escapeAttribute(item.amount || "")}" />
        </label>
        <label>
          <span>Calories</span>
          <input type="number" class="ingredient-input" data-field="calories" value="${Number(item.calories || 0)}" inputmode="decimal" />
        </label>
        <label>
          <span>Protein</span>
          <input type="number" class="ingredient-input" data-field="protein" value="${Number(item.protein || 0)}" inputmode="decimal" step="0.1" />
        </label>
      </div>
    `;

    const amountSelect = row.querySelector(".amount-select");
    amountSelect.addEventListener("change", () => updateIngredientAmountScale(type, index, amountSelect.value));

    row.querySelectorAll(".ingredient-input[data-field]:not(.amount-select)").forEach(input => {
      input.addEventListener("change", () => updateIngredient(type, index, input.dataset.field, input.value));
    });

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

function updateIngredientAmountScale(type, index, scaleValue) {
  const list = type === "base" ? currentBase : currentAdditives;
  const item = list[index];
  if (!item) return;

  if (scaleValue === "custom") {
    item.scale = "custom";
    renderAll();
    return;
  }

  const oldAmount = item.amount;
  const oldCalories = item.calories;
  const oldProtein = item.protein;
  const scale = Number(scaleValue);

  item.scale = scale;
  item.amount = formatScaledAmount(item.baseAmount || item.amount, scale);
  item.calories = Math.round(Number(item.baseCalories || 0) * scale);
  item.protein = roundProtein(Number(item.baseProtein || 0) * scale);

  renderAll();
  logExperiment(`Changed ${item.name} from ${oldAmount} (${oldCalories} cal, ${oldProtein}g protein) to ${item.amount} (${item.calories} cal, ${item.protein}g protein).`);
}

function updateIngredient(type, index, field, value) {
  const list = type === "base" ? currentBase : currentAdditives;
  const item = list[index];
  if (!item) return;

  const oldValue = item[field];
  const cleanValue = field === "amount" ? value.trim() : Number(value || 0);
  if (String(oldValue) === String(cleanValue)) return;

  item[field] = cleanValue;
  if (field === "amount") item.scale = "custom";
  updateTotals();

  const fieldLabel = field === "protein" ? "protein" : field;
  const suffix = field === "protein" ? "g" : "";
  logExperiment(`Edited ${item.name}: ${fieldLabel} changed from ${oldValue}${suffix} to ${cleanValue}${suffix}.`);
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

  currentAdditives.push(prepareIngredient({ name, amount, calories, protein }));
  logExperiment(`Added additive: ${name} — ${amount}`);
  renderAll();
  renderInventory();
}

function startExperiment() {
  const totals = getTotals();
  const observation = observationText.value.trim();
  const conclusion = conclusionText.value.trim();

  let details = `Started experiment: ${flavorSelect.value}. Target result: ${totals.calories} calories, ${totals.protein}g protein.`;
  if (observation) details += ` Observation: ${observation}`;
  if (conclusion) details += ` Conclusion: ${conclusion}`;

  logExperiment(details);
  renderExperimentLog();
  alert("Experiment started. Mix the formula, taste it, then add observations and a conclusion before promoting it to a protocol.");
}

function promoteProtocol() {
  const totals = getTotals();
  const all = [...currentBase, ...currentAdditives];

  protocols.unshift({
    formula: flavorSelect.value,
    calories: totals.calories,
    protein: totals.protein,
    observations: observationText.value.trim(),
    conclusion: conclusionText.value.trim(),
    ingredients: all.map(item => `${item.name} — ${item.amount} — ${Math.round(Number(item.calories || 0))} cal / ${roundProtein(Number(item.protein || 0))}g protein`),
    promotedAt: new Date().toLocaleString(),
    createdAt: new Date().toLocaleString(),
    favorite: false
  });

  logExperiment(`Promoted to protocol: ${flavorSelect.value}`);
  saveData();
  renderProtocols();
  renderExperimentLog();
  switchTab("protocols");
}

function renderProtocols(onlyFavorites = false) {
  const visibleProtocols = onlyFavorites ? protocols.filter(protocol => protocol.favorite) : protocols;
  const title = document.getElementById("protocolsTitle");
  if (title) title.textContent = onlyFavorites ? "Favorite Protocols" : "Protocols";

  if (!visibleProtocols.length) {
    protocolList.className = "empty";
    protocolList.textContent = onlyFavorites ? "No favorite protocols yet." : "No protocols promoted yet.";
    updateHomeCounts();
    return;
  }

  protocolList.className = "";
  protocolList.innerHTML = "";

  visibleProtocols.forEach(protocol => {
    const index = protocols.indexOf(protocol);
    const div = document.createElement("div");
    div.className = "saved";
    div.innerHTML = `
      <strong>${protocol.favorite ? "⭐ " : ""}${escapeHtml(protocol.formula)}</strong>
      <div>${protocol.calories} calories · ${protocol.protein}g protein</div>
      <div class="muted">${escapeHtml(protocol.promotedAt || protocol.createdAt || "")}</div>
      ${protocol.observations ? `<p><b>Observations:</b> ${escapeHtml(protocol.observations)}</p>` : ""}
      ${protocol.conclusion ? `<p><b>Conclusion:</b> ${escapeHtml(protocol.conclusion)}</p>` : ""}
      <details>
        <summary>Formula ingredients</summary>
        <ul>${protocol.ingredients.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </details>
    `;

    const row = document.createElement("div");
    row.className = "button-row";

    const favoriteBtn = document.createElement("button");
    favoriteBtn.type = "button";
    favoriteBtn.className = "ghost";
    favoriteBtn.textContent = protocol.favorite ? "Unfavorite" : "Favorite";
    favoriteBtn.addEventListener("click", () => toggleFavorite(index, onlyFavorites));

    const cloneBtn = document.createElement("button");
    cloneBtn.type = "button";
    cloneBtn.className = "ghost";
    cloneBtn.textContent = "Clone Formula";
    cloneBtn.addEventListener("click", () => cloneProtocol(index));

    row.appendChild(favoriteBtn);
    row.appendChild(cloneBtn);
    div.appendChild(row);
    protocolList.appendChild(div);
  });

  updateHomeCounts();
}

function toggleFavorite(index, onlyFavorites = false) {
  const protocol = protocols[index];
  if (!protocol) return;
  protocol.favorite = !protocol.favorite;
  logExperiment(`${protocol.favorite ? "Favorited" : "Unfavorited"} protocol: ${protocol.formula}`);
  saveData();
  renderProtocols(onlyFavorites);
  updateHomeCounts();
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
  document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("active"));
  const panel = document.getElementById(target);
  if (panel) {
    panel.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}


function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
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
