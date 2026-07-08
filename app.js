const STORAGE = {
  settings:"fluffLabV40Settings",
  supplies:"fluffLabV40Supplies",
  experiments:"fluffLabV40Experiments",
  protocols:"fluffLabV40Protocols"
};

let state = {
  view:"home",
  history:[],
  selectedFormulaId:null,
  activeExperimentId:null,
  settings:{ measurement:"kitchen" ,labManualOpened:false},
  supplies:{...FLUFF_DATA.defaultSupplies},
  experiments:[],
  protocols:[]
};

const screen = document.getElementById("screen");
const backBtn = document.getElementById("backBtn");
const labBtn = document.getElementById("labBtn");

function start(){
  load();
  backBtn.addEventListener("click", goBack);
  labBtn.addEventListener("click", () => navigate("home", {}, false));
  if(!state.settings.labManualOpened){
    navigate("manual", {}, false);
  } else {
    render();
  }
}

function load(){
  state.settings = readJson(STORAGE.settings, state.settings);
  state.supplies = {...FLUFF_DATA.defaultSupplies, ...readJson(STORAGE.supplies, {})};
  state.experiments = readJson(STORAGE.experiments, []);
  state.protocols = readJson(STORAGE.protocols, []);
}
function save(){
  localStorage.setItem(STORAGE.settings, JSON.stringify(state.settings));
  localStorage.setItem(STORAGE.supplies, JSON.stringify(state.supplies));
  localStorage.setItem(STORAGE.experiments, JSON.stringify(state.experiments));
  localStorage.setItem(STORAGE.protocols, JSON.stringify(state.protocols));
}
function readJson(key,fallback){ try{return JSON.parse(localStorage.getItem(key)) || fallback}catch{return fallback} }

function navigate(view, params={}, push=true){
  if(view === "manual"){
    state.settings.labManualOpened = true;
    save();
  }

  if(push) state.history.push({view:state.view, selectedFormulaId:state.selectedFormulaId, activeExperimentId:state.activeExperimentId});
  state.view = view;
  if(params.formulaId !== undefined) state.selectedFormulaId = params.formulaId;
  if(params.experimentId !== undefined) state.activeExperimentId = params.experimentId;
  window.scrollTo({top:0, behavior:"smooth"});
  render();
}
function goBack(){
  const prev = state.history.pop();
  if(!prev){ navigate("home", {}, false); return; }
  state.view = prev.view; state.selectedFormulaId = prev.selectedFormulaId; state.activeExperimentId = prev.activeExperimentId;
  window.scrollTo({top:0, behavior:"smooth"}); render();
}

function render(){
  const activeExp = state.experiments.find(e => e.id === state.activeExperimentId);
  const keepFrankensteinTheme = (state.view === "experiment" || state.view === "finishExperiment") && activeExp?.isFrankenstein;
  document.body.classList.toggle("frankenstein-mode", Boolean(keepFrankensteinTheme));
  backBtn.style.visibility = state.view === "home" ? "hidden" : "visible";
  const map = {home, formulas, formulaPreview, experiment, finishExperiment, protocols, protocolDetail, labSupplies, experimentLog, settings, manual};
  (map[state.view] || home)();
}

function home(){
  const activeCount = state.experiments.filter(e=>e.status !== "complete").length;
  const labManualLabel = state.settings.labManualOpened
    ? "Lab Manual"
    : "Start Here: Lab Manual";
  screen.innerHTML = `
    <section class="hero">
      <div class="brand-row">
        <div class="brand-title">
          <div class="big-mark">${flaskSvg()}</div>
          <div>
            <h1>Fluff Lab</h1>
            <p class="tagline">Science Never Tasted So Good.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="home-grid">
      ${action("Formulas", "Browse the formula library", "formulas")}
      ${action("Protocols", `${state.protocols.length} preserved protocol${state.protocols.length===1?"":"s"}`, "protocols")}
      ${action("Lab Supplies", "Set your current products", "labSupplies")}
      ${action("Experiment Log", "Review active and completed experiments", "experimentLog")}
      ${action("Settings", "Measurement system and app details", "settings")}
      ${action(labManualLabel, "How Fluff Lab works", "manual")}
    </section>`;
  bindActions();
}
function action(title, subtitle, view, primary=false){return `<button class="action-card ${primary?"primary":""}" data-view="${view}"><div><strong>${title}</strong><span>${subtitle}</span></div><span class="chev">›</span></button>`}
function bindActions(){document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)))}

function formulas(){
  screen.innerHTML = `
    <section class="card">
      <div class="section-head"><div><h2>Formulas</h2><p class="subtitle">What do you want to make?</p></div><span class="pill">A–Z</span></div>
      <div class="list">${FLUFF_DATA.formulas.map(f=>`
        <button class="list-button" data-formula="${f.id}">
          <div><strong>${f.name}</strong><div class="meta">${f.description}</div></div><span class="chev">›</span>
        </button>`).join("")}</div>
    </section>`;
  document.querySelectorAll("[data-formula]").forEach(b=>b.addEventListener("click",()=>navigate("formulaPreview",{formulaId:b.dataset.formula})));
}

function formulaPreview(){
  const f = getFormula(state.selectedFormulaId);
  const totals = formulaTotals(f);
  screen.innerHTML = `
    <section class="card">
      <div class="section-head"><div><h2>${escapeHtml(f.name)}</h2><p class="subtitle">${escapeHtml(f.description)}</p></div></div>
      <h3>Formula Summary</h3>
      <div class="summary-grid" style="margin-top:10px">
        ${summaryBox(totals.calories,"Calories")}${summaryBox(`${totals.protein}g`,"Protein")}${summaryBox(`${totals.carbs}g`,"Carbs")}${summaryBox(`${totals.fiber}g`,"Fiber")}
      </div>
      <div class="card" style="box-shadow:none;margin-bottom:0">
        <h3>Required Lab Supplies</h3>
        <p class="subtitle">Ingredient amounts appear after selecting <strong>Make This Formula</strong>.</p>
        <ul class="ingredient-bullets">${uniqueIngredients(f).map(id=>`<li>${escapeHtml(FLUFF_DATA.genericIngredients[id].name)}</li>`).join("")}</ul>
      </div>
      <button class="primary-btn full" id="makeBtn" style="margin-top:14px">Make This Formula</button>
      <button class="frankenstein-btn full" id="frankensteinBtn" style="margin-top:10px">Frankenstein Formula</button>
    </section>`;

  document.getElementById("makeBtn").addEventListener("click",()=>createExperiment(f.id));
  document.getElementById("frankensteinBtn").addEventListener("click",()=>launchFrankenstein(f.id));
}

function launchFrankenstein(formulaId){
  createExperiment(formulaId, true);
}

function summaryBox(num,label){
  return `<div class="summary-box"><div class="summary-num">${num}</div><div class="summary-label">${label}</div></div>`;
}

function createExperiment(formulaId, isFrankenstein=false){
  const f = getFormula(formulaId);
  const exp = {
    id:`exp_${Date.now()}`,
    formulaId,
    formulaName:f.name,
    name:f.name,
    status:"making",
    createdAt:new Date().toLocaleString(),
    ingredientMultipliers:f.ingredients.map(i=>i.multiplier),
    isFrankenstein,
    customIngredients:[],
    checks:{},
    observations:"",
    conclusion:"",
    rating:0
  };
  state.experiments.unshift(exp); save(); navigate("experiment",{experimentId:exp.id});
}
function frankensteinProcedure(){
  return [
    "Mix the base ingredients until smooth.",
    "Fold in any fruit or additives.",
    "Cover and chill until thickened.",
    "Record your observations."
  ];
}
function experiment(){
  const exp = getExperiment(state.activeExperimentId);
  if(!exp){ navigate("experimentLog",{},false); return; }
  const f = getFormula(exp.formulaId);
  const totals = experimentTotals(exp);
  const ingredientsByGroup = groupIngredients(f, exp);
  screen.innerHTML = `
    <section class="card">
      <div class="section-head"><div><h2>Guided Experiment</h2><p class="subtitle">${escapeHtml(exp.name)}</p></div><span class="pill">${escapeHtml(exp.status)}</span></div>
      <div class="summary-grid">${summaryBox(totals.calories,"Calories")}${summaryBox(`${totals.protein}g`,"Protein")}</div>
    </section>
    <section class="card">
      <h3>Ingredients</h3>
      <p class="subtitle">Adjust amounts before you start mixing.</p>
      ${Object.entries(ingredientsByGroup).map(([group,items])=>`
        <div class="step-group"><div class="group-title">${groupLabel(group)}</div>
        ${items.map(item=>ingredientControl(item, exp)).join("")}</div>`).join("")}
      ${exp.isFrankenstein ? customIngredientControls(exp) : ""}
      ${exp.isFrankenstein ? `<button class="frankenstein-btn full" id="addIngredientBtn" style="margin-top:12px">+ Add Ingredient</button>` : ""}
    </section>
    <section class="card">
      <h3>Procedure</h3>
      ${(exp.isFrankenstein ? frankensteinProcedure() : f.procedure)
        .map((step,idx)=>checkRow(`proc_${idx}`, step, exp))
        .join("")}
      <div class="button-row">
        <button class="secondary-btn" id="saveChillBtn">Save & Chill</button>
        <button class="primary-btn" id="finishBtn">Finish Experiment</button>
      </div>
    </section>`;
  bindExperimentControls(exp,f);
}
function ingredientControl(item, exp){
  const ing = FLUFF_DATA.genericIngredients[item.ingredient];
  const product = getProduct(item.ingredient);
  const idx = item.index;
  const multi = exp.ingredientMultipliers[idx];
  const macros = scaledProduct(product,multi);
  return `<div class="soft-card" style="margin:10px 0">
    <strong>${escapeHtml(ing.name)}</strong>
    <div class="tiny">Using: ${escapeHtml(product.name)}</div>
    <div class="amount-row">
      <button class="round-btn" data-dec="${idx}">−</button>
      <div class="amount-display">${displayAmount(product,multi)}</div>
      <button class="round-btn" data-inc="${idx}">+</button>
    </div>
    <div class="macro-line">${macros.calories} cal · ${macros.protein}g protein</div>
    <div class="effect">${escapeHtml((ing.effects || [])[0] || ing.purpose)}</div>
  </div>`;
}
function checkRow(key,text,exp){return `<label class="check-row"><input type="checkbox" data-check="${key}" ${exp.checks[key]?"checked":""}/><span>${escapeHtml(text)}</span></label>`}
function bindExperimentControls(exp,f){
  document.querySelectorAll("[data-inc]").forEach(btn=>btn.addEventListener("click",()=>changeAmount(exp, f, Number(btn.dataset.inc), 1)));
  document.querySelectorAll("[data-dec]").forEach(btn=>btn.addEventListener("click",()=>changeAmount(exp, f, Number(btn.dataset.dec), -1)));
  document.querySelectorAll("[data-check]").forEach(input=>input.addEventListener("change",()=>{exp.checks[input.dataset.check]=input.checked;save();}));
  document.getElementById("saveChillBtn").addEventListener("click",()=>{exp.status="chilling";save();navigate("experimentLog");});
  document.getElementById("finishBtn").addEventListener("click",()=>navigate("finishExperiment",{experimentId:exp.id}));
  const addBtn = document.getElementById("addIngredientBtn");
  if(addBtn) addBtn.addEventListener("click",()=>showIngredientPicker(exp));
  document.querySelectorAll("[data-remove-custom]").forEach(btn=>btn.addEventListener("click",()=>{exp.customIngredients.splice(Number(btn.dataset.removeCustom),1);save();render();}));
  document.querySelectorAll("[data-custom-multi]").forEach(sel=>sel.addEventListener("change",()=>{exp.customIngredients[Number(sel.dataset.customMulti)].multiplier=Number(sel.value);save();render();}));
}
function changeAmount(exp,f,index,dir){
  const item = f.ingredients[index]; const opts = item.options || [item.multiplier];
  const current = exp.ingredientMultipliers[index]; let pos = opts.findIndex(o=>Number(o)===Number(current)); if(pos<0) pos = opts.indexOf(item.multiplier);
  const next = Math.max(0, Math.min(opts.length-1, pos + dir)); exp.ingredientMultipliers[index] = opts[next]; save(); render();
}

function customIngredientControls(exp){
  if(!exp.customIngredients?.length) return `<p class="empty">No mutations added yet.</p>`;
  return `<div class="step-group"><div class="group-title">Mutations</div>${exp.customIngredients.map((item,idx)=>{
    const ing=FLUFF_DATA.genericIngredients[item.ingredient]; const product=getProduct(item.ingredient); const macros=scaledProduct(product,item.multiplier);
    const opts=[0.25,0.5,0.75,1,1.25,1.5,2];
    return `<div class="soft-card" style="margin:10px 0"><div class="product-top"><div><strong>${escapeHtml(ing.name)}</strong><div class="tiny">Using: ${escapeHtml(product.name)}</div></div><button class="small-btn" data-remove-custom="${idx}">Remove</button></div><div class="field"><label>Amount</label><select data-custom-multi="${idx}">${opts.map(o=>`<option value="${o}" ${Number(o)===Number(item.multiplier)?"selected":""}>${displayAmount(product,o)}</option>`).join("")}</select></div><div class="macro-line">${macros.calories} cal · ${macros.protein}g protein</div></div>`;
  }).join("")}</div>`;
}

function showIngredientPicker(exp){
  const existing=new Set([...getFormula(exp.formulaId).ingredients.map(i=>i.ingredient), ...(exp.customIngredients||[]).map(i=>i.ingredient)]);
  const choices=Object.values(FLUFF_DATA.genericIngredients).filter(i=>!existing.has(i.id) && getProduct(i.id));
  const wrap=document.createElement("div"); wrap.className="ingredient-picker-backdrop";
  wrap.innerHTML=`<div class="ingredient-picker"><h3>Add Mutation</h3><p class="subtitle">Choose any verified ingredient from the Lab Supplies database.</p><div class="field"><label>Ingredient</label><select id="mutationSelect">${choices.map(i=>`<option value="${i.id}">${escapeHtml(i.name)}</option>`).join("")}</select></div><div class="button-row"><button class="secondary-btn" id="cancelMutation">Cancel</button><button class="frankenstein-btn" id="confirmMutation">Add Ingredient</button></div></div>`;
  document.body.appendChild(wrap);
  wrap.querySelector("#cancelMutation").onclick=()=>wrap.remove();
  wrap.querySelector("#confirmMutation").onclick=()=>{const id=wrap.querySelector("#mutationSelect").value; if(id){exp.customIngredients=exp.customIngredients||[]; exp.customIngredients.push({ingredient:id,multiplier:1});save();wrap.remove();render();}};
}

function finishExperiment(){
  const exp = getExperiment(state.activeExperimentId);
  if(!exp){navigate("experimentLog",{},false);return}
  const totals = experimentTotals(exp);
  screen.innerHTML = `
    <section class="card">
      <h2>Experiment Complete</h2>
      <p class="subtitle">Record what happened, then preserve it as a Protocol if it is worth repeating.</p>
      <div class="summary-grid" style="margin-top:12px">${summaryBox(totals.calories,"Calories")}${summaryBox(`${totals.protein}g`,"Protein")}</div>
      <div class="field"><label>Experiment Name</label><input id="experimentName" value="${escapeAttribute(exp.name)}" /></div>
      <div class="field"><label>Observations</label><textarea id="observations" placeholder="Texture, sweetness, thickness, what changed...">${escapeHtml(exp.observations)}</textarea></div>
      <div class="field"><label>Conclusion</label><textarea id="conclusion" placeholder="What worked? What would you repeat?">${escapeHtml(exp.conclusion)}</textarea></div>
      <div class="field"><label>Overall Rating</label><div class="stars">${[1,2,3,4,5].map(n=>`<button class="star ${exp.rating>=n?"active":""}" data-star="${n}">★</button>`).join("")}</div></div>
      <div class="field"><label>Protocol Name</label><input id="protocolName" value="${escapeAttribute(exp.name)}" /></div>
      <div class="button-row">
        <button class="secondary-btn" id="saveExpBtn">Save Experiment</button>
        <button class="primary-btn" id="protocolBtn">Save Protocol</button>
        <button class="danger-btn" id="deleteExpBtn">Delete Experiment</button>
      </div>;
    </section>`;
  document.querySelectorAll("[data-star]").forEach(b=>b.addEventListener("click",()=>{exp.rating=Number(b.dataset.star);saveFinish(exp,false);render();}));
  document.getElementById("saveExpBtn").addEventListener("click",()=>{saveFinish(exp,true);navigate("experimentLog");});
  document.getElementById("protocolBtn").addEventListener("click",()=>{saveFinish(exp,true);saveProtocol(exp);navigate("protocols");});
  document.getElementById("deleteExpBtn").addEventListener("click",()=>{
    if(confirm("Delete this experiment? This cannot be undone.")){
      state.experiments = state.experiments.filter(e=>e.id !== exp.id);
      save();
      navigate("experimentLog", {}, false);
    }
  });
}
function saveFinish(exp,complete){
  exp.name = document.getElementById("experimentName")?.value.trim() || exp.name;
  exp.observations = document.getElementById("observations")?.value.trim() || "";
  exp.conclusion = document.getElementById("conclusion")?.value.trim() || "";
  if(complete) exp.status="complete";
  save();
}
function saveProtocol(exp){
  const f = getFormula(exp.formulaId); const name = document.getElementById("protocolName")?.value.trim() || exp.name || f.name;
  const protocol = { id:`pro_${Date.now()}`, name, inspiredBy:f.name, formulaId:f.id, experimentId:exp.id, createdAt:new Date().toLocaleString(), rating:exp.rating, observations:exp.observations, conclusion:exp.conclusion, ingredients:captureIngredients(exp) };
  state.protocols.unshift(protocol); save();
}
function captureIngredients(exp){
  const f = getFormula(exp.formulaId);
  const base=f.ingredients.map((it,idx)=>{const product=getProduct(it.ingredient); const multi=exp.ingredientMultipliers[idx]; const macros=scaledProduct(product,multi); return {ingredient:it.ingredient, ingredientName:FLUFF_DATA.genericIngredients[it.ingredient].name, productId:product.id, productName:product.name, amount:displayAmount(product,multi), calories:macros.calories, protein:macros.protein};});
  const custom=(exp.customIngredients||[]).map(it=>{const product=getProduct(it.ingredient); const macros=scaledProduct(product,it.multiplier); return {ingredient:it.ingredient, ingredientName:FLUFF_DATA.genericIngredients[it.ingredient].name, productId:product.id, productName:product.name, amount:displayAmount(product,it.multiplier), calories:macros.calories, protein:macros.protein};});
  return [...base,...custom];
}

function protocols(){
  screen.innerHTML = `<section class="card"><div class="section-head"><div><h2>Protocols</h2><p class="subtitle">Successful experiments worth repeating.</p></div><span class="pill">${state.protocols.length}</span></div>
  <div class="list">${state.protocols.length?state.protocols.map(p=>`<button class="list-button" data-protocol="${p.id}"><div><strong>${escapeHtml(p.name)}</strong><div class="meta">Inspired by ${escapeHtml(p.inspiredBy)} · ${"★".repeat(p.rating || 0)}${"☆".repeat(5-(p.rating||0))}</div></div><span class="chev">›</span></button>`).join(""):`<div class="empty">No protocols saved yet.</div>`}</div></section>`;
  document.querySelectorAll("[data-protocol]").forEach(b=>b.addEventListener("click",()=>{state.activeProtocolId=b.dataset.protocol; navigate("protocolDetail")}));
}
function protocolDetail(){
  const p = state.protocols.find(x=>x.id===state.activeProtocolId) || state.protocols[0]; if(!p){protocols();return}
  screen.innerHTML = `<section class="card"><h2>${escapeHtml(p.name)}</h2><p class="subtitle">Inspired by ${escapeHtml(p.inspiredBy)} · ${escapeHtml(p.createdAt)}</p>
  <div class="summary-grid" style="margin-top:12px">${summaryBox(p.ingredients.reduce((s,i)=>s+i.calories,0),"Calories")}${summaryBox(`${Math.round(p.ingredients.reduce((s,i)=>s+i.protein,0))}g`,"Protein")}</div>
  <div class="card" style="box-shadow:none"><h3>Saved From Ingredients Used</h3><ul class="ingredient-bullets">${p.ingredients.map(i=>`<li>${escapeHtml(i.amount)} ${escapeHtml(i.ingredientName)} <span class="muted">(${escapeHtml(i.productName)})</span></li>`).join("")}</ul></div>
  ${p.observations?`<div class="soft-card"><strong>Observations</strong><p>${escapeHtml(p.observations)}</p></div>`:""}
  ${p.conclusion?`<div class="soft-card" style="margin-top:10px"><strong>Conclusion</strong><p>${escapeHtml(p.conclusion)}</p></div>`:""}
  </section>`;
}

function experimentLog(){
  const active = state.experiments.filter(e=>e.status!=="complete");
  const complete = state.experiments.filter(e=>e.status==="complete");
  screen.innerHTML = `<section class="card"><h2>Experiment Log</h2><p class="subtitle">Active experiments and completed results.</p>
    <div class="step-group"><div class="group-title">Active</div>${active.length?active.map(expCard).join(""):`<div class="empty">No active experiments.</div>`}</div>
    <div class="step-group"><div class="group-title">Completed</div>${complete.length?complete.map(expCard).join(""):`<div class="empty">No completed experiments.</div>`}</div>
  </section>`;
  document.querySelectorAll("[data-exp]").forEach(b=>b.addEventListener("click",()=>{const e=getExperiment(b.dataset.exp); navigate(e.status==="complete"?"finishExperiment":"experiment",{experimentId:e.id})}));
}
function expCard(e){return `<button class="list-button" data-exp="${e.id}"><div><strong>${escapeHtml(e.name)}</strong><div class="meta">${escapeHtml(e.status)} · ${escapeHtml(e.createdAt)}</div></div><span class="chev">›</span></button>`}

function labSupplies(){
  const groups = {
  base:[],
  fruits:[],
  additive:[],
  flavorings:[]
};
  Object.values(FLUFF_DATA.genericIngredients).forEach(i=>groups[i.category].push(i));
  screen.innerHTML = `<section class="card"><h2>Lab Supplies</h2><p class="subtitle">Choose one current product for each supply. Formulas stay generic; your laboratory decides the product.</p>
  ${Object.entries(groups).map(([cat,items])=>`<div class="supply-section"><div class="group-title">${groupLabel(cat)}</div>${items.map(supplyCard).join("")}</div>`).join("")}</section>`;
  document.querySelectorAll("[data-supply]").forEach(sel=>sel.addEventListener("change",()=>{state.supplies[sel.dataset.supply]=sel.value;save();render();}));
}
function supplyCard(ing){
  const products = Object.values(FLUFF_DATA.products).filter(p=>p.ingredient===ing.id);
  const current = state.supplies[ing.id] || products[0]?.id;
  const p = FLUFF_DATA.products[current] || products[0];
  return `<div class="product-card"><div class="product-top"><div><strong>${escapeHtml(ing.name)}</strong><div class="tiny">Current Product: ${escapeHtml(p?.name || "None")}</div></div><span class="pill">${escapeHtml(FLUFF_DATA.categories[ing.category])}</span></div>
    <div class="select-inline"><select data-supply="${ing.id}">${products.map(prod=>`<option value="${prod.id}" ${prod.id===current?"selected":""}>${escapeHtml(prod.name)}</option>`).join("")}</select></div>
    ${p?`<div class="kv"><span>Serving</span><strong>${displayServing(p)}</strong><span>Calories</span><strong>${p.serving.calories}</strong><span>Protein</span><strong>${p.serving.protein}g</strong><span>Carbs / Fat / Fiber</span><strong>${p.serving.carbs}g / ${p.serving.fat}g / ${p.serving.fiber}g</strong></div>`:""}
    <div class="effect">${escapeHtml(ing.effects.join(" · "))}</div>
  </div>`;
}

function settings(){
  screen.innerHTML = `<section class="card"><h2>Settings</h2><p class="subtitle">Customize how your laboratory displays measurements.</p>
    <h3>Measurement System</h3><div class="settings-row"><button class="toggle ${state.settings.measurement==="kitchen"?"active":""}" data-measure="kitchen">Kitchen</button><button class="toggle ${state.settings.measurement==="metric"?"active":""}" data-measure="metric">Metric</button></div>
    <div class="notice">Kitchen is the default because most people make fluff with cups, tablespoons, teaspoons, and scoops.</div>
  </section>`;
  document.querySelectorAll("[data-measure]").forEach(b=>b.addEventListener("click",()=>{state.settings.measurement=b.dataset.measure;save();render();}));
}
function manual(){
  screen.innerHTML=`
    <section class="card">
      <h2>Lab Manual</h2>
    </section>
    
    <section class="card">
      <h3>How Fluff Lab Works</h3>
      <p>Start with a Formula, make it as an Experiment, then save the best version as Protocols.</p>
    </section>

    <section class="card">
      <h3>Core Terms</h3>
      <p><b>Formula:</b> A starting recipe idea.</p>
      <p><b>Experiment:</b> The version you are making right now.</p>
      <p><b>Protocol:</b> A saved version you want to repeat.</p>
      <p><b>Frankenstein Formula:</b> A Formula that allows you to add any ingredient from the Lab Supplies database.</p>
    </section>

    <section class="card">
      <h3>Measurements</h3>
      <p>Fluff Lab shows cooking measurments like cups, tablespoons, teaspoons, scoops, cookies, and crackers.</p>
      <p>The app handles nutrition math behind the scenes.</p>
    </section>
  `;
}

function getFormula(id){return FLUFF_DATA.formulas.find(f=>f.id===id) || FLUFF_DATA.formulas[0]}
function getExperiment(id){return state.experiments.find(e=>e.id===id)}
function uniqueIngredients(f){return [...new Set(f.ingredients.map(i=>i.ingredient))]}
function getProduct(ingredientId){const pid=state.supplies[ingredientId] || FLUFF_DATA.defaultSupplies[ingredientId]; return FLUFF_DATA.products[pid] || Object.values(FLUFF_DATA.products).find(p=>p.ingredient===ingredientId)}
function scaledProduct(product,multiplier){const s=product.serving; return {calories:Math.round(s.calories*multiplier), protein:round(s.protein*multiplier), carbs:round(s.carbs*multiplier), fat:round(s.fat*multiplier), fiber:round(s.fiber*multiplier)}}
function formulaTotals(f){return f.ingredients.reduce((t,i)=>addTotals(t, scaledProduct(getProduct(i.ingredient), i.multiplier)), blankTotals())}
function experimentTotals(exp){const f=getFormula(exp.formulaId); return f.ingredients.reduce((t,i,idx)=>addTotals(t, scaledProduct(getProduct(i.ingredient), exp.ingredientMultipliers[idx] ?? i.multiplier)), blankTotals())}
function blankTotals(){return {calories:0,protein:0,carbs:0,fat:0,fiber:0}}
function addTotals(t,x){t.calories+=x.calories;t.protein=round(t.protein+x.protein);t.carbs=round(t.carbs+x.carbs);t.fat=round(t.fat+x.fat);t.fiber=round(t.fiber+x.fiber);return t}
function round(n){return Math.round(n*10)/10}
function displayServing(product){return state.settings.measurement==="metric"?product.serving.metric:product.serving.kitchen}
function displayAmount(product, multiplier) {
  const base = displayServing(product);

  if (multiplier === 1) return base;

  const parts = base.split(" ");
  const servingAmountText = parts[0];
  const unit = parts.slice(1).join(" ");

  const servingAmountNumber = fractionToNumber(servingAmountText);

  if (!servingAmountNumber) {
    return `${prettyMultiplier(multiplier)} × ${base}`;
  }

  const finalAmount = servingAmountNumber * multiplier;
  const finalUnit = finalAmount === 1 ? singularUnit(unit) : pluralUnit(unit);

  return `${prettyMultiplier(finalAmount)} ${finalUnit}`;
}
function fractionToNumber(value) {
  if (value.includes("/")) {
    const parts = value.split("/");
    const top = Number(parts[0]);
    const bottom = Number(parts[1]);

    if (!bottom) return null;

    return top / bottom;
  }

  return Number(value);
}

function pluralUnit(unit) {
  const units = {
    scoop: "scoops",
    scoops: "scoops",
    cracker: "crackers",
    crackers: "crackers",
    cookie: "cookies",
    cookies: "cookies",
    cup: "cups",
    cups: "cups",
    tbsp: "tbsp",
    tsp: "tsp",
    g: "g",
    mL: "mL",
    ml: "mL"
  };

  return units[unit] || unit;
}

function singularUnit(unit) {
  const units = {
    scoop: "scoop",
    scoops: "scoop",
    cracker: "cracker",
    crackers: "cracker",
    cookie: "cookie",
    cookies: "cookie",
    cup: "cup",
    cups: "cup",
    tbsp: "tbsp",
    tsp: "tsp",
    g: "g",
    mL: "mL",
    ml: "mL"
  };

  return units[unit] || unit;
}
function prettyMultiplier(n){
  if(n===.25)return "1/4";
  if(n===.5)return "1/2";
  if(n===.75)return "3/4";
  if(n===1.25)return "1¼";
  if(n===1.5)return "1½";
  if(n===1.75)return "1¾";
  return String(n);
}function prettyMultiplier(n){ if(n===.25)return "1/4"; if(n===.5)return "1/2"; if(n===.75)return "3/4"; if(n===1.25)return "1¼"; if(n===1.5)return "1½"; return String(n)};
function groupIngredients(f,exp){const groups={}; f.ingredients.forEach((it,index)=>{const g=it.group || FLUFF_DATA.genericIngredients[it.ingredient].category; if(!groups[g])groups[g]=[]; groups[g].push({...it,index});}); return groups}
function groupLabel(g){
  return ({
    base:"Foundation",
    fruits:"Fruits",
    additive:"Additives",
    flavorings:"Flavorings"
  }[g] || g)
}
function flaskSvg(){return `<svg viewBox="0 0 64 64" role="img"><path class="flask-outline" d="M25 6h14M29 6v17L14 49c-2 4 1 9 6 9h24c5 0 8-5 6-9L35 23V6"/><path class="fluff" d="M20 47c5-5 8 3 13-2 5-4 8 1 12 2l3 6H17l3-6z"/><circle class="bubble" cx="27" cy="34" r="2.2"/><circle class="bubble" cx="38" cy="29" r="1.8"/></svg>`}
function escapeHtml(value){return String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function escapeAttribute(value){return escapeHtml(value).replaceAll("`","&#096;")}

start();