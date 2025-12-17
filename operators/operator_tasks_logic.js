// ============================================
// OPERATOR TASKS - LOGIC
// URL-as-source-of-truth: chat_id and vat must persist!
// ============================================

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const WEBHOOK_URL = 'https://trinai.api.workflow.dcmake.it/webhook/d253f855-ce1a-43ee-81aa-38fa11a9d639';

let allTasks = [];
let currentFilter = 'all';
let searchQuery = '';
let operatorSession = null;

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // ✅ CRITICAL: Initialize operator session from URL
    operatorSession = initOperatorSession();
    
    if (!operatorSession) {
        console.error('No operator session found in URL!');
        tg.showAlert('Sessione non valida. Parametri URL mancanti (chat_id, vat).');
        // Continue anyway for demo purposes
    } else {
        console.log('✅ Operator session loaded:', operatorSession);
    }
    
    setupEventListeners();
    await loadTasks();
});

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderTasks();
    });

    // Filter tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderTasks();
        });
    });

    // FAB Create - ✅ FIX: Navigate WITH context!
    document.getElementById('fab-create').addEventListener('click', () => {
        navigateOperatorWithContext('operator_task_create.html');
    });
}

// ============================================
// DATA LOADING
// ============================================

async function loadTasks() {
    showLoading(true);

    try {
        const userId = tg.initDataUnsafe?.user?.id || operatorSession?.chat_id || 'demo_user';
        
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'get_tasks',
                operator_id: userId,
                vat: operatorSession?.vat || null
            })
        });

        if (!response.ok) throw new Error('Errore nel recupero tasks');

        const data = await response.json();
        allTasks = data.tasks || [];

        renderTasks();

    } catch (error) {
        console.error('Error loading tasks:', error);
        tg.showAlert('Errore nel caricamento delle missioni. Riprova.');
        allTasks = getDemoTasks(); // Fallback to demo data
        renderTasks();
    } finally {
        showLoading(false);
    }
}

// ============================================
// RENDERING
// ============================================

function renderTasks() {
    const container = document.getElementById('tasks-container');
    const emptyState = document.getElementById('empty-state');
    
    // Filter tasks
    let filteredTasks = allTasks;

    // Apply type filter
    if (currentFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.type === currentFilter);
    }

    // Apply search filter
    if (searchQuery) {
        filteredTasks = filteredTasks.filter(task => {
            return (
                task.title.toLowerCase().includes(searchQuery) ||
                task.target.toLowerCase().includes(searchQuery) ||
                (task.ticket && task.ticket.toLowerCase().includes(searchQuery)) ||
                (task.plate && task.plate.toLowerCase().includes(searchQuery))
            );
        });
    }

    // Sort by priority (urgency > date)
    filteredTasks.sort((a, b) => {
        if (a.urgent && !b.urgent) return -1;
        if (!a.urgent && b.urgent) return 1;
        return new Date(b.created_at) - new Date(a.created_at);
    });

    // Update count
    document.getElementById('task-count').textContent = 
        `${filteredTasks.length} ${filteredTasks.length === 1 ? 'missione' : 'missioni'}`;

    // Render or show empty state
    if (filteredTasks.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    container.innerHTML = filteredTasks.map(task => createTaskCard(task)).join('');

    // Attach event listeners to cards
    container.querySelectorAll('.task-card').forEach((card, index) => {
        card.addEventListener('click', () => openTask(filteredTasks[index]));
    });
}

function createTaskCard(task) {
    const typeConfig = getTypeConfig(task.type);
    const statusConfig = getStatusConfig(task.status);
    const urgentClass = task.urgent ? 'border-left: 4px solid var(--error);' : '';

    return `
        <div class="task-card card" style="cursor: pointer; margin-bottom: 15px; ${urgentClass}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 15px;">
                <div style="flex: 1; min-width: 0;">
                    <!-- Header -->
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span style="font-size: 20px;">${typeConfig.icon}</span>
                        <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: white;">
                            ${task.title}
                        </h3>
                        ${task.urgent ? '<span class="badge" style="background: var(--error); color: white; margin-left: 8px;">URGENTE</span>' : ''}
                    </div>

                    <!-- Target -->
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                        <i class="fas fa-user" style="color: var(--text-muted); font-size: 12px;"></i>
                        <span style="font-size: 13px; color: var(--text-muted);">
                            ${task.target}
                        </span>
                        ${task.verified ? '<i class="fas fa-check-circle" style="color: var(--success); font-size: 12px; margin-left: 4px;"></i>' : ''}
                    </div>

                    <!-- Status -->
                    <div style="margin-top: 10px;">
                        <span class="badge" style="background: ${statusConfig.bg}; color: ${statusConfig.color}; border: 1px solid ${statusConfig.border};">
                            ${statusConfig.label}
                        </span>
                    </div>

                    <!-- Metadata -->
                    ${task.ticket || task.plate ? `
                        <div style="display: flex; gap: 10px; margin-top: 10px; font-size: 11px; color: var(--text-secondary);">
                            ${task.ticket ? `<span><i class="fas fa-ticket-alt"></i> ${task.ticket}</span>` : ''}
                            ${task.plate ? `<span><i class="fas fa-car"></i> ${task.plate}</span>` : ''}
                        </div>
                    ` : ''}
                </div>

                <!-- Action Icon -->
                <div style="display: flex; align-items: center;">
                    <i class="fas fa-chevron-right" style="color: var(--text-muted); font-size: 14px;"></i>
                </div>
            </div>

            <!-- Swipe Action Hint (only on mobile) -->
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--glass-border); display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 10px; color: var(--text-secondary);">
                    <i class="fas fa-clock"></i> ${formatDate(task.created_at)}
                </span>
                <button 
                    class="btn-mini" 
                    onclick="event.stopPropagation(); callTarget('${task.target_phone || ''}');"
                    ${!task.target_phone ? 'disabled' : ''}
                >
                    <i class="fas fa-phone"></i> Chiama
                </button>
            </div>
        </div>
    `;
}

// ============================================
// HELPERS
// ============================================

function getTypeConfig(type) {
    const configs = {
        preventivi: { icon: '📝', label: 'Preventivo' },
        in_corso: { icon: '🔨', label: 'In Corso' },
        assistenza: { icon: '🆘', label: 'Assistenza' },
        manutenzione: { icon: '🔧', label: 'Manutenzione' }
    };
    return configs[type] || { icon: '📋', label: 'Task' };
}

function getStatusConfig(status) {
    const configs = {
        pending: { 
            label: 'In Attesa', 
            bg: 'rgba(245, 158, 11, 0.15)', 
            color: 'var(--warning)', 
            border: 'rgba(245, 158, 11, 0.3)' 
        },
        in_progress: { 
            label: 'In Lavorazione', 
            bg: 'rgba(91, 111, 237, 0.15)', 
            color: 'var(--primary)', 
            border: 'rgba(91, 111, 237, 0.3)' 
        },
        waiting_materials: { 
            label: 'Attesa Materiali', 
            bg: 'rgba(245, 158, 11, 0.15)', 
            color: 'var(--warning)', 
            border: 'rgba(245, 158, 11, 0.3)' 
        },
        completed: { 
            label: 'Completato', 
            bg: 'rgba(76, 217, 100, 0.15)', 
            color: 'var(--success)', 
            border: 'rgba(76, 217, 100, 0.3)' 
        }
    };
    return configs[status] || configs.pending;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Oggi';
    if (days === 1) return 'Ieri';
    if (days < 7) return `${days} giorni fa`;
    return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
}

function callTarget(phone) {
    if (!phone) {
        tg.showAlert('Numero di telefono non disponibile');
        return;
    }
    window.location.href = `tel:${phone}`;
}

function openTask(task) {
    // Redirect to specific task detail page based on type
    // ✅ FIX: Navigate WITH context!
    tg.showAlert(`Task: ${task.title}\nTarget: ${task.target}\nStatus: ${task.status}`);
    
    // TODO: Implement task detail pages with context
    // if (task.type === 'preventivi') {
    //     navigateOperatorWithContext('operator_estimate.html', { task_id: task.id });
    // } else if (task.type === 'in_corso') {
    //     navigateOperatorWithContext('operator_checklist.html', { task_id: task.id });
    // }
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

function goBack() {
    // ✅ FIX: Navigate back WITH context!
    if (window.history.length > 1) {
        window.history.back();
    } else {
        navigateOperatorWithContext('operator_dashboard.html');
    }
}

// ============================================
// DEMO DATA (Fallback)
// ============================================

function getDemoTasks() {
    return [
        {
            id: '1',
            title: 'Riparazione Caldaia',
            target: 'Mario Rossi',
            target_phone: '+393331234567',
            type: 'in_corso',
            status: 'waiting_materials',
            urgent: false,
            verified: true,
            ticket: '#12345',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '2',
            title: 'Preventivo Impianto Fotovoltaico',
            target: 'Anna Verdi',
            target_phone: '+393339876543',
            type: 'preventivi',
            status: 'pending',
            urgent: true,
            verified: true,
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '3',
            title: 'Assistenza Perdita Acqua',
            target: 'Giuseppe Bianchi',
            type: 'assistenza',
            status: 'in_progress',
            urgent: true,
            verified: false,
            plate: 'AB123CD',
            created_at: new Date().toISOString()
        },
        {
            id: '4',
            title: 'Manutenzione Ordinaria Ascensore',
            target: 'Condominio Via Roma 15',
            type: 'manutenzione',
            status: 'pending',
            urgent: false,
            verified: true,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
}