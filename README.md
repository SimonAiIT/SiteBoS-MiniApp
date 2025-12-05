# 🚀 SiteBoS MiniApp
### AI Business Operating System for Telegram

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=flat&logo=telegram&logoColor=white)](https://t.me/TrinAi_SiteBoS_bot)
[![Version](https://img.shields.io/badge/version-5.0.0-blue.svg)](https://github.com/SimonAiIT/SiteBoS-MiniApp/releases)

> **Enterprise-grade business management platform living entirely inside Telegram.** 
> Zero app installs. Zero complexity. 100% operational control.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Module Documentation](#-module-documentation)
- [API Reference](#-api-reference)
- [Security & Compliance](#-security--compliance)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**SiteBoS** (Site Business Operating System) transforms Telegram into a complete business management suite for SMEs, freelancers, and professional services. 

### What Makes SiteBoS Unique?

- **🔐 BYOK (Bring Your Own Key)**: You control your Google Gemini API key - zero vendor lock-in
- **🤖 AI-First Design**: Automated document analysis, content generation, and workflow automation
- **📱 Zero Installation**: Runs 100% inside Telegram Mini Apps - no downloads, no updates
- **✅ GDPR Compliant**: Built-in privacy policy generator, consent management, and data portability
- **🌍 Multi-Language**: 6 languages supported (IT, EN, FR, DE, ES, PT)
- **⚡ Serverless**: N8N-powered backend - scales infinitely, costs nothing at rest

---

## ✨ Key Features

### 🎭 **HoneyPot Editor**
AI-powered knowledge base + anti-spam system
- Visual form builder with drag-and-drop
- Automated spam trap field generation
- Multi-language content management
- Asset library (logos, photos, documents)

### 📦 **Catalog Manager**
Hierarchical product/service catalog with AI enrichment
- Category tree structure
- Automatic product description generation from images
- Operational blueprint editor (workflow step-by-step)
- Pricing and SKU management

### 📅 **Agenda System**
Week-view appointment scheduler
- Multi-operator booking
- Conflict detection
- Google Calendar / iCal export
- Telegram notifications

### 👥 **Team Manager**
Operator roles and skill assignment
- Role-based access control
- Skill tags for smart assignment
- Availability scheduling

### 📊 **Dashboard**
Real-time business metrics
- Profile completion score
- Credit balance tracking
- Quick action cards
- Gatekeeper system (progressive unlock)

### 🧾 **Legal Generator**
Auto-generated compliance documents
- Privacy Policy (GDPR-compliant)
- Terms & Conditions
- Data Processing Agreement (DPA)
- Processor appointment letters

### 🎨 **Marketing Hub** (Knowledge Base)
Content generation for social media
- AI blog post drafting (1000 credits)
- Knowledge fragment management
- Multi-channel export

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────┐
│                  TELEGRAM CLIENT                     │
│         (iOS/Android/Desktop/Web)                    │
└──────────────────┬──────────────────────────────────┘
                   │ Telegram WebApp SDK
                   ▼
┌─────────────────────────────────────────────────────┐
│              FRONTEND LAYER                          │
│  • HTML5/CSS3/Vanilla JS                             │
│  • Client-side routing                               │
│  • sessionStorage state management                   │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS POST (Webhooks)
                   ▼
┌─────────────────────────────────────────────────────┐
│          BACKEND LAYER (N8N Orchestration)           │
│  • Self-hosted N8N instance                          │
│  • 6+ dedicated webhooks                             │
│  • Async workflow orchestration                      │
└──────────────────┬──────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
┌──────────────────┐  ┌─────────────────┐
│   MONGODB        │  │   GEMINI API    │
│   (Database)     │  │   (Google AI)   │
│   • Owners       │  │   • Vision      │
│   • Honeypots    │  │   • Text Gen    │
│   • Catalog      │  │   • Embeddings  │
│   • Blueprints   │  │                 │
└──────────────────┘  └─────────────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│        TELEGRAM BOT API                       │
│   • Real-time notifications                   │
│   • Multi-language messages                   │
│   • Inline keyboards                          │
└──────────────────────────────────────────────┘
```

### Data Flow Example: Product Creation

```
[User uploads product image] 
    ↓
[Frontend: catalog/edit-product.html]
    ↓ POST /webhook/31f89350... (action: SAVE)
[N8N: ProductManagement workflow]
    ├─→ [Google Gemini Vision API] → Product description
    ├─→ [N8N Code Node] → Generate SKU + metadata
    ├─→ [MongoDB: servicecatalog] → Save catalog item
    ├─→ [MongoDB: processblueprints] → Save workflow
    └─→ [Telegram Bot API] → Notify owner
    ↓
[Response: {status: 'success', productId: 'SVC00000042'}]
    ↓
[Frontend updates UI + shows success popup]
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|----------|
| HTML5 | Structure | - |
| CSS3 (Custom Variables) | Styling (Glassmorphism design) | - |
| Vanilla JavaScript (ES6+) | Logic | - |
| Telegram WebApp SDK | Telegram integration | Latest |
| Font Awesome | Icons | 6.4.0 |
| Google Fonts (Inter) | Typography | - |
| Sortable.js | Drag & drop | 1.15.0 |

### Backend

| Technology | Purpose |
|------------|----------|
| N8N | Workflow orchestration |
| MongoDB | NoSQL database (3 databases) |
| Google Gemini API | AI text/vision generation |
| Telegram Bot API | Notifications & auth |

### Integrations (Planned)

- **SumUp** (POS payments)
- **Revolut Business** (Banking)
- **Fatture in Cloud** (E-invoicing)

---

## 🚀 Getting Started

### Prerequisites

1. **Telegram Account** (obviously)
2. **Google Gemini API Key** (Free tier: 15 req/min, 1500 req/day)  
   👉 Get it here: https://makersuite.google.com/app/apikey
3. **N8N Instance** (self-hosted or cloud)  
   👉 Guide: https://docs.n8n.io/hosting/
4. **MongoDB Atlas** (Free tier M0 cluster)  
   👉 https://www.mongodb.com/cloud/atlas/register

### Installation

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/SimonAiIT/SiteBoS-MiniApp.git
cd SiteBoS-MiniApp
```

#### 2️⃣ Configure Webhooks

Update webhook URLs in each `*_logic.js` file:

```javascript
// Example: onboarding_logic.js
const WEBHOOK_URL = "https://YOUR-N8N-INSTANCE.com/webhook/YOUR-WEBHOOK-ID";
```

**Webhooks to configure:**

| File | Webhook ID (Example) | Purpose |
|------|---------------------|----------|
| `onboarding_logic.js` | `1211a23e-...` | User onboarding + KYC |
| `edit_owner_logic.js` | `83acc670-...` | Owner data updates |
| `honeypot_editor_logic.js` | `35667aed-...` | Honeypot config |
| `catalog/catalog_logic.js` | `0fff7fa2-...` | Catalog CRUD |
| `catalog/edit-product_logic.js` | `31f89350-...` | Product AI generation |
| `agenda/agenda_logic.js` | `AGENDA_WEBHOOK_ID` | Appointment booking |

#### 3️⃣ Deploy Frontend

**Option A: GitHub Pages (Free)**

1. Enable GitHub Pages in repo settings
2. Source: `main` branch, `/` (root)
3. Access at: `https://YOUR-USERNAME.github.io/SiteBoS-MiniApp/`

**Option B: Custom Domain**

1. Build static site (no build step needed)
2. Upload to any static host (Netlify, Vercel, Cloudflare Pages)
3. Point domain CNAME to host

#### 4️⃣ Import N8N Workflows

1. Download workflow JSONs from `/n8n-workflows/` (if available)
2. Import each into your N8N instance
3. Update MongoDB credentials
4. Update Telegram Bot token
5. Activate workflows

#### 5️⃣ Configure Telegram Bot

```bash
# Create bot via @BotFather
/newbot
# Name: SiteBoS (Your Company)
# Username: your_sitebos_bot

# Save token
TOKEN="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"

# Set Mini App URL
curl -X POST https://api.telegram.org/bot$TOKEN/setChatMenuButton \
  -H "Content-Type: application/json" \
  -d '{
    "menu_button": {
      "type": "web_app",
      "text": "Open SiteBoS",
      "web_app": {
        "url": "https://your-domain.com/index.html"
      }
    }
  }'
```

#### 6️⃣ Test Onboarding

1. Open bot in Telegram
2. Click "Open SiteBoS" menu button
3. Complete 3-step onboarding:
   - Upload ID document
   - Fill company data
   - Accept terms
4. Access Dashboard

---

## 📚 Module Documentation

### 🎭 HoneyPot Editor

**File**: `honeypot_editor.html` + `honeypot_editor_logic.js`

**Purpose**: Central knowledge base + anti-spam form configuration

**Features**:
- **Identity Section**: Company bio, mission, values
- **Services Showcase**: List key offerings
- **Assets Manager**: Upload logo, photos, PDF docs
- **Offer Text**: Main value proposition
- **Security Fields**: Honeypot trap fields (hidden inputs)

**API Endpoint**: `POST /webhook/35667aed-...`

**Actions**:
- `GET`: Retrieve honeypot config
- `SAVE`: Update config + assets
- `ANALYZE_ASSET`: AI analysis of uploaded images

**Example Request**:

```json
{
  "action": "SAVE",
  "token": "uuid-access-token",
  "vat": "IT12345678901",
  "payload": {
    "identity": {
      "businessname": "Acme Corp",
      "sector": "consulting",
      "description": "AI consulting for SMEs"
    },
    "assets": {
      "logo": {
        "url": "https://...",
        "mimetype": "image/png"
      }
    }
  }
}
```

### 📦 Catalog Manager

**Files**: 
- `catalog/catalog.html` (List view)
- `catalog/edit-product.html` (Product editor)
- `catalog/edit-blueprint.html` (Workflow editor)

**Structure**: Hierarchical 2-level catalog

```
Category (Level 1)
└── Products/Services (Level 2)
    ├── SKU: SVC00000001
    ├── Description (AI-generated)
    ├── Pricing
    ├── Blueprint (Operational workflow)
    └── Knowledge Fragment
```

**Blueprint Editor**: Drag-and-drop workflow designer

```
Stage 1: Discovery
├── Step 1: Initial Meeting (30 min)
│   ├── Instructions: "Meet client, understand needs"
│   ├── QC: "Check if requirements doc signed"
│   └── Skills: [CONSULTANT, SALES]
└── Step 2: Technical Assessment (60 min)
    └── ...
```

**Example Blueprint JSON**:

```json
{
  "blueprint_description": "Audit Sicurezza IT",
  "stages": [
    {
      "stage_id": "STAGE_01",
      "stage_name": "Analisi Preliminare",
      "stage_order": 1,
      "steps": [
        {
          "step_id": "STEP_01_01",
          "step_name": "Kick-off Meeting",
          "step_order": 1,
          "estimated_time_minutes": 30,
          "instructions": "Presentare team, raccogliere info cliente",
          "quality_check": {
            "check_description": "Verifica firma NDA"
          },
          "resources_needed": {
            "labor": {
              "required_skill_tags": ["PROJECT_MANAGER", "SALES"]
            }
          },
          "logistics_flags": {
            "requires_wip": false,
            "requires_finished": false
          }
        }
      ]
    }
  ]
}
```

### 📅 Agenda System

**Files**: `agenda/agenda.html` + `agenda_logic.js`

**View**: Week-view calendar (mobile-optimized)

**Features**:
- **Time Slots**: 30-minute intervals (09:00 - 19:00)
- **Multi-Operator Filtering**: Show all or specific operator
- **Conflict Detection**: Prevent double-booking
- **Export**: Google Calendar, iCal, Webhook URL

**Booking Flow**:

1. Click on empty time slot
2. Modal opens with form:
   - Operator (dropdown)
   - Client name/email/phone
   - Service (from catalog)
   - Notes
   - "Send Telegram notification" checkbox
3. Submit → Validates conflicts → Saves to DB → Notifies via Telegram

**API Actions**:

```json
{
  "action": "GET_AGENDA_DATA",
  "vat_number": "IT12345",
  "week_start": "2025-12-02",
  "week_end": "2025-12-08"
}
```

Response:

```json
{
  "operators": [{"id": "OP001", "name": "Mario Rossi"}],
  "services": [{"id": "SRV001", "name": "Consulenza"}],
  "appointments": [
    {
      "id": "APT001",
      "date": "2025-12-04",
      "time": "10:00",
      "operator_id": "OP001",
      "client_name": "Cliente ABC",
      "service_name": "Consulenza AI"
    }
  ]
}
```

### 🎨 Marketing Hub (Knowledge Base)

**Files**: `knowledge_base/knowledge.html` + `deployblog.html`

**Purpose**: AI-powered content generation

**Workflow**:

1. Edit knowledge fragments (company info, services, FAQ)
2. Click "Deploy Blog" on fragment
3. Confirm 1000-credit spend
4. AI generates:
   - SEO-optimized title
   - 800-1200 word article
   - Meta description
   - Featured image suggestion
5. Review draft
6. Publish to blog (external integration)

**Cost**: 1000 AI credits per post

---

## 🔌 API Reference

### Webhook Base URL

```
https://trinai.api.workflow.dcmake.it/webhook/{WEBHOOK_ID}
```

### Authentication

All requests (except initial onboarding) require:

```json
{
  "token": "uuid-access-token",
  "vat_number": "IT12345678901",
  "chat_id": "123456789"
}
```

**Token Generation**: 
- Created during onboarding
- Stored in MongoDB `ownersessions.messages[0].data.accesstoken`
- Never expires (revoke by deleting session)

### Common Actions

#### Get Owner Data

```json
{
  "action": "get_owner_data_by_token",
  "token": "abc-123"
}
```

Response:

```json
{
  "ownerdata": {
    "ragionesociale": "Acme Corp",
    "vatnumber": "IT12345678901",
    "creditsbalance": 5000,
    "operators": [...]
  }
}
```

#### Save Owner Data

```json
{
  "action": "save_owner_data_by_token",
  "token": "abc-123",
  "ownerData": { /* updated fields */ }
}
```

#### Analyze Document (KYC)

```json
{
  "action": "analyze_id",
  "user_id": "123456789",
  "file_data": "base64-image-string",
  "mime_type": "image/jpeg",
  "gemini_key": "AIzaSy..."
}
```

Response (success):

```json
{
  "status": "success",
  "data": {
    "name": "Mario",
    "surname": "Rossi",
    "fiscal_code": "RSSMRA80A01H501U",
    "dateofbirth": "1980-01-01"
  }
}
```

Response (error):

```json
{
  "status": "error",
  "data": {
    "error": "invalid_document"
  }
}
```

### Error Codes

| Code | Meaning | Resolution |
|------|---------|------------|
| `403` | Invalid/missing token | Re-authenticate |
| `404` | Resource not found | Check IDs |
| `409` | Conflict (e.g., VAT already exists) | Use different VAT or update |
| `500` | Server error | Check N8N logs |
| `GHOST_USER` | Token valid but no owner data | Contact support |

---

## 🔐 Security & Compliance

### GDPR Compliance

✅ **Data Minimization**: Only essential data collected  
✅ **Consent Management**: Triple-gate (Privacy + Terms + AI Analysis)  
✅ **Right to Access**: `get_owner_data_by_token` endpoint  
✅ **Right to Erasure**: `reset.html` wipes all data  
✅ **Data Portability**: JSON export available  
✅ **Audit Logging**: All AI analyses logged with timestamps  

### BYOK (Bring Your Own Key)

**Why?**
- You control API costs
- No vendor lock-in
- Data privacy (API calls direct to Google)
- Transparent usage tracking

**How It Works**:

```
[User enters Gemini Key] 
    ↓
[Stored ONLY in MongoDB, encrypted at rest]
    ↓
[Frontend passes key with each AI request]
    ↓
[N8N forwards to Gemini API]
    ↓
[Response returned to user]
```

**Key Storage**: `ownersessions.messages[0].data.geminikey`

### Security Best Practices

- ✅ HTTPS-only communication
- ✅ No sensitive data in localStorage (only sessionStorage)
- ✅ Token-based auth (no passwords)
- ✅ Input sanitization on backend
- ✅ Rate limiting via N8N (15 req/min per user)
- ✅ MongoDB encryption at rest (Atlas default)

---

## 🗺️ Roadmap

### Q1 2025
- [x] ✅ HoneyPot Editor v2.0
- [x] ✅ Catalog with AI generation
- [x] ✅ Blueprint Editor (drag-drop)
- [x] ✅ Agenda System (week-view)
- [ ] 🚧 Payment Gateway (Stripe)
- [ ] 🚧 Email Marketing Integration

### Q2 2025
- [ ] 📋 CRM Module (Lead tracking)
- [ ] 📋 Invoice Generator (Fatture in Cloud)
- [ ] 📋 Analytics Dashboard (Charts.js)
- [ ] 📋 Mobile App (React Native wrapper)

### Q3 2025
- [ ] 📋 Multi-user Roles (Admin/Operator/Viewer)
- [ ] 📋 Webhook Marketplace (3rd party integrations)
- [ ] 📋 White-label Licensing

---

## 🤝 Contributing

We welcome contributions! Here's how:

### Reporting Bugs

1. Check [existing issues](https://github.com/SimonAiIT/SiteBoS-MiniApp/issues)
2. Open new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/logs

### Feature Requests

Open an issue with tag `enhancement` and describe:
- **Problem**: What pain point does this solve?
- **Solution**: Proposed implementation
- **Alternatives**: Other approaches considered

### Pull Requests

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

**Code Style**:
- Use `'use strict';` at top of JS files
- 2-space indentation
- Descriptive variable names (`currentWeekStart` not `cws`)
- Comments for complex logic only

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 SimonAI Technologies

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 💬 Support

- **Telegram Support Bot**: [@TrinAiTecSupportbot](https://t.me/TrinAiTecSupportbot)
- **Email**: support@trinai.tech
- **Documentation**: [Wiki](https://github.com/SimonAiIT/SiteBoS-MiniApp/wiki)
- **Discord**: [Join Community](https://discord.gg/sitebos)

---

## 🙏 Acknowledgments

- **Google Gemini Team** - For the incredible AI API
- **N8N Community** - Best workflow automation tool
- **Telegram** - For the Mini Apps platform
- **Contributors** - See [CONTRIBUTORS.md](CONTRIBUTORS.md)

---

<div align="center">

**Made with ❤️ by [SimonAI Technologies](https://github.com/SimonAiIT)**

[⬆ Back to Top](#-sitebos-miniapp)

</div>
