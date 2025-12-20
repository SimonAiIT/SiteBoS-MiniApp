/**
 * OPERATIONAL CALENDAR VIEW LOGIC
 * Fase D: Il Cockpit - Vista calendario operativa
 */

const CalendarController = {
    state: {
        vat: null,
        resources: [],
        currentResource: null,
        events: [],
        view: 'list', // list | week | month
        calendar: null // FullCalendar instance
    },

    async init() {
        // Get VAT
        const params = new URLSearchParams(window.location.search);
        this.state.vat = params.get('vat') || localStorage.getItem('userVAT');

        // Initialize UI
        this.setupViewMode();
        this.attachEventListeners();
        this.setTodayDate();

        // Load resources
        await this.loadResources();
        
        // Load events for default resource
        if (this.state.resources.length > 0) {
            this.state.currentResource = this.state.resources[0];
            await this.loadEvents();
        }
    },

    async loadResources() {
        try {
            const result = await SmartOrchestrator.callWebhook('get_active_resources', {
                vat: this.state.vat
            });

            this.state.resources = result.resources || [];
            this.renderResourceSelector();

        } catch (error) {
            console.error('Load resources error:', error);
            alert('Errore caricamento risorse: ' + error.message);
        }
    },

    renderResourceSelector() {
        const selector = document.getElementById('resource-selector');
        if (!selector) return;

        if (this.state.resources.length === 0) {
            selector.innerHTML = '<option>Nessuna risorsa attiva</option>';
            return;
        }

        selector.innerHTML = this.state.resources.map(resource => `
            <option value="${resource.id}" ${resource.id === this.state.currentResource?.id ? 'selected' : ''}>
                ${resource.type === 'human' ? '👤' : '🔧'} ${resource.name}
            </option>
        `).join('');
    },

    async loadEvents() {
        if (!this.state.currentResource) return;

        document.getElementById('loadingOverlay')?.classList.remove('hidden');

        try {
            const result = await SmartOrchestrator.callWebhook('get_calendar_events', {
                vat: this.state.vat,
                resource_id: this.state.currentResource.id,
                start_date: this.getStartDate(),
                end_date: this.getEndDate()
            });

            this.state.events = result.events || [];
            this.renderEvents();
            this.renderStatusIndicators(result.status || {});

        } catch (error) {
            console.error('Load events error:', error);
            alert('Errore caricamento eventi: ' + error.message);
        } finally {
            document.getElementById('loadingOverlay')?.classList.add('hidden');
        }
    },

    renderEvents() {
        if (this.state.view === 'list') {
            this.renderListView();
        } else {
            this.renderCalendarView();
        }
    },

    renderListView() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Separate events
        const todayEvents = this.state.events.filter(e => {
            const eventDate = new Date(e.start);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate.getTime() === today.getTime();
        });

        const upcomingEvents = this.state.events.filter(e => {
            const eventDate = new Date(e.start);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate.getTime() > today.getTime();
        }).slice(0, 10); // Limit to 10

        const complianceEvents = this.state.events.filter(e => 
            e.layer === 'compliance' && new Date(e.start) > today
        ).slice(0, 5);

        // Render today
        this.renderEventList('today-events', todayEvents);
        
        // Render upcoming
        this.renderEventList('upcoming-events', upcomingEvents);

        // Render compliance
        if (complianceEvents.length > 0) {
            document.getElementById('compliance-section')?.classList.remove('hidden');
            this.renderEventList('compliance-alerts', complianceEvents, true);
        } else {
            document.getElementById('compliance-section')?.classList.add('hidden');
        }

        // Show empty state if no events
        if (this.state.events.length === 0) {
            document.getElementById('empty-state')?.classList.remove('hidden');
            document.getElementById('list-view')?.classList.add('hidden');
        } else {
            document.getElementById('empty-state')?.classList.add('hidden');
            document.getElementById('list-view')?.classList.remove('hidden');
        }
    },

    renderEventList(containerId, events, isCompliance = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (events.length === 0) {
            container.innerHTML = `<p style="color: var(--text-muted); font-size: 13px; font-style: italic;">Nessun evento</p>`;
            return;
        }

        container.innerHTML = events.map(event => {
            const layerColors = {
                production: { bg: 'rgba(91, 111, 237, 0.1)', border: 'var(--primary)', icon: '🟦' },
                ops: { bg: 'rgba(128, 128, 128, 0.1)', border: 'var(--text-secondary)', icon: '⬜' },
                compliance: { bg: 'rgba(255, 107, 107, 0.1)', border: 'var(--error)', icon: '🔔' }
            };
            const layer = layerColors[event.layer] || layerColors.production;

            const startDate = new Date(event.start);
            const endDate = new Date(event.end);

            return `
                <div class="prod-item" style="background: ${layer.bg}; border-left: 3px solid ${layer.border}; cursor: pointer; margin-bottom: 10px;"
                     onclick="CalendarController.viewEventDetails('${event.id}')">
                    <div class="prod-info" style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <span style="font-size: 16px;">${layer.icon}</span>
                            <h4 style="margin: 0; font-size: 14px;">${event.title}</h4>
                        </div>
                        <p style="font-size: 12px; color: var(--text-muted); margin: 0;">
                            ${this.formatDate(startDate)} • ${this.formatTime(startDate)} - ${this.formatTime(endDate)}
                        </p>
                        ${event.notes ? `<p style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">${event.notes}</p>` : ''}
                    </div>
                    ${event.layer === 'ops' ? `
                        <div style="flex-shrink: 0;">
                            <span class="badge" style="background: rgba(128,128,128,0.2); color: var(--text-muted); font-size: 10px;">
                                BLOCCO
                            </span>
                        </div>
                    ` : ''}
                    ${isCompliance ? `
                        <div style="flex-shrink: 0;">
                            <span style="font-size: 11px; color: var(--error); font-weight: 600;">
                                ${this.getDaysUntil(startDate)} giorni
                            </span>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    },

    renderCalendarView() {
        // Show calendar container
        document.getElementById('list-view')?.classList.add('hidden');
        document.getElementById('calendar-container')?.classList.remove('hidden');
        document.getElementById('empty-state')?.classList.add('hidden');

        // Initialize FullCalendar if not already
        if (!this.state.calendar) {
            const calendarEl = document.getElementById('fullcalendar');
            if (!calendarEl) return;

            this.state.calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: this.state.view === 'week' ? 'timeGridWeek' : 'dayGridMonth',
                locale: 'it',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: ''
                },
                height: 'auto',
                events: this.formatEventsForFullCalendar(),
                eventClick: (info) => {
                    this.viewEventDetails(info.event.id);
                },
                eventContent: (arg) => {
                    // Custom rendering based on layer
                    const layer = arg.event.extendedProps.layer;
                    const icons = { production: '🟦', ops: '⬜', compliance: '🔔' };
                    return {
                        html: `<div style="padding: 2px 4px; font-size: 11px;">${icons[layer] || ''} ${arg.event.title}</div>`
                    };
                }
            });

            this.state.calendar.render();
        } else {
            // Update events
            this.state.calendar.removeAllEvents();
            this.state.calendar.addEventSource(this.formatEventsForFullCalendar());
            
            // Switch view if needed
            const view = this.state.view === 'week' ? 'timeGridWeek' : 'dayGridMonth';
            this.state.calendar.changeView(view);
        }
    },

    formatEventsForFullCalendar() {
        return this.state.events.map(event => {
            const layerColors = {
                production: '#5B6FED',
                ops: '#808080',
                compliance: '#ff6b6b'
            };

            return {
                id: event.id,
                title: event.title,
                start: event.start,
                end: event.end,
                backgroundColor: layerColors[event.layer] || layerColors.production,
                borderColor: layerColors[event.layer] || layerColors.production,
                extendedProps: {
                    layer: event.layer,
                    notes: event.notes,
                    editable: event.layer !== 'ops' // Ops blocks are not editable
                }
            };
        });
    },

    renderStatusIndicators(status) {
        const container = document.getElementById('status-indicators');
        if (!container) return;

        const indicators = [];

        if (status.maintenance_today) {
            indicators.push(`<span class="badge" style="background: rgba(245, 158, 11, 0.2); color: var(--warning);"><i class="fas fa-wrench"></i> Manutenzione oggi</span>`);
        }

        if (status.upcoming_deadlines) {
            indicators.push(`<span class="badge" style="background: rgba(255, 107, 107, 0.2); color: var(--error);"><i class="fas fa-bell"></i> Scadenze in arrivo</span>`);
        }

        if (status.availability_low) {
            indicators.push(`<span class="badge" style="background: rgba(255, 107, 107, 0.2); color: var(--error);"><i class="fas fa-exclamation-triangle"></i> Disponibilità limitata</span>`);
        }

        container.innerHTML = indicators.length > 0 ? indicators.join('') : '<span style="font-size: 12px; color: var(--text-muted);">✓ Tutto OK</span>';
    },

    openNativeCalendar() {
        // Try to open native calendar app
        if (!this.state.currentResource) return;

        // Generate iCal data
        const icalData = this.generateICalData();
        const blob = new Blob([icalData], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `calendario_${this.state.currentResource.name.replace(/\s+/g, '_')}.ics`;
        
        // Try to open directly (works on some mobile browsers)
        const openAttempt = window.open(url, '_blank');
        
        if (!openAttempt) {
            // Fallback: trigger download
            a.click();
            
            if (window.Telegram?.WebApp?.showAlert) {
                window.Telegram.WebApp.showAlert('📅 File calendario scaricato! Aprilo con la tua app calendario.');
            } else {
                alert('📅 File calendario scaricato! Aprilo con la tua app calendario.');
            }
        }

        URL.revokeObjectURL(url);
    },

    generateICalData() {
        let ical = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SiteBoS//Calendar//EN\nCALSCALE:GREGORIAN\n';
        
        this.state.events.forEach(event => {
            const start = new Date(event.start).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            const end = new Date(event.end).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            
            ical += 'BEGIN:VEVENT\n';
            ical += `UID:${event.id}@sitebos.app\n`;
            ical += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\n`;
            ical += `DTSTART:${start}\n`;
            ical += `DTEND:${end}\n`;
            ical += `SUMMARY:${event.title}\n`;
            if (event.notes) ical += `DESCRIPTION:${event.notes}\n`;
            ical += 'END:VEVENT\n';
        });
        
        ical += 'END:VCALENDAR';
        return ical;
    },

    openNewEventModal() {
        document.getElementById('event-modal')?.classList.remove('hidden');
        document.getElementById('event-modal-title').textContent = 'Nuovo Evento';
        
        // Set default date to today
        document.getElementById('event-date').value = new Date().toISOString().split('T')[0];
        
        // Set default type to production
        this.selectEventType('production');
    },

    closeEventModal() {
        document.getElementById('event-modal')?.classList.add('hidden');
        this.resetEventForm();
    },

    selectEventType(type) {
        document.getElementById('event-type').value = type;
        
        // Update UI
        document.querySelectorAll('.payment-option').forEach(opt => {
            opt.classList.remove('selected');
            if (opt.dataset.type === type) {
                opt.classList.add('selected');
            }
        });

        // Show/hide recurring section
        const recurringSection = document.getElementById('recurring-section');
        if (type === 'ops' || type === 'compliance') {
            recurringSection?.classList.remove('hidden');
        } else {
            recurringSection?.classList.add('hidden');
        }
    },

    async saveEvent() {
        // Collect data
        const eventData = {
            resource_id: this.state.currentResource.id,
            type: document.getElementById('event-type').value,
            title: document.getElementById('event-title').value,
            date: document.getElementById('event-date').value,
            start_time: document.getElementById('event-start-time').value,
            duration: parseInt(document.getElementById('event-duration').value),
            notes: document.getElementById('event-notes').value,
            recurring: document.getElementById('event-recurring')?.checked || false,
            recurring_freq: document.getElementById('recurring-freq')?.value || null
        };

        // Validation
        if (!eventData.title || !eventData.date || !eventData.start_time) {
            alert('Compila tutti i campi obbligatori!');
            return;
        }

        document.getElementById('loadingOverlay')?.classList.remove('hidden');

        try {
            await SmartOrchestrator.callWebhook('create_booking', {
                vat: this.state.vat,
                event: eventData
            });

            // Success
            this.closeEventModal();
            await this.loadEvents(); // Reload

            if (window.Telegram?.WebApp?.showAlert) {
                window.Telegram.WebApp.showAlert('✅ Evento creato con successo!');
            } else {
                alert('✅ Evento creato con successo!');
            }

        } catch (error) {
            console.error('Save event error:', error);
            
            // Check for conflicts
            if (error.message.includes('conflict')) {
                document.getElementById('conflict-warning')?.classList.remove('hidden');
                document.getElementById('conflict-message').textContent = error.message;
            } else {
                alert('❌ Errore: ' + error.message);
            }
        } finally {
            document.getElementById('loadingOverlay')?.classList.add('hidden');
        }
    },

    viewEventDetails(eventId) {
        const event = this.state.events.find(e => e.id === eventId);
        if (!event) return;

        // For now, simple alert. Can be expanded to modal
        const details = `
📌 ${event.title}
⏰ ${this.formatDate(new Date(event.start))} • ${this.formatTime(new Date(event.start))} - ${this.formatTime(new Date(event.end))}
📝 ${event.notes || 'Nessuna nota'}
        `;

        if (window.Telegram?.WebApp?.showAlert) {
            window.Telegram.WebApp.showAlert(details);
        } else {
            alert(details);
        }
    },

    setupViewMode() {
        // Check screen size
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Default to list on mobile
            this.state.view = 'list';
        }
    },

    switchView(view) {
        this.state.view = view;
        
        // Update tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.view === view) {
                tab.classList.add('active');
            }
        });

        // Render
        this.renderEvents();
    },

    resetEventForm() {
        document.getElementById('event-title').value = '';
        document.getElementById('event-notes').value = '';
        document.getElementById('event-duration').value = '60';
        document.getElementById('conflict-warning')?.classList.add('hidden');
    },

    attachEventListeners() {
        // Resource selector change
        document.getElementById('resource-selector')?.addEventListener('change', async (e) => {
            const resourceId = e.target.value;
            this.state.currentResource = this.state.resources.find(r => r.id === resourceId);
            await this.loadEvents();
        });

        // Settings button
        document.getElementById('settings-btn')?.addEventListener('click', () => {
            // Navigate back to dossier for this resource
            window.location.href = `dossier.html?vat=${this.state.vat}&resource=${this.state.currentResource?.id}`;
        });

        // Open native calendar
        document.getElementById('open-native-calendar-btn')?.addEventListener('click', () => {
            this.openNativeCalendar();
        });

        // Add event
        document.getElementById('add-event-btn')?.addEventListener('click', () => {
            this.openNewEventModal();
        });

        // Export iCal
        document.getElementById('export-ical-btn')?.addEventListener('click', () => {
            this.openNativeCalendar(); // Same as native calendar for now
        });

        // View tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchView(tab.dataset.view);
            });
        });

        // Event type selection
        document.querySelectorAll('.payment-option').forEach(opt => {
            opt.addEventListener('click', () => {
                this.selectEventType(opt.dataset.type);
            });
        });

        // Save event
        document.getElementById('save-event-btn')?.addEventListener('click', () => {
            this.saveEvent();
        });

        // Auto-calculate end time
        const startTimeInput = document.getElementById('event-start-time');
        const durationInput = document.getElementById('event-duration');
        const endTimeInput = document.getElementById('event-end-time');

        const updateEndTime = () => {
            const startTime = startTimeInput?.value;
            const duration = parseInt(durationInput?.value || 60);
            
            if (startTime) {
                const [hours, minutes] = startTime.split(':').map(Number);
                const totalMinutes = hours * 60 + minutes + duration;
                const endHours = Math.floor(totalMinutes / 60) % 24;
                const endMinutes = totalMinutes % 60;
                
                if (endTimeInput) {
                    endTimeInput.value = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
                }
            }
        };

        startTimeInput?.addEventListener('change', updateEndTime);
        durationInput?.addEventListener('input', updateEndTime);
    },

    // Utility methods
    setTodayDate() {
        const today = new Date();
        const formatted = today.toLocaleDateString('it-IT', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const el = document.getElementById('today-date');
        if (el) el.textContent = formatted;
    },

    getStartDate() {
        // Last 7 days
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString().split('T')[0];
    },

    getEndDate() {
        // Next 60 days
        const date = new Date();
        date.setDate(date.getDate() + 60);
        return date.toISOString().split('T')[0];
    },

    formatDate(date) {
        return date.toLocaleDateString('it-IT', { 
            day: 'numeric', 
            month: 'short' 
        });
    },

    formatTime(date) {
        return date.toLocaleTimeString('it-IT', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    },

    getDaysUntil(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        const diff = targetDate - today;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram?.WebApp;
    if (tg) { tg.ready(); tg.expand(); }
    
    CalendarController.init();
});