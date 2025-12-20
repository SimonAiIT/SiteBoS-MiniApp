# 07 - AGENDA: Smart Resource Orchestrator

> **Ultima revisione**: 20 Dicembre 2025  
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

## 📊 Architettura

### User Journey Completo

```mermaid
graph TD
    A[Click Agenda in Dashboard] --> B[Smart Loader - Fase A]
    B --> C{Tenant Configurato?}
    C -->|Sì| D[Operational View - Fase D]
    C -->|No| E[Resource Wizard - Fase B]
    E --> F[Dossier Enrichment - Fase C]
    F --> D
    
    B --> B1[Analizza Catalogo Servizi]
    B1 --> B2[Identifica Archetipo Operativo]
    B2 --> B3[Calcola Fabbisogno Risorse]
    
    E --> E1[Sezione TEAM]
    E --> E2[Sezione ASSET]
    E1 --> E3[Ops Mode Toggle]
    E1 --> E4[Compliance Mode Toggle]
    E2 --> E5[Contatori Quantità]
    E2 --> E6[Need Maintenance]
    E2 --> E7[Need Compliance]
    
    F --> F1[Dashboard Stato Risorse]
    F1 --> F2{Status = Draft?}
    F2 -->|Sì| F3[Completa Dossier]
    F3 --> F4[Scheda 1: Identità]
    F3 --> F5[Scheda 2: Capacità]
    F3 --> F6[Scheda 3: Salute/Legge]
    F6 --> F7[Risorsa Attivata]
    
    D --> D1[Resource Selector]
    D1 --> D2{Device Type?}
    D2 -->|Mobile| D3[Lista View - Default]
    D2 -->|Desktop| D4[Calendar View]
    D3 --> D5[Oggi/Prossimi/Compliance]
    D3 --> D6[Apri App Calendario Nativa]
    D4 --> D7[FullCalendar Week/Month]
    D7 --> D8[Export iCal]
```

### I 4 Fasi Dettagliate

#### **FASE A: Smart Entry & AI Architect**

**Scopo**: Decisione intelligente su dove atterrare.

**File**: `index.html`, `orchestrator_logic.js`

**Flow**:
1. Loader intelligente con feedback di stato
2. Chiamata webhook: `analyze_tenant` con VAT
3. Analisi:
   - Servizi venduti nel catalogo
   - Operatori già censiti
   - Stato configurazione risorse
4. **Decision Fork**:
   - Se `is_configured = true` → GOTO Fase D (Operational)
   - Se `is_configured = false` → GOTO Fase B (Wizard)

**Webhook Payload**:
```json
{
  "action": "analyze_tenant",
  "vat": "IT12345678901",
  "timestamp": "2025-12-20T10:30:00Z"
}
```

**Expected Response**:
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

#### **FASE B: Resource Wizard (L'Intervista)**

**Scopo**: Configurare HUMAN e ASSET senza "foglio bianco".

**File**: `wizard.html`, `wizard_logic.js`

**UI Structure**:

**1. Sezione TEAM (Human Resources)**
- Lista operatori esistenti con avatar
- **Toggles per ogni operatore**:
  - 🔘 **Ops Mode**: Abilita Turni/Ferie (blocca agenda se assente)
  - 🔘 **Compliance Mode**: Abilita scadenze (Patenti, Visite mediche)
- Bottone `[+]` per aggiungere collaboratori al volo

**2. Sezione ASSET (Physical Resources)**
- **Suggerimenti AI**: Basati sui servizi (es. "Hai 'Tagliando' → Ti servono 'Ponti Sollevatori'")
- **Contatori Quantità**: `[-]` `[0]` `[+]` per ogni categoria
- **Layer Toggles** (appaiono se qty > 0):
  - 🔘 **Need Maintenance** (default ON per macchinari)
  - 🔘 **Need Compliance** (default ON per asset regolamentati)
- Bottone per asset custom

**3. Azione Finale**
- **`[GENERA INFRASTRUTTURA]`**
- Crea "Ghost Assets" (bozze)
- Predispone calendari Google

**Webhook Call**: `generate_infrastructure`

**Payload**:
```json
{
  "action": "generate_infrastructure",
  "vat": "IT12345678901",
  "configuration": {
    "operators": [
      {
        "id": "op_123",
        "name": "Mario Rossi",
        "ops_enabled": true,
        "compliance_enabled": false
      }
    ],
    "assets": [
      {
        "id": "asset_lift",
        "name": "Ponti Sollevatori",
        "quantity": 3,
        "maintenance_enabled": true,
        "compliance_enabled": true
      }
    ]
  }
}
```

**Expected Response**:
```json
{
  "status": "success",
  "resources": [
    {
      "id": "res_001",
      "name": "Ponte Sollevatore #1",
      "type": "asset",
      "category": "lift",
      "status": "draft",
      "layers": {
        "production": true,
        "ops": true,
        "compliance": true
      }
    }
  ],
  "google_calendars_prepared": true
}
```

---

#### **FASE C: Dossier Enrichment (Il Triage)**

**Scopo**: Dare identità alle risorse Ghost (Draft → Ready).

**File**: `dossier.html`, `dossier_logic.js`

**Dashboard di Stato**:
- **Card per ogni risorsa** con indicatori:
  - 🟡 **Draft** (Giallo): Dati mancanti
  - 🟢 **Ready** (Verde): Completo
  - 🔴 **Error** (Rosso): Google Auth mancante

**Modal Dossier (3 Tab)**:

**Tab 1: Identità (Anagrafica)**
```
- Nome specifico* (es. "Ponte Nord")
- Marca
- Modello
- Serial Number/Matricola
- Data Installazione
```

**Tab 2: Capacità (Production)**
```
- Slot simultanei* (es. Sala=8 posti, Ponte=1 auto)
- Orari apertura specifici (textarea)
- Note capacità
```

**Tab 3: Salute & Legge (Ops/Compliance)**
```
--- Routine Manutenzione ---
- Cosa fare? (es. "Pulizia Filtri")
- Frequenza (daily/weekly/monthly)
- Durata (minuti)

--- Scadenze Legali ---
- Tipo scadenza (es. "Revisione INAIL")
- Data scadenza
```

**Al Salvataggio**:
1. Risorsa diventa 🟢 **Verde**
2. Calendari Google creati e sincronizzati
3. Layer temporali attivi

**Webhook Call**: `complete_dossier`

**Payload**:
```json
{
  "action": "complete_dossier",
  "vat": "IT12345678901",
  "dossier": {
    "resource_id": "res_001",
    "identity": {
      "specific_name": "Ponte Nord",
      "brand": "Ravaglioli",
      "model": "KPN324",
      "serial": "AB123456",
      "install_date": "2020-03-15"
    },
    "capacity": {
      "slots": 1,
      "specific_hours": "Lun-Ven 08:00-18:00",
      "notes": "Solo auto fino a 2.5 ton"
    },
    "health": {
      "routine_task": "Lubrificazione catene",
      "routine_freq": "monthly",
      "routine_duration": 45,
      "deadline_type": "Revisione INAIL",
      "deadline_date": "2025-10-12"
    }
  }
}
```

---

#### **FASE D: Operational View (Il Cockpit)** ✅

**Scopo**: Utilizzo quotidiano - Vista calendario operativa **mobile-first**.

**File**: `calendar.html`, `calendar_logic.js`

### 📱 Mobile-First Strategy

L'interfaccia si adatta automaticamente al device:
- **Mobile**: Vista **Lista** (default) con integrazione calendario nativo
- **Tablet/Desktop**: Vista **Calendario** (FullCalendar.js)

**Header di Navigazione**:
- **Resource Selector** (dropdown): `[Mio Calendario]`, `[Calendario Mario]`, `[Ponte 1]`
- **Status Indicators**: 🔧 Manutenzione oggi, ⚠️ Scadenza vicina, ✓ Tutto OK
- **Asset Edit (⚙️)**: Link rapido al Dossier della risorsa

**Quick Actions Bar**:
```html
[📱 App Calendario] [+ Nuovo Evento] [⬇️ iCal]
```

### Vista Lista (Mobile Default)

**Sezione OGGI**
- Eventi del giorno corrente
- Ordinati per ora inizio
- 3 layer con colori distinti:
  - 🟦 **Production**: Appuntamenti clienti (sfondo blu)
  - ⬜ **Ops**: Blocchi rigidi (sfondo grigio + badge "BLOCCO")
  - 🔔 **Compliance**: Badge rossi (non bloccanti)

**Sezione PROSSIMI EVENTI**
- Prossimi 10 eventi futuri
- Mostra data + ora + durata
- Click per dettagli

**Sezione SCADENZE IN ARRIVO**
- Solo eventi Compliance Layer
- Mostra "giorni mancanti" alla scadenza
- Alert visivo se < 7 giorni

**Empty State**:
```
📅 Nessun evento programmato
Inizia creando il tuo primo appuntamento!
[Crea Evento]
```

### Vista Calendario (Desktop/Tablet)

**View Modes**:
- **Settimana** (timeGridWeek): Vista oraria 7 giorni
- **Mese** (dayGridMonth): Vista mensile

**FullCalendar Integration**:
```javascript
// Eventi con color-coding
const layerColors = {
  production: '#5B6FED',  // Blu
  ops: '#808080',         // Grigio
  compliance: '#ff6b6b'   // Rosso
};

// Custom rendering con emoji
eventContent: (arg) => {
  const icons = { production: '🟦', ops: '⬜', compliance: '🔔' };
  return `${icons[layer]} ${event.title}`;
}
```

**Interazioni**:
- Click evento → Mostra dettagli
- Eventi **Ops** non sono editabili (vincoli rigidi)
- Eventi **Production** possono essere spostati (conflict detection)

### 📱 Native Calendar Integration

**Come Funziona**:
1. Click su "App Calendario"
2. Sistema genera file `.ics` (iCalendar format)
3. Su mobile:
   - Tenta apertura diretta con `window.open(blob_url)`
   - Se fallisce → Download automatico del file
   - Alert: "Apri il file con la tua app calendario"
4. Su iOS/Android: Il sistema apre l'app nativa (Calendario/Google Calendar)

**iCal Export Format**:
```ical
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SiteBoS//Calendar//EN
BEGIN:VEVENT
UID:evt_001@sitebos.app
DTSTART:20251220T090000Z
DTEND:20251220T100000Z
SUMMARY:Appuntamento Cliente
DESCRIPTION:Note evento...
END:VEVENT
END:VCALENDAR
```

**Vantaggi**:
- ✅ **Zero learning curve**: L'utente usa la SUA app calendario
- ✅ **Sync automatica**: Le modifiche fatte nell'app nativa si riflettono
- ✅ **Notifiche native**: Alert push del dispositivo
- ✅ **Offline access**: Calendario disponibile senza internet

### Nuovo Evento Modal

**Campi**:
```
[🟦 Production] [⬜ Ops] [🔔 Compliance]  <- Tipo evento (toggle)

Titolo*: _____________________
Data*: [2025-12-20]
Ora Inizio*: [09:00]
Durata (min): [60]
Ora Fine: [10:00] (auto-calcolata)
Note: _____________________

☐ Evento ricorrente (solo Ops/Compliance)
  Frequenza: [Settimanale ▼]

⚠️ Conflict Warning (se presente):
"Slot già occupato da: Manutenzione Ponte (Ops Layer)"

[Annulla] [Salva Evento]
```

**Validazione**:
- Campi obbligatori: Tipo, Titolo, Data, Ora Inizio
- **Conflict Detection**: Verifica sovrapposizioni con layer Ops
- Se conflitto → Mostra warning + blocca salvataggio

**Webhook Call**: `create_booking`

**Payload**:
```json
{
  "action": "create_booking",
  "vat": "IT12345678901",
  "event": {
    "resource_id": "res_001",
    "type": "production",
    "title": "Appuntamento Cliente Rossi",
    "date": "2025-12-20",
    "start_time": "09:00",
    "duration": 60,
    "notes": "Revisione completa auto",
    "recurring": false,
    "recurring_freq": null
  }
}
```

**Response (Success)**:
```json
{
  "status": "success",
  "event_id": "evt_123",
  "message": "Evento creato con successo",
  "google_event_id": "abc123xyz"
}
```

**Response (Conflict)**:
```json
{
  "status": "error",
  "error": "conflict",
  "message": "Slot già occupato da: Manutenzione Ponte (Ops Layer)",
  "conflicting_event": {
    "id": "evt_456",
    "title": "Manutenzione Ponte",
    "layer": "ops",
    "start": "2025-12-20T09:00:00Z",
    "end": "2025-12-20T11:00:00Z"
  }
}
```

---

## 🔧 Implementazione

### File Structure

```
/agenda
  ├── index.html            # Entry point - Smart Loader
  ├── orchestrator_logic.js # Core logic & webhook calls
  ├── wizard.html           # Fase B - Resource Wizard
  ├── wizard_logic.js       # Wizard controller
  ├── dossier.html          # Fase C - Enrichment Dashboard
  ├── dossier_logic.js      # Dossier controller
  ├── calendar.html         # Fase D - Operational View ✅
  ├── calendar_logic.js     # Calendar controller ✅
  └── -*.html               # File legacy (deprecati)
```

### Webhook Endpoint

**Base URL**: `https://trinai.api.workflow.dcmake.it/webhook/8f148592-cbb9-4c72-96e8-73c08fccee43`

**Protocollo**: POST JSON

**Actions Disponibili**:

| Action | Fase | Scopo |
|--------|------|-------|
| `analyze_tenant` | A | Analizza setup esistente |
| `generate_infrastructure` | B | Crea risorse Ghost |
| `get_draft_resources` | C | Recupera risorse da completare |
| `complete_dossier` | C | Attiva risorsa con dati completi |
| `activate_all_resources` | C | Attivazione batch |
| `get_active_resources` | D | Lista risorse attive ✅ |
| `get_calendar_events` | D | Fetch eventi (Production/Ops/Compliance) ✅ |
| `create_booking` | D | Nuovo appuntamento con conflict detection ✅ |
| `update_ops_rule` | D | Modifica regola manutenzione |

**Common Request Structure**:
```json
{
  "action": "<action_name>",
  "vat": "IT12345678901",
  "timestamp": "2025-12-20T10:30:00Z",
  ...<action-specific-data>
}
```

**Common Response Structure**:
```json
{
  "status": "success" | "error",
  "message": "Human-readable message",
  "data": { ... },
  "errors": [ ... ] // se status = error
}
```

---

## 📊 Metriche

### KPIs Tracciati

1. **Setup Completion Rate**
   - % tenant che completano il wizard
   - Drop-off per fase (A/B/C/D)

2. **Resource Utilization**
   - Ore disponibili vs ore prenotate
   - Asset con utilizzo < 20% (alert inefficienza)

3. **Compliance Adherence**
   - Scadenze rispettate vs scadute
   - Tempo medio di anticipo revisioni

4. **Ops Efficiency**
   - Conflitti evitati (tentativi prenotazione su slot occupati)
   - Tempo risparmiato con automazioni

5. **Mobile Adoption** 🆕
   - % utenti che usano "App Calendario"
   - % eventi creati da mobile vs desktop
   - Retention rate vista Lista vs Calendario

### Analytics Events

```javascript
// Tracciare con analytics esistente
analytics.track('agenda_wizard_started', { vat, archetype });
analytics.track('agenda_resource_added', { vat, resource_type, quantity });
analytics.track('agenda_dossier_completed', { vat, resource_id, time_spent });
analytics.track('agenda_booking_created', { vat, resource_id, layer: 'production', device: 'mobile' });
analytics.track('agenda_native_calendar_opened', { vat, resource_id, device: 'mobile' }); // NEW
analytics.track('agenda_conflict_detected', { vat, resource_id, conflicting_layer: 'ops' }); // NEW
```

---

## 🛠️ Troubleshooting

### Errori Comuni

**1. "Google Calendar Auth Failed"**
- **Causa**: Token OAuth scaduto
- **Fix**: Forzare re-auth in dossier modal
- **Webhook Response**: `{ "error": "google_auth_required", "auth_url": "..." }`

**2. "Resource Already Exists"**
- **Causa**: Tentativo di creare risorsa duplicata
- **Fix**: Mostrare risorsa esistente, offrire modifica

**3. "Slot Conflict"**
- **Causa**: Tentativo booking su slot occupato (Ops Layer)
- **Fix**: Mostrare visivamente il blocco grigio con motivo
- **UI**: Warning rosso nel modal con dettagli evento conflittuale

**4. "Native Calendar Not Opening"** 🆕
- **Causa**: Browser blocca `window.open()` con blob URL
- **Fix**: Fallback automatico a download `.ics`
- **UX**: Alert "File scaricato, aprilo con la tua app"

**5. "Events Not Loading"**
- **Causa**: Date range troppo ampio / timeout webhook
- **Fix**: Limitare range a 60 giorni (default implementato)
- **Monitoring**: Log query time > 5s

### Debug Mode

Abilitare debug info nel loader:
```javascript
// In orchestrator_logic.js
const DEBUG = true; // mostra payload/response webhook
```

---

## 🚀 Roadmap

### Q1 2026 ✅ COMPLETATO

- [x] **Calendar View (Fase D)**: Vista operativa con FullCalendar.js
- [x] **Mobile-First List View**: Vista lista ottimizzata per cellulari
- [x] **Native Calendar Integration**: Export iCal + apertura app nativa
- [x] **Booking Flow**: Creazione appuntamenti da calendario
- [x] **Conflict Detection**: Visual feedback per slot occupati

### Q2 2026 📋

- [ ] **Google Calendar Bidirectional Sync**: Modif iche in Google → SiteBoS
- [ ] **AI Optimizer**: Suggerimenti riorganizzazione slot per efficienza
- [ ] **Multi-Resource Booking**: Prenota più risorse contemporaneamente
- [ ] **Recurring Events Advanced**: Eventi ricorrenti con eccezioni
- [ ] **Drag & Drop**: Spostamento eventi tra slot (solo Production)

### Q3 2026 🔮

- [ ] **Push Notifications**: Reminder 24h prima per eventi Production
- [ ] **Team Collaboration**: Commenti su eventi, @mentions
- [ ] **Resource Analytics Dashboard**: KPI per risorsa (utilizzo%, revenue)
- [ ] **White-Label Calendar**: Calendar pubblico per clienti (booking esterno)
- [ ] **Outlook/Apple Calendar Direct Sync**: Alternative a Google

---

## 📚 Documentazione Correlata

- [01-OVERVIEW.md](./01-OVERVIEW.md) - Architettura generale SiteBoS
- [05-TEAM-MANAGER.md](./05-TEAM-MANAGER.md) - Gestione operatori (integrato)
- [06-CATALOG.md](./06-CATALOG.md) - Servizi venduti (analizzati per asset)
- [SESSION_ARCHITECTURE.md](./SESSION_ARCHITECTURE.md) - Gestione sessione/VAT
- [WEBHOOK_FLOW.md](../WEBHOOK_FLOW.md) - Protocollo comunicazione backend

---

## ✅ Checklist Implementazione

### Fase A - Smart Entry
- [x] index.html con loader intelligente
- [x] orchestrator_logic.js con webhook integration
- [x] Decision fork logic (configured vs wizard)
- [x] Error overlay con fallback

### Fase B - Wizard
- [x] wizard.html con sezioni TEAM/ASSET
- [x] wizard_logic.js con contatori e toggles
- [x] AI suggestions rendering
- [x] Generate infrastructure webhook call

### Fase C - Dossier
- [x] dossier.html con dashboard stato
- [x] dossier_logic.js con modal 3-tab
- [x] Form validation
- [x] Complete dossier webhook call

### Fase D - Calendar ✅ COMPLETO
- [x] calendar.html con FullCalendar integration
- [x] calendar_logic.js con 3-layer rendering
- [x] Mobile-first Lista View (default)
- [x] Desktop Calendar View (week/month)
- [x] Native calendar integration (iCal export)
- [x] Booking creation flow con modal
- [x] Conflict detection e warning
- [x] Status indicators dinamici
- [x] Auto-calculation end time
- [x] Recurring events setup (Ops/Compliance)

---

## 🌟 Perché questa UX è "Agnostica & Vincente"

1. **Zero "Foglio Bianco"**: L'AI costruisce l'agenda, l'utente dice solo "Sì, ne ho 3" e "La matricola è XYZ"
2. **Protezione Attiva**: Il sistema impedisce errori umani (non puoi prenotare se la poltrona è in manutenzione)
3. **Scalabilità Infinita**: Funziona per 1 persona (Consulente) o 50 asset (Fabbrica), perché la logica "Resource + 3 Layers" è universale
4. **Google as Infra**: Usa Google Calendar come infrastruttura temporale (affidabile, scalabile, gratis)
5. **AI-Powered Setup**: Nessun manuale da leggere, l'AI deduce cosa serve dai servizi venduti
6. **📱 Mobile Native**: Integrazione con app calendario del dispositivo = zero frizione 🆕
7. **Responsive Smart**: Lista su mobile, calendario su desktop - best of both worlds

---

**Ultimo aggiornamento**: 20 Dicembre 2025  
**Responsabile**: Team Development SiteBoS  
**Status**: ✅ **PRODUCTION READY** - Tutte le 4 fasi complete