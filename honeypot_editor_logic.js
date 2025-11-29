/**
 * HONEYPOT EDITOR - LOGIC (v5.0 FINAL COMPLETE)
 * - Gestione Multilingua (I18n)
 * - Supporto Ibrido Asset (URL GitHub / Base64)
 * - Gestione Errori AI (501)
 * - Logica Completamento Onboarding (Redirect condizionale a Processing)
 * - Payload SessionStorage per Processor
 * - Integrazione Telegram WebApp
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

const urlParams = new URLSearchParams(window.location.search);

const STATE = {
    vatNumber: urlParams.get('vat'),
    accessToken: urlParams.get('token'),
    ownerId: urlParams.get('owner'),
    companyName: urlParams.get('ragione_sociale'),
    currentLang: 'it',
    data: {},          
    initialString: '', 
    isDirty: false
};

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

// Telegram WebApp Init
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
            access_denied: "Accesso Negato: Token mancante.",
            ai_error_title: "Ops! L'IA ha fatto cilecca 🤖", ai_error_msg: "La chiamata all'Intelligenza Artificiale non è andata a buon fine.\n\nPotrebbe essere un problema momentaneo. Per favore, riprova tra qualche secondo.", btn_retry: "Riprova",
            msg_saved_success: "✅ Dati aggiornati con successo.",
            msg_saved_incomplete: "⚠️ Salvato. Completa Logo, Foto e Offerta per lanciare il sito.",
            launching_process: "Lancio creazione sito..."
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
            access_denied: "Access Denied: Missing Token.",
            ai_error_title: "Oops! AI hiccup 🤖", ai_error_msg: "The Artificial Intelligence call failed.\n\nIt might be a temporary issue. Please try again in a few seconds.", btn_retry: "Retry",
            msg_saved_success: "✅ Data updated successfully.",
            msg_saved_incomplete: "⚠️ Saved. Complete Logo, Photo, and Offer to launch the site.",
            launching_process: "Launching site creation..."
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
            access_denied: "Accès Refusé : Jeton manquant.",
            ai_error_title: "Oups ! Raté de l'IA 🤖", ai_error_msg: "L'appel à l'Intelligence Artificielle a échoué.\n\nCela pourrait être un problème temporaire. Veuillez réessayer dans quelques secondes.", btn_retry: "Réessayer",
            msg_saved_success: "✅ Données mises à jour avec succès.",
            msg_saved_incomplete: "⚠️ Enregistré. Complétez Logo, Photo et Offre pour lancer le site.",
            launching_process: "Lancement de la création..."
        },
        de: {
            title: "Wissensdatenbank-Editor", subtitle: "Gestalten Sie die KI-Seele Ihres Unternehmens.",
            btn_back_dashboard: "Zurück zum Dashboard",
            section_offer_title: "Aktion Erforderlich: Willkommensangebot", offer_desc: "Die KI wird ein ansprechendes Angebot erstellen.", lbl_offer_prompt: "Beschreiben Sie Ihr Angebot", btn_generate_offer: "Angebot Erstellen", lbl_offer_preview: "Vorschau", offer_preview_placeholder: "Vorschau wird hier angezeigt...", alert_offer_required: "Bitte geben Sie eine Beschreibung ein.", generating: "Erstelle...", alert_generation_error: "KI-Fehler.", lbl_click_copy: "Kopieren", alert_copied: "Kopiert!",
            section_hours_title: "Aktion Erforderlich: Öffnungszeiten", lbl_morning: "Morgen", lbl_afternoon: "Nachmittag", section_assets_title: "Aktion Erforderlich: Visuelle Assets", lbl_logo: "Firmenlogo", upload_logo: "Logo hochladen", lbl_photo: "Hauptfoto", upload_photo: "Foto hochladen",
            section_bot_title: "Aktion Erforderlich: Bot Konfigurieren", guide_bot_1: "Öffnen Sie <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Senden Sie de>/newbot</code>", guide_bot_3: "Wählen Sie Name/Benutzername", guide_bot_4: "<b>Token kopieren</b> und einfügen", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Video-Tutorial</a>", btn_link_bot: "Verbinden", status_linked: "Bot Verbunden ✅", alert_token_required: "Bitte Token eingeben.", alert_token_invalid: "Ungültiges Token.", alert_link_error: "Verbindungsfehler",
            lbl_utterances: "Beispielfragen", lbl_answer: "Hauptantwort", lbl_summary: "Zusammenfassung", lbl_deepdive: "Details (Spezifische F&A)", lbl_question: "Frage", btn_add_qa: "F&A Hinzufügen",
            day_monday: "Montag", day_tuesday: "Dienstag", day_wednesday: "Mittwoch", day_thursday: "Donnerstag", day_friday: "Freitag", day_saturday: "Samstag", day_sunday: "Sonntag",
            btn_save: "Speichern", saving_progress: "Speichern...", saving_success: "Gespeichert!",
            alert_loading_error: "Ladefehler.", alert_saving_error: "Speicherfehler.",
            access_denied: "Zugriff Verweigert: Token fehlt.",
            ai_error_title: "Hoppla! KI-Fehler 🤖", ai_error_msg: "Der Aufruf der Künstlichen Intelligenz ist fehlgeschlagen.\n\nDies könnte ein vorübergehendes Problem sein. Bitte versuchen Sie es in einigen Sekunden erneut.", btn_retry: "Erneut versuchen",
            msg_saved_success: "✅ Daten erfolgreich aktualisiert.",
            msg_saved_incomplete: "⚠️ Gespeichert. Vervollständigen Sie Logo, Foto und Angebot.",
            launching_process: "Starte Website-Erstellung..."
        },
        es: {
            title: "Editor de Base de Conocimiento", subtitle: "Modela el alma de IA de tu negocio.",
            btn_back_dashboard: "Volver al Panel",
            section_offer_title: "Acción Requerida: Oferta de Bienvenida", offer_desc: "La IA generará una oferta atractiva.", lbl_offer_prompt: "Describe tu oferta", btn_generate_offer: "Generar Oferta", lbl_offer_preview: "Vista Previa", offer_preview_placeholder: "La vista previa aparecerá aquí...", alert_offer_required: "Por favor, introduce una descripción.", generating: "Generando...", alert_generation_error: "Error de IA.", lbl_click_copy: "Copiar", alert_copied: "¡Copiado!",
            section_hours_title: "Acción Requerida: Horario de Apertura", lbl_morning: "Mañana", lbl_afternoon: "Tarde", section_assets_title: "Acción Requerida: Activos Visuales", lbl_logo: "Logo de la Empresa", upload_logo: "Subir logo", lbl_photo: "Foto Principal", upload_photo: "Subir foto",
            section_bot_title: "Acción Requerida: Configurar Bot", guide_bot_1: "Abrir <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Enviar de>/newbot</code>", guide_bot_3: "Elegir nombre/usuario", guide_bot_4: "<b>Copiar Token</b> y pegarlo", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Video Tutorial</a>", btn_link_bot: "Enlazar", status_linked: "Bot Enlazado ✅", alert_token_required: "Por favor, introduce el token.", alert_token_invalid: "Token inválido.", alert_link_error: "Error al enlazar",
            lbl_utterances: "Preguntas de Ejemplo", lbl_answer: "Respuesta Principal", lbl_summary: "Resumen", lbl_deepdive: "Detalles (P&R Específicas)", lbl_question: "Pregunta", btn_add_qa: "Añadir P&R",
            day_monday: "Lunes", day_tuesday: "Martes", day_wednesday: "Miércoles", day_thursday: "Jueves", day_friday: "Viernes", day_saturday: "Sábado", day_sunday: "Domingo",
            btn_save: "Guardar", saving_progress: "Guardando...", saving_success: "¡Guardado!",
            alert_loading_error: "Error al cargar.", alert_saving_error: "Error al guardar.",
            access_denied: "Acceso Denegado: Token faltante.",
            ai_error_title: "¡Vaya! Fallo de IA 🤖", ai_error_msg: "La llamada a la Inteligencia Artificial ha fallado.\n\nPodría ser un problema temporal. Por favor, inténtalo de nuevo en unos segundos.", btn_retry: "Reintentar",
            msg_saved_success: "✅ Datos actualizados con éxito.",
            msg_saved_incomplete: "⚠️ Guardado. Completa Logo, Foto y Oferta para lanzar el sitio.",
            launching_process: "Iniciando creación del sitio..."
        },
        pt: {
            title: "Editor da Base de Conhecimento", subtitle: "Molde a alma de IA do seu negócio.",
            btn_back_dashboard: "Voltar ao Painel",
            section_offer_title: "Ação Necessária: Oferta de Boas-Vindas", offer_desc: "A IA irá gerar uma oferta atraente.", lbl_offer_prompt: "Descreva a sua oferta", btn_generate_offer: "Gerar Oferta", lbl_offer_preview: "Pré-visualização", offer_preview_placeholder: "A pré-visualização aparecerá aqui...", alert_offer_required: "Por favor, insira uma descrição.", generating: "Gerando...", alert_generation_error: "Erro de IA.", lbl_click_copy: "Copiar", alert_copied: "Copiado!",
            section_hours_title: "Ação Necessária: Horário de Funcionamento", lbl_morning: "Manhã", lbl_afternoon: "Tarde", section_assets_title: "Ação Necessária: Ativos Visuais", lbl_logo: "Logotipo da Empresa", upload_logo: "Carregar logo", lbl_photo: "Foto Principal", upload_photo: "Carregar foto",
            section_bot_title: "Ação Necessária: Configurar Bot", guide_bot_1: "Abrir <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Enviar de>/newbot</code>", guide_bot_3: "Escolher nome/utilizador", guide_bot_4: "<b>Copiar Token</b> e colar", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Tutorial em Vídeo</a>", btn_link_bot: "Ligar", status_linked: "Bot Ligado ✅", alert_token_required: "Por favor, insira o token.", alert_token_invalid: "Token inválido.", alert_link_error: "Erro ao ligar",
            lbl_utterances: "Perguntas de Exemplo", lbl_answer: "Resposta Principal", lbl_summary: "Resumo", lbl_deepdive: "Detalhes (P&R Específicas)", lbl_question: "Pergunta", btn_add_qa: "Adicionar P&R",
            day_monday: "Segunda-feira", day_tuesday: "Terça-feira", day_wednesday: "Quarta-feira", day_thursday: "Quinta-feira", day_friday: "Sexta-feira", day_saturday: "Sábado", day_sunday: "Domingo",
            btn_save: "Salvar", saving_progress: "Salvando...", saving_success: "Salvo!",
            alert_loading_error: "Erro ao carregar.", alert_saving_error: "Erro ao salvar.",
            access_denied: "Acesso Negado: Token em falta.",
            ai_error_title: "Ops! Soluço da IA 🤖", ai_error_msg: "A chamada para a Inteligência Artificial falhou.\n\nPode ser um problema temporário. Por favor, tente novamente em alguns segundos.", btn_retry: "Tentar Novamente",
            msg_saved_success: "✅ Dados atualizados com sucesso.",
            msg_saved_incomplete: "⚠️ Salvo. Complete Logo, Foto e Oferta para lançar o site.",
            launching_process: "Iniciando criação do site..."
        }
    },

    init: function() {
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
    async request(payload) {
        try {
            const securePayload = {
                ...payload,
                vat_number: STATE.vatNumber,
                access_token: STATE.accessToken,
                owner_id: STATE.ownerId, 
                lang: STATE.currentLang
            };

            const res = await fetch(CONFIG.WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(securePayload)
            });
            
            if (res.status === 501) {
                tg.showPopup({
                    title: I18n.get('ai_error_title'), message: I18n.get('ai_error_msg'),
                    buttons: [{type: 'ok', text: I18n.get('btn_retry')}]
                });
                throw new Error("AI_ERROR_501_HANDLED");
            }

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) throw new Error("Unauthorized Access");
                if (res.status === 500) throw new Error("Server Error");
                throw new Error(`HTTP ${res.status}`);
            }
            
            return await res.json();

        } catch (e) {
            if (e.message === "AI_ERROR_501_HANDLED") return null;
            console.error("API Error:", e);
            if (e.message !== "Unauthorized Access") tg.showAlert(I18n.get('alert_loading_error') + (e.message ? ` (${e.message})` : ''));
            throw e;
        }
    },

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
                <div class="card-header"><h3><i class="fas fa-book-open"></i> ${title}</h3><i class="fas fa-chevron-down chevron"></i></div>
                <div class="card-content">
                    <div class="input-group"><label data-i18n="lbl_utterances"></label><div class="utterance-tags">${(fragment.user_utterances || []).map(u => `<span class="tag">${u}</span>`).join('')}</div></div>
                    <div class="input-group"><label data-i18n="lbl_answer"></label><textarea data-path="knowledge_fragments.${index}.answer_fragment" rows="4">${fragment.answer_fragment || ''}</textarea></div>
                    <div class="input-group"><label data-i18n="lbl_summary"></label><input type="text" data-path="knowledge_fragments.${index}.summary" value="${fragment.summary || ''}"></div>
                    <h4 class="section-title" data-i18n="lbl_deepdive"></h4>${deepDivesHtml}
                    <button type="button" class="btn btn-secondary btn-sm mt-2" onclick="window.App.addDeepDive(${index})"><i class="fas fa-plus"></i> <span data-i18n="btn_add_qa"></span></button>
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
                    <div class="input-group" style="margin-bottom:8px;"><input type="text" placeholder="${I18n.get('lbl_question')}" data-path="knowledge_fragments.${fIndex}.sections.${sIndex}.question" value="${sec.question || ''}" style="font-weight:600;"></div>
                    <div class="input-group" style="margin-bottom:8px;"><textarea placeholder="${I18n.get('lbl_answer')}" data-path="knowledge_fragments.${fIndex}.sections.${sIndex}.answer" rows="2">${sec.answer || ''}</textarea></div>
                    <button type="button" class="btn btn-sm btn-delete btn-icon" style="float:right;" onclick="window.App.removeDeepDive(${fIndex}, ${sIndex})"><i class="fas fa-trash"></i></button><div style="clear:both;"></div>`;
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
            row.innerHTML = `<label data-i18n="day_${day}"></label>
                <div class="shifts-container">
                    <div class="shift-block"><span class="shift-label" data-i18n="lbl_morning"></span><div class="time-inputs"><select data-path="availability_schedule.hours.${day}.morning.from"></select> - <select data-path="availability_schedule.hours.${day}.morning.to"></select></div></div>
                    <div class="shift-block"><span class="shift-label" data-i18n="lbl_afternoon"></span><div class="time-inputs"><select data-path="availability_schedule.hours.${day}.afternoon.from"></select> - <select data-path="availability_schedule.hours.${day}.afternoon.to"></select></div></div>
                </div>`;
            DOM.hoursContainer.appendChild(row);
        });
        const generateOptions = () => { let html = `<option value="">--</option>`; for (let i = 0; i < 24; i++) html += `<option value="${i}">${i.toString().padStart(2, '0')}:00</option>`; return html; };
        DOM.hoursContainer.querySelectorAll('select').forEach(sel => sel.innerHTML = generateOptions());
        if (STATE.data.availability_schedule?.hours) {
            days.forEach(day => {
                const h = STATE.data.availability_schedule.hours[day] || {};
                const m = h.morning || {}; const a = h.afternoon || {};
                const setVal = (path, val) => { const el = DOM.hoursContainer.querySelector(`[data-path="${path}"]`); if(el) el.value = val ?? ''; };
                setVal(`availability_schedule.hours.${day}.morning.from`, m.from); setVal(`availability_schedule.hours.${day}.morning.to`, m.to);
                setVal(`availability_schedule.hours.${day}.afternoon.from`, a.from); setVal(`availability_schedule.hours.${day}.afternoon.to`, a.to);
            });
        }
    },

    renderAssets: () => {
        const updatePreview = (id, data) => {
            const el = document.getElementById(`${id}-preview`);
            if (data && el) {
                let imgSrc = data.url ? `${data.url}?t=${Date.now()}` : (data.base64 ? `data:${data.mime};base64,${data.base64}` : '');
                if (imgSrc) el.innerHTML = `<img src="${imgSrc}"><p class="asset-description">${data.description || ''}</p>`;
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
        if (!STATE.vatNumber || !STATE.accessToken) return document.body.innerHTML = `<h2 style="color:white;text-align:center;margin-top:50px;">Access Denied</h2>`;
        I18n.init();
        try {
            const data = await Api.getData();
            STATE.data = data.HoneyPot || data.oHONEYPOT?.HoneyPot || {};
            STATE.initialString = JSON.stringify(STATE.data);
            UI.renderAll();
            DOM.loader.classList.add('hidden'); DOM.app.classList.remove('hidden');
        } catch (e) { if (e.message === "Unauthorized Access") tg.showAlert("Security Error: Invalid Token."); }
        App.attachEvents();
    },

    attachEvents: () => {
        DOM.app.addEventListener('click', (e) => { if (e.target.closest('.card-header')) e.target.closest('.card-header').parentElement.classList.toggle('open'); });
        document.body.addEventListener('input', (e) => {
            if (e.target.dataset.path) { App.setObjectValue(STATE.data, e.target.dataset.path, e.target.value); UI.toggleDirty(); }
            else if (e.target.id === 'bot-token-input') { if (!STATE.data.config) STATE.data.config = {}; STATE.data.config.bot_token = e.target.value; UI.toggleDirty(); }
        });
        DOM.btnBack.addEventListener('click', () => {
            const params = new URLSearchParams();
            if (STATE.vatNumber) params.set('vat', STATE.vatNumber); if (STATE.accessToken) params.set('token', STATE.accessToken);
            if (STATE.ownerId) params.set('owner', STATE.ownerId); if (STATE.companyName) params.set('ragione_sociale', STATE.companyName);
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
        const keys = path.split('.'); let current = obj;
        for (let i = 0; i < keys.length - 1; i++) { const key = keys[i]; if (!current[key]) current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {}; current = current[key]; }
        current[keys[keys.length - 1]] = value;
    },

    // --- LOGICA DI SALVATAGGIO E COMPLETAMENTO ---
    save: async () => {
        UI.setLoading(true, DOM.saveBtn, 'saving_progress');
        
        try {
            const hp = STATE.data || {};
            const assets = hp.assets || {};
            const offer = hp.offer || {};
            
            const isComplete = (
                !!assets.logo?.url && 
                !!assets.representative_image?.url && 
                !!offer.description && offer.description.length > 5
            );

            const isFirstRun = hp.config?.onboarding_completed === false || !hp.config?.onboarding_completed;

            // --- SCENARIO A: PRIMA VOLTA COMPLETO -> LANCIA ---
            if (isComplete && isFirstRun) {
                
                if (!STATE.data.config) STATE.data.config = {};
                STATE.data.config.onboarding_completed = true;
                STATE.data.config.completed_at = new Date().toISOString();

                await Api.saveData(STATE.data);

                const ownerKey = STATE.ownerId;
                const fullPayload = {
                    vat_number: STATE.vatNumber,
                    access_token: STATE.accessToken,
                    owner_id: STATE.ownerId,
                    honeypot_data: STATE.data,
                    command: "BUILD_SITE"
                };

                sessionStorage.setItem(`pending_payload_${ownerKey}`, JSON.stringify(fullPayload));

                DOM.saveBtn.innerHTML = `<i class="fas fa-rocket"></i> ${I18n.get('launching_process')}`;
                setTimeout(() => {
                    window.location.href = `processing.html?call=honeypot_build_trigger&owner_key=${ownerKey}`;
                }, 800);

                return;
            }

            // --- SCENARIO B: SOLO SALVA ---
            else {
                await Api.saveData(STATE.data);
                tg.HapticFeedback.notificationOccurred('success');
                STATE.initialString = JSON.stringify(STATE.data);
                DOM.saveBtn.innerHTML = `<i class="fas fa-check"></i> ${I18n.get('saving_success')}`;
                const alertMsg = isComplete ? 'msg_saved_success' : 'msg_saved_incomplete';
                tg.showAlert(I18n.get(alertMsg));
                setTimeout(() => { UI.setLoading(false, DOM.saveBtn); UI.toggleDirty(); }, 2000);
            }
        } catch (e) {
            UI.setLoading(false, DOM.saveBtn);
            tg.showAlert(I18n.get('alert_saving_error'));
        }
    },

    generateOffer: async () => {
        const prompt = DOM.offerPrompt.value.trim();
        if (!prompt) return tg.showAlert(I18n.get('alert_offer_required'));
        UI.setLoading(true, DOM.btnGenerateOffer, 'generating');
        try {
            const res = await Api.generateOffer(prompt);
            if (res && res.html_content) { STATE.data.offer_text = res.html_content; UI.renderOffer(); UI.toggleDirty(); }
        } catch (e) {} finally { UI.setLoading(false, DOM.btnGenerateOffer); }
    },

    linkBot: async () => {
        const token = DOM.botTokenInput.value.trim();
        if (!token) return tg.showAlert(I18n.get('alert_token_required'));
        UI.setLoading(true, DOM.btnLinkBot);
        try {
            const res = await Api.linkBot(token);
            if (res && res.ok === true) {
                if (!STATE.data.config) STATE.data.config = {};
                STATE.data.config.bot_token = token; STATE.data.config.bot_linked = true;
                UI.renderBotConfig(); UI.toggleDirty(); tg.HapticFeedback.notificationOccurred('success');
            } else throw new Error(res.description || 'Unknown Error');
        } catch (e) { if (e.message !== "AI_ERROR_501_HANDLED") tg.showAlert(`${I18n.get('alert_link_error')}: ${e.message}`); } 
        finally { if(!STATE.data.config?.bot_linked) UI.setLoading(false, DOM.btnLinkBot); }
    },

    uploadAsset: async (type, file) => {
        if (!file) return;
        const previewEl = document.getElementById(`${type}-preview`);
        previewEl.innerHTML = `<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div>`;
        try {
            const reader = new FileReader(); reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = reader.result.split(',')[1]; const mime = reader.result.match(/:(.*?);/)[1];
                const res = await Api.analyzeAsset(type, base64, mime);
                if (res) {
                    const desc = res.response_data?.description || res.description || "Analisi completata";
                    if (!STATE.data.assets) STATE.data.assets = {};
                    STATE.data.assets[type] = { description: desc, mime: mime, url: res.url || null, base64: res.url ? null : base64 };
                    UI.renderAssets(); UI.toggleDirty();
                } else { previewEl.innerHTML = ''; }
            };
        } catch (e) { previewEl.innerHTML = ''; }
    },

    copyOffer: () => {
        const html = DOM.offerStorage.value; if (!html) return;
        let text = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n\n').replace(/<\/?[^>]+(>|$)/g, "").trim();
        const link = `https://simonaiit.github.io/SiteBoS-MiniApp/SiteBos.html?vat=${STATE.vatNumber}`;
        if (!text.includes(link)) text += `\n\n👉 Accedi qui: ${link}`;
        navigator.clipboard.writeText(text).then(() => { tg.HapticFeedback.notificationOccurred('success'); tg.showAlert(I18n.get('alert_copied')); });
    }
};

window.App = { addDeepDive: App.addDeepDive, removeDeepDive: App.removeDeepDive };
document.addEventListener('DOMContentLoaded', App.init);
