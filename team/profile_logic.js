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
    SOFTSKILL_PATH: "../softskill/dashboard.html"
};

const urlParams = new URLSearchParams(window.location.search);

const STATE = {
    vatNumber: urlParams.get('vat'),
    accessToken: urlParams.get('token'),
    ownerId: urlParams.get('owner'),
    operatorId: urlParams.get('operator_id'),
    role: urlParams.get('role'),
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
    stakeholderType: document.getElementById('stakeholder_type'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    vatNumber: document.getElementById('vat_number'),
    currentRole: document.getElementById('current_role'),
    teamSize: document.getElementById('team_size'),
    yearsExperience: document.getElementById('years_experience'),
    education: document.getElementById('education'),
    hardSkillsTags: document.getElementById('hard-skills-tags'),
    specializationLevel: document.getElementById('specialization_level'),
    clientWorkflow: document.getElementById('client_workflow'),
    digitalToolsTags: document.getElementById('digital-tools-tags'),
    challengesTags: document.getElementById('challenges-tags'),
    mainGoal: document.getElementById('main_goal'),
    expertiseTags: document.getElementById('expertise-tags'),
    communicationStyle: document.getElementById('communication_style'),
    currentStance: document.getElementById('current_stance'),
    reputationContainer: document.getElementById('reputation-container'),
    notes: document.getElementById('notes'),
    softskillsContainer: document.getElementById('softskills-container'),
    noSoftskills: document.getElementById('no-softskills'),
    softskillsData: document.getElementById('softskills-data'),
    btnAssessSoftskills: document.getElementById('btn-assess-softskills'),
    commercialTags: document.getElementById('commercial-tags'),
    customerSince: document.getElementById('customer_since'),
    lifetimeValue: document.getElementById('lifetime_value'),
    socialLinks: document.getElementById('social-links'),
    btnSave: document.getElementById('btn-save'),
    btnBack: document.getElementById('btn-back')
};

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// ==========================================
// 2. I18N
// ==========================================
const I18n = {
    dict: {
        it: {
            title: "Profilo Stakeholder",
            subtitle_owner: "Visualizza e modifica il tuo profilo",
            subtitle_operator: "Visualizzazione profilo collaboratore",
            section_identity: "Identità",
            lbl_full_name: "Nome Completo",
            lbl_stakeholder_type: "Tipo Stakeholder",
            lbl_email: "Email",
            lbl_phone: "Telefono",
            lbl_vat: "Partita IVA",
            lbl_role: "Ruolo",
            lbl_team_size: "Team Size",
            section_professional: "Background Professionale",
            lbl_experience: "Anni di Esperienza",
            lbl_education: "Certificazioni",
            lbl_hard_skills: "Hard Skills",
            lbl_specialization: "Livello Specializzazione",
            lbl_client_workflow: "Workflow Cliente",
            lbl_digital_tools: "Strumenti Digitali",
            lbl_challenges: "Sfide Attuali",
            lbl_main_goal: "Obiettivo Principale",
            section_behavioral: "Profilo Comportamentale",
            lbl_expertise: "Aree di Competenza",
            lbl_communication: "Stile di Comunicazione",
            lbl_current_stance: "Stance Attuale",
            lbl_public_reputation: "Reputazione Pubblica",
            lbl_notes: "Note Intelligence",
            section_softskills: "Soft Skills",
            no_softskills: "Nessuna valutazione disponibile",
            btn_assess_skills: "Valuta Soft Skills",
            section_commercial: "Profilo Commerciale",
            section_social: "Profili Social",
            lbl_tags: "Tag",
            lbl_customer_since: "Cliente Dal",
            lbl_lifetime_value: "Lifetime Value",
            access_denied: "Accesso Negato",
            alert_loading_error: "Errore caricamento",
            alert_saving_error: "Errore salvataggio",
            saving_success: "Salvato!"
        }
    },
    init: function() {
        STATE.currentLang = 'it';
        this.apply();
    },
    get: function(key) {
        return this.dict.it[key] || key;
    },
    apply: function() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.innerHTML = this.get(el.getAttribute('data-i18n'));
        });
    }
};

// ==========================================
// 3. API
// ==========================================
const Api = {
    async getProfile() {
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
    }
};

// ==========================================
// 4. UI RENDERER
// ==========================================
const UI = {
    renderProfile: () => {
        const data = STATE.profileData;
        const identity = data.identity || {};
        const prof = data.professional_info || {};
        const behavioral = data.behavioral_profile || {};
        const commercial = data.commercial_profile || {};
        const social = data.social_profiles || {};
        
        // IDENTITY
        DOM.fullName.value = data.name || '';
        DOM.stakeholderType.value = identity.stakeholder_type || 'N/A';
        DOM.email.value = data.email || '';
        DOM.phone.value = data.phone || '';
        DOM.vatNumber.value = identity.fiscal_info?.vat_number || 'N/A';

        // PROFESSIONAL
        DOM.currentRole.value = prof.role || 'N/A';
        DOM.teamSize.value = prof.team_size || 'N/A';
        DOM.yearsExperience.value = prof.years_experience || 'N/A';
        DOM.education.value = prof.certifications || '';
        UI.renderTags(DOM.hardSkillsTags, prof.hard_skills || []);
        DOM.specializationLevel.value = prof.specialization_level || 'N/A';
        DOM.clientWorkflow.value = prof.client_workflow || 'N/A';
        UI.renderTags(DOM.digitalToolsTags, prof.digital_tools || []);
        UI.renderTags(DOM.challengesTags, prof.current_challenges || []);
        DOM.mainGoal.value = prof.main_goal || 'N/A';

        // BEHAVIORAL
        UI.renderTags(DOM.expertiseTags, prof.expertise_areas || []);
        DOM.communicationStyle.value = behavioral.communication_style || 'N/A';
        DOM.currentStance.value = behavioral.current_stance?.stance_id || 'UNKNOWN';
        UI.renderReputation(behavioral.public_reputation || {});
        DOM.notes.value = behavioral.notes || '';

        // SOFT SKILLS
        const softSkillsAssessment = data.soft_skills_assessment || {};
        const modulesCompleted = softSkillsAssessment.modules_completed || [];
        const validModules = modulesCompleted.filter(m => m.evaluation);

        if (validModules.length > 0) {
            DOM.noSoftskills.classList.add('hidden');
            DOM.softskillsData.classList.remove('hidden');
            UI.renderSoftSkills(validModules, softSkillsAssessment.completed_count || 0);
        } else {
            DOM.noSoftskills.classList.remove('hidden');
            DOM.softskillsData.classList.add('hidden');
        }

        // COMMERCIAL
        UI.renderTags(DOM.commercialTags, commercial.tags || []);
        if (commercial.customer_since) {
            DOM.customerSince.value = new Date(commercial.customer_since).toLocaleDateString('it-IT');
        }
        DOM.lifetimeValue.value = `€ ${commercial.lifetime_value || 0}`;

        // SOCIAL
        UI.renderSocialLinks(social);

        DOM.pageSubtitle.innerText = STATE.isOwner ? I18n.get('subtitle_owner') : I18n.get('subtitle_operator');
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

    renderReputation: (reputation) => {
        const sentiment = reputation.sentiment || 'neutral';
        const trustScore = reputation.trust_score || 0;
        const mentions = reputation.media_mentions_count || 0;
        
        DOM.reputationContainer.innerHTML = `
            <div style="margin-bottom: 8px;">
                <strong>Sentiment:</strong> <span style="color: ${sentiment === 'positive' ? '#4cd964' : sentiment === 'negative' ? '#ff3b30' : '#999'};">${sentiment}</span>
            </div>
            <div style="margin-bottom: 8px;">
                <strong>Trust Score:</strong> ${trustScore}/100
            </div>
            <div>
                <strong>Media Mentions:</strong> ${mentions}
            </div>
        `;
    },

    renderSocialLinks: (social) => {
        DOM.socialLinks.innerHTML = '';
        const platforms = [
            { key: 'website', icon: 'fa-globe', label: 'Website' },
            { key: 'linkedin', icon: 'fa-linkedin', label: 'LinkedIn' },
            { key: 'facebook', icon: 'fa-facebook', label: 'Facebook' },
            { key: 'twitter', icon: 'fa-twitter', label: 'Twitter' },
            { key: 'instagram', icon: 'fa-instagram', label: 'Instagram' }
        ];
        
        platforms.forEach(platform => {
            if (social[platform.key]) {
                const link = document.createElement('a');
                link.href = social[platform.key];
                link.target = '_blank';
                link.style.cssText = 'display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; text-decoration: none; color: var(--text-main);';
                link.innerHTML = `<i class="fab ${platform.icon}" style="font-size: 20px;"></i> <span>${platform.label}</span>`;
                DOM.socialLinks.appendChild(link);
            }
        });
        
        if (DOM.socialLinks.children.length === 0) {
            DOM.socialLinks.innerHTML = '<span class="text-muted">Nessun profilo social configurato</span>';
        }
    },

    renderSoftSkills: (validModules, completedCount) => {
        const moduleNames = {
            modulo1: '🧘 L\'Io Interiore',
            modulo2: '🤝 Sfera Interpersonale',
            modulo3: '🎯 Leadership e Performance',
            modulo4: '🚀 Innovazione e Adattamento'
        };

        let html = `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                    <span style="font-size: 14px; color: var(--success); font-weight: 600;">
                        ✅ ${completedCount}/4 Moduli Completati
                    </span>
                </div>
                <div style="background: rgba(255,255,255,0.1); height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #5b6fed, #4cd964); height: 100%; width: ${(completedCount / 4) * 100}%; transition: width 0.5s ease;"></div>
                </div>
            </div>
        `;

        validModules.forEach(item => {
            const moduleId = item.module;
            const evaluation = item.evaluation;
            const completionDate = item.completion_date ? new Date(item.completion_date).toLocaleDateString('it-IT') : 'N/A';

            html += `
                <div style="background: rgba(0,0,0,0.2); border-radius: 10px; padding: 16px; margin-bottom: 12px; border-left: 4px solid var(--success);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="margin: 0; font-size: 16px;">${moduleNames[moduleId] || moduleId}</h4>
                        <span style="font-size: 12px; color: var(--text-muted);">${completionDate}</span>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                        <div style="text-align: center; background: rgba(76, 217, 100, 0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(76, 217, 100, 0.3);">
                            <div style="font-size: 24px; font-weight: bold; color: #4cd964;">${evaluation.PP}%</div>
                            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">POSITIVO</div>
                            <div style="font-size: 12px; margin-top: 6px; line-height: 1.3;">${evaluation.CP}</div>
                        </div>
                        <div style="text-align: center; background: rgba(255, 59, 48, 0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(255, 59, 48, 0.3);">
                            <div style="font-size: 24px; font-weight: bold; color: #ff3b30;">${evaluation.PN}%</div>
                            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">NEGATIVO</div>
                            <div style="font-size: 12px; margin-top: 6px; line-height: 1.3;">${evaluation.CN}</div>
                        </div>
                    </div>
                    
                    <div style="font-size: 12px; color: var(--text-muted); line-height: 1.5;">
                        <strong style="color: var(--primary);">⏱ Valutazione:</strong> ${evaluation.Valutazione_Tempi}
                    </div>
                </div>
            `;
        });

        DOM.softskillsData.innerHTML = html;
    }
};

// ==========================================
// 5. APP LOGIC
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
            const response = await Api.getProfile();
            if (response.success && response.data) {
                STATE.profileData = response.data;
            } else {
                throw new Error('Invalid response');
            }
            
            UI.renderProfile();
            DOM.loader.classList.add('hidden');
            DOM.app.classList.remove('hidden');
        } catch (e) {
            console.error("Error:", e);
            tg.showAlert(I18n.get('alert_loading_error'));
        }

        App.attachEvents();
    },

    attachEvents: () => {
        DOM.app.addEventListener('click', (e) => {
            if (e.target.closest('.card-header')) {
                e.target.closest('.card-header').parentElement.classList.toggle('open');
            }
        });

        DOM.btnAssessSoftskills.addEventListener('click', () => {
            if (!STATE.isOwner) {
                tg.showAlert('Solo l\'owner può valutare le soft skills');
                return;
            }
            const params = new URLSearchParams();
            if (STATE.vatNumber) params.set('vat', STATE.vatNumber);
            if (STATE.accessToken) params.set('token', STATE.accessToken);
            if (STATE.ownerId) params.set('user_id', STATE.ownerId);
            params.set('role', 'owner');
            window.location.href = `${CONFIG.SOFTSKILL_PATH}?${params.toString()}`;
        });

        DOM.btnBack.addEventListener('click', () => {
            const params = new URLSearchParams();
            if (STATE.vatNumber) params.set('vat', STATE.vatNumber);
            if (STATE.accessToken) params.set('token', STATE.accessToken);
            if (STATE.ownerId) params.set('owner', STATE.ownerId);
            if (STATE.companyName) params.set('ragione_sociale', STATE.companyName);
            window.location.href = `team.html?${params.toString()}`;
        });
    }
};

document.addEventListener('DOMContentLoaded', App.init);