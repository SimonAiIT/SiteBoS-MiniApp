// ============================================
// OPERATOR PROJECT EDITOR - LOGIC
// ✅ LOADS PROJECT FROM BACKEND
// ✅ DISPLAYS COMPLETE PROJECT DATA
// ✅ FAB ACTIONS WITH API CALLS
// ✅ DISCOUNT CALCULATION
// ✅ INLINE EDITING
// ✅ TAX-INCLUDED TOGGLE (FORFETTARI)
// ✅ HTML PREVIEW VIEWER
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
let previewHTML = null; // Store preview HTML

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
// (Same as before - keeping existing render logic)
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
    
    updateFinancialsUI();
}

// ... (Keep all existing functions: toggleTaxIncluded, applyDiscount, etc.) ...
// For brevity, I'll add only the new HTML viewer functions at the end

// ============================================
// (EXISTING FUNCTIONS - NOT SHOWN FOR BREVITY)
// - toggleTaxIncluded()
// - calculateDiscountAmount()
// - applyDiscount()
// - recalculateFinancials()
// - updateFinancialsUI()
// - setupEditListeners()
// - updateProjectField()
// - markAsChanged()
// - saveProjectChanges()
// - downloadProjectPDF()
// - sendViaSiteBosMailButton()
// - getStatusColor() / getStatusLabel()
// - showLoading() / showAlert() / goBack()
// ============================================

// ============================================
// HTML PREVIEW VIEWER
// ============================================

async function sendToAppButton() {
    if (!projectData) {
        showAlert('Progetto non caricato', 'warning');
        return;
    }
    
    showLoading(true, 'Generazione anteprima...');
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'preview_project_html',
                project_id: projectData.meta?.project_id || projectData.meta?.invite_token,
                vat: currentParams.vat,
                operator_id: currentParams.operatorId,
                invite_token: currentParams.inviteToken,
                project: projectData
            })
        });
        
        if (!response.ok) throw new Error('Preview generation failed');
        
        const data = await response.json();
        console.log('✅ Preview HTML received:', data);
        
        if (!data.html) {
            throw new Error('No HTML in response');
        }
        
        previewHTML = data.html;
        openHTMLViewer(previewHTML);
        
    } catch (error) {
        console.error('Preview error:', error);
        showAlert('Errore nella generazione dell\'anteprima', 'error');
    } finally {
        showLoading(false);
    }
}

function openHTMLViewer(htmlContent) {
    const modal = document.getElementById('html-viewer-modal');
    const iframe = document.getElementById('preview-iframe');
    
    modal.classList.add('open');
    
    // Write HTML to iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();
}

function closeHTMLViewer() {
    const modal = document.getElementById('html-viewer-modal');
    modal.classList.remove('open');
}

async function confirmSendToApp() {
    if (!projectData) return;
    
    closeHTMLViewer();
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
                invite_token: currentParams.inviteToken,
                project: projectData,
                html: previewHTML
            })
        });
        
        if (!response.ok) throw new Error('App send failed');
        
        const data = await response.json();
        console.log('✅ Sent to app:', data);
        
        // Update status to pending
        projectData.meta.status = 'pending';
        updateProjectStatus('pending');
        
        showAlert('✅ Progetto inviato sull\'App del cliente!', 'success');
        
        // Refresh dopo 2 secondi
        setTimeout(() => {
            location.reload();
        }, 2000);
        
    } catch (error) {
        console.error('App send error:', error);
        showAlert('Errore nell\'invio sull\'App', 'error');
    } finally {
        showLoading(false);
    }
}

// Keep all other existing utility functions...
// (Not re-pasting for brevity, they remain unchanged)