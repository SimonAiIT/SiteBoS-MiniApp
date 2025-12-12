# 📚 SiteBoS - Documentazione Completa

> **🎯 Questa cartella contiene TUTTA la documentazione tecnica del progetto**  
> Pensata per essere letta da AI, developer e stakeholder.

---

## 🗂️ Indice Documenti

### 🟢 Getting Started

1. **[01-OVERVIEW.md](./01-OVERVIEW.md)**  
   📝 Panoramica generale, architettura, modelli economici, roadmap  
   🎯 **Inizia da qui** se è la prima volta che leggi il progetto

2. **[02-ARCHITECTURE.md](./02-ARCHITECTURE.md)** *(Coming Soon)*  
   🏛️ Architettura dettagliata: frontend, backend, database schema, API flows

3. **[03-MODULES.md](./03-MODULES.md)** *(Coming Soon)*  
   📦 Descrizione approfondita di tutti i moduli (HoneyPot, Catalog, Agenda, Team, Legal)

### 🔵 Moduli Core

4. **[04-SOFT-SKILLS.md](./04-SOFT-SKILLS.md)**  
   🧠 **Sistema Soft Skills Assessment** - Questionario 150 domande, profilo AI, video formativi, learning history  
   ✅ **COMPLETO** - Include modifiche recenti (card collassabili, score badge)

5. **[05-TEAM-MANAGER.md](./05-TEAM-MANAGER.md)** *(Coming Soon)*  
   👥 Gestione operatori, profili stakeholder, skill assignment

6. **[06-CATALOG.md](./06-CATALOG.md)** *(Coming Soon)*  
   📦 Catalog Manager: categorie, prodotti, AI descriptions, blueprint operativi

7. **[07-AGENDA.md](./07-AGENDA.md)** *(Coming Soon)*  
   📅 Sistema calendario: booking, conflict detection, export iCal

8. **[08-HONEYPOT.md](./08-HONEYPOT.md)** *(Coming Soon)*  
   🎭 Knowledge base aziendale + anti-spam form system

### 🟡 Backend & API

9. **[09-API-REFERENCE.md](./09-API-REFERENCE.md)** *(Coming Soon)*  
   🔌 Documentazione completa webhook N8N (endpoint, payload, response)

10. **[10-DATABASE-SCHEMA.md](./10-DATABASE-SCHEMA.md)** *(Coming Soon)*  
    🗄️ Schema MongoDB (OWNERS, HONEYPOTS, CATALOG)

11. **[11-AI-INTEGRATION.md](./11-AI-INTEGRATION.md)** *(Coming Soon)*  
    🤖 Google Gemini API: prompt engineering, rate limits, fallback strategies

### 🟪 Deploy & Operations

12. **[12-DEPLOYMENT.md](./12-DEPLOYMENT.md)** *(Coming Soon)*  
    🚀 Guida deploy: N8N setup, MongoDB config, Telegram Bot registration

13. **[13-SECURITY.md](./13-SECURITY.md)** *(Coming Soon)*  
    🔐 Best practices sicurezza: GDPR, auth, rate limiting, encryption

14. **[14-MONITORING.md](./14-MONITORING.md)** *(Coming Soon)*  
    📈 Metriche, logging, alerting, troubleshooting

### 🟣 Advanced Topics

15. **[15-CUSTOMIZATION.md](./15-CUSTOMIZATION.md)** *(Coming Soon)*  
    🎨 White-label, theming, traduzioni custom

16. **[16-EXTENSIONS.md](./16-EXTENSIONS.md)** *(Coming Soon)*  
    🧩 Webhook marketplace, plugin system, integrations

17. **[17-CHANGELOG.md](./17-CHANGELOG.md)** *(Coming Soon)*  
    📝 Storia modifiche, versioning, breaking changes

---

## 🧭 Quick Links

### Per AI che leggono il progetto per la prima volta:

1. Leggi **[01-OVERVIEW.md](./01-OVERVIEW.md)** (5 min) → capisci cosa fa SiteBoS  
2. Leggi **[04-SOFT-SKILLS.md](./04-SOFT-SKILLS.md)** (10 min) → vedi un modulo completo in azione  
3. Esplora il codice in `/softskill/` → vedi l'implementazione reale  

### Per Developer:

1. **Setup veloce**: [12-DEPLOYMENT.md](./12-DEPLOYMENT.md)  
2. **API Reference**: [09-API-REFERENCE.md](./09-API-REFERENCE.md)  
3. **Database Schema**: [10-DATABASE-SCHEMA.md](./10-DATABASE-SCHEMA.md)  

### Per Product Owner:

1. **Roadmap**: Vedi sezione in [01-OVERVIEW.md](./01-OVERVIEW.md#roadmap)  
2. **Metriche**: [14-MONITORING.md](./14-MONITORING.md)  
3. **Customization**: [15-CUSTOMIZATION.md](./15-CUSTOMIZATION.md)  

---

## 📝 Convenzioni Documentazione

### Struttura File

Ogni documento segue questo template:

```markdown
# 📌 Titolo Modulo

> **Ultima revisione**: GG Mese AAAA  
> **Path**: `percorso/del/modulo`  
> **Responsabile**: Team/Persona

---

## 🎯 Obiettivo
[Cosa fa questo modulo/sistema]

## 📚 Struttura
[Architettura/Flow]

## 🔧 Implementazione
[Codice chiave + esempi]

## 📊 Metriche
[KPIs tracciati]

## 🛠️ Troubleshooting
[Errori comuni + fix]

## 📚 Documenti Correlati
[Link ad altre MD]

## 🚀 Roadmap
[Feature future]
```

### Emoji Standard

| Emoji | Significato |
|-------|-------------|
| 🎯 | Obiettivo / Scopo |
| 📚 | Struttura / Architettura |
| 🔧 | Implementazione / Codice |
| 📊 | Metriche / Analytics |
| 🛠️ | Troubleshooting / Fix |
| 🚀 | Roadmap / Future |
| ✅ | Completo / Done |
| 🚧 | In Progress |
| 📋 | Planned |
| ❌ | Deprecato / Rimosso |

---

## 🔄 Update Log

| Data | Documento | Modifica |
|------|-----------|----------|
| 12 Dic 2025 | 04-SOFT-SKILLS.md | ✅ Aggiunto: card collassabili learning history |
| 12 Dic 2025 | 04-SOFT-SKILLS.md | ✅ Aggiunto: score badge in complete-profile |
| 12 Dic 2025 | 01-OVERVIEW.md | ✅ Creato: overview progetto |
| 12 Dic 2025 | README.md | ✅ Creato: index documentazione |

---

## ❓ FAQ Documentazione

### **Q: Perché la documentazione è in una cartella separata?**
A: Per mantenere il root del progetto pulito e facilitare la navigazione AI.

### **Q: Come posso contribuire alla documentazione?**
A: Crea una PR con modifiche ai file `.md` rispettando il template standard.

### **Q: Dove trovo esempi di codice?**
A: Ogni documento ha sezione "Implementazione" con snippet. Per codice completo, vedi i file sorgente linkati.

### **Q: La documentazione è sincronizzata con il codice?**
A: Sì. Ogni modifica al codice richiede update alla MD corrispondente (vedi Update Log).

---

## 📞 Contatti

**Per domande sulla documentazione**:  
📧 info@trinai.it  
📞 [@TrinAiTecSupportbot](https://t.me/TrinAiTecSupportbot)  

**Per contributi/PR**:  
👤 [@SimonAiIT](https://github.com/SimonAiIT)  

---

<div align="center">

**Documentazione curata da [TrinAI](https://www.trinai.it)**

*Clarity Through Documentation*

[⬆ Torna al progetto](../README.md)

</div>