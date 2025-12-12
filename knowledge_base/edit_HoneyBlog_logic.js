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

// 🔗 Endpoint Backend HoneyBlog
const BACKEND_URL = 'https://trinai.api.workflow.dcmake.it/webhook/50891655-84c8-4213-90e8-26ebbc3d6c4c';

let ownerData = null;
let honeypotData = null;
let catalogData = null;
let uploadedImages = [];
let useAI = false;

// ============================================
// INIT - ACTION: get_honeyblog_data
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
    console.log('📦 Webhook Response OK');

    // ✅ PARSING CORRETTO: Oggetto diretto
    honeypotData = data.HoneyPot;
    catalogData = data.service_catalog_setup;
    ownerData = data.owner_data;

    // Validazione base
    if (!honeypotData || !ownerData) {
      throw new Error('Dati HoneyPot o Owner mancanti');
    }

    hideLoader();
    document.getElementById('app-content').classList.remove('hidden');

    // Notifica successo (senza dati sensibili)
    if (tg?.showPopup) {
      tg.showPopup({
        title: '✅ Dati Caricati',
        message: `Business: ${ownerData.ragione_sociale}\n\nKnowledge Fragments: ${honeypotData.knowledge_fragments?.length || 0}\nCategorie Catalogo: ${catalogData?.categories?.length || 0}`,
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
// SCELTA MODALITÀ IMMAGINI
// ============================================
document.getElementById('choice-ai').addEventListener('click', () => {
  useAI = true;
  document.getElementById('choice-ai').style.borderColor = 'var(--primary)';
  document.getElementById('choice-ai').style.background = 'rgba(91, 111, 237, 0.15)';
  document.getElementById('choice-upload').style.borderColor = 'var(--glass-border)';
  document.getElementById('choice-upload').style.background = 'transparent';
  document.getElementById('upload-area').style.display = 'none';
  
  if (tg?.showPopup) {
    tg.showPopup({
      title: '🤖 Modalità AI Attivata',
      message: 'Al momento del deploy verranno generate immagini automatiche per la tua landing page.',
      buttons: [{ type: 'ok' }]
    });
  } else {
    alert('🤖 Modalità AI Attivata');
  }
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
    if (tg?.showAlert) {
      tg.showAlert('Puoi caricare massimo 5 immagini');
    } else {
      alert('Puoi caricare massimo 5 immagini');
    }
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
  const confirmed = confirm('Tornare indietro? Le modifiche non salvate andranno perse.');
  if (confirmed) {
    window.location.href = `../dashboard.html?vat=${VAT}&owner=${OWNER}&token=${TOKEN}`;
  }
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
  if (!useAI && uploadedImages.length === 0) {
    const msg = '⚠️ Seleziona "Genera con AI" o carica almeno 1 immagine!';
    if (tg?.showAlert) {
      tg.showAlert(msg);
    } else {
      alert(msg);
    }
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
        token: TOKEN,
        use_ai_images: useAI,
        uploaded_images: uploadedImages,
        honeypot: honeypotData,
        catalog: catalogData
      })
    });

    const result = await response.json();
    console.log('👁️ Preview result OK');

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
  if (!useAI && uploadedImages.length === 0) {
    const msg = '⚠️ Seleziona "Genera con AI" o carica almeno 1 immagine!';
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
    const msg = `❌ Crediti Insufficienti!\n\nDisponibili: ${availableCredits.toLocaleString()}\nRichiesti: ${requiredCredits.toLocaleString()}\nMancanti: ${deficit.toLocaleString()}\n\nVerrai reindirizzato alla pagina di ricarica.`;
    
    if (tg?.showAlert) {
      tg.showAlert(msg, () => {
        window.location.href = `https://dashboard.trinai.it/ricarica?vat=${VAT}&owner=${OWNER}&token=${TOKEN}`;
      });
    } else {
      alert(msg);
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
        token: TOKEN,
        use_ai_images: useAI,
        uploaded_images: uploadedImages,
        honeypot: honeypotData,
        catalog: catalogData
      })
    });

    const result = await response.json();
    console.log('🚀 Deploy result OK');

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
        alert(msg);
        window.location.href = `https://dashboard.trinai.it/ricarica?vat=${VAT}&owner=${OWNER}&token=${TOKEN}`;
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

// Init al caricamento pagina
window.addEventListener('DOMContentLoaded', init);