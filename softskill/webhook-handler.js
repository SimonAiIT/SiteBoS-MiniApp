// webhook-handler.js
// Gestisce comunicazione con Make.com webhook per salvare dati moduli

class WebhookHandler {
  constructor() {
    this.webhookUrl = 'https://trinai.api.workflow.dcmake.it/webhook/80d663ea-be4b-4d42-8cc1-05f4ada52ced';
    this.vat = this.getUrlParam('vat') || 'TEST_VAT';
    this.userId = this.getUrlParam('user_id') || 'TEST_USER';
  }

  getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  /**
   * 🆕 RECUPERA PROGRESSO UTENTE DAL SERVER
   * Chiamato all'inizio per sincronizzare dati
   * @returns {Promise<Object>} Dati progresso utente
   */
  async getProgress() {
    const payload = {
      action: "get_progress",
      vat: this.vat,
      user_id: this.userId,
      timestamp: new Date().toISOString()
    };

    console.log('📡 Recupero progresso da server:', payload);

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Progresso recuperato:', result);
      
      // Salva in localStorage come cache
      if (result.modules_completed) {
        const key = `modules_${this.vat}_${this.userId}`;
        localStorage.setItem(key, JSON.stringify(result.modules_completed));
      }
      
      return result;
      
    } catch (error) {
      console.warn('⚠️ Errore recupero progresso, uso localStorage:', error);
      // Fallback: usa localStorage
      return {
        modules_completed: this.loadModulesData(),
        completion_percentage: this.getCompletionPercentage()
      };
    }
  }

  /**
   * Salva modulo completato su webhook Make.com
   * @param {Object} moduleData - Dati del modulo completato
   * @returns {Promise} Response del webhook
   */
  async saveModule(moduleData) {
    const payload = {
      action: "save_module",
      vat: this.vat,
      user_id: this.userId,
      timestamp: new Date().toISOString(),
      ...moduleData
    };

    console.log('📡 Invio dati a webhook:', payload);

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Modulo salvato con successo!', result);
      return result;
      
    } catch (error) {
      console.error('❌ Errore webhook:', error);
      // Fallback: salva locale se webhook fallisce
      this.saveToLocalStorageBackup(payload);
      throw error;
    }
  }

  /**
   * Salva dati completamento modulo in localStorage
   * @param {string} moduleId - ID del modulo (modulo1, modulo2, etc)
   * @param {Object} data - Dati da salvare
   */
  saveModuleToLocalStorage(moduleId, data) {
    const key = `modules_${this.vat}_${this.userId}`;
    let stored = JSON.parse(localStorage.getItem(key) || '{}');
    
    stored[moduleId] = {
      completed: true,
      date: new Date().toLocaleDateString('it-IT'),
      time: data.completion_time_seconds,
      results: data.results,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(key, JSON.stringify(stored));
    console.log('💾 Salvato in localStorage:', moduleId);
  }

  /**
   * Recupera dati moduli da localStorage
   * @returns {Object} Dati moduli salvati
   */
  loadModulesData() {
    const key = `modules_${this.vat}_${this.userId}`;
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  /**
   * Calcola percentuale completamento (quanti moduli fatti su 4)
   * @returns {number} Percentuale 0-100
   */
  getCompletionPercentage() {
    const data = this.loadModulesData();
    const completedCount = Object.values(data).filter(m => m.completed).length;
    return (completedCount / 4) * 100;
  }

  /**
   * Verifica se un modulo specifico è stato completato
   * @param {string} moduleId - ID del modulo
   * @returns {boolean}
   */
  isModuleCompleted(moduleId) {
    const data = this.loadModulesData();
    return data[moduleId] && data[moduleId].completed === true;
  }

  /**
   * Conta quanti moduli sono stati completati
   * @returns {number} Numero moduli completati (0-4)
   */
  getCompletedModulesCount() {
    const data = this.loadModulesData();
    return Object.values(data).filter(m => m.completed).length;
  }

  /**
   * Backup locale se webhook fallisce
   * @param {Object} payload - Dati da salvare
   */
  saveToLocalStorageBackup(payload) {
    const backupKey = `backup_${this.vat}_${this.userId}`;
    let backups = JSON.parse(localStorage.getItem(backupKey) || '[]');
    backups.push({
      ...payload,
      backup_timestamp: new Date().toISOString()
    });
    localStorage.setItem(backupKey, JSON.stringify(backups));
    console.log('💾 Salvato backup locale (webhook non disponibile)');
  }

  /**
   * Recupera backup non sincronizzati
   * @returns {Array} Lista backup
   */
  getPendingBackups() {
    const backupKey = `backup_${this.vat}_${this.userId}`;
    return JSON.parse(localStorage.getItem(backupKey) || '[]');
  }

  /**
   * Cancella backup dopo sincronizzazione
   */
  clearBackups() {
    const backupKey = `backup_${this.vat}_${this.userId}`;
    localStorage.removeItem(backupKey);
  }
}

// Export per uso in altri file
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WebhookHandler };
}
