const tg = window.Telegram.WebApp;
tg.ready(); 
tg.expand();

// CONFIG
const DASHBOARD_API = "https://trinai.api.workflow.dcmake.it/webhook/ef4aece4-9ec0-4026-a7a7-328562bcbdf6"; 

// 1. DIZIONARIO TRADUZIONI COMPLETO
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
        popup_site_title: "Site Builder", popup_site_msg: "Il modulo Sito Web Statico è in fase di sviluppo.",
        game_title: "🎮 GAME OVER!", game_msg: "Hai guadagnato {points} Crediti AI!",
        status_hp_lock: "⛔ DA CONFIGURARE", status_hp_ok: "✅ Attivo",
        status_no_op: "Nessun Operatore", status_active: "Attivi", status_req: "⚠️ Richiesto"
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
        popup_site_title: "Site Builder", popup_site_msg: "Static Website module under development.",
        game_title: "🎮 GAME OVER!", game_msg: "You earned {points} AI Credits!",
        status_hp_lock: "⛔ SETUP REQUIRED", status_hp_ok: "✅ Active",
        status_no_op: "No Operators", status_active: "Active", status_req: "⚠️ Required"
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
        popup_site_title: "Site Builder", popup_site_msg: "Module Site Web en développement.",
        game_title: "🎮 GAME OVER !", game_msg: "Vous avez gagné {points} Crédits IA !",
        status_hp_lock: "⛔ À CONFIGURER", status_hp_ok: "✅ Actif",
        status_no_op: "Aucun Opérateur", status_active: "Actifs", status_req: "⚠️ Requis"
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
        popup_site_title: "Site Builder", popup_site_msg: "Webseiten-Modul in Entwicklung.",
        game_title: "🎮 GAME OVER!", game_msg: "Du hast {points} KI-Credits verdient!",
        status_hp_lock: "⛔ SETUP NÖTIG", status_hp_ok: "✅ Aktiv",
        status_no_op: "Keine Mitarbeiter", status_active: "Aktiv", status_req: "⚠️ Erforderlich"
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
        popup_site_title: "Site Builder", popup_site_msg: "Módulo Sitio Web en desarrollo.",
        game_title: "🎮 ¡JUEGO TERMINADO!", game_msg: "¡Has ganado {points} Créditos IA!",
        status_hp_lock: "⛔ A CONFIGURAR", status_hp_ok: "✅ Activo",
        status_no_op: "Sin Operadores", status_active: "Activos", status_req: "⚠️ Requerido"
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
        popup_site_title: "Site Builder", popup_site_msg: "Módulo Website em desenvolvimento.",
        game_title: "🎮 FIM DE JOGO!", game_msg: "Ganhou {points} Créditos de IA!",
        status_hp_lock: "⛔ CONFIGURAR", status_hp_ok: "✅ Ativo",
        status_no_op: "Sem Operadores", status_active: "Ativos", status_req: "⚠️ Obrigatório"
    }
};

function getLang() {
    const l = (new URLSearchParams(window.location.search)).get('lang') || 'it';
    const norm = l.toLowerCase().slice(0, 2); 
    return i18n[norm] ? norm : 'en';
}

function t(key) {
    return i18n[getLang()][key] || i18n['en'][key] || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerText = t(el.getAttribute('data-i18n'));
    });
}

// ---------------------------------------------------------
// FUNZIONE PRINCIPALE
// ---------------------------------------------------------
async function startDashboard() {
    applyTranslations();

    // 1. RECUPERA PARAMETRI URL
    const p = new URLSearchParams(window.location.search);
    const vat = p.get('vat'); 
    const owner = p.get('owner'); 
    const token = p.get('token'); 

    if (!vat || !owner) { 
        document.body.innerHTML = `<h3 style='color:white;text-align:center;margin-top:50px'>${t('err_title')}</h3>`; 
        return; 
    }

    // 2. GESTIONE CREDITI BONUS (FIRE & FORGET)
    const bonus = p.get('bonus_credits');
    if (bonus && parseInt(bonus) > 0) {
        const points = parseInt(bonus);
        
        // Manda al backend (che farà la somma nel DB)
        fetch(DASHBOARD_API, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                action: 'add_gamification_credits', 
                vat_number: vat, 
                chat_id: owner, 
                amount: points, 
                token: token // TOKEN
            })
        }).catch(console.error);

        // Feedback Utente (Popup)
        try {
            if(tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
            if(tg.showPopup) tg.showPopup({ title: t('game_title'), message: t('game_msg').replace('{points}', points) });
        } catch(e) {}

        // Pulisce URL (Nessun calcolo locale)
        const newUrl = window.location.href.replace(/&bonus_credits=\d+/, '');
        window.history.replaceState({}, document.title, newUrl);
    }

    // 3. CHIAMATA DATI DASHBOARD (Il backend restituirà il saldo aggiornato o meno)
    try {
        const response = await fetch(DASHBOARD_API, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                action: 'get_dashboard_data', 
                vat_number: vat, 
                chat_id: owner, 
                token: token // TOKEN
            })
        });

        const rawJson = await response.json();
        const data = Array.isArray(rawJson) ? rawJson[0] : rawJson;

        if (!response.ok || data.status === 'error') {
            throw new Error(data.error?.message || "Server Error");
        }

        renderDashboard(data, vat);

    } catch (error) {
        console.error(error);
        document.body.innerHTML = `<h3 style='color:white;text-align:center;margin-top:50px'>Connessione Fallita</h3><p style='color:#ccc;text-align:center'>${error.message}</p>`;
    }
}

// 4. RENDER UI
function renderDashboard(data, vat) {
    const owner = data.owner_data || {};
    const status = data.status || {};

    // Header Info
    document.getElementById('companyName').innerText = owner.ragione_sociale || "Azienda";
    document.getElementById('vatDisplay').innerText = `P.IVA: ${vat}`;
    
    // Header Crediti (MOSTRA SOLO QUELLO CHE ARRIVA DAL DB)
    document.getElementById('credits-display').innerText = owner.credits || 0;

    // Header Logo
    if (owner.logo_url) {
        const img = document.getElementById('header-logo');
        img.src = owner.logo_url;
        img.classList.remove('hidden');
    }

    // LOGICA LUCCHETTI
    const isHpReady = (status.honeypot === 'READY');
    const hpSub = document.getElementById('sub-hp');
    const hpCard = document.getElementById('card-hp');

    if (!isHpReady) {
        hpSub.innerText = t('status_hp_lock');
        hpSub.classList.add('text-warning');
        hpCard.style.border = '1px solid var(--warning)';
        ['card-catalog', 'card-agenda', 'card-team', 'card-knowledge'].forEach(id => document.getElementById(id).classList.add('locked-item'));
    } else {
        hpSub.innerText = t('status_hp_ok');
        hpSub.classList.add('text-success');
        hpCard.classList.add('border-success');
        ['card-catalog', 'card-agenda', 'card-team', 'card-knowledge'].forEach(id => document.getElementById(id).classList.remove('locked-item'));
    }

    // Labels e Contatori
    document.getElementById('sub-catalog').innerHTML = `Cat: <b>${status.categories_count}</b> | Prod: <b>${status.products_count}</b>`;
    
    if (status.blueprints_count > 0) {
        document.getElementById('sub-agenda').innerText = t('status_active');
        document.getElementById('sub-knowledge').innerText = `${status.knowledge_docs} Docs`;
    } else {
        document.getElementById('sub-agenda').innerText = t('status_req');
        document.getElementById('sub-knowledge').innerText = t('status_req');
        document.getElementById('card-agenda').classList.add('locked-item');
        document.getElementById('card-knowledge').classList.add('locked-item');
    }

    if (status.operators_count > 0) {
        document.getElementById('sub-team').innerText = `${status.operators_count} ${t('status_active')}`;
    } else {
        document.getElementById('sub-team').innerText = t('status_no_op');
        document.getElementById('card-team').classList.add('locked-item');
    }

    if (status.profile_completion < 100) {
        document.getElementById('sub-config').innerText = `${status.profile_completion}%`;
        document.getElementById('sub-config').classList.add('text-warning');
    }

    document.getElementById('loader').classList.add('hidden');
    document.getElementById('app-content').classList.remove('hidden');
}

// 5. NAVIGAZIONE
window.navTo = function(page) {
    const p = new URLSearchParams(window.location.search);
    p.delete('bonus_credits'); 
    window.location.href = `${page}?${p.toString()}`;
}

window.openWidget = () => navTo('SiteBos.html');
window.openSite = () => { 
    const txt = i18n[getLang()];
    try { tg.showPopup({ title: txt.popup_site_title, message: txt.popup_site_msg }); } catch(e) { alert(txt.popup_site_msg); }
}

// AVVIO
startDashboard();
