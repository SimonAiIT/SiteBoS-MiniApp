/**
 * ADD CATEGORY LOGIC (v3.0 - SIMPLE & FLAT)
 * - Single Form Flow: Name (Req) + Desc (Opt) + File (Opt) -> One Button.
 * - Full 6-language I18N.
 */

'use strict';

// CONFIG
const GENERATE_WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/5e225cf6-76bb-4e19-8657-35cac49fd399";
const SAVE_WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/7da6f424-dc2a-4476-a0bd-a3bfd21270fb";

const tg = window.Telegram.WebApp;
tg.ready(); tg.expand();

const urlParams = new URLSearchParams(window.location.search);
let generatedCategoryData = null;

// I18N COMPLETE
const i18n = {
    it: {
        page_title: "Nuova Categoria", title: "➕ Nuova Categoria", subtitle: "Configura la nuova area di business.",
        lblCatName: "Nome Categoria", lblCatDesc: "Descrizione (Opzionale)",
        divider_text: "E / O CARICA LISTINO (PDF/JSON)",
        upload_hint: "Tocca per caricare File",
        btnGenerate: "Genera Servizi",
        subcatTitle: "Revisione Servizi", lblManualAdd: "Aggiungi altro...",
        btnSave: "Conferma e Salva",
        status_analyzing: "Analisi in corso...", status_saving: "Salvataggio...",
        status_success: "✅ Categoria Creata!",
        err_name_req: "Il nome della categoria è obbligatorio!",
        err_generic: "Errore. Riprova."
    },
    en: {
        page_title: "New Category", title: "➕ New Category", subtitle: "Setup new business area.",
        lblCatName: "Category Name", lblCatDesc: "Description (Optional)",
        divider_text: "AND / OR UPLOAD LIST (PDF/JSON)",
        upload_hint: "Tap to upload File",
        btnGenerate: "Generate Services",
        subcatTitle: "Review Services", lblManualAdd: "Add more...",
        btnSave: "Confirm & Save",
        status_analyzing: "Analyzing...", status_saving: "Saving...",
        status_success: "✅ Category Created!",
        err_name_req: "Category name is required!",
        err_generic: "Error. Retry."
    },
    fr: {
        page_title: "Nouvelle Catégorie", title: "➕ Nouvelle Catégorie", subtitle: "Configurez la nouvelle zone.",
        lblCatName: "Nom Catégorie", lblCatDesc: "Description (Optionnel)",
        divider_text: "ET / OU CHARGER FICHIER",
        upload_hint: "Touchez pour charger",
        btnGenerate: "Générer Services",
        subcatTitle: "Révision Services", lblManualAdd: "Ajouter...",
        btnSave: "Confirmer & Enregistrer",
        status_analyzing: "Analyse...", status_saving: "Enregistrement...",
        status_success: "✅ Créée !",
        err_name_req: "Nom requis !",
        err_generic: "Erreur. Réessayer."
    },
    de: {
        page_title: "Neue Kategorie", title: "➕ Neue Kategorie", subtitle: "Neuen Bereich einrichten.",
        lblCatName: "Kategoriename", lblCatDesc: "Beschreibung (Optional)",
        divider_text: "UND / ODER DATEI LADEN",
        upload_hint: "Tippen zum Laden",
        btnGenerate: "Dienste Generieren",
        subcatTitle: "Dienste Überprüfen", lblManualAdd: "Hinzufügen...",
        btnSave: "Bestätigen & Speichern",
        status_analyzing: "Analysiere...", status_saving: "Speichern...",
        status_success: "✅ Erstellt!",
        err_name_req: "Name erforderlich!",
        err_generic: "Fehler. Wiederholen."
    },
    es: {
        page_title: "Nueva Categoría", title: "➕ Nueva Categoría", subtitle: "Configura nueva área.",
        lblCatName: "Nombre Categoría", lblCatDesc: "Descripción (Opcional)",
        divider_text: "Y / O CARGAR ARCHIVO",
        upload_hint: "Toca para cargar",
        btnGenerate: "Generar Servicios",
        subcatTitle: "Revisar Servicios", lblManualAdd: "Añadir...",
        btnSave: "Confirmar y Guardar",
        status_analyzing: "Analizando...", status_saving: "Guardando...",
        status_success: "✅ ¡Creada!",
        err_name_req: "¡Nombre obligatorio!",
        err_generic: "Error. Reintentar."
    },
    pt: {
        page_title: "Nova Categoria", title: "➕ Nova Categoria", subtitle: "Configurar nova área.",
        lblCatName: "Nome Categoria", lblCatDesc: "Descrição (Opcional)",
        divider_text: "E / OU CARREGAR ARQUIVO",
        upload_hint: "Toque para carregar",
        btnGenerate: "Gerar Serviços",
        subcatTitle: "Revisar Serviços", lblManualAdd: "Adicionar...",
        btnSave: "Confirmar e Salvar",
        status_analyzing: "Analisando...", status_saving: "Salvando...",
        status_success: "✅ Criada!",
        err_name_req: "Nome obrigatório!",
        err_generic: "Erro. Tente novamente."
    }
};

const lang = (urlParams.get('lang') || tg.initDataUnsafe?.user?.language_code || 'it').slice(0, 2);
const t = i18n[lang] || i18n.it; // Fallback su IT se manca lingua

// DOM
const dom = {
    loader: document.getElementById('loader'),
    loaderText: document.getElementById('loader-text'),
    content: document.getElementById('app-content'),
    inputPhase: document.getElementById('inputPhase'),
    reviewPhase: document.getElementById('reviewPhase'),
    subcatList: document.getElementById('subcategoriesList'),
    catName: document.getElementById('categoryName'),
    catDesc: document.getElementById('categoryDescription'),
    manualInput: document.getElementById('manualSubcat'),
    fileInput: document.getElementById('file-input'),
    fileBox: document.getElementById('file-upload-box'),
    fileText: document.getElementById('upload-text'),
    fileName: document.getElementById('file-name-display')
};

function init() {
    // Apply Translations
    document.title = t.page_title;
    for (const key in t) {
        const el = document.querySelector(`[data-i18n="${key}"]`);
        if(el) el.innerText = t[key];
    }
    dom.manualInput.placeholder = t.manualPlaceholder || "...";

    // Bind Events
    document.getElementById('generateBtn').addEventListener('click', handleGenerate);
    document.getElementById('addSubcatBtn').addEventListener('click', addManualSubcat);
    document.getElementById('saveBtn').addEventListener('click', saveCategory);
    
    dom.fileInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            dom.fileBox.classList.add('success');
            dom.fileName.innerText = e.target.files[0].name;
        } else {
            dom.fileBox.classList.remove('success');
            dom.fileName.innerText = "";
        }
    });

    // --- INIZIALIZZA SPONSOR ---
    if(window.SponsorManager) {
        // Pre-carica uno sponsor ma non inietta finché non appare il loader
        console.log("Sponsor Engine Ready");
    }
}

// RESET FORM
window.resetForm = function() {
    dom.reviewPhase.classList.add('hidden');
    dom.inputPhase.classList.remove('hidden');
    dom.fileInput.value = ''; 
    dom.fileBox.classList.remove('success');
    dom.fileName.innerText = "";
    generatedCategoryData = null;
}

async function handleGenerate() {
    const name = dom.catName.value.trim();
    if (!name) return tg.showAlert(t.err_name_req);

    // Mostra Loader con Sponsor
    showLoader(t.status_analyzing);

    const payload = {
        category_name: name,
        category_description: dom.catDesc.value,
        token: urlParams.get('token'),
        language: lang
    };

    if (dom.fileInput.files.length > 0) {
        try {
            const fileData = await readFile(dom.fileInput.files[0]);
            payload.file_data = fileData.base64;
            payload.mime_type = fileData.mime;
        } catch (e) {
            console.error("File read error", e);
        }
    }

    try {
        const res = await fetch(GENERATE_WEBHOOK_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const jsonResponse = await res.json();
        const data = Array.isArray(jsonResponse) ? jsonResponse[0] : jsonResponse;
        
        handleAnalysisResult(data);

    } catch (e) {
        handleError(e);
    }
}

function handleAnalysisResult(data) {
    generatedCategoryData = data;
    if(data.name) dom.catName.value = data.name;
    if(data.description) dom.catDesc.value = data.description;
    
    dom.subcatList.innerHTML = '';
    if (data.subcategories) {
        data.subcategories.forEach(sub => createListItem(sub.name, sub.short_name));
    }
    
    dom.inputPhase.classList.add('hidden');
    dom.reviewPhase.classList.remove('hidden');
    
    hideLoader();
}

function createListItem(name, display) {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.innerHTML = `
        <div class="checkbox-group" style="margin-bottom:0; width:100%;">
            <input type="checkbox" checked value="${name}" data-short="${display}" id="chk_${name.replace(/[^a-zA-Z0-9]/g, '_')}">
            <label for="chk_${name.replace(/[^a-zA-Z0-9]/g, '_')}">${display}</label>
        </div>`;
    dom.subcatList.appendChild(li);
}

function addManualSubcat() {
    const val = dom.manualInput.value.trim();
    if (val) { createListItem(val, val); dom.manualInput.value = ''; }
}

function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
            base64: reader.result.split(',')[1],
            mime: reader.result.match(/:(.*?);/)[1]
        });
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function saveCategory() {
    if (!dom.catName.value) return tg.showAlert(t.err_name_req);
    showLoader(t.status_saving); // Qui lo sponsor gira di nuovo se serve
    
    const selected = [];
    dom.subcatList.querySelectorAll('input:checked').forEach(cb => {
        selected.push({
            name: cb.value, 
            short_name: cb.dataset.short,
            callback_data: cb.value.toUpperCase().replace(/[^A-Z0-9\s]/g, '').replace(/\s/g, '_').substring(0, 60)
        });
    });

    const payload = {
        token: urlParams.get('token'),
        new_category_block: {
            name: dom.catName.value, 
            description: dom.catDesc.value,
            short_name: generatedCategoryData?.short_name || dom.catName.value,
            callback_data: generatedCategoryData?.callback_data || dom.catName.value.toUpperCase().replace(/[^A-Z0-9\s]/g, '').replace(/\s/g, '_').substring(0, 60),
            subcategories: selected
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
    } catch (e) {
        handleError(e);
    }
}

// UI UTILS AGGIORNATI PER SPONSOR
function showLoader(text) {
    dom.loaderText.innerText = text;
    // Rimuove 'hidden' e usa flex per centrare
    dom.loader.classList.remove('hidden');
    dom.loader.style.display = 'flex';
    
    // INIETTA LO SPONSOR QUANDO IL LOADER APPARE
    if(window.SponsorManager) {
        window.SponsorManager.inject('#loader-ad-slot', 'loader');
    }
}

function hideLoader() {
    dom.loader.classList.add('hidden');
    dom.loader.style.display = 'none'; // Nasconde davvero
}

function handleError(error) {
    console.error(error);
    hideLoader();
    tg.showAlert(t.err_generic);
}

document.addEventListener('DOMContentLoaded', init);
