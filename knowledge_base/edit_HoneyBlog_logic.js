// ============================================
// LANDING PAGE HONEYPOT EDITOR - LOGIC
// ============================================

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const urlParams = new URLSearchParams(window.location.search);
const VAT = urlParams.get('vat');
const OWNER = urlParams.get('owner');
const TOKEN = urlParams.get('token');

const BACKEND_URL = 'https://trinai.api.workflow.dcmake.it/webhook/50891655-84c8-4213-90e8-26ebbc3d6c4c';

let ownerData = null;
let honeypotData = null;
let catalogData = null;

// 🎯 3 NUOVI SLOT
const newImageSlots = [
  { id: 0, name: 'gallery1', label: 'Gallery 1', image: null, method: null },
  { id: 1, name: 'gallery2', label: 'Gallery 2', image: null, method: null },
  { id: 2, name: 'gallery3', label: 'Gallery 3', image: null, method: null }
];

let currentSlotIndex = null;

// ============================================
// INIT
// ============================================
async function init() {
  showLoader('Recupero dati HoneyPot...');

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_honeyblog_data',
        vat_number: VAT,
        chat_id: OWNER,
        token: TOKEN
      })
    });

    const data = await response.json();
    console.log('✅ Webhook Response OK');

    honeypotData = data.HoneyPot;
    catalogData = data.service_catalog_setup;
    ownerData = data.owner_data;

    if (!honeypotData || !ownerData) {
      throw new Error('Dati mancanti');
    }

    loadExistingAssets();

    hideLoader();
    document.getElementById('app-content').classList.remove('hidden');

  } catch (error) {
    console.error('❌ Errore init:', error);
    hideLoader();
    alert('Errore caricamento dati');
  }
}

// ============================================
// CARICA ASSETS ESISTENTI
// ============================================
function loadExistingAssets() {
  const logoUrl = honeypotData.assets?.logo?.url;
  if (logoUrl) {
    document.getElementById('img-logo').src = logoUrl;
  }

  const photoUrl = honeypotData.assets?.photo?.url;
  if (photoUrl) {
    document.getElementById('img-photo').src = photoUrl;
  }

  // ✅ CARICA ANCHE LE GALLERY ESISTENTI
  newImageSlots.forEach((slot, index) => {
    const existingGallery = honeypotData.assets?.[slot.name];
    if (existingGallery && existingGallery.url) {
      slot.image = existingGallery.url;
      slot.method = existingGallery.method || 'unknown';
      renderSlot(index);
    }
  });
  
  updateProgress();
}

// ============================================
// MENU OPZIONI SLOT
// ============================================
window.openSlotMenu = function(slotIndex) {
  currentSlotIndex = slotIndex;
  document.getElementById('slot-menu-overlay').classList.remove('hidden');
};

window.closeSlotMenu = function() {
  document.getElementById('slot-menu-overlay').classList.add('hidden');
};

window.selectSlotAction = async function(action) {
  closeSlotMenu();
  
  if (action === 'upload') {
    document.getElementById('file-input').click();
  } else if (action === 'generate') {
    await generateImageWithAI(currentSlotIndex);
  } else if (action === 'enhance') {
    document.getElementById('file-input').dataset.enhance = 'true';
    document.getElementById('file-input').click();
  }
};

// ============================================
// UPLOAD E COMPRESSIONE
// ============================================
document.getElementById('file-input').addEventListener('change', async function(e) {
  if (!e.target.files || !e.target.files[0]) return;
  
  const file = e.target.files[0];
  if (!file.type.startsWith('image/')) {
    alert('⚠️ Seleziona un file immagine valido');
    return;
  }

  const shouldEnhance = e.target.dataset.enhance === 'true';
  e.target.dataset.enhance = ''; // Reset

  showLoader(shouldEnhance ? '✨ Upload e miglioramento...' : '📋 Compressione immagine...');

  try {
    // 🗜️ Comprimi immagine (max 800px, quality 0.8)
    const compressedBase64 = await compressImage(file, 800, 0.8);

    if (shouldEnhance) {
      // ✨ ENHANCE: Carica + Migliora con AI
      await enhanceImageWithAI(currentSlotIndex, compressedBase64);
    } else {
      // 📷 SAVE: Salva direttamente
      await saveImage(currentSlotIndex, compressedBase64);
    }
  } catch (error) {
    hideLoader();
    console.error('❌ Errore processing:', error);
    alert('Errore durante il caricamento');
  }
  
  e.target.value = '';
});

// ============================================
// COMPRESSIONE IMMAGINE
// ============================================
function compressImage(file, maxWidth, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Ridimensiona mantenendo aspect ratio
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Converti in base64 con qualità ridotta
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ============================================
// ACTION: save_photo (Upload diretto)
// ============================================
async function saveImage(slotIndex, base64Data) {
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_photo',
        vat_number: VAT,
        chat_id: OWNER,
        token: TOKEN,
        position: newImageSlots[slotIndex].name,
        image_data: base64Data
      })
    });

    const result = await response.json();
    console.log('✅ Save photo OK', result);

    if (result.success && result.asset && result.asset.url) {
      // Ricarica pagina per mostrare nuova immagine
      window.location.reload();
    } else {
      hideLoader();
      throw new Error(result.message || result.error || 'Errore salvataggio');
    }
  } catch (error) {
    hideLoader();
    console.error('❌ Errore save:', error);
    alert('Errore durante il salvataggio');
  }
}

// ============================================
// ACTION: generate_photo (Generazione AI)
// ============================================
async function generateImageWithAI(slotIndex) {
  showLoader('🎨 Generazione immagine AI...');

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate_photo',
        vat_number: VAT,
        chat_id: OWNER,
        token: TOKEN,
        position: newImageSlots[slotIndex].name,
        context: honeypotData.company_context_string || ''
      })
    });

    const result = await response.json();
    console.log('✅ Generate photo OK', result);

    if (result.success && result.asset && result.asset.url) {
      // Ricarica pagina per mostrare nuova immagine
      window.location.reload();
    } else {
      hideLoader();
      throw new Error(result.message || result.error || 'Errore generazione');
    }
  } catch (error) {
    hideLoader();
    console.error('❌ Errore generate:', error);
    alert('Errore durante la generazione');
  }
}

// ============================================
// ACTION: enhance_photo (Upload + Migliora)
// ============================================
async function enhanceImageWithAI(slotIndex, base64Data) {
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'enhance_photo',
        vat_number: VAT,
        chat_id: OWNER,
        token: TOKEN,
        position: newImageSlots[slotIndex].name,
        image_data: base64Data
      })
    });

    const result = await response.json();
    console.log('✅ Enhance photo OK', result);

    if (result.success && result.asset && result.asset.url) {
      // Ricarica pagina per mostrare nuova immagine
      window.location.reload();
    } else {
      hideLoader();
      throw new Error(result.message || result.error || 'Errore enhancement');
    }
  } catch (error) {
    hideLoader();
    console.error('❌ Errore enhance:', error);
    alert('Errore durante il miglioramento');
  }
}

// ============================================
// RENDERING SLOT
// ============================================
function renderSlot(slotIndex) {
  const slot = newImageSlots[slotIndex];
  const slotElement = document.getElementById(`slot-${slotIndex}`);
  
  if (slot.image) {
    slotElement.classList.add('filled');
    
    // Badge metodo usato
    let methodBadge = '';
    if (slot.method === 'generate') methodBadge = '🎨';
    else if (slot.method === 'enhance') methodBadge = '✨';
    else methodBadge = '📷';

    slotElement.innerHTML = `
      <img src="${slot.image}" alt="${slot.label}">
      <span class="slot-label">${methodBadge} ${slot.label}</span>
      <button class="remove-btn" onclick="removeSlot(${slotIndex})">
        <i class="fas fa-times"></i>
      </button>
    `;
  } else {
    slotElement.classList.remove('filled');
    const icon = slotIndex === 0 ? '🖼️' : (slotIndex === 2 ? '🎨' : '📷');
    const text = `GALLERY ${slotIndex + 1}`;
    
    slotElement.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">${icon}</div>
        <div class="placeholder-text">${text}</div>
      </div>
      <button class="ai-menu-btn" onclick="openSlotMenu(${slotIndex})">🤖</button>
      <span class="slot-label">${slot.label}</span>
    `;
  }
}

window.removeSlot = function(slotIndex) {
  newImageSlots[slotIndex].image = null;
  newImageSlots[slotIndex].method = null;
  renderSlot(slotIndex);
  updateProgress();
};

function updateProgress() {
  const filled = newImageSlots.filter(s => s.image !== null).length;
  const total = newImageSlots.length;
  const percent = (filled / total) * 100;
  
  document.getElementById('progress-text').textContent = `${filled}/${total}`;
  document.getElementById('progress-fill').style.width = `${percent}%`;
}

function validateNewImages() {
  const filled = newImageSlots.filter(s => s.image !== null).length;
  return filled === 3;
}

// ============================================
// FAB BUTTONS
// ============================================
document.getElementById('btn-back').addEventListener('click', () => {
  window.location.href = `../dashboard.html?vat=${VAT}&owner=${OWNER}&token=${TOKEN}`;
});

document.getElementById('btn-preview').addEventListener('click', async () => {
  await previewLanding();
});

document.getElementById('btn-deploy').addEventListener('click', () => {
  checkCreditsAndDeploy();
});

// ============================================
// ACTION: preview_landing
// ============================================
async function previewLanding() {
  if (!validateNewImages()) {
    alert('⚠️ Devi completare tutte e 3 le immagini!');
    return;
  }

  showLoader('👁️ Generazione anteprima...');

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'preview_landing',
        vat_number: VAT,
        chat_id: OWNER,
        token: TOKEN
      })
    });

    const result = await response.json();
    console.log('✅ Preview OK');

    hideLoader();

    if (result.success) {
      window.open(result.preview_url, '_blank');
    } else {
      throw new Error(result.message || result.error);
    }
  } catch (error) {
    hideLoader();
    console.error('❌ Errore preview:', error);
    alert('Errore generazione anteprima');
  }
}

// ============================================
// CHECK CREDITI E DEPLOY
// ============================================
function checkCreditsAndDeploy() {
  if (!validateNewImages()) {
    alert('⚠️ Devi completare tutte e 3 le immagini!');
    return;
  }

  const requiredCredits = 10000;
  const availableCredits = ownerData?.credits_balance || 0;

  if (availableCredits >= requiredCredits) {
    document.getElementById('confirm-overlay').classList.remove('hidden');
  } else {
    const deficit = requiredCredits - availableCredits;
    const msg = `❌ Crediti Insufficienti!\n\nDisponibili: ${availableCredits.toLocaleString()}\nRichiesti: ${requiredCredits.toLocaleString()}\nMancanti: ${deficit.toLocaleString()}`;
    if (confirm(msg + '\n\nVuoi ricaricare?')) {
      window.location.href = `https://dashboard.trinai.it/ricarica?vat=${VAT}&owner=${OWNER}&token=${TOKEN}`;
    }
  }
}

// ============================================
// CONFERMA DEPLOY
// ============================================
document.getElementById('btn-cancel-deploy').addEventListener('click', () => {
  document.getElementById('confirm-overlay').classList.add('hidden');
});

document.getElementById('btn-confirm-deploy').addEventListener('click', async () => {
  document.getElementById('confirm-overlay').classList.add('hidden');
  await executeDeploy();
});

// ============================================
// ACTION: deploy_honeyblog_landing
// ============================================
async function executeDeploy() {
  showLoader('🚀 Deploy in corso...');

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'deploy_honeyblog_landing',
        vat_number: VAT,
        chat_id: OWNER,
        token: TOKEN
      })
    });

    const result = await response.json();
    console.log('✅ Deploy OK');

    hideLoader();

    if (result.success) {
      const msg = `✅ Landing Pubblicata!\n\nURL: ${result.landing_url}\n\nCrediti scalati: 10,000\nCrediti residui: ${result.credits_remaining.toLocaleString()}`;
      alert(msg);
      const openNow = confirm('Vuoi aprire la landing ora?');
      if (openNow) window.open(result.landing_url, '_blank');
    } else if (result.error === 'insufficient_credits') {
      const msg = `❌ Crediti Insufficienti\n\nDisponibili: ${result.available.toLocaleString()}\nRichiesti: ${result.required.toLocaleString()}\nMancanti: ${result.deficit.toLocaleString()}`;
      if (confirm(msg + '\n\nVuoi ricaricare?')) {
        window.location.href = `https://dashboard.trinai.it/ricarica?vat=${VAT}&owner=${OWNER}&token=${TOKEN}`;
      }
    } else {
      throw new Error(result.message || result.error || 'Errore sconosciuto');
    }
  } catch (error) {
    console.error('❌ Errore deploy:', error);
    hideLoader();
    alert('Errore durante il deploy');
  }
}

// ============================================
// UTILITIES
// ============================================
function showLoader(text) {
  document.getElementById('loader-text').textContent = text;
  document.getElementById('loader').style.display = 'flex';
}

function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}

window.addEventListener('DOMContentLoaded', init);