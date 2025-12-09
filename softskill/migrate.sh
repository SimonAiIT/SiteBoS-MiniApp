#!/bin/bash

# Soft Skill Selector - Migration Script
# Copia le immagini da soft-skill-selector a SiteBoS-MiniApp

echo "🚀 Soft Skill Migration Script"
echo "================================"

# Controlla se le repository esistono
if [ ! -d "../soft-skill-selector" ]; then
    echo "❌ Repository soft-skill-selector non trovata"
    echo "Clona prima la repository:"
    echo "  git clone https://github.com/SimonAiIT/soft-skill-selector.git ../soft-skill-selector"
    exit 1
fi

# Crea la directory immagini se non esiste
mkdir -p ../images/softskill

echo "📂 Copiando immagini principali..."
cp ../soft-skill-selector/public/images/[1-4].png ../images/softskill/

echo "📁 Copiando cartelle domande (1-150)..."
for i in {1..150}; do
    if [ -d "../soft-skill-selector/public/images/question$i" ]; then
        cp -r ../soft-skill-selector/public/images/question$i ../images/softskill/
        echo "  ✓ question$i copiata"
    fi
done

echo ""
echo "✅ Migrazione completata!"
echo "📊 Immagini copiate in: images/softskill/"
echo "🎯 Apri softskill/index.html per testare"
