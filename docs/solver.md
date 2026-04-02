# solver.html — Documentazione API & Comportamento

> **Versione:** 2.0 · **Aggiornato:** 2026-04-02  
> **Modalità:** Standalone (Telegram WebApp) + Embedded (`<iframe>` in `assistant.html`)  
> **Webhook:** `WH_SOLVER`

---

## Indice

1. [Panoramica](#1-panoramica)
2. [Parametri URL](#2-parametri-url)
3. [Costante Webhook](#3-costante-webhook)
4. [Campi del form](#4-campi-del-form)
5. [Payload inviato a WH_SOLVER](#5-payload-inviato-a-wh_solver)
6. [Risposta attesa da WH_SOLVER](#6-risposta-attesa-da-wh_solver)
7. [postMessage verso assistant.html](#7-postmessage-verso-assistanthtml)
8. [Logica di validazione form](#8-logica-di-validazione-form)
9. [Internazionalizzazione](#9-internazionalizzazione)
10. [Comportamento UI per stato](#10-comportamento-ui-per-stato)

---

## 1. Panoramica

`solver.html` è la pagina di pianificazione percorsi. Può essere usata:

- **Standalone** → aperta direttamente come Telegram WebApp (`tg.close()` al completamento)
- **Embedded** → caricata in un `<iframe>` dentro `assistant.html`; al completamento usa `postMessage` per passare i dati al parent e il parent chiude l'overlay

La detection embedded/standalone avviene verificando `window.parent !== window`.

---

## 2. Parametri URL

| Parametro  | Tipo     | Default | Descrizione                                        |
|------------|----------|---------|----------------------------------------------------|
| `lang`     | `string` | `it`    | Lingua dell'interfaccia (it, en, fr, de, es, pt)   |
| `chatId`   | `string` | `null`  | ID chat Telegram — incluso nel payload al webhook  |
| `threadId` | `string` | `null`  | ID thread attivo in `assistant.html`               |

**Esempio:**
```
solver.html?lang=it&chatId=123456789&threadId=thread_001
```

---

## 3. Costante Webhook

```javascript
const WH_SOLVER = "https://trinai.api.workflow.dcmake.it/webhook/a0b6b2cb-4e19-4a92-9269-6b6d8a7afb80";
```

---

## 4. Campi del form

### Sezione Itinerario

| Campo ID               | Tipo       | Default  | Descrizione                              |
|------------------------|------------|----------|------------------------------------------|
| `partenzaDaSede`       | `checkbox` | ✅ checked | Partenza dal punto fisso "Sede"           |
| `partenza`             | `text`     | —        | Punto di partenza custom (se non sede)   |
| `arrivoInSede`         | `checkbox` | ✅ checked | Arrivo al punto fisso "Sede"              |
| `arrivo`               | `text`     | —        | Punto di arrivo custom (se non sede)     |

### Sezione Scopo

| Campo ID                     | Tipo    | Default       | Descrizione                              |
|------------------------------|---------|---------------|------------------------------------------|
| `tripType` (radio)           | `radio` | `interessi`   | Tipo percorso: `interessi` o `appuntamenti` |
| `dataAppuntamento`           | `date`  | —             | Data (visibile solo se `appuntamenti`)   |
| `midpoint`                   | `text`  | —             | Tappe intermedie (visibile se `interessi`) |
| `dettagli`                   | `textarea` | —          | Note libere / elenco interessi           |

### Sezione Logistica

| Campo ID               | Tipo     | Default | Descrizione                    |
|------------------------|----------|---------|--------------------------------|
| `includeTripDetails`   | `checkbox` | ❌     | Abilita pernottamento          |
| `notti`                | `number` | `1`     | Numero notti (se pernottamento) |
| `adulti`               | `number` | `2`     | Numero adulti                  |
| `bambini`              | `number` | `0`     | Numero bambini                 |

---

## 5. Payload inviato a WH_SOLVER

Al submit del form viene inviata una `POST` a `WH_SOLVER` con `Content-Type: application/json`.

### Struttura completa

```json
{
  "type": "TRIP_PLANNING_SUBMISSION",
  "payload": {
    "Partenza":              "Sede",
    "Arrivo":               "Sede",
    "TipoPercorso":         "interessi",
    "TappeIntermedie":      "Tappa 1, Tappa 2",
    "Dettagli":             "Visita zona industriale nord",
    "DataAppuntamento":     null,
    "PernottamentoIncluso": false,
    "Notti":                null,
    "Adulti":               null,
    "Bambini":              null
  },
  "context": {
    "chatId":   "123456789",
    "threadId": "thread_001",
    "language": "it",
    "user_id":  "987654321"
  }
}
```

### Esempi per scenario

#### Percorso per appuntamento con pernottamento
```json
{
  "type": "TRIP_PLANNING_SUBMISSION",
  "payload": {
    "Partenza":              "Via Roma 1, Milano",
    "Arrivo":               "Sede",
    "TipoPercorso":         "appuntamenti",
    "TappeIntermedie":      null,
    "Dettagli":             "Cliente Rossi - Firma contratto",
    "DataAppuntamento":     "2026-04-15",
    "PernottamentoIncluso": true,
    "Notti":                2,
    "Adulti":               2,
    "Bambini":              0
  },
  "context": {
    "chatId":   "123456789",
    "threadId": "thread_001",
    "language": "it",
    "user_id":  "987654321"
  }
}
```

#### Percorso per interessi senza pernottamento
```json
{
  "type": "TRIP_PLANNING_SUBMISSION",
  "payload": {
    "Partenza":              "Sede",
    "Arrivo":               "Sede",
    "TipoPercorso":         "interessi",
    "TappeIntermedie":      "Fiera Milano, Centro Commerciale Sarca",
    "Dettagli":             "Sopralluogo potenziali clienti retail",
    "DataAppuntamento":     null,
    "PernottamentoIncluso": false,
    "Notti":                null,
    "Adulti":               null,
    "Bambini":              null
  },
  "context": {
    "chatId":   null,
    "threadId": null,
    "language": "it",
    "user_id":  null
  }
}
```

### Valori dei campi in dettaglio

| Campo                | Tipo      | Valore quando sede selezionata | Valore quando personalizzato  |
|----------------------|-----------|-------------------------------|-------------------------------|
| `Partenza`           | `string`  | `"Sede"`                      | Testo inserito dall'utente    |
| `Arrivo`             | `string`  | `"Sede"`                      | Testo inserito dall'utente    |
| `TipoPercorso`       | `string`  | —                             | `"interessi"` o `"appuntamenti"` |
| `TappeIntermedie`    | `string\|null` | —                        | Stringa o `null`              |
| `Dettagli`           | `string\|null` | —                        | Stringa o `null`              |
| `DataAppuntamento`   | `string\|null` | —                        | Formato `YYYY-MM-DD` o `null` |
| `PernottamentoIncluso` | `boolean` | —                           | `true` o `false`              |
| `Notti`              | `number\|null` | —                        | Intero o `null`               |
| `Adulti`             | `number\|null` | —                        | Intero o `null`               |
| `Bambini`            | `number\|null` | —                        | Intero o `null`               |

---

## 6. Risposta attesa da WH_SOLVER

Il webhook non necessita di restituire un body specifico. `solver.html` valuta solo lo **status HTTP**.

| Status HTTP | Comportamento frontend                                       |
|-------------|--------------------------------------------------------------|
| `2xx`       | Bottone diventa verde ✓ → `postMessage` al parent → chiude  |
| Non `2xx`   | Bottone ripristinato → `tg.showAlert()` con messaggio errore |

> Il backend può comunque restituire JSON, ma `solver.html` lo ignora.  
> Il risultato viene comunicato ad `assistant.html` tramite `postMessage` (§7),  
> che poi opzionalmente lo invia a `WH_CHAT` con `action: npl_chat`.

---

## 7. postMessage verso assistant.html

Se `solver.html` è caricato in un `<iframe>` (modalità embedded), al successo invia:

```javascript
window.parent.postMessage(
  {
    type:    'SOLVER_RESULT',
    payload: { /* stessi dati del payload inviato al webhook */ }
  },
  '*'
);
```

### Payload completo del postMessage

```json
{
  "type": "SOLVER_RESULT",
  "payload": {
    "Partenza":              "Sede",
    "Arrivo":               "Sede",
    "TipoPercorso":         "interessi",
    "TappeIntermedie":      "Tappa 1, Tappa 2",
    "Dettagli":             "Note percorso",
    "DataAppuntamento":     null,
    "PernottamentoIncluso": false,
    "Notti":                null,
    "Adulti":               null,
    "Bambini":              null
  }
}
```

### Timing della sequenza

```
solver.html: fetch(WH_SOLVER) → risposta 2xx
  → setTimeout 300ms (animazione ✓)
  → window.parent.postMessage({ type: 'SOLVER_RESULT', payload })

assistant.html: window.addEventListener('message', handler)
  → verifica e.data.type === 'SOLVER_RESULT'
  → closeSolver()         ← chiude overlay
  → assembla testo
  → addMessage('user', testo)
  → callApi(WH_CHAT, { action: 'npl_chat', message: testo })
```

---

## 8. Logica di validazione form

Il bottone Submit è **disabilitato** finché tutti i campi con `required` non hanno un valore.

### Campi `required` dinamici

| Condizione                              | Campo che diventa `required`                     |
|-----------------------------------------|--------------------------------------------------|
| `partenzaDaSede` deselezionato          | `#partenza`                                      |
| `arrivoInSede` deselezionato            | `#arrivo`                                        |
| `tripType === 'appuntamenti'`           | `#dataAppuntamento`                              |
| `includeTripDetails` selezionato        | `#notti`, `#adulti`                              |

### Sezioni dinamiche (visibilità)

| Trigger                                 | Mostra                      | Nasconde                    |
|-----------------------------------------|-----------------------------|-----------------------------|
| `partenzaDaSede` → deselezionato        | `#customPartenzaContainer`  | —                           |
| `arrivoInSede` → deselezionato          | `#customArrivoContainer`    | —                           |
| `tripType` → `appuntamenti`             | `#dataAppuntamentoContainer`| `#midpointContainer`        |
| `tripType` → `interessi`                | `#midpointContainer`        | `#dataAppuntamentoContainer`|
| `includeTripDetails` → selezionato      | `#tripDetailsContainer`     | —                           |

---

## 9. Internazionalizzazione

Le traduzioni sono gestite tramite un oggetto `translations` inline. Le lingue supportate sono:

| Codice | Lingua     |
|--------|------------|
| `it`   | Italiano   |
| `en`   | English    |
| `fr`   | Français   |
| `de`   | Deutsch    |
| `es`   | Español    |
| `pt`   | Português  |

La lingua viene letta dal parametro URL `?lang=`. Se non presente o non riconosciuta, si usa `it` come fallback.

---

## 10. Comportamento UI per stato

| Stato                        | Bottone Submit                              | Comportamento                              |
|------------------------------|---------------------------------------------|--------------------------------------------|
| Form incompleto              | Disabilitato (opacity 0.45)                | Nessuna azione al click                    |
| Form valido                  | Abilitato (`background: var(--primary)`)    | Click → invia richiesta                    |
| Invio in corso               | Spinner `fa-circle-notch fa-spin`           | Disabilitato durante la chiamata           |
| Successo (HTTP 2xx)          | Verde ✓ `btn-success`                       | Chiude automaticamente dopo 300ms delay    |
| Errore (HTTP non 2xx)        | Ripristinato al testo originale             | `tg.showAlert()` con messaggio errore      |
