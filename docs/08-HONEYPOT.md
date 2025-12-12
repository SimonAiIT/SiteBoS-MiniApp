# 🎭 HoneyPot Editor - Knowledge Base & Anti-Spam

> **Ultima revisione**: 12 Dicembre 2025  
> **Modulo**: `honeypot/`  
> **Database**: `HONEYPOTS_COLLECTION`  
> **Status**: Production ✅

---

## 🎯 Obiettivo

Il **HoneyPot Editor** è il sistema di **knowledge base aziendale** combinato con **protezione anti-spam**:

1️⃣ **Identità Aziendale**: Nome, logo, descrizione, valori, mission  
2️⃣ **Asset Library**: Foto, documenti, video (storage organizzato)  
3️⃣ **Form Builder**: Editor visuale per form di contatto/lead  
4️⃣ **Honeypot Security**: Campi trappola invisibili per bloccare bot spam  
5️⃣ **Multi-Lingua**: Contenuti tradotti in 6 lingue  
6️⃣ **Export API**: JSON endpoint per integrazioni esterne  

---

## 🏗️ Architettura Dati

### Schema MongoDB

```javascript
{
  "_id": ObjectId("..."),
  "vat_number": "12345678901",
  "owner_id": "user123",
  "company_identity": {
    "company_name": "TrinAI S.r.l.",
    "legal_name": "Trinacria Artificial Intelligence S.r.l.",
    "tagline": "Trasforma il tuo business con AI conversazionale",
    "description": "Startup innovativa italiana specializzata in soluzioni AI...",
    "mission": "Democratizzare l'accesso all'AI per le PMI italiane",
    "vision": "Un'Italia dove ogni azienda può competere globalmente grazie all'AI",
    "values": ["Trasparenza", "Innovazione", "Etica AI", "Supporto locale"],
    "founded_year": 2023,
    "industry": "Artificial Intelligence",
    "headquarters": "Palermo, Sicilia"
  },
  "assets": {
    "logo": {
      "primary_url": "https://storage.../logo-primary.svg",
      "secondary_url": "https://storage.../logo-white.svg",
      "favicon_url": "https://storage.../favicon.ico",
      "uploaded_at": "2025-12-01T09:00:00Z"
    },
    "photos": [
      {
        "photo_id": "photo_001",
        "photo_url": "https://storage.../team-photo.jpg",
        "photo_title": "Team TrinAI 2025",
        "photo_description": "Il nostro team durante l'hackathon AI",
        "category": "team",  // "team" | "office" | "product" | "event"
        "is_featured": true,
        "uploaded_at": "2025-12-01T10:00:00Z"
      }
    ],
    "documents": [
      {
        "document_id": "doc_001",
        "document_url": "https://storage.../company-brochure.pdf",
        "document_title": "Brochure TrinAI",
        "document_type": "brochure",  // "brochure" | "whitepaper" | "case_study" | "presentation"
        "file_size_mb": 2.5,
        "uploaded_at": "2025-12-01T11:00:00Z"
      }
    ],
    "videos": [
      {
        "video_id": "video_001",
        "video_url": "https://youtube.com/watch?v=...",
        "video_title": "Demo SiteBoS",
        "video_description": "Panoramica completa della piattaforma",
        "duration": "5:32",
        "platform": "youtube",  // "youtube" | "vimeo" | "self_hosted"
        "added_at": "2025-12-01T12:00:00Z"
      }
    ]
  },
  "contact_form": {
    "form_id": "form_001",
    "form_name": "Contatto Generale",
    "form_fields": [
      {
        "field_id": "field_name",
        "field_type": "text",
        "field_label": "Nome Completo",
        "field_placeholder": "Es. Mario Rossi",
        "is_required": true,
        "validation_regex": "^[a-zA-Z\\s]+$",
        "error_message": "Inserire solo lettere e spazi",
        "order": 1
      },
      {
        "field_id": "field_email",
        "field_type": "email",
        "field_label": "Email",
        "field_placeholder": "mario.rossi@example.com",
        "is_required": true,
        "validation_regex": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        "error_message": "Email non valida",
        "order": 2
      },
      {
        "field_id": "field_phone",
        "field_type": "tel",
        "field_label": "Telefono",
        "field_placeholder": "+39 123 456 7890",
        "is_required": false,
        "validation_regex": "^\\+?[0-9\\s\\-\\(\\)]+$",
        "order": 3
      },
      {
        "field_id": "field_message",
        "field_type": "textarea",
        "field_label": "Messaggio",
        "field_placeholder": "Scrivi qui il tuo messaggio...",
        "is_required": true,
        "min_length": 20,
        "max_length": 1000,
        "order": 4
      },
      {
        "field_id": "honeypot_trap",
        "field_type": "text",
        "field_label": "Do not fill this field",
        "is_honeypot": true,  // 🎯 Campo trappola
        "is_hidden": true,     // CSS: display:none per umani, visible per bot
        "order": 999
      }
    ],
    "submit_button": {
      "button_text": "Invia Richiesta",
      "button_color": "#5b6fed",
      "success_message": "Grazie! Ti contatteremo entro 24 ore.",
      "error_message": "Errore nell'invio. Riprova."
    },
    "form_settings": {
      "enable_captcha": false,
      "enable_honeypot": true,
      "max_submissions_per_ip": 3,
      "submission_cooldown_minutes": 5,
      "notification_email": "info@trinai.it",
      "auto_reply_enabled": true
    },
    "created_at": "2025-12-01T13:00:00Z",
    "updated_at": "2025-12-05T15:00:00Z"
  },
  "translations": {
    "it": {
      "tagline": "Trasforma il tuo business con AI conversazionale",
      "description": "Startup innovativa italiana..."
    },
    "en": {
      "tagline": "Transform your business with conversational AI",
      "description": "Innovative Italian startup..."
    },
    "fr": {
      "tagline": "Transformez votre entreprise avec l'IA conversationnelle",
      "description": "Startup italienne innovante..."
    }
    // DE, ES, PT...
  },
  "metadata": {
    "total_photos": 12,
    "total_documents": 5,
    "total_videos": 3,
    "last_updated": "2025-12-05T15:00:00Z",
    "profile_completion": 85  // %
  }
}
```

---

## 🔄 User Flow

```mermaid
graph TD
    A[Dashboard] -->|Click "HoneyPot"| B[honeypot/editor.html]
    B -->|Sezione "Identità"| C[Edit Company Info]
    C -->|Submit| D[POST: update_identity]
    
    B -->|Sezione "Asset"| E[honeypot/asset-manager.html]
    E -->|Upload Logo| F[POST: upload_logo]
    F -->|Google Cloud Storage| G[Return URL]
    G -->|Save to MongoDB| H[Update assets.logo]
    
    E -->|Upload Photo| I[POST: upload_photo]
    I -->|Compress + Store| J[Return URL + Thumbnail]
    J -->|Add to photos array| K[Render Gallery]
    
    B -->|Sezione "Form Builder"| L[honeypot/form-builder.html]
    L -->|Drag & Drop Fields| M[Visual Editor]
    M -->|Add Honeypot| N[Generate Hidden Field]
    N -->|Submit| O[POST: save_form]
    O -->|Update contact_form| P[Generate Embed Code]
    
    P -->|Copy Embed| Q[Integra su sito esterno]
    Q -->|Form Submit| R[POST: submit_form]
    R -->|Check Honeypot| S{Honeypot Filled?}
    S -->|Yes| T[Block + Log Spam]
    S -->|No| U[Process + Notify]
    
    style N fill:#f59e0b,color:#fff
    style T fill:#ff3b30,color:#fff
    style U fill:#4cd964,color:#fff
```

---

## 🎨 Frontend Modules

### `honeypot/editor.html`

**Dashboard Principale** con 4 sezioni collassabili:

#### 1. 🏢 Identità Aziendale

```html
<div class="knowledge-card">
  <div class="card-header">
    <h3><i class="fas fa-building"></i> Identità Aziendale</h3>
    <i class="fas fa-chevron-down chevron"></i>
  </div>
  <div class="card-content">
    <input type="text" id="company-name" placeholder="Nome Azienda">
    <input type="text" id="tagline" placeholder="Tagline (max 60 char)">
    <textarea id="description" rows="5" placeholder="Descrizione aziendale..."></textarea>
    <textarea id="mission" rows="3" placeholder="Mission..."></textarea>
    <textarea id="vision" rows="3" placeholder="Vision..."></textarea>
    <div id="values-tags"></div>
    <button class="btn btn-primary" id="save-identity">Salva Identità</button>
  </div>
</div>
```

#### 2. 🖼️ Asset Library

**Gestione File Multimediali**:

- **Logo Tab**: Upload primary/secondary/favicon
- **Photos Tab**: Gallery drag-and-drop con categorie
- **Documents Tab**: Lista PDF/Word con preview
- **Videos Tab**: Embed YouTube/Vimeo

**Upload Flow**:
```javascript
const uploadPhoto = async (file) => {
  // 1. Client-side compression (max 1920px width)
  const compressed = await compressImage(file, 1920);
  
  // 2. Upload to storage
  const formData = new FormData();
  formData.append('photo', compressed);
  formData.append('vat_number', vatNumber);
  formData.append('category', 'team');
  
  const response = await fetch(WEBHOOK_UPLOAD_PHOTO, {
    method: 'POST',
    body: formData
  });
  
  const { photo_url, thumbnail_url } = await response.json();
  
  // 3. Add to gallery
  addPhotoToGallery(photo_url, thumbnail_url);
};
```

#### 3. 📋 Form Builder

**Editor Visuale Drag & Drop** con:

- **Field Palette**: Text, Email, Tel, Textarea, Select, Checkbox, Radio
- **Field Properties Panel**:
  - Label & Placeholder
  - Required toggle
  - Validation regex
  - Error message
- **Honeypot Generator**: Bottone "Add Honeypot" che crea campo nascosto
- **Preview Panel**: Anteprima live del form
- **Export Code**: HTML/JavaScript embed snippet

**Honeypot Field Template**:
```html
<!-- 🎯 Campo Honeypot: DEVE RIMANERE VUOTO -->
<div style="position: absolute; left: -9999px;">
  <label for="website">Website (do not fill)</label>
  <input type="text" name="website" id="website" tabindex="-1" autocomplete="off">
</div>
```

#### 4. 🌍 Multi-Lingua

**Translation Manager**:

- Tab per ogni lingua (IT, EN, FR, DE, ES, PT)
- Auto-sync campi chiave (company_name, tagline, description)
- Badge completamento traduzione per lingua

---

## 🛡️ Sistema Anti-Spam

### Come Funziona l'Honeypot

**Principio**: I bot compilano TUTTI i campi (anche quelli nascosti), gli umani NO.

**Implementazione**:

1. **Campo nascosto CSS** (non `type="hidden"` che bot ignorano):
```html
<input type="text" name="honeypot_trap" 
       style="position:absolute; left:-9999px;" 
       tabindex="-1" 
       autocomplete="off">
```

2. **Validazione Server-Side** (N8N):
```javascript
if (formData.honeypot_trap && formData.honeypot_trap.length > 0) {
  // 🚨 BOT DETECTED!
  logSpamAttempt({
    ip: requestIP,
    user_agent: requestUserAgent,
    timestamp: new Date()
  });
  return {
    success: false,
    message: 'Invalid submission',
    status: 'BLOCKED'
  };
}
```

3. **Rate Limiting Aggiuntivo**:
```javascript
const submissionsFromIP = await getSubmissionCount(requestIP, '5m');

if (submissionsFromIP > 3) {
  return {
    success: false,
    message: 'Too many requests. Please wait 5 minutes.',
    status: 'RATE_LIMITED'
  };
}
```

### Analytics Spam

**Dashboard Spam Detection**:
- Tentativi spam bloccati (ultimi 7 giorni)
- IP più aggressivi
- Pattern comuni (user-agent bot)
- Efficacia honeypot (%)

---

## 📊 Metriche & Analytics

### KPIs Tracciati

- **Profile Completion**: % campi identity compilati
- **Asset Coverage**: Presenza logo, min 3 foto, 1 documento
- **Form Health**: Honeypot attivo + rate limiting configurato
- **Translation Coverage**: % lingue con traduzione completa

### MongoDB Query Example

```javascript
db.HONEYPOTS_COLLECTION.aggregate([
  { $match: { vat_number: '12345678901' } },
  { $project: {
      has_logo: { $cond: [{ $gt: ['$assets.logo.primary_url', null] }, 1, 0] },
      photo_count: { $size: { $ifNull: ['$assets.photos', []] } },
      doc_count: { $size: { $ifNull: ['$assets.documents', []] } },
      form_exists: { $cond: [{ $gt: ['$contact_form.form_id', null] }, 1, 0] },
      honeypot_active: '$contact_form.form_settings.enable_honeypot'
  }},
  { $addFields: {
      completion_score: {
        $multiply: [
          { $divide: [
            { $add: [
              '$has_logo',
              { $cond: [{ $gte: ['$photo_count', 3] }, 1, 0] },
              { $cond: [{ $gte: ['$doc_count', 1] }, 1, 0] },
              '$form_exists',
              { $cond: ['$honeypot_active', 1, 0] }
            ]},
            5
          ]},
          100
        ]
      }
  }}
]);
```

---

## 🔐 Sicurezza

### File Upload Security

```javascript
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_DOC_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_PHOTO_SIZE_MB = 10;
const MAX_DOC_SIZE_MB = 25;

// Server-side validation (N8N)
if (!ALLOWED_PHOTO_TYPES.includes(file.mimetype)) {
  throw new Error('Invalid file type');
}

if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
  throw new Error('File too large');
}

// Virus scan (ClamAV integration - optional)
const scanResult = await scanFile(file.buffer);
if (scanResult.infected) {
  throw new Error('File contains malware');
}
```

### GDPR Compliance

- **Privacy Policy Generator**: Auto-generata da dati honeypot
- **Cookie Banner**: Configurazione consenso cookie
- **Data Portability**: Export JSON completo honeypot
- **Right to Erasure**: Eliminazione cascata asset da storage

---

## 🛠️ Troubleshooting

### Errori Comuni

**1. "Logo non carica"**
- **Causa**: Formato SVG con codice embedded non sanitizzato
- **Fix**: Convertire SVG in PNG o usare SVGO per sanitizzazione

**2. "Form spam arriva lo stesso"**
- **Causa**: Honeypot disabilitato o campo visibile per errore CSS
- **Fix**: Verificare `enable_honeypot: true` e testare con developer tools

**3. "Upload fallisce"**
- **Causa**: File > 10MB o timeout network
- **Fix**: Comprimere immagine o aumentare timeout N8N webhook (default 60s)

**4. "Traduzioni non salvano"**
- **Causa**: Lingua non supportata o campo vuoto
- **Fix**: Verificare lingua in `['it','en','fr','de','es','pt']` e min 10 caratteri

---

## 🚀 Roadmap HoneyPot

### Q2 2025
- [ ] **AI Content Rewriter**: Riscrittura automatica per SEO
- [ ] **Social Media Sync**: Auto-post su LinkedIn/Facebook da asset library
- [ ] **Form Analytics**: Conversion rate, drop-off points
- [ ] **A/B Testing**: Varianti form per ottimizzazione conversioni

### Q3 2025
- [ ] **Widget Builder**: Embed widget personalizzabili (chat, newsletter)
- [ ] **CDN Integration**: Cloudflare/Fastly per asset delivery
- [ ] **Version Control**: Git-like history per rollback modifiche

---

## 📁 Struttura File

```
honeypot/
├── editor.html               # Dashboard principale
├── asset-manager.html        # Gestione file multimediali
├── form-builder.html         # Editor form visuale
├── translations.html         # Manager traduzioni
├── js/
│   ├── honeypot-logic.js     # Business logic principale
│   ├── form-builder.js       # Logic form builder
│   ├── asset-uploader.js     # Upload handler
│   └── translation-sync.js   # Sync traduzioni
└── css/
    └── honeypot-style.css    # Stili dedicati
```

---

## 📚 Documentazione Correlata

- [01-OVERVIEW.md](./01-OVERVIEW.md) - Panoramica progetto
- [03-MODULES.md](./03-MODULES.md) - Tutti i moduli
- [06-CATALOG.md](./06-CATALOG.md) - Catalog Manager
- [09-API-REFERENCE.md](./09-API-REFERENCE.md) - Webhook N8N
- [13-SECURITY.md](./13-SECURITY.md) - Security best practices

---

<div align="center">

**HoneyPot Editor sviluppato da [TrinAI](https://www.trinai.it)**

*Your identity, your security*

[⬆ Torna alla documentazione](../README.md)

</div>