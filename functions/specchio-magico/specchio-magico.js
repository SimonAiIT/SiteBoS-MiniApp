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
let allClients = []; // Store all clients for filtering
let currentInviteLink = '';

// URL params
const urlParams = new URLSearchParams(window.location.search);
const owner = urlParams.get('owner') || '';
const fromPhotoSession = urlParams.get('fromPhotoSession') === 'true';

// Webhook URL - TODO: Replace with actual URL
const WEBHOOK_URL = 'https://hook.eu2.make.com/your-webhook-id';

// ========================================
// LOAD PHOTOS FROM SESSION STORAGE
// ========================================

if (fromPhotoSession) {
  console.log('📸 Loading photos from Photo Session...');
  
  const storedPhoto = sessionStorage.getItem('photo_front');
  if (storedPhoto) {
    // Convert base64 back to blob - THIS IS ASYNC!
    fetch(storedPhoto)
      .then(res => res.blob())
      .then(blob => {
        capturedPhotoBlob = blob;
        console.log('✅ Photo loaded from sessionStorage:', blob.size, 'bytes');
        console.log('👍 Photo ready for use');
      })
      .catch(err => {
        console.error('❌ Error loading photo from sessionStorage:', err);
      });
  } else {
    console.warn('⚠️ No photo found in sessionStorage');
  }
}

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
  
  const brandSection = document.getElementById('brand-selection');
  if (brandSection) brandSection.classList.add('hidden');
  
  // If coming from photo session with photo already captured AND gender set, skip directly to config
  if (fromPhotoSession && capturedPhotoBlob && selectedGender) {
    console.log('🚀 FromPhotoSession=true, photo exists, gender set - proceeding to config');
    proceedToConfig();
  } else if (fromPhotoSession && selectedGender) {
    // Photo not loaded yet - wait for it
    console.log('⏳ Waiting for photo to load before proceeding...');
    const checkInterval = setInterval(() => {
      if (capturedPhotoBlob) {
        clearInterval(checkInterval);
        console.log('✅ Photo ready - proceeding to config');
        proceedToConfig();
      }
    }, 100);
    
    // Timeout after 5s
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!capturedPhotoBlob) {
        console.error('❌ Photo not loaded after 5s - cannot proceed');
        alert('Errore: foto non caricata. Riprova.');
        const brandSection = document.getElementById('brand-selection');
        if (brandSection) brandSection.classList.remove('hidden');
      }
    }, 5000);
  } else {
    // Normal flow - show gender selection (if it exists)
    const genderSection = document.getElementById('gender-section');
    if (genderSection) {
      genderSection.classList.remove('hidden');
    } else {
      console.warn('⚠️ gender-section not found (might be removed)');
    }
  }
}

// ========================================
// GENDER SELECTION
// ========================================

function selectGender(gender) {
  selectedGender = gender;
  console.log('✅ Genere selezionato:', gender);
  
  // Highlight selected
  const genderBtns = document.querySelectorAll('.gender-btn');
  genderBtns.forEach(btn => btn.classList.remove('active'));
  const selectedBtn = document.getElementById('gender-' + gender.toLowerCase());
  if (selectedBtn) selectedBtn.classList.add('active');
  
  // Enable camera button
  const cameraBtn = document.getElementById('btn-start-camera');
  if (cameraBtn) cameraBtn.disabled = false;
  
  // Init pillars if available
  if (typeof initPillars === 'function') {
    initPillars();
  }
}

// ========================================
// CAMERA FUNCTIONS
// ========================================

function startCamera() {
  const genderSection = document.getElementById('gender-section');
  const cameraSection = document.getElementById('camera-section');
  
  if (genderSection) genderSection.classList.add('hidden');
  if (cameraSection) cameraSection.classList.remove('hidden');
  
  const video = document.getElementById('camera-video');
  if (!video) return;
  
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
  const cameraSection = document.getElementById('camera-section');
  const genderSection = document.getElementById('gender-section');
  if (cameraSection) cameraSection.classList.add('hidden');
  if (genderSection) genderSection.classList.remove('hidden');
}

function capturePhoto() {
  const video = document.getElementById('camera-video');
  const canvas = document.getElementById('camera-canvas');
  if (!video || !canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  
  canvas.toBlob(blob => {
    capturedPhotoBlob = blob;
    const url = URL.createObjectURL(blob);
    const previewImg = document.getElementById('preview-img');
    const capturedPreview = document.getElementById('captured-preview');
    
    if (previewImg) previewImg.src = url;
    if (capturedPreview) capturedPreview.classList.remove('hidden');
    
    // Stop camera
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    
    console.log('✅ Foto catturata');
  }, 'image/jpeg', 0.95);
}

function proceedToConfig() {
  console.log('📎 proceedToConfig() called');
  console.log('- selectedGender:', selectedGender);
  console.log('- capturedPhotoBlob:', capturedPhotoBlob ? 'exists' : 'null');
  console.log('- selectedBrandSystem:', selectedBrandSystem);
  
  const cameraSection = document.getElementById('camera-section');
  const brandSection = document.getElementById('brand-selection');
  const fluidConfig = document.getElementById('fluid-config-section');
  const standardConfig = document.getElementById('config-section');
  
  // Hide previous sections (if they exist)
  if (cameraSection) cameraSection.classList.add('hidden');
  if (brandSection) brandSection.classList.add('hidden');
  
  if (selectedGender === 'X') {
    // Fluid -> Creative colors
    console.log('🌈 Gender X - showing fluid-config-section');
    if (fluidConfig) fluidConfig.classList.remove('hidden');
  } else {
    // F/M -> Standard config
    console.log('⚙️ Gender F/M - showing config-section');
    if (standardConfig) {
      standardConfig.classList.remove('hidden');
      initConfigSection();
    }
  }
}

// ========================================
// CONFIG SECTION INIT
// ========================================

function initConfigSection() {
  // Populate levels 1-10
  const levelSelector = document.getElementById('level-selector');
  if (!levelSelector) return;
  
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
  if (!grid) return;
  
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
      const secondarySection = document.getElementById('secondary-section');
      if (secondarySection) {
        secondarySection.classList.remove('hidden');
        populateReflects('secondary');
      }
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
  const formulaCode = document.getElementById('formula-code');
  const formulaDesc = document.getElementById('formula-description');
  const btnGenerate = document.getElementById('btn-generate');
  
  if (!formulaCode || !selectedLevel || !primaryReflect) {
    if (formulaCode) formulaCode.textContent = '--.--';
    if (formulaDesc) formulaDesc.textContent = '';
    if (btnGenerate) btnGenerate.disabled = true;
    return;
  }
  
  let formula = '';
  let description = '';
  
  if (selectedBrandSystem === 'alphabetic') {
    formula = selectedLevel + primaryReflect;
    if (secondaryReflect) formula += secondaryReflect;
    
    const primary = REFLECTS[primaryReflect];
    description = `Livello ${selectedLevel} ${primary.name}`;
    if (secondaryReflect) {
      const secondary = REFLECTS[secondaryReflect];
      description += ` + ${secondary.name}`;
    }
  } else if (selectedBrandSystem === 'german') {
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
  
  formulaCode.textContent = formula;
  formulaDesc.textContent = description;
  if (btnGenerate) btnGenerate.disabled = false;
}

// ========================================
// CREATIVE COLORS (FLUID)
// ========================================

function loadCreativeColors() {
  const category = document.getElementById('creative-category').value;
  const container = document.getElementById('creative-colors-container');
  
  if (!category || !container) {
    if (container) container.classList.add('hidden');
    return;
  }
  
  container.classList.remove('hidden');
  
  const grid = document.getElementById('creative-colors-grid');
  if (!grid) return;
  
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
  
  const formulaCode = document.getElementById('creative-formula-code');
  const formulaDesc = document.getElementById('creative-formula-description');
  const btnGenerate = document.getElementById('btn-generate-creative');
  
  if (formulaCode) formulaCode.textContent = name;
  if (formulaDesc) formulaDesc.textContent = 'Colore fantasy puro';
  if (btnGenerate) btnGenerate.disabled = false;
}

function generateCreativeAI() {
  if (!selectedCreativeColor || !capturedPhotoBlob) return;
  
  showLoader('Generazione AI in corso...');
  
  setTimeout(() => {
    hideLoader();
    
    const fluidConfig = document.getElementById('fluid-config-section');
    const resultsSection = document.getElementById('results-section');
    
    if (fluidConfig) fluidConfig.classList.add('hidden');
    if (resultsSection) resultsSection.classList.remove('hidden');
    
    const resultPhoto = document.getElementById('result-photo');
    const resultTitle = document.getElementById('result-title');
    const resultSubtitle = document.getElementById('result-subtitle');
    const aiResultImg = document.getElementById('ai-result-img');
    
    if (resultPhoto) resultPhoto.src = URL.createObjectURL(capturedPhotoBlob);
    if (resultTitle) resultTitle.textContent = selectedCreativeColor.name;
    if (resultSubtitle) resultSubtitle.textContent = 'Colore creativo applicato';
    if (aiResultImg) aiResultImg.src = URL.createObjectURL(capturedPhotoBlob);
    
    const details = document.getElementById('result-details');
    const creativeCategory = document.getElementById('creative-category');
    if (details && creativeCategory) {
      details.innerHTML = `
        <div class="detail-item">
          <div class="detail-label">Colore</div>
          <div class="detail-value">${selectedCreativeColor.name}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Categoria</div>
          <div class="detail-value">${creativeCategory.selectedOptions[0].text}</div>
        </div>
      `;
    }
    
    // Load client list
    loadClientList();
  }, 2000);
}

// ========================================
// AI GENERATION (STANDARD)
// ========================================

function generateAIResult() {
  if (!selectedLevel || !primaryReflect || !capturedPhotoBlob) {
    console.error('❌ Missing required data for AI generation');
    console.log('- selectedLevel:', selectedLevel);
    console.log('- primaryReflect:', primaryReflect);
    console.log('- capturedPhotoBlob:', capturedPhotoBlob);
    return;
  }
  
  showLoader('Generazione AI in corso...');
  
  const reader = new FileReader();
  reader.onloadend = async () => {
    const photoBase64 = reader.result;
    const formulaCodeEl = document.getElementById('formula-code');
    
    const payload = {
      action: 'generate_hair_color_ai',
      owner: owner,
      photo: photoBase64,
      formula: {
        code: formulaCodeEl ? formulaCodeEl.textContent : '',
        system: selectedBrandSystem,
        level: selectedLevel,
        primary_reflect: primaryReflect,
        primary_intensified: primaryIntensified,
        secondary_reflect: secondaryReflect
      },
      gender: selectedGender
    };
    
    console.log('🚀 Calling backend webhook...', payload.action);
    
    try {
      // TODO: Uncomment when webhook is ready
      // const response = await fetch(WEBHOOK_URL, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });
      // const data = await response.json();
      
      // Mock response
      setTimeout(() => {
        hideLoader();
        
        const configSection = document.getElementById('config-section');
        const resultsSection = document.getElementById('results-section');
        
        if (configSection) configSection.classList.add('hidden');
        if (resultsSection) resultsSection.classList.remove('hidden');
        
        const resultPhoto = document.getElementById('result-photo');
        const resultTitle = document.getElementById('result-title');
        const resultSubtitle = document.getElementById('result-subtitle');
        const aiResultImg = document.getElementById('ai-result-img');
        const formulaDesc = document.getElementById('formula-description');
        
        if (resultPhoto) resultPhoto.src = URL.createObjectURL(capturedPhotoBlob);
        if (resultTitle) resultTitle.textContent = payload.formula.code;
        if (resultSubtitle && formulaDesc) resultSubtitle.textContent = formulaDesc.textContent;
        if (aiResultImg) aiResultImg.src = URL.createObjectURL(capturedPhotoBlob);
        
        const details = document.getElementById('result-details');
        if (details) {
          details.innerHTML = `
            <div class="detail-item">
              <div class="detail-label">Formula</div>
              <div class="detail-value">${payload.formula.code}</div>
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
        }
        
        // Load client list
        loadClientList();
      }, 2000);
      
    } catch (error) {
      hideLoader();
      console.error('❌ Backend error:', error);
      alert('Errore durante la generazione AI. Riprova.');
    }
  };
  
  reader.readAsDataURL(capturedPhotoBlob);
}

// ========================================
// CLIENT MANAGEMENT
// ========================================

async function loadClientList() {
  console.log('📄 Loading client list...');
  
  const clientList = document.getElementById('client-list');
  if (!clientList) return;
  
  clientList.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-muted);"><i class="fas fa-spinner fa-spin"></i> Caricamento...</div>';
  
  try {
    const payload = {
      action: 'get_clients',
      owner: owner
    };
    
    // TODO: Uncomment when webhook is ready
    // const response = await fetch(WEBHOOK_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });
    // const data = await response.json();
    // allClients = data.clients || [];
    
    // Mock data
    allClients = [
      { customer_id: 'CUST_001', first_name: 'Mario', last_name: 'Rossi', email: 'mario@email.com' },
      { customer_id: 'CUST_002', first_name: 'Laura', last_name: 'Bianchi', email: 'laura@email.com' },
      { customer_id: 'CUST_003', first_name: 'Giuseppe', last_name: 'Verdi', email: null }
    ];
    
    renderClientList(allClients);
    
  } catch (error) {
    console.error('❌ Error loading clients:', error);
    clientList.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--error);"><i class="fas fa-exclamation-triangle"></i> Errore caricamento</div>';
  }
}

function renderClientList(clients) {
  const clientList = document.getElementById('client-list');
  if (!clientList) return;
  
  if (clients.length === 0) {
    clientList.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-muted);">Nessun cliente trovato</div>';
    return;
  }
  
  clientList.innerHTML = clients.map(client => `
    <div 
      class="client-item" 
      onclick="selectClient('${client.customer_id}')"
      style="
        padding: 15px;
        margin-bottom: 10px;
        background: var(--glass-bg);
        border: 2px solid var(--glass-border);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      "
      onmouseover="this.style.borderColor='var(--primary)'; this.style.transform='translateY(-2px)'"
      onmouseout="this.style.borderColor='var(--glass-border)'; this.style.transform='translateY(0)'"
    >
      <div style="display: flex; align-items: center; gap: 12px;">
        <i class="fas fa-user-circle" style="font-size: 32px; color: var(--primary);"></i>
        <div style="flex: 1;">
          <div style="font-weight: 600; font-size: 16px;">${client.first_name} ${client.last_name}</div>
          ${client.email ? `<div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${client.email}</div>` : ''}
        </div>
        <i class="fas fa-chevron-right" style="color: var(--text-muted);"></i>
      </div>
    </div>
  `).join('');
}

function filterClients(searchTerm) {
  if (!searchTerm) {
    renderClientList(allClients);
    return;
  }
  
  const filtered = allClients.filter(client => {
    const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
    const email = (client.email || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    
    return fullName.includes(term) || email.includes(term);
  });
  
  renderClientList(filtered);
}

async function selectClient(customerId) {
  console.log('✅ Client selected:', customerId);
  
  const client = allClients.find(c => c.customer_id === customerId);
  if (!client) return;
  
  showLoader(`Salvando simulazione per ${client.first_name} ${client.last_name}...`);
  
  const reader = new FileReader();
  reader.onloadend = async () => {
    const photoBase64 = reader.result;
    const formulaCodeEl = document.getElementById('formula-code');
    const creativeFormulaEl = document.getElementById('creative-formula-code');
    
    const payload = {
      action: 'save_simulation',
      owner: owner,
      customer_id: customerId,
      photo: photoBase64,
      formula: {
        code: formulaCodeEl ? formulaCodeEl.textContent : (creativeFormulaEl ? creativeFormulaEl.textContent : ''),
        system: selectedBrandSystem,
        level: selectedLevel,
        reflects: { primary: primaryReflect, secondary: secondaryReflect, intensified: primaryIntensified },
        creative_color: selectedCreativeColor
      },
      gender: selectedGender,
      ai_result_image: photoBase64 // TODO: Replace with actual AI generated image
    };
    
    try {
      // TODO: Uncomment when webhook is ready
      // const response = await fetch(WEBHOOK_URL, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });
      // const data = await response.json();
      
      setTimeout(() => {
        hideLoader();
        alert(`✅ Simulazione salvata per ${client.first_name} ${client.last_name}!`);
      }, 1000);
      
    } catch (error) {
      hideLoader();
      console.error('❌ Save error:', error);
      alert('Errore durante il salvataggio. Riprova.');
    }
  };
  
  reader.readAsDataURL(capturedPhotoBlob);
}

function showNewClientForm() {
  const modal = document.getElementById('new-client-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeNewClientModal() {
  const modal = document.getElementById('new-client-modal');
  if (modal) modal.classList.add('hidden');
  
  // Clear form
  const firstname = document.getElementById('new-client-firstname');
  const lastname = document.getElementById('new-client-lastname');
  const email = document.getElementById('new-client-email');
  const phone = document.getElementById('new-client-phone');
  
  if (firstname) firstname.value = '';
  if (lastname) lastname.value = '';
  if (email) email.value = '';
  if (phone) phone.value = '';
}

function generateUniqueId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CUST_${timestamp}_${random}`;
}

async function createNewClient() {
  const firstnameEl = document.getElementById('new-client-firstname');
  const lastnameEl = document.getElementById('new-client-lastname');
  const emailEl = document.getElementById('new-client-email');
  const phoneEl = document.getElementById('new-client-phone');
  
  const firstname = firstnameEl ? firstnameEl.value.trim() : '';
  const lastname = lastnameEl ? lastnameEl.value.trim() : '';
  const email = emailEl ? emailEl.value.trim() : '';
  const phone = phoneEl ? phoneEl.value.trim() : '';
  
  if (!firstname || !lastname) {
    alert('Nome e Cognome sono obbligatori!');
    return;
  }
  
  showLoader('Creando nuovo cliente...');
  
  const customerId = generateUniqueId();
  
  const payload = {
    action: 'create_client',
    owner: owner,
    customer_id: customerId,
    client: {
      first_name: firstname,
      last_name: lastname,
      email: email || null,
      phone: phone || null
    }
  };
  
  try {
    // TODO: Uncomment when webhook is ready
    // const response = await fetch(WEBHOOK_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });
    // const data = await response.json();
    // const customerId = data.customer_id;
    
    setTimeout(async () => {
      hideLoader();
      closeNewClientModal();
      
      // Generate onboarding link
      const baseUrl = window.location.origin;
      const onboardingLink = `${baseUrl}/customer/onboarding.html?owner=${owner}&customer_id=${customerId}`;
      currentInviteLink = onboardingLink;
      
      // Show invite link modal
      const inviteLinkText = document.getElementById('invite-link-text');
      const inviteLinkModal = document.getElementById('invite-link-modal');
      
      if (inviteLinkText) inviteLinkText.textContent = onboardingLink;
      if (inviteLinkModal) inviteLinkModal.classList.remove('hidden');
      
      console.log('✅ Client created:', customerId);
      console.log('🔗 Onboarding link:', onboardingLink);
      
      // Reload client list
      await loadClientList();
      
      // Auto-save simulation for new client
      await selectClient(customerId);
      
    }, 1500);
    
  } catch (error) {
    hideLoader();
    console.error('❌ Create client error:', error);
    alert('Errore durante la creazione del cliente. Riprova.');
  }
}

function copyInviteLink() {
  if (!currentInviteLink) return;
  
  navigator.clipboard.writeText(currentInviteLink)
    .then(() => {
      alert('✅ Link copiato negli appunti!');
    })
    .catch(err => {
      console.error('Copy error:', err);
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = currentInviteLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('✅ Link copiato!');
    });
}

function closeInviteLinkModal() {
  const modal = document.getElementById('invite-link-modal');
  if (modal) modal.classList.add('hidden');
  currentInviteLink = '';
}

// ========================================
// UTILITY
// ========================================

function showLoader(text) {
  const loader = document.getElementById('loader');
  const loaderText = document.getElementById('loader-text');
  if (loaderText) loaderText.textContent = text || 'Caricamento...';
  if (loader) loader.classList.remove('hidden');
}

function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('hidden');
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
  allClients = [];
  currentInviteLink = '';
  
  sessionStorage.removeItem('photo_front');
  sessionStorage.removeItem('photo_profile');
  sessionStorage.removeItem('photo_back');
  
  document.querySelectorAll('[id$="-section"]').forEach(section => {
    section.classList.add('hidden');
  });
  
  const brandSection = document.getElementById('brand-selection');
  if (brandSection) brandSection.classList.remove('hidden');
  
  console.log('🔄 App reset');
}

// ========================================
// INIT
// ========================================

window.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Specchio Magico AI initialized');
  console.log('📋 Owner:', owner);
  console.log('📸 From Photo Session:', fromPhotoSession);
  hideLoader();
});

console.log('✅ Specchio Magico main logic loaded');