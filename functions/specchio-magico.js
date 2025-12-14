// ========================================
// SPECCHIO MAGICO AI - MULTI-BRAND COLORIMETRY SYSTEM
// Sistema Slot: [BASE].[PRIMARIO][SECONDARIO]
// Esempio: 7.34 = Base 7 + Primario 3 (Dorato) + Secondario 4 (Ramato)
// ========================================

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// ========================================
// BRAND DATABASE (EXPANDED - 50+ BRANDS)
// ========================================

const BRAND_DATABASE = {
  // SISTEMA STANDARD (Internazionale) - Italia, Francia, Spagna, Portogallo
  standard: [
    { name: "L'Oréal Professionnel", lines: ['Majirel', 'Inoa', 'DiaRichesse', 'Luo Color', 'DiaLight'] },
    { name: 'Alfaparf Milano', lines: ['Evolution', 'Yellow', 'Revolution JC', 'Precious Nature'] },
    { name: 'Fanola', lines: ['Oro Therapy', 'No Yellow', 'Free Paint', 'Color Mask'] },
    { name: 'Revlon Professional', lines: ['Revlonissimo', 'Nutri Color', 'Young Color Excel'] },
    { name: 'Davines', lines: ['Mask with Vibrachrom', 'A New Colour'] },
    { name: 'Framesi', lines: ['Framcolor 2001', 'Framesi Bold', 'Eclectic Care'] },
    { name: 'Selective Professional', lines: ['Evo', 'Oligomineral', 'ColorEvo'] },
    { name: 'Elgon', lines: ['Moda & Style', 'I-Care'] },
    { name: 'Kemon', lines: ['Nayo', 'Cramer', 'Actyva'] },
    { name: 'Inebrya', lines: ['Color', 'Bionic Color', 'Kolor Vibes'] },
    { name: 'Vitality\'s', lines: ['Tone Intense', 'Art Absolute', 'Keratin Colour'] },
    { name: 'Oway', lines: ['Hcolor', 'Hbleach', 'Silk\'n Glo'] },
    { name: 'ColorDesign Hair', lines: ['Permanent Color', 'Demi-Permanent'] },
    { name: 'Diapason', lines: ['Cosmetica Italiana', 'Professional'] },
    { name: 'Be Hair', lines: ['Be Color', 'Crazy Color'] },
    { name: 'Brelil', lines: ['Colorianne', 'Numero'] },
    { name: 'Echosline', lines: ['Echos Color', 'Seliactive'] },
    { name: 'Koster', lines: ['Made in Italy Professional'] },
    { name: 'BES Beauty & Science', lines: ['Hi-Fi', 'Silkat Color'] },
    { name: 'Cotril', lines: ['IceCream Hair Color'] },
    { name: 'Green Light', lines: ['Natural Colors'] },
    { name: 'Medavita', lines: ['Luxviva'] },
    { name: 'Napura', lines: ['Napura Color'] },
    { name: 'Oyster Cosmetics', lines: ['Perlacolor'] },
    { name: 'Insight Professional', lines: ['Incolor'] },
    { name: 'Lowell', lines: ['Liso Leve Color'] },
    { name: 'Ekre', lines: ['Professional Color'] },
    { name: '6.Zero', lines: ['Take Over'] },
    { name: 'BeautyNova', lines: ['Color Line'] },
    { name: 'Color Joy', lines: ['Professional'] },
    { name: 'Free Limix', lines: ['Color Professional'] },
    { name: 'Duomo', lines: ['Italian Luxury Color'] }
  ],
  
  // SISTEMA TEDESCO (Invertito) - Germania, Austria, Svizzera
  german: [
    { name: 'Wella Professionals', lines: ['Koleston Perfect', 'Illumina Color', 'Color Touch', 'Color Fresh', 'Blondor'] },
    { name: 'Schwarzkopf Professional', lines: ['Igora Royal', 'Igora Vibrance', 'BlondMe', 'Essensity'] },
    { name: 'Londa Professional', lines: ['Londacolor Permanent', 'Londa Color'] },
    { name: 'Kadus Professional', lines: ['Kadus Color'] },
    { name: 'Goldwell (DE)', lines: ['Topchic', 'Colorance', 'Nectaya', 'Elumen'] },
    { name: 'Indola Professional', lines: ['Permanent Caring Color', 'Rapid Blonde'] },
    { name: 'Paul Mitchell (DE)', lines: ['The Color', 'PM Shines'] }
  ],
  
  // SISTEMA ALFABETICO (USA/UK)
  alphabetic: [
    { name: 'Matrix (L\'Oréal USA)', lines: ['SoColor', 'ColorSync', 'Color Graphics', 'SoRED'] },
    { name: 'Redken (L\'Oréal USA)', lines: ['Chromatics', 'Shades EQ', 'Color Fusion', 'Cover Fusion'] },
    { name: 'Goldwell (USA)', lines: ['Topchic USA', 'Colorance USA', '@Pure Pigments'] },
    { name: 'Joico', lines: ['LumiShine', 'Vero K-PAK', 'Intensities'] },
    { name: 'CHI', lines: ['Ionic Permanent', 'Chromashine', 'Colormaster'] },
    { name: 'Paul Mitchell', lines: ['The Color XG', 'Inkworks', 'PM Shines'] },
    { name: 'Pravana', lines: ['ChromaSilk', 'Vivids', 'Nevo'] },
    { name: 'Kenra', lines: ['Professional Color', 'Demi-Permanent'] },
    { name: 'Aveda', lines: ['Full Spectrum', 'Hair Color', 'Enlightener'] },
    { name: 'Pulp Riot', lines: ['Barcelona', 'Faction8', 'Noir', 'Cupid'] },
    { name: 'Keune', lines: ['Tinta Color', 'Semi Color'] },
    { name: 'Oribe', lines: ['Beautiful Color'] },
    { name: 'KMS (Kao)', lines: ['Color Vitality'] }
  ]
};

// ========================================
// REFLECT MAPPING (Universal Color -> System Code)
// ========================================

const REFLECT_SYSTEM_MAP = {
  standard: {
    ash: '1',
    violet: '2',
    gold: '3',
    copper: '4',
    mahogany: '5',
    red: '6',
    mat: '7',
    moka: '8',
    beige: '9',
    natural: '0'
  },
  german: {
    ash: '1',
    violet: '6',      // ⚠️ INVERSIONE CRITICA
    gold: '3',
    copper: '4',
    mahogany: '5',
    red: '4',         // spesso /4 o /44 intenso
    mat: '2',         // ⚠️ INVERSIONE CRITICA
    moka: '7',
    beige: '8',
    natural: '0'
  },
  alphabetic: {
    ash: 'A',
    violet: 'V',
    gold: 'G',
    copper: 'C',
    mahogany: 'M',
    red: 'R',
    mat: 'M',          // Matte
    moka: 'B',         // Brown/Beige
    beige: 'N',        // Natural/Neutral
    natural: 'N'
  }
};

// ========================================
// REFLECT DATA (Visual Properties)
// ========================================

const REFLECTS = {
  natural: { 
    name: 'Naturale', 
    nameEN: 'Natural',
    color: '#8b7355', 
    gradient: ['#8b7355', '#6b5645'],
    temp: 'neutral',
    icon: '',
    order: 0
  },
  ash: { 
    name: 'Cenere', 
    nameEN: 'Ash',
    color: '#a8a8a8', 
    gradient: ['#a8a8a8', '#888888'],
    temp: 'cold',
    icon: '❄️',
    order: 1
  },
  violet: { 
    name: 'Iridé/Viola', 
    nameEN: 'Violet',
    color: '#b8a8c8', 
    gradient: ['#b8a8c8', '#9888a8'],
    temp: 'cold',
    icon: '❄️',
    order: 2
  },
  gold: { 
    name: 'Dorato', 
    nameEN: 'Gold',
    color: '#d4af37', 
    gradient: ['#d4af37', '#b48f27'],
    temp: 'warm',
    icon: '🔥',
    order: 3
  },
  copper: { 
    name: 'Ramato', 
    nameEN: 'Copper',
    color: '#b87333', 
    gradient: ['#b87333', '#986323'],
    temp: 'warm',
    icon: '🔥',
    order: 4
  },
  mahogany: { 
    name: 'Mogano', 
    nameEN: 'Mahogany',
    color: '#c04000', 
    gradient: ['#c04000', '#a03000'],
    temp: 'warm',
    icon: '🔥',
    order: 5
  },
  red: { 
    name: 'Rosso', 
    nameEN: 'Red',
    color: '#c41e3a', 
    gradient: ['#c41e3a', '#a40e2a'],
    temp: 'warm',
    icon: '🔥',
    order: 6
  },
  mat: { 
    name: 'Mat (Verde)', 
    nameEN: 'Matte',
    color: '#8a9a5b', 
    gradient: ['#8a9a5b', '#6a7a4b'],
    temp: 'cold',
    icon: '❄️',
    order: 7
  },
  moka: { 
    name: 'Moka', 
    nameEN: 'Mocha',
    color: '#967969', 
    gradient: ['#967969', '#765948'],
    temp: 'neutral',
    icon: '',
    order: 8
  },
  beige: { 
    name: 'Beige', 
    nameEN: 'Beige',
    color: '#c9b7a3', 
    gradient: ['#c9b7a3', '#a99783'],
    temp: 'cold',
    icon: '❄️',
    order: 9
  }
};

// ========================================
// STATE
// ========================================

let currentSystem = null;
let selectedGender = null;
let primaryReflect = null;      // Primo riflesso (es: 3 in 7.34)
let secondaryReflect = null;    // Secondo riflesso (es: 4 in 7.34)
let primaryIntensified = false; // Double tap sul primario
let currentBaseTone = 7;
let capturedBlob = null;
let facingMode = 'environment';
let currentStream = null;
let lookConfig = {};
let lastTapTime = 0;
let lastTappedReflect = null;

const HAIRCUTS = {
  F: ['Bob', 'Long Bob (Lob)', 'Pixie Cut', 'Shag', 'Layered Cut', 'Blunt Cut', 'Mullet Moderno', 'Wolf Cut', 'Buzz Cut Femminile', 'Undercut Laterale', 'Carré', 'French Bob', 'Shaggy Bob', 'Bixie (Bob+Pixie)', 'Textured Lob'],
  M: ['Buzz Cut', 'Crew Cut', 'Undercut', 'Fade (Low/Mid/High)', 'Taper Fade', 'Pompadour', 'Quiff', 'Side Part', 'Textured Crop', 'French Crop', 'Slick Back', 'Faux Hawk', 'Spiky Hair', 'Caesar Cut', 'Ivy League'],
  X: ['Bob', 'Long Bob', 'Pixie', 'Shag', 'Undercut', 'Fade', 'Mullet', 'Wolf Cut', 'Buzz Cut', 'Crew Cut', 'Textured Crop', 'French Crop', 'Bixie', 'Pompadour', 'Quiff']
};

const LIP_COLORS = [
  { code: 'none', color: 'transparent', name: 'Nessuno', border: true },
  { code: 'nude-light', color: '#f5d5cb', name: 'Nude Chiaro' },
  { code: 'nude', color: '#d4a5a5', name: 'Nude' },
  { code: 'nude-dark', color: '#c98b8b', name: 'Nude Scuro' },
  { code: 'pink-light', color: '#ffb6d9', name: 'Rosa Chiaro' },
  { code: 'pink', color: '#ff6b9d', name: 'Rosa' },
  { code: 'magenta', color: '#ff1493', name: 'Magenta' },
  { code: 'red', color: '#c41e3a', name: 'Rosso' },
  { code: 'red-dark', color: '#8b0000', name: 'Rosso Scuro' },
  { code: 'orange', color: '#ff4500', name: 'Arancio' },
  { code: 'coral', color: '#ff8c69', name: 'Corallo' },
  { code: 'mauve', color: '#b565a7', name: 'Malva' },
  { code: 'purple', color: '#9b59b6', name: 'Viola' },
  { code: 'brown', color: '#704241', name: 'Marrone' },
  { code: 'gold', color: '#d4af37', name: 'Oro' },
  { code: 'black', color: '#000000', name: 'Nero' }
];

const BEARD_COLORS = [
  { code: 'black', color: '#1a1a1a', name: 'Nero' },
  { code: 'dark-brown', color: '#3d2314', name: 'Marrone Scuro' },
  { code: 'brown', color: '#6b5645', name: 'Marrone' },
  { code: 'light-brown', color: '#8b6f47', name: 'Marrone Chiaro' },
  { code: 'red', color: '#b87333', name: 'Ramato' },
  { code: 'blonde', color: '#d4af37', name: 'Biondo' },
  { code: 'grey', color: '#a0a0a0', name: 'Grigio' },
  { code: 'white', color: '#f5f5f5', name: 'Bianco' },
  { code: 'salt-pepper', color: 'linear-gradient(135deg, #6b5645 0%, #a0a0a0 50%, #f5f5f5 100%)', name: 'Sale e Pepe', gradient: true },
  { code: 'black-grey', color: 'linear-gradient(135deg, #1a1a1a 0%, #a0a0a0 100%)', name: 'Nero-Grigio', gradient: true }
];

// ========================================
// INITIALIZATION
// ========================================

function unlockFeature() {
  showLoader('Elaborazione pagamento...');
  setTimeout(() => {
    hideLoader();
    document.getElementById('unlock-check').classList.add('hidden');
    
    const savedSystem = localStorage.getItem('specchioMagico_system');
    if (savedSystem) {
      currentSystem = savedSystem;
      document.getElementById('settings-btn').style.display = 'block';
      showGenderSelection();
    } else {
      document.getElementById('brand-selection').classList.remove('hidden');
    }
  }, 2000);
}

function selectSystem(system) {
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
  currentSystem = system;
  localStorage.setItem('specchioMagico_system', system);
  
  document.getElementById('brand-selection').classList.add('hidden');
  document.getElementById('settings-btn').style.display = 'block';
  showGenderSelection();
}

function showGenderSelection() {
  document.getElementById('gender-section').classList.remove('hidden');
}

function selectGender(gender) {
  selectedGender = gender;
  document.querySelectorAll('.gender-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`gender-${gender.toLowerCase()}`).classList.add('active');
  document.getElementById('btn-start-camera').disabled = false;
  
  const labels = { F: 'Donna', M: 'Uomo', X: 'Fluid' };
  document.getElementById('selected-gender-label').textContent = labels[gender];
  
  const systemLabels = { standard: 'Standard', german: 'Tedesco', alphabetic: 'Alfabetico' };
  document.getElementById('current-system-label').textContent = systemLabels[currentSystem];
  
  const haircutSelect = document.getElementById('haircut');
  haircutSelect.innerHTML = HAIRCUTS[gender].map(cut => `<option value="${cut}">${cut}</option>`).join('');
  
  if (gender === 'F' || gender === 'X') {
    document.getElementById('makeup-section').classList.remove('hidden');
    renderLipColors();
  } else {
    document.getElementById('makeup-section').classList.add('hidden');
  }
  
  if (gender === 'M' || gender === 'X') {
    document.getElementById('beard-section').classList.remove('hidden');
    renderBeardColors();
  } else {
    document.getElementById('beard-section').classList.add('hidden');
  }
  
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

// ========================================
// CAMERA
// ========================================

async function startCamera() {
  if (!selectedGender) return;
  document.getElementById('gender-section').classList.add('hidden');
  document.getElementById('camera-section').classList.remove('hidden');
  
  try {
    currentStream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: facingMode,
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      } 
    });
    const video = document.getElementById('video-preview');
    video.srcObject = currentStream;
    video.style.transform = facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)';
  } catch (err) {
    console.error('Camera error:', err);
    showToast('Errore accesso camera');
  }
}

async function toggleCamera() {
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
  stopCamera();
  facingMode = facingMode === 'environment' ? 'user' : 'environment';
  await startCamera();
}

function capturePhoto() {
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
  const video = document.getElementById('video-preview');
  const canvas = document.getElementById('canvas-preview');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  
  if (facingMode === 'user') {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  
  ctx.drawImage(video, 0, 0);
  
  canvas.toBlob((blob) => {
    capturedBlob = blob;
    const url = URL.createObjectURL(blob);
    document.getElementById('client-photo').src = url;
    document.getElementById('before-img').src = url;
    stopCamera();
    document.getElementById('camera-section').classList.add('hidden');
    document.getElementById('config-section').classList.remove('hidden');
    
    renderReflectPalette();
    updateFormulaDisplay();
  }, 'image/jpeg', 0.85);
}

function stopCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }
}

function cancelCamera() {
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
  stopCamera();
  document.getElementById('camera-section').classList.add('hidden');
  document.getElementById('gender-section').classList.remove('hidden');
}

// ========================================
// COLOR COMPOSER (SLOT SYSTEM)
// Sistema: [BASE].[PRIMARIO][SECONDARIO]
// Esempio: 7.34 = Base 7 + Primario 3 (Dorato) + Secondario 4 (Ramato)
// Double tap = Intensificato (.33 o .44)
// ========================================

function renderReflectPalette() {
  const palette = document.getElementById('reflect-palette');
  palette.innerHTML = '';
  
  // Ordiniamo i riflessi
  const reflectKeys = Object.keys(REFLECTS).sort((a, b) => REFLECTS[a].order - REFLECTS[b].order);
  
  reflectKeys.forEach(key => {
    const reflect = REFLECTS[key];
    const systemCode = REFLECT_SYSTEM_MAP[currentSystem][key];
    
    const btn = document.createElement('div');
    btn.className = `reflect-drop ${reflect.temp}`;
    btn.dataset.reflect = key;
    btn.onclick = () => handleReflectTap(key);
    
    const gradient = `linear-gradient(135deg, ${reflect.gradient[0]} 0%, ${reflect.gradient[1]} 100%)`;
    btn.style.background = gradient;
    
    // Mostriamo il codice del sistema scelto
    let displayCode = systemCode;
    if (currentSystem === 'standard') displayCode = '.' + systemCode;
    else if (currentSystem === 'german') displayCode = '/' + systemCode;
    
    btn.innerHTML = `
      <div class="reflect-code">${displayCode}</div>
      <div class="reflect-name">${reflect.name}</div>
      <div class="reflect-temp-icon">${reflect.icon}</div>
    `;
    
    palette.appendChild(btn);
  });
  
  // Aggiungiamo il tasto RESET/CLEAR
  const resetBtn = document.createElement('div');
  resetBtn.className = 'reflect-drop neutral';
  resetBtn.style.background = 'rgba(255,255,255,0.1)';
  resetBtn.style.border = '2px dashed var(--glass-border)';
  resetBtn.onclick = resetReflects;
  resetBtn.innerHTML = `
    <div class="reflect-code"><i class="fas fa-undo"></i></div>
    <div class="reflect-name">Reset</div>
  `;
  palette.appendChild(resetBtn);
}

function handleReflectTap(reflectKey) {
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
  
  const now = Date.now();
  const isDoubleTap = (now - lastTapTime < 500) && (lastTappedReflect === reflectKey);
  
  if (isDoubleTap) {
    // DOUBLE TAP: Intensifica il primario
    if (primaryReflect === reflectKey && !primaryIntensified) {
      primaryIntensified = true;
      if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    }
  } else {
    // SINGLE TAP: Assegna agli slot
    if (!primaryReflect) {
      // Slot primario vuoto
      primaryReflect = reflectKey;
      primaryIntensified = false;
    } else if (primaryReflect === reflectKey) {
      // Rimuovi primario
      primaryReflect = secondaryReflect;
      secondaryReflect = null;
      primaryIntensified = false;
    } else if (!secondaryReflect) {
      // Slot secondario vuoto
      secondaryReflect = reflectKey;
    } else {
      // Shift: secondario diventa primario, nuovo riflesso diventa secondario
      primaryReflect = secondaryReflect;
      secondaryReflect = reflectKey;
      primaryIntensified = false;
    }
  }
  
  lastTapTime = now;
  lastTappedReflect = reflectKey;
  
  updateReflectSelection();
  updateFormulaDisplay();
}

function resetReflects() {
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
  primaryReflect = null;
  secondaryReflect = null;
  primaryIntensified = false;
  updateReflectSelection();
  updateFormulaDisplay();
}

function updateReflectSelection() {
  document.querySelectorAll('.reflect-drop').forEach(btn => {
    const key = btn.dataset.reflect;
    btn.classList.remove('active', 'primary', 'secondary', 'intensified');
    
    if (key === primaryReflect) {
      btn.classList.add('active', 'primary');
      btn.dataset.slot = '1';
      if (primaryIntensified) {
        btn.classList.add('intensified');
      }
    } else if (key === secondaryReflect) {
      btn.classList.add('active', 'secondary');
      btn.dataset.slot = '2';
    } else {
      delete btn.dataset.slot;
    }
  });
}

function updateToneDisplay() {
  currentBaseTone = parseInt(document.getElementById('base-tone').value);
  document.getElementById('tone-display').textContent = currentBaseTone;
  updateFormulaDisplay();
}

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
}

function renderLipColors() {
  const container = document.getElementById('lip-colors');
  container.innerHTML = '';
  
  LIP_COLORS.forEach((lip, index) => {
    const swatch = document.createElement('div');
    swatch.className = 'makeup-swatch';
    if (index === 0) swatch.classList.add('active');
    if (lip.border) swatch.style.border = '2px dashed var(--glass-border)';
    swatch.style.background = lip.color;
    swatch.title = lip.name;
    swatch.dataset.lip = lip.code;
    swatch.onclick = () => selectLipColor(lip.code);
    container.appendChild(swatch);
  });
}

function selectLipColor(code) {
  document.querySelectorAll('[data-lip]').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-lip="${code}"]`).classList.add('active');
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
}

function renderBeardColors() {
  const container = document.getElementById('beard-colors');
  container.innerHTML = '';
  
  BEARD_COLORS.forEach((beard, index) => {
    const swatch = document.createElement('div');
    swatch.className = 'makeup-swatch';
    if (index === 0) swatch.classList.add('active');
    swatch.style.background = beard.color;
    swatch.title = beard.name;
    swatch.dataset.beard = beard.code;
    swatch.onclick = () => selectBeardColor(beard.code);
    container.appendChild(swatch);
  });
}

function selectBeardColor(code) {
  document.querySelectorAll('[data-beard]').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-beard="${code}"]`).classList.add('active');
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
}

// ========================================
// PREVIEW GENERATION
// ========================================

function generatePreview() {
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
  showLoader('Generazione anteprima...');
  
  lookConfig = {
    gender: selectedGender,
    haircut: document.getElementById('haircut').value,
    formula: document.getElementById('formula-code').textContent,
    baseTone: currentBaseTone,
    primaryReflect: primaryReflect ? REFLECTS[primaryReflect].name : 'Naturale',
    secondaryReflect: secondaryReflect ? REFLECTS[secondaryReflect].name : null,
    intensified: primaryIntensified,
    system: currentSystem
  };
  
  if (selectedGender === 'F' || selectedGender === 'X') {
    lookConfig.eyeMakeup = document.getElementById('eye-makeup').value;
    const activeLip = document.querySelector('[data-lip].active');
    lookConfig.lipColor = activeLip ? activeLip.dataset.lip : 'none';
  }
  
  if (selectedGender === 'M' || selectedGender === 'X') {
    lookConfig.beardStyle = document.getElementById('beard-style').value;
    const activeBeard = document.querySelector('[data-beard].active');
    lookConfig.beardColor = activeBeard ? activeBeard.dataset.beard : 'black';
  }
  
  setTimeout(() => {
    displayResults();
    hideLoader();
  }, 2000);
}

function displayResults() {
  const systemLabels = {
    standard: 'Sistema Standard',
    german: 'Sistema Tedesco',
    alphabetic: 'Sistema Alfabetico'
  };
  
  let reflectDesc = lookConfig.primaryReflect;
  if (lookConfig.intensified) reflectDesc += ' INTENSO';
  if (lookConfig.secondaryReflect) reflectDesc += ' + ' + lookConfig.secondaryReflect;
  
  let summary = `
    <div class="summary-block">
      <strong style="color: var(--warning);">✂️ Capelli</strong><br>
      <span>Taglio: <strong>${lookConfig.haircut}</strong></span><br>
      <span>Formula: <strong>${lookConfig.formula}</strong> (${systemLabels[lookConfig.system]})</span><br>
      <span>Riflessi: <strong>${reflectDesc}</strong></span>
    </div>
  `;
  
  if (lookConfig.eyeMakeup) {
    const lipName = LIP_COLORS.find(l => l.code === lookConfig.lipColor)?.name || 'Nessuno';
    summary += `
      <div class="summary-block">
        <strong style="color: var(--warning);">💄 Trucco</strong><br>
        <span>Occhi: <strong>${lookConfig.eyeMakeup}</strong></span><br>
        <span>Labbra: <strong>${lipName}</strong></span>
      </div>
    `;
  }
  
  if (lookConfig.beardStyle && lookConfig.beardStyle !== 'none') {
    const beardName = BEARD_COLORS.find(b => b.code === lookConfig.beardColor)?.name || 'Nero';
    summary += `
      <div class="summary-block">
        <strong style="color: var(--primary);">🧔 Barba</strong><br>
        <span>Stile: <strong>${lookConfig.beardStyle}</strong></span><br>
        <span>Colore: <strong>${beardName}</strong></span>
      </div>
    `;
  }
  
  document.getElementById('summary-content').innerHTML = summary;
  document.getElementById('config-section').classList.add('hidden');
  document.getElementById('results-section').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// TRANSLATION SYSTEM
// ========================================

function translateFormula() {
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
  
  const systemLabels = {
    standard: 'Sistema Standard (Internazionale)',
    german: 'Sistema Tedesco (Wella/Schwarzkopf)',
    alphabetic: 'Sistema Alfabetico (USA)'
  };
  
  document.getElementById('your-formula').textContent = lookConfig.formula;
  document.getElementById('your-system').textContent = systemLabels[lookConfig.system];
  
  // Universal description
  let universalDesc = `Base ${lookConfig.baseTone}`;
  if (lookConfig.primaryReflect !== 'Naturale') {
    universalDesc += ` + ${lookConfig.primaryReflect}`;
    if (lookConfig.intensified) universalDesc += ' INTENSO';
    if (lookConfig.secondaryReflect) universalDesc += ` + ${lookConfig.secondaryReflect}`;
  }
  
  document.getElementById('universal-formula').textContent = universalDesc;
  document.getElementById('universal-desc').textContent = 'Formula universale (indipendente dal brand)';
  
  // Alternative systems
  const altContainer = document.getElementById('alternative-systems');
  altContainer.innerHTML = '<h4 style="margin: 20px 0 10px 0; font-size: 14px;">Traduzioni per altri sistemi:</h4>';
  
  Object.keys(REFLECT_SYSTEM_MAP).forEach(sys => {
    if (sys === currentSystem) return;
    
    let altFormula = lookConfig.baseTone.toString();
    let separator = sys === 'standard' ? '.' : sys === 'german' ? '/' : '';
    
    if (primaryReflect) {
      const primaryCode = REFLECT_SYSTEM_MAP[sys][primaryReflect];
      let reflectPart = primaryIntensified ? primaryCode + primaryCode : primaryCode;
      if (secondaryReflect) {
        reflectPart += REFLECT_SYSTEM_MAP[sys][secondaryReflect];
      }
      altFormula += separator + reflectPart;
    } else {
      if (sys === 'standard') altFormula += '.0';
      else if (sys === 'german') altFormula += '/0';
      else altFormula += 'N';
    }
    
    const altCard = document.createElement('div');
    altCard.className = 'translation-alt';
    altCard.innerHTML = `
      <strong>${systemLabels[sys]}</strong><br>
      <span style="font-size: 18px; color: var(--primary);">${altFormula}</span>
    `;
    altContainer.appendChild(altCard);
  });
  
  document.getElementById('translation-modal').classList.remove('hidden');
}

function closeTranslationModal() {
  document.getElementById('translation-modal').classList.add('hidden');
}

// ========================================
// BRAND SETTINGS
// ========================================

function openBrandSettings() {
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
  showDetailedBrandList();
}

function showDetailedBrandList() {
  const container = document.getElementById('brand-list-container');
  container.innerHTML = '';
  
  const systems = {
    standard: { name: 'Sistema Standard (Internazionale)', color: 'var(--primary)' },
    german: { name: 'Sistema Tedesco (Invertito)', color: 'var(--warning)' },
    alphabetic: { name: 'Sistema Alfabetico (USA/UK)', color: 'var(--success)' }
  };
  
  Object.entries(systems).forEach(([key, sys]) => {
    const section = document.createElement('div');
    section.style.marginBottom = '25px';
    
    const header = document.createElement('h4');
    header.style.margin = '0 0 12px 0';
    header.style.color = sys.color;
    header.style.fontSize = '15px';
    header.textContent = `${sys.name} (${BRAND_DATABASE[key].length} brand)`;
    section.appendChild(header);
    
    BRAND_DATABASE[key].forEach(brand => {
      const brandCard = document.createElement('div');
      brandCard.className = 'brand-list-item';
      brandCard.innerHTML = `
        <strong style="font-size: 14px;">${brand.name}</strong><br>
        <span style="font-size: 11px; color: var(--text-muted);">${brand.lines.join(', ')}</span>
      `;
      section.appendChild(brandCard);
    });
    
    container.appendChild(section);
  });
  
  document.getElementById('brand-list-modal').classList.remove('hidden');
}

function closeBrandListModal() {
  document.getElementById('brand-list-modal').classList.add('hidden');
}

// ========================================
// NAVIGATION
// ========================================

function backToConfig() {
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
  document.getElementById('results-section').classList.add('hidden');
  document.getElementById('config-section').classList.remove('hidden');
}

function saveLook() {
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
  showToast('Look salvato nel profilo cliente!');
}

function shareLook() {
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
  showToast('Funzione condivisione in arrivo');
}

function goBack() {
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
  const params = new URLSearchParams(window.location.search);
  window.location.href = `index.html?${params.toString()}`;
}

// ========================================
// UTILITIES
// ========================================

function showLoader(text = 'Caricamento...') {
  document.getElementById('loader-text').textContent = text;
  document.getElementById('loader').classList.remove('hidden');
}

function hideLoader() {
  document.getElementById('loader').classList.add('hidden');
}

function showToast(message) {
  if (tg?.showPopup) {
    tg.showPopup({ message });
  } else {
    alert(message);
  }
}

// Modal click outside
document.getElementById('brand-list-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'brand-list-modal') closeBrandListModal();
});

document.getElementById('translation-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'translation-modal') closeTranslationModal();
});