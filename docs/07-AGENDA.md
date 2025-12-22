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

### ✅ Dual Webhook Configuration

Il sistema utilizza **due webhook distinti** per separare logicamente onboarding e operazioni:

```javascript
// orchestrator_logic.js
const WEBHOOK_ONBOARDING = 'https://trinai.api.workflow.dcmake.it/webhook/8f148592-cbb9-4c72-96e8-73c08fccee43';
const WEBHOOK_OPERATIONS = 'https://trinai.api.workflow.dcmake.it/webhook/5ea527d5-b0e7-44dc-b7ca-626f1c6176f0';

// Smart routing per action
const WEBHOOK_ROUTES = {
    // Onboarding (Fase A, B)
    'analyze_tenant': WEBHOOK_ONBOARDING,
    'generate_infrastructure': WEBHOOK_ONBOARDING,
    
    // Operations (Fase C, D)
    'get_draft_resources': WEBHOOK_OPERATIONS,
    'complete_dossier': WEBHOOK_OPERATIONS,
    'activate_all_resources': WEBHOOK_OPERATIONS,
    'get_active_resources': WEBHOOK_OPERATIONS,
    'get_calendar_events': WEBHOOK_OPERATIONS,
    'create_booking': WEBHOOK_OPERATIONS,
    'update_ops_rule': WEBHOOK_OPERATIONS
};
```

**Vantaggi dell'approccio dual-webhook:**
- ✅ **Separazione logica**: Setup vs Operazioni
- ✅ **Scaling indipendente**: Load balancing differenziato
- ✅ **Monitoring granulare**: Metriche separate per fase
- ✅ **Rate limiting specifico**: Throttling diverso per onboarding (raro) vs operazioni (frequente)

### Webhook Endpoints

#### **Webhook 1: Onboarding** 🆕
**URL**: `https://trinai.api.workflow.dcmake.it/webhook/8f148592-cbb9-4c72-96e8-73c08fccee43`

**Scopo**: Gestisce setup iniziale e configurazione risorse (Fase A, B)

**Actions**:

| Action | Fase | Descrizione |
|--------|------|-------------|
| `analyze_tenant` | A | Analizza setup esistente e suggerisce risorse |
| `generate_infrastructure` | B | Crea Ghost Assets e prepara calendari |

**Esempio Request**:
```json
{
  "action": "analyze_tenant",
  "vat": "IT12345678901",
  "timestamp": "2025-12-22T10:30:00Z"
}
```

**Esempio Response**:
```json
{
  "is_configured": false,
  "resources_ready": false,
  "archetype": "service_business",
  "resource_requirements": {
    "services_count": 12,
    "operators_count": 3
  },
  "existing_operators": [
    { "id": "op_123", "name": "Mario Rossi", "role": "Tecnico" }
  ],
  "asset_suggestions": [
    {
      "id": "asset_lift",
      "name": "Ponti Sollevatori",
      "icon": "fas fa-car-lift",
      "ai_reason": "Hai servizi di Tagliando",
      "default_maintenance": true,
      "default_compliance": true
    }
  ]
}
```

---

#### **Webhook 2: Operations** 🆕
**URL**: `https://trinai.api.workflow.dcmake.it/webhook/5ea527d5-b0e7-44dc-b7ca-626f1c6176f0`

**Scopo**: Gestisce operazioni quotidiane e calendario (Fase C, D)

**Actions**:

| Action | Fase | Descrizione |
|--------|------|-------------|
| `get_draft_resources` | C | Recupera risorse da completare |
| `complete_dossier` | C | Attiva risorsa con dati completi |
| `activate_all_resources` | C | Attivazione batch |
| `get_active_resources` | D | Lista risorse attive per calendario |
| `get_calendar_events` | D | Fetch eventi (Production/Ops/Compliance) |
| `create_booking` | D | Nuovo appuntamento con conflict detection |
| `update_ops_rule` | D | Modifica regola manutenzione |

**Esempio Request (create_booking)**:
```json
{
  "action": "create_booking",
  "vat": "IT12345678901",
  "timestamp": "2025-12-22T10:45:00Z",
  "event": {
    "resource_id": "res_001",
    "type": "production",
    "title": "Appuntamento Cliente Rossi",
    "date": "2025-12-23",
    "start_time": "09:00",
    "duration": 60,
    "notes": "Revisione completa auto",
    "recurring": false
  }
}
```

**Esempio Response (Success)**:
```json
{
  "status": "success",
  "event_id": "evt_123",
  "message": "Evento creato con successo",
  "google_event_id": "abc123xyz"
}
```

**Esempio Response (Conflict)**:
```json
{
  "status": "error",
  "error": "conflict",
  "message": "Slot già occupato da: Manutenzione Ponte (Ops Layer)",
  "conflicting_event": {
    "id": "evt_456",
    "title": "Manutenzione Ponte",
    "layer": "ops",
    "start": "2025-12-23T09:00:00Z",
    "end": "2025-12-23T11:00:00Z"
  }
}
```

---

### Common Request/Response Structure

**Request Headers**:
```
Content-Type: application/json
```

**Common Request Fields**:
```json
{
  "action": "<action_name>",
  "vat": "IT12345678901",
  "timestamp": "2025-12-22T10:30:00Z",
  ...<action-specific-data>
}
```

**Common Response Fields**:
```json
{
  "status": "success" | "error",
  "message": "Human-readable message",
  "data": { ... },
  "errors": [ ... ] // se status = error
}
```

---

## 🛠️ Troubleshooting

### Errori Comuni

**1. "Webhook Timeout"**
- **Causa**: Request > 30s (limite Telegram WebApp)
- **Fix**: Ridurre range date eventi (max 60 giorni)
- **Monitoring**: Log backend per query lente

**2. "Wrong Webhook Called"**
- **Causa**: Action non presente in `WEBHOOK_ROUTES`
- **Fix**: Fallback automatico a `WEBHOOK_OPERATIONS`
- **Debug**: Controlla console per log `🔗 Webhook Call: <action> → <webhook_id>`

**3. "CORS Error"**
- **Causa**: Webhook blocca richieste cross-origin
- **Fix**: Backend deve rispondere con:
  ```
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
  ```

**4. "Invalid Action"**
- **Causa**: Typo nel nome action o action non implementata
- **Fix**: Verificare spelling e consultare tabella actions sopra
- **Fallback**: Mostrare errore user-friendly invece di crash

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

- [x] **Dual Webhook Architecture** 🆕
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

**Ultimo aggiornamento**: 22 Dicembre 2025  
**Responsabile**: Team Development SiteBoS  
**Status**: ✅ **PRODUCTION READY** - Tutte le 4 fasi complete + Dual Webhook