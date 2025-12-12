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

const BACKEND_URL = 'https://www.simonaiit.workers.dev';

let ownerData = null;
let honeypotData = null;
let catalogData = null;
let uploadedImages = [];
let useAI = false;

// ============================================
// INIT
// ============================================
async function init() {
  showLoader('Recupero dati HoneyPot...');

  try {
    const response = await fetch(`${BACKEND_URL}/landing_honeypot_data?vat=${VAT}&owner=${OWNER}&token=${TOKEN}`);
    const data = await response.json();

    if (data.success) {
      ownerData = data.owner_data;
      honeypotData = data.honeypot;
      catalogData = data.catalog;

      // Debug
      document.getElementById('data-preview').style.display = 'block';
      document.getElementById('data-content').textContent = JSON.stringify({
        owner_credits: ownerData.credits,
        honeypot_fragments: honeypotData?.messages?.[0]?.data?.knowledge_fragments?.length || 0,
        catalog_items: catalogData?.categories?.length || 0
      }, null, 2);

      hideLoader();
      document.getElementById('app-content').classList.remove('hidden');
    } else {
      throw new Error(data.error || 'Errore caricamento dati');
    }
  } catch (error) {
    hideLoader();
    tg.showAlert('Errore: ' + error.message);
  }
}

// ============================================
// SCELTA MODALITÀ IMMAGINI
// ============================================
document.getElementById('choice-ai').addEventListener('click', () => {
  useAI = true;
  document.getElementById('choice-ai').style.borderColor = 'var(--primary)';
  document.getElementById('choice-ai').style.background = 'rgba(91, 111, 237, 0.15)';
  document.getElementById('choice-upload').style.borderColor = 'var(--glass-border)';
  document.getElementById('choice-upload').style.background = 'transparent';
  document.getElementById('upload-area').style.display = 'none';
  tg.showPopup({
    title: '🤖 Modalità AI Attivata',
    message: 'Al momento del deploy verranno generate immagini automatiche per la tua landing page.',
    buttons: [{ type: 'ok' }]
  });
});

document.getElementById('choice-upload').addEventListener('click', () => {
  useAI = false;
  document.getElementById('choice-upload').style.borderColor = 'var(--primary)';
  document.getElementById('choice-upload').style.background = 'rgba(91, 111, 237, 0.15)';
  document.getElementById('choice-ai').style.borderColor = 'var(--glass-border)';
  document.getElementById('choice-ai').style.background = 'transparent';
  document.getElementById('upload-area').style.display = 'block';
});

// ============================================
// UPLOAD IMMAGINI
// ============================================
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');

uploadArea.addEventListener('click', (e) => {
  if (e.target !== fileInput) fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  handleFiles(e.target.files);
});

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.style.background = 'rgba(91, 111, 237, 0.2)';
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.style.background = '';
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.style.background = '';
  handleFiles(e.dataTransfer.files);
});

function handleFiles(files) {
  if (uploadedImages.length + files.length > 5) {
    tg.showAlert('Puoi caricare massimo 5 immagini');
    return;
  }

  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedImages.push(e.target.result);
        renderImagePreview();
      };
      reader.readAsDataURL(file);
    }
  });
}

function renderImagePreview() {
  const preview = document.getElementById('images-preview');
  preview.innerHTML = uploadedImages.map((img, idx) => `
    <div style="position:relative; aspect-ratio:1; border-radius:8px; overflow:hidden; border:1px solid var(--glass-border);">
      <img src="${img}" alt="Image ${idx + 1}" style="width:100%; height:100%; object-fit:cover;">
      <button onclick="removeImage(${idx})" style="position:absolute; top:5px; right:5px; background:var(--error); color:white; border:none; border-radius:50%; width:25px; height:25px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:12px;">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join('');
}

window.removeImage = function(idx) {
  uploadedImages.splice(idx, 1);
  renderImagePreview();
};

// ============================================
// FAB BUTTONS
// ============================================
document.getElementById('btn-back').addEventListener('click', () => {
  tg.showConfirm('Tornare indietro? Le modifiche non salvate andranno perse.', (confirmed) => {
    if (confirmed) {
      window.location.href = `../dashboard.html?vat=${VAT}&owner=${OWNER}&token=${TOKEN}`;
    }
  });
});

document.getElementById('btn-preview').addEventListener('click', () => {
  tg.showAlert('👁️ Anteprima in sviluppo. Qui verrà mostrata la landing generata.');
});

document.getElementById('btn-deploy').addEventListener('click', () => {
  checkCreditsAndDeploy();
});

// ============================================
// CHECK CREDITI E DEPLOY
// ============================================
function checkCreditsAndDeploy() {
  const requiredCredits = 10000;
  const availableCredits = ownerData?.credits || 0;

  if (availableCredits >= requiredCredits) {
    // Mostra overlay conferma
    document.getElementById('confirm-overlay').classList.remove('hidden');
  } else {
    // Crediti insufficienti
    const deficit = requiredCredits - availableCredits;
    tg.showAlert(`❌ Crediti Insufficienti!\n\nDisponibili: ${availableCredits.toLocaleString()}\nRichiesti: ${requiredCredits.toLocaleString()}\nMancanti: ${deficit.toLocaleString()}\n\nVerrai reindirizzato alla pagina di ricarica.`, () => {
      window.location.href = `https://dashboard.trinai.it/ricarica?vat=${VAT}&owner=${OWNER}&token=${TOKEN}`;
    });
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

async function executeDeploy() {
  showLoader('🚀 Deploy in corso...');

  try {
    const payload = {
      vat: VAT,
      owner: OWNER,
      token: TOKEN,
      use_ai_images: useAI,
      uploaded_images: uploadedImages,
      honeypot: honeypotData,
      catalog: catalogData
    };

    const response = await fetch(`${BACKEND_URL}/deploy_honeypot_landing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    hideLoader();

    if (result.success) {
      tg.showPopup({
        title: '✅ Landing Pubblicata!',
        message: `URL: ${result.landing_url}\n\nCrediti scalati: 10,000\nCrediti residui: ${result.credits_remaining.toLocaleString()}`,
        buttons: [
          { id: 'view', type: 'default', text: 'Visualizza' },
          { id: 'ok', type: 'ok' }
        ]
      }, (buttonId) => {
        if (buttonId === 'view') {
          tg.openLink(result.landing_url);
        }
      });
    } else {
      tg.showAlert('❌ Errore: ' + result.error);
    }

  } catch (error) {
    hideLoader();
    tg.showAlert('Errore durante il deploy: ' + error.message);
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

// Init al caricamento pagina
window.addEventListener('DOMContentLoaded', init);