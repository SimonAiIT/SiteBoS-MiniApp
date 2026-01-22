/**
 * TrinAi Warehouse - New Insert Logic
 * Handles XML, PDF, and Photo uploads with AI processing
 * 
 * Webhook: https://trinai.api.workflow.dcmake.it/webhook/19efc8b9-5579-4d01-8856-54deb0f3d294
 */

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Webhook endpoint
const WEBHOOK_URL = 'https://trinai.api.workflow.dcmake.it/webhook/19efc8b9-5579-4d01-8856-54deb0f3d294';

// File storage
let uploadedFiles = {
  xml: null,
  pdf: null,
  photo: null
};

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const vat = urlParams.get('vat');
const sessionId = urlParams.get('session_id') || generateSessionId();

/**
 * Initialize event listeners
 */
document.addEventListener('DOMContentLoaded', () => {
  setupFileInputs();
  setupDragAndDrop();
});

/**
 * Setup file inputs
 */
function setupFileInputs() {
  // XML
  document.getElementById('file-xml').addEventListener('change', (e) => {
    handleFileSelect(e, 'xml');
  });

  // PDF
  document.getElementById('file-pdf').addEventListener('change', (e) => {
    handleFileSelect(e, 'pdf');
  });

  // Photo
  document.getElementById('file-photo').addEventListener('change', (e) => {
    handleFileSelect(e, 'photo');
  });
}

/**
 * Setup drag and drop
 */
function setupDragAndDrop() {
  ['xml', 'pdf', 'photo'].forEach(type => {
    const uploadArea = document.getElementById(`upload-${type}`);
    
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const input = document.getElementById(`file-${type}`);
        input.files = files;
        handleFileSelect({ target: input }, type);
      }
    });
  });
}

/**
 * Handle file selection
 */
function handleFileSelect(event, type) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file
  const validation = validateFile(file, type);
  if (!validation.valid) {
    showError(validation.error);
    return;
  }

  uploadedFiles[type] = file;
  displayFileInfo(file, type);
  enableSubmitButton(type);

  // Preview for photos
  if (type === 'photo') {
    showImagePreview(file);
  }

  if (tg?.HapticFeedback) {
    tg.HapticFeedback.notificationOccurred('success');
  }
}

/**
 * Validate file
 */
function validateFile(file, type) {
  const maxSize = type === 'photo' ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB for photos, 5MB for others
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File troppo grande. Max ${maxSize / 1024 / 1024} MB`
    };
  }

  // Check file type
  if (type === 'xml' && !file.name.toLowerCase().endsWith('.xml')) {
    return { valid: false, error: 'Il file deve essere in formato XML' };
  }
  
  if (type === 'pdf' && !file.type.includes('pdf')) {
    return { valid: false, error: 'Il file deve essere in formato PDF' };
  }
  
  if (type === 'photo' && !file.type.startsWith('image/')) {
    return { valid: false, error: 'Il file deve essere un\'immagine' };
  }

  return { valid: true };
}

/**
 * Display file info
 */
function displayFileInfo(file, type) {
  document.getElementById(`filename-${type}`).textContent = file.name;
  document.getElementById(`filesize-${type}`).textContent = formatFileSize(file.size);
  document.getElementById(`info-${type}`).classList.add('show');
  document.getElementById(`upload-${type}`).style.display = 'none';
}

/**
 * Remove file
 */
function removeFile(type) {
  uploadedFiles[type] = null;
  document.getElementById(`file-${type}`).value = '';
  document.getElementById(`info-${type}`).classList.remove('show');
  document.getElementById(`upload-${type}`).style.display = 'block';
  document.getElementById(`submit-${type}`).disabled = true;
  
  if (type === 'photo') {
    document.getElementById('preview-photo').classList.remove('show');
  }

  if (tg?.HapticFeedback) {
    tg.HapticFeedback.impactOccurred('light');
  }
}

/**
 * Show image preview
 */
function showImagePreview(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = document.getElementById('preview-photo');
    preview.src = e.target.result;
    preview.classList.add('show');
  };
  reader.readAsDataURL(file);
}

/**
 * Enable submit button
 */
function enableSubmitButton(type) {
  document.getElementById(`submit-${type}`).disabled = false;
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Switch tab
 */
function switchTab(tabName) {
  // Remove active from all tabs
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  // Add active to selected tab
  event.target.classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');

  if (tg?.HapticFeedback) {
    tg.HapticFeedback.selectionChanged();
  }
}

/**
 * Submit XML
 */
async function submitXML() {
  const file = uploadedFiles.xml;
  if (!file) return;

  setLoadingState('xml', true);

  try {
    // Read XML as text
    const xmlText = await readFileAsText(file);

    // Prepare payload
    const payload = {
      action: 'upload_xml',
      vat: vat,
      session_id: sessionId,
      filename: file.name,
      xml_content: xmlText,
      timestamp: new Date().toISOString()
    };

    // Send to webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    handleSuccess(result, 'xml');

  } catch (error) {
    console.error('Error uploading XML:', error);
    handleError(error, 'xml');
  } finally {
    setLoadingState('xml', false);
  }
}

/**
 * Submit PDF
 */
async function submitPDF() {
  const file = uploadedFiles.pdf;
  if (!file) return;

  setLoadingState('pdf', true);

  try {
    // Read PDF as base64
    const base64Data = await readFileAsBase64(file);

    // Prepare payload
    const payload = {
      action: 'upload_pdf',
      vat: vat,
      session_id: sessionId,
      filename: file.name,
      mimetype: file.type,
      file_base64: base64Data,
      timestamp: new Date().toISOString()
    };

    // Send to webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    handleSuccess(result, 'pdf');

  } catch (error) {
    console.error('Error uploading PDF:', error);
    handleError(error, 'pdf');
  } finally {
    setLoadingState('pdf', false);
  }
}

/**
 * Submit Photo
 */
async function submitPhoto() {
  const file = uploadedFiles.photo;
  if (!file) return;

  setLoadingState('photo', true);

  try {
    // Read photo as base64
    const base64Data = await readFileAsBase64(file);

    // Prepare payload
    const payload = {
      action: 'upload_photo',
      vat: vat,
      session_id: sessionId,
      filename: file.name,
      mimetype: file.type,
      file_base64: base64Data,
      timestamp: new Date().toISOString()
    };

    // Send to webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    handleSuccess(result, 'photo');

  } catch (error) {
    console.error('Error uploading Photo:', error);
    handleError(error, 'photo');
  } finally {
    setLoadingState('photo', false);
  }
}

/**
 * Read file as text
 */
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

/**
 * Read file as base64
 */
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Remove data:image/jpeg;base64, prefix
      const base64 = e.target.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

/**
 * Set loading state
 */
function setLoadingState(type, loading) {
  const btn = document.getElementById(`submit-${type}`);
  
  if (loading) {
    btn.classList.add('loading');
    btn.disabled = true;
  } else {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

/**
 * Handle success
 */
function handleSuccess(result, type) {
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.notificationOccurred('success');
  }

  const typeLabels = {
    xml: 'Fattura XML',
    pdf: 'Fattura PDF',
    photo: 'Foto Ricevuta'
  };

  const message = `✅ ${typeLabels[type]} caricata con successo!\n\nL'AI sta elaborando gli articoli. Riceverai una notifica quando sarà completato.`;

  if (tg?.showPopup) {
    tg.showPopup({
      title: '✅ Caricamento Completato',
      message: message,
      buttons: [
        { id: 'ok', type: 'default', text: 'OK' }
      ]
    }, () => {
      goBack();
    });
  } else {
    alert(message);
    goBack();
  }
}

/**
 * Handle error
 */
function handleError(error, type) {
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.notificationOccurred('error');
  }

  const message = `❌ Errore durante il caricamento:\n${error.message || 'Errore sconosciuto'}\n\nRiprova o contatta il supporto.`;

  if (tg?.showAlert) {
    tg.showAlert(message);
  } else {
    alert(message);
  }
}

/**
 * Show error
 */
function showError(message) {
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.notificationOccurred('error');
  }

  if (tg?.showAlert) {
    tg.showAlert(message);
  } else {
    alert(message);
  }
}

/**
 * Go back to warehouse
 */
function goBack() {
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.impactOccurred('light');
  }
  window.location.href = `./warehouse.html?${urlParams.toString()}`;
}

/**
 * Generate session ID
 */
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
