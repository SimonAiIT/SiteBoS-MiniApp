/**
 * EDIT PRODUCT LOGIC (vFINAL - FULL + PROVIDERS)
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

// 3. DOM
const dom = {
    loader: document.getElementById('loader'),
    loaderText: document.getElementById('loaderText'),
    content: document.getElementById('app-content'),
    form: document.getElementById('productForm'),
    skillInput: document.getElementById('skillTagInput'),
    skillContainer: document.getElementById('skillTagsContainer'),
    keywordInput: document.getElementById('keywordInput'),
    keywordContainer: document.getElementById('keywordsContainer'),
    saveBtn: document.getElementById('saveBtn'),
    skillsDisplay: document.getElementById('skills-display'),
    providersDisplay: document.getElementById('providers-display')
};

// 4. MAIN
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
            body: JSON.stringify({ // BODY PIATTO
                action: 'GET', 
                type: 'PRODUCT', 
                productId: productId, 
                token: token, 
                vat: vat 
            })
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        // --- PARSING ROBUSTO (DAL VECCHIO CODICE) ---
        const text = await res.text();
        let rawData;
        try { 
            rawData = JSON.parse(text); 
        } catch (e) { 
            // Fallback per JSON "sporchi" (escaped string)
            rawData = JSON.parse(text.replace(/^"|"$/g, '').replace(/\\"/g, '"')); 
        }
        // ---------------------------------------------

        const firstItem = Array.isArray(rawData) ? rawData[0] : rawData;
        const productData = firstItem.catalog_item || firstItem; // Fallback

        if (!productData || !productData.identity) {
            console.error("Dati ricevuti:", firstItem);
            throw new Error("Dati mancanti o struttura errata.");
        }
        
        currentData = productData;
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

function populateForm(inputData) {
    try {
        // Normalizzazione interna (ridondante ma sicura)
        const data = inputData.catalog_item || inputData;

        const val = (id, v) => { 
            const el = document.getElementById(id); 
            if (el) el.value = (v !== undefined && v !== null) ? v : ''; 
        };
        const chk = (id, v) => { 
            const el = document.getElementById(id); 
            if (el) el.checked = !!v; 
        };

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
        
        if (dom.skillContainer) renderTags(dom.skillContainer, skillTags);
        if (dom.keywordContainer) renderTags(dom.keywordContainer, keywords);

        const titleEl = document.getElementById('pageTitle');
        if(titleEl) titleEl.textContent = `✏️ ${identity.item_name || 'Prodotto'}`;

        // 🆕 RENDER PROVIDERS
        renderProviders(provider);

        hideLoader();

    } catch (e) {
        console.error("Populate Error:", e);
        alert("Errore UI: " + e.message);
        hideLoader();
    }
}

// 🆕 RENDER PROVIDER SECTION
function renderProviders(providerInfo) {
    // 1️⃣ Render Skills Display
    const skills = providerInfo.required_skill_tags || [];
    
    if (dom.skillsDisplay) {
        if (skills.length === 0) {
            dom.skillsDisplay.innerHTML = '<p style="color: #999; font-size: 13px;">Nessuna competenza specificata</p>';
        } else {
            dom.skillsDisplay.innerHTML = skills.map(skill => 
                `<span class="skill-badge">${skill}</span>`
            ).join('');
        }
    }
    
    // 2️⃣ Render Providers Cards
    const providers = providerInfo.specific_provider_ids || [];
    
    if (!dom.providersDisplay) return;
    
    if (providers.length === 0) {
        dom.providersDisplay.innerHTML = `
            <div class="provider-card empty">
                <div class="provider-avatar">🏢</div>
                <div class="provider-info">
                    <div class="provider-name">Nessun provider specifico</div>
                    <div class="provider-meta">Qualsiasi provider con le skill richieste</div>
                </div>
            </div>
        `;
        return;
    }
    
    // Supporta sia oggetti che stringhe
    dom.providersDisplay.innerHTML = providers.map(provider => {
        // Se è stringa semplice (ID only)
        if (typeof provider === 'string') {
            return `
                <div class="provider-card">
                    <div class="provider-avatar">👤</div>
                    <div class="provider-info">
                        <div class="provider-name">${provider}</div>
                        <div class="provider-meta">
                            <span class="provider-badge">ID: ${provider}</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Se è oggetto completo
        const typeClass = (provider.provider_type || '').toLowerCase();
        const icon = provider.provider_type === 'INTERNAL' ? '🏢' : 
                     provider.provider_type === 'EXTERNAL' ? '🤝' : '👤';
        
        return `
            <div class="provider-card ${typeClass}">
                <div class="provider-avatar">${icon}</div>
                <div class="provider-info">
                    <div class="provider-name">${provider.provider_name || provider.provider_id}</div>
                    <div class="provider-meta">
                        ${provider.provider_type ? `<span class="provider-badge">${provider.provider_type}</span>` : ''}
                        ${provider.role ? `<span>• ${provider.role}</span>` : ''}
                        ${provider.provider_id ? `<span style="opacity: 0.7; font-size: 10px;">ID: ${provider.provider_id}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
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
            body: JSON.stringify({ // NESSUN WRAPPER 'body' QUI
                action: 'SAVE', 
                type: 'PRODUCT', 
                productId: productId, 
                token: token, 
                vat: vat, 
                payload: currentData
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
    const currentFormState = JSON.stringify(collectDataFromForm());
    isDirty = currentFormState !== initialDataString;
    dom.saveBtn.disabled = !isDirty;
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
function hideLoader() { 
    dom.loader.classList.add('hidden');      // Nascondi il loader
    dom.content.classList.remove('hidden');   // Mostra il contenuto
}
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