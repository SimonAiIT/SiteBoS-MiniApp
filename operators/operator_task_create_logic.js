// ============================================
// OPERATOR TASK CREATE - LOGIC
// ✅ MANUAL VERIFY BUTTON - SINGLE CALL
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

const urlParams = new URLSearchParams(window.location.search);
const URL_CHAT_ID = urlParams.get('chat_id');
const URL_VAT = urlParams.get('vat');

console.log('✅ Operator session:', { chat_id: URL_CHAT_ID, vat: URL_VAT });

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    operatorSession = initOperatorSession();
    
    if (!operatorSession || !operatorSession.chat_id || !operatorSession.vat) {
        operatorSession = {
            chat_id: URL_CHAT_ID || tg.initDataUnsafe?.user?.id?.toString() || 'demo_operator',
            vat: URL_VAT || 'DEMO_VAT'
        };
        persistOperatorSession(operatorSession);
    }
    
    setupEventListeners();
    showStep('target');
});

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

    const verifyBtn = document.getElementById('btn-verify');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', verifyHandshakeManual);
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
// HANDSHAKE FLOW - MANUAL VERIFY
// ============================================

function generateInviteToken() {
    const vatId = operatorSession?.vat || URL_VAT || 'DEMO_VAT';
    const operatorId = operatorSession?.chat_id || URL_CHAT_ID || tg.initDataUnsafe?.user?.id?.toString() || 'demo_operator';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    
    const token = `${vatId}_${operatorId}_${timestamp}_${randomStr}`;
    console.log('✅ TOKEN:', token);
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
        
        // Store invite code in sessionStorage
        sessionStorage.setItem('current_invite_code', inviteToken);
        
        console.log('✅ Smart Link:', smartLink);
        console.log('⏳ Waiting for manual verification...');
        
        const linkDisplay = document.getElementById('smart-link-display');
        if (linkDisplay) {
            linkDisplay.textContent = smartLink.replace('https://', '');
        }

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
        }

    } catch (error) {
        console.error('Error:', error);
        tg.showAlert('Errore nella creazione del link.');
    }
}

// 🔔 MANUAL VERIFY FUNCTION - SINGLE CALL
async function verifyHandshakeManual() {
    const inviteCode = sessionStorage.getItem('current_invite_code');
    const btn = document.getElementById('btn-verify');
    
    if (!inviteCode) {
        tg.showAlert('Codice invito non trovato. Riprova.');
        return;
    }
    
    // 1. Loading State
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Controllo in corso...';
    btn.disabled = true;

    try {
        // 2. Single API Call
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'check_customer',
                session_id: inviteCode
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.ready && data.customer) {
                // SUCCESS: Customer data found!
                console.log('✅ Customer ready:', data.customer);
                
                // Haptic Feedback
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                } else if (navigator.vibrate) {
                    navigator.vibrate([200, 100, 200]);
                }
                
                // Show success and proceed
                handleCustomerReady(data.customer);
                
            } else {
                // WAITING: Data not ready yet
                tg.showAlert('Il cliente non ha ancora completato la procedura. Riprova tra poco.');
            }
        } else {
            throw new Error('API Error');
        }
    } catch (error) {
        console.error('Verify error:', error);
        tg.showAlert('Impossibile verificare. Controlla la connessione.');
    } finally {
        // 3. Reset Button
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }
}

function handleCustomerReady(customer) {
    console.log('✅ Customer ready:', customer);
    
    selectedTarget = customer;
    selectedTargetType = 'person';
    
    const fullName = `${customer.firstName} ${customer.lastName || ''}`.trim();
    
    tg.showAlert(`✅ ${fullName} connesso!`);
    
    // Auto-proceed to mission type
    setTimeout(() => {
        showStep('mission-type');
    }, 1000);
}

function copySmartLink() {
    if (!currentSmartLink) {
        tg.showAlert('Link non generato');
        return;
    }
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(currentSmartLink).then(() => {
            tg.showAlert('✅ Link copiato!');
        }).catch(() => {
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
    tg.showAlert('Scansione QR non disponibile');
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
        tg.showAlert('Nessuna foto');
        return;
    }

    showLoading(true, 'Analisi AI...');

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

        if (!response.ok) throw new Error('Errore');

        tg.showAlert('Report generato!');
        
        setTimeout(() => {
            navigateOperatorWithContext('operator_tasks.html');
        }, 1500);

    } catch (error) {
        console.error('Error:', error);
        tg.showAlert('Errore generazione report.');
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
        'handshake': 'In attesa cliente...',
        'search': 'Cerca cliente',
        'asset': 'Scansiona',
        'mission-type': 'Cosa vuoi fare?',
        'photo': 'Cattura report'
    };

    document.getElementById('step-indicator').textContent = indicators[step] || '';
    currentStep = step;
}

function goBack() {
    const backSteps = {
        'handshake': 'target',
        'search': 'target',
        'asset': 'target',
        'mission-type': 'target',
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
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

function getDemoClients() {
    return [
        { id: '1', name: 'Mario Rossi', email: 'mario@example.com' },
        { id: '2', name: 'Anna Verdi', phone: '+393331234567' }
    ];
}