const tg = window.Telegram.WebApp;
tg.ready(); 
tg.expand();

// CONFIGURAZIONE
const DASHBOARD_API = "https://trinai.api.workflow.dcmake.it/webhook/ef4aece4-9ec0-4026-a7a7-328562bcbdf6"; 

// TRADUZIONI (Semplificate e corrette)
const i18n = {
    it: { btn_widget: "Widget", btn_site: "Sito", section_operations: "Gestione Operativa", card_hp: "HoneyPot", sub_hp: "Gestisci Risposte", card_catalog: "Catalogo", sub_catalog: "Prodotti & Servizi", card_agenda: "Agenda", sub_agenda: "Appuntamenti", card_team: "Collaboratori", sub_team: "Team & Ruoli", card_company: "Dati Aziendali", sub_company: "Configurazione", card_knowledge: "Conoscenza", sub_knowledge: "Documenti & Asset", game_title: "🎮 GAME OVER!", game_msg: "Hai guadagnato {points} Crediti AI!", status_hp_lock: "⛔ DA CONFIGURARE", status_hp_ok: "✅ Attivo", status_active: "Attivi", status_req: "⚠️ Richiesto" },
    en: { btn_widget: "Widget", btn_site: "Site", section_operations: "Operations", card_hp: "HoneyPot", sub_hp: "Manage Responses", card_catalog: "Catalog", sub_catalog: "Products & Services", card_agenda: "Agenda", sub_agenda: "Appointments", card_team: "Team", sub_team: "Staff & Roles", card_company: "Company Data", sub_company: "Configuration", card_knowledge: "Knowledge", sub_knowledge: "Docs & Assets", game_title: "🎮 GAME OVER!", game_msg: "You earned {points} AI Credits!", status_hp_lock: "⛔ SETUP REQUIRED", status_hp_ok: "✅ Active", status_active: "Active", status_req: "⚠️ Required" }
};

// RECUPERO LINGUA
function getLang() {
    const l = (new URLSearchParams(window.location.search)).get('lang') || 'it';
    return i18n[l] ? l : 'en'; // Fallback semplice
}

function t(key) {
    return i18n[getLang()][key] || i18n['en'][key] || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerText = t(el.getAttribute('data-i18n'));
    });
}

// =========================================================
// 1. GESTIONE CREDITI (GAMIFICATION) - ESEGUITA SUBITO
// =========================================================
function checkAndProcessCredits(vat, owner, token) {
    const p = new URLSearchParams(window.location.search);
    const bonusStr = p.get('bonus_credits');
    
    console.log("🎲 CHECK CREDITI:", bonusStr); // DEBUG

    if (bonusStr && parseInt(bonusStr) > 0) {
        const points = parseInt(bonusStr);

        // 1. Chiamata Backend (Fire & Forget)
        fetch(DASHBOARD_API, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                action: 'add_gamification_credits', 
                vat_number: vat, 
                chat_id: owner, 
                token: token,
                amount: points 
            })
        }).then(() => console.log("✅ Crediti salvati"))
          .catch(e => console.error("❌ Errore salvataggio crediti", e));

        // 2. Feedback UI Immediato
        if(tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        tg.showPopup({ 
            title: t('game_title'), 
            message: t('game_msg').replace('{points}', points) 
        });

        // 3. Aggiornamento UI Locale (senza aspettare il reload)
        setTimeout(() => {
            const el = document.getElementById('credits-display');
            if(el) {
                const current = parseInt(el.innerText) || 0;
                el.innerText = current + points;
            }
        }, 500);

        // 4. Pulizia URL (Per evitare loop)
        const newUrl = window.location.href.replace(/&bonus_credits=\d+/, '');
        window.history.replaceState({}, document.title, newUrl);
    }
}

// =========================================================
// 2. CARICAMENTO DASHBOARD
// =========================================================
async function initDashboard() {
    applyTranslations();

    const p = new URLSearchParams(window.location.search);
    const vat = p.get('vat');
    const owner = p.get('owner');
    const token = p.get('token');

    console.log("🚀 INIT DASHBOARD:", { vat, owner, token }); // DEBUG

    if (!vat || !owner) {
        document.body.innerHTML = "<h3 style='color:white;text-align:center;margin-top:50px'>⛔ ERRORE: Parametri mancanti nell'URL</h3>";
        return;
    }

    // Processa i crediti PRIMA di caricare tutto, così l'utente vede subito il feedback
    checkAndProcessCredits(vat, owner, token);

    try {
        const res = await fetch(DASHBOARD_API, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                action: 'get_dashboard_data', 
                vat_number: vat, 
                chat_id: owner, 
                token: token 
            })
        });

        const rawJson = await res.json();
        const data = Array.isArray(rawJson) ? rawJson[0] : rawJson;

        console.log("📥 DATI DASHBOARD:", data); // DEBUG

        if (!res.ok || data.status === 'error') {
            throw new Error(data.error?.message || "Errore Server Generico");
        }

        renderDashboard(data, vat);

    } catch (error) {
        console.error("❌ ERRORE FATALE:", error);
        document.body.innerHTML = `<h3 style='color:white;text-align:center;margin-top:50px'>Errore Caricamento</h3><p style='color:#ccc;text-align:center'>${error.message}</p>`;
    }
}

// =========================================================
// 3. RENDERIZZAZIONE UI
// =========================================================
function renderDashboard(data, vat) {
    const owner = data.owner_data || {};
    const status = data.status || {};

    // Header
    document.getElementById('companyName').innerText = owner.ragione_sociale || "Azienda";
    document.getElementById('vatDisplay').innerText = `P.IVA: ${vat}`;
    
    // Se i crediti non sono stati aggiornati dal bonus locale, usa quelli del DB
    const creditsEl = document.getElementById('credits-display');
    // Aggiorna solo se sembra che non abbiamo già sommato il bonus (logica semplice)
    if(parseInt(creditsEl.innerText) === 0) {
        creditsEl.innerText = owner.credits || 0;
    }

    if (owner.logo_url) {
        const img = document.getElementById('header-logo');
        img.src = owner.logo_url;
        img.classList.remove('hidden');
    }

    // Stati e Lucchetti
    const isHpReady = (status.honeypot === 'READY');
    const hpSub = document.getElementById('sub-hp');
    const hpCard = document.getElementById('card-hp');

    if (!isHpReady) {
        hpSub.innerText = t('status_hp_lock');
        hpSub.classList.add('text-warning');
        hpCard.style.border = '1px solid var(--warning)';
        ['card-catalog', 'card-agenda', 'card-team', 'card-knowledge'].forEach(id => {
            document.getElementById(id).classList.add('locked-item');
        });
    } else {
        hpSub.innerText = t('status_hp_ok');
        hpSub.classList.add('text-success');
        hpCard.classList.add('border-success');
        ['card-catalog', 'card-agenda', 'card-team', 'card-knowledge'].forEach(id => {
            document.getElementById(id).classList.remove('locked-item');
        });
    }

    // Labels
    document.getElementById('sub-catalog').innerHTML = `Cat: <b>${status.categories_count}</b> | Prod: <b>${status.products_count}</b>`;
    
    if (status.blueprints_count > 0) {
        document.getElementById('sub-agenda').innerText = t('status_active');
        document.getElementById('sub-knowledge').innerText = `${status.knowledge_docs} Docs`;
    } else {
        document.getElementById('sub-agenda').innerText = t('status_req');
        document.getElementById('sub-knowledge').innerText = t('status_req');
        // Riblocca se non ci sono blueprint
        document.getElementById('card-agenda').classList.add('locked-item');
        document.getElementById('card-knowledge').classList.add('locked-item');
    }

    if (status.operators_count > 0) {
        document.getElementById('sub-team').innerText = `${status.operators_count} ${t('status_active')}`;
    } else {
        document.getElementById('sub-team').innerText = "-";
    }

    if (status.profile_completion < 100) {
        document.getElementById('sub-config').innerText = `${status.profile_completion}%`;
        document.getElementById('sub-config').classList.add('text-warning');
    }

    document.getElementById('loader').classList.add('hidden');
    document.getElementById('app-content').classList.remove('hidden');
}

// =========================================================
// 4. NAVIGAZIONE
// =========================================================
window.navTo = function(page) {
    const p = new URLSearchParams(window.location.search);
    // Puliamo i crediti per non passarli alle pagine figlie
    p.delete('bonus_credits');
    
    // Costruiamo l'URL di destinazione mantenendo vat, owner, token, lang
    const dest = `${page}?${p.toString()}`;
    window.location.href = dest;
}

window.openWidget = () => navTo('SiteBos.html');
window.openSite = () => navTo('sitebuilder.html');

// AVVIO
initDashboard();
