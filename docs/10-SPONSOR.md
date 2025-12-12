# 🎁 Sponsor Carousel System

> **Ultima revisione**: 12 Dicembre 2025  
> **File**: `sponsor.js`  
> **Status**: Production ✅

---

## 🎯 Obiettivo

Il **Sponsor Carousel** mostra **pacchetti crediti** e **partner commerciali** in punti strategici dell'app (onboarding, loading screen, dashboard).

---

## 📍 Punti di Integrazione

### 1. Onboarding (Step 5)
```html
<div id="sponsor-onboarding"></div>
<script>
  SponsorManager.inject('#sponsor-onboarding', 'onboarding');
</script>
```

### 2. Loading Overlay (Soft Skills Analysis)
```html
<div class="analysis-overlay">
  <p>Analisi in corso...</p>
  <div id="sponsor-loader"></div>
</div>
<script>
  SponsorManager.inject('#sponsor-loader', 'loader');
</script>
```

### 3. Dashboard (Widget)
```html
<div class="dashboard-widget">
  <h3>Pacchetti Crediti</h3>
  <div id="sponsor-dashboard"></div>
</div>
<script>
  SponsorManager.inject('#sponsor-dashboard', 'dashboard');
</script>
```

---

## 📦 Pacchetti Crediti

### Configurazione JSON
```javascript
const CREDIT_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 500,
    price: 450,  // € (10% sconto)
    currency: 'EUR',
    badge: 'Più popolare',
    color: '#5b6fed',
    features: [
      '500 Crediti',
      'Supporto email',
      'Valido 12 mesi'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    credits: 2000,
    price: 1600,  // € (20% sconto)
    currency: 'EUR',
    badge: 'Best Value',
    color: '#4cd964',
    features: [
      '2000 Crediti',
      'Supporto prioritario',
      'Valido 24 mesi',
      'Consulenza 1h gratuita'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    credits: 10000,
    price: 7000,  // € (30% sconto)
    currency: 'EUR',
    badge: 'Per Team',
    color: '#f59e0b',
    features: [
      '10000 Crediti',
      'Supporto dedicato',
      'Valido 36 mesi',
      'Formazione team inclusa',
      'White-label opzionale'
    ]
  }
];
```

---

## 🎨 Carousel Component

### Auto-Scroll
- Scorrimento automatico ogni 5 secondi
- Indicatori dot navigation
- Swipe touch support (mobile)

### Card Design
```html
<div class="sponsor-card">
  <div class="badge">Più popolare</div>
  <h3>Starter</h3>
  <div class="price">
    <span class="amount">€450</span>
    <span class="credits">500 crediti</span>
  </div>
  <ul class="features">
    <li>✅ Supporto email</li>
    <li>✅ Valido 12 mesi</li>
  </ul>
  <button class="cta-btn">Acquista Ora</button>
</div>
```

---

## 📊 Analytics

### Eventi Tracciati
```javascript
window.dataLayer = window.dataLayer || [];

// Impression
SponsorManager.trackImpression(packageId, context);

// Click
SponsorManager.trackClick(packageId, context);

// Conversion (acquisto)
SponsorManager.trackConversion(packageId, amount);
```

### Metriche
- **Impression Rate**: % utenti che vedono carousel
- **CTR** (Click-Through Rate): % click su card
- **Conversion Rate**: % acquisti
- **Popular Package**: Quale pacchetto vende di più

---

## 🔧 API SponsorManager

### Metodi Pubblici

```javascript
// Inject carousel in container
SponsorManager.inject(selector, context);

// Update packages (dynamic pricing)
SponsorManager.updatePackages(newPackages);

// Show/Hide carousel
SponsorManager.show();
SponsorManager.hide();

// Analytics
SponsorManager.trackImpression(packageId, context);
SponsorManager.trackClick(packageId, context);
SponsorManager.trackConversion(packageId, amount);
```

---

## 🛠️ Troubleshooting

**1. "Carousel non appare"**
- **Causa**: Container selector errato
- **Fix**: Verificare ID elemento esiste nel DOM

**2. "Auto-scroll troppo veloce"**
- **Causa**: Interval 5s default
- **Fix**: Personalizzare con `SponsorManager.setInterval(10000)` (10s)

**3. "CTA non funziona"**
- **Causa**: Handler click non registrato
- **Fix**: Verificare `sponsor.js` caricato prima di inject

---

## 🚀 Roadmap

### Q2 2025
- [ ] **A/B Testing**: Varianti pricing dinamico
- [ ] **Partner Carousel**: Sponsor esterni (SumUp, Revolut)
- [ ] **Gamification**: Badge sconto fedeltà

---

## 📚 Documentazione Correlata

- [01-OVERVIEW.md](./01-OVERVIEW.md)
- [03-ONBOARDING.md](./03-ONBOARDING.md)

---

<div align="center">

**Sponsor System by [TrinAI](https://www.trinai.it)**

[⬆ Torna alla documentazione](../README.md)

</div>