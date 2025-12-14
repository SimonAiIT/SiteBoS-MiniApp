// ========================================
// SPECCHIO MAGICO AI - CREATIVE COLORS SYSTEM
// Sistema Pigmentazione Pura per Genere Fluid (Rainbow/Fashion Colors)
// ========================================

// ========================================
// CREATIVE COLORS DATABASE (40+ Colors)
// ========================================

const CREATIVE_COLORS = {
  // ========== PASTELS (10) ==========
  'pastel-pink': { 
    name: 'Rosa Pastello', 
    hex: '#FFB3D9', 
    category: 'pastel',
    brands: {
      'pulp-riot': 'Blush',
      'pravana': 'Pink',
      'manic-panic': 'Cotton Candy Pink',
      'arctic-fox': 'Girls Night'
    }
  },
  'pastel-blue': { 
    name: 'Blu Pastello', 
    hex: '#B4D7FF', 
    category: 'pastel',
    brands: {
      'pulp-riot': 'Powder',
      'pravana': 'Blue',
      'manic-panic': 'Blue Angel'
    }
  },
  'pastel-lavender': { 
    name: 'Lavanda', 
    hex: '#E6CCFF', 
    category: 'pastel',
    brands: {
      'pulp-riot': 'Lilac',
      'arctic-fox': 'Purple Rain'
    }
  },
  'pastel-mint': { 
    name: 'Menta', 
    hex: '#B3FFD9', 
    category: 'pastel',
    brands: {
      'pulp-riot': 'Sea Glass',
      'manic-panic': 'Mermaid'
    }
  },
  'pastel-peach': { 
    name: 'Pesca', 
    hex: '#FFD9B3', 
    category: 'pastel',
    brands: {
      'pulp-riot': 'Blush + Lemon',
      'pravana': 'Peach'
    }
  },
  'pastel-lilac': { 
    name: 'Lilla', 
    hex: '#DDA0DD', 
    category: 'pastel',
    brands: {
      'manic-panic': 'Lie Locks'
    }
  },
  'pastel-aqua': { 
    name: 'Acquamarina', 
    hex: '#7FFFD4', 
    category: 'pastel',
    brands: {
      'arctic-fox': 'Aquamarine'
    }
  },
  'pastel-butter': { 
    name: 'Burro', 
    hex: '#FFFFCC', 
    category: 'pastel',
    brands: {
      'pulp-riot': 'Lemon'
    }
  },
  'pastel-coral': { 
    name: 'Corallo', 
    hex: '#FFB6C1', 
    category: 'pastel',
    brands: {
      'pravana': 'Coral'
    }
  },
  'pastel-sage': { 
    name: 'Salvia', 
    hex: '#C2D4B0', 
    category: 'pastel',
    brands: {
      'pulp-riot': 'Absinthe (diluito)'
    }
  },
  
  // ========== VIVID (12) ==========
  'vivid-pink': { 
    name: 'Rosa Shocking', 
    hex: '#FF1493', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Candy',
      'pravana': 'Magenta',
      'manic-panic': 'Hot Hot Pink'
    }
  },
  'vivid-blue': { 
    name: 'Blu Elettrico', 
    hex: '#00BFFF', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Nirvana',
      'manic-panic': 'Atomic Turquoise'
    }
  },
  'vivid-purple': { 
    name: 'Viola Intenso', 
    hex: '#8B00FF', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Jam',
      'pravana': 'Violet',
      'arctic-fox': 'Purple AF'
    }
  },
  'vivid-green': { 
    name: 'Verde Smeraldo', 
    hex: '#00FF7F', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Absinthe',
      'manic-panic': 'Electric Lizard'
    }
  },
  'vivid-orange': { 
    name: 'Arancio Neon', 
    hex: '#FF6600', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Cupid',
      'pravana': 'Orange'
    }
  },
  'vivid-yellow': { 
    name: 'Giallo Elettrico', 
    hex: '#FFFF00', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Lemon',
      'manic-panic': 'Electric Banana'
    }
  },
  'vivid-red': { 
    name: 'Rosso Fuoco', 
    hex: '#FF0000', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Fire',
      'pravana': 'Red'
    }
  },
  'vivid-turquoise': { 
    name: 'Turchese Neon', 
    hex: '#00CED1', 
    category: 'vivid',
    brands: {
      'arctic-fox': 'Aquamarine',
      'manic-panic': 'Siren\'s Song'
    }
  },
  'vivid-magenta': { 
    name: 'Magenta Neon', 
    hex: '#FF00FF', 
    category: 'vivid',
    brands: {
      'pravana': 'Magenta',
      'pulp-riot': 'Candy'
    }
  },
  'vivid-lime': { 
    name: 'Lime Neon', 
    hex: '#CCFF00', 
    category: 'vivid',
    brands: {
      'manic-panic': 'Electric Lizard'
    }
  },
  'vivid-fuchsia': { 
    name: 'Fucsia Intenso', 
    hex: '#FF00AA', 
    category: 'vivid',
    brands: {
      'arctic-fox': 'Frose'
    }
  },
  'vivid-cyan': { 
    name: 'Ciano Brillante', 
    hex: '#00FFFF', 
    category: 'vivid',
    brands: {
      'manic-panic': 'Atomic Turquoise'
    }
  },
  
  // ========== METALLIC (8) ==========
  'rose-gold': { 
    name: 'Rose Gold', 
    hex: '#B76E79', 
    category: 'metallic',
    brands: {
      'pulp-riot': 'Barcelona + Copper',
      'pravana': 'Rose Gold'
    }
  },
  'silver': { 
    name: 'Silver', 
    hex: '#C0C0C0', 
    category: 'metallic',
    brands: {
      'pravana': 'Silver',
      'pulp-riot': 'Icy'
    }
  },
  'platinum': { 
    name: 'Platinum Blonde', 
    hex: '#E5E4E2', 
    category: 'metallic',
    brands: {
      'pravana': 'Vivids Clear + Silver'
    }
  },
  'champagne': { 
    name: 'Champagne', 
    hex: '#F7E7CE', 
    category: 'metallic',
    brands: {
      'pulp-riot': 'Barcelona'
    }
  },
  'bronze': { 
    name: 'Bronzo', 
    hex: '#CD7F32', 
    category: 'metallic',
    brands: {
      'pulp-riot': 'Copper + Gold'
    }
  },
  'copper-metallic': { 
    name: 'Copper Metallic', 
    hex: '#B87333', 
    category: 'metallic',
    brands: {
      'pulp-riot': 'Copper',
      'pravana': 'Copper'
    }
  },
  'pearl': { 
    name: 'Perlato Bianco', 
    hex: '#F0EAD6', 
    category: 'metallic',
    brands: {
      'pravana': 'Silver + Clear'
    }
  },
  'titanium': { 
    name: 'Titanio', 
    hex: '#878681', 
    category: 'metallic',
    brands: {
      'pulp-riot': 'Smoke'
    }
  },
  
  // ========== DARK FANTASY (10) ==========
  'burgundy': { 
    name: 'Burgundy', 
    hex: '#800020', 
    category: 'dark',
    brands: {
      'pulp-riot': 'Velvet',
      'manic-panic': 'Vampire Red'
    }
  },
  'plum': { 
    name: 'Prugna', 
    hex: '#8E4585', 
    category: 'dark',
    brands: {
      'arctic-fox': 'Purple Rain + Red',
      'pravana': 'Violet + Red'
    }
  },
  'midnight-blue': { 
    name: 'Blu Notte', 
    hex: '#191970', 
    category: 'dark',
    brands: {
      'manic-panic': 'After Midnight',
      'arctic-fox': 'Poseidon'
    }
  },
  'forest-green': { 
    name: 'Verde Foresta', 
    hex: '#228B22', 
    category: 'dark',
    brands: {
      'manic-panic': 'Green Envy',
      'pulp-riot': 'Absinthe (scuro)'
    }
  },
  'eggplant': { 
    name: 'Melanzana', 
    hex: '#614051', 
    category: 'dark',
    brands: {
      'pravana': 'Violet + Red + Black'
    }
  },
  'black-cherry': { 
    name: 'Ciliegia Nera', 
    hex: '#3D0C02', 
    category: 'dark',
    brands: {
      'manic-panic': 'Vampire Red + Raven'
    }
  },
  'navy': { 
    name: 'Navy', 
    hex: '#000080', 
    category: 'dark',
    brands: {
      'manic-panic': 'Blue Moon'
    }
  },
  'emerald': { 
    name: 'Smeraldo Scuro', 
    hex: '#046307', 
    category: 'dark',
    brands: {
      'manic-panic': 'Enchanted Forest'
    }
  },
  'wine': { 
    name: 'Vino', 
    hex: '#722F37', 
    category: 'dark',
    brands: {
      'pulp-riot': 'Velvet + Nightfall'
    }
  },
  'chocolate': { 
    name: 'Cioccolato Fondente', 
    hex: '#3B2F2F', 
    category: 'dark',
    brands: {
      'pravana': 'Brown'
    }
  }
};

// ========================================
// PLACEMENT TECHNIQUES (Creative Application)
// ========================================

const CREATIVE_PLACEMENT_TECHNIQUES = [
  { id: 'full', label: 'Full Head (Tutta la Testa)', massMultiplier: 1.0 },
  { id: 'balayage', label: 'Balayage Rainbow', massMultiplier: 0.5 },
  { id: 'ombre', label: 'Ombré Multi-Color', massMultiplier: 0.6 },
  { id: 'highlights', label: 'Highlights Arcobaleno', massMultiplier: 0.4 },
  { id: 'underlights', label: 'Underlights (Sotto Strati)', massMultiplier: 0.3 },
  { id: 'money-piece', label: 'Money Piece', massMultiplier: 0.2 },
  { id: 'split-dye', label: 'Split Dye (Metà/Metà)', massMultiplier: 0.5 },
  { id: 'tips-only', label: 'Solo Punte', massMultiplier: 0.3 },
  { id: 'roots-only', label: 'Solo Radici', massMultiplier: 0.4 },
  { id: 'panels', label: 'Pannelli Colorati', massMultiplier: 0.35 },
  { id: 'peek-a-boo', label: 'Peek-a-Boo (Hidden)', massMultiplier: 0.25 }
];

// ========================================
// GLOBAL STATE (Creative Mode)
// ========================================

let selectedCreativeColors = []; // Array di { key, percentage }
let currentCreativeCategory = 'all';

// ========================================
// FLUID UI INITIALIZATION
// ========================================

function populateFluidUI() {
  console.log('🌈 Inizializzazione UI Creative Colors');
  
  // Render creative colors palette
  renderCreativeColorsPalette();
  
  // Populate placement techniques
  const placementSelect = document.getElementById('creative-placement-technique');
  if (placementSelect) {
    placementSelect.innerHTML = '';
    CREATIVE_PLACEMENT_TECHNIQUES.forEach(tech => {
      const option = document.createElement('option');
      option.value = tech.id;
      option.textContent = tech.label;
      placementSelect.appendChild(option);
    });
  }
  
  // Fluid ha TUTTO (makeup + barba)
  const fluidMakeupSection = document.getElementById('fluid-makeup-section');
  const fluidBeardSection = document.getElementById('fluid-beard-section');
  
  if (fluidMakeupSection) {
    fluidMakeupSection.classList.remove('hidden');
    // Clone makeup content da config-section
    const originalMakeup = document.getElementById('makeup-section');
    if (originalMakeup) {
      fluidMakeupSection.innerHTML = originalMakeup.innerHTML;
    }
    renderLipColors('fluid-lip-colors');
  }
  
  if (fluidBeardSection) {
    fluidBeardSection.classList.remove('hidden');
    // Clone beard content da config-section
    const originalBeard = document.getElementById('beard-section');
    if (originalBeard) {
      fluidBeardSection.innerHTML = originalBeard.innerHTML;
    }
    renderBeardColors('fluid-beard-colors');
  }
  
  // Setup category tabs
  setupCreativeCategoryTabs();
}

// ========================================
// CREATIVE COLORS PALETTE RENDERER
// ========================================

function renderCreativeColorsPalette(category = 'all') {
  const container = document.getElementById('creative-colors-palette');
  if (!container) return;
  
  currentCreativeCategory = category;
  container.innerHTML = '';
  
  const filteredColors = Object.entries(CREATIVE_COLORS)
    .filter(([key, data]) => category === 'all' || data.category === category);
  
  if (filteredColors.length === 0) {
    container.innerHTML = '<p style=\"color: var(--text-muted); text-align: center; padding: 20px;\">Nessun colore in questa categoria</p>';
    return;
  }
  
  filteredColors.forEach(([key, data]) => {
    const btn = document.createElement('div');
    btn.className = 'creative-color-btn';
    btn.dataset.colorKey = key;
    
    // Check if already selected
    if (selectedCreativeColors.find(c => c.key === key)) {
      btn.classList.add('active');
    }
    
    btn.innerHTML = `
      <div class="color-swatch" style="background: ${data.hex}; box-shadow: 0 2px 8px ${data.hex}66;"></div>
      <div class="color-name">${data.name}</div>
      <div class="color-category-badge">${data.category}</div>
    `;
    
    btn.addEventListener('click', () => toggleCreativeColor(key));
    
    container.appendChild(btn);
  });
}

// ========================================
// CATEGORY TABS SETUP
// ========================================

function setupCreativeCategoryTabs() {
  const tabs = document.querySelectorAll('.category-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const category = tab.dataset.category;
      renderCreativeColorsPalette(category);
    });
  });
}

// ========================================
// COLOR SELECTION LOGIC (Multi-Select)
// ========================================

function toggleCreativeColor(key) {
  const btn = document.querySelector(`[data-color-key=\"${key}\"]`);
  if (!btn) return;
  
  const existingIndex = selectedCreativeColors.findIndex(c => c.key === key);
  
  if (existingIndex >= 0) {
    // Remove color
    selectedCreativeColors.splice(existingIndex, 1);
    btn.classList.remove('active');
    console.log('❌ Rimosso:', CREATIVE_COLORS[key].name);
  } else {
    // Add color
    const percentage = selectedCreativeColors.length === 0 ? 100 : 50;
    selectedCreativeColors.push({ key, percentage });
    btn.classList.add('active');
    console.log('✅ Aggiunto:', CREATIVE_COLORS[key].name);
  }
  
  updateSelectedColorsDisplay();
  
  if (selectedCreativeColors.length > 1) {
    recalculateCreativePercentages();
  }
}

// ========================================
// SELECTED COLORS DISPLAY (with Sliders)
// ========================================

function updateSelectedColorsDisplay() {
  const display = document.getElementById('selected-colors-display');
  const list = document.getElementById('selected-colors-list');
  
  if (!display || !list) return;
  
  if (selectedCreativeColors.length === 0) {
    display.classList.add('hidden');
    return;
  }
  
  display.classList.remove('hidden');
  list.innerHTML = '';
  
  selectedCreativeColors.forEach((item, index) => {
    const colorData = CREATIVE_COLORS[item.key];
    
    const div = document.createElement('div');
    div.className = 'selected-color-item';
    div.innerHTML = `
      <div class="color-swatch-mini" style="background: ${colorData.hex};"></div>
      <span class="color-name-mini">${colorData.name}</span>
      <input type="range" class="percentage-slider" min="10" max="100" value="${item.percentage}" 
             data-index="${index}">
      <span class="percentage-value">${item.percentage}%</span>
      <button class="btn-remove" data-index="${index}" title="Rimuovi">×</button>
    `;
    
    // Event listeners
    const slider = div.querySelector('.percentage-slider');
    slider.addEventListener('input', (e) => {
      updateCreativePercentage(index, e.target.value);
    });
    
    const removeBtn = div.querySelector('.btn-remove');
    removeBtn.addEventListener('click', () => {
      removeCreativeColor(index);
    });
    
    list.appendChild(div);
  });
}

// ========================================
// PERCENTAGE MANAGEMENT
// ========================================

function updateCreativePercentage(index, value) {
  selectedCreativeColors[index].percentage = parseInt(value);
  
  // Update display only (no auto-balance during drag)
  const percentageDisplay = document.querySelectorAll('.percentage-value')[index];
  if (percentageDisplay) {
    percentageDisplay.textContent = value + '%';
  }
}

function removeCreativeColor(index) {
  const key = selectedCreativeColors[index].key;
  selectedCreativeColors.splice(index, 1);
  
  // Update button state
  const btn = document.querySelector(`[data-color-key=\"${key}\"]`);
  if (btn) btn.classList.remove('active');
  
  updateSelectedColorsDisplay();
  
  if (selectedCreativeColors.length > 0) {
    recalculateCreativePercentages();
  }
}

function recalculateCreativePercentages() {
  if (selectedCreativeColors.length === 0) return;
  
  const total = selectedCreativeColors.reduce((sum, c) => sum + c.percentage, 0);
  
  // Normalize to 100%
  if (total !== 100) {
    const factor = 100 / total;
    selectedCreativeColors.forEach(c => {
      c.percentage = Math.round(c.percentage * factor);
    });
    
    // Fix rounding errors
    const newTotal = selectedCreativeColors.reduce((sum, c) => sum + c.percentage, 0);
    if (newTotal !== 100) {
      selectedCreativeColors[0].percentage += (100 - newTotal);
    }
    
    updateSelectedColorsDisplay();
  }
}

// ========================================
// GENERATE FLUID PREVIEW
// ========================================

function generateFluidPreview() {
  if (selectedCreativeColors.length === 0) {
    alert('⚠️ Seleziona almeno un colore creative!');
    return;
  }
  
  showLoader('Generazione anteprima creative...');
  
  // Build creative look data
  const colorsList = selectedCreativeColors.map(c => {
    const data = CREATIVE_COLORS[c.key];
    return `${data.name} (${c.percentage}%)`;
  }).join(', ');
  
  const technique = document.getElementById('creative-placement-technique')?.value || 'full';
  const baseHair = document.getElementById('base-hair-color-fluid')?.value || 'bleached';
  
  console.log('🌈 CREATIVE LOOK:', {
    colors: colorsList,
    technique: technique,
    baseHair: baseHair,
    selectedColors: selectedCreativeColors
  });
  
  // Simulate AI generation
  setTimeout(() => {
    hideLoader();
    showFluidResults();
  }, 2000);
}

// ========================================
// SHOW FLUID RESULTS
// ========================================

function showFluidResults() {
  document.getElementById('fluid-config-section').classList.add('hidden');
  document.getElementById('results-section').classList.remove('hidden');
  document.getElementById('before-img').src = clientPhotoData;
  
  displayFluidResults();
}

function displayFluidResults() {
  const summary = document.getElementById('summary-content');
  if (!summary) return;
  
  // Build summary
  let html = '<div class=\"summary-item\"><strong>Modalità:</strong> Creative Colors (Fluid)</div>';
  
  const technique = document.getElementById('creative-placement-technique')?.value;
  if (technique) {
    const techData = CREATIVE_PLACEMENT_TECHNIQUES.find(t => t.id === technique);
    if (techData) {
      html += `<div class=\"summary-item\"><strong>Tecnica:</strong> ${techData.label}</div>`;
    }
  }
  
  const baseHair = document.getElementById('base-hair-color-fluid')?.value;
  if (baseHair) {
    const baseLabels = {
      'virgin-light': 'Naturali Chiari',
      'virgin-medium': 'Naturali Medi',
      'virgin-dark': 'Naturali Scuri',
      'bleached': 'Pre-decolorati',
      'colored': 'Già Colorati'
    };
    html += `<div class=\"summary-item\"><strong>Base:</strong> ${baseLabels[baseHair] || baseHair}</div>`;
  }
  
  html += '<div class=\"summary-item\"><strong>Colori:</strong> ';
  selectedCreativeColors.forEach((c, i) => {
    const colorData = CREATIVE_COLORS[c.key];
    html += `<span style=\"color: ${colorData.hex};\">${colorData.name} (${c.percentage}%)</span>`;
    if (i < selectedCreativeColors.length - 1) html += ', ';
  });
  html += '</div>';
  
  summary.innerHTML = html;
  
  // Inject diagnosis card and mixing calculator
  injectFluidDiagnosisCard();
  injectCreativeMixingCard();
}

// ========================================
// FLUID DIAGNOSIS CARD
// ========================================

function injectFluidDiagnosisCard() {
  const resultsSection = document.getElementById('results-section');
  const oldCard = document.getElementById('diagnosis-card');
  if (oldCard) oldCard.remove();
  
  const card = document.createElement('div');
  card.id = 'diagnosis-card';
  card.className = 'diagnosis-card';
  
  const technique = document.getElementById('creative-placement-technique')?.value;
  const techData = CREATIVE_PLACEMENT_TECHNIQUES.find(t => t.id === technique);
  
  let html = `
    <div class=\"diagnosis-header\">
      <span>⚧ GENERE: Fluid</span>
      <span>•</span>
      <span>🌈 MODALITÀ: Creative Colors</span>
    </div>
    
    <div class=\"diagnosis-section highlight\">
      <h4>🎨 CREATIVE LOOK</h4>
      <p><strong>Tecnica:</strong> ${techData ? techData.label : 'Full Head'}</p>
      <div class=\"rainbow-list\">
  `;
  
  selectedCreativeColors.forEach(c => {
    const colorData = CREATIVE_COLORS[c.key];
    html += `
      <div class=\"color-item\">
        <span class=\"color-dot\" style=\"background: ${colorData.hex};\"></span>
        ${colorData.name} (${c.percentage}%)
      </div>
    `;
  });
  
  html += `
      </div>
    </div>
  `;
  
  card.innerHTML = html;
  
  const firstCard = resultsSection.querySelector('.card');
  if (firstCard) {
    resultsSection.insertBefore(card, firstCard);
  } else {
    resultsSection.appendChild(card);
  }
}

// ========================================
// CREATIVE MIXING CALCULATOR
// ========================================

function injectCreativeMixingCard() {
  const resultsSection = document.getElementById('results-section');
  const btnContainer = resultsSection.querySelector('.btn-container');
  
  const oldCard = document.getElementById('mixing-calculator-card');
  if (oldCard) oldCard.remove();
  
  const card = document.createElement('div');
  card.id = 'mixing-calculator-card';
  card.className = 'card';
  card.style.marginTop = '15px';
  
  // Estimate total grams based on technique
  const technique = document.getElementById('creative-placement-technique')?.value || 'full';
  const techData = CREATIVE_PLACEMENT_TECHNIQUES.find(t => t.id === technique);
  const baseGrams = 60; // Base for long hair
  const totalGrams = Math.round(baseGrams * (techData ? techData.massMultiplier : 1.0));
  
  let html = `
    <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;\">
      <div>
        <h3 style=\"margin: 0;\">🧪 MIXING CREATIVE</h3>
        <div style=\"margin-top: 5px; font-size: 11px; padding: 4px 10px; background: var(--warning); border-radius: 20px; display: inline-block; font-weight: 600;\">🌈 PIGMENTAZIONE DIRETTA</div>
      </div>
      <span style=\"font-size: 12px; color: var(--text-muted); text-transform: uppercase;\">${techData ? techData.label : 'Full Head'}</span>
    </div>
    
    <div style=\"padding: 12px; background: rgba(255,152,0,0.2); border-left: 3px solid var(--warning); border-radius: 8px; margin-bottom: 15px; font-size: 12px; line-height: 1.5;\">
      ⚡ Creative colors applicati su capelli pre-decolorati (livello 9-10). Tempo di posa: 30-45 min.
    </div>
    
    <div style=\"background: rgba(0,0,0,0.3); border-radius: 10px; padding: 15px; font-family: 'Courier New', monospace;\">
  `;
  
  selectedCreativeColors.forEach((item, i) => {
    const colorData = CREATIVE_COLORS[item.key];
    const grams = Math.round(totalGrams * (item.percentage / 100));
    
    html += `
      <div style=\"display: flex; justify-content: space-between; align-items: center; padding: 8px 0; ${i < selectedCreativeColors.length - 1 ? 'border-bottom: 1px dashed var(--glass-border);' : ''}\">
        <div style=\"display: flex; align-items: center; gap: 10px;\">
          <div style=\"width: 24px; height: 24px; border-radius: 50%; background: ${colorData.hex}; box-shadow: 0 2px 8px ${colorData.hex}66;\"></div>
          <div>
            <div style=\"font-size: 13px; font-weight: 600; color: var(--text-primary);\">${colorData.name}</div>
            <div style=\"font-size: 11px; color: var(--text-muted); margin-top: 2px;\">${item.percentage}% della miscela totale</div>
          </div>
        </div>
        <div style=\"font-size: 18px; font-weight: bold; color: ${colorData.hex};\">${grams}g</div>
      </div>
    `;
  });
  
  html += `
      <div style=\"height: 2px; background: var(--warning); margin: 15px 0;\"></div>
      <div style=\"display: flex; justify-content: space-between; align-items: center; padding: 8px 0;\">
        <div style=\"font-size: 15px; font-weight: bold; color: var(--text-primary);\">TOTALE MISCELA</div>
        <div style=\"font-size: 24px; font-weight: bold; color: var(--warning);\">${totalGrams}g</div>
      </div>
    </div>
  `;
  
  card.innerHTML = html;
  
  if (btnContainer) {
    resultsSection.insertBefore(card, btnContainer);
  } else {
    resultsSection.appendChild(card);
  }
}

// ========================================
// HELPER: Render Lip/Beard Colors for Fluid
// ========================================

function renderLipColors(containerId = 'lip-colors') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  
  if (typeof LIP_COLORS === 'undefined') {
    console.warn('LIP_COLORS not defined');
    return;
  }
  
  LIP_COLORS.forEach(lip => {
    const btn = document.createElement('div');
    btn.className = 'makeup-swatch';
    btn.dataset.lip = lip.code;
    btn.style.background = lip.color;
    btn.title = lip.name;
    if (lip.code === 'none') btn.style.border = '2px dashed var(--glass-border)';
    
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-lip]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    
    container.appendChild(btn);
  });
  
  container.querySelector('[data-lip=\"none\"]')?.classList.add('active');
}

function renderBeardColors(containerId = 'beard-colors') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  
  if (typeof BEARD_COLORS === 'undefined') {
    console.warn('BEARD_COLORS not defined');
    return;
  }
  
  BEARD_COLORS.forEach(beard => {
    const btn = document.createElement('div');
    btn.className = 'makeup-swatch';
    btn.dataset.beard = beard.code;
    btn.style.background = beard.color;
    btn.title = beard.name;
    
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-beard]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    
    container.appendChild(btn);
  });
  
  container.querySelector('[data-beard=\"natural\"]')?.classList.add('active');
}

console.log('✅ Creative Colors System loaded - 40+ colors ready');