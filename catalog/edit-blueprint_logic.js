/**
 * BLUEPRINT EDITOR LOGIC (v3.0 - FIX COMPLETO)
 * ✅ Campi full-width FORZATI
 * ✅ Bottoni allineati destra (fase + step)
 * ✅ Drag mobile PERSISTENTE (no re-render)
 */
'use strict';

const WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/e742c7c8-107e-4328-882e-c13459413424";

const tg = window.Telegram.WebApp;
try { tg.ready(); tg.expand(); } catch (e) { console.warn("TG WebApp not found"); }

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId');
const token = urlParams.get('token');
const vat = urlParams.get('vat');
const langParam = urlParams.get('lang') || 'it';

let currentData = null;
let stageSortable = null;
let stepSortables = [];

const i18n = {
    it: { title: "Blueprint Operativo", subtitle: "Definisci il processo produttivo", btnAddStage: "Nuova Fase", btnSave: "Salva", loading: "Caricamento...", saved: "✅ Salvato!", error: "❌ Errore", phDesc: "Scopo del processo...", phStageName: "Nome Fase (es. Analisi)", phStepName: "Nome Step", phStageDesc: "Descrizione fase...", phStepInstr: "Istruzioni operative...", phQC: "Check Qualità...", phSkills: "Skill (es. Dev, Legal)", lblDesc: "DESCRIZIONE", min: "min", confirmDel: "Eliminare?", step: "Step", lblInstr: "ISTRUZIONI", lblQC: "QUALITY CHECK", lblSkills: "SKILLS", lblWip: "WIP", lblFin: "FINISHED", stepsCount: "passi" },
    en: { title: "Operational Blueprint", subtitle: "Define production process", btnAddStage: "New Stage", btnSave: "Save", loading: "Loading...", saved: "✅ Saved!", error: "❌ Error", phDesc: "Process purpose...", phStageName: "Stage Name", phStepName: "Step Name", phStageDesc: "Stage description...", phStepInstr: "Instructions...", phQC: "Quality Check...", phSkills: "Skills (e.g. Dev)", lblDesc: "DESCRIPTION", min: "min", confirmDel: "Delete?", step: "Step", lblInstr: "INSTRUCTIONS", lblQC: "QUALITY CHECK", lblSkills: "SKILLS", lblWip: "WIP", lblFin: "FINISHED", stepsCount: "steps" }
};
const t = i18n[langParam.slice(0,2)] || i18n.it;

const dom = {
    loader: document.getElementById('loadingOverlay'),
    loaderText: document.getElementById('loaderText'),
    content: document.getElementById('mainContent'),
    stagesContainer: document.getElementById('stagesContainer'),
    sku: document.getElementById('serviceSku'),
    desc: document.getElementById('blueprintDesc'),
    saveBtn: document.getElementById('saveBtn')
};

function init() {
    applyTranslations();
    if (!productId || !token || !vat) {
        alert("Error: Missing Parameters");
        return;
    }
    loadBlueprint();
    
    dom.stagesContainer.addEventListener('click', handleContainerClick);
    dom.stagesContainer.addEventListener('input', handleInput);
    document.getElementById('btnAddStageBtn').addEventListener('click', addStage);
    document.getElementById('saveBtn').addEventListener('click', handleSave);
}

function applyTranslations() {
    document.title = t.title;
    document.querySelector('[data-i18n="title"]').innerText = t.title;
    document.querySelector('[data-i18n="subtitle"]').innerText = t.subtitle;
    document.querySelector('[data-i18n="btnAddStage"]').innerText = t.btnAddStage;
    dom.desc.placeholder = t.phDesc;
    dom.loaderText.textContent = t.loading;
}

function renderStages() {
    // ⚠️ Distruggi Sortable precedenti
    if (stageSortable) stageSortable.destroy();
    stepSortables.forEach(s => s.destroy());
    stepSortables = [];
    
    dom.stagesContainer.innerHTML = '';
    if (!currentData.stages) currentData.stages = [];

    currentData.stages.forEach((stage, sIdx) => {
        const isOpen = stage._ui_open === true;
        const stepCount = stage.steps?.length || 0;
        const totalTime = (stage.steps || []).reduce((sum, st) => sum + (parseInt(st.estimated_time_minutes) || 0), 0);
        
        const stageEl = document.createElement('div');
        stageEl.className = 'stage-card';
        stageEl.dataset.idx = sIdx;

        stageEl.innerHTML = `
            <!-- 👉 HEADER FASE -->
            <div class="stage-header" style="display:flex; justify-content:space-between; align-items:stretch; padding:0; background:rgba(255,255,255,0.03); border-bottom:1px solid var(--glass-border);">
                
                <!-- SX: Drag ISOLATO -->
                <div class="stage-drag-area" style="display:flex; align-items:center; padding:15px 8px; cursor:grab;">
                    <i class="fas fa-grip-vertical drag-handle-stage" 
                       style="color:var(--text-muted); font-size:20px; touch-action:none;"></i>
                </div>
                
                <!-- CENTRO: Nome (cliccabile) -->
                <div style="flex:1; padding:15px 8px; cursor:pointer;" data-action="toggle-stage" data-sidx="${sIdx}">
                    <div style="font-weight:600; font-size:15px; color:white; margin-bottom:3px;">${stage.stage_name || 'Fase Senza Nome'}</div>
                    <div style="font-size:11px; color:var(--text-muted);">${stepCount} ${t.stepsCount} • ${totalTime} ${t.min}</div>
                </div>
                
                <!-- DX: Bottoni -->
                <div style="display:flex; align-items:center; gap:6px; padding:15px 12px;">
                    <button class="btn-icon-sm" data-action="toggle-stage-btn" data-sidx="${sIdx}" title="Espandi/Comprimi" style="flex-shrink:0;">
                        <i class="fas fa-chevron-${isOpen ? 'up' : 'down'}"></i>
                    </button>
                    <button class="btn-icon-sm text-error" data-action="delete-stage" data-sidx="${sIdx}" title="Elimina Fase" style="flex-shrink:0;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="stage-body" style="display:${isOpen ? 'block' : 'none'}; padding:15px;">
                <div style="margin-bottom:15px;">
                    <input type="text" class="edit-input" 
                           style="display:block; width:100%; max-width:100%; box-sizing:border-box; font-size:15px; font-weight:600; margin:0 0 8px 0; padding:10px;" 
                           value="${stage.stage_name || ''}" placeholder="${t.phStageName}" data-type="stage-name" data-sidx="${sIdx}">
                    <textarea class="edit-textarea" rows="2" placeholder="${t.phStageDesc}" data-type="stage-desc" data-sidx="${sIdx}" 
                              style="display:block; width:100%; max-width:100%; box-sizing:border-box; font-size:12px; margin:0; padding:10px;">${stage.description || ''}</textarea>
                </div>
                
                <div class="step-list-container" data-sidx="${sIdx}">
                    ${renderSteps(stage.steps, sIdx)}
                </div>
                
                <div style="margin-top:10px;">
                    <button class="btn btn-sm btn-secondary" data-action="add-step" data-sidx="${sIdx}" style="width:100%; border-style:dashed;">
                        <i class="fas fa-plus"></i> ${t.step}
                    </button>
                </div>
            </div>
        `;
        dom.stagesContainer.appendChild(stageEl);

        // ⚠️ Sortable STEP - salva istanza
        const stepContainer = stageEl.querySelector('.step-list-container');
        const stepSort = new Sortable(stepContainer, {
            group: 'steps',
            handle: '.drag-handle-step',
            animation: 150,
            touchStartThreshold: 3,
            delay: 50,
            delayOnTouchOnly: true,
            onEnd: handleSortEndNoRerender
        });
        stepSortables.push(stepSort);
    });

    // ⚠️ Sortable STAGE - salva istanza
    stageSortable = new Sortable(dom.stagesContainer, {
        handle: '.drag-handle-stage',
        animation: 150,
        touchStartThreshold: 3,
        delay: 50,
        delayOnTouchOnly: true,
        onEnd: handleSortEndNoRerender
    });
}

function renderSteps(steps, sIdx) {
    if (!steps || steps.length === 0) return '<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:12px;">Nessuno step. Aggiungi il primo!</div>';
    
    return steps.map((step, stIdx) => {
        const isOpen = step._ui_open ? 'open' : '';
        const activeClass = step._ui_open ? 'active' : '';
        
        const wipBadge = step.logistics_flags?.requires_wip ? `<span class="badge badge-wip">WIP</span>` : '';
        const finBadge = step.logistics_flags?.requires_finished ? `<span class="badge badge-fin">FINISHED</span>` : '';
        const mins = parseInt(step.estimated_time_minutes) || 0;
        
        return `
        <div class="step-item" data-sidx="${sIdx}" data-stidx="${stIdx}" 
             style="background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); border-radius:10px; padding:12px; margin-bottom:10px;">
            
            <!-- 👉 HEADER STEP -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <i class="fas fa-grip-vertical drag-handle-step" 
                       style="color:var(--text-muted); cursor:grab; font-size:20px; touch-action:none; padding:5px;"></i>
                    <div style="display:flex; gap:6px;">
                        ${wipBadge} ${finBadge}
                    </div>
                </div>
                
                <div style="display:flex; gap:6px; flex-shrink:0;">
                    <button class="btn-icon-sm ${activeClass}" data-action="toggle-step" data-sidx="${sIdx}" data-stidx="${stIdx}" title="Espandi/Comprimi">
                        <i class="fas fa-chevron-${isOpen ? 'up' : 'down'}"></i>
                    </button>
                    <button class="btn-icon-sm text-error" data-action="delete-step" data-sidx="${sIdx}" data-stidx="${stIdx}" title="Elimina Step">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>

            <!-- 👉 NOME STEP: FULL WIDTH FORZATO -->
            <input type="text" class="edit-input" 
                   style="display:block; width:100%; max-width:100%; box-sizing:border-box; font-size:14px; font-weight:500; margin:0 0 10px 0; padding:10px;"
                   value="${step.step_name || ''}" placeholder="${t.phStepName}" 
                   data-type="step-name" data-sidx="${sIdx}" data-stidx="${stIdx}">

            <!-- 👉 TEMPO: FULL WIDTH FORZATO -->
            <div style="display:flex; width:100%; max-width:100%; box-sizing:border-box; align-items:center; gap:10px; padding:10px 12px; background:rgba(255,255,255,0.05); border-radius:6px; margin:0 0 10px 0;">
                <i class="far fa-clock" style="color:var(--primary); flex-shrink:0; font-size:16px;"></i>
                <input type="number" min="0" value="${mins}" 
                       style="flex:0 0 70px; background:transparent; border:none; color:white; font-size:14px; font-weight:500; text-align:center;"
                       data-type="step-time" data-sidx="${sIdx}" data-stidx="${stIdx}">
                <span style="font-size:13px; color:var(--text-muted);">${t.min}</span>
            </div>

            <!-- 👉 DETTAGLI: FULL WIDTH FORZATO -->
            <div style="display:${isOpen ? 'block' : 'none'}; margin-top:5px;">
                
                <div style="margin-bottom:12px;">
                    <label style="font-size:10px; color:var(--text-muted); font-weight:700; display:block; margin-bottom:5px;">${t.lblInstr}</label>
                    <textarea rows="3" placeholder="${t.phStepInstr}" 
                              style="display:block; width:100%; max-width:100%; box-sizing:border-box; background:var(--input-bg); border:1px solid var(--glass-border); padding:10px; border-radius:6px; color:white; font-size:12px; resize:vertical; margin:0;"
                              data-type="step-instr" data-sidx="${sIdx}" data-stidx="${stIdx}">${step.instructions||''}</textarea>
                </div>

                <div style="margin-bottom:12px;">
                    <label style="font-size:10px; color:#30d158; font-weight:700; display:block; margin-bottom:5px;">${t.lblQC}</label>
                    <textarea rows="2" placeholder="${t.phQC}" 
                              style="display:block; width:100%; max-width:100%; box-sizing:border-box; background:var(--input-bg); border:1px solid var(--glass-border); padding:10px; border-radius:6px; color:white; font-size:12px; resize:vertical; margin:0;"
                              data-type="step-qc" data-sidx="${sIdx}" data-stidx="${stIdx}">${step.quality_check?.check_description||''}</textarea>
                </div>

                <div style="margin-bottom:12px;">
                    <label style="font-size:10px; color:var(--text-muted); font-weight:700; display:block; margin-bottom:5px;">${t.lblSkills}</label>
                    <input type="text" 
                           style="display:block; width:100%; max-width:100%; box-sizing:border-box; background:var(--input-bg); border:1px solid var(--glass-border); padding:10px; border-radius:6px; color:white; font-size:12px; margin:0;"
                           value="${(step.resources_needed?.labor?.required_skill_tags||[]).join(', ')}" 
                           placeholder="${t.phSkills}" 
                           data-type="step-skills" data-sidx="${sIdx}" data-stidx="${stIdx}">
                </div>

                <div style="display:flex; gap:15px; padding-top:10px; border-top:1px dashed var(--glass-border);">
                    <label style="display:flex; align-items:center; gap:6px; font-size:11px; color:white; cursor:pointer;">
                        <input type="checkbox" ${step.logistics_flags?.requires_wip?'checked':''} 
                               data-type="flag-wip" data-sidx="${sIdx}" data-stidx="${stIdx}"> 
                        ${t.lblWip}
                    </label>
                    <label style="display:flex; align-items:center; gap:6px; font-size:11px; color:white; cursor:pointer;">
                        <input type="checkbox" ${step.logistics_flags?.requires_finished?'checked':''} 
                               data-type="flag-fin" data-sidx="${sIdx}" data-stidx="${stIdx}"> 
                        ${t.lblFin}
                    </label>
                </div>

            </div>
        </div>
        `;
    }).join('');
}

function handleContainerClick(e) {
    const btn = e.target.closest('button');
    const toggleArea = e.target.closest('[data-action="toggle-stage"]');
    
    if (toggleArea && !btn) {
        const sIdx = parseInt(toggleArea.dataset.sidx);
        currentData.stages[sIdx]._ui_open = !currentData.stages[sIdx]._ui_open;
        renderStages();
        return;
    }
    
    if (!btn) return;
    const action = btn.dataset.action;
    const sIdx = parseInt(btn.dataset.sidx);
    const stIdx = parseInt(btn.dataset.stidx);

    if (action === 'toggle-stage-btn') {
        currentData.stages[sIdx]._ui_open = !currentData.stages[sIdx]._ui_open;
        renderStages();
    } else if (action === 'delete-stage') {
        if(confirm(t.confirmDel)) { currentData.stages.splice(sIdx, 1); updateIndexes(); renderStages(); }
    } else if (action === 'add-step') {
        addStep(sIdx);
    } else if (action === 'delete-step') {
        if(confirm(t.confirmDel)) { currentData.stages[sIdx].steps.splice(stIdx, 1); updateIndexes(); renderStages(); }
    } else if (action === 'toggle-step') {
        const step = currentData.stages[sIdx].steps[stIdx];
        step._ui_open = !step._ui_open;
        renderStages();
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
        if (type === 'step-time') { step.estimated_time_minutes = parseInt(val)||0; }
        if (type === 'step-instr') step.instructions = val;
        if (type === 'step-qc') { if(!step.quality_check) step.quality_check={}; step.quality_check.check_description = val; }
        if (type === 'step-skills') { if(!step.resources_needed) step.resources_needed={labor:{}}; step.resources_needed.labor.required_skill_tags = val.split(',').map(s=>s.trim()).filter(Boolean); }
    }
    
    if (type.startsWith('flag-')) {
        const step = currentData.stages[sIdx].steps[stIdx];
        if(!step.logistics_flags) step.logistics_flags={};
        if(type==='flag-wip') step.logistics_flags.requires_wip = val;
        if(type==='flag-fin') step.logistics_flags.requires_finished = val;
        renderStages();
    }
}

function addStage() {
    if (!currentData.stages) currentData.stages = [];
    currentData.stages.push({ stage_name: "Nuova Fase", description: "", steps: [], _ui_open: true });
    updateIndexes(); 
    renderStages();
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
}

function addStep(sIdx) {
    if (!currentData.stages[sIdx].steps) currentData.stages[sIdx].steps = [];
    currentData.stages[sIdx].steps.push({ 
        step_name: "Nuovo Step", instructions: "", estimated_time_minutes: 15, 
        _ui_open: true
    });
    updateIndexes(); 
    renderStages();
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

// ⚠️ NUOVO: Sort handler SENZA re-render immediato
function handleSortEndNoRerender(evt) {
    const item = evt.item;
    if (item.classList.contains('stage-card')) {
        const moved = currentData.stages.splice(evt.oldIndex, 1)[0];
        currentData.stages.splice(evt.newIndex, 0, moved);
    } else {
        const fromStageIdx = parseInt(evt.from.closest('.stage-card').dataset.idx);
        const toStageIdx = parseInt(evt.to.closest('.stage-card').dataset.idx);
        const movedStep = currentData.stages[fromStageIdx].steps.splice(evt.oldIndex, 1)[0];
        currentData.stages[toStageIdx].steps.splice(evt.newIndex, 0, movedStep);
    }
    updateIndexes();
    // ⚠️ NON chiamo renderStages() qui per preservare Sortable
    // Gli indici vengono aggiornati solo nei dataset
    document.querySelectorAll('.stage-card').forEach((el, idx) => el.dataset.idx = idx);
}

async function loadBlueprint() {
    showLoader(t.loading);
    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'GET', type: 'BLUEPRINT', productId, token, vat })
        });
        const data = await res.json();
        const bp = Array.isArray(data) ? data[0] : data;
        
        currentData = bp || { stages: [] };
        dom.desc.value = currentData.blueprint_description || '';
        dom.sku.innerText = `SKU: ${currentData.service_sku || 'N/A'}`;
        
        updateIndexes(); 
        renderStages(); 
        hideLoader();
    } catch(e) { 
        console.error('Load error:', e);
        showError(e.message); 
    }
}

async function handleSave(e) {
    e.preventDefault();
    showLoader('Salvataggio...');
    
    currentData.blueprint_description = dom.desc.value;
    const payload = JSON.parse(JSON.stringify(currentData));
    payload.stages.forEach(s => {
        delete s._ui_open;
        s.steps.forEach(st => delete st._ui_open);
    });

    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ action: 'SAVE', type: 'BLUEPRINT', productId, token, vat, payload })
        });
        hideLoader();
        tg.showPopup({ message: t.saved });
        setTimeout(() => tg.close(), 1000);
    } catch(err) { showError(err.message); }
}

function showLoader(msg) { 
    dom.loaderText.innerText = msg; 
    dom.loader.classList.remove('hidden'); 
    dom.content.classList.add('hidden'); 
}

function hideLoader() { 
    dom.loader.classList.add('hidden'); 
    dom.content.classList.remove('hidden'); 
}

function showError(msg) { alert(msg); hideLoader(); }

document.addEventListener('DOMContentLoaded', init);
