// ============================================
// OPERATOR SESSION MANAGEMENT UTILITIES
// URL as Source of Truth + SessionStorage Persistence
// ============================================

/**
 * Extract operator session data from current URL parameters
 * This is the PRIMARY source of truth for operator pages
 */
function extractOperatorSessionFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chat_id');
    const vat = urlParams.get('vat');
    
    if (!chatId || !vat) return null;
    
    return {
        chat_id: chatId,
        vat: vat,
        // Additional context from URL
        task_id: urlParams.get('task_id') || null,
        customer_id: urlParams.get('customer_id') || null,
        context: urlParams.get('context') || 'general'
    };
}

/**
 * Initialize or retrieve operator session
 * Priority: URL params > SessionStorage > null
 */
function initOperatorSession() {
    // Try URL first (source of truth)
    const urlSession = extractOperatorSessionFromUrl();
    
    if (urlSession) {
        // URL has data - persist it and use it
        persistOperatorSession(urlSession);
        console.log('✅ Operator session initialized from URL:', urlSession);
        return urlSession;
    }
    
    // No URL params - check sessionStorage
    const storedSession = getStoredOperatorSession();
    if (storedSession) {
        console.log('✅ Operator session loaded from storage:', storedSession);
        return storedSession;
    }
    
    // No session anywhere
    console.warn('⚠️ No operator session found');
    return null;
}

/**
 * Persist operator session data to sessionStorage
 */
function persistOperatorSession(sessionData) {
    if (!sessionData) return;
    
    const enrichedData = {
        ...sessionData,
        lastAccess: new Date().toISOString()
    };
    
    sessionStorage.setItem('operator_session', JSON.stringify(enrichedData));
    console.log('💾 Operator session persisted to storage');
}

/**
 * Retrieve operator session from sessionStorage
 */
function getStoredOperatorSession() {
    try {
        const data = sessionStorage.getItem('operator_session');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading operator session:', error);
        return null;
    }
}

/**
 * Get current active operator session (from storage)
 */
function getOperatorSession() {
    return getStoredOperatorSession();
}

/**
 * Update operator session with new data (merge)
 */
function updateOperatorSession(updates) {
    const currentSession = getOperatorSession();
    if (!currentSession) {
        console.error('Cannot update: no active operator session');
        return false;
    }
    
    const updatedSession = {
        ...currentSession,
        ...updates,
        lastAccess: new Date().toISOString()
    };
    
    persistOperatorSession(updatedSession);
    console.log('🔄 Operator session updated:', updates);
    return true;
}

/**
 * Build navigation URL with operator session context preserved
 * All operator page links MUST use this function
 */
function buildOperatorContextualUrl(basePath, additionalParams = {}) {
    const session = getOperatorSession();
    if (!session) {
        console.warn('Building operator URL without session context');
        return basePath;
    }
    
    // Always include chat_id and vat (source of truth)
    const params = new URLSearchParams({
        chat_id: session.chat_id,
        vat: session.vat,
        ...additionalParams
    });
    
    // Add task_id if present
    if (session.task_id) {
        params.set('task_id', session.task_id);
    }
    
    // Add customer_id if present
    if (session.customer_id) {
        params.set('customer_id', session.customer_id);
    }
    
    return `${basePath}?${params.toString()}`;
}

/**
 * Navigate to another operator page WITH context
 */
function navigateOperatorWithContext(path, additionalParams = {}) {
    const url = buildOperatorContextualUrl(path, additionalParams);
    window.location.href = url;
}

/**
 * Clear operator session (logout)
 */
function clearOperatorSession() {
    sessionStorage.removeItem('operator_session');
    console.log('🗑️ Operator session cleared');
}

/**
 * Check if operator session is valid
 */
function isOperatorSessionValid() {
    const session = getOperatorSession();
    if (!session) return false;
    
    // Check if required fields are present
    if (!session.chat_id || !session.vat) return false;
    
    return true;
}

/**
 * Require valid operator session or redirect to error page
 */
function requireOperatorSession(redirectPath = '../index.html') {
    if (!isOperatorSessionValid()) {
        console.error('❌ Operator session required but not found/valid');
        alert('Sessione operatore non valida. Avvia l\'app da Telegram.');
        window.location.href = redirectPath;
        return false;
    }
    return true;
}

/**
 * Get company info from operator session
 */
function getOperatorCompanyInfo() {
    const session = getOperatorSession();
    if (!session) return null;
    
    return {
        vat: session.vat,
        chatId: session.chat_id
    };
}

/**
 * Debug: Log current operator session state
 */
function debugOperatorSession() {
    console.group('🔍 Operator Session Debug');
    console.log('URL Params:', window.location.search);
    console.log('Stored Session:', getStoredOperatorSession());
    console.log('Session Valid:', isOperatorSessionValid());
    console.groupEnd();
}

// Export for use in other scripts (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        extractOperatorSessionFromUrl,
        initOperatorSession,
        persistOperatorSession,
        getOperatorSession,
        updateOperatorSession,
        buildOperatorContextualUrl,
        navigateOperatorWithContext,
        clearOperatorSession,
        isOperatorSessionValid,
        requireOperatorSession,
        getOperatorCompanyInfo,
        debugOperatorSession
    };
}