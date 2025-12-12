# 🧠 Soft Skills Assessment System

> **Ultima revisione**: 12 Dicembre 2025  
> **Modulo**: `softskill/`  
> **Responsabile**: Team AI TrinAI

---

## 🎯 Obiettivo

Il sistema **Soft Skills Assessment** valuta le **competenze trasversali** (non tecniche) degli stakeholder attraverso:

1️⃣ **Questionario strutturato** (150 domande, 4 moduli)  
2️⃣ **Analisi AI comportamentale** (Google Gemini)  
3️⃣ **Profilo generato** (archetypo + aree di crescita)  
4️⃣ **Video formativi personalizzati** (raccomandazioni top-3)  
5️⃣ **Learning history tracking** (riflessione post-video)  

---

## 📚 Struttura Moduli

### 4 Moduli Tematici

| Modulo | Titolo | Domande | Focus |
|--------|--------|---------|-------|
| **1** | L'Io Interiore | 40 | Autoconsapevolezza, gestione emotiva |
| **2** | Sfera Interpersonale | 40 | Comunicazione, empatia, relazioni |
| **3** | Leadership & Performance | 35 | Delega, obiettivi, decisioni |
| **4** | Etica & Responsabilità | 35 | Integrità, sostenibilità, valori |

**Totale**: 150 domande

---

## 🧪 Flow Utente

```mermaid
graph TD
    A[Dashboard] -->|Click "Valuta Soft Skills"| B[softskill/dashboard.html]
    B -->|Seleziona Modulo| C[softskill/assessment.html]
    C -->|Completa 40 domande| D[POST Webhook: save_answers]
    D -->|AI Analysis| E[Google Gemini API]
    E -->|Genera Evaluation| F[MongoDB: Update Owner]
    F -->|Redirect| G[softskill/complete-profile.html]
    G -->|Mostra Profilo| H[Archetypo + Top 3 Video]
    H -->|Click Video| I[softskill/video-player.html]
    I -->|Riflessione| J[POST: save_learning_event]
    J -->|Update Score| F
    
    style E fill:#f59e0b,color:#fff
    style F fill:#4cd964,color:#fff
```

---

## 📝 Questionario Assessment

### Tipologie Domande

1. **Scala Likert** (1-5)
   - Esempio: *"Quanto sei d'accordo: 'Delego facilmente compiti importanti'"*

2. **Scenari Situazionali**
   - Esempio: *"Un cliente si lamenta. Tu: A) Ascolti, B) Difendi, C) Passi al manager"*

3. **Auto-Valutazione**
   - Esempio: *"Come valuti la tua capacità di gestire conflitti? (1-5)"*

### Logica Scoring

Ogni modulo genera:
- **PP** (Punteggio Positivo): 0-100
- **PN** (Punteggio Negativo): 0-100
- **CP** (Comportamenti Positivi): lista testuale
- **CN** (Comportamenti Negativi): lista testuale
- **Analisi Strategica**: testo AI-generato
- **Impatto Business**: testo AI-generato
- **Consigli Operativi**: array di azioni concrete

---

## 🤖 Analisi AI (Google Gemini)

### Prompt Template

```javascript
const prompt = `
Analizza le seguenti risposte del questionario soft skills:

DOMINIO: ${moduleName}
RISPOSTE: ${JSON.stringify(answers)}

Genera:
1. Punteggio Positivo (PP) 0-100
2. Punteggio Negativo (PN) 0-100
3. Comportamenti Positivi (CP): lista
4. Comportamenti Negativi (CN): lista
5. Analisi Strategica: 200 parole
6. Impatto Business: 150 parole
7. Consigli Operativi: 3 azioni concrete

Formato JSON:
{
  "PP": 75,
  "PN": 25,
  "CP": "Delega efficace, Comunicazione chiara",
  "CN": "Difficoltà feedback negativi",
  "Analisi_Strategica": "...",
  "Impatto_Business": "...",
  "Consigli_Operativi": ["...", "...", "..."]
}
`;
```

### Rate Limits

- **Google Gemini Free Tier**: 15 req/min, 1500 req/day
- **Fallback**: Se rate limit superato, usa template predefinito

---

## 📈 Profilo Comportamentale

### Archetypi Generati

Esempi di archetypi AI:

- 🏛️ **L'Architetto Resiliente** (visionario, delega, blocco mentale)
- 🚀 **Il Leader Strategico** (obiettivi, decisioni, team)
- 🧘 **L'Empatico Riflessivo** (ascolto, empatia, conflitti)
- 🛡️ **Il Guardiano Etico** (integrità, responsabilità, valori)

### Tagline Personalizzata

Esempio:
```json
{
  "archetype": "L'Architetto Resiliente",
  "tagline": "Trasforma la tua visione tecnica in leadership scalabile",
  "description": "Sei un professionista visionario con resilienza ferrea..."
}
```

---

## 🎬 Video Formativi Raccomandati

### Sistema di Raccomandazione

**Input**:
- Punteggi moduli (PP, PN)
- Comportamenti negativi identificati
- Obiettivo principale utente

**Output**:
- **Top 3 video** prioritizzati (1, 2, 3)
- **Why This**: perché questo video è rilevante per te
- **Expected Improvement**: cosa migliorerai guardandolo

### Esempio Raccomandazione

```json
{
  "priority": 1,
  "video": {
    "title": "Soft Skills - Effective Delegation",
    "url": "https://youtu.be/R9NVk6LXHbM",
    "duration": "8:23"
  },
  "why_this": "Hai difficoltà nel delegare compiti importanti e superare il blocco della delega.",
  "expected_improvement": "Imparerai a fidarti del team e a liberare tempo per attività strategiche."
}
```

---

## 📹 Video Player & Riflessione

### Flow di Apprendimento

1. **Guarda video** (iframe YouTube embedded)
2. **Rispondi a 3 domande di riflessione**:
   - Cosa hai imparato?
   - Come applicherai nella tua realtà?
   - Quale situazione recente avresti gestito diversamente?

3. **AI analizza riflessione** → genera summary
4. **Score impact calcolato**:
   - Engagement level: `transformational`, `standard`, `hostile_resistance`
   - Score delta: `+5 overall, +7 PP modulo2, -5 PN modulo2`

5. **Aggiorna profilo**

### Engagement Levels

| Level | Criterio | Badge |
|-------|----------|-------|
| **Transformational** | Riflessione > 150 char + esempi concreti | 🚀 Trasformativo |
| **Standard** | Riflessione generica, no esempi | ✅ Standard |
| **Hostile Resistance** | Riflessione < 50 char o rifiuto | ⚠️ Resistenza |

---

## 📁 Struttura File

```
softskill/
├── dashboard.html          # Scelta modulo (4 card)
├── assessment.html         # Questionario 40 domande
├── complete-profile.html   # Profilo + Top 3 video
├── video-player.html       # YouTube embed + riflessione
├── modules-mapping.js      # Domande per modulo
├── webhook-handler.js      # Wrapper API N8N
├── assessment-logic.js     # Business logic assessment
└── README.md               # [DEPRECATO] Vedere docs/04-SOFT-SKILLS.md
```

---

## 🔧 Modifiche Recenti (Dicembre 2025)

### ✅ Complete Profile

**Prima**:
```html
<div class="stats-card">
  <div>Punteggio Globale: 67.5</div>
  <div>Moduli Completati: 4/4</div>
  <div>Tempo Dedicato: 1h 53m</div>
</div>
```

**Dopo** (12 Dic 2025):
```html
<!-- Card eliminata -->
<div class="section-title">
  <div>I Tuoi Super Poteri</div>
  <div class="score-badge">67.5</div> <!-- 🔥 Badge in alto a destra -->
</div>
```

**Motivo**: Tempo dedicato non è più calcolabile, moduli completati non interessante.

---

### ✅ Learning History - Card Collassabili

**Prima**:
```html
<div class="learning-card">
  <div>Soft Skills - Effective Delegation</div>
  <div>Riflessione: ...</div>
  <div>Impact: +5</div>
</div>
```

**Dopo** (12 Dic 2025):
```html
<div class="knowledge-card"> <!-- Chiusa per default -->
  <div class="card-header"> <!-- Click per aprire -->
    <h3><i class="fas fa-play-circle"></i> Soft Skills - Effective Delegation</h3>
    <div>
      <span>📅 12 dic 2025</span>
      <i class="fas fa-chevron-down chevron"></i> <!-- Ruota 180° -->
    </div>
  </div>
  <div class="card-content"> <!-- max-height: 0 → 1000px -->
    <div>Riflessione: ...</div>
    <div class="impact-badge">🚀 Trasformativo</div>
    <div class="impact-badge">🎯 Impact: +5</div>
  </div>
</div>
```

**CSS Chiave**:
```css
.card-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.knowledge-card.open .card-content {
  max-height: 1000px;
  padding: 15px;
}

.chevron {
  transition: transform 0.3s;
}

.knowledge-card.open .chevron {
  transform: rotate(180deg);
}
```

**JavaScript**:
```javascript
DOM.learningHistoryContainer.addEventListener('click', (e) => {
    const cardHeader = e.target.closest('.card-header');
    if (cardHeader) {
        const card = cardHeader.parentElement;
        card.classList.toggle('open');
    }
});
```

---

## 📊 Metriche & Analytics

### KPIs Tracciati

- **Completion Rate**: % utenti che completano tutti e 4 i moduli
- **Average Score**: media punteggi PP/PN
- **Video Watch Rate**: % utenti che guardano almeno 1 video
- **Engagement Distribution**:
  - Transformational: 45%
  - Standard: 40%
  - Hostile: 15%

### Dashboard Query (MongoDB)

```javascript
db.OWNERS_COLLECTION.aggregate([
  { $match: { "soft_skills_assessment.completed_count": 4 } },
  { $project: {
      overall_score: "$soft_skills_assessment.overall_score",
      videos_completed: { $size: "$soft_skills_assessment.learning_history.videos_completed" }
  }},
  { $group: {
      _id: null,
      avg_score: { $avg: "$overall_score" },
      total_videos: { $sum: "$videos_completed" }
  }}
]);
```

---

## 🔐 Sicurezza & Privacy

### Dati Sensibili

- **Risposte questionario**: GDPR-compliant (consenso esplicito)
- **Riflessioni video**: anonimizzate in analytics
- **Profilo comportamentale**: visibile solo a owner/operator autorizzati

### Rate Limiting

```javascript
const RATE_LIMITS = {
  assessment_submission: { max: 1, window: '1h' },
  video_reflection: { max: 5, window: '1d' },
  profile_view: { max: 50, window: '1h' }
};
```

---

## 🛠️ Troubleshooting

### Errori Comuni

**1. "Profilo non disponibile"**
- **Causa**: Meno di 4 moduli completati
- **Fix**: Completa tutti i moduli dalla dashboard

**2. "AI Analysis Failed"**
- **Causa**: Rate limit Google Gemini superato
- **Fix**: Attendere 1 minuto, riprova, o usa template fallback

**3. "Learning History vuota"**
- **Causa**: Nessun video completato con riflessione
- **Fix**: Guarda almeno 1 video e completa riflessione

**4. "Card non si aprono"**
- **Causa**: CSS `.knowledge-card` mancante
- **Fix**: Verificare `team/profile.html` ha stili collassabili

---

## 📚 Documentazione Correlata

- [01-OVERVIEW.md](./01-OVERVIEW.md) - Panoramica progetto
- [03-MODULES.md](./03-MODULES.md) - Tutti i moduli SiteBoS
- [05-API.md](./05-API.md) - Webhook N8N reference
- [06-DEPLOYMENT.md](./06-DEPLOYMENT.md) - Deploy softskill module

---

## 🚀 Roadmap Soft Skills

### Q2 2025
- [ ] **Modulo 5**: Creatività & Innovazione
- [ ] **Peer review**: valutazione 360° da team
- [ ] **Gamification**: badge e leaderboard
- [ ] **Export PDF**: report profilo completo

### Q3 2025
- [ ] **Video interattivi**: quiz durante visione
- [ ] **Coaching AI**: chatbot per follow-up
- [ ] **Integration**: LinkedIn Learning API

---

<div align="center">

**Sistema Soft Skills sviluppato da [TrinAI](https://www.trinai.it)**

*Trasforma competenze in vantaggio competitivo*

[⬆ Torna alla documentazione](../README.md)

</div>