const hasOpenedLabManual = localStorage.getItem("fluffLab_hasOpenedLabManual") === "true";
const KEYS = {
  active: "fluffLabV31ActiveExperiments",
  completed: "fluffLabV31CompletedExperiments",
  protocols: "fluffLabV31Protocols",
  inventory: "fluffLabV31Inventory",
  nextNumber: "fluffLabV31NextNumber"
};

let selectedFormula = Object.keys(RECIPES).sort()[0];
let activeExperiments = readJson(KEYS.active, []);
let completedExperiments = readJson(KEYS.completed, []);
let protocols = readJson(KEYS.protocols, []);
let inventory = readJson(KEYS.inventory, {});
let nextNumber = Number(localStorage.getItem(KEYS.nextNumber) || 1);
let finishingId = null;

const $ = selector => document.querySelector(selector);
const screens = [...document.querySelectorAll(".screen")];

function start(){
  document.querySelectorAll("[data-go]").forEach(el => el.addEventListener("click", () => go(el.dataset.go)));
  $("#makeFormulaBtn").addEventListener("click", makeFormula);
  $("#saveChillBtn").addEventListener("click", saveAndChill);
  $("#saveResultBtn").addEventListener("click", saveResult);
  $("#clearProtocolsBtn").addEventListener("click", clearProtocols);
  $("#clearExperimentsBtn").addEventListener("click", clearExperiments);
  renderAll();
}

const labManualLabel = hasOpenedLabManual
  ? "Lab Manual"
  : "Start Here: Lab Manual";

function go(id){
  screens.forEach(s => s.classList.remove("active"));
  const screen = document.getElementById(id);
  if(screen) screen.classList.add("active");
  
  if(id === "manual"){
    localStorage.setItem("fluffLab_hasOpenedLabManual", "true");
  }
  
  if(id === "formulas") renderFormulaList();
  if(id === "active") renderActive();
  if(id === "protocols") renderProtocols();
  if(id === "experiments") renderExperiments();
  if(id === "inventory") renderInventory();
  window.scrollTo({top:0,behavior:"smooth"});
}

function renderAll(){
  renderFormulaList();
  renderPreview();
  renderActive();
  renderProtocols();
  renderExperiments();
  renderInventory();
  updateCounts();
}

function sortedNames(){ return Object.keys(RECIPES).sort((a,b)=>a.localeCompare(b)); }
function allIngredients(recipe){ return [...recipe.base, ...(recipe.additives || recipe.mixins || [])]; }
function totals(recipe){
  const list = allIngredients(recipe);
  return {
    calories: Math.round(list.reduce((s,i)=>s+Number(i.calories||0),0)),
    protein: Math.round(list.reduce((s,i)=>s+Number(i.protein||0),0))
  };
}

function renderFormulaList(){
  const box = $("#formulaList");
  box.innerHTML = "";
  sortedNames().forEach(name => {
    const recipe = RECIPES[name];
    const t = totals(recipe);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "list-item";
    button.innerHTML = `<span>${escapeHtml(name)}<small class="formula-meta">${t.calories} cal · ${t.protein}g protein</small></span><span>›</span>`;
    button.addEventListener("click", () => {
      selectedFormula = name;
      renderPreview();
      go("formulaPreview");
    });
    box.appendChild(button);
  });
}

function renderPreview(){
  const recipe = RECIPES[selectedFormula];
  if(!recipe) return;
  const t = totals(recipe);
  $("#previewTitle").textContent = selectedFormula;
  $("#previewDescription").textContent = recipe.description || "";
  $("#previewCalories").textContent = t.calories;
  $("#previewProtein").textContent = `${t.protein}g`;
  const list = $("#previewIngredients");
  list.innerHTML = "";
  allIngredients(recipe).forEach(item => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = item.name;
    list.appendChild(chip);
  });
}

function makeFormula(){
  const recipe = RECIPES[selectedFormula];
  const experiment = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    number: nextNumber++,
    formula: selectedFormula,
    status: "making",
    startedAt: new Date().toLocaleString(),
    chilledAt: "",
    stepsDone: []
  };
  activeExperiments.unshift(experiment);
  save();
  renderGuided(experiment);
  go("guided");
}

function stepsFor(recipe){
  const ingredients = allIngredients(recipe);
  const ingredientSteps = ingredients.map((item, idx) => ({
    title: idx < recipe.base.length ? "Measure Base" : "Add Additive",
    text: `${item.amount} ${item.name}`
  }));
  const methodSteps = (recipe.method || []).map(text => ({ title: "Procedure", text }));
  return [...ingredientSteps, ...methodSteps];
}

function renderGuided(experiment){
  const recipe = RECIPES[experiment.formula];
  selectedFormula = experiment.formula;
  $("#guidedTitle").textContent = experiment.formula;
  const list = $("#stepList");
  list.innerHTML = "";
  stepsFor(recipe).forEach((step, index) => {
    const label = document.createElement("label");
    label.className = `step ${experiment.stepsDone.includes(index) ? "done" : ""}`;
    label.innerHTML = `<input type="checkbox" ${experiment.stepsDone.includes(index) ? "checked" : ""}><div><strong>Step ${index+1} — ${escapeHtml(step.title)}</strong><p>${escapeHtml(step.text)}</p></div>`;
    const check = label.querySelector("input");
    check.addEventListener("change", () => {
      if(check.checked && !experiment.stepsDone.includes(index)) experiment.stepsDone.push(index);
      if(!check.checked) experiment.stepsDone = experiment.stepsDone.filter(n => n !== index);
      label.classList.toggle("done", check.checked);
      const stored = activeExperiments.find(e => e.id === experiment.id);
      if(stored) stored.stepsDone = experiment.stepsDone;
      save();
    });
    list.appendChild(label);
  });
  $("#saveChillBtn").onclick = () => saveAndChill(experiment.id);
}

function saveAndChill(id){
  const experiment = activeExperiments.find(e => e.id === id) || activeExperiments[0];
  if(!experiment) return;
  experiment.status = "chilling";
  experiment.chilledAt = new Date().toLocaleString();
  save();
  renderActive();
  go("active");
}

function renderActive(){
  const box = $("#activeList");
  if(!activeExperiments.length){ box.className = "list empty"; box.textContent = "No active experiments."; return; }
  box.className = "list";
  box.innerHTML = "";
  activeExperiments.forEach(exp => {
    const div = document.createElement("div");
    div.className = "saved";
    div.innerHTML = `<strong>Experiment #${exp.number} — ${escapeHtml(exp.formula)}</strong><p>${exp.status === "chilling" ? "Chilling / ready to taste" : "In progress"}</p><div class="muted">Started: ${escapeHtml(exp.startedAt)}</div>`;
    const row = document.createElement("div");
    row.style.display = "flex"; row.style.gap = "10px"; row.style.flexWrap = "wrap"; row.style.marginTop = "12px";
    const resume = document.createElement("button");
    resume.className = "primary"; resume.textContent = exp.status === "chilling" ? "Taste & Finish" : "Resume Steps";
    resume.onclick = () => exp.status === "chilling" ? finishExperiment(exp.id) : (renderGuided(exp), go("guided"));
    const discard = document.createElement("button");
    discard.className = "danger"; discard.textContent = "Discard";
    discard.onclick = () => { if(confirm("Discard this active experiment?")){ activeExperiments = activeExperiments.filter(e => e.id !== exp.id); save(); renderActive(); }};
    row.append(resume, discard); div.appendChild(row); box.appendChild(div);
  });
}

function finishExperiment(id){
  const exp = activeExperiments.find(e => e.id === id);
  if(!exp) return;
  finishingId = id;
  $("#finishTitle").textContent = `Experiment #${exp.number} — ${exp.formula}`;
  $("#notesText").value = ""; $("#conclusionText").value = ""; $("#makeAgain").checked = true;
  go("finish");
}

function saveResult(){
  const exp = activeExperiments.find(e => e.id === finishingId);
  if(!exp) return;
  const recipe = RECIPES[exp.formula];
  const t = totals(recipe);
  const result = {
    ...exp,
    status: "completed",
    completedAt: new Date().toLocaleString(),
    calories: t.calories,
    protein: t.protein,
    ratings: {
      texture: Number($("#textureRating").value), sweetness: Number($("#sweetnessRating").value),
      flavor: Number($("#flavorRating").value), protein: Number($("#proteinRating").value)
    },
    wouldMakeAgain: $("#makeAgain").checked,
    notes: $("#notesText").value.trim(),
    conclusion: $("#conclusionText").value.trim()
  };
  completedExperiments.unshift(result);
  activeExperiments = activeExperiments.filter(e => e.id !== finishingId);
  if(result.wouldMakeAgain){
    protocols.unshift({
      formula: result.formula, calories: result.calories, protein: result.protein,
      savedAt: result.completedAt, notes: result.notes, conclusion: result.conclusion,
      rating: Math.round((result.ratings.texture + result.ratings.sweetness + result.ratings.flavor + result.ratings.protein)/4)
    });
  }
  finishingId = null;
  save(); renderAll(); go("experiments");
}

function renderProtocols(){
  const box = $("#protocolList");
  if(!protocols.length){ box.className = "list empty"; box.textContent = "No protocols saved yet."; return; }
  box.className = "list"; box.innerHTML = "";
  protocols.forEach(p => {
    const div = document.createElement("div"); div.className = "saved";
    div.innerHTML = `<strong>${escapeHtml(p.formula)} · ${"★".repeat(p.rating || 4)}</strong><p>${p.calories} calories · ${p.protein}g protein</p>${p.conclusion ? `<p><b>Conclusion:</b> ${escapeHtml(p.conclusion)}</p>` : ""}<div class="muted">${escapeHtml(p.savedAt)}</div>`;
    box.appendChild(div);
  });
}

function renderExperiments(){
  const box = $("#experimentList");
  if(!completedExperiments.length){ box.className = "list empty"; box.textContent = "No experiments logged yet."; return; }
  box.className = "list"; box.innerHTML = "";
  completedExperiments.forEach(e => {
    const avg = Math.round((e.ratings.texture + e.ratings.sweetness + e.ratings.flavor + e.ratings.protein)/4);
    const div = document.createElement("div"); div.className = "saved";
    div.innerHTML = `<strong>Experiment #${e.number} — ${escapeHtml(e.formula)}</strong><p>${"★".repeat(avg)} · ${e.calories} cal · ${e.protein}g protein</p>${e.notes ? `<p><b>Notes:</b> ${escapeHtml(e.notes)}</p>` : ""}${e.conclusion ? `<p><b>Conclusion:</b> ${escapeHtml(e.conclusion)}</p>` : ""}<div class="muted">${escapeHtml(e.completedAt)}</div>`;
    box.appendChild(div);
  });
}

function renderInventory(){
  const names = new Set();
  Object.values(RECIPES).forEach(r => allIngredients(r).forEach(i => names.add(i.name)));
  const box = $("#inventoryList"); box.innerHTML = "";
  [...names].sort().forEach(name => {
    const label = document.createElement("label"); label.className = "inventory-item";
    label.innerHTML = `<input type="checkbox" ${inventory[name] ? "checked" : ""}><span>${escapeHtml(name)}</span>`;
    label.querySelector("input").onchange = e => { inventory[name] = e.target.checked; save(); };
    box.appendChild(label);
  });
}

function updateCounts(){
  $("#activeCount").textContent = `(${activeExperiments.length})`;
  $("#protocolCount").textContent = `(${protocols.length})`;
  $("#experimentCount").textContent = `(${completedExperiments.length})`;
}
function save(){
  localStorage.setItem(KEYS.active, JSON.stringify(activeExperiments));
  localStorage.setItem(KEYS.completed, JSON.stringify(completedExperiments));
  localStorage.setItem(KEYS.protocols, JSON.stringify(protocols));
  localStorage.setItem(KEYS.inventory, JSON.stringify(inventory));
  localStorage.setItem(KEYS.nextNumber, String(nextNumber));
  updateCounts();
}
function readJson(key, fallback){ try{return JSON.parse(localStorage.getItem(key)) || fallback;}catch{return fallback;} }
function clearProtocols(){ if(confirm("Clear saved protocols?")){ protocols=[]; save(); renderProtocols(); }}
function clearExperiments(){ if(confirm("Clear completed experiment log?")){ completedExperiments=[]; save(); renderExperiments(); }}
function escapeHtml(value){ return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }

start();
