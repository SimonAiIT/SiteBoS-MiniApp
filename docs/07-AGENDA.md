# 07 - AGENDA: Smart Resource Orchestrator

> **Ultima revisione**: 22 Dicembre 2025  
> **Path**: `/agenda`  
> **Status**: Production ✅

---

## 🎯 Obiettivo

Il modulo **Agenda** non è un semplice calendario visivo. È un **gestore di disponibilità a livelli** che orchestra risorse umane e asset fisici attraverso tre layer temporali:

1. **Production Layer** (💰): Appuntamenti e Vendite (Fatturato)
2. **Ops Layer** (🔧): Fermi tecnici, Turni, Ferie, Pulizie (Vincoli Rigidi)
3. **Compliance Layer** (📅): Scadenze legali, Audit, Certificazioni (Task Generativi)

L'utente **dichiara le risorse**, il sistema (tramite AI/Webhook) costruisce l'infrastruttura temporale su **Google Calendar** (Strategia Satellite) e offre **integrazione nativa con le app calendario del dispositivo**.

---

## 🔧 Implementazione

### File Structure

```
/agenda
  ├── index.html            # Entry point - Smart Loader
  ├── orchestrator_logic.js # Core logic & dual webhook routing ✅
  ├── wizard.html           # Fase B - Resource Wizard
  ├── wizard_logic.js       # Wizard controller
  ├── dossier.html          # Fase C - Enrichment Dashboard
  ├── dossier_logic.js      # Dossier controller
  ├── calendar.html         # Fase D - Operational View ✅
  ├── calendar_logic.js     # Calendar controller ✅
  └── -*.html               # File legacy (deprecati)
```

### ✅ Dual Webhook Architecture

Il sistema utilizza **due webhook distinti** per separare logicamente onboarding e operazioni:

**Webhook 1: Onboarding** (Setup iniziale - Fase A, B)
- `analyze_tenant`: Analizza setup esistente e suggerisce risorse
- `generate_infrastructure`: Crea Ghost Assets e prepara calendari

**Webhook 2: Operations** (Uso quotidiano - Fase C, D)
- `get_draft_resources`: Recupera risorse da completare
- `complete_dossier`: Attiva risorsa con dati completi
- `activate_all_resources`: Attivazione batch
- `get_active_resources`: Lista risorse attive per calendario
- `get_calendar_events`: Fetch eventi (Production/Ops/Compliance)
- `create_booking`: Nuovo appuntamento con conflict detection
- `update_ops_rule`: Modifica regola manutenzione

**Vantaggi dell'approccio dual-webhook:**
- ✅ Separazione logica Setup vs Operazioni
- ✅ Scaling indipendente con load balancing differenziato
- ✅ Monitoring granulare con metriche separate per fase
- ✅ Rate limiting specifico (onboarding raro vs operazioni frequenti)

**Routing automatico**: Il sistema seleziona il webhook corretto in base all'action tramite `orchestrator_logic.js`

> **Nota**: Gli endpoint webhook sono configurati in `orchestrator_logic.js` e non vengono esposti pubblicamente per motivi di sicurezza.

---

## 📊 Metriche

### KPIs per Webhook

**Onboarding Webhook**:
- Setup completion rate (% che arrivano a Fase D)
- Avg time to complete wizard (target < 5 min)
- Drop-off per step (A → B → C)
- Asset suggestions accuracy (AI)

**Operations Webhook**:
- API response time (P50, P95, P99)
- Conflict detection rate (% booking bloccati)
- Calendar sync success rate
- Events created per day

### Analytics Events

```javascript
// Onboarding
analytics.track('agenda_analyze_started', { vat, archetype });
analytics.track('agenda_infrastructure_generated', { vat, resources_count });

// Operations
analytics.track('agenda_booking_created', { vat, resource_id, layer, device });
analytics.track('agenda_conflict_detected', { vat, conflicting_layer });
analytics.track('agenda_native_calendar_opened', { vat, platform });
```

---

## 🛠️ Troubleshooting

### Errori Comuni

**1. "Webhook Timeout"**
- **Causa**: Request > 30s (limite Telegram WebApp)
- **Fix**: Ridurre range date eventi (max 60 giorni)
- **Monitoring**: Log backend per query lente

**2. "Wrong Webhook Called"**
- **Causa**: Action non presente in routing map
- **Fix**: Fallback automatico a webhook operations
- **Debug**: Controlla console per log routing

**3. "CORS Error"**
- **Causa**: Webhook blocca richieste cross-origin
- **Fix**: Backend deve rispondere con header CORS corretti

**4. "Invalid Action"**
- **Causa**: Typo nel nome action o action non implementata
- **Fix**: Verificare spelling e consultare lista actions
- **Fallback**: Mostrare errore user-friendly invece di crash

---

## ✅ Checklist Implementazione

### Core Infrastructure
- [x] Dual webhook configuration
- [x] Smart routing per action type
- [x] Error handling e fallback
- [x] Debug mode con payload visibility

### Fase A - Smart Entry
- [x] index.html con loader intelligente
- [x] orchestrator_logic.js con webhook integration
- [x] Decision fork logic (configured vs wizard)
- [x] Error overlay con fallback

### Fase B - Wizard
- [x] wizard.html con sezioni TEAM/ASSET
- [x] wizard_logic.js con contatori e toggles
- [x] AI suggestions rendering
- [x] Generate infrastructure webhook call (ONBOARDING)

### Fase C - Dossier
- [x] dossier.html con dashboard stato
- [x] dossier_logic.js con modal 3-tab
- [x] Form validation
- [x] Complete dossier webhook call (OPERATIONS)

### Fase D - Calendar ✅ COMPLETO
- [x] calendar.html con FullCalendar integration
- [x] calendar_logic.js con 3-layer rendering
- [x] Mobile-first Lista View (default)
- [x] Desktop Calendar View (week/month)
- [x] Native calendar integration (iCal export)
- [x] Booking creation flow con modal
- [x] Conflict detection e warning (OPERATIONS)
- [x] Status indicators dinamici
- [x] Auto-calculation end time
- [x] Recurring events setup (Ops/Compliance)

---

## 🚀 Roadmap

### Q1 2026 ✅ COMPLETATO

- [x] **Dual Webhook Architecture**
- [x] **Calendar View (Fase D)**: Vista operativa con FullCalendar.js
- [x] **Mobile-First List View**: Vista lista ottimizzata per cellulari
- [x] **Native Calendar Integration**: Export iCal + apertura app nativa
- [x] **Booking Flow**: Creazione appuntamenti da calendario
- [x] **Conflict Detection**: Visual feedback per slot occupati

### Q2 2026 📋

- [ ] **Google Calendar Bidirectional Sync**: Modifiche in Google → SiteBoS
- [ ] **Webhook Retry Logic**: Automatic retry con exponential backoff
- [ ] **AI Optimizer**: Suggerimenti riorganizzazione slot per efficienza
- [ ] **Multi-Resource Booking**: Prenota più risorse contemporaneamente
- [ ] **Recurring Events Advanced**: Eventi ricorrenti con eccezioni
- [ ] **Drag & Drop**: Spostamento eventi tra slot (solo Production)

### Q3 2026 🔮

- [ ] **Webhook Analytics Dashboard**: Real-time monitoring chiamate
- [ ] **Push Notifications**: Reminder 24h prima per eventi Production
- [ ] **Team Collaboration**: Commenti su eventi, @mentions
- [ ] **Resource Analytics Dashboard**: KPI per risorsa (utilizzo%, revenue)
- [ ] **White-Label Calendar**: Calendar pubblico per clienti (booking esterno)
- [ ] **Outlook/Apple Calendar Direct Sync**: Alternative a Google

---

## 🌟 Perché questa UX è "Agnostica & Vincente"

1. **Zero "Foglio Bianco"**: L'AI costruisce l'agenda, l'utente dice solo "Sì, ne ho 3" e "La matricola è XYZ"
2. **Protezione Attiva**: Il sistema impedisce errori umani (non puoi prenotare se la poltrona è in manutenzione)
3. **Scalabilità Infinita**: Funziona per 1 persona (Consulente) o 50 asset (Fabbrica)
4. **Google as Infra**: Usa Google Calendar come infrastruttura temporale (affidabile, scalabile)
5. **AI-Powered Setup**: Nessun manuale da leggere, l'AI deduce cosa serve dai servizi venduti
6. **📱 Mobile Native**: Integrazione con app calendario del dispositivo = zero frizione
7. **Responsive Smart**: Lista su mobile, calendario su desktop - best of both worlds
8. **Dual Webhook**: Separazione pulita tra setup e operazioni per performance ottimali

---

**Ultimo aggiornamento**: 22 Dicembre 2025  
**Responsabile**: Team Development SiteBoS  
**Status**: ✅ **PRODUCTION READY** - Tutte le 4 fasi complete + Dual Webhook