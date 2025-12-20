/**
 * PROFILE LOGIC - Visualizzazione STAKEHOLDER_PROFILE con Card Moderne
 * - Owner: può modificare i propri dati e valutare le proprie soft skills
 * - Operator: visualizzazione READ-ONLY
 */

'use strict';

// ==========================================
// 1. CONFIGURATION & STATE
// ==========================================
const CONFIG = {
    WEBHOOK_URL: "https://trinai.api.workflow.dcmake.it/webhook/502d2019-b5ee-4c9b-a14d-8d6545fbb05e"
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
    isOwner: false
};

const DOM = {
    loader: document.getElementById('loader'),
    app: document.getElementById('app-content'),
    
    // HEADER
    profileName: document.getElementById('profileName'),
    profileRole: document.getElementById('profileRole'),
    
    // IDENTITY
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    vatNumber: document.getElementById('vat_number'),
    stakeholderType: document.getElementById('stakeholder_type'),
    status: document.getElementById('status'),
    
    // PROFESSIONAL
    currentRole: document.getElementById('current_role'),
    teamSize: document.getElementById('team_size'),
    yearsExperience: document.getElementById('years_experience'),
    education: document.getElementById('education'),
    specializationLevel: document.getElementById('specialization_level'),
    clientWorkflow: document.getElementById('client_workflow'),
    mainGoal: document.getElementById('main_goal'),
    hardSkillsTags: document.getElementById('hard-skills-tags'),
    digitalToolsTags: document.getElementById('digital-tools-tags'),
    challengesTags: document.getElementById('challenges-tags'),
    learningHistoryContainer: document.getElementById('learning-history-container'),
    
    // BEHAVIORAL
    expertiseTags: document.getElementById('expertise-tags'),
    communicationStyle: document.getElementById('communication_style'),
    currentStance: document.getElementById('current_stance'),
    reputationContainer: document.getElementById('reputation-container'),
    notes: document.getElementById('notes'),
    
    // SOFT SKILLS
    assessmentStatus: document.getElementById('assessment-status'),
    softskillsModules: document.getElementById('softskills-modules'),
    
    // SOCIAL
    socialLinks: document.getElementById('social-links'),
    
    // BUTTONS
    btnBack: document.getElementById('btn-back')
};

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// ==========================================
// 2. API
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
// 3. UI RENDERER
// ==========================================
const UI = {
    renderProfile: () => {
        const data = STATE.profileData;
        const identity = data.identity || {};
        const prof = data.professional_info || {};
        const behavioral = data.behavioral_profile || {};
        const social = data.social_profiles || {};
        const metadata = data.metadata || {};
        
        // HEADER
        DOM.profileName.textContent = data.name || 'N/A';
        DOM.profileRole.textContent = prof.role || data.role || 'N/A';
        
        // IDENTITY
        DOM.email.textContent = data.email || '-';
        DOM.phone.textContent = data.phone || '-';
        DOM.vatNumber.textContent = identity.fiscal_info?.vat_number || '-';
        DOM.stakeholderType.textContent = identity.stakeholder_type || '-';
        
        const statusHtml = metadata.status === 'ACTIVE' 
            ? '<span class="status-badge status-active">ACTIVE</span>'
            : '<span class="status-badge status-incomplete">INACTIVE</span>';
        DOM.status.innerHTML = statusHtml;

        // PROFESSIONAL
        DOM.currentRole.textContent = prof.role || '-';
        DOM.teamSize.textContent = prof.team_size || '-';
        DOM.yearsExperience.textContent = prof.years_experience || '-';
        DOM.education.textContent = prof.certifications || '-';
        DOM.specializationLevel.textContent = prof.specialization_level || '-';
        DOM.clientWorkflow.textContent = prof.client_workflow || '-';
        DOM.mainGoal.textContent = prof.main_goal || '-';
        
        UI.renderTags(DOM.hardSkillsTags, prof.hard_skills || [], 'skill-tag');
        UI.renderTags(DOM.digitalToolsTags, prof.digital_tools || [], 'tag-badge');
        UI.renderTags(DOM.challengesTags, prof.current_challenges || [], 'challenge-tag');

        // 🔥 LEARNING HISTORY (CARD COLLASSABILI)
        UI.renderLearningHistory(prof.learning_history || []);

        // BEHAVIORAL
        UI.renderTags(DOM.expertiseTags, prof.expertise_areas || [], 'skill-tag');
        DOM.communicationStyle.textContent = behavioral.communication_style || 'N/A';
        DOM.currentStance.textContent = behavioral.current_stance?.stance_id || 'UNKNOWN';
        DOM.notes.textContent = behavioral.notes || 'Nessuna nota disponibile.';
        UI.renderReputation(behavioral.public_reputation || {});

        // SOFT SKILLS
        const softSkillsAssessment = data.soft_skills_assessment || {};
        const modulesCompleted = softSkillsAssessment.modules_completed || [];
        const validModules = modulesCompleted.filter(m => m.evaluation);
        UI.renderSoftSkills(validModules, softSkillsAssessment.completed_count || 0, softSkillsAssessment.total_modules || 4);

        // SOCIAL
        UI.renderSocialLinks(social);
    },

    renderTags: (container, tags, className = 'tag-badge') => {
        container.innerHTML = '';
        if (!tags || tags.length === 0) {
            container.innerHTML = '<span class="tag-badge" style="opacity: 0.5;">Nessuno</span>';
            return;
        }
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = className;
            span.textContent = tag;
            container.appendChild(span);
        });
    },

    renderLearningHistory: (history) => {
        if (!history || history.length === 0) {
            DOM.learningHistoryContainer.innerHTML = '<div class="no-data-msg"><i class="fas fa-video"></i><br>Nessun video completato ancora</div>';
            return;
        }

        const engagementLabels = {
            'transformational': '🚀 Trasformativo',
            'standard': '✅ Standard',
            'resistant': '⚠️ Resistenza'
        };

        const engagementClasses = {
            'transformational': 'impact-transformative',
            'standard': 'impact-standard',
            'resistant': 'impact-resistant'
        };

        // 🔥 RENDER CARD COLLASSABILI
        DOM.learningHistoryContainer.innerHTML = history.map((item, index) => {
            const date = item.completed_at 
                ? new Date(item.completed_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'N/A';
            
            const engagementLevel = item.engagement_level || 'standard';
            const engagementLabel = engagementLabels[engagementLevel] || '✅ Standard';
            const engagementClass = engagementClasses[engagementLevel] || 'impact-standard';

            return `
                <div class="knowledge-card" data-learning-index="${index}">
                    <div class="card-header" style="cursor: pointer;">
                        <h3 style="display: flex; align-items: center; gap: 10px; margin: 0; font-size: 15px;">
                            <i class="fas fa-play-circle" style="color: var(--primary);"></i>
                            ${item.video_title || 'Video di Formazione'}
                        </h3>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-size: 12px; color: var(--text-muted);">📅 ${date}</span>
                            <i class="fas fa-chevron-down chevron"></i>
                        </div>
                    </div>
                    <div class="card-content">
                        ${item.reflection_summary ? `
                            <div style="background: rgba(91, 111, 237, 0.1); border-left: 3px solid var(--primary); border-radius: 8px; padding: 12px 15px; margin-bottom: 12px; font-size: 13px; line-height: 1.6;">
                                <strong style="color: var(--primary); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">✍️ Riflessione</strong><br>
                                ${item.reflection_summary}
                            </div>
                        ` : ''}

                        <div style="display: flex; gap: 10px; margin-top: 12px;">
                            <div class="impact-badge ${engagementClass}" style="flex: 1; text-align: center; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: 700;">
                                ${engagementLabel}
                            </div>
                            ${item.score_impact ? `
                                <div class="impact-badge impact-standard" style="flex: 1; text-align: center; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: 700;">
                                    🎯 Impact: ${item.score_impact > 0 ? '+' : ''}${item.score_impact}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // ✨ ATTACH TOGGLE LISTENER
        DOM.learningHistoryContainer.addEventListener('click', (e) => {
            const cardHeader = e.target.closest('.card-header');
            if (cardHeader) {
                const card = cardHeader.parentElement;
                card.classList.toggle('open');
            }
        });
    },

    renderReputation: (reputation) => {
        const sentiment = reputation.sentiment || 'neutral';
        const trustScore = reputation.trust_score || 0;
        const mentions = reputation.media_mentions_count || 0;
        const signals = reputation.credibility_signals || [];
        
        let sentimentColor = '#999';
        if (sentiment === 'positive') sentimentColor = '#4cd964';
        if (sentiment === 'negative') sentimentColor = '#ff3b30';
        
        DOM.reputationContainer.innerHTML = `
            <div style="margin-bottom: 10px;">
                <strong>Sentiment:</strong> 
                <span style="color: ${sentimentColor}; font-weight: 700;">● ${sentiment.toUpperCase()}</span>
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Trust Score:</strong> ${trustScore}/100
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Media Mentions:</strong> ${mentions}
            </div>
            ${signals.length > 0 ? `
                <div style="margin-top: 12px;">
                    <strong>Credibility Signals:</strong><br>
                    ${signals.map(s => `<span style="font-size: 12px; color: var(--text-muted);">• ${s}</span>`).join('<br>')}
                </div>
            ` : ''}
        `;
    },

    renderSocialLinks: (social) => {
        DOM.socialLinks.innerHTML = '';
        const platforms = [
            { key: 'website', icon: 'fa-globe', label: 'Website', bgClass: 'website-bg' },
            { key: 'linkedin', icon: 'fa-linkedin', label: 'LinkedIn', bgClass: 'linkedin-bg' },
            { key: 'facebook', icon: 'fa-facebook', label: 'Facebook', bgClass: 'linkedin-bg' },
            { key: 'twitter', icon: 'fa-twitter', label: 'Twitter', bgClass: 'twitter-bg' },
            { key: 'instagram', icon: 'fa-instagram', label: 'Instagram', bgClass: 'instagram-bg' }
        ];
        
        platforms.forEach(platform => {
            if (social[platform.key]) {
                const link = document.createElement('a');
                link.href = social[platform.key];
                link.target = '_blank';
                link.className = 'social-link';
                link.innerHTML = `
                    <div class="social-icon ${platform.bgClass}">
                        <i class="fab ${platform.icon}"></i>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; font-size: 14px;">${platform.label}</div>
                        <div style="font-size: 12px; color: var(--text-muted); word-break: break-all;">${social[platform.key]}</div>
                    </div>
                    <i class="fas fa-external-link-alt" style="color: var(--text-muted);"></i>
                `;
                DOM.socialLinks.appendChild(link);
            }
        });
        
        if (DOM.socialLinks.children.length === 0) {
            DOM.socialLinks.innerHTML = '<div class="no-data-msg"><i class="fas fa-unlink"></i><br>Nessun profilo social configurato</div>';
        }
    },

    renderSoftSkills: (validModules, completedCount, totalModules) => {
        const moduleNames = {
            modulo1: 'L\'Io Interiore',
            modulo2: 'Sfera Interpersonale',
            modulo3: 'Leadership e Performance',
            modulo4: 'Etica e Responsabilità'
        };

        const moduleIcons = {
            modulo1: 'fa-brain',
            modulo2: 'fa-handshake',
            modulo3: 'fa-rocket',
            modulo4: 'fa-shield-alt'
        };

        // STATUS
        const percentage = (completedCount / totalModules) * 100;
        const statusBadge = completedCount === totalModules
            ? '<span class="status-badge status-active">✅ COMPLETATO</span>'
            : '<span class="status-badge status-incomplete">⏳ IN CORSO</span>';
        
        DOM.assessmentStatus.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div>
                    <div style="font-size: 18px; font-weight: 700; margin-bottom: 5px;">${completedCount}/${totalModules} Moduli</div>
                    <div style="font-size: 13px; color: var(--text-muted);">Completati</div>
                </div>
                ${statusBadge}
            </div>
            <div style="background: rgba(255,255,255,0.1); height: 10px; border-radius: 5px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #5b6fed, #4cd964); height: 100%; width: ${percentage}%; transition: width 0.5s ease; border-radius: 5px;"></div>
            </div>
        `;

        // MODULES
        if (validModules.length === 0) {
            DOM.softskillsModules.innerHTML = '<div class="no-data-msg"><i class="fas fa-chart-line"></i><br>Nessun modulo completato ancora</div>';
            return;
        }

        DOM.softskillsModules.innerHTML = validModules.map(item => {
            const moduleId = item.module;
            const evaluation = item.evaluation;
            const completionDate = item.completion_date 
                ? new Date(item.completion_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'N/A';

            return `
                <div class="module-card">
                    <div class="module-header">
                        <div class="module-title">
                            <i class="fas ${moduleIcons[moduleId] || 'fa-star'}"></i> ${moduleNames[moduleId] || moduleId}
                        </div>
                        <div class="module-date">📅 ${completionDate}</div>
                    </div>
                    
                    <div class="score-row">
                        <div class="score-box">
                            <div class="score-label">Positivo (PP)</div>
                            <div class="score-value positive">${evaluation.PP || 0}</div>
                            <div class="score-desc">${evaluation.CP || '-'}</div>
                        </div>
                        <div class="score-box">
                            <div class="score-label">Negativo (PN)</div>
                            <div class="score-value negative">${evaluation.PN || 0}</div>
                            <div class="score-desc">${evaluation.CN || '-'}</div>
                        </div>
                    </div>

                    ${evaluation.Analisi_Strategica ? `
                        <div class="analysis-block">
                            <div class="analysis-title"><i class="fas fa-lightbulb"></i> Analisi Strategica</div>
                            <div class="analysis-text">${evaluation.Analisi_Strategica}</div>
                        </div>
                    ` : ''}

                    ${evaluation.Impatto_Business ? `
                        <div class="analysis-block" style="border-left-color: var(--warning);">
                            <div class="analysis-title" style="color: var(--warning);"><i class="fas fa-chart-line"></i> Impatto Business</div>
                            <div class="analysis-text">${evaluation.Impatto_Business}</div>
                        </div>
                    ` : ''}

                    ${evaluation.Consigli_Operativi && evaluation.Consigli_Operativi.length > 0 ? `
                        <div style="margin-top: 15px;">
                            <div class="analysis-title" style="color: var(--warning); margin-bottom: 10px;"><i class="fas fa-tasks"></i> Consigli Operativi</div>
                            ${evaluation.Consigli_Operativi.map(c => `<div class="recommendation-item">• ${c}</div>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }
};

// ==========================================
// 4. APP LOGIC
// ==========================================
const App = {
    init: async () => {
        if (!STATE.vatNumber || !STATE.accessToken || !STATE.role) {
            document.body.innerHTML = `<h2 style="color:white;text-align:center;margin-top:50px;">Accesso Negato</h2>`;
            return;
        }

        STATE.isOwner = (STATE.role === 'owner');

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
            tg.showAlert('Errore caricamento profilo');
        }

        App.attachEvents();
    },

    attachEvents: () => {
        // ACCORDION TOGGLE
        DOM.app.addEventListener('click', (e) => {
            if (e.target.closest('.card-header') && !e.target.closest('#learning-history-container')) {
                e.target.closest('.card-header').parentElement.classList.toggle('open');
            }
        });

        // BACK BUTTON
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