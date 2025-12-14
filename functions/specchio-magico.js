// ========================================
// SPECCHIO MAGICO AI - MAIN ENGINE
// Sistema Colorimetria Professionale Multi-Brand + MIXING CALCULATOR + GLOSS LOGIC + DIAGNOSIS CARD
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

// [... rest of the code remains the same until the end ...]

// ========================================
// DIAGNOSIS CARD GENERATOR (PROFESSIONAL LOOK SUMMARY)
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
    isRainbow: false,
    rainbowColors: [],
    eyeMakeup: null,
    lipColor: null
  };
  
  // Styling
  const stylingEl = document.getElementById('styling-finish');
  if (stylingEl && stylingEl.value && typeof STYLING_OPTIONS !== 'undefined') {
    const stylingData = STYLING_OPTIONS.find(s => s.id === stylingEl.value);
    if (stylingData) data.styling = stylingData.label;
  }
  
  // Texture
  const textureEl = document.getElementById('hair-texture');
  if (textureEl && textureEl.value && typeof HAIR_TEXTURES !== 'undefined') {
    const textureData = HAIR_TEXTURES[selectedGender]?.find(t => t.id === textureEl.value);
    if (textureData) data.texture = textureData.label;
  }
  
  // Extension
  const extensionEl = document.getElementById('extensions-type');
  if (extensionEl && extensionEl.value !== 'none' && typeof EXTENSIONS !== 'undefined') {
    const extData = EXTENSIONS.find(e => e.id === extensionEl.value);
    if (extData) data.extension = extData.label;
  }
  
  // Color Technique
  const techniqueEl = document.getElementById('color-technique');
  if (techniqueEl && techniqueEl.value && typeof COLOR_TECHNIQUES !== 'undefined') {
    const techData = COLOR_TECHNIQUES.find(t => t.id === techniqueEl.value);
    if (techData) data.colorTechnique = techData.label;
  }
  
  // Eye Makeup (F/X only)
  const eyeMakeupEl = document.getElementById('eye-makeup');
  if (eyeMakeupEl && eyeMakeupEl.value !== 'Nessuno') {
    data.eyeMakeup = eyeMakeupEl.value;
  }
  
  // Lip Color (F/X only)
  const activeLip = document.querySelector('[data-lip].active');
  if (activeLip && activeLip.dataset.lip !== 'none') {
    const lipData = LIP_COLORS.find(l => l.code === activeLip.dataset.lip);
    if (lipData) data.lipColor = lipData.name;
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
    <!-- HEADER: ANAGRAFICA -->
    <div class="diagnosis-header">
      <span>👤 GENERE: ${data.gender}</span>
      <span>•</span>
      <span>🏷️ SISTEMA: ${data.system}</span>
    </div>
  `;
  
  // SECTION 1: STRUTTURA
  html += `
    <div class="diagnosis-section">
      <h4>💇 STRUTTURA</h4>
      <ul>
        <li><strong>Taglio:</strong> ${data.haircut}</li>
  `;
  
  if (data.styling) {
    html += `<li><strong>Styling:</strong> ${data.styling}</li>`;
  }
  
  if (data.texture) {
    html += `<li><strong>Texture:</strong> ${data.texture}</li>`;
  }
  
  if (data.extension) {
    html += `<li><strong>Extension:</strong> ${data.extension}</li>`;
  }
  
  html += `
      </ul>
    </div>
  `;
  
  // SECTION 2: LABORATORIO COLORE (HIGHLIGHT)
  html += `
    <div class="diagnosis-section highlight">
      <h4>🎨 LABORATORIO COLORE</h4>
  `;
  
  if (data.colorTechnique) {
    html += `<p><strong>Tecnica:</strong> ${data.colorTechnique}</p>`;
  }
  
  // Check if rainbow/creative (future feature)
  if (data.isRainbow && data.rainbowColors.length > 0) {
    html += `<div class="rainbow-list">`;
    data.rainbowColors.forEach(color => {
      html += `
        <div class="color-item">
          <span class="color-dot" style="background: ${color.hex};"></span>
          ${color.name}
        </div>
      `;
    });
    html += `</div>`;
  } else {
    // Standard formula
    html += `<p><strong>Formula:</strong> ${data.formula}</p>`;
    
    if (currentRecipe && currentRecipe.developer) {
      html += `<p><strong>Ossidante:</strong> ${currentRecipe.developer.volume} Vol</p>`;
    }
  }
  
  html += `
    </div>
  `;
  
  // SECTION 3: TOTAL LOOK (if makeup present)
  if (data.eyeMakeup || data.lipColor) {
    html += `
      <div class="diagnosis-section">
        <h4>💄 TOTAL LOOK</h4>
        <ul>
    `;
    
    if (data.eyeMakeup) {
      html += `<li><strong>Make-up Occhi:</strong> ${data.eyeMakeup}</li>`;
    }
    
    if (data.lipColor) {
      html += `<li><strong>Labbra:</strong> ${data.lipColor}</li>`;
    }
    
    html += `
        </ul>
      </div>
    `;
  }
  
  card.innerHTML = html;
  
  // Insert before mixing calculator (if exists) or at top
  if (mixingCard) {
    resultsSection.insertBefore(card, mixingCard);
  } else {
    const firstCard = resultsSection.querySelector('.card');
    if (firstCard) {
      resultsSection.insertBefore(card, firstCard);
    } else {
      resultsSection.appendChild(card);
    }
  }
}

// ========================================
// DISPLAY RESULTS + DIAGNOSIS + MIXING CALCULATOR CARD
// AGGIORNATO: Include Diagnosis Card
// ========================================

function displayResults() {
  const summary = document.getElementById('summary-content');
  if (!summary) return;
  
  const haircut = document.getElementById('haircut')?.value || 'Bob';
  const colorTechnique = document.getElementById('color-technique')?.value || 'global';
  
  currentRecipe = calculateMixingRecipe(
    currentBaseTone,
    primaryReflect,
    secondaryReflect,
    primaryIntensified,
    haircut,
    20,
    colorTechnique
  );
  
  let html = `<div class="summary-item"><strong>Sistema:</strong> ${currentSystem}</div>`;
  html += `<div class="summary-item"><strong>Formula:</strong> ${document.getElementById('formula-code').textContent}</div>`;
  html += `<div class="summary-item"><strong>Taglio:</strong> ${haircut}</div>`;
  
  const styling = document.getElementById('styling-finish')?.value;
  if (styling && typeof STYLING_OPTIONS !== 'undefined') {
    const stylingData = STYLING_OPTIONS.find(s => s.id === styling);
    if (stylingData) {
      html += `<div class="summary-item"><strong>Styling:</strong> ${stylingData.label}</div>`;
    }
  }
  
  const extension = document.getElementById('extensions-type')?.value;
  if (extension && extension !== 'none' && typeof EXTENSIONS !== 'undefined') {
    const extData = EXTENSIONS.find(e => e.id === extension);
    if (extData) {
      html += `<div class="summary-item"><strong>Extension:</strong> ${extData.label}</div>`;
    }
  }
  
  const texture = document.getElementById('hair-texture')?.value;
  if (texture) {
    html += `<div class="summary-item"><strong>Texture:</strong> ${texture}</div>`;
  }
  
  const technique = document.getElementById('color-technique')?.value;
  if (technique && typeof COLOR_TECHNIQUES !== 'undefined') {
    const techData = COLOR_TECHNIQUES.find(t => t.id === technique);
    if (techData) {
      html += `<div class="summary-item"><strong>Tecnica:</strong> ${techData.label}</div>`;
    }
  }
  
  summary.innerHTML = html;
  
  // NUOVO: Inject Diagnosis Card FIRST
  injectDiagnosisCard();
  
  // Then inject Mixing Calculator
  injectMixingCard();
}

// [... rest of the code remains the same ...]

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
                          currentRecipe.recipeType.includes('BLEACH') ? 'var(--error)' : 'var(--warning)';
  const recipeTypeIcon = currentRecipe.recipeType.includes('PERMANENTE') ? '🎨' : 
                         currentRecipe.recipeType.includes('GLOSS LUCIDANTE') ? '✨' :
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
    html += `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; ${i < currentRecipe.tubes.length - 1 ? 'border-bottom: 1px dashed var(--glass-border);' : ''}">
        <div>
          <div style="font-size: 13px; font-weight: 600; color: var(--text-primary);">${tube.name}</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${tube.percentage}% del colore totale</div>
        </div>
        <div style="font-size: 18px; font-weight: bold; color: var(--primary);">${tube.grams}g</div>
      </div>
    `;
  });
  
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
  document.getElementById('config-section').classList.remove('hidden');
}

// ========================================
// TRANSLATION
// ========================================

function translateFormula() {
  document.getElementById('translation-modal').classList.remove('hidden');
  
  const formula = document.getElementById('formula-code').textContent;
  document.getElementById('your-formula').textContent = formula;
  document.getElementById('your-system').textContent = currentSystem;
  
  let universalDesc = `Tono Base: ${currentBaseTone}\n`;
  if (primaryReflect) {
    universalDesc += `Riflesso: ${REFLECTS[primaryReflect].name}`;
    if (primaryIntensified) universalDesc += ' (Intenso)';
    if (secondaryReflect) universalDesc += ` + ${REFLECTS[secondaryReflect].name}`;
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
    formula: document.getElementById('formula-code').textContent,
    haircut: document.getElementById('haircut').value,
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
  const sections = ['results-section', 'config-section', 'camera-section', 'gender-section', 'brand-selection'];
  
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

function openBrandSettings() {
  document.getElementById('brand-list-modal').classList.remove('hidden');
}

function closeBrandListModal() {
  document.getElementById('brand-list-modal').classList.add('hidden');
}

function changeSystemFromSettings(newSystem) {
  currentSystem = newSystem;
  renderReflectPalette();
  updateFormulaDisplay();
  closeBrandListModal();
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