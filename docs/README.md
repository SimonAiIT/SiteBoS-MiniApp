# Documentazione TrinAI OS — Mini App

Benvenuto nella documentazione tecnica delle pagine principali della Mini App TrinAI per Telegram.

## File disponibili

| File | Pagina | Descrizione |
|------|--------|-------------|
| [`assistant.md`](./assistant.md) | `assistant.html` | Chat multi-agente, azioni webhook, collaboratori, insight drawer, integrazione solver |
| [`solver.md`](./solver.md) | `solver.html` | Pianificazione percorsi, payload form, postMessage verso assistant |

## Flusso di integrazione principale

```
Telegram Bot
    │
    │  apre WebApp
    ▼
assistant.html
    │  POST { action: 'npl_chat', message, agent_id, active_agents, thread_id, ... }
    ▼
WH_CHAT  (prod.workflow.trinai.it)
    │  risponde con { reply, agent_id, rationale?, audio_base64?, threads? }
    ▼
assistant.html  ← mostra messaggio in chat

assistant.html
    │  apre iframe
    ▼
solver.html
    │  POST { type: 'TRIP_PLANNING_SUBMISSION', payload, context }
    ▼
WH_SOLVER  (trinai.api.workflow.dcmake.it)
    │  risposta 2xx
    ▼
solver.html
    │  postMessage({ type: 'SOLVER_RESULT', payload })
    ▼
assistant.html  ← inserisce in chat e chiama WH_CHAT con il contesto percorso
```

## Webhook endpoints

| Nome       | URL                                                                                         | Usato da              |
|------------|---------------------------------------------------------------------------------------------|-----------------------|
| `WH_CHAT`  | `https://prod.workflow.trinai.it/webhook/81ab5292-43c3-4f93-afaf-7411b95fc010`             | `assistant.html`      |
| `WH_SOLVER`| `https://trinai.api.workflow.dcmake.it/webhook/a0b6b2cb-4e19-4a92-9269-6b6d8a7afb80`      | `solver.html`         |

## Agenti supportati

| ID    | Nome               | Dominio              |
|-------|--------------------|----------------------|
| `pm`  | Gestione Lavori    | Project Management   |
| `mkt` | Vendite & Promo    | Marketing            |
| `hr`  | Team & Sicurezza   | HR / Safety          |
| `acc` | Cassa & Conti      | Accounting           |
