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

// ... (codice precedente con i18n) ...

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
    
    applyTranslations();

    const p = new URLSearchParams(window.location.search);
    const vat = p.get('vat');
    const ownerId = p.get('owner');
    const token = p.get('token');

    // Controllo parametri critici
    if (!vat || !ownerId) {
        document.body.innerHTML = "<h3 style='color:white;text-align:center;margin-top:50px'>⛔ ERRORE URL: Parametri mancanti</h3>";
        return;
    }

    try {
        console.log("🚀 AVVIO CHIAMATA DASHBOARD...");
        
        // 1. CHIAMATA AL BACKEND
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

        // 2. PARSING JSON SICURO (Gestisce anche errori server 500 che ritornano JSON)
        let data;
        try {
            const rawData = await response.json();
            // Normalizzazione Array n8n -> Oggetto
            data = Array.isArray(rawData) ? rawData[0] : rawData;
        } catch (jsonError) {
            throw new Error(`HTTP ${response.status}: Errore Server non gestito.`);
        }

        console.log("📥 DATI RICEVUTI:", data);

        // 3. GESTIONE ERRORE CRITICO (Ghost User / Data Loss)
        const isError = !response.ok || data.status === 'error' || data.webhookResponse?.status === 'error';

        if (isError) {
            const errObj = data.error || data.webhookResponse?.error || { 
                title: "Errore Sconosciuto", 
                message: "Il server ha risposto con codice " + response.status 
            };

            document.getElementById('loader').classList.add('hidden');

            // Overlay Errore
            document.body.innerHTML = `
                <div class="container" style="padding-top: 80px; text-align: center; color: white;">
                    <div style="font-size: 60px; margin-bottom: 20px;">⚠️</div>
                    <h2 style="color: #ff6b6b; font-family: sans-serif;">${errObj.title || "Attenzione"}</h2>
                    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">${errObj.message}</p>
                    
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; text-align: left; margin: 0 auto 30px; max-width: 90%; font-family: monospace; font-size: 12px; border-left: 3px solid #ff6b6b;">
                        TYPE: ${errObj.type || "SERVER_ERROR"}<br>
                        ID: ${errObj.user_id || vat}
                    </div>

                    <a href="https://t.me/TrinAi_TecSupport_bot" class="btn btn-primary" style="text-decoration: none; padding: 12px 25px; border-radius: 8px; display: inline-block;">
                        <i class="fas fa-life-ring"></i> Contatta Supporto
                    </a>
                </div>
            `;
            return; // STOP
        }

        // 4. SUCCESSO: Update UI
        const companyName = data.company_profile?.name || data.owner_data?.ragione_sociale || "Azienda";
        document.getElementById('companyName').innerText = companyName;
        document.getElementById('vatDisplay').innerText = `P.IVA: ${vat}`;

        // Applica logica di controllo stato (Lockdown)
        if(data.status) {
            updateDashboardStatus(data.status);
        } else {
            console.warn("Nessun oggetto 'status' ricevuto dal backend.");
        }

        document.getElementById('loader').classList.add('hidden');
        document.getElementById('app-content').classList.remove('hidden');

    } catch (error) {
        console.error("❌ ERRORE JS:", error);
        document.getElementById('loader').innerHTML = `
            <div style='color:#ff6b6b; padding:20px; text-align:center;'>
                <h3>Errore Connessione</h3>
                <p>${error.message}</p>
                <button class='btn btn-secondary' onclick='location.reload()'>Ricarica</button>
            </div>`;
    }
}

// ---------------------------------------------------------
// LOGICA DI CONTROLLO (LOCKDOWN & BADGE)
// ---------------------------------------------------------
function updateDashboardStatus(status) {
    
    // --- A. HONEYPOT CHECK (IL BLOCCO) ---
    // Logica: Se non è esplicitamente 'READY', blocca tutto.
    const isHpReady = (status.honeypot === 'READY' || status.honeypot === true); 
    
    // Elementi da bloccare se HP non è pronto
    const idsToLock = [
        'card-catalog', 'card-agenda', 'card-team', 'card-knowledge',
        'btn-widget', 'btn-site'
    ];

    if (!isHpReady) {
        // 1. Applica classe locked (grigio + no click)
        idsToLock.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.classList.add('locked-item');
        });

        // 2. Evidenzia HoneyPot (Pulse)
        const hpCard = document.getElementById('card-hp');
        const hpBadge = document.getElementById('badge-hp');
        const hpSub = document.getElementById('sub-hp');

        if(hpCard) {
            hpCard.style.border = '2px solid var(--warning)';
            hpCard.style.animation = 'pulse-border 2s infinite'; // Richiede keyframes nel CSS
            hpBadge.classList.remove('hidden'); // Mostra "!"
            hpSub.innerText = "⛔ DA CONFIGURARE";
            hpSub.classList.add('error');
        }
    } else {
        // SBLOCCO (Caso normale)
        idsToLock.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.classList.remove('locked-item');
        });
        
        const hpSub = document.getElementById('sub-hp');
        if(hpSub) {
            hpSub.innerText = "✅ Attivo";
            hpSub.classList.add('dynamic');
        }
    }

    // --- B. BADGE CONFIGURAZIONE ---
    if (status.profile_completion < 100) {
        document.getElementById('badge-config').classList.remove('hidden');
        const sub = document.getElementById('sub-config');
        sub.innerText = `${status.profile_completion}% Completo`;
        sub.classList.add('warning');
    }

    // --- C. CONTATORI (Visualizza sempre i numeri se ci sono) ---
    if (status.catalog_count > 0) {
        const el = document.getElementById('count-catalog');
        if(el) { el.innerText = status.catalog_count; el.classList.remove('hidden'); }
    }
    if (status.appointments_today > 0) {
        const el = document.getElementById('count-agenda');
        if(el) { el.innerText = status.appointments_today; el.classList.remove('hidden'); }
    }
    if (status.knowledge_docs > 0) {
        const el = document.getElementById('count-docs');
        if(el) { el.innerText = status.knowledge_docs; el.classList.remove('hidden'); }
    }
}

// ---------------------------------------------------------
// NAVIGAZIONE (Propagazione Totale Token)
// ---------------------------------------------------------
window.navTo = function(page) {
    const currentQuery = window.location.search;
    const separator = page.includes('?') ? '&' : '?';
    // Rimuovi eventuale '?' iniziale duplicato
    const queryToAppend = currentQuery.startsWith('?') ? currentQuery.substring(1) : currentQuery;
    window.location.href = `${page}${separator}${queryToAppend}`;
}

window.openWidget = function() { navTo('SiteBos.html'); }

window.openSite = function() {
    const t = i18n[getLang()];
    tg.showPopup({ title: t.popup_site_title, message: t.popup_site_msg });
}

// AVVIO
startDashboard();
