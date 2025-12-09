# 🎯 Soft Skill Selector

## Panoramica

Modulo quiz interattivo per valutare le soft skill attraverso 150 domande scenario-based.

## 📚 Struttura File

```
softskill/
├── index.html              # Interfaccia principale del quiz
├── softskill.js            # Logica applicazione
├── questions-loader.js    # Caricatore file TypeScript
├── questions/             # 30 file TypeScript (150 domande)
│   ├── questions1-5.ts
│   ├── questions6-10.ts
│   ├── ...
│   └── questions146-150.ts
└── README.md              # Questo file
```

## ✨ Caratteristiche

- **150 domande** con scenari realistici
- **4 opzioni** per domanda con immagini
- **Progress bar** dinamica
- **Salvataggio automatico** in LocalStorage
- **Risultati dettagliati** con top 10 soft skill
- **Design responsive** mobile-first
- **Zero conversioni** - Usa direttamente i file TypeScript originali

## 🚀 Utilizzo

### Apertura Locale

```bash
# Dalla root del progetto
python3 -m http.server 8000
# Poi apri: http://localhost:8000/softskill/index.html
```

### In Produzione

Basta includere la cartella `softskill/` nel tuo server web.

## 🛠️ Tecnologie

- **HTML5** - Struttura
- **CSS3** - Stile con gradients e animazioni
- **Vanilla JavaScript (ES6+)** - Nessuna dipendenza
- **LocalStorage API** - Persistenza dati

## 📊 Come Funziona

1. **Caricamento**: `questions-loader.js` legge tutti i 30 file `.ts`
2. **Parsing**: Estrae gli array `questions` e li converte in JSON
3. **Concatenazione**: Crea un array unico di 150 domande
4. **Rendering**: Mostra le domande una alla volta con immagini
5. **Analisi**: Calcola le soft skill più frequenti nelle risposte

## 📝 Formato Domande

Ogni domanda contiene:

```typescript
{
  num: number,              // Numero domanda (1-150)
  scenario: string,         // Scenario descritto
  instructions: string[],   // 4 descrizioni immagini
  captions: string[],       // 4 etichette opzioni
  options: object[],        // 4 opzioni con testo completo
  softSkill: string,        // Soft skill associate
  characteristics: string   // Caratteristiche psicologiche
}
```

## 🔧 Personalizzazione

### Modificare i Colori

In `index.html`, cerca:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Modificare il Numero di Risultati

In `softskill.js`, cerca:
```javascript
.slice(0, 10); // Cambia 10 con il numero desiderato
```

## 📸 Immagini

Le immagini sono referenziate da:
```
../images/softskill/question{num}/{1-4}.png
```

Fallback su:
```
../images/softskill/{1-4}.png
```

## 🐛 Debug

Apri la console del browser per vedere:
- ✅ Domande caricate con successo
- ⚠️ Errori di parsing
- 📊 Conteggio domande totali

## 🤝 Contribuire

Per aggiungere/modificare domande:
1. Modifica i file in `questions/`
2. Mantieni il formato TypeScript
3. Testa localmente
4. Commit e push

## 📝 Licenza

Stessa licenza del progetto principale SiteBoS-MiniApp.
