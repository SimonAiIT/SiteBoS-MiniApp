// ============================================
// SECURE HANDSHAKE LOGIC
// OAuth-Style Identity Provider Simulation
// ============================================

const WEBHOOK_URL = 'https://trinai.api.workflow.dcmake.it/webhook/9d094742-eaca-41e1-b4e9-ee0627ffa285';

let inviteToken = null;
let decodedToken = null;

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
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
    console.groupEnd();
    
    // Display operator info
    displayOperatorInfo(decodedToken);
    
    // Show token in debug section
    document.getElementById('invite-token').textContent = inviteToken;
    
    // Setup OAuth buttons
    setupOAuthButtons();
});

// ============================================
// TOKEN DECODING
// ============================================

function decodeInviteToken(token) {
    if (!token || typeof token !== 'string') return null;
    
    // Token format: VAT_ID + _ + OPERATOR_ID + _ + TIMESTAMP + _ + RANDOM
    // Example: IT06988830821_2041408875_1734424703000_k7m9x3q1
    
    const parts = token.split('_');
    if (parts.length < 4) return null;
    
    return {
        vatId: parts[0], // IT06988830821
        operatorId: parts[1], // 2041408875
        timestamp: parseInt(parts[2]), // 1734424703000
        randomStr: parts[3], // k7m9x3q1
        fullToken: token
    };
}

// ============================================
// UI UPDATES
// ============================================

function displayOperatorInfo(tokenData) {
    const operatorNameEl = document.getElementById('operator-name');
    
    // In production, fetch operator name from API
    // For now, display operator ID
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

// ============================================
// OAUTH BUTTON HANDLERS
// ============================================

function setupOAuthButtons() {
    // Telegram OAuth
    document.getElementById('btn-telegram').addEventListener('click', () => {
        handleOAuthFlow('telegram');
    });
    
    // Google OAuth
    document.getElementById('btn-google').addEventListener('click', () => {
        handleOAuthFlow('google');
    });
    
    // Apple OAuth
    document.getElementById('btn-apple').addEventListener('click', () => {
        handleOAuthFlow('apple');
    });
}

async function handleOAuthFlow(provider) {
    console.log(`🔐 OAuth flow started: ${provider}`);
    
    // Visual feedback
    const button = document.getElementById(`btn-${provider}`);
    button.classList.add('loading');
    
    // Haptic feedback (if supported)
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    try {
        // Simulate OAuth redirect/popup
        // In production:
        // - Telegram: window.Telegram.Login.auth()
        // - Google: gapi.auth2.getAuthInstance().signIn()
        // - Apple: AppleID.auth.signIn()
        
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        
        // Mock identity extraction
        const userIdentity = simulateIdentityExtraction(provider);
        
        console.log('✅ Identity extracted:', userIdentity);
        
        // Create customer session
        const customerSession = {
            // User identity
            firstName: userIdentity.firstName,
            lastName: userIdentity.lastName,
            userId: userIdentity.userId,
            provider: userIdentity.provider,
            email: userIdentity.email,
            phone: userIdentity.phone,
            
            // Operator linkage (from token)
            linkedOperatorId: decodedToken.operatorId,
            linkedVatId: decodedToken.vatId,
            inviteToken: decodedToken.fullToken,
            
            // Metadata
            connectedAt: new Date().toISOString(),
            gdprConsent: true // Implicit consent
        };
        
        console.log('💾 Persisting customer session:', customerSession);
        
        // Persist session
        sessionStorage.setItem('customer_session', JSON.stringify(customerSession));
        
        // Notify webhook
        await notifyWebhook(customerSession);
        
        // Success feedback
        showSuccessFeedback(userIdentity);
        
        // Redirect to dashboard after 1.5s
        setTimeout(() => {
            redirectToDashboard();
        }, 1500);
        
    } catch (error) {
        console.error('OAuth flow error:', error);
        button.classList.remove('loading');
        alert('Errore durante la connessione. Riprova.');
    }
}

// ============================================
// IDENTITY SIMULATION
// ============================================

function simulateIdentityExtraction(provider) {
    // In production, this data comes from the OAuth provider
    
    const mockIdentities = {
        telegram: {
            firstName: 'Mario',
            lastName: 'Rossi',
            userId: '999888777',
            provider: 'telegram',
            email: null,
            phone: '+393331234567'
        },
        google: {
            firstName: 'Anna',
            lastName: 'Verdi',
            userId: 'google_123456789',
            provider: 'google',
            email: 'anna.verdi@gmail.com',
            phone: null
        },
        apple: {
            firstName: 'Giuseppe',
            lastName: 'Bianchi',
            userId: 'apple_987654321',
            provider: 'apple',
            email: 'giuseppe.b@icloud.com',
            phone: null
        }
    };
    
    return mockIdentities[provider] || mockIdentities.telegram;
}

// ============================================
// WEBHOOK NOTIFICATION
// ============================================

async function notifyWebhook(customerSession) {
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
                    provider: customerSession.provider,
                    email: customerSession.email,
                    phone: customerSession.phone,
                    connectedAt: customerSession.connectedAt,
                    gdprConsent: customerSession.gdprConsent
                }
            })
        });
        
        if (!response.ok) throw new Error('Webhook failed');
        
        console.log('✅ Webhook notified successfully');
        return true;
        
    } catch (error) {
        console.warn('⚠️ Webhook notification failed (non-critical):', error);
        return false; // Don't block user flow
    }
}

// ============================================
// SUCCESS FEEDBACK
// ============================================

function showSuccessFeedback(userIdentity) {
    // Vibrate success pattern
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
    
    const container = document.querySelector('.entry-card');
    container.innerHTML = `
        <div style="font-size: 64px; margin-bottom: 20px;">
            ✅
        </div>
        <h1 style="margin-bottom: 10px; color: var(--success);">Connesso!</h1>
        <p style="font-size: 18px; font-weight: 600; margin-bottom: 5px;">
            ${userIdentity.firstName} ${userIdentity.lastName}
        </p>
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
    // Build dashboard URL with session context
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
// DEBUG UTILITIES
// ============================================

function debugSession() {
    console.group('🔍 Session Debug');
    console.log('Token:', inviteToken);
    console.log('Decoded:', decodedToken);
    console.log('Stored Session:', sessionStorage.getItem('customer_session'));
    console.groupEnd();
}

// Expose debug function globally
window.debugSession = debugSession;