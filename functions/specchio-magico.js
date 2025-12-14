// ========================================
// SPECCHIO MAGICO AI - MULTI-BRAND COLORIMETRY SYSTEM
// ========================================

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// ========================================
// BRAND DATABASE
// ========================================

const BRAND_DATABASE = {
  // SISTEMA STANDARD (Internazionale)
  standard: [
    { name: "L'Oréal Professionnel", lines: ['Majirel', 'Inoa', 'DiaRichesse', 'Luo Color'] },
    { name: 'Alfaparf Milano', lines: ['Evolution', 'Yellow', 'Revolution'] },
    { name: 'Fanola', lines: ['Oro Therapy', 'No Yellow'] },
    { name: 'Revlon Professional', lines: ['Revlonissimo', 'Nutri Color'] },
    { name: 'Davines', lines: ['Mask with Vibrachrom'] },
    { name: 'Framesi', lines: ['Framcolor'] },
    { name: 'Selective Professional', lines: ['Evo', 'Oligomineral'] },
    { name: 'Schwarzkopf (linee IT)', lines: ['Essensity', 'BlondMe Italia'] },
    { name: 'Elgon', lines: ['Moda & Style'] },
    { name: 'Indola', lines: ['Permanent Caring Color'] },
    { name: 'Kemon', lines: ['Nayo', 'Cramer'] },
    { name: 'Lowell', lines: ['Liso Leve'] },
    { name: 'Oyster Cosmetics', lines: ['Perlacolor'] }
  ],
  
  // SISTEMA TEDESCO (Invertito)
  german: [
    { name: 'Wella Professionals', lines: ['Koleston Perfect', 'Illumina Color', 'Color Touch'] },
    { name: 'Schwarzkopf Professional', lines: ['Igora Royal', 'Igora Vibrance', 'BlondMe'] },
    { name: 'Londa Professional', lines: ['Londacolor', 'Londa Color'] },
    { name: 'Kadus Professional', lines: ['Kadus Color'] },
    { name: 'Goldwell (DE lines)', lines: ['Topchic', 'Colorance', 'Nectaya'] },
    { name: 'Indola (DE)', lines: ['Permanent'] },
    { name: 'Paul Mitchell (DE)', lines: ['The Color'] }
  ],
  
  // SISTEMA ALFABETICO (USA/UK)
  alphabetic: [
    { name: 'Matrix (USA)', lines: ['SoColor', 'ColorSync', 'Color Graphics'] },
    { name: 'Redken', lines: ['Chromatics', 'Shades EQ', 'Color Fusion'] },
    { name: 'Goldwell (USA)', lines: ['Topchic USA', 'Colorance USA'] },
    { name: 'Joico', lines: ['LumiShine', 'Vero K-PAK'] },
    { name: 'CHI', lines: ['Ionic', 'Chromashine'] },
    { name: 'Paul Mitchell', lines: ['The Color XG', 'Inkworks'] },
    { name: 'Pravana', lines: ['ChromaSilk', 'Vivids'] },
    { name: 'Kenra', lines: ['Professional Color'] },
    { name: 'Aveda', lines: ['Full Spectrum'] },
    { name: 'Pulp Riot', lines: ['Barcelona', 'Faction8'] }
  ]
};

// ========================================
// REFLECT MAPPING (Universal Color -> System Code)
// ========================================

const REFLECT_SYSTEM_MAP = {
  standard: {
    ash: '.1',
    violet: '.2',
    gold: '.3',
    copper: '.4',
    mahogany: '.5',
    red: '.6',
    mat: '.7',
    moka: '.8',
    beige: '.9',
    natural: '.0'
  },
  german: {
    ash: '/1',
    violet: '/6',      // ⚠️ INVERSIONE
    gold: '/3',
    copper: '/4',
    mahogany: '/5',
    red: '/4',         // spesso /4 o /44
    mat: '/2',         // ⚠️ INVERSIONE
    moka: '/7',
    beige: '/8',
    natural: '/0'
  },
  alphabetic: {
    ash: 'A',
    violet: 'V',
    gold: 'G',
    copper: 'C',
    mahogany: 'M',
    red: 'R',
    mat: 'M',          // Matte
    moka: 'B',         // Brown
    beige: 'N',        // Natural/Neutral
    natural: 'N'
  }
};

// ========================================
// REFLECT DATA (Visual Properties)
// ========================================

const REFLECTS = {
  ash: { 
    name: 'Cenere', 
    nameEN: 'Ash',
    color: '#a8a8a8', 
    gradient: ['#a8a8a8', '#888888'],
    temp: 'cold',
    icon: '❄️'
  },
  violet: { 
    name: 'Iridé/Viola', 
    nameEN: 'Violet',
    color: '#b8a8c8', 
    gradient: ['#b8a8c8', '#9888a8'],
    temp: 'cold',
    icon: '❄️'
  },
  gold: { 
    name: 'Dorato', 
    nameEN: 'Gold',
    color: '#d4af37', 
    gradient: ['#d4af37', '#b48f27'],
    temp: 'warm',
    icon: '🔥'
  },
  copper: { 
    name: 'Ramato', 
    nameEN: 'Copper',
    color: '#b87333', 
    gradient: ['#b87333', '#986323'],
    temp: 'warm',
    icon: '🔥'
  },
  mahogany: { 
    name: 'Mogano', 
    nameEN: 'Mahogany',
    color: '#c04000', 
    gradient: ['#c04000', '#a03000'],
    temp: 'warm',
    icon: '🔥'
  },
  red: { 
    name: 'Rosso', 
    nameEN: 'Red',
    color: '#c41e3a', 
    gradient: ['#c41e3a', '#a40e2a'],
    temp: 'warm',
    icon: '🔥'
  },
  mat: { 
    name: 'Mat (Verde)', 
    nameEN: 'Matte',
    color: '#8a9a5b', 
    gradient: ['#8a9a5b', '#6a7a4b'],
    temp: 'cold',
    icon: '❄️'
  },
  moka: { 
    name: 'Moka', 
    nameEN: 'Mocha',
    color: '#967969', 
    gradient: ['#967969', '#765948'],
    temp: 'neutral',
    icon: ''
  },
  beige: { 
    name: 'Beige', 
    nameEN: 'Beige',
    color: '#c9b7a3', 
    gradient: ['#c9b7a3', '#a99783'],
    temp: 'cold',
    icon: '❄️'
  },
  natural: { 
    name: 'Naturale', 
    nameEN: 'Natural',
    color: '#8b7355', 
    gradient: ['#8b7355', '#6b5645'],
    temp: 'neutral',
    icon: ''
  }
};

// ========================================
// STATE
// ========================================

let currentSystem = null;
let selectedGender = null;
let selectedReflects = [];
let currentBaseTone = 7;
let capturedBlob = null;
let facingMode = 'environment';
let currentStream = null;
let lookConfig = {};

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
    
    // Check if system already configured
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
// COLOR COMPOSER
// ========================================

function renderReflectPalette() {
  const palette = document.getElementById('reflect-palette');
  palette.innerHTML = '';
  
  const reflectKeys = ['ash', 'violet', 'gold', 'copper', 'mahogany', 'red', 'mat', 'moka', 'beige', 'natural'];
  
  reflectKeys.forEach(key => {
    const reflect = REFLECTS[key];
    const systemCode = REFLECT_SYSTEM_MAP[currentSystem][key];
    
    const btn = document.createElement('div');
    btn.className = `reflect-drop ${reflect.temp}`;
    btn.dataset.reflect = key;
    btn.onclick = () => toggleReflect(key);
    
    const gradient = `linear-gradient(135deg, ${reflect.gradient[0]} 0%, ${reflect.gradient[1]} 100%)`;
    btn.style.background = gradient;
    
    btn.innerHTML = `
      <div class="reflect-code">${systemCode}</div>
      <div class="reflect-name">${reflect.name}</div>
      <div class="reflect-temp-icon">${reflect.icon}</div>
    `;
    
    palette.appendChild(btn);
  });
}

function toggleReflect(reflectKey) {
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
  
  const index = selectedReflects.indexOf(reflectKey);
  
  if (index > -1) {
    selectedReflects.splice(index, 1);
  } else {
    if (selectedReflects.length < 2) {
      selectedReflects.push(reflectKey);
    } else {
      selectedReflects.shift();
      selectedReflects.push(reflectKey);
    }
  }
  
  updateReflectSelection();
  updateFormulaDisplay();
}

function updateReflectSelection() {
  document.querySelectorAll('.reflect-drop').forEach(btn => {
    const key = btn.dataset.reflect;
    if (selectedReflects.includes(key)) {
      btn.classList.add('active');
      const position = selectedReflects.indexOf(key);
      btn.dataset.position = position + 1;
    } else {
      btn.classList.remove('active');
      delete btn.dataset.position;
    }
  });
}

function updateToneDisplay() {
  currentBaseTone = parseInt(document.getElementById('base-tone').value);
  document.getElementById('tone-display').textContent = currentBaseTone;
  updateFormulaDisplay();
}

function updateFormulaDisplay() {
  let formula = currentBaseTone.toString();
  let separator = '';
  
  if (currentSystem === 'standard') separator = '.';
  else if (currentSystem === 'german') separator = '/';
  else separator = '';
  
  if (selectedReflects.length > 0) {
    const codes = selectedReflects.map(key => REFLECT_SYSTEM_MAP[currentSystem][key].replace(/[.\/]/g, ''));
    formula += separator + codes.join('');
  }
  
  document.getElementById('formula-code').textContent = formula;
  
  // Update temperature and name
  let tempText = 'NEUTRO';
  let tempClass = 'temp-neutral';
  let reflectName = 'Naturale';
  
  if (selectedReflects.length > 0) {
    const mainReflect = REFLECTS[selectedReflects[0]];
    reflectName = mainReflect.name;
    
    const temps = selectedReflects.map(key => REFLECTS[key].temp);
    if (temps.every(t => t === 'warm')) {
      tempText = 'CALDO 🔥';
      tempClass = 'temp-warm';
    } else if (temps.every(t => t === 'cold')) {
      tempText = 'FREDDO ❄️';
      tempClass = 'temp-cold';
    } else if (temps.includes('warm') || temps.includes('cold')) {
      tempText = 'MISTO';
      tempClass = 'temp-neutral';
    }
    
    if (selectedReflects.length > 1) {
      const secondReflect = REFLECTS[selectedReflects[1]];
      reflectName += ' + ' + secondReflect.name;
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
    reflects: selectedReflects.map(key => REFLECTS[key].name),
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
  
  let summary = `
    <div class="summary-block">
      <strong style="color: var(--warning);">✂️ Capelli</strong><br>
      <span>Taglio: <strong>${lookConfig.haircut}</strong></span><br>
      <span>Formula: <strong>${lookConfig.formula}</strong> (${systemLabels[lookConfig.system]})</span><br>
      <span>Riflessi: <strong>${lookConfig.reflects.join(' + ') || 'Naturale'}</strong></span>
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
  const universalDesc = `Base ${lookConfig.baseTone} + ${lookConfig.reflects.join(' + ') || 'Naturale'}`;
  document.getElementById('universal-formula').textContent = universalDesc;
  document.getElementById('universal-desc').textContent = 'Formula universale (indipendente dal brand)';
  
  // Alternative systems
  const altContainer = document.getElementById('alternative-systems');
  altContainer.innerHTML = '<h4 style="margin: 20px 0 10px 0; font-size: 14px;">Traduzioni per altri sistemi:</h4>';
  
  Object.keys(REFLECT_SYSTEM_MAP).forEach(sys => {
    if (sys === currentSystem) return;
    
    let altFormula = lookConfig.baseTone.toString();
    let separator = sys === 'standard' ? '.' : sys === 'german' ? '/' : '';
    
    if (selectedReflects.length > 0) {
      const codes = selectedReflects.map(key => REFLECT_SYSTEM_MAP[sys][key].replace(/[.\/]/g, ''));
      altFormula += separator + codes.join('');
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
    standard: { name: 'Sistema Standard', color: 'var(--primary)' },
    german: { name: 'Sistema Tedesco', color: 'var(--warning)' },
    alphabetic: { name: 'Sistema Alfabetico', color: 'var(--success)' }
  };
  
  Object.entries(systems).forEach(([key, sys]) => {
    const section = document.createElement('div');
    section.style.marginBottom = '20px';
    
    const header = document.createElement('h4');
    header.style.margin = '0 0 10px 0';
    header.style.color = sys.color;
    header.textContent = sys.name;
    section.appendChild(header);
    
    BRAND_DATABASE[key].forEach(brand => {
      const brandCard = document.createElement('div');
      brandCard.className = 'brand-list-item';
      brandCard.innerHTML = `
        <strong>${brand.name}</strong><br>
        <span style="font-size: 12px; color: var(--text-muted);">${brand.lines.join(', ')}</span>
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