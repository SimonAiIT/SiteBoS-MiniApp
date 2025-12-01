// catalog_logic.js

// ============================================================
// CONFIGURAZIONE
// ============================================================
// INCOLLA QUI IL TUO NUOVO WEBHOOK CATALOGO "FRESCO"
const CATALOG_WEBHOOK = "https://trinai.api.workflow.dcmake.it/webhook/0fff7fa2-bcb2-4b50-a26b-589b7054952e";

// ============================================================

const tg = window.Telegram.WebApp;
tg.ready(); tg.expand();

let catalogData = null;
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

// NAVIGAZIONE
window.goBack = function() {
    if(window.history.length > 1) window.history.back();
    else tg.close();
}

// CARICAMENTO DATI
async function loadCatalog(forceRefresh = false) {
    if (!CATALOG_WEBHOOK) {
        alert("CONFIG ERROR: Manca CATALOG_WEBHOOK in catalog_logic.js");
        return;
    }
    if (!token) { alert("Token mancante"); return; }
    
    if(forceRefresh) {
        document.getElementById('catalog-list').innerHTML = '';
        document.getElementById('loader').classList.remove('hidden');
    }

    try {
        // Chiamata al webhook dedicato 'get_catalog'
        const res = await fetch(CATALOG_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'get_catalog', token: token })
        });

        if (!res.ok) throw new Error("Errore server");
        const json = await res.json();
        
        // Gestisce sia formato diretto {categories:[]} che nested {data:{categories:[]}}
        catalogData = json.catalog || json.data || json;
        
        renderCatalog();
        
    } catch (e) {
        console.error(e);
        // Fallback per test se il webhook è vuoto o fallisce
        document.getElementById('empty-state').innerHTML += `<br><small style='color:red'>${e.message}</small>`;
        document.getElementById('empty-state').classList.remove('hidden');
    } finally {
        document.getElementById('loader').classList.add('hidden');
        document.getElementById('app-content').classList.remove('hidden');
    }
}

// RENDERIZZAZIONE
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

        // HTML Categoria
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
                <!-- Tasto rapido per aggiungere prodotto in questa categoria -->
                <div style="padding:10px; text-align:center; border-bottom:1px solid var(--glass-border);">
                    <button class="btn-mini" onclick="goToAddProduct(${catIdx})">
                        <i class="fas fa-plus"></i> Aggiungi Prodotto qui
                    </button>
                </div>
                <!-- Prodotti -->
                <div class="products-container"></div>
            </div>
        `;

        // Inserimento Prodotti
        const prodContainer = catEl.querySelector('.products-container');
        
        subcats.forEach((prod, prodIdx) => {
            const isActive = prod.blueprint_ready === true;
            const statusClass = isActive ? 'status-active' : 'status-ghost';
            const icon = isActive ? '<i class="fas fa-sliders-h"></i>' : '<i class="fas fa-magic"></i>';
            
            // Se è attivo usa edit-blueprint, se è ghost usa edit-product (o forge)
            const actionLabel = isActive ? 'Gestisci' : 'Attiva';
            const targetPage = isActive ? 'edit-blueprint.html' : 'edit-product.html';
            const btnClass = isActive ? 'btn-edit' : 'btn-create';
            
            const shortDesc = prod.description ? prod.description.substring(0, 50) + '...' : '';

            const prodEl = document.createElement('div');
            prodEl.className = `prod-item ${statusClass}`;
            prodEl.innerHTML = `
                <div class="prod-info">
                    <div class="prod-name">${prod.name} ${isActive ? '<i class="fas fa-check-circle" style="color:var(--success); font-size:10px;"></i>' : ''}</div>
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
    // Passiamo l'indice categoria per pre-selezionarla
    location.href = `add-product.html?token=${token}&catIdx=${catIdx}`;
}

window.openProduct = function(page, catIdx, prodIdx) {
    // Passiamo le coordinate del prodotto
    location.href = `${page}?token=${token}&cat=${catIdx}&prod=${prodIdx}`;
}

// START
loadCatalog();
