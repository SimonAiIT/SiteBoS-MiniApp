/**
 * DOSSIER ENRICHMENT LOGIC
 * Fase C: Triage - Completamento informazioni risorse
 */

const DossierController = {
    state: {
        vat: null,
        resources: [],
        currentResource: null,
        completedCount: 0
    },

    async init() {
        // Get VAT
        const params = new URLSearchParams(window.location.search);
        this.state.vat = params.get('vat') || localStorage.getItem('userVAT');

        // Get generated resources
        const storedResources = localStorage.getItem('generated_resources');
        if (storedResources) {
            this.state.resources = JSON.parse(storedResources);
        } else {
            // Fallback: fetch from backend
            await this.fetchResources();
        }

        this.renderDashboard();
        this.attachEventListeners();
    },

    async fetchResources() {
        try {
            const result = await SmartOrchestrator.callWebhook('get_draft_resources', {
                vat: this.state.vat
            });
            this.state.resources = result.resources || [];
        } catch (error) {
            console.error('Fetch resources error:', error);
        }
    },

    renderDashboard() {
        const container = document.getElementById('resources-dashboard');
        
        if (this.state.resources.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>Nessuna risorsa da configurare</p>
                    <button class="btn" onclick="window.history.back()">
                        <i class="fas fa-arrow-left"></i> Torna indietro
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.state.resources.map(resource => {
            const status = resource.status || 'draft';
            const statusColors = {
                draft: { icon: 'fa-edit', color: 'var(--warning)', text: 'Incompleto' },
                ready: { icon: 'fa-check-circle', color: 'var(--success)', text: 'Completo' },
                error: { icon: 'fa-exclamation-circle', color: 'var(--error)', text: 'Errore' }
            };
            const s = statusColors[status];

            return `
                <div class="card" style="margin-bottom: 15px; border-left: 4px solid ${s.color};">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                <i class="${resource.type === 'human' ? 'fas fa-user' : 'fas fa-cube'}" style="color: var(--primary); font-size: 20px;"></i>
                                <h3 style="margin: 0;">${resource.name}</h3>
                            </div>
                            <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 10px;">
                                ${resource.category || 'N/A'} • ${resource.type === 'human' ? 'Risorsa Umana' : 'Asset Fisico'}
                            </p>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <i class="fas ${s.icon}" style="color: ${s.color};"></i>
                                <span style="font-size: 12px; font-weight: 600; color: ${s.color};">${s.text}</span>
                            </div>
                        </div>
                        <div>
                            ${status === 'draft' ? `
                                <button class="btn btn-sm" onclick="DossierController.openDossier('${resource.id}')">
                                    <i class="fas fa-edit"></i> Completa
                                </button>
                            ` : `
                                <button class="btn btn-secondary btn-sm" onclick="DossierController.viewDossier('${resource.id}')">
                                    <i class="fas fa-eye"></i> Visualizza
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Update completed count
        this.state.completedCount = this.state.resources.filter(r => r.status === 'ready').length;
        
        // Enable/Disable activate button
        const activateBtn = document.getElementById('activate-all-btn');
        if (activateBtn) {
            activateBtn.disabled = this.state.completedCount === 0;
        }
    },

    openDossier(resourceId) {
        const resource = this.state.resources.find(r => r.id === resourceId);
        if (!resource) return;

        this.state.currentResource = resource;
        
        // Populate modal title
        document.getElementById('modal-title').textContent = `Dossier: ${resource.name}`;
        
        // Populate existing data if any
        this.populateModalFields(resource);
        
        // Show modal
        document.getElementById('dossier-modal').classList.remove('hidden');
    },

    viewDossier(resourceId) {
        // Same as openDossier but in readonly mode (future enhancement)
        this.openDossier(resourceId);
    },

    closeModal() {
        document.getElementById('dossier-modal').classList.add('hidden');
        this.state.currentResource = null;
    },

    populateModalFields(resource) {
        // Identity
        document.getElementById('dossier-name').value = resource.specific_name || '';
        document.getElementById('dossier-brand').value = resource.brand || '';
        document.getElementById('dossier-model').value = resource.model || '';
        document.getElementById('dossier-serial').value = resource.serial || '';
        document.getElementById('dossier-install-date').value = resource.install_date || '';
        
        // Capacity
        document.getElementById('dossier-slots').value = resource.slots || 1;
        document.getElementById('dossier-hours').value = resource.specific_hours || '';
        document.getElementById('dossier-capacity-notes').value = resource.capacity_notes || '';
        
        // Health
        document.getElementById('dossier-routine-task').value = resource.routine_task || '';
        document.getElementById('dossier-routine-freq').value = resource.routine_freq || '';
        document.getElementById('dossier-routine-duration').value = resource.routine_duration || 30;
        document.getElementById('dossier-deadline-type').value = resource.deadline_type || '';
        document.getElementById('dossier-deadline-date').value = resource.deadline_date || '';
    },

    async saveDossier() {
        if (!this.state.currentResource) return;

        // Collect form data
        const dossierData = {
            resource_id: this.state.currentResource.id,
            identity: {
                specific_name: document.getElementById('dossier-name').value,
                brand: document.getElementById('dossier-brand').value,
                model: document.getElementById('dossier-model').value,
                serial: document.getElementById('dossier-serial').value,
                install_date: document.getElementById('dossier-install-date').value
            },
            capacity: {
                slots: parseInt(document.getElementById('dossier-slots').value),
                specific_hours: document.getElementById('dossier-hours').value,
                notes: document.getElementById('dossier-capacity-notes').value
            },
            health: {
                routine_task: document.getElementById('dossier-routine-task').value,
                routine_freq: document.getElementById('dossier-routine-freq').value,
                routine_duration: parseInt(document.getElementById('dossier-routine-duration').value),
                deadline_type: document.getElementById('dossier-deadline-type').value,
                deadline_date: document.getElementById('dossier-deadline-date').value
            }
        };

        // Validation
        if (!dossierData.identity.specific_name) {
            alert('Il nome specifico è obbligatorio!');
            return;
        }
        if (!dossierData.capacity.slots || dossierData.capacity.slots < 1) {
            alert('Specificare almeno 1 slot!');
            return;
        }

        // Show loader
        document.getElementById('loadingOverlay')?.classList.remove('hidden');

        try {
            // Call webhook to save and activate
            const result = await SmartOrchestrator.callWebhook('complete_dossier', {
                vat: this.state.vat,
                dossier: dossierData
            });

            // Update local resource
            const resourceIndex = this.state.resources.findIndex(r => r.id === this.state.currentResource.id);
            if (resourceIndex !== -1) {
                this.state.resources[resourceIndex] = {
                    ...this.state.resources[resourceIndex],
                    ...dossierData.identity,
                    ...dossierData.capacity,
                    ...dossierData.health,
                    status: 'ready'
                };
            }

            // Save to localStorage
            localStorage.setItem('generated_resources', JSON.stringify(this.state.resources));

            // Close modal and refresh
            this.closeModal();
            this.renderDashboard();

            // Success feedback
            if (window.Telegram?.WebApp?.showAlert) {
                window.Telegram.WebApp.showAlert('✅ Risorsa attivata con successo!');
            } else {
                alert('✅ Risorsa attivata con successo!');
            }

        } catch (error) {
            console.error('Save dossier error:', error);
            alert('❌ Errore durante il salvataggio: ' + error.message);
        } finally {
            document.getElementById('loadingOverlay')?.classList.add('hidden');
        }
    },

    async activateAll() {
        if (this.state.completedCount === 0) return;

        const confirm = window.confirm(`Confermi di voler attivare tutte le ${this.state.completedCount} risorse complete?`);
        if (!confirm) return;

        document.getElementById('loadingOverlay')?.classList.remove('hidden');

        try {
            await SmartOrchestrator.callWebhook('activate_all_resources', {
                vat: this.state.vat
            });

            // Success - Go to operational view
            window.location.href = `calendar.html?vat=${this.state.vat}`;

        } catch (error) {
            console.error('Activate all error:', error);
            alert('Errore durante l\'attivazione: ' + error.message);
            document.getElementById('loadingOverlay')?.classList.add('hidden');
        }
    },

    attachEventListeners() {
        // Tab switching
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Update tab styles
                document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update content visibility
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.getElementById(`tab-${targetTab}`)?.classList.add('active');
            });
        });

        // Save dossier
        document.getElementById('save-dossier-btn')?.addEventListener('click', () => {
            this.saveDossier();
        });

        // Activate all
        document.getElementById('activate-all-btn')?.addEventListener('click', () => {
            this.activateAll();
        });
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram?.WebApp;
    if (tg) { tg.ready(); tg.expand(); }
    
    DossierController.init();
});