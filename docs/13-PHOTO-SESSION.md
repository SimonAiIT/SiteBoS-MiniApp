# 📸 Photo Session - Sistema Acquisizione 3 Angolazioni

> **Ultima revisione**: 15 Dicembre 2025  
> **Path**: `/functions/photo-session.html`  
> **Status**: Production ✅

---

## 🎯 Obiettivo

Il **Photo Session** è un sistema di acquisizione fotografica professionale a **3 angolazioni** che precede lo Specchio Magico AI. Permette di catturare dati visivi essenziali del cliente per un'analisi AI completa che restituisce una **scheda diagnostica dettagliata** salvata temporaneamente in **sessionStorage**.

### Caratteristiche Chiave

- 📷 **3 scatti essenziali**: frontale, **dettaglio capelli**, cute
- 👁️ **Guide visive overlay**: sagome posizionamento per ogni angolazione
- 🎯 **Tap-to-focus**: tocca lo schermo per mettere a fuoco manualmente
- 💾 **Compressione intelligente**: JPEG quality 0.7, max 800px lato lungo
- 📱 **Upload alternativo**: possibilità di caricare da galleria per ogni scatto
- 🔒 **Single permission**: richiesta camera una sola volta (persistente)
- 🤖 **Analisi AI completa**: età, genere, pelle, capelli, consigli personalizzati, makeup
- ⚡ **SessionStorage**: dati volatili, auto-expire dopo sessione
- 🔗 **Integrazione seamless**: dati pre-compilati in Specchio Magico
- 🌍 **Multi-lingua**: output in lingua owner (italiano, english, etc.)
- 👩 **Age clemency**: -3/4 anni per donne

---

## 📊 Flow Completo

```mermaid
graph TD
    A[Functions Hub] -->|Click Specchio Magico| B[Photo Session Start]
    B -->|Scatto 1/3| C[Frontale]
    C -->|Next| D[Dettaglio Capelli]
    D -->|Next| E[Cute/Radici]
    E -->|Complete| F[AI Analysis Webhook]
    F -->|Response| G[sessionStorage.setItem]
    G -->|Display| H[Scheda Cliente]
    H -->|Procedi| I[Specchio Magico]
    I -->|sessionStorage.getItem| J[Brand + Gender Selection]
    J -->|Pre-filled Data| K[Colorimetria Config]
    
    style B fill:#5b6fed,color:#fff
    style F fill:#f59e0b,color:#fff
    style G fill:#10b981,color:#fff
    style H fill:#4cd964,color:#fff
```

**Perché NO MongoDB?**
- ⚡ Dati troppo volatili (età cambia, capelli crescono)
- 💰 Storage cost inutile per dati temporanei
- 🔄 Ogni sessione è fresh (30 secondi per 3 foto)
- 🧹 Auto-cleanup garantito (browser expiry)

---

## 📸 Le 3 Angolazioni Essenziali

### 1. **Frontale** 👤

**Obiettivo**: Viso completo, capelli visibili, espressione neutra

**Guide Overlay**: Ovale verticale (60% larghezza, 80% altezza)

**Dati estratti**:
- Età stimata (range) con clemenza per donne (-3/4 anni)
- Genere rilevato (confidence %)
- Tono pelle + sottotono + HEX color
- Forma viso (oval, square, heart, round)
- Colore occhi + HEX
- Lunghezza capelli frontale
- Features facciali

---

### 2. **Dettaglio Capelli** 💇‍♀️ ⭐ NEW

**Obiettivo**: Close-up su ciocca capelli per mostrare texture, colore, condizione

**Guide Overlay**: Rettangolo arrotondato (70% larghezza, 60% altezza)

**Tap-to-Focus**: 🎯 Tocca la ciocca sullo schermo per mettere a fuoco

**Dati estratti**:
- Texture capelli dettagliata (1A-4C classification)
- Porosità visibile (low, medium, high)
- Livello danno (frizz, secchezza, split ends)
- Colore naturale + HEX
- Contrasto radici/lunghezze
- Presenza trattamenti chimici (decolorazione, tinte)

**Perché è meglio del profilo?**
- ✅ Focus 100% su condizione capelli
- ✅ Texture rilevabile con precisione
- ✅ Damage level oggettivo (frizz, split ends visibili)
- ✅ Colore reale senza ombre viso
- ✅ Tap-to-focus per messa a fuoco perfetta

---

### 3. **Cute/Radici** 🔍

**Obiettivo**: Zona superiore testa, radici ben visibili, cute inquadrata

**Guide Overlay**: Cerchio (60% dimensione)

**Dati estratti**:
- Salute cute (secca, grassa, normale, sensibile)
- Densità capelli (bassa, media, alta)
- % bianchi (rilevazione automatica pixel saturation)
- Presenza forfora/dermatiti/rossori
- Colore naturale radici + HEX
- Contrasto radici/lunghezze (ricrescita)

---

## 🛠️ Implementazione Tecnica

### Tap-to-Focus 🎯

```javascript
// --- TAP-TO-FOCUS IMPLEMENTATION ---

let videoElement;
let currentStream;

// Init camera con focus mode manual
async function initCamera() {
  const constraints = {
    video: {
      facingMode: 'user',
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      focusMode: 'manual' // <<< IMPORTANTE
    }
  };
  
  currentStream = await navigator.mediaDevices.getUserMedia(constraints);
  videoElement = document.getElementById('camera-preview');
  videoElement.srcObject = currentStream;
  
  // Aggiungi listener per tap-to-focus
  videoElement.addEventListener('click', handleTapToFocus);
}

// Handler tap-to-focus
function handleTapToFocus(event) {
  const rect = videoElement.getBoundingClientRect();
  
  // Calcola coordinate relative (0-1)
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  
  // Applica focus point
  applyFocusPoint(x, y);
  
  // Mostra feedback visivo
  showFocusIndicator(event.clientX, event.clientY);
}

// Applica focus al punto selezionato
async function applyFocusPoint(x, y) {
  const track = currentStream.getVideoTracks()[0];
  const capabilities = track.getCapabilities();
  
  // Check se device supporta manual focus
  if (capabilities.focusMode && capabilities.focusMode.includes('manual')) {
    try {
      await track.applyConstraints({
        advanced: [{
          focusMode: 'manual',
          focusDistance: calculateFocusDistance(x, y),
          pointsOfInterest: [{ x: x, y: y }]
        }]
      });
      
      console.log(`🎯 Focus applicato a: (${x.toFixed(2)}, ${y.toFixed(2)})`);
    } catch (err) {
      console.warn('Focus manual non supportato, uso continuous:', err);
      // Fallback a continuous autofocus
      await track.applyConstraints({
        advanced: [{ focusMode: 'continuous' }]
      });
    }
  }
}

// Calcola distanza focus (0 = vicino, 1 = lontano)
function calculateFocusDistance(x, y) {
  // Per foto dettaglio capelli (close-up), usa focus ravvicinato
  return 0.2; // 20% = macro focus
}

// Mostra indicatore visivo tap
function showFocusIndicator(x, y) {
  // Crea cerchio focus
  const indicator = document.createElement('div');
  indicator.className = 'focus-indicator';
  indicator.style.left = `${x}px`;
  indicator.style.top = `${y}px`;
  
  document.body.appendChild(indicator);
  
  // Animazione
  setTimeout(() => {
    indicator.classList.add('focused');
  }, 10);
  
  // Rimuovi dopo 1 secondo
  setTimeout(() => {
    indicator.remove();
  }, 1000);
}

// CSS per focus indicator
const focusIndicatorCSS = `
.focus-indicator {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 2px solid #4cd964;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(1.5);
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
  box-shadow: 0 0 0 2px rgba(76, 217, 100, 0.3);
}

.focus-indicator.focused {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}
`;
```

---

### UI Hint per Tap-to-Focus

```html
<!-- Hint visibile durante foto 2 (dettaglio capelli) -->
<div class="tap-hint" v-if="currentStep === 2">
  <div class="hint-icon">🎯</div>
  <p>Tocca sullo schermo per mettere a fuoco la ciocca</p>
</div>

<style>
.tap-hint {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  padding: 12px 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: pulse 2s infinite;
}

.hint-icon {
  font-size: 24px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
```

---

### Compressione JPEG Ottimizzata

```javascript
function compressImage(canvas, callback) {
  let width = canvas.width;
  let height = canvas.height;
  const maxDim = 800;
  
  if (width > maxDim || height > maxDim) {
    const scale = maxDim / Math.max(width, height);
    width *= scale;
    height *= scale;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0, width, height);
    canvas = tempCanvas;
  }
  
  const base64 = canvas.toDataURL('image/jpeg', 0.7);
  console.log(`📸 Compressed: ${(base64.length / 1024).toFixed(2)} KB`);
  callback(base64);
}
```

**Risultato**:
- Original 1920x1080 (1.2 MB) → Compressed 800x450 (~80 KB)
- **Riduzione 93%** mantenendo qualità visiva
- **Payload totale 3 foto**: ~240 KB

---

### Guide Overlay Aggiornate

```javascript
const photoSteps = [
  {
    id: 1,
    title: '📸 Foto 1: Frontale',
    instruction: 'Viso completo, espressione neutra, capelli visibili',
    overlay: {
      type: 'oval-vertical',
      width: '60%',
      height: '80%'
    },
    tapToFocus: false
  },
  {
    id: 2,
    title: '💇‍♀️ Foto 2: Dettaglio Capelli',
    instruction: 'Inquadra una ciocca da vicino. Tocca per mettere a fuoco.',
    overlay: {
      type: 'rounded-rect',
      width: '70%',
      height: '60%'
    },
    tapToFocus: true, // <<< ATTIVA TAP-TO-FOCUS
    focusDistance: 0.2 // Macro focus
  },
  {
    id: 3,
    title: '🔍 Foto 3: Cute e Radici',
    instruction: 'Zona superiore testa, radici ben visibili',
    overlay: {
      type: 'circle',
      size: '60%'
    },
    tapToFocus: true,
    focusDistance: 0.3
  }
];
```

---

### SessionStorage Architecture

```javascript
// photo-session.html - Dopo AI response
function saveToSessionStorage(response) {
  const sessionData = {
    clientId: clientId,
    photos: {
      front: photos.front,
      hairDetail: photos.hairDetail, // NEW: dettaglio capelli
      scalp: photos.scalp
    },
    report: response.report, // Full report object
    timestamp: Date.now()
  };
  
  sessionStorage.setItem('photoSessionData', JSON.stringify(sessionData));
  console.log('💾 Saved to sessionStorage');
}

// specchio-magico.html - All'init
if (urlParams.get('fromPhotoSession') === 'true') {
  const sessionData = sessionStorage.getItem('photoSessionData');
  
  if (sessionData) {
    const data = JSON.parse(sessionData);
    
    // Pre-fill tutto dal report
    clientPhotoData = data.photos.front;
    autoFillFromReport(data.report);
    selectedGender = data.report.gender.detected;
  }
}
```

---

## 🤖 AI Analysis Webhook

### Endpoint

```
POST https://trinai.api.workflow.dcmake.it/webhook/5364bb15-4186-4246-8d00-c82218f5e407
```

### Request Payload

```json
{
  "action": "analyze",
  "owner": "telegram_user_id",
  "token": "session_token",
  "body": {
    "photos": {
      "front": {
        "base64": "/9j/4AAQSkZJRg...",
        "mimeType": "image/jpeg",
        "size": 78
      },
      "hairDetail": {
        "base64": "/9j/4AAQSkZJRg...",
        "mimeType": "image/jpeg",
        "size": 82
      },
      "scalp": {
        "base64": "/9j/4AAQSkZJRg...",
        "mimeType": "image/jpeg",
        "size": 85
      }
    }
  },
  "timestamp": 1734284400000
}
```

**Dimensione payload**: ~240 KB (3 foto compresse)

---

### Response (Success) - Esempio REALE

```json
{
  "success": true,
  "report": {
    "age": {
      "range": "40-50 anni"
    },
    "gender": {
      "detected": "F",
      "confidence": 0.98
    },
    "skinTone": {
      "category": "Medio-Chiaro",
      "undertone": "Neutral-Warm",
      "hex": "#D8A68C"
    },
    "faceShape": "Round",
    "eyeColor": {
      "color": "Grigio-Azzurro",
      "hex": "#637B85"
    },
    "hairAnalysis": {
      "naturalColor": {
        "level": 4,
        "tone": "Neutrale",
        "hex": "#4A3A2F"
      },
      "texture": {
        "type": "2C (Onde marcate/Riccio debole)",
        "porosity": "High"
      },
      "density": "Medium",
      "length": "Media (alle spalle)",
      "greyPercentage": 20,
      "damage": {
        "level": "Medium",
        "concerns": [
          "Frizz eccessivo sulle lunghezze schiarite",
          "Secchezza e mancanza di elasticità"
        ]
      },
      "scalpHealth": {
        "condition": "Sensibile",
        "concerns": [
          "Lieve rossore visibile",
          "Potenziale accumulo di sebo/residui"
        ]
      }
    },
    "recommendations": {
      "salonTreatments": [
        "Trattamento di Ricostruzione Profonda (Cheratina/Proteine)",
        "Gloss Tonalizzante (per neutralizzare i riflessi gialli indesiderati sulle schiariture)",
        "Taglio Punte (per eliminare le parti più danneggiate)"
      ],
      "retailProducts": [
        "Shampoo Idratante Ristrutturante Professionale",
        "Maschera Intensiva per Capelli Trattati e Ricci",
        "Crema Leave-in per la Definizione dei Ricci"
      ],
      "makeupColors": {
        "eyeshadows": [
          {"name": "Bronzo Caldo", "hex": "#B87333"},
          {"name": "Malva/Taupe", "hex": "#856D6E"}
        ],
        "lipsticks": [
          {"name": "Rosa Pesca Nude", "hex": "#E8A398"},
          {"name": "Marrone Rosato (Mauve)", "hex": "#A47F7F"}
        ],
        "blush": [
          {"name": "Corallo Tenue", "hex": "#E49B80"}
        ]
      }
    }
  }
}
```

**Note**:
- ✅ Foto **NON** incluse nel response (già salvate client-side)
- ✅ Tutti i colori hanno HEX code
- ✅ Testi in lingua owner (italiano nell'esempio)
- ✅ Age con clemenza per donne (-3/4 anni)

---

### Response (Error)

```json
{
  "success": false,
  "error": {
    "code": "FACE_NOT_DETECTED",
    "message": "Viso non rilevato in foto frontale",
    "photo": "front"
  }
}
```

**Error Codes**:

| Codice | Causa | Fix |
|--------|-------|-----|
| `FACE_NOT_DETECTED` | Viso non riconosciuto | Ri-scattare frontale |
| `HAIR_NOT_DETECTABLE` | Dettaglio capelli sfocato | Usa tap-to-focus e ri-scatta |
| `LOW_QUALITY` | Foto sfocata/scura | Migliorare illuminazione |
| `INVALID_PAYLOAD` | Payload malformato | Check base64 encoding |
| `API_QUOTA_EXCEEDED` | Rate limit AI | Attendere 60s |

---

## 🎨 Display Scheda Cliente

Dopo il response, il frontend mostra una scheda riepilogativa:

```html
<div class="client-card">
  <div class="header">
    <img src="{{ photos.front }}" class="client-photo">
    <div class="info">
      <h2>Analisi Completa</h2>
      <p class="age">{{ report.age.range }}</p>
      <p class="gender">{{ report.gender.detected }}</p>
    </div>
  </div>
  
  <div class="section">
    <h3>🎨 Pelle & Viso</h3>
    <div class="color-swatch" style="background: {{ report.skinTone.hex }}"></div>
    <p>{{ report.skinTone.category }} - {{ report.skinTone.undertone }}</p>
    <p>Forma viso: {{ report.faceShape }}</p>
  </div>
  
  <div class="section">
    <h3>💇‍♀️ Capelli</h3>
    <div class="color-swatch" style="background: {{ report.hairAnalysis.naturalColor.hex }}"></div>
    <p>Livello {{ report.hairAnalysis.naturalColor.level }} - {{ report.hairAnalysis.naturalColor.tone }}</p>
    <p>Texture: {{ report.hairAnalysis.texture.type }}</p>
    <p>Danno: {{ report.hairAnalysis.damage.level }}</p>
    <p>Bianchi: {{ report.hairAnalysis.greyPercentage }}%</p>
  </div>
  
  <div class="section">
    <h3>✨ Trattamenti Consigliati</h3>
    <ul>
      <li v-for="treatment in report.recommendations.salonTreatments">
        {{ treatment }}
      </li>
    </ul>
  </div>
  
  <div class="section">
    <h3>🛍️ Prodotti Retail</h3>
    <ul>
      <li v-for="product in report.recommendations.retailProducts">
        {{ product }}
      </li>
    </ul>
  </div>
  
  <div class="section">
    <h3>💄 Palette Makeup</h3>
    <div class="color-palette">
      <div v-for="color in report.recommendations.makeupColors.eyeshadows" 
           class="color-item">
        <div class="swatch" :style="{background: color.hex}"></div>
        <span>{{ color.name }}</span>
      </div>
    </div>
  </div>
  
  <button @click="proceedToSpecchioMagico">
    Procedi a Specchio Magico →
  </button>
</div>
```

---

## 🔗 Integrazione con Specchio Magico

### Navigation URL

```javascript
function proceedToSpecchioMagico() {
  const urlParams = getURLParams();
  
  navigateWithParams('./specchio-magico.html', {
    owner: urlParams.owner,
    token: urlParams.token,
    gender: report.gender.detected || 'F',
    fromPhotoSession: 'true'
  });
}
```

### Specchio Magico Pre-fill

```javascript
// specchio-magico.js - All'init
if (urlParams.get('fromPhotoSession') === 'true') {
  const sessionData = sessionStorage.getItem('photoSessionData');
  
  if (sessionData) {
    const data = JSON.parse(sessionData);
    const report = data.report;
    
    // 1. Foto cliente
    clientPhotoData = data.photos.front;
    document.getElementById('client-photo').src = clientPhotoData;
    
    // 2. Gender
    selectedGender = report.gender.detected;
    
    // 3. Texture capelli
    document.getElementById('hair-texture').value = report.hairAnalysis.texture.type;
    
    // 4. Tono base
    currentBaseTone = report.hairAnalysis.naturalColor.level;
    document.getElementById('base-tone').value = currentBaseTone;
    
    // 5. % bianchi
    document.getElementById('grey-percentage').value = report.hairAnalysis.greyPercentage;
    
    // 6. Blocca tecniche pericolose se damage = High
    if (report.hairAnalysis.damage.level === 'High') {
      blockDangerousTechniques(['Decolorazione Totale', 'Mèches Extra Light']);
    }
    
    // 7. Mostra consigli AI in sidebar
    displayAISuggestions(report.recommendations);
  }
}
```

---

## 📊 Metriche

### Performance Targets

| Metrica | Target | Note |
|---------|--------|------|
| **Tempo sessione** | < 1 min | 3 foto + AI |
| **Tempo per scatto** | < 5s | Include posizionamento + focus |
| **AI Analysis** | < 5s | Webhook processing (3 foto) |
| **Dimensione foto** | ~80 KB | Per foto |
| **Payload totale** | ~240 KB | 3 foto base64 |
| **Completion Rate** | 90% | Target |
| **SessionStorage size** | ~280 KB | Foto + report completo |
| **Focus accuracy** | 95% | Tap-to-focus successo |

### Business KPIs

- **Completion Rate**: % sessioni completate (target 90%)
- **Photo Quality**: % foto accettate da AI (target 95%)
- **Retake Rate**: % foto ri-scattate (target < 10%)
- **Time to First Service**: da photo session a colorimetria (target < 3 min)
- **AI Accuracy**: precision età ±5 anni (target 85%)
- **Hair Texture Detection**: accuracy texture classification (target 90%)
- **Tap-to-Focus Usage**: % utenti che usano tap-to-focus (target 60%)

---

## 🛠️ Troubleshooting

### ⚠️ Camera Permission Denied

**Causa**: Utente ha negato permesso browser

**Fix**:
- Mostra fallback automatico: "Usa Upload da Galleria"
- Guide per resettare permessi (Settings → Privacy)

---

### 📸 Foto 2 Sfocata (Dettaglio Capelli)

**Causa**: Camera non mette a fuoco da vicino

**Fix**:
- Mostra hint: "🎯 Tocca sullo schermo per mettere a fuoco"
- Tap-to-focus automatico sul centro se non usato dopo 3s
- Suggerisci di allontanare leggermente (20-30 cm)
- Retake illimitati

---

### 🔴 AI Returns "HAIR_NOT_DETECTABLE"

**Causa**: Foto 2 troppo sfocata o luce insufficiente

**Fix**:
- Mostra errore specifico: "Dettaglio capelli non chiaro. Usa tap-to-focus e ri-scatta."
- Auto-jump a step 2 (hair detail)
- Force show tap hint

---

### 🎯 Tap-to-Focus Non Funziona

**Causa**: Device non supporta manual focus mode

**Fix**:
- Fallback automatico a `focusMode: 'continuous'`
- Mostra hint: "Focus automatico attivo"
- Suggerisci di tenere fermo il telefono 2 secondi prima dello scatto

---

### 💾 SessionStorage Vuoto in Specchio Magico

**Causa**: Tab chiuso e riaperto, sessionStorage cleared

**Fix**:
- Mostra alert: "Dati analisi scaduti. Ripeti photo session."
- Redirect automatico a photo-session.html

---

## 🚀 Roadmap

### Q4 2025 ✅
- [x] Sistema 3 scatti con guide overlay
- [x] Foto 2 cambiata: Profilo → Dettaglio Capelli
- [x] Compressione JPEG ottimizzata
- [x] Upload da galleria alternativo
- [x] AI analysis webhook completo
- [x] SessionStorage integration
- [x] Response structure con HEX colors
- [x] Multi-lingua support
- [x] Age clemency per donne
- [x] **Tap-to-focus implementation**

### Q1 2026 🚧
- [ ] **Auto-focus fallback**: se tap non usato dopo 3s, auto-focus sul centro
- [ ] **Mirror mode**: flip orizzontale per selfie
- [ ] **Lighting check**: warning se foto troppo scura
- [ ] **Client history**: lista ultimi 10 clienti (localStorage)
- [ ] **Focus lock indicator**: mostra quando focus è locked

### Q2 2026 📋
- [ ] **Hair length measurement**: misura automatica cm capelli
- [ ] **Scalp health score**: punteggio 0-100
- [ ] **Before/After comparison**: side-by-side in results
- [ ] **PDF export**: scheda cliente stampabile
- [ ] **Multi-focus zones**: tap multipli per average focus

---

## 📚 Documentazione Correlata

- [01-OVERVIEW.md](./01-OVERVIEW.md) - Panoramica SiteBoS
- [12-FUNCTIONS-HUB.md](./12-FUNCTIONS-HUB.md) - Specchio Magico AI
- [06-CATALOG.md](./06-CATALOG.md) - AI Vision integration

---

<div align="center">

**Photo Session - Powered by TrinAI**

*Analisi AI professionale in 1 minuto con 3 foto*

*Frontale • Dettaglio Capelli • Cute*

*SessionStorage-only • Zero persistence • Privacy-first • Multi-lingua • Tap-to-Focus*

---

[⬆ Torna alla documentazione](./README.md)

</div>
