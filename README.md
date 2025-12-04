📋 DOCUMENTO DI DESCRIZIONE PROGETTUALE COMPLETO
SiteBoS MiniApp – AI Business Operating System
Repository: https://github.com/SimonAiIT/SiteBoS-MiniApp
Versione Analizzata: v4.2 Stable Release
Data Documento: 4 Dicembre 2025

1. EXECUTIVE SUMMARY
SiteBoS (Site Business Operating System) è una Telegram Mini App enterprise progettata per digitalizzare completamente la gestione operativa di PMI e artigiani direttamente all'interno di Telegram. L'applicazione integra:
    • Onboarding intelligente con KYC automatizzato tramite AI (Google Gemini).
    • Dashboard operativa per gestione eventi, clienti, sponsor e documenti.
    • Generazione automatica di documentazione legale (Privacy Policy, T&C, nomine responsabile trattamento).
    • Sistema anti-spam avanzato (honeypot editor).
    • Integrazioni bancarie e fiscali (SumUp, Revolut, Fatture in Cloud).
    • Backend serverless basato su webhook (N8N self deploy cloud) con persistenza dati e logica AI.
Obiettivi Strategici
    • Zero app da installare: tutto funziona dentro Telegram.
    • BYOK (Bring Your Own Key): l'utente controlla la propria chiave API Gemini.
    • Conformità GDPR completa: consensi espliciti, documenti auto-generati.
    • Scalabilità: architettura webhook permette di gestire migliaia di utenti senza server dedicati.

2. ARCHITETTURA GENERALE
2.1 Stack Tecnologico
Frontend
    • HTML5 + CSS3 + JavaScript Vanilla
    • Telegram Web App SDK (telegram-web-app.js)
    • Font Awesome 6.4.0 per icone
    • Google Fonts (Inter) per tipografia
Backend (Serverless)
    • N8N self deploy cloud (ex-Integromat) come orchestratore webhook
    • Google Gemini Pro API per analisi documenti e generazione testi
    • Persistenza dati: sessionStorage browser + webhook per storage remoto
    • Comunicazione asincrona: tutto tramite chiamate POST a webhook dedicati
Integrazioni Esterne
    • SumUp (pagamenti POS)
    • Revolut Business (banking)
    • Fatture in Cloud (fatturazione elettronica)
    • NordVPN (sicurezza enterprise, presumibilmente per VPN dedicata)
2.2 Flusso Dati Globale
text
[Telegram User] 
    ↓ apre Mini App
[index.html - Landing Page]
    ↓ scelta form (onboarding/dashboard/editor...)
[Form Specifico (es. onboarding.html)]
    ↓ raccolta dati + upload documento
[onboarding_logic.js]
    ↓ chiama webhook N8N self deploy cloud
[WEBHOOK_URL: https://trinai.api.workflow.dcmake.it/webhook/{id}]
    ↓ orchestrazione: analisi AI, salvataggio, notifiche
[Google Gemini API] + [Database N8N self deploy cloud] + [Telegram Bot API]
    ↓ risposta JSON
[Frontend] aggiorna UI e procede

3. STRUTTURA FILE E MODULI
3.1 File Root Principali
File
Descrizione
Dimensione
Ruolo
index.html
Landing page + router applicazione
10.2 KB
Entry point, vetrina prodotto
styles.css
Stile globale unificato
37.5 KB
Design system completo
SiteBos.html
Pagina "about" del progetto
22.9 KB
Descrizione corporate
onboarding.html
Wizard onboarding 3 step
11.8 KB
Raccolta dati owner + KYC
onboarding_logic.js
Logica onboarding + AI doc analysis
32.4 KB
Core business logic
dashboard.html
Pannello controllo eventi
4.9 KB
Vista riepilogativa
dashboard_logic.js
Gestione dashboard
12.4 KB
CRUD eventi
processor.html
Config responsabile trattamento
14.7 KB
Compliance GDPR
processor_logic.js
Logica processor
7.7 KB
Generazione nomine
edit_owner.html
Modifica dati titolare
7.7 KB
Gestione anagrafica
edit_owner_logic.js
Logica owner
13.3 KB
Validazione dati aziendali
honeypot_editor.html
Editor anti-spam
6.0 KB
Security forms
honeypot_editor_logic.js
Logica honeypot
38.7 KB
Generazione campi trap
legal.html
Generatore documenti legali
8.4 KB
Privacy Policy, T&C
sponsor.js
Gestione sponsor
6.7 KB
Partner management
reset.html
Reset configurazioni
2.6 KB
Utility
LICENSE
Licenza progetto
74 B
MIT (presumibilmente)
README.md
Documentazione base
38 B
"Form Eventi SiteBos"
3.2 Cartelle Strutturali
    • agenda/: Template agende eventi, programmi, sessioni.
    • catalog/: Cataloghi entità (tipi eventi, trattamenti dati, categorie sponsor).
    • knowledge_base/: Base conoscenza giuridica (clausole GDPR, template informative).
    • images/: Loghi partner, icone, assets grafici.

4. MODULO ONBOARDING (CORE)
4.1 Funzionalità
L'onboarding è il cuore dell'applicazione. Si articola in 3 step:
STEP 1: Identità e Sicurezza
    • Consensi GDPR obbligatori:
        ◦ Privacy Policy ✓
        ◦ Termini e Condizioni ✓
        ◦ Autorizzazione analisi AI ✓
    • BYOK Setup: inserimento chiave Google Gemini personale.
    • Upload Documento Identità: fronte carta d'identità/passaporto.
    • Analisi AI automatica:
        ◦ Estrazione: Nome, Cognome, Codice Fiscale.
        ◦ Validazione: controllo se documento leggibile e valido.
        ◦ Popolamento automatico campi form.
    • Gate di sicurezza: impossibile procedere senza consensi + documento validato.
STEP 2: Profilo Aziendale
    • Ragione Sociale
    • P.IVA
    • SDI/PEC (fatturazione elettronica)
    • Indirizzo completo (via, numero, CAP, città, provincia)
    • Sito web
    • LinkedIn/Facebook aziendale
    • Settore di attività (select gerarchico a gruppi):
        ◦ Servizi (professionali, consulenza, personali)
        ◦ Commercio (retail, e-commerce, wholesale)
        ◦ Produzione & Artigianato
        ◦ Turismo & Ristorazione
        ◦ Altro (IT, sanità, immobiliare, agricoltura, trasporti)
    • Identity Operativa:
        ◦ "Cosa fate?" (testo libero)
        ◦ "Obiettivo AI" (cosa vuoi che l'AI faccia per te)
STEP 3: Piano e Pagamento
    • Offerta Pionieri: piano gratuito attuale (strategia early adopter).
    • Preferenza pagamento futuro: bonifico bancario.
    • Bottone finale: "AVVIA CONFIGURAZIONE"
4.2 Logica Tecnica (onboarding_logic.js)
Costanti Chiave
javascript
const WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/1211a23e-ff91-4d3c-8938-aa273555bd8e";
const GLOBAL_CHAT_ID = urlParams.get('chat_id') || tg.initDataUnsafe?.user?.id;
const GLOBAL_THREAD_ID = urlParams.get('thread_id');
Flusso Upload Documento
    1. Gate Check: verifica consensi + chiave Gemini presente.
    2. Conversione File: FileReader → base64 + mime type.
    3. POST al Webhook:
javascript
{
  action: 'analyze_id',
  user_id: GLOBAL_CHAT_ID,
  file_data: base64,
  mime_type: mime,
  gemini_key: key
}
    4. Risposta attesa (da webhook N8N self deploy cloud):
json
{
  "data": {
    "name": "Mario",
    "surname": "Rossi",
    "fiscal_code": "RSSMRA80A01H501U"
  }
}
oppure:
json
{
  "data": {
    "error": "invalid_document"
  }
}
    5. Aggiornamento UI:
        ◦ Campi auto-compilati e bloccati (readonly).
        ◦ Stato visual box: analyzing → success / error.
        ◦ Sblocco bottone "Avanti".
Internazionalizzazione
    • 6 lingue supportate: IT, EN, FR, DE, ES, PT.
    • Dizionario i18n con 80+ chiavi tradotte.
    • Cambio lingua dinamico via <select> + data-i18n attributes.
Salvataggio Finale
Alla submit dello Step 3:
javascript
const payload = {
  action: 'payment_checkout',
  user_id: GLOBAL_CHAT_ID,
  chat_id: GLOBAL_CHAT_ID,
  thread_id: GLOBAL_THREAD_ID,
  owner_data: {
    gemini_key, name, surname, fiscal_code, email, phone,
    ragione_sociale, vat_number, sdi_pec, indirizzo,
    site, linkedin_page, facebook_page,
    sector, what_we_do, main_goal,
    payment_preference, plan: 'pioneer_free_trial',
    terms_accepted: true, lenguage: currentLang,
    kyc_details: kycData // <-- DATI DOCUMENTO INCLUSI
  }
};
    • Persistenza: sessionStorage.setItem(sessionKey, JSON.stringify(payload)).
    • Redirect: processor.html?call=onboarding&owner_key={vat}&cmd=onboarding_complete.

5. BACKEND SERVERLESS (N8N self deploy cloud)
5.1 Architettura Webhook
N8N self deploy cloud gestisce 3 webhook principali (minimo):
Webhook 1: Onboarding (1211a23e-ff91-4d3c-8938-aa273555bd8e)
    • Azioni supportate:
        ◦ analyze_id: analisi documento tramite Gemini Vision API.
        ◦ payment_checkout: salvataggio configurazione owner + notifica Telegram.
Flusso interno presumibile:
text
[POST da frontend]
  ↓
[N8N self deploy cloud Router]
  ↓ if action=analyze_id
[HTTP Request → Google Gemini API]
  ↓ prompt: "Extract name, surname, fiscal code from this ID document"
[Gemini Vision Response]
  ↓ parse JSON
[Validation Logic]
  ↓ check document validity
[Response to Frontend]

  ↓ if action=payment_checkout
[Data Store Module] (N8N self deploy cloud internal DB or Google Sheets)
  ↓ save owner_data
[Telegram Bot API]
  ↓ send confirmation message to chat_id
[Response: { status: 'ok', owner_id: ... }]
Webhook 2: Processor (35667aed-ee1c-4074-92df-d4334967a1b3)
    • Gestione dati responsabile trattamento.
    • Generazione documentazione nomina GDPR.
Webhook 3: Dashboard (ID non ancora rilevato)
    • CRUD eventi.
    • Caricamento configurazioni salvate.
    • Sincronizzazione sponsor/agenda.
5.2 Esempio Payload Completo
Request Onboarding Completo:
json
{
  "action": "payment_checkout",
  "user_id": "123456789",
  "chat_id": "123456789",
  "thread_id": "42",
  "owner_data": {
    "gemini_key": "AIzaSyD...",
    "name": "Mario",
    "surname": "Rossi",
    "fiscal_code": "RSSMRA80A01H501U",
    "email": "mario.rossi@example.com",
    "phone": "+393331234567",
    "ragione_sociale": "Rossi Srl",
    "vat_number": "IT12345678901",
    "sdi_pec": "ABC123",
    "indirizzo": "Via Roma 10, 20121 Milano (MI)",
    "site": "https://rossisrl.it",
    "linkedin_page": "https://linkedin.com/company/rossisrl",
    "facebook_page": "",
    "sector": "sector_consulting",
    "what_we_do": "Consulenza IT per PMI",
    "main_goal": "Automatizzare gestione clienti",
    "payment_preference": "wire",
    "plan": "pioneer_free_trial",
    "terms_accepted": true,
    "lenguage": "it",
    "kyc_details": {
      "name": "Mario",
      "surname": "Rossi",
      "fiscal_code": "RSSMRA80A01H501U",
      "document_type": "ID_CARD",
      "extracted_at": "2025-12-04T08:45:12Z"
    }
  }
}
Expected Response:
json
{
  "status": "success",
  "owner_id": "OWN_67890",
  "message": "Onboarding completato. Configurazione salvata.",
  "next_step": "dashboard"
}

6. MODELLO DATI CONCETTUALE
6.1 Entità Principali
Owner (Titolare)
typescript
interface Owner {
  id: string;                    // Generato dal sistema (es. vatNumber)
  gemini_key: string;           // Chiave API personale (BYOK)
  
  // Dati Personali (da KYC)
  name: string;
  surname: string;
  fiscal_code: string;
  email: string;
  phone: string;
  
  // Dati Aziendali
  ragione_sociale: string;
  vat_number: string;           // Primary Key alternativa
  sdi_pec: string;
  indirizzo: string;            // Completo
  site?: string;
  linkedin_page?: string;
  facebook_page?: string;
  
  // Identità Operativa
  sector: SectorEnum;
  what_we_do: string;
  main_goal: string;
  
  // Compliance
  terms_accepted: boolean;
  privacy_accepted: boolean;
  ai_analysis_consent: boolean;
  kyc_details: KYCData;
  
  // Business
  plan: 'pioneer_free_trial' | 'starter' | 'pro' | 'enterprise';
  payment_preference: 'wire' | 'card';
  language: 'it' | 'en' | 'fr' | 'de' | 'es' | 'pt';
  
  // Meta
  created_at: Date;
  updated_at: Date;
  telegram_chat_id: string;
  telegram_thread_id?: string;
}
KYCData (Dati Documento)
typescript
interface KYCData {
  name: string;
  surname: string;
  fiscal_code: string;
  document_type: 'ID_CARD' | 'PASSPORT' | 'DRIVING_LICENSE';
  extracted_at: Date;
  validation_status: 'valid' | 'invalid' | 'manual_review';
  gemini_analysis_log?: string; // Per audit
}
Event (Evento)
typescript
interface Event {
  id: string;
  owner_id: string;             // FK → Owner
  
  // Base Info
  name: string;
  description: string;
  location: string;
  start_date: Date;
  end_date: Date;
  type: EventType;
  
  // GDPR
  processing_activities: ProcessingActivity[];
  processor_id?: string;        // FK → Processor
  
  // Partners
  sponsors: Sponsor[];
  
  // Security
  honeypot_config?: HoneypotConfig;
  
  // Status
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}
Processor (Responsabile Trattamento)
typescript
interface Processor {
  id: string;
  legal_name: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  vat_number: string;
  
  // GDPR Details
  processing_categories: string[];
  processing_duration: string;
  security_measures: string[];
  sub_processors: SubProcessor[];
  
  // Links
  website?: string;
  privacy_policy_url?: string;
  
  // Meta
  created_at: Date;
  updated_at: Date;
}
Sponsor
typescript
interface Sponsor {
  id: string;
  event_id: string;             // FK → Event
  
  name: string;
  tier: 'gold' | 'silver' | 'bronze' | 'technical' | 'media';
  logo_url: string;
  website_url?: string;
  notes?: string;
  
  // Visibility
  display_order: number;
  visible: boolean;
  
  created_at: Date;
}
HoneypotConfig
typescript
interface HoneypotConfig {
  id: string;
  event_id: string;             // FK → Event
  
  fields: HoneypotField[];
  behavior: 'reject' | 'silent' | 'notify';
  
  created_at: Date;
  updated_at: Date;
}

interface HoneypotField {
  name: string;                 // es. "email_confirm_hidden"
  type: 'text' | 'email' | 'checkbox';
  expected_value: string;       // es. "" (vuoto)
  css_class: string;            // es. "hidden-field"
}
6.2 Enumerazioni
typescript
enum SectorEnum {
  // Services
  SECTOR_PRO = 'sector_pro',
  SECTOR_CONSULTING = 'sector_consulting',
  SECTOR_PERSONAL = 'sector_personal',
  
  // Commerce
  SECTOR_RETAIL = 'sector_retail',
  SECTOR_ECOMMERCE = 'sector_ecommerce',
  SECTOR_WHOLESALE = 'sector_wholesale',
  
  // Manufacturing
  SECTOR_MANUFACTURING = 'sector_manufacturing',
  SECTOR_ARTISAN = 'sector_artisan',
  SECTOR_CONSTRUCTION = 'sector_construction',
  
  // Hospitality
  SECTOR_HORECA = 'sector_horeca',
  SECTOR_TOURISM = 'sector_tourism',
  
  // Other
  SECTOR_TECH = 'sector_tech',
  SECTOR_HEALTHCARE = 'sector_healthcare',
  SECTOR_REALESTATE = 'sector_realestate',
  SECTOR_AGRICULTURE = 'sector_agriculture',
  SECTOR_TRANSPORT = 'sector_transport',
  SECTOR_OTHER = 'sector_other'
}

enum EventType {
  CONFERENCE = 'conference',
  WORKSHOP = 'workshop',
  WEBINAR = 'webinar',
  FAIR = 'fair',
  MEETUP = 'meetup',
  TRAINING = 'training',
  OTHER = 'other'
}

7. SICUREZZA E COMPLIANCE
7.1 GDPR
    • Triple Consent Gate: privacy + terms + AI analysis.
    • BYOK: nessuna chiave API server-side, tutto client-controlled.
    • KYC Log: tracciatura analisi documenti per audit.
    • Data Minimization: solo dati strettamente necessari.
    • Right to Erasure: funzione reset.html per cancellazione.
ARCHITETTURA COMPLETA DEL SISTEMA
1.1 Stack Tecnologico Completo
text
┌─────────────────────────────────────────────────────┐
│                  TELEGRAM CLIENT                     │
│         (iOS/Android/Desktop/Web)                    │
└──────────────────┬──────────────────────────────────┘
                   │ Telegram WebApp API
                   ▼
┌─────────────────────────────────────────────────────┐
│              FRONTEND LAYER                          │
│  • HTML5/CSS3/JavaScript Vanilla                    │
│  • Telegram Web App SDK                              │
│  • Client-side routing (index.html)                  │
│  • sessionStorage per stato temporaneo               │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS POST
                   ▼
┌─────────────────────────────────────────────────────┐
│          BACKEND LAYER (n8n Workflows)               │
│  • Self-Hosted n8n Instance                          │
│  • 6+ Webhooks dedicati                              │
│  • Orchestrazione asincrona                          │
│  • Error handling multilingua                        │
└──────────────────┬──────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
┌──────────────────┐  ┌─────────────────┐
│   MONGODB        │  │   GEMINI API    │
│   (Database)     │  │   (Google AI)   │
│   • MemoryManager│  │   • Vision      │
│   • TbosAssetLake│  │   • Text Gen    │
└──────────────────┘  └─────────────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│        TELEGRAM BOT API                       │
│   • Notifiche real-time                       │
│   • Messaggi multilingua                      │
│   • Inline keyboards                          │
└──────────────────────────────────────────────┘

2. BACKEND: ARCHITETTURA n8n IN DETTAGLIO
2.1 Istanza n8n
URL Base: https://trinai.api.workflow.dcmake.it/webhook/
Versione n8n: Presumibilmente v1.x (self-hosted)
Credentials MongoDB: MongoDBMM (ID: bHrzVVM1uGz85C1B)
Telegram Bot Token: 8378810625:AAHK3Zya8qFKD4OzFBbwSTOAGolDeY7jiJQ
2.2 Workflow Mappati
Webhook ID
Nome Workflow
Funzione Principale
Azioni Supportate
1211a23e-ff91-4d3c-8938-aa273555bd8e
Onboarding
Gestione onboarding utente
analyze_id, payment_checkout, get_owner_data_by_token, save_owner_data_by_token
35667aed-ee1c-4074-92df-d4334967a1b3
Processor
Gestione responsabile trattamento
CRUD processor data
83acc670-15ae-4da0-ae0e-3587c85bd5f4
EditOwner
Modifica dati titolare
analyze_id, save_step1
0fff7fa2-bcb2-4b50-a26b-589b7054952e
ServiceCatalog
Gestione catalogo servizi/prodotti
get_catalog, modify_category, delete_category
31f89350-4d7f-44b7-9aaf-e7d9e3655b6c
ProductManagement
Gestione prodotti e blueprint
SAVE product with AI analysis
[ID non specificato]
Dashboard
Recupero dati dashboard
GET owner + honeypot + catalog aggregati
2.3 Database MongoDB: Schema Dettagliato
Database: MemoryManager
Collection: ownersessions
javascript
{
  sessionId: "IT12345678901", // VAT number (Primary Key)
  messages: [
    {
      data: {
        // SCHEMA OWNER COMPLETO
        userid: "IT12345678901",
        chatid: 123456789,
        accesstoken: "uuid-v4-generated", // Token sicurezza Dashboard
        groupid: null,
        username: "@username",
        vatnumber: "IT12345678901",
        geminikey: "AIzaSy...", // BYOK
        botkey: "",
        path: "",
        
        // Dati Personali
        name: "Mario",
        surname: "Rossi",
        email: "mario@example.com",
        phone: "+393331234567",
        fiscalcode: "RSSMRA80A01H501U",
        
        // Dati Aziendali
        ragionesociale: "Rossi Srl",
        indirizzo: "Via Roma 10, 20121 Milano (MI)",
        sdipec: "ABC123F",
        site: "https://rossisrl.it",
        linkedinpage: "https://linkedin.com/company/rossisrl",
        facebookpage: "",
        
        // Business Identity
        sector: "sector_consulting",
        businessdescription: "Consulenza IT per PMI",
        aigoal: "Automatizzare gestione clienti e documenti",
        
        // Subscription
        subscriptionplan: "Pioneer Trial",
        subscriptionstatus: "PendingActivation",
        creditsbalance: 50,
        
        // AI Config
        modelchoice: "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent",
        lenguage: "Italiano",
        
        // Orari Operativi
        ownerunavailabletime: "21-7",
        operatorunavailabletime: "19-9",
        
        // Operatori
        operators: [
          {
            OperatorName: "Mario Rossi",
            OperatorChatID: 123456789,
            OperatorLenguage: "Italiano",
            FreeHandOperator: true,
            Role: "Owner",
            GeminiKey: "AIzaSy..."
          }
        ],
        
        // Compliance
        paymentpreference: "wire",
        termsaccepted: true,
        
        // Metadata
        createdat: "2025-12-04T08:00:00.000Z",
        additionalkwargs: {},
        responsemetadata: {}
      }
    }
  ]
}
Collection: honeypots
javascript
{
  sessionId: "IT12345678901",
  messages: [
    {
      data: {
        // HONEYPOT CONFIG
        config: {
          onboardingcompleted: true, // Flag critico
          setupversion: "2.3",
          lastupdate: "2025-12-04T08:00:00.000Z"
        },
        
        // Core Identity (Knowledge Base frammenti)
        knowledgefragments: {
          identity: {
            businessname: "Rossi Srl",
            sector: "consulting",
            description: "...",
            mission: "...",
            values: []
          },
          services: [],
          products: [],
          processes: []
        },
        
        // Assets Multimediali
        assets: {
          logo: {
            url: "https://...",
            uploaddate: "2025-12-04",
            mimetype: "image/png"
          },
          photo: { /* profilo */ },
          documents: [] // PDF, contratti, certificazioni
        },
        
        // Testi Marketing
        offertext: "Testo offerta principale",
        welcomemessage: "Messaggio benvenuto clienti",
        
        // Campi Honeypot Anti-Spam
        honeypotfields: [
          {
            name: "email_confirm_hidden",
            type: "text",
            expectedvalue: "", // Deve restare vuoto
            cssclass: "hidden-field"
          }
        ]
      }
    }
  ]
}
Collection: servicecatalog
javascript
{
  sessionId: "IT12345678901-setupik", // Chiave composita
  messages: [
    {
      data: {
        // CATALOGO GERARCHICO
        categories: [
          {
            name: "Consulenza IT",
            shortname: "💻 IT Consulting",
            description: "Servizi di consulenza informatica",
            callbackdata: "SVC00000001", // ID univoco
            subcategories: [ // Prodotti/Servizi
              {
                name: "Audit Sicurezza",
                shortname: "🔒 Audit",
                callbackdata: "SVC00000002",
                blueprintready: true, // Flag: processo definito
                description: "Analisi completa sicurezza IT",
                pricing: {
                  baseprice: 1500,
                  currency: "EUR",
                  unitofmeasure: "project"
                }
              }
            ]
          }
        ],
        
        metadata: {
          version: "1.0",
          lastupdatedat: "2025-12-04T08:00:00.000Z",
          updatedby: "SYSTEM:AUTOPROVISIONING"
        }
      }
    }
  ]
}
Database: TbosAssetLake
Collection: knowledgefragments
javascript
{
  sessionId: "IT12345678901-SVC00000002", // ownerid-itemsku
  messages: [
    {
      data: {
        fragmentid: "uuid-v4",
        itemsku: "SVC00000002",
        ownerid: "IT12345678901",
        
        // Contenuto KB
        fragmenttype: "SERVICE_DESCRIPTION",
        content: {
          technicalspecs: "...",
          deliverables: [],
          prerequisites: [],
          faq: []
        },
        
        // Embedding per Ricerca Vettoriale
        embeddings: [], // Array di float
        
        // Metadata
        createdat: "2025-12-04",
        lastupdated: "2025-12-04",
        source: "AI_GENERATION"
      }
    }
  ]
}
Collection: processblueprints
javascript
{
  sessionId: "IT12345678901-SVC00000002",
  messages: [
    {
      data: {
        id: "uuid-v4",
        ownerinstanceid: "IT12345678901",
        servicesku: "SVC00000002",
        blueprintname: "Audit Sicurezza - Workflow",
        blueprintdescription: "Processo step-by-step audit sicurezza",
        
        // STAGES (Fasi del processo)
        stages: [
          {
            stageid: 1,
            name: "Analisi Preliminare",
            description: "Raccolta info preliminari cliente",
            duration: "2 ore",
            deliverables: ["Questionario compilato", "Mappa asset"],
            tools: ["Google Forms", "Draw.io"]
          },
          {
            stageid: 2,
            name: "Scansione Vulnerabilità",
            description: "Test automatizzati e manuali",
            duration: "1 settimana",
            deliverables: ["Report scansione", "Lista CVE"],
            tools: ["Nessus", "Metasploit"]
          }
        ],
        
        // Metadata
        summary: {
          totalstages: 2,
          estimatedduration: "2 settimane",
          skillsrequired: ["Network Security", "Pentest"]
        },
        
        metadata: {
          createdat: "2025-12-04",
          status: "ACTIVE"
        }
      }
    }
  ]
}
Collection: compliancedocs
javascript
{
  sessionId: "SVC00000002", // Per singolo prodotto
  messages: [
    {
      data: {
        documentid: "uuid-v4",
        itemsku: "SVC00000002",
        ownerid: "IT12345678901",
        
        // Documenti Generati AI
        documents: {
          informativaprivacy: {
            content: "Testo completo informativa...",
            generatedat: "2025-12-04",
            language: "it"
          },
          contrattotipo: {
            content: "CONTRATTO DI FORNITURA SERVIZI...",
            placeholders: ["{{CLIENT_NAME}}", "{{DATE}}"],
            generatedat: "2025-12-04"
          }
        },
        
        // Compliance Flags
        gdprcompliant: true,
        isostandards: ["ISO27001"],
        
        metadata: {
          lastupdated: "2025-12-04"
        }
      }
    }
  ]
}

3. FLUSSI BACKEND CRITICI
3.1 Onboarding Flow (Webhook 1211a23e...)
Action: analyze_id
Request Payload:
json
{
  "action": "analyze_id",
  "user_id": "123456789",
  "file_data": "base64-encoded-image",
  "mime_type": "image/jpeg",
  "gemini_key": "AIzaSy..."
}
n8n Workflow Steps:
    1. Extract node: prepara chiamata Gemini
       javascript
       {
         SystemInstruction: "You are an advanced AI Expert in European KYC Document Analysis...",
         Prompt: "Analyze the provided document image. Extract: surname, name, dateofbirth, fiscalcode, docnumber...",
         ModelChoice: "gemini-flash-lite-latest",
         GeminiKey: "{{$json.userrequest.geminikey}}",
         data: "{{$json.userrequest.filedata}}",
         mimeType: "{{$json.userrequest.mimetype}}"
       }
    2. Call TBoSSerchThink (sub-workflow): esegue chiamata a Gemini API
        ◦ URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key={{GeminiKey}}
        ◦ Method: POST
        ◦ Body:
       json
       {
         "contents": [{
           "parts": [
             {"text": "{{SystemInstruction}}\n\n{{Prompt}}"},
             {"inline_data": {"mime_type": "{{mimeType}}", "data": "{{data}}"}}
           ]
         }]
       }
    3. ErrorApi5 node (IF): controlla se risposta contiene errori
        ◦ Se json.isFatal === true OR json.error exists → gestione errore
        ◦ Altrimenti → procedi
    4. Edit Fields1 node: formatta risposta
       javascript
       {
         status: "success",
         data: {
           name: "{{$json.document.name}}",
           surname: "{{$json.document.surname}}",
           fiscal_code: "{{$json.document.fiscalcode}}"
         }
       }
       O in caso errore documento:
       javascript
       {
         status: "error",
         data: {
           error: "invalid_document"
         }
       }
    5. Respond to Webhook: ritorna JSON al frontend
Response Success:
json
{
  "status": "success",
  "data": {
    "name": "Mario",
    "surname": "Rossi",
    "fiscal_code": "RSSMRA80A01H501U",
    "dateofbirth": "1980-01-01",
    "placeofbirth": "Roma",
    "docnumber": "CA1234567",
    "expirydate": "2030-01-01"
  }
}
Response Error:
json
{
  "status": "error",
  "data": {
    "error": "invalid_document"
  }
}

Action: payment_checkout
Request Payload:
json
{
  "action": "payment_checkout",
  "user_id": "123456789",
  "chat_id": "123456789",
  "thread_id": "42",
  "owner_data": {
    "gemini_key": "AIzaSy...",
    "name": "Mario",
    "surname": "Rossi",
    // ... (tutti i dati onboarding)
    "kyc_details": {
      "name": "Mario",
      "surname": "Rossi",
      "fiscal_code": "RSSMRA80A01H501U"
    }
  }
}
n8n Workflow Steps:
    1. owner3 node: controlla se esiste già sessione
       javascript
       db.ownersessions.aggregate([
         {$match: {sessionId: {$eq: "{{$json.owner_data.vat_number}}"}}},
         {$project: {owner: {$arrayElemAt: ["$messages", 0]}, id: 0}},
         {$project: {ownerdata: "$owner.data", id: 0}}
       ])
    2. If1: se ownerdata esiste → BuildErrorPayloadMultilang
        ◦ Genera messaggio errore in 6 lingue
        ◦ Invia notifica Telegram
        ◦ Risponde webhook con errore 409 (Conflict)
    3. Se NON esiste → FinalizeProvisioning node
       javascript
       // Genera UUID token
       const accessToken = generateUUID();
       
       // Normalizza VAT con prefisso nazione
       let cleanVat = rawData.vatnumber.toUpperCase().replace(/[^A-Z0-9]/g, '');
       if (!/[0-9]/.test(cleanVat)) {
         cleanVat = targetPrefix + cleanVat; // es. IT + 12345678901
       }
       
       // Costruisce ownerData completo (schema completo visto sopra)
       const ownerData = {
         userid: cleanVat,
         chatid: parseInt(req.chatid),
         accesstoken: accessToken, // <-- TOKEN SICUREZZA
         // ... tutti gli altri campi
       };
       
       return {json: {ownerData, telegramPayload, webhookResponse}};
    4. owner node (Memory Manager): salva in MongoDB
       javascript
       // Usa MongoDB Chat Memory (LangChain integration)
       collection: "ownersessions"
       sessionKey: "{{$json.ownerdata.vatnumber}}"
       message: "{{$json.ownerdata}}"
       mode: "insert/override"
    5. Telegram Call node: invia messaggio benvenuto
       javascript
       POST https://api.telegram.org/bot{{BOT_TOKEN}}/sendMessage
       {
         "chat_id": "{{$json.ownerdata.chatid}}",
         "text": "🎉 <b>ISTANZA CONFIGURATA</b>\n\nBenvenuto a bordo, <b>{{name}}</b>!...",
         "parse_mode": "HTML",
         "reply_markup": {
           "inline_keyboard": [[
             {"text": "AVVIA MOTORE SITEBOS", "url": "https://..."}
           ]]
         }
       }
    6. Respond to Webhook:
       json
       {
         "status": "success",
         "ownerid": "IT12345678901",
         "accesstoken": "uuid-generated",
         "message": "Onboarding completato",
         "nextstep": "dashboard"
       }

3.2 Dashboard Data Retrieval
Request:
json
{
  "action": "get_dashboard_data",
  "token": "uuid-access-token",
  "chat_id": "123456789"
}
n8n Steps:
    1. owner node: recupera da ownersessions con match accesstoken
    2. HoneyPot node: recupera da honeypots con match vatnumber
    3. servicecatalogsetup node: recupera da servicecatalog con match vatnumber-setupik
    4. Merge3: combina tutti i dati
    5. PrepareDashboardResponse node:
       javascript
       // Analisi Catalogo
       let categoryCount = 0;
       let productCount = 0;
       let blueprintReadyCount = 0;
       
       catalog.categories.forEach(cat => {
         categoryCount++;
         if (cat.subcategories) {
           productCount += cat.subcategories.length;
           blueprintReadyCount += cat.subcategories.filter(p => p.blueprintready === true).length;
         }
       });
       
       // Knowledge Docs (SOLO compliance generati, NON frammenti honeypot)
       let knowledgeCount = 0;
       if (input.compliancedocs) {
         knowledgeCount += input.compliancedocs.length;
       }
       
       // Operatori attivi (escluso owner)
       let activeOperatorsCount = owner.operators.filter(op => 
         op.OperatorChatID && op.Role !== "Owner"
       ).length;
       
       // Stato Honeypot
       const isOnboardingComplete = hp.config?.onboardingcompleted === true;
       const honeypotStatus = isOnboardingComplete ? "READY" : "CONFIG_REQUIRED";
       
       // Calcolo Score Completamento Profilo
       let completionScore = 0;
       if (owner.vatnumber) completionScore += 10;
       if (owner.ragionesociale) completionScore += 10;
       if (hp.assets?.logo?.url) completionScore += 10;
       if (hp.offertext) completionScore += 20;
       if (blueprintReadyCount > 0) completionScore += 30;
       if (isOnboardingComplete) completionScore += 20;
       completionScore = Math.min(completionScore, 100);
       
       return {
         json: {
           ownerdata: {
             ragionesociale: owner.ragionesociale,
             vatnumber: owner.vatnumber,
             credits: owner.creditsbalance || 0,
             logourl: hp.assets?.logo?.url || null
           },
           status: {
             honeypot: honeypotStatus,
             profilecompletion: completionScore
           },
           categoriescount: categoryCount,
           productscount: productCount,
           blueprintscount: blueprintReadyCount,
           knowledgedocs: knowledgeCount,
           operatorscount: activeOperatorsCount,
           appointmentstoday: 0,
           success: true
         }
       };
    6. Respond to Webhook: ritorna dashboard data

3.3 Product Management con AI
Request (Save Product):
json
{
  "action": "SAVE",
  "token": "uuid-access-token",
  "vat": "IT12345678901",
  "categoryid": "SVC00000001",
  "productId": "SVC00000002",
  "mediaitems": [
    {
      "base64content": "data:image/png;base64,...",
      "mimetype": "image/png"
    }
  ]
}
n8n Complex Flow:
    1. owner2 + HoneyPot + servicecatalog2: recupera contesto completo
    2. Context Reducer node: prepara contesto per AI
       javascript
       const targetCategory = catalog.categories.find(c => c.callbackdata === catId);
       
       return {
         contextcategoryname: targetCategory.name,
         contextcategorydesc: targetCategory.description,
         existingproductsnames: targetCategory.subcategories.map(s => s.name).join(", "),
         contextmode: "CATEGORY"
       };
    3. productreserch node: chiamata AI per analisi immagine/testo
       javascript
       SystemInstruction: "Role: TrinAi Catalog Builder
       Objective: Generare un CATALOG_ITEM e un UI_NODE DRAFT strutturati..."
       
       Prompt: "Analizza l'immagine/descrizione fornita e genera:
       - catalogitemdraft (schema completo prodotto)
       - uinodedraft (dati UI per frontend)"
    4. Call TBoSSerchThink1 (sub-workflow Gemini): genera struttura prodotto
    5. productKB node: genera Knowledge Base frammento
    6. productBluePrint node: genera process blueprint (fasi operative)
    7. productCompliance node: genera documenti compliance (contratti, privacy)
    8. Code in JavaScript node: aggiorna catalogo
       javascript
       // 1. Pulisce dati AI
       const cleanProduct = JSON.parse(JSON.stringify(item.productstructure.catalogitemdraft));
       const cleanBlueprint = JSON.parse(JSON.stringify(item.Blueprint));
       const cleanKB = JSON.parse(JSON.stringify(item.KBfragment));
       
       // 2. Aggiorna UI nel catalogo
       const catalogSetup = JSON.parse(JSON.stringify(item.servicecatalogsetup));
       const targetCatId = cleanProduct.identity.category;
       const uiNode = cleanProduct.uinodedraft;
       uiNode.blueprintready = true; // Flag attivazione
       
       const catIndex = catalogSetup.categories.findIndex(c => c.callbackdata === targetCatId);
       const subCats = catalogSetup.categories[catIndex].subcategories;
       const existingIndex = subCats.findIndex(s => s.callbackdata === uiNode.callbackdata);
       
       if (existingIndex !== -1) {
         subCats[existingIndex] = uiNode; // UPDATE
       } else {
         subCats.push(uiNode); // INSERT
       }
       
       return {
         FinalProduct: cleanProduct,
         FinalBlueprint: cleanBlueprint,
         FinalKBFragment: cleanKB,
         UpdatedServiceCatalog: catalogSetup
       };
    9. servicecatalogproduct + processbluprint + KBFragment + compliance: 4 salvataggi paralleli MongoDB
    10. Respond to Webhook:
       json
       {
         "status": "success",
         "operation": "save_product_completed"
       }

4. SICUREZZA E AUTENTICAZIONE
4.1 Sistema Token Sicurezza
Generazione:
javascript
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
Storage:
    • Salvato in ownersessions.messages[0].data.accesstoken
    • Usato per autenticare tutte le chiamate successive
Validazione (ogni webhook):
javascript
db.ownersessions.aggregate([
  {$match: {
    "messages.0.data.accesstoken": {$eq: "{{$json.body.token}}"}
  }},
  {$project: {owner: {$arrayElemAt: ["$messages", 0]}, id: 0}},
  {$project: {ownerdata: "$owner.data", id: 0}}
])
Se match → ownerdata popolato → accesso consentito
Se NO match → risposta 403 Forbidden
4.2 Error Handling Multilingua
System Error Collection node (presente in tutti i workflow):
javascript
const langMap = {it: "it", en: "en", fr: "fr", de: "de", es: "es", pt: "pt"};
const lang = langMap[userLang.slice(0,2)] || "en";

const i18n = {
  it: {
    title: "<b>Errore Critico Profilo</b>",
    text: "Il sistema rileva che dovresti essere un utente attivo, ma non riesce a recuperare il tuo profilo aziendale.",
    reason: "Possibile corruzione dei dati o cancellazione accidentale.",
    action: "Per favore, contatta il supporto tecnico indicando il tuo ID",
    btn: "Supporto"
  },
  // ... altre 5 lingue
};

const t = i18n[lang];
const messageText = `${t.title}\n\n${t.text}\n\n<b>Reason:</b> ${t.reason}\n\n<b>${t.action}</b>\n<code>${chatId}</code>`;

const telegramPayload = {
  method: "sendMessage",
  chatid: chatId,
  text: messageText,
  parsemode: "HTML",
  replymarkup: {
    inlinekeyboard: [[
      {text: t.btn, url: "https://t.me/TrinAiTecSupportbot"}
    ]]
  }
};

return {
  json: {
    telegramApiPayload: telegramPayload,
    errortype: "GHOST_USER",
    isfatal: true
  }
};

5. INTEGRAZIONI ESTERNE
5.1 Google Gemini API
Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent
Uso nel sistema:
    • Document Analysis (KYC): estrazione dati da documenti identità
    • Product Description Generation: descrizioni automatiche prodotti/servizi
    • Compliance Text Generation: contratti, informative privacy, T&C
    • Process Blueprint Generation: workflow operativi step-by-step
    • Knowledge Base Generation: FAQ, guide, documentazione tecnica
Rate Limits (Free Tier):
    • 15 req/min
    • 1500 req/day
    • 1M token/min input
Modelli usati:
    • gemini-flash-lite-latest (default, veloce)
    • gemini-pro-vision (analisi documenti)
5.2 Telegram Bot API
Bot: @TrinAi_SiteBoS_bot
Metodi usati:
    • sendMessage: notifiche, errori, conferme
    • sendPhoto: invio preview/qr code
    • sendDocument: invio PDF generati
    • answerCallbackQuery: risposta a bottoni inline
Inline Keyboards:
javascript
{
  inline_keyboard: [
    [
      {text: "AVVIA MOTORE SITEBOS", url: "https://t.me/TrinAi_SiteBoS_bot/sitebos?startapp=dashboard"},
      {text: "Gestisci Dati", url: "https://..."}
    ]
  ]
}

7. DEPLOYMENT E CI/CD
7.1 Frontend
Hosting: GitHub Pages (attuale) 
Build: Nessun build process (HTML statico)
Deploy: Git push → auto-deploy
URL: https://simonaiit.github.io/SiteBoS-MiniApp/
7.2 Backend n8n
Hosting: VPS self-hosted (DigitalOcean)
Stack:
text
Docker → n8n container
      → MongoDB container (o Atlas esterno)
      → Nginx reverse proxy (SSL)
Update procedure:
    1. Export workflows da UI n8n (JSON)
    2. Backup MongoDB
    3. Pull nuova immagine Docker n8n
    4. Import workflows
    5. Test webhook endpoints

13. GLOSSARIO TECNICO
Termine
Definizione
Owner
Titolare azienda (P.IVA) registrato su SiteBoS
Honeypot
Collection MongoDB con config operativa e KB frammenti
Blueprint
Workflow operativo step-by-step per un servizio
Catalog Item
Prodotto/servizio nel catalogo aziendale
UI Node
Rappresentazione frontend di un catalog item
Knowledge Fragment
Pezzo di documentazione/FAQ generato da AI
Compliance Doc
Contratto/informativa legale auto-generato
Session ID
VAT number usato come chiave primaria MongoDB
Access Token
UUID per autenticazione Dashboard senza password
Ghost Product
Prodotto placeholder senza blueprint completato
BYOK
Bring Your Own Key (utente fornisce propria API key Gemini)

