/**
 * PROFILE LOGIC - Visualizzazione/Modifica STAKEHOLDER_PROFILE
 * - Owner: può modificare i propri dati e valutare le proprie soft skills
 * - Operator: visualizzazione READ-ONLY
 */

'use strict';

// ==========================================
// 1. CONFIGURATION & STATE
// ==========================================
const CONFIG = {
    WEBHOOK_URL: "https://trinai.api.workflow.dcmake.it/webhook/502d2019-b5ee-4c9b-a14d-8d6545fbb05e",
    SOFTSKILL_PATH: "../softskill/index.html"
};

const urlParams = new URLSearchParams(window.location.search);

const STATE = {
    vatNumber: urlParams.get('vat'),
    accessToken: urlParams.get('token'),
    ownerId: urlParams.get('owner'),
    operatorId: urlParams.get('operator_id'),
    role: urlParams.get('role'), // 'owner' or 'operator'
    companyName: urlParams.get('ragione_sociale'),
    currentLang: 'it',
    profileData: {},
    initialString: '',
    hasChanges: false,
    isOwner: false
};

const DOM = {
    loader: document.getElementById('loader'),
    app: document.getElementById('app-content'),
    pageTitle: document.getElementById('page-title'),
    pageSubtitle: document.getElementById('page-subtitle'),
    fullName: document.getElementById('full_name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    currentRole: document.getElementById('current_role'),
    yearsExperience: document.getElementById('years_experience'),
    education: document.getElementById('education'),
    expertiseTags: document.getElementById('expertise-tags'),
    communicationStyle: document.getElementById('communication_style'),
    notes: document.getElementById('notes'),
    softskillsContainer: document.getElementById('softskills-container'),
    noSoftskills: document.getElementById('no-softskills'),
    softskillsData: document.getElementById('softskills-data'),
    btnAssessSoftskills: document.getElementById('btn-assess-softskills'),
    commercialTags: document.getElementById('commercial-tags'),
    customerSince: document.getElementById('customer_since'),
    btnSave: document.getElementById('btn-save'),
    btnBack: document.getElementById('btn-back')
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
            title: "Profilo Stakeholder",
            subtitle_owner: "Visualizza e modifica il tuo profilo",
            subtitle_operator: "Visualizzazione profilo collaboratore",
            section_identity: "Identità",
            lbl_full_name: "Nome Completo",
            lbl_email: "Email",
            lbl_phone: "Telefono",
            lbl_role: "Ruolo",
            section_professional: "Background Professionale",
            lbl_experience: "Anni di Esperienza",
            lbl_education: "Istruzione",
            section_behavioral: "Profilo Comportamentale",
            lbl_expertise: "Aree di Competenza",
            lbl_communication: "Stile di Comunicazione",
            lbl_notes: "Note",
            section_softskills: "Soft Skills",
            no_softskills: "Nessuna valutazione disponibile",
            btn_assess_skills: "Valuta Soft Skills",
            section_commercial: "Profilo Commerciale",
            lbl_tags: "Tag",
            lbl_customer_since: "Cliente Dal",
            access_denied: "Accesso Negato: Parametri mancanti.",
            alert_loading_error: "Errore caricamento profilo.",
            alert_saving_error: "Errore salvataggio.",
            saving_progress: "Salvataggio...",
            saving_success: "Salvato!"
        },
        en: {
            title: "Stakeholder Profile",
            subtitle_owner: "View and edit your profile",
            subtitle_operator: "Team member profile view",
            section_identity: "Identity",
            lbl_full_name: "Full Name",
            lbl_email: "Email",
            lbl_phone: "Phone",
            lbl_role: "Role",
            section_professional: "Professional Background",
            lbl_experience: "Years of Experience",
            lbl_education: "Education",
            section_behavioral: "Behavioral Profile",
            lbl_expertise: "Expertise Areas",
            lbl_communication: "Communication Style",
            lbl_notes: "Notes",
            section_softskills: "Soft Skills",
            no_softskills: "No assessment available",
            btn_assess_skills: "Assess Soft Skills",
            section_commercial: "Commercial Profile",
            lbl_tags: "Tags",
            lbl_customer_since: "Customer Since",
            access_denied: "Access Denied: Missing parameters.",
            alert_loading_error: "Error loading profile.",
            alert_saving_error: "Error saving.",
            saving_progress: "Saving...",
            saving_success: "Saved!"
        },
        fr: {
            title: "Profil Stakeholder",
            subtitle_owner: "Voir et modifier votre profil",
            subtitle_operator: "Vue du profil du membre",
            section_identity: "Identité",
            lbl_full_name: "Nom Complet",
            lbl_email: "Email",
            lbl_phone: "Téléphone",
            lbl_role: "Rôle",
            section_professional: "Parcours Professionnel",
            lbl_experience: "Années d'Expérience",
            lbl_education: "Formation",
            section_behavioral: "Profil Comportemental",
            lbl_expertise: "Domaines d'Expertise",
            lbl_communication: "Style de Communication",
            lbl_notes: "Notes",
            section_softskills: "Compétences Douces",
            no_softskills: "Aucune évaluation disponible",
            btn_assess_skills: "Évaluer Compétences",
            section_commercial: "Profil Commercial",
            lbl_tags: "Tags",
            lbl_customer_since: "Client Depuis",
            access_denied: "Accès Refusé : Paramètres manquants.",
            alert_loading_error: "Erreur de chargement.",
            alert_saving_error: "Erreur d'enregistrement.",
            saving_progress: "Enregistrement...",
            saving_success: "Enregistré !"
        },
        de: {
            title: "Stakeholder-Profil",
            subtitle_owner: "Profil anzeigen und bearbeiten",
            subtitle_operator: "Mitgliederprofil-Ansicht",
            section_identity: "Identität",
            lbl_full_name: "Vollständiger Name",
            lbl_email: "Email",
            lbl_phone: "Telefon",
            lbl_role: "Rolle",
            section_professional: "Beruflicher Hintergrund",
            lbl_experience: "Berufserfahrung",
            lbl_education: "Ausbildung",
            section_behavioral: "Verhaltensprofil",
            lbl_expertise: "Fachgebiete",
            lbl_communication: "Kommunikationsstil",
            lbl_notes: "Notizen",
            section_softskills: "Soft Skills",
            no_softskills: "Keine Bewertung verfügbar",
            btn_assess_skills: "Soft Skills Bewerten",
            section_commercial: "Handelsprofil",
            lbl_tags: "Tags",
            lbl_customer_since: "Kunde Seit",
            access_denied: "Zugriff Verweigert: Fehlende Parameter.",
            alert_loading_error: "Ladefehler.",
            alert_saving_error: "Speicherfehler.",
            saving_progress: "Speichern...",
            saving_success: "Gespeichert!"
        },
        es: {
            title: "Perfil Stakeholder",
            subtitle_owner: "Ver y editar tu perfil",
            subtitle_operator: "Vista de perfil del miembro",
            section_identity: "Identidad",
            lbl_full_name: "Nombre Completo",
            lbl_email: "Email",
            lbl_phone: "Teléfono",
            lbl_role: "Rol",
            section_professional: "Experiencia Profesional",
            lbl_experience: "Años de Experiencia",
            lbl_education: "Educación",
            section_behavioral: "Perfil Comportamental",
            lbl_expertise: "Áreas de Experiencia",
            lbl_communication: "Estilo de Comunicación",
            lbl_notes: "Notas",
            section_softskills: "Competencias Blandas",
            no_softskills: "Sin evaluación disponible",
            btn_assess_skills: "Evaluar Competencias",
            section_commercial: "Perfil Comercial",
            lbl_tags: "Etiquetas",
            lbl_customer_since: "Cliente Desde",
            access_denied: "Acceso Denegado: Parámetros faltantes.",
            alert_loading_error: "Error al cargar.",
            alert_saving_error: "Error al guardar.",
            saving_progress: "Guardando...",
            saving_success: "¡Guardado!"
        },
        pt: {
            title: "Perfil Stakeholder",
            subtitle_owner: "Ver e editar o seu perfil",
            subtitle_operator: "Visualização de perfil do membro",
            section_identity: "Identidade",
            lbl_full_name: "Nome Completo",
            lbl_email: "Email",
            lbl_phone: "Telefone",
            lbl_role: "Função",
            section_professional: "Experiência Profissional",
            lbl_experience: "Anos de Experiência",
            lbl_education: "Educação",
            section_behavioral: "Perfil Comportamental",
            lbl_expertise: "Áreas de Especialização",
            lbl_communication: "Estilo de Comunicação",
            lbl_notes: "Notas",
            section_softskills: "Competências Interpessoais",
            no_softskills: "Sem avaliação disponível",
            btn_assess_skills: "Avaliar Competências",
            section_commercial: "Perfil Comercial",
            lbl_tags: "Tags",
            lbl_customer_since: "Cliente Desde",
            access_denied: "Acesso Negado: Parâmetros em falta.",
            alert_loading_error: "Erro ao carregar.",
            alert_saving_error: "Erro ao guardar.",
            saving_progress: "A guardar...",
            saving_success: "Guardado!"
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
    async getProfile() {
        try {
            const payload = {
                action: 'get_single_operator',
                vat_number: STATE.vatNumber,
                access_token: STATE.accessToken,
                owner_id: STATE.ownerId,
                role: STATE.role
            };
            
            if (STATE.role === 'operator' && STATE.operatorId) {
                payload.operator_id = STATE.operatorId;
            }

            const response = await fetch(CONFIG.WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (e) {
            console.error("API Error:", e);
            tg.showAlert(I18n.get('alert_loading_error'));
            throw e;
        }
    },

    async saveProfile(data) {
        try {
            const response = await fetch(CONFIG.WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'save_operator_profile',
                    vat_number: STATE.vatNumber,
                    access_token: STATE.accessToken,
                    owner_id: STATE.ownerId,
                    profile_data: data
                })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (e) {
            console.error("Save Error:", e);
            tg.showAlert(I18n.get('alert_saving_error'));
            throw e;
        }
    }
};


// ==========================================
// 4. UI RENDERER
// ==========================================

const UI = {
    renderProfile: () => {
        const identity = STATE.profileData.identity || {};
        const professional = identity.professional_background || {};
        const behavioral = STATE.profileData.behavioral_profile || {};
        const commercial = STATE.profileData.commercial_profile || {};

        // Subtitle
        DOM.pageSubtitle.innerText = STATE.isOwner ? I18n.get('subtitle_owner') : I18n.get('subtitle_operator');

        // Identity
        DOM.fullName.value = identity.full_name || '';
        DOM.email.value = identity.primary_contact?.email || '';
        DOM.phone.value = identity.primary_contact?.phone || '';
        DOM.currentRole.value = professional.current_role || '';

        // Professional
        DOM.yearsExperience.value = professional.years_experience || '';
        DOM.education.value = professional.education || '';

        // Behavioral
        UI.renderTags(DOM.expertiseTags, behavioral.expertise_areas || []);
        DOM.communicationStyle.value = behavioral.communication_style || '';
        DOM.notes.value = behavioral.notes || '';

        // Soft Skills
        if (STATE.profileData.soft_skills && Object.keys(STATE.profileData.soft_skills).length > 0) {
            DOM.noSoftskills.classList.add('hidden');
            DOM.softskillsData.classList.remove('hidden');
            UI.renderSoftSkills(STATE.profileData.soft_skills);
        } else {
            DOM.noSoftskills.classList.remove('hidden');
            DOM.softskillsData.classList.add('hidden');
        }

        // Commercial
        UI.renderTags(DOM.commercialTags, commercial.tags || []);
        if (commercial.customer_since) {
            DOM.customerSince.value = new Date(commercial.customer_since).toLocaleDateString();
        }

        // Enable/Disable editing for Owner
        if (STATE.isOwner) {
            DOM.fullName.removeAttribute('readonly');
            DOM.email.removeAttribute('readonly');
            DOM.phone.removeAttribute('readonly');
            DOM.education.removeAttribute('readonly');
            DOM.communicationStyle.removeAttribute('readonly');
            DOM.notes.removeAttribute('readonly');
            DOM.btnSave.classList.remove('hidden');
        }
    },

    renderTags: (container, tags) => {
        container.innerHTML = '';
        if (!tags || tags.length === 0) {
            container.innerHTML = '<span class="text-muted">-</span>';
            return;
        }
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.innerText = tag;
            container.appendChild(span);
        });
    },

    renderSoftSkills: (skills) => {
        // Rendering semplificato soft skills
        DOM.softskillsData.innerHTML = '<div class="soft-skills-preview">';
        Object.entries(skills).forEach(([key, value]) => {
            DOM.softskillsData.innerHTML += `
                <div class="skill-item">
                    <span class="skill-name">${key}</span>
                    <span class="skill-value">${value}</span>
                </div>
            `;
        });
        DOM.softskillsData.innerHTML += '</div>';
    },

    toggleDirty: () => {
        const currentStr = JSON.stringify(STATE.profileData);
        STATE.hasChanges = (currentStr !== STATE.initialString);
        // FAB già visibile per owner, nessuna gestione condizionale necessaria
    }
};


// ==========================================
// 5. CORE APPLICATION LOGIC
// ==========================================

const App = {
    init: async () => {
        if (!STATE.vatNumber || !STATE.accessToken || !STATE.role) {
            document.body.innerHTML = `<h2 style="color:white;text-align:center;margin-top:50px;">${I18n.get('access_denied')}</h2>`;
            return;
        }

        STATE.isOwner = (STATE.role === 'owner');
        I18n.init();

        try {
            const data = await Api.getProfile();
            STATE.profileData = data.stakeholder_profile || data;
            STATE.initialString = JSON.stringify(STATE.profileData);

            UI.renderProfile();

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

        // Input changes (solo owner)
        if (STATE.isOwner) {
            [DOM.fullName, DOM.email, DOM.phone, DOM.education, DOM.communicationStyle, DOM.notes].forEach(el => {
                el.addEventListener('input', () => {
                    App.updateProfileData();
                    UI.toggleDirty();
                });
            });
        }

        // Bottone Assess Soft Skills
        DOM.btnAssessSoftskills.addEventListener('click', () => {
            if (!STATE.isOwner) {
                tg.showAlert('Solo l\'owner può valutare le proprie soft skills');
                return;
            }
            const params = new URLSearchParams();
            if (STATE.vatNumber) params.set('vat', STATE.vatNumber);
            if (STATE.accessToken) params.set('token', STATE.accessToken);
            if (STATE.ownerId) params.set('user_id', STATE.ownerId);
            params.set('role', 'owner');
            window.location.href = `${CONFIG.SOFTSKILL_PATH}?${params.toString()}`;
        });

        // Bottone Salva
        DOM.btnSave.addEventListener('click', App.save);

        // Bottone Back
        DOM.btnBack.addEventListener('click', () => {
            const params = new URLSearchParams();
            if (STATE.vatNumber) params.set('vat', STATE.vatNumber);
            if (STATE.accessToken) params.set('token', STATE.accessToken);
            if (STATE.ownerId) params.set('owner', STATE.ownerId);
            if (STATE.companyName) params.set('ragione_sociale', STATE.companyName);
            window.location.href = `team.html?${params.toString()}`;
        });
    },

    updateProfileData: () => {
        if (!STATE.profileData.identity) STATE.profileData.identity = {};
        if (!STATE.profileData.identity.primary_contact) STATE.profileData.identity.primary_contact = {};
        if (!STATE.profileData.identity.professional_background) STATE.profileData.identity.professional_background = {};
        if (!STATE.profileData.behavioral_profile) STATE.profileData.behavioral_profile = {};

        STATE.profileData.identity.full_name = DOM.fullName.value;
        STATE.profileData.identity.primary_contact.email = DOM.email.value;
        STATE.profileData.identity.primary_contact.phone = DOM.phone.value;
        STATE.profileData.identity.professional_background.education = DOM.education.value;
        STATE.profileData.behavioral_profile.communication_style = DOM.communicationStyle.value;
        STATE.profileData.behavioral_profile.notes = DOM.notes.value;
    },

    save: async () => {
        const originalIcon = DOM.btnSave.innerHTML;
        DOM.btnSave.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
        DOM.btnSave.disabled = true;

        try {
            const res = await Api.saveProfile(STATE.profileData);
            
            if (res && res.success) {
                STATE.initialString = JSON.stringify(STATE.profileData);
                STATE.hasChanges = false;
                tg.HapticFeedback.notificationOccurred('success');
                tg.showAlert(I18n.get('saving_success'));
            }
        } catch (e) {
            console.error("Save Error:", e);
        } finally {
            DOM.btnSave.innerHTML = originalIcon;
            DOM.btnSave.disabled = false;
        }
    }
};

// AVVIA APPLICAZIONE
document.addEventListener('DOMContentLoaded', App.init);
