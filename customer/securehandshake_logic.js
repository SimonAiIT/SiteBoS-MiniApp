// ============================================
// SECURE HANDSHAKE LOGIC
// Multi-Provider OAuth: Telegram + Google + Dynamic Scopes
// ============================================

const WEBHOOK_URL = 'https://trinai.api.workflow.dcmake.it/webhook/9d094742-eaca-41e1-b4e9-ee0627ffa285';
const GOOGLE_CLIENT_ID = '42649227972-hi1luhqh2t43bfsblmpunr108v6rtsoi.apps.googleusercontent.com';

let inviteToken = null;
let decodedToken = null;
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
    
    console.log('Invite Token:', inviteToken);
    
    isOperatorMode = !!inviteToken;
    console.log('Mode:', isOperatorMode ? 'OPERATOR (full scopes)' : 'SELF-SERVICE (base scopes)');
    
    if (!inviteToken) {
        console.log('⚠️ No invite token - Self-service registration');
        displaySelfServiceMode();
    } else {
        decodedToken = decodeInviteToken(inviteToken);
        
        if (!decodedToken) {
            showError('Token corrotto. Richiedi un nuovo link.');
            console.groupEnd();
            return;
        }
        
        console.log('Decoded Token:', decodedToken);
        displayOperatorInfo(decodedToken);
    }
    
    console.groupEnd();
    
    document.getElementById('invite-token').textContent = inviteToken || 'Self-service';
    
    initGoogleOAuth();
});

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
// GOOGLE OAUTH INITIALIZATION (DYNAMIC SCOPES)
// ============================================

function initGoogleOAuth() {
    if (typeof google === 'undefined') {
        console.warn('⚠️ Google Identity Services not loaded');
        return;
    }
    
    try {
        const scopes = isOperatorMode 
            ? 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.addresses.read'
            : 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
        
        console.log('🔑 Google Scopes:', scopes);
        
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true
        });
        
        google.accounts.id.renderButton(
            document.getElementById('google-button-target'),
            {
                theme: 'outline',
                size: 'large',
                width: 352,
                text: 'continue_with',
                shape: 'rectangular',
                logo_alignment: 'left'
            }
        );
        
        console.log('✅ Google OAuth initialized');
        
    } catch (error) {
        console.error('Google OAuth init error:', error);
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
        
        if (isOperatorMode && (!userIdentity.phone || !userIdentity.address)) {
            showExtraDataForm(userIdentity, ['phone', 'address']);
        } else {
            processAuthentication(userIdentity);
        }
        
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
        email: null,
        phone: null,
        authDate: user.auth_date,
        hash: user.hash
    };
    
    console.log('✅ Extracted Identity:', userIdentity);
    
    if (isOperatorMode) {
        showExtraDataForm(userIdentity, ['phone', 'address']);
    } else {
        processAuthentication(userIdentity);
    }
};

// ============================================
// EXTRA DATA COLLECTION FORM
// ============================================

function showExtraDataForm(userIdentity, fields) {
    const container = document.querySelector('.entry-card');
    
    const fieldsHTML = fields.map(field => {
        if (field === 'phone') {
            return `
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="display: block; text-align: left; margin-bottom: 5px; font-size: 13px; color: var(--text-muted);">
                        📱 Numero di Telefono *
                    </label>
                    <input type="tel" id="input-phone" placeholder="+39 123 456 7890" 
                           style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--glass-border); background: var(--glass); color: var(--text-main); font-size: 14px;">
                </div>
            `;
        } else if (field === 'address') {
            return `
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="display: block; text-align: left; margin-bottom: 5px; font-size: 13px; color: var(--text-muted);">
                        📍 Indirizzo Completo *
                    </label>
                    <textarea id="input-address" rows="3" placeholder="Via, Città, CAP, Provincia" 
                              style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--glass-border); background: var(--glass); color: var(--text-main); font-size: 14px; resize: vertical;"></textarea>
                </div>
            `;
        }
    }).join('');
    
    container.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">
            ✅
        </div>
        <h2 style="margin-bottom: 10px; color: var(--success);">Autenticazione Riuscita!</h2>
        <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 30px;">
            Completa la registrazione con i dati necessari per l'intervento:
        </p>
        
        ${fieldsHTML}
        
        <button class="btn btn-primary btn-block" onclick="submitExtraData()" style="margin-top: 20px;">
            Completa Registrazione
        </button>
    `;
    
    window.tempUserIdentity = userIdentity;
}

function submitExtraData() {
    const phone = document.getElementById('input-phone')?.value.trim();
    const address = document.getElementById('input-address')?.value.trim();
    
    if (!phone || !address) {
        alert('Compila tutti i campi obbligatori.');
        return;
    }
    
    const userIdentity = window.tempUserIdentity;
    userIdentity.phone = phone;
    userIdentity.address = address;
    
    processAuthentication(userIdentity);
}

// ============================================
// AUTHENTICATION PROCESSING
// ============================================

async function processAuthentication(userIdentity) {
    try {
        const customerSession = {
            firstName: userIdentity.firstName,
            lastName: userIdentity.lastName,
            userId: userIdentity.userId,
            username: userIdentity.username,
            photoUrl: userIdentity.photoUrl,
            provider: userIdentity.provider,
            email: userIdentity.email,
            phone: userIdentity.phone,
            address: userIdentity.address,
            linkedOperatorId: decodedToken?.operatorId || null,
            linkedVatId: decodedToken?.vatId || null,
            inviteToken: decodedToken?.fullToken || null,
            connectedAt: new Date().toISOString(),
            gdprConsent: gdprConsent,
            mode: isOperatorMode ? 'operator' : 'self-service',
            telegramAuthDate: userIdentity.authDate,
            telegramHash: userIdentity.hash,
            emailVerified: userIdentity.emailVerified,
            locale: userIdentity.locale
        };
        
        console.log('💾 Persisting customer session:', customerSession);
        
        sessionStorage.setItem('customer_session', JSON.stringify(customerSession));
        
        await notifyCustomerConnected(customerSession);
        
        showSuccessFeedback(userIdentity);
        
        setTimeout(() => {
            redirectToDashboard();
        }, 1500);
        
    } catch (error) {
        console.error('Authentication processing error:', error);
        alert('Errore durante la connessione. Riprova.');
    }
}

async function notifyCustomerConnected(customerSession) {
    console.log('🔔 Notifying operator: Customer authenticated successfully');
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'customer_connected',
                session_id: customerSession.inviteToken,
                operator_id: customerSession.linkedOperatorId,
                vat_id: customerSession.linkedVatId,
                mode: customerSession.mode,
                customer: {
                    firstName: customerSession.firstName,
                    lastName: customerSession.lastName,
                    userId: customerSession.userId,
                    username: customerSession.username,
                    photoUrl: customerSession.photoUrl,
                    provider: customerSession.provider,
                    email: customerSession.email,
                    phone: customerSession.phone,
                    address: customerSession.address,
                    connectedAt: customerSession.connectedAt,
                    gdprConsent: customerSession.gdprConsent,
                    telegramAuthDate: customerSession.telegramAuthDate,
                    telegramHash: customerSession.telegramHash,
                    emailVerified: customerSession.emailVerified,
                    locale: customerSession.locale
                }
            })
        });
        
        if (!response.ok) throw new Error('Webhook failed');
        
        console.log('✅ Operator notified: Customer fully connected');
        return true;
        
    } catch (error) {
        console.warn('⚠️ Webhook notification failed (non-critical):', error);
        return false;
    }
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

function displayOperatorInfo(tokenData) {
    const operatorNameEl = document.getElementById('operator-name');
    const displayName = `Operatore #${tokenData.operatorId.slice(-4)}`;
    operatorNameEl.textContent = displayName;
}

function displaySelfServiceMode() {
    const operatorInfoEl = document.getElementById('operator-info');
    operatorInfoEl.innerHTML = `
        <i class="fas fa-globe"></i>
        <span>Registrazione Self-Service</span>
    `;
}

function showError(message) {
    const container = document.querySelector('.entry-card');
    container.innerHTML = `
        <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
        <h1 style="margin-bottom: 10px;">Errore</h1>
        <p style="color: var(--text-muted);">${message}</p>
    `;
}

function showSuccessFeedback(userIdentity) {
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
    
    const displayName = userIdentity.firstName + (userIdentity.lastName ? ' ' + userIdentity.lastName : '');
    const providerIcon = userIdentity.provider === 'telegram' ? '📤' : userIdentity.provider === 'google' ? '🌐' : '🔑';
    
    const container = document.querySelector('.entry-card');
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
    console.log('Decoded:', decodedToken);
    console.log('Mode:', isOperatorMode ? 'OPERATOR' : 'SELF-SERVICE');
    console.log('GDPR Consent:', gdprConsent);
    console.log('Stored Session:', sessionStorage.getItem('customer_session'));
    console.groupEnd();
}

window.debugSession = debugSession;