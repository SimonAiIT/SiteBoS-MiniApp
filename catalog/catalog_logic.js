/**
 * CATALOG LOGIC (v6.0 - Optimized One-Shot Update)
 * - Multilingua Completo
 * - Gestione CRUD con ID univoci
 * - OTTIMIZZAZIONE: Nessuna doppia chiamata. L'update usa la risposta della modifica.
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

// Stato locale
let currentEditingCatId = ""; 

// ==========================================
// 2. I18N DICTIONARY
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
        alert_loading_error: "Errore caricamento", alert_name_required: "Il nome completo è obbligatorio"
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
        alert_loading_error: "Loading Error", alert_name_required: "Full name is required"
    },
    fr: {
        title: "Catalogue Services", subtitle: "Produits actifs & suggestions IA.",
        ghost_label: "Suggérés", active_label: "Actifs",
        btn_reload: "Recharger", btn_new_cat: "Nouvelle Catégorie",
        empty_title: "Aucun catalogue trouvé.", empty_btn: "Créer Première Catégorie",
        btn_add_here: "Ajouter Produit ici",
        status_active: "Actif", btn_manage: "Gérer", btn_activate: "Activer",
        modal_edit_title: "Modifier Catégorie",
        lbl_cat_short: "Nom Court", lbl_cat_long: "Nom Complet",
        btn_cancel: "Annuler", btn_save: "Enregistrer",
        confirm_delete_cat: "Voulez-vous vraiment supprimer la catégorie '{name}' ?",
        alert_loading_error: "Erreur de chargement", alert_name_required: "Le nom complet est requis"
    },
    de: {
        title: "Service-Katalog", subtitle: "Aktive Produkte & KI-Vorschläge.",
        ghost_label: "Vorgeschlagen", active_label: "Aktiv",
        btn_reload: "Neu laden", btn_new_cat: "Neue Kategorie",
        empty_title: "Kein Katalog gefunden.", empty_btn: "Erste Kategorie erstellen",
        btn_add_here: "Produkt hier hinzufügen",
        status_active: "Aktiv", btn_manage: "Verwalten", btn_activate: "Aktivieren",
        modal_edit_title: "Kategorie Bearbeiten",
        lbl_cat_short: "Kurzname", lbl_cat_long: "Vollständiger Name",
        btn_cancel: "Abbrechen", btn_save: "Speichern",
        confirm_delete_cat: "Möchten Sie die Kategorie '{name}' wirklich löschen?",
        alert_loading_error: "Ladefehler", alert_name_required: "Vollständiger Name ist erforderlich"
    },
    es: {
        title: "Catálogo Servicios", subtitle: "Productos activos y sugerencias IA.",
        ghost_label: "Sugeridos", active_label: "Activos",
        btn_reload: "Recargar", btn_new_cat: "Nueva Categoría",
        empty_title: "No se encontró catálogo.", empty_btn: "Crear Primera Categoría",
        btn_add_here: "Añadir Producto aquí",
        status_active: "Activo", btn_manage: "Gestionar", btn_activate: "Activar",
        modal_edit_title: "Editar Categoría",
        lbl_cat_short: "Nombre Corto", lbl_cat_long: "Nombre Completo",
        btn_cancel: "Cancelar", btn_save: "Guardar",
        confirm_delete_cat: "¿Seguro que quieres eliminar la categoría '{name}'?",
        alert_loading_error: "Error de carga", alert_name_required: "El nombre completo es obligatorio"
    },
    pt: {
        title: "Catálogo Serviços", subtitle: "Produtos ativos e sugestões IA.",
        ghost_label: "Sugeridos", active_label: "Ativos",
        btn_reload: "Recarregar", btn_new_cat: "Nova Categoria",
        empty_title: "Nenhum catálogo encontrado.", empty_btn: "Criar Primeira Categoria",
        btn_add_here: "Adicionar Produto aqui",
        status_active: "Ativo", btn_manage: "Gerir", btn_activate: "Ativar",
        modal_edit_title: "Editar Categoria",
        lbl_cat_short: "Nome Curto", lbl_cat_long: "Nome Completo",
        btn_cancel: "Cancelar", btn_save: "Salvar",
        confirm_delete_cat: "Tem certeza que deseja excluir a categoria '{name}'?",
        alert_loading_error: "Erro ao carregar", alert_name_required: "O nome completo é obrigatório"
    }
};

// ==========================================
// 3. HELPER FUNCTIONS
// ==========================================

function getLang() { /* ... codice invariato ... */ return 'it'; }
function t(key) { /* ... codice invariato ... */ return i18n[getLang()][key] || key; }
function getAllUrlParams() { /* ... codice invariato ... */ const p={}; urlParams.forEach((v,k)=>p[k]=v); return p; }
function applyTranslations() { /* ... codice invariato ... */ }

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
    if(forceRefresh) {
        document.getElementById('catalog-list').innerHTML = '';
        loader.classList.remove('hidden');
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
        document.getElementById('app-content').classList.remove('hidden');
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
        const catId = cat.callback_data || ""; 

        const catEl = document.createElement('div');
        catEl.className = 'cat-card';
        // --- MODIFICA CHIAVE: USIAMO DATA-ATTRIBUTES INVECE DI ONCLICK ---
        catEl.innerHTML = `
            <div class="cat-header" data-action="toggle">
                <div class="cat-title" title="${cat.name}">${displayTitle}<span class="cat-badge">${subcats.length}</span></div>
                <div class="cat-actions">
                    <button class="btn-icon-sm" 
                        data-action="edit" 
                        data-id="${catId}" 
                        data-name="${cat.name}" 
                        data-short="${cat.short_name || ''}">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="btn-icon-sm text-error" 
                        data-action="delete" 
                        data-id="${catId}" 
                        data-name="${cat.name}">
                        <i class="fas fa-trash"></i>
                    </button>
                    <i class="fas fa-chevron-down chevron"></i>
                </div>
            </div>
            <div class="cat-body"><!-- ... content ... --></div>
        `;
        // ... (resto del render dei prodotti, invariato) ...
        container.appendChild(catEl);
    });
    document.getElementById('count-ghost').innerText = ghostCount;
    document.getElementById('count-active').innerText = activeCount;
}

// ==========================================
// 6. EVENT HANDLING (Il nuovo cuore)
// ==========================================
function initializeEventListeners() {
    const catalogList = document.getElementById('catalog-list');
    if (catalogList) {
        catalogList.addEventListener('click', (e) => {
            const button = e.target.closest('button[data-action]');
            const header = e.target.closest('.cat-header[data-action="toggle"]');

            if (button) { // Se ho cliccato un bottone di azione
                e.stopPropagation(); // Impedisce al click di propagarsi e aprire/chiudere la card
                const action = button.dataset.action;
                const id = button.dataset.id;
                const name = button.dataset.name;
                const short = button.dataset.short;

                if (action === 'edit') {
                    openEditModal(name, short, id);
                } else if (action === 'delete') {
                    deleteCategory(name, id);
                }
            } else if (header) { // Se ho cliccato l'header per aprire/chiudere
                header.parentElement.classList.toggle('open');
            }
        });
    }
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
        
        catalogData = parseN8nResponse(await res.json()); 
        renderCatalog();
        
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
        
        catalogData = parseN8nResponse(await res.json());
        renderCatalog();
        
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
    initializeEventListeners(); // Attacca il nuovo gestore di eventi
    loadCatalog();
});
