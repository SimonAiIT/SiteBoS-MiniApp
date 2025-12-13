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
        section_address: "Indirizzo", section_work: "Esperienza Lavorativa", section_skills: "Competenze Tecniche",
        lbl_job_title: "Ruolo / Mansione", lbl_experience: "Anni di Esperienza", lbl_certifications: "Certificazioni / Patentini",
        btn_add_cert: "Aggiungi Certificazione", lbl_other_skills: "Altre competenze (campo libero)",
        hint_skills: "Seleziona le tue competenze principali e indica il livello.",
        btn_next: "Avanti", btn_back: "Indietro", btn_complete: "Completa Attivazione",
        access_denied_title: "Accesso Riservato", access_denied_desc: "Attivazione disponibile solo tramite invito.",
        open_bot: "Contatta Owner",
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
        section_address: "Address", section_work: "Work Experience", section_skills: "Technical Skills",
        lbl_job_title: "Role / Position", lbl_experience: "Years of Experience", lbl_certifications: "Certifications",
        btn_add_cert: "Add Certification", lbl_other_skills: "Other skills (free text)",
        hint_skills: "Select your main skills and indicate the level.",
        btn_next: "Next", btn_back: "Back", btn_complete: "Complete Activation",
        access_denied_title: "Access Restricted", access_denied_desc: "Activation available only via invitation.",
        open_bot: "Contact Owner",
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

// HARD SKILLS PREDEFINITE (popolamento dinamico)
const HARD_SKILLS_DB = [
    "Impianti elettrici", "Fotovoltaico", "Domotica", "Quadri elettrici",
    "Impianti idraulici", "Termoidraulica", "Condizionamento", "Riscaldamento",
    "Falegnameria", "Muratura", "Intonacatura", "Piastrellista",
    "Carpenteria", "Saldatura TIG", "Saldatura MIG", "Tornitura",
    "Meccanica auto", "Diagnosi elettronica", "Carrozzeria", "Gommista",
    "Programmazione PLC", "Manutenzione macchinari", "Pneumatica", "Oleodinamica",
    "Giardinaggio", "Potatura", "Irrigazione", "Manutenzione verde",
    "Grafica", "Web design", "SEO", "Social media marketing",
    "Contabilità", "Buste paga", "Fatturazione", "Amministrazione"
];

// RENDER SKILLS GRID
function renderSkillsGrid() {
    const grid = document.getElementById('skills-grid');
    grid.innerHTML = '';
    
    HARD_SKILLS_DB.forEach(skill => {
        const isSelected = selectedSkills[skill] !== undefined;
        
        const div = document.createElement('div');
        div.className = 'card';
        div.style.padding = '10px';
        div.style.cursor = 'pointer';
        div.style.background = isSelected ? 'rgba(91, 111, 237, 0.2)' : 'rgba(255,255,255,0.05)';
        div.style.border = isSelected ? '1px solid var(--primary)' : '1px solid transparent';
        
        div.innerHTML = `
            <div style="font-size: 13px; font-weight: 500; margin-bottom: ${isSelected ? '8px' : '0'};">${skill}</div>
            ${isSelected ? `
                <div class="level-selector">
                    <button type="button" class="level-btn ${selectedSkills[skill] === 'beginner' ? 'active' : ''}" onclick="setSkillLevel('${skill}', 'beginner')">${t.level_beginner}</button>
                    <button type="button" class="level-btn ${selectedSkills[skill] === 'intermediate' ? 'active' : ''}" onclick="setSkillLevel('${skill}', 'intermediate')">${t.level_intermediate}</button>
                    <button type="button" class="level-btn ${selectedSkills[skill] === 'expert' ? 'active' : ''}" onclick="setSkillLevel('${skill}', 'expert')">${t.level_expert}</button>
                </div>
            ` : ''}
        `;
        
        div.addEventListener('click', (e) => {
            if (e.target.classList.contains('level-btn')) return; // Ignora click su bottoni livello
            toggleSkill(skill);
        });
        
        grid.appendChild(div);
    });
}

window.toggleSkill = function(skill) {
    if (selectedSkills[skill]) {
        delete selectedSkills[skill];
    } else {
        selectedSkills[skill] = 'intermediate'; // Default
    }
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
    document.getElementById('gemini_key').disabled = false;
    
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
        renderSkillsGrid();
    }
});

document.getElementById('btn-back-s2').addEventListener('click', () => goToStep(1));

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
        
        // Professionale
        job_title: document.getElementById('job_title').value,
        experience_years: document.getElementById('experience_years').value,
        certifications: certifications.filter(c => c),
        
        // Skills
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
            
            // Redirect a dashboard operatore
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