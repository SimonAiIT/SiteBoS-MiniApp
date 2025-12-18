// ============================================
// OPERATOR TASK CREATE - LOGIC
// ✅ MANUAL VERIFY BUTTON - SINGLE CALL
// ✅ QUOTE BUILDER with CATALOG
// ✅ QUANTITY & PHOTOS
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
let quoteCart = []; // Cart for quote builder (with quantity)
let quotePhotos = []; // Array of base64 photos (max 5)

const urlParams = new URLSearchParams(window.location.search);
const URL_CHAT_ID = urlParams.get('chat_id');
const URL_VAT = urlParams.get('vat');

console.log('✅ Operator session:', { chat_id: URL_CHAT_ID, vat: URL_VAT });

// ============================================
// CUSTOM ALERT SYSTEM (Browser Compatible)
// ============================================
function showAlert(message, type = 'info', duration = 3000) {
    const existing = document.querySelector('.custom-alert');
    if (existing) existing.remove();
    
    const alert = document.createElement('div');
    alert.className = 'custom-alert';
    alert.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px);
        z-index: 10000; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px;
        padding: 15px 20px; min-width: 280px; max-width: 90%;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4); transition: transform 0.3s;
        display: flex; align-items: center; gap: 12px;
    `;
    
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const borderColors = { success: '#4cd964', error: '#ff6b6b', warning: '#f59e0b', info: '#32ade6' };
    alert.style.borderLeft = `4px solid ${borderColors[type] || borderColors.info}`;
    
    alert.innerHTML = `
        <span style="font-size: 20px;">${icons[type] || icons.info}</span>
        <span style="flex: 1; font-size: 14px; color: #fff; line-height: 1.4;">${message}</span>
    `;
    
    document.body.appendChild(alert);
    setTimeout(() => alert.style.transform = 'translateX(-50%) translateY(0)', 10);
    
    if (navigator.vibrate) navigator.vibrate(type === 'success' ? [50] : [100, 50, 100]);
    
    setTimeout(() => {
        alert.style.transform = 'translateX(-50%) translateY(-100px)';
        setTimeout(() => alert.remove(), 300);
    }, duration);
}

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

    const generateQuoteBtn = document.getElementById('generate-quote-btn');
    if (generateQuoteBtn) {
        generateQuoteBtn.addEventListener('click', generateQuote);
    }

    // Quote photo upload
    const quotePhotoInput = document.getElementById('quote-photo-input');
    if (quotePhotoInput) {
        quotePhotoInput.addEventListener('change', handleQuotePhotosUpload);
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
        showAlert('Errore nella creazione del link.', 'error');
    }
}

async function verifyHandshakeManual() {
    const inviteCode = sessionStorage.getItem('current_invite_code');
    const btn = document.getElementById('btn-verify');
    
    if (!inviteCode) {
        showAlert('Codice invito non trovato. Riprova.', 'warning');
        return;
    }
    
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Controllo in corso...';
    btn.disabled = true;

    try {
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
                console.log('✅ Customer ready:', data.customer);
                
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                } else if (navigator.vibrate) {
                    navigator.vibrate([200, 100, 200]);
                }
                
                handleCustomerReady(data.customer);
                
            } else {
                showAlert('Il cliente non ha ancora completato la procedura. Riprova tra poco.', 'warning');
            }
        } else {
            throw new Error('API Error');
        }
    } catch (error) {
        console.error('Verify error:', error);
        showAlert('Impossibile verificare. Controlla la connessione.', 'error');
    } finally {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }
}

function handleCustomerReady(customer) {
    console.log('✅ Customer ready:', customer);
    
    const normalizedCustomer = {
        ...customer,
        firstName: customer.firstName || customer.first_name || '',
        lastName: customer.lastName || customer.last_name || ''
    };
    
    selectedTarget = normalizedCustomer;
    selectedTargetType = 'person';
    
    const fullName = `${normalizedCustomer.firstName} ${normalizedCustomer.lastName}`.trim();
    
    showAlert(`✅ ${fullName} connesso!`, 'success');
    
    setTimeout(() => {
        showStep('mission-type');
    }, 1000);
}

function copySmartLink() {
    if (!currentSmartLink) {
        showAlert('Link non generato', 'warning');
        return;
    }
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(currentSmartLink).then(() => {
            showAlert('✅ Link copiato!', 'success');
        }).catch(() => {
            showAlert('Link: ' + currentSmartLink, 'info');
        });
    } else {
        showAlert('Link: ' + currentSmartLink, 'info');
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
    showAlert('Scansione QR non disponibile', 'info');
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
        showStep('quote-builder');
        loadCatalog();
    } else if (type === 'esecuzione') {
        showAlert('Redirect a Blueprint...', 'info');
    } else if (type === 'assistenza') {
        showAlert('Redirect a Assistenza...', 'info');
    }
}

// ============================================
// QUOTE BUILDER - CATALOG LOADING
// ============================================

async function loadCatalog() {
    const container = document.getElementById('catalog-container');
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'get_catalog',
                vat: operatorSession?.vat || URL_VAT
            })
        });

        if (!response.ok) throw new Error('Failed to load catalog');

        const data = await response.json();
        console.log('✅ Catalog response:', data);

        let categories = [];
        
        if (data.categories) {
            categories = data.categories;
        } else if (data.catalog && data.catalog.categories) {
            categories = data.catalog.categories;
        } else if (data.success && data.data && data.data.categories) {
            categories = data.data.categories;
        }

        if (!Array.isArray(categories) || categories.length === 0) {
            throw new Error('No categories found in response');
        }

        const filteredCategories = filterBlueprintReadyCategories(categories);

        if (filteredCategories.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
                    <p>Nessun servizio disponibile per preventivi</p>
                </div>
            `;
            return;
        }

        renderCatalogCategories(filteredCategories, container);

    } catch (error) {
        console.error('Catalog load error:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--error);">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
                <p>Errore nel caricamento del catalogo</p>
                <button class="btn btn-secondary btn-sm" onclick="loadCatalog()" style="margin-top: 15px;">
                    <i class="fas fa-redo"></i> Riprova
                </button>
            </div>
        `;
    }
}

function filterBlueprintReadyCategories(categories) {
    return categories.map(cat => ({
        ...cat,
        subcategories: (cat.subcategories || []).filter(sub => sub.blueprint_ready === true)
    })).filter(cat => cat.subcategories.length > 0);
}

function renderCatalogCategories(categories, container) {
    container.innerHTML = categories.map((category, catIndex) => `
        <div class="cat-card" id="cat-${catIndex}">
            <div class="cat-header" onclick="toggleCategory(${catIndex})">
                <div class="cat-title">
                    ${category.short_name || category.name}
                    <span class="cat-badge">${category.subcategories.length}</span>
                </div>
                <i class="fas fa-chevron-down chevron" id="chevron-${catIndex}"></i>
            </div>
            <div class="cat-body" id="cat-body-${catIndex}">
                ${category.subcategories.map(service => `
                    <div class="prod-item">
                        <div class="prod-info" style="flex: 1;">
                            <div class="prod-name">${service.short_name || service.name}</div>
                            <div class="prod-desc">${service.name}</div>
                        </div>
                        <button class="btn-add" onclick='addToCart(${JSON.stringify(service).replace(/'/g, "&#39;")})' title="Aggiungi al preventivo">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function toggleCategory(index) {
    const card = document.getElementById(`cat-${index}`);
    const body = document.getElementById(`cat-body-${index}`);
    const chevron = document.getElementById(`chevron-${index}`);
    
    card.classList.toggle('open');
    
    if (card.classList.contains('open')) {
        body.style.display = 'block';
        chevron.style.transform = 'rotate(180deg)';
    } else {
        body.style.display = 'none';
        chevron.style.transform = 'rotate(0deg)';
    }
}

// ============================================
// CART MANAGEMENT WITH QUANTITY
// ============================================

function addToCart(service) {
    // Each item has quantity property
    quoteCart.push({ ...service, quantity: 1 });
    updateCartUI();
    showAlert(`✅ ${service.short_name} aggiunto`, 'success', 2000);
    
    if (navigator.vibrate) navigator.vibrate(50);
}

function removeFromCart(index) {
    const removed = quoteCart.splice(index, 1)[0];
    updateCartUI();
    showAlert(`❌ ${removed.short_name} rimosso`, 'info', 2000);
}

function updateQuantity(index, delta) {
    const item = quoteCart[index];
    const newQty = item.quantity + delta;
    
    if (newQty < 1 || newQty > 99) return;
    
    item.quantity = newQty;
    updateCartUI();
}

function updateCartUI() {
    const cartSummary = document.getElementById('cart-summary');
    const cartCount = document.getElementById('cart-count');
    const cartItemsList = document.getElementById('cart-items-list');

    // Total items (sum of quantities)
    const totalItems = quoteCart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (quoteCart.length === 0) {
        cartSummary.style.display = 'none';
        return;
    }

    cartSummary.style.display = 'block';

    cartItemsList.innerHTML = quoteCart.map((item, index) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 8px;">
            <div style="flex: 1; padding-right: 10px;">
                <div style="font-size: 13px; font-weight: 600; color: #fff;">${item.short_name}</div>
                <div style="font-size: 11px; color: var(--text-muted);">${item.name}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <!-- Quantity Controls -->
                <div style="display: flex; align-items: center; gap: 5px; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 4px 8px;">
                    <button onclick="updateQuantity(${index}, -1)" class="btn-icon" style="width: 24px; height: 24px; font-size: 12px; padding: 0;">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span style="font-size: 14px; font-weight: 600; min-width: 24px; text-align: center;">${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)" class="btn-icon" style="width: 24px; height: 24px; font-size: 12px; padding: 0;">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <!-- Remove Button -->
                <button class="btn-icon del" onclick="removeFromCart(${index})" style="background: rgba(255,107,107,0.2); color: var(--error);">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Update photo slots
    updatePhotoSlotsUI();
}

function toggleCart() {
    const cartItems = document.getElementById('cart-items');
    const chevron = document.getElementById('cart-chevron');
    
    cartItems.classList.toggle('hidden');
    
    if (cartItems.classList.contains('hidden')) {
        chevron.className = 'fas fa-chevron-down';
    } else {
        chevron.className = 'fas fa-chevron-up';
    }
}

// ============================================
// PHOTO MANAGEMENT (MAX 5)
// ============================================

function handleQuotePhotosUpload(e) {
    const files = Array.from(e.target.files);
    
    if (quotePhotos.length >= 5) {
        showAlert('Massimo 5 foto', 'warning');
        e.target.value = '';
        return;
    }

    const availableSlots = 5 - quotePhotos.length;
    const filesToProcess = files.slice(0, availableSlots);

    filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            quotePhotos.push(event.target.result);
            updatePhotoSlotsUI();
            
            if (quotePhotos.length === 5) {
                showAlert('Limite massimo foto raggiunto', 'info');
            }
        };
        reader.readAsDataURL(file);
    });

    e.target.value = '';
}

function removeQuotePhoto(index) {
    quotePhotos.splice(index, 1);
    updatePhotoSlotsUI();
    showAlert('Foto rimossa', 'info', 1500);
}

function updatePhotoSlotsUI() {
    const container = document.getElementById('photo-slots-container');
    
    if (!container) return;

    container.innerHTML = '';

    // Show existing photos
    quotePhotos.forEach((photo, index) => {
        const slot = document.createElement('div');
        slot.style.cssText = `
            position: relative;
            aspect-ratio: 1;
            border-radius: 8px;
            overflow: hidden;
            border: 2px solid var(--primary);
            background: #000;
        `;
        slot.innerHTML = `
            <img src="${photo}" style="width: 100%; height: 100%; object-fit: cover;">
            <button onclick="removeQuotePhoto(${index})" style="
                position: absolute; top: 4px; right: 4px;
                width: 24px; height: 24px; border-radius: 50%;
                background: rgba(255,107,107,0.9); border: none;
                color: white; font-size: 12px; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
            ">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(slot);
    });

    // Show empty slots
    for (let i = quotePhotos.length; i < 5; i++) {
        const slot = document.createElement('div');
        slot.style.cssText = `
            aspect-ratio: 1;
            border-radius: 8px;
            border: 2px dashed rgba(255,255,255,0.2);
            background: rgba(255,255,255,0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
            font-size: 18px;
        `;
        slot.innerHTML = '<i class="fas fa-camera"></i>';
        container.appendChild(slot);
    }
}

// ============================================
// GENERATE QUOTE WITH PHOTOS & QUANTITY
// ============================================

async function generateQuote() {
    if (quoteCart.length === 0) {
        showAlert('Aggiungi almeno un servizio al preventivo', 'warning');
        return;
    }

    const notes = document.getElementById('quote-notes').value.trim();

    showLoading(true, 'Generazione preventivo...');

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'generate_quote',
                vat: operatorSession?.vat || URL_VAT,
                operator_id: operatorSession?.chat_id || URL_CHAT_ID,
                customer: selectedTarget,
                services: quoteCart,  // Now includes quantity
                notes: notes,
                photos: quotePhotos  // Base64 array
            })
        });

        if (!response.ok) throw new Error('Quote generation failed');

        const data = await response.json();
        console.log('✅ Quote generated:', data);

        showAlert('✅ Preventivo generato con successo!', 'success');

        setTimeout(() => {
            navigateOperatorWithContext('operator_tasks.html');
        }, 1500);

    } catch (error) {
        console.error('Quote error:', error);
        showAlert('Errore nella generazione del preventivo', 'error');
    } finally {
        showLoading(false);
    }
}

// ============================================
// PHOTO & REPORT (ASSET)
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
        showAlert('Nessuna foto', 'warning');
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

        showAlert('Report generato!', 'success');
        
        setTimeout(() => {
            navigateOperatorWithContext('operator_tasks.html');
        }, 1500);

    } catch (error) {
        console.error('Error:', error);
        showAlert('Errore generazione report.', 'error');
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
        'quote-builder': 'step-quote-builder',
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
        'quote-builder': 'Crea preventivo',
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
        'quote-builder': 'mission-type',
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