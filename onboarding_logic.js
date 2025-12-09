/**
 * ONBOARDING LOGIC - SITEBOS (v4.0 - COMPLETE QUESTIONNAIRE)
 * 1. FIX: Aggiornamento immediato e visibile dei campi input dopo l'analisi AI.
 * 2. Logica di sicurezza e validazione completa.
 * 3. Traduzioni complete.
 * 4. ✅ Instagram e Twitter nei social media.
 * 5. ✅ Professional questionnaire (12 domande) salvato in kyc_details.
 */

// --- CONFIG ---
const WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/1211a23e-ff91-4d3c-8938-aa273555bd8e"; 

const tg = window.Telegram.WebApp; 
tg.ready(); tg.expand();

// --- I18N DICTIONARY (COMPLETO) ---
const i18n = {
    it: {
        access_denied_title:"Accesso Negato", access_denied_desc:"Accesso solo via Bot.", open_bot:"Apri Bot",
        step_identity:"Start", step_company:"Azienda", step_plan:"Promo",
        h_identity:"Setup & Sicurezza", sub_identity:"Consensi, Chiave API e KYC.",
        legal_privacy: "Dichiaro di aver letto e accettato la <a href='legal.html?lang=it' target='_blank'>Privacy Policy</a>.",
        legal_terms: "Accetto i <a href='legal.html?lang=it' target='_blank'>Termini e Condizioni</a>.",
        legal_ai:"Autorizzo analisi AI per KYC.",
        btn_get_key:"Genera Gratis", byok_note:"⚠️ BYOK: Dati sotto il tuo controllo.",
        lbl_id_card:"Documento (Fronte)", upload_lock:"Accetta termini per sbloccare", upload_hint:"Carica Foto/PDF",
        lbl_name:"Nome", lbl_surname:"Cognome", lbl_fiscal:"Codice Fiscale", lbl_email:"Email (Admin)", lbl_phone:"Cellulare",
        btn_next:"Avanti", btn_back:"Indietro",
        h_company:"Profilo Aziendale", sub_company:"Configurazione operativa e fiscale.",
        lbl_company_name:"Ragione Sociale", lbl_vat:"P.IVA", lbl_sdi:"SDI / PEC", lbl_address:"Sede Legale", lbl_site:"Sito Web",
        section_identity: "IDENTITÀ OPERATIVA", section_social: "SOCIAL MEDIA (Opzionali)", lbl_sector: "Settore di Attività",
        section_professional: "PROFILO PROFESSIONALE (5 min)", hint_professional: "💡 Aiutaci a personalizzare il sistema rispondendo a queste domande",
        sector_group_services: "Servizi",
            sector_pro: "Servizi Professionali (Avvocato, Commercialista...)",
            sector_consulting: "Consulenza (IT, Marketing, HR...)",
            sector_personal: "Servizi alla Persona (Benessere, Estetica, Fitness...)",
        sector_group_commerce: "Commercio",
            sector_retail: "Commercio al Dettaglio / Negozio Fisico",
            sector_ecommerce: "E-commerce / Vendite Online",
            sector_wholesale: "Commercio all'Ingrosso / Distribuzione",
        sector_group_craft: "Produzione & Artigianato",
            sector_manufacturing: "Produzione Industriale",
            sector_artisan: "Artigianato (Alimentare, Manifatturiero...)",
            sector_construction: "Edilizia e Costruzioni",
        sector_group_hospitality: "Turismo & Ristorazione",
            sector_horeca: "Ho.Re.Ca. (Hotel, Ristoranti, Bar...)",
            sector_tourism: "Turismo e Intrattenimento (Agenzie Viaggi, Eventi...)",
        sector_group_other: "Altro",
            sector_tech: "IT / Sviluppo Software",
            sector_healthcare: "Sanità e Assistenza Medica",
            sector_realestate: "Immobiliare",
            sector_agriculture: "Agricoltura e Allevamento",
            sector_transport: "Trasporti e Logistica",
            sector_other: "Altro",
        lbl_what_we_do: "Cosa fate?", lbl_goal: "Obiettivo AI",
        q_role: "1️⃣ Qual è il tuo ruolo principale?",
        q_team_size: "2️⃣ Quante persone lavorano con te?",
        q_experience: "3️⃣ Da quanti anni fai questo lavoro?",
        q_skills: "4️⃣ Elenca le tue competenze tecniche principali (3-7)",
        q_certifications: "5️⃣ Hai certificazioni o abilitazioni professionali?",
        q_training: "6️⃣ Hai fatto corsi/formazione negli ultimi 2 anni?",
        q_specialization: "7️⃣ Come ti definiresti meglio?",
        q_tools: "8️⃣ Quali strumenti usi OGNI GIORNO? (Seleziona tutte)",
        q_workflow: "9️⃣ Come lavori principalmente con i clienti?",
        q_documents: "🔟 Come gestisci fatture e documenti aziendali?",
        q_pain: "1️⃣1️⃣ Quali sono le tue 3 PRINCIPALI sfide ORA?",
        q_main_goal: "1️⃣2️⃣ Qual è il TUO obiettivo principale con l'AI?",
        h_plan:"Offerta Pionieri", sub_plan:"Attivazione gratuita.", pioneer_desc:"Accesso completo.", pioneer_free:"GRATIS ORA",
        lbl_payment_pref: "Preferenza pagamento futuro:", pay_wire: "Bonifico", btn_build: "AVVIA CONFIGURAZIONE",
        alert_missing_fields: "Compila tutti i campi obbligatori.",
        alert_pain_limit: "⚠️ Seleziona MAX 3 priorità nelle sfide principali.",
        alert_browser_error: "Errore Browser: impossibile salvare dati. Disattiva modalità privata.",
        alert_invalid_doc_title: "Documento Non Valido",
        alert_invalid_doc_body: "L'immagine caricata non sembra essere un documento d'identità valido o non è leggibile. Per favore, riprova con una foto chiara.",
        upload_error_manual: "Errore AI. Inserisci a mano.",
        upload_error_invalid: "Documento non valido. Riprova.",
        alert_key_missing: "Inserisci la Gemini Key prima di caricare il documento."
    },
    en: {
        access_denied_title:"Access Denied", access_denied_desc:"Bot access only.", open_bot:"Open Bot",
        step_identity:"Start", step_company:"Company", step_plan:"Promo",
        h_identity:"Setup & Security", sub_identity:"Consents, API Key & KYC.",
        legal_privacy: "I declare I have read and accept the <a href='legal.html?lang=en' target='_blank'>Privacy Policy</a>.",
        legal_terms: "I accept the <a href='legal.html?lang=en' target='_blank'>Terms and Conditions</a>.",
        legal_ai:"I authorize AI analysis for KYC.",
        btn_get_key:"Get Key Free", byok_note:"⚠️ BYOK: You control data.",
        lbl_id_card:"ID Document", upload_lock:"Accept terms to unlock", upload_hint:"Upload Photo/PDF",
        lbl_name:"Name", lbl_surname:"Surname", lbl_fiscal:"Tax ID", lbl_email:"Email", lbl_phone:"Mobile",
        btn_next:"Next", btn_back:"Back",
        h_company:"Company Profile", sub_company:"Operational & Tax Setup.",
        lbl_company_name:"Company Name", lbl_vat:"VAT ID", lbl_sdi:"Tax Code", lbl_address:"Address", lbl_site:"Website",
        section_identity: "OPERATIONAL IDENTITY", section_social: "SOCIAL MEDIA (Optional)", lbl_sector: "Business Sector",
        section_professional: "PROFESSIONAL PROFILE (5 min)", hint_professional: "💡 Help us personalize the system by answering these questions",
        sector_group_services: "Services",
            sector_pro: "Professional Services (Lawyer, Accountant...)",
            sector_consulting: "Consulting (IT, Marketing, HR...)",
            sector_personal: "Personal Services (Wellness, Beauty, Fitness...)",
        sector_group_commerce: "Commerce",
            sector_retail: "Retail / Physical Store",
            sector_ecommerce: "E-commerce / Online Sales",
            sector_wholesale: "Wholesale / Distribution",
        sector_group_craft: "Manufacturing & Crafts",
            sector_manufacturing: "Industrial Manufacturing",
            sector_artisan: "Craftsmanship (Food, Goods...)",
            sector_construction: "Building and Construction",
        sector_group_hospitality: "Tourism & Hospitality",
            sector_horeca: "Ho.Re.Ca. (Hotels, Restaurants, Bars...)",
            sector_tourism: "Tourism and Entertainment (Travel Agencies, Events...)",
        sector_group_other: "Other",
            sector_tech: "IT / Software Development",
            sector_healthcare: "Healthcare and Medical Assistance",
            sector_realestate: "Real Estate",
            sector_agriculture: "Agriculture and Farming",
            sector_transport: "Transport and Logistics",
            sector_other: "Other",
        lbl_what_we_do: "What do you do?", lbl_goal: "AI Goal",
        h_plan:"Pioneer Offer", sub_plan:"Activate now, decide later.", pioneer_desc:"Full Enterprise Access.", pioneer_free:"FREE NOW",
        lbl_payment_pref: "Future payment preference:", pay_wire: "Wire Transfer", btn_build: "START CONFIGURATION",
        alert_missing_fields: "Please fill all required fields.",
        alert_pain_limit: "⚠️ Select MAX 3 priorities in main challenges.",
        alert_browser_error: "Browser Error: cannot save data. Disable strict private mode.",
        alert_invalid_doc_title: "Invalid Document",
        alert_invalid_doc_body: "The uploaded image does not appear to be a valid or readable ID document. Please try again with a clear photo.",
        upload_error_manual: "AI Error. Please enter manually.",
        upload_error_invalid: "Invalid document. Please try again.",
        alert_key_missing: "Enter your Gemini Key before uploading the document."
    }
};

const langParam = new URLSearchParams(window.location.search).get('lang') || 'it';
const t = i18n[langParam.slice(0,2)] || i18n.it;

// --- DOM & STATE ---
const dom = {
    loader: document.getElementById('loader'),
    denied: document.getElementById('access-denied'), app: document.getElementById('app-content'),
    steps: [document.getElementById('step-1'), document.getElementById('step-2'), document.getElementById('step-3')],
    dots: [document.getElementById('si-1'), document.getElementById('si-2'), document.getElementById('si-3')],
    progressFill: document.getElementById('progress-fill'), 
    fileInput: document.getElementById('id_document'), fileBox: document.getElementById('upload-box'),
    fileText: document.getElementById('upload-text'), fileIcon: document.getElementById('upload-icon'),
    chkPrivacy: document.getElementById('chk_privacy'), chkTerms: document.getElementById('chk_terms'), chkAi: document.getElementById('chk_ai'),
    geminiKey: document.getElementById('gemini_key'),
    fName: document.getElementById('name'), fSurname: document.getElementById('surname'), fFiscal: document.getElementById('fiscal_code'),
    btnStep1: document.getElementById('btn-step1')
};

let currentStep = 1;
let currentLang = 'it';
const urlParams = new URLSearchParams(window.location.search);
const GLOBAL_CHAT_ID = urlParams.get('chat_id') || tg.initDataUnsafe?.user?.id;
const GLOBAL_THREAD_ID = urlParams.get('thread_id');

let kycData = null; // Variabile per conservare i dati del documento

// --- CORE FUNCTIONS ---

function changeLanguage(lang) {
    currentLang = lang;
    const dict = i18n[lang] || i18n.it;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(dict[key]) {
            if (el.tagName === 'OPTGROUP') {
                el.label = dict[key];
            } else {
                el.innerHTML = dict[key];
            }
        }
    });
}

function goToStep(step) {
    const dict = i18n[currentLang] || i18n.it;
    if (currentStep === 1 && step === 2) {
        if (!dom.fName.value || !dom.fSurname.value || !kycData) {
            tg.showAlert("È necessario completare la verifica del documento prima di procedere.");
            return;
        }
    }
    if (currentStep === 2 && step === 3) {
        const required = dom.steps[1].querySelectorAll('[required]');
        for (let input of required) {
            if (!input.value) {
                tg.showAlert(dict.alert_missing_fields);
                input.focus();
                return;
            }
        }
        
        // ✅ Valida pain points (MAX 3)
        const painChecked = document.querySelectorAll('input[name="pain"]:checked');
        if (painChecked.length > 3) {
            tg.showAlert(dict.alert_pain_limit);
            return;
        }
    }
    currentStep = step;
    dom.steps.forEach(s => s.classList.add('hidden'));
    dom.steps[step - 1].classList.remove('hidden');
    dom.progressFill.style.width = ((step - 1) / 2) * 100 + "%";
    dom.dots.forEach((d, i) => {
        const parent = d.parentElement;
        parent.classList.remove('active', 'completed');
        if (i < step - 1) parent.classList.add('completed');
        if (i === step - 1) parent.classList.add('active');
    });
}

function checkLegalGate() {
    const ok = dom.chkPrivacy.checked && dom.chkTerms.checked && dom.chkAi.checked;
    dom.fileBox.classList.toggle('enabled', ok);
    dom.geminiKey.disabled = !ok;
    const dict = i18n[currentLang] || i18n.it;
    dom.fileText.innerHTML = ok ? dict.upload_hint : dict.upload_lock;
    dom.btnStep1.disabled = true; 
}

async function analyzeId() {
    const dict = i18n[currentLang] || i18n.it;

    const isLegalOk = dom.chkPrivacy.checked && dom.chkTerms.checked && dom.chkAi.checked;
    const key = dom.geminiKey.value;
    
    if (!isLegalOk) return; 
    if (!key) { 
        tg.showAlert(dict.alert_key_missing);
        dom.fileInput.value = '';
        return; 
    }
    if (dom.fileInput.files.length === 0) return;

    kycData = null;
    dom.fileBox.classList.remove('success', 'error');
    dom.fileBox.classList.add('analyzing');
    dom.fileIcon.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
    dom.fileText.innerText = "AI Analysis...";
    dom.btnStep1.disabled = true;
    
    try {
        const file = dom.fileInput.files[0];
        const { base64, mime } = await getFileData(file);
        
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ action: 'analyze_id', user_id: GLOBAL_CHAT_ID, file_data: base64, mime_type: mime, gemini_key: key })
        });

        if (!res.ok) throw new Error(`Network Error: ${res.status}`);
        
        const data = await res.json();
        const responseData = Array.isArray(data) ? data[0] : data; 
        
        if (!responseData) throw new Error("Risposta del server vuota.");

        if (responseData.data && responseData.data.error === 'invalid_document') {
            tg.showAlert(dict.alert_invalid_doc_body, () => {});
            dom.fileBox.classList.remove('analyzing');
            dom.fileBox.classList.add('error');
            dom.fileText.innerText = dict.upload_error_invalid;
            dom.fileIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            dom.fileInput.value = '';
            return;
        }

        kycData = responseData.data;

        dom.fileBox.classList.remove('analyzing');
        dom.fileBox.classList.add('success');
        dom.fileIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        dom.fileText.innerText = "OK!";
        
        if (kycData.name) {
            dom.fName.value = kycData.name;
            dom.fName.setAttribute('readonly', true);
        } else {
            dom.fName.removeAttribute('readonly');
        }

        if (kycData.surname) {
            dom.fSurname.value = kycData.surname;
            dom.fSurname.setAttribute('readonly', true);
        } else {
            dom.fSurname.removeAttribute('readonly');
        }

        if (kycData.fiscal_code) {
            dom.fFiscal.value = kycData.fiscal_code;
            dom.fFiscal.setAttribute('readonly', true);
        } else {
            dom.fFiscal.removeAttribute('readonly');
        }
        
        dom.btnStep1.disabled = false;

    } catch (err) {
        console.error("Errore analisi:", err);
        tg.showAlert(dict.upload_error_manual);
        dom.fileBox.classList.remove('analyzing');
        dom.fileText.innerText = dict.upload_error_manual;
        
        [dom.fName, dom.fSurname, dom.fFiscal].forEach(el => el.removeAttribute('readonly'));
        dom.btnStep1.disabled = false;
    }
}

// ✅ NUOVA FUNZIONE: Arricchisce kycData con questionnaire
function enrichKycWithQuestionnaire() {
    if (!kycData) kycData = {};
    
    // Raccogli dati questionnaire
    kycData.professional_questionnaire = {
        role: document.getElementById('profile_role')?.value || null,
        team_size: document.getElementById('team_size')?.value || null,
        years_experience: document.getElementById('years_experience')?.value || null,
        
        hard_skills: [
            document.getElementById('skill_1')?.value,
            document.getElementById('skill_2')?.value,
            document.getElementById('skill_3')?.value,
            document.getElementById('skill_4')?.value,
            document.getElementById('skill_5')?.value,
            document.getElementById('skill_6')?.value,
            document.getElementById('skill_7')?.value
        ].filter(s => s && s.trim() !== ''),
        
        certifications: document.getElementById('certifications')?.value || null,
        recent_training: document.getElementById('recent_training')?.value || null,
        specialization_level: document.getElementById('specialization_level')?.value || null,
        
        digital_tools: Array.from(document.querySelectorAll('input[name="tools"]:checked') || [])
            .map(cb => cb.value),
        
        client_workflow: document.getElementById('client_workflow')?.value || null,
        document_management: document.getElementById('document_management')?.value || null,
        
        pain_points: Array.from(document.querySelectorAll('input[name="pain"]:checked') || [])
            .map(cb => cb.value),
        
        main_goal: document.getElementById('ai_main_goal')?.value || null
    };
}

function submitFinalForm() {
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Avvio...';

    const addr = `${document.getElementById('addr_route').value} ${document.getElementById('addr_num').value}, ${document.getElementById('addr_zip').value} ${document.getElementById('addr_city').value} (${document.getElementById('addr_prov').value})`;
    const vatNumber = document.getElementById('vat_number').value;

    // ✅ ARRICCHISCI kycData con questionnaire PRIMA di inviare
    enrichKycWithQuestionnaire();

    const payload = {
        action: 'payment_checkout', 
        user_id: GLOBAL_CHAT_ID, 
        chat_id: GLOBAL_CHAT_ID, 
        thread_id: GLOBAL_THREAD_ID,
        owner_data: {
            gemini_key: document.getElementById('gemini_key').value,
            name: document.getElementById('name').value,
            surname: document.getElementById('surname').value,
            fiscal_code: document.getElementById('fiscal_code').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            ragione_sociale: document.getElementById('ragione_sociale').value,
            vat_number: vatNumber,
            sdi_pec: document.getElementById('sdi_pec').value,
            indirizzo: addr,
            site: document.getElementById('site').value,
            
            // ✅ SOCIAL MEDIA (FLAT STRUCTURE)
            linkedin_page: document.getElementById('linkedin_page').value,
            facebook_page: document.getElementById('facebook_page').value,
            instagram_page: document.getElementById('instagram_page')?.value || "",
            twitter_page: document.getElementById('twitter_page')?.value || "",
            
            sector: document.getElementById('sector').value,
            what_we_do: document.getElementById('what_we_do').value,
            main_goal: document.getElementById('main_goal').value,
            payment_preference: document.getElementById('payment_pref').value || 'wire',
            plan: 'pioneer_free_trial',
            terms_accepted: true,
            lenguage: currentLang,
            
            // ✅ kyc_details ORA CONTIENE ANCHE professional_questionnaire
            kyc_details: kycData
        }
    };

    const sessionKey = `pending_payload_${vatNumber}`;
    
    try {
        sessionStorage.setItem(sessionKey, JSON.stringify(payload));
    } catch (e) {
        const dict = i18n[currentLang] || i18n.it;
        tg.showAlert(dict.alert_browser_error);
        btn.disabled = false;
        btn.innerHTML = 'Riprova';
        return;
    }

    const commandForDashboard = "onboarding_complete";
    window.location.href = `processor.html?call=onboarding&owner_key=${vatNumber}&cmd=${commandForDashboard}`;
}

// --- HELPER ---
const getFileData = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result.toString();
        resolve({
            base64: result.split(',')[1],
            mime: result.match(/:(.*?);/)[1]
        });
    };
    reader.onerror = error => reject(error);
});

// --- INIT & EVENT BINDING ---
function initialize() {
    if (!GLOBAL_CHAT_ID) {
        dom.loader.classList.add('hidden');
        dom.denied.classList.remove('hidden');
        return;
    }
    
    dom.loader.classList.add('hidden');
    dom.app.classList.remove('hidden');

    const userLang = urlParams.get('lang') || tg.initDataUnsafe?.user?.language_code || 'it';
    if(i18n[userLang]) {
        document.getElementById('lang-selector').value = userLang;
        changeLanguage(userLang);
    } else {
        changeLanguage('it');
    }

    document.getElementById('lang-selector').addEventListener('change', (e) => changeLanguage(e.target.value));
    [dom.chkPrivacy, dom.chkTerms, dom.chkAi].forEach(el => el.addEventListener('change', checkLegalGate));
    dom.fileInput.addEventListener('change', analyzeId);
    
    document.getElementById('btn-step1').addEventListener('click', () => goToStep(2));
    document.getElementById('btn-back-s2').addEventListener('click', () => goToStep(1));
    document.getElementById('btn-next-s2').addEventListener('click', () => goToStep(3));
    document.getElementById('btn-back-s3').addEventListener('click', () => goToStep(2));
    document.getElementById('submitBtn').addEventListener('click', submitFinalForm);

    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.addEventListener('click', function() {
            document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('payment_pref').value = this.dataset.value;
        });
    });
    
    // ✅ Pain Points Limiter (MAX 3)
    document.querySelectorAll('input[name="pain"]').forEach(cb => {
        cb.addEventListener('change', () => {
            const checked = document.querySelectorAll('input[name="pain"]:checked');
            if (checked.length > 3) {
                cb.checked = false;
                const dict = i18n[currentLang] || i18n.it;
                tg.showAlert(dict.alert_pain_limit);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initialize);