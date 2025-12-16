// ========================================
// SPECCHIO MAGICO AI - MAIN LOGIC
// Sistema Colorimetria Multi-Brand Professional
// ========================================

let selectedBrandSystem = null;
let selectedGender = null;
let selectedLevel = null;
let primaryReflect = null;
let primaryIntensified = false;
let secondaryReflect = null;
let capturedPhotoBlob = null;
let cameraStream = null;
let currentFacingMode = 'user';
let selectedCreativeColor = null;

// ========================================
// REFLECTS DATABASE (COMPLETE)
// ========================================

const REFLECTS = {
  // NATURALI
  '1': { code: '1', name: 'Cenere', nameEN: 'Ash', hex: '#A8A8A8', family: 'natural' },
  '2': { code: '2', name: 'Irisé/Viola', nameEN: 'Violet', hex: '#9370DB', family: 'natural' },
  '3': { code: '3', name: 'Dorato', nameEN: 'Golden', hex: '#FFD700', family: 'warm' },
  '4': { code: '4', name: 'Rame', nameEN: 'Copper', hex: '#B87333', family: 'warm' },
  '5': { code: '5', name: 'Mogano', nameEN: 'Mahogany', hex: '#8B4513', family: 'warm' },
  '6': { code: '6', name: 'Rosso', nameEN: 'Red', hex: '#DC143C', family: 'warm' },
  '7': { code: '7', name: 'Mat/Verde', nameEN: 'Mat', hex: '#6B8E23', family: 'natural' },
  '8': { code: '8', name: 'Moka/Marrone', nameEN: 'Mocha', hex: '#8B4513', family: 'natural' },
  '0': { code: '0', name: 'Naturale', nameEN: 'Natural', hex: '#8B7355', family: 'natural' },
  
  // SISTEMA TEDESCO (Invertiti)
  '1g': { code: '1', name: 'Cenere (Wella/Schwarzkopf)', nameEN: 'Ash', hex: '#A8A8A8', family: 'natural', german: true },
  '2g': { code: '2', name: 'Mat (Wella/Schwarzkopf)', nameEN: 'Mat', hex: '#6B8E23', family: 'natural', german: true },
  '3g': { code: '3', name: 'Dorato (Wella/Schwarzkopf)', nameEN: 'Golden', hex: '#FFD700', family: 'warm', german: true },
  '4g': { code: '4', name: 'Rosso (Wella/Schwarzkopf)', nameEN: 'Red', hex: '#DC143C', family: 'warm', german: true },
  '5g': { code: '5', name: 'Mogano (Wella/Schwarzkopf)', nameEN: 'Mahogany', hex: '#8B4513', family: 'warm', german: true },
  '6g': { code: '6', name: 'Viola (Wella/Schwarzkopf)', nameEN: 'Violet', hex: '#9370DB', family: 'natural', german: true },
  '7g': { code: '7', name: 'Marrone (Wella/Schwarzkopf)', nameEN: 'Brown', hex: '#8B4513', family: 'natural', german: true },
  
  // ALFABETICI (USA)
  'N': { code: 'N', name: 'Natural', nameEN: 'Natural', hex: '#8B7355', family: 'natural', alpha: true },
  'A': { code: 'A', name: 'Ash', nameEN: 'Ash', hex: '#A8A8A8', family: 'natural', alpha: true },
  'V': { code: 'V', name: 'Violet', nameEN: 'Violet', hex: '#9370DB', family: 'natural', alpha: true },
  'G': { code: 'G', name: 'Gold', nameEN: 'Golden', hex: '#FFD700', family: 'warm', alpha: true },
  'C': { code: 'C', name: 'Copper', nameEN: 'Copper', hex: '#B87333', family: 'warm', alpha: true },
  'M': { code: 'M', name: 'Mahogany', nameEN: 'Mahogany', hex: '#8B4513', family: 'warm', alpha: true },
  'R': { code: 'R', name: 'Red', nameEN: 'Red', hex: '#DC143C', family: 'warm', alpha: true },
  'B': { code: 'B', name: 'Brown/Beige', nameEN: 'Brown', hex: '#A0826D', family: 'natural', alpha: true }
};

// ========================================
// BRAND SYSTEM SELECTION
// ========================================

function selectSystem(system) {
  selectedBrandSystem = system;
  console.log('✅ Sistema selezionato:', system);
  
  document.getElementById('brand-selection').classList.add('hidden');
  document.getElementById('gender-section').classList.remove('hidden');
}

// ========================================
// GENDER SELECTION
// ========================================

function selectGender(gender) {
  selectedGender = gender;
  console.log('✅ Genere selezionato:', gender);
  
  // Highlight selected
  document.querySelectorAll('.gender-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('gender-' + gender.toLowerCase()).classList.add('active');
  
  // Enable camera button
  document.getElementById('btn-start-camera').disabled = false;
  
  // Init pillars if available
  if (typeof initPillars === 'function') {
    initPillars();
  }
}

// ========================================
// CAMERA FUNCTIONS
// ========================================

function startCamera() {
  document.getElementById('gender-section').classList.add('hidden');
  document.getElementById('camera-section').classList.remove('hidden');
  
  const video = document.getElementById('camera-video');
  
  navigator.mediaDevices.getUserMedia({ 
    video: { facingMode: currentFacingMode, width: { ideal: 1280 }, height: { ideal: 1920 } },
    audio: false
  })
  .then(stream => {
    cameraStream = stream;
    video.srcObject = stream;
  })
  .catch(err => {
    console.error('Camera error:', err);
    alert('Errore accesso camera: ' + err.message);
  });
}

function switchCamera() {
  currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
  stopCamera();
  startCamera();
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
  document.getElementById('camera-section').classList.add('hidden');
  document.getElementById('gender-section').classList.remove('hidden');
}

function capturePhoto() {
  const video = document.getElementById('camera-video');
  const canvas = document.getElementById('camera-canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  
  canvas.toBlob(blob => {
    capturedPhotoBlob = blob;
    const url = URL.createObjectURL(blob);
    document.getElementById('preview-img').src = url;
    document.getElementById('captured-preview').classList.remove('hidden');
    
    // Stop camera
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    
    console.log('✅ Foto catturata');
  }, 'image/jpeg', 0.95);
}

function proceedToConfig() {
  document.getElementById('camera-section').classList.add('hidden');
  
  if (selectedGender === 'X') {
    // Fluid -> Creative colors
    document.getElementById('fluid-config-section').classList.remove('hidden');
  } else {
    // F/M -> Standard config
    document.getElementById('config-section').classList.remove('hidden');
    initConfigSection();
  }
}

// ========================================
// CONFIG SECTION INIT
// ========================================

function initConfigSection() {
  // Populate levels 1-10
  const levelSelector = document.getElementById('level-selector');
  levelSelector.innerHTML = '';
  
  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement('div');
    btn.className = 'level-btn';
    btn.textContent = i;
    btn.onclick = () => selectLevel(i);
    levelSelector.appendChild(btn);
  }
  
  // Populate primary reflects
  populateReflects('primary');
}

function selectLevel(level) {
  selectedLevel = level;
  console.log('✅ Livello selezionato:', level);
  
  // Highlight
  document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  updateFormula();
}

function populateReflects(type) {
  const grid = document.getElementById(type + '-reflect-grid');
  grid.innerHTML = '';
  
  let reflectsToShow = [];
  
  if (selectedBrandSystem === 'alphabetic') {
    reflectsToShow = Object.values(REFLECTS).filter(r => r.alpha);
  } else if (selectedBrandSystem === 'german') {
    reflectsToShow = Object.values(REFLECTS).filter(r => r.german);
  } else {
    reflectsToShow = Object.values(REFLECTS).filter(r => !r.german && !r.alpha && r.code !== '0');
  }
  
  reflectsToShow.forEach(reflect => {
    const btn = document.createElement('div');
    btn.className = 'reflect-btn';
    btn.onclick = () => selectReflect(type, reflect.code);
    
    const code = document.createElement('div');
    code.className = 'reflect-code';
    code.textContent = reflect.code;
    
    const name = document.createElement('div');
    name.className = 'reflect-name';
    name.textContent = reflect.name.split(' (')[0];
    
    const swatch = document.createElement('div');
    swatch.className = 'reflect-swatch';
    swatch.style.backgroundColor = reflect.hex;
    
    btn.appendChild(code);
    btn.appendChild(name);
    btn.appendChild(swatch);
    grid.appendChild(btn);
  });
}

function selectReflect(type, code) {
  if (type === 'primary') {
    if (primaryReflect === code) {
      // Double click -> intensify
      primaryIntensified = true;
      console.log('✅ Riflesso primario INTENSIFICATO:', code);
    } else {
      primaryReflect = code;
      primaryIntensified = false;
      console.log('✅ Riflesso primario:', code);
      
      // Show secondary section
      document.getElementById('secondary-section').classList.remove('hidden');
      populateReflects('secondary');
    }
    
    // Highlight
    document.querySelectorAll('#primary-reflect-grid .reflect-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.reflect-btn').classList.add('active');
  } else {
    secondaryReflect = code;
    console.log('✅ Riflesso secondario:', code);
    
    // Highlight
    document.querySelectorAll('#secondary-reflect-grid .reflect-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.reflect-btn').classList.add('active');
  }
  
  updateFormula();
}

function updateFormula() {
  if (!selectedLevel || !primaryReflect) {
    document.getElementById('formula-code').textContent = '--.--';
    document.getElementById('formula-description').textContent = '';
    document.getElementById('btn-generate').disabled = true;
    return;
  }
  
  let formula = '';
  let description = '';
  
  if (selectedBrandSystem === 'alphabetic') {
    // 7G or 7GC
    formula = selectedLevel + primaryReflect;
    if (secondaryReflect) formula += secondaryReflect;
    
    const primary = REFLECTS[primaryReflect];
    description = `Livello ${selectedLevel} ${primary.name}`;
    if (secondaryReflect) {
      const secondary = REFLECTS[secondaryReflect];
      description += ` + ${secondary.name}`;
    }
  } else if (selectedBrandSystem === 'german') {
    // 7/6 or 7/66
    formula = selectedLevel + '/' + primaryReflect;
    if (primaryIntensified) formula += primaryReflect;
    else if (secondaryReflect) formula += secondaryReflect;
    
    const primary = REFLECTS[primaryReflect + 'g'];
    description = `Livello ${selectedLevel} ${primary.name}`;
    if (primaryIntensified) description += ' INTENSO';
    if (secondaryReflect) {
      const secondary = REFLECTS[secondaryReflect + 'g'];
      description += ` + ${secondary.name}`;
    }
  } else {
    // Standard: 7.2 or 7.22
    formula = selectedLevel + '.' + primaryReflect;
    if (primaryIntensified) formula += primaryReflect;
    else if (secondaryReflect) formula += secondaryReflect;
    
    const primary = REFLECTS[primaryReflect];
    description = `Livello ${selectedLevel} ${primary.name}`;
    if (primaryIntensified) description += ' INTENSO';
    if (secondaryReflect) {
      const secondary = REFLECTS[secondaryReflect];
      description += ` + ${secondary.name}`;
    }
  }
  
  document.getElementById('formula-code').textContent = formula;
  document.getElementById('formula-description').textContent = description;
  document.getElementById('btn-generate').disabled = false;
}

// ========================================
// CREATIVE COLORS (FLUID)
// ========================================

function loadCreativeColors() {
  const category = document.getElementById('creative-category').value;
  if (!category) {
    document.getElementById('creative-colors-container').classList.add('hidden');
    return;
  }
  
  document.getElementById('creative-colors-container').classList.remove('hidden');
  
  const grid = document.getElementById('creative-colors-grid');
  grid.innerHTML = '';
  
  if (typeof getCreativeColorsByCategory !== 'function') {
    console.error('Creative colors module not loaded');
    return;
  }
  
  const colors = getCreativeColorsByCategory(category);
  
  colors.forEach(color => {
    const btn = document.createElement('div');
    btn.className = 'reflect-btn';
    btn.onclick = () => selectCreativeColor(color.id, color.name, color.hex);
    
    const name = document.createElement('div');
    name.className = 'reflect-code';
    name.textContent = color.name;
    name.style.fontSize = '12px';
    
    const swatch = document.createElement('div');
    swatch.className = 'reflect-swatch';
    swatch.style.backgroundColor = color.hex;
    swatch.style.height = '30px';
    
    btn.appendChild(name);
    btn.appendChild(swatch);
    grid.appendChild(btn);
  });
}

function selectCreativeColor(id, name, hex) {
  selectedCreativeColor = { id, name, hex };
  console.log('✅ Creative color:', name);
  
  // Highlight
  document.querySelectorAll('#creative-colors-grid .reflect-btn').forEach(btn => btn.classList.remove('active'));
  event.target.closest('.reflect-btn').classList.add('active');
  
  document.getElementById('creative-formula-code').textContent = name;
  document.getElementById('creative-formula-description').textContent = 'Colore fantasy puro';
  document.getElementById('btn-generate-creative').disabled = false;
}

function generateCreativeAI() {
  if (!selectedCreativeColor) return;
  
  showLoader('Generazione AI in corso...');
  
  // Mock AI generation per creative
  setTimeout(() => {
    hideLoader();
    
    document.getElementById('fluid-config-section').classList.add('hidden');
    document.getElementById('results-section').classList.remove('hidden');
    
    // Show result
    document.getElementById('result-photo').src = URL.createObjectURL(capturedPhotoBlob);
    document.getElementById('result-title').textContent = selectedCreativeColor.name;
    document.getElementById('result-subtitle').textContent = 'Colore creativo applicato';
    
    // Mock AI image
    document.getElementById('ai-result-img').src = URL.createObjectURL(capturedPhotoBlob);
    
    const details = document.getElementById('result-details');
    details.innerHTML = `
      <div class="detail-item">
        <div class="detail-label">Colore</div>
        <div class="detail-value">${selectedCreativeColor.name}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Categoria</div>
        <div class="detail-value">${document.getElementById('creative-category').selectedOptions[0].text}</div>
      </div>
    `;
  }, 2000);
}

// ========================================
// AI GENERATION (STANDARD)
// ========================================

function generateAIResult() {
  if (!selectedLevel || !primaryReflect) return;
  
  showLoader('Generazione AI in corso...');
  
  // Mock AI generation
  setTimeout(() => {
    hideLoader();
    
    document.getElementById('config-section').classList.add('hidden');
    document.getElementById('results-section').classList.remove('hidden');
    
    // Show result
    document.getElementById('result-photo').src = URL.createObjectURL(capturedPhotoBlob);
    document.getElementById('result-title').textContent = document.getElementById('formula-code').textContent;
    document.getElementById('result-subtitle').textContent = document.getElementById('formula-description').textContent;
    
    // Mock AI image (in realtà qui chiameresti l'API)
    document.getElementById('ai-result-img').src = URL.createObjectURL(capturedPhotoBlob);
    
    const details = document.getElementById('result-details');
    details.innerHTML = `
      <div class="detail-item">
        <div class="detail-label">Formula</div>
        <div class="detail-value">${document.getElementById('formula-code').textContent}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Sistema</div>
        <div class="detail-value">${selectedBrandSystem}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Livello</div>
        <div class="detail-value">${selectedLevel}</div>
      </div>
    `;
  }, 2000);
}

// ========================================
// UTILITY
// ========================================

function showLoader(text) {
  document.getElementById('loader-text').textContent = text || 'Caricamento...';
  document.getElementById('loader').classList.remove('hidden');
}

function hideLoader() {
  document.getElementById('loader').classList.add('hidden');
}

function resetApp() {
  selectedBrandSystem = null;
  selectedGender = null;
  selectedLevel = null;
  primaryReflect = null;
  primaryIntensified = false;
  secondaryReflect = null;
  capturedPhotoBlob = null;
  selectedCreativeColor = null;
  
  document.querySelectorAll('.hidden').forEach(el => el.classList.remove('hidden'));
  document.getElementById('brand-selection').classList.remove('hidden');
  document.querySelectorAll('.card > div').forEach(section => {
    if (section.id !== 'brand-selection') section.classList.add('hidden');
  });
  
  console.log('🔄 App reset');
}

// ========================================
// INIT
// ========================================

window.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Specchio Magico AI initialized');
  hideLoader();
});

console.log('✅ Specchio Magico main logic loaded');