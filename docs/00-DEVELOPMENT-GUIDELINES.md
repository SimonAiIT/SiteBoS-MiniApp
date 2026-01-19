# 00 - DEVELOPMENT GUIDELINES

> **Data creazione**: 12 Dicembre 2025  
> **Versione**: 1.0  
> **Scopo**: Definire le direttive fondamentali per lo sviluppo e manutenzione del progetto SiteBoS-MiniApp

---

## 🚨 DIRETTIVA CRITICA: Contesto di Esecuzione

### Ambiente Browser (NON WebApp Nativa)

**IMPORTANTE**: Questo progetto utilizza Telegram come **piattaforma di distribuzione** ma **NON viene eseguito come Telegram WebApp nativa**.

#### Contesto Reale di Esecuzione

```
Utente in chat Telegram 
  ↓ 
  Click su URL inviato dal Bot
  ↓
Apertura nel browser integrato di Telegram
  ↓
Esecuzione come normale applicazione web
```

### Implicazioni Tecniche

#### ✅ CIÒ CHE FUNZIONA

1. **API Browser Standard**
   - `window`, `document`, `localStorage`
   - `fetch()`, `XMLHttpRequest`
   - Eventi DOM standard (`click`, `input`, `change`, ecc.)
   - `alert()`, `confirm()`, `prompt()`
   - Geolocation API, Camera API, ecc.

2. **Telegram WebApp SDK (Limitato)**
   - La libreria `telegram-web-app.js` viene **mantenuta** per compatibilità
   - `tg.ready()`, `tg.expand()` funzionano e vanno chiamati
   - Alcune funzionalità base come `tg.initData` sono disponibili

3. **CSS e Layout**
   - Tutto il CSS standard funziona normalmente
   - Responsive design necessario per mobile
   - Media queries standard

#### ❌ CIÒ CHE NON FUNZIONA / FUNZIONA PARZIALMENTE

1. **Telegram WebApp Advanced Features**
   - `tg.showPopup()` → Potrebbe non funzionare correttamente
   - `tg.showAlert()` → Potrebbe non funzionare correttamente
   - `tg.HapticFeedback` → Potrebbe non funzionare
   - `tg.BackButton` → Non disponibile nel browser
   - `tg.MainButton` → Non disponibile nel browser

2. **Navigazione**
   - Non si può chiudere la WebApp con `tg.close()`
   - Il back button del browser gestisce la navigazione

### 📜 Regole di Sviluppo

#### REGOLA #1: Dichiarazione Telegram SDK (OBBLIGATORIA)

**Mantieni SEMPRE** questo snippet in tutti i file HTML:

```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<script>
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
</script>
```

**Motivo**: Anche se non tutte le feature funzionano, la dichiarazione:
- Previene errori `undefined` nei log
- Permette feature detection (`if (tg?.showPopup)`)
- Garantisce compatibilità futura se Telegram migliora il browser integrato

#### REGOLA #2: Fallback Browser Standard

**Implementa sempre fallback** per le funzioni Telegram che potrebbero non funzionare:

```javascript
// ✅ CORRETTO
function showMessage(msg) {
  if (tg?.showAlert) {
    tg.showAlert(msg);
  } else {
    alert(msg); // Fallback browser standard
  }
}

// ❌ SBAGLIATO
function showMessage(msg) {
  tg.showAlert(msg); // Potrebbe non funzionare!
}
```

#### REGOLA #3: Feature Detection

Usa **sempre** l'optional chaining (`?.`) per le API Telegram:

```javascript
// ✅ CORRETTO
if (tg?.HapticFeedback) {
  tg.HapticFeedback.impactOccurred('medium');
}

// ❌ SBAGLIATO
tg.HapticFeedback.impactOccurred('medium'); // Crash se non disponibile
```

#### REGOLA #4: Eventi Browser Prioritari

Privilegia eventi e API browser standard rispetto a Telegram:

```javascript
// ✅ PREFERITO
window.addEventListener('popstate', handleBack);
window.history.back();

// ⚠️ DA EVITARE
tg.BackButton.onClick(handleBack); // Potrebbe non esistere
```

#### REGOLA #5: Modali e Dialog

**Usa elementi HTML nativi** invece delle API Telegram:

```javascript
// ✅ CORRETTO - Modal HTML
<div id="myModal" class="modal-overlay hidden">
  <div class="modal-content">
    <!-- Contenuto -->
  </div>
</div>

// ❌ DA EVITARE
tg.showPopup({ title: "...", message: "..." }); // Potrebbe non funzionare
```

---

## 🛠️ Pattern di Sviluppo Raccomandati

### 1. Gestione Navigazione

```javascript
// Usa routing basato su window.location
function navTo(page) {
  const params = new URLSearchParams(window.location.search);
  window.location.href = `${page}.html?${params.toString()}`;
}

// Gestisci back button browser
window.addEventListener('popstate', () => {
  // Logica personalizzata se necessario
});
```

### 2. Gestione Stato

```javascript
// localStorage per persistenza
localStorage.setItem('userData', JSON.stringify(data));

// URL params per stato sessione
const urlParams = new URLSearchParams(window.location.search);
const vat = urlParams.get('vat');
```

### 3. Feedback Visivo

```javascript
// Usa loader HTML invece di tg.MainButton.showProgress()
function showLoader(text) {
  document.getElementById('loader').classList.remove('hidden');
  document.getElementById('loader-text').textContent = text;
}

function hideLoader() {
  document.getElementById('loader').classList.add('hidden');
}
```

### 4. Notifiche e Alert

```javascript
// Pattern con fallback
function notify(message, type = 'info') {
  if (tg?.showPopup) {
    tg.showPopup({
      title: type === 'error' ? '❌ Errore' : 'ℹ️ Info',
      message: message
    });
  } else {
    // Fallback: modal HTML custom o alert browser
    const modal = document.getElementById('notification-modal');
    modal.querySelector('.message').textContent = message;
    modal.classList.remove('hidden');
  }
}
```

---

## 📝 Checklist Pre-Commit

Prima di ogni commit, verifica:

- [ ] Tutti i file HTML includono `telegram-web-app.js`
- [ ] Tutte le chiamate a `tg.*` usano optional chaining (`?.`)
- [ ] Esiste fallback browser per ogni funzione Telegram
- [ ] I modali/popup sono implementati come HTML nativo
- [ ] La navigazione usa `window.location` e non `tg.close()`
- [ ] Eventi standard (`click`, `submit`, ecc.) sono usati invece di API Telegram custom
- [ ] Il codice funziona anche se `tg` è completamente undefined

---

## 📚 Risorse

### Documentazione Rilevante

- [Telegram WebApp Docs](https://core.telegram.org/bots/webapps) → Riferimento, ma ricorda le limitazioni
- [MDN Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) → Fonte principale per API browser
- HTML5 Feature Detection → Pattern da seguire per `tg` API

### Testing

**Testa sempre su**:
1. Browser mobile (iOS Safari, Android Chrome)
2. Browser desktop (per debug)
3. Telegram iOS (browser interno)
4. Telegram Android (browser interno)

**NON testare solo su**:
- Desktop Telegram (comportamento diverso)
- Telegram WebApp Simulator (non riflette ambiente reale)

---

## ⚠️ Note per AI Assistant / Collaboratori

Quando modifichi questo progetto:

1. **NON assumere** che tutte le API Telegram WebApp funzionino
2. **PRIVILEGIA** sempre soluzioni browser-standard
3. **MANTIENI** la dichiarazione Telegram SDK ma non fare affidamento esclusivo su di essa
4. **TESTA** sempre i fallback browser
5. **DOCUMENTA** eventuali nuove dipendenze da API Telegram scoperte

---

## 🔄 Changelog

### v1.0 - 12 Dicembre 2025
- Creazione documento iniziale
- Definizione direttiva contesto browser
- Pattern e best practices consolidate

---

**Ultimo aggiornamento**: 12 Dicembre 2025  
**Responsabile**: Giuseppe Garofalo
