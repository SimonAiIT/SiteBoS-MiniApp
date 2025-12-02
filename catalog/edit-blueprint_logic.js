/**
 * BLUEPRINT EDITOR LOGIC (vFINAL - FULL)
 * - Drag & Drop Reordering (Stages & Steps)
 * - Full 6-Language I18N
 * - Dynamic UI Rendering & State Management
 * - Data Integrity with Self-Healing Indexes
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

// 2. I18N (FULL 6 LANGUAGES)
const i18n = {
    it: { page_title: "Editor Blueprint", title: "📋 Blueprint Operativo", subtitle: "Trascina per riordinare fasi e step.", lblInfo: "ℹ️ Info Generali", lblDesc: "Descrizione", lblStages: "🎯 Fasi Operative", btnAddStage: "Aggiungi Fase", btnSave: "Salva Blueprint", loading: "Caricamento...", saving: "Salvataggio...", saved: "✅ Salvato!", error: "❌ Errore", phDesc: "Scopo del processo...", phStageName: "Nome Fase (es. Analisi)", phStepName: "Nome Step (es. Raccolta Dati)", phStageDesc: "Descrizione fase...", phStepInstr: "Istruzioni per l'operatore...", lblQC: "Controllo Qualità", phQC: "Cosa deve essere verificato alla fine dello step?", lblSkills: "Skill Richieste (separate da virgola)", phSkills: "Es: Senior, Junior, Grafico...", newStage: "Nuova Fase", newStep: "Nuovo Step", confirmDelStage: "Sei sicuro di voler eliminare questa fase e tutti i suoi step?", confirmDelStep: "Sei sicuro di voler eliminare questo step?", btnAddStep: "Aggiungi Step", min: "min", lblLogistics: "Logistica & Risorse", flagWIP: "Richiede Semilavorato", flagFinished: "Richiede Prodotto Finito", cancelHint: "Per annullare, chiudi la finestra." },
    en: { page_title: "Blueprint Editor", title: "📋 Operational Blueprint", subtitle: "Drag to reorder stages and steps.", lblInfo: "ℹ️ General Info", lblDesc: "Description", lblStages: "🎯 Operational Stages", btnAddStage: "Add Stage", btnSave: "Save Blueprint", loading: "Loading...", saving: "Saving...", saved: "✅ Saved!", error: "❌ Error", phDesc: "Process purpose...", phStageName: "Stage Name (e.g. Analysis)", phStepName: "Step Name (e.g. Data Collection)", phStageDesc: "Stage description...", phStepInstr: "Instructions for the operator...", lblQC: "Quality Check", phQC: "What should be verified at the end of the step?", lblSkills: "Required Skills (comma-separated)", phSkills: "E.g.: Dev, Legal, Designer...", newStage: "New Stage", newStep: "New Step", confirmDelStage: "Are you sure you want to delete this stage and all its steps?", confirmDelStep: "Are you sure you want to delete this step?", btnAddStep: "Add Step", min: "min", lblLogistics: "Logistics & Resources", flagWIP: "Requires Semi-finished (WIP)", flagFinished: "Requires Finished Product", cancelHint: "To cancel, close the window." },
    fr: { page_title: "Éditeur de Blueprint", title: "📋 Blueprint Opérationnel", subtitle: "Glissez pour réorganiser les phases et étapes.", lblInfo: "ℹ️ Infos Générales", lblDesc: "Description", lblStages: "🎯 Phases Opérationnelles", btnAddStage: "Ajouter Phase", btnSave: "Enregistrer Blueprint", loading: "Chargement...", saving: "Enregistrement...", saved: "✅ Enregistré !", error: "❌ Erreur", phDesc: "Objectif du processus...", phStageName: "Nom de la Phase", phStepName: "Nom de l'Étape", phStageDesc: "Description de la phase...", phStepInstr: "Instructions pour l'opérateur...", lblQC: "Contrôle Qualité", phQC: "Que faut-il vérifier ?", lblSkills: "Compétences (séparées par virgule)", phSkills: "Ex: Dev, Juridique...", newStage: "Nouvelle Phase", newStep: "Nouvelle Étape", confirmDelStage: "Voulez-vous vraiment supprimer cette phase ?", confirmDelStep: "Voulez-vous vraiment supprimer cette étape ?", btnAddStep: "Ajouter Étape", min: "min", lblLogistics: "Logistique & Ressources", flagWIP: "Nécessite Produit Semi-fini", flagFinished: "Nécessite Produit Fini", cancelHint: "Pour annuler, fermez la fenêtre." },
    de: { page_title: "Blueprint Editor", title: "📋 Operativer Blueprint", subtitle: "Ziehen zum Neuordnen von Phasen und Schritten.", lblInfo: "ℹ️ Allgemeine Infos", lblDesc: "Beschreibung", lblStages: "🎯 Operative Phasen", btnAddStage: "Phase hinzufügen", btnSave: "Blueprint Speichern", loading: "Laden...", saving: "Speichern...", saved: "✅ Gespeichert!", error: "❌ Fehler", phDesc: "Zweck des Prozesses...", phStageName: "Phasenname", phStepName: "Schrittname", phStageDesc: "Phasenbeschreibung...", phStepInstr: "Anweisungen...", lblQC: "Qualitätskontrolle", phQC: "Was soll überprüft werden?", lblSkills: "Fähigkeiten (Komma-getrennt)", phSkills: "z.B. Dev, Recht...", newStage: "Neue Phase", newStep: "Neuer Schritt", confirmDelStage: "Möchten Sie diese Phase wirklich löschen?", confirmDelStep: "Möchten Sie diesen Schritt wirklich löschen?", btnAddStep: "Schritt hinzufügen", min: "Min.", lblLogistics: "Logistik & Ressourcen", flagWIP: "Benötigt Halbzeug", flagFinished: "Benötigt Fertigprodukt", cancelHint: "Zum Abbrechen Fenster schließen." },
    es: { page_title: "Editor de Blueprint", title: "📋 Blueprint Operativo", subtitle: "Arrastra para reordenar fases y pasos.", lblInfo: "ℹ️ Información General", lblDesc: "Descripción", lblStages: "🎯 Fases Operativas", btnAddStage: "Añadir Fase", btnSave: "Guardar Blueprint", loading: "Cargando...", saving: "Guardando...", saved: "✅ Guardado", error: "❌ Error", phDesc: "Propósito del proceso...", phStageName: "Nombre de Fase", phStepName: "Nombre de Paso", phStageDesc: "Descripción de la fase...", phStepInstr: "Instrucciones...", lblQC: "Control de Calidad", phQC: "¿Qué verificar?", lblSkills: "Habilidades (separadas por coma)", phSkills: "Ej: Dev, Legal...", newStage: "Nueva Fase", newStep: "Nuevo Paso", confirmDelStage: "¿Seguro que quieres eliminar esta fase?", confirmDelStep: "¿Seguro que quieres eliminar este paso?", btnAddStep: "Añadir Paso", min: "min", lblLogistics: "Logística & Recursos", flagWIP: "Requiere Semielaborado", flagFinished: "Requiere Producto Terminado", cancelHint: "Para cancelar, cierra la ventana." },
    pt: { page_title: "Editor de Blueprint", title: "📋 Blueprint Operacional", subtitle: "Arraste para reordenar fases e etapas.", lblInfo: "ℹ️ Informações Gerais", lblDesc: "Descrição", lblStages: "🎯 Fases Operacionais", btnAddStage: "Adicionar Fase", btnSave: "Salvar Blueprint", loading: "Carregando...", saving: "Salvando...", saved: "✅ Salvo!", error: "❌ Erro", phDesc: "Propósito do processo...", phStageName: "Nome da Fase", phStepName: "Nome da Etapa", phStageDesc: "Descrição da fase...", phStepInstr: "Instruções...", lblQC: "Controle de Qualidade", phQC: "O que verificar?", lblSkills: "Habilidades (separadas por vírgula)", phSkills: "Ex: Dev, Jurídico...", newStage: "Nova Fase", newStep: "Nova Etapa", confirmDelStage: "Tem certeza de que deseja excluir esta fase?", confirmDelStep: "Tem certeza de que deseja excluir esta etapa?", btnAddStep: "Adicionar Etapa", min: "min", lblLogistics: "Logística & Recursos", flagWIP: "Requer Semiacabado", flagFinished: "Requer Produto Acabado", cancelHint: "Para cancelar, feche a janela." }
};
const t = i18n[langParam.slice(0,2)] || i18n.it;

// 3. DOM CACHE
const dom = {
    loader: document.getElementById('loadingOverlay'),
    loaderText: document.getElementById('loaderText'),
    content: document.getElementById('mainContent'),
    form: document.getElementById('blueprintForm'),
    stagesContainer: document.getElementById('stagesContainer'),
    sku: document.getElementById('serviceSku'),
    desc: document.getElementById('blueprintDesc'),
    saveBtn: document.getElementById('saveBtn')
};

// 4. MAIN & INIT
function init() {
    applyTranslations();
    if (!productId || !token || !vat) {
        dom.loaderText.textContent = "Error: Missing Params";
        return;
    }
    loadBlueprint();
    dom.form.addEventListener('submit', handleSave);
    document.getElementById('btnAddStageBtn').addEventListener('click', addStage);
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerText = t[key];
    });
    document.title = t.page_title;
    dom.desc.placeholder = t.phDesc;
}

// 5. RENDER LOGIC
function renderStages() {
    dom.stagesContainer.innerHTML = '';
    if (!currentData.stages) currentData.stages = [];

    currentData.stages.forEach((stage, sIdx) => {
        const stageCard = document.createElement('div');
        stageCard.className = 'stage-card';
        stageCard.dataset.idx = sIdx;

        stageCard.innerHTML = `
          <div class="stage-header">
            <i class="fas fa-grip-vertical drag-handle"></i>
            <div class="stage-content">
              <input type="text" class="stage-title-input" value="${stage.stage_name || ''}" placeholder="${t.phStageName}" data-path="stages.${sIdx}.stage_name">
              <textarea rows="1" data-path="stages.${sIdx}.description" placeholder="${t.phStageDesc}">${stage.description || ''}</textarea>
            </div>
            <button type="button" class="btn-icon btn-delete" data-idx="${sIdx}"><i class="fas fa-trash"></i></button>
          </div>
          <div class="step-list-container" data-stage-idx="${sIdx}"></div>
          <div class="text-center mt-2">
            <button type="button" class="btn btn-sm btn-secondary" data-idx="${sIdx}">
                <i class="fas fa-plus"></i> ${t.btnAddStep}
            </button>
          </div>`;

        const stepListContainer = stageCard.querySelector('.step-list-container');
        if (stage.steps) {
            stage.steps.forEach((step, stIdx) => {
                stepListContainer.appendChild(createStepElement(sIdx, stIdx, step));
            });
        }
        
        new Sortable(stepListContainer, {
            group: 'steps', handle: '.drag-handle', animation: 150, ghostClass: 'sortable-ghost',
            onEnd: handleSortEnd
        });
        dom.stagesContainer.appendChild(stageCard);
    });

    new Sortable(dom.stagesContainer, {
        handle: '.drag-handle', animation: 150, ghostClass: 'sortable-ghost',
        onEnd: handleSortEnd
    });
}

function createStepElement(sIdx, stIdx, step) {
    const stepItem = document.createElement('div');
    stepItem.className = 'step-item';
    stepItem.dataset.stageIdx = sIdx;
    stepItem.dataset.stepIdx = stIdx;

    const flags = step.logistics_flags || {};
    const isOpen = step._ui_open ? 'open' : '';

    stepItem.innerHTML = `
      <div class="step-header">
        <i class="fas fa-grip-lines drag-handle"></i>
        <div style="flex:1">
          <input type="text" class="step-name-input" value="${step.step_name || ''}" placeholder="${t.phStepName}" data-path="stages.${sIdx}.steps.${stIdx}.step_name">
          <div class="d-flex align-center gap-2 mt-2">
            <span>⏱️</span>
            <input type="number" min="0" value="${step.estimated_time_minutes || 0}" data-path="stages.${sIdx}.steps.${stIdx}.estimated_time_minutes">
            <span>${t.min}</span>
          </div>
        </div>
        <div class="d-flex flex-column gap-2">
          <button type="button" class="btn-icon btn-delete" data-sidx="${sIdx}" data-stidx="${stIdx}"><i class="fas fa-trash"></i></button>
          <button type="button" class="btn-icon btn-toggle" data-sidx="${sIdx}" data-stidx="${stIdx}">
            ${step.quality_check?.check_description ? '<i class="fas fa-clipboard-check text-success"></i>' : '<i class="fas fa-cog"></i>'}
          </button>
        </div>
      </div>
      <div class="collapsible-content ${isOpen}">
        <div class="form-group">
          <label>${t.lblStepInstr}</label>
          <textarea data-path="stages.${sIdx}.steps.${stIdx}.instructions" placeholder="${t.phStepInstr}">${step.instructions || ''}</textarea>
        </div>
        <div class="form-section-title" style="margin-top:15px; font-size:11px;">${t.lblLogistics}</div>
        <div class="checkbox-group">
            <label><input type="checkbox" ${flags.requires_wip ? 'checked' : ''} data-path="stages.${sIdx}.steps.${stIdx}.logistics_flags.requires_wip">🏭 ${t.flagWIP}</label>
            <label><input type="checkbox" ${flags.requires_finished ? 'checked' : ''} data-path="stages.${sIdx}.steps.${stIdx}.logistics_flags.requires_finished">📦 ${t.flagFinished}</label>
        </div>
        <div class="form-group">
          <label>${t.lblQC}</label>
          <textarea data-path="stages.${sIdx}.steps.${stIdx}.quality_check.check_description" placeholder="${t.phQC}">${step.quality_check?.check_description || ''}</textarea>
        </div>
        <div class="form-group">
          <label>${t.lblSkills}</label>
          <input type="text" value="${(step.resources_needed?.labor?.required_skill_tags || []).join(', ')}" data-path="stages.${sIdx}.steps.${stIdx}.resources_needed.labor.required_skill_tags" placeholder="${t.phSkills}">
        </div>
      </div>`;
    return stepItem;
}

// 6. EVENT HANDLERS & DATA MANIPULATION
function handleSortEnd(evt) {
    const isStageSort = evt.from.id === 'stagesContainer';
    if (isStageSort) {
        const movedItem = currentData.stages.splice(evt.oldIndex, 1)[0];
        currentData.stages.splice(evt.newIndex, 0, movedItem);
    } else {
        const fromStageIdx = parseInt(evt.from.dataset.stageIdx);
        const toStageIdx = parseInt(evt.to.dataset.stageIdx);
        const movedItem = currentData.stages[fromStageIdx].steps.splice(evt.oldIndex, 1)[0];
        currentData.stages[toStageIdx].steps.splice(evt.newIndex, 0, movedItem);
    }
    updateIndexes();
    renderStages();
    bindDynamicEvents();
}

function updateIndexes() {
    if (!currentData || !currentData.stages) return;
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

function setObjectValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (typeof current[key] === 'undefined' || current[key] === null) {
            // Se la chiave successiva è un numero, crea un array, altrimenti un oggetto
            current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
        }
        current = current[key];
    }
    // Gestione speciale per checkbox e tipi di dato
    const finalKey = keys[keys.length - 1];
    if(typeof value === 'boolean') {
        current[finalKey] = value;
    } else if (path.includes('estimated_time_minutes')) {
        current[finalKey] = parseInt(value) || 0;
    } else if (path.includes('required_skill_tags')) {
        current[finalKey] = value.split(',').map(s => s.trim()).filter(Boolean);
    } else {
        current[finalKey] = value;
    }
}

function addStage() {
    if (!currentData.stages) currentData.stages = [];
    currentData.stages.push({ stage_name: t.newStage, description: "", steps: [] });
    updateIndexes();
    renderStages();
    bindDynamicEvents();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function removeStage(index) {
    if (confirm(t.confirmDelStage)) {
        currentData.stages.splice(index, 1);
        updateIndexes();
        renderStages();
        bindDynamicEvents();
    }
}

function addStep(stageIndex) {
    if (!currentData.stages[stageIndex].steps) currentData.stages[stageIndex].steps = [];
    currentData.stages[stageIndex].steps.push({ step_name: t.newStep, instructions: "", estimated_time_minutes: 15, _ui_open: true });
    updateIndexes();
    renderStages();
    bindDynamicEvents();
}

function removeStep(sIdx, stIdx) {
    if (confirm(t.confirmDelStep)) {
        currentData.stages[sIdx].steps.splice(stIdx, 1);
        updateIndexes();
        renderStages();
        bindDynamicEvents();
    }
}

function toggleStep(sIdx, stIdx) {
    const step = currentData.stages[sIdx].steps[stIdx];
    step._ui_open = !step._ui_open;
    document.querySelector(`.step-item[data-stage-idx="${sIdx}"][data-step-idx="${stIdx}"] .collapsible-content`).classList.toggle('open');
}

function bindDynamicEvents() {
    // Input/Textarea changes
    dom.content.querySelectorAll('input[data-path], textarea[data-path]').forEach(el => {
        const eventType = el.type === 'checkbox' ? 'change' : 'input';
        el.oninput = (e) => { // 'oninput' è più reattivo di 'onchange'
            const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            setObjectValue(currentData, e.target.dataset.path, value);
        };
    });
    // Button clicks
    dom.content.querySelectorAll('.btn-delete[data-idx]').forEach(btn => btn.onclick = () => removeStage(parseInt(btn.dataset.idx)));
    dom.content.querySelectorAll('.btn-secondary[data-idx]').forEach(btn => btn.onclick = () => addStep(parseInt(btn.dataset.idx)));
    dom.content.querySelectorAll('.btn-delete[data-sidx]').forEach(btn => btn.onclick = () => removeStep(parseInt(btn.dataset.sidx), parseInt(btn.dataset.stidx)));
    dom.content.querySelectorAll('.btn-toggle').forEach(btn => btn.onclick = () => toggleStep(parseInt(btn.dataset.sidx), parseInt(btn.dataset.stidx)));
}

// 7. NETWORK
async function loadBlueprint() {
    showLoader(t.loading);
    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'GET', type: 'BLUEPRINT', productId: productId, token: token, vat: vat })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        const blueprintData = Array.isArray(data) ? (data[0].blueprint || data[0]) : (data.blueprint || data);

        if (!blueprintData) throw new Error("Blueprint data not found in response.");
        currentData = blueprintData;

        dom.sku.value = currentData.service_sku || '';
        dom.desc.value = currentData.blueprint_description || '';
        
        updateIndexes();
        renderStages();
        bindDynamicEvents();
        hideLoader();
    } catch (e) {
        handleError(e);
    }
}

async function handleSave(event) {
    if(event) event.preventDefault();
    setButtonLoading(dom.saveBtn, true, t.saving);
    
    currentData.blueprint_description = dom.desc.value;
    const cleanData = JSON.parse(JSON.stringify(currentData));
    if (cleanData.stages) {
        cleanData.stages.forEach(s => {
            if (s.steps) s.steps.forEach(st => delete st._ui_open);
        });
    }

    updateIndexes();

    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'SAVE', type: 'BLUEPRINT', productId: productId, token: token, vat: vat, payload: cleanData })
        });
        if (!res.ok) throw new Error("Save failed");
        
        setButtonLoading(dom.saveBtn, false, t.saved, true);
        try { tg.HapticFeedback.notificationOccurred('success'); } catch (e) {}
        setTimeout(() => { try { tg.close(); } catch (e) {} }, 1500);
    } catch (e) {
        handleError(e);
        setButtonLoading(dom.saveBtn, false, t.btnSave);
    }
}

// 8. UTILS
function showLoader(text) { dom.loaderText.textContent = text; dom.loader.style.display = 'flex'; dom.content.classList.add('hidden'); }
function hideLoader() { dom.loader.style.display = 'none'; dom.content.classList.remove('hidden'); }
function handleError(e) { console.error(e); dom.loaderText.textContent = t.error + ": " + e.message; }
function setButtonLoading(btn, isLoading, text, isSuccess = false) {
    btn.disabled = isLoading;
    btn.innerHTML = isLoading ? `<i class="fas fa-circle-notch fa-spin"></i> ${text}` : `<i class="${isSuccess ? 'fas fa-check' : 'fas fa-save'}"></i> ${text}`;
    if (isSuccess) {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-success');
    }
}

// 9. START
document.addEventListener('DOMContentLoaded', init);
