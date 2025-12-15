// edit_operator_logic.js

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Config
const API_ENDPOINT = 'https://trinai.api.workflow.dcmake.it/webhook/2e3376d7-6a5a-4fc1-a908-4b8b9501c583';

// URL Params
const urlParams = new URLSearchParams(window.location.search);
const chatId = urlParams.get('chat_id');
const ownerVat = urlParams.get('vat');

// State
let originalData = {};
let hasChanges = false;

// ============================================
// INIT
// ============================================

async function init() {
  if (!chatId) {
    alert('❌ Parametri mancanti');
    tg.close();
    return;
  }

  showLoader();
  
  try {
    await loadData();
    setupChangeDetection();
    hideLoader();
  } catch (error) {
    console.error('Init error:', error);
    alert('❌ Errore nel caricamento dei dati');
    hideLoader();
  }
}

// ============================================
// LOAD DATA
// ============================================

async function loadData() {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_operator_dashboard',
        chat_id: chatId,
        owner_vat: ownerVat
      })
    });

    if (!response.ok) throw new Error('Network error');
    
    const data = await response.json();
    
    if (data.status === 'success' && data.stakeholder) {
      originalData = data.stakeholder;
      populateForm(data.stakeholder);
    } else {
      throw new Error(data.message || 'Errore caricamento');
    }

  } catch (error) {
    console.error('Load error:', error);
    
    // Fallback sessionStorage
    const cached = sessionStorage.getItem('stakeholder_raw');
    if (cached) {
      originalData = JSON.parse(cached);
      populateForm(originalData);
    } else {
      throw error;
    }
  }
}

// ============================================
// POPULATE FORM
// ============================================

function populateForm(stakeholder) {
  const id = stakeholder.identity || {};
  const contact = id.primary_contact || {};
  const prof = stakeholder.identity?.professional_background || {};
  const profProfile = stakeholder.professional_profile || {};
  const social = id.social_profiles || {};

  // Anagrafica
  setValue('full_name', id.full_name);
  setValue('tax_code', id.fiscal_info?.tax_code);

  // Contatti
  setValue('email', contact.email);
  setValue('phone', contact.phone);

  // Professionale
  setValue('current_role', prof.current_role);
  setValue('years_experience', profProfile.years_experience || '15+');

  // Social
  setValue('linkedin', social.linkedin);
}

function setValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

// ============================================
// CHANGE DETECTION
// ============================================

function setupChangeDetection() {
  const inputs = document.querySelectorAll('input:not([disabled]), select, textarea');
  const saveBtn = document.getElementById('saveBtn');
  
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      hasChanges = true;
      saveBtn.disabled = false;
      saveBtn.style.background = 'var(--primary)';
    });
  });
}

// ============================================
// SAVE DATA
// ============================================

async function saveChanges() {
  const btn = document.getElementById('saveBtn');
  const originalContent = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;

  try {
    const updatedFields = {
      full_name: document.getElementById('full_name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      current_role: document.getElementById('current_role').value,
      years_experience: document.getElementById('years_experience').value,
      linkedin: document.getElementById('linkedin').value
    };

    const payload = {
      action: 'save_stakeholder_data',
      chat_id: chatId,
      owner_vat: ownerVat,
      updated_data: updatedFields
    };

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status === 'success') {
      tg.HapticFeedback.notificationOccurred('success');
      
      // Update sessionStorage
      sessionStorage.removeItem('operator_data');
      sessionStorage.removeItem('stakeholder_raw');
      
      setTimeout(() => {
        window.location.href = `operator_dashboard.html?chat_id=${chatId}&vat=${ownerVat}`;
      }, 500);
    } else {
      throw new Error(result.message || 'Errore salvataggio');
    }

  } catch (error) {
    console.error('Save error:', error);
    tg.HapticFeedback.notificationOccurred('error');
    alert('❌ Errore durante il salvataggio. Riprova.');
    
    btn.innerHTML = originalContent;
    btn.disabled = false;
  }
}

// ============================================
// NAVIGATION
// ============================================

function goBack() {
  tg.HapticFeedback.impactOccurred('light');
  
  if (hasChanges) {
    if (confirm('Hai modifiche non salvate. Vuoi uscire?')) {
      window.location.href = `operator_dashboard.html?chat_id=${chatId}&vat=${ownerVat}`;
    }
  } else {
    window.location.href = `operator_dashboard.html?chat_id=${chatId}&vat=${ownerVat}`;
  }
}

// ============================================
// UI HELPERS
// ============================================

function showLoader() {
  document.getElementById('loader').classList.remove('hidden');
  document.getElementById('app-content').classList.add('hidden');
}

function hideLoader() {
  document.getElementById('loader').classList.add('hidden');
  document.getElementById('app-content').classList.remove('hidden');
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', init);

// Save button
document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveChanges);
  }
});