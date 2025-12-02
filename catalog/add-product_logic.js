/**
 * ADD PRODUCT LOGIC (v7.0 - BROWSER SAFE FINAL)
 * - Niente tg.showPopup/tg.showAlert -> Solo alert() nativi.
 * - Redirect sicuri.
 * - Payload piatto.
 * - 6 Lingue.
 */

'use strict';

// 1. CONFIGURAZIONE
const ENRICH_WEBHOOK = "https://trinai.api.workflow.dcmake.it/webhook/31f89350-4d7f-44b7-9aaf-e7d9e3655b6c";
const SAVE_WEBHOOK = "https://trinai.api.workflow.dcmake.it/webhook/20fd95c0-4218-400e-ae2a-cd881a757b80";

// Init Telegram (Solo per espansione view e aptico, non per UI critica)
const tg = window.Telegram.WebApp; 
try { tg.ready(); tg.expand(); } catch(e){}

// 2. PARAMETRI URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const catId = urlParams.get('catId');
const ghostId = urlParams.get('ghostId');
const langParam = urlParams.get('lang') || 'it';

// 3. STATO GLOBALE
let draftData = null;
let fileData = null;

// 4. TRADUZIONI (6 LINGUE)
const i18n = {
    it: { title: "Nuovo Prodotto", btnEnrich: "Genera Bozza AI", btnSave: "Salva Definitivo", status_ai: "Analisi AI in corso...", status_save: "Salvataggio...", err_name: "Nome mancante!", ok_saved: "Salvato!", err_generic: "Errore. Riprova." },
    en: { title: "New Product", btnEnrich: "Generate Draft", btnSave: "Save Final", status_ai: "AI Analyzing...", status_save: "Saving...", err_name: "Name missing!", ok_saved: "Saved!", err_generic: "Error. Retry." },
    fr: { title: "Nouveau Produit", btnEnrich: "Générer Ébauche", btnSave: "Enregistrer", status_ai: "Analyse IA...", status_save: "Enregistrement...", err_name: "Nom requis !", ok_saved: "Enregistré !", err_generic: "Erreur. Réessayer." },
    de: { title: "Neues Produkt", btnEnrich: "Entwurf Generieren", btnSave: "Speichern", status_ai: "KI Analysiert...", status_save: "Speichern...", err_name: "Name fehlt!", ok_saved: "Gespeichert!", err_generic: "Fehler. Wiederholen." },
    es: { title: "Nuevo Producto", btnEnrich: "Generar Borrador", btnSave: "Guardar", status_ai: "Analizando...", status_save: "Guardando...", err_name: "¡Nombre obligatorio!", ok_saved: "¡Guardado!", err_generic: "Error. Reintentar." },
    pt: { title: "Novo Produto", btnEnrich: "Gerar Rascunho", btnSave: "Salvar", status_ai: "Analisando...", status_save: "Salvando...", err_name: "Nome obrigatório!", ok_saved: "Salvo!", err_generic: "Erro. Tente novamente." }
};
const t = i18n[langParam.slice(0,2)] || i18n.it;

// 5. DOM CACHE
const dom = {
    loader: document.getElementById('loader'),
    loaderText: document.getElementById('loader-text'),
    inputSection: document.getElementById('inputSection'),
    editForm: document.getElementById('editForm'),
    fileInput: document.getElementById('inFile'),
    fileBox: document.getElementById('uploadBox'),
    fileBtnText: document.getElementById('lblFileBtn')
};

// 6. INIT
function init() {
    // Setup Testi
    document.title = t.title;
    document.querySelector('h1').innerText = t.title;
    document.getElementById('btnEnrich').innerHTML = `<i class="fas fa-magic"></i> ${t.btnEnrich}`;
    document.getElementById('displayCatName').innerText = catId || "...";

    // Eventi
    document.getElementById('btnEnrich').addEventListener('click', manualEnrich);
    document.getElementById('editForm').addEventListener('submit', handleSave);
    dom.fileInput.addEventListener('change', handleFileSelect);

    // GHOST MODE AUTO-START
    if (ghostId) {
        dom.inputSection.classList.add('hidden');
        callEnrichWebhook({ ghost_id: ghostId });
    }
}

// 7. FILE HANDLE
function handleFileSelect(e) {
    const f = e.target.files[0];
    if(!f) return;
    const r = new FileReader();
    r.onload = (ev) => {
        fileData = { 
            base64: ev.target.result.split(',')[1], 
            mime: f.type 
        };
        dom.fileBox.classList.add('enabled');
        dom.fileBtnText.innerText = f.name;
    };
    r.readAsDataURL(f);
}

// 8. TRIGGER MANUALE
function manualEnrich() {
    const name = document.getElementById('inName').value;
    if(!name) return alert(t.err_name);

    const payloadData = {
        product_name: name,
        product_description: document.getElementById('inDesc').value
    };

    if (fileData) {
        payloadData.file_data = fileData.base64;
        payloadData.mime_type = fileData.mime;
    }

    callEnrichWebhook(payloadData);
}

// 9. WEBHOOK CALL
async function callEnrichWebhook(customData) {
    showLoader(t.status_ai);

    const payload = {
        token: token,
        category_id: catId,
        language: langParam,
        ...customData
    };

    try {
        const res = await fetch(ENRICH_WEBHOOK, {
            method: 'POST', 
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const json = await res.json();
        const data = Array.isArray(json) ? json[0] : json;

        if (!data) throw new Error("Empty Data");

        populateForm(data);

    } catch(e) {
        console.error(e);
        alert(t.err_generic + "\n" + e.message);
        hideLoader();
        if (customData.ghost_id) dom.inputSection.classList.remove('hidden');
    }
}

// 10. POPULATE UI
function populateForm(data) {
    draftData = data;

    const val = (id, v) => { 
        const el = document.getElementById(id);
        if(el) el.value = v || ''; 
    };
    const chk = (id, v) => {
        const el = document.getElementById(id);
        if(el) el.checked = !!v;
    };

    // Mapping Sicuro
    const identity = data.identity || {};
    const pricing = data.pricing || {};
    const desc = identity.description || {};
    const ops = data.operations || {};
    const mkt = data.relations?.marketing_info || {};

    val('outName', identity.item_name);
    val('outSku', identity.item_sku);
    val('outType', identity.item_type || 'SERVICE');
    val('outShortDesc', desc.short);
    val('outLongDesc', desc.long);
    val('outInternal', desc.internal_notes);
    val('outPrice', pricing.base_price);
    val('outUnit', pricing.unit_of_measure);
    chk('outDynamicPrice', pricing.pricing_rules_engine?.is_dynamic_price);
    chk('outBooking', ops.requires_booking);
    val('outTags', (identity.tags || []).join(', '));
    val('outTarget', (mkt.target_audience_tags || []).join(', '));

    const dupBanner = document.getElementById('duplicateBanner');
    if (data.is_duplicate) dupBanner.classList.remove('hidden');
    else dupBanner.classList.add('hidden');

    dom.inputSection.classList.add('hidden');
    dom.editForm.classList.remove('hidden');
    hideLoader();
    window.scrollTo(0,0);
}

// --- SALVATAGGIO VIA PROCESSOR (CAPSULA) ---
async function handleSave(e) {
    e.preventDefault();
    
    // 1. Raccogli i dati dal form (LOGICA INVARIATA)
    const get = (id) => document.getElementById(id).value;
    const getChk = (id) => document.getElementById(id).checked;

    // Aggiornamento oggetto draftData (Identico a prima)
    if(!draftData.identity) draftData.identity = {};
    draftData.identity.item_name = get('outName');
    draftData.identity.item_sku = get('outSku');
    draftData.identity.item_type = get('outType');
    
    if(!draftData.identity.description) draftData.identity.description = {};
    draftData.identity.description.short = get('outShortDesc');
    draftData.identity.description.long = get('outLongDesc');
    draftData.identity.description.internal_notes = get('outInternal');

    if(!draftData.pricing) draftData.pricing = {};
    draftData.pricing.base_price = parseFloat(get('outPrice')) || 0;
    draftData.pricing.unit_of_measure = get('outUnit');
    
    if(!draftData.pricing.pricing_rules_engine) draftData.pricing.pricing_rules_engine = {};
    draftData.pricing.pricing_rules_engine.is_dynamic_price = getChk('outDynamicPrice');

    if(!draftData.operations) draftData.operations = {};
    draftData.operations.requires_booking = getChk('outBooking');

    draftData.identity.tags = get('outTags').split(',').map(s=>s.trim()).filter(Boolean);
    
    if(!draftData.relations) draftData.relations = {};
    if(!draftData.relations.marketing_info) draftData.relations.marketing_info = {};
    draftData.relations.marketing_info.target_audience_tags = get('outTarget').split(',').map(s=>s.trim()).filter(Boolean);

    // 2. COSTRUZIONE PAYLOAD ESATTO PER N8N
    // Questo oggetto corrisponde esattamente al "body" del tuo esempio
    const n8nPayload = {
        token: token,
        category_id: catId,
        new_product_block: draftData
    };

    // 3. HANDOVER AL PROCESSOR
    // Usiamo il token come chiave univoca temporanea
    const sessionKey = `pending_payload_${token}`;
    
    try {
        sessionStorage.setItem(sessionKey, JSON.stringify(n8nPayload));
        
        // Definiamo dove tornare dopo il salvataggio (Catalogo)
        const returnUrl = encodeURIComponent(`catalog/catalog.html?token=${token}`);
        
        // REDIRECT: Scendiamo di un livello (../) verso la root dove sta processor.html
        // call=save_product -> Istruisce il processor su quale webhook chiamare
        window.location.href = `../processor.html?call=save_product&owner_key=${token}&return_url=${returnUrl}`;
        
    } catch (err) {
        alert("Errore Browser: Memoria piena o accesso negato.");
    }
}

// 12. UTILS
function showLoader(text) {
    dom.loaderText.innerText = text;
    dom.loader.classList.remove('hidden');
    dom.loader.style.display = 'flex';
    if(window.SponsorManager) window.SponsorManager.inject('#loader-ad-slot', 'loader');
}

function hideLoader() {
    dom.loader.classList.add('hidden');
    dom.loader.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', init);
