# solver.html — Documentazione API & Comportamento

> **Versione:** 3.0 (Bleisure Agenda Builder)  
> **Modalità:** Embedded (`<iframe>` in `assistant.html`)  
> **Webhook:** `WH_SOLVER`

---

## Indice

1. [Panoramica](#1-panoramica)
2. [Parametri URL](#2-parametri-url)
3. [Costante Webhook](#3-costante-webhook)
4. [Struttura UI e Campi Dinamici](#4-struttura-ui-e-campi-dinamici)
5. [Payload inviato a WH_SOLVER](#5-payload-inviato-a-wh_solver)
6. [Risposta attesa da WH_SOLVER](#6-risposta-attesa-da-wh_solver)
7. [Integrazione postMessage (assistant.html)](#7-integrazione-postmessage-assistanthtml)
8. [Logica di validazione e dinamismi](#8-logica-di-validazione-e-dinamismi)
9. [Comportamento UI per stato](#9-comportamento-ui-per-stato)

---

## 1. Panoramica

`solver.html` è il modulo avanzato di pianificazione itinerari e agende. Abbandona il concetto di singolo tragitto per abbracciare i viaggi multi-tappa misti (**Business + Leisure**).

L'utente definisce un punto di partenza/rientro globale e costruisce dinamicamente un'agenda aggiungendo N tappe. Per ogni tappa può definire se lo scopo è lavorativo o ricreativo, innescando "Smart Tags" specifici per istruire l'Intelligenza Artificiale (es. "Cerca prospect" vs "Suggerisci ristorante tipico").

---

## 2. Parametri URL

| Parametro  | Tipo     | Default | Descrizione                                        |
|------------|----------|---------|----------------------------------------------------|
| `lang`     | `string` | `it`    | Lingua dell'interfaccia (predisposizione)          |
| `chatId`   | `string` | `null`  | ID chat Telegram — passato nel context             |
| `threadId` | `string` | `null`  | ID thread attivo in `assistant.html`               |

**Esempio:**
```
solver.html?lang=it&chatId=123456789&threadId=thread_001
```

---

## 3. Costante Webhook

Il modulo invia la configurazione dell'agenda a questo endpoint su Make.com:

```javascript
const WH_SOLVER = "https://prod.workflow.trinai.it/webhook/26237ccb-3621-4dc7-b15f-fe8a50be3a6f";
```

---

## 4. Struttura UI e Campi Dinamici

Il form è diviso in 3 macro-sezioni.

### A. Base Logistica (Inizio/Fine)
*   **Partenza da Sede** (Checkbox): Se disattivato, richiede inserimento testuale (es. "Milano Centrale").
*   **Rientro in Sede** (Checkbox): Se disattivato, richiede inserimento testuale.

### B. Agenda (Tappe Dinamiche)
L'utente può aggiungere infinite card "Tappa". Ogni card contiene:
*   **Scopo Tappa** (Radio Toggle): `Lavoro` o `Tempo Libero`.
*   **Data** (`date`, required).
*   **Fascia/Ora** (`text`, required): Accetta orari (14:30) o descrittori (Pomeriggio).
*   **Luogo** (`text`, required): Indirizzo o città.
*   **Durata** (`select`): 1h, 2h, Mezza Giornata, Veloce.
*   **Dettaglio/Note** (`text`): Cambia placeholder in base allo scopo.
*   **Smart Tags** (Pillole cliccabili):
    *   *Se Lavoro:* Cerca prospect, Bar per lavorare, Trova parcheggio.
    *   *Se Tempo Libero:* Cibo locale, Arte/Storia, Natura, Relax.

### C. A.I. Globale
Impostazioni che si applicano a tutto l'itinerario:
*   **Ottimizza Tragitto** (Checkbox): Istruisce l'AI a calcolare i tempi di viaggio ottimali.
*   **Pianifica Pernottamento/Pasti** (Checkbox): Istruisce l'AI a trovare hotel/ristoranti.
*   **Direttive Extra** (`textarea`): Note libere (es. "Dieta vegetariana", "Usa treno").

---

## 5. Payload inviato a WH_SOLVER

Al submit, viene inviata una `POST` con `Content-Type: application/json`. L'array `Agenda` conterrà tanti oggetti quante sono le tappe create dall'utente.

### Esempio di Payload (Itinerario Misto Lavoro/Tempo Libero)

```json
{
  "type": "AGENDA_MIXED_SUBMISSION",
  "payload": {
    "Partenza": "Sede",
    "Arrivo": "Stazione Termini, Roma",
    "Agenda": [
      {
        "tappa_numero": 1,
        "tipo_tappa": "Lavoro",
        "data": "2026-05-10",
        "fascia_oraria": "09:30",
        "luogo": "Firenze, Viale dei Mille",
        "durata": "2h",
        "dettagli": "Meeting Cliente Alpha",
        "richieste_ai": [
          "Trova prospect o clienti potenziali in zona",
          "Cerca parcheggio comodo per appuntamento"
        ]
      },
      {
        "tappa_numero": 2,
        "tipo_tappa": "Tempo Libero",
        "data": "2026-05-10",
        "fascia_oraria": "Pomeriggio",
        "luogo": "Firenze Centro Storico",
        "durata": "Mezza Giornata",
        "dettagli": "Voglio rilassarmi prima di ripartire",
        "richieste_ai": [
          "Consiglia Ristoranti tipici o osterie locali",
          "Cosa vedere: monumenti storici o musei"
        ]
      }
    ],
    "AI_Config_Globale": {
      "ottimizza_percorso": true,
      "pianifica_logistica": true,
      "direttive_extra": "Ho una macchina elettrica, cerca colonnine."
    }
  },
  "context": {
    "chatId": "123456789",
    "threadId": "thread_001",
    "user_id": "987654321"
  }
}
```

---

## 6. Risposta attesa da WH_SOLVER

Il frontend non legge il body JSON della risposta, valuta unicamente lo **Status Code HTTP**:

*   **HTTP 2xx (Successo):** Il bottone cambia stato (verde, "Affidato all'A.I.").
*   **HTTP 4xx/5xx (Errore):** L'invio viene annullato, il bottone torna normale e viene mostrato un `tg.showAlert()` nativo di Telegram.

---

## 7. Integrazione postMessage (assistant.html)

Per funzionare in modo fluido come popup, `solver.html` non esegue ricaricamenti. 
Dopo **1200ms** dalla ricezione del codice 200 dal Webhook, impacchetta un riassunto testuale (Markdown) e lo invia al documento genitore (`assistant.html`) tramite `postMessage`.

```javascript
window.parent.postMessage({
    type: 'SOLVER_DATA',
    payload: summary // Stringa Markdown pre-formattata
}, '*');
```

### Flusso Lato Assistant
L'`assistant.html` in ascolto:
1. Riceve l'evento `SOLVER_DATA`.
2. Chiude l'iframe (`#solver-overlay`).
3. Stampa il `payload` in chat grafica come fosse stato digitato dall'utente.
4. Inoltra silente la stringa al Webhook Chat (`WH_CHAT`) fornendo il contesto agli agenti attivi.

---

## 8. Logica di validazione e dinamismi

Il tasto **"Genera Itinerario Misto"** rimane disabilitato finché la validazione non è superata.

### Regole UI dinamiche
*   Ogni volta che si clicca "Aggiungi Tappa", il DOM genera una nuova Card con ID incrementale (`appt-1`, `appt-2`, ecc.).
*   Le card > 1 presentano un'icona "Cestino" per la rimozione dinamica.
*   Il cambio del selettore `Lavoro/Tempo Libero` nasconde i tag di una categoria e mostra quelli dell'altra, azzerando le selezioni precedenti di quella card.
*   Se la "Partenza da Sede" viene disabilitata, l'input testuale generato sottostante acquisisce automaticamente l'attributo `required`.

---

## 9. Comportamento UI per stato

| Stato | UI Bottone Submit | Azione/Comportamento |
| :--- | :--- | :--- |
| **Incompleto** | Opacity 50%, Disabilitato | Attende compilazione dei campi `required`. |
| **Pronto** | Attivo, Blu Scuro | Click scatena compilazione JSON e Fetch. |
| **Loading** | Spinner rotante + "Elaborazione A.I. in corso..." | Disabilita doppi click durante la POST. |
| **Successo** | Verde + "Itinerario Affidato all'A.I.!" | Attende 1.2 sec, spara `postMessage` e delega la chiusura al Parent. |
| **Errore HTTP**| Ripristinato stato iniziale ("Riprova Invio") | Alert nativo Telegram (`tg.showAlert`). |
