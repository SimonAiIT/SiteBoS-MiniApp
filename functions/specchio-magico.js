// ... (mantieni tutto il codice precedente fino a updateFormulaDisplay)...

function updateFormulaDisplay() {
  // Costruiamo la formula: [BASE].[PRIMARIO][SECONDARIO]
  let formula = currentBaseTone.toString();
  let separator = currentSystem === 'standard' ? '.' : currentSystem === 'german' ? '/' : '';
  
  if (primaryReflect) {
    const primaryCode = REFLECT_SYSTEM_MAP[currentSystem][primaryReflect];
    let reflectPart = primaryCode;
    
    // Se intensificato, doppio riflesso
    if (primaryIntensified) {
      reflectPart = primaryCode + primaryCode;
    }
    
    // Aggiungi secondario se presente
    if (secondaryReflect) {
      const secondaryCode = REFLECT_SYSTEM_MAP[currentSystem][secondaryReflect];
      reflectPart += secondaryCode;
    }
    
    formula += separator + reflectPart;
  } else {
    // Nessun riflesso = Naturale (.0)
    if (currentSystem === 'standard') formula += '.0';
    else if (currentSystem === 'german') formula += '/0';
    else formula += 'N';
  }
  
  document.getElementById('formula-code').textContent = formula;
  
  // Update temperatura e nome
  let tempText = 'NEUTRO';
  let tempClass = 'temp-neutral';
  let reflectName = 'Naturale';
  
  if (primaryReflect) {
    const primary = REFLECTS[primaryReflect];
    reflectName = primary.name;
    
    if (primaryIntensified) {
      reflectName += ' INTENSO';
    }
    
    if (secondaryReflect) {
      const secondary = REFLECTS[secondaryReflect];
      reflectName += ' + ' + secondary.name;
      
      // Temperatura mista
      if (primary.temp === secondary.temp) {
        if (primary.temp === 'warm') {
          tempText = 'CALDO 🔥';
          tempClass = 'temp-warm';
        } else if (primary.temp === 'cold') {
          tempText = 'FREDDO ❄️';
          tempClass = 'temp-cold';
        }
      } else {
        tempText = 'MISTO';
        tempClass = 'temp-neutral';
      }
    } else {
      // Solo primario
      if (primary.temp === 'warm') {
        tempText = 'CALDO 🔥';
        tempClass = 'temp-warm';
      } else if (primary.temp === 'cold') {
        tempText = 'FREDDO ❄️';
        tempClass = 'temp-cold';
      }
    }
  }
  
  const tempBadge = document.getElementById('formula-temp');
  tempBadge.className = `temp-badge ${tempClass}`;
  tempBadge.textContent = tempText;
  
  document.getElementById('formula-name').textContent = reflectName;
  
  // ✨ NUOVO: Calcola e applica il colore reale come sfondo
  const finalColor = calculateHairColor();
  const formulaDisplay = document.querySelector('.formula-display');
  if (formulaDisplay && finalColor) {
    // Applica gradient con il colore calcolato
    formulaDisplay.style.background = `linear-gradient(135deg, ${finalColor} 0%, ${finalColor}dd 100%)`;
    formulaDisplay.style.border = `2px solid ${finalColor}`;
    formulaDisplay.style.boxShadow = `0 4px 20px ${finalColor}66, inset 0 1px 0 rgba(255,255,255,0.2)`;
    
    // Auto-adjust text color per contrasto
    const rgb = hexToRgb(finalColor);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    const textColor = brightness > 128 ? '#000000' : '#ffffff';
    
    formulaDisplay.querySelectorAll('.formula-label, .formula-code, .formula-meta, #formula-temp, #formula-name').forEach(el => {
      el.style.color = textColor;
    });
  }
}

// ========================================
// COLOR CALCULATOR (Approssimazione RGB)
// ========================================

function calculateHairColor() {
  // Base lightness scale (1-10)
  const baseColors = {
    1: '#1a1a1a',  // Nero
    2: '#2d2520',  // Bruno scurissimo
    3: '#3d2f1f',  // Bruno scuro
    4: '#5c4033',  // Bruno medio
    5: '#6b4e3d',  // Castano scuro
    6: '#8b6f47',  // Castano medio
    7: '#a68a5c',  // Biondo scuro
    8: '#c9a86a',  // Biondo medio
    9: '#d9c89e',  // Biondo chiarissimo
    10: '#f0e6d2'  // Platino
  };
  
  // Parti dal tono base
  let baseColor = baseColors[currentBaseTone] || baseColors[7];
  let rgb = hexToRgb(baseColor);
  
  // Se non ci sono riflessi, ritorna il base
  if (!primaryReflect) {
    return baseColor;
  }
  
  // Applica riflesso primario (50% weight)
  const primaryColor = hexToRgb(REFLECTS[primaryReflect].color);
  const primaryWeight = primaryIntensified ? 0.6 : 0.4;  // Intenso = più peso
  
  rgb.r = Math.round(rgb.r * (1 - primaryWeight) + primaryColor.r * primaryWeight);
  rgb.g = Math.round(rgb.g * (1 - primaryWeight) + primaryColor.g * primaryWeight);
  rgb.b = Math.round(rgb.b * (1 - primaryWeight) + primaryColor.b * primaryWeight);
  
  // Applica riflesso secondario (25% weight)
  if (secondaryReflect) {
    const secondaryColor = hexToRgb(REFLECTS[secondaryReflect].color);
    const secondaryWeight = 0.25;
    
    rgb.r = Math.round(rgb.r * (1 - secondaryWeight) + secondaryColor.r * secondaryWeight);
    rgb.g = Math.round(rgb.g * (1 - secondaryWeight) + secondaryColor.g * secondaryWeight);
    rgb.b = Math.round(rgb.b * (1 - secondaryWeight) + secondaryColor.b * secondaryWeight);
  }
  
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join('');
}

// ... (mantieni tutto il resto del codice)