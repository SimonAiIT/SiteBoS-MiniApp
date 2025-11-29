/**
 * HONEYPOT EDITOR - LOGIC (v2.7 - URL PARAM FIX)
 * - Allineato al backend n8n.
 * - SECURITY: Legge 'token' dall'URL -> Invia 'access_token' al Backend.
 * - Gestione corretta dei parametri URL (vat, token, owner, lang).
 */

'use strict';

// ==========================================
// 1. CONFIGURATION & STATE
// ==========================================
const CONFIG = {
    WEBHOOK_URL: "https://trinai.api.workflow.dcmake.it/webhook/48ee3cba-99dc-407a-98af-624e97b1e888",
    BOTFATHER_VIDEO: "https://www.youtube.com/watch?v=7a8UWhJWurs",
    BOTFATHER_TG: "https://t.me/BotFather"
};

// Inizializzazione Parametri URL
const urlParams = new URLSearchParams(window.location.search);

const STATE = {
    vatNumber: urlParams.get('vat'),
    // FIX: Leggo 'token' dall'URL (come da tuo link esempio)
    accessToken: urlParams.get('token'), 
    // Dati extra utili per navigazione
    ownerId: urlParams.get('owner'),
    companyName: urlParams.get('ragione_sociale'),
    
    currentLang: 'it',
    data: {},          
    initialString: '', 
    isDirty: false
};

// Riferimenti DOM
const DOM = {
    loader: document.getElementById('loader'),
    app: document.getElementById('app-content'),
    container: document.getElementById('honeypot-container'),
    hoursContainer: document.getElementById('hours-container'),
    saveBar: document.getElementById('save-bar'),
    saveBtn: document.getElementById('saveBtn'),
    botTokenInput: document.getElementById('bot-token-input'),
    btnLinkBot: document.getElementById('btn-link-bot'),
    botStatus: document.getElementById('bot-status'),
    offerPrompt: document.getElementById('offer-prompt'),
    offerPreview: document.getElementById('offer-preview-box'),
    offerStorage: document.getElementById('offer_html_storage'),
    logoInput: document.getElementById('logo-input'),
    photoInput: document.getElementById('photo-input'),
    btnGenerateOffer: document.getElementById('btn-generate-offer'),
    btnCopyOffer: document.getElementById('btn-copy-offer'),
    btnBack: document.getElementById('btn-back-dashboard')
};

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();


// ==========================================
// 2. SERVICES (I18N & API)
// ==========================================

const I18n = {
    dict: {
        it: {
            title: "Editor Base di Conoscenza", subtitle: "Modella l'anima AI della tua azienda.",
            btn_back_dashboard: "Torna alla Dashboard",
            section_offer_title: "Azione Richiesta: Offerta Benvenuto", offer_desc: "L'AI genererà un'offerta accattivante per te.", lbl_offer_prompt: "Descrivi la tua offerta", btn_generate_offer: "Genera Offerta", lbl_offer_preview: "Anteprima", offer_preview_placeholder: "Qui vedrai l'anteprima...", alert_offer_required: "Inserisci una descrizione.", generating: "Generazione...", alert_generation_error: "Errore AI.", lbl_click_copy: "Copia", alert_copied: "Copiato!",
            section_hours_title: "Azione Richiesta: Orari", lbl_morning: "Mattina", lbl_afternoon: "Pomeriggio", section_assets_title: "Azione Richiesta: Asset Visivi", lbl_logo: "Logo Aziendale", upload_logo: "Carica logo", lbl_photo: "Foto Rappresentativa", upload_photo: "Carica foto",
            section_bot_title: "Azione Richiesta: Configura Bot", guide_bot_1: "Apri <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Invia de>/newbot</code>", guide_bot_3: "Scegli nome/username", guide_bot_4: "<b>Copia Token</b> e incollalo", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Video Tutorial</a>", btn_link_bot: "Associa", status_linked: "Bot Associato ✅", alert_token_required: "Inserisci il token.", alert_token_invalid: "Token non valido.", alert_link_error: "Errore Associazione",
            lbl_utterances: "Domande Esempio", lbl_answer: "Risposta Principale", lbl_summary: "Sintesi", lbl_deepdive: "Approfondimenti (Q&A Specifiche)", lbl_question: "Domanda", btn_add_qa: "Aggiungi D&R",
            day_monday: "Lunedì", day_tuesday: "Martedì", day_wednesday: "Mercoledì", day_thursday: "Giovedì", day_friday: "Venerdì", day_saturday: "Sabato", day_sunday: "Domenica",
            btn_save: "Salva Modifiche", saving_progress: "Salvataggio...", saving_success: "Salvato!",
            alert_loading_error: "Errore caricamento.", alert_saving_error: "Errore salvataggio.",
            access_denied: "Accesso Negato: Token mancante."
        },
        en: {
            title: "Knowledge Base Editor", subtitle: "Shape your business AI soul.",
            btn_back_dashboard: "Back to Dashboard",
            section_offer_title: "Action Required: Welcome Offer", offer_desc: "AI will generate an engaging offer.", lbl_offer_prompt: "Describe your offer", btn_generate_offer: "Generate Offer", lbl_offer_preview: "Preview", offer_preview_placeholder: "Preview will appear here...", alert_offer_required: "Please enter a description.", generating: "Generating...", alert_generation_error: "AI Error.", lbl_click_copy: "Copy", alert_copied: "Copied!",
            section_hours_title: "Action Required: Opening Hours", lbl_morning: "Morning", lbl_afternoon: "Afternoon", section_assets_title: "Action Required: Visual Assets", lbl_logo: "Company Logo", upload_logo: "Upload logo", lbl_photo: "Main Photo", upload_photo: "Upload photo",
            section_bot_title: "Action Required: Configure Bot", guide_bot_1: "Open <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Send de>/newbot</code>", guide_bot_3: "Choose name/username", guide_bot_4: "<b>Copy Token</b> and paste it here", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Video Tutorial</a>", btn_link_bot: "Link", status_linked: "Bot Linked ✅", alert_token_required: "Please enter the token.", alert_token_invalid: "Invalid token.", alert_link_error: "Linking Error",
            lbl_utterances: "Sample Questions", lbl_answer: "Main Answer", lbl_summary: "Summary", lbl_deepdive: "Deep Dives (Specific Q&A)", lbl_question: "Question", btn_add_qa: "Add Q&A",
            day_monday: "Monday", day_tuesday: "Tuesday", day_wednesday: "Wednesday", day_thursday: "Thursday", day_friday: "Friday", day_saturday: "Saturday", day_sunday: "Sunday",
            btn_save: "Save Changes", saving_progress: "Saving...", saving_success: "Saved!",
            alert_loading_error: "Loading error.", alert_saving_error: "Saving error.",
            access_denied: "Access Denied: Missing Token."
        },
        fr: {
            title: "Éditeur de Base de Connaissances", subtitle: "Modelez l'âme IA de votre entreprise.",
            btn_back_dashboard: "Retour au Tableau de Bord",
            section_offer_title: "Action Requise : Offre de Bienvenue", offer_desc: "L'IA générera une offre attrayante.", lbl_offer_prompt: "Décrivez votre offre", btn_generate_offer: "Générer Offre", lbl_offer_preview: "Aperçu", offer_preview_placeholder: "L'aperçu apparaîtra ici...", alert_offer_required: "Veuillez entrer une description.", generating: "Génération...", alert_generation_error: "Erreur IA.", lbl_click_copy: "Copier", alert_copied: "Copié !",
            section_hours_title: "Action Requise : Heures d'Ouverture", lbl_morning: "Matin", lbl_afternoon: "Après-midi", section_assets_title: "Action Requise : Éléments Visuels", lbl_logo: "Logo de l'entreprise", upload_logo: "Charger logo", lbl_photo: "Photo Principale", upload_photo: "Charger photo",
            section_bot_title: "Action Requise : Configurer le Bot", guide_bot_1: "Ouvrir <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Envoyer de>/newbot</code>", guide_bot_3: "Choisir nom/utilisateur", guide_bot_4: "<b>Copiez le Jeton</b> et collez-le", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Tutoriel Vidéo</a>", btn_link_bot: "Associer", status_linked: "Bot Associé ✅", alert_token_required: "Veuillez entrer le jeton.", alert_token_invalid: "Jeton invalide.", alert_link_error: "Erreur d'association",
            lbl_utterances: "Questions Exemples", lbl_answer: "Réponse Principale", lbl_summary: "Résumé", lbl_deepdive: "Détails (Q&R Spécifiques)", lbl_question: "Question", btn_add_qa: "Ajouter Q&R",
            day_monday: "Lundi", day_tuesday: "Mardi", day_wednesday: "Mercredi", day_thursday: "Jeudi", day_friday: "Vendredi", day_saturday: "Samedi", day_sunday: "Dimanche",
            btn_save: "Enregistrer", saving_progress: "Enregistrement...", saving_success: "Enregistré !",
            alert_loading_error: "Erreur de chargement.", alert_saving_error: "Erreur d'enregistrement.",
            access_denied: "Accès Refusé : Jeton manquant."
        },
        de: {
            title: "Wissensdatenbank-Editor", subtitle: "Gestalten Sie die KI-Seele Ihres Unternehmens.",
            btn_back_dashboard: "Zurück zum Dashboard",
            section_offer_title: "Aktion Erforderlich: Willkommensangebot", offer_desc: "Die KI wird ein ansprechendes Angebot erstellen.", lbl_offer_prompt: "Beschreiben Sie Ihr Angebot", btn_generate_offer: "Angebot Erstellen", lbl_offer_preview: "Vorschau", offer_preview_placeholder: "Vorschau wird hier angezeigt...", alert_offer_required: "Bitte geben Sie eine Beschreibung ein.", generating: "Erstelle...", alert_generation_error: "KI-Fehler.", lbl_click_copy: "Kopieren", alert_copied: "Kopiert!",
            section_hours_title: "Aktion Erforderlich: Öffnungszeiten", lbl_morning: "Morgen", lbl_afternoon: "Nachmittag", section_assets_title: "Aktion Erforderlich: Visuelle Assets", lbl_logo: "Firmenlogo", upload_logo: "Logo hochladen", lbl_photo: "Hauptfoto", upload_photo: "Foto hochladen",
            section_bot_title: "Aktion Erforderlich: Bot Konfigurieren", guide_bot_1: "Öffnen Sie <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Senden Sie de>/newbot</code>", guide_bot_3: "Wählen Sie Name/Benutzername", guide_bot_4: "<b>Token kopieren</b> und einfügen", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Video-Tutorial</a>", btn_link_bot: "Verbinden", status_linked: "Bot Verbunden ✅", alert_token_required: "Bitte Token eingeben.", alert_token_invalid: "Ungültiges Token.", alert_link_error: "Verbindungsfehler",
            lbl_utterances: "Beispielfragen", lbl_answer: "Hauptantwort", lbl_summary: "Zusammenfassung", lbl_deepdive: "Details (Spezifische F&A)", lbl_question: "Frage", btn_add_qa: "F&A Hinzufügen",
            day_monday: "Montag", day_tuesday: "Dienstag", day_wednesday: "Mittwoch", day_thursday: "Donnerstag", day_friday: "Freitag", day_saturday: "Samstag", day_sunday: "Sonntag",
            btn_save: "Änderungen Speichern", saving_progress: "Speichern...", saving_success: "Gespeichert!",
            alert_loading_error: "Ladefehler.", alert_saving_error: "Speicherfehler.",
            access_denied: "Zugriff Verweigert: Token fehlt."
        },
        es: {
            title: "Editor de Base de Conocimiento", subtitle: "Modela el alma de IA de tu negocio.",
            btn_back_dashboard: "Volver al Panel",
            section_offer_title: "Acción Requerida: Oferta de Bienvenida", offer_desc: "La IA generará una oferta atractiva.", lbl_offer_prompt: "Describe tu oferta", btn_generate_offer: "Generar Oferta", lbl_offer_preview: "Vista Previa", offer_preview_placeholder: "La vista previa aparecerá aquí...", alert_offer_required: "Por favor, introduce una descripción.", generating: "Generando...", alert_generation_error: "Error de IA.", lbl_click_copy: "Copiar", alert_copied: "¡Copiado!",
            section_hours_title: "Acción Requerida: Horario de Apertura", lbl_morning: "Mañana", lbl_afternoon: "Tarde", section_assets_title: "Acción Requerida: Activos Visuales", lbl_logo: "Logo de la Empresa", upload_logo: "Subir logo", lbl_photo: "Foto Principal", upload_photo: "Subir foto",
            section_bot_title: "Acción Requerida: Configurar Bot", guide_bot_1: "Abrir <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Enviar de>/newbot</code>", guide_bot_3: "Elegir nombre/usuario", guide_bot_4: "<b>Copiar Token</b> y pegarlo", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Video Tutorial</a>", btn_link_bot: "Enlazar", status_linked: "Bot Enlazado ✅", alert_token_required: "Por favor, introduce el token.", alert_token_invalid: "Token inválido.", alert_link_error: "Error al enlazar",
            lbl_utterances: "Preguntas de Ejemplo", lbl_answer: "Respuesta Principal", lbl_summary: "Resumen", lbl_deepdive: "Detalles (P&R Específicas)", lbl_question: "Pregunta", btn_add_qa: "Añadir P&R",
            day_monday: "Lunes", day_tuesday: "Martes", day_wednesday: "Miércoles", day_thursday: "Jueves", day_friday: "Viernes", day_saturday: "Sábado", day_sunday: "Domingo",
            btn_save: "Guardar Cambios", saving_progress: "Guardando...", saving_success: "¡Guardado!",
            alert_loading_error: "Error al cargar.", alert_saving_error: "Error al guardar.",
            access_denied: "Acceso Denegado: Token faltante."
        },
        pt: {
            title: "Editor da Base de Conhecimento", subtitle: "Molde a alma de IA do seu negócio.",
            btn_back_dashboard: "Voltar ao Painel",
            section_offer_title: "Ação Necessária: Oferta de Boas-Vindas", offer_desc: "A IA irá gerar uma oferta atraente.", lbl_offer_prompt: "Descreva a sua oferta", btn_generate_offer: "Gerar Oferta", lbl_offer_preview: "Pré-visualização", offer_preview_placeholder: "A pré-visualização aparecerá aqui...", alert_offer_required: "Por favor, insira uma descrição.", generating: "Gerando...", alert_generation_error: "Erro de IA.", lbl_click_copy: "Copiar", alert_copied: "Copiado!",
            section_hours_title: "Ação Necessária: Horário de Funcionamento", lbl_morning: "Manhã", lbl_afternoon: "Tarde", section_assets_title: "Ação Necessária: Ativos Visuais", lbl_logo: "Logotipo da Empresa", upload_logo: "Carregar logo", lbl_photo: "Foto Principal", upload_photo: "Carregar foto",
            section_bot_title: "Ação Necessária: Configurar Bot", guide_bot_1: "Abrir <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Enviar de>/newbot</code>", guide_bot_3: "Escolher nome/utilizador", guide_bot_4: "<b>Copiar Token</b> e colar", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Tutorial em Vídeo</a>", btn_link_bot: "Ligar", status_linked: "Bot Ligado ✅", alert_token_required: "Por favor, insira o token.", alert_token_invalid: "Token inválido.", alert_link_error: "Erro ao ligar",
            lbl_utterances: "Perguntas de Exemplo", lbl_answer: "Resposta Principal", lbl_summary: "Resumo", lbl_deepdive: "Detalhes (P&R Específicas)", lbl_question: "Pergunta", btn_add_qa: "Adicionar P&R",
            day_monday: "Segunda-feira", day_tuesday: "Terça-feira", day_wednesday: "Quarta-feira", day_thursday: "Quinta-feira", day_friday: "Sexta-feira", day_saturday: "Sábado", day_sunday: "Domingo",
            btn_save: "Salvar Alterações", saving_progress: "Salvando...", saving_success: "Salvo!",
            alert_loading_error: "Erro ao carregar.", alert_saving_error: "Erro ao salvar.",
            access_denied: "Acesso Negado: Token em falta."
        }
    },

    init: function() {
        // Fallback più robusto per la lingua
        let l = urlParams.get('lang') || urlParams.get('language') || tg.initDataUnsafe?.user?.language_code || 'it';
        STATE.currentLang = this.dict[l.toLowerCase().slice(0, 2)] ? l.toLowerCase().slice(0, 2) : 'it';
        if (!this.dict[STATE.currentLang]) STATE.currentLang = 'it';
        
        this.apply();
    },

    get: function(key) {
        const d = this.dict[STATE.currentLang] || this.dict.it; 
        return d[key] || key;
    },

    apply: function() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.innerHTML = this.get(key)
                .replace('{botFatherUrl}', CONFIG.BOTFATHER_TG)
                .replace('{botVideoUrl}', CONFIG.BOTFATHER_VIDEO);
        });
    }
};

const Api = {
    // Helper Generico - INIEZIONE SECURITY AUTOMATICA
    async request(payload) {
        try {
            // Mappo il 'token' dell'URL nella chiave 'access_token' per il backend
            const securePayload = {
                ...payload,
                vat_number: STATE.vatNumber,
                access_token: STATE.accessToken, // <<< CHIAVE RICHIESTA DAL BACKEND
                lang: STATE.currentLang
            };

            const res = await fetch(CONFIG.WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(securePayload)
            });
            
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) throw new Error("Unauthorized Access");
                throw new Error(`HTTP ${res.status}`);
            }
            return await res.json();
        } catch (e) {
            console.error("API Error:", e);
            throw e;
        }
    },

    // Actions (Dati iniettati automaticamente da Api.request)
    getData: () => Api.request({ action: 'get_honeypot_data' }),
    saveData: (data) => Api.request({ action: 'save_honeypot_data', honeypot_update: data }),
    linkBot: (token) => Api.request({ action: 'link_telegram_bot', bot_token: token }),
    generateOffer: (prompt) => Api.request({ action: 'generate_offer_html', user_prompt: prompt }),
    analyzeAsset: (type, base64, mime) => Api.request({ action: 'analyze_image_asset', asset_type: type, file_data: base64, mime_type: mime })
};


// ==========================================
// 3. UI RENDERER
// ==========================================

const UI = {
    renderAll: () => {
        if (STATE.companyName) {
            // Mostra il nome azienda se presente nell'URL per personalizzare l'header (opzionale)
            // document.querySelector('h1').innerText = `${STATE.companyName} - ${I18n.get('title')}`;
        }
        UI.renderOffer();
        UI.renderKnowledge();
        UI.renderHours();
        UI.renderAssets();
        UI.renderBotConfig();
        I18n.apply();
    },

    renderOffer: () => {
        if (STATE.data.offer_text) {
            DOM.offerPreview.innerHTML = STATE.data.offer_text;
            DOM.offerStorage.value = STATE.data.offer_text;
        } else {
            DOM.offerPreview.innerHTML = `<em>${I18n.get('offer_preview_placeholder')}</em>`;
        }
    },

    renderKnowledge: () => {
        DOM.container.innerHTML = '';
        if (!STATE.data.knowledge_fragments) return;

        STATE.data.knowledge_fragments.forEach((fragment, index) => {
            const card = document.createElement('div');
            card.className = 'knowledge-card';
            const title = fragment.fragment_id.replace(/_V\d+$/, '').replace(/_/g, ' ');
            
            let deepDivesHtml = `<div id="deep-dive-${index}"></div>`;
            
            card.innerHTML = `
                <div class="card-header">
                    <h3><i class="fas fa-book-open"></i> ${title}</h3>
                    <i class="fas fa-chevron-down chevron"></i>
                </div>
                <div class="card-content">
                    <div class="input-group">
                        <label data-i18n="lbl_utterances"></label>
                        <div class="utterance-tags">${(fragment.user_utterances || []).map(u => `<span class="tag">${u}</span>`).join('')}</div>
                    </div>
                    <div class="input-group">
                        <label data-i18n="lbl_answer"></label>
                        <textarea data-path="knowledge_fragments.${index}.answer_fragment" rows="4">${fragment.answer_fragment || ''}</textarea>
                    </div>
                    <div class="input-group">
                        <label data-i18n="lbl_summary"></label>
                        <input type="text" data-path="knowledge_fragments.${index}.summary" value="${fragment.summary || ''}">
                    </div>
                    
                    <h4 class="section-title" data-i18n="lbl_deepdive"></h4>
                    ${deepDivesHtml}
                    <button type="button" class="btn btn-secondary btn-sm mt-2" onclick="window.App.addDeepDive(${index})">
                        <i class="fas fa-plus"></i> <span data-i18n="btn_add_qa"></span>
                    </button>
                </div>`;
            DOM.container.appendChild(card);
            UI.renderDeepDivesList(index);
        });
    },

    renderDeepDivesList: (fIndex) => {
        const container = document.getElementById(`deep-dive-${fIndex}`);
        if (!container) return;
        container.innerHTML = '';
        
        const sections = STATE.data.knowledge_fragments[fIndex].sections;
        if (sections) {
            sections.forEach((sec, sIndex) => {
                const item = document.createElement('div');
                item.className = 'card';
                item.style.cssText = 'padding:10px; margin-bottom:10px;';
                item.innerHTML = `
                    <div class="input-group" style="margin-bottom:8px;">
                        <input type="text" placeholder="${I18n.get('lbl_question')}" data-path="knowledge_fragments.${fIndex}.sections.${sIndex}.question" value="${sec.question || ''}" style="font-weight:600;">
                    </div>
                    <div class="input-group" style="margin-bottom:8px;">
                        <textarea placeholder="${I18n.get('lbl_answer')}" data-path="knowledge_fragments.${fIndex}.sections.${sIndex}.answer" rows="2">${sec.answer || ''}</textarea>
                    </div>
                    <button type="button" class="btn btn-sm btn-delete btn-icon" style="float:right;" onclick="window.App.removeDeepDive(${fIndex}, ${sIndex})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <div style="clear:both;"></div>`;
                container.appendChild(item);
            });
        }
    },

    renderHours: () => {
        DOM.hoursContainer.innerHTML = '';
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        days.forEach(day => {
            const row = document.createElement('div');
            row.className = 'hours-row';
            row.innerHTML = `
                <label data-i18n="day_${day}"></label>
                <div class="shifts-container">
                    <div class="shift-block">
                        <span class="shift-label" data-i18n="lbl_morning"></span>
                        <div class="time-inputs">
                            <select data-path="availability_schedule.hours.${day}.morning.from"></select> - 
                            <select data-path="availability_schedule.hours.${day}.morning.to"></select>
                        </div>
                    </div>
                    <div class="shift-block">
                        <span class="shift-label" data-i18n="lbl_afternoon"></span>
                        <div class="time-inputs">
                            <select data-path="availability_schedule.hours.${day}.afternoon.from"></select> - 
                            <select data-path="availability_schedule.hours.${day}.afternoon.to"></select>
                        </div>
                    </div>
                </div>`;
            DOM.hoursContainer.appendChild(row);
        });

        const generateOptions = () => {
            let html = `<option value="">--</option>`;
            for (let i = 0; i < 24; i++) html += `<option value="${i}">${i.toString().padStart(2, '0')}:00</option>`;
            return html;
        };

        DOM.hoursContainer.querySelectorAll('select').forEach(sel => sel.innerHTML = generateOptions());

        if (STATE.data.availability_schedule?.hours) {
            days.forEach(day => {
                const h = STATE.data.availability_schedule.hours[day] || {};
                const m = h.morning || {};
                const a = h.afternoon || {};
                const setVal = (path, val) => { 
                    const el = DOM.hoursContainer.querySelector(`[data-path="${path}"]`);
                    if(el) el.value = val ?? ''; 
                };
                setVal(`availability_schedule.hours.${day}.morning.from`, m.from);
                setVal(`availability_schedule.hours.${day}.morning.to`, m.to);
                setVal(`availability_schedule.hours.${day}.afternoon.from`, a.from);
                setVal(`availability_schedule.hours.${day}.afternoon.to`, a.to);
            });
        }
    },

    renderAssets: () => {
        const updatePreview = (id, data) => {
            const el = document.getElementById(`${id}-preview`);
            if (data && el) {
                let imgSrc = '';
                if (data.url) {
                    imgSrc = `${data.url}?t=${new Date().getTime()}`;
                } else if (data.base64) {
                    imgSrc = `data:${data.mime};base64,${data.base64}`;
                }

                if (imgSrc) {
                    el.innerHTML = `<img src="${imgSrc}"><p class="asset-description">${data.description || ''}</p>`;
                }
            }
        };
        
        if (STATE.data.assets) {
            updatePreview('logo', STATE.data.assets.logo);
            updatePreview('photo', STATE.data.assets.photo);
        }
    },

    renderBotConfig: () => {
        DOM.botTokenInput.value = STATE.data.config?.bot_token || '';
        if (STATE.data.config?.bot_linked) {
            DOM.botTokenInput.disabled = true;
            DOM.btnLinkBot.style.display = 'none';
            DOM.botStatus.style.display = 'block';
            DOM.botStatus.style.color = 'var(--success)';
            DOM.botStatus.innerHTML = `<i class="fas fa-check-circle"></i> ${I18n.get('status_linked')}`;
        }
    },

    setLoading: (isLoading, btn = null, loadingTextKey = null) => {
        if (btn) {
            if (isLoading) {
                btn.dataset.original = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> ${loadingTextKey ? I18n.get(loadingTextKey) : ''}`;
            } else {
                btn.disabled = false;
                btn.innerHTML = btn.dataset.original || btn.innerHTML;
            }
        }
    },

    toggleDirty: () => {
        const currentStr = JSON.stringify(STATE.data);
        STATE.isDirty = currentStr !== STATE.initialString;
        DOM.saveBar.classList.toggle('visible', STATE.isDirty);
        DOM.saveBtn.disabled = !STATE.isDirty;
    }
};


// ==========================================
// 4. CORE APPLICATION LOGIC
// ==========================================

const App = {
    init: async () => {
        // SECURITY CHECK: Verifico presenza 'token' e 'vat' nell'URL
        if (!STATE.vatNumber || !STATE.accessToken) {
            document.body.innerHTML = `
                <div style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;text-align:center;padding:20px;">
                    <i class="fas fa-lock" style="font-size:48px;color:#ff4d4d;margin-bottom:20px;"></i>
                    <h2 style="color:white;">Access Denied</h2>
                    <p style="color:#aaa;">Missing credentials (VAT or Token).</p>
                </div>`;
            return;
        }
        
        I18n.init();
        
        try {
            const data = await Api.getData();
            STATE.data = data.oHONEYPOT.HoneyPot;
            STATE.initialString = JSON.stringify(STATE.data);
            
            UI.renderAll();
            DOM.loader.classList.add('hidden');
            DOM.app.classList.remove('hidden');
        } catch (e) {
            if (e.message === "Unauthorized Access") {
                tg.showAlert("Security Error: Invalid Token.");
            } else {
                tg.showAlert(I18n.get('alert_loading_error'));
            }
        }

        App.attachEvents();
    },

    attachEvents: () => {
        DOM.app.addEventListener('click', (e) => {
            if (e.target.closest('.card-header')) {
                e.target.closest('.card-header').parentElement.classList.toggle('open');
            }
        });

        document.body.addEventListener('input', (e) => {
            const path = e.target.dataset.path;
            if (path) {
                App.setObjectValue(STATE.data, path, e.target.value);
                UI.toggleDirty();
            } else if (e.target.id === 'bot-token-input') {
                if (!STATE.data.config) STATE.data.config = {};
                STATE.data.config.bot_token = e.target.value;
                UI.toggleDirty();
            }
        });

        DOM.btnBack.addEventListener('click', () => {
            // Ricostruzione sicura dell'URL per la dashboard
            const params = new URLSearchParams();
            if (STATE.vatNumber) params.set('vat', STATE.vatNumber);
            if (STATE.accessToken) params.set('token', STATE.accessToken); // Mantengo 'token'
            if (STATE.ownerId) params.set('owner', STATE.ownerId);
            if (STATE.companyName) params.set('ragione_sociale', STATE.companyName);
            if (STATE.currentLang) params.set('lang', STATE.currentLang);
            
            window.location.href = `dashboard.html?${params.toString()}`;
        });
        
        DOM.saveBtn.addEventListener('click', App.save);
        DOM.btnGenerateOffer.addEventListener('click', App.generateOffer);
        DOM.btnCopyOffer.addEventListener('click', App.copyOffer);
        DOM.btnLinkBot.addEventListener('click', App.linkBot);
        
        const handleUpload = (type) => (e) => App.uploadAsset(type, e.target.files[0]);
        DOM.logoInput.addEventListener('change', handleUpload('logo'));
        DOM.photoInput.addEventListener('change', handleUpload('photo'));
    },

    setObjectValue: (obj, path, value) => {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key]) current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
            current = current[key];
        }
        current[keys[keys.length - 1]] = value;
    },

    // --- Actions ---

    addDeepDive: (fIndex) => {
        if (!STATE.data.knowledge_fragments[fIndex].sections) STATE.data.knowledge_fragments[fIndex].sections = [];
        STATE.data.knowledge_fragments[fIndex].sections.push({ question: '', answer: '' });
        UI.renderDeepDivesList(fIndex);
        UI.toggleDirty();
    },

    removeDeepDive: (fIndex, sIndex) => {
        STATE.data.knowledge_fragments[fIndex].sections.splice(sIndex, 1);
        UI.renderDeepDivesList(fIndex);
        UI.toggleDirty();
    },

    save: async () => {
        UI.setLoading(true, DOM.saveBtn, 'saving_progress');
        try {
            await Api.saveData(STATE.data);
            tg.HapticFeedback.notificationOccurred('success');
            STATE.initialString = JSON.stringify(STATE.data);
            DOM.saveBtn.innerHTML = `<i class="fas fa-check"></i> ${I18n.get('saving_success')}`;
            setTimeout(() => {
                UI.setLoading(false, DOM.saveBtn);
                UI.toggleDirty();
            }, 2000);
        } catch (e) {
            tg.showAlert(I18n.get('alert_saving_error'));
            UI.setLoading(false, DOM.saveBtn);
        }
    },

    generateOffer: async () => {
        const prompt = DOM.offerPrompt.value.trim();
        if (!prompt) return tg.showAlert(I18n.get('alert_offer_required'));
        
        UI.setLoading(true, DOM.btnGenerateOffer, 'generating');
        try {
            const res = await Api.generateOffer(prompt);
            if (res.html_content) {
                STATE.data.offer_text = res.html_content;
                UI.renderOffer();
                UI.toggleDirty();
            }
        } catch (e) {
            tg.showAlert(I18n.get('alert_generation_error'));
        } finally {
            UI.setLoading(false, DOM.btnGenerateOffer);
        }
    },

    linkBot: async () => {
        const token = DOM.botTokenInput.value.trim();
        if (!token) return tg.showAlert(I18n.get('alert_token_required'));
        
        UI.setLoading(true, DOM.btnLinkBot);
        try {
            const res = await Api.linkBot(token);
            if (res.ok === true) {
                if (!STATE.data.config) STATE.data.config = {};
                STATE.data.config.bot_token = token;
                STATE.data.config.bot_linked = true;
                UI.renderBotConfig();
                UI.toggleDirty();
                tg.HapticFeedback.notificationOccurred('success');
            } else {
                throw new Error(res.description || 'Unknown Error');
            }
        } catch (e) {
            tg.showAlert(`${I18n.get('alert_link_error')}: ${e.message}`);
        } finally {
            if(!STATE.data.config?.bot_linked) UI.setLoading(false, DOM.btnLinkBot);
        }
    },

    uploadAsset: async (type, file) => {
        if (!file) return;
        const previewEl = document.getElementById(`${type}-preview`);
        previewEl.innerHTML = `<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div>`;
        
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = reader.result.split(',')[1];
                const mime = reader.result.match(/:(.*?);/)[1];
                
                const res = await Api.analyzeAsset(type, base64, mime);
                
                const description = res.response_data?.description || res.description || "Analisi completata";

                if (!STATE.data.assets) STATE.data.assets = {};
                STATE.data.assets[type] = {
                    description: description,
                    base64: base64,
                    mime: mime
                };
                UI.renderAssets();
                UI.toggleDirty();
            };
        } catch (e) {
            tg.showAlert('Error analyzing asset');
            previewEl.innerHTML = '';
        }
    },

    copyOffer: () => {
        const html = DOM.offerStorage.value;
        if (!html) return;
        let text = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n\n').replace(/<\/?[^>]+(>|$)/g, "").trim();
        const link = `https://simonaiit.github.io/SiteBoS-MiniApp/SiteBos.html?vat=${STATE.vatNumber}`;
        if (!text.includes(link)) text += `\n\n👉 Accedi qui: ${link}`;

        navigator.clipboard.writeText(text).then(() => {
            tg.HapticFeedback.notificationOccurred('success');
            tg.showAlert(I18n.get('alert_copied'));
        });
    }
};

// ==========================================
// 5. INIT & EXPORTS
// ==========================================

window.App = {
    addDeepDive: App.addDeepDive,
    removeDeepDive: App.removeDeepDive
};

document.addEventListener('DOMContentLoaded', App.init);
