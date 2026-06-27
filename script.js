let currentBase = [];
let currentMixins = [];
let savedRecipes = [];

const flavorSelect = document.getElementById("flavorSelect");
const baseList = document.getElementById("baseList");
const mixInList = document.getElementById("mixInList");
const caloriesTotal = document.getElementById("caloriesTotal");
const proteinTotal = document.getElementById("proteinTotal");
const recipeNotes = document.getElementById("recipeNotes");
const savedList = document.getElementById("savedList");

function clone(items) {
  return items.map(item => ({ ...item }));
}

function start() {
  Object.keys(RECIPES).forEach(flavor => {
    const option = document.createElement("option");
    option.value = flavor;
    option.textContent = flavor;
    flavorSelect.appendChild(option);
  });

  flavorSelect.value = "Key Lime Pie";
  loadFlavor("Key Lime Pie");

  flavorSelect.addEventListener("change", () => loadFlavor(flavorSelect.value));
  document.getElementById("resetBtn").addEventListener("click", () => loadFlavor(flavorSelect.value));
  document.getElementById("addMixInBtn").addEventListener("click", addMixIn);
  document.getElementById("saveBtn").addEventListener("click", saveRecipe);
  document.getElementById("clearSavedBtn").addEventListener("click", clearSaved);
}

function loadFlavor(flavor) {
  currentBase = clone(RECIPES[flavor].base);
  currentMixins = clone(RECIPES[flavor].mixins);
  recipeNotes.value = "";
  renderAll();
}

function renderAll() {
  renderList(baseList, currentBase, "base");
  renderList(mixInList, currentMixins, "mixins");
  updateTotals();
}

function renderList(container, items, type) {
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = `<div class="empty">No mix-ins yet.</div>`;
    return;
  }

  items.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "ingredient";

    row.innerHTML = `
      <div class="ingredient-main">
        <div class="ingredient-title">${escapeHtml(item.name)}</div>
        <div class="ingredient-meta">${escapeHtml(item.amount)}</div>
      </div>
    `;


    if (type === "mixins") {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "ghost";
      remove.style.marginTop = "10px";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        currentMixins.splice(index, 1);
        renderAll();
      });
      row.appendChild(remove);
    }

    container.appendChild(row);
  });
}

function recalcFromAmount(item) {
  // v1.2 keeps macro math simple.
  // This placeholder keeps the app ready for v1.3 gram-based scaling.
  return item;
}

function updateTotals() {
  const all = [...currentBase, ...currentMixins];
  const calories = all.reduce((sum, item) => sum + Number(item.calories || 0), 0);
  const protein = all.reduce((sum, item) => sum + Number(item.protein || 0), 0);

  caloriesTotal.textContent = Math.round(calories);
  proteinTotal.textContent = `${Math.round(protein)}g`;
}

function addMixIn() {
  const name = prompt("Mix-in name?");
  if (!name) return;

  const amount = prompt("Amount? Example: 50 g, 1 tbsp, 1 cookie") || "custom";
  const calories = Number(prompt("Calories?") || 0);
  const protein = Number(prompt("Protein grams?") || 0);

  currentMixins.push({ name, amount, calories, protein });
  renderAll();
}

function saveRecipe() {
  const all = [...currentBase, ...currentMixins];
  const calories = all.reduce((sum, item) => sum + Number(item.calories || 0), 0);
  const protein = all.reduce((sum, item) => sum + Number(item.protein || 0), 0);

  savedRecipes.unshift({
    flavor: flavorSelect.value,
    calories: Math.round(calories),
    protein: Math.round(protein),
    notes: recipeNotes.value.trim(),
    ingredients: all.map(item => `${item.name} — ${item.amount}`)
  });

  renderSaved();
}

function renderSaved() {
  if (!savedRecipes.length) {
    savedList.className = "empty";
    savedList.textContent = "No saved recipes yet.";
    return;
  }

  savedList.className = "";
  savedList.innerHTML = "";

  savedRecipes.forEach(recipe => {
    const div = document.createElement("div");
    div.className = "saved";
    div.innerHTML = `
      <strong>${escapeHtml(recipe.flavor)}</strong>
      <div>${recipe.calories} calories · ${recipe.protein}g protein</div>
      ${recipe.notes ? `<div class="muted">${escapeHtml(recipe.notes)}</div>` : ""}
    `;
    savedList.appendChild(div);
  });
}

function clearSaved() {
  savedRecipes = [];
  renderSaved();
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
