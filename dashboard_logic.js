const tg = window.Telegram.WebApp;
tg.ready(); tg.expand();

// CONFIG
const DASHBOARD_API = "https://trinai.api.workflow.dcmake.it/webhook/ef4aece4-9ec0-4026-a7a7-328562bcbdf6"; 

// I18N COMPLETO (6 Lingue)
const i18n = {
    it: { 
        btn_widget: "Widget", btn_site: "Sito", 
        section_operations: "Gestione Operativa", 
        card_hp: "HoneyPot", sub_hp: "Gestisci Risposte", 
        card_catalog: "Catalogo", sub_catalog: "Prodotti & Servizi", 
        card_agenda: "Agenda", sub_agenda: "Appuntamenti", 
        card_team: "Collaboratori", sub_team: "Team & Ruoli", 
        card_company: "Dati Aziendali", sub_company: "Configurazione", 
        card_knowledge: "Conoscenza", sub_knowledge: "Documenti & Asset", 
        err_title: "⛔ Errore Parametri", err_msg: "Apri dal Bot Telegram.", 
        popup_site_title: "Site Builder", popup_site_msg: "Reindirizzamento al Site Builder...",
        game_title: "🎮 GAME OVER!", game_msg: "Hai guadagnato {points} Crediti AI nell'attesa!",
        status_hp_lock: "⛔ DA CONFIGURARE", status_hp_ok: "✅ Attivo",
        status_no_op: "Nessun Operatore", status_active: "Attivi", status_blueprint_req: "⚠️ Crea Blueprint"
    },
    en: { 
        btn_widget: "Widget", btn_site: "Site", 
        section_operations: "Operations", 
        card_hp: "HoneyPot", sub_hp: "Manage Responses", 
        card_catalog: "Catalog", sub_catalog: "Products & Services", 
        card_agenda: "Agenda", sub_agenda: "Appointments", 
        card_team: "Team", sub_team: "Staff & Roles", 
        card_company: "Company Data", sub_company: "Configuration", 
        card_knowledge: "Knowledge", sub_knowledge: "Docs & Assets", 
        err_title: "⛔ Param Error", err_msg: "Open from Telegram Bot.", 
        popup_site_title: "Site Builder", popup_site_msg: "Redirecting...",
        game_title: "🎮 GAME OVER!", game_msg: "You earned {points} AI Credits while waiting!",
        status_hp_lock: "⛔ SETUP REQUIRED", status_hp_ok: "✅ Active",
        status_no_op: "No Operators", status_active: "Active", status_blueprint_req: "⚠️ Create Blueprint"
    },
    fr: { 
        btn_widget: "Widget", btn_site: "Site", 
        section_operations: "Gestion Opérationnelle", 
        card_hp: "HoneyPot", sub_hp: "Gérer Réponses", 
        card_catalog: "Catalogue", sub_catalog: "Produits & Services", 
        card_agenda: "Agenda", sub_agenda: "Rendez-vous", 
        card_team: "Équipe", sub_team: "Personnel & Rôles", 
        card_company: "Données Entreprise", sub_company: "Configuration", 
        card_knowledge: "Connaissances", sub_knowledge: "Docs & Actifs", 
        err_title: "⛔ Erreur Param", err_msg: "Ouvrir via Bot Telegram.", 
        popup_site_title: "Site Builder", popup_site_msg: "Redirection...",
        game_title: "🎮 GAME OVER !", game_msg: "Vous avez gagné {points} Crédits IA !",
        status_hp_lock: "⛔ À CONFIGURER", status_hp_ok: "✅ Actif",
        status_no_op: "Aucun Opérateur", status_active: "Actifs", status_blueprint_req: "⚠️ Créer Blueprint"
    },
    de: { 
        btn_widget: "Widget", btn_site: "Webseite", 
        section_operations: "Betriebsführung", 
        card_hp: "HoneyPot", sub_hp: "Antworten verwalten", 
        card_catalog: "Katalog", sub_catalog: "Produkte & Dienste", 
        card_agenda: "Agenda", sub_agenda: "Termine", 
        card_team: "Mitarbeiter", sub_team: "Team & Rollen", 
        card_company: "Firmendaten", sub_company: "Konfiguration", 
        card_knowledge: "Wissen", sub_knowledge: "Dokumente & Assets", 
        err_title: "⛔ Parameterfehler", err_msg: "Über Telegram Bot öffnen.", 
        popup_site_title: "Site Builder", popup_site_msg: "Weiterleitung...",
        game_title: "🎮 GAME OVER!", game_msg: "Du hast {points} KI-Credits verdient!",
        status_hp_lock: "⛔ SETUP NÖTIG", status_hp_ok: "✅ Aktiv",
        status_no_op: "Keine Mitarbeiter", status_active: "Aktiv", status_blueprint_req: "⚠️ Blueprint erstellen"
    },
    es: { 
        btn_widget: "Widget", btn_site: "Sitio", 
        section_operations: "Gestión Operativa", 
        card_hp: "HoneyPot", sub_hp: "Gestionar Respuestas", 
        card_catalog: "Catálogo", sub_catalog: "Productos y Servicios", 
        card_agenda: "Agenda", sub_agenda: "Citas", 
        card_team: "Colaboradores", sub_team: "Equipo y Roles", 
        card_company: "Datos Empresa", sub_company: "Configuración", 
        card_knowledge: "Conocimiento", sub_knowledge: "Docs y Activos", 
        err_title: "⛔ Error Param", err_msg: "Abrir desde Bot Telegram.", 
        popup_site_title: "Site Builder", popup_site_msg: "Redirigiendo...",
        game_title: "🎮 ¡JUEGO TERMINADO!", game_msg: "¡Has ganado {points} Créditos IA!",
        status_hp_lock: "⛔ A CONFIGURAR", status_hp_ok: "✅ Activo",
        status_no_op: "Sin Operadores", status_active: "Activos", status_blueprint_req: "⚠️ Crear Blueprint"
    },
    pt: { 
        btn_widget: "Widget", btn_site: "Site", 
        section_operations: "Gestão Operacional", 
        card_hp: "HoneyPot", sub_hp: "Gerir Respostas", 
        card_catalog: "Catálogo", sub_catalog: "Produtos e Serviços", 
        card_agenda: "Agenda", sub_agenda: "Compromissos", 
        card_team: "Colaboradores", sub_team: "Equipa e Funções", 
        card_company: "Dados da Empresa", sub_company: "Configuração", 
        card_knowledge: "Conhecimento", sub_knowledge: "Docs e Ativos", 
        err_title: "⛔ Erro Param", err_msg: "Abrir via Bot Telegram.", 
        popup_site_title: "Site Builder", popup_site_msg: "A redirecionar...",
        game_title: "🎮 FIM DE JOGO!", game_msg: "Ganhou {points} Créditos de IA!",
        status_hp_lock: "⛔ CONFIGURAR", status_hp_ok: "✅ Ativo",
        status_no_op: "Sem Operadores", status_active: "Ativos", status_blueprint_req: "⚠️ Criar Blueprint"
    }
};

function getLang() {
    const p = new URLSearchParams(window.location.search);
    const l = p.get('lang') || tg.initDataUnsafe?.user?.language_code || 'it';
    const norm = l.toLowerCase().slice(0, 2); 
    return i18n[norm] ? norm : 'en';
}

function applyTranslations() {
    const t = i18n[getLang()];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(t[key]) el.innerText = t[key];
    });
}

// Globali
let gVat = "", gOwner = "", gToken = "";

async function startDashboard() {
    applyTranslations();
    const p = new URLSearchParams(window.location.search);
    gVat = p.get('vat'); gOwner = p.get('owner'); gToken = p.get('token');

    if (!gVat || !gOwner) { 
        document.body.innerHTML = `<h3 style='color:white;text-align:center;margin-top:50px'>${i18n[getLang()].err_title}</h3>`; 
        return; 
    }

    try {
        const response = await fetch(DASHBOARD_API, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                action: 'get_dashboard_data', 
                vat_number: gVat, 
                chat_id: gOwner, 
                token: gToken // <<< TOKEN INCLUSO
            })
        });

        let data = await response.json();
        data = Array.isArray(data) ? data[0] : data;

        if (!response.ok || data.status === 'error') {
            document.body.innerHTML = `<h3 style='color:white;text-align:center;margin-top:50px'>${data.error?.message || "Server Error"}</h3>`;
            return;
        }

        // 1. UPDATE HEADER
        const owner = data.owner_data || {};
        document.getElementById('companyName').innerText = owner.ragione_sociale || "Azienda";
        document.getElementById('vatDisplay').innerText = `P.IVA: ${owner.vat_number}`;
        document.getElementById('credits-display').innerText = owner.credits || 0;
        
        if(owner.logo_url) {
            const img = document.getElementById('header-logo');
            img.src = owner.logo_url;
            img.classList.remove('hidden');
        }

        // 2. UPDATE LOGICA
        if(data.status) updateDashboardStatus(data.status);

        document.getElementById('loader').classList.add('hidden');
        document.getElementById('app-content').classList.remove('hidden');

        // Gamification con token
        handleGamification(gVat, gOwner, gToken);

    } catch (error) {
        console.error(error);
        document.body.innerHTML = `<h3 style='color:white;text-align:center;'>Connection Error</h3>`;
    }
}

function updateDashboardStatus(status) {
    const t = i18n[getLang()]; 

    // A. HONEYPOT (Master Key)
    const isHpReady = (status.honeypot === 'READY');
    const hpSub = document.getElementById('sub-hp');
    const hpCard = document.getElementById('card-hp');

    if (!isHpReady) {
        hpSub.innerText = t.status_hp_lock;
        hpSub.classList.add('text-warning');
        hpCard.style.border = '1px solid var(--warning)';
        ['card-catalog', 'card-agenda', 'card-team', 'card-knowledge'].forEach(lock);
        return; 
    } else {
        hpSub.innerText = t.status_hp_ok;
        hpSub.classList.add('text-success');
        hpCard.classList.add('border-success'); 
    }

    // B. CATALOGO
    unlock('card-catalog'); 
    const subCat = document.getElementById('sub-catalog');
    subCat.innerHTML = `Cat: <b>${status.categories_count}</b> | Prod: <b>${status.products_count}</b>`;
    if (status.products_count > 0 && status.blueprints_count === 0) {
        subCat.classList.add('text-warning');
    }

    // C. CONOSCENZA & AGENDA
    const hasBlueprints = status.blueprints_count > 0;
    
    if (hasBlueprints) {
        unlock('card-agenda');
        document.getElementById('sub-agenda').innerText = t.status_active;
        unlock('card-knowledge');
        document.getElementById('sub-knowledge').innerText = `${status.knowledge_docs} Docs`;
    } else {
        lock('card-agenda');
        document.getElementById('sub-agenda').innerText = t.status_blueprint_req;
        lock('card-knowledge');
        document.getElementById('sub-knowledge').innerText = t.status_blueprint_req;
    }

    // D. TEAM
    if (status.operators_count > 0) {
        unlock('card-team');
        document.getElementById('sub-team').innerText = `${status.operators_count} ${t.status_active}`;
    } else {
        lock('card-team');
        document.getElementById('sub-team').innerText = t.status_no_op;
    }

    // E. CONFIG
    if (status.profile_completion < 100) {
        document.getElementById('sub-config').innerText = `${status.profile_completion}%`;
        document.getElementById('sub-config').classList.add('text-warning');
    }
}

function lock(id) { const el = document.getElementById(id); if(el) el.classList.add('locked-item'); }
function unlock(id) { const el = document.getElementById(id); if(el) el.classList.remove('locked-item'); }

window.navTo = function(page) {
    const currentQuery = window.location.search.replace(/&bonus_credits=\d+/, '');
    const prefix = page.includes('?') ? '&' : '?';
    // Assicura che gToken sia presente nell'url se non c'è già
    let q = currentQuery.startsWith('?') ? currentQuery.substring(1) : currentQuery;
    if(!q.includes('token=') && gToken) q += `&token=${gToken}`;
    
    window.location.href = `${page}${prefix}${q}`;
}

window.openWidget = () => navTo('SiteBos.html');
window.openSite = () => navTo('sitebuilder.html');

// FIX: Token passato anche qui
function handleGamification(vat, ownerId, token) {
    const p = new URLSearchParams(window.location.search);
    const bonus = p.get('bonus_credits');
    
    if (bonus && parseInt(bonus) > 0) {
        const points = parseInt(bonus);
        
        fetch(DASHBOARD_API, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                action: 'add_gamification_credits', 
                vat_number: vat, 
                chat_id: ownerId, 
                amount: points,
                token: token // <<< TOKEN QUI
            })
        }).catch(console.error);
        
        if(tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        const t = i18n[getLang()];
        const msg = (t.game_msg || "Earned {points} Credits!").replace('{points}', points);
        
        tg.showPopup({ title: t.game_title, message: msg });
        
        const newUrl = window.location.href.replace(/&bonus_credits=\d+/, '');
        window.history.replaceState({}, document.title, newUrl);
        
        const cur = parseInt(document.getElementById('credits-display').innerText) || 0;
        document.getElementById('credits-display').innerText = cur + points;
    }
}

startDashboard();
