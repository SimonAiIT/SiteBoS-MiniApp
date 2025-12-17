// ============================================
// CUSTOMER SESSION MANAGEMENT UTILITIES
// URL as Source of Truth + SessionStorage Persistence
// ============================================

/**
 * Extract session data from current URL parameters
 * This is the PRIMARY source of truth
 */
function extractSessionFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteToken = urlParams.get('invite');
    
    if (!inviteToken) return null;
    
    const parsedToken = parseInviteToken(inviteToken);
    if (!parsedToken) return null;
    
    return {
        fullToken: parsedToken.fullToken,
        vatId: parsedToken.vatId,
        operatorId: parsedToken.operatorId,
        timestamp: parsedToken.timestamp,
        randomStr: parsedToken.randomStr,
        // Additional context from URL
        customerId: urlParams.get('customer_id') || null,
        orderId: urlParams.get('order_id') || null,
        context: urlParams.get('context') || 'general'
    };
}

/**
 * Parse invite token to extract embedded data
 * Token format: VAT_ID + OP_ID + TIMESTAMP + RANDOM
 * Example: DEMO_VAT_123456789_1734423727000_x8k3m9q2
 */
function parseInviteToken(token) {
    if (!token || typeof token !== 'string') return null;
    
    const parts = token.split('_');
    if (parts.length < 4) return null;
    
    return {
        vatId: parts[0] + '_' + parts[1],  // DEMO_VAT
        operatorId: parts[2],              // 123456789
        timestamp: parseInt(parts[3]),     // 1734423727000
        randomStr: parts[4] || '',         // x8k3m9q2
        fullToken: token
    };
}

/**
 * Initialize or retrieve session
 * Priority: URL params > SessionStorage > null
 */
function initSession() {
    // Try URL first (source of truth)
    const urlSession = extractSessionFromUrl();
    
    if (urlSession) {
        // URL has data - persist it and use it
        persistSession(urlSession);
        console.log('✅ Session initialized from URL:', urlSession);
        return urlSession;
    }
    
    // No URL params - check sessionStorage
    const storedSession = getStoredSession();
    if (storedSession) {
        console.log('✅ Session loaded from storage:', storedSession);
        return storedSession;
    }
    
    // No session anywhere
    console.warn('⚠️ No session found');
    return null;
}

/**
 * Persist session data to sessionStorage
 */
function persistSession(sessionData) {
    if (!sessionData) return;
    
    const enrichedData = {
        ...sessionData,
        lastAccess: new Date().toISOString(),
        gdprConsent: sessionData.gdprConsent !== false // Default true
    };
    
    sessionStorage.setItem('customer_session', JSON.stringify(enrichedData));
    console.log('💾 Session persisted to storage');
}

/**
 * Retrieve session from sessionStorage
 */
function getStoredSession() {
    try {
        const data = sessionStorage.getItem('customer_session');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading session:', error);
        return null;
    }
}

/**
 * Get current active session (from storage)
 */
function getSession() {
    return getStoredSession();
}

/**
 * Update session with new data (merge)
 */
function updateSession(updates) {
    const currentSession = getSession();
    if (!currentSession) {
        console.error('Cannot update: no active session');
        return false;
    }
    
    const updatedSession = {
        ...currentSession,
        ...updates,
        lastAccess: new Date().toISOString()
    };
    
    persistSession(updatedSession);
    console.log('🔄 Session updated:', updates);
    return true;
}

/**
 * Build navigation URL with session context preserved
 * All customer page links MUST use this function
 */
function buildContextualUrl(basePath, additionalParams = {}) {
    const session = getSession();
    if (!session) {
        console.warn('Building URL without session context');
        return basePath;
    }
    
    // Always include the invite token (source of truth)
    const params = new URLSearchParams({
        invite: session.fullToken,
        ...additionalParams
    });
    
    // Add customer_id if present
    if (session.customerId) {
        params.set('customer_id', session.customerId);
    }
    
    return `${basePath}?${params.toString()}`;
}

/**
 * Navigate to another customer page WITH context
 */
function navigateWithContext(path, additionalParams = {}) {
    const url = buildContextualUrl(path, additionalParams);
    window.location.href = url;
}

/**
 * Clear session (logout)
 */
function clearSession() {
    sessionStorage.removeItem('customer_session');
    console.log('🗑️ Session cleared');
}

/**
 * Check if session is valid and not expired
 */
function isSessionValid() {
    const session = getSession();
    if (!session) return false;
    
    // Check if token is present
    if (!session.fullToken) return false;
    
    // Optional: Check expiration (24h from creation)
    if (session.timestamp) {
        const age = Date.now() - session.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        if (age > maxAge) {
            console.warn('⚠️ Session expired');
            return false;
        }
    }
    
    return true;
}

/**
 * Require valid session or redirect to error page
 */
function requireSession(redirectPath = '../index.html') {
    if (!isSessionValid()) {
        console.error('❌ Session required but not found/valid');
        alert('Sessione non valida. Richiedi un nuovo link di invito.');
        window.location.href = redirectPath;
        return false;
    }
    return true;
}

/**
 * Get company/operator info from session
 */
function getCompanyInfo() {
    const session = getSession();
    if (!session) return null;
    
    return {
        vatId: session.vatId,
        operatorId: session.operatorId
    };
}

/**
 * Debug: Log current session state
 */
function debugSession() {
    console.group('🔍 Session Debug');
    console.log('URL Params:', window.location.search);
    console.log('Stored Session:', getStoredSession());
    console.log('Session Valid:', isSessionValid());
    console.groupEnd();
}

// ============================================
// AUTO-INIT ON LOAD (Optional)
// ============================================

// Uncomment to auto-initialize session on every page load
// document.addEventListener('DOMContentLoaded', () => {
//     initSession();
// });

// Export for use in other scripts (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        extractSessionFromUrl,
        parseInviteToken,
        initSession,
        persistSession,
        getSession,
        updateSession,
        buildContextualUrl,
        navigateWithContext,
        clearSession,
        isSessionValid,
        requireSession,
        getCompanyInfo,
        debugSession
    };
}