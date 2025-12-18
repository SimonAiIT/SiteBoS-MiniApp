# Customer Session Architecture

## 📌 Source of Truth: URL Parameters

### Core Principle
**L'URL è la fonte di verità.** Tutti i dati di sessione devono essere estratti dai parametri URL e poi persistiti in `sessionStorage` per la navigazione successiva.

### Perché URL as Source of Truth?

1. **Shareable Links**: Il cliente può copiare/incollare l'URL e mantenere il contesto
2. **Deep Linking**: Accesso diretto a pagine specifiche con tutti i dati necessari
3. **State Reconstruction**: Refresh della pagina non perde lo stato
4. **Debugging**: Ispezione immediata dello stato tramite URL
5. **Offline-First**: Lo stato è sempre disponibile, anche senza connessione

---

## 🔑 Token Structure

### Invite Token Format
```
VAT_ID + _ + OPERATOR_ID + _ + TIMESTAMP + _ + RANDOM_STRING
```

### Esempio Reale
```
DEMO_VAT_123456789_1734423727000_x8k3m9q2
```

### Componenti
- **VAT_ID**: `DEMO_VAT` - Identificativo azienda (Partita IVA)
- **OPERATOR_ID**: `123456789` - ID operatore Telegram
- **TIMESTAMP**: `1734423727000` - Milliseconds epoch (per scadenza)
- **RANDOM_STRING**: `x8k3m9q2` - Stringa casuale (anti-collision)

### Parsing Function
```javascript
function parseInviteToken(token) {
    const parts = token.split('_');
    return {
        vatId: parts[0] + '_' + parts[1],
        operatorId: parts[2],
        timestamp: parseInt(parts[3]),
        randomStr: parts[4],
        fullToken: token
    };
}
```

---

## 💾 Persistence Layer: SessionStorage

### Quando Salvare
1. **Landing su `securehandshake.html`** con parametro `?invite=...`
2. **Dopo ogni aggiornamento** dello stato cliente (es. nome, email)
3. **Prima di ogni navigazione** verso altra pagina customer

### Struttura Dati Salvati
```javascript
{
    fullToken: "DEMO_VAT_123456789_1734423727000_x8k3m9q2",
    vatId: "DEMO_VAT",
    operatorId: "123456789",
    timestamp: 1734423727000,
    randomStr: "x8k3m9q2",
    customerId: "CL_001",          // Aggiunto dopo registrazione
    customerName: "Mario Rossi",   // Aggiunto dopo form
    lastAccess: "2025-12-17T08:23:00.000Z",
    gdprConsent: true
}
```

### Funzioni Utility
```javascript
// Persist
persistSession(sessionData);

// Retrieve
const session = getSession();

// Update (merge)
updateSession({ customerName: "Mario Rossi" });

// Clear (logout)
clearSession();
```

---

## 🧭 Navigation with Context

### ❌ SBAGLIATO (Perde il contesto)
```javascript
// NO! Il link non include la sessione
window.location.href = '../customer_hub.html';
```

### ✅ CORRETTO (Preserva il contesto)
```javascript
// YES! Include automaticamente invite token
navigateWithContext('../customer_hub.html');
```

### URL Generato
```
https://simonaiit.github.io/SiteBoS-MiniApp/customer_hub.html?invite=DEMO_VAT_123456789_1734423727000_x8k3m9q2
```

### Con Parametri Aggiuntivi
```javascript
navigateWithContext('../customer_order.html', { 
    order_id: 'ORD_123' 
});
```

### URL Generato
```
https://simonaiit.github.io/SiteBoS-MiniApp/customer_order.html?invite=DEMO_VAT_...&order_id=ORD_123
```

---

## 🔄 Flusso Completo

### Step 1: Landing (Handshake)
```
URL: securehandshake.html?invite=DEMO_VAT_123456789_1734423727000_x8k3m9q2

1. extractSessionFromUrl() → Estrae dati da URL
2. parseInviteToken() → Decodifica token
3. persistSession() → Salva in sessionStorage
4. Webhook notify → Avvisa operatore
```

### Step 2: Navigazione a Hub
```
User click "Vai alla Dashboard"

1. navigateWithContext('../customer_hub.html')
2. buildContextualUrl() → Costruisce URL con token
3. Redirect → customer_hub.html?invite=...
```

### Step 3: Caricamento Hub
```
URL: customer_hub.html?invite=DEMO_VAT_123456789_1734423727000_x8k3m9q2

1. initSession() → Legge URL
2. Se URL vuoto → Fallback a sessionStorage
3. requireSession() → Valida sessione o redirect
4. Mostra contenuti personalizzati
```

---

## 🛠️ Implementazione in Nuove Pagine Customer

### Template Base
```html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Pagina Cliente</title>
    <link rel="stylesheet" href="../styles.css">
    <!-- IMPORTANTE: Includere utility -->
    <script src="session_utils.js"></script>
</head>
<body>
    <div class="container">
        <h1>Contenuto Pagina</h1>
        <div id="customer-info"></div>
    </div>

    <script>
        // STEP 1: Inizializza sessione
        const session = initSession();
        
        // STEP 2: Richiedi sessione valida (o redirect)
        if (!requireSession()) {
            // User redirected to error page
            return;
        }
        
        // STEP 3: Usa dati sessione
        document.getElementById('customer-info').textContent = 
            `Operatore: ${session.operatorId}`;
        
        // STEP 4: Navigazione con contesto
        function goToOrders() {
            navigateWithContext('../customer_orders.html');
        }
    </script>
</body>
</html>
```

---

## ❓ FAQ

### Q: Cosa succede se l'utente fa refresh?
**A**: L'URL contiene ancora il token, quindi `initSession()` lo riesegue e ripopola `sessionStorage`.

### Q: Cosa succede se l'utente naviga senza parametri URL?
**A**: La funzione `initSession()` fa fallback a `sessionStorage`. Se anche quello è vuoto, `requireSession()` fa redirect.

### Q: Il token può scadere?
**A**: Sì, `isSessionValid()` controlla che il timestamp non sia più vecchio di 24 ore.

### Q: Come faccio a fare logout?
**A**: Chiama `clearSession()` e poi redirect a pagina pubblica.

### Q: Posso usare questo sistema per pagine pubbliche?
**A**: No, queste utility sono solo per pagine customer. Pagine pubbliche non richiedono sessione.

---

## 💡 Best Practices

1. **Sempre** usare `navigateWithContext()` per link interni customer
2. **Mai** hard-codare URL senza token
3. **Sempre** chiamare `initSession()` all'inizio di ogni pagina
4. **Mai** fare `sessionStorage.setItem()` direttamente - usare `persistSession()`
5. **Sempre** validare sessione con `requireSession()` su pagine protette
6. **Mai** esporre dati sensibili nel token (solo IDs)
7. **Sempre** testare con URL vuoto per verificare fallback

---

## 🔗 File Coinvolti

- **`session_utils.js`**: Utility condivise (da includere in tutte le pagine customer)
- **`securehandshake.html`**: Entry point handshake (crea sessione)
- **`customer_hub.html`**: Dashboard (usa sessione esistente)
- **Future pages**: Tutte le pagine customer devono seguire questo pattern

---

## 🚀 Prossimi Sviluppi

- [ ] Form raccolta dati cliente (nome, email, telefono)
- [ ] Aggiornamento sessione con `customerId` dopo registrazione
- [ ] Sincronizzazione stato con webhook quando online
- [ ] Gestione scadenza token (24h)
- [ ] Logout esplicito con conferma
- [ ] Multi-tenant: supporto più aziende nello stesso browser
