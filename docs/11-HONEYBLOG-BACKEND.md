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
  "vat_number": "12345678901",
  "chat_id": "123456789",
  "token": "user_auth_token"
}
```

### Response Success

```json
{
  "success": true,
  "owner_data": {
    "credits": 15000,
    "ragione_sociale": "Azienda Esempio SRL",
    "logo_url": "https://cdn.example.com/logo.png"
  },
  "honeypot": {
    "profile": {
      "business_name": "Azienda Esempio",
      "description": "Descrizione business...",
      "industry": "Tecnologia",
      "logo_url": "https://...",
      "website": "https://example.com",
      "email": "info@example.com",
      "phone": "+39 123 456 7890",
      "social_links": {
        "facebook": "https://facebook.com/example",
        "instagram": "https://instagram.com/example",
        "linkedin": "https://linkedin.com/company/example"
      }
    },
    "messages": [
      {
        "id": "msg_1",
        "data": {
          "knowledge_fragments": [
            "Domanda: Quali servizi offrite?\nRisposta: Offriamo...",
            "Domanda: Orari di apertura?\nRisposta: Siamo aperti..."
          ]
        }
      }
    ]
  },
  "catalog": {
    "categories": [
      {
        "id": "cat_1",
        "name": "Servizi",
        "products": [
          {
            "id": "prod_1",
            "name": "Consulenza Base",
            "description": "Consulenza iniziale di 1 ora",
            "price": 99.99,
            "image_url": "https://...",
            "featured": true
          },
          {
            "id": "prod_2",
            "name": "Consulenza Premium",
            "description": "Pacchetto completo",
            "price": 299.99,
            "image_url": "https://...",
            "featured": false
          }
        ]
      }
    ]
  },
  "knowledge_docs": 12
}
```

### Response Error

```json
{
  "success": false,
  "error": "unauthorized",
  "message": "Token non valido o scaduto"
}
```

---

## 👁️ Action 2: `preview_landing`

### Scopo
Genera un'anteprima temporanea della landing page senza scalare crediti.

### Request

```json
{
  "action": "preview_landing",
  "vat_number": "12345678901",
  "chat_id": "123456789",
  "token": "user_auth_token",
  "use_ai_images": true,
  "uploaded_images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "data:image/png;base64,iVBORw0KGgo..."
  ],
  "honeypot": { /* Dati honeypot ricevuti da get_honeyblog_data */ },
  "catalog": { /* Dati catalog ricevuti da get_honeyblog_data */ }
}
```

### Response Success

```json
{
  "success": true,
  "preview_url": "https://preview-12345678901-abc123.pages.dev",
  "expires_at": "2025-12-13T12:00:00Z",
  "note": "Anteprima valida per 24 ore"
}
```

### Response Error

```json
{
  "success": false,
  "error": "generation_failed",
  "message": "Impossibile generare anteprima: dati incompleti"
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
  "vat_number": "12345678901",
  "chat_id": "123456789",
  "token": "user_auth_token",
  "prompt_context": {
    "business_name": "Azienda Esempio",
    "industry": "Tecnologia",
    "description": "Azienda innovativa..."
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

### Response Error

```json
{
  "success": false,
  "error": "ai_service_unavailable",
  "message": "Servizio generazione immagini temporaneamente non disponibile"
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
  "vat_number": "12345678901",
  "chat_id": "123456789",
  "token": "user_auth_token",
  "use_ai_images": true,
  "uploaded_images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  ],
  "honeypot": { /* Oggetto completo honeypot */ },
  "catalog": { /* Oggetto completo catalog */ }
}
```

### Response Success

```json
{
  "success": true,
  "landing_url": "https://honeyblog-12345678901.pages.dev",
  "credits_deducted": 10000,
  "credits_remaining": 5000,
  "deployed_at": "2025-12-12T12:30:00Z",
  "features_enabled": [
    "hero_section",
    "products_showcase",
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

### Response Error - Dati Mancanti

```json
{
  "success": false,
  "error": "missing_required_data",
  "missing_fields": ["honeypot.profile.business_name", "catalog.categories"],
  "message": "Alcuni dati obbligatori sono mancanti"
}
```

---

## 📊 Struttura Landing Page Generata

### Sezioni Incluse

1. **Hero Section**
   - Logo aziendale (da `honeypot.profile.logo_url`)
   - Nome business (da `honeypot.profile.business_name`)
   - Tagline/Descrizione (da `honeypot.profile.description`)
   - Immagine hero (AI-generated o uploaded)
   - CTA principale

2. **Products/Services Showcase**
   - Griglia prodotti featured (da `catalog.categories[].products` con `featured: true`)
   - Card con immagine, nome, descrizione, prezzo
   - Link a pagina dettaglio (opzionale)

3. **FAQ Section**
   - Domande/Risposte estratte da `honeypot.messages[].data.knowledge_fragments`
   - Layout accordion o card

4. **Contact Section**
   - Email (da `honeypot.profile.email`)
   - Telefono (da `honeypot.profile.phone`)
   - Link social (da `honeypot.profile.social_links`)
   - Form contatto (opzionale)

5. **Footer**
   - Copyright
   - Link social
   - Link a sito principale (da `honeypot.profile.website`)

---

## ⚠️ Note Implementative Backend

### Validazione Dati

**Campi Obbligatori per Deploy**:
- `honeypot.profile.business_name`
- `honeypot.profile.description`
- Almeno 1 prodotto in `catalog.categories[].products` OPPURE almeno 3 `knowledge_fragments`

**Campi Opzionali**:
- `honeypot.profile.logo_url` (usa placeholder se mancante)
- `honeypot.profile.social_links` (nascondi sezione se vuoto)
- `uploaded_images` (usa AI se `use_ai_images: true`)

### Generazione HTML

**Template Consigliato**:
- HTML5 + CSS inline/embedded
- Mobile-first responsive
- Meta tags SEO (title, description da honeypot)
- Open Graph tags per social sharing
- Schema.org markup per business info

### Hosting

**Opzioni**:
1. Cloudflare Pages (raccomandato per velocità)
2. Vercel
3. Netlify

**Naming Convention**:
- `honeyblog-{vat_number}.pages.dev`
- OPPURE custom subdomain se disponibile

### Caching e Performance

- Cache delle immagini generate AI (evita rigenerazioni)
- Minify HTML/CSS/JS
- Lazy loading immagini
- CDN per asset statici

---

## 🔒 Sicurezza

### Autenticazione

**Verifica sempre**:
1. `token` valido per `vat_number` e `chat_id`
2. Associazione owner <-> vat_number corretta
3. Crediti sufficienti PRIMA di generare (per `deploy_honeyblog_landing`)

### Rate Limiting

**Suggerimenti**:
- `preview_landing`: max 10 chiamate/ora per utente
- `generate_image`: max 20 chiamate/ora per utente
- `deploy_honeyblog_landing`: max 5 chiamate/giorno per utente

### Sanitizzazione Input

**Rimuovi/Escape**:
- Script tags da testi utente
- SQL injection patterns
- XSS vectors nei campi testuali

---

## 📝 Changelog Backend

### v1.0 - 12 Dicembre 2025
- Definizione action `get_honeyblog_data`
- Definizione action `preview_landing`
- Definizione action `generate_image`
- Definizione action `deploy_honeyblog_landing`
- Specifiche struttura dati honeypot + catalog

---

**Ultimo aggiornamento**: 12 Dicembre 2025  
**Endpoint**: `https://trinai.api.workflow.dcmake.it/webhook/50891655-84c8-4213-90e8-26ebbc3d6c4c`