// ========================================
// SPECCHIO MAGICO AI - MAIN ENGINE v4.0
// Sistema Colorimetria Professionale Multi-Brand + MASTER INTEGRATION
// ========================================

let currentSystem = null;
let selectedGender = null;
let currentBaseTone = 7;
let primaryReflect = null;
let primaryIntensified = false;
let secondaryReflect = null;
let clientPhotoData = null;
let currentStream = null;
let usingFrontCamera = true;
let currentRecipe = null;

// FLUID MODE FLAG
window.isFluidMode = false;

// ========================================
// PHASE 1: BRAND SYSTEM SELECTION
// ========================================

function selectSystem(system) {
  currentSystem = system;
  console.log('✅ Sistema selezionato:', system);
  
  document.getElementById('brand-selection').classList.add('hidden');
  document.getElementById('gender-section').classList.remove('hidden');
  
  const systemLabels = {
    'standard': 'Standard (IT/FR)',
    'german': 'Tedesco (DE)',
    'alphabetic': 'Alfabetico (USA)'
  };
  
  document.querySelectorAll('#current-system-label').forEach(el => {
    el.textContent = systemLabels[system];
  });
}

// ========================================
// PHASE 2: GENDER SELECTION + RESET LOGIC
// ========================================

function selectGender(gender) {
  // RESET STATE quando cambi genere
  resetSessionState();
  
  selectedGender = gender;
  console.log('✅ Genere selezionato:', gender);
  
  document.querySelectorAll('.gender-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`gender-${gender.toLowerCase()}`).classList.add('active');
  
  const genderLabels = { 
    F: 'Donna', 
    M: 'Uomo', 
    X: 'Fluid (Creative)' 
  };
  
  document.querySelectorAll('#selected-gender-label').forEach(el => {
    el.textContent = genderLabels[gender];
  });
  
  document.getElementById('btn-start-camera').disabled = false;
  
  // BRANCHING LOGIC
  if (gender === 'X') {
    // FLUID: Sistema pigmentazione pura (Creative Colors)
    window.isFluidMode = true;
    console.log('🌈 Modalità Creative Colors attivata');
  } else {
    // F/M: Sistema colorimetria classica
    window.isFluidMode = false;
    if (typeof initPillars === 'function') {
      initPillars();
    }
  }
}

function resetSessionState() {
  // Reset Classic Mode
  primaryReflect = null;
  primaryIntensified = false;
  secondaryReflect = null;
  currentBaseTone = 7;
  currentRecipe = null;
  
  // Reset Creative Mode (se esiste selectedCreativeColors)
  if (typeof selectedCreativeColors !== 'undefined') {
    selectedCreativeColors = [];
  }
  
  console.log('🔄 Session state reset');
}

// ========================================
// PHASE 3: CAMERA
// ========================================

function startCamera() {
  document.getElementById('gender-section').classList.add('hidden');
  document.getElementById('camera-section').classList.remove('hidden');
  
  navigator.mediaDevices.getUserMedia({ 
    video: { facingMode: 'user' }, 
    audio: false 
  })
  .then(stream => {
    currentStream = stream;
    document.getElementById('video-preview').srcObject = stream;
  })
  .catch(err => {
    console.error('Errore camera:', err);
    alert('Impossibile accedere alla camera');
  });
}

function toggleCamera() {
  if (!currentStream) return;
  
  currentStream.getTracks().forEach(track => track.stop());
  usingFrontCamera = !usingFrontCamera;
  
  navigator.mediaDevices.getUserMedia({ 
    video: { facingMode: usingFrontCamera ? 'user' : 'environment' }, 
    audio: false 
  })
  .then(stream => {
    currentStream = stream;
    document.getElementById('video-preview').srcObject = stream;
  })
  .catch(err => console.error('Errore toggle camera:', err));
}

function capturePhoto() {
  const video = document.getElementById('video-preview');
  const canvas = document.getElementById('canvas-preview');
  const ctx = canvas.getContext('2d');
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  
  clientPhotoData = canvas.toDataURL('image/jpeg', 0.8);
  
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }
  
  document.getElementById('camera-section').classList.add('hidden');
  
  // Set photo in BOTH sections (classic + fluid)
  const classicPhoto = document.querySelector('#config-section #client-photo');
  const fluidPhoto = document.querySelector('#fluid-config-section #client-photo');
  if (classicPhoto) classicPhoto.src = clientPhotoData;
  if (fluidPhoto) fluidPhoto.src = clientPhotoData;
  
  // ========================================
  // MASTER BRANCHING LOGIC (STRICT)
  // ========================================
  
  if (window.isFluidMode === true) {
    // FLUID MODE: Creative Colors UI
    console.log('🌈 [FLUID MODE] Caricamento UI Creative Colors...');
    
    // Nascondi Classic
    document.getElementById('config-section').classList.add('hidden');
    
    // Mostra Fluid
    document.getElementById('fluid-config-section').classList.remove('hidden');
    
    // Inizializza Fluid UI
    if (typeof populateFluidUI === 'function') {
      populateFluidUI();
    } else {
      console.error('❌ populateFluidUI() non trovata. Verificare inclusione specchio-magico-creative.js');
    }
  } else {
    // CLASSIC MODE: Colorimetria Tradizionale
    console.log('🎨 [CLASSIC MODE] Caricamento UI Colorimetria Classica...');
    
    // Nascondi Fluid
    document.getElementById('fluid-config-section').classList.add('hidden');
    
    // Mostra Classic
    document.getElementById('config-section').classList.remove('hidden');
    
    // Inizializza Classic UI
    populateHaircuts();
    renderReflectPalette();
    
    if (selectedGender === 'F') {
      document.getElementById('makeup-section').classList.remove('hidden');
      renderLipColors();
    }
    
    if (selectedGender === 'M' || selectedGender === 'X') {
      document.getElementById('beard-section').classList.remove('hidden');
      renderBeardColors();
    }
  }
}

function cancelCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }
  document.getElementById('camera-section').classList.add('hidden');
  document.getElementById('gender-section').classList.remove('hidden');
}

// ========================================
// REFLECT SYSTEM MAP (Multi-Brand)
// ========================================

const REFLECTS = {
  violet: { name: 'Viola', nameEN: 'Violet', color: '#8b5cf6', temp: 'cold' },
  ash: { name: 'Cenere', nameEN: 'Ash', color: '#9ca3af', temp: 'cold' },
  blue: { name: 'Blu', nameEN: 'Blue', color: '#3b82f6', temp: 'cold' },
  green: { name: 'Verde', nameEN: 'Green', color: '#10b981', temp: 'cold' },
  pearl: { name: 'Perlato', nameEN: 'Pearl', color: '#e5e7eb', temp: 'cold' },
  beige: { name: 'Beige', nameEN: 'Beige', color: '#d4c5b9', temp: 'neutral' },
  natural: { name: 'Naturale', nameEN: 'Natural', color: '#92705a', temp: 'neutral' },
  mat: { name: 'Mat', nameEN: 'Matte', color: '#78716c', temp: 'neutral' },
  gold: { name: 'Oro/Dorato', nameEN: 'Gold', color: '#fbbf24', temp: 'warm' },
  copper: { name: 'Rame', nameEN: 'Copper', color: '#ea580c', temp: 'warm' },
  mahogany: { name: 'Mogano', nameEN: 'Mahogany', color: '#7c2d12', temp: 'warm' },
  red: { name: 'Rosso', nameEN: 'Red', color: '#dc2626', temp: 'warm' }
};

const REFLECT_SYSTEM_MAP = {
  standard: {
    violet: '2', ash: '1', blue: '8', green: '7', pearl: '89',
    beige: '03', natural: '0', mat: '02', gold: '3', copper: '4',
    mahogany: '5', red: '6'
  },
  german: {
    violet: '6', ash: '1', blue: '8', green: '2', pearl: '9',
    beige: '12', natural: '0', mat: '02', gold: '3', copper: '4',
    mahogany: '5', red: '4'
  },
  alphabetic: {
    violet: 'V', ash: 'A', blue: 'B', green: 'Gr', pearl: 'P',
    beige: 'Be', natural: 'N', mat: 'M', gold: 'G', copper: 'C',
    mahogany: 'Mh', red: 'R'
  }
};

// ========================================
// HAIRCUTS
// ========================================

const HAIRCUTS = {
  F: ['Bob', 'Long Bob (Lob)', 'Pixie Cut', 'Shag', 'Layered Cut', 'Blunt Cut', 'Mullet Moderno', 'Wolf Cut', 'Buzz Cut Femminile', 'Undercut Laterale', 'Carré', 'French Bob', 'Shaggy Bob', 'Bixie (Bob+Pixie)', 'Textured Lob', 'Afro Naturale (Type 4)', 'TWA (Teeny Weeny Afro)', 'Tapered Afro', 'High Top Fade', 'Curly Shag'],
  M: ['Buzz Cut', 'Crew Cut', 'Undercut', 'Fade (Low/Mid/High)', 'Taper Fade', 'Pompadour', 'Quiff', 'Side Part', 'Textured Crop', 'French Crop', 'Slick Back', 'Faux Hawk', 'Spiky Hair', 'Caesar Cut', 'Ivy League', 'Skin Fade + Design', 'Drop Fade', 'Burst Fade', 'Edgar Cut', 'High Top Fade', 'Temple Fade'],
  X: ['Bob', 'Long Bob', 'Pixie', 'Shag', 'Undercut', 'Fade', 'Mullet', 'Wolf Cut', 'Buzz Cut', 'Crew Cut', 'Textured Crop', 'French Crop', 'Bixie', 'Pompadour', 'Quiff', 'Afro Naturale', 'Skin Fade', 'Silk Press', 'High Top Fade']
};

function populateHaircuts() {
  const select = document.getElementById('haircut');
  if (!select || !selectedGender) return;
  
  select.innerHTML = '';
  (HAIRCUTS[selectedGender] || HAIRCUTS.X).forEach(cut => {
    const option = document.createElement('option');
    option.value = cut;
    option.textContent = cut;
    select.appendChild(option);
  });
}

// ========================================
// MIXING CALCULATOR v4.0 (ENHANCED)
// ========================================

function estimateHairMass(haircutName) {
  const shortCuts = [
    'Buzz Cut', 'Pixie Cut', 'Crop', 'Crew Cut', 'Fade', 'Taper Fade',
    'French Crop', 'Textured Crop', 'Caesar Cut', 'Ivy League',
    'Skin Fade', 'Drop Fade', 'Burst Fade', 'Edgar Cut', 'Temple Fade',
    'TWA', 'Buzz Cut Femminile', 'Bixie'
  ];
  
  const mediumCuts = [
    'Bob', 'Carré', 'French Bob', 'Shaggy Bob', 'Undercut',
    'Side Part', 'Pompadour', 'Quiff', 'Slick Back', 'Faux Hawk',
    'Spiky Hair', 'Mullet', 'Tapered Afro', 'High Top Fade'
  ];
  
  const cutLower = haircutName.toLowerCase();
  
  if (shortCuts.some(c => cutLower.includes(c.toLowerCase()))) {
    return { category: 'Short', baseGrams: 30 };
  }
  
  if (mediumCuts.some(c => cutLower.includes(c.toLowerCase()))) {
    return { category: 'Medium', baseGrams: 40 };
  }
  
  return { category: 'Long', baseGrams: 60 };
}

function calculateMixingRecipe(baseTone, primaryKey, secondaryKey, intensified, lengthCategory, developerVolume = 20, colorTechnique = 'global', isCreativeMode = false, creativeColorsArray = []) {
  const hairMass = estimateHairMass(lengthCategory);
  let MassaBase = hairMass.baseGrams;
  
  // ========================================
  // A. MOLTIPLICATORE EXTENSION
  // ========================================
  let MoltiplicatoreExtension = 1.0;
  const extensionEl = document.getElementById('extensions-type');
  if (extensionEl && extensionEl.value !== 'none' && typeof EXTENSIONS !== 'undefined') {
    const ext = EXTENSIONS.find(e => e.id === extensionEl.value);
    if (ext && ext.massMultiplier) {
      MoltiplicatoreExtension = ext.massMultiplier;
    }
  }
  
  // ========================================
  // B. MOLTIPLICATORE TECNICA
  // ========================================
  let MoltiplicatoreTecnica = 1.0;
  const partialTechniques = [
    'balayage', 'shatush', 'airtouch', 'degrade', 
    'babylights', 'money-piece', 'highlights', 'lowlights'
  ];
  const isPartialTechnique = partialTechniques.includes(colorTechnique);
  const isPureGloss = colorTechnique === 'gloss';
  
  if (colorTechnique === 'root-touch') {
    MoltiplicatoreTecnica = 0.4; // Ricrescita
  } else if (isPureGloss) {
    MoltiplicatoreTecnica = 0.3; // Gloss puro
  } else if (isPartialTechnique) {
    MoltiplicatoreTecnica = 0.5; // Tecniche parziali
  } else {
    MoltiplicatoreTecnica = 1.0; // Global
  }
  
  // ========================================
  // TOTALE COLORE
  // ========================================
  let TotaleColore = Math.round(MassaBase * MoltiplicatoreExtension * MoltiplicatoreTecnica);
  
  // ========================================
  // C. CREATIVE/RAINBOW MODE DETECTION
  // ========================================
  if (isCreativeMode && creativeColorsArray.length > 0) {
    // PIGMENTAZIONE DIRETTA (No Ossidante)
    const tubes = creativeColorsArray.map(colorObj => ({
      name: colorObj.name,
      grams: Math.round(TotaleColore * (colorObj.percentage / 100)),
      percentage: colorObj.percentage,
      hex: colorObj.hex
    }));
    
    return {
      recipeType: '🌈 PIGMENTAZIONE DIRETTA',
      hairLength: hairMass.category,
      tubes: tubes,
      developer: null, // No ossidante
      totalMix: TotaleColore,
      specialNote: '✨ Creative Colors - Applicare su capelli pre-decolorati per massima brillantezza'
    };
  }
  
  // ========================================
  // D. CLASSIC MODE (CON OSSIDANTE)
  // ========================================
  let recipeType = 'COLORE PERMANENTE';
  let ratio = 1.5;
  let specialNote = null;
  
  if (isPureGloss) {
    recipeType = '✨ GLOSS LUCIDANTE';
    ratio = 2.0;
    developerVolume = Math.min(developerVolume, 10);
    specialNote = '⚡ Servizio rapido al lavatesta (15-20 min)';
  } else if (isPartialTechnique) {
    recipeType = 'TONALIZZANTE / GLOSS';
    ratio = 2.0;
    developerVolume = Math.min(developerVolume, 10);
  } else if (colorTechnique === 'bleach-tone') {
    recipeType = '🧊 BLEACH & TONE (Doppio Servizio)';
    specialNote = '⚠️ Richiede: 1) Decolorazione + 2) Tonalizzante. Calcolare entrambi separatamente.';
  } else if (developerVolume === 40) {
    ratio = 2.0;
  }
  
  const developerGrams = Math.round(TotaleColore * ratio);
  const totalMix = TotaleColore + developerGrams;
  
  let tubes = [];
  
  if (!primaryKey) {
    tubes.push({
      name: `Tubo ${baseTone}.0 (Naturale)`,
      grams: TotaleColore,
      percentage: 100
    });
  }
  else if (intensified && !secondaryKey) {
    const reflectCode = REFLECT_SYSTEM_MAP[currentSystem || 'standard'][primaryKey];
    tubes.push({
      name: `Tubo ${baseTone}.${reflectCode}${reflectCode} (${REFLECTS[primaryKey].name} INTENSO)`,
      grams: TotaleColore,
      percentage: 100
    });
  }
  else if (primaryKey && !secondaryKey) {
    const reflectCode = REFLECT_SYSTEM_MAP[currentSystem || 'standard'][primaryKey];
    tubes.push({
      name: `Tubo ${baseTone}.${reflectCode} (${REFLECTS[primaryKey].name})`,
      grams: TotaleColore,
      percentage: 100
    });
  }
  else if (primaryKey && secondaryKey) {
    const primaryCode = REFLECT_SYSTEM_MAP[currentSystem || 'standard'][primaryKey];
    const secondaryCode = REFLECT_SYSTEM_MAP[currentSystem || 'standard'][secondaryKey];
    
    const primaryGrams = Math.round(TotaleColore * 0.7);
    const secondaryGrams = TotaleColore - primaryGrams;
    
    tubes.push({
      name: `Tubo ${baseTone}.${primaryCode} (${REFLECTS[primaryKey].name})`,
      grams: primaryGrams,
      percentage: 70
    });
    
    tubes.push({
      name: `Tubo ${baseTone}.${secondaryCode} (${REFLECTS[secondaryKey].name})`,
      grams: secondaryGrams,
      percentage: 30
    });
  }
  
  return {
    recipeType: recipeType,
    hairLength: hairMass.category,
    tubes: tubes,
    developer: {
      volume: developerVolume,
      grams: developerGrams
    },
    totalMix: totalMix,
    specialNote: specialNote
  };
}

// ========================================
// REFLECT PALETTE RENDERER
// ========================================

function renderReflectPalette() {
  const container = document.getElementById('reflect-palette');
  if (!container) return;
  
  container.innerHTML = '';
  
  Object.entries(REFLECTS).forEach(([key, data]) => {
    const btn = document.createElement('div');
    btn.className = 'reflect-btn';
    btn.dataset.reflect = key;
    btn.innerHTML = `
      <div class="reflect-swatch" style="background: ${data.color};"></div>
      <div class="reflect-label">${getReflectLabel(key)}</div>
    `;
    
    btn.addEventListener('click', () => selectReflect(key));
    btn.addEventListener('dblclick', () => intensifyReflect(key));
    
    container.appendChild(btn);
  });
}

function getReflectLabel(key) {
  if (!currentSystem) return REFLECTS[key].name;
  return REFLECT_SYSTEM_MAP[currentSystem][key] || REFLECTS[key].name;
}

function selectReflect(key) {
  if (!primaryReflect) {
    primaryReflect = key;
    document.querySelector(`[data-reflect="${key}"]`).classList.add('active');
  } else if (primaryReflect === key && !secondaryReflect) {
    primaryReflect = null;
    primaryIntensified = false;
    document.querySelector(`[data-reflect="${key}"]`).classList.remove('active', 'intensified');
  } else if (primaryReflect !== key && !secondaryReflect) {
    secondaryReflect = key;
    document.querySelector(`[data-reflect="${key}"]`).classList.add('active', 'secondary');
  } else {
    document.querySelectorAll('.reflect-btn').forEach(btn => {
      btn.classList.remove('active', 'intensified', 'secondary');
    });
    primaryReflect = null;
    secondaryReflect = null;
    primaryIntensified = false;
  }
  
  updateFormulaDisplay();
}

function intensifyReflect(key) {
  if (primaryReflect === key) {
    primaryIntensified = !primaryIntensified;
    const btn = document.querySelector(`[data-reflect="${key}"]`);
    btn.classList.toggle('intensified', primaryIntensified);
    updateFormulaDisplay();
  }
}

// ========================================
// TONE SLIDER
// ========================================

function updateToneDisplay() {
  const slider = document.getElementById('base-tone');
  currentBaseTone = parseInt(slider.value);
  document.getElementById('tone-display').textContent = currentBaseTone;
  updateFormulaDisplay();
}

// ========================================
// FORMULA DISPLAY + COLOR PREVIEW
// ========================================

function updateFormulaDisplay() {
  let formula = currentBaseTone.toString();
  let separator = currentSystem === 'standard' ? '.' : currentSystem === 'german' ? '/' : '';
  
  if (primaryReflect) {
    const primaryCode = REFLECT_SYSTEM_MAP[currentSystem][primaryReflect];
    let reflectPart = primaryCode;
    
    if (primaryIntensified) {
      reflectPart = primaryCode + primaryCode;
    }
    
    if (secondaryReflect) {
      const secondaryCode = REFLECT_SYSTEM_MAP[currentSystem][secondaryReflect];
      reflectPart += secondaryCode;
    }
    
    formula += separator + reflectPart;
  } else {
    if (currentSystem === 'standard') formula += '.0';
    else if (currentSystem === 'german') formula += '/0';
    else formula += 'N';
  }
  
  document.getElementById('formula-code').textContent = formula;
  
  let tempText = 'NEUTRO';
  let tempClass = 'temp-neutral';
  let reflectName = 'Naturale';
  
  if (primaryReflect) {
    const primary = REFLECTS[primaryReflect];
    reflectName = primary.name;
    
    if (primaryIntensified) reflectName += ' INTENSO';
    
    if (secondaryReflect) {
      const secondary = REFLECTS[secondaryReflect];
      reflectName += ' + ' + secondary.name;
      
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
  
  const finalColor = calculateHairColor();
  const formulaDisplay = document.querySelector('.formula-display');
  if (formulaDisplay && finalColor) {
    formulaDisplay.style.background = `linear-gradient(135deg, ${finalColor} 0%, ${finalColor}dd 100%)`;
    formulaDisplay.style.border = `2px solid ${finalColor}`;
    formulaDisplay.style.boxShadow = `0 4px 20px ${finalColor}66`;
    
    const rgb = hexToRgb(finalColor);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    const textColor = brightness > 128 ? '#000000' : '#ffffff';
    
    formulaDisplay.querySelectorAll('.formula-label, .formula-code, .formula-meta, #formula-temp, #formula-name').forEach(el => {
      el.style.color = textColor;
    });
  }
}

function calculateHairColor() {
  const baseColors = {
    1: '#1a1a1a', 2: '#2d2520', 3: '#3d2f1f', 4: '#5c4033', 5: '#6b4e3d',
    6: '#8b6f47', 7: '#a68a5c', 8: '#c9a86a', 9: '#d9c89e', 10: '#f0e6d2'
  };
  
  let baseColor = baseColors[currentBaseTone] || baseColors[7];
  let rgb = hexToRgb(baseColor);
  
  if (!primaryReflect) return baseColor;
  
  const primaryColor = hexToRgb(REFLECTS[primaryReflect].color);
  const primaryWeight = primaryIntensified ? 0.6 : 0.4;
  
  rgb.r = Math.round(rgb.r * (1 - primaryWeight) + primaryColor.r * primaryWeight);
  rgb.g = Math.round(rgb.g * (1 - primaryWeight) + primaryColor.g * primaryWeight);
  rgb.b = Math.round(rgb.b * (1 - primaryWeight) + primaryColor.b * primaryWeight);
  
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

// ========================================
// MAKEUP & BEARD
// ========================================

const LIP_COLORS = [
  { code: 'none', name: 'Nessuno', color: 'transparent' },
  { code: 'nude', name: 'Nude', color: '#d4a891' },
  { code: 'pink', name: 'Rosa', color: '#ff69b4' },
  { code: 'red', name: 'Rosso', color: '#dc2626' },
  { code: 'berry', name: 'Berry', color: '#8b2252' },
  { code: 'plum', name: 'Prugna', color: '#5e2750' }
];

const BEARD_COLORS = [
  { code: 'natural', name: 'Naturale', color: '#4a3f35' },
  { code: 'black', name: 'Nero', color: '#1a1a1a' },
  { code: 'brown', name: 'Castano', color: '#5c4033' },
  { code: 'auburn', name: 'Auburn', color: '#a0522d' },
  { code: 'gray', name: 'Grigio', color: '#808080' },
  { code: 'salt-pepper', name: 'Sale e Pepe', color: '#4d4d4d' }
];

function renderLipColors() {
  const container = document.getElementById('lip-colors');
  if (!container) return;
  
  container.innerHTML = '';
  LIP_COLORS.forEach(lip => {
    const btn = document.createElement('div');
    btn.className = 'makeup-swatch';
    btn.dataset.lip = lip.code;
    btn.style.background = lip.color;
    btn.title = lip.name;
    if (lip.code === 'none') btn.style.border = '2px dashed var(--glass-border)';
    
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-lip]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    
    container.appendChild(btn);
  });
  
  document.querySelector('[data-lip="none"]')?.classList.add('active');
}

function renderBeardColors() {
  const container = document.getElementById('beard-colors');
  if (!container) return;
  
  container.innerHTML = '';
  BEARD_COLORS.forEach(beard => {
    const btn = document.createElement('div');
    btn.className = 'makeup-swatch';
    btn.dataset.beard = beard.code;
    btn.style.background = beard.color;
    btn.title = beard.name;
    
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-beard]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    
    container.appendChild(btn);
  });
  
  document.querySelector('[data-beard="natural"]')?.classList.add('active');
}

// ========================================
// GENERATE PREVIEW
// ========================================

function generatePreview() {
  showLoader('Generazione anteprima AI...');
  
  const aiPrompt = typeof generateAIPrompt === 'function' ? generateAIPrompt() : 'AI generation prompt';
  
  console.log('🎨 AI PROMPT:', aiPrompt);
  
  setTimeout(() => {
    hideLoader();
    showResults();
  }, 2000);
}

function showResults() {
  document.getElementById('config-section').classList.add('hidden');
  document.getElementById('results-section').classList.remove('hidden');
  document.getElementById('before-img').src = clientPhotoData;
  
  displayResults();
}

// ========================================
// UNIFIED DIAGNOSIS CARD (Classic + Fluid)
// ========================================

function generateDiagnosisCard() {
  const genderLabels = { F: 'Donna', M: 'Uomo', X: 'Fluid' };
  const systemLabels = {
    'standard': 'Standard (IT/FR)',
    'german': 'Tedesco (DE)',
    'alphabetic': 'Alfabetico (USA)'
  };
  
  const data = {
    gender: genderLabels[selectedGender] || 'N/A',
    system: systemLabels[currentSystem] || 'N/A',
    haircut: document.getElementById('haircut')?.value || 'N/A',
    styling: null,
    texture: null,
    extension: null,
    colorTechnique: null,
    formula: document.getElementById('formula-code')?.textContent || 'N/A',
    isCreative: window.isFluidMode,
    creativeColors: [],
    eyeMakeup: null,
    lipColor: null,
    beardStyle: null,
    beardColor: null
  };
  
  // STYLING
  const stylingEl = document.getElementById('styling-finish');
  if (stylingEl && stylingEl.value && typeof STYLING_OPTIONS !== 'undefined') {
    const stylingData = STYLING_OPTIONS.find(s => s.id === stylingEl.value);
    if (stylingData) data.styling = stylingData.label;
  }
  
  // TEXTURE
  const textureEl = document.getElementById('hair-texture');
  if (textureEl && textureEl.value && typeof HAIR_TEXTURES !== 'undefined') {
    const textureData = HAIR_TEXTURES[selectedGender]?.find(t => t.id === textureEl.value);
    if (textureData) data.texture = textureData.label;
  }
  
  // EXTENSION
  const extensionEl = document.getElementById('extensions-type');
  if (extensionEl && extensionEl.value !== 'none' && typeof EXTENSIONS !== 'undefined') {
    const extData = EXTENSIONS.find(e => e.id === extensionEl.value);
    if (extData) data.extension = extData.label;
  }
  
  // COLOR TECHNIQUE
  const techniqueEl = document.getElementById('color-technique') || document.getElementById('creative-placement-technique');
  if (techniqueEl && techniqueEl.value) {
    if (typeof COLOR_TECHNIQUES !== 'undefined') {
      const techData = COLOR_TECHNIQUES.find(t => t.id === techniqueEl.value);
      if (techData) data.colorTechnique = techData.label;
    } else if (typeof CREATIVE_PLACEMENT_TECHNIQUES !== 'undefined') {
      const techData = CREATIVE_PLACEMENT_TECHNIQUES.find(t => t.id === techniqueEl.value);
      if (techData) data.colorTechnique = techData.label;
    }
  }
  
  // CREATIVE COLORS
  if (window.isFluidMode && typeof selectedCreativeColors !== 'undefined') {
    data.creativeColors = selectedCreativeColors.map(c => ({
      name: c.name,
      hex: c.hex,
      percentage: c.percentage
    }));
  }
  
  // MAKEUP
  const eyeMakeupEl = document.getElementById('eye-makeup');
  if (eyeMakeupEl && eyeMakeupEl.value !== 'Nessuno') {
    data.eyeMakeup = eyeMakeupEl.value;
  }
  
  const activeLip = document.querySelector('[data-lip].active');
  if (activeLip && activeLip.dataset.lip !== 'none') {
    const lipData = LIP_COLORS.find(l => l.code === activeLip.dataset.lip);
    if (lipData) data.lipColor = lipData.name;
  }
  
  // BEARD
  const beardStyleEl = document.getElementById('beard-style');
  if (beardStyleEl && beardStyleEl.value !== 'none') {
    data.beardStyle = beardStyleEl.value;
  }
  
  const activeBeard = document.querySelector('[data-beard].active');
  if (activeBeard) {
    const beardData = BEARD_COLORS.find(b => b.code === activeBeard.dataset.beard);
    if (beardData) data.beardColor = beardData.name;
  }
  
  return data;
}

function injectDiagnosisCard() {
  const resultsSection = document.getElementById('results-section');
  const mixingCard = document.getElementById('mixing-calculator-card');
  
  const oldCard = document.getElementById('diagnosis-card');
  if (oldCard) oldCard.remove();
  
  const data = generateDiagnosisCard();
  
  const card = document.createElement('div');
  card.id = 'diagnosis-card';
  card.className = 'diagnosis-card';
  
  let html = `
    <div class="diagnosis-header">
      <span>👤 GENERE: ${data.gender}</span>
      <span>•</span>
      <span>🏷️ SISTEMA: ${data.system}</span>
    </div>
  `;
  
  // SEZIONE STRUTTURA
  html += `
    <div class="diagnosis-section">
      <h4>💇 STRUTTURA</h4>
      <ul>
        <li><strong>Taglio:</strong> ${data.haircut}</li>
  `;
  
  if (data.styling) html += `<li><strong>Styling:</strong> ${data.styling}</li>`;
  if (data.texture) html += `<li><strong>Texture:</strong> ${data.texture}</li>`;
  if (data.extension) html += `<li><strong>Extension:</strong> ${data.extension}</li>`;
  
  html += `</ul></div>`;
  
  // SEZIONE CHIMICA
  html += `
    <div class="diagnosis-section highlight">
      <h4>🎨 LABORATORIO COLORE</h4>
  `;
  
  if (data.colorTechnique) html += `<p><strong>Tecnica:</strong> ${data.colorTechnique}</p>`;
  
  if (data.isCreative && data.creativeColors.length > 0) {
    html += `<div class="rainbow-list">`;
    data.creativeColors.forEach(color => {
      html += `<div class="color-item"><span class="color-dot" style="background: ${color.hex};"></span>${color.name} (${color.percentage}%)</div>`;
    });
    html += `</div>`;
  } else {
    html += `<p><strong>Formula:</strong> ${data.formula}</p>`;
    if (currentRecipe && currentRecipe.developer && currentRecipe.developer.grams) {
      html += `<p><strong>Ossidante:</strong> ${currentRecipe.developer.volume} Vol</p>`;
    }
  }
  
  html += `</div>`;
  
  // SEZIONE VISAGISMO
  if (data.eyeMakeup || data.lipColor || data.beardStyle || data.beardColor) {
    html += `<div class="diagnosis-section"><h4>💄 TOTAL LOOK</h4><ul>`;
    if (data.eyeMakeup) html += `<li><strong>Make-up Occhi:</strong> ${data.eyeMakeup}</li>`;
    if (data.lipColor) html += `<li><strong>Labbra:</strong> ${data.lipColor}</li>`;
    if (data.beardStyle) html += `<li><strong>Barba:</strong> ${data.beardStyle}</li>`;
    if (data.beardColor) html += `<li><strong>Colore Barba:</strong> ${data.beardColor}</li>`;
    html += `</ul></div>`;
  }
  
  card.innerHTML = html;
  
  if (mixingCard) {
    resultsSection.insertBefore(card, mixingCard);
  } else {
    const firstCard = resultsSection.querySelector('.card');
    if (firstCard && firstCard.nextSibling) {
      resultsSection.insertBefore(card, firstCard.nextSibling);
    } else {
      resultsSection.appendChild(card);
    }
  }
}

// ========================================
// UNIFIED DISPLAY RESULTS (Classic + Fluid)
// ========================================

function displayResults() {
  const summary = document.getElementById('summary-content');
  if (!summary) return;
  
  const haircut = document.getElementById('haircut')?.value || 'Bob';
  const colorTechnique = document.getElementById('color-technique')?.value || 'global';
  
  // CALCOLA RICETTA
  if (window.isFluidMode && typeof selectedCreativeColors !== 'undefined') {
    // CREATIVE MODE
    currentRecipe = calculateMixingRecipe(
      null, null, null, false,
      haircut, 0, colorTechnique,
      true, // isCreativeMode
      selectedCreativeColors
    );
  } else {
    // CLASSIC MODE
    currentRecipe = calculateMixingRecipe(
      currentBaseTone,
      primaryReflect,
      secondaryReflect,
      primaryIntensified,
      haircut,
      20,
      colorTechnique,
      false, // isCreativeMode
      []
    );
  }
  
  // SUMMARY CONTENT (Breve)
  let html = `<div class="summary-item"><strong>Sistema:</strong> ${currentSystem}</div>`;
  html += `<div class="summary-item"><strong>Formula:</strong> ${document.getElementById('formula-code')?.textContent || 'Creative Mix'}</div>`;
  html += `<div class="summary-item"><strong>Taglio:</strong> ${haircut}</div>`;
  
  const styling = document.getElementById('styling-finish')?.value;
  if (styling && typeof STYLING_OPTIONS !== 'undefined') {
    const stylingData = STYLING_OPTIONS.find(s => s.id === styling);
    if (stylingData) html += `<div class="summary-item"><strong>Styling:</strong> ${stylingData.label}</div>`;
  }
  
  summary.innerHTML = html;
  
  // INJECT CARDS
  injectDiagnosisCard();
  injectMixingCard();
}

function injectMixingCard() {
  const resultsSection = document.getElementById('results-section');
  const btnContainer = resultsSection.querySelector('.btn-container');
  
  const oldCard = document.getElementById('mixing-calculator-card');
  if (oldCard) oldCard.remove();
  
  const card = document.createElement('div');
  card.id = 'mixing-calculator-card';
  card.className = 'card';
  card.style.marginTop = '15px';
  
  const recipeTypeColor = currentRecipe.recipeType.includes('PERMANENTE') ? 'var(--primary)' : 
                          currentRecipe.recipeType.includes('GLOSS LUCIDANTE') ? 'var(--success)' : 
                          currentRecipe.recipeType.includes('PIGMENTAZIONE DIRETTA') ? 'var(--warning)' :
                          currentRecipe.recipeType.includes('BLEACH') ? 'var(--error)' : 'var(--warning)';
  const recipeTypeIcon = currentRecipe.recipeType.includes('PERMANENTE') ? '🎨' : 
                         currentRecipe.recipeType.includes('GLOSS LUCIDANTE') ? '✨' :
                         currentRecipe.recipeType.includes('PIGMENTAZIONE DIRETTA') ? '🌈' :
                         currentRecipe.recipeType.includes('BLEACH') ? '🧊' : '✨';
  
  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <div>
        <h3 style="margin: 0;">⚖️ LABORATORIO COLORE</h3>
        <div style="margin-top: 5px; font-size: 11px; padding: 4px 10px; background: ${recipeTypeColor}; border-radius: 20px; display: inline-block; font-weight: 600;">${recipeTypeIcon} ${currentRecipe.recipeType}</div>
      </div>
      <span style="font-size: 12px; color: var(--text-muted); text-transform: uppercase;">Capelli ${currentRecipe.hairLength}</span>
    </div>
  `;
  
  if (currentRecipe.specialNote) {
    html += `
      <div style="padding: 12px; background: rgba(255,152,0,0.2); border-left: 3px solid var(--warning); border-radius: 8px; margin-bottom: 15px; font-size: 12px; line-height: 1.5;">
        ${currentRecipe.specialNote}
      </div>
    `;
  }
  
  html += `<div style="background: rgba(0,0,0,0.3); border-radius: 10px; padding: 15px; font-family: 'Courier New', monospace;">`;
  
  currentRecipe.tubes.forEach((tube, i) => {
    const colorDot = tube.hex ? `<span class="color-dot" style="background: ${tube.hex}; display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 6px;"></span>` : '';
    html += `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; ${i < currentRecipe.tubes.length - 1 ? 'border-bottom: 1px dashed var(--glass-border);' : ''}">
        <div>
          <div style="font-size: 13px; font-weight: 600; color: var(--text-primary);">${colorDot}${tube.name}</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${tube.percentage}% del colore totale</div>
        </div>
        <div style="font-size: 18px; font-weight: bold; color: var(--primary);">${tube.grams}g</div>
      </div>
    `;
  });
  
  // OSSIDANTE (solo se non è Creative)
  if (currentRecipe.developer && currentRecipe.developer.grams) {
    html += `<div style="height: 1px; background: var(--glass-border); margin: 15px 0;"></div>`;
    
    html += `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
        <div style="flex: 1;">
          <div style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">Ossidante</div>
          <select id="developer-volume-selector" onchange="recalculateRecipe()" style="width: 100%; padding: 8px; border: 1px solid var(--glass-border); border-radius: 6px; background: rgba(0,0,0,0.3); color: var(--text-primary); font-size: 12px;">
            <option value="10">10 Vol (3%) - Tono su Tono</option>
            <option value="20" selected>20 Vol (6%) - Standard/Copertura</option>
            <option value="30">30 Vol (9%) - Schiaritura 2-3 Liv</option>
            <option value="40">40 Vol (12%) - Superschiarenti</option>
          </select>
        </div>
        <div style="font-size: 18px; font-weight: bold; color: var(--success); margin-left: 15px;" id="developer-grams-display">${currentRecipe.developer.grams}g</div>
      </div>
    `;
  }
  
  html += `
    <div style="height: 2px; background: var(--primary); margin: 15px 0;"></div>
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
      <div style="font-size: 15px; font-weight: bold; color: var(--text-primary);">TOTALE MISCELA</div>
      <div style="font-size: 24px; font-weight: bold; color: var(--warning);" id="total-mix-display">${currentRecipe.totalMix}g</div>
    </div>
  `;
  
  html += `</div>`;
  
  card.innerHTML = html;
  
  resultsSection.insertBefore(card, btnContainer);
}

function recalculateRecipe() {
  const volume = parseInt(document.getElementById('developer-volume-selector').value);
  const haircut = document.getElementById('haircut')?.value || 'Bob';
  const colorTechnique = document.getElementById('color-technique')?.value || 'global';
  
  currentRecipe = calculateMixingRecipe(
    currentBaseTone,
    primaryReflect,
    secondaryReflect,
    primaryIntensified,
    haircut,
    volume,
    colorTechnique
  );
  
  document.getElementById('developer-grams-display').textContent = currentRecipe.developer.grams + 'g';
  document.getElementById('total-mix-display').textContent = currentRecipe.totalMix + 'g';
}

function backToConfig() {
  document.getElementById('results-section').classList.add('hidden');
  
  if (window.isFluidMode) {
    document.getElementById('fluid-config-section').classList.remove('hidden');
  } else {
    document.getElementById('config-section').classList.remove('hidden');
  }
}

// ========================================
// TRANSLATION
// ========================================

function translateFormula() {
  document.getElementById('translation-modal').classList.remove('hidden');
  
  const formula = document.getElementById('formula-code')?.textContent || 'Creative Mix';
  document.getElementById('your-formula').textContent = formula;
  document.getElementById('your-system').textContent = currentSystem || 'Creative';
  
  let universalDesc = `Tono Base: ${currentBaseTone}\n`;
  if (primaryReflect) {
    universalDesc += `Riflesso: ${REFLECTS[primaryReflect].name}`;
    if (primaryIntensified) universalDesc += ' (Intenso)';
    if (secondaryReflect) universalDesc += ` + ${REFLECTS[secondaryReflect].name}`;
  }
  
  if (window.isFluidMode && typeof selectedCreativeColors !== 'undefined') {
    universalDesc = 'Creative Colors Mix:\n';
    selectedCreativeColors.forEach(c => {
      universalDesc += `${c.name} (${c.percentage}%)\n`;
    });
  }
  
  document.getElementById('universal-desc').textContent = universalDesc;
}

function closeTranslationModal() {
  document.getElementById('translation-modal').classList.add('hidden');
}

// ========================================
// SAVE & SHARE
// ========================================

function saveLook() {
  const lookData = {
    system: currentSystem,
    gender: selectedGender,
    formula: document.getElementById('formula-code')?.textContent || 'Creative Mix',
    haircut: document.getElementById('haircut')?.value,
    recipe: currentRecipe,
    diagnosis: generateDiagnosisCard(),
    photo: clientPhotoData,
    timestamp: Date.now()
  };
  
  console.log('💾 Salvato:', lookData);
  alert('Look salvato con ricetta!');
}

function shareLook() {
  alert('Funzione condivisione in arrivo!');
}

// ========================================
// NAVIGATION
// ========================================

function goBack() {
  const sections = ['results-section', 'config-section', 'fluid-config-section', 'camera-section', 'gender-section', 'brand-selection'];
  
  for (let i = 0; i < sections.length; i++) {
    const section = document.getElementById(sections[i]);
    if (section && !section.classList.contains('hidden')) {
      section.classList.add('hidden');
      
      if (i + 1 < sections.length) {
        document.getElementById(sections[i + 1]).classList.remove('hidden');
      }
      break;
    }
  }
}

// ========================================
// LOADER
// ========================================

function showLoader(text = 'Caricamento...') {
  document.getElementById('loader-text').textContent = text;
  document.getElementById('loader').classList.remove('hidden');
}

function hideLoader() {
  document.getElementById('loader').classList.add('hidden');
}