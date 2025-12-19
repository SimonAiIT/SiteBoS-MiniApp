// ============================================
// OPERATOR PROJECT EDITOR - LOGIC
// ✅ COMPLETE VERSION WITH FULL RENDERING
// ============================================

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const WEBHOOK_URL = 'https://trinai.api.workflow.dcmake.it/webhook/d253f855-ce1a-43ee-81aa-38fa11a9d639';

let projectData = null;
let operatorSession = null;
let currentParams = { vat: null, operatorId: null, inviteToken: null };
let hasChanges = false;
let discountPercent = 0;
let taxIncluded = false;

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    operatorSession = initOperatorSession();
    
    const urlParams = new URLSearchParams(window.location.search);
    currentParams.vat = urlParams.get('vat');
    currentParams.operatorId = urlParams.get('operator');
    currentParams.inviteToken = urlParams.get('token');
    
    console.log('📋 URL Params:', currentParams);
    
    if (!currentParams.vat || !currentParams.operatorId || !currentParams.inviteToken) {
        showAlert('Parametri mancanti. Impossibile caricare il progetto.', 'error');
        setTimeout(() => {
            navigateOperatorWithContext('operator_tasks.html');
        }, 2000);
        return;
    }
    
    await loadProject(currentParams.vat, currentParams.operatorId, currentParams.inviteToken);
});

// ============================================
// LOAD PROJECT
// ============================================

async function loadProject(vat, operatorId, inviteToken) {
    showLoading(true, 'Caricamento progetto...');
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'get_project',
                vat: vat,
                operator_id: operatorId,
                invite_token: inviteToken
            })
        });
        
        if (!response.ok) throw new Error('Failed to load project');
        
        const data = await response.json();
        console.log('✅ Project loaded:', data);
        
        projectData = data.project || data.projects;
        
        if (!projectData) {
            throw new Error('No project data in response');
        }
        
        discountPercent = projectData.financials?.discount_percent || 0;
        taxIncluded = projectData.financials?.tax_included || false;
        
        renderProject(projectData);
        updateProjectStatus(projectData.meta?.status || 'draft');
        setupEditListeners();
        
    } catch (error) {
        console.error('Load error:', error);
        showAlert('Errore nel caricamento del progetto', 'error');
        
        const container = document.getElementById('project-container');
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--error);">
                <i class="fas fa-exclamation-triangle" style="font-size: 64px; margin-bottom: 20px; display: block;"></i>
                <h3>Impossibile Caricare il Progetto</h3>
                <p style="margin: 20px 0;">Il progetto potrebbe non essere ancora stato salvato o ci sono problemi di connessione.</p>
                <button class="btn btn-secondary" onclick="goBack()">
                    <i class="fas fa-arrow-left"></i> Torna Indietro
                </button>
            </div>
        `;
    } finally {
        showLoading(false);
    }
}

// ============================================
// RENDER PROJECT - COMPLETE FUNCTION
// ============================================

function renderProject(project) {
    const container = document.getElementById('project-container');
    
    const meta = project.meta || {};
    const customer = project.customer_context || {};
    const summary = project.executive_summary || {};
    const items = project.items || [];
    const financials = project.financials || {};
    
    container.innerHTML = `
        <!-- Meta Info Card -->
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                <div>
                    <h2 style="margin: 0 0 5px 0; font-size: 18px;" class="editable" contenteditable="true" data-field="meta.quote_id">${meta.quote_id || 'N/A'}</h2>
                    <p style="font-size: 12px; color: var(--text-muted); margin: 0;">
                        Creato il ${meta.created_at ? new Date(meta.created_at).toLocaleDateString('it-IT') : 'N/A'} da ${meta.created_by_operator || 'Operatore'}
                    </p>
                </div>
                <span class="badge badge-${meta.status || 'wip'}" style="background: ${getStatusColor(meta.status || 'draft')};">
                    ${getStatusLabel(meta.status || 'draft')}
                </span>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p style="font-size: 11px; color: var(--text-muted); margin: 0 0 5px 0;">Project ID</p>
                        <p style="font-size: 13px; font-family: monospace; margin: 0;">${meta.project_id || meta.invite_token || 'N/A'}</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-size: 11px; color: var(--text-muted); margin: 0 0 5px 0;">Valido fino al</p>
                        <p style="font-size: 13px; margin: 0;">${meta.valid_until || 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Customer Context -->
        <div class="card">
            <h3><i class="fas fa-user"></i> Cliente</h3>
            <div style="margin: 15px 0;">
                <p style="margin: 5px 0;"><strong>${customer.name || 'N/A'}</strong></p>
                <p style="font-size: 12px; color: var(--text-muted); margin: 3px 0;">
                    <i class="fas fa-envelope"></i> ${customer.email || 'N/A'}
                </p>
                ${customer.phone ? `
                    <p style="font-size: 12px; color: var(--text-muted); margin: 3px 0;">
                        <i class="fas fa-phone"></i> ${customer.phone}
                    </p>
                ` : ''}
            </div>
            <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; border-left: 3px solid var(--primary);">
                <p class="editable" contenteditable="true" data-field="customer_context.needs_summary" style="font-size: 13px; margin: 0; line-height: 1.5;">
                    ${customer.needs_summary || 'N/A'}
                </p>
            </div>
        </div>
        
        <!-- Executive Summary -->
        <div class="card">
            <h3><i class="fas fa-lightbulb"></i> <span class="editable" contenteditable="true" data-field="executive_summary.title">${summary.title || 'Riepilogo Esecutivo'}</span></h3>
            <p class="editable" contenteditable="true" data-field="executive_summary.value_proposition" style="font-size: 14px; line-height: 1.6; margin: 15px 0;">
                ${summary.value_proposition || 'N/A'}
            </p>
        </div>
        
        <!-- Items -->
        <div class="card">
            <h3><i class="fas fa-tasks"></i> Servizi Proposti</h3>
            ${items.length > 0 ? items.map((item, index) => `
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid var(--primary);" data-item-index="${index}">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                        <h4 class="editable" contenteditable="true" data-field="items.${index}.name" style="margin: 0; font-size: 15px;">${item.name || item.short_name || 'Servizio'}</h4>
                        <span style="font-size: 16px; font-weight: 700; color: var(--primary);">
                            €${(item.total || 0).toLocaleString('it-IT')}
                        </span>
                    </div>
                    
                    <p style="font-size: 12px; color: var(--text-muted); margin: 5px 0;">
                        SKU: ${item.sku || 'N/A'} | Quantità: ${item.qty || 1}
                    </p>
                    
                    <p class="editable" contenteditable="true" data-field="items.${index}.description_customized" style="font-size: 13px; line-height: 1.5; margin: 10px 0;">
                        ${item.description_customized || item.description || 'N/A'}
                    </p>
                    
                    ${item.timeline_estimation ? `
                        <div style="margin: 10px 0;">
                            <p style="font-size: 12px; margin: 5px 0;">
                                <i class="fas fa-clock"></i> <strong>Timeline:</strong> <span class="editable" contenteditable="true" data-field="items.${index}.timeline_estimation">${item.timeline_estimation}</span>
                            </p>
                        </div>
                    ` : ''}
                    
                    ${item.milestones && item.milestones.length > 0 ? `
                        <div style="margin: 10px 0;">
                            <p style="font-size: 12px; font-weight: 600; margin: 5px 0;">Milestone:</p>
                            <ul style="margin: 5px 0 0 20px; font-size: 12px; color: var(--text-muted);">
                                ${item.milestones.map((m, mi) => `
                                    <li class="editable" contenteditable="true" data-field="items.${index}.milestones.${mi}" style="margin: 3px 0;">${m}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${item.compliance_trust_badges && item.compliance_trust_badges.length > 0 ? `
                        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--glass-border);">
                            <p style="font-size: 11px; color: var(--text-muted); margin: 0;">
                                ${item.compliance_trust_badges.join(' • ')}
                            </p>
                        </div>
                    ` : ''}
                </div>
            `).join('') : '<p style="color: var(--text-muted);">Nessun servizio trovato</p>'}
        </div>
        
        <!-- Financials with Discount & Tax Toggle -->
        <div class="card" style="background: linear-gradient(135deg, rgba(50, 173, 230, 0.1), rgba(80, 200, 120, 0.1));">
            <h3><i class="fas fa-euro-sign"></i> Riepilogo Economico</h3>
            
            <!-- Tax Included Toggle -->
            <div class="tax-toggle" onclick="toggleTaxIncluded()">
                <i class="fas fa-file-invoice" style="color: #6ee7b7; font-size: 18px;"></i>
                <span class="tax-toggle-label">Tasse Incluse (Forfettari)</span>
                <div class="tax-toggle-checkbox ${taxIncluded ? 'active' : ''}" id="tax-toggle-checkbox">
                    <div class="tax-toggle-slider"></div>
                </div>
            </div>
            
            <!-- Discount Input -->
            <div class="discount-input">
                <i class="fas fa-percent" style="color: #c4b5fd; font-size: 18px;"></i>
                <span class="discount-label">Sconto:</span>
                <input type="number" id="discount-input" min="0" max="100" step="0.1" value="${discountPercent}" onchange="applyDiscount()">
                <span style="color: var(--text-muted); font-size: 14px;">%</span>
            </div>
            
            <div style="margin: 15px 0;" id="financials-breakdown">
                <!-- Will be populated by updateFinancialsUI() -->
            </div>
        </div>
    `;
    
    updateFinancialsUI();
}

// ============================================
// TAX TOGGLE & DISCOUNT
// ============================================

function toggleTaxIncluded() {
    taxIncluded = !taxIncluded;
    
    const checkbox = document.getElementById('tax-toggle-checkbox');
    if (taxIncluded) {
        checkbox.classList.add('active');
    } else {
        checkbox.classList.remove('active');
    }
    
    recalculateFinancials();
    markAsChanged();
}

function calculateDiscountAmount(subtotal, percent) {
    return (subtotal * percent) / 100;
}

function applyDiscount() {
    const input = document.getElementById('discount-input');
    const newPercent = parseFloat(input.value) || 0;
    
    if (newPercent < 0 || newPercent > 100) {
        showAlert('Lo sconto deve essere tra 0 e 100%', 'warning');
        input.value = discountPercent;
        return;
    }
    
    discountPercent = newPercent;
    recalculateFinancials();
    markAsChanged();
}

function recalculateFinancials() {
    if (!projectData || !projectData.financials) return;
    
    const f = projectData.financials;
    const subtotal = f.subtotal || 0;
    
    const discountAmount = calculateDiscountAmount(subtotal, discountPercent);
    const subtotalAfterDiscount = subtotal - discountAmount;
    
    let taxPercent = 0;
    let taxAmount = 0;
    let grandTotal = subtotalAfterDiscount;
    
    if (!taxIncluded) {
        taxPercent = f.tax_percent || 22;
        taxAmount = (subtotalAfterDiscount * taxPercent) / 100;
        grandTotal = subtotalAfterDiscount + taxAmount;
    }
    
    projectData.financials.discount_percent = discountPercent;
    projectData.financials.discount_amount = discountAmount;
    projectData.financials.subtotal_after_discount = subtotalAfterDiscount;
    projectData.financials.tax_percent = taxPercent;
    projectData.financials.tax_amount = taxAmount;
    projectData.financials.tax_included = taxIncluded;
    projectData.financials.grand_total = grandTotal;
    
    updateFinancialsUI();
}

function updateFinancialsUI() {
    const f = projectData.financials;
    const container = document.getElementById('financials-breakdown');
    
    if (!container) return;
    
    const subtotal = f.subtotal || 0;
    const discountAmount = f.discount_amount || 0;
    const subtotalAfterDiscount = f.subtotal_after_discount || subtotal;
    const taxAmount = f.tax_amount || 0;
    const grandTotal = f.grand_total || subtotal;
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--glass-border);">
            <span style="color: var(--text-muted);">Subtotale:</span>
            <span style="font-weight: 700;">€${subtotal.toLocaleString('it-IT', {minimumFractionDigits: 2})}</span>
        </div>
        
        ${discountPercent > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--glass-border);">
                <span style="color: #c4b5fd;">Sconto (${discountPercent}%):</span>
                <span style="font-weight: 700; color: #c4b5fd;">-€${discountAmount.toLocaleString('it-IT', {minimumFractionDigits: 2})}</span>
            </div>
        ` : ''}
        
        ${taxIncluded ? `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--glass-border);">
                <span style="color: #6ee7b7;">✅ Tasse Incluse:</span>
                <span style="font-weight: 700; color: #6ee7b7;">€0,00</span>
            </div>
        ` : `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--glass-border);">
                <span style="color: var(--text-muted);">IVA (${f.tax_percent || 22}%):</span>
                <span style="font-weight: 700;">€${taxAmount.toLocaleString('it-IT', {minimumFractionDigits: 2})}</span>
            </div>
        `}
        
        <div style="display: flex; justify-content: space-between; padding: 15px 0; margin-top: 10px;">
            <span style="font-size: 18px; font-weight: 700;">TOTALE:</span>
            <span style="font-size: 22px; font-weight: 700; color: var(--success);">€${grandTotal.toLocaleString('it-IT', {minimumFractionDigits: 2})}</span>
        </div>
    `;
}

// ============================================
// EDITING & SAVING
// ============================================

function setupEditListeners() {
    const editables = document.querySelectorAll('.editable');
    editables.forEach(el => {
        el.addEventListener('blur', (e) => {
            const field = e.target.dataset.field;
            const value = e.target.textContent.trim();
            updateProjectField(field, value);
        });
    });
}

function updateProjectField(field, value) {
    const keys = field.split('.');
    let obj = projectData;
    
    for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
    }
    
    obj[keys[keys.length - 1]] = value;
    markAsChanged();
}

function markAsChanged() {
    hasChanges = true;
    const saveBtn = document.getElementById('fab-save-btn');
    if (saveBtn) saveBtn.style.display = 'flex';
}

async function saveProjectChanges() {
    if (!hasChanges) {
        showAlert('Nessuna modifica da salvare', 'info');
        return;
    }
    
    showLoading(true, 'Salvataggio...');
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'update_project',
                vat: currentParams.vat,
                operator_id: currentParams.operatorId,
                invite_token: currentParams.inviteToken,
                project: projectData
            })
        });
        
        if (!response.ok) throw new Error('Save failed');
        
        const data = await response.json();
        console.log('✅ Project saved:', data);
        
        hasChanges = false;
        const saveBtn = document.getElementById('fab-save-btn');
        if (saveBtn) saveBtn.style.display = 'none';
        
        showAlert('✅ Modifiche salvate!', 'success');
        
    } catch (error) {
        console.error('Save error:', error);
        showAlert('Errore nel salvataggio', 'error');
    } finally {
        showLoading(false);
    }
}

// ============================================
// SEND TO APP (SIMPLIFIED)
// ============================================

async function sendToAppButton() {
    if (!projectData) {
        showAlert('Progetto non caricato', 'warning');
        return;
    }
    
    showLoading(true, 'Invio su App Cliente...');
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'send_project_to_app',
                project_id: projectData.meta?.project_id || projectData.meta?.invite_token,
                vat: currentParams.vat,
                operator_id: currentParams.operatorId,
                invite_token: currentParams.inviteToken,
                project: projectData
            })
        });
        
        if (!response.ok) throw new Error('App send failed');
        
        const data = await response.json();
        console.log('✅ Sent to app:', data);
        
        if (!data.html) {
            throw new Error('No HTML in response');
        }
        
        projectData.meta.status = 'pending';
        updateProjectStatus('pending');
        
        openHTMLViewer(data.html);
        
        showAlert('✅ Progetto inviato sull\'App del cliente!', 'success');
        
    } catch (error) {
        console.error('App send error:', error);
        showAlert('Errore nell\'invio sull\'App', 'error');
    } finally {
        showLoading(false);
    }
}

function openHTMLViewer(htmlContent) {
    const modal = document.getElementById('html-viewer-modal');
    const iframe = document.getElementById('preview-iframe');
    
    modal.classList.add('open');
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();
}

function closeHTMLViewer() {
    const modal = document.getElementById('html-viewer-modal');
    modal.classList.remove('open');
    
    setTimeout(() => {
        location.reload();
    }, 300);
}

// ============================================
// OTHER FAB ACTIONS
// ============================================

async function downloadProjectPDF() {
    showAlert('Funzione PDF in sviluppo (costa 100 crediti)', 'info');
}

async function sendViaSiteBosMailButton() {
    showAlert('Funzione SiteBoS Mail in sviluppo (costa 200 crediti)', 'info');
}

// ============================================
// UTILITIES
// ============================================

function updateProjectStatus(status) {
    const statusEl = document.getElementById('project-status');
    if (statusEl) {
        statusEl.textContent = `Status: ${getStatusLabel(status)}`;
    }
}

function getStatusColor(status) {
    const colors = {
        'draft': 'rgba(245, 158, 11, 0.2)',
        'pending': 'rgba(59, 130, 246, 0.2)',
        'approved': 'rgba(16, 185, 129, 0.2)',
        'rejected': 'rgba(239, 68, 68, 0.2)'
    };
    return colors[status] || colors.draft;
}

function getStatusLabel(status) {
    const labels = {
        'draft': 'Bozza',
        'pending': 'In Attesa',
        'approved': 'Approvato',
        'rejected': 'Rifiutato'
    };
    return labels[status] || status;
}

function showLoading(show, text = 'Caricamento...') {
    const overlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loading-text');
    
    if (show) {
        overlay.classList.remove('hidden');
        if (loadingText) loadingText.textContent = text;
    } else {
        overlay.classList.add('hidden');
    }
}

function showAlert(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    if (tg && tg.showAlert) {
        tg.showAlert(message);
    } else {
        alert(message);
    }
}

function goBack() {
    if (hasChanges) {
        if (!confirm('Ci sono modifiche non salvate. Vuoi davvero uscire?')) {
            return;
        }
    }
    navigateOperatorWithContext('operator_tasks.html');
}