/**
 * ADD PRODUCT LOGIC (v4.0 - GHOST MODE & SPONSORS)
 * - Supporto Ghost ID: Auto-trigger dell'enrichment se ghostId è presente.
 * - Sponsor Loader: Ads durante l'attesa AI.
 * - Gestione File Base64.
 * - 6 Lingue.
 */

'use strict';

// CONFIG
const ENRICH_URL = "https://trinai.api.workflow.dcmake.it/webhook/31f89350-4d7f-44b7-9aaf-e7d9e3655b6c";
const SAVE_URL = "https://trinai.api.workflow.dcmake.it/webhook/20fd95c0-4218-400e-ae2a-cd881a757b80"; 

const tg = window.Telegram.WebApp; 
tg.ready(); tg.expand();

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const catId = urlParams.get('catId');
const ghostId = urlParams.get('ghostId'); // ID GHOST (Opzionale)

// STATE
let draftData = null;
let fileData = null;

// I18N
const i18n = {
    it: {
        page_title: "Nuovo Prodotto", title: "Nuovo Prodotto", sub: "Categoria:", 
        lName: "Nome Richiesta", lDesc: "Istruzioni Base", lFile: "Allegato", lFileBtn: "Carica Foto/PDF",
        btnEnrich: "Genera Bozza AI", btnSave: "Salva Definitivo",
        secId: "Identità Prodotto", secPrice: "Prezzi & Operazioni", secMark: "Marketing & Target",
        outName: "Nome Ufficiale", outSku: "SKU", outType: "Tipo",
        outShort: "Descrizione Breve (x UI)", outLong: "Descrizione Estesa", outInt: "Note Interne (Staff)",
        outPrice: "Prezzo (€)", outUnit: "Unità (es. ora)", outDyn: "Prezzo Dinamico?", outBook: "Richiede Prenotazione?",
        outTags: "Tags (SEO)", outTarget: "Target Audience",
        dup: "⚠️ Possibile Duplicato!",
        status_ai: "L'AI sta analizzando...", status_saving: "Salvataggio...", 
        err_name: "Nome obbligatorio!", ok_saved: "Prodotto Salvato!"
    },
    en: {
        page_title: "New Product", title: "New Product", sub: "Category:", 
        lName: "Request Name", lDesc: "Instructions", lFile: "Attachment", lFileBtn: "Upload Photo/PDF",
        btnEnrich: "Generate AI Draft", btnSave: "Save Final",
        secId: "Identity", secPrice: "Pricing & Ops", secMark: "Marketing & Target",
        outName: "Official Name", outSku: "SKU", outType: "Type",
        outShort: "Short Desc (UI)", outLong: "Full Description", outInt: "Internal Notes",
        outPrice: "Price (€)", outUnit: "Unit (e.g. hour)", outDyn: "Dynamic Price?", outBook: "Needs Booking?",
        outTags: "Tags (SEO)", outTarget: "Target Audience",
        dup: "⚠️ Possible Duplicate!",
        status_ai: "AI Analyzing...", status_saving: "Saving...", 
        err_name: "Name required!", ok_saved: "Product Saved!"
    },
    // ... Altre lingue (fr, de, es, pt) rimangono uguali ...
    fr: { page_title: "Nouveau Produit", title: "Nouveau Produit", sub: "Catégorie:", lName: "Nom", lDesc: "Instructions", lFile: "Pièce Jointe", lFileBtn: "Charger", btnEnrich: "Générer Ébauche", btnSave: "Enregistrer", secId: "Identité", secPrice: "Prix", secMark: "Marketing", outName: "Nom Officiel", outSku: "SKU", outType: "Type", outShort: "Desc. Courte", outLong: "Desc. Complète", outInt: "Notes Internes", outPrice: "Prix", outUnit: "Unité", outDyn: "Prix Dynamique?", outBook: "Réservation?", outTags: "Tags", outTarget: "Cible", dup: "⚠️ Doublon Possible!", status_ai: "Analyse IA...", status_saving: "Enregistrement...", err_name: "Nom requis !", ok_saved: "Enregistré !" },
    de: { page_title: "Neues Produkt", title: "Neues Produkt", sub: "Kategorie:", lName: "Name", lDesc: "Anweisungen", lFile: "Anhang", lFileBtn: "Laden", btnEnrich: "Entwurf", btnSave: "Speichern", secId: "Identität", secPrice: "Preise", secMark: "Marketing", outName: "Name", outSku: "SKU", outType: "Typ", outShort: "Kurz", outLong: "Lang", outInt: "Interne Notizen", outPrice: "Preis", outUnit: "Einheit", outDyn: "Dynamisch?", outBook: "Buchung?", outTags: "Tags", outTarget: "Zielgruppe", dup: "⚠️ Duplikat!", status_ai: "KI Analysiert...", status_saving: "Speichern...", err_name: "Name erforderlich!", ok_saved: "Gespeichert!" },
    es: { page_title: "Nuevo Producto", title: "Nuevo Producto", sub: "Categoría:", lName: "Nombre", lDesc: "Instrucciones", lFile: "Adjunto", lFileBtn: "Cargar", btnEnrich: "Borrador", btnSave: "Guardar", secId: "Identidad", secPrice: "Precios", secMark: "Marketing", outName: "Nombre", outSku: "SKU", outType: "Tipo", outShort: "Desc. Corta", outLong: "Desc. Larga", outInt: "Notas Internas", outPrice: "Precio", outUnit: "Unidad", outDyn: "Dinámico?", outBook: "Reserva?", outTags: "Tags", outTarget: "Audiencia", dup: "⚠️ Duplicado!", status_ai: "IA Analizando...", status_saving: "Guardando...", err_name: "Nombre obligatorio!", ok_saved: "¡Guardado!" },
    pt: { page_title: "Novo Produto", title: "Novo Produto", sub: "Categoria:", lName: "Nome", lDesc: "Instruções", lFile: "Anexo", lFileBtn: "Carregar", btnEnrich: "Rascunho", btnSave: "Salvar", secId: "Identidade", secPrice: "Preços", secMark: "Marketing", outName: "Nome", outSku: "SKU", outType: "Tipo", outShort: "Curta", outLong: "Longa", outInt: "Notas Internas", outPrice: "Preço", outUnit: "Unidade", outDyn: "Dinâmico?", outBook: "Reserva?", outTags: "Tags", outTarget: "Público-alvo", dup: "⚠️ Duplicado!", status_ai: "IA Analisando...", status_saving: "Salvando...", err_name: "Nome obrigatório!", ok_saved: "Salvo!" }
};

const lang = (urlParams.get('lang') || tg.initDataUnsafe?.user?.language_code || 'it').slice(0, 2);
const t = i18n[lang] || i18n.it;

// DOM
const dom = {
    loader: document.getElementById('loader'),
    loaderText: document.getElementById('loader-text'),
    inputSection: document.getElementById('inputSection'),
    editForm: document.getElementById('editForm'),
    fileInput: document.getElementById('inFile'),
    fileBox: document.getElementById('uploadBox'),
    filePreview: document.getElementById('filePreview'),
    fileBtnText: document.getElementById('lblFileBtn'),
    dupBanner: document.getElementById('duplicateBanner')
};

// INIT
function init() {
    applyTranslations();
    bindEvents();
    
    // --- GHOST MODE AUTO-START ---
    if (ghostId) {
        // Se c'è ghostId, nascondi l'input manuale e triggera subito l'enrichment
        dom.inputSection.classList.add('hidden');
        handleEnrichment(null, ghostId);
    }
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(t[key]) el.innerText = t[key];
    });
    document.title = t.page_title;
    // (Opzionale) Recuperare nome categoria se disponibile in URL o chiamare API
    document.getElementById('displayCatName').innerText = catId || "..."; 
}

function bindEvents() {
    document.getElementById('btnEnrich').addEventListener('click', () => handleEnrichment());
    document.getElementById('editForm').addEventListener('submit', handleSave);
    
    dom.fileInput.addEventListener('change', (e) => {
        const f = e.target.files[0];
        if(!f) return;
        const r = new FileReader();
        r.onload = (ev) => {
            fileData = { base64_content: ev.target.result.split(',')[1], mime_type: f.type };
            dom.fileBox.classList.add('enabled');
            if (f.type.startsWith('image/')) {
                dom.filePreview.innerHTML = `<img src="${ev.target.result}" style="max-height:100px; border-radius:8px;">`;
            } else {
                dom.filePreview.innerHTML = `<div class="tag"><i class="fas fa-file"></i> ${f.name}</div>`;
            }
            dom.fileBtnText.innerText = f.name;
        };
        r.readAsDataURL(f);
    });
}

window.resetForm = () => {
    dom.editForm.classList.add('hidden');
    dom.inputSection.classList.remove('hidden');
    draftData = null;
    fileData = null;
    dom.fileInput.value = '';
    dom.fileBox.classList.remove('enabled');
    dom.filePreview.innerHTML = '';
    dom.fileBtnText.innerText = t.lFileBtn;
};

// --- ENRICHMENT LOGIC ---
async function handleEnrichment(e, ghostIdOverride = null) {
    if(!ghostIdOverride && !document.getElementById('inName').value) {
        return tg.showAlert(t.err_name);
    }

    showLoader(t.status_ai);

    // Costruiamo Payload
    // Se c'è ghostId, passiamo quello come 'product_id' o 'ghost_id'
    // Se no, passiamo input manuale
    const userRequest = {
        token: token,
        category_id: catId,
        language: lang,
        ghost_id: ghostIdOverride, // Fondamentale per attivazione
        product_name: ghostIdOverride ? null : document.getElementById('inName').value,
        product_description: ghostIdOverride ? null : document.getElementById('inDesc').value
    };

    const payload = {
        user_request: userRequest,
        attachment: fileData // Passa file se presente (solo modo manuale)
    };

    try {
        const res = await fetch(ENRICH_URL, {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const json = await res.json();
        const data = Array.isArray(json) ? json[0] : json;
        
        if(!data.identity) throw new Error("Invalid AI Response");

        populateForm(data);

    } catch(e) {
        console.error(e);
        tg.showAlert("Error: " + e.message);
        hideLoader();
        // Se ghost fallisce, torna all'input manuale
        if(ghostIdOverride) dom.inputSection.classList.remove('hidden');
    }
}

function populateForm(data) {
    draftData = data; // Salva stato

    const val = (id, v) => document.getElementById(id).value = v || '';
    const chk = (id, v) => document.getElementById(id).checked = !!v;

    val('outName', data.identity.item_name);
    val('outSku', data.identity.item_sku);
    val('outType', data.identity.item_type || 'SERVICE');
    val('outShortDesc', data.identity.description?.short);
    val('outLongDesc', data.identity.description?.long);
    val('outInternal', data.identity.description?.internal_notes);
    
    val('outPrice', data.pricing?.base_price);
    val('outUnit', data.pricing?.unit_of_measure);
    chk('outDynamicPrice', data.pricing?.pricing_rules_engine?.is_dynamic_price);
    chk('outBooking', data.operations?.requires_booking);
    
    val('outTags', (data.identity.tags || []).join(', '));
    val('outTarget', (data.relations?.marketing_info?.target_audience_tags || []).join(', '));

    if(data.is_duplicate) {
        dom.dupBanner.classList.remove('hidden');
    } else {
        dom.dupBanner.classList.add('hidden');
    }

    dom.inputSection.classList.add('hidden');
    dom.editForm.classList.remove('hidden');
    
    hideLoader();
    window.scrollTo(0,0);
}

// --- SAVE LOGIC ---
async function handleSave(e) {
    e.preventDefault();
    showLoader(t.status_saving);

    // Update Draft with User Edits
    const get = (id) => document.getElementById(id).value;
    const getChk = (id) => document.getElementById(id).checked;

    draftData.identity.item_name = get('outName');
    draftData.identity.item_sku = get('outSku');
    draftData.identity.item_type = get('outType');
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

    try {
        const res = await fetch(SAVE_URL, {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                token: token,
                category_id: catId,
                new_product_block: draftData
            })
        });

        if(res.ok) {
            hideLoader();
            if(tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
            tg.showPopup({ message: t.ok_saved, buttons: [{type: 'ok'}] }, () => {
                // Torna al catalogo
                window.location.href = `catalog.html?token=${token}`;
            });
        } else throw new Error();

    } catch(e) {
        console.error(e);
        tg.showAlert("Save Error");
        hideLoader();
    }
}

// UTILS
function showLoader(text) {
    document.getElementById('loader-text').innerText = text;
    dom.loader.classList.remove('hidden');
    dom.loader.style.display = 'flex';
    if(window.SponsorManager) window.SponsorManager.inject('#loader-ad-slot', 'loader');
}

function hideLoader() {
    dom.loader.classList.add('hidden');
    dom.loader.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', init);
