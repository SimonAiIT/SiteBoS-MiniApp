/**
 * EDIT PRODUCT LOGIC (vFINAL - FULL)
 */
'use strict';

// 1. CONFIG & INIT
const WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/2c6416b1-32c6-4661-bd8f-b175d24fd035";

const tg = window.Telegram.WebApp;
try { tg.ready(); tg.expand(); } catch (e) { console.warn("TG WebApp not found"); }

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId');
const token = urlParams.get('token');
const vat = urlParams.get('vat');
const langParam = urlParams.get('lang') || 'it';

let currentData = null;
let initialDataString = "";
let isDirty = false;
let skillTags = [];
let keywords = [];

// 2. I18N (FULL 6 LANGUAGES)
const i18n = {
    it: { page_title: "Modifica Prodotto", title: "✏️ Modifica Prodotto", subtitle: "Gestione dettagli e prezzi", loading: "Caricamento...", saving: "Salvataggio...", saved: "✅ Salvato!", error: "❌ Errore", secIdentity: "📋 Identità", secPricing: "💰 Pricing", secOps: "⚙️ Operatività", lblName: "Nome Prodotto/Servizio", lblType: "Tipo", lblShort: "Descrizione Breve (max 100)", lblLong: "Descrizione Completa", lblInternal: "Note Interne (Staff)", lblPrice: "Prezzo Base", lblCurrency: "Valuta", lblUnit: "Unità", lblTax: "IVA (%)", chkBooking: "Richiede Prenotazione", chkInventory: "Controllo Inventario", lblSkills: "Skill Richieste (Invio per aggiungere)", lblKeywords: "Keywords (SEO, Invio per aggiungere)", btnSave: "💾 Salva Modifiche", hintCancel: "Chiudi la finestra per annullare", optService: "Servizio", optProduct: "Prodotto", optItem: "Pezzo", optHour: "Ora", optDay: "Giorno", optProject: "Progetto", optMonth: "Mese", phSkill: "Es: Senior, Junior...", phKw: "Es: consulenza, setup..." },
    en: { page_title: "Edit Product", title: "✏️ Edit Product", subtitle: "Manage details and pricing", loading: "Loading...", saving: "Saving...", saved: "✅ Saved!", error: "❌ Error", secIdentity: "📋 Identity", secPricing: "💰 Pricing", secOps: "⚙️ Operations", lblName: "Product/Service Name", lblType: "Type", lblShort: "Short Description (max 100)", lblLong: "Full Description", lblInternal: "Internal Notes (Staff)", lblPrice: "Base Price", lblCurrency: "Currency", lblUnit: "Unit", lblTax: "Tax (%)", chkBooking: "Requires Booking", chkInventory: "Inventory Check", lblSkills: "Required Skills (Enter to add)", lblKeywords: "Keywords (SEO, Enter to add)", btnSave: "💾 Save Changes", hintCancel: "Close the window to cancel", optService: "Service", optProduct: "Product", optItem: "Item", optHour: "Hour", optDay: "Day", optProject: "Project", optMonth: "Month", phSkill: "E.g.: Senior, Junior...", phKw: "E.g.: consulting, setup..." },
    fr: { page_title: "Modifier Produit", title: "✏️ Modifier Produit", subtitle: "Gestion des détails et des prix", loading: "Chargement...", saving: "Enregistrement...", saved: "✅ Enregistré!", error: "❌ Erreur", secIdentity: "📋 Identité", secPricing: "💰 Tarifs", secOps: "⚙️ Opérations", lblName: "Nom du Produit/Service", lblType: "Type", lblShort: "Description Courte (max 100)", lblLong: "Description Complète", lblInternal: "Notes Internes (Équipe)", lblPrice: "Prix de Base", lblCurrency: "Devise", lblUnit: "Unité", lblTax: "TVA (%)", chkBooking: "Réservation Requise", chkInventory: "Vérif. Inventaire", lblSkills: "Compétences Requises (Entrée pour ajouter)", lblKeywords: "Mots-clés (SEO, Entrée pour ajouter)", btnSave: "💾 Enregistrer", hintCancel: "Fermez la fenêtre pour annuler", optService: "Service", optProduct: "Produit", optItem: "Pièce", optHour: "Heure", optDay: "Jour", optProject: "Projet", optMonth: "Mois", phSkill: "Ex: Senior, Junior...", phKw: "Ex: conseil, configuration..." },
    de: { page_title: "Produkt Bearbeiten", title: "✏️ Produkt Bearbeiten", subtitle: "Details und Preise verwalten", loading: "Laden...", saving: "Speichern...", saved: "✅ Gespeichert!", error: "❌ Fehler", secIdentity: "📋 Identität", secPricing: "💰 Preisgestaltung", secOps: "⚙️ Betrieb", lblName: "Produkt-/Dienstname", lblType: "Typ", lblShort: "Kurzbeschreibung (max 100)", lblLong: "Vollständige Beschreibung", lblInternal: "Interne Notizen (Team)", lblPrice: "Grundpreis", lblCurrency: "Währung", lblUnit: "Einheit", lblTax: "MwSt (%)", chkBooking: "Buchung Erforderlich", chkInventory: "Inventarprüfung", lblSkills: "Benötigte Fähigkeiten (Eingabe zum Hinzufügen)", lblKeywords: "Keywords (SEO, Eingabe zum Hinzufügen)", btnSave: "💾 Änderungen Speichern", hintCancel: "Fenster zum Abbrechen schließen", optService: "Dienstleistung", optProduct: "Produkt", optItem: "Stück", optHour: "Stunde", optDay: "Tag", optProject: "Projekt", optMonth: "Monat", phSkill: "Z.B.: Senior, Junior...", phKw: "Z.B.: Beratung, Setup..." },
    es: { page_title: "Editar Producto", title: "✏️ Editar Producto", subtitle: "Gestionar detalles y precios", loading: "Cargando...", saving: "Guardando...", saved: "✅ ¡Guardado!", error: "❌ Error", secIdentity: "📋 Identidad", secPricing: "💰 Precios", secOps: "⚙️ Operaciones", lblName: "Nombre del Producto/Servicio", lblType: "Tipo", lblShort: "Descripción Corta (máx 100)", lblLong: "Descripción Completa", lblInternal: "Notas Internas (Equipo)", lblPrice: "Precio Base", lblCurrency: "Moneda", lblUnit: "Unidad", lblTax: "IVA (%)", chkBooking: "Requiere Reserva", chkInventory: "Control de Inventario", lblSkills: "Habilidades Requeridas (Enter para añadir)", lblKeywords: "Palabras Clave (SEO, Enter para añadir)", btnSave: "💾 Guardar Cambios", hintCancel: "Cierra la ventana para cancelar", optService: "Servicio", optProduct: "Producto", optItem: "Pieza", optHour: "Hora", optDay: "Día", optProject: "Proyecto", optMonth: "Mes", phSkill: "Ej: Senior, Junior...", phKw: "Ej: consultoría, configuración..." },
    pt: { page_title: "Editar Produto", title: "✏️ Editar Produto", subtitle: "Gerenciar detalhes e preços", loading: "Carregando...", saving: "Salvando...", saved: "✅ Salvo!", error: "❌ Erro", secIdentity: "📋 Identidade", secPricing: "💰 Preços", secOps: "⚙️ Operações", lblName: "Nome do Produto/Serviço", lblType: "Tipo", lblShort: "Descrição Curta (máx 100)", lblLong: "Descrição Completa", lblInternal: "Notas Internas (Equipe)", lblPrice: "Preço Base", lblCurrency: "Moeda", lblUnit: "Unidade", lblTax: "Imposto (%)", chkBooking: "Requer Agendamento", chkInventory: "Verificação de Estoque", lblSkills: "Habilidades Necessárias (Enter para adicionar)", lblKeywords: "Palavras-chave (SEO, Enter para adicionar)", btnSave: "💾 Salvar Alterações", hintCancel: "Feche a janela para cancelar", optService: "Serviço", optProduct: "Produto", optItem: "Item", optHour: "Hora", optDay: "Dia", optProject: "Projeto", optMonth: "Mês", phSkill: "Ex: Senior, Junior...", phKw: "Ex: consultoria, configuração..." }
};
const t = i18n[langParam.slice(0,2)] || i18n.it;

// 3. DOM CACHE
const dom = {
    loader: document.getElementById('loader'),
    loaderText: document.getElementById('loaderText'),
    content: document.getElementById('app-content'),
    form: document.getElementById('productForm'),
    skillInput: document.getElementById('skillTagInput'),
    skillContainer: document.getElementById('skillTagsContainer'),
    keywordInput: document.getElementById('keywordInput'),
    keywordContainer: document.getElementById('keywordsContainer'),
    saveBtn: document.getElementById('saveBtn')
};

// 4. FUNZIONI PRINCIPALI
function init() {
    applyTranslations();
    if (!productId || !token || !vat) {
        dom.loaderText.textContent = "Error: Missing VAT/Token/ID";
        return;
    }
    loadProduct();
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerText = t[key];
    });
    document.title = t.page_title;
    dom.skillInput.placeholder = t.phSkill;
    dom.keywordInput.placeholder = t.phKw;
}

async function loadProduct() {
    showLoader(t.loading);
    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                body: { 
                    action: 'GET', 
                    type: 'PRODUCT', 
                    productId: productId, 
                    token: token, 
                    vat: vat 
                }
            })
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const rawData = await res.json();
        const firstItem = Array.isArray(rawData) ? rawData[0] : rawData;
        
        // ESTRAZIONE CORRETTA: I dati sono dentro 'catalog_item'
        const productData = firstItem.catalog_item; 

        if (!productData || !productData.identity) {
            throw new Error("Dati prodotto non trovati (Missing catalog_item).");
        }
        
        currentData = productData;
        
        // Fotografia stato iniziale per dirty checking
        initialDataString = JSON.stringify(collectDataFromForm()); 
        
        populateForm(productData);

        setupTagInput(dom.skillInput, dom.skillContainer, skillTags);
        setupTagInput(dom.keywordInput, dom.keywordContainer, keywords);
        
        dom.form.addEventListener('input', checkDirty);
        dom.form.addEventListener('submit', handleSave);

        hideLoader();
    } catch (e) {
        handleError(e);
    }
}

function populateForm(data) {
    const val = (id, v) => { const el = document.getElementById(id); if (el) el.value = v != null ? v : ''; };
    const chk = (id, v) => { const el = document.getElementById(id); if (el) el.checked = !!v; };

    const identity = data.identity || {};
    const pricing = data.pricing || {};
    const desc = identity.description || {};
    const operations = data.operations || {};
    const provider = operations.provider_info || {};
    const tax = pricing.tax_info || {};

    val('itemName', identity.item_name);
    val('itemSku', identity.item_sku);
    val('itemType', identity.item_type);
    val('descShort', desc.short);
    val('descLong', desc.long);
    val('internalNotes', desc.internal_notes);
    val('basePrice', pricing.base_price);
    val('currency', pricing.currency);
    val('unitOfMeasure', pricing.unit_of_measure);
    val('taxRate', tax.tax_rate_percentage);
    
    chk('requiresBooking', operations.requires_booking);
    chk('requiresInventory', operations.requires_inventory_check);

    skillTags = Array.isArray(provider.required_skill_tags) ? provider.required_skill_tags : [];
    keywords = Array.isArray(identity.keywords) ? identity.keywords : [];
    
    renderTags(dom.skillContainer, skillTags);
    renderTags(dom.keywordContainer, keywords);

    document.getElementById('pageTitle').textContent = `✏️ ${identity.item_name || 'Prodotto'}`;
}

async function handleSave(e) {
    e.preventDefault();
    if (!isDirty) return;

    setButtonLoading(dom.saveBtn, true, t.saving);

    // Update currentData structure
    if(!currentData.identity) currentData.identity = {};
    if(!currentData.identity.description) currentData.identity.description = {};
    if(!currentData.pricing) currentData.pricing = {};
    if(!currentData.pricing.tax_info) currentData.pricing.tax_info = {};
    if(!currentData.operations) currentData.operations = {};
    if(!currentData.operations.provider_info) currentData.operations.provider_info = {};

    const get = (id) => document.getElementById(id).value;
    const getChk = (id) => document.getElementById(id).checked;

    currentData.identity.item_name = get('itemName');
    currentData.identity.item_type = get('itemType');
    currentData.identity.description.short = get('descShort');
    currentData.identity.description.long = get('descLong');
    currentData.identity.description.internal_notes = get('internalNotes');
    currentData.identity.keywords = keywords;

    currentData.pricing.base_price = parseFloat(get('basePrice')) || 0;
    currentData.pricing.currency = get('currency');
    currentData.pricing.unit_of_measure = get('unitOfMeasure');
    currentData.pricing.tax_info.tax_rate_percentage = parseInt(get('taxRate')) || 22;

    currentData.operations.requires_booking = getChk('requiresBooking');
    currentData.operations.requires_inventory_check = getChk('requiresInventory');
    currentData.operations.provider_info.required_skill_tags = skillTags;

    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                body: {
                    action: 'SAVE', 
                    type: 'PRODUCT', 
                    productId: productId, 
                    token: token, 
                    vat: vat, 
                    payload: currentData
                }
            })
        });
        
        if (!res.ok) throw new Error("Save failed");
        
        setButtonLoading(dom.saveBtn, false, t.saved, true);
        try { tg.HapticFeedback.notificationOccurred('success'); } catch (e) {}
        setTimeout(() => { try { tg.close(); } catch (e) { goBackToCatalog(); } }, 1500);

    } catch (e) {
        handleError(e);
        setButtonLoading(dom.saveBtn, false, t.btnSave);
    }
}

// 5. HELPER UTILITIES
function collectDataFromForm() {
    return {
        itemName: document.getElementById('itemName').value,
        descShort: document.getElementById('descShort').value,
        basePrice: document.getElementById('basePrice').value,
        tags: skillTags.join(',') + keywords.join(',')
    };
}

function checkDirty() {
    // Semplice check: se i dati sono caricati, abilitiamo il salvataggio al primo input
    if (currentData) {
        isDirty = true;
        dom.saveBtn.disabled = false;
    }
}

function setupTagInput(input, container, tags) {
    const onRemove = (idx) => {
        tags.splice(idx, 1);
        renderTags(container, tags);
        checkDirty();
    };
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = input.value.trim();
            if (val && !tags.includes(val)) {
                tags.push(val);
                input.value = '';
                renderTags(container, tags);
                checkDirty();
            }
        } else if (e.key === 'Backspace' && input.value === '' && tags.length > 0) {
            tags.pop();
            renderTags(container, tags);
            checkDirty();
        }
    });
    renderTags(container, tags);
}

function renderTags(container, tags) {
    const input = container.querySelector('input');
    container.querySelectorAll('.tag').forEach(el => el.remove());
    tags.forEach((tag, idx) => {
        const tagEl = document.createElement('div');
        tagEl.className = 'tag';
        tagEl.innerHTML = `${tag} <span class="tag-remove" data-idx="${idx}">×</span>`;
        tagEl.querySelector('.tag-remove').onclick = () => {
            tags.splice(idx, 1);
            renderTags(container, tags);
            checkDirty();
        };
        container.insertBefore(tagEl, input);
    });
}

function showLoader(text) { dom.loaderText.textContent = text; dom.loader.classList.remove('hidden'); dom.content.classList.add('hidden'); }
function hideLoader() { dom.loader.classList.remove('hidden'); dom.content.classList.add('hidden'); }
function handleError(e) { console.error(e); dom.loaderText.textContent = t.error + ": " + e.message; }
function setButtonLoading(btn, isLoading, text, isSuccess = false) {
    btn.disabled = isLoading;
    btn.innerHTML = isLoading ? `<i class="fas fa-circle-notch fa-spin"></i> ${text}` : text;
    if(isSuccess) { btn.classList.remove('btn-primary'); btn.classList.add('btn-success'); }
}
window.goBackToCatalog = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('productId');
    window.location.href = `catalog.html?${params.toString()}`;
};

// 6. START
init();
