/**
 * DASHBOARD LOGIC (v4.1 - Multilanguage Support)
 */

const tg = window.Telegram.WebApp;
tg.ready(); 
tg.expand();

// CONFIG
const DASHBOARD_API = "https://trinai.api.workflow.dcmake.it/webhook/ef4aece4-9ec0-4026-a7a7-328562bcbdf6"; 

// STATE
const state = {
    vat: null,
    ownerId: null,
    companyName: "Azienda"
};

// I18N DICTIONARY
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
        popup_site_title: "Sito Web", popup_site_msg: "Il modulo Sito Web Statico è in fase di sviluppo."
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
        popup_site_title: "Website", popup_site_msg: "Static Website module under development."
    },
    fr: {
        btn_widget: "Widget", btn_site: "Site",
        section_operations: "Opérations",
        card_hp: "HoneyPot", sub_hp: "Gérer Réponses",
        card_catalog: "Catalogue", sub_catalog: "Produits & Services",
        card_agenda: "Agenda", sub_agenda: "Rendez-vous",
        card_team: "Équipe", sub_team: "Personnel & Rôles",
        card_company: "Entreprise", sub_company: "Configuration",
        card_knowledge: "Connaissances", sub_knowledge: "Docs & Actifs",
        err_title: "⛔ Erreur Param", err_msg: "Ouvrir via Bot Telegram.",
        popup_site_title: "Site Web", popup_site_msg: "Module Site Web en développement."
    },
    de: {
        btn_widget: "Widget", btn_site: "Webseite",
        section_operations: "Betrieb",
        card_hp: "HoneyPot", sub_hp: "Antworten verwalten",
        card_catalog: "Katalog", sub_catalog: "Produkte & Dienste",
        card_agenda: "Agenda", sub_agenda: "Termine",
        card_team: "Team", sub_team: "Personal & Rollen",
        card_company: "Firmendaten", sub_company: "Konfiguration",
        card_knowledge: "Wissen", sub_knowledge: "Doks & Assets",
        err_title: "⛔ Parameterfehler", err_msg: "Über Telegram Bot öffnen.",
        popup_site_title: "Webseite", popup_site_msg: "Webseiten-Modul in Entwicklung."
    },
    es: {
        btn_widget: "Widget", btn_site: "Sitio",
        section_operations: "Operaciones",
        card_hp: "HoneyPot", sub_hp: "Gestionar Respuestas",
        card_catalog: "Catálogo", sub_catalog: "Productos y Servicios",
        card_agenda: "Agenda", sub_agenda: "Citas",
        card_team: "Equipo", sub_team: "Personal y Roles",
        card_company: "Empresa", sub_company: "Configuración",
        card_knowledge: "Conocimiento", sub_knowledge: "Docs y Activos",
        err_title: "⛔ Error Param", err_msg: "Abrir desde Bot Telegram.",
        popup_site_title: "Sitio Web", popup_site_msg: "Módulo Sitio Web en desarrollo."
    },
    pt: {
        btn_widget: "Widget", btn_site: "Site",
        section_operations: "Operações",
        card_hp: "HoneyPot", sub_hp: "Gerir Respostas",
        card_catalog: "Catálogo", sub_catalog: "Produtos e Serviços",
        card_agenda: "Agenda", sub_agenda: "Compromissos",
        card_team: "Equipa", sub_team: "Pessoal e Funções",
        card_company: "Empresa", sub_company: "Configuração",
        card_knowledge: "Conhecimento", sub_knowledge: "Docs e Ativos",
        err_title: "⛔ Erro Param", err_msg: "Abrir via Bot Telegram.",
        popup_site_title: "Website", popup_site_msg: "Módulo Website em desenvolvimento."
    }
};

function getLang() {
    const p = new URLSearchParams(window.location.search);
    const l = p.get('lang') || tg.initDataUnsafe?.user?.language_code || 'it';
    return i18n[l] ? l : 'en'; // Fallback EN
}

function applyTranslations() {
    const l = getLang();
    const t = i18n[l];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(t[key]) el.innerText = t[key];
    });
}

// INIT
document.addEventListener('DOMContentLoaded', async () => {
    applyTranslations(); // Applica subito le traduzioni
    
    const p = new URLSearchParams(window.location.search);
    state.vat = p.get('vat');
    state.ownerId = p.get('owner');
    
    // Fallback UI
    if(!state.vat) {
        const t = i18n[getLang()];
        document.body.innerHTML = `<div class='container text-center' style='padding-top:50px'><h3>${t.err_title}</h3><p>${t.err_msg}</p></div>`;
        return;
    }

    try {
        const urlName = p.get('ragione_sociale');
        if(urlName) {
            updateHeader(decodeURIComponent(urlName), state.vat);
            hideLoader();
        } else {
            const res = await fetch(DASHBOARD_API, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ action: 'get_header_data', vat_number: state.vat, chat_id: state.ownerId })
            });
            const data = await res.json();
            updateHeader(data.company_profile.name, state.vat);
            state.companyName = data.company_profile.name;
            hideLoader();
        }
    } catch (e) {
        console.error(e);
        updateHeader("My Company", state.vat);
        hideLoader();
    }
});

// UI FUNCTIONS
function updateHeader(name, vat) {
    document.getElementById('companyName').innerText = name;
    document.getElementById('vatDisplay').innerText = `P.IVA: ${vat}`;
}

function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('app-content').classList.remove('hidden');
}

// NAVIGATION
window.navTo = function(page) {
    const l = getLang();
    const target = `${page}?vat=${state.vat}&owner=${state.ownerId}&ragione_sociale=${encodeURIComponent(state.companyName)}&lang=${l}`;
    window.location.href = target;
}

window.openWidget = function() {
    navTo('SiteBos.html');
}

window.openSite = function() {
    const t = i18n[getLang()];
    tg.showPopup({
        title: t.popup_site_title,
        message: t.popup_site_msg
    });
}
