const STORAGE_KEYS = {
  experiments: 'fluffLabV15Experiments',
  notes: 'fluffLabV15Notes',
  pantry: 'fluffLabV15Pantry'
};

const ingredientBank = [
  { name: 'Chobani Nonfat Greek Yogurt', unit: 'cup', calories: 120, protein: 21 },
  { name: 'Transparent Labs Chocolate Whey', unit: 'scoop', calories: 120, protein: 28 },
  { name: 'Transparent Labs Vanilla Whey', unit: 'scoop', calories: 120, protein: 28 },
  { name: 'Sugar Free Cheesecake Pudding Mix', unit: 'tbsp', calories: 25, protein: 0 },
  { name: 'Sugar Free Vanilla Pudding Mix', unit: 'tbsp', calories: 25, protein: 0 },
  { name: 'Lite Whipped Topping', unit: 'tbsp', calories: 20, protein: 0 },
  { name: 'Acacia Fiber', unit: 'tbsp', calories: 30, protein: 0 },
  { name: 'Frozen Strawberries', unit: 'cup', calories: 50, protein: 1 },
  { name: 'Frozen Blueberries', unit: 'cup', calories: 80, protein: 1 },
  { name: 'Key Lime Juice', unit: 'tbsp', calories: 4, protein: 0 },
  { name: 'Graham Cracker Crumbs', unit: 'tbsp', calories: 32, protein: 0.5 }
];

const formulas = [
  {
    name: 'Base Protein Fluff',
    ingredients: [
      ['Chobani Nonfat Greek Yogurt', 1],
      ['Transparent Labs Chocolate Whey', 1],
      ['Sugar Free Cheesecake Pudding Mix', 1],
      ['Lite Whipped Topping', 2],
      ['Acacia Fiber', 1]
    ]
  },
  {
    name: 'Strawberry Cheesecake',
    ingredients: [
      ['Chobani Nonfat Greek Yogurt', 1],
      ['Transparent Labs Vanilla Whey', 1],
      ['Sugar Free Cheesecake Pudding Mix', 1],
      ['Lite Whipped Topping', 2],
      ['Acacia Fiber', 1],
      ['Frozen Strawberries', 0.5],
      ['Graham Cracker Crumbs', 1]
    ]
  },
  {
    name: 'Key Lime Pie',
    ingredients: [
      ['Chobani Nonfat Greek Yogurt', 1],
      ['Transparent Labs Vanilla Whey', 1],
      ['Sugar Free Vanilla Pudding Mix', 1],
      ['Lite Whipped Topping', 2],
      ['Acacia Fiber', 1],
      ['Key Lime Juice', 2],
      ['Graham Cracker Crumbs', 1]
    ]
  }
];

let currentIngredients = [];

const $ = (id) => document.getElementById(id);
const findIngredient = (name) => ingredientBank.find(i => i.name === name) || ingredientBank[0];
const round = (n) => Math.round(n * 10) / 10;

function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function initTabs() {
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      $(btn.dataset.tab).classList.add('active');
    });
  });
}

function initFlavorSelect() {
  const select = $('flavorSelect');
  formulas.forEach((f, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = f.name;
    select.appendChild(opt);
  });
  select.addEventListener('change', () => loadFormula(Number(select.value)));
  loadFormula(0);
}

function loadFormula(index) {
  const formula = formulas[index];
  $('formulaTitle').textContent = formula.name;
  currentIngredients = formula.ingredients.map(([name, amount]) => ({ name, amount }));
  renderIngredients();
}

function renderIngredients() {
  const list = $('ingredientList');
  list.innerHTML = '';
  currentIngredients.forEach((row, index) => {
    const info = findIngredient(row.name);
    const el = document.createElement('div');
    el.className = 'ingredient-row';
    el.innerHTML = `
      <select data-index="${index}" class="ingredient-name"></select>
      <input data-index="${index}" class="ingredient-amount" type="number" step="0.25" min="0" value="${row.amount}">
      <span class="muted">${info.unit}</span>
      <span class="nutrient-pill">C: ${round(info.calories * row.amount)} | P: ${round(info.protein * row.amount)}g</span>
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;
    const select = el.querySelector('.ingredient-name');
    ingredientBank.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.name;
      opt.textContent = item.name;
      if (item.name === row.name) opt.selected = true;
      select.appendChild(opt);
    });
    list.appendChild(el);
  });

  document.querySelectorAll('.ingredient-name').forEach(sel => {
    sel.addEventListener('change', e => {
      currentIngredients[e.target.dataset.index].name = e.target.value;
      renderIngredients();
    });
  });
  document.querySelectorAll('.ingredient-amount').forEach(input => {
    input.addEventListener('input', e => {
      currentIngredients[e.target.dataset.index].amount = Number(e.target.value || 0);
      renderIngredients();
    });
  });
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      currentIngredients.splice(Number(e.target.dataset.index), 1);
      renderIngredients();
    });
  });
  updateTotals();
}

function updateTotals() {
  let calories = 0;
  let protein = 0;
  currentIngredients.forEach(row => {
    const info = findIngredient(row.name);
    calories += info.calories * row.amount;
    protein += info.protein * row.amount;
  });
  $('totalCalories').textContent = Math.round(calories);
  $('totalProtein').textContent = `${round(protein)}g`;
}

function initPantry() {
  const saved = load(STORAGE_KEYS.pantry, {});
  const list = $('pantryList');
  list.innerHTML = '';
  ingredientBank.forEach(item => {
    const label = document.createElement('label');
    label.className = 'pantry-item';
    label.innerHTML = `<input type="checkbox" ${saved[item.name] ? 'checked' : ''}> <span>${item.name}</span>`;
    label.querySelector('input').addEventListener('change', e => {
      saved[item.name] = e.target.checked;
      save(STORAGE_KEYS.pantry, saved);
    });
    list.appendChild(label);
  });
}

function saveExperiment() {
  const experiments = load(STORAGE_KEYS.experiments, []);
  const entry = {
    date: new Date().toLocaleString(),
    formula: $('formulaTitle').textContent,
    calories: $('totalCalories').textContent,
    protein: $('totalProtein').textContent,
    notes: $('batchNotes').value.trim(),
    ingredients: currentIngredients.map(row => {
      const info = findIngredient(row.name);
      return `${row.amount} ${info.unit} ${row.name}`;
    })
  };
  experiments.unshift(entry);
  save(STORAGE_KEYS.experiments, experiments);
  $('batchNotes').value = '';
  renderExperiments();
}

function renderExperiments() {
  const experiments = load(STORAGE_KEYS.experiments, []);
  const list = $('experimentList');
  list.innerHTML = experiments.length ? '' : '<p class="muted">No experiments saved yet.</p>';
  experiments.forEach((entry, idx) => {
    const el = document.createElement('div');
    el.className = 'log-item';
    el.innerHTML = `
      <div class="log-meta">Experiment #${experiments.length - idx} • ${entry.date}</div>
      <h3>${entry.formula}</h3>
      <p><strong>${entry.calories} Cal | ${entry.protein} Protein</strong></p>
      <p>${entry.ingredients.join('<br>')}</p>
      ${entry.notes ? `<p><strong>Observation:</strong> ${entry.notes}</p>` : ''}
    `;
    list.appendChild(el);
  });
}

function saveNote() {
  const flavor = $('noteFlavor').value.trim();
  const text = $('noteText').value.trim();
  if (!flavor && !text) return;
  const notes = load(STORAGE_KEYS.notes, []);
  notes.unshift({ date: new Date().toLocaleString(), flavor, text });
  save(STORAGE_KEYS.notes, notes);
  $('noteFlavor').value = '';
  $('noteText').value = '';
  renderNotes();
}

function renderNotes() {
  const notes = load(STORAGE_KEYS.notes, []);
  const list = $('notesList');
  list.innerHTML = notes.length ? '' : '<p class="muted">No lab notes yet.</p>';
  notes.forEach(note => {
    const el = document.createElement('div');
    el.className = 'log-item';
    el.innerHTML = `
      <div class="log-meta">${note.date}</div>
      <h3>${note.flavor || 'General Note'}</h3>
      <p>${note.text}</p>
    `;
    list.appendChild(el);
  });
}

$('addIngredientBtn').addEventListener('click', () => {
  currentIngredients.push({ name: ingredientBank[0].name, amount: 1 });
  renderIngredients();
});
$('saveExperimentBtn').addEventListener('click', saveExperiment);
$('saveNoteBtn').addEventListener('click', saveNote);
$('clearLogBtn').addEventListener('click', () => {
  if (confirm('Clear all saved experiments?')) {
    save(STORAGE_KEYS.experiments, []);
    renderExperiments();
  }
});

initTabs();
initFlavorSelect();
initPantry();
renderExperiments();
renderNotes();
