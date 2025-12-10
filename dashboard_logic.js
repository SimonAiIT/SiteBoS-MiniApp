// dashboard_logic.js
// Versione Definitiva - 6 Lingue, Routing Completo, Fix UI e Gatekeepers + Warehouse Overlay + Recharge with Sponsor

// 0. INIT TELEGRAM
const tg = window.Telegram.WebApp;
tg.ready(); 
tg.expand();

// CONFIGURAZIONE
const DASHBOARD_API = "https://trinai.api.workflow.dcmake.it/webhook/ef4aece4-9ec0-4026-a7a7-328562bcbdf6"; 
const WAREHOUSE_COST = 50000; // Costo in crediti per sbloccare analisi magazzino
const RECHARGE_URL = "http://dashboard.trinai.it/ricarica"; // URL piattaforma ricarica
const COUNTDOWN_SECONDS = 3; // Secondi prima del redirect

// ROUTING (Mappa delle destinazioni)
const ROUTES = {
    'honeypot': 'honeypot_editor.html',
    'catalog': 'catalog/catalog.html',
    'agenda': 'agenda/agenda.html',
    'team': 'team/team.html',
    'marketing': 'knowledge_base/knowledge.html',
    'company': 'edit_owner.html', 
    'widget': 'SiteBos.html',
    'blog': 'blog/blog.html',
    'warehouse': 'warehouse/warehouse.html',
    'functions': 'functions/dashboard.html'
};

// STATE GLOBALE
let currentCredits = 0;
let currentVat = null;
let currentOwner = null;
let currentToken = null;
let countdownTimer = null;

// 1. DIZIONARIO TRADUZIONI COMPLETO
const i18n = {
    it: { 
        btn_widget: "Widget", btn_site: "Sito", 
        section_operations: "Gestione Operativa", 
        card_hp: "HoneyPot", sub_hp: "Gestisci Risposte", 
        card_catalog: "Catalogo", sub_catalog: "Prodotti & Servizi", 
        card_agenda: "Agenda", sub_agenda: "Appuntamenti", 
        card_team: "Team", sub_team: "Soft Skills & Ruoli",
        card_company: "Dati Aziendali", sub_company: "Configurazione", 
        card_marketing: "Marketing", sub_marketing: "Campagne & Asset",
        card_warehouse: "Analisi Magazzino", sub_warehouse: "50.000 crediti",
        card_functions: "Funzioni Aggiuntive", sub_functions: "Espandi TrinAi",
        err_title: "⛔ Errore Parametri", err_msg: "Apri dal Bot Telegram.", 
        popup_site_title: "Site Builder", popup_site_msg: "Il modulo Sito Web Statico è in fase di sviluppo.",
        game_title: "🎮 GAME OVER!", game_msg: "Hai guadagnato {points} Crediti AI!",
        status_hp_lock: "⛔ DA CONFIGURARE", status_hp_ok: "✅ Attivo",
        status_no_op: "Owner", status_active: "Membri", status_req: "⚠️ Richiesto",
        warehouse_insufficient: "Crediti insufficienti! Hai {current}, servono {required}.",
        warehouse_confirm_title: "Conferma Acquisto",
        warehouse_confirm_msg: "Verranno detratti {cost} crediti. Continuare?"
    },
    en: { 
        btn_widget: "Widget", btn_site: "Site", 
        section_operations: "Operations", 
        card_hp: "HoneyPot", sub_hp: "Manage Responses", 
        card_catalog: "Catalog", sub_catalog: "Products & Services", 
        card_agenda: "Agenda", sub_agenda: "Appointments", 
        card_team: "Team", sub_team: "Soft Skills & Roles",
        card_company: "Company Data", sub_company: "Configuration", 
        card_marketing: "Marketing", sub_marketing: "Campaigns & Assets",
        card_warehouse: "Warehouse Analysis", sub_warehouse: "50,000 credits",
        card_functions: "Additional Functions", sub_functions: "Expand TrinAi",
        err_title: "⛔ Param Error", err_msg: "Open from Telegram Bot.", 
        popup_site_title: "Site Builder", popup_site_msg: "Static Website module under development.",
        game_title: "🎮 GAME OVER!", game_msg: "You earned {points} AI Credits!",
        status_hp_lock: "⛔ SETUP REQUIRED", status_hp_ok: "✅ Active",
        status_no_op: "Owner", status_active: "Members", status_req: "⚠️ Required",
        warehouse_insufficient: "Insufficient credits! You have {current}, need {required}.",
        warehouse_confirm_title: "Confirm Purchase",
        warehouse_confirm_msg: "{cost} credits will be deducted. Continue?"
    },
    fr: { 
        btn_widget: "Widget", btn_site: "Site", 
        section_operations: "Gestion Opérationnelle", 
        card_hp: "HoneyPot", sub_hp: "Gérer Réponses", 
        card_catalog: "Catalogue", sub_catalog: "Produits & Services", 
        card_agenda: "Agenda", sub_agenda: "Rendez-vous", 
        card_team: "Équipe", sub_team: "Compétences & Rôles",
        card_company: "Données Entreprise", sub_company: "Configuration", 
        card_marketing: "Marketing", sub_marketing: "Campagnes & Actifs",
        card_warehouse: "Analyse Entrepôt", sub_warehouse: "50 000 crédits",
        card_functions: "Fonctions Supplémentaires", sub_functions: "Étendre TrinAi",
        err_title: "⛔ Erreur Param", err_msg: "Ouvrir via Bot Telegram.", 
        popup_site_title: "Site Builder", popup_site_msg: "Module Site Web en développement.",
        game_title: "🎮 GAME OVER !", game_msg: "Vous avez gagné {points} Crédits IA !",
        status_hp_lock: "⛔ À CONFIGURER", status_hp_ok: "✅ Actif",
        status_no_op: "Propriétaire", status_active: "Membres", status_req: "⚠️ Requis",
        warehouse_insufficient: "Crédits insuffisants ! Vous avez {current}, besoin de {required}.",
        warehouse_confirm_title: "Confirmer l'achat",
        warehouse_confirm_msg: "{cost} crédits seront déduits. Continuer ?"
    },
    de: { 
        btn_widget: "Widget", btn_site: "Webseite", 
        section_operations: "Betriebsführung", 
        card_hp: "HoneyPot", sub_hp: "Antworten verwalten", 
        card_catalog: "Katalog", sub_catalog: "Produkte & Dienste", 
        card_agenda: "Agenda", sub_agenda: "Termine", 
        card_team: "Team", sub_team: "Soft Skills & Rollen",
        card_company: "Firmendaten", sub_company: "Konfiguration", 
        card_marketing: "Marketing", sub_marketing: "Kampagnen & Assets",
        card_warehouse: "Lageranalyse", sub_warehouse: "50.000 Credits",
        card_functions: "Zusätzliche Funktionen", sub_functions: "TrinAi erweitern",
        err_title: "⛔ Parameterfehler", err_msg: "Über Telegram Bot öffnen.", 
        popup_site_title: "Site Builder", popup_site_msg: "Webseiten-Modul in Entwicklung.",
        game_title: "🎮 GAME OVER!", game_msg: "Du hast {points} KI-Credits verdient!",
        status_hp_lock: "⛔ SETUP NÖTIG", status_hp_ok: "✅ Aktiv",
        status_no_op: "Besitzer", status_active: "Mitglieder", status_req: "⚠️ Erforderlich",
        warehouse_insufficient: "Unzureichende Credits! Sie haben {current}, benötigen {required}.",
        warehouse_confirm_title: "Kauf bestätigen",
        warehouse_confirm_msg: "{cost} Credits werden abgezogen. Fortfahren?"
    },
    es: { 
        btn_widget: "Widget", btn_site: "Sitio", 
        section_operations: "Gestión Operativa", 
        card_hp: "HoneyPot", sub_hp: "Gestionar Respuestas", 
        card_catalog: "Catálogo", sub_catalog: "Productos y Servicios", 
        card_agenda: "Agenda", sub_agenda: "Citas", 
        card_team: "Equipo", sub_team: "Competencias & Roles",
        card_company: "Datos Empresa", sub_company: "Configuración", 
        card_marketing: "Marketing", sub_marketing: "Campañas y Activos",
        card_warehouse: "Análisis Almacén", sub_warehouse: "50.000 créditos",
        card_functions: "Funciones Adicionales", sub_functions: "Expandir TrinAi",
        err_title: "⛔ Error Param", err_msg: "Abrir desde Bot Telegram.", 
        popup_site_title: "Site Builder", popup_site_msg: "Módulo Sitio Web en desarrollo.",
        game_title: "🎮 ¡JUEGO TERMINADO!", game_msg: "¡Has ganado {points} Créditos IA!",
        status_hp_lock: "⛔ A CONFIGURAR", status_hp_ok: "✅ Activo",
        status_no_op: "Propietario", status_active: "Miembros", status_req: "⚠️ Requerido",
        warehouse_insufficient: "¡Créditos insuficientes! Tienes {current}, necesitas {required}.",
        warehouse_confirm_title: "Confirmar compra",
        warehouse_confirm_msg: "Se deducirán {cost} créditos. ¿Continuar?"
    },
    pt: { 
        btn_widget: "Widget", btn_site: "Site", 
        section_operations: "Gestão Operacional", 
        card_hp: "HoneyPot", sub_hp: "Gerir Respostas", 
        card_catalog: "Catálogo", sub_catalog: "Produtos e Serviços", 
        card_agenda: "Agenda", sub_agenda: "Compromissos", 
        card_team: "Equipe", sub_team: "Competências & Funções",
        card_company: "Dados da Empresa", sub_company: "Configuração", 
        card_marketing: "Marketing", sub_marketing: "Campanhas e Ativos",
        card_warehouse: "Análise Armazém", sub_warehouse: "50.000 créditos",
        card_functions: "Funções Adicionais", sub_functions: "Expandir TrinAi",
        err_title: "⛔ Erro Param", err_msg: "Abrir via Bot Telegram.", 
        popup_site_title: "Site Builder", popup_site_msg: "Módulo Website em desenvolvimento.",
        game_title: "🎮 FIM DE JOGO!", game_msg: "Ganhou {points} Créditos de IA!",
        status_hp_lock: "⛔ CONFIGURAR", status_hp_ok: "✅ Ativo",
        status_no_op: "Proprietário", status_active: "Membros", status_req: "⚠️ Obrigatório",
        warehouse_insufficient: "Créditos insuficientes! Você tem {current}, precisa de {required}.",
        warehouse_confirm_title: "Confirmar compra",
        warehouse_confirm_msg: "{cost} créditos serão deduzidos. Continuar?"
    }
};

function getLang() {
    const l = (new URLSearchParams(window.location.search)).get('lang') || 'it';
    const norm = l.toLowerCase().slice(0, 2); 
    return i18n[norm] ? norm : 'en'; 
}

function t(key) {
    const lang = getLang();
    return (i18n[lang] && i18n[lang][key]) || (i18n['en'] && i18n['en'][key]) || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerText = t(el.getAttribute('data-i18n'));
    });
}

// NAVIGAZIONE
window.navTo = function(routeKey) {
    const p = new URLSearchParams(window.location.search);
    p.delete('bonus_credits'); 
    const targetPath = ROUTES[routeKey] || routeKey;
    window.location.href = `${targetPath}?${p.toString()}`;
}

// ✨ RECHARGE WITH SPONSOR AD
window.openRechargeWithAd = function() {
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    
    const overlay = document.getElementById('sponsor-overlay');
    overlay.classList.remove('hidden');
    
    // Inizializza sponsor rotating
    if (window.SponsorManager) {
        window.SponsorManager.inject('#sponsor-container', 'loader');
    }
    
    // Avvia countdown automatico
    startRechargeCountdown();
}

window.closeSponsorOverlay = function() {
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    
    // Ferma countdown
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
    
    // Ferma sponsor rotation
    if (window.adIntervals) {
        window.adIntervals.forEach(interval => clearInterval(interval));
        window.adIntervals = [];
    }
    
    document.getElementById('sponsor-overlay').classList.add('hidden');
    
    // Reset countdown display
    document.getElementById('countdown').textContent = COUNTDOWN_SECONDS;
}

function startRechargeCountdown() {
    let seconds = COUNTDOWN_SECONDS;
    const countdownEl = document.getElementById('countdown');
    
    countdownEl.textContent = seconds;
    
    countdownTimer = setInterval(() => {
        seconds--;
        countdownEl.textContent = seconds;
        
        if (seconds <= 0) {
            clearInterval(countdownTimer);
            proceedToRecharge();
        }
    }, 1000);
}

window.proceedToRecharge = function() {
    if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    
    // Costruisci URL con parametri utente
    const params = new URLSearchParams();
    if (currentVat) params.set('vat', currentVat);
    if (currentOwner) params.set('owner', currentOwner);
    if (currentToken) params.set('token', currentToken);
    
    const fullUrl = `${RECHARGE_URL}?${params.toString()}`;
    
    // Apri in nuova finestra
    window.open(fullUrl, '_blank');
    
    // Chiudi overlay
    closeSponsorOverlay();
}

// ✨ WAREHOUSE OVERLAY FUNCTIONS
window.openWarehouseOverlay = function() {
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    
    const overlay = document.getElementById('warehouse-overlay');
    const creditsDisplay = document.getElementById('overlay-credits');
    const confirmBtn = document.getElementById('confirm-warehouse-btn');
    
    creditsDisplay.textContent = currentCredits.toLocaleString();
    
    // Disabilita bottone se crediti insufficienti
    if (currentCredits < WAREHOUSE_COST) {
        confirmBtn.disabled = true;
        confirmBtn.style.opacity = '0.5';
        confirmBtn.innerHTML = '<i class="fas fa-lock"></i> Crediti Insufficienti';
    } else {
        confirmBtn.disabled = false;
        confirmBtn.style.opacity = '1';
        confirmBtn.innerHTML = '<i class="fas fa-check"></i> Conferma';
    }
    
    overlay.classList.remove('hidden');
}

window.closeWarehouseOverlay = function() {
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    document.getElementById('warehouse-overlay').classList.add('hidden');
}

window.confirmWarehouse = async function() {
    if (currentCredits < WAREHOUSE_COST) {
        const msg = t('warehouse_insufficient')
            .replace('{current}', currentCredits.toLocaleString())
            .replace('{required}', WAREHOUSE_COST.toLocaleString());
        
        if (tg?.showAlert) {
            tg.showAlert(msg);
        } else {
            alert(msg);
        }
        return;
    }
    
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
    
    const confirmBtn = document.getElementById('confirm-warehouse-btn');
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Elaborazione...';
    confirmBtn.disabled = true;
    
    try {
        // Chiama API per detrarre crediti
        const response = await fetch(DASHBOARD_API, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                action: 'unlock_warehouse',
                vat_number: currentVat,
                chat_id: currentOwner,
                token: currentToken,
                cost: WAREHOUSE_COST
            })
        });
        
        if (!response.ok) throw new Error('Errore durante lo sblocco');
        
        const result = await response.json();
        
        if (result.success) {
            // Successo: naviga a warehouse
            closeWarehouseOverlay();
            navTo('warehouse');
        } else {
            throw new Error(result.error || 'Errore sconosciuto');
        }
        
    } catch (error) {
        console.error('Warehouse unlock error:', error);
        
        if (tg?.showAlert) {
            tg.showAlert('❌ Errore: ' + error.message);
        } else {
            alert('Errore: ' + error.message);
        }
        
        confirmBtn.innerHTML = '<i class="fas fa-check"></i> Conferma';
        confirmBtn.disabled = false;
    }
}

// ---------------------------------------------------------
// AVVIO DASHBOARD
// ---------------------------------------------------------
async function startDashboard() {
    applyTranslations();

    const p = new URLSearchParams(window.location.search);
    const vat = p.get('vat'); 
    const owner = p.get('owner'); 
    const token = p.get('token'); 

    if (!vat || !owner) { 
        document.body.innerHTML = `<h3 style='color:white;text-align:center;margin-top:50px'>${t('err_title')}</h3>`; 
        return; 
    }

    // Salva in state globale
    currentVat = vat;
    currentOwner = owner;
    currentToken = token;

    // Bonus Crediti (Gamification)
    const bonus = p.get('bonus_credits');
    if (bonus && parseInt(bonus) > 0) {
        const points = parseInt(bonus);
        fetch(DASHBOARD_API, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ action: 'add_gamification_credits', vat_number: vat, chat_id: owner, amount: points, token: token })
        }).catch(console.error);

        try {
            if(tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
            if(tg.showPopup) tg.showPopup({ title: t('game_title'), message: t('game_msg').replace('{points}', points) });
        } catch(e) {}
        
        const newUrl = window.location.href.replace(/&bonus_credits=\d+/, '');
        window.history.replaceState({}, document.title, newUrl);
    }

    // Caricamento Dati
    try {
        const response = await fetch(DASHBOARD_API, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ action: 'get_dashboard_data', vat_number: vat, chat_id: owner, token: token })
        });

        const rawJson = await response.json();
        const data = Array.isArray(rawJson) ? rawJson[0] : rawJson;

        if (!response.ok || data.status === 'error') throw new Error(data.error?.message || "Server Error");

        renderDashboard(data, vat);

    } catch (error) {
        console.error(error);
        document.body.innerHTML = `<h3 style='color:white;text-align:center;margin-top:50px'>Connessione Fallita</h3><p style='color:#ccc;text-align:center'>${error.message}</p>`;
    }
}

// RENDER UI
function renderDashboard(data, vat) {
    const owner = data.owner_data || {};
    const status = data.status || {};

    // Salva crediti in state globale
    currentCredits = owner.credits_balance || owner.credits || 0;

    // Header
    document.getElementById('companyName').innerText = owner.ragione_sociale || "Azienda";
    document.getElementById('vatDisplay').innerText = `P.IVA: ${vat}`;
    document.getElementById('credits-display').innerText = currentCredits.toLocaleString();  

    if (owner.logo_url) {
        const img = document.getElementById('header-logo');
        img.src = owner.logo_url;
        img.classList.remove('hidden');
    }

    // Helper Lucchetti
    const setLock = (cardId, isLocked, subId, textLocked, textUnlocked) => {
        const card = document.getElementById(cardId);
        const sub = document.getElementById(subId);
        
        if (isLocked) {
            card.classList.add('locked-item');
            if(sub) {
                sub.innerText = textLocked;
                sub.classList.add('text-warning');
                sub.classList.remove('text-success');
            }
        } else {
            card.classList.remove('locked-item');
            if(sub && textUnlocked) {
                sub.innerText = textUnlocked;
                sub.classList.remove('text-warning');
                sub.classList.add('text-success');
            }
        }
    };

    // LOGICA GATEKEEPERS
    const isHpReady = (status.honeypot === 'READY');
    const hpSub = document.getElementById('sub-hp');
    const hpCard = document.getElementById('card-hp');

    if (!isHpReady) {
        // BLOCCA TUTTO se HP non è pronto
        hpSub.innerText = t('status_hp_lock');
        hpSub.classList.add('text-warning');
        hpCard.style.border = '1px solid var(--warning)';
        
        ['card-catalog', 'card-agenda', 'card-team', 'card-marketing', 'card-warehouse', 'card-functions'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.classList.add('locked-item');
        });
    } else {
        // SBLOCCA
        hpSub.innerText = t('status_hp_ok');
        hpSub.classList.add('text-success');
        hpCard.classList.add('border-success');
        
        // Catalogo (Sempre sbloccato se HP è ok)
        document.getElementById('card-catalog').classList.remove('locked-item');
        document.getElementById('sub-catalog').innerHTML = `Cat: <b>${status.categories_count || 0}</b> | Prod: <b>${status.products_count || 0}</b>`;

        // Agenda (Blueprints > 0)
        setLock('card-agenda', (status.blueprints_count === 0), 'sub-agenda', t('status_req'), t('status_active'));

        // Marketing (Docs > 0)
        setLock('card-marketing', (status.knowledge_docs === 0), 'sub-marketing', t('status_req'), `${status.knowledge_docs} Docs`);

        // Team (Sempre sbloccato se HP è ok)
        const teamCard = document.getElementById('card-team');
        const teamSub = document.getElementById('sub-team');
        teamCard.classList.remove('locked-item');
        
        if (status.operators_count === 0) {
            teamSub.innerText = t('status_no_op');
            teamSub.classList.remove('text-warning');
            teamSub.classList.add('text-muted');
        } else {
            teamSub.innerText = `${status.operators_count} ${t('status_active')}`;
            teamSub.classList.remove('text-warning');
            teamSub.classList.add('text-success');
        }

        // ✨ Warehouse e Functions (Sempre sbloccati se HP ok)
        document.getElementById('card-warehouse').classList.remove('locked-item');
        document.getElementById('card-functions').classList.remove('locked-item');
    }

    // UI Pronta
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('app-content').classList.remove('hidden');
}

// AVVIA DASHBOARD
startDashboard();
