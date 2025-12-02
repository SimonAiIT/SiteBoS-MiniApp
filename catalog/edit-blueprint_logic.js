/**
 * BLUEPRINT EDITOR LOGIC (vFINAL - UI FIXED)
 * - Grid Layout per Steps
 * - FABs a destra in colonna
 * - FIX: Caricamento minuti corretto
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

// 2. I18N
const i18n = {
    it: { title: "Blueprint Operativo", subtitle: "Definisci il processo produttivo", btnAddStage: "Nuova Fase", btnSave: "Salva", loading: "Caricamento...", saved: "✅ Salvato!", error: "❌ Errore", phDesc: "Scopo del processo...", phStageName: "Nome Fase (es. Analisi)", phStepName: "Nome Step", phStageDesc: "Descrizione fase...", phStepInstr: "Istruzioni operative...", phQC: "Check Qualità...", phSkills: "Skill (es. Dev, Legal)", lblDesc: "DESCRIZIONE", min: "min", confirmDel: "Eliminare?", step: "Step", lblInstr: "ISTRUZIONI", lblQC: "QUALITY CHECK", lblSkills: "SKILLS", lblWip: "WIP", lblFin: "FINISHED" },
    en: { title: "Operational Blueprint", subtitle: "Define production process", btnAddStage: "New Stage", btnSave: "Save", loading: "Loading...", saved: "✅ Saved!", error: "❌ Error", phDesc: "Process purpose...", phStageName: "Stage Name", phStepName: "Step Name", phStageDesc: "Stage description...", phStepInstr: "Instructions...", phQC: "Quality Check...", phSkills: "Skills (e.g. Dev)", lblDesc: "DESCRIPTION", min: "min", confirmDel: "Delete?", step: "Step", lblInstr: "INSTRUCTIONS", lblQC: "QUALITY CHECK", lblSkills: "SKILLS", lblWip: "WIP", lblFin: "FINISHED" },
    fr: { title: "Blueprint Opérationnel", subtitle: "Définir processus", btnAddStage: "Nouvelle Phase", btnSave: "Enregistrer", loading: "Chargement...", saved: "✅ Enregistré !", error: "❌ Erreur", phDesc: "But du processus...", phStageName: "Nom Phase", phStepName: "Nom Étape", phStageDesc: "Description phase...", phStepInstr: "Instructions...", phQC: "Contrôle Qualité...", phSkills: "Compétences", lblDesc: "DESCRIPTION", min: "min", confirmDel: "Supprimer ?", step: "Étape", lblInstr: "INSTRUCTIONS", lblQC: "QUALITÉ", lblSkills: "COMPÉTENCES", lblWip: "EN COURS", lblFin: "TERMINÉ" },
    de: { title: "Operativer Blueprint", subtitle: "Prozess definieren", btnAddStage: "Neue Phase", btnSave: "Speichern", loading: "Laden...", saved: "✅ Gespeichert!", error: "❌ Fehler", phDesc: "Prozesszweck...", phStageName: "Phasenname", phStepName: "Schrittname", phStageDesc: "Phasenbeschreibung...", phStepInstr: "Anweisungen...", phQC: "Qualitätsprüfung...", phSkills: "Fähigkeiten", lblDesc: "BESCHREIBUNG", min: "Min", confirmDel: "Löschen?", step: "Schritt", lblInstr: "ANWEISUNGEN", lblQC: "QUALITÄT", lblSkills: "FÄHIGKEITEN", lblWip: "WIP", lblFin: "FERTIG" },
    es: { title: "Blueprint Operativo", subtitle: "Definir proceso", btnAddStage: "Nueva Fase", btnSave: "Guardar", loading: "Cargando...", saved: "✅ ¡Guardado!", error: "❌ Error", phDesc: "Propósito...", phStageName: "Nombre Fase", phStepName: "Nombre Paso", phStageDesc: "Descripción fase...", phStepInstr: "Instrucciones...", phQC: "Control Calidad...", phSkills: "Habilidades", lblDesc: "DESCRIPCIÓN", min: "min", confirmDel: "¿Eliminar?", step: "Paso", lblInstr: "INSTRUCCIONES", lblQC: "CALIDAD", lblSkills: "HABILIDADES", lblWip: "WIP", lblFin: "TERMINADO" },
    pt: { title: "Blueprint Operacional", subtitle: "Definir processo", btnAddStage: "Nova Fase", btnSave: "Salvar", loading: "Carregando...", saved: "✅ Salvo!", error: "❌ Erro", phDesc: "Propósito...", phStageName: "Nome da Fase", phStepName: "Nome da Etapa", phStageDesc: "Descrição da fase...", phStepInstr: "Instruções...", phQC: "Controle Qualidade...", phSkills: "Habilidades", lblDesc: "DESCRIÇÃO", min: "min", confirmDel: "Excluir?", step: "Etapa", lblInstr: "INSTRUÇÕES", lblQC: "QUALIDADE", lblSkills: "HABILIDADES", lblWip: "WIP", lblFin: "CONCLUÍDO" }
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

// 5. RENDERER
function renderStages() {
    dom.stagesContainer.innerHTML = '';
    if (!currentData.stages) currentData.stages = [];

    currentData.stages.forEach((stage, sIdx) => {
        const stageEl = document.createElement('div');
        stageEl.className = 'stage-card';
        stageEl.dataset.idx = sIdx;

        stageEl.innerHTML = `
            <div class="stage-header">
                <i class="fas fa-grip-vertical drag-handle" style="color:var(--text-muted); margin-top:5px; cursor:grab;"></i>
                <div style="flex:1;">
                    <input type="text" class="edit-input" style="font-size:16px;" value="${stage.stage_name || ''}" placeholder="${t.phStageName}" data-type="stage-name" data-sidx="${sIdx}">
                    <textarea class="edit-textarea" rows="1" placeholder="${t.phStageDesc}" data-type="stage-desc" data-sidx="${sIdx}">${stage.description || ''}</textarea>
                </div>
                <button class="btn-icon-sm delete" data-action="delete-stage" data-sidx="${sIdx}"><i class="fas fa-trash"></i></button>
            </div>
            
            <div class="step-list-container" data-sidx="${sIdx}">
                ${renderSteps(stage.steps, sIdx)}
            </div>
            
            <div style="padding: 10px; text-align: center;">
                <button class="btn btn-sm btn-secondary" data-action="add-step" data-sidx="${sIdx}" style="width:100%; border-style:dashed;">
                    <i class="fas fa-plus"></i> ${t.step}
                </button>
            </div>
        `;
        dom.stagesContainer.appendChild(stageEl);

        // Sortable per gli Step dentro ogni Stage
        new Sortable(stageEl.querySelector('.step-list-container'), {
            group: 'steps', handle: '.drag-handle', animation: 150,
            onEnd: handleSortEnd
        });
    });

    // Sortable per gli Stages (drag delle card intere)
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
        const wipBadge = step.logistics_flags?.requires_wip ? `<span class="badge badge-wip">WIP</span>` : '';
        const finBadge = step.logistics_flags?.requires_finished ? `<span class="badge badge-fin">FINISHED</span>` : '';
        
        const mins = parseInt(step.estimated_time_minutes) || 0;
        
        return `
        <div class="step-item" data-sidx="${sIdx}" data-stidx="${stIdx}">
            
            <!-- HEADER RIGA 1: Icona, Nome, Pulsanti -->
            <div class="step-header-grid">
                <i class="fas fa-grip-lines drag-handle" style="color:var(--text-muted); cursor:grab;"></i>
                
                <div class="step-name-box">
                    <input type="text" class="edit-input" style="border-bottom:none; padding:0;" 
                           value="${step.step_name || ''}" placeholder="${t.phStepName}" 
                           data-type="step-name" data-sidx="${sIdx}" data-stidx="${stIdx}">
                </div>

                <div class="step-actions-box">
                    <button class="btn-icon-sm ${activeClass}" data-action="toggle-step" data-sidx="${sIdx}" data-stidx="${stIdx}">
                        <i class="fas fa-chevron-${isOpen ? 'up' : 'down'}"></i>
                    </button>
                    <button class="btn-icon-sm delete" data-action="delete-step" data-sidx="${sIdx}" data-stidx="${stIdx}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <!-- HEADER RIGA 2: Tempo e Badges (Indentato) -->
            <div class="step-controls-row">
                <div class="step-time-box">
                    <i class="far fa-clock"></i>
                    <input type="number" min="0" value="${mins}" 
                           data-type="step-time" data-sidx="${sIdx}" data-stidx="${stIdx}">
                    <span>${t.min}</span>
                </div>
                <div style="display: flex; gap: 5px;">${wipBadge} ${finBadge}</div>
            </div>

            <!-- DETTAGLI (Espandibile) -->
            <div class="step-details ${isOpen}">
                
                <!-- Istruzioni -->
                <div class="input-group">
                    <label style="color:var(--primary);">${t.lblInstr}</label>
                    <textarea class="detail-textarea" rows="3" placeholder="${t.phStepInstr}" 
                              data-type="step-instr" data-sidx="${sIdx}" data-stidx="${stIdx}">${step.instructions||''}</textarea>
                </div>

                <!-- Quality Check -->
                <div class="input-group">
                    <label style="color:var(--success);">${t.lblQC}</label>
                    <textarea class="detail-textarea" rows="2" placeholder="${t.phQC}" 
                              data-type="step-qc" data-sidx="${sIdx}" data-stidx="${stIdx}">${step.quality_check?.check_description||''}</textarea>
                </div>

                <!-- Skills -->
                <div class="input-group">
                    <label style="color:var(--text-muted);">${t.lblSkills}</label>
                    <input type="text" class="detail-input-full" 
                           value="${(step.resources_needed?.labor?.required_skill_tags||[]).join(', ')}" 
                           placeholder="${t.phSkills}" 
                           data-type="step-skills" data-sidx="${sIdx}" data-stidx="${stIdx}">
                </div>

                <!-- Checkbox Flags -->
                <div class="checkbox-row">
                    <label class="checkbox-label">
                        <input type="checkbox" ${step.logistics_flags?.requires_wip?'checked':''} 
                               data-type="flag-wip" data-sidx="${sIdx}" data-stidx="${stIdx}"> 
                        ${t.lblWip}
                    </label>
                    <label class="checkbox-label">
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


// 6. EVENT HANDLERS
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
        renderStages(); // Re-render per aggiornare i badge
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
    renderStages();
}

// 8. NETWORK
async function loadBlueprint() {
    showLoader(t.loading);
    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'GET', type: 'BLUEPRINT', productId, token, vat })
        });
        const data = await res.json();
        
        console.log('Raw data received:', data); // DEBUG
        
        // Il JSON arriva come array, quindi prendiamo il primo elemento
        const bp = Array.isArray(data) ? data[0] : data;
        
        console.log('Blueprint parsed:', bp); // DEBUG
        
        currentData = bp || { stages: [] };
        dom.desc.value = currentData.blueprint_description || '';
        dom.sku.innerText = `SKU: ${currentData.service_sku || 'N/A'}`;
        
        updateIndexes(); 
        renderStages(); 
        hideLoader();
    } catch(e) { 
        console.error('Load error:', e); // DEBUG
        showError(e.message); 
    }
}

async function handleSave(e) {
    e.preventDefault();
    showLoader('Salvataggio...');
    
    currentData.blueprint_description = dom.desc.value;
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
    } catch(err) { showError(err.message); }
}

// 9. UTILS
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

// START
document.addEventListener('DOMContentLoaded', init);
