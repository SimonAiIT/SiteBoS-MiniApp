// catalog_logic.js
// Gestione Catalogo Multilingua con Webhook Dedicato & Azioni CRUD

// CONFIGURAZIONE
const CATALOG_WEBHOOK = "https://trinai.api.workflow.dcmake.it/webhook/0fff7fa2-bcb2-4b50-a26b-589b7054952e";

// INIT TELEGRAM
const tg = window.Telegram.WebApp;
tg.ready(); 
tg.expand();

// URL PARAMS
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

// I18N (6 Lingue)
const i18n = {
    it: {
        title: "Catalogo Servizi", subtitle: "Prodotti attivi e suggerimenti AI.",
        ghost_label: "Suggeriti", active_label: "Attivi",
        btn_reload: "Ricarica", btn_new_cat: "Nuova Categoria",
        empty_title: "Nessun catalogo trovato.", empty_btn: "Crea Prima Categoria",
        btn_add_here: "Aggiungi Prodotto qui",
        status_active: "Attivo", btn_manage: "Gestisci", btn_activate: "Attiva",
        prompt_edit_cat: "Nuovo nome per la categoria:",
        confirm_delete_cat: "Sei sicuro di voler eliminare la categoria '{name}' e tutti i suoi prodotti?",
        msg_cat_updated: "Categoria aggiornata!",
        msg_cat_deleted: "Categoria eliminata!",
        alert_loading_error: "Errore caricamento"
    },
    en: {
        title: "Service Catalog", subtitle: "Active products & AI suggestions.",
        ghost_label: "Suggested", active_label: "Active",
        btn_reload: "Reload", btn_new_cat: "New Category",
        empty_title: "No catalog found.", empty_btn: "Create First Category",
        btn_add_here: "Add Product here",
        status_active: "Active", btn_manage: "Manage", btn_activate: "Activate",
        prompt_edit_cat: "New name for category:",
        confirm_delete_cat: "Are you sure you want to delete category '{name}' and all its products?",
        msg_cat_updated: "Category updated!",
        msg_cat_deleted: "Category deleted!",
        alert_loading_error: "Loading Error"
    }
};

// LANGUAGE HELPER
function getLang() {
    const l = urlParams.get('lang') || 'it';
    const norm = l.toLowerCase().slice(0, 2);
    return i18n[norm] ? norm : 'en';
}

function t(key) {
    const lang = getLang();
    return (i18n[lang] && i18n[lang][key]) || (i18n['en'] && i18n['en'][key]) || key;
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
}

// NAVIGAZIONE
window.goBack = function() {
    window.location.href = `dashboard.html?${urlParams.toString()}`;
}

window.goToAddCategory = function() {
    window.location.href = `add-category.html?${urlParams.toString()}`;
}

// RACCOLTA TUTTI I PARAMETRI URL
function getAllUrlParams() {
    const params = {};
    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    return params;
}

// LOGIC
let catalogData = null;

async function loadCatalog(forceRefresh = false) {
    if (!token) { document.body.innerHTML = "<h3 style='color:white;text-align:center;margin-top:50px'>Access Denied: Missing Token</h3>"; return; }
    
    const loader = document.getElementById('loader');
    const content = document.getElementById('app-content');
    const list = document.getElementById('catalog-list');

    if(forceRefresh) {
        if(list) list.innerHTML = '';
        if(loader) loader.classList.remove('hidden');
        if(content) content.classList.add('hidden');
    }

    try {
        const payload = { action: 'get_catalog', token: token, ...getAllUrlParams() };
        console.log("Sending Payload:", payload); 

        const res = await fetch(CATALOG_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        
        const json = await res.json();
        const data = Array.isArray(json) ? json[0] : json;
        catalogData = data.catalog || data.data || data;
        
        renderCatalog();
        
    } catch (e) {
        console.error("Load Error:", e);
        const emptyState = document.getElementById('empty-state');
        if(emptyState) {
            emptyState.innerHTML = `<i class="fas fa-exclamation-triangle" style="font-size:40px; color:var(--error)"></i><p>${t('alert_loading_error')}: ${e.message}</p>`;
            emptyState.classList.remove('hidden');
        }
    } finally {
        if(loader) loader.classList.add('hidden');
        if(content) content.classList.remove('hidden');
    }
}

function renderCatalog() {
    const container = document.getElementById('catalog-list');
    if(!container) return;
    
    container.innerHTML = '';
    const categories = catalogData.categories || [];
    
    if (categories.length === 0) {
        document.getElementById('empty-state').classList.remove('hidden');
        return;
    }
    document.getElementById('empty-state').classList.add('hidden');

    let ghostCount = 0;
    let activeCount = 0;

    categories.forEach((cat, catIdx) => {
        const subcats = cat.subcategories || [];
        const catActive = subcats.filter(p => p.blueprint_ready).length;
        const catGhost = subcats.length - catActive;
        
        activeCount += catActive;
        ghostCount += catGhost;

        // USA SHORT_NAME SE ESISTE, ALTRIMENTI NAME
        const displayName = cat.short_name || cat.name;
        // Se short_name esiste, usa name come tooltip/subtext, altrimenti nulla
        const fullName = (cat.short_name && cat.name !== cat.short_name) ? cat.name : ''; 
        
        const safeName = (cat.name || "").replace(/'/g, "\\'"); 

        const catEl = document.createElement('div');
        catEl.className = 'cat-card';
        catEl.innerHTML = `
            <div class="cat-header" onclick="this.parentElement.classList.toggle('open')">
                <div class="cat-title" title="${fullName}">
                    <i class="fas fa-folder" style="color:var(--primary)"></i>
                    ${displayName}
                    <span class="cat-badge">${subcats.length}</span>
                </div>
                
                <div class="cat-actions">
                    <button class="btn-icon-sm" onclick="event.stopPropagation(); editCategory('${safeName}')">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="btn-icon-sm text-error" onclick="event.stopPropagation(); deleteCategory('${safeName}')">
                        <i class="fas fa-trash"></i>
                    </button>
                    <i class="fas fa-chevron-down chevron"></i>
                </div>
            </div>

            <div class="cat-body">
                <div style="padding:10px; text-align:center; border-bottom:1px solid var(--glass-border);">
                    <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); goToAddProduct(${catIdx})">
                        <i class="fas fa-plus"></i> ${t('btn_add_here')}
                    </button>
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
            
            // ANCHE QUI: Short Name per i prodotti
            const prodDisplayName = prod.short_name || prod.name;
            const prodFullName = (prod.short_name && prod.name !== prod.short_name) ? prod.name : '';
            const shortDesc = prod.description ? prod.description.substring(0, 60) + '...' : '';

            const prodEl = document.createElement('div');
            prodEl.className = `prod-item ${statusClass}`;
            prodEl.innerHTML = `
                <div class="prod-info">
                    <div class="prod-name">
                        ${prodDisplayName} 
                        ${isActive ? `<i class="fas fa-check-circle" style="color:var(--success); font-size:10px;"></i>` : ''}
                    </div>
                    ${prodFullName ? `<div class="prod-full-name">${prodFullName}</div>` : ''}
                    <div class="prod-desc">${shortDesc}</div>
                </div>
                <button class="btn-action ${btnClass}" onclick="openProduct('${targetPage}', ${catIdx}, ${prodIdx})">
                    ${icon}
                    <span>${actionLabel}</span>
                </button>
            `;
            prodContainer.appendChild(prodEl);
        });

        container.appendChild(catEl);
    });

    const countGhost = document.getElementById('count-ghost');
    if(countGhost) countGhost.innerText = ghostCount;
    const countActive = document.getElementById('count-active');
    if(countActive) countActive.innerText = activeCount;
}

// UI ACTIONS & CRUD
window.goToAddProduct = function(catIdx) {
    location.href = `add-product.html?token=${token}&catIdx=${catIdx}&${urlParams.toString()}`;
}

window.openProduct = function(page, catIdx, prodIdx) {
    location.href = `${page}?token=${token}&cat=${catIdx}&prod=${prodIdx}&${urlParams.toString()}`;
}

window.editCategory = async function(oldName) {
    const newName = prompt(t('prompt_edit_cat'), oldName);
    if (!newName || newName.trim() === "" || newName === oldName) return;

    document.getElementById('loader').classList.remove('hidden');
    try {
        const payload = { action: 'edit_category', token: token, old_category_name: oldName, new_category_name: newName.trim(), ...getAllUrlParams() };
        const res = await fetch(CATALOG_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("Server Error");
        await loadCatalog(true);
        if(tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    } catch (e) { alert("Error: " + e.message); document.getElementById('loader').classList.add('hidden'); }
};

window.deleteCategory = async function(catName) {
    const confirmMsg = t('confirm_delete_cat').replace('{name}', catName);
    if (!confirm(confirmMsg)) return;

    document.getElementById('loader').classList.remove('hidden');
    try {
        const payload = { action: 'delete_category', token: token, category_name: catName, ...getAllUrlParams() };
        const res = await fetch(CATALOG_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("Server Error");
        await loadCatalog(true);
        if(tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('warning');
    } catch (e) { alert("Error: " + e.message); document.getElementById('loader').classList.add('hidden'); }
};

// INIT
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    loadCatalog();
});
