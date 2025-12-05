# 🚀 SiteBoS MiniApp
### AI Business Operating System for Telegram

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=flat&logo=telegram&logoColor=white)](https://t.me/TrinAi_SiteBoS_bot)
[![Version](https://img.shields.io/badge/version-5.0.0-blue.svg)](https://github.com/SimonAiIT/SiteBoS-MiniApp/releases)
[![Company](https://img.shields.io/badge/by-TrinAI-blueviolet.svg)](https://www.trinai.it)

> **Enterprise-grade business management platform living entirely inside Telegram.** 
> Zero app installs. Zero complexity. 100% operational control.

**Developed by [Trinacria Artificial Intelligence S.r.l.](https://www.trinai.it)** - Startup Innovativa Italiana

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
- [License](#-license)
- [Support](#-support)

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

---

## 📚 Module Documentation

### 🎭 HoneyPot Editor

AI-powered knowledge base + anti-spam form configuration.

**Key Features**:
- Company identity management
- Multi-language content
- Asset library (logo, photos, documents)
- Honeypot security fields

### 📦 Catalog Manager

Hierarchical product/service catalog with AI-generated descriptions.

**Structure**:
```
Category (Level 1)
└── Products/Services (Level 2)
    ├── AI-generated description
    ├── Pricing & SKU
    └── Operational blueprint
```

### 📅 Agenda System

Week-view scheduler with:
- Multi-operator booking
- 30-min time slots (09:00-19:00)
- Conflict detection
- Calendar export (Google/iCal)

### 🎨 Marketing Hub

AI content generation:
- Blog post drafting (1000 credits/post)
- SEO optimization
- Multi-channel export

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

---

## 🗺️ Roadmap

### Q1 2025
- [x] HoneyPot Editor v2.0
- [x] AI Catalog Generator
- [x] Blueprint Workflow Editor
- [x] Agenda System
- [ ] Payment Gateway Integration

### Q2 2025
- [ ] CRM Module
- [ ] Invoice Generator
- [ ] Analytics Dashboard
- [ ] Mobile App Wrapper

### Q3 2025
- [ ] Multi-user Roles
- [ ] Webhook Marketplace
- [ ] White-label Licensing

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

## 🙏 Acknowledgments

- **Google Gemini Team** - AI API platform
- **N8N Community** - Workflow automation
- **Telegram** - Mini Apps ecosystem
- **Our Clients** - Beta testers and pioneers

---

<div align="center">

**Developed with ❤️ in Sicily by [TrinAI](https://www.trinai.it)**

*Transforming SMEs with Conversational AI*

[⬆ Back to Top](#-sitebos-miniapp)

</div>
