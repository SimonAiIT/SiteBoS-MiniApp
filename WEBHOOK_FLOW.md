# 🔔 Event-Driven Handshake Flow

## Architecture Overview

**NO POLLING!** Sistema completamente event-driven con Custom JavaScript Events.

---

## 🎯 Flusso Completo

```
OPERATORE (operator_task_create.html)
  ↓ Genera QR
  ↓ POST → Webhook d253f855
  ↓ Action: "register_handshake"
  ↓ Mostra QR
  ↓ ASCOLTA custom event "customerConnected"
  ↓ STOP (nessun polling)

CLIENTE (securehandshake.html)
  ↓ Scannerizza QR
  ↓ Carica pagina
  ↓ POST → Webhook 9d094742
  ↓ Action: "customer_arrived"
  ↓ Click Telegram OAuth
  ↓ POST → Webhook 9d094742
  ↓ Action: "customer_connected"

WEBHOOK 9d094742 (Customer Side)
  ↓ Riceve "customer_connected"
  ↓ Salva dati customer
  ↓ POST → Webhook d253f855 (Operator Side)
  ↓ Action: "notify_operator"

WEBHOOK d253f855 (Operator Side)
  ↓ Riceve "notify_operator"
  ↓ TRIGGER JavaScript Event nell'app operatore
  ↓ window.triggerCustomerConnected(customerData)

OPERATORE (stessa pagina aperta)
  ↓ Event listener riceve evento
  ↓ Mostra "✅ Mario Rossi connesso!"
  ↓ FINE
```

---

## 📡 Webhook Endpoints

### 1️⃣ Webhook Operatore (d253f855)

**URL**: `https://trinai.api.workflow.dcmake.it/webhook/d253f855-ce1a-43ee-81aa-38fa11a9d639`

#### Azioni Gestite:

##### A) `register_handshake` (chiamata UNA VOLTA)

**Request**:
```json
POST /webhook/d253f855-ce1a-43ee-81aa-38fa11a9d639

{
  "action": "register_handshake",
  "operator_id": "2041408875",
  "vat": "IT06988830821",
  "session_id": "IT06988830821_2041408875_1734434567890_abc123",
  "smart_link": "https://simonaiit.github.io/SiteBoS-MiniApp/customer/securehandshake.html?invite=..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Handshake registered"
}
```

**Azione Backend**:
- Salva session_id in memoria/database
- Associa session_id a operator_id
- Preparati a ricevere notifica da webhook customer

---

##### B) `notify_operator` (chiamato da webhook 9d094742)

**Request** (dal webhook customer):
```json
POST /webhook/d253f855-ce1a-43ee-81aa-38fa11a9d639

{
  "action": "notify_operator",
  "session_id": "IT06988830821_2041408875_1734434567890_abc123",
  "operator_id": "2041408875",
  "customer": {
    "firstName": "Mario",
    "lastName": "Rossi",
    "userId": "999888777",
    "username": "mariorossi",
    "photoUrl": "https://t.me/i/userpic/320/...",
    "provider": "telegram",
    "arrivedAt": "2025-12-17T10:55:00.000Z",
    "connectedAt": "2025-12-17T10:55:15.000Z"
  }
}
```

**Azione Backend CRITICA**:

🔔 **TRIGGER JavaScript Event nell'app operatore!**

Ci sono 2 modi:

---

### 🎯 Metodo 1: Telegram WebApp Data (MIGLIORE)

Usa l'API Telegram per inviare dati all'app:

```javascript
// Nel tuo backend Node.js/Python/etc
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(BOT_TOKEN);

// Quando ricevi notify_operator:
const operatorChatId = request.body.operator_id; // "2041408875"
const customerData = request.body.customer;

// Invia messaggio inline button che triggera l'evento
bot.sendMessage(operatorChatId, '✅ Cliente connesso!', {
  reply_markup: {
    inline_keyboard: [[
      {
        text: 'Visualizza Cliente',
        web_app: {
          url: `https://simonaiit.github.io/SiteBoS-MiniApp/operators/operator_task_create.html?chat_id=${operatorChatId}&vat=IT06988830821&event=customerConnected&data=${encodeURIComponent(JSON.stringify(customerData))}`
        }
      }
    ]]
  }
});
```

Poi nell'app operatore, al caricamento:

```javascript
// In operator_task_create_logic.js (già implementato)
const eventParam = urlParams.get('event');
const dataParam = urlParams.get('data');

if (eventParam === 'customerConnected' && dataParam) {
  const customerData = JSON.parse(decodeURIComponent(dataParam));
  window.triggerCustomerConnected(customerData);
}
```

---

### 🎯 Metodo 2: Server-Sent Events (SSE)

Se l'operatore mantiene la pagina aperta:

```javascript
// Backend: Mantieni connessione SSE
app.get('/events/:operator_id', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Salva la connessione
  const operatorId = req.params.operator_id;
  connections[operatorId] = res;
  
  req.on('close', () => {
    delete connections[operatorId];
  });
});

// Quando ricevi notify_operator:
const operatorConnection = connections[request.body.operator_id];
if (operatorConnection) {
  operatorConnection.write(`data: ${JSON.stringify({
    event: 'customerConnected',
    customer: request.body.customer
  })}\n\n`);
}
```

Frontend:

```javascript
// In operator_task_create_logic.js
const eventSource = new EventSource(`https://your-backend.com/events/${operatorSession.chat_id}`);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.event === 'customerConnected') {
    window.triggerCustomerConnected(data.customer);
  }
};
```

---

### 🎯 Metodo 3: PostMessage Bridge (FALLBACK)

Se usi iframe o popup:

```javascript
// Backend ritorna HTML con script:
res.send(`
  <script>
    if (window.opener) {
      window.opener.postMessage({
        event: 'customerConnected',
        customer: ${JSON.stringify(customerData)}
      }, 'https://simonaiit.github.io');
      window.close();
    }
  </script>
`);

// Frontend listener:
window.addEventListener('message', (event) => {
  if (event.origin === 'https://your-backend.com') {
    if (event.data.event === 'customerConnected') {
      window.triggerCustomerConnected(event.data.customer);
    }
  }
});
```

---

## 📡 Webhook Cliente (9d094742)

**URL**: `https://trinai.api.workflow.dcmake.it/webhook/9d094742-eaca-41e1-b4e9-ee0627ffa285`

#### Azioni Gestite:

##### A) `customer_arrived` (page load)

**Request**:
```json
POST /webhook/9d094742-eaca-41e1-b4e9-ee0627ffa285

{
  "action": "customer_arrived",
  "session_id": "IT06988830821_2041408875_1734434567890_abc123",
  "operator_id": "2041408875",
  "vat_id": "IT06988830821",
  "arrived_at": "2025-12-17T10:55:00.000Z",
  "user_agent": "Mozilla/5.0...",
  "referrer": "direct"
}
```

**Azione Backend**:
- Salva timestamp arrived_at
- (Opzionale) Notifica operatore: "Cliente in arrivo..."

---

##### B) `customer_connected` (OAuth completo)

**Request**:
```json
POST /webhook/9d094742-eaca-41e1-b4e9-ee0627ffa285

{
  "action": "customer_connected",
  "session_id": "IT06988830821_2041408875_1734434567890_abc123",
  "operator_id": "2041408875",
  "vat_id": "IT06988830821",
  "customer": {
    "firstName": "Mario",
    "lastName": "Rossi",
    "userId": "999888777",
    "username": "mariorossi",
    "photoUrl": "https://t.me/i/userpic/320/...",
    "provider": "telegram",
    "email": null,
    "phone": null,
    "arrivedAt": "2025-12-17T10:55:00.000Z",
    "connectedAt": "2025-12-17T10:55:15.000Z",
    "gdprConsent": true,
    "telegramAuthDate": 1734434715,
    "telegramHash": "abc123def456..."
  }
}
```

**Azione Backend CRITICA**:

1. **Salva customer in database**
2. **CHIAMA webhook operatore** (d253f855):

```javascript
// Esempio Node.js
const axios = require('axios');

const response = await axios.post(
  'https://trinai.api.workflow.dcmake.it/webhook/d253f855-ce1a-43ee-81aa-38fa11a9d639',
  {
    action: 'notify_operator',
    session_id: request.body.session_id,
    operator_id: request.body.operator_id,
    customer: request.body.customer
  }
);
```

---

## 🔌 Funzioni JavaScript Esposte

Già implementate in `operator_task_create_logic.js`:

### `window.triggerCustomerConnected(customerData)`

```javascript
window.triggerCustomerConnected({
  firstName: 'Mario',
  lastName: 'Rossi',
  userId: '999888777',
  username: 'mariorossi',
  photoUrl: 'https://...',
  // ... altri campi
});
```

Triggera l'evento custom che mostra il cliente connesso.

### `window.triggerCustomerArrived(data)`

```javascript
window.triggerCustomerArrived({
  arrived_at: '2025-12-17T10:55:00.000Z'
});
```

Triggera l'evento "Cliente in arrivo...".

---

## ✅ Testing

### Test Manuale da Console Browser

1. Operatore apre `operator_task_create.html`
2. Click "Nuovo Cliente"
3. Nella console browser:

```javascript
// Simula evento customer connected
window.triggerCustomerConnected({
  firstName: 'Mario',
  lastName: 'Rossi',
  userId: '123456',
  username: 'mariorossi',
  photoUrl: 'https://via.placeholder.com/80',
  provider: 'telegram'
});
```

4. **DEVE mostrare**: ✅ Mario Rossi connesso + foto + bottone "Procedi"

---

## 🚀 Checklist Implementazione Backend

- [ ] Webhook d253f855 riceve `register_handshake`
- [ ] Salva session_id in memoria/DB
- [ ] Webhook 9d094742 riceve `customer_arrived`
- [ ] Salva timestamp arrived_at
- [ ] Webhook 9d094742 riceve `customer_connected`
- [ ] Salva customer in DB
- [ ] Chiama webhook d253f855 con `notify_operator`
- [ ] Webhook d253f855 triggera evento JavaScript (scegli metodo)
- [ ] Test con `window.triggerCustomerConnected()` da console
- [ ] Test con QR reale da mobile

---

## 💡 Raccomandazione

**METODO 1 (Telegram Bot Message)** è il MIGLIORE perché:
- Nativo Telegram
- Funziona anche se app chiusa
- Notifica push automatica
- Può riaprire app con dati già caricati

Implementa quello! 🎯
