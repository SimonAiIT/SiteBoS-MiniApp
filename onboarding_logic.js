/**
 * ONBOARDING LOGIC - SITEBOS
 * Gestisce l'interfaccia a step, la validazione, l'analisi AI del documento
 * e il passaggio dei dati alla pagina processor.html.
 */

// --- CONFIG ---
const WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/1211a23e-ff91-4d3c-8938-aa273555bd8e"; 

const tg = window.Telegram.WebApp; 
tg.ready(); tg.expand();

// --- I18N DICTIONARY (COMPLETO CON NUOVI SETTORI) ---
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
        section_identity: "IDENTITÀ OPERATIVA", lbl_sector: "Settore di Attività",
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
        h_plan:"Offerta Pionieri", sub_plan:"Attivazione gratuita.", pioneer_desc:"Accesso completo.", pioneer_free:"GRATIS ORA",
        lbl_payment_pref: "Preferenza pagamento futuro:", pay_wire: "Bonifico", btn_build: "AVVIA CONFIGURAZIONE",
        alert_missing_fields: "Compila tutti i campi obbligatori.", alert_browser_error: "Errore Browser: impossibile salvare dati. Disattiva modalità privata."
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
        section_identity: "OPERATIONAL IDENTITY", lbl_sector: "Business Sector",
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
        alert_missing_fields: "Please fill all required fields.", alert_browser_error: "Browser Error: cannot save data. Disable strict private mode."
    },
    fr: {
        access_denied_title:"Accès Refusé", access_denied_desc:"Accès via Bot uniquement.", open_bot:"Ouvrir Bot",
        step_identity:"Début", step_company:"Entreprise", step_plan:"Promo",
        h_identity:"Config & Sécurité", sub_identity:"Consentements, Clé API & KYC.",
        legal_privacy: "Je déclare avoir lu et accepté la <a href='legal.html?lang=fr' target='_blank'>Politique de Confidentialité</a>.",
        legal_terms: "J'accepte les <a href='legal.html?lang=fr' target='_blank'>Termes et Conditions</a>.",
        legal_ai:"J'autorise l'analyse par IA pour le KYC.",
        btn_get_key:"Clé Gratuite", byok_note:"⚠️ BYOK: Vous contrôlez les données.",
        lbl_id_card:"Document (Recto)", upload_lock:"Accepter pour débloquer", upload_hint:"Charger Photo/PDF",
        lbl_name:"Prénom", lbl_surname:"Nom", lbl_fiscal:"Code Fiscal", lbl_email:"Email (Admin)", lbl_phone:"Mobile",
        btn_next:"Suivant", btn_back:"Retour",
        h_company:"Profil Entreprise", sub_company:"Config opérationnelle & fiscale.",
        lbl_company_name:"Raison Sociale", lbl_vat:"TVA", lbl_sdi:"Code TVA", lbl_address:"Siège Social", lbl_site:"Site Web",
        section_identity: "IDENTITÉ OPÉRATIONNELLE", lbl_sector: "Secteur d'Activité",
        sector_group_services: "Services",
            sector_pro: "Services Professionnels (Avocat, Comptable...)",
            sector_consulting: "Conseil (Informatique, Marketing...)",
            sector_personal: "Services à la Personne (Bien-être, Beauté...)",
        sector_group_commerce: "Commerce",
            sector_retail: "Commerce de Détail / Magasin",
            sector_ecommerce: "E-commerce / Ventes en Ligne",
            sector_wholesale: "Commerce de Gros / Distribution",
        sector_group_craft: "Production & Artisanat",
            sector_manufacturing: "Production Industrielle",
            sector_artisan: "Artisanat (Alimentaire, Manufacturier...)",
            sector_construction: "Bâtiment et Construction",
        sector_group_hospitality: "Tourisme & Restauration",
            sector_horeca: "Ho.Re.Ca. (Hôtels, Restaurants...)",
            sector_tourism: "Tourisme et Loisirs (Agences de voyages...)",
        sector_group_other: "Autre",
            sector_tech: "IT / Développement Logiciel",
            sector_healthcare: "Santé et Soins Médicaux",
            sector_realestate: "Immobilier",
            sector_agriculture: "Agriculture et Élevage",
            sector_transport: "Transport et Logistique",
            sector_other: "Autre",
        lbl_what_we_do: "Que faites-vous ?", lbl_goal: "Objectif IA",
        h_plan:"Offre Pionniers", sub_plan:"Activez maintenant.", pioneer_desc:"Accès Complet.", pioneer_free:"GRATUIT",
        lbl_payment_pref: "Préférence de paiement:", pay_wire: "Virement", btn_build: "LANCER CONFIGURATION",
        alert_missing_fields: "Veuillez remplir tous les champs.", alert_browser_error: "Erreur navigateur."
    },
    de: {
        access_denied_title:"Zugriff verweigert", access_denied_desc:"Nur über Bot.", open_bot:"Bot öffnen",
        step_identity:"Start", step_company:"Firma", step_plan:"Promo",
        h_identity:"Setup & Sicherheit", sub_identity:"Zustimmungen, API Key & KYC.",
        legal_privacy: "Ich habe die <a href='legal.html?lang=de' target='_blank'>Datenschutzrichtlinie</a> gelesen und akzeptiere sie.",
        legal_terms: "Ich akzeptiere die <a href='legal.html?lang=de' target='_blank'>Allgemeinen Geschäftsbedingungen</a>.",
        legal_ai:"Ich erlaube die KI-Analyse für KYC.",
        btn_get_key:"Gratis Key", byok_note:"⚠️ BYOK: Ihre Datenkontrolle.",
        lbl_id_card:"Ausweis", upload_lock:"AGB akzeptieren", upload_hint:"Foto/PDF hochladen",
        lbl_name:"Vorname", lbl_surname:"Nachname", lbl_fiscal:"Steuernummer", lbl_email:"E-Mail", lbl_phone:"Mobil",
        btn_next:"Weiter", btn_back:"Zurück",
        h_company:"Firmenprofil", sub_company:"Operative Konfiguration.",
        lbl_company_name:"Firmenname", lbl_vat:"USt-IdNr.", lbl_sdi:"Steuercode", lbl_address:"Adresse", lbl_site:"Webseite",
        section_identity: "OPERATIVE IDENTITÄT", lbl_sector: "Geschäftsbereich",
        sector_group_services: "Dienstleistungen",
            sector_pro: "Freie Berufe (Anwalt, Steuerberater...)",
            sector_consulting: "Beratung (IT, Marketing...)",
            sector_personal: "Persönliche Dienstleistungen (Wellness, Schönheit...)",
        sector_group_commerce: "Handel",
            sector_retail: "Einzelhandel / Ladengeschäft",
            sector_ecommerce: "E-Commerce / Online-Verkauf",
            sector_wholesale: "Großhandel / Vertrieb",
        sector_group_craft: "Produktion & Handwerk",
            sector_manufacturing: "Industrielle Produktion",
            sector_artisan: "Handwerk (Lebensmittel, Waren...)",
            sector_construction: "Bauwesen",
        sector_group_hospitality: "Tourismus & Gastgewerbe",
            sector_horeca: "Ho.Re.Ca. (Hotels, Restaurants...)",
            sector_tourism: "Tourismus und Unterhaltung",
        sector_group_other: "Andere",
            sector_tech: "IT / Softwareentwicklung",
            sector_healthcare: "Gesundheitswesen",
            sector_realestate: "Immobilien",
            sector_agriculture: "Landwirtschaft",
            sector_transport: "Transport und Logistik",
            sector_other: "Andere",
        lbl_what_we_do: "Was machen Sie?", lbl_goal: "KI-Ziel",
        h_plan:"Pionier-Angebot", sub_plan:"Jetzt aktivieren.", pioneer_desc:"Voller Zugriff.", pioneer_free:"JETZT GRATIS",
        lbl_payment_pref: "Zahlungsart:", pay_wire: "Überweisung", btn_build: "KONFIGURATION STARTEN",
        alert_missing_fields: "Füllen Sie alle Felder aus.", alert_browser_error: "Browser-Fehler."
    },
    es: {
        access_denied_title:"Acceso Denegado", access_denied_desc:"Acceso solo vía Bot.", open_bot:"Abrir Bot",
        step_identity:"Inicio", step_company:"Empresa", step_plan:"Promo",
        h_identity:"Config y Seguridad", sub_identity:"Consentimientos, Clave API y KYC.",
        legal_privacy: "Declaro haber leído y aceptado la <a href='legal.html?lang=es' target='_blank'>Política de Privacidad</a>.",
        legal_terms: "Acepto los <a href='legal.html?lang=es' target='_blank'>Términos y Condiciones</a>.",
        legal_ai:"Autorizo el análisis de IA para KYC.",
        btn_get_key:"Clave Gratis", byok_note:"⚠️ BYOK: Tú controlas los datos.",
        lbl_id_card:"Documento", upload_lock:"Aceptar para desbloquear", upload_hint:"Subir Foto/PDF",
        lbl_name:"Nombre", lbl_surname:"Apellido", lbl_fiscal:"NIF", lbl_email:"Email", lbl_phone:"Móvil",
        btn_next:"Siguiente", btn_back:"Atrás",
        h_company:"Perfil de Empresa", sub_company:"Configuración operativa.",
        lbl_company_name:"Razón Social", lbl_vat:"IVA", lbl_sdi:"Cód. Fiscal", lbl_address:"Dirección", lbl_site:"Sitio Web",
        section_identity: "IDENTIDAD OPERATIVA", lbl_sector: "Sector de Actividad",
        sector_group_services: "Servicios",
            sector_pro: "Servicios Profesionales (Abogado, Contador...)",
            sector_consulting: "Consultoría (TI, Marketing...)",
            sector_personal: "Servicios Personales (Bienestar, Belleza...)",
        sector_group_commerce: "Comercio",
            sector_retail: "Comercio Minorista / Tienda Física",
            sector_ecommerce: "E-commerce / Ventas Online",
            sector_wholesale: "Comercio Mayorista / Distribución",
        sector_group_craft: "Producción & Artesanía",
            sector_manufacturing: "Producción Industrial",
            sector_artisan: "Artesanía (Alimentos, Manufactura...)",
            sector_construction: "Construcción",
        sector_group_hospitality: "Turismo & Hostelería",
            sector_horeca: "Ho.Re.Ca. (Hoteles, Restaurantes...)",
            sector_tourism: "Turismo y Entretenimiento",
        sector_group_other: "Otro",
            sector_tech: "TI / Desarrollo de Software",
            sector_healthcare: "Salud y Asistencia Médica",
            sector_realestate: "Inmobiliaria",
            sector_agriculture: "Agricultura y Ganadería",
            sector_transport: "Transporte y Logística",
            sector_other: "Otro",
        lbl_what_we_do: "¿Qué hacen?", lbl_goal: "Objetivo IA",
        h_plan:"Oferta Pioneros", sub_plan:"Activa ahora.", pioneer_desc:"Acceso Completo.", pioneer_free:"GRATIS AHORA",
        lbl_payment_pref: "Preferencia de pago:", pay_wire: "Transferencia", btn_build: "INICIAR CONFIGURACIÓN",
        alert_missing_fields: "Complete todos los campos.", alert_browser_error: "Error del navegador."
    },
    pt: {
        access_denied_title:"Acesso Negado", access_denied_desc:"Acesso via Bot.", open_bot:"Abrir Bot",
        step_identity:"Início", step_company:"Empresa", step_plan:"Promo",
        h_identity:"Config e Segurança", sub_identity:"Consentimentos, Chave API e KYC.",
        legal_privacy: "Declaro que li e aceito a <a href='legal.html?lang=pt' target='_blank'>Política de Privacidade</a>.",
        legal_terms: "Aceito os <a href='legal.html?lang=pt' target='_blank'>Termos e Condições</a>.",
        legal_ai:"Autorizo a análise de IA para KYC.",
        btn_get_key:"Chave Grátis", byok_note:"⚠️ BYOK: Você controla os dados.",
        lbl_id_card:"Documento", upload_lock:"Aceitar para desbloquear", upload_hint:"Carregar Foto/PDF",
        lbl_name:"Nome", lbl_surname:"Sobrenome", lbl_fiscal:"NIF", lbl_email:"Email", lbl_phone:"Celular",
        btn_next:"Próximo", btn_back:"Voltar",
        h_company:"Perfil da Empresa", sub_company:"Configuração operacional.",
        lbl_company_name:"Razão Social", lbl_vat:"NIF", lbl_sdi:"Cód. Fiscal", lbl_address:"Endereço", lbl_site:"Site Web",
        section_identity: "IDENTIDADE OPERACIONAL", lbl_sector: "Setor de Atividade",
        sector_group_services: "Serviços",
            sector_pro: "Serviços Profissionais (Advogado, Contador...)",
            sector_consulting: "Consultoria (TI, Marketing...)",
            sector_personal: "Serviços Pessoais (Bem-estar, Beleza...)",
        sector_group_commerce: "Comércio",
            sector_retail: "Varejo / Loja Física",
            sector_ecommerce: "E-commerce / Vendas Online",
            sector_wholesale: "Atacado / Distribuição",
        sector_group_craft: "Produção & Artesanato",
            sector_manufacturing: "Produção Industrial",
            sector_artisan: "Artesanato (Alimentar, Manufatura...)",
            sector_construction: "Construção Civil",
        sector_group_hospitality: "Turismo & Hotelaria",
            sector_horeca: "Ho.Re.Ca. (Hotéis, Restaurantes...)",
            sector_tourism: "Turismo e Entretenimento",
        sector_group_other: "Outro",
            sector_tech: "TI / Desenvolvimento de Software",
            sector_healthcare: "Saúde e Assistência Médica",
            sector_realestate: "Imobiliário",
            sector_agriculture: "Agricultura e Pecuária",
            sector_transport: "Transportes e Logística",
            sector_other: "Outro",
        lbl_what_we_do: "O que fazem?", lbl_goal: "Objetivo IA",
        h_plan:"Oferta Pioneiros", sub_plan:"Ative agora.", pioneer_desc:"Acesso Completo.", pioneer_free:"GRÁTIS AGORA",
        lbl_payment_pref: "Preferência de pagamento:", pay_wire: "Transferência", btn_build: "INICIAR CONFIGURAÇÃO",
        alert_missing_fields: "Preencha todos os campos.", alert_browser_error: "Erro do navegador."
    }
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
    if (currentStep === 2 && step === 3) {
        const required = dom.steps[1].querySelectorAll('[required]');
        for (let input of required) {
            if (!input.value) {
                tg.showAlert(dict.alert_missing_fields);
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
    const dict = i18n[currentLang] || i18n.it;
    dom.fileText.innerHTML = ok ? dict.upload_hint : dict.upload_lock;
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
    const vatNumber = document.getElementById('vat_number').value;

    // --- COSTRUZIONE DEL PAYLOAD COMPLETO ---
    // Questo è il pacchetto che verrà messo nello "zaino" (sessionStorage)
    const payload = {
        // L'AZIONE ORIGINALE CHE IL TUO WORKFLOW SI ASPETTA
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
            linkedin_page: document.getElementById('linkedin_page').value,
            facebook_page: document.getElementById('facebook_page').value,
            sector: document.getElementById('sector').value,
            what_we_do: document.getElementById('what_we_do').value,
            main_goal: document.getElementById('main_goal').value,
            payment_preference: document.getElementById('payment_pref').value || 'wire',
            plan: 'pioneer_free_trial',
            terms_accepted: true,
            lenguage: currentLang
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
    try {
        sessionStorage.setItem('pending_payload', JSON.stringify(payload));
    } catch (e) {
        const dict = i18n[currentLang] || i18n.it;
        tg.showAlert(dict.alert_browser_error);
        btn.disabled = false; btn.innerHTML = 'Riprova';
        return;
    }

    const processorWebhookId = "83acc670-15ae-4da0-ae0e-3587c85bd5f4";
    window.location.href = `processor.html?wh=${processorWebhookId}`;
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
