/**
 * RESOURCE WIZARD LOGIC
 * Fase B: L'Intervista - Configurazione risorse
 */

const WizardController = {
    state: {
        vat: null,
        wizardData: null,
        operators: [],
        assets: [],
        customAssets: []
    },

    async init() {
        // Get VAT
        const params = new URLSearchParams(window.location.search);
        this.state.vat = params.get('vat') || localStorage.getItem('userVAT');

        // Get wizard data from localStorage (set by orchestrator)
        const storedData = localStorage.getItem('wizard_data');
        if (storedData) {
            this.state.wizardData = JSON.parse(storedData);
        }

        // Render UI
        this.renderOperators();
        this.renderAssets();
        this.attachEventListeners();
    },

    renderOperators() {
        const container = document.getElementById('operators-list');
        const operators = this.state.wizardData?.existing_operators || [];
        
        if (operators.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="padding: 20px; text-align: center;">
                    <i class="fas fa-user-slash" style="font-size: 32px; color: var(--text-secondary); margin-bottom: 10px;"></i>
                    <p style="color: var(--text-muted); font-size: 13px;">Nessun operatore censito. Aggiungine uno!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = operators.map((op, idx) => `
            <div class="team-member-card" data-operator-id="${op.id || idx}">
                <div class="member-avatar">
                    ${op.name?.charAt(0) || '?'}
                </div>
                <div class="member-info">
                    <h4>${op.name || 'Operatore ' + (idx + 1)}</h4>
                    <p class="member-role">${op.role || 'Non specificato'}</p>
                </div>
                <div style="flex-shrink: 0;">
                    <div class="checkbox-group" style="flex-direction: column; gap: 8px; align-items: flex-start;">
                        <label style="font-size: 11px; margin: 0;">
                            <input type="checkbox" class="ops-toggle" data-op-id="${op.id || idx}" ${op.ops_enabled ? 'checked' : ''}>
                            🔘 Ops Mode
                        </label>
                        <label style="font-size: 11px; margin: 0;">
                            <input type="checkbox" class="compliance-toggle" data-op-id="${op.id || idx}" ${op.compliance_enabled ? 'checked' : ''}>
                            🔘 Compliance
                        </label>
                    </div>
                </div>
            </div>
        `).join('');

        this.state.operators = operators;
    },

    renderAssets() {
        const container = document.getElementById('assets-suggestions');
        const suggestions = this.state.wizardData?.asset_suggestions || [];

        if (suggestions.length === 0) {
            container.innerHTML = `
                <div class="note note-warning">
                    <i class="fas fa-lightbulb"></i>
                    Nessun asset suggerito dall'AI. Puoi aggiungere asset personalizzati.
                </div>
            `;
            return;
        }

        container.innerHTML = suggestions.map((asset, idx) => `
            <div class="form-group" style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <i class="${asset.icon || 'fas fa-cube'}" style="color: var(--primary);"></i>
                    ${asset.name}
                    ${asset.ai_reason ? `<span style="font-size: 10px; color: var(--text-secondary); font-style: italic;">(${asset.ai_reason})</span>` : ''}
                </label>
                
                <!-- Quantity Counter -->
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <button class="btn-icon" onclick="WizardController.decrementAsset('${asset.id}')">-</button>
                    <input type="number" id="asset-qty-${asset.id}" class="asset-qty-input" 
                           value="0" min="0" max="50" 
                           style="width: 60px; text-align: center; font-size: 18px; font-weight: bold;"
                           onchange="WizardController.onAssetQtyChange('${asset.id}')">
                    <button class="btn-icon" onclick="WizardController.incrementAsset('${asset.id}')">+</button>
                </div>

                <!-- Layer Toggles (Appear when qty > 0) -->
                <div id="asset-toggles-${asset.id}" class="hidden" style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 6px;">
                    <div class="checkbox-group" style="flex-direction: column; gap: 8px; align-items: flex-start;">
                        <label style="font-size: 11px; margin: 0;">
                            <input type="checkbox" class="maintenance-toggle" data-asset-id="${asset.id}" ${asset.default_maintenance ? 'checked' : ''}>
                            🔘 Need Maintenance
                        </label>
                        <label style="font-size: 11px; margin: 0;">
                            <input type="checkbox" class="compliance-asset-toggle" data-asset-id="${asset.id}" ${asset.default_compliance ? 'checked' : ''}>
                            🔘 Need Compliance
                        </label>
                    </div>
                </div>
            </div>
        `).join('');

        this.state.assets = suggestions;
    },

    incrementAsset(assetId) {
        const input = document.getElementById(`asset-qty-${assetId}`);
        if (input) {
            input.value = Math.min(parseInt(input.value) + 1, 50);
            this.onAssetQtyChange(assetId);
        }
    },

    decrementAsset(assetId) {
        const input = document.getElementById(`asset-qty-${assetId}`);
        if (input) {
            input.value = Math.max(parseInt(input.value) - 1, 0);
            this.onAssetQtyChange(assetId);
        }
    },

    onAssetQtyChange(assetId) {
        const input = document.getElementById(`asset-qty-${assetId}`);
        const togglesContainer = document.getElementById(`asset-toggles-${assetId}`);
        
        if (input && togglesContainer) {
            const qty = parseInt(input.value);
            if (qty > 0) {
                togglesContainer.classList.remove('hidden');
            } else {
                togglesContainer.classList.add('hidden');
            }
        }
    },

    attachEventListeners() {
        // Generate Infrastructure Button
        document.getElementById('generate-infrastructure-btn')?.addEventListener('click', () => {
            this.generateInfrastructure();
        });

        // Add Operator
        document.getElementById('add-operator-btn')?.addEventListener('click', () => {
            this.addOperator();
        });

        // Add Custom Asset
        document.getElementById('add-custom-asset-btn')?.addEventListener('click', () => {
            this.addCustomAsset();
        });
    },

    async generateInfrastructure() {
        // Collect configuration
        const config = this.collectConfiguration();
        
        // Show loader
        const loader = document.getElementById('loadingOverlay');
        const statusEl = document.getElementById('generation-status');
        loader?.classList.remove('hidden');
        
        try {
            statusEl.textContent = 'Creazione Ghost Assets...';
            await this.delay(1000);

            // Call webhook
            const result = await SmartOrchestrator.callWebhook('generate_infrastructure', {
                vat: this.state.vat,
                configuration: config
            });

            statusEl.textContent = 'Predisposizione calendari Google...';
            await this.delay(1500);

            // Success - Go to Dossier
            localStorage.setItem('generated_resources', JSON.stringify(result.resources));
            window.location.href = `dossier.html?vat=${this.state.vat}`;

        } catch (error) {
            console.error('Infrastructure generation error:', error);
            alert('Errore durante la generazione: ' + error.message);
            loader?.classList.add('hidden');
        }
    },

    collectConfiguration() {
        const config = {
            operators: [],
            assets: []
        };

        // Collect operator settings
        document.querySelectorAll('.ops-toggle').forEach(toggle => {
            const opId = toggle.dataset.opId;
            const operator = this.state.operators.find(o => (o.id || o.name) == opId);
            if (operator) {
                config.operators.push({
                    ...operator,
                    ops_enabled: toggle.checked,
                    compliance_enabled: document.querySelector(`.compliance-toggle[data-op-id="${opId}"]`)?.checked || false
                });
            }
        });

        // Collect asset settings
        this.state.assets.forEach(asset => {
            const qtyInput = document.getElementById(`asset-qty-${asset.id}`);
            const qty = parseInt(qtyInput?.value || 0);
            
            if (qty > 0) {
                config.assets.push({
                    ...asset,
                    quantity: qty,
                    maintenance_enabled: document.querySelector(`.maintenance-toggle[data-asset-id="${asset.id}"]`)?.checked || false,
                    compliance_enabled: document.querySelector(`.compliance-asset-toggle[data-asset-id="${asset.id}"]`)?.checked || false
                });
            }
        });

        return config;
    },

    addOperator() {
        const name = prompt('Nome collaboratore:');
        if (name) {
            const newOp = { id: Date.now(), name, role: 'Collaboratore', ops_enabled: false, compliance_enabled: false };
            this.state.operators.push(newOp);
            this.state.wizardData.existing_operators = this.state.operators;
            this.renderOperators();
        }
    },

    addCustomAsset() {
        const name = prompt('Nome asset:');
        if (name) {
            const newAsset = { 
                id: 'custom_' + Date.now(), 
                name, 
                icon: 'fas fa-cube',
                default_maintenance: true,
                default_compliance: false
            };
            this.state.assets.push(newAsset);
            this.renderAssets();
        }
    },

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram?.WebApp;
    if (tg) { tg.ready(); tg.expand(); }
    
    WizardController.init();
});