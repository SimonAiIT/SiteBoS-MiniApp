/**
 * TEAM LOGIC - Gestione Owner e Collaboratori
 * - Visualizzazione Owner con accesso soft skills
 * - Lista collaboratori (se presenti)
 * - Navigazione verso modulo soft skill assessment
 */

'use strict';

// ==========================================
// 1. CONFIGURATION & STATE
// ==========================================
const CONFIG = {
    WEBHOOK_URL: "https://trinai.api.workflow.dcmake.it/webhook/YOUR_TEAM_WEBHOOK", // TODO: aggiornare con webhook reale
    SOFTSKILL_PATH: "../softskill/index.html"
};

const urlParams = new URLSearchParams(window.location.search);

const STATE = {
    vatNumber: urlParams.get('vat'),
    accessToken: urlParams.get('token'),
    ownerId: urlParams.get('owner'),
    companyName: urlParams.get('ragione_sociale'),
    currentLang: 'it',
    ownerData: {},
    teamMembers: []
};

const DOM = {
    loader: document.getElementById('loader'),
    app: document.getElementById('app-content'),
    ownerCard: document.getElementById('owner-card'),
    ownerName: document.getElementById('owner-name'),
    btnOwnerSoftskill: document.getElementById('btn-owner-softskill'),
    teamList: document.getElementById('team-list'),
    noTeamMessage: document.getElementById('no-team-message'),
    btnAddMember: document.getElementById('btn-add-member'),
    btnBack: document.getElementById('btn-back-dashboard')
};

// Telegram WebApp Init
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();


// ==========================================
// 2. I18N - TRADUZIONI
// ==========================================

const I18n = {
    dict: {
        it: {
            title: "Team Manager",
            subtitle: "Gestisci le soft skills del tuo team",
            section_owner_title: "Owner",
            role_owner: "Proprietario",
            btn_assess: "Valuta Soft Skills",
            section_team_title: "Collaboratori",
            no_team_msg: "Nessun collaboratore presente. Aggiungine uno per iniziare.",
            btn_add_member: "Aggiungi Collaboratore",
            access_denied: "Accesso Negato: Token mancante.",
            alert_loading_error: "Errore caricamento dati.",
            feature_coming_soon: "Funzionalità in arrivo",
            feature_coming_msg: "L'aggiunta di collaboratori sarà disponibile a breve."
        },
        en: {
            title: "Team Manager",
            subtitle: "Manage your team's soft skills",
            section_owner_title: "Owner",
            role_owner: "Owner",
            btn_assess: "Assess Soft Skills",
            section_team_title: "Team Members",
            no_team_msg: "No team members yet. Add one to get started.",
            btn_add_member: "Add Team Member",
            access_denied: "Access Denied: Missing Token.",
            alert_loading_error: "Error loading data.",
            feature_coming_soon: "Coming Soon",
            feature_coming_msg: "Adding team members will be available soon."
        },
        fr: {
            title: "Gestionnaire d'Équipe",
            subtitle: "Gérez les compétences douces de votre équipe",
            section_owner_title: "Propriétaire",
            role_owner: "Propriétaire",
            btn_assess: "Évaluer Compétences",
            section_team_title: "Membres de l'Équipe",
            no_team_msg: "Aucun membre pour l'instant. Ajoutez-en un pour commencer.",
            btn_add_member: "Ajouter un Membre",
            access_denied: "Accès Refusé : Jeton manquant.",
            alert_loading_error: "Erreur de chargement.",
            feature_coming_soon: "Bientôt Disponible",
            feature_coming_msg: "L'ajout de membres sera bientôt disponible."
        },
        de: {
            title: "Team Manager",
            subtitle: "Verwalten Sie die Soft Skills Ihres Teams",
            section_owner_title: "Besitzer",
            role_owner: "Besitzer",
            btn_assess: "Soft Skills Bewerten",
            section_team_title: "Team-Mitglieder",
            no_team_msg: "Noch keine Mitglieder. Fügen Sie eines hinzu.",
            btn_add_member: "Mitglied Hinzufügen",
            access_denied: "Zugriff Verweigert: Token fehlt.",
            alert_loading_error: "Ladefehler.",
            feature_coming_soon: "Bald Verfügbar",
            feature_coming_msg: "Mitglieder hinzufügen wird bald verfügbar sein."
        },
        es: {
            title: "Gestor de Equipo",
            subtitle: "Gestiona las competencias blandas de tu equipo",
            section_owner_title: "Propietario",
            role_owner: "Propietario",
            btn_assess: "Evaluar Competencias",
            section_team_title: "Miembros del Equipo",
            no_team_msg: "No hay miembros aún. Añade uno para empezar.",
            btn_add_member: "Añadir Miembro",
            access_denied: "Acceso Denegado: Token faltante.",
            alert_loading_error: "Error al cargar.",
            feature_coming_soon: "Próximamente",
            feature_coming_msg: "Añadir miembros estará disponible pronto."
        },
        pt: {
            title: "Gestor de Equipe",
            subtitle: "Gira as competências interpessoais da sua equipa",
            section_owner_title: "Proprietário",
            role_owner: "Proprietário",
            btn_assess: "Avaliar Competências",
            section_team_title: "Membros da Equipa",
            no_team_msg: "Nenhum membro ainda. Adicione um para começar.",
            btn_add_member: "Adicionar Membro",
            access_denied: "Acesso Negado: Token em falta.",
            alert_loading_error: "Erro ao carregar.",
            feature_coming_soon: "Em Breve",
            feature_coming_msg: "Adicionar membros estará disponível em breve."
        }
    },

    init: function() {
        let l = urlParams.get('lang') || urlParams.get('language') || tg.initDataUnsafe?.user?.language_code || 'it';
        STATE.currentLang = this.dict[l.toLowerCase().slice(0, 2)] ? l.toLowerCase().slice(0, 2) : 'it';
        if (!this.dict[STATE.currentLang]) STATE.currentLang = 'it';
        this.apply();
    },

    get: function(key) {
        const d = this.dict[STATE.currentLang] || this.dict.it; 
        return d[key] || key;
    },

    apply: function() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.innerHTML = this.get(key);
        });
    }
};


// ==========================================
// 3. API CALLS
// ==========================================

const Api = {
    async getTeamData() {
        try {
            const response = await fetch(CONFIG.WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'get_team_data',
                    vat_number: STATE.vatNumber,
                    access_token: STATE.accessToken,
                    owner_id: STATE.ownerId
                })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (e) {
            console.error("API Error:", e);
            tg.showAlert(I18n.get('alert_loading_error'));
            throw e;
        }
    }
};


// ==========================================
// 4. UI RENDERER
// ==========================================

const UI = {
    renderOwner: () => {
        DOM.ownerName.innerText = STATE.companyName || STATE.ownerData.name || "Owner";
    },

    renderTeam: () => {
        DOM.teamList.innerHTML = '';
        
        if (!STATE.teamMembers || STATE.teamMembers.length === 0) {
            DOM.noTeamMessage.classList.remove('hidden');
            return;
        }
        
        DOM.noTeamMessage.classList.add('hidden');
        
        STATE.teamMembers.forEach((member, index) => {
            const card = document.createElement('div');
            card.className = 'team-member-card';
            card.innerHTML = `
                <div class="member-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="member-info">
                    <h4>${member.name || 'Collaboratore'}</h4>
                    <p class="member-role">${member.role || 'Membro del Team'}</p>
                </div>
                <button class="btn btn-secondary btn-sm" data-member-id="${index}">
                    <i class="fas fa-chart-line"></i> ${I18n.get('btn_assess')}
                </button>
            `;
            DOM.teamList.appendChild(card);
        });
        
        // Event listeners per i pulsanti dei membri
        DOM.teamList.querySelectorAll('button[data-member-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const memberId = e.currentTarget.getAttribute('data-member-id');
                App.assessMember(memberId);
            });
        });
    }
};


// ==========================================
// 5. CORE APPLICATION LOGIC
// ==========================================

const App = {
    init: async () => {
        if (!STATE.vatNumber || !STATE.accessToken) {
            document.body.innerHTML = `<h2 style="color:white;text-align:center;margin-top:50px;">${I18n.get('access_denied')}</h2>`;
            return;
        }

        I18n.init();

        try {
            // TODO: Quando il webhook sarà pronto, decommentare:
            // const data = await Api.getTeamData();
            // STATE.ownerData = data.owner || {};
            // STATE.teamMembers = data.team_members || [];
            
            // Per ora usa dati mock
            STATE.ownerData = { name: STATE.companyName };
            STATE.teamMembers = []; // Nessun collaboratore di default

            UI.renderOwner();
            UI.renderTeam();

            DOM.loader.classList.add('hidden');
            DOM.app.classList.remove('hidden');
        } catch (e) {
            console.error("Initialization Error:", e);
        }

        App.attachEvents();
    },

    attachEvents: () => {
        // Toggle card accordion
        DOM.app.addEventListener('click', (e) => {
            if (e.target.closest('.card-header')) {
                e.target.closest('.card-header').parentElement.classList.toggle('open');
            }
        });

        // Bottone Owner Soft Skills
        DOM.btnOwnerSoftskill.addEventListener('click', () => {
            App.assessOwner();
        });

        // Bottone Aggiungi Collaboratore
        DOM.btnAddMember.addEventListener('click', () => {
            tg.showPopup({
                title: I18n.get('feature_coming_soon'),
                message: I18n.get('feature_coming_msg')
            });
        });

        // Bottone Back
        DOM.btnBack.addEventListener('click', () => {
            const params = new URLSearchParams();
            if (STATE.vatNumber) params.set('vat', STATE.vatNumber);
            if (STATE.accessToken) params.set('token', STATE.accessToken);
            if (STATE.ownerId) params.set('owner', STATE.ownerId);
            if (STATE.companyName) params.set('ragione_sociale', STATE.companyName);
            window.location.href = `../dashboard.html?${params.toString()}`;
        });
    },

    assessOwner: () => {
        const params = new URLSearchParams();
        if (STATE.vatNumber) params.set('vat', STATE.vatNumber);
        if (STATE.accessToken) params.set('token', STATE.accessToken);
        if (STATE.ownerId) params.set('user_id', STATE.ownerId);
        params.set('role', 'owner');
        
        window.location.href = `${CONFIG.SOFTSKILL_PATH}?${params.toString()}`;
    },

    assessMember: (memberId) => {
        const member = STATE.teamMembers[memberId];
        if (!member) return;
        
        const params = new URLSearchParams();
        if (STATE.vatNumber) params.set('vat', STATE.vatNumber);
        if (STATE.accessToken) params.set('token', STATE.accessToken);
        params.set('user_id', member.id || memberId);
        params.set('role', 'member');
        
        window.location.href = `${CONFIG.SOFTSKILL_PATH}?${params.toString()}`;
    }
};

// AVVIA APPLICAZIONE
document.addEventListener('DOMContentLoaded', App.init);
