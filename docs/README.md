# 📚 SiteBoS - Documentazione Completa

> **🎯 Questa cartella contiene TUTTA la documentazione tecnica del progetto**  
> Pensata per essere letta da AI, developer e stakeholder.

---

## 🗂️ Indice Documenti

### 🟢 Getting Started & Core

1. **[01-OVERVIEW.md](./01-OVERVIEW.md)** ✅  
   📝 Panoramica generale, architettura, modelli economici, roadmap  
   🎯 **Inizia da qui** se è la prima volta che leggi il progetto

2. **[02-ARCHITECTURE.md](./02-ARCHITECTURE.md)** 📋  
   🏛️ Architettura dettagliata: frontend, backend, database schema, flussi dati

3. **[03-ONBOARDING.md](./03-ONBOARDING.md)** ✅  
   🚀 **Sistema Onboarding 5-step** - Welcome flow, GDPR consent, credit setup  
   ✅ **COMPLETO** - Progress bar, autosave, metriche drop-off

### 🔵 Moduli Applicativi

4. **[04-SOFT-SKILLS.md](./04-SOFT-SKILLS.md)** ✅  
   🧠 **Sistema Soft Skills Assessment** - Questionario 150 domande, profilo AI, video formativi, learning history  
   ✅ **COMPLETO** - Include modifiche recenti (card collassabili, score badge)

5. **[05-TEAM-MANAGER.md](./05-TEAM-MANAGER.md)** 📋  
   👥 Gestione operatori, profili stakeholder, skill assignment

6. **[06-CATALOG.md](./06-CATALOG.md)** ✅  
   📦 **Catalog Manager** - Categorie, prodotti, AI descriptions, blueprint operativi  
   ✅ **COMPLETO** - Schema MongoDB, AI Vision, pricing & SKU

7. **[07-AGENDA.md](./07-AGENDA.md)** 🚧  
   📅 **Smart Resource Orchestrator** - Gestione risorse a 3 layer, calendario AI-powered  
   🚧 **IN PROGRESS** (75%) - Fase A/B/C complete, Fase D (Calendar View) in roadmap

8. **[08-HONEYPOT.md](./08-HONEYPOT.md)** ✅  
   🎭 **Knowledge Base + Anti-Spam** - Asset library, form builder, honeypot security  
   ✅ **COMPLETO** - Upload flow, spam detection, multi-lingua

9. **[09-LEGAL-PROCESSOR.md](./09-LEGAL-PROCESSOR.md)** ✅  
   🧾 **Legal Document Generator** - Privacy Policy, T&C, DPA, nomina processore  
   ✅ **COMPLETO** - GDPR compliance, AI template engine, PDF export

10. **[10-SPONSOR.md](./10-SPONSOR.md)** ✅  
    🎁 **Sponsor Carousel** - Pacchetti crediti, partner, analytics  
    ✅ **COMPLETO** - Auto-scroll, A/B testing, conversion tracking

### 🟡 Backend & Infrastructure

11. **[11-DATABASE-SCHEMA.md](./11-DATABASE-SCHEMA.md)** 📋  
    🗄️ Schema MongoDB (OWNERS, HONEYPOTS, CATALOG)

12. **[12-AI-INTEGRATION.md](./12-AI-INTEGRATION.md)** 📋  
    🤖 Google Gemini API: prompt engineering, rate limits, fallback strategies

### 🟣 Deploy & Operations

13. **[13-DEPLOYMENT.md](./13-DEPLOYMENT.md)** 📋  
    🚀 Guida deploy: Frontend setup, MongoDB config, Telegram Bot registration

14. **[14-SECURITY.md](./14-SECURITY.md)** 📋  
    🔐 Best practices sicurezza: GDPR, auth, rate limiting, encryption

15. **[15-MONITORING.md](./15-MONITORING.md)** 📋  
    📈 Metriche, logging, alerting, troubleshooting

### 🟣 Advanced Topics

16. **[16-CUSTOMIZATION.md](./16-CUSTOMIZATION.md)** 📋  
    🎨 White-label, theming, traduzioni custom

17. **[17-EXTENSIONS.md](./17-EXTENSIONS.md)** 📋  
    🧩 Plugin system, integrations esterne

18. **[18-CHANGELOG.md](./18-CHANGELOG.md)** 📋  
    📝 Storia modifiche, versioning, breaking changes

---

## 🧭 Quick Links

### Per AI che leggono il progetto per la prima volta:

1. **[01-OVERVIEW.md](./01-OVERVIEW.md)** (5 min) → capisci cosa fa SiteBoS  
2. **[03-ONBOARDING.md](./03-ONBOARDING.md)** (3 min) → come si inizia  
3. **[04-SOFT-SKILLS.md](./04-SOFT-SKILLS.md)** (10 min) → modulo soft skills completo  
4. **[06-CATALOG.md](./06-CATALOG.md)** (8 min) → sistema catalog con AI  
5. **[07-AGENDA.md](./07-AGENDA.md)** (12 min) → smart resource orchestrator  
6. **[08-HONEYPOT.md](./08-HONEYPOT.md)** (8 min) → knowledge base + anti-spam  
7. Esplora il codice nei folder corrispondenti → vedi l'implementazione reale  

### Per Developer:

1. **Setup Frontend**: [13-DEPLOYMENT.md](./13-DEPLOYMENT.md) 📋  
2. **Database Schema**: [11-DATABASE-SCHEMA.md](./11-DATABASE-SCHEMA.md) 📋  
3. **Moduli Completi**: [04](./04-SOFT-SKILLS.md), [06](./06-CATALOG.md), [08](./08-HONEYPOT.md), [09](./09-LEGAL-PROCESSOR.md), [10](./10-SPONSOR.md) ✅  
4. **Agenda System**: [07](./07-AGENDA.md) 🚧  
5. **AI Integration**: [12-AI-INTEGRATION.md](./12-AI-INTEGRATION.md) 📋  

### Per Product Owner:

1. **Roadmap**: Vedi sezione in [01-OVERVIEW.md](./01-OVERVIEW.md#roadmap)  
2. **Metriche**: [15-MONITORING.md](./15-MONITORING.md) 📋  
3. **Customization**: [16-CUSTOMIZATION.md](./16-CUSTOMIZATION.md) 📋  

---

## 📝 Convenzioni Documentazione

### Struttura File Standard

```markdown
# 📌 Titolo Modulo

> **Ultima revisione**: GG Mese AAAA  
> **Path**: `percorso/del/modulo`  
> **Status**: Production ✅ / Beta 🚧 / Planned 📋

---

## 🎯 Obiettivo
[Cosa fa questo modulo/sistema]

## 📊 Flow / Architettura
[Diagrammi Mermaid, schemi]

## 🔧 Implementazione
[Codice chiave + esempi]

## 📊 Metriche
[KPIs tracciati]

## 🛠️ Troubleshooting
[Errori comuni + fix]

## 🚀 Roadmap
[Feature future]

## 📚 Documentazione Correlata
[Link ad altre MD]
```

### Emoji Standard

| Emoji | Significato |
|-------|-------------|
| 🎯 | Obiettivo / Scopo |
| 📊 | Flow / Architettura |
| 🔧 | Implementazione / Codice |
| 📊 | Metriche / Analytics |
| 🛠️ | Troubleshooting / Fix |
| 🚀 | Roadmap / Future |
| ✅ | Completo / Done |
| 🚧 | Beta / In Progress |
| 📋 | Planned |
| ❌ | Deprecato / Rimosso |

---

## 🔄 Update Log

| Data | Documento | Modifica |
|------|-----------|----------|
| 20 Dic 2025 | 07-AGENDA.md | 🚧 Creato: Smart Resource Orchestrator (Fase A/B/C) |
| 12 Dic 2025 | 10-SPONSOR.md | ✅ Creato: sponsor carousel completo |
| 12 Dic 2025 | 09-LEGAL-PROCESSOR.md | ✅ Creato: legal document generator |
| 12 Dic 2025 | 03-ONBOARDING.md | ✅ Creato: onboarding 5-step wizard |
| 12 Dic 2025 | 08-HONEYPOT.md | ✅ Creato: knowledge base + anti-spam completo |
| 12 Dic 2025 | 06-CATALOG.md | ✅ Creato: catalog manager con AI vision |
| 12 Dic 2025 | 04-SOFT-SKILLS.md | ✅ Creato: soft skills + card collassabili |
| 12 Dic 2025 | 01-OVERVIEW.md | ✅ Creato: overview progetto + rimosso riferimenti API |
| 12 Dic 2025 | README.md | ✅ Creato: index documentazione |

---

## 📊 Statistiche Documentazione

### Copertura Moduli

| Modulo | File | Stato | Completezza |
|--------|------|-------|-------------|
| Overview | 01-OVERVIEW.md | ✅ | 100% |
| Onboarding | 03-ONBOARDING.md | ✅ | 100% |
| Soft Skills | 04-SOFT-SKILLS.md | ✅ | 100% |
| Catalog | 06-CATALOG.md | ✅ | 100% |
| **Agenda** | **07-AGENDA.md** | **🚧** | **75%** |
| HoneyPot | 08-HONEYPOT.md | ✅ | 100% |
| Legal Processor | 09-LEGAL-PROCESSOR.md | ✅ | 100% |
| Sponsor | 10-SPONSOR.md | ✅ | 100% |
| Team Manager | 05-TEAM-MANAGER.md | 📋 | 0% |
| Marketing | - | 📋 | 0% |
| Dashboard | - | 📋 | 0% |

**Totale Moduli**: 7.75/11 documentati (70.5%)

### Linee di Documentazione

- **01-OVERVIEW.md**: ~370 righe
- **03-ONBOARDING.md**: ~180 righe
- **04-SOFT-SKILLS.md**: ~520 righe
- **06-CATALOG.md**: ~480 righe
- **07-AGENDA.md**: ~550 righe 🆕
- **08-HONEYPOT.md**: ~600 righe
- **09-LEGAL-PROCESSOR.md**: ~210 righe
- **10-SPONSOR.md**: ~240 righe

**Totale**: ~3,150 righe di documentazione tecnica 📚

---

## ❓ FAQ Documentazione

### **Q: Perché non c'è documentazione API/Backend?**
A: Il backend è proprietario. Il frontend è open per trasparenza, ma l'orchestrazione resta privata. Chi clona il frontend deve costruirsi il backend da sé. 😉

### **Q: Come posso contribuire alla documentazione?**
A: Crea una PR con modifiche ai file `.md` rispettando il template standard.

### **Q: Dove trovo esempi di codice?**
A: Ogni documento ha sezione "Implementazione" con snippet. Per codice completo, vedi i file sorgente linkati.

### **Q: La documentazione è sincronizzata con il codice?**
A: Sì. Ogni modifica al codice richiede update alla MD corrispondente (vedi Update Log).

### **Q: Quali moduli sono prioritari per la prossima documentazione?**
A: Nell'ordine:
1. **Agenda - Fase D** (Calendar operational view) - 🆙 🚧
2. **Team Manager** (profili stakeholder, CRUD operatori)
3. **Marketing Hub** (AI content generation)
4. **Dashboard** (KPI widgets, gatekeeper)

---

## 🔒 Note Importanti

### ⚠️ Backend Proprietario

Il codice frontend di SiteBoS è **pubblico per trasparenza**. Il backend (orchestratore, webhook, logica AI) è **proprietario di TrinAI**.

**Cosa significa**:
- ✅ Puoi studiare il frontend
- ✅ Puoi contribuire con PR (UI/UX fixes)
- ❌ Non puoi clonare e deployare in produzione
- ❌ Non riceverai accesso agli endpoint backend

**Se vuoi usare SiteBoS**:
- Contatta **info@trinai.it** per licenza commerciale
- Richiedi demo gratuita: [@TrinAiTecSupportbot](https://t.me/TrinAiTecSupportbot)

---

## 📣 Contatti

**Per domande sulla documentazione**:  
📧 info@trinai.it  
📞 [@TrinAiTecSupportbot](https://t.me/TrinAiTecSupportbot)  

**Per contributi/PR**:  
👤 [@SimonAiIT](https://github.com/SimonAiIT)  

---

<div align="center">

**Documentazione curata da [TrinAI](https://www.trinai.it)**

*Clarity Through Documentation*

---

### 📊 Progress Tracker

```
██████████████░░░░░░ 70.5% Complete

✅ Overview
✅ Onboarding
✅ Soft Skills
✅ Catalog
🚧 Agenda System (75%)
✅ HoneyPot
✅ Legal Processor
✅ Sponsor Carousel
📋 Team Manager (Next)
📋 Marketing Hub
📋 Dashboard
```

---

[⬆ Torna al progetto](../README.md)

</div>