# 🤝 Customer Handshake Flow

## Overview

Il sistema di **Secure Handshake** è il punto di ingresso per i clienti che si connettono tramite QR Code o Smart Link generato dall'operatore. Simula un flusso OAuth-style con Telegram (prioritario), Google e Apple come Identity Providers.

---

## 📍 User Journey

### Step 1: Operatore Genera Invito
1. Operatore apre `operator_task_create.html`
2. Clicca "Nuovo Cliente" → Digital Handshake
3. Sistema genera:
   - **Token**: `IT06988830821_2041408875_1734424703000_k7m9x3q1`
   - **Smart Link**: `https://simonaiit.github.io/SiteBoS-MiniApp/customer/securehandshake.html?invite=...`
   - **QR Code** (contenente lo stesso link)

### Step 2: Cliente Accede
1. Cliente scannerizza QR o clicca Smart Link
2. Atterra su `securehandshake.html?invite=TOKEN`
3. Vede:
   - Titolo: "Benvenuto"
   - Sottotitolo: "Connettiti in modo sicuro"
   - Operatore info: "Operatore #8875" (estratto dal token)
   - 3 bottoni OAuth:
     - 🔵 **Telegram** (primario)
     - ⚪ **Google**
     - ⚫ **Apple**

### Step 3: Selezione Identity Provider
1. Cliente clicca uno dei 3 bottoni
2. Feedback immediato:
   - **Visivo**: Bottone in loading state
   - **Aptico**: Vibrazione 50ms
3. Sistema simula OAuth flow (1.5s delay)
4. Estrae identity mock:
   - **Nome**: Mario
   - **Cognome**: Rossi
   - **User ID**: 999888777
   - **Provider**: telegram
   - **Email/Phone**: (dipende dal provider)

### Step 4: Connessione Stabilita
1. Sistema crea `customer_session`:
   ```json
   {
     "firstName": "Mario",
     "lastName": "Rossi",
     "userId": "999888777",
     "provider": "telegram",
     "linkedOperatorId": "2041408875",
     "linkedVatId": "IT06988830821",
     "inviteToken": "IT06988830821_2041408875_...",
     "connectedAt": "2025-12-17T08:45:00.000Z",
     "gdprConsent": true
   }
   ```

2. Persist in `sessionStorage`

3. Notifica webhook:
   - **Action**: `customer_connected`
   - **Payload**: customer data + operator linkage

4. Mostra success screen:
   - ✅ Icon
   - "Connesso!"
   - Nome utente
   - Spinner

5. Redirect a `customer_dashboard.html?invite=TOKEN` (1.5s delay)

### Step 5: Dashboard Cliente
1. Carica session da `sessionStorage`
2. Valida presenza session
3. Mostra:
   - Welcome message con nome
   - Avatar con iniziale
   - Provider badge (Telegram/Google/Apple)
   - Operatore collegato
   - Data/ora connessione
   - Azioni rapide (placeholder)
   - Debug session info

---

## 🔑 Token Structure

### Format
```
VAT_ID + _ + OPERATOR_ID + _ + TIMESTAMP + _ + RANDOM
```

### Esempio Reale
```
IT06988830821_2041408875_1734424703000_k7m9x3q1
```

### Componenti
- **VAT_ID**: `IT06988830821` - Partita IVA azienda
- **OPERATOR_ID**: `2041408875` - Telegram Chat ID operatore
- **TIMESTAMP**: `1734424703000` - Milliseconds epoch (per scadenza)
- **RANDOM**: `k7m9x3q1` - Anti-collision string

### Decoding Function
```javascript
function decodeInviteToken(token) {
    const parts = token.split('_');
    return {
        vatId: parts[0],
        operatorId: parts[1],
        timestamp: parseInt(parts[2]),
        randomStr: parts[3],
        fullToken: token
    };
}
```

---

## 💾 Session Persistence

### Storage Location
`sessionStorage.customer_session` (JSON string)

### Structure
```javascript
{
  // User Identity (from OAuth provider)
  firstName: string,
  lastName: string,
  userId: string,
  provider: 'telegram' | 'google' | 'apple',
  email: string | null,
  phone: string | null,
  
  // Operator Linkage (from invite token)
  linkedOperatorId: string,
  linkedVatId: string,
  inviteToken: string,
  
  // Metadata
  connectedAt: ISO8601 string,
  gdprConsent: boolean
}
```

### Lifecycle
- **Created**: Dopo OAuth flow su `securehandshake.html`
- **Read**: Da `customer_dashboard.html` e future customer pages
- **Updated**: Quando customer completa profilo/aggiunge dati
- **Cleared**: Logout esplicito

---

## 📡 Webhook Notification

### Endpoint
```
POST https://trinai.api.workflow.dcmake.it/webhook/9d094742-eaca-41e1-b4e9-ee0627ffa285
```

### Payload
```json
{
  "action": "customer_connected",
  "session_id": "IT06988830821_2041408875_1734424703000_k7m9x3q1",
  "operator_id": "2041408875",
  "vat_id": "IT06988830821",
  "customer": {
    "firstName": "Mario",
    "lastName": "Rossi",
    "userId": "999888777",
    "provider": "telegram",
    "email": null,
    "phone": "+393331234567",
    "connectedAt": "2025-12-17T08:45:00.000Z",
    "gdprConsent": true
  }
}
```

### Expected Response
```json
{
  "success": true,
  "customer_id": "CL_001",
  "message": "Customer registered successfully"
}
```

### Fallback
Se webhook fallisce, il flusso utente **NON viene bloccato**. La connessione viene salvata localmente e può essere sincronizzata in seguito.

---

## 🎨 UI/UX Design Decisions

### Color Scheme
- **Telegram Button**: Blue gradient `#0088cc` → `#0077b5` (Brand color)
- **Google Button**: White with border `#dadce0` (Official Google style)
- **Apple Button**: Pure black `#000000` (Apple HIG)

### Interaction Feedback
1. **Visual**:
   - Button scale down on press (0.98)
   - Loading state con pulse animation
   - Icona provider animata

2. **Haptic**:
   - Click: 50ms vibration
   - Success: 100ms-50ms-100ms pattern

3. **Audio**: (Future) Suono click/success

### Typography
- **Header**: 28px bold
- **Body**: 16px regular
- **Buttons**: 16px semibold
- **Caption**: 13px regular

### Spacing
- Bottoni: 15px gap verticale
- Sezioni: 40px margin-top
- Container: Centrato verticalmente su viewport

---

## 🔒 Security & Privacy

### GDPR Compliance
- **Consent**: Implicito al click del bottone OAuth
- **Notice**: Visibile sotto i bottoni
- **Data**: Memorizzata solo localmente fino a sync con webhook

### Token Expiration
- **Validity**: 24 ore dal timestamp
- **Check**: Su load di `customer_dashboard.html`
- **Expired Action**: Redirect a errore / richiesta nuovo link

### Session Security
- **Storage**: `sessionStorage` (cancellato alla chiusura tab)
- **Transport**: HTTPS only
- **Validation**: Presenza di tutti i campi required

---

## 🚀 Future OAuth Integration

### Telegram Login Widget
```html
<script async src="https://telegram.org/js/telegram-widget.js?22" 
        data-telegram-login="YOUR_BOT_USERNAME" 
        data-size="large" 
        data-auth-url="https://your-backend.com/auth/telegram" 
        data-request-access="write"></script>
```

### Google OAuth 2.0
```javascript
gapi.load('auth2', function() {
  const auth2 = gapi.auth2.init({
    client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
  });
  
  auth2.signIn().then(googleUser => {
    const profile = googleUser.getBasicProfile();
    const firstName = profile.getGivenName();
    const lastName = profile.getFamilyName();
    const email = profile.getEmail();
    // ... persist to session
  });
});
```

### Apple Sign In
```javascript
AppleID.auth.init({
  clientId: 'YOUR_APPLE_CLIENT_ID',
  scope: 'name email',
  redirectURI: 'https://simonaiit.github.io/SiteBoS-MiniApp/customer/callback.html',
  usePopup: true
});

AppleID.auth.signIn().then(response => {
  const { id_token, user } = response.authorization;
  // ... decode JWT and persist
});
```

---

## 📝 Files Structure

```
customer/
├── securehandshake.html       # Entry point (OAuth buttons)
├── securehandshake_logic.js   # Identity extraction & session creation
├── customer_dashboard.html     # Landing page after connection
├── session_utils.js            # Shared session management
└── HANDSHAKE_FLOW.md           # This documentation
```

---

## ✅ Testing Checklist

- [ ] Token parsing corretto (VAT, OperatorID, Timestamp)
- [ ] Operatore info display su handshake page
- [ ] Click Telegram → Identity extraction
- [ ] Click Google → Identity extraction
- [ ] Click Apple → Identity extraction
- [ ] Session persist in sessionStorage
- [ ] Webhook notification inviata
- [ ] Webhook failure non blocca flusso
- [ ] Redirect a dashboard con token in URL
- [ ] Dashboard carica session e mostra dati
- [ ] Avatar con iniziale corretta
- [ ] Provider badge corretto
- [ ] Timestamp formattato in italiano
- [ ] Session debug funzionante
- [ ] Token scaduto → Errore
- [ ] Token mancante → Errore
- [ ] Haptic feedback su dispositivi mobile

---

## 💡 Best Practices

1. **Sempre** includere `session_utils.js` nelle pagine customer
2. **Mai** hardcodare dati utente - sempre da session
3. **Sempre** validare session su ogni page load
4. **Mai** bloccare UX se webhook fallisce
5. **Sempre** mostrare feedback visivo/aptico immediato
6. **Mai** esporre token completo in UI (solo ultimi 4 char)
7. **Sempre** testare con token scaduto
8. **Mai** assumere che sessionStorage persista tra sessioni

---

## 👥 User Personas

### Persona 1: "Tech-Savvy Mario"
- **Device**: iPhone 15 Pro
- **Provider**: Telegram (già installato)
- **Flow**: QR Scan → 1-tap Telegram → Dashboard (< 10s)

### Persona 2: "Traditional Anna"
- **Device**: Samsung A54
- **Provider**: Google (account già loggato Chrome)
- **Flow**: Smart Link via WhatsApp → 1-tap Google → Dashboard (< 15s)

### Persona 3: "Privacy-Focused Giuseppe"
- **Device**: iPhone 14
- **Provider**: Apple (Sign in with Apple)
- **Flow**: QR Scan → Face ID confirmation → Dashboard (< 12s)
