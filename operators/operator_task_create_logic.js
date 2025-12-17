// ============================================
// OPERATOR TASK CREATE - LOGIC
// ============================================

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const WEBHOOK_URL = 'https://trinai.api.workflow.dcmake.it/webhook/d253f855-ce1a-43ee-81aa-38fa11a9d639';
const BASE_URL = 'https://simonaiit.github.io/SiteBoS-MiniApp';

let selectedTarget = null;
let selectedTargetType = null; // 'person', 'asset', 'internal'
let currentStep = 'target';
let capturedPhoto = null;
let currentSmartLink = null;
let currentSessionId = null;

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    showStep('target');
});

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Target Selection
    document.querySelectorAll('.target-option').forEach(option => {
        option.addEventListener('click', () => {
            const type = option.dataset.option;
            handleTargetSelection(type);
        });
    });

    // Handshake Copy Link
    const copyLinkBtn = document.getElementById('copy-link-btn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', copySmartLink);
    }

    // Proceed with connected client
    const proceedBtn = document.getElementById('proceed-with-client');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', () => {
            showStep('mission-type');
        });
    }

    // Client Search
    const searchInput = document.getElementById('client-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleClientSearch, 300));
    }

    // Asset Buttons
    const scanAssetBtn = document.getElementById('scan-asset-btn');
    if (scanAssetBtn) {
        scanAssetBtn.addEventListener('click', scanAssetQR);
    }

    const setInternalBtn = document.getElementById('set-internal-btn');
    if (setInternalBtn) {
        setInternalBtn.addEventListener('click', setInternalTarget);
    }

    // Mission Type Selection
    document.querySelectorAll('.mission-option').forEach(option => {
        option.addEventListener('click', () => {
            const type = option.dataset.type;
            handleMissionTypeSelection(type);
        });
    });

    // Photo Upload
    const photoInput = document.getElementById('photo-input');
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoUpload);
    }

    // Generate Report
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
// HANDSHAKE FLOW - FIXED VERSION
// ============================================

function generateInviteToken() {
    // Retrieve operator data from sessionStorage
    const companyData = JSON.parse(sessionStorage.getItem('companyData') || '{}');
    const vatId = companyData.vat_id || 'DEMO_VAT';
    const operatorId = tg.initDataUnsafe?.user?.id || 'demo_operator';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    
    // Generate unique token: VAT_ID + OP_ID + TIMESTAMP + RANDOM
    const token = `${vatId}_${operatorId}_${timestamp}_${randomStr}`;
    return token;
}

function buildSmartLink(token) {
    // Build proper web URL (not Telegram deep link)
    return `${BASE_URL}/customer/securehandshake.html?invite=${token}`;
}

async function initHandshake() {
    try {
        // Generate unique token and URL
        const inviteToken = generateInviteToken();
        const smartLink = buildSmartLink(inviteToken);
        currentSmartLink = smartLink;
        currentSessionId = inviteToken;
        
        // Display Smart Link in UI
        const linkDisplay = document.getElementById('smart-link-display');
        if (linkDisplay) {
            linkDisplay.textContent = smartLink.replace('https://', '');
        }

        // Generate QR Code using qrcode.js library (client-side)
        const qrContainer = document.getElementById('qr-code');
        qrContainer.innerHTML = ''; // Clear previous content
        
        // Check if QRCode library is loaded
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
            // Fallback: display text if library not loaded
            qrContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; font-size: 11px; color: var(--text-muted); word-break: break-all;">
                    <i class="fas fa-qrcode" style="font-size: 60px; margin-bottom: 10px; opacity: 0.3;"></i>
                    <p>Libreria QR non caricata</p>
                    <p style="margin-top: 10px;">${smartLink}</p>
                </div>
            `;
        }

        // Notify webhook (optional - for analytics or session tracking)
        try {
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create_handshake',
                    operator_id: tg.initDataUnsafe?.user?.id || 'demo_user',
                    session_id: inviteToken,
                    smart_link: smartLink
                })
            });
        } catch (webhookError) {
            console.warn('Webhook notification failed (non-critical):', webhookError);
        }

        // Start polling for connection
        pollHandshakeStatus(inviteToken);

    } catch (error) {
        console.error('Error initializing handshake:', error);
        tg.showAlert('Errore nella creazione del link. Riprova.');
    }
}

async function pollHandshakeStatus(sessionId) {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes (5s interval)

    const interval = setInterval(async () => {
        attempts++;

        if (attempts > maxAttempts) {
            clearInterval(interval);
            tg.showAlert('Timeout: nessun cliente connesso');
            return;
        }

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'check_handshake',
                    session_id: sessionId
                })
            });

            const data = await response.json();

            if (data.connected) {
                clearInterval(interval);
                handleClientConnected(data.client);
            }
        } catch (error) {
            console.error('Polling error:', error);
        }
    }, 5000); // Poll every 5 seconds
}

function handleClientConnected(client) {
    // Vibrate phone
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
    }

    // Hide radar, show connected state
    document.getElementById('radar-animation').classList.add('hidden');
    document.getElementById('qr-container').classList.add('hidden');
    document.getElementById('connected-state').classList.remove('hidden');
    
    document.getElementById('connected-name').textContent = client.name || 'Cliente Connesso';
    
    selectedTarget = client;
    selectedTargetType = 'person';

    tg.showAlert(`✅ Connesso: ${client.name}`);
}

function copySmartLink() {
    if (!currentSmartLink) {
        tg.showAlert('Link non ancora generato');
        return;
    }
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(currentSmartLink).then(() => {
            tg.showAlert('✅ Link copiato! Invialo al cliente su WhatsApp.');
        }).catch(err => {
            console.error('Copy failed:', err);
            tg.showAlert('Link: ' + currentSmartLink);
        });
    } else {
        // Fallback for older browsers
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
                query: query
            })
        });

        const data = await response.json();
        displaySearchResults(data.clients || []);

    } catch (error) {
        console.error('Search error:', error);
        // Show demo results
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
    // In production, open camera to scan QR
    // For demo, simulate scan
    tg.showAlert('Scansione QR non disponibile in demo');
    
    // Simulate successful scan
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
    // Redirect to appropriate page based on type
    if (type === 'preventivo') {
        // TODO: Redirect to catalog page
        tg.showAlert('Redirect a Catalogo...');
        // window.location.href = '../catalog/catalog_manager.html';
    } else if (type === 'esecuzione') {
        // TODO: Redirect to blueprint page
        tg.showAlert('Redirect a Blueprint...');
        // window.location.href = '../blueprint/blueprint_list.html';
    } else if (type === 'assistenza') {
        // TODO: Redirect to assistance/ticket page
        tg.showAlert('Redirect a Assistenza...');
    }
}

// ============================================
// PHOTO CAPTURE & REPORT GENERATION
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
        const userId = tg.initDataUnsafe?.user?.id || 'demo_user';
        
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'generate_report',
                operator_id: userId,
                target: selectedTarget,
                photo: capturedPhoto,
                context: selectedTargetType
            })
        });

        if (!response.ok) throw new Error('Errore generazione report');

        const data = await response.json();

        // Download or send report
        tg.showAlert('Report generato con successo!');
        
        // Redirect back to task list
        setTimeout(() => {
            window.location.href = 'operator_tasks.html';
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
    // Hide all steps
    document.querySelectorAll('.step-container').forEach(container => {
        container.classList.add('hidden');
    });

    // Show selected step
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

    // Update indicator
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
    // Simple back navigation
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
            window.location.href = 'operator_tasks.html';
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