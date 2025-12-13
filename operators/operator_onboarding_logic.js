// operator_onboarding_logic.js
// Onboarding Operatore - 2 Step

// CONFIG
const ONBOARDING_API = "https://trinai.api.workflow.dcmake.it/webhook/771638a1-7a79-4cb0-a36e-29b03901cc4a";

// INIT TELEGRAM
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// URL PARAMS
const urlParams = new URLSearchParams(window.location.search);
const invitationCode = urlParams.get('invitation_code');
const chatId = urlParams.get('chat_id');
const langParam = urlParams.get('lang') || 'it';

// STATE
let currentStep = 1;
let ownerCompanyName = "";
let selectedSkills = {}; // { skillName: level }
let certifications = [];

// I18N
const i18n = {
    it: {
        step_identity: "Identità", step_profile: "Profilo",
        h_identity: "Setup & Sicurezza", sub_identity: "Consensi, Chiave API e Verifica Identità.",
        h_profile: "Profilo Professionale", sub_profile: "Competenze e esperienza lavorativa.",
        legal_privacy: "Accetto Privacy Policy", legal_terms: "Accetto Termini di Servizio", legal_ai: "Accetto uso AI (Gemini)",
        btn_get_key: "Ottieni Gratis", byok_note: "La tua chiave personale, nessuno la vedrà.",
        lbl_id_card: "Documento Identità", upload_lock: "Carica documento per procedere",
        lbl_name: "Nome", lbl_surname: "Cognome", lbl_fiscal: "Codice Fiscale", lbl_email: "Email", lbl_phone: "Telefono",
        section_address: "Indirizzo", section_education: "Formazione", section_work: "Esperienza Lavorativa", section_skills: "Competenze Tecniche",
        lbl_education: "Titolo di Studio", lbl_education_field: "Specializzazione / Indirizzo",
        lbl_job_title: "Ruolo / Mansione Principale", lbl_experience: "Anni di Esperienza Totali", lbl_first_job: "Prima Esperienza",
        lbl_first_job_ever: "È la mia prima esperienza lavorativa",
        lbl_works_owner: "Lavoro già per questa azienda", lbl_years_with_owner: "Da quanti anni lavori qui?", lbl_collaboration: "Tipo di collaborazione",
        lbl_certifications: "Certificazioni / Patentini", btn_add_cert: "Aggiungi Certificazione",
        lbl_work_desc: "Descrivi la tua esperienza lavorativa", btn_analyze: "Analizza Competenze con AI",
        hint_skills_ai: "✅ Competenze estratte! Seleziona il livello per ognuna o rimuovila.",
        lbl_other_skills: "Altre competenze (manuale)",
        btn_next: "Avanti", btn_back: "Indietro", btn_complete: "Completa Attivazione",
        access_denied_title: "Accesso Riservato", access_denied_desc: "Attivazione disponibile solo tramite invito.",
        open_bot: "Contatta Owner",
        cv_magic_title: "⚡ Risparmia tempo!", cv_magic_desc: "Carica il tuo CV e compileremo tutto automaticamente",
        btn_upload_cv: "Carica CV (PDF)",
        level_beginner: "Base", level_intermediate: "Intermedio", level_expert: "Esperto"
    },
    en: {
        step_identity: "Identity", step_profile: "Profile",
        h_identity: "Setup & Security", sub_identity: "Consents, API Key and Identity Verification.",
        h_profile: "Professional Profile", sub_profile: "Skills and work experience.",
        legal_privacy: "I accept Privacy Policy", legal_terms: "I accept Terms of Service", legal_ai: "I accept AI usage (Gemini)",
        btn_get_key: "Get Free", byok_note: "Your personal key, nobody will see it.",
        lbl_id_card: "ID Document", upload_lock: "Upload document to proceed",
        lbl_name: "Name", lbl_surname: "Surname", lbl_fiscal: "Fiscal Code", lbl_email: "Email", lbl_phone: "Phone",
        section_address: "Address", section_education: "Education", section_work: "Work Experience", section_skills: "Technical Skills",
        lbl_education: "Education Level", lbl_education_field: "Specialization / Field",
        lbl_job_title: "Role / Position", lbl_experience: "Years of Experience", lbl_first_job: "First Job",
        lbl_first_job_ever: "This is my first job",
        lbl_works_owner: "I already work for this company", lbl_years_with_owner: "How many years?", lbl_collaboration: "Collaboration type",
        lbl_certifications: "Certifications", btn_add_cert: "Add Certification",
        lbl_work_desc: "Describe your work experience", btn_analyze: "Analyze Skills with AI",
        hint_skills_ai: "✅ Skills extracted! Select level for each or remove it.",
        lbl_other_skills: "Other skills (manual)",
        btn_next: "Next", btn_back: "Back", btn_complete: "Complete Activation",
        access_denied_title: "Access Restricted", access_denied_desc: "Activation available only via invitation.",
        open_bot: "Contact Owner",
        cv_magic_title: "⚡ Save time!", cv_magic_desc: "Upload your CV and we'll fill everything automatically",
        btn_upload_cv: "Upload CV (PDF)",
        level_beginner: "Beginner", level_intermediate: "Intermediate", level_expert: "Expert"
    }
};

const lang = i18n[langParam] ? langParam : 'it';
const t = i18n[lang] || i18n['en'];

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerText = t[el.getAttribute('data-i18n')];
    });
}
applyTranslations();

// RENDER SKILLS GRID
function renderSkillsGrid() {
    const grid = document.getElementById('skills-grid');
    grid.innerHTML = '';
    
    Object.keys(selectedSkills).forEach(skill => {
        const level = selectedSkills[skill];
        
        const div = document.createElement('div');
        div.className = 'card';
        div.style.padding = '10px';
        div.style.background = 'rgba(91, 111, 237, 0.2)';
        div.style.border = '1px solid var(--primary)';
        
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div style="font-size: 13px; font-weight: 500;">${skill}</div>
                <button type="button" onclick="removeSkill('${skill}')" style="background:none; border:none; color:var(--danger); cursor:pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="level-selector">
                <button type="button" class="level-btn ${level === 'beginner' ? 'active' : ''}" onclick="setSkillLevel('${skill}', 'beginner')">${t.level_beginner}</button>
                <button type="button" class="level-btn ${level === 'intermediate' ? 'active' : ''}" onclick="setSkillLevel('${skill}', 'intermediate')">${t.level_intermediate}</button>
                <button type="button" class="level-btn ${level === 'expert' ? 'active' : ''}" onclick="setSkillLevel('${skill}', 'expert')">${t.level_expert}</button>
            </div>
        `;
        
        grid.appendChild(div);
    });
}

window.removeSkill = function(skill) {
    delete selectedSkills[skill];
    renderSkillsGrid();
}

window.setSkillLevel = function(skill, level) {
    selectedSkills[skill] = level;
    renderSkillsGrid();
}

// CERTIFICAZIONI
window.addCertification = function() {
    const list = document.getElementById('certifications-list');
    const index = certifications.length;
    
    const div = document.createElement('div');
    div.className = 'cert-input-group';
    div.innerHTML = `
        <input type="text" placeholder="Es: Patentino PES-PAV" data-cert-index="${index}">
        <button type="button" onclick="removeCertification(${index})"><i class="fas fa-trash"></i></button>
    `;
    
    list.appendChild(div);
    certifications.push('');
}

window.removeCertification = function(index) {
    certifications.splice(index, 1);
    renderCertifications();
}

function renderCertifications() {
    const list = document.getElementById('certifications-list');
    list.innerHTML = '';
    certifications.forEach((cert, idx) => {
        const div = document.createElement('div');
        div.className = 'cert-input-group';
        div.innerHTML = `
            <input type="text" value="${cert}" placeholder="Es: Patentino PES-PAV" data-cert-index="${idx}" oninput="updateCertification(${idx}, this.value)">
            <button type="button" onclick="removeCertification(${idx})"><i class="fas fa-trash"></i></button>
        `;
        list.appendChild(div);
    });
}

window.updateCertification = function(index, value) {
    certifications[index] = value;
}

// TOGGLE PRIMA ESPERIENZA & OWNER WORK DETAILS
document.addEventListener('DOMContentLoaded', function() {
    // Toggle prima esperienza
    const firstJobCheckbox = document.getElementById('is_first_job');
    if (firstJobCheckbox) {
        firstJobCheckbox.addEventListener('change', function() {
            const experienceFields = document.getElementById('experience-fields');
            const experienceYears = document.getElementById('experience_years');
            const firstJobYear = document.getElementById('first_job_year');
            
            if (this.checked) {
                experienceFields.style.opacity = '0.5';
                experienceFields.style.pointerEvents = 'none';
                experienceYears.disabled = true;
                firstJobYear.disabled = true;
                experienceYears.value = '';
                firstJobYear.value = '';
            } else {
                experienceFields.style.opacity = '1';
                experienceFields.style.pointerEvents = 'auto';
                experienceYears.disabled = false;
                firstJobYear.disabled = false;
            }
        });
    }
    
    // Toggle owner work details
    const worksCheckbox = document.getElementById('works_for_owner');
    if (worksCheckbox) {
        worksCheckbox.addEventListener('change', function() {
            const details = document.getElementById('owner-work-details');
            if (this.checked) {
                details.classList.remove('hidden');
            } else {
                details.classList.add('hidden');
                document.getElementById('years_with_owner').value = '';
                document.getElementById('collaboration_type').value = '';
            }
        });
    }
});

// CV UPLOAD & PARSING
document.getElementById('cv_upload').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const cvStatus = document.getElementById('cv-status');
    const cvStatusText = document.getElementById('cv-status-text');
    
    cvStatus.classList.remove('hidden');
    cvStatusText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analisi CV in corso...';
    
    const reader = new FileReader();
    reader.onload = async function(event) {
        const base64 = event.target.result;
        
        try {
            const res = await fetch(ONBOARDING_API, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    action: 'parse_cv',
                    chat_id: chatId,
                    cv_base64: base64,
                    gemini_key: document.getElementById('gemini_key').value
                })
            });
            
            const data = await res.json();
            
            if (res.ok && data.profile) {
                // Auto-fill tutti i campi
                const p = data.profile;
                
                // Indirizzo
                if (p.address) {
                    document.getElementById('addr_route').value = p.address.route || '';
                    document.getElementById('addr_num').value = p.address.number || '';
                    document.getElementById('addr_zip').value = p.address.zip || '';
                    document.getElementById('addr_city').value = p.address.city || '';
                    document.getElementById('addr_prov').value = p.address.province || '';
                }
                
                // Formazione
                if (p.education_level) document.getElementById('education_level').value = p.education_level;
                if (p.education_field) document.getElementById('education_field').value = p.education_field;
                
                // Esperienza
                if (p.job_title) document.getElementById('job_title').value = p.job_title;
                if (p.experience_years) document.getElementById('experience_years').value = p.experience_years;
                if (p.first_job_year) document.getElementById('first_job_year').value = p.first_job_year;
                
                // Descrizione
                if (p.work_description) document.getElementById('work_description').value = p.work_description;
                
                // Skills
                if (p.hard_skills && p.hard_skills.length > 0) {
                    selectedSkills = {};
                    p.hard_skills.forEach(skill => {
                        selectedSkills[skill.skill] = skill.level || 'intermediate';
                    });
                    document.getElementById('skills-result').classList.remove('hidden');
                    renderSkillsGrid();
                }
                
                // Certificazioni
                if (p.certifications && p.certifications.length > 0) {
                    certifications = p.certifications;
                    renderCertifications();
                }
                
                cvStatusText.innerHTML = '<i class="fas fa-check" style="color:var(--success);"></i> CV analizzato! Tutti i campi sono stati compilati.';
                tg.HapticFeedback.notificationOccurred('success');
            } else {
                throw new Error('Parsing failed');
            }
        } catch (e) {
            console.error(e);
            cvStatusText.innerHTML = '<i class="fas fa-exclamation-triangle" style="color:var(--danger);"></i> Errore analisi CV. Compila manualmente.';
        }
    };
    
    reader.readAsDataURL(file);
});

// VALIDATE INVITATION
async function validateInvitation() {
    if (!invitationCode || !chatId) {
        document.getElementById('loader').classList.add('hidden');
        document.getElementById('access-denied').classList.remove('hidden');
        return false;
    }
    
    try {
        const res = await fetch(ONBOARDING_API, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                action: 'validate_invitation',
                invitation_code: invitationCode,
                chat_id: chatId
            })
        });
        
        const data = await res.json();
        
        if (res.ok && data.valid) {
            ownerCompanyName = data.company_name || "l'azienda";
            document.getElementById('company-name-display').innerText = ownerCompanyName;
            
            document.getElementById('loader').classList.add('hidden');
            document.getElementById('app-content').classList.remove('hidden');
            return true;
        } else {
            throw new Error('Invalid invitation');
        }
    } catch (e) {
        console.error(e);
        document.getElementById('loader').classList.add('hidden');
        document.getElementById('access-denied').classList.remove('hidden');
        return false;
    }
}

// STEP NAVIGATION
function goToStep(step) {
    document.querySelectorAll('.step-content').forEach(s => s.classList.add('hidden'));
    document.getElementById(`step-${step}`).classList.remove('hidden');
    
    document.querySelectorAll('.step-item').forEach(s => s.classList.remove('active'));
    for (let i = 1; i <= step; i++) {
        document.getElementById(`si-${i}`).classList.add('active');
    }
    
    const progressFill = document.getElementById('progress-fill');
    progressFill.style.width = `${((step - 1) / 1) * 100}%`;
    
    currentStep = step;
}

// VALIDATION STEP 1
function validateStep1() {
    const chkPrivacy = document.getElementById('chk_privacy').checked;
    const chkTerms = document.getElementById('chk_terms').checked;
    const chkAi = document.getElementById('chk_ai').checked;
    const geminiKey = document.getElementById('gemini_key').value.trim();
    const name = document.getElementById('name').value.trim();
    const surname = document.getElementById('surname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    return chkPrivacy && chkTerms && chkAi && geminiKey && name && surname && email && phone;
}

function checkStep1() {
    document.getElementById('btn-step1').disabled = !validateStep1();
}

// DOCUMENT UPLOAD & OCR
document.getElementById('id_document').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    document.getElementById('upload-text').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analisi in corso...';
    
    const reader = new FileReader();
    reader.onload = async function(event) {
        const base64 = event.target.result;
        
        try {
            const res = await fetch(ONBOARDING_API, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    action: 'parse_document',
                    chat_id: chatId,
                    document_base64: base64,
                    gemini_key: document.getElementById('gemini_key').value
                })
            });
            
            const data = await res.json();
            
            if (res.ok && data.extracted) {
                document.getElementById('name').value = data.extracted.name || '';
                document.getElementById('surname').value = data.extracted.surname || '';
                document.getElementById('fiscal_code').value = data.extracted.fiscal_code || '';
                
                document.getElementById('upload-text').innerHTML = '<i class="fas fa-check"></i> Documento verificato';
                document.getElementById('upload-icon').innerHTML = '<i class="fas fa-check-circle" style="color:var(--success);"></i>';
            } else {
                throw new Error('Parsing failed');
            }
        } catch (e) {
            console.error(e);
            document.getElementById('upload-text').innerHTML = '<i class="fas fa-exclamation-triangle"></i> Errore analisi, compila manualmente';
        }
        
        checkStep1();
    };
    
    reader.readAsDataURL(file);
});

// LISTENERS
document.querySelectorAll('#step-1 input, #step-1 select').forEach(el => {
    el.addEventListener('input', checkStep1);
    el.addEventListener('change', checkStep1);
});

document.getElementById('btn-step1').addEventListener('click', () => {
    if (validateStep1()) {
        goToStep(2);
    }
});

document.getElementById('btn-back-s2').addEventListener('click', () => goToStep(1));

// ANALYZE SKILLS WITH AI
window.analyzeSkills = async function() {
    const workDescription = document.getElementById('work_description').value.trim();
    
    if (!workDescription) {
        alert('Inserisci una descrizione della tua esperienza lavorativa');
        return;
    }
    
    const btn = document.getElementById('analyze-skills-btn');
    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analisi in corso...';
    
    try {
        const res = await fetch(ONBOARDING_API, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                action: 'analyze_skills',
                chat_id: chatId,
                gemini_key: document.getElementById('gemini_key').value,
                work_description: workDescription,
                job_title: document.getElementById('job_title').value,
                experience_years: document.getElementById('experience_years').value
            })
        });
        
        const data = await res.json();
        
        if (res.ok && data.skills) {
            selectedSkills = {};
            data.skills.forEach(skill => {
                selectedSkills[skill.name] = skill.level || 'intermediate';
            });
            
            document.getElementById('skills-result').classList.remove('hidden');
            renderSkillsGrid();
            
            tg.HapticFeedback.notificationOccurred('success');
        } else {
            throw new Error('Analysis failed');
        }
        
    } catch (e) {
        console.error(e);
        alert('❌ Errore durante l\'analisi. Riprova o inserisci competenze manualmente.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
    }
}

// SUBMIT FINALE
document.getElementById('submitBtn').addEventListener('click', async () => {
    const btn = document.getElementById('submitBtn');
    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvataggio...';
    
    // Raccogli certificazioni finali
    document.querySelectorAll('[data-cert-index]').forEach(input => {
        const idx = parseInt(input.getAttribute('data-cert-index'));
        certifications[idx] = input.value.trim();
    });
    
    const isFirstJob = document.getElementById('is_first_job').checked;
    
    const operatorData = {
        // Anagrafica
        name: document.getElementById('name').value,
        surname: document.getElementById('surname').value,
        fiscal_code: document.getElementById('fiscal_code').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        
        // Indirizzo
        address: {
            route: document.getElementById('addr_route').value,
            number: document.getElementById('addr_num').value,
            zip: document.getElementById('addr_zip').value,
            city: document.getElementById('addr_city').value,
            province: document.getElementById('addr_prov').value
        },
        
        // Config
        gemini_key: document.getElementById('gemini_key').value,
        lenguage: langParam,
        
        // Formazione
        education_level: document.getElementById('education_level').value,
        education_field: document.getElementById('education_field').value,
        
        // Professionale
        job_title: document.getElementById('job_title').value,
        is_first_job: isFirstJob,
        experience_years: isFirstJob ? null : document.getElementById('experience_years').value,
        first_job_year: isFirstJob ? null : document.getElementById('first_job_year').value,
        
        // Rapporto Owner
        works_for_owner: document.getElementById('works_for_owner').checked,
        years_with_owner: document.getElementById('years_with_owner').value,
        collaboration_type: document.getElementById('collaboration_type').value,
        
        certifications: certifications.filter(c => c),
        
        // Skills
        work_description: document.getElementById('work_description').value,
        hard_skills: Object.keys(selectedSkills).map(skill => ({
            skill: skill,
            level: selectedSkills[skill]
        })),
        other_skills: document.getElementById('other_skills').value,
        
        // Sistema
        operator_chat_id: chatId,
        invitation_code: invitationCode
    };
    
    try {
        const res = await fetch(ONBOARDING_API, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                action: 'complete_onboarding',
                chat_id: chatId,
                operator_data: operatorData
            })
        });
        
        if (res.ok) {
            tg.HapticFeedback.notificationOccurred('success');
            alert('✅ Attivazione completata con successo!');
            
            const redirectUrl = res.headers.get('X-Redirect-Url');
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                tg.close();
            }
        } else {
            throw new Error('Save failed');
        }
    } catch (e) {
        console.error(e);
        alert('❌ Errore durante il salvataggio. Riprova.');
        btn.disabled = false;
        btn.innerHTML = originalHtml;
    }
});

// START
validateInvitation();