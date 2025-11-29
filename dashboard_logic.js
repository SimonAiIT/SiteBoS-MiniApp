const tg = window.Telegram.WebApp;
tg.ready(); 
tg.expand();

// CONFIG
const DASHBOARD_API = "https://trinai.api.workflow.dcmake.it/webhook/ef4aece4-9ec0-4026-a7a7-328562bcbdf6"; 

// I18N
const i18n = {
    it: { btn_widget: "Widget", btn_site: "Sito", section_operations: "Gestione Operativa", card_hp: "HoneyPot", sub_hp: "Gestisci Risposte", card_catalog: "Catalogo", sub_catalog: "Prodotti & Servizi", card_agenda: "Agenda", sub_agenda: "Appuntamenti", card_team: "Collaboratori", sub_team: "Team & Ruoli", card_company: "Dati Aziendali", sub_company: "Configurazione", card_knowledge: "Conoscenza", sub_knowledge: "Documenti & Asset", err_title: "⛔ Errore Parametri", err_msg: "Apri dal Bot Telegram.", popup_site_title: "Sito Web", popup_site_msg: "Il modulo Sito Web Statico è in fase di sviluppo." },
    en: { btn_widget: "Widget", btn_site: "Site", section_operations: "Operations", card_hp: "HoneyPot", sub_hp: "Manage Responses", card_catalog: "Catalog", sub_catalog: "Products & Services", card_agenda: "Agenda", sub_agenda: "Appointments", card_team: "Team", sub_team: "Staff & Roles", card_company: "Company Data", sub_company: "Configuration", card_knowledge: "Knowledge", sub_knowledge: "Docs & Assets", err_title: "⛔ Param Error", err_msg: "Open from Telegram Bot.", popup_site_title: "Website", popup_site_msg: "Static Website module under development." },
    fr: { btn_widget: "Widget", btn_site: "Site", section_operations: "Opérations", card_hp: "HoneyPot", sub_hp: "Gérer Réponses", card_catalog: "Catalogue", sub_catalog: "Produits & Services", card_agenda: "Agenda", sub_agenda: "Rendez-vous", card_team: "Équipe", sub_team: "Personnel & Rôles", card_company: "Entreprise", sub_company: "Configuration", card_knowledge: "Connaissances", sub_knowledge: "Docs & Actifs", err_title: "⛔ Erreur Param", err_msg: "Ouvrir via Bot Telegram.", popup_site_title: "Site Web", popup_site_msg: "Module Site Web en développement." },
    de: { btn_widget: "Widget", btn_site: "Webseite", section_operations: "Betrieb", card_hp: "HoneyPot", sub_hp: "Antworten verwalten", card_catalog: "Katalog", sub_catalog: "Produkte & Dienste", card_agenda: "Agenda", sub_agenda: "Termine", card_team: "Team", sub_team: "Personal & Rollen", card_company: "Firmendaten", sub_company: "Konfiguration", card_knowledge: "Wissen", sub_knowledge: "Doks & Assets", err_title: "⛔ Parameterfehler", err_msg: "Über Telegram Bot öffnen.", popup_site_title: "Webseite", popup_site_msg: "Webseiten-Modul in Entwicklung." },
    es: { btn_widget: "Widget", btn_site: "Sitio", section_operations: "Operaciones", card_hp: "HoneyPot", sub_hp: "Gestionar Respuestas", card_catalog: "Catálogo", sub_catalog: "Productos y Servicios", card_agenda: "Agenda", sub_agenda: "Citas", card_team: "Equipo", sub_team: "Personal y Roles", card_company: "Empresa", sub_company: "Configuración", card_knowledge: "Conocimiento", sub_knowledge: "Docs y Activos", err_title: "⛔ Error Param", err_msg: "Abrir desde Bot Telegram.", popup_site_title: "Sitio Web", popup_site_msg: "Módulo Sitio Web en desarrollo." },
    pt: { btn_widget: "Widget", btn_site: "Site", section_operations: "Operações", card_hp: "HoneyPot", sub_hp: "Gerir Respostas", card_catalog: "Catálogo", sub_catalog: "Produtos e Serviços", card_agenda: "Agenda", sub_agenda: "Compromissos", card_team: "Equipa", sub_team: "Pessoal e Funções", card_company: "Empresa", sub_company: "Configuração", card_knowledge: "Conhecimento", sub_knowledge: "Docs e Ativos", err_title: "⛔ Erro Param", err_msg: "Abrir via Bot Telegram.", popup_site_title: "Website", popup_site_msg: "Módulo Website em desenvolvimento." }
};

// HELPER LINGUA
function getLang() {
    const p = new URLSearchParams(window.location.search);
    const l = p.get('lang') || tg.initDataUnsafe?.user?.language_code || 'it';
    const norm = l.toLowerCase().slice(0, 2); 
    return i18n[norm] ? norm : 'en';
}

function applyTranslations() {
    const l = getLang();
    const t = i18n[l];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(t[key]) el.innerText = t[key];
    });
}

// ---------------------------------------------------------
// FUNZIONE PRINCIPALE (Triggerata subito)
// ---------------------------------------------------------
async function startDashboard() {
    
    // 1. Applica Lingua
    applyTranslations();

    // 2. Prendi Parametri
    const p = new URLSearchParams(window.location.search);
    const vat = p.get('vat');
    const ownerId = p.get('owner');
    const token = p.get('token');

    // 3. Fallback UI se mancano i dati (Ma proviamo a caricare comunque se c'è almeno la PIVA)
    if (!vat || !ownerId) {
        document.body.innerHTML = "<h3 style='color:white;text-align:center;margin-top:50px'>⛔ ERRORE URL: Parametri mancanti</h3>";
        return;
    }

    try {
        console.log("🚀 AVVIO CHIAMATA DASHBOARD...");
        
        // 4. CHIAMATA AL BACKEND (QUESTA PARTE ORA E' SICURA)
        const response = await fetch(DASHBOARD_API, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                action: 'get_dashboard_data',
                vat_number: vat,
                chat_id: ownerId,
                token: token
            })
        });

        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        console.log("✅ DATI RICEVUTI:", data);

        // 5. AGGIORNAMENTO UI
        // Nome Azienda
        const companyName = data.company_profile?.name || data.owner_data?.ragione_sociale || "Azienda";
        document.getElementById('companyName').innerText = companyName;
        document.getElementById('vatDisplay').innerText = `P.IVA: ${vat}`;

        // Nascondi Loader
        document.getElementById('loader').classList.add('hidden');
        document.getElementById('app-content').classList.remove('hidden');

    } catch (error) {
        console.error("❌ ERRORE FETCH:", error);
        // Fallback minimale per non lasciare lo schermo nero
        document.getElementById('companyName').innerText = "Errore Connessione";
        document.getElementById('loader').classList.add('hidden');
        document.getElementById('app-content').classList.remove('hidden');
    }
}

// ---------------------------------------------------------
// ESECUZIONE IMMEDIATA
// ---------------------------------------------------------
// Non aspettiamo eventi strani. Appena il browser legge questa riga, parte.
startDashboard();


// ---------------------------------------------------------
// NAVIGAZIONE (Mantiene il Token)
// ---------------------------------------------------------
window.navTo = function(page) {
    const currentQuery = window.location.search;
    const separator = page.includes('?') ? '&' : '?';
    const queryToAppend = currentQuery.startsWith('?') ? currentQuery.substring(1) : currentQuery;
    window.location.href = `${page}${separator}${queryToAppend}`;
}

window.openWidget = function() { navTo('SiteBos.html'); }

window.openSite = function() {
    const t = i18n[getLang()];
    tg.showPopup({ title: t.popup_site_title, message: t.popup_site_msg });
}
