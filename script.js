let currentBase = [];
let currentMixins = [];
let savedRecipes = JSON.parse(localStorage.getItem("fluffLabExperiments") || "[]");
let labNotes = JSON.parse(localStorage.getItem("fluffLabNotes") || "[]");
let pantry = JSON.parse(localStorage.getItem("fluffLabPantry") || "{}");

const flavorSelect = document.getElementById("flavorSelect");
const noteFlavor = document.getElementById("noteFlavor");
const baseList = document.getElementById("baseList");
const mixInList = document.getElementById("mixInList");
const caloriesTotal = document.getElementById("caloriesTotal");
const proteinTotal = document.getElementById("proteinTotal");
const recipeNotes = document.getElementById("recipeNotes");
const savedList = document.getElementById("savedList");
const notesList = document.getElementById("notesList");
const noteText = document.getElementById("noteText");
const pantryList = document.getElementById("pantryList");
const availableList = document.getElementById("availableList");

function clone(items) {
  return items.map(item => ({ ...item }));
}

function start() {
  Object.keys(RECIPES).forEach(flavor => {
    flavorSelect.appendChild(makeOption(flavor));
    noteFlavor.appendChild(makeOption(flavor));
  });

  flavorSelect.value = "Key Lime Pie";
  noteFlavor.value = "Key Lime Pie";
  loadFlavor("Key Lime Pie");

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => showTab(tab.dataset.tab));
  });

  flavorSelect.addEventListener("change", () => loadFlavor(flavorSelect.value));
  document.getElementById("resetBtn").addEventListener("click", () => loadFlavor(flavorSelect.value));
  document.getElementById("addMixInBtn").addEventListener("click", addMixIn);
  document.getElementById("saveBtn").addEventListener("click", saveRecipe);
  document.getElementById("clearSavedBtn").addEventListener("click", clearSaved);
  document.getElementById("saveNoteBtn").addEventListener("click", saveNote);
  document.getElementById("clearNotesBtn").addEventListener("click", clearNotes);
  document.getElementById("clearPantryBtn").addEventListener("click", clearPantry);

  renderPantry();
  renderSaved();
  renderNotes();
}

function makeOption(value) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  return option;
}

function showTab(tabName) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.tab === tabName);
  });

  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.toggle("active", panel.id === tabName);
  });
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
      <div class="ingredient-title">${escapeHtml(item.name)}</div>
      <div class="ingredient-bottom">
        <div class="ingredient-meta">${escapeHtml(item.amount)}</div>
        <div class="ingredient-nutrition">C:${Math.round(Number(item.calories || 0))} &nbsp; P:${Math.round(Number(item.protein || 0))}g</div>
      </div>
    `;

    if (type === "mixins") {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "ghost mini-button";
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

function updateTotals() {
  const { calories, protein } = calculateTotals([...currentBase, ...currentMixins]);
  caloriesTotal.textContent = calories;
  proteinTotal.textContent = `${protein}g`;
}

function calculateTotals(items) {
  return {
    calories: Math.round(items.reduce((sum, item) => sum + Number(item.calories || 0), 0)),
    protein: Math.round(items.reduce((sum, item) => sum + Number(item.protein || 0), 0))
  };
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
  const totals = calculateTotals(all);

  savedRecipes.unshift({
    id: Date.now(),
    number: savedRecipes.length + 1,
    date: new Date().toLocaleDateString(),
    flavor: flavorSelect.value,
    calories: totals.calories,
    protein: totals.protein,
    notes: recipeNotes.value.trim(),
    ingredients: all.map(item => `${item.name} — ${item.amount} — C:${Math.round(Number(item.calories || 0))} P:${Math.round(Number(item.protein || 0))}g`)
  });

  saveExperiments();
  renderSaved();
  showTab("experiments");
}

function renderSaved() {
  if (!savedRecipes.length) {
    savedList.className = "empty";
    savedList.textContent = "No experiments yet.";
    return;
  }

  savedList.className = "";
  savedList.innerHTML = "";

  savedRecipes.forEach((recipe, index) => {
    const div = document.createElement("div");
    div.className = "saved";
    div.innerHTML = `
      <strong>Experiment #${savedRecipes.length - index}: ${escapeHtml(recipe.flavor)}</strong>
      <div class="muted">${escapeHtml(recipe.date || "No date saved")}</div>
      <div>${recipe.calories} calories · ${recipe.protein}g protein</div>
      ${recipe.notes ? `<div class="note-block">${escapeHtml(recipe.notes)}</div>` : ""}
      <details>
        <summary>Ingredients</summary>
        <ul>${recipe.ingredients.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </details>
    `;
    savedList.appendChild(div);
  });
}

function saveExperiments() {
  localStorage.setItem("fluffLabExperiments", JSON.stringify(savedRecipes));
}

function clearSaved() {
  if (!confirm("Clear the experiment log?")) return;
  savedRecipes = [];
  saveExperiments();
  renderSaved();
}

function saveNote() {
  const text = noteText.value.trim();
  if (!text) return;

  labNotes.unshift({
    id: Date.now(),
    flavor: noteFlavor.value,
    text,
    date: new Date().toLocaleDateString()
  });

  noteText.value = "";
  saveNotes();
  renderNotes();
}

function renderNotes() {
  if (!labNotes.length) {
    notesList.className = "empty";
    notesList.textContent = "No lab notes yet.";
    return;
  }

  notesList.className = "";
  notesList.innerHTML = "";

  labNotes.forEach(note => {
    const div = document.createElement("div");
    div.className = "saved";
    div.innerHTML = `
      <strong>${escapeHtml(note.flavor)}</strong>
      <div class="muted">${escapeHtml(note.date)}</div>
      <div class="note-block">${escapeHtml(note.text)}</div>
    `;
    notesList.appendChild(div);
  });
}

function saveNotes() {
  localStorage.setItem("fluffLabNotes", JSON.stringify(labNotes));
}

function clearNotes() {
  if (!confirm("Clear all lab notes?")) return;
  labNotes = [];
  saveNotes();
  renderNotes();
}

function renderPantry() {
  const ingredients = getUniqueIngredients();
  pantryList.innerHTML = "";

  ingredients.forEach(name => {
    const id = `pantry-${slugify(name)}`;
    const label = document.createElement("label");
    label.className = "check-item";
    label.innerHTML = `
      <input type="checkbox" id="${id}" ${pantry[name] ? "checked" : ""} />
      <span>${escapeHtml(name)}</span>
    `;

    label.querySelector("input").addEventListener("change", event => {
      pantry[name] = event.target.checked;
      localStorage.setItem("fluffLabPantry", JSON.stringify(pantry));
      renderAvailableFormulas();
    });

    pantryList.appendChild(label);
  });

  renderAvailableFormulas();
}

function getUniqueIngredients() {
  const set = new Set();
  Object.values(RECIPES).forEach(recipe => {
    [...recipe.base, ...recipe.mixins].forEach(item => set.add(item.name));
  });
  return [...set].sort();
}

function renderAvailableFormulas() {
  const checked = Object.values(pantry).some(Boolean);
  if (!checked) {
    availableList.className = "empty";
    availableList.textContent = "Check pantry items to see what you can make.";
    return;
  }

  const matches = Object.entries(RECIPES).map(([flavor, recipe]) => {
    const needed = [...recipe.base, ...recipe.mixins].map(item => item.name);
    const missing = needed.filter(name => !pantry[name]);
    return { flavor, missing };
  });

  availableList.className = "";
  availableList.innerHTML = matches.map(match => `
    <div class="saved">
      <strong>${escapeHtml(match.flavor)}</strong>
      ${match.missing.length === 0
        ? `<div class="ready">Ready to make</div>`
        : `<div class="muted">Missing: ${escapeHtml(match.missing.join(", "))}</div>`}
    </div>
  `).join("");
}

function clearPantry() {
  pantry = {};
  localStorage.setItem("fluffLabPantry", JSON.stringify(pantry));
  renderPantry();
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
