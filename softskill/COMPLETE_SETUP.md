# Setup Completo - Tutte le 150 Domande

## 🚨 Importante

Il file `questions_data.json` attualmente contiene solo le **prime 5 domande** come esempio.
Per completare il quiz con tutte le 150 domande, segui questi passaggi.

## Metodo 1: Conversione Automatica (Consigliato)

### Script Python per Convertire TypeScript → JSON

```python
#!/usr/bin/env python3
# convert_questions.py

import os
import json
import re

def parse_ts_file(filepath):
    """Estrae le domande da un file TypeScript"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Trova l'array questions
    match = re.search(r'export const questions: Question\[\] = (\[.*\]);', content, re.DOTALL)
    if not match:
        return []
    
    array_str = match.group(1)
    
    # Converte TypeScript in JSON valido
    # Rimuove trailing commas
    array_str = re.sub(r',\s*\]', ']', array_str)
    array_str = re.sub(r',\s*\}', '}', array_str)
    
    # Wrappa le chiavi tra virgolette
    array_str = re.sub(r'(\w+):', r'"\1":', array_str)
    
    try:
        return json.loads(array_str)
    except json.JSONDecodeError as e:
        print(f"Errore nel parsing di {filepath}: {e}")
        return []

def convert_all_questions():
    """Converte tutti i file TypeScript in un unico JSON"""
    source_dir = '../soft-skill-selector/src/utils/questions'
    all_questions = []
    
    # Lista tutti i file .ts nella directory
    files = sorted([f for f in os.listdir(source_dir) if f.endswith('.ts')])
    
    for filename in files:
        filepath = os.path.join(source_dir, filename)
        questions = parse_ts_file(filepath)
        all_questions.extend(questions)
        print(f"✓ {filename}: {len(questions)} domande")
    
    # Salva il JSON finale
    output_file = 'questions_data.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Completato! {len(all_questions)} domande salvate in {output_file}")

if __name__ == '__main__':
    convert_all_questions()
```

### Utilizzo dello Script

```bash
# 1. Assicurati di avere entrambe le repository
git clone https://github.com/SimonAiIT/soft-skill-selector.git ../soft-skill-selector
cd SiteBoS-MiniApp/softskill

# 2. Esegui lo script di conversione
python3 convert_questions.py

# 3. Copia le immagini
chmod +x migrate.sh
./migrate.sh
```

## Metodo 2: Copia Manuale da Repository

### Passo 1: Clona soft-skill-selector
```bash
git clone https://github.com/SimonAiIT/soft-skill-selector.git ../soft-skill-selector
```

### Passo 2: Estrai Manualmente i Dati

I file delle domande si trovano in:
```
soft-skill-selector/src/utils/questions/
├── questions1-5.ts
├── questions6-10.ts
├── questions11-15.ts
...
└── questions146-150.ts
```

Ogni file contiene un array `questions` con 5 domande.

### Passo 3: Converti Formato

Il formato TypeScript è:
```typescript
export const questions: Question[] = [
  {
    num: 6,
    scenario: "...",
    instructions: [...],
    captions: [...],
    options: [...],
    softSkill: "...",
    characteristics: "..."
  },
  // ... altre 4 domande
];
```

Deve diventare JSON puro (rimuovi `export const questions: Question[] = ` all'inizio).

## Metodo 3: Utilizzo API GitHub

### Script Node.js per Download Automatico

```javascript
// download_questions.js
const fs = require('fs');
const https = require('https');

const BASE_URL = 'https://raw.githubusercontent.com/SimonAiIT/soft-skill-selector/main/src/utils/questions/';

const files = [
  'questions1-5.ts',
  'questions6-10.ts',
  // ... aggiungi tutti i 30 file
  'questions146-150.ts'
];

async function downloadAll() {
  const allQuestions = [];
  
  for (const file of files) {
    const url = BASE_URL + file;
    const content = await downloadFile(url);
    const questions = extractQuestions(content);
    allQuestions.push(...questions);
    console.log(`✓ ${file}: ${questions.length} domande`);
  }
  
  fs.writeFileSync('questions_data.json', JSON.stringify(allQuestions, null, 2));
  console.log(`\n✅ ${allQuestions.length} domande salvate!`);
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractQuestions(tsContent) {
  // Parsing del contenuto TypeScript
  const match = tsContent.match(/export const questions: Question\[\] = (\[.*\]);/s);
  if (!match) return [];
  
  let jsonStr = match[1]
    .replace(/,\s*\]/g, ']')
    .replace(/,\s*\}/g, '}')
    .replace(/(\w+):/g, '"$1":');
  
  return JSON.parse(jsonStr);
}

downloadAll().catch(console.error);
```

## Verifica Completamento

Dopo aver completato l'integrazione, verifica:

```bash
# 1. Controlla il numero di domande
jq '. | length' questions_data.json
# Dovrebbe output: 150

# 2. Controlla le immagini
ls -d ../images/softskill/question* | wc -l
# Dovrebbe output: 150

# 3. Conta i file immagine
find ../images/softskill -name "*.png" | wc -l
# Dovrebbe output: 604 (4 principali + 150*4)
```

## Test Locale

```bash
# Avvia un server HTTP locale
python3 -m http.server 8000
# oppure
npx http-server

# Apri nel browser
# http://localhost:8000/softskill/index.html
```

## Troubleshooting

### Problema: Immagini Non Si Caricano

**Soluzione**: Verifica i path relativi in `softskill.js`:
```javascript
const imgPath = `../images/softskill/question${question.num}/${index + 1}.png`;
```

### Problema: JSON Non Valido

**Soluzione**: Usa un validator JSON online o:
```bash
jq . questions_data.json
```

### Problema: Caratteri Speciali

**Soluzione**: Assicurati che il file sia salvato con encoding UTF-8.

## Contribuire

Una volta completata l'integrazione, puoi:
1. Fare un commit delle 150 domande complete
2. Aggiungere test automatici
3. Migliorare l'UI/UX
4. Aggiungere analytics dei risultati

## Licenza

Stessa licenza del progetto soft-skill-selector originale.
