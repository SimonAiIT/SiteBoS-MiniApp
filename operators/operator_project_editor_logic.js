// ============================================
// OPERATOR PROJECT EDITOR - LOGIC
// ✅ LOADS PROJECT FROM BACKEND
// ✅ DISPLAYS COMPLETE PROJECT DATA
// ✅ ACTION BUTTONS (SEND, EDIT, DOWNLOAD)
// ============================================

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const WEBHOOK_URL = 'https://trinai.api.workflow.dcmake.it/webhook/d253f855-ce1a-43ee-81aa-38fa11a9d639';

let projectData = null;
let operatorSession = null;

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    operatorSession = initOperatorSession();
    
    // Estrai parametri URL
    const urlParams = new URLSearchParams(window.location.search);
    const vat = urlParams.get('vat');
    const operatorId = urlParams.get('operator');
    const inviteToken = urlParams.get('token');
    
    console.log('📋 URL Params:', { vat, operatorId, inviteToken });
    
    if (!vat || !operatorId || !inviteToken) {
        showAlert('Parametri mancanti. Impossibile caricare il progetto.', 'error');
        setTimeout(() => {
            navigateOperatorWithContext('operator_tasks.html');
        }, 2000);
        return;
    }
    
    await loadProject(vat, operatorId, inviteToken);
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
        
        projectData = data.project;
        
        renderProject(projectData);
        updateProjectStatus(projectData.meta.status);
        
    } catch (error) {
        console.error('Load error:', error);
        showAlert('Errore nel caricamento del progetto', 'error');
        
        // Fallback: mostra errore con opzione di tornare indietro
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
// RENDER PROJECT
// ============================================

function renderProject(project) {
    const container = document.getElementById('project-container');
    
    container.innerHTML = `
        <!-- Meta Info Card -->
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                <div>
                    <h2 style="margin: 0 0 5px 0; font-size: 18px;">${project.meta.quote_id}</h2>
                    <p style="font-size: 12px; color: var(--text-muted); margin: 0;">
                        Creato il ${new Date(project.meta.created_at).toLocaleDateString('it-IT')} da ${project.meta.created_by_operator}
                    </p>
                </div>
                <span class="status-badge" style="background: ${getStatusColor(project.meta.status)};">
                    ${getStatusLabel(project.meta.status)}
                </span>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p style="font-size: 11px; color: var(--text-muted); margin: 0 0 5px 0;">Project ID</p>
                        <p style="font-size: 13px; font-family: monospace; margin: 0;">${project.meta.project_id}</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-size: 11px; color: var(--text-muted); margin: 0 0 5px 0;">Valido fino al</p>
                        <p style="font-size: 13px; margin: 0;">${project.meta.valid_until}</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Customer Context -->
        <div class="card">
            <h3><i class="fas fa-user"></i> Cliente</h3>
            <div style="margin: 15px 0;">
                <p style="margin: 5px 0;"><strong>${project.customer_context.name}</strong></p>
                <p style="font-size: 12px; color: var(--text-muted); margin: 3px 0;">
                    <i class="fas fa-envelope"></i> ${project.customer_context.email}
                </p>
                ${project.customer_context.phone ? `
                    <p style="font-size: 12px; color: var(--text-muted); margin: 3px 0;">
                        <i class="fas fa-phone"></i> ${project.customer_context.phone}
                    </p>
                ` : ''}
            </div>
            <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; border-left: 3px solid var(--primary);">
                <p style="font-size: 13px; margin: 0; line-height: 1.5;">
                    ${project.customer_context.needs_summary}
                </p>
            </div>
        </div>
        
        <!-- Executive Summary -->
        <div class="card">
            <h3><i class="fas fa-lightbulb"></i> ${project.executive_summary.title}</h3>
            <p style="font-size: 14px; line-height: 1.6; margin: 15px 0;">
                ${project.executive_summary.value_proposition}
            </p>
        </div>
        
        <!-- Items -->
        <div class="card">
            <h3><i class="fas fa-tasks"></i> Servizi Proposti</h3>
            ${project.items.map((item, index) => `
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid var(--primary);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                        <h4 style="margin: 0; font-size: 15px;">${item.name}</h4>
                        <span style="font-size: 16px; font-weight: 700; color: var(--primary);">
                            €${item.total.toLocaleString('it-IT')}
                        </span>
                    </div>
                    
                    <p style="font-size: 12px; color: var(--text-muted); margin: 5px 0;">
                        SKU: ${item.sku} | Quantità: ${item.qty}
                    </p>
                    
                    <p style="font-size: 13px; line-height: 1.5; margin: 10px 0;">
                        ${item.description_customized}
                    </p>
                    
                    <div style="margin: 10px 0;">
                        <p style="font-size: 12px; margin: 5px 0;">
                            <i class="fas fa-clock"></i> <strong>Timeline:</strong> ${item.timeline_estimation}
                        </p>
                    </div>
                    
                    <div style="margin: 10px 0;">
                        <p style="font-size: 12px; font-weight: 600; margin: 5px 0;">Milestone:</p>
                        <ul style="margin: 5px 0 0 20px; font-size: 12px; color: var(--text-muted);">
                            ${item.milestones.map(m => `<li style="margin: 3px 0;">${m}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--glass-border);">
                        <p style="font-size: 11px; color: var(--text-muted); margin: 0;">
                            ${item.compliance_trust_badges.join(' • ')}
                        </p>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <!-- Financials -->
        <div class="card" style="background: linear-gradient(135deg, rgba(50, 173, 230, 0.1), rgba(80, 200, 120, 0.1));">
            <h3><i class="fas fa-euro-sign"></i> Riepilogo Economico</h3>
            <div style="margin: 15px 0;">
                <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                    <span>Subtotale:</span>
                    <span style="font-weight: 600;">€${project.financials.subtotal.toLocaleString('it-IT')}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 8px 0; color: var(--text-muted);">
                    <span>IVA (${project.financials.tax_percent}%):</span>
                    <span>€${project.financials.tax_amount.toLocaleString('it-IT')}</span>
                </div>
                <hr style="margin: 15px 0; border: none; border-top: 1px solid var(--glass-border);">
                <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; color: var(--primary);">
                    <span>TOTALE:</span>
                    <span>€${project.financials.grand_total.toLocaleString('it-IT')}</span>
                </div>
            </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="card">
            <div class="btn-container">
                <button class="btn btn-primary btn-block" onclick="sendToCustomer()">
                    <i class="fas fa-paper-plane"></i> Invia al Cliente
                </button>
                <button class="btn btn-secondary btn-block" onclick="editProject()">
                    <i class="fas fa-edit"></i> Modifica Preventivo
                </button>
                <button class="btn btn-block" onclick="downloadPDF()">
                    <i class="fas fa-download"></i> Scarica PDF
                </button>
            </div>
        </div>
    `;
}

// ============================================
// ACTIONS
// ============================================

function sendToCustomer() {
    showAlert('Funzione "Invia al Cliente" in sviluppo', 'info');
    // TODO: Implementa invio email/notifica al cliente
}

function editProject() {
    showAlert('Funzione "Modifica" in sviluppo', 'info');
    // TODO: Abilita modalità edit
}

function downloadPDF() {
    showAlert('Funzione "Download PDF" in sviluppo', 'info');
    // TODO: Genera e scarica PDF
}

// ============================================
// UTILITIES
// ============================================

function updateProjectStatus(status) {
    const statusEl = document.getElementById('project-status');
    statusEl.textContent = getStatusLabel(status);
    statusEl.style.color = getStatusColor(status);
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
    navigateOperatorWithContext('operator_tasks.html');
}