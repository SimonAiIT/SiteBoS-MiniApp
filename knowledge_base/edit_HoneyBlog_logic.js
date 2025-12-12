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

// 🎯 3 NUOVI SLOT (logo e photo già esistenti in assets)
const newImageSlots = [
  { id: 0, name: 'gallery1', label: 'Gallery 1', image: null },
  { id: 1, name: 'gallery2', label: 'Gallery 2', image: null },
  { id: 2, name: 'gallery3', label: 'Gallery 3', image: null }
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

    // 🖼️ Carica immagini esistenti da assets
    loadExistingAssets();

    hideLoader();
    document.getElementById('app-content').classList.remove('hidden');

    if (tg?.showPopup) {
      tg.showPopup({
        title: '✅ Dati Caricati',
        message: `${ownerData.ragione_sociale}\n\nLogo e Photo già disponibili.\nCarica 3 nuove immagini per completare.`,
        buttons: [{ type: 'ok' }]
      });
    }

  } catch (error) {
    console.error('❌ Errore init:', error);
    hideLoader();
    if (tg?.showAlert) {
      tg.showAlert('❌ Errore caricamento dati');
    } else {
      alert('Errore caricamento dati');
    }
  }
}

// ============================================
// CARICA ASSETS ESISTENTI
// ============================================
function loadExistingAssets() {
  // Logo
  const logoUrl = honeypotData.assets?.logo?.url;
  if (logoUrl) {
    document.getElementById('img-logo').src = logoUrl;
  }

  // Photo
  const photoUrl = honeypotData.assets?.photo?.url;
  if (photoUrl) {
    document.getElementById('img-photo').src = photoUrl;
  }
}

// ============================================
// SLOT MANAGEMENT (3 NUOVE IMMAGINI)
// ============================================
window.selectSlot = function(slotIndex) {
  currentSlotIndex = slotIndex;
  document.getElementById('file-input').click();
};

document.getElementById('file-input').addEventListener('change', function(e) {
  if (!e.target.files || !e.target.files[0]) return;
  
  const file = e.target.files[0];
  if (!file.type.startsWith('image/')) {
    alert('⚠️ Seleziona un file immagine valido');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    newImageSlots[currentSlotIndex].image = event.target.result;
    renderSlot(currentSlotIndex);
    updateProgress();
  };
  reader.readAsDataURL(file);
  
  e.target.value = '';
});

function renderSlot(slotIndex) {
  const slot = newImageSlots[slotIndex];
  const slotElement = document.getElementById(`slot-${slotIndex}`);
  
  if (slot.image) {
    slotElement.classList.add('filled');
    slotElement.innerHTML = `
      <img src="${slot.image}" alt="${slot.label}">
      <span class="slot-label">${slot.label}</span>
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
      <span class="slot-label">${slot.label}</span>
    `;
  }
}

window.removeSlot = function(slotIndex) {
  newImageSlots[slotIndex].image = null;
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

function getNewImagesBase64() {
  return newImageSlots
    .filter(s => s.image !== null)
    .map(s => ({
      position: s.name,
      data: s.image
    }));
}

function validateNewImages() {
  const filled = newImageSlots.filter(s => s.image !== null).length;
  return filled === 3; // Tutte e 3 obbligatorie
}

// ============================================
// FAB BUTTONS
// ============================================
document.getElementById('btn-back').addEventListener('click', () => {
  // ✅ Torna indietro direttamente senza conferma
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
    const msg = '⚠️ Devi caricare tutte e 3 le nuove immagini!';
    if (tg?.showAlert) {
      tg.showAlert(msg);
    } else {
      alert(msg);
    }
    return;
  }

  showLoader('👁️ Generazione anteprima...');

  try {
    const newImages = getNewImagesBase64();

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'preview_landing',
        vat_number: VAT,
        chat_id: OWNER,
        token: TOKEN,
        new_images: newImages,
        honeypot: honeypotData,
        catalog: catalogData
      })
    });

    const result = await response.json();
    console.log('✅ Preview result OK');

    hideLoader();

    if (result.success) {
      window.open(result.preview_url, '_blank');
      
      if (tg?.showPopup) {
        tg.showPopup({
          title: '✅ Anteprima Pronta',
          message: `L'anteprima è stata generata.\n\nValida fino a: ${new Date(result.expires_at).toLocaleString('it-IT')}`,
          buttons: [{ type: 'ok' }]
        });
      }
    } else {
      throw new Error(result.message || result.error || 'Errore anteprima');
    }
  } catch (error) {
    console.error('❌ Errore preview:', error);
    hideLoader();
    if (tg?.showAlert) {
      tg.showAlert('Errore generazione anteprima');
    } else {
      alert('Errore generazione anteprima');
    }
  }
}

// ============================================
// CHECK CREDITI E DEPLOY
// ============================================
function checkCreditsAndDeploy() {
  if (!validateNewImages()) {
    const msg = '⚠️ Devi caricare tutte e 3 le nuove immagini!';
    if (tg?.showAlert) {
      tg.showAlert(msg);
    } else {
      alert(msg);
    }
    return;
  }

  const requiredCredits = 10000;
  const availableCredits = ownerData?.credits_balance || 0;

  if (availableCredits >= requiredCredits) {
    document.getElementById('confirm-overlay').classList.remove('hidden');
  } else {
    const deficit = requiredCredits - availableCredits;
    const msg = `❌ Crediti Insufficienti!\n\nDisponibili: ${availableCredits.toLocaleString()}\nRichiesti: ${requiredCredits.toLocaleString()}\nMancanti: ${deficit.toLocaleString()}`;
    
    if (tg?.showAlert) {
      tg.showAlert(msg, () => {
        window.location.href = `https://dashboard.trinai.it/ricarica?vat=${VAT}&owner=${OWNER}&token=${TOKEN}`;
      });
    } else {
      if (confirm(msg + '\n\nVuoi ricaricare?')) {
        window.location.href = `https://dashboard.trinai.it/ricarica?vat=${VAT}&owner=${OWNER}&token=${TOKEN}`;
      }
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
    const newImages = getNewImagesBase64();

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'deploy_honeyblog_landing',
        vat_number: VAT,
        chat_id: OWNER,
        token: TOKEN,
        new_images: newImages,
        honeypot: honeypotData,
        catalog: catalogData
      })
    });

    const result = await response.json();
    console.log('✅ Deploy result OK');

    hideLoader();

    if (result.success) {
      const msg = `✅ Landing Pubblicata!\n\nURL: ${result.landing_url}\n\nCrediti scalati: 10,000\nCrediti residui: ${result.credits_remaining.toLocaleString()}`;
      
      if (tg?.showPopup) {
        tg.showPopup({
          title: '🎉 Successo!',
          message: msg,
          buttons: [
            { id: 'view', type: 'default', text: 'Apri Landing' },
            { id: 'dashboard', type: 'default', text: 'Dashboard' }
          ]
        }, (buttonId) => {
          if (buttonId === 'view') {
            window.open(result.landing_url, '_blank');
          } else if (buttonId === 'dashboard') {
            window.location.href = `../dashboard.html?vat=${VAT}&owner=${OWNER}&token=${TOKEN}`;
          }
        });
      } else {
        alert(msg);
        const openNow = confirm('Vuoi aprire la landing ora?');
        if (openNow) window.open(result.landing_url, '_blank');
      }

    } else if (result.error === 'insufficient_credits') {
      const msg = `❌ Crediti Insufficienti\n\nDisponibili: ${result.available.toLocaleString()}\nRichiesti: ${result.required.toLocaleString()}\nMancanti: ${result.deficit.toLocaleString()}`;
      
      if (tg?.showAlert) {
        tg.showAlert(msg, () => {
          window.location.href = `https://dashboard.trinai.it/ricarica?vat=${VAT}&owner=${OWNER}&token=${TOKEN}`;
        });
      } else {
        if (confirm(msg + '\n\nVuoi ricaricare?')) {
          window.location.href = `https://dashboard.trinai.it/ricarica?vat=${VAT}&owner=${OWNER}&token=${TOKEN}`;
        }
      }

    } else {
      throw new Error(result.message || result.error || 'Errore sconosciuto');
    }

  } catch (error) {
    console.error('❌ Errore deploy:', error);
    hideLoader();
    if (tg?.showAlert) {
      tg.showAlert('Errore durante il deploy');
    } else {
      alert('Errore durante il deploy');
    }
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