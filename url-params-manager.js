// ========================================
// URL PARAMS MANAGER
// Preserva parametri critici di sessione in tutta la navigazione
// ========================================

/**
 * PARAMETRI CRITICI (sempre preservati):
 * - vat: Partita IVA cliente
 * - owner: ID proprietario sessione
 * - token: Token autenticazione
 * - lang: Lingua interfaccia
 * - regione_sociale: Ragione sociale
 * - cmd: Modalità comando (MANUAL/AUTO)
 */

class URLParamsManager {
  constructor() {
    this.STORAGE_KEY = 'sitebos_session_params';
    this.CRITICAL_PARAMS = ['vat', 'owner', 'token', 'lang', 'regione_sociale', 'cmd'];
    this.init();
  }

  // Inizializza: estrae params da URL e salva in sessionStorage
  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const storedParams = this.getStoredParams();
    
    // Merge: URL params hanno priorità su stored
    const mergedParams = { ...storedParams };
    
    urlParams.forEach((value, key) => {
      if (this.CRITICAL_PARAMS.includes(key)) {
        mergedParams[key] = value;
      }
    });
    
    // Salva in sessionStorage
    this.saveParams(mergedParams);
    
    console.log('🔗 URL Params Manager initialized:', mergedParams);
  }

  // Ottieni params da sessionStorage
  getStoredParams() {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error('Error reading stored params:', e);
      return {};
    }
  }

  // Salva params in sessionStorage
  saveParams(params) {
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(params));
    } catch (e) {
      console.error('Error saving params:', e);
    }
  }

  // Ottieni tutti i parametri critici come oggetto
  getParams() {
    return this.getStoredParams();
  }

  // Costruisci query string da params object
  buildQueryString(additionalParams = {}) {
    const params = { ...this.getParams(), ...additionalParams };
    const urlParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        urlParams.set(key, value);
      }
    });
    
    return urlParams.toString();
  }

  // Costruisci URL completo con params
  buildURL(path, additionalParams = {}) {
    const queryString = this.buildQueryString(additionalParams);
    return queryString ? `${path}?${queryString}` : path;
  }

  // Naviga preservando params
  navigate(path, additionalParams = {}) {
    const url = this.buildURL(path, additionalParams);
    window.location.href = url;
  }

  // Torna indietro preservando params (usa history o fallback)
  goBack() {
    // Se c'è history, usa quella
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Altrimenti vai a index con params
      this.navigate('./index.html');
    }
  }

  // Auto-inject params in tutti i link della pagina
  injectParamsInLinks() {
    const links = document.querySelectorAll('a[href]');
    const params = this.getParams();
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      
      // Skip external links, anchors, javascript:
      if (href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript:')) {
        return;
      }
      
      // Skip se già ha i params
      if (href.includes('vat=') && href.includes('token=')) {
        return;
      }
      
      // Aggiungi params
      const url = new URL(href, window.location.origin);
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
      
      link.setAttribute('href', url.pathname + url.search);
    });
    
    console.log(`✅ Injected params in ${links.length} links`);
  }

  // Aggiorna un singolo parametro
  updateParam(key, value) {
    const params = this.getParams();
    params[key] = value;
    this.saveParams(params);
  }

  // Reset params (logout/clear session)
  clearParams() {
    sessionStorage.removeItem(this.STORAGE_KEY);
    console.log('🗑️ Session params cleared');
  }
}

// ========================================
// GLOBAL INSTANCE
// ========================================

const urlManager = new URLParamsManager();

// Auto-inject params in links quando DOM è pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    urlManager.injectParamsInLinks();
  });
} else {
  urlManager.injectParamsInLinks();
}

// Re-inject dopo modifiche al DOM (per SPA)
const observer = new MutationObserver(() => {
  urlManager.injectParamsInLinks();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// ========================================
// UTILITY FUNCTIONS (Global)
// ========================================

// Ottieni params
function getSessionParams() {
  return urlManager.getParams();
}

// Costruisci URL con params
function buildURLWithParams(path, additionalParams = {}) {
  return urlManager.buildURL(path, additionalParams);
}

// Naviga con params
function navigateWithParams(path, additionalParams = {}) {
  urlManager.navigate(path, additionalParams);
}

// Torna indietro
function goBackWithParams() {
  urlManager.goBack();
}

// Export per uso in altri script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { urlManager, getSessionParams, buildURLWithParams, navigateWithParams, goBackWithParams };
}