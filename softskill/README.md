# Soft Skill Selector Integration

## Overview
Questo modulo integra il quiz sulle soft skill in SiteBoS-MiniApp mantenendo l'architettura vanilla JavaScript/HTML/CSS.

## Core Components

### 1. Dati delle Domande (`questions_data.json`)
Tutte le 150 domande convertite da TypeScript a JSON, contenenti:
- Scenario della domanda
- 4 opzioni di risposta con immagini
- Soft skill associate
- Caratteristiche psicologiche

### 2. Immagini (`../images/softskill/`)
Struttura delle immagini:
```
images/softskill/
├── 1.png, 2.png, 3.png, 4.png  (4 immagini principali)
└── question1/ ... question150/  (150 cartelle con 4 immagini ciascuna)
    ├── 1.png
    ├── 2.png
    ├── 3.png
    └── 4.png
```

## Installation

### Opzione A: Copia Manuale
1. Clona entrambe le repository localmente
2. Copia le immagini:
   ```bash
   cp -r soft-skill-selector/public/images/* SiteBoS-MiniApp/images/softskill/
   ```

### Opzione B: Script Automatico
Usa lo script `migrate.sh` incluso:
```bash
chmod +x softskill/migrate.sh
./softskill/migrate.sh
```

## File Structure

```
SiteBoS-MiniApp/
├── softskill/
│   ├── README.md (questo file)
│   ├── index.html (interfaccia quiz)
│   ├── softskill.js (logica applicazione)
│   ├── questions_data.json (150 domande)
│   └── migrate.sh (script migrazione)
└── images/
    └── softskill/ (150+ cartelle immagini)
```

## Usage

Apri `softskill/index.html` nel browser per iniziare il quiz.

## Technical Details

- **Framework**: Vanilla JavaScript (ES6+)
- **Storage**: LocalStorage per salvare progressi
- **Immagini**: Referenziamento dinamico basato su numero domanda
- **Responsive**: Mobile-first design

## License

Stesso della repository principale.