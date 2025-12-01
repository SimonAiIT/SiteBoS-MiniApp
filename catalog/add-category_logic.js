/**
 * ADD CATEGORY LOGIC (v2.1 FINAL)
 * - Full 6-language I18N support.
 * - Dual Mode: Manual/AI and File Upload.
 * - Clear separation of logic and view.
 */

'use strict';

// ==========================================
// 1. CONFIG & STATE
// ==========================================

// TODO: Inserisci qui i tuoi webhook reali
const GENERATE_WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/5e225cf6-76bb-4e19-8657-35cac49fd399";
const SAVE_WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/7da6f424-dc2a-4476-a0bd-a3bfd21270fb";
const ANALYZE_FILE_WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/INSERISCI_ENDPOINT_ANALISI_FILE";

const tg = window.Telegram.WebApp;
tg.ready(); tg.expand();

const urlParams = new URLSearchParams(window.location.search);
let generatedCategoryData = null;
let currentMode = 'manual';

// ==========================================
// 2. I18N DICTIONARY (FULL 6 LANGUAGES)
// ==========================================
const i18n = {
    it: {
        page_title: "Nuova Categoria", title: "➕ Nuova Categoria", subtitle: "Definisci una nuova area per i tuoi prodotti o servizi.",
        tab_manual: "Manuale / AI", tab_upload: "Da File",
        lblCatName: "Nome Categoria", lblCatDesc: "Descrizione (Opzionale)",
        btnGenerate: "Genera Servizi con AI",
        subcatTitle: "Seleziona i servizi da includere",
        lblManualAdd: "Aggiungi Manualmente", manualPlaceholder: "Es. Manutenzione ordinaria...",
        upload_disclaimer: "Carica un listino o un documento (PDF/JSON). L'AI estrarrà una singola categoria e i relativi prodotti.",
        upload_hint: "Tocca per caricare PDF o JSON",
        btnSave: "Salva Categoria",
        status_generating: "L'AI sta analizzando...", status_saving: "Salvataggio...", status_uploading: "Caricamento e analisi...",
        status_success: "✅ Categoria Creata!",
        err_name_req: "Il nome della categoria è obbligatorio!", err_file_req: "Per favore, seleziona un file.",
        err_generic: "Si è verificato un errore. Riprova più tardi."
    },
    en: {
        page_title: "New Category", title: "➕ New Category", subtitle: "Define a new area for your products or services.",
        tab_manual: "Manual / AI", tab_upload: "From File",
        lblCatName: "Category Name", lblCatDesc: "Description (Optional)",
        btnGenerate: "Generate Services with AI",
        subcatTitle: "Select services to include",
        lblManualAdd: "Add Manually", manualPlaceholder: "E.g., Standard maintenance...",
        upload_disclaimer: "Upload a pricelist or document (PDF/JSON). The AI will extract a single category and its products.",
        upload_hint: "Tap to upload PDF or JSON",
        btnSave: "Save Category",
        status_generating: "AI is analyzing...", status_saving: "Saving...", status_uploading: "Uploading & analyzing...",
        status_success: "✅ Category Created!",
        err_name_req: "Category name is required!", err_file_req: "Please select a file.",
        err_generic: "An error occurred. Please try again later."
    },
    fr: {
        page_title: "Nouvelle Catégorie", title: "➕ Nouvelle Catégorie", subtitle: "Définissez une nouvelle zone pour vos produits ou services.",
        tab_manual: "Manuel / IA", tab_upload: "Depuis Fichier",
        lblCatName: "Nom de la Catégorie", lblCatDesc: "Description (Optionnel)",
        btnGenerate: "Générer avec l'IA",
        subcatTitle: "Sélectionnez les services à inclure",
        lblManualAdd: "Ajouter Manuellement", manualPlaceholder: "Ex. Entretien courant...",
        upload_disclaimer: "Chargez une liste de prix ou un document (PDF/JSON). L'IA extraira une seule catégorie et ses produits.",
        upload_hint: "Touchez pour charger PDF ou JSON",
        btnSave: "Enregistrer Catégorie",
        status_generating: "L'IA analyse...", status_saving: "Enregistrement...", status_uploading: "Chargement et analyse...",
        status_success: "✅ Catégorie Créée !",
        err_name_req: "Le nom de la catégorie est requis !", err_file_req: "Veuillez sélectionner un fichier.",
        err_generic: "Une erreur est survenue. Veuillez réessayer plus tard."
    },
    de: {
        page_title: "Neue Kategorie", title: "➕ Neue Kategorie", subtitle: "Definieren Sie einen neuen Bereich für Ihre Produkte oder Dienstleistungen.",
        tab_manual: "Manuell / KI", tab_upload: "Aus Datei",
        lblCatName: "Kategoriename", lblCatDesc: "Beschreibung (Optional)",
        btnGenerate: "Mit KI generieren",
        subcatTitle: "Wählen Sie die einzuschließenden Dienste aus",
        lblManualAdd: "Manuell hinzufügen", manualPlaceholder: "Z.B. Standardwartung...",
        upload_disclaimer: "Laden Sie eine Preisliste oder ein Dokument (PDF/JSON) hoch. Die KI extrahiert eine einzelne Kategorie und ihre Produkte.",
        upload_hint: "Tippen, um PDF oder JSON hochzuladen",
        btnSave: "Kategorie speichern",
        status_generating: "KI analysiert...", status_saving: "Speichern...", status_uploading: "Hochladen & analysieren...",
        status_success: "✅ Kategorie erstellt!",
        err_name_req: "Kategoriename ist erforderlich!", err_file_req: "Bitte wählen Sie eine Datei aus.",
        err_generic: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut."
    },
    es: {
        page_title: "Nueva Categoría", title: "➕ Nueva Categoría", subtitle: "Define una nueva área para tus productos o servicios.",
        tab_manual: "Manual / IA", tab_upload: "Desde Archivo",
        lblCatName: "Nombre de la Categoría", lblCatDesc: "Descripción (Opcional)",
        btnGenerate: "Generar con IA",
        subcatTitle: "Selecciona los servicios a incluir",
        lblManualAdd: "Añadir Manualmente", manualPlaceholder: "Ej. Mantenimiento estándar...",
        upload_disclaimer: "Sube una lista de precios o un documento (PDF/JSON). La IA extraerá una sola categoría y sus productos.",
        upload_hint: "Toca para subir PDF o JSON",
        btnSave: "Guardar Categoría",
        status_generating: "La IA está analizando...", status_saving: "Guardando...", status_uploading: "Subiendo y analizando...",
        status_success: "✅ ¡Categoría Creada!",
        err_name_req: "¡El nombre de la categoría es obligatorio!", err_file_req: "Por favor, selecciona un archivo.",
        err_generic: "Ocurrió un error. Por favor, inténtalo de nuevo más tarde."
    },
    pt: {
        page_title: "Nova Categoria", title: "➕ Nova Categoria", subtitle: "Defina uma nova área para seus produtos ou serviços.",
        tab_manual: "Manual / IA", tab_upload: "De Arquivo",
        lblCatName: "Nome da Categoria", lblCatDesc: "Descrição (Opcional)",
        btnGenerate: "Gerar com IA",
        subcatTitle: "Selecione os serviços a incluir",
        lblManualAdd: "Adicionar Manualmente", manualPlaceholder: "Ex. Manutenção padrão...",
        upload_disclaimer: "Carregue uma lista de preços ou documento (PDF/JSON). A IA irá extrair uma única categoria e seus produtos.",
        upload_hint: "Toque para carregar PDF ou JSON",
        btnSave: "Salvar Categoria",
        status_generating: "A IA está analisando...", status_saving: "Salvando...", status_uploading: "Carregando e analisando...",
        status_success: "✅ Categoria Criada!",
        err_name_req: "O nome da categoria é obrigatório!", err_file_req: "Por favor, selecione um arquivo.",
        err_generic: "Ocorreu um erro. Por favor, tente novamente mais tarde."
    }
};

const lang = (urlParams.get('lang') || tg.initDataUnsafe?.user?.language_code || 'it').slice(0, 2);
const t = i18n[lang] || i18n.it;

// ==========================================
// 3. DOM ELEMENTS
// ==========================================
const dom = {
    loader: document.getElementById('loader'),
    loaderText: document.getElementById('loader-text'),
    content: document.getElementById('app-content'),
    initialSection: document.getElementById('initialInputSection'),
    subcatSection: document.getElementById('subcategoriesSection'),
    subcatList: document.getElementById('subcategoriesList'),
    saveSection: document.getElementById('save-section'),
    catName: document.getElementById('categoryName'),
    catDesc: document.getElementById('categoryDescription'),
    manualInput: document.getElementById('manualSubcat'),
    fileInput: document.getElementById('file-input'),
    fileBox: document.getElementById('file-upload-box'),
    fileText: document.getElementById('upload-text')
};

// ==========================================
// 4. CORE LOGIC
// ==========================================
function init() {
    applyTranslations();
    bindEvents();
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerText = t[key];
    });
    document.title = t.page_title;
    dom.manualInput.placeholder = t.manualPlaceholder;
}

function bindEvents() {
    document.getElementById('generateBtn').addEventListener('click', generateFromText);
    document.getElementById('addSubcatBtn').addEventListener('click', addManualSubcat);
    document.getElementById('saveBtn').addEventListener('click', saveCategory);
    dom.fileInput.addEventListener('change', handleFileUpload);
}

window.switchTab = function(mode) {
    currentMode = mode;
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
    document.querySelector(`.nav-tab[data-tab="${mode}"]`).classList.add('active');
    
    document.getElementById('tab-content-manual').classList.add('hidden');
    document.getElementById('tab-content-upload').classList.add('hidden');
    document.getElementById(`tab-content-${mode}`).classList.remove('hidden');
    
    dom.saveSection.classList.add('hidden');
    dom.subcatSection.classList.add('hidden');
    dom.initialSection.classList.remove('hidden');
    generatedCategoryData = null; // Reset state
};

async function generateFromText() {
    const name = dom.catName.value.trim();
    if (!name) return tg.showAlert(t.err_name_req);
    showLoader(t.status_generating);
    try {
        const res = await fetch(GENERATE_WEBHOOK_URL, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ category_name: name, category_description: dom.catDesc.value, token: urlParams.get('token'), language: lang })
        });
        handleAnalysisResult(await res.json());
    } catch (e) { handleError(e); }
}

async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    showLoader(t.status_uploading);
    dom.fileBox.classList.add('analyzing');
    dom.fileText.innerText = t.status_uploading;
    try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64 = reader.result.split(',')[1];
            const mime = reader.result.match(/:(.*?);/)[1];
            const res = await fetch(ANALYZE_FILE_WEBHOOK_URL, {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ token: urlParams.get('token'), file_data: base64, mime_type: mime, language: lang })
            });
            dom.fileBox.classList.remove('analyzing').add('success');
            dom.fileText.innerText = "File Analizzato!";
            switchTab('manual');
            handleAnalysisResult(await res.json());
        };
    } catch (e) { handleError(e); dom.fileBox.classList.remove('analyzing'); }
}

function handleAnalysisResult(data) {
    generatedCategoryData = data;
    dom.catName.value = data.name;
    dom.catDesc.value = data.description || "";
    dom.subcatList.innerHTML = '';
    if (data.subcategories) data.subcategories.forEach(sub => createListItem(sub.name, sub.short_name));
    dom.initialSection.classList.remove('hidden');
    dom.subcatSection.classList.remove('hidden');
    dom.saveSection.classList.remove('hidden');
    hideLoader();
}

function createListItem(name, display) {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.innerHTML = `
        <div class="checkbox-group" style="margin-bottom:0; width:100%;">
            <input type="checkbox" checked value="${name}" data-short="${display}" id="chk_${name.replace(/\s/g, '_')}">
            <label for="chk_${name.replace(/\s/g, '_')}">${display}</label>
        </div>`;
    dom.subcatList.appendChild(li);
}

function addManualSubcat() {
    const val = dom.manualInput.value.trim();
    if (val) { createListItem(val, val); dom.manualInput.value = ''; }
}

async function saveCategory() {
    if (!dom.catName.value) return tg.showAlert(t.err_name_req);
    showLoader(t.status_saving);
    const selected = [];
    dom.subcatList.querySelectorAll('input:checked').forEach(cb => {
        selected.push({
            name: cb.value, short_name: cb.dataset.short,
            callback_data: cb.value.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 60)
        });
    });
    const payload = {
        token: urlParams.get('token'),
        new_category_block: {
            name: dom.catName.value, description: dom.catDesc.value,
            short_name: dom.catName.value, subcategories: selected
        },
        ...Object.fromEntries(urlParams)
    };
    try {
        const res = await fetch(SAVE_WEBHOOK_URL, {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error();
        hideLoader();
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        tg.showPopup({ message: t.status_success, buttons: [{type: 'ok'}] }, () => history.back());
    } catch (e) { handleError(e); }
}

// ==========================================
// 5. UTILITY FUNCTIONS
// ==========================================
function showLoader(text) {
    dom.loaderText.innerText = text;
    dom.loader.classList.remove('hidden');
    dom.content.classList.add('hidden');
}

function hideLoader() {
    dom.loader.classList.add('hidden');
    dom.content.classList.remove('hidden');
}

function handleError(error) {
    console.error(error);
    hideLoader();
    tg.showAlert(t.err_generic);
}

document.addEventListener('DOMContentLoaded', init);
