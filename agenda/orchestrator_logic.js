/**
 * SMART RESOURCE ORCHESTRATOR - Core Logic
 * 
 * Sistema di gestione risorse a 3 layer:
 * - Production Layer: Appuntamenti e Vendite
 * - Ops Layer: Turni, Ferie, Manutenzioni
 * - Compliance Layer: Scadenze legali, Certificazioni
 * 
 * @version 1.0.0
 * @date 2025-12-20
 */

const WEBHOOK_URL = 'https://trinai.api.workflow.dcmake.it/webhook/8f148592-cbb9-4c72-96e8-73c08fccee43';

const SmartOrchestrator = {
    // State Management
    state: {
        vat: null,
        tenantData: null,
        catalogData: null,
        operatorsData: null,
        resourcesStatus: null,
        currentPhase: 'loading' // loading | wizard | dossier | operational
    },

    /**
     * PHASE A: Smart Entry & AI Architect
     * Inizializza il sistema e decide dove atterrare
     */
    async init() {
        try {
            // 1. Get VAT from URL
            this.state.vat = this.getVAT();
            if (!this.state.vat) {
                throw new Error('VAT mancante nei parametri URL');
            }

            this.log('info', `✓ VAT identificato: ${this.state.vat}`);
            
            // 2. Call Webhook - Analyze Tenant Setup
            this.updateStatus('Analisi dei Servizi in corso...');
            await this.delay(800);
            
            const analysisResult = await this.callWebhook('analyze_tenant', {
                vat: this.state.vat
            });

            this.log('success', '✓ Analisi completata');
            this.state.tenantData = analysisResult;

            // 3. Identify Operational Archetype
            this.updateStatus('Identificazione Archetipo Operativo...');
            await this.delay(600);
            
            const archetype = analysisResult.archetype || 'generic';
            this.log('info', `→ Archetipo: ${archetype}`);

            // 4. Calculate Resource Requirements
            this.updateStatus('Calcolo fabbisogno risorse...');
            await this.delay(700);

            const resourceReq = analysisResult.resource_requirements || {};
            this.log('info', `→ Servizi rilevati: ${resourceReq.services_count || 0}`);
            this.log('info', `→ Operatori: ${resourceReq.operators_count || 0}`);

            // 5. Decision Fork
            await this.delay(500);
            
            if (analysisResult.is_configured && analysisResult.resources_ready) {
                // GOTO Operational View (Fase D)
                this.log('success', '✓ Tenant configurato - Caricamento calendario...');
                await this.delay(800);
                this.goToPhase('operational');
            } else {
                // GOTO Wizard (Fase B)
                this.log('warning', '⚠ Setup incompleto - Avvio wizard risorse...');
                await this.delay(1000);
                this.goToPhase('wizard', analysisResult);
            }

        } catch (error) {
            console.error('Smart Entry Error:', error);
            this.showError(error.message);
        }
    },

    /**
     * Webhook Communication
     * Protocollo: POST JSON con action type
     */
    async callWebhook(action, data = {}) {
        this.log('debug', `🔗 Webhook Call: ${action}`);
        
        const payload = {
            action: action,
            timestamp: new Date().toISOString(),
            ...data
        };

        // Debug log
        const debugEl = document.getElementById('debug-data');
        if (debugEl) {
            debugEl.textContent = JSON.stringify(payload, null, 2);
            document.getElementById('debug-info')?.classList.remove('hidden');
        }

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            this.log('debug', `✓ Response received`);
            
            return result;

        } catch (error) {
            this.log('error', `✗ Webhook Error: ${error.message}`);
            throw error;
        }
    },

    /**
     * Phase Navigation
     */
    goToPhase(phase, data = null) {
        this.state.currentPhase = phase;

        switch(phase) {
            case 'wizard':
                // Redirect to wizard with data
                const wizardUrl = `wizard.html?vat=${this.state.vat}`;
                if (data) {
                    localStorage.setItem('wizard_data', JSON.stringify(data));
                }
                window.location.href = wizardUrl;
                break;

            case 'dossier':
                // Redirect to dossier enrichment
                const dossierUrl = `dossier.html?vat=${this.state.vat}`;
                window.location.href = dossierUrl;
                break;

            case 'operational':
                // Redirect to calendar view
                const calendarUrl = `calendar.html?vat=${this.state.vat}`;
                window.location.href = calendarUrl;
                break;

            default:
                console.error('Unknown phase:', phase);
        }
    },

    /**
     * UI Helper Methods
     */
    updateStatus(message) {
        const statusEl = document.getElementById('loader-status');
        if (statusEl) {
            statusEl.textContent = message;
        }
    },

    log(type, message) {
        const logEl = document.getElementById('ai-log');
        if (!logEl) return;

        const colors = {
            info: 'var(--text-muted)',
            success: 'var(--success)',
            warning: 'var(--warning)',
            error: 'var(--error)',
            debug: 'var(--primary)'
        };

        const entry = document.createElement('div');
        entry.style.color = colors[type] || 'white';
        entry.style.marginBottom = '4px';
        entry.textContent = message;
        
        logEl.appendChild(entry);
        logEl.scrollTop = logEl.scrollHeight;
    },

    showError(message) {
        const errorOverlay = document.getElementById('error-overlay');
        const errorMessage = document.getElementById('error-message');
        
        if (errorOverlay && errorMessage) {
            errorMessage.textContent = message;
            errorOverlay.classList.remove('hidden');
        }

        // Hide loader
        document.getElementById('smart-loader')?.classList.add('hidden');
    },

    /**
     * Utility Methods
     */
    getVAT() {
        const params = new URLSearchParams(window.location.search);
        return params.get('vat') || localStorage.getItem('userVAT');
    },

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartOrchestrator;
}