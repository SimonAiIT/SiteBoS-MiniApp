/**
 * BLUEPRINT EDITOR LOGIC (vREMASTERED - SEXY UI)
 * - Compact Cards
 * - Inline Editing
 * - Collapsible Details
 */
'use strict';

// 1. CONFIG & STATE
const WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/e742c7c8-107e-4328-882e-c13459413424";

const tg = window.Telegram.WebApp;
try { tg.ready(); tg.expand(); } catch (e) { console.warn("TG WebApp not found"); }

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId');
const token = urlParams.get('token');
const vat = urlParams.get('vat');
const langParam = urlParams.get('lang') || 'it';

let currentData = null;

// 2. I18N (FULL)
const i18n = {
    it: { title: "Blueprint Operativo", subtitle: "Definisci il processo produttivo", btnAddStage: "Aggiungi Fase", btnSave: "Salva", loading: "Caricamento...", saved: "✅ Salvato!", error: "❌ Errore", phDesc: "Scopo del processo...", phStageName: "Nome Fase (es. Analisi)", phStepName: "Nome Step", phStageDesc: "Descrizione fase...", phStepInstr: "Istruzioni operative...", phQC: "Check Qualità...", phSkills: "Skill (es. Dev, Legal)", lblDesc: "DESCRIZIONE", min: "min", confirmDel: "Eliminare?" },
    en: { title: "Operational Blueprint", subtitle: "Define production process", btnAddStage: "Add Stage", btnSave: "Save", loading: "Loading...", saved: "✅ Saved!", error: "❌ Error", phDesc: "Process purpose...", phStageName: "Stage Name", phStepName: "Step Name", phStageDesc: "Stage description...", phStepInstr: "Instructions...", phQC: "Quality Check...", phSkills: "Skills (e.g. Dev)", lblDesc: "DESCRIPTION", min: "min", confirmDel: "Delete?" }
    // ... (aggiungi le altre lingue se necessario, fallback su EN)
};
const t = i18n[langParam.slice(0,2)] || i18n.it;

// 3. DOM
const dom = {
    loader: document.getElementById('loadingOverlay'),
    loaderText: document.getElementById('loaderText'),
    content: document.getElementById('mainContent'),
    stagesContainer: document.getElementById('stagesContainer'),
    sku: document.getElementById('serviceSku'),
    desc: document.getElementById('blueprintDesc'),
    saveBtn: document.getElementById('saveBtn')
};

// 4. INIT
function init() {
    applyTranslations();
    if (!productId || !token || !vat) return showError("Missing Parameters");
    loadBlueprint();
    
    // Global Event Delegation (Più efficiente di mille listener)
    dom.stagesContainer.addEventListener('click', handleContainerClick);
    dom.stagesContainer.addEventListener('input', handleInput);
    
    document.getElementById('btnAddStageBtn').addEventListener('click', addStage);
    document.getElementById('saveBtn').addEventListener('click', handleSave);
}

function applyTranslations() {
    document.title = t.title;
    document.getElementById('pageTitle').textContent = t.title;
    document.getElementById('pageSubtitle').textContent = t.subtitle;
    document.querySelector('[data-i18n="lblDesc"]').innerText = t.lblDesc;
    document.querySelector('[data-i18n="btnAddStage"]').innerText = t.btnAddStage;
    document.querySelector('[data-i18n="btnSave"]').innerText = t.btnSave;
    dom.desc.placeholder = t.phDesc;
}

// 5. RENDERER (IL CUORE DEL DESIGN)
function renderStages() {
    dom.stagesContainer.innerHTML = '';
    if (!currentData.stages) currentData.stages = [];

    currentData.stages.forEach((stage, sIdx) => {
        const stageEl = document.createElement('div');
        stageEl.className = 'stage-card';
        stageEl.dataset.idx = sIdx;

        // Header Fase: Input Inline
        stageEl.innerHTML = `
            <div class="stage-header">
                <i class="fas fa-grip-vertical drag-handle"></i>
                <div style="flex:1">
                    <input type="text" class="ghost-input" value="${stage.stage_name || ''}" placeholder="${t.phStageName}" data-type="stage-name" data-sidx="${sIdx}">
                    <textarea class="ghost-textarea" rows="1" placeholder="${t.phStageDesc}" data-type="stage-desc" data-sidx="${sIdx}">${stage.description || ''}</textarea>
                </div>
                <button class="btn-step-action text-error" data-action="delete-stage" data-sidx="${sIdx}"><i class="fas fa-trash"></i></button>
            </div>
            
            <div class="step-list-container" data-sidx="${sIdx}">
                ${renderSteps(stage.steps, sIdx)}
            </div>
            
            <div style="padding: 10px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
                <button class="btn-mini" data-action="add-step" data-sidx="${sIdx}" style="width:100%; border:1px dashed var(--glass-border); opacity:0.6;">
                    <i class="fas fa-plus"></i> Step
                </button>
            </div>
        `;
        dom.stagesContainer.appendChild(stageEl);

        // Sortable per gli Step
        new Sortable(stageEl.querySelector('.step-list-container'), {
            group: 'steps', handle: '.drag-handle', animation: 150,
            onEnd: handleSortEnd
        });
    });

    // Sortable per le Fasi
    new Sortable(dom.stagesContainer, {
        handle: '.stage-header .drag-handle', animation: 150,
        onEnd: handleSortEnd
    });
}

function renderSteps(steps, sIdx) {
    if (!steps || steps.length === 0) return '';
    return steps.map((step, stIdx) => {
        const isOpen = step._ui_open ? 'open' : '';
        const activeClass = step._ui_open ? 'active' : '';
        const wipBadge = step.logistics_flags?.requires_wip ? `<span class="mini-badge badge-wip">WIP</span>` : '';
        const finBadge = step.logistics_flags?.requires_finished ? `<span class="mini-badge badge-fin">FIN</span>` : '';
        const qcActive = step.quality_check?.check_description ? 'color:var(--success)' : 'color:var(--text-muted)';

        return `
        <div class="step-item" data-sidx="${sIdx}" data-stidx="${stIdx}">
            <div class="step-header">
                <i class="fas fa-grip-lines drag-handle" style="font-size:12px;"></i>
                
                <div class="step-main">
                    <input type="text" class="ghost-input" style="font-size:13px; margin:0;" value="${step.step_name || ''}" placeholder="${t.phStepName}" data-type="step-name" data-sidx="${sIdx}" data-stidx="${stIdx}">
                    <div class="step-meta">
                        <span>⏱️ <input type="number" value="${step.estimated_time_minutes||0}" style="width:30px; background:transparent; border:none; color:inherit; text-align:center;" data-type="step-time" data-sidx="${sIdx}" data-stidx="${stIdx}"> ${t.min}</span>
                        ${wipBadge} ${finBadge}
                    </div>
                </div>

                <div class="step-actions">
                    <button class="btn-step-action ${activeClass}" data-action="toggle-step" data-sidx="${sIdx}" data-stidx="${stIdx}">
                        <i class="fas fa-chevron-down" style="transform: ${isOpen ? 'rotate(180deg)' : 'rotate(0)'}; transition: transform 0.2s;"></i>
                    </button>
                    <button class="btn-step-action" data-action="delete-step" data-sidx="${sIdx}" data-stidx="${stIdx}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <div class="step-details ${isOpen}" id="details-${sIdx}-${stIdx}">
                <!-- Istruzioni -->
                <div class="form-group" style="margin-bottom:10px;">
                    <label style="font-size:10px; color:var(--primary);">ISTRUZIONI</label>
                    <textarea class="ghost-textarea" style="background:rgba(0,0,0,0.2); padding:8px;" rows="2" placeholder="${t.phStepInstr}" data-type="step-instr" data-sidx="${sIdx}" data-stidx="${stIdx}">${step.instructions||''}</textarea>
                </div>

                <!-- Quality Check -->
                <div class="form-group" style="margin-bottom:10px;">
                    <label style="font-size:10px; color:var(--success);"><i class="fas fa-check-circle"></i> QUALITY CHECK</label>
                    <textarea class="ghost-textarea" style="background:rgba(0,0,0,0.2); padding:8px;" rows="1" placeholder="${t.phQC}" data-type="step-qc" data-sidx="${sIdx}" data-stidx="${stIdx}">${step.quality_check?.check_description||''}</textarea>
                </div>

                <div class="row" style="margin-bottom:0;">
                    <div class="col">
                        <label style="font-size:10px;">SKILLS</label>
                        <input type="text" class="ghost-input" style="font-size:12px; border-bottom:1px solid rgba(255,255,255,0.1);" value="${(step.resources_needed?.labor?.required_skill_tags||[]).join(', ')}" placeholder="${t.phSkills}" data-type="step-skills" data-sidx="${sIdx}" data-stidx="${stIdx}">
                    </div>
                </div>

                <!-- Flags -->
                <div style="display:flex; gap:15px; margin-top:10px; padding-top:10px; border-top:1px dashed rgba(255,255,255,0.1);">
                    <label style="font-size:11px; display:flex; align-items:center; gap:5px;">
                        <input type="checkbox" ${step.logistics_flags?.requires_wip?'checked':''} data-type="flag-wip" data-sidx="${sIdx}" data-stidx="${stIdx}"> WIP
                    </label>
                    <label style="font-size:11px; display:flex; align-items:center; gap:5px;">
                        <input type="checkbox" ${step.logistics_flags?.requires_finished?'checked':''} data-type="flag-fin" data-sidx="${sIdx}" data-stidx="${stIdx}"> Finished
                    </label>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// 6. EVENT HANDLERS (Delegation)
function handleContainerClick(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    const sIdx = parseInt(btn.dataset.sidx);
    const stIdx = parseInt(btn.dataset.stidx);

    if (action === 'delete-stage') {
        if(confirm(t.confirmDel)) { currentData.stages.splice(sIdx, 1); updateIndexes(); renderStages(); }
    } else if (action === 'add-step') {
        addStep(sIdx);
    } else if (action === 'delete-step') {
        if(confirm(t.confirmDel)) { currentData.stages[sIdx].steps.splice(stIdx, 1); updateIndexes(); renderStages(); }
    } else if (action === 'toggle-step') {
        const step = currentData.stages[sIdx].steps[stIdx];
        step._ui_open = !step._ui_open;
        renderStages(); // Re-render per aggiornare UI e Icona
    }
}

function handleInput(e) {
    const el = e.target;
    const type = el.dataset.type;
    if (!type) return;
    
    const sIdx = parseInt(el.dataset.sidx);
    const stIdx = parseInt(el.dataset.stidx);
    const val = el.type === 'checkbox' ? el.checked : el.value;

    if (type === 'stage-name') currentData.stages[sIdx].stage_name = val;
    if (type === 'stage-desc') currentData.stages[sIdx].description = val;
    
    if (type.startsWith('step-')) {
        const step = currentData.stages[sIdx].steps[stIdx];
        if (type === 'step-name') step.step_name = val;
        if (type === 'step-time') { step.estimated_time_minutes = parseInt(val)||0; updateIndexes(); }
        if (type === 'step-instr') step.instructions = val;
        if (type === 'step-qc') { if(!step.quality_check) step.quality_check={}; step.quality_check.check_description = val; }
        if (type === 'step-skills') { if(!step.resources_needed) step.resources_needed={labor:{}}; step.resources_needed.labor.required_skill_tags = val.split(',').map(s=>s.trim()).filter(Boolean); }
    }
    
    if (type.startsWith('flag-')) {
        const step = currentData.stages[sIdx].steps[stIdx];
        if(!step.logistics_flags) step.logistics_flags={};
        if(type==='flag-wip') step.logistics_flags.requires_wip = val;
        if(type==='flag-fin') step.logistics_flags.requires_finished = val;
        // Re-render parziale o update classi visive (qui ricarichiamo per semplicità sui badge)
        // Se rallenta, ottimizzare.
    }
}

// 7. DATA HELPERS
function addStage() {
    if (!currentData.stages) currentData.stages = [];
    currentData.stages.push({ stage_name: "Nuova Fase", description: "", steps: [] });
    updateIndexes(); renderStages();
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
}

function addStep(sIdx) {
    if (!currentData.stages[sIdx].steps) currentData.stages[sIdx].steps = [];
    currentData.stages[sIdx].steps.push({ 
        step_name: "Nuovo Step", instructions: "", estimated_time_minutes: 15, 
        _ui_open: true 
    });
    updateIndexes(); renderStages();
}

function updateIndexes() {
    if (!currentData?.stages) return;
    currentData.stages.forEach((stage, sIdx) => {
        stage.stage_order = sIdx + 1;
        stage.stage_id = `STAGE_${String(sIdx + 1).padStart(2, '0')}`;
        if (stage.steps) {
            stage.steps.forEach((step, stIdx) => {
                step.step_order = stIdx + 1;
                step.step_id = `STEP_${String(sIdx + 1).padStart(2, '0')}_${String(stIdx + 1).padStart(2, '0')}`;
            });
        }
    });
}

function handleSortEnd(evt) {
    // La logica di Sortable aggiorna il DOM, ma noi dobbiamo aggiornare il JSON
    // Per semplicità con framework non-reattivi, ricarichiamo i dati dal DOM o
    // (meglio) usiamo gli indici vecchi/nuovi forniti da Sortable per muovere l'array.
    
    // FIX RAPIDO: Ricostruiamo il model leggendo il DOM (metodo "Brute Force" ma sicuro per Drag&Drop complessi)
    // Nota: con liste grandi meglio muovere array. Qui va bene.
    // ... Implementiamo la mossa array:
    
    const isStage = evt.item.classList.contains('stage-card');
    if (isStage) {
        const moved = currentData.stages.splice(evt.oldIndex, 1)[0];
        currentData.stages.splice(evt.newIndex, 0, moved);
    } else {
        // È uno step. Trova padre e indici.
        // SortableJS modifica il DOM. Noi dobbiamo sincronizzare i dati.
        // Per evitare disallineamenti, ricarichiamo tutto basandoci sui data-attributes dopo il drop?
        // No, meglio muovere l'array.
        
        // Il problema è che Sortable sposta l'elemento HTML.
        // Dobbiamo capire da quale stage a quale stage (se cross-list).
        
        // Semplifichiamo: RenderStages distrugge il DOM. Sortable ha appena cambiato il DOM.
        // Conflict! 
        // Soluzione: Recuperiamo i dati prima del re-render.
        
        // Strategia Migliore per Vanilla JS + Sortable:
        // 1. Lasciare che Sortable muova il DOM.
        // 2. Leggere il nuovo ordine dal DOM.
        // 3. Aggiornare currentData.
        // 4. (Opzionale) Re-render per pulire.
        
        rebuildDataFromDOM();
    }
    updateIndexes();
    renderStages(); // Re-render pulito
}

function rebuildDataFromDOM() {
    // Ricostruisce currentData.stages scansionando il DOM attuale
    const newStages = [];
    const stageEls = dom.stagesContainer.querySelectorAll('.stage-card');
    
    stageEls.forEach(stageEl => {
        // Recupera l'oggetto stage originale usando l'indice vecchio (salvato in memoria o data attr)
        // Ma attenzione: gli input potrebbero essere cambiati.
        // Approccio Ibrido:
        // L'oggetto stage originale è legato all'elemento DOM? No.
        
        // Facciamo così: usiamo la logica di Sortable `onEnd` classica (array move)
        // Perché il renderStages() è chiamato ALLA FINE.
        
        // Ok, torniamo alla logica "Array Move" nel `handleSortEnd` sopra, 
        // ma dobbiamo passare i riferimenti corretti.
        
        // (Per brevità nel codice sopra ho messo la logica array move nel `if(isStage)`).
        // Per gli step serve il contesto `evt.from` e `evt.to`.
    });
    
    // CORREZIONE LOGICA SORTABLE NELLA FUNZIONE SOPRA:
    // Poiché RenderStages viene chiamato, esso sovrascrive il DOM.
    // Dobbiamo assicurarci che i dati siano aggiornati PRIMA di chiamare renderStages.
    // Vedi implementazione aggiornata sotto.
}

// FIX SORTABLE HANDLER
function handleSortEnd(evt) {
    const item = evt.item;
    if (item.classList.contains('stage-card')) {
        const moved = currentData.stages.splice(evt.oldIndex, 1)[0];
        currentData.stages.splice(evt.newIndex, 0, moved);
    } else {
        // Step Sort
        // Trova gli indici degli stage guardando i container
        // Il container .step-list-container ha un data-sidx? No, aggiungiamolo nel render!
        // (Fatto nel render: data-sidx="${sIdx}")
        
        const fromStageIdx = parseInt(evt.from.dataset.sidx);
        const toStageIdx = parseInt(evt.to.dataset.sidx);
        
        const movedStep = currentData.stages[fromStageIdx].steps.splice(evt.oldIndex, 1)[0];
        currentData.stages[toStageIdx].steps.splice(evt.newIndex, 0, movedStep);
    }
    updateIndexes();
    renderStages();
}

// 8. NETWORK (Load & Save)
async function loadBlueprint() {
    showLoader(t.loading);
    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'GET', type: 'BLUEPRINT', productId, token, vat })
        });
        const data = await res.json();
        const bp = Array.isArray(data) ? (data[0].blueprint || data[0]) : (data.blueprint || data);
        
        currentData = bp || { stages: [] };
        dom.desc.value = currentData.blueprint_description || '';
        dom.sku.innerText = `SKU: ${currentData.service_sku || 'N/A'}`;
        
        updateIndexes(); renderStages(); hideLoader();
    } catch(e) { showError(e.message); }
}

async function handleSave(e) {
    e.preventDefault();
    showLoader(t.saving);
    
    currentData.blueprint_description = dom.desc.value;
    
    // Clean UI flags
    const payload = JSON.parse(JSON.stringify(currentData));
    payload.stages.forEach(s => s.steps.forEach(st => delete st._ui_open));

    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ action: 'SAVE', type: 'BLUEPRINT', productId, token, vat, payload })
        });
        
        hideLoader();
        tg.showPopup({ message: t.saved });
        setTimeout(() => tg.close(), 1000);
    } catch(err) {
        showError(err.message);
    }
}

// UTILS
function showLoader(msg) { dom.loaderText.innerText=msg; dom.loader.style.display='flex'; }
function hideLoader() { dom.loader.style.display='none'; dom.content.classList.remove('hidden'); }
function showError(msg) { alert(msg); hideLoader(); }

// START
document.addEventListener('DOMContentLoaded', init);
