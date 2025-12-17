// ============================================
// OPERATOR TASK CREATE - LOGIC
// ✅ EVENT-DRIVEN HANDSHAKE (NO POLLING)
// ============================================

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const WEBHOOK_URL = 'https://trinai.api.workflow.dcmake.it/webhook/d253f855-ce1a-43ee-81aa-38fa11a9d639';
const BASE_URL = 'https://simonaiit.github.io/SiteBoS-MiniApp';

let selectedTarget = null;
let selectedTargetType = null;
let currentStep = 'target';
let capturedPhoto = null;
let currentSmartLink = null;
let currentSessionId = null;
let operatorSession = null;

// ✅ CRITICAL: Extract URL params DIRECTLY on load
const urlParams = new URLSearchParams(window.location.search);
const URL_CHAT_ID = urlParams.get('chat_id');
const URL_VAT = urlParams.get('vat');

console.group('🔍 OPERATOR TASK CREATE - DEBUG');
console.log('Current URL:', window.location.href);
console.log('Extracted chat_id:', URL_CHAT_ID);
console.log('Extracted vat:', URL_VAT);
console.groupEnd();

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    operatorSession = initOperatorSession();
    
    if (!operatorSession || !operatorSession.chat_id || !operatorSession.vat) {
        console.warn('⚠️ Session init failed, building manually from URL...');
        operatorSession = {
            chat_id: URL_CHAT_ID || tg.initDataUnsafe?.user?.id?.toString() || 'demo_operator',
            vat: URL_VAT || 'DEMO_VAT'
        };
        persistOperatorSession(operatorSession);
    }
    
    console.log('✅ Final operator session:', operatorSession);
    
    setupEventListeners();
    setupCustomEventListeners();
    showStep('target');
});

// ============================================
// CUSTOM EVENT LISTENERS (EVENT-DRIVEN)
// ============================================

function setupCustomEventListeners() {
    // Listen for customer arrived event
    window.addEventListener('customerArrived', (event) => {
        console.log('👁️ Custom Event: customerArrived', event.detail);
        handleCustomerArrived(event.detail);
    });
    
    // Listen for customer connected event
    window.addEventListener('customerConnected', (event) => {
        console.log('✅ Custom Event: customerConnected', event.detail);
        handleClientConnected(event.detail.customer);
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    document.querySelectorAll('.target-option').forEach(option => {
        option.addEventListener('click', () => {
            handleTargetSelection(option.dataset.option);
        });
    });

    const copyLinkBtn = document.getElementById('copy-link-btn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', copySmartLink);
    }

    const proceedBtn = document.getElementById('proceed-with-client');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', () => {
            showStep('mission-type');
        });
    }

    const searchInput = document.getElementById('client-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleClientSearch, 300));
    }

    const scanAssetBtn = document.getElementById('scan-asset-btn');
    if (scanAssetBtn) {
        scanAssetBtn.addEventListener('click', scanAssetQR);
    }

    const setInternalBtn = document.getElementById('set-internal-btn');
    if (setInternalBtn) {
        setInternalBtn.addEventListener('click', setInternalTarget);
    }

    document.querySelectorAll('.mission-option').forEach(option => {
        option.addEventListener('click', () => {
            handleMissionTypeSelection(option.dataset.type);
        });
    });

    const photoInput = document.getElementById('photo-input');
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoUpload);
    }

    const generateReportBtn = document.getElementById('generate-report-btn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }
}

// ============================================
// TARGET SELECTION
// ============================================

function handleTargetSelection(type) {
    if (type === 'new') {
        showStep('handshake');
        initHandshake();
    } else if (type === 'known') {
        showStep('search');
    } else if (type === 'asset') {
        showStep('asset');
    }
}

// ============================================
// HANDSHAKE FLOW - EVENT-DRIVEN (NO POLLING)
// ============================================

function generateInviteToken() {
    const vatId = operatorSession?.vat || URL_VAT || 'DEMO_VAT';
    const operatorId = operatorSession?.chat_id || URL_CHAT_ID || tg.initDataUnsafe?.user?.id?.toString() || 'demo_operator';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    
    const token = `${vatId}_${operatorId}_${timestamp}_${randomStr}`;
    
    console.group('✅ TOKEN GENERATION');
    console.log('VAT:', vatId);
    console.log('Operator ID:', operatorId);
    console.log('FULL TOKEN:', token);
    console.groupEnd();
    
    return token;
}

function buildSmartLink(token) {
    return `${BASE_URL}/customer/securehandshake.html?invite=${token}`;
}

async function initHandshake() {
    try {
        const inviteToken = generateInviteToken();
        const smartLink = buildSmartLink(inviteToken);
        currentSmartLink = smartLink;
        currentSessionId = inviteToken;
        
        console.log('✅ Smart Link generated:', smartLink);
        console.log('🎧 Listening for custom events on session:', currentSessionId);
        
        // Display Smart Link
        const linkDisplay = document.getElementById('smart-link-display');
        if (linkDisplay) {
            linkDisplay.textContent = smartLink.replace('https://', '');
        }

        // Generate QR Code
        const qrContainer = document.getElementById('qr-code');
        qrContainer.innerHTML = '';
        
        if (typeof QRCode !== 'undefined') {
            new QRCode(qrContainer, {
                text: smartLink,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            qrContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; font-size: 11px; color: var(--text-muted); word-break: break-all;">
                    <i class="fas fa-qrcode" style="font-size: 60px; margin-bottom: 10px; opacity: 0.3;"></i>
                    <p>Libreria QR non caricata</p>
                    <p style="margin-top: 10px;">${smartLink}</p>
                </div>
            `;
        }

        // Register handshake session with webhook (ONE TIME)
        await registerHandshakeSession(inviteToken);

        // Now just WAIT for custom event (no polling!)
        console.log('⏳ Waiting for customerConnected event...');

    } catch (error) {
        console.error('Error initializing handshake:', error);
        tg.showAlert('Errore nella creazione del link. Riprova.');
    }
}

// Register session with webhook (called ONCE)
async function registerHandshakeSession(sessionId) {
    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'register_handshake',
                operator_id: operatorSession?.chat_id || URL_CHAT_ID || tg.initDataUnsafe?.user?.id || 'demo_user',
                vat: operatorSession?.vat || URL_VAT || null,
                session_id: sessionId,
                smart_link: currentSmartLink
            })
        });
        console.log('✅ Handshake session registered');
    } catch (error) {
        console.warn('⚠️ Failed to register session (non-critical):', error);
    }
}

// 👁️ STAGE 1: Customer scanned QR and landed on page
function handleCustomerArrived(data) {
    console.log('👁️ Customer arrived at handshake page:', data);
    
    // Vibrate short
    if (navigator.vibrate) {
        navigator.vibrate(100);
    }

    // Update radar animation text
    const radarEl = document.getElementById('radar-animation');
    if (radarEl) {
        const statusText = radarEl.querySelector('p');
        if (statusText) {
            statusText.innerHTML = `
                <i class="fas fa-eye" style="color: var(--info);"></i><br>
                Cliente in arrivo...<br>
                <small style="font-size: 11px; color: var(--text-secondary);">In attesa di autenticazione</small>
            `;
        }
    }

    // Show popup notification
    tg.showPopup({
        title: '👁️ Cliente in Arrivo',
        message: 'Il cliente ha aperto il link di invito',
        buttons: [{ type: 'close' }]
    });
}

// ✅ STAGE 2: Customer completed OAuth (TRIGGERED BY EVENT)
function handleClientConnected(customer) {
    console.log('✅ Customer connected (via custom event):', customer);
    
    // Vibrate success pattern
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
    }

    // Hide radar and QR
    document.getElementById('radar-animation').classList.add('hidden');
    document.getElementById('qr-container').classList.add('hidden');
    document.getElementById('connected-state').classList.remove('hidden');
    
    // Display customer info
    const connectedState = document.getElementById('connected-state');
    const fullName = `${customer.firstName} ${customer.lastName || ''}`.trim();
    
    // Build connected state HTML
    let connectedHTML = '';
    
    // Photo if available
    if (customer.photoUrl) {
        connectedHTML += `
            <img src="${customer.photoUrl}" 
                 style="width: 80px; height: 80px; border-radius: 50%; margin: 15px auto; display: block; border: 3px solid var(--success);" 
                 alt="${fullName}">
        `;
    }
    
    // Name
    connectedHTML += `
        <h3 id="connected-name" style="margin: 15px 0 5px 0; color: var(--success);">
            ✅ ${fullName}
        </h3>
    `;
    
    // Username if available
    if (customer.username) {
        connectedHTML += `
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">@${customer.username}</p>
        `;
    }
    
    // Proceed button
    connectedHTML += `
        <button class="btn" id="proceed-with-client" style="margin-top: 20px;">
            <i class="fas fa-arrow-right"></i> Procedi con Cliente
        </button>
    `;
    
    connectedState.innerHTML = connectedHTML;
    
    // Re-attach proceed button listener
    document.getElementById('proceed-with-client').addEventListener('click', () => {
        showStep('mission-type');
    });
    
    selectedTarget = customer;
    selectedTargetType = 'person';

    tg.showAlert(`✅ Connesso: ${fullName}`);
}

function copySmartLink() {
    if (!currentSmartLink) {
        tg.showAlert('Link non ancora generato');
        return;
    }
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(currentSmartLink).then(() => {
            tg.showAlert('✅ Link copiato! Invialo al cliente.');
        }).catch(err => {
            console.error('Copy failed:', err);
            tg.showAlert('Link: ' + currentSmartLink);
        });
    } else {
        tg.showAlert('Link: ' + currentSmartLink);
    }
}

// ============================================
// CLIENT SEARCH
// ============================================

async function handleClientSearch(e) {
    const query = e.target.value.trim();
    const resultsContainer = document.getElementById('search-results');

    if (query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'search_clients',
                query: query,
                vat: operatorSession?.vat || URL_VAT || null
            })
        });

        const data = await response.json();
        displaySearchResults(data.clients || []);

    } catch (error) {
        console.error('Search error:', error);
        displaySearchResults(getDemoClients());
    }
}

function displaySearchResults(clients) {
    const container = document.getElementById('search-results');

    if (clients.length === 0) {
        container.innerHTML = '<p class="hint">Nessun cliente trovato</p>';
        return;
    }

    container.innerHTML = clients.map(client => `
        <div class="company-card" onclick="selectClient('${client.id}', '${client.name}')">
            <div class="company-avatar">${client.name.charAt(0)}</div>
            <div style="flex: 1;">
                <h4 style="margin: 0; font-size: 14px;">${client.name}</h4>
                <p style="font-size: 11px; color: var(--text-muted); margin: 2px 0 0 0;">
                    ${client.email || client.phone || ''}
                </p>
            </div>
            <i class="fas fa-chevron-right" style="color: var(--text-muted);"></i>
        </div>
    `).join('');
}

function selectClient(id, name) {
    selectedTarget = { id, name };
    selectedTargetType = 'person';
    showStep('mission-type');
}

// ============================================
// ASSET / INTERNAL
// ============================================

function scanAssetQR() {
    tg.showAlert('Scansione QR non disponibile in demo');
    setTimeout(() => {
        selectedTarget = { id: 'asset_123', name: 'Caldaia ABC', type: 'asset' };
        selectedTargetType = 'asset';
        showStep('photo');
    }, 1000);
}

function setInternalTarget() {
    selectedTarget = { id: 'internal', name: 'Azienda', type: 'internal' };
    selectedTargetType = 'internal';
    showStep('photo');
}

// ============================================
// MISSION TYPE SELECTION
// ============================================

function handleMissionTypeSelection(type) {
    if (type === 'preventivo') {
        tg.showAlert('Redirect a Catalogo...');
    } else if (type === 'esecuzione') {
        tg.showAlert('Redirect a Blueprint...');
    } else if (type === 'assistenza') {
        tg.showAlert('Redirect a Assistenza...');
    }
}

// ============================================
// PHOTO & REPORT
// ============================================

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        capturedPhoto = event.target.result;
        document.getElementById('preview-img').src = event.target.result;
        document.getElementById('photo-preview').classList.remove('hidden');
        document.getElementById('photo-upload').classList.add('hidden');
    };
    reader.readAsDataURL(file);
}

async function generateReport() {
    if (!capturedPhoto) {
        tg.showAlert('Nessuna foto caricata');
        return;
    }

    showLoading(true, 'Analisi AI in corso...');

    try {
        const userId = operatorSession?.chat_id || URL_CHAT_ID || tg.initDataUnsafe?.user?.id || 'demo_user';
        
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'generate_report',
                operator_id: userId,
                vat: operatorSession?.vat || URL_VAT || null,
                target: selectedTarget,
                photo: capturedPhoto,
                context: selectedTargetType
            })
        });

        if (!response.ok) throw new Error('Errore generazione report');

        const data = await response.json();
        tg.showAlert('Report generato con successo!');
        
        setTimeout(() => {
            navigateOperatorWithContext('operator_tasks.html');
        }, 1500);

    } catch (error) {
        console.error('Error generating report:', error);
        tg.showAlert('Errore nella generazione del report. Riprova.');
    } finally {
        showLoading(false);
    }
}

// ============================================
// NAVIGATION
// ============================================

function showStep(step) {
    document.querySelectorAll('.step-container').forEach(container => {
        container.classList.add('hidden');
    });

    const stepMap = {
        'target': 'step-target',
        'handshake': 'step-handshake',
        'search': 'step-search',
        'asset': 'step-asset',
        'mission-type': 'step-mission-type',
        'photo': 'step-photo'
    };

    const stepId = stepMap[step];
    if (stepId) {
        document.getElementById(stepId).classList.remove('hidden');
    }

    const indicators = {
        'target': 'Chi è il beneficiario?',
        'handshake': 'In attesa di connessione...',
        'search': 'Cerca il cliente',
        'asset': 'Scansiona o seleziona',
        'mission-type': 'Cosa vuoi fare?',
        'photo': 'Cattura il report'
    };

    document.getElementById('step-indicator').textContent = indicators[step] || '';
    currentStep = step;
}

function goBack() {
    const backSteps = {
        'handshake': 'target',
        'search': 'target',
        'asset': 'target',
        'mission-type': selectedTargetType === 'person' ? 'target' : 'asset',
        'photo': 'asset'
    };

    if (backSteps[currentStep]) {
        showStep(backSteps[currentStep]);
    } else {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            navigateOperatorWithContext('operator_tasks.html');
        }
    }
}

// ============================================
// UTILITIES
// ============================================

function showLoading(show, text = 'Elaborazione...') {
    const overlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loading-text');
    
    if (show) {
        loadingText.textContent = text;
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getDemoClients() {
    return [
        { id: '1', name: 'Mario Rossi', email: 'mario@example.com' },
        { id: '2', name: 'Anna Verdi', phone: '+393331234567' },
        { id: '3', name: 'Giuseppe Bianchi', email: 'giuseppe@example.com' }
    ];
}

// ============================================
// GLOBAL: Trigger custom event (called by webhook response or external script)
// ============================================

window.triggerCustomerConnected = function(customerData) {
    const event = new CustomEvent('customerConnected', {
        detail: { customer: customerData }
    });
    window.dispatchEvent(event);
    console.log('🔔 Triggered customerConnected event:', customerData);
};

window.triggerCustomerArrived = function(data) {
    const event = new CustomEvent('customerArrived', {
        detail: data
    });
    window.dispatchEvent(event);
    console.log('🔔 Triggered customerArrived event:', data);
};