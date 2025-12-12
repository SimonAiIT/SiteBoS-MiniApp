# 📦 Catalog Manager - Sistema Completo

> **Ultima revisione**: 12 Dicembre 2025  
> **Modulo**: `catalog/`  
> **Database**: `CATALOG_COLLECTION`  
> **Status**: Production ✅

---

## 🎯 Obiettivo

Il **Catalog Manager** è il sistema di gestione **prodotti/servizi gerarchico** con:

1️⃣ **Struttura a 2 livelli**: Categoria → Prodotti/Servizi  
2️⃣ **AI Description Generator**: Descrizioni da immagini (Google Gemini Vision)  
3️⃣ **Blueprint Operativi**: Workflow step-by-step per erogazione servizi  
4️⃣ **Pricing & SKU**: Gestione tariffe, varianti, promozioni  
5️⃣ **Multi-lingua**: Catalogo tradotto in 6 lingue  

---

## 🏗️ Architettura Dati

### Schema MongoDB

```javascript
{
  "_id": ObjectId("..."),
  "vat_number": "12345678901",
  "owner_id": "user123",
  "categories": [
    {
      "category_id": "cat_001",
      "category_name": "Consulenza Digitale",
      "category_description": "Servizi di trasformazione digitale per PMI",
      "category_icon": "fa-laptop-code",
      "category_order": 1,
      "is_active": true,
      "created_at": "2025-12-01T10:00:00Z",
      "items": [
        {
          "item_id": "item_001",
          "item_type": "service",  // "product" | "service"
          "item_name": "AI Business Strategy",
          "item_description": "Analisi e roadmap implementazione AI...",
          "item_description_source": "ai_generated",  // "manual" | "ai_generated"
          "pricing": {
            "base_price": 1500.00,
            "currency": "EUR",
            "pricing_model": "fixed",  // "fixed" | "hourly" | "variable"
            "hourly_rate": null,
            "price_range": null
          },
          "sku": "AI-STRAT-001",
          "images": [
            {
              "image_id": "img_001",
              "image_url": "https://storage.../ai-strategy.jpg",
              "is_primary": true,
              "uploaded_at": "2025-12-01T10:30:00Z"
            }
          ],
          "blueprint": {
            "blueprint_id": "bp_001",
            "blueprint_name": "AI Strategy Implementation",
            "steps": [
              {
                "step_number": 1,
                "step_title": "Kick-off Meeting",
                "step_description": "Intervista stakeholder chiave",
                "estimated_duration": "2 ore",
                "required_skills": ["Business Analysis", "AI Consulting"]
              },
              {
                "step_number": 2,
                "step_title": "Data Audit",
                "step_description": "Analisi dati aziendali disponibili",
                "estimated_duration": "1 giorno",
                "required_skills": ["Data Engineering"]
              }
            ],
            "total_estimated_time": "5 giorni",
            "created_at": "2025-12-01T11:00:00Z"
          },
          "variants": [],  // Per prodotti fisici (taglia, colore, ecc.)
          "tags": ["AI", "Strategy", "Consulting"],
          "is_active": true,
          "featured": false,
          "order": 1,
          "created_at": "2025-12-01T10:30:00Z",
          "updated_at": "2025-12-05T14:20:00Z"
        }
      ]
    }
  ],
  "metadata": {
    "total_categories": 3,
    "total_items": 12,
    "total_blueprints": 8,
    "last_updated": "2025-12-05T14:20:00Z"
  }
}
```

---

## 🔄 User Flow

```mermaid
graph TD
    A[Dashboard] -->|Click "Catalog"| B[catalog/manager.html]
    B -->|Click "+ Categoria"| C[Modale: Nuova Categoria]
    C -->|Submit| D[POST: create_category]
    D -->|Update MongoDB| E[Render Categoria]
    
    E -->|Click "+ Prodotto/Servizio"| F[catalog/item-editor.html]
    F -->|Upload Immagine| G[POST: upload_image]
    G -->|Google Cloud Storage| H[Return URL]
    H -->|Click "Genera Descrizione AI"| I[POST: generate_description]
    I -->|Google Gemini Vision| J[Analizza Immagine]
    J -->|Return Testo| K[Populate Textarea]
    K -->|Submit Form| L[POST: create_item]
    L -->|Update MongoDB| M[Render Item Card]
    
    M -->|Click "Blueprint"| N[catalog/blueprint-editor.html]
    N -->|Add Steps| O[Drag & Drop Interface]
    O -->|Submit| P[POST: save_blueprint]
    P -->|Update Item.blueprint| Q[Show Badge "Blueprint Ready"]
    
    style I fill:#f59e0b,color:#fff
    style J fill:#4cd964,color:#fff
```

---

## 🎨 Frontend Modules

### `catalog/manager.html`

**Vista Principale** del catalogo con:

- **Grid Categorie**: Card collassabili con icone personalizzate
- **Item List**: Grid prodotti/servizi per categoria
- **Quick Actions**:
  - ➕ Aggiungi Categoria
  - ➕ Aggiungi Item
  - 🔧 Edit/Delete
  - 📋 Blueprint Editor

**Struttura Card**:
```html
<div class="category-card">
  <div class="category-header">
    <div class="category-icon"><i class="fas fa-laptop-code"></i></div>
    <h3>Consulenza Digitale</h3>
    <span class="item-count">8 servizi</span>
    <i class="fas fa-chevron-down chevron"></i>
  </div>
  <div class="category-content">
    <div class="items-grid">
      <!-- Item cards here -->
    </div>
  </div>
</div>
```

---

### `catalog/item-editor.html`

**Form Creazione/Modifica Item** con sezioni:

#### 1. Info Base
- Nome item
- Tipo (Prodotto / Servizio)
- Descrizione (textarea)
- Tags

#### 2. Immagini
- Upload multiplo
- Selezione immagine primaria
- Preview grid

#### 3. AI Description Generator

**Flow**:
```javascript
// 1. Upload immagine
const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('vat_number', vatNumber);

const uploadResponse = await fetch(WEBHOOK_UPLOAD_IMAGE, {
  method: 'POST',
  body: formData
});

const { image_url } = await uploadResponse.json();

// 2. Genera descrizione AI
const aiResponse = await fetch(WEBHOOK_GENERATE_DESCRIPTION, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generate_description',
    image_url: image_url,
    item_type: 'service',
    category_name: 'Consulenza Digitale',
    api_key: userApiKey
  })
});

const { description } = await aiResponse.json();

// 3. Popola textarea
document.getElementById('item-description').value = description;
```

#### 4. Pricing
- Modello pricing (fisso / orario / variabile)
- Prezzo base
- Valuta
- SKU

#### 5. Blueprint Link
- Bottone "Crea/Modifica Blueprint"
- Badge status (✅ Completo / ⚠️ Mancante)

---

### `catalog/blueprint-editor.html`

**Editor Workflow Step-by-Step** per servizi.

**Funzionalità**:
- **Drag & Drop Steps** (Sortable.js)
- **Step Card** con:
  - Numero step
  - Titolo
  - Descrizione
  - Durata stimata
  - Skill richieste (tag)
- **Template Preimpostati**:
  - Consulenza Standard
  - Formazione Aziendale
  - Audit & Report
- **Export JSON** (per integrazioni)

**Esempio Step**:
```javascript
{
  "step_number": 1,
  "step_title": "Kick-off Meeting",
  "step_description": "Intervista stakeholder per comprendere obiettivi",
  "estimated_duration": "2 ore",
  "required_skills": ["Business Analysis", "Active Listening"],
  "deliverables": ["Meeting notes", "Obiettivi documento"]
}
```

---

## 🤖 AI Description Generator

### Prompt Template (Google Gemini Vision)

```javascript
const prompt = `
Analizza questa immagine e genera una descrizione commerciale professionale per:

TIPO: ${item_type === 'product' ? 'Prodotto' : 'Servizio'}
CATEGORIA: ${category_name}
CONTESTO AZIENDALE: PMI italiana

Genera:
1. Titolo accattivante (max 60 caratteri)
2. Descrizione breve (150-200 parole)
3. Benefici chiave (3-5 bullet point)
4. Call-to-action suggerita

Tono: Professionale ma accessibile
Stile: Orientato ai risultati business

Formato JSON:
{
  "title": "...",
  "description": "...",
  "benefits": ["...", "...", "..."],
  "cta": "..."
}
`;

const aiResponse = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-goog-api-key': userApiKey
  },
  body: JSON.stringify({
    contents: [{
      parts: [
        { text: prompt },
        { inline_data: { mime_type: 'image/jpeg', data: base64Image } }
      ]
    }]
  })
});
```

### Fallback Strategy

Se API rate limit superato:
1. **Template Generico** basato su categoria
2. **Notifica utente**: "Descrizione base generata. Personalizza manualmente."

---

## 📊 Metriche & Analytics

### KPIs Tracciati

- **Catalog Completion Score**: % item con descrizione completa
- **Blueprint Coverage**: % servizi con blueprint associato
- **AI Usage**: Conteggio descrizioni generate vs manuali
- **Popular Items**: Item più visti/condivisi

### Dashboard Query (MongoDB)

```javascript
db.CATALOG_COLLECTION.aggregate([
  { $match: { vat_number: '12345678901' } },
  { $project: {
      total_categories: { $size: '$categories' },
      total_items: {
        $sum: { $map: {
          input: '$categories',
          as: 'cat',
          in: { $size: '$$cat.items' }
        }}
      },
      ai_descriptions: {
        $sum: { $map: {
          input: '$categories',
          as: 'cat',
          in: {
            $size: {
              $filter: {
                input: '$$cat.items',
                as: 'item',
                cond: { $eq: ['$$item.item_description_source', 'ai_generated'] }
              }
            }
          }
        }}
      }
  }}
]);
```

---

## 🔐 Sicurezza

### Rate Limiting

```javascript
const RATE_LIMITS = {
  ai_description: { max: 10, window: '1h' },  // 10 descrizioni AI/ora
  image_upload: { max: 50, window: '1d' },   // 50 upload/giorno
  catalog_update: { max: 100, window: '1h' }  // 100 modifiche/ora
};
```

### Validazione Immagini

- **Max Size**: 5MB
- **Formati**: JPG, PNG, WebP
- **Dimensioni**: Min 400x400px, Max 4000x4000px
- **Content-Type Check**: MIME validation server-side

---

## 🛠️ Troubleshooting

### Errori Comuni

**1. "AI Description Failed"**
- **Causa**: Rate limit Google Gemini superato
- **Fix**: Attendere 1h o usare descrizione manuale
- **Prevenzione**: Monitorare `ai_usage_count` nel profilo owner

**2. "Immagine non caricata"**
- **Causa**: File troppo grande o formato non supportato
- **Fix**: Comprimere immagine (TinyPNG) o convertire in JPG

**3. "Blueprint non salvato"**
- **Causa**: Item non esistente in MongoDB
- **Fix**: Verificare `item_id` corretto e che item sia stato salvato prima

**4. "Categoria vuota non si elimina"**
- **Causa**: MongoDB impedisce eliminazione se `items.length > 0`
- **Fix**: Eliminare prima tutti gli item, poi la categoria

---

## 🚀 Roadmap Catalog

### Q2 2025
- [ ] **Varianti Prodotti**: Taglia, colore, materiale con stock tracking
- [ ] **Import/Export**: CSV/Excel per bulk operations
- [ ] **Public Catalog Page**: Vetrina web pubblica con URL personalizzato
- [ ] **Integration E-commerce**: SumUp, Stripe per vendita diretta

### Q3 2025
- [ ] **AI Price Suggestion**: Analisi mercato per pricing ottimale
- [ ] **Blueprint Templates Marketplace**: Condivisione workflow tra utenti
- [ ] **3D Product Viewer**: Integrazione Sketchfab per modelli 3D

---

## 📁 Struttura File

```
catalog/
├── manager.html              # Dashboard principale
├── item-editor.html          # Form create/edit item
├── blueprint-editor.html     # Workflow step editor
├── category-modal.html       # Modale crea categoria
├── js/
│   ├── catalog-logic.js      # Business logic catalog
│   ├── blueprint-logic.js    # Logic blueprint
│   ├── ai-generator.js       # AI description handler
│   └── image-uploader.js     # Upload manager
└── css/
    └── catalog-style.css     # Stili dedicati
```

---

## 📚 Documentazione Correlata

- [01-OVERVIEW.md](./01-OVERVIEW.md) - Panoramica progetto
- [03-MODULES.md](./03-MODULES.md) - Tutti i moduli
- [08-HONEYPOT.md](./08-HONEYPOT.md) - Knowledge base correlato
- [09-API-REFERENCE.md](./09-API-REFERENCE.md) - Webhook N8N
- [11-AI-INTEGRATION.md](./11-AI-INTEGRATION.md) - Google Gemini

---

<div align="center">

**Catalog Manager sviluppato da [TrinAI](https://www.trinai.it)**

*Transform products into experiences*

[⬆ Torna alla documentazione](../README.md)

</div>