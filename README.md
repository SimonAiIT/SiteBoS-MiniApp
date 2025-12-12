# 🚀 SiteBoS MiniApp
### AI Business Operating System for Telegram

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=flat&logo=telegram&logoColor=white)](https://t.me/TrinAi_SiteBoS_bot)
[![Version](https://img.shields.io/badge/version-5.0.0-blue.svg)](https://github.com/SimonAiIT/SiteBoS-MiniApp/releases)
[![Company](https://img.shields.io/badge/by-TrinAI-blueviolet.svg)](https://www.trinai.it)
[![Docs](https://img.shields.io/badge/docs-complete-brightgreen.svg)](./docs)

> **Enterprise-grade business management platform living entirely inside Telegram.** 
> Zero app installs. Zero complexity. 100% operational control.

**Developed by [Trinacria Artificial Intelligence S.r.l.](https://www.trinai.it)** - Startup Innovativa Italiana

---

## 📚 **DOCUMENTAZIONE COMPLETA → [/docs](./docs)**

⚡ **Per AI e developer**: Inizia da **[docs/01-OVERVIEW.md](./docs/01-OVERVIEW.md)**  
🧠 **Sistema Soft Skills**: Vedi **[docs/04-SOFT-SKILLS.md](./docs/04-SOFT-SKILLS.md)**  
📝 **Index completo**: **[docs/README.md](./docs/README.md)**  

---

## 📌 Quick Links

- 📄 **[Documentazione Tecnica Completa](./docs)** - 17 guide dettagliate
- 🎭 **[HoneyPot Editor](./honeypot)** - Knowledge base + anti-spam
- 📦 **[Catalog Manager](./catalog)** - AI-powered product catalog
- 📅 **[Agenda System](./agenda)** - Multi-operator booking
- 👥 **[Team Manager](./team)** - Operator profiles & skills
- 🧠 **[Soft Skills Assessment](./softskill)** - 150-question behavioral analysis
- 🎨 **[Marketing Hub](./marketing)** - AI content generation
- 🧾 **[Legal Generator](./legal)** - GDPR compliance docs

---

## 🎯 Overview

**SiteBoS** transforms Telegram into a complete business management suite for SMEs, freelancers, and professional services.

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
- Stakeholder behavioral profiles
- Availability scheduling

### 🧠 **Soft Skills Assessment**
150-question behavioral analysis
- 4 thematic modules (Io Interiore, Interpersonale, Leadership, Etica)
- AI-generated personality archetypes
- Personalized training video recommendations
- Learning history tracking with engagement levels
- **NEW (Dec 2025)**: Collapsible learning history cards

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

### 🎨 **Marketing Hub**
Content generation for social media
- AI blog post drafting (1000 credits)
- Knowledge fragment management
- Multi-channel export

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  TELEGRAM CLIENT                     │
│         (iOS/Android/Desktop/Web)                    │
└──────────────────┴──────────────────────────────────┘
                   │ Telegram WebApp SDK
                   ▼
┌─────────────────────────────────────────────────────┐
│              FRONTEND LAYER                          │
│  • HTML5/CSS3/Vanilla JS                             │
│  • Client-side routing                               │
│  • sessionStorage state management                   │
└──────────────────┴──────────────────────────────────┘
                   │ HTTPS POST (Webhooks)
                   ▼
┌─────────────────────────────────────────────────────┐
│          BACKEND LAYER (N8N Orchestration)           │
│  • Self-hosted N8N instance                          │
│  • 6+ dedicated webhooks                             │
│  • Async workflow orchestration                      │
└──────────────────┴──────────────────────────────────┘
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

📚 **Per dettagli approfonditi**: [docs/02-ARCHITECTURE.md](./docs/02-ARCHITECTURE.md)

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

### ⚠️ Important Notice

**This is proprietary software developed by Trinacria Artificial Intelligence S.r.l.**

The source code is publicly visible for **transparency and evaluation purposes only**. 

**To use SiteBoS in production:**

1️⃣ **Contact TrinAI** for a commercial license:  
   📧 info@trinai.it | 🌐 [www.trinai.it](https://www.trinai.it)

2️⃣ **Free Trial Available**: Request a demo instance  
   📞 [@TrinAiTecSupportbot](https://t.me/TrinAiTecSupportbot)

3️⃣ **Funding Opportunities**: TrinAI assists with **Digit Imprese** grant applications (up to 80% coverage)

---

### Prerequisites (For Evaluation/Development)

1. **Telegram Account**
2. **Google Gemini API Key** (Free tier: 15 req/min, 1500 req/day)  
   👉 https://makersuite.google.com/app/apikey
3. **N8N Instance** (self-hosted or cloud)  
   👉 https://docs.n8n.io/hosting/
4. **MongoDB Atlas** (Free tier M0 cluster)  
   👉 https://www.mongodb.com/cloud/atlas/register

📚 **Guida completa**: [docs/12-DEPLOYMENT.md](./docs/12-DEPLOYMENT.md)

---

## 🔐 Security & Compliance

### GDPR Compliance

✅ Data Minimization  
✅ Consent Management (triple-gate)  
✅ Right to Access & Erasure  
✅ Audit Logging  

### BYOK (Bring Your Own Key)

Users control their own Google Gemini API keys:
- No vendor lock-in
- Transparent cost tracking
- Direct API calls (no proxy)
- Stored encrypted in MongoDB

### Security Measures

- HTTPS-only communication
- Token-based authentication
- Role-based access control
- Rate limiting (15 req/min)
- MongoDB encryption at rest

📚 **Approfondimenti**: [docs/13-SECURITY.md](./docs/13-SECURITY.md)

---

## 🗺️ Roadmap

### Q1 2025 ✅
- [x] HoneyPot Editor v2.0
- [x] AI Catalog Generator
- [x] Blueprint Workflow Editor
- [x] Agenda System
- [x] Soft Skills Assessment (4 moduli)
- [x] Team Manager con profili stakeholder

### Q2 2025 🚧
- [ ] CRM Module
- [ ] Invoice Generator
- [ ] Analytics Dashboard
- [ ] Payment Gateway Integration

### Q3 2025 📋
- [ ] Multi-user Roles
- [ ] Webhook Marketplace
- [ ] White-label Licensing

📚 **Roadmap dettagliata**: [docs/01-OVERVIEW.md#roadmap](./docs/01-OVERVIEW.md#roadmap)

---

## 📝 Recent Updates (December 2025)

### Soft Skills Module
- ✅ **Learning History**: Card collassabili con chevron animato
- ✅ **Complete Profile**: Score badge spostato in alto a destra (rimossa stats card)
- ✅ **Video Player**: Sistema di riflessione con engagement tracking
- ✅ **Team Profile**: Profili stakeholder con learning history integrata

### Documentation
- ✅ **New `/docs` folder**: 17 guide tecniche strutturate
- ✅ **01-OVERVIEW.md**: Panoramica progetto completa
- ✅ **04-SOFT-SKILLS.md**: Sistema soft skills documentato al 100%
- ✅ **README.md**: Index documentazione con quick links

📚 **Changelog completo**: [docs/17-CHANGELOG.md](./docs/17-CHANGELOG.md)

---

## 📚 Documentation Structure

```
docs/
├── README.md              # Index documentazione
├── 01-OVERVIEW.md         # ✅ Panoramica generale
├── 02-ARCHITECTURE.md     # 📋 Architettura dettagliata
├── 03-MODULES.md          # 📋 Tutti i moduli
├── 04-SOFT-SKILLS.md      # ✅ Sistema soft skills
├── 05-TEAM-MANAGER.md     # 📋 Team & stakeholder
├── 06-CATALOG.md          # 📋 Catalog manager
├── 07-AGENDA.md           # 📋 Sistema calendario
├── 08-HONEYPOT.md         # 📋 Knowledge base
├── 09-API-REFERENCE.md    # 📋 Webhook N8N
├── 10-DATABASE-SCHEMA.md  # 📋 Schema MongoDB
├── 11-AI-INTEGRATION.md   # 📋 Google Gemini
├── 12-DEPLOYMENT.md       # 📋 Deploy guide
├── 13-SECURITY.md         # 📋 Security best practices
├── 14-MONITORING.md       # 📋 Metriche & logging
├── 15-CUSTOMIZATION.md    # 📋 White-label
├── 16-EXTENSIONS.md       # 📋 Plugin system
└── 17-CHANGELOG.md        # 📋 Version history

Legenda:
✅ Completo  │  🚧 In Progress  │  📋 Planned
```

---

## 💬 Support

### Official Channels

- **📧 Email**: info@trinai.it
- **🌐 Website**: [www.trinai.it](https://www.trinai.it)
- **📞 Telegram Support**: [@TrinAiTecSupportbot](https://t.me/TrinAiTecSupportbot)
- **🔗 LinkedIn**: [Trinacria AI](https://linkedin.com/company/trinai)

### Business Information

**Trinacria Artificial Intelligence S.r.l.**  
Startup Innovativa Italiana  
P.IVA: IT07335120825  
Sede: Sicilia, Italia  

---

## 📄 License

**Proprietary Software** © 2025 Trinacria Artificial Intelligence S.r.l.

All rights reserved. See [LICENSE](LICENSE) for full terms.

**Summary**:
- ❌ No commercial use without written authorization
- ❌ No redistribution or modification
- ✅ Source code visible for evaluation/transparency
- ✅ Bug reports and suggestions welcome

**For licensing inquiries:**  
📧 info@trinai.it | 🌐 [www.trinai.it](https://www.trinai.it)

---

## 🙏 Acknowledgments

- **Google Gemini Team** - AI API platform
- **N8N Community** - Workflow automation
- **Telegram** - Mini Apps ecosystem
- **Our Clients** - Beta testers and pioneers

---

<div align="center">

**Developed with ❤️ in Sicily by [TrinAI](https://www.trinai.it)**

*Transforming SMEs with Conversational AI*

---

### 📚 Quick Start for AI

**Reading this for the first time?**

1. Start with **[docs/01-OVERVIEW.md](./docs/01-OVERVIEW.md)** (5 min)
2. Deep dive into **[docs/04-SOFT-SKILLS.md](./docs/04-SOFT-SKILLS.md)** (10 min)
3. Explore `/softskill/` source code
4. Check **[docs/README.md](./docs/README.md)** for complete index

---

[⬆ Back to Top](#-sitebos-miniapp)

</div>