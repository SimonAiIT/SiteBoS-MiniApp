/**
 * CATALOG LOGIC (vFINAL - FULL LANGS & ROBUST UI)
 * - 6 Lingue Complete (IT, EN, FR, DE, ES, PT).
 * - UI Fix: Onclick inline + Data Attributes (Niente stringhe rotte).
 * - UX Fix: Rotella nascosta dopo il salvataggio.
 * - Backend: One-Shot Update (nessuna doppia chiamata).
 * EDIT PRODUCT LOGIC (vFINAL - FULL)
 */
'use strict';

// ==========================================
// 1. CONFIG & INIT
// ==========================================
const CATALOG_WEBHOOK = "https://trinai.api.workflow.dcmake.it/webhook/0fff7fa2-bcb2-4b50-a26b-589b7054952e";
const WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/2c6416b1-32c6-4661-bd8f-b175d24fd035";

const tg = window.Telegram.WebApp;
tg.ready(); 
tg.expand();
try { tg.ready(); tg.expand(); } catch (e) { console.warn("TG WebApp not found"); }

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId');
const token = urlParams.get('token');
const vat = urlParams.get('vat');
const langParam = urlParams.get('lang') || 'it';

let currentEditingCatId = ""; 
let currentData = null;
let initialDataString = "";
let isDirty = false;
let skillTags = [];
let keywords = [];

// ==========================================
// 2. I18N DICTIONARY (FULL 6 LANGUAGES)
// ==========================================
// 2. I18N (FULL 6 LANGUAGES)
const i18n = {
    it: {
        title: "Catalogo Servizi", subtitle: "Prodotti attivi e suggerimenti AI.",
        ghost_label: "Suggeriti", active_label: "Attivi",
        btn_reload: "Ricarica", btn_new_cat: "Nuova Categoria",
        empty_title: "Nessun catalogo trovato.", empty_btn: "Crea Prima Categoria",
        btn_add_here: "Aggiungi Prodotto qui",
        status_active: "Attivo", btn_manage: "Gestisci", btn_activate: "Attiva",
        modal_edit_title: "Modifica Categoria",
        lbl_cat_short: "Nome Breve (Menu/Bottoni)",
        lbl_cat_long: "Nome Completo (Interno/Descrittivo)",
        btn_cancel: "Annulla", btn_save: "Salva",
        confirm_delete_cat: "Sei sicuro di voler eliminare la categoria '{name}' e tutti i suoi prodotti?",
        alert_loading_error: "Errore caricamento", alert_name_required: "Il nome completo è obbligatorio",
        error_id_missing: "Errore: ID Categoria non trovato."
    },
    en: {
        title: "Service Catalog", subtitle: "Active products & AI suggestions.",
        ghost_label: "Suggested", active_label: "Active",
        btn_reload: "Reload", btn_new_cat: "New Category",
        empty_title: "No catalog found.", empty_btn: "Create First Category",
        btn_add_here: "Add Product here",
        status_active: "Active", btn_manage: "Manage", btn_activate: "Activate",
        modal_edit_title: "Edit Category",
        lbl_cat_short: "Short Name (Menu/Buttons)",
        lbl_cat_long: "Full Name (Internal/Descriptive)",
        btn_cancel: "Cancel", btn_save: "Save",
        confirm_delete_cat: "Are you sure you want to delete category '{name}' and all its products?",
        alert_loading_error: "Loading Error", alert_name_required: "Full name is required",
        error_id_missing: "Error: Category ID not found."
    },
    fr: {
        title: "Catalogue Services", subtitle: "Produits actifs & suggestions IA.",
        ghost_label: "Suggérés", active_label: "Actifs",
        btn_reload: "Recharger", btn_new_cat: "Nouvelle Catégorie",
        empty_title: "Aucun catalogue trouvé.", empty_btn: "Créer Première Catégorie",
        btn_add_here: "Ajouter Produit ici",
        status_active: "Actif", btn_manage: "Gérer", btn_activate: "Activer",
        modal_edit_title: "Modifier Catégorie",
        lbl_cat_short: "Nom Court (Menu/Boutons)",
        lbl_cat_long: "Nom Complet (Descriptif)",
        btn_cancel: "Annuler", btn_save: "Enregistrer",
        confirm_delete_cat: "Voulez-vous vraiment supprimer la catégorie '{name}' et ses produits ?",
        alert_loading_error: "Erreur de chargement", alert_name_required: "Le nom complet est requis",
        error_id_missing: "Erreur: ID Catégorie introuvable."
    },
    de: {
        title: "Service-Katalog", subtitle: "Aktive Produkte & KI-Vorschläge.",
        ghost_label: "Vorgeschlagen", active_label: "Aktiv",
        btn_reload: "Neu laden", btn_new_cat: "Neue Kategorie",
        empty_title: "Kein Katalog gefunden.", empty_btn: "Erste Kategorie erstellen",
        btn_add_here: "Produkt hier hinzufügen",
        status_active: "Aktiv", btn_manage: "Verwalten", btn_activate: "Aktivieren",
        modal_edit_title: "Kategorie Bearbeiten",
        lbl_cat_short: "Kurzname (Menü/Buttons)",
        lbl_cat_long: "Vollständiger Name (Beschreibung)",
        btn_cancel: "Abbrechen", btn_save: "Speichern",
        confirm_delete_cat: "Möchten Sie die Kategorie '{name}' und alle Produkte wirklich löschen?",
        alert_loading_error: "Ladefehler", alert_name_required: "Vollständiger Name ist erforderlich",
        error_id_missing: "Fehler: Kategorie-ID nicht gefunden."
    },
    es: {
        title: "Catálogo Servicios", subtitle: "Productos activos y sugerencias IA.",
        ghost_label: "Sugeridos", active_label: "Activos",
        btn_reload: "Recargar", btn_new_cat: "Nueva Categoría",
        empty_title: "No se encontró catálogo.", empty_btn: "Crear Primera Categoría",
        btn_add_here: "Añadir Producto aquí",
        status_active: "Activo", btn_manage: "Gestionar", btn_activate: "Activar",
        modal_edit_title: "Editar Categoría",
        lbl_cat_short: "Nombre Corto (Menú/Botones)",
        lbl_cat_long: "Nombre Completo (Descriptivo)",
        btn_cancel: "Cancelar", btn_save: "Guardar",
        confirm_delete_cat: "¿Seguro que quieres eliminar la categoría '{name}' y sus productos?",
        alert_loading_error: "Error de carga", alert_name_required: "El nombre completo es obligatorio",
        error_id_missing: "Error: ID de categoría no encontrado."
    },
    pt: {
        title: "Catálogo Serviços", subtitle: "Produtos ativos e sugestões IA.",
        ghost_label: "Sugeridos", active_label: "Ativos",
        btn_reload: "Recarregar", btn_new_cat: "Nova Categoria",
        empty_title: "Nenhum catálogo encontrado.", empty_btn: "Criar Primeira Categoria",
        btn_add_here: "Adicionar Produto aqui",
        status_active: "Ativo", btn_manage: "Gerir", btn_activate: "Ativar",
        modal_edit_title: "Editar Categoria",
        lbl_cat_short: "Nome Curto (Menu/Botões)",
        lbl_cat_long: "Nome Completo (Descritivo)",
        btn_cancel: "Cancelar", btn_save: "Salvar",
        confirm_delete_cat: "Tem certeza que deseja excluir a categoria '{name}' e seus produtos?",
        alert_loading_error: "Erro ao carregar", alert_name_required: "O nome completo é obrigatório",
        error_id_missing: "Erro: ID da categoria não encontrado."
    }
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

// ==========================================
// 3. HELPER FUNCTIONS
// ==========================================

function getLang() {
    const l = urlParams.get('lang') || 'it';
    const norm = l.toLowerCase().slice(0, 2);
    return i18n[norm] ? norm : 'en';
}

function t(key) {
    const lang = getLang();
    return (i18n[lang] && i18n[lang][key]) || (i18n['en'] && i18n['en'][key]) || key;
}

function getAllUrlParams() {
    const params = {};
    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
// 4. FUNZIONI PRINCIPALI
function init() {
    applyTranslations();
    if (!productId || !token || !vat) {
        dom.loaderText.textContent = "Error: Missing VAT/Token/ID";
        return;
    }
    return params;
    loadProduct();
}

function applyTranslations() {
    const safeSetText = (selector, key) => { const el = document.querySelector(selector); if (el) el.innerText = t(key); };
    safeSetText('.header-info h1', 'title');
    safeSetText('.header-info small', 'subtitle');
    const ghostLabel = document.querySelector('#count-ghost + .dash-sub');
    if (ghostLabel) ghostLabel.innerText = t('ghost_label');
    const activeLabel = document.querySelector('#count-active + .dash-sub');
    if (activeLabel) activeLabel.innerText = t('active_label');
    const btnNewCat = document.querySelector('.btn-secondary.btn-block');
    if (btnNewCat) btnNewCat.innerHTML = `<i class="fas fa-plus"></i> ${t('btn_new_cat')}`;
    safeSetText('#empty-state p', 'empty_title');
    safeSetText('#empty-state button', 'empty_btn');
    safeSetText('h3[data-i18n="modal_edit_title"]', 'modal_edit_title');
    safeSetText('label[data-i18n="lbl_cat_short"]', 'lbl_cat_short');
    safeSetText('label[data-i18n="lbl_cat_long"]', 'lbl_cat_long');
    const btnCancel = document.querySelector('#edit-cat-modal .btn-secondary');
    if(btnCancel) btnCancel.innerText = t('btn_cancel');
    const btnSave = document.querySelector('#edit-cat-modal .btn-primary');
    if(btnSave) btnSave.innerText = t('btn_save');
}

// Funzione sicura per escape HTML negli attributi data-*
function escapeHtml(str) {
    return (str || '').replace(/"/g, '&quot;');
}

// ==========================================
// 4. NAVIGATION (BLINDATA)
// ==========================================

window.goBack = () => window.location.href = `../dashboard.html?${urlParams.toString()}`;
window.goToAddCategory = () => window.location.href = `add-category.html?${urlParams.toString()}`;

// Apre add-product.html
window.goToAddProduct = (catId, prodId) => {
    if (!catId) return alert("Errore: ID Categoria mancante");

    // Prende tutti i parametri attuali (vat, owner, ecc.)
    const params = new URLSearchParams(window.location.search);
    
    // Aggiunge quelli specifici per questa pagina
    params.set('catId', catId);
    if (prodId) {
        params.set('ghostId', prodId);
    } else {
        params.delete('ghostId'); // Pulizia
    }

    location.href = `add-product.html?${params.toString()}`;
};

// Apre edit-product.html o edit-blueprint.html
window.openProduct = (page, productId) => {
    if (!productId) return alert("Errore: ID Prodotto mancante");
    
    // Prende tutti i parametri attuali
    const params = new URLSearchParams(window.location.search);

    // Aggiunge l'ID del prodotto da modificare
    params.set('productId', productId);

    location.href = `${page}?${params.toString()}`;
};

// ==========================================
// 5. CORE LOGIC
// ==========================================

let catalogData = null;

function parseN8nResponse(json) {
    const data = Array.isArray(json) ? json[0] : json;
    return data.catalog || data.data || data;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerText = t[key];
    });
    document.title = t.page_title;
    dom.skillInput.placeholder = t.phSkill;
    dom.keywordInput.placeholder = t.phKw;
}

async function loadCatalog(forceRefresh = false) {
    if (!token) return;
    const loader = document.getElementById('loader');
    const content = document.getElementById('app-content');
    
    if (forceRefresh) {
        document.getElementById('catalog-list').innerHTML = '';
        loader.classList.remove('hidden');
        content.classList.add('hidden');
    }
    
async function loadProduct() {
    showLoader(t.loading);
    try {
        // 1. PREPARA PAYLOAD BASE
        const currentUrlParams = new URLSearchParams(window.location.search);
        const payload = { 
            action: 'get_catalog', 
            token: token
        };
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

        // Passa TUTTI i parametri URL nel payload per n8n
        for (const [key, value] of currentUrlParams.entries()) {
            payload[key] = value;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const rawData = await res.json();
        const firstItem = Array.isArray(rawData) ? rawData[0] : rawData;
        
        // ESTRAZIONE CORRETTA: I dati sono dentro 'catalog_item'
        const productData = firstItem.catalog_item; 

        // 2. GESTIONE BONUS CREDITS (SILENZIOSA)
        const bonus = currentUrlParams.get('bonus_credits');
        if (bonus && parseInt(bonus) > 0) {
            
            // PULIZIA URL (CRITICO) - Rimuove il parametro visivamente senza ricaricare
            currentUrlParams.delete('bonus_credits');
            const newUrl = window.location.pathname + '?' + currentUrlParams.toString();
            window.history.replaceState({}, document.title, newUrl);
        if (!productData || !productData.identity) {
            throw new Error("Dati prodotto non trovati (Missing catalog_item).");
        }

        // 3. CHIAMATA UNICA A N8N
        const res = await fetch(CATALOG_WEBHOOK, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(payload) 
        });

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        currentData = productData;
        
        // Fotografia stato iniziale per dirty checking
        initialDataString = JSON.stringify(collectDataFromForm()); 
        
        populateForm(productData);

        setupTagInput(dom.skillInput, dom.skillContainer, skillTags);
        setupTagInput(dom.keywordInput, dom.keywordContainer, keywords);

        catalogData = parseN8nResponse(await res.json());
        renderCatalog();
        dom.form.addEventListener('input', checkDirty);
        dom.form.addEventListener('submit', handleSave);

        hideLoader();
    } catch (e) {
        const emptyState = document.getElementById('empty-state');
        if(emptyState) {
            emptyState.innerHTML = `<i class="fas fa-exclamation-triangle"></i><p>${t('alert_loading_error')}: ${e.message}</p>`;
            emptyState.classList.remove('hidden');
        }
    } finally {
        loader.classList.add('hidden');
        content.classList.remove('hidden');
        handleError(e);
    }
}

// ==========================================
// FUNZIONE RENDER (vFINAL v3 - PASSAGGIO PARAMETRI CORRETTO)
// ==========================================
function renderCatalog() {
    const container = document.getElementById('catalog-list');
    container.innerHTML = '';
    const categories = catalogData.categories || [];
    
    if (categories.length === 0) {
        document.getElementById('empty-state').classList.remove('hidden');
        return;
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

    let ghostCount = 0, activeCount = 0;
    chk('requiresBooking', operations.requires_booking);
    chk('requiresInventory', operations.requires_inventory_check);

    skillTags = Array.isArray(provider.required_skill_tags) ? provider.required_skill_tags : [];
    keywords = Array.isArray(identity.keywords) ? identity.keywords : [];

    categories.forEach((cat) => {
        const subcats = cat.subcategories || [];
        const catActive = subcats.filter(p => p.blueprint_ready).length;
        activeCount += catActive;
        ghostCount += (subcats.length - catActive);
    renderTags(dom.skillContainer, skillTags);
    renderTags(dom.keywordContainer, keywords);

        const displayTitle = cat.short_name || cat.name;
        const catId = cat.callback_data || ""; 
    document.getElementById('pageTitle').textContent = `✏️ ${identity.item_name || 'Prodotto'}`;
}

        const catEl = document.createElement('div');
        catEl.className = 'cat-card';
        
        catEl.innerHTML = `
            <div class="cat-header" onclick="this.parentElement.classList.toggle('open')">
                <div class="cat-title" title="${escapeHtml(cat.name)}">${displayTitle}<span class="cat-badge">${subcats.length}</span></div>
                <div class="cat-actions">
                    <button class="btn-icon-sm" data-id="${catId}" data-name="${escapeHtml(cat.name)}" data-short="${escapeHtml(cat.short_name)}" onclick="event.stopPropagation(); handleEditClick(this)"><i class="fas fa-pen"></i></button>
                    <button class="btn-icon-sm text-error" data-id="${catId}" data-name="${escapeHtml(cat.name)}" onclick="event.stopPropagation(); handleDeleteClick(this)"><i class="fas fa-trash"></i></button>
                    <i class="fas fa-chevron-down chevron"></i>
                </div>
            </div>
            <div class="cat-body">
                <div style="padding:10px; text-align:center; border-bottom:1px solid var(--glass-border);">
                    <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); goToAddProduct('${catId}', null)">
                        <i class="fas fa-plus"></i> ${t('btn_add_here')}
                    </button>
                </div>
                <div class="products-container"></div>
            </div>
        `;

        const prodContainer = catEl.querySelector('.products-container');
        
        subcats.forEach((prod) => {
            const isRealProduct = prod.blueprint_ready === true;
            const prodId = prod.callback_data; 
            
            let actionFunction, btnIcon, btnLabel, btnClass;
            let infoAreaOnClick = '', infoAreaClass = '', infoAreaTitle = '';

            if (isRealProduct) {
                // PRODOTTO ATTIVO
                btnIcon = '<i class="fas fa-sliders-h"></i>';
                btnLabel = t('btn_manage') || "Gestisci";
                btnClass = 'btn-edit';
                // IL BOTTONE VA AL BLUEPRINT
                actionFunction = `openProduct('edit-blueprint.html', '${prodId}')`; 

                // L'AREA INFO VA ALLA SCHEDA PRODOTTO
                infoAreaOnClick = `onclick="openProduct('edit-product.html', '${prodId}')"`;
                infoAreaClass = 'clickable-area';
                infoAreaTitle = `title="Modifica scheda prodotto"`;
            } else {
                // PRODOTTO GHOST
                btnIcon = '<i class="fas fa-plus"></i>';
                btnLabel = t('btn_activate') || "Aggiungi";
                btnClass = 'btn-create';
                actionFunction = `goToAddProduct('${catId}', '${prodId}')`;
            }
async function handleSave(e) {
    e.preventDefault();
    if (!isDirty) return;

            const statusClass = isRealProduct ? 'status-active' : 'status-ghost';
            const prodDisplay = prod.short_name || prod.name;
            const prodSub = (prod.short_name && prod.name !== prod.short_name) ? prod.name : '';
            const shortDesc = prod.description ? prod.description.substring(0, 50) + '...' : '';
            const safeProdName = escapeHtml(prod.name);

            const prodEl = document.createElement('div');
            prodEl.className = `prod-item ${statusClass}`;
            
            prodEl.innerHTML = `
                <div class="prod-info ${infoAreaClass}" ${infoAreaOnClick} ${infoAreaTitle}>
                    <div class="prod-name">${prodDisplay} ${isRealProduct ? `<i class="fas fa-check-circle" style="color:var(--success); font-size:10px;"></i>` : ''}</div>
                    ${prodSub ? `<div class="prod-full-name">${prodSub}</div>` : ''}
                    <div class="prod-desc">${shortDesc}</div>
                </div>
                
                <div class="prod-actions-group">
                    <button class="btn-action ${btnClass}" onclick="${actionFunction}">
                        ${btnIcon} <span>${btnLabel}</span>
                    </button>
                    
                    <button class="btn-prod-delete" onclick="deleteProduct('${safeProdName}', '${prodId}')">
                        <i class="fas fa-trash-alt"></i> <span>Elimina</span>
                    </button>
                </div>
            `;
            prodContainer.appendChild(prodEl);
        });
        container.appendChild(catEl);
    });
    
    document.getElementById('count-ghost').innerText = ghostCount;
    document.getElementById('count-active').innerText = activeCount;
}
    setButtonLoading(dom.saveBtn, true, t.saving);

// ==========================================
// NUOVA FUNZIONE: DELETE PRODUCT
// ==========================================
    // Update currentData structure
    if(!currentData.identity) currentData.identity = {};
    if(!currentData.identity.description) currentData.identity.description = {};
    if(!currentData.pricing) currentData.pricing = {};
    if(!currentData.pricing.tax_info) currentData.pricing.tax_info = {};
    if(!currentData.operations) currentData.operations = {};
    if(!currentData.operations.provider_info) currentData.operations.provider_info = {};

window.deleteProduct = async function(prodName, prodId) {
    // Fallback traduzione manuale se non aggiorni tutto il dizionario i18n subito
    const confirmText = i18n[getLang()]?.confirm_delete_prod || `Delete product '${prodName}'?`;
    
    if (!prodId) return alert("Error: Product ID missing");
    if (!confirm(confirmText.replace('{name}', prodName))) return;
    const get = (id) => document.getElementById(id).value;
    const getChk = (id) => document.getElementById(id).checked;

    document.getElementById('loader').classList.remove('hidden');
    currentData.identity.item_name = get('itemName');
    currentData.identity.item_type = get('itemType');
    currentData.identity.description.short = get('descShort');
    currentData.identity.description.long = get('descLong');
    currentData.identity.description.internal_notes = get('internalNotes');
    currentData.identity.keywords = keywords;

    try {
        const payload = { 
            action: 'delete_product', // NUOVA ACTION
            token: token, 
            product_id: prodId, // ID UNIVOCO DEL PRODOTTO
            ...getAllUrlParams() 
        };
    currentData.pricing.base_price = parseFloat(get('basePrice')) || 0;
    currentData.pricing.currency = get('currency');
    currentData.pricing.unit_of_measure = get('unitOfMeasure');
    currentData.pricing.tax_info.tax_rate_percentage = parseInt(get('taxRate')) || 22;

        const res = await fetch(CATALOG_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("Server Error");
        
        const json = await res.json();
        
        // Update One-Shot
        catalogData = parseN8nResponse(json);
        renderCatalog();
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

        // FIX ROTELLA
        document.getElementById('loader').classList.add('hidden');
        if (!res.ok) throw new Error("Save failed");

        if(tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('warning');
        setButtonLoading(dom.saveBtn, false, t.saved, true);
        try { tg.HapticFeedback.notificationOccurred('success'); } catch (e) {}
        setTimeout(() => { try { tg.close(); } catch (e) { goBackToCatalog(); } }, 1500);

    } catch (e) {
        alert("Error: " + e.message);
        document.getElementById('loader').classList.add('hidden');
        handleError(e);
        setButtonLoading(dom.saveBtn, false, t.btnSave);
    }
};

// ==========================================
// 6. ACTION HANDLERS (Proxy per leggere data-*)
// ==========================================

window.handleEditClick = function(btn) {
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const short = btn.dataset.short;
    openEditModal(name, short, id);
}

window.handleDeleteClick = function(btn) {
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    deleteCategory(name, id);
// 5. HELPER UTILITIES
function collectDataFromForm() {
    return {
        itemName: document.getElementById('itemName').value,
        descShort: document.getElementById('descShort').value,
        basePrice: document.getElementById('basePrice').value,
        tags: skillTags.join(',') + keywords.join(',')
    };
}

// ==========================================
// 7. MODAL & CRUD LOGIC
// ==========================================

window.openEditModal = function(name, short, id) {
    if (!id) return alert(t('error_id_missing'));
    currentEditingCatId = id; 
    document.getElementById('edit-cat-long').value = name;
    document.getElementById('edit-cat-short').value = short || ""; 
    document.getElementById('edit-cat-modal').classList.remove('hidden');
};

window.closeEditModal = () => document.getElementById('edit-cat-modal').classList.add('hidden');

window.saveEditCategory = async function() {
    const newLong = document.getElementById('edit-cat-long').value.trim();
    const newShort = document.getElementById('edit-cat-short').value.trim();

    if (!newLong) return alert(t('alert_name_required'));
    if (!currentEditingCatId) return alert(t('error_id_missing'));
function checkDirty() {
    // Semplice check: se i dati sono caricati, abilitiamo il salvataggio al primo input
    if (currentData) {
        isDirty = true;
        dom.saveBtn.disabled = false;
    }
}

    closeEditModal();
    document.getElementById('loader').classList.remove('hidden');
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

    try {
        const payload = { 
            action: 'modify_category', token: token, 
            category_id: currentEditingCatId, 
            new_category_name: newLong,
            new_category_short_name: newShort,
            ...getAllUrlParams() 
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
        const res = await fetch(CATALOG_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("Server Error");
        
        const json = await res.json();
        catalogData = parseN8nResponse(json); 
        renderCatalog();
        
        // FIX ROTELLA
        document.getElementById('loader').classList.add('hidden');
        
        if(tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    } catch (e) {
        alert("Error: " + e.message);
        document.getElementById('loader').classList.add('hidden');
    }
};
        container.insertBefore(tagEl, input);
    });
}

window.deleteCategory = async function(catName, catId) {
    if (!catId) return alert(t('error_id_missing'));
    if (!confirm(t('confirm_delete_cat').replace('{name}', catName))) return;
    
    document.getElementById('loader').classList.remove('hidden');
    try {
        const payload = { action: 'delete_category', token: token, category_id: catId, ...getAllUrlParams() };
        const res = await fetch(CATALOG_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("Server Error");
        
        const json = await res.json();
        catalogData = parseN8nResponse(json);
        renderCatalog();
        
        // FIX ROTELLA
        document.getElementById('loader').classList.add('hidden');
        
        if(tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('warning');
    } catch (e) {
        alert("Error: " + e.message);
        document.getElementById('loader').classList.add('hidden');
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

// ==========================================
// 8. BOOTSTRAP
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    loadCatalog();
});
// 6. START
init();
