# assistant.html — Documentazione API & Comportamento

> **Versione:** 2.0 · **Aggiornato:** 2026-04-02  
> **Telegram WebApp:** `window.Telegram.WebApp` richiesta  
> **Webhook Chat:** `WH_CHAT` · **Webhook Solver:** `WH_SOLVER`

---

## Indice

1. [Panoramica architettura](#1-panoramica-architettura)
2. [Parametri URL](#2-parametri-url)
3. [Costanti Webhook](#3-costanti-webhook)
4. [Modello dati interni](#4-modello-dati-interni)
5. [Azioni verso WH_CHAT](#5-azioni-verso-wh_chat)
6. [Azioni verso WH_SOLVER](#6-azioni-verso-wh_solver)
7. [Risposte attese dal backend](#7-risposte-attese-dal-backend)
8. [postMessage — comunicazione solver → assistant](#8-postmessage--comunicazione-solver--assistant)
9. [Agenti disponibili (AGENT_META)](#9-agenti-disponibili-agent_meta)
10. [Flusso UX completo](#10-flusso-ux-completo)
11. [Gestione errori](#11-gestione-errori)

---

## 1. Panoramica architettura

```
┌─────────────────────────────────────────────────────────────────┐
│                        assistant.html                           │
│                                                                 │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ Screen 0 │  │   Screen 1   │  │       Screen 2           │  │
│  │ Archivio │  │     Chat     │  │     Modalità Vocale      │  │
│  │  Thread  │  │  (centrale)  │  │     (microfono)          │  │
│  └──────────┘  └──────┬───────┘  └──────────────────────────┘  │
│                        │                                        │
│            ┌───────────┴────────────┐                          │
│            │    FAB Hamburger       │                          │
│            │  ┌─────────────────┐   │                          │
│            │  │  Agenti (4)     │   │                          │
│            │  │  Gestione Perc. │   │                          │
│            │  └─────────────────┘   │                          │
│            └───────────┬────────────┘                          │
│                        │ apre overlay                          │
│            ┌───────────▼────────────┐                          │
│            │   #solver-overlay      │                          │
│            │   <iframe solver.html> │                          │
│            └───────────┬────────────┘                          │
│                        │ postMessage                           │
│            ┌───────────▼────────────┐                          │
│            │  Messaggio in chat     │                          │
│            │  (contesto percorso)   │                          │
│            └────────────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
         │ POST JSON                    │ POST JSON
         ▼                              ▼
    WH_CHAT                        WH_SOLVER
```

---

## 2. Parametri URL

| Parametro | Tipo     | Default | Descrizione                              |
|-----------|----------|---------|------------------------------------------|
| `lang`    | `string` | `it`    | Lingua dell'interfaccia (it, en, fr, de) |
| `chatId`  | `string` | `null`  | ID della chat Telegram di origine        |

**Esempio:**
```
assistant.html?lang=it&chatId=123456789
```

---

## 3. Costanti Webhook

```javascript
const WH_CHAT   = "https://prod.workflow.trinai.it/webhook/81ab5292-43c3-4f93-afaf-7411b95fc010";
const WH_SOLVER = "https://trinai.api.workflow.dcmake.it/webhook/a0b6b2cb-4e19-4a92-9269-6b6d8a7afb80";
```

> ⚠️ `WH_SOLVER` viene chiamato **direttamente da `solver.html`**, non da `assistant.html`.  
> `assistant.html` riceve il risultato tramite `postMessage` (vedi §8).

---

## 4. Modello dati interni

### Agenti attivi
```javascript
let primaryAgent = 'pm';          // Agente principale corrente
let activeAgents = ['pm'];        // Array agenti collaboratori attivi
```

### Thread
```javascript
let threads = [
  {
    id:    'thread_001',           // ID univoco thread
    name:  'Discussione Attiva',   // Nome visualizzato
    agent: 'pm',                   // Agente di appartenenza
    date:  '02/04/2026'            // Data creazione (it-IT)
  }
];
let currentThreadId = 'thread_001';
```

### Log chat (per Insight Drawer)
```javascript
let chatLog = [];
// Ogni entry:
{
  role:    'user' | 'ai',   // Mittente
  agentId: 'pm',            // ID agente (se AI)
  text:    'testo...',      // Contenuto messaggio
  time:    '09:15'          // Ora HH:MM
}
```

### Razionale
```javascript
let lastRationale = null;
// Struttura attesa dal backend (opzionale):
{
  conclusion: 'Testo conclusione...',
  steps: ['Step 1...', 'Step 2...', 'Step 3...']
}
```

---

## 5. Azioni verso WH_CHAT

Tutte le chiamate a `WH_CHAT` usano `POST` con `Content-Type: application/json`.  
Ogni payload viene **arricchito automaticamente** con i campi di contesto:

### Payload base aggiunto a ogni richiesta
```json
{
  "agent_id":      "pm",
  "active_agents": ["pm", "mkt"],
  "thread_id":     "thread_001",
  "user_id":       "123456789",
  "chat_id":       "123456789",
  "lang":          "it"
}
```

---

### `npl_chat` — Messaggio testuale

**Trigger:** L'utente invia un messaggio dall'input chat.  
**Chiamata:** Una per ogni agente in `activeAgents`.

```json
{
  "action":        "npl_chat",
  "message":       "Testo del messaggio utente",
  "agent_id":      "pm",
  "active_agents": ["pm"],
  "thread_id":     "thread_001",
  "user_id":       "123456789",
  "chat_id":       null,
  "lang":          "it"
}
```

---

### `npl_voice` — Messaggio vocale

**Trigger:** L'utente registra un audio dalla schermata vocale.

```json
{
  "action":       "npl_voice",
  "audio_base64": "<base64 audio/webm>",
  "mime_type":    "audio/webm",
  "agent_id":     "pm",
  "active_agents":["pm"],
  "thread_id":    "thread_001",
  "user_id":      "123456789",
  "chat_id":      null,
  "lang":         "it"
}
```

---

### `add_collaborator` — Aggiunge agente collaboratore

**Trigger:** L'utente seleziona un agente dal FAB popup (agente non ancora attivo).

```json
{
  "action":           "add_collaborator",
  "collaborator_id":  "mkt",
  "agent_id":         "pm",
  "active_agents":    ["pm", "mkt"],
  "thread_id":        "thread_001",
  "user_id":          "123456789",
  "chat_id":          null,
  "lang":             "it"
}
```

> 📌 Risposta non attesa (fire-and-forget, `showReply = false`).

---

### `remove_collaborator` — Rimuove agente collaboratore

**Trigger:** L'utente preme `×` sul chip di un agente nella barra collaboratori.

```json
{
  "action":           "remove_collaborator",
  "collaborator_id":  "mkt",
  "agent_id":         "pm",
  "active_agents":    ["pm"],
  "thread_id":        "thread_001",
  "user_id":          "123456789",
  "chat_id":          null,
  "lang":             "it"
}
```

> 📌 Risposta non attesa (fire-and-forget, `showReply = false`).

---

### `create_thread` — Crea nuovo thread

**Trigger:** L'utente preme "+ Nuova Discussione".

```json
{
  "action":      "create_thread",
  "thread_id":   "thread_1743591234567",
  "agent_id":    "pm",
  "active_agents":["pm"],
  "thread_id":   "thread_1743591234567",
  "user_id":     "123456789",
  "chat_id":     null,
  "lang":        "it"
}
```

> 📌 Risposta non attesa (fire-and-forget, `showReply = false`).

---

### `load_thread` — Carica thread esistente

**Trigger:** L'utente seleziona un thread dall'archivio.

```json
{
  "action":      "load_thread",
  "agent_id":    "pm",
  "active_agents":["pm"],
  "thread_id":   "thread_001",
  "user_id":     "123456789",
  "chat_id":     null,
  "lang":        "it"
}
```

> 📌 Risposta non attesa (fire-and-forget, `showReply = false`).

---

### `rename_thread` — Rinomina thread

**Trigger:** L'utente tocca il titolo nell'header e inserisce un nuovo nome.

```json
{
  "action":      "rename_thread",
  "new_name":    "Riunione settimanale",
  "agent_id":    "pm",
  "active_agents":["pm"],
  "thread_id":   "thread_001",
  "user_id":     "123456789",
  "chat_id":     null,
  "lang":        "it"
}
```

> 📌 Risposta non attesa (fire-and-forget, `showReply = false`).

---

## 6. Azioni verso WH_SOLVER

> ⚠️ Questa chiamata è effettuata **da `solver.html`**, non da `assistant.html`.
> Documentata qui per completezza del flusso. Vedi `docs/solver.md` per dettagli.

`assistant.html` **riceve** il risultato tramite `postMessage` dopo che `solver.html` ha completato l'invio al webhook.

---

## 7. Risposte attese dal backend

### Risposta standard — `npl_chat` / `npl_voice`

Il backend risponde con un JSON. Tutti i campi sono opzionali tranne `reply`.

```json
{
  "reply":    "Testo della risposta dell'agente AI",
  "agent_id": "pm",
  "rationale": {
    "conclusion": "Breve riepilogo della decisione presa.",
    "steps": [
      "Analisi del contesto della richiesta.",
      "Identificazione del dominio di competenza.",
      "Selezione della risposta ottimale."
    ]
  },
  "audio_base64": "<base64 audio/webm opzionale per risposta vocale>",
  "threads": [
    {
      "id":    "thread_001",
      "name":  "Discussione Attiva",
      "agent": "pm",
      "date":  "02/04/2026"
    }
  ]
}
```

#### Comportamento per campo

| Campo           | Obbligatorio | Comportamento se presente                                        |
|-----------------|:------------:|------------------------------------------------------------------|
| `reply`         | ✅           | Mostrato come messaggio AI in chat                               |
| `agent_id`      | ❌           | Sovrascrive l'agente di default per il badge sul messaggio       |
| `rationale`     | ❌           | Salvato in `lastRationale`, usato nel tab Razionale dell'Insight |
| `audio_base64`  | ❌           | Riprodotto automaticamente come `audio/webm`                     |
| `threads`       | ❌           | Aggiorna la lista thread locali e il drawer archivio             |

---

### Risposta in caso di errore HTTP (non 2xx)

```json
// Nessun body richiesto — il frontend mostra:
"⚠️ Errore di connessione. Riprova."
```

---

## 8. postMessage — comunicazione solver → assistant

Quando `solver.html` (caricato nell'`<iframe>` di `#solver-overlay`) completa con successo l'invio del percorso al webhook, notifica il parent con:

### Messaggio inviato da `solver.html`
```javascript
window.parent.postMessage({
  type:    'SOLVER_RESULT',
  payload: { /* dati percorso */ }
}, '*');
```

### Struttura completa del payload
```json
{
  "type": "SOLVER_RESULT",
  "payload": {
    "Partenza":              "Sede",
    "Arrivo":               "Sede",
    "TipoPercorso":         "interessi",
    "TappeIntermedie":      "Tappa 1, Tappa 2",
    "Dettagli":             "Visita clienti zona nord",
    "DataAppuntamento":     null,
    "PernottamentoIncluso": false,
    "Notti":                null,
    "Adulti":               null,
    "Bambini":              null
  }
}
```

### Comportamento in `assistant.html` alla ricezione

1. Chiude `#solver-overlay`
2. Resetta l'`<iframe>` (`src = ''`)
3. Compone un messaggio di contesto strutturato e lo inserisce in chat come **messaggio dell'utente**
4. Invia automaticamente il messaggio al backend tramite `npl_chat` verso tutti gli agenti attivi

### Esempio messaggio inserito in chat
```
🚗 Percorso pianificato:
• Da: Sede → A: Sede
• Tipo: interessi
• Tappe: Tappa 1, Tappa 2
• Note: Visita clienti zona nord
```

---

## 9. Agenti disponibili (AGENT_META)

| ID    | Label             | Short  | Colore    | Icona FontAwesome     |
|-------|-------------------|--------|-----------|------------------------|
| `pm`  | 🛠️ Gestione Lavori | PM     | `#212D67` | `fas fa-tasks`         |
| `mkt` | 🚀 Vendite & Promo  | MKT    | `#e67e22` | `fas fa-bullhorn`      |
| `hr`  | 🛡️ Team & Sicurezza | HR     | `#27ae60` | `fas fa-shield-alt`    |
| `acc` | 💰 Cassa & Conti   | CONTI  | `#8e44ad` | `fas fa-wallet`        |

---

## 10. Flusso UX completo

### Chat testuale
```
Utente digita → [Enter / Bottone Invia]
  → addMessage('user', testo)
  → Per ogni agente in activeAgents:
      → callApi(WH_CHAT, { action: 'npl_chat', message: testo }, true, agentId)
        → Mostra loading bubble
        → Riceve risposta → addMessage('ai', reply, false, agentId)
        → Se rationale → salva in lastRationale
        → Se audio_base64 → playAudio()
        → Se threads → aggiorna lista
```

### Aggiunta collaboratore
```
Utente apre FAB → seleziona agente non attivo
  → addAgentToChat(agentId)
    → activeAgents.push(agentId)
    → renderAgentBar()   ← mostra barra chip
    → addMessage('ai', 'Ciao! Sono...', false, agentId)  ← messaggio benvenuto locale
    → callApi(WH_CHAT, { action: 'add_collaborator' }, false, agentId)
```

### Gestione Percorsi
```
Utente apre FAB → tocca "Gestione Percorsi"
  → closeFabMenu()
  → solver-overlay.classList.add('active')
  → iframe.src = 'solver.html?lang=it&chatId=...&threadId=...'
    [utente compila e invia il form in solver.html]
  ← window.postMessage({ type: 'SOLVER_RESULT', payload: {...} })
  → closeSolver()
  → assembla testo contesto
  → addMessage('user', testoContesto)
  → callApi(WH_CHAT, { action: 'npl_chat', message: testoContesto }, true, agentId)
```

### Insight Drawer
```
Utente swipe-up dalla chat (o tocca handle)
  → openInsightDrawer()
    → buildTrace()      ← timeline da chatLog[]
    → buildSummary()    ← raggruppa per agentId
    → buildRationale()  ← usa lastRationale o genera locale
```

---

## 11. Gestione errori

| Scenario                        | Comportamento frontend                                      |
|---------------------------------|-------------------------------------------------------------|
| HTTP non 2xx                    | Rimuove loading bubble, mostra `⚠️ Errore di connessione.`  |
| Risposta non JSON valido        | Usa `res.text()` come `reply` grezzo                        |
| Microfono non disponibile       | Messaggio `Microfono non disponibile` + `tg.showAlert()`    |
| Solver overlay chiuso manuale   | `iframe.src = ''` per liberare risorse                      |
| `postMessage` type sconosciuto  | Ignorato silenziosamente                                    |
