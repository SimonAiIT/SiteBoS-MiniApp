// catalog_logic.js
// Gestione Catalogo Multilingua con Webhook Dedicato

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
        status_active: "Attivo", btn_manage: "Gestisci", btn_activate: "Attiva"
    },
    en: {
        title: "Service Catalog", subtitle: "Active products & AI suggestions.",
        ghost_label: "Suggested", active_label: "Active",
        btn_reload: "Reload", btn_new_cat: "New Category",
        empty_title: "No catalog found.", empty_btn: "Create First Category",
        btn_add_here: "Add Product here",
        status_active: "Active", btn_manage: "Manage", btn_activate: "Activate"
    },
    fr: {
        title: "Catalogue Services", subtitle: "Produits actifs & suggestions IA.",
        ghost_label: "Suggérés", active_label: "Actifs",
        btn_reload: "Recharger", btn_new_cat: "Nouvelle Catégorie",
        empty_title: "Aucun catalogue trouvé.", empty_btn: "Créer Première Catégorie",
        btn_add_here: "Ajouter Produit ici",
        status_active: "Actif", btn_manage: "Gérer", btn_activate: "Activer"
    },
    de: {
        title: "Service-Katalog", subtitle: "Aktive Produkte & KI-Vorschläge.",
        ghost_label: "Vorgeschlagen", active_label: "Aktiv",
        btn_reload: "Neu laden", btn_new_cat: "Neue Kategorie",
        empty_title: "Kein Katalog gefunden.", empty_btn: "Erste Kategorie erstellen",
        btn_add_here: "Produkt hier hinzufügen",
        status_active: "Aktiv", btn_manage: "Verwalten", btn_activate: "Aktivieren"
    },
    es: {
        title: "Catálogo Servicios", subtitle: "Productos activos y sugerencias IA.",
        ghost_label: "Sugeridos", active_label: "Activos",
        btn_reload: "Recargar", btn_new_cat: "Nueva Categoría",
        empty_title: "No se encontró catálogo.", empty_btn: "Crear Primera Categoría",
        btn_add_here: "Añadir Producto aquí",
        status_active: "Activo", btn_manage: "Gestionar", btn_activate: "Activar"
    },
    pt: {
        title: "Catálogo Serviços", subtitle: "Produtos ativos e sugestões IA.",
        ghost_label: "Sugeridos", active_label: "Ativos",
        btn_reload: "Recarregar", btn_new_cat: "Nova Categoria",
        empty_title: "Nenhum catálogo encontrado.", empty_btn: "Criar Primeira Categoria",
        btn_add_here: "Adicionar Produto aqui",
        status_active: "Ativo", btn_manage: "Gerir", btn_activate: "Ativar"
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
    // Funzione helper sicura: cerca l'elemento e, se esiste, cambia il testo
    const safeSetText = (selector, key) => {
        const el = document.querySelector(selector);
        if (el) el.innerText = t(key);
    };

    // 1. Header (H1 e Small non hanno ID, usiamo le classi)
    safeSetText('.header-info h1', 'title');
    safeSetText('.header-info small', 'subtitle');

    // 2. Stats Labels (Sono dentro .dash-sub vicino agli ID dei contatori)
    // Cerchiamo il div che contiene l'ID count-ghost e prendiamo il suo vicino .dash-sub
    const ghostLabel = document.querySelector('#count-ghost + .dash-sub');
    if (ghostLabel) ghostLabel.innerText = t('ghost_label');

    const activeLabel = document.querySelector('#count-active + .dash-sub');
    if (activeLabel) activeLabel.innerText = t('active_label');

    // 3. Bottone Nuova Categoria (Non ha ID, usiamo le classi del bottone)
    const btnNewCat = document.querySelector('.btn-secondary.btn-block');
    if (btnNewCat) {
        // Nota: Qui usiamo innerHTML perché c'è l'icona <i>
        btnNewCat.innerHTML = `<i class="fas fa-plus"></i> ${t('btn_new_cat')}`;
    }

    // 4. Empty State (P e Button dentro #empty-state)
    safeSetText('#empty-state p', 'empty_title');
    safeSetText('#empty-state button', 'empty_btn');
}

// NAVIGAZIONE
window.goBack = function() {
    if(window.history.length > 1) window.history.back();
    else tg.close();
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
    if (!token) { alert("Token mancante"); return; }
    
    if(forceRefresh) {
        document.getElementById('catalog-list').innerHTML = '';
        document.getElementById('loader').classList.remove('hidden');
    }

    try {
        // Costruisce il payload con ACTION + TOKEN + TUTTI I PARAMETRI URL
        const payload = {
            action: 'get_catalog',
            token: token,
            ...getAllUrlParams() // Espande vat, owner, lang, etc. nel body
        };

        const res = await fetch(CATALOG_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Errore server");
        const json = await res.json();
        
        // Gestione flessibile risposta
        catalogData = json.catalog || json.data || json;
        
        renderCatalog();
        
    } catch (e) {
        console.error(e);
        document.getElementById('empty-state').innerHTML = `<i class="fas fa-exclamation-triangle" style="font-size:40px; color:var(--error)"></i><p>${e.message}</p>`;
        document.getElementById('empty-state').classList.remove('hidden');
    } finally {
        document.getElementById('loader').classList.add('hidden');
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
    document.getElementById('empty-state').classList.add('hidden');

    let ghostCount = 0;
    let activeCount = 0;

    categories.forEach((cat, catIdx) => {
        const subcats = cat.subcategories || [];
        
        const catActive = subcats.filter(p => p.blueprint_ready).length;
        const catGhost = subcats.length - catActive;
        
        activeCount += catActive;
        ghostCount += catGhost;

        const catEl = document.createElement('div');
        catEl.className = 'cat-card';
        catEl.innerHTML = `
            <div class="cat-header" onclick="toggleCat(this)">
                <div class="cat-title">
                    <i class="fas fa-folder" style="color:var(--primary)"></i>
                    ${cat.name}
                    <span class="cat-badge">${subcats.length}</span>
                </div>
                <i class="fas fa-chevron-down chevron"></i>
            </div>
            <div class="cat-body">
                <div style="padding:10px; text-align:center; border-bottom:1px solid var(--glass-border);">
                    <button class="btn-mini" onclick="goToAddProduct(${catIdx})">
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
            
            const shortDesc = prod.description ? prod.description.substring(0, 50) + '...' : '';

            const prodEl = document.createElement('div');
            prodEl.className = `prod-item ${statusClass}`;
            prodEl.innerHTML = `
                <div class="prod-info">
                    <div class="prod-name">
                        ${prod.name} 
                        ${isActive ? `<i class="fas fa-check-circle" style="color:var(--success); font-size:10px;" title="${t('status_active')}"></i>` : ''}
                    </div>
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

    // Aggiorna Stats
    document.getElementById('count-ghost').innerText = ghostCount;
    document.getElementById('count-active').innerText = activeCount;
}

// UI ACTIONS
window.toggleCat = function(header) {
    header.parentElement.classList.toggle('open');
}

window.goToAddProduct = function(catIdx) {
    location.href = `add-product.html?token=${token}&catIdx=${catIdx}&${urlParams.toString()}`;
}

window.openProduct = function(page, catIdx, prodIdx) {
    location.href = `${page}?token=${token}&cat=${catIdx}&prod=${prodIdx}&${urlParams.toString()}`;
}

// START
applyTranslations();
loadCatalog();
