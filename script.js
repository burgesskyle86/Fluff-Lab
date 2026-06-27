let currentBase = [];
let currentAdditives = [];
let protocols = [];
let experimentLog = [];
let inventory = {};
let experimentNumber = 1;

const STORAGE_KEYS = {
  protocols: "fluffLabV30Protocols",
  oldProtocols: "fluffLabsV23Protocols",
  experiments: "fluffLabV30ExperimentLog",
  oldExperiments: "fluffLabsV23ExperimentLog",
  inventory: "fluffLabV30Inventory",
  oldInventory: "fluffLabsV23Inventory",
  experimentNumber: "fluffLabV30ExperimentNumber",
  oldExperimentNumber: "fluffLabsV23ExperimentNumber"
};

const $ = id => document.getElementById(id);
const baseList = $("baseList");
const additiveList = $("additiveList");
const methodList = $("methodList");
const formulaHero = $("formulaHero");
const observationText = $("observationText");
const conclusionText = $("conclusionText");
const protocolList = $("protocolList");
const experimentList = $("experimentList");
const inventoryList = $("inventoryList");

function start() {
  loadSavedData();
  setupNavigation();
  loadFormula("Cookies & Cream", false);
  $("resetBtn").addEventListener("click", () => loadFormula(getCurrentFormulaName(), false));
  $("addAdditiveBtn").addEventListener("click", addAdditive);
  $("saveExperimentBtn").addEventListener("click", saveExperiment);
  $("clearProtocolsBtn").addEventListener("click", clearProtocols);
  $("clearLogBtn").addEventListener("click", clearExperimentLog);
  renderProtocols();
  renderExperimentLog();
  renderInventory();
  updateHomeCounts();
}

function setupNavigation() {
  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
      if (button.dataset.filter === "favorites") renderProtocols(true);
      else if (button.dataset.go === "protocols") renderProtocols(false);
      switchTab(button.dataset.go);
    });
  });
}

function loadSavedData() {
  protocols = readJson(STORAGE_KEYS.protocols, readJson(STORAGE_KEYS.oldProtocols, []));
  experimentLog = readJson(STORAGE_KEYS.experiments, readJson(STORAGE_KEYS.oldExperiments, []));
  inventory = readJson(STORAGE_KEYS.inventory, readJson(STORAGE_KEYS.oldInventory, {}));
  experimentNumber = Number(localStorage.getItem(STORAGE_KEYS.experimentNumber) || localStorage.getItem(STORAGE_KEYS.oldExperimentNumber) || 1);
}

function saveData() {
  localStorage.setItem(STORAGE_KEYS.protocols, JSON.stringify(protocols));
  localStorage.setItem(STORAGE_KEYS.experiments, JSON.stringify(experimentLog));
  localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(inventory));
  localStorage.setItem(STORAGE_KEYS.experimentNumber, String(experimentNumber));
  updateHomeCounts();
}

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}

function getCurrentFormulaName() {
  const select = $("formulaSelect");
  return select ? select.value : "Cookies & Cream";
}

function loadFormula(name, shouldLog = true) {
  const formula = RECIPES[name] || RECIPES[Object.keys(RECIPES)[0]];
  currentBase = clone(formula.base);
  currentAdditives = clone(formula.mixins || []);
  observationText.value = "";
  conclusionText.value = "";
  renderAll(formula.name);
  if (shouldLog) logExperiment(`Loaded formula: ${formula.name}`);
}

function clone(items) {
  return items.map(item => prepareIngredient({ ...item }));
}

function prepareIngredient(item) {
  const baseAmount = item.baseAmount || item.amount || "";
  const baseCalories = Number(item.baseCalories ?? item.calories ?? 0);
  const baseProtein = Number(item.baseProtein ?? item.protein ?? 0);
  const scale = item.scale || 1;
  return { ...item, baseAmount, baseCalories, baseProtein, scale, amount: item.amount || formatScaledAmount(baseAmount, scale), calories: Number(item.calories ?? Math.round(baseCalories * Number(scale || 1))), protein: Number(item.protein ?? roundProtein(baseProtein * Number(scale || 1))) };
}

function renderAll(selectedName = getCurrentFormulaName()) {
  renderHero(selectedName);
  renderList(baseList, currentBase, "base");
  renderList(additiveList, currentAdditives, "additives");
  renderMethod(selectedName);
  updateTotals();
}

function renderHero(selectedName) {
  const formula = RECIPES[selectedName];
  const totals = getTotals();
  formulaHero.innerHTML = `
    <div class="hero-copy">
      <label class="formula-select">Formula<select id="formulaSelect">${Object.keys(RECIPES).map(name => `<option value="${escapeAttribute(name)}" ${name === selectedName ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}</select></label>
      <h2 class="formula-title">${escapeHtml(formula.name)}</h2>
      <p class="muted">${escapeHtml(formula.description || "Protein fluff formula")}</p>
      <div class="totals"><div class="total-box"><div id="caloriesTotal" class="total-number">${totals.calories}</div><div class="total-label">Calories</div></div><div class="total-box"><div id="proteinTotal" class="total-number">${totals.protein}g</div><div class="total-label">Protein</div></div></div>
    </div>`;
  $("formulaSelect").addEventListener("change", event => loadFormula(event.target.value));
}

function renderMethod(name) {
  const method = RECIPES[name]?.method || [];
  methodList.innerHTML = method.map(step => `<div class="method-step"><p>${escapeHtml(step)}</p></div>`).join("");
}

function renderList(container, items, type) {
  container.innerHTML = "";
  if (!items.length) { container.innerHTML = `<div class="empty">No additives yet.</div>`; return; }
  items.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "ingredient";
    const amountOptions = getAmountOptions(item);
    const customSelected = !amountOptions.some(option => option.scale !== "custom" && Number(option.scale) === Number(item.scale));
    row.innerHTML = `<div class="ingredient-title">${escapeHtml(item.name)}</div><div class="edit-grid"><label><span>Amount</span><select class="amount-select" data-field="amountScale">${amountOptions.map(option => `<option value="${option.scale}" ${String(option.scale) === String(item.scale) ? "selected" : ""}>${escapeHtml(option.amount)}</option>`).join("")}<option value="custom" ${customSelected ? "selected" : ""}>Custom</option></select></label><label class="custom-amount-wrap ${customSelected ? "" : "hidden"}"><span>Custom Amount</span><input type="text" data-field="amount" value="${escapeAttribute(item.amount || "")}" /></label><label><span>Calories</span><input type="number" data-field="calories" value="${Number(item.calories || 0)}" inputmode="decimal" /></label><label><span>Protein</span><input type="number" data-field="protein" value="${Number(item.protein || 0)}" inputmode="decimal" step="0.1" /></label></div>`;
    row.querySelector(".amount-select").addEventListener("change", event => updateIngredientAmountScale(type, index, event.target.value));
    row.querySelectorAll("input[data-field]").forEach(input => input.addEventListener("change", () => updateIngredient(type, index, input.dataset.field, input.value)));
    if (type === "additives") {
      const remove = document.createElement("button");
      remove.type = "button"; remove.className = "ghost"; remove.style.marginTop = "10px"; remove.textContent = "Remove";
      remove.addEventListener("click", () => { const removed = currentAdditives.splice(index, 1)[0]; logExperiment(`Removed additive: ${removed.name}`); renderAll(); });
      row.appendChild(remove);
    }
    container.appendChild(row);
  });
}

function getAmountOptions(item) {
  const scales = [.25, .5, .75, 1, 1.25, 1.5, 2];
  const baseAmount = item.baseAmount || item.amount || "custom";
  const seen = new Set();
  const options = scales.map(scale => ({ scale, amount: formatScaledAmount(baseAmount, scale) })).filter(option => { const key = `${option.scale}|${option.amount}`; if (seen.has(key)) return false; seen.add(key); return true; });
  if (!options.some(option => String(option.amount) === String(item.amount))) options.push({ scale: "custom", amount: item.amount || "custom" });
  return options;
}

function formatScaledAmount(baseAmount, scale) {
  const text = String(baseAmount || "custom").trim();
  if (!text || scale === "custom") return text || "custom";
  const match = text.match(/^(\d+(?:\.\d+)?|\d+\/\d+)\s*(.*)$/);
  if (!match) return Number(scale) === 1 ? text : `${scale}× ${text}`;
  const raw = match[1], unit = match[2].trim();
  let num = raw.includes("/") ? raw.split("/").map(Number).reduce((a,b)=> b ? a / b : a) : Number(raw);
  if (!Number.isFinite(num)) return Number(scale) === 1 ? text : `${scale}× ${text}`;
  return `${formatNumber(num * Number(scale))}${unit ? " " + unit : ""}`;
}

function formatNumber(value) {
  const whole = Math.floor(value), frac = value - whole;
  const fractions = [[.25,"1/4"],[.333,"1/3"],[.5,"1/2"],[.666,"2/3"],[.75,"3/4"]];
  if (Math.abs(value - Math.round(value)) < .01) return String(Math.round(value));
  const found = fractions.find(([decimal]) => Math.abs(frac - decimal) < .02);
  if (found) return whole ? `${whole} ${found[1]}` : found[1];
  return String(Math.round(value * 10) / 10);
}

function updateIngredientAmountScale(type, index, scaleValue) {
  const item = (type === "base" ? currentBase : currentAdditives)[index];
  if (!item) return;
  if (scaleValue === "custom") { item.scale = "custom"; renderAll(); return; }
  const oldAmount = item.amount;
  const scale = Number(scaleValue);
  item.scale = scale;
  item.amount = formatScaledAmount(item.baseAmount || item.amount, scale);
  item.calories = Math.round(Number(item.baseCalories || 0) * scale);
  item.protein = roundProtein(Number(item.baseProtein || 0) * scale);
  logExperiment(`Changed ${item.name} from ${oldAmount} to ${item.amount}.`);
  renderAll();
}

function updateIngredient(type, index, field, value) {
  const item = (type === "base" ? currentBase : currentAdditives)[index];
  if (!item) return;
  const cleanValue = field === "amount" ? value.trim() : Number(value || 0);
  item[field] = cleanValue;
  if (field === "amount") item.scale = "custom";
  updateTotals();
  logExperiment(`Edited ${item.name}: ${field} is now ${cleanValue}.`);
}

function updateTotals() {
  const totals = getTotals();
  const cal = $("caloriesTotal"), pro = $("proteinTotal");
  if (cal) cal.textContent = totals.calories;
  if (pro) pro.textContent = `${totals.protein}g`;
}

function getTotals() {
  const all = [...currentBase, ...currentAdditives];
  return { calories: Math.round(all.reduce((sum, item) => sum + Number(item.calories || 0), 0)), protein: Math.round(all.reduce((sum, item) => sum + Number(item.protein || 0), 0)) };
}

function getRatings() {
  return {
    texture: Number($("textureRating").value), sweetness: Number($("sweetnessRating").value), flavor: Number($("flavorRating").value), protein: Number($("proteinRating").value), makeAgain: $("makeAgain").checked
  };
}

function ratingAverage(ratings) {
  return Math.round(((ratings.texture + ratings.sweetness + ratings.flavor + ratings.protein) / 4) * 10) / 10;
}

function stars(value) {
  const rounded = Math.round(Number(value || 0));
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

function addAdditive() {
  const name = prompt("Additive name?"); if (!name) return;
  const amount = prompt("Amount? Example: 50 g, 1 tbsp, 1 cookie") || "custom";
  const calories = Number(prompt("Calories?") || 0);
  const protein = Number(prompt("Protein grams?") || 0);
  currentAdditives.push(prepareIngredient({ name, amount, calories, protein }));
  logExperiment(`Added additive: ${name} — ${amount}`);
  renderAll(); renderInventory();
}

function saveExperiment() {
  const totals = getTotals(), ratings = getRatings(), all = [...currentBase, ...currentAdditives];
  const name = getCurrentFormulaName();
  const notes = observationText.value.trim();
  const conclusion = conclusionText.value.trim();

  experimentLog.unshift({
    number: experimentNumber++, formula: name,
    description: `Saved experiment. Rating: ${ratingAverage(ratings)}/5.${ratings.makeAgain ? " Would make again." : " Would not make again yet."}${notes ? " Notes: " + notes : ""}${conclusion ? " Conclusion: " + conclusion : ""}`,
    calories: totals.calories, protein: totals.protein, ratings,
    timestamp: new Date().toLocaleString()
  });

  protocols.unshift({
    formula: name, calories: totals.calories, protein: totals.protein,
    observations: notes, conclusion, ratings,
    ingredients: all.map(item => `${item.name} — ${item.amount} — ${Math.round(Number(item.calories || 0))} cal / ${roundProtein(Number(item.protein || 0))}g protein`),
    method: RECIPES[name]?.method || [], promotedAt: new Date().toLocaleString(), favorite: false
  });

  saveData();
  renderProtocols();
  renderExperimentLog();
  alert("Experiment saved and added to Protocols.");
  switchTab("protocols");
}

function renderProtocols(onlyFavorites = false) {
  const visible = onlyFavorites ? protocols.filter(p => p.favorite) : protocols;
  $("protocolsTitle").textContent = onlyFavorites ? "Favorite Protocols" : "Protocols";
  if (!visible.length) { protocolList.className = "empty"; protocolList.textContent = onlyFavorites ? "No favorite protocols yet." : "No protocols saved yet."; updateHomeCounts(); return; }
  protocolList.className = ""; protocolList.innerHTML = "";
  visible.forEach(protocol => {
    const index = protocols.indexOf(protocol), avg = protocol.ratings ? ratingAverage(protocol.ratings) : 0;
    const div = document.createElement("div"); div.className = "saved";
    div.innerHTML = `<strong>${protocol.favorite ? "⭐ " : ""}${escapeHtml(protocol.formula)}</strong><div>${protocol.calories} calories · ${protocol.protein}g protein</div>${avg ? `<div class="stars">${stars(avg)} <span class="muted">${avg}/5</span></div>` : ""}<div class="muted">${escapeHtml(protocol.promotedAt || "")}</div>${protocol.observations ? `<p><b>Notes:</b> ${escapeHtml(protocol.observations)}</p>` : ""}${protocol.conclusion ? `<p><b>Conclusion:</b> ${escapeHtml(protocol.conclusion)}</p>` : ""}<details><summary>Formula ingredients</summary><ul>${(protocol.ingredients || []).map(i => `<li>${escapeHtml(i)}</li>`).join("")}</ul></details><details><summary>Method</summary><ol>${(protocol.method || []).map(i => `<li>${escapeHtml(i)}</li>`).join("")}</ol></details>`;
    const row = document.createElement("div"); row.className = "button-row";
    const fav = document.createElement("button"); fav.type = "button"; fav.className = "ghost"; fav.textContent = protocol.favorite ? "Unfavorite" : "Favorite"; fav.addEventListener("click", () => toggleFavorite(index, onlyFavorites));
    const clone = document.createElement("button"); clone.type = "button"; clone.className = "ghost"; clone.textContent = "Clone Formula"; clone.addEventListener("click", () => cloneProtocol(index));
    row.append(fav, clone); div.appendChild(row); protocolList.appendChild(div);
  });
  updateHomeCounts();
}

function toggleFavorite(index, onlyFavorites = false) { if (!protocols[index]) return; protocols[index].favorite = !protocols[index].favorite; saveData(); renderProtocols(onlyFavorites); }
function cloneProtocol(index) { const p = protocols[index]; if (!p) return; loadFormula(p.formula, false); observationText.value = p.observations || ""; conclusionText.value = p.conclusion || ""; if (p.ratings) { $("textureRating").value = p.ratings.texture || 4; $("sweetnessRating").value = p.ratings.sweetness || 4; $("flavorRating").value = p.ratings.flavor || 4; $("proteinRating").value = p.ratings.protein || 5; $("makeAgain").checked = p.ratings.makeAgain !== false; } logExperiment(`Cloned protocol: ${p.formula}`); switchTab("builder"); }
function clearProtocols() { if (!confirm("Clear all protocols?")) return; protocols = []; logExperiment("Cleared all protocols."); saveData(); renderProtocols(); }

function logExperiment(description) {
  const totals = getTotals();
  experimentLog.unshift({ number: experimentNumber++, formula: getCurrentFormulaName(), description, calories: totals.calories, protein: totals.protein, timestamp: new Date().toLocaleString() });
  saveData(); renderExperimentLog();
}

function renderExperimentLog() {
  if (!experimentLog.length) { experimentList.className = "empty"; experimentList.textContent = "No experiments logged yet."; return; }
  experimentList.className = ""; experimentList.innerHTML = experimentLog.map(e => `<div class="saved"><strong>Experiment #${e.number}</strong><div>${escapeHtml(e.formula)} · ${e.calories} calories · ${e.protein}g protein</div><p>${escapeHtml(e.description)}</p><div class="muted">${escapeHtml(e.timestamp)}</div></div>`).join("");
}
function clearExperimentLog() { if (!confirm("Clear the experiment log?")) return; experimentLog = []; experimentNumber = 1; saveData(); renderExperimentLog(); updateHomeCounts(); }

function renderInventory() {
  const names = new Set(); Object.values(RECIPES).forEach(recipe => [...recipe.base, ...(recipe.mixins || [])].forEach(item => names.add(item.name))); currentAdditives.forEach(item => names.add(item.name));
  inventoryList.innerHTML = [...names].sort().map(name => `<label class="inventory-item"><input type="checkbox" data-name="${escapeAttribute(name)}" ${inventory[name] ? "checked" : ""} /><span>${escapeHtml(name)}</span></label>`).join("");
  inventoryList.querySelectorAll("input").forEach(input => input.addEventListener("change", e => { inventory[e.target.dataset.name] = e.target.checked; saveData(); }));
}
function updateHomeCounts() { const pc=$("protocolCount"), fc=$("favoriteCount"), ec=$("experimentCount"); if(pc) pc.textContent=`(${protocols.length})`; if(fc) fc.textContent=`(${protocols.filter(p=>p.favorite).length})`; if(ec) ec.textContent=`(${experimentLog.length})`; }
function switchTab(target) { document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active")); const panel = $(target); if (panel) { panel.classList.add("active"); window.scrollTo({ top: 0, behavior: "smooth" }); } }
function roundProtein(value) { return Math.round(value * 10) / 10; }
function escapeAttribute(value) { return escapeHtml(value).replaceAll("`", "&#096;"); }
function escapeHtml(value) { return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }

start();
