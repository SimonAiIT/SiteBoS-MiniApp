# 11 - HONEYBLOG BACKEND SPECIFICATIONS

> **Endpoint**: `https://trinai.api.workflow.dcmake.it/webhook/50891655-84c8-4213-90e8-26ebbc3d6c4c`  
> **Method**: `POST`  
> **Content-Type**: `application/json`

---

## 🎯 Panoramica

Il backend HoneyBlog gestisce la creazione di landing page dinamiche basate sui dati HoneyPot, Catalogo e Knowledge Base dell'utente.

### Flusso Principale

```
1. get_honeyblog_data    → Carica tutti i dati necessari
2. preview_landing       → Genera anteprima temporanea (opzionale)
3. generate_image        → Genera immagini AI (se richiesto)
4. deploy_honeyblog_landing → Pubblica landing e scala crediti
```

---

## 📡 Action 1: `get_honeyblog_data`

### Scopo
Recupera tutti i dati necessari per popolare l'editor della landing page.

### Request

```json
{
  "action": "get_honeyblog_data",
  "vat_number": "IT06988830821",
  "chat_id": "720379727",
  "token": "sk_jnqd2lce3dtrpxydxzy5gk"
}
```

### Response Success (Struttura Reale)

**Nota**: La risposta è un **array con un singolo oggetto**.

```json
[
  {
    "HoneyPot": {
      "company_context_string": "Garofalo Ai Consulting è una ditta individuale italiana...",
      "offer_text": "🚀 Sbloccate il Vostro Vantaggio Competitivo con l'AI!<br>...",
      "knowledge_fragments": [
        {
          "fragment_id": "GAROFALO_AI_OVERVIEW_V1",
          "user_utterances": ["Cos'è Garofalo Ai Consulting?", ...],
          "answer_fragment": "Garofalo Ai Consulting è una ditta...",
          "summary": "Siamo il motore nascosto...",
          "sections": [
            {
              "question": "Qual è lo status legale...",
              "answer": "Garofalo Ai Consulting opera come..."
            }
          ]
        }
      ],
      "offers": [],
      "availability_schedule": {
        "hours": {
          "monday": { "morning": { "from": "9" }, "afternoon": { "to": "15" } },
          "tuesday": { "morning": { "from": "9" }, "afternoon": { "to": "18" } }
        }
      },
      "config": {
        "onboarding_completed": true,
        "bot_token": "8447762269:AAG...",
        "bot_linked": true,
        "completed_at": "2025-12-10T07:11:36.459Z"
      },
      "assets": {
        "logo": {
          "url": "https://cdn.jsdelivr.net/gh/.../logo-IT06988830821.jpeg",
          "mime": "image/jpeg",
          "description": "🤖 ANALISI: Il logo di Garofalo Ai Consulting...",
          "meta": {
            "visual_analysis": "Il logo...",
            "pro_tip": "Per ottimizzare...",
            "colors": ["#1C2C5A", "#8969C7", "#FFFFFF"]
          },
          "updated_at": "2025-12-10T07:05:54.116Z"
        },
        "photo": {
          "description": "🛠️ ANALISI: L'immagine proietta...",
          "mime": "image/jpeg",
          "url": "https://cdn.jsdelivr.net/gh/.../photo-IT06988830821.jpeg",
          "base64": null
        }
      }
    },
    "service_catalog_setup": {
      "categories": [
        {
          "name": "Core IPA & Workflow Automation",
          "short_name": "⚙️ Core IPA Workflow",
          "callback_data": "CAT_JU07RTFG",
          "subcategories": [
            {
              "name": "Automazione End-to-End di Processi Inter-Dipartimentali",
              "short_name": "🤖 Autom. End-to-End",
              "callback_data": "SVC_DQESH7SA",
              "blueprint_ready": true
            }
          ],
          "original_slug": "CORE_IPA_WORKFLOW"
        }
      ],
      "metadata": {
        "last_updated_at": "2025-12-10T13:19:15.591Z",
        "updated_by": "SYSTEM_AUTO_PROVISIONING"
      }
    },
    "owner_data": {
      "user_id": "IT06988830821",
      "chat_id": 720379727,
      "access_token": "sk_jnqd2lce3dtrpxydxzy5gk",
      "vat_number": "IT06988830821",
      "name": "GIUSEPPE",
      "surname": "GAROFALO",
      "email": "garofalo.giuseppe77@gmail.com",
      "phone": "3273569647",
      "ragione_sociale": "Garofalo Ai Consulting",
      "indirizzo": "Via Esterna valle Cuba 14/1, 90046 MONREALE (PA)",
      "fiscal_code": "GRFGPP77M30G273K",
      "sdi_pec": "KRRH6B9",
      "site": "https://garofaloai.com/",
      "linkedin_page": "https://www.linkedin.com/in/giuseppe-garofalo-8bb95880/",
      "facebook_page": "",
      "sector": "services_consulting",
      "business_description": "• Intelligent Process Automation...",
      "subscription_plan": "Pioneer Trial",
      "subscription_status": "Pending_Activation",
      "credits_balance": 10000000,
      "model_choice": "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent",
      "lenguage": "Italiano",
      "created_at": "2025-12-10T06:49:05.804Z"
    }
  }
]
```

### Mappatura Campi per Landing Page

#### Da `HoneyPot`

| Campo Frontend | Path Backend | Note |
|---|---|---|
| Logo aziendale | `HoneyPot.assets.logo.url` | URL CDN del logo |
| Foto hero | `HoneyPot.assets.photo.url` | URL CDN foto principale |
| Business Name | Derivato da `company_context_string` | Estrazione tramite parsing |
| Tagline | `HoneyPot.offer_text` | HTML, può richiedere sanitizzazione |
| FAQ | `HoneyPot.knowledge_fragments[]` | Array di domande/risposte |
| Orari | `HoneyPot.availability_schedule.hours` | Oggetto con giorni settimana |

#### Da `owner_data`

| Campo Frontend | Path Backend | Note |
|---|---|---|
| Ragione Sociale | `owner_data.ragione_sociale` | |
| Email | `owner_data.email` | |
| Telefono | `owner_data.phone` | |
| Sito Web | `owner_data.site` | |
| LinkedIn | `owner_data.linkedin_page` | |
| Facebook | `owner_data.facebook_page` | Può essere vuoto |
| Indirizzo | `owner_data.indirizzo` | |
| Crediti disponibili | `owner_data.credits_balance` | Per controllo deploy |

#### Da `service_catalog_setup`

| Campo Frontend | Path Backend | Note |
|---|---|---|
| Categorie servizi | `service_catalog_setup.categories[]` | Array categorie |
| Nome categoria | `categories[].name` | Nome completo |
| Servizi (subcategories) | `categories[].subcategories[]` | Array servizi |
| Nome servizio | `subcategories[].name` | |
| Servizio featured | `subcategories[].blueprint_ready` | Boolean per highlight |

---

## 👁️ Action 2: `preview_landing`

### Scopo
Genera un'anteprima temporanea della landing page senza scalare crediti.

### Request

```json
{
  "action": "preview_landing",
  "vat_number": "IT06988830821",
  "chat_id": "720379727",
  "token": "sk_jnqd2lce3dtrpxydxzy5gk",
  "use_ai_images": true,
  "uploaded_images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "data:image/png;base64,iVBORw0KGgo..."
  ],
  "honeypot": { /* Oggetto HoneyPot completo ricevuto da get_honeyblog_data */ },
  "catalog": { /* Oggetto service_catalog_setup completo */ }
}
```

### Response Success

```json
{
  "success": true,
  "preview_url": "https://preview-IT06988830821-abc123.pages.dev",
  "expires_at": "2025-12-13T12:00:00Z",
  "note": "Anteprima valida per 24 ore"
}
```

---

## 🇮 Action 3: `generate_image`

### Scopo
Genera una singola immagine AI basata su prompt derivato dai dati business.

### Request

```json
{
  "action": "generate_image",
  "vat_number": "IT06988830821",
  "chat_id": "720379727",
  "token": "sk_jnqd2lce3dtrpxydxzy5gk",
  "prompt_context": {
    "business_name": "Garofalo Ai Consulting",
    "industry": "services_consulting",
    "description": "Intelligent Process Automation..."
  },
  "image_type": "hero",
  "style": "professional"
}
```

**Parametri**:
- `image_type`: `"hero"` | `"product"` | `"background"` | `"logo"`
- `style`: `"professional"` | `"creative"` | `"minimal"` | `"corporate"`

### Response Success

```json
{
  "success": true,
  "image_url": "https://cdn.example.com/generated/img_abc123.jpg",
  "prompt_used": "Professional technology office environment, modern and clean",
  "generation_time_ms": 2500
}
```

---

## 🚀 Action 4: `deploy_honeyblog_landing`

### Scopo
Pubblica definitivamente la landing page, scala 10.000 crediti, restituisce URL finale.

### Request

```json
{
  "action": "deploy_honeyblog_landing",
  "vat_number": "IT06988830821",
  "chat_id": "720379727",
  "token": "sk_jnqd2lce3dtrpxydxzy5gk",
  "use_ai_images": true,
  "uploaded_images": [],
  "honeypot": { /* Oggetto HoneyPot completo */ },
  "catalog": { /* Oggetto service_catalog_setup completo */ }
}
```

### Response Success

```json
{
  "success": true,
  "landing_url": "https://honeyblog-IT06988830821.pages.dev",
  "credits_deducted": 10000,
  "credits_remaining": 9990000,
  "deployed_at": "2025-12-12T12:30:00Z",
  "features_enabled": [
    "hero_section",
    "services_showcase",
    "faq_section",
    "contact_form"
  ]
}
```

### Response Error - Crediti Insufficienti

```json
{
  "success": false,
  "error": "insufficient_credits",
  "required": 10000,
  "available": 4500,
  "deficit": 5500,
  "message": "Crediti insufficienti per completare il deploy"
}
```

---

## 📊 Struttura Landing Page Generata

### Sezioni Incluse

1. **Hero Section**
   - Logo: `HoneyPot.assets.logo.url`
   - Business Name: da `owner_data.ragione_sociale`
   - Tagline: `HoneyPot.offer_text` (sanitizzato)
   - Foto Hero: `HoneyPot.assets.photo.url` o AI-generated
   - CTA: Link al chatbot o form contatto

2. **Services Showcase**
   - Griglia servizi da `service_catalog_setup.categories[].subcategories[]`
   - Evidenzia servizi con `blueprint_ready: true`
   - Card: Nome, Short Name, Icona emoji

3. **FAQ Section**
   - Domande da `HoneyPot.knowledge_fragments[].user_utterances[0]`
   - Risposte da `HoneyPot.knowledge_fragments[].answer_fragment`
   - Layout accordion

4. **Contact Section**
   - Email: `owner_data.email`
   - Telefono: `owner_data.phone`
   - LinkedIn: `owner_data.linkedin_page`
   - Facebook: `owner_data.facebook_page` (se presente)
   - Indirizzo: `owner_data.indirizzo`

5. **Footer**
   - Copyright con `owner_data.ragione_sociale`
   - Link social
   - Link sito: `owner_data.site`

---

## ⚠️ Validazioni Backend

### Campi Obbligatori per Deploy

```javascript
// Controlla questi campi prima del deploy
if (
  !honeypot.company_context_string ||
  !owner_data.ragione_sociale ||
  !owner_data.email ||
  (honeypot.knowledge_fragments?.length < 3 && 
   catalog.categories?.length < 1)
) {
  return {
    success: false,
    error: 'missing_required_data',
    missing_fields: [...]
  };
}
```

### Controllo Crediti

```javascript
const COST = 10000;
const available = owner_data.credits_balance;

if (available < COST) {
  return {
    success: false,
    error: 'insufficient_credits',
    required: COST,
    available: available,
    deficit: COST - available
  };
}
```

---

## 🔒 Sicurezza

### Sanitizzazione HTML

**Campi da sanitizzare**:
- `HoneyPot.offer_text` (contiene HTML)
- `HoneyPot.knowledge_fragments[].answer_fragment` (può contenere Markdown/HTML)

**Rimuovi**:
- `<script>` tags
- `onclick`, `onerror`, altri event handlers
- `javascript:` URLs

### Rate Limiting

- `get_honeyblog_data`: max 30 chiamate/ora
- `preview_landing`: max 10 chiamate/ora
- `generate_image`: max 20 chiamate/ora
- `deploy_honeyblog_landing`: max 3 chiamate/giorno

---

## 📝 Changelog

### v1.1 - 12 Dicembre 2025
- ✅ Aggiunta mappatura campi reali da struttura webhook
- ✅ Documentazione parsing array response
- ✅ Aggiornamento path campi per logo, photo, credits
- ✅ Validazioni specifiche per campi effettivi

### v1.0 - 12 Dicembre 2025
- Definizione iniziale delle 4 action
- Specifiche request/response

---

**Ultimo aggiornamento**: 12 Dicembre 2025, 13:25 CET  
**Endpoint**: `https://trinai.api.workflow.dcmake.it/webhook/50891655-84c8-4213-90e8-26ebbc3d6c4c`