/**
 * ONBOARDING LOGIC - SITEBOS
 * Gestisce l'interfaccia a step, la validazione, l'analisi AI del documento
 * e il passaggio dei dati alla pagina processor.html.
 */

// --- CONFIG ---
const WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/83acc670-15ae-4da0-ae0e-3587c85bd5f4"; 
const ONBOARDING_WEBHOOK_ID = "83acc670-15ae-4da0-ae0e-3587c85bd5f4"; // L'ID del WF pesante

const tg = window.Telegram.WebApp; 
tg.ready(); tg.expand();

// --- I18N DICTIONARY ---
const i18n = {
    it: {
        access_denied_title:"Accesso Negato", access_denied_desc:"Accesso solo via Bot.", open_bot:"Apri Bot",
        step_identity:"Start", step_company:"Azienda", step_plan:"Promo",
        h_identity:"Setup & Sicurezza", sub_identity:"Consensi, Chiave API e KYC.",
        legal_privacy:"Accetto Privacy", legal_terms:"Accetto Termini", legal_ai:"Autorizzo analisi AI",
        btn_get_key:"Genera Gratis", byok_note:"⚠️ BYOK: Dati sotto il tuo controllo.",
        lbl_id_card:"Documento (Fronte)", upload_lock:"Accetta termini per sbloccare", upload_hint:"Carica Foto/PDF",
        lbl_name:"Nome", lbl_surname:"Cognome", lbl_fiscal:"Codice Fiscale", lbl_email:"Email (Admin)", lbl_phone:"Cellulare",
        btn_next:"Avanti", btn_back:"Indietro",
        h_company:"Profilo Aziendale", sub_company:"Configurazione operativa e fiscale.",
        lbl_company_name:"Ragione Sociale", lbl_vat:"P.IVA", lbl_sdi:"SDI / PEC", lbl_address:"Sede Legale", lbl_site:"Sito Web",
        section_identity: "IDENTITÀ OPERATIVA", lbl_sector: "Settore", lbl_what_we_do: "Cosa fate?", lbl_goal: "Obiettivo AI",
        h_plan:"Offerta Pionieri", sub_plan:"Attivazione gratuita.", pioneer_desc:"Accesso completo.", pioneer_free:"GRATIS ORA",
        lbl_payment_pref: "Preferenza pagamento futuro:", pay_wire: "Bonifico", btn_build: "AVVIA CONFIGURAZIONE",
        alert_missing_fields: "Compila tutti i campi obbligatori.", alert_browser_error: "Errore Browser: impossibile salvare dati. Disattiva modalità privata."
    },
    en: { /* ... Aggiungi altre lingue se necessario ... */ }
};

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
    fName: document.getElementById('name'), fSurname: document.getElementById('surname'), fFiscal: document.getElementById('fiscal_code')
};

let currentStep = 1;
let currentLang = 'it';
const urlParams = new URLSearchParams(window.location.search);
const GLOBAL_CHAT_ID = urlParams.get('chat_id') || tg.initDataUnsafe?.user?.id;
const GLOBAL_THREAD_ID = urlParams.get('thread_id');
const t = i18n[currentLang] || i18n.it;

// --- CORE FUNCTIONS ---

function changeLanguage(lang) {
    currentLang = lang;
    const dict = i18n[lang] || i18n.it;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(dict[key]) el.innerHTML = dict[key];
    });
}

function goToStep(step) {
    if (currentStep === 2 && step === 3) {
        const required = dom.steps[1].querySelectorAll('[required]');
        for (let input of required) {
            if (!input.value) {
                tg.showAlert(t.alert_missing_fields);
                input.focus();
                return;
            }
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
    dom.fileText.innerText = ok ? t.upload_hint : t.upload_lock;
    document.getElementById('btn-step1').disabled = !ok;
}

async function analyzeId() {
    if (dom.fileInput.files.length === 0) return;
    const file = dom.fileInput.files[0];
    const key = dom.geminiKey.value;
    if (!key) { tg.showAlert("Inserisci la Gemini Key."); return; }

    dom.fileBox.classList.add('analyzing');
    dom.fileIcon.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
    dom.fileText.innerText = "AI Analysis...";
    
    try {
        const { base64, mime } = await getFileData(file);
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ action: 'analyze_id', user_id: GLOBAL_CHAT_ID, file_data: base64, mime_type: mime, gemini_key: key })
        });
        const data = await res.json();
        if(data.status === 'error') throw new Error(data.code);

        dom.fileBox.classList.remove('analyzing'); dom.fileBox.classList.add('success');
        dom.fileIcon.innerHTML = '<i class="fas fa-check-circle"></i>'; dom.fileText.innerText = "OK!";
        
        if(data.data.name) dom.fName.value = data.data.name;
        if(data.data.surname) dom.fSurname.value = data.data.surname;
        if(data.data.fiscal_code) dom.fFiscal.value = data.data.fiscal_code;
        
        [dom.fName, dom.fSurname, dom.fFiscal].forEach(el => el.removeAttribute('readonly'));

    } catch(err) {
        dom.fileBox.classList.remove('analyzing');
        dom.fileText.innerText = "Errore. Inserisci a mano.";
        [dom.fName, dom.fSurname, dom.fFiscal].forEach(el => el.removeAttribute('readonly'));
    }
}

function submitFinalForm() {
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Avvio...';

    const addr = `${document.getElementById('addr_route').value} ${document.getElementById('addr_num').value}, ${document.getElementById('addr_zip').value} ${document.getElementById('addr_city').value} (${document.getElementById('addr_prov').value})`;
    
    const payload = {
        action: 'payment_checkout', 
        user_id: GLOBAL_CHAT_ID, 
        chat_id: GLOBAL_CHAT_ID, 
        thread_id: GLOBAL_THREAD_ID,
        owner_data: {
            gemini_key: dom.geminiKey.value, name: dom.fName.value, surname: dom.fSurname.value, fiscal_code: dom.fFiscal.value,
            email: document.getElementById('email').value, phone: document.getElementById('phone').value,
            ragione_sociale: document.getElementById('ragione_sociale').value, vat_number: document.getElementById('vat_number').value,
            sdi_pec: document.getElementById('sdi_pec').value, indirizzo: addr, site: document.getElementById('site').value,
            linkedin_page: document.getElementById('linkedin_page').value, facebook_page: document.getElementById('facebook_page').value,
            sector: document.getElementById('sector').value, what_we_do: document.getElementById('what_we_do').value, main_goal: document.getElementById('main_goal').value,
            payment_preference: document.getElementById('payment_pref').value || 'wire',
            plan: 'pioneer_free_trial', terms_accepted: true,
            lenguage: currentLang
        }
    };

    try {
        sessionStorage.setItem('pending_payload', JSON.stringify(payload));
    } catch (e) {
        tg.showAlert(t.alert_browser_error);
        btn.disabled = false; btn.innerHTML = 'Riprova';
        return;
    }

    window.location.href = `processor.html?wh=${ONBOARDING_WEBHOOK_ID}`;
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

    // Event listeners
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
}

document.addEventListener('DOMContentLoaded', initialize);
