// ============================================
// SECURE HANDSHAKE LOGIC
// REAL Telegram OAuth + Double Webhook System
// ============================================

const WEBHOOK_URL = 'https://trinai.api.workflow.dcmake.it/webhook/9d094742-eaca-41e1-b4e9-ee0627ffa285';

let inviteToken = null;
let decodedToken = null;
let arrivedAt = null;

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.group('🔑 SECURE HANDSHAKE - INIT');
    console.log('URL:', window.location.href);
    
    // Extract invite token from URL
    const urlParams = new URLSearchParams(window.location.search);
    inviteToken = urlParams.get('invite');
    
    console.log('Invite Token:', inviteToken);
    
    if (!inviteToken) {
        showError('Token di invito mancante o non valido.');
        console.groupEnd();
        return;
    }
    
    // Decode token to extract operator/company info
    decodedToken = decodeInviteToken(inviteToken);
    
    if (!decodedToken) {
        showError('Token corrotto. Richiedi un nuovo link.');
        console.groupEnd();
        return;
    }
    
    console.log('Decoded Token:', decodedToken);
    
    // Record arrival timestamp
    arrivedAt = new Date().toISOString();
    
    // 🔔 CRITICAL: Notify operator IMMEDIATELY that customer arrived
    await notifyCustomerArrived();
    
    console.groupEnd();
    
    // Display operator info
    displayOperatorInfo(decodedToken);
    
    // Show token in debug section
    document.getElementById('invite-token').textContent = inviteToken;
});

// ============================================
// WEBHOOK: CUSTOMER ARRIVED (Page Load)
// ============================================

async function notifyCustomerArrived() {
    console.log('🔔 Notifying operator: Customer arrived at handshake page');
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'customer_arrived',
                session_id: decodedToken.fullToken,
                operator_id: decodedToken.operatorId,
                vat_id: decodedToken.vatId,
                arrived_at: arrivedAt,
                user_agent: navigator.userAgent,
                referrer: document.referrer || 'direct'
            })
        });
        
        if (!response.ok) throw new Error('Webhook notification failed');
        
        console.log('✅ Operator notified: Customer is viewing handshake page');
        return true;
        
    } catch (error) {
        console.warn('⚠️ Failed to notify customer arrival (non-critical):', error);
        return false;
    }
}

// ============================================
// TELEGRAM OAUTH CALLBACK (REAL)
// This function is called by Telegram Widget
// ============================================

window.onTelegramAuth = function(user) {
    console.group('✅ TELEGRAM OAUTH - REAL DATA RECEIVED');
    console.log('Raw Telegram User:', user);
    console.groupEnd();
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(100);
    }
    
    // Extract real identity from Telegram
    const userIdentity = {
        firstName: user.first_name,
        lastName: user.last_name || '',
        userId: user.id.toString(),
        username: user.username || null,
        photoUrl: user.photo_url || null,
        provider: 'telegram',
        email: null,
        phone: null,
        
        // Telegram auth metadata
        authDate: user.auth_date,
        hash: user.hash
    };
    
    console.log('✅ Extracted Identity:', userIdentity);
    
    // Process authentication
    processAuthentication(userIdentity);
};

// ============================================
// AUTHENTICATION PROCESSING
// ============================================

async function processAuthentication(userIdentity) {
    try {
        // Create customer session
        const customerSession = {
            // User identity (REAL from OAuth)
            firstName: userIdentity.firstName,
            lastName: userIdentity.lastName,
            userId: userIdentity.userId,
            username: userIdentity.username,
            photoUrl: userIdentity.photoUrl,
            provider: userIdentity.provider,
            email: userIdentity.email,
            phone: userIdentity.phone,
            
            // Operator linkage (from token)
            linkedOperatorId: decodedToken.operatorId,
            linkedVatId: decodedToken.vatId,
            inviteToken: decodedToken.fullToken,
            
            // Metadata
            arrivedAt: arrivedAt,
            connectedAt: new Date().toISOString(),
            gdprConsent: true,
            
            // Telegram specific
            telegramAuthDate: userIdentity.authDate,
            telegramHash: userIdentity.hash
        };
        
        console.log('💾 Persisting customer session:', customerSession);
        
        // Persist session
        sessionStorage.setItem('customer_session', JSON.stringify(customerSession));
        
        // 🔔 CRITICAL: Notify operator that customer CONNECTED
        await notifyCustomerConnected(customerSession);
        
        // Success feedback
        showSuccessFeedback(userIdentity);
        
        // Redirect to dashboard after 1.5s
        setTimeout(() => {
            redirectToDashboard();
        }, 1500);
        
    } catch (error) {
        console.error('Authentication processing error:', error);
        alert('Errore durante la connessione. Riprova.');
    }
}

// ============================================
// WEBHOOK: CUSTOMER CONNECTED (After OAuth)
// ============================================

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
                customer: {
                    firstName: customerSession.firstName,
                    lastName: customerSession.lastName,
                    userId: customerSession.userId,
                    username: customerSession.username,
                    photoUrl: customerSession.photoUrl,
                    provider: customerSession.provider,
                    email: customerSession.email,
                    phone: customerSession.phone,
                    arrivedAt: customerSession.arrivedAt,
                    connectedAt: customerSession.connectedAt,
                    gdprConsent: customerSession.gdprConsent,
                    telegramAuthDate: customerSession.telegramAuthDate,
                    telegramHash: customerSession.telegramHash
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
    
    // Token format: VAT_ID + _ + OPERATOR_ID + _ + TIMESTAMP + _ + RANDOM
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
    
    // Display operator ID (last 4 digits)
    const displayName = `Operatore #${tokenData.operatorId.slice(-4)}`;
    
    operatorNameEl.textContent = displayName;
}

function showError(message) {
    const container = document.querySelector('.entry-card');
    container.innerHTML = `
        <div style="font-size: 64px; margin-bottom: 20px;">
            ⚠️
        </div>
        <h1 style="margin-bottom: 10px;">Errore</h1>
        <p style="color: var(--text-muted);">${message}</p>
    `;
}

function showSuccessFeedback(userIdentity) {
    // Vibrate success pattern
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
    
    const displayName = userIdentity.firstName + (userIdentity.lastName ? ' ' + userIdentity.lastName : '');
    
    const container = document.querySelector('.entry-card');
    container.innerHTML = `
        <div style="font-size: 64px; margin-bottom: 20px;">
            ✅
        </div>
        <h1 style="margin-bottom: 10px; color: var(--success);">Connesso!</h1>
        
        ${userIdentity.photoUrl ? `
            <img src="${userIdentity.photoUrl}" 
                 style="width: 80px; height: 80px; border-radius: 50%; margin: 15px auto; border: 3px solid var(--success);" 
                 alt="${displayName}">
        ` : ''}
        
        <p style="font-size: 18px; font-weight: 600; margin-bottom: 5px;">
            ${displayName}
        </p>
        
        ${userIdentity.username ? `
            <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 15px;">
                @${userIdentity.username}
            </p>
        ` : ''}
        
        <p style="color: var(--text-muted); font-size: 14px;">
            Reindirizzamento alla dashboard...
        </p>
        
        <div class="spinner-ring" style="margin: 30px auto;"></div>
    `;
}

// ============================================
// NAVIGATION
// ============================================

function redirectToDashboard() {
    const session = JSON.parse(sessionStorage.getItem('customer_session'));
    
    if (!session) {
        console.error('Session lost during redirect!');
        window.location.href = 'securehandshake.html?invite=' + inviteToken;
        return;
    }
    
    // Redirect with invite token in URL (source of truth)
    const dashboardUrl = `customer_dashboard.html?invite=${session.inviteToken}`;
    
    console.log('🚀 Redirecting to:', dashboardUrl);
    window.location.href = dashboardUrl;
}

// ============================================
// FUTURE: GOOGLE OAUTH
// ============================================

/*
function initGoogleOAuth() {
    gapi.load('auth2', function() {
        const auth2 = gapi.auth2.init({
            client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
        });
        
        document.getElementById('btn-google').addEventListener('click', () => {
            auth2.signIn().then(googleUser => {
                const profile = googleUser.getBasicProfile();
                const userIdentity = {
                    firstName: profile.getGivenName(),
                    lastName: profile.getFamilyName(),
                    userId: profile.getId(),
                    provider: 'google',
                    email: profile.getEmail(),
                    photoUrl: profile.getImageUrl()
                };
                processAuthentication(userIdentity);
            });
        });
    });
}
*/

// ============================================
// FUTURE: APPLE SIGN IN
// ============================================

/*
function initAppleSignIn() {
    AppleID.auth.init({
        clientId: 'YOUR_APPLE_CLIENT_ID',
        scope: 'name email',
        redirectURI: 'https://simonaiit.github.io/SiteBoS-MiniApp/customer/callback.html',
        usePopup: true
    });
    
    document.getElementById('btn-apple').addEventListener('click', () => {
        AppleID.auth.signIn().then(response => {
            const { authorization, user } = response;
            const userIdentity = {
                firstName: user.name.firstName,
                lastName: user.name.lastName,
                userId: authorization.user,
                provider: 'apple',
                email: user.email
            };
            processAuthentication(userIdentity);
        });
    });
}
*/

// ============================================
// DEBUG UTILITIES
// ============================================

function debugSession() {
    console.group('🔍 Session Debug');
    console.log('Token:', inviteToken);
    console.log('Decoded:', decodedToken);
    console.log('Arrived At:', arrivedAt);
    console.log('Stored Session:', sessionStorage.getItem('customer_session'));
    console.groupEnd();
}

// Expose debug function globally
window.debugSession = debugSession;