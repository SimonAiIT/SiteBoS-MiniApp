/**
 * AGENDA LOGIC v1.0
 * Sistema prenotazioni settimanale multi-operatore
 * Features: Booking, Calendar Export (Google/iCal), Sync, Notifiche
 */
'use strict';

const WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/AGENDA_WEBHOOK_ID"; // TODO: Sostituire
const tg = window.Telegram.WebApp;
try { tg.ready(); tg.expand(); } catch (e) { console.warn("TG WebApp not found"); }

const urlParams = new URLSearchParams(window.location.search);
const vat = urlParams.get('vat');
const token = urlParams.get('token');
const owner = urlParams.get('owner');

let currentWeekStart = getMonday(new Date());
let operators = [];
let services = [];
let appointments = [];
let selectedOperator = 'all';

const WORK_HOURS = { start: 9, end: 19 }; // 09:00 - 19:00
const SLOT_DURATION = 30; // minuti

const dom = {
    loader: document.getElementById('loader'),
    content: document.getElementById('mainContent'),
    grid: document.getElementById('calendarGrid'),
    weekLabel: document.getElementById('weekLabel'),
    operatorFilter: document.getElementById('operatorFilter'),
    modal: document.getElementById('bookingModal'),
    modalOperator: document.getElementById('modalOperator'),
    modalService: document.getElementById('modalService'),
    companyName: document.getElementById('companyName')
};

// ========================================
// INIT
// ========================================
async function init() {
    if (!vat || !token || !owner) {
        alert('Parametri mancanti!');
        return;
    }

    await loadData();
    renderOperatorFilter();
    renderCalendar();
    attachEvents();
    hideLoader();
}

// ========================================
// DATA LOADING
// ========================================
async function loadData() {
    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'GET_AGENDA_DATA',
                vat_number: vat,
                token: token,
                chat_id: owner,
                week_start: formatDate(currentWeekStart),
                week_end: formatDate(addDays(currentWeekStart, 6))
            })
        });
        const data = await res.json();
        
        operators = data.operators || [];
        services = data.services || [];
        appointments = data.appointments || [];
        
        dom.companyName.innerText = `Gestione prenotazioni per ${data.company_name || 'Azienda'}`;
        
        // Popola dropdown servizi nel modal
        dom.modalService.innerHTML = '<option value="">Seleziona servizio...</option>' +
            services.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
            
    } catch (err) {
        console.error('Load error:', err);
        alert('Errore caricamento dati');
    }
}

// ========================================
// RENDER OPERATOR FILTER
// ========================================
function renderOperatorFilter() {
    const html = operators.map(op => `
        <div class="operator-chip" data-operator="${op.id}">
            <i class="fas fa-user"></i> ${op.name}
        </div>
    `).join('');
    
    dom.operatorFilter.innerHTML = `
        <div class="operator-chip active" data-operator="all">
            <i class="fas fa-users"></i> Tutti
        </div>
        ${html}
    `;
    
    // Popola dropdown operatori nel modal
    dom.modalOperator.innerHTML = operators.map(op => 
        `<option value="${op.id}">${op.name}</option>`
    ).join('');
}

// ========================================
// RENDER CALENDAR GRID
// ========================================
function renderCalendar() {
    const days = [];
    for (let i = 0; i < 7; i++) {
        days.push(addDays(currentWeekStart, i));
    }
    
    // Update week label
    const weekEnd = days[6];
    dom.weekLabel.innerText = `${formatDate(days[0], 'short')} - ${formatDate(weekEnd, 'short')}`;
    
    // Header row
    let html = '<div class="time-col"></div>';
    const today = new Date().toDateString();
    
    days.forEach(day => {
        const isToday = day.toDateString() === today;
        html += `<div class="day-header ${isToday ? 'today' : ''}">
            <div>${getDayName(day)}</div>
            <div style="font-size:16px; margin-top:3px;">${day.getDate()}</div>
        </div>`;
    });
    
    // Time slots
    const slots = generateTimeSlots();
    slots.forEach(time => {
        html += `<div class="time-col">${time}</div>`;
        
        days.forEach(day => {
            const slotId = `${formatDate(day)}_${time}`;
            const appointment = findAppointment(day, time);
            const isPast = isPastSlot(day, time);
            
            if (appointment) {
                html += `<div class="time-slot booked" data-slot="${slotId}" data-appointment="${appointment.id}">
                    <div class="appointment-card">
                        <i class="fas fa-user"></i> ${appointment.client_name}<br>
                        <small>${appointment.service_name}</small>
                    </div>
                </div>`;
            } else if (isPast) {
                html += `<div class="time-slot past" data-slot="${slotId}"></div>`;
            } else {
                html += `<div class="time-slot" data-slot="${slotId}"></div>`;
            }
        });
    });
    
    dom.grid.innerHTML = html;
}

// ========================================
// ATTACH EVENTS
// ========================================
function attachEvents() {
    // Week navigation
    document.getElementById('prevWeekBtn').onclick = () => changeWeek(-1);
    document.getElementById('nextWeekBtn').onclick = () => changeWeek(1);
    document.getElementById('todayBtn').onclick = () => { currentWeekStart = getMonday(new Date()); renderCalendar(); };
    
    // Operator filter
    dom.operatorFilter.addEventListener('click', (e) => {
        const chip = e.target.closest('.operator-chip');
        if (!chip) return;
        
        document.querySelectorAll('.operator-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedOperator = chip.dataset.operator;
        filterAppointments();
    });
    
    // Time slot click
    dom.grid.addEventListener('click', (e) => {
        const slot = e.target.closest('.time-slot');
        if (!slot || slot.classList.contains('booked') || slot.classList.contains('past')) return;
        
        const slotId = slot.dataset.slot;
        openBookingModal(slotId);
    });
    
    // Modal
    document.getElementById('modalCancelBtn').onclick = closeBookingModal;
    document.getElementById('modalSaveBtn').onclick = saveBooking;
    
    // Export
    document.getElementById('exportBtn').onclick = showExportOptions;
    document.getElementById('syncBtn').onclick = syncCalendar;
}

// ========================================
// BOOKING MODAL
// ========================================
function openBookingModal(slotId) {
    const [dateStr, time] = slotId.split('_');
    document.getElementById('modalDateTime').innerText = `${dateStr} alle ${time}`;
    
    dom.modal.classList.add('active');
    dom.modal.dataset.slot = slotId;
    
    // Pre-select operator if filtered
    if (selectedOperator !== 'all') {
        dom.modalOperator.value = selectedOperator;
    }
}

function closeBookingModal() {
    dom.modal.classList.remove('active');
    // Reset form
    document.getElementById('modalClient').value = '';
    document.getElementById('modalEmail').value = '';
    document.getElementById('modalPhone').value = '';
    document.getElementById('modalNotes').value = '';
    document.getElementById('modalNotify').checked = false;
}

async function saveBooking() {
    const slotId = dom.modal.dataset.slot;
    const [dateStr, time] = slotId.split('_');
    
    const booking = {
        date: dateStr,
        time: time,
        operator_id: dom.modalOperator.value,
        client_name: document.getElementById('modalClient').value,
        client_email: document.getElementById('modalEmail').value,
        client_phone: document.getElementById('modalPhone').value,
        service_id: dom.modalService.value,
        notes: document.getElementById('modalNotes').value,
        notify: document.getElementById('modalNotify').checked
    };
    
    if (!booking.operator_id || !booking.client_name || !booking.service_id) {
        alert('Compila tutti i campi obbligatori');
        return;
    }
    
    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'CREATE_BOOKING',
                vat_number: vat,
                token: token,
                chat_id: owner,
                booking: booking
            })
        });
        
        const data = await res.json();
        if (data.status === 'success') {
            closeBookingModal();
            await loadData();
            renderCalendar();
            if (tg.showPopup) tg.showPopup({ message: 'Prenotazione salvata!' });
        } else {
            alert('Errore: ' + (data.message || 'Unknown'));
        }
    } catch (err) {
        console.error(err);
        alert('Errore salvataggio');
    }
}

// ========================================
// CALENDAR EXPORT
// ========================================
function showExportOptions() {
    const actions = [
        { text: '📅 Google Calendar', id: 'google' },
        { text: '📆 iCal (Apple)', id: 'ical' },
        { text: '🔗 Webhook URL', id: 'webhook' }
    ];
    
    if (tg.showPopup) {
        tg.showPopup({
            title: 'Esporta Calendario',
            message: 'Scegli il formato:',
            buttons: actions.map(a => ({ type: 'default', text: a.text, id: a.id }))
        }, (btnId) => {
            if (btnId === 'google') exportToGoogle();
            else if (btnId === 'ical') exportToICal();
            else if (btnId === 'webhook') showWebhookURL();
        });
    }
}

function exportToGoogle() {
    const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const url = `${baseUrl}&text=Agenda%20Appuntamenti&ctz=Europe/Rome`;
    if (tg.openLink) tg.openLink(url);
    else window.open(url, '_blank');
}

function exportToICal() {
    // Generate .ics file
    let ical = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SiteBoS//Agenda//EN\n';
    
    appointments.forEach(apt => {
        ical += `BEGIN:VEVENT\n`;
        ical += `UID:${apt.id}@sitebos.com\n`;
        ical += `DTSTAMP:${formatICalDate(new Date())}\n`;
        ical += `DTSTART:${formatICalDate(new Date(apt.date + ' ' + apt.time))}\n`;
        ical += `SUMMARY:${apt.client_name} - ${apt.service_name}\n`;
        ical += `DESCRIPTION:${apt.notes || ''}\n`;
        ical += `END:VEVENT\n`;
    });
    
    ical += 'END:VCALENDAR';
    
    const blob = new Blob([ical], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agenda.ics';
    a.click();
}

function showWebhookURL() {
    const webhookUrl = `${WEBHOOK_URL}?vat=${vat}&token=${token}`;
    if (tg.showPopup) {
        tg.showPopup({ title: 'Webhook URL', message: webhookUrl });
    }
}

async function syncCalendar() {
    if (tg.showPopup) tg.showPopup({ message: 'Sincronizzazione in corso...' });
    await loadData();
    renderCalendar();
    if (tg.showPopup) tg.showPopup({ message: 'Calendario aggiornato!' });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function changeWeek(direction) {
    currentWeekStart = addDays(currentWeekStart, direction * 7);
    loadData().then(renderCalendar);
}

function filterAppointments() {
    // Re-render with filter
    renderCalendar();
}

function findAppointment(day, time) {
    const dateStr = formatDate(day);
    return appointments.find(apt => 
        apt.date === dateStr && 
        apt.time === time &&
        (selectedOperator === 'all' || apt.operator_id === selectedOperator)
    );
}

function generateTimeSlots() {
    const slots = [];
    for (let h = WORK_HOURS.start; h < WORK_HOURS.end; h++) {
        slots.push(`${String(h).padStart(2, '0')}:00`);
        slots.push(`${String(h).padStart(2, '0')}:30`);
    }
    return slots;
}

function isPastSlot(day, time) {
    const now = new Date();
    const [hours, minutes] = time.split(':');
    const slotDate = new Date(day);
    slotDate.setHours(parseInt(hours), parseInt(minutes), 0);
    return slotDate < now;
}

function getMonday(d) {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function formatDate(date, format = 'full') {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    
    if (format === 'short') return `${d}/${m}`;
    return `${y}-${m}-${d}`;
}

function formatICalDate(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function getDayName(date) {
    const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    return days[date.getDay()];
}

function showLoader() { dom.loader.classList.remove('hidden'); dom.content.classList.add('hidden'); }
function hideLoader() { dom.loader.classList.add('hidden'); dom.content.classList.remove('hidden'); }

// ========================================
// START
// ========================================
document.addEventListener('DOMContentLoaded', init);
