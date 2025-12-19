// ============================================
// OPERATOR PROJECT EDITOR - LOGIC
// ✅ LOADS PROJECT FROM BACKEND
// ✅ DISPLAYS COMPLETE PROJECT DATA
// ✅ FAB ACTIONS WITH API CALLS
// ✅ DISCOUNT CALCULATION
// ✅ INLINE EDITING
// ✅ TAX-INCLUDED TOGGLE (FORFETTARI)
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
let taxIncluded = false; // Forfettari flag

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
// LOAD PROJECT FROM BACKEND
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
// RENDER PROJECT WITH EDITABLE FIELDS
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
                <span class="status-badge" style="background: ${getStatusColor(meta.status || 'draft')};">
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
    
    // Initial financials render
    updateFinancialsUI();
}

// ============================================
// TAX-INCLUDED TOGGLE (FORFETTARI)
// ============================================

function toggleTaxIncluded() {
    taxIncluded = !taxIncluded;
    
    const checkbox = document.getElementById('tax-toggle-checkbox');
    if (taxIncluded) {
        checkbox.classList.add('active');
    } else {
        checkbox.classList.remove('active');
    }
    
    // Recalculate financials
    recalculateFinancials();
    markAsChanged();
}

// ============================================
// DISCOUNT CALCULATION
// ============================================

function calculateDiscountAmount(subtotal, percent) {
    return Math.round((subtotal * percent / 100) * 100) / 100;
}

function applyDiscount() {
    const input = document.getElementById('discount-input');
    discountPercent = parseFloat(input.value) || 0;
    
    if (discountPercent < 0) discountPercent = 0;
    if (discountPercent > 100) discountPercent = 100;
    
    input.value = discountPercent;
    
    recalculateFinancials();
    markAsChanged();
}

function recalculateFinancials() {
    const subtotal = projectData.financials.subtotal;
    const discountAmount = calculateDiscountAmount(subtotal, discountPercent);
    const subtotalAfterDiscount = subtotal - discountAmount;
    
    let taxPercent = taxIncluded ? 0 : (projectData.financials.tax_percent || 22);
    let taxAmount = taxIncluded ? 0 : Math.round((subtotalAfterDiscount * taxPercent / 100) * 100) / 100;
    let grandTotal = Math.round((subtotalAfterDiscount + taxAmount) * 100) / 100;
    
    // Update project data
    projectData.financials.discount_percent = discountPercent;
    projectData.financials.discount_amount = discountAmount;
    projectData.financials.subtotal_after_discount = subtotalAfterDiscount;
    projectData.financials.tax_percent = taxPercent;
    projectData.financials.tax_amount = taxAmount;
    projectData.financials.grand_total = grandTotal;
    projectData.financials.tax_included = taxIncluded;
    
    // Update UI
    updateFinancialsUI();
}

function updateFinancialsUI() {
    const breakdown = document.getElementById('financials-breakdown');
    if (!breakdown) return;
    
    const subtotal = projectData.financials.subtotal;
    const discountAmount = projectData.financials.discount_amount || 0;
    const taxAmount = projectData.financials.tax_amount || 0;
    const taxPercent = projectData.financials.tax_percent || 22;
    const grandTotal = projectData.financials.grand_total;
    
    breakdown.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span>Subtotale:</span>
            <span style="font-weight: 600;">€${subtotal.toLocaleString('it-IT')}</span>
        </div>
        
        ${discountPercent > 0 ? `
        <div style="display: flex; justify-content: space-between; margin: 8px 0; color: #c4b5fd;">
            <span>Sconto (${discountPercent}%):</span>
            <span style="font-weight: 600;">-€${discountAmount.toLocaleString('it-IT')}</span>
        </div>
        ` : ''}
        
        ${taxIncluded ? `
        <div style="display: flex; justify-content: space-between; margin: 8px 0; color: #6ee7b7;">
            <span><i class="fas fa-check-circle"></i> Tasse Incluse:</span>
            <span style="font-weight: 600;">€0</span>
        </div>
        ` : `
        <div style="display: flex; justify-content: space-between; margin: 8px 0; color: var(--text-muted);">
            <span>IVA (${taxPercent}%):</span>
            <span>€${taxAmount.toLocaleString('it-IT')}</span>
        </div>
        `}
        
        <hr style="margin: 15px 0; border: none; border-top: 1px solid var(--glass-border);">
        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; color: var(--primary);">
            <span>TOTALE:</span>
            <span>€${grandTotal.toLocaleString('it-IT')}</span>
        </div>
    `;
}

// ============================================
// INLINE EDITING
// ============================================

function setupEditListeners() {
    document.querySelectorAll('.editable').forEach(el => {
        el.addEventListener('input', () => {
            markAsChanged();
        });
        
        el.addEventListener('blur', function() {
            const field = this.dataset.field;
            const value = this.textContent.trim();
            updateProjectField(field, value);
        });
    });
}

function updateProjectField(field, value) {
    const parts = field.split('.');
    let obj = projectData;
    
    for (let i = 0; i < parts.length - 1; i++) {
        obj = obj[parts[i]];
    }
    
    obj[parts[parts.length - 1]] = value;
}

function markAsChanged() {
    hasChanges = true;
    const saveBtn = document.getElementById('fab-save-btn');
    if (saveBtn) saveBtn.style.display = 'flex';
}

// ============================================
// SAVE CHANGES
// ============================================

async function saveProjectChanges() {
    if (!hasChanges) {
        showAlert('Nessuna modifica da salvare', 'info');
        return;
    }
    
    showLoading(true, 'Salvataggio modifiche...');
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'update_project',
                project_id: projectData.meta?.project_id || projectData.meta?.invite_token,
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
        showAlert('✅ Modifiche salvate con successo!', 'success');
        
    } catch (error) {
        console.error('Save error:', error);
        showAlert('Errore nel salvataggio delle modifiche', 'error');
    } finally {
        showLoading(false);
    }
}

// ============================================
// FAB ACTIONS - API CALLS
// ============================================

async function downloadProjectPDF() {
    if (!projectData) {
        showAlert('Progetto non caricato', 'warning');
        return;
    }
    
    if (!confirm('💾 Scaricare il PDF? Costerà 100 crediti.')) {
        return;
    }
    
    showLoading(true, 'Generazione PDF...');
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'download_project_pdf',
                project_id: projectData.meta?.project_id || projectData.meta?.invite_token,
                vat: currentParams.vat,
                operator_id: currentParams.operatorId,
                invite_token: currentParams.inviteToken
            })
        });
        
        if (!response.ok) throw new Error('PDF generation failed');
        
        const data = await response.json();
        console.log('✅ PDF generated:', data);
        
        showAlert('✅ PDF generato! Controlla i download.', 'success');
        
        if (data.pdf_url) {
            window.open(data.pdf_url, '_blank');
        }
        
    } catch (error) {
        console.error('PDF error:', error);
        showAlert('Errore nella generazione del PDF', 'error');
    } finally {
        showLoading(false);
    }
}

async function sendViaSiteBosMailButton() {
    if (!projectData) {
        showAlert('Progetto non caricato', 'warning');
        return;
    }
    
    if (!confirm('📧 Inviare via SiteBoS Mail al cliente? Costerà 200 crediti.')) {
        return;
    }
    
    showLoading(true, 'Invio email...');
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'send_project_sitebos_mail',
                project_id: projectData.meta?.project_id || projectData.meta?.invite_token,
                vat: currentParams.vat,
                operator_id: currentParams.operatorId,
                invite_token: currentParams.inviteToken,
                customer_email: projectData.customer_context?.email
            })
        });
        
        if (!response.ok) throw new Error('Email send failed');
        
        const data = await response.json();
        console.log('✅ Email sent:', data);
        
        showAlert(`✅ Email inviata a ${projectData.customer_context?.email}!`, 'success');
        
    } catch (error) {
        console.error('Email error:', error);
        showAlert('Errore nell\'invio dell\'email', 'error');
    } finally {
        showLoading(false);
    }
}

async function sendToAppButton() {
    if (!projectData) {
        showAlert('Progetto non caricato', 'warning');
        return;
    }
    
    if (!confirm('📱 Inviare il progetto sull\'App del cliente? (Gratuito)')) {
        return;
    }
    
    showLoading(true, 'Invio su App...');
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'send_project_to_app',
                project_id: projectData.meta?.project_id || projectData.meta?.invite_token,
                vat: currentParams.vat,
                operator_id: currentParams.operatorId,
                invite_token: currentParams.inviteToken
            })
        });
        
        if (!response.ok) throw new Error('App send failed');
        
        const data = await response.json();
        console.log('✅ Sent to app:', data);
        
        showAlert('✅ Progetto inviato sull\'App del cliente!', 'success');
        
    } catch (error) {
        console.error('App send error:', error);
        showAlert('Errore nell\'invio sull\'App', 'error');
    } finally {
        showLoading(false);
    }
}

// ============================================
// UTILITIES
// ============================================

function updateProjectStatus(status) {
    const statusEl = document.getElementById('project-status');
    if (statusEl) {
        statusEl.textContent = getStatusLabel(status);
        statusEl.style.color = getStatusColor(status);
    }
}

function getStatusColor(status) {
    const colors = {
        'draft': '#f59e0b',
        'pending': '#3b82f6',
        'approved': '#10b981',
        'in_progress': '#8b5cf6',
        'completed': '#059669',
        'cancelled': '#ef4444',
        'expired': '#6b7280'
    };
    return colors[status] || '#6b7280';
}

function getStatusLabel(status) {
    const labels = {
        'draft': 'Bozza',
        'pending': 'In Attesa',
        'approved': 'Approvato',
        'in_progress': 'In Corso',
        'completed': 'Completato',
        'cancelled': 'Annullato',
        'expired': 'Scaduto'
    };
    return labels[status] || 'Sconosciuto';
}

function showLoading(show, text = 'Elaborazione...') {
    const overlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loading-text');
    
    if (show) {
        loadingText.textContent = text;
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

function showAlert(message, type = 'info', duration = 3000) {
    const existing = document.querySelector('.custom-alert');
    if (existing) existing.remove();
    
    const alert = document.createElement('div');
    alert.className = 'custom-alert';
    alert.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px);
        z-index: 10000; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px;
        padding: 15px 20px; min-width: 280px; max-width: 90%;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4); transition: transform 0.3s;
        display: flex; align-items: center; gap: 12px;
    `;
    
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const borderColors = { success: '#4cd964', error: '#ff6b6b', warning: '#f59e0b', info: '#32ade6' };
    alert.style.borderLeft = `4px solid ${borderColors[type] || borderColors.info}`;
    
    alert.innerHTML = `
        <span style="font-size: 20px;">${icons[type] || icons.info}</span>
        <span style="flex: 1; font-size: 14px; color: #fff; line-height: 1.4;">${message}</span>
    `;
    
    document.body.appendChild(alert);
    setTimeout(() => alert.style.transform = 'translateX(-50%) translateY(0)', 10);
    
    setTimeout(() => {
        alert.style.transform = 'translateX(-50%) translateY(-100px)';
        setTimeout(() => alert.remove(), 300);
    }, duration);
}

function goBack() {
    if (hasChanges) {
        if (!confirm('Ci sono modifiche non salvate. Vuoi davvero uscire?')) {
            return;
        }
    }
    navigateOperatorWithContext('operator_tasks.html');
}