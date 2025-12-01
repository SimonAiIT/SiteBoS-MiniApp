/**
 * CATALOG LOGIC (vFINAL - FULL LANGS & ROBUST UI)
 * - 6 Lingue Complete (IT, EN, FR, DE, ES, PT).
 * - UI Fix: Onclick inline + Data Attributes (Niente stringhe rotte).
 * - UX Fix: Rotella nascosta dopo il salvataggio.
 * - Backend: One-Shot Update (nessuna doppia chiamata).
 */

// ==========================================
// 1. CONFIG & INIT
// ==========================================
const CATALOG_WEBHOOK = "https://trinai.api.workflow.dcmake.it/webhook/0fff7fa2-bcb2-4b50-a26b-589b7054952e";

const tg = window.Telegram.WebApp;
tg.ready(); 
tg.expand();

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

let currentEditingCatId = ""; 

// ==========================================
// 2. I18N DICTIONARY (FULL 6 LANGUAGES)
// ==========================================
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
    }
    return params;
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
// 4. NAVIGATION
// ==========================================

window.goBack = () => window.location.href = `dashboard.html?${urlParams.toString()}`;
window.goToAddCategory = () => window.location.href = `add-category.html?${urlParams.toString()}`;
window.goToAddProduct = (catIdx) => location.href = `add-product.html?token=${token}&catIdx=${catIdx}&${urlParams.toString()}`;
window.openProduct = (page, catIdx, prodIdx) => location.href = `${page}?token=${token}&cat=${catIdx}&prod=${prodIdx}&${urlParams.toString()}`;

// ==========================================
// 5. CORE LOGIC
// ==========================================

let catalogData = null;

function parseN8nResponse(json) {
    const data = Array.isArray(json) ? json[0] : json;
    return data.catalog || data.data || data;
}

async function loadCatalog(forceRefresh = false) {
    if (!token) return;
    const loader = document.getElementById('loader');
    const content = document.getElementById('app-content');
    
    if(forceRefresh) {
        document.getElementById('catalog-list').innerHTML = '';
        loader.classList.remove('hidden');
        content.classList.add('hidden');
    }
    
    try {
        const payload = { action: 'get_catalog', token: token, ...getAllUrlParams() };
        const res = await fetch(CATALOG_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        catalogData = parseN8nResponse(await res.json());
        renderCatalog();
    } catch (e) {
        const emptyState = document.getElementById('empty-state');
        if(emptyState) {
            emptyState.innerHTML = `<i class="fas fa-exclamation-triangle"></i><p>${t('alert_loading_error')}: ${e.message}</p>`;
            emptyState.classList.remove('hidden');
        }
    } finally {
        loader.classList.add('hidden');
        content.classList.remove('hidden');
    }
}

function renderCatalog() {
    const container = document.getElementById('catalog-list');
    container.innerHTML = '';
    const categories = catalogData.categories || [];
    
    if (categories.length === 0) {
        document.getElementById('empty-state').classList.remove('hidden');
        return;
    }
    
    let ghostCount = 0, activeCount = 0;
    
    categories.forEach((cat, catIdx) => {
        const subcats = cat.subcategories || [];
        const catActive = subcats.filter(p => p.blueprint_ready).length;
        activeCount += catActive;
        ghostCount += (subcats.length - catActive);

        const displayTitle = cat.short_name || cat.name;
        // Importante: fallback a stringa vuota se manca l'ID
        const catId = cat.callback_data || ""; 

        const catEl = document.createElement('div');
        catEl.className = 'cat-card';
        
        // --- RENDERING ROBUSTO: Onclick inline + Data Attributes ---
        catEl.innerHTML = `
            <div class="cat-header" onclick="this.parentElement.classList.toggle('open')">
                <div class="cat-title" title="${escapeHtml(cat.name)}">${displayTitle}<span class="cat-badge">${subcats.length}</span></div>
                <div class="cat-actions">
                    <button class="btn-icon-sm" 
                        data-id="${catId}" 
                        data-name="${escapeHtml(cat.name)}" 
                        data-short="${escapeHtml(cat.short_name)}"
                        onclick="event.stopPropagation(); handleEditClick(this)">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="btn-icon-sm text-error" 
                        data-id="${catId}" 
                        data-name="${escapeHtml(cat.name)}"
                        onclick="event.stopPropagation(); handleDeleteClick(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                    <i class="fas fa-chevron-down chevron"></i>
                </div>
            </div>
            <div class="cat-body">
                <div style="padding:10px; text-align:center; border-bottom:1px solid var(--glass-border);">
                    <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); goToAddProduct(${catIdx})"><i class="fas fa-plus"></i> ${t('btn_add_here')}</button>
                </div>
                <div class="products-container"></div>
            </div>
        `;

        const prodContainer = catEl.querySelector('.products-container');
        subcats.forEach((prod, prodIdx) => {
            const isActive = prod.blueprint_ready === true;
            const statusClass = isActive ? 'status-active' : 'status-ghost';
            const icon = isActive ? '<i class="fas fa-sliders-h"></i>' : '<i class="fas fa-magic"></i>';
            const actionLabel = isActive ? t('btn_manage') : t('btn_activate');
            const targetPage = isActive ? 'edit-blueprint.html' : 'edit-product.html';
            const btnClass = isActive ? 'btn-edit' : 'btn-create';
            
            const prodDisplay = prod.short_name || prod.name;
            const prodSub = (prod.short_name && prod.name !== prod.short_name) ? prod.name : '';
            const shortDesc = prod.description ? prod.description.substring(0, 50) + '...' : '';

            const prodEl = document.createElement('div');
            prodEl.className = `prod-item ${statusClass}`;
            prodEl.innerHTML = `
                <div class="prod-info">
                    <div class="prod-name">${prodDisplay} ${isActive ? `<i class="fas fa-check-circle" style="color:var(--success); font-size:10px;"></i>` : ''}</div>
                    ${prodSub ? `<div class="prod-full-name">${prodSub}</div>` : ''}
                    <div class="prod-desc">${shortDesc}</div>
                </div>
                <button class="btn-action ${btnClass}" onclick="openProduct('${targetPage}', ${catIdx}, ${prodIdx})">
                    ${icon} <span>${actionLabel}</span>
                </button>
            `;
            prodContainer.appendChild(prodEl);
        });
        container.appendChild(catEl);
    });
    
    document.getElementById('count-ghost').innerText = ghostCount;
    document.getElementById('count-active').innerText = activeCount;
}

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

    closeEditModal();
    document.getElementById('loader').classList.remove('hidden');

    try {
        const payload = { 
            action: 'modify_category', token: token, 
            category_id: currentEditingCatId, 
            new_category_name: newLong,
            new_category_short_name: newShort,
            ...getAllUrlParams() 
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
};

// ==========================================
// 8. BOOTSTRAP
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    loadCatalog();
});
