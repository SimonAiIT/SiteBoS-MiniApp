// ============================================
// SECURE HANDSHAKE LOGIC
// Multi-Provider OAuth: Telegram + Google + Dynamic Scopes
// ============================================

const WEBHOOK_URL = 'https://trinai.api.workflow.dcmake.it/webhook/9d094742-eaca-41e1-b4e9-ee0627ffa285';
const GOOGLE_CLIENT_ID = '42649227972-hi1luhqh2t43bfsblmpunr108v6rtsoi.apps.googleusercontent.com';

let inviteToken = null;
let decodedToken = null;
let vatNumber = null;
let isOperatorMode = false;
let gdprConsent = false;

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.group('🔑 SECURE HANDSHAKE - INIT');
    console.log('URL:', window.location.href);
    
    const urlParams = new URLSearchParams(window.location.search);
    inviteToken = urlParams.get('invite');
    vatNumber = urlParams.get('vat');
    
    console.log('Invite Token:', inviteToken);
    console.log('VAT Number:', vatNumber);
    
    // MODO 1: Con ?invite (Operatore presente)
    if (inviteToken) {
        isOperatorMode = true;
        decodedToken = decodeInviteToken(inviteToken);
        
        if (!decodedToken) {
            showError('Token corrotto. Richiedi un nuovo link.');
            console.groupEnd();
            return;
        }
        
        vatNumber = decodedToken.vatId;
        console.log('Mode: OPERATOR (from invite token)');
        console.log('Decoded Token:', decodedToken);
        displayOperatorInfo(vatNumber);
    }
    // MODO 2: Con ?vat (Self-service con VAT)
    else if (vatNumber) {
        isOperatorMode = false;
        console.log('Mode: SELF-SERVICE (with VAT)');
        displayVatInfo(vatNumber);
    }
    // MODO 3: Nessun parametro (Self-service generico)
    else {
        isOperatorMode = false;
        console.log('Mode: SELF-SERVICE (generic)');
        displaySelfServiceMode();
    }
    
    console.groupEnd();
    
    // Wait for Google GIS to load, then initialize
    waitForGoogleAndInit();
});

// ============================================
// GOOGLE GIS LOADING HELPER
// ============================================

function waitForGoogleAndInit() {
    let attempts = 0;
    const maxAttempts = 20;
    
    const checkGoogle = setInterval(() => {
        attempts++;
        
        if (typeof google !== 'undefined' && google.accounts) {
            clearInterval(checkGoogle);
            console.log('✅ Google GIS loaded');
            initGoogleOAuth();
        } else if (attempts >= maxAttempts) {
            clearInterval(checkGoogle);
            console.error('❌ Google GIS failed to load after 5 seconds');
            showGoogleLoadError();
        }
    }, 250);
}

function showGoogleLoadError() {
    const target = document.getElementById('google-button-target');
    if (target) {
        target.innerHTML = `
            <div style="color: #d32f2f; font-size: 12px; text-align: center;">
                <i class="fas fa-exclamation-triangle"></i>
                Impossibile caricare Google Sign-In
            </div>
        `;
    }
}

// ============================================
// GDPR CHECKBOX HANDLER
// ============================================

function toggleGDPR(checked) {
    gdprConsent = checked;
    updateOAuthButtonsState();
}

function updateOAuthButtonsState() {
    const telegramContainer = document.getElementById('telegram-container');
    const googleContainer = document.getElementById('google-container');
    
    if (gdprConsent) {
        telegramContainer.classList.remove('disabled');
        googleContainer.classList.remove('disabled');
        document.getElementById('gdpr-consent-box').classList.remove('error');
    } else {
        telegramContainer.classList.add('disabled');
        googleContainer.classList.add('disabled');
    }
}

function validateGDPR() {
    if (!gdprConsent) {
        const box = document.getElementById('gdpr-consent-box');
        box.classList.add('error');
        setTimeout(() => box.classList.remove('error'), 500);
        alert('Devi accettare la Privacy Policy e i Termini di Servizio per continuare.');
        return false;
    }
    return true;
}

// ============================================
// GOOGLE OAUTH INITIALIZATION
// ============================================

function initGoogleOAuth() {
    if (typeof google === 'undefined' || !google.accounts) {
        console.warn('⚠️ Google Identity Services not available');
        showGoogleLoadError();
        return;
    }
    
    try {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true
        });
        
        const target = document.getElementById('google-button-target');
        if (!target) {
            console.error('❌ google-button-target not found in DOM');
            return;
        }
        
        target.innerHTML = '';
        
        google.accounts.id.renderButton(
            target,
            {
                theme: 'outline',
                size: 'large',
                width: 352,
                text: 'continue_with',
                shape: 'rectangular',
                logo_alignment: 'left'
            }
        );
        
        console.log('✅ Google OAuth initialized and button rendered');
        
    } catch (error) {
        console.error('Google OAuth init error:', error);
        showGoogleLoadError();
    }
}

// ============================================
// GOOGLE OAUTH CALLBACK
// ============================================

function handleGoogleResponse(response) {
    if (!validateGDPR()) return;
    
    console.group('✅ GOOGLE OAUTH - CREDENTIAL RECEIVED');
    console.log('Raw Google Response:', response);
    
    try {
        const payload = decodeJwtResponse(response.credential);
        
        console.log('Decoded Google Profile:', payload);
        console.groupEnd();
        
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
        
        const userIdentity = {
            firstName: payload.given_name || payload.name.split(' ')[0],
            lastName: payload.family_name || payload.name.split(' ').slice(1).join(' '),
            userId: payload.sub,
            username: null,
            photoUrl: payload.picture || null,
            provider: 'google',
            email: payload.email,
            phone: null,
            address: null,
            emailVerified: payload.email_verified,
            locale: payload.locale
        };
        
        console.log('✅ Extracted Identity:', userIdentity);
        
        // STEP 1: Check if customer exists in DB
        checkCustomerExists(userIdentity);
        
    } catch (error) {
        console.error('Google response processing error:', error);
        alert('Errore durante l\'autenticazione Google. Riprova.');
    }
}

function decodeJwtResponse(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('JWT decode error:', error);
        throw error;
    }
}

// ============================================
// TELEGRAM OAUTH CALLBACK
// ============================================

window.onTelegramAuth = function(user) {
    if (!validateGDPR()) return;
    
    console.group('✅ TELEGRAM OAUTH - REAL DATA RECEIVED');
    console.log('Raw Telegram User:', user);
    console.groupEnd();
    
    if (navigator.vibrate) {
        navigator.vibrate(100);
    }
    
    const userIdentity = {
        firstName: user.first_name,
        lastName: user.last_name || '',
        userId: user.id.toString(),
        username: user.username || null,
        photoUrl: user.photo_url || null,
        provider: 'telegram',
        email: null,  // Telegram doesn't provide email
        phone: null,
        authDate: user.auth_date,
        hash: user.hash
    };
    
    console.log('✅ Extracted Identity:', userIdentity);
    
    // STEP 1: Check if customer exists in DB
    checkCustomerExists(userIdentity);
};

// ============================================
// STEP 1: CHECK CUSTOMER EXISTS (customer_connected)
// ============================================

async function checkCustomerExists(userIdentity) {
    console.log('🔍 STEP 1: Checking if customer exists in DB...');
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'customer_connected',
                provider: userIdentity.provider,
                user_id: userIdentity.userId,
                email: userIdentity.email,
                first_name: userIdentity.firstName,
                last_name: userIdentity.lastName,
                username: userIdentity.username,
                photo_url: userIdentity.photoUrl,
                linked_operator_id: decodedToken?.operatorId || null,
                linked_vat_id: vatNumber || null,
                invite_token: decodedToken?.fullToken || null,
                mode: isOperatorMode ? 'operator' : 'self-service',
                gdpr_consent: gdprConsent,
                telegram_auth_date: userIdentity.authDate,
                telegram_hash: userIdentity.hash,
                email_verified: userIdentity.emailVerified,
                locale: userIdentity.locale
            })
        });
        
        if (!response.ok) {
            throw new Error('Webhook failed: ' + response.status);
        }
        
        const result = await response.json();
        console.log('✅ Webhook Response:', result);
        
        // Check if we need to collect more data
        if (result.status === 'needs_completion' && result.missing && result.missing.length > 0) {
            console.log('⚠️ Missing data:', result.missing);
            userIdentity.existingData = result.existing_data || {};
            showDataCompletionForm(userIdentity, result.missing);
        } else {
            console.log('✅ Customer complete, redirecting to dashboard...');
            finishAuthentication(userIdentity, result.existing_data || {});
        }
        
    } catch (error) {
        console.error('❌ customer_connected webhook failed:', error);
        // Fallback: assume we need all data (including email for Telegram)
        const defaultMissing = userIdentity.provider === 'telegram' 
            ? ['email', 'phone', 'address']
            : ['phone', 'address'];
        showDataCompletionForm(userIdentity, defaultMissing);
    }
}

// ============================================
// STEP 2: DATA COMPLETION FORM
// ============================================

function showDataCompletionForm(userIdentity, missingFields) {
    console.log('📝 STEP 2: Showing data completion form');
    console.log('Missing fields:', missingFields);
    
    const container = document.querySelector('.entry-card');
    
    const fieldsHTML = [];
    
    // Email field (for Telegram users)
    if (missingFields.includes('email')) {
        fieldsHTML.push(`
            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; text-align: left; margin-bottom: 5px; font-size: 13px; color: var(--text-muted); font-weight: 600;">
                    ✉️ Email *
                </label>
                <input type="email" id="input-email" placeholder="mario.rossi@esempio.it" 
                       value="${userIdentity.existingData?.email || ''}" required
                       style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--glass-border); background: var(--glass); color: var(--text-main); font-size: 14px;">
            </div>
        `);
    }
    
    // Phone field
    if (missingFields.includes('phone')) {
        fieldsHTML.push(`
            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; text-align: left; margin-bottom: 5px; font-size: 13px; color: var(--text-muted); font-weight: 600;">
                    📱 Numero di Telefono *
                </label>
                <input type="tel" id="input-phone" placeholder="+39 123 456 7890" 
                       value="${userIdentity.existingData?.phone || ''}" required
                       style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--glass-border); background: var(--glass); color: var(--text-main); font-size: 14px;">
            </div>
        `);
    }
    
    // Address fields - Layout: Street → City → ZIP + Province
    if (missingFields.includes('address')) {
        const existingAddress = userIdentity.existingData?.address || {};
        
        fieldsHTML.push(`
            <div style="margin-bottom: 20px;">
                <label style="display: block; text-align: left; margin-bottom: 10px; font-size: 14px; color: var(--text-muted); font-weight: 600;">
                    📍 Indirizzo Completo
                </label>
                
                <!-- Street (full width) -->
                <div class="form-group" style="margin-bottom: 10px;">
                    <input type="text" id="input-street" placeholder="Via Roma 123" 
                           value="${existingAddress.street || ''}" required
                           style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--glass-border); background: var(--glass); color: var(--text-main); font-size: 14px;">
                </div>
                
                <!-- City (full width) -->
                <div class="form-group" style="margin-bottom: 10px;">
                    <input type="text" id="input-city" placeholder="Milano" 
                           value="${existingAddress.city || ''}" required
                           style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--glass-border); background: var(--glass); color: var(--text-main); font-size: 14px;">
                </div>
                
                <!-- ZIP + Province (side by side) -->
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="input-zip" placeholder="20100" 
                           value="${existingAddress.zip || ''}" required maxlength="5" pattern="[0-9]{5}"
                           style="flex: 1; padding: 12px; border-radius: 8px; border: 1px solid var(--glass-border); background: var(--glass); color: var(--text-main); font-size: 14px;">
                    <input type="text" id="input-province" placeholder="Provincia (es. MI)" 
                           value="${existingAddress.province || ''}" required maxlength="2" pattern="[A-Z]{2}"
                           style="flex: 1; padding: 12px; border-radius: 8px; border: 1px solid var(--glass-border); background: var(--glass); color: var(--text-main); font-size: 14px; text-transform: uppercase;">
                </div>
            </div>
        `);
    }
    
    container.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 15px;">
            ✅
        </div>
        <h2 style="margin-bottom: 10px; color: var(--success);">Autenticazione Riuscita!</h2>
        <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 25px;">
            Completa la registrazione con i dati necessari:
        </p>
        
        <form id="completion-form" style="text-align: left;">
            ${fieldsHTML.join('')}
            
            <button type="submit" class="btn btn-primary btn-block" style="margin-top: 20px; width: 100%;">
                Completa Registrazione
            </button>
        </form>
    `;
    
    // Attach form submit handler
    document.getElementById('completion-form').addEventListener('submit', (e) => {
        e.preventDefault();
        submitDataCompletion(userIdentity, missingFields);
    });
    
    // Auto-uppercase province
    const provinceInput = document.getElementById('input-province');
    if (provinceInput) {
        provinceInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });
    }
    
    window.tempUserIdentity = userIdentity;
}

// ============================================
// STEP 3: SUBMIT COMPLETION DATA (customer_complete)
// ============================================

async function submitDataCompletion(userIdentity, missingFields) {
    console.log('💾 STEP 3: Submitting completion data...');
    
    const completionData = {};
    
    // Collect email (for Telegram users)
    if (missingFields.includes('email')) {
        const email = document.getElementById('input-email')?.value.trim();
        if (!email) {
            alert('Inserisci un indirizzo email valido.');
            return;
        }
        // Basic email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Email non valida.');
            return;
        }
        completionData.email = email;
    }
    
    // Collect phone
    if (missingFields.includes('phone')) {
        const phone = document.getElementById('input-phone')?.value.trim();
        if (!phone) {
            alert('Inserisci un numero di telefono valido.');
            return;
        }
        completionData.phone = phone;
    }
    
    // Collect address
    if (missingFields.includes('address')) {
        const street = document.getElementById('input-street')?.value.trim();
        const city = document.getElementById('input-city')?.value.trim();
        const zip = document.getElementById('input-zip')?.value.trim();
        const province = document.getElementById('input-province')?.value.trim().toUpperCase();
        
        if (!street || !city || !zip || !province) {
            alert('Compila tutti i campi dell\'indirizzo.');
            return;
        }
        
        if (!/^[0-9]{5}$/.test(zip)) {
            alert('CAP non valido. Deve essere un numero di 5 cifre.');
            return;
        }
        
        if (!/^[A-Z]{2}$/.test(province)) {
            alert('Provincia non valida. Usa 2 lettere maiuscole (es. MI).');
            return;
        }
        
        completionData.address = {
            street: street,
            city: city,
            zip: zip,
            province: province
        };
    }
    
    console.log('📤 Sending customer_complete:', completionData);
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'customer_complete',
                provider: userIdentity.provider,
                user_id: userIdentity.userId,
                ...completionData
            })
        });
        
        if (!response.ok) {
            throw new Error('customer_complete webhook failed: ' + response.status);
        }
        
        const result = await response.json();
        console.log('✅ customer_complete response:', result);
        
        // Merge completion data into userIdentity
        Object.assign(userIdentity, completionData);
        
        finishAuthentication(userIdentity, result.data || {});
        
    } catch (error) {
        console.error('❌ customer_complete failed:', error);
        alert('Errore durante il salvataggio dei dati. Riprova.');
    }
}

// ============================================
// FINAL STEP: REDIRECT TO DASHBOARD
// ============================================

function finishAuthentication(userIdentity, serverData) {
    console.log('🎯 FINAL STEP: Completing authentication...');
    
    const customerSession = {
        firstName: userIdentity.firstName,
        lastName: userIdentity.lastName,
        userId: userIdentity.userId,
        username: userIdentity.username,
        photoUrl: userIdentity.photoUrl,
        provider: userIdentity.provider,
        email: userIdentity.email || serverData.email,
        phone: userIdentity.phone || serverData.phone,
        address: userIdentity.address || serverData.address,
        linkedOperatorId: decodedToken?.operatorId || null,
        linkedVatId: vatNumber || null,
        inviteToken: decodedToken?.fullToken || null,
        connectedAt: new Date().toISOString(),
        gdprConsent: gdprConsent,
        mode: isOperatorMode ? 'operator' : 'self-service'
    };
    
    console.log('💾 Persisting customer session:', customerSession);
    sessionStorage.setItem('customer_session', JSON.stringify(customerSession));
    
    showSuccessFeedback(userIdentity);
    
    setTimeout(() => {
        redirectToDashboard();
    }, 1500);
}

// ============================================
// TOKEN DECODING
// ============================================

function decodeInviteToken(token) {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('_');
    if (parts.length < 4) return null;
    
    return {
        vatId: parts[0],
        operatorId: parts[1],
        timestamp: parseInt(parts[2]),
        randomStr: parts[3],
        fullToken: token
    };
}

// ============================================
// UI UPDATES
// ============================================

function displayOperatorInfo(vat) {
    const operatorNameEl = document.getElementById('operator-name');
    if (operatorNameEl) {
        operatorNameEl.innerHTML = `
            <i class="fas fa-building"></i>
            <span>${vat}</span>
        `;
    }
}

function displayVatInfo(vat) {
    const operatorInfoEl = document.getElementById('operator-info');
    if (operatorInfoEl) {
        operatorInfoEl.innerHTML = `
            <i class="fas fa-building"></i>
            <span>${vat}</span>
        `;
    }
}

function displaySelfServiceMode() {
    const operatorInfoEl = document.getElementById('operator-info');
    if (operatorInfoEl) {
        operatorInfoEl.innerHTML = `
            <i class="fas fa-globe"></i>
            <span>Registrazione Self-Service</span>
        `;
    }
}

function showError(message) {
    const container = document.querySelector('.entry-card');
    if (container) {
        container.innerHTML = `
            <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
            <h1 style="margin-bottom: 10px;">Errore</h1>
            <p style="color: var(--text-muted);">${message}</p>
        `;
    }
}

function showSuccessFeedback(userIdentity) {
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
    
    const displayName = userIdentity.firstName + (userIdentity.lastName ? ' ' + userIdentity.lastName : '');
    const providerIcon = userIdentity.provider === 'telegram' ? '📤' : userIdentity.provider === 'google' ? '🌐' : '🔑';
    
    const container = document.querySelector('.entry-card');
    if (container) {
        container.innerHTML = `
            <div style="font-size: 64px; margin-bottom: 20px;">✅</div>
            <h1 style="margin-bottom: 10px; color: var(--success);">Connesso!</h1>
            
            ${userIdentity.photoUrl ? `
                <img src="${userIdentity.photoUrl}" 
                     style="width: 80px; height: 80px; border-radius: 50%; margin: 15px auto; border: 3px solid var(--success);" 
                     alt="${displayName}">
            ` : ''}
            
            <p style="font-size: 18px; font-weight: 600; margin-bottom: 5px;">${displayName}</p>
            
            ${userIdentity.username ? `<p style="color: var(--text-muted); font-size: 14px; margin-bottom: 5px;">@${userIdentity.username}</p>` : ''}
            ${userIdentity.email ? `<p style="color: var(--text-muted); font-size: 14px; margin-bottom: 5px;">${userIdentity.email}</p>` : ''}
            
            <p style="color: var(--text-muted); font-size: 13px; margin-top: 10px;">
                ${providerIcon} Autenticato con ${userIdentity.provider.charAt(0).toUpperCase() + userIdentity.provider.slice(1)}
            </p>
            
            <p style="color: var(--text-muted); font-size: 14px; margin-top: 20px;">Reindirizzamento alla dashboard...</p>
            
            <div class="spinner-ring" style="margin: 30px auto;"></div>
        `;
    }
}

function redirectToDashboard() {
    const session = JSON.parse(sessionStorage.getItem('customer_session'));
    
    if (!session) {
        console.error('Session lost during redirect!');
        window.location.href = 'securehandshake.html' + (inviteToken ? '?invite=' + inviteToken : '');
        return;
    }
    
    const dashboardUrl = session.inviteToken 
        ? `customer_dashboard.html?invite=${session.inviteToken}`
        : 'customer_dashboard.html';
    
    console.log('🚀 Redirecting to:', dashboardUrl);
    window.location.href = dashboardUrl;
}

function debugSession() {
    console.group('🔍 Session Debug');
    console.log('Token:', inviteToken);
    console.log('VAT:', vatNumber);
    console.log('Decoded:', decodedToken);
    console.log('Mode:', isOperatorMode ? 'OPERATOR' : 'SELF-SERVICE');
    console.log('GDPR Consent:', gdprConsent);
    console.log('Stored Session:', sessionStorage.getItem('customer_session'));
    console.groupEnd();
}

window.debugSession = debugSession;