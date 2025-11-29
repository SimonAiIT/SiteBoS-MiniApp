/**
 * HONEYPOT EDITOR - LOGIC (v2.3 - DEFINITIVE)
 * - Supporto 6 Lingue completo e non abbreviato.
 * - Estrazione lingua da URL (case-insensitive).
 * - FIX APERTURA CARD con Event Delegation.
 * - Orari con Mattina/Pomeriggio.
 * - Aggiunto pulsante flottante per tornare alla Dashboard.
 * - REINTEGRATA action 'get_honeypot_data'.
 * - NESSUNA PARTE DI CODICE OMESSA.
 */

// --- CONFIG & GLOBAL STATE ---
const WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/48ee3cba-99dc-407a-98af-624e97b1e888";
const BOTFATHER_VIDEO_URL = "https://www.youtube.com/watch?v=7a8UWhJWurs";

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const urlParams = new URLSearchParams(window.location.search);
const vatNumber = urlParams.get('vat');

let honeypotData = {};
let initialDataString = '';
let currentLang = 'it'; // Default

// --- I18N DICTIONARY (6 LANGUAGES - UNABRIDGED) ---
const i18n = {
  it: {
    title: "Editor Base di Conoscenza", subtitle: "Modella l'anima AI della tua azienda.",
    btn_back_dashboard: "Torna alla Dashboard",
    section_offer_title: "Azione Richiesta: Offerta Benvenuto", offer_desc: "L'AI genererà un'offerta accattivante per te.", lbl_offer_prompt: "Descrivi la tua offerta", btn_generate_offer: "Genera Offerta", lbl_offer_preview: "Anteprima", offer_preview_placeholder: "Qui vedrai l'anteprima...", alert_offer_required: "Inserisci una descrizione.", generating: "Generazione...", alert_generation_error: "Errore AI.", lbl_click_copy: "Copia", alert_copied: "Copiato!",
    section_hours_title: "Azione Richiesta: Orari", lbl_morning: "Mattina", lbl_afternoon: "Pomeriggio", section_assets_title: "Azione Richiesta: Asset Visivi", lbl_logo: "Logo Aziendale", upload_logo: "Carica logo", lbl_photo: "Foto Rappresentativa", upload_photo: "Carica foto",
    section_bot_title: "Azione Richiesta: Configura Bot", guide_bot_1: "Apri <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Invia <code>/newbot</code>", guide_bot_3: "Scegli nome/username", guide_bot_4: "<b>Copia Token</b> e incollalo", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Video Tutorial</a>", btn_link_bot: "Associa", status_linked: "Bot Associato ✅", alert_token_required: "Inserisci il token.", alert_token_invalid: "Token non valido.", alert_link_error: "Errore Associazione",
    lbl_utterances: "Domande Esempio", lbl_answer: "Risposta Principale", lbl_summary: "Sintesi", lbl_deepdive: "Approfondimenti (Q&A Specifiche)", lbl_question: "Domanda", btn_add_qa: "Aggiungi D&R",
    day_monday: "Lunedì", day_tuesday: "Martedì", day_wednesday: "Mercoledì", day_thursday: "Giovedì", day_friday: "Venerdì", day_saturday: "Sabato", day_sunday: "Domenica",
    btn_save: "Salva Modifiche", saving_progress: "Salvataggio...", saving_success: "Salvato!",
    alert_loading_error: "Errore caricamento.", alert_saving_error: "Errore salvataggio."
  },
  en: {
    title: "Knowledge Base Editor", subtitle: "Shape your business AI soul.",
    btn_back_dashboard: "Back to Dashboard",
    section_offer_title: "Action Required: Welcome Offer", offer_desc: "AI will generate an engaging offer.", lbl_offer_prompt: "Describe your offer", btn_generate_offer: "Generate Offer", lbl_offer_preview: "Preview", offer_preview_placeholder: "Preview will appear here...", alert_offer_required: "Please enter a description.", generating: "Generating...", alert_generation_error: "AI Error.", lbl_click_copy: "Copy", alert_copied: "Copied!",
    section_hours_title: "Action Required: Opening Hours", lbl_morning: "Morning", lbl_afternoon: "Afternoon", section_assets_title: "Action Required: Visual Assets", lbl_logo: "Company Logo", upload_logo: "Upload logo", lbl_photo: "Main Photo", upload_photo: "Upload photo",
    section_bot_title: "Action Required: Configure Bot", guide_bot_1: "Open <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Send <code>/newbot</code>", guide_bot_3: "Choose name/username", guide_bot_4: "<b>Copy Token</b> and paste it here", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Video Tutorial</a>", btn_link_bot: "Link", status_linked: "Bot Linked ✅", alert_token_required: "Please enter the token.", alert_token_invalid: "Invalid token.", alert_link_error: "Linking Error",
    lbl_utterances: "Sample Questions", lbl_answer: "Main Answer", lbl_summary: "Summary", lbl_deepdive: "Deep Dives (Specific Q&A)", lbl_question: "Question", btn_add_qa: "Add Q&A",
    day_monday: "Monday", day_tuesday: "Tuesday", day_wednesday: "Wednesday", day_thursday: "Thursday", day_friday: "Friday", day_saturday: "Saturday", day_sunday: "Sunday",
    btn_save: "Save Changes", saving_progress: "Saving...", saving_success: "Saved!",
    alert_loading_error: "Loading error.", alert_saving_error: "Saving error."
  },
  fr: {
    title: "Éditeur de Base de Connaissances", subtitle: "Modelez l'âme IA de votre entreprise.",
    btn_back_dashboard: "Retour au Tableau de Bord",
    section_offer_title: "Action Requise : Offre de Bienvenue", offer_desc: "L'IA générera une offre attrayante.", lbl_offer_prompt: "Décrivez votre offre", btn_generate_offer: "Générer Offre", lbl_offer_preview: "Aperçu", offer_preview_placeholder: "L'aperçu apparaîtra ici...", alert_offer_required: "Veuillez entrer une description.", generating: "Génération...", alert_generation_error: "Erreur IA.", lbl_click_copy: "Copier", alert_copied: "Copié !",
    section_hours_title: "Action Requise : Heures d'Ouverture", lbl_morning: "Matin", lbl_afternoon: "Après-midi", section_assets_title: "Action Requise : Éléments Visuels", lbl_logo: "Logo de l'entreprise", upload_logo: "Charger logo", lbl_photo: "Photo Principale", upload_photo: "Charger photo",
    section_bot_title: "Action Requise : Configurer le Bot", guide_bot_1: "Ouvrir <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Envoyer <code>/newbot</code>", guide_bot_3: "Choisir nom/utilisateur", guide_bot_4: "<b>Copiez le Jeton</b> et collez-le", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Tutoriel Vidéo</a>", btn_link_bot: "Associer", status_linked: "Bot Associé ✅", alert_token_required: "Veuillez entrer le jeton.", alert_token_invalid: "Jeton invalide.", alert_link_error: "Erreur d'association",
    lbl_utterances: "Questions Exemples", lbl_answer: "Réponse Principale", lbl_summary: "Résumé", lbl_deepdive: "Détails (Q&R Spécifiques)", lbl_question: "Question", btn_add_qa: "Ajouter Q&R",
    day_monday: "Lundi", day_tuesday: "Mardi", day_wednesday: "Mercredi", day_thursday: "Jeudi", day_friday: "Vendredi", day_saturday: "Samedi", day_sunday: "Dimanche",
    btn_save: "Enregistrer", saving_progress: "Enregistrement...", saving_success: "Enregistré !",
    alert_loading_error: "Erreur de chargement.", alert_saving_error: "Erreur d'enregistrement."
  },
  de: {
    title: "Wissensdatenbank-Editor", subtitle: "Gestalten Sie die KI-Seele Ihres Unternehmens.",
    btn_back_dashboard: "Zurück zum Dashboard",
    section_offer_title: "Aktion Erforderlich: Willkommensangebot", offer_desc: "Die KI wird ein ansprechendes Angebot erstellen.", lbl_offer_prompt: "Beschreiben Sie Ihr Angebot", btn_generate_offer: "Angebot Erstellen", lbl_offer_preview: "Vorschau", offer_preview_placeholder: "Vorschau wird hier angezeigt...", alert_offer_required: "Bitte geben Sie eine Beschreibung ein.", generating: "Erstelle...", alert_generation_error: "KI-Fehler.", lbl_click_copy: "Kopieren", alert_copied: "Kopiert!",
    section_hours_title: "Aktion Erforderlich: Öffnungszeiten", lbl_morning: "Morgen", lbl_afternoon: "Nachmittag", section_assets_title: "Aktion Erforderlich: Visuelle Assets", lbl_logo: "Firmenlogo", upload_logo: "Logo hochladen", lbl_photo: "Hauptfoto", upload_photo: "Foto hochladen",
    section_bot_title: "Aktion Erforderlich: Bot Konfigurieren", guide_bot_1: "Öffnen Sie <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Senden Sie <code>/newbot</code>", guide_bot_3: "Wählen Sie Name/Benutzername", guide_bot_4: "<b>Token kopieren</b> und einfügen", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Video-Tutorial</a>", btn_link_bot: "Verbinden", status_linked: "Bot Verbunden ✅", alert_token_required: "Bitte Token eingeben.", alert_token_invalid: "Ungültiges Token.", alert_link_error: "Verbindungsfehler",
    lbl_utterances: "Beispielfragen", lbl_answer: "Hauptantwort", lbl_summary: "Zusammenfassung", lbl_deepdive: "Details (Spezifische F&A)", lbl_question: "Frage", btn_add_qa: "F&A Hinzufügen",
    day_monday: "Montag", day_tuesday: "Dienstag", day_wednesday: "Mittwoch", day_thursday: "Donnerstag", day_friday: "Freitag", day_saturday: "Samstag", day_sunday: "Sonntag",
    btn_save: "Änderungen Speichern", saving_progress: "Speichern...", saving_success: "Gespeichert!",
    alert_loading_error: "Ladefehler.", alert_saving_error: "Speicherfehler."
  },
  es: {
    title: "Editor de Base de Conocimiento", subtitle: "Modela el alma de IA de tu negocio.",
    btn_back_dashboard: "Volver al Panel",
    section_offer_title: "Acción Requerida: Oferta de Bienvenida", offer_desc: "La IA generará una oferta atractiva.", lbl_offer_prompt: "Describe tu oferta", btn_generate_offer: "Generar Oferta", lbl_offer_preview: "Vista Previa", offer_preview_placeholder: "La vista previa aparecerá aquí...", alert_offer_required: "Por favor, introduce una descripción.", generating: "Generando...", alert_generation_error: "Error de IA.", lbl_click_copy: "Copiar", alert_copied: "¡Copiado!",
    section_hours_title: "Acción Requerida: Horario de Apertura", lbl_morning: "Mañana", lbl_afternoon: "Tarde", section_assets_title: "Acción Requerida: Activos Visuales", lbl_logo: "Logo de la Empresa", upload_logo: "Subir logo", lbl_photo: "Foto Principal", upload_photo: "Subir foto",
    section_bot_title: "Acción Requerida: Configurar Bot", guide_bot_1: "Abrir <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Enviar <code>/newbot</code>", guide_bot_3: "Elegir nombre/usuario", guide_bot_4: "<b>Copiar Token</b> y pegarlo", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Video Tutorial</a>", btn_link_bot: "Enlazar", status_linked: "Bot Enlazado ✅", alert_token_required: "Por favor, introduce el token.", alert_token_invalid: "Token inválido.", alert_link_error: "Error al enlazar",
    lbl_utterances: "Preguntas de Ejemplo", lbl_answer: "Respuesta Principal", lbl_summary: "Resumen", lbl_deepdive: "Detalles (P&R Específicas)", lbl_question: "Pregunta", btn_add_qa: "Añadir P&R",
    day_monday: "Lunes", day_tuesday: "Martes", day_wednesday: "Miércoles", day_thursday: "Jueves", day_friday: "Viernes", day_saturday: "Sábado", day_sunday: "Domingo",
    btn_save: "Guardar Cambios", saving_progress: "Guardando...", saving_success: "¡Guardado!",
    alert_loading_error: "Error al cargar.", alert_saving_error: "Error al guardar."
  },
  pt: {
    title: "Editor da Base de Conhecimento", subtitle: "Molde a alma de IA do seu negócio.",
    btn_back_dashboard: "Voltar ao Painel",
    section_offer_title: "Ação Necessária: Oferta de Boas-Vindas", offer_desc: "A IA irá gerar uma oferta atraente.", lbl_offer_prompt: "Descreva a sua oferta", btn_generate_offer: "Gerar Oferta", lbl_offer_preview: "Pré-visualização", offer_preview_placeholder: "A pré-visualização aparecerá aqui...", alert_offer_required: "Por favor, insira uma descrição.", generating: "Gerando...", alert_generation_error: "Erro de IA.", lbl_click_copy: "Copiar", alert_copied: "Copiado!",
    section_hours_title: "Ação Necessária: Horário de Funcionamento", lbl_morning: "Manhã", lbl_afternoon: "Tarde", section_assets_title: "Ação Necessária: Ativos Visuais", lbl_logo: "Logotipo da Empresa", upload_logo: "Carregar logo", lbl_photo: "Foto Principal", upload_photo: "Carregar foto",
    section_bot_title: "Ação Necessária: Configurar Bot", guide_bot_1: "Abrir <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Enviar <code>/newbot</code>", guide_bot_3: "Escolher nome/utilizador", guide_bot_4: "<b>Copiar Token</b> e colar", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Tutorial em Vídeo</a>", btn_link_bot: "Ligar", status_linked: "Bot Ligado ✅", alert_token_required: "Por favor, insira o token.", alert_token_invalid: "Token inválido.", alert_link_error: "Erro ao ligar",
    lbl_utterances: "Perguntas de Exemplo", lbl_answer: "Resposta Principal", lbl_summary: "Resumo", lbl_deepdive: "Detalhes (P&R Específicas)", lbl_question: "Pergunta", btn_add_qa: "Adicionar P&R",
    day_monday: "Segunda-feira", day_tuesday: "Terça-feira", day_wednesday: "Quarta-feira", day_thursday: "Quinta-feira", day_friday: "Sexta-feira", day_saturday: "Sábado", day_sunday: "Domingo",
    btn_save: "Salvar Alterações", saving_progress: "Salvando...", saving_success: "Salvo!",
    alert_loading_error: "Erro ao carregar.", alert_saving_error: "Erro ao salvar."
  }
};

// --- DOM REFERENCES ---
const dom = {
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
    offerStorage: document.getElementById('offer_html_storage')
};

// --- CORE LOGIC (UNABRIDGED) ---

function dict() { return i18n[currentLang] || i18n.en; }

function getLangFromUrl() {
    const p = new URLSearchParams(window.location.search);
    let l = p.get('lang') || p.get('language') || tg.initDataUnsafe?.user?.language_code || 'it';
    l = l.toLowerCase().slice(0, 2);
    return i18n[l] ? l : 'it';
}

function changeLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict()[key]) {
            el.innerHTML = dict()[key]
                .replace('{botFatherUrl}', 'https://t.me/BotFather')
                .replace('{botVideoUrl}', BOTFATHER_VIDEO_URL);
        }
    });
}

function checkIfDirty() {
    const currentStateString = JSON.stringify(honeypotData);
    const isDirty = currentStateString !== initialDataString;
    dom.saveBar.classList.toggle('visible', isDirty);
    dom.saveBtn.disabled = !isDirty;
}

function getFileData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result;
            const base64 = result.split(',')[1];
            const mime = result.match(/:(.*?);/)[1];
            resolve({ base64, mime, dataUrl: result });
        };
        reader.onerror = error => reject(error);
    });
}

async function handleAssetUpload(assetType, file) {
    if (!file) return;
    const previewContainer = document.getElementById(`${assetType}-preview`);
    previewContainer.innerHTML = `<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div>`;
    try {
        const fileData = await getFileData(file);
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'analyze_image_asset', vat_number: vatNumber, asset_type: assetType, file_data: fileData.base64, mime_type: fileData.mime })
        });
        if (!res.ok) throw new Error('Analysis failed');
        const analysisResult = await res.json();
        
        if (!honeypotData.assets) honeypotData.assets = {};
        honeypotData.assets[assetType] = {
            description: analysisResult.description,
            base64: fileData.base64,
            mime: fileData.mime
        };
        
        previewContainer.innerHTML = `<img src="${fileData.dataUrl}" alt="${assetType}"><p class="asset-description">${analysisResult.description}</p>`;
        checkIfDirty();
    } catch (error) {
        tg.showAlert('Error analyzing image.');
        previewContainer.innerHTML = '';
    }
}

async function generateOfferHTML() {
    const prompt = dom.offerPrompt.value.trim();
    if (!prompt) { tg.showAlert(dict().alert_offer_required); return; }
    const btn = document.getElementById('btn-generate-offer');
    const originalText = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> ${dict().generating}`;
    
    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'generate_offer_html', vat_number: vatNumber, user_prompt: prompt })
        });
        if (!res.ok) throw new Error('Generation failed');
        const data = await res.json();
        if(data.html_content) {
            honeypotData.offer_text = data.html_content;
            dom.offerPreview.innerHTML = data.html_content;
            dom.offerStorage.value = data.html_content;
            checkIfDirty();
        }
    } catch (error) {
        tg.showAlert(dict().alert_generation_error);
    } finally {
        btn.disabled = false; btn.innerHTML = originalText;
    }
}

function copyOfferText() {
    const html = dom.offerStorage.value;
    if (!html) return;
    let text = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n\n').replace(/<\/?[^>]+(>|$)/g, "").trim();
    const link = `https://simonaiit.github.io/SiteBoS-MiniApp/SiteBos.html?vat=${vatNumber}`;
    if (!text.includes(link)) text += `\n\n👉 Accedi qui: ${link}`;

    navigator.clipboard.writeText(text).then(() => {
        tg.HapticFeedback.notificationOccurred('success');
        tg.showAlert(dict().alert_copied);
    });
};

async function linkBot() {
    const token = dom.botTokenInput.value.trim();
    if (!token) { tg.showAlert(dict().alert_token_required); return; }
    if (!/^\d+:[A-Za-z0-9_-]{35}/.test(token)) { tg.showAlert(dict().alert_token_invalid); return; }

    const btn = dom.btnLinkBot;
    const statusDiv = dom.botStatus;
    const originalText = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i>`;

    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'link_telegram_bot', vat_number: vatNumber, bot_token: token })
        });
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        
        if (data.ok === true) {
            statusDiv.style.display = 'block'; statusDiv.style.color = 'var(--success)';
            statusDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${dict().status_linked}`;
            if (!honeypotData.config) honeypotData.config = {};
            honeypotData.config.bot_token = token;
            honeypotData.config.bot_linked = true;
            dom.botTokenInput.disabled = true; btn.style.display = 'none';
            checkIfDirty(); 
            tg.HapticFeedback.notificationOccurred('success');
        } else { throw new Error(data.description || 'Telegram Error'); }

    } catch (error) {
        tg.showAlert(`${dict().alert_link_error}: ${error.message}`);
    } finally {
        if (!dom.botTokenInput.disabled) { btn.disabled = false; btn.innerHTML = originalText; }
    }
}

async function loadData() {
    if (!vatNumber) {
        tg.showAlert('ID (VAT) not found in URL.');
        return;
    }
    
    changeLanguage(getLangFromUrl());

    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'get_honeypot_data', vat_number: vatNumber }) // CHIAMATA CORRETTA
        });
        if (!res.ok) throw new Error(`Network error: ${res.status}`);
        
        const data = await res.json();
        honeypotData = data.oHONEYPOT.HoneyPot;
        renderAll();
        initialDataString = JSON.stringify(honeypotData);
        checkIfDirty();
        dom.loader.classList.add('hidden');
        dom.app.classList.remove('hidden');
    } catch (error) {
        console.error("Load Data Error:", error);
        tg.showAlert(`${dict().alert_loading_error} (${error.message})`);
    }
}

function renderAll() {
    // Offer
    if (honeypotData.offer_text) {
        dom.offerPreview.innerHTML = honeypotData.offer_text;
        dom.offerStorage.value = honeypotData.offer_text;
    } else {
        dom.offerPreview.innerHTML = `<em>${dict().offer_preview_placeholder}</em>`;
    }

    // Knowledge Fragments
    dom.container.innerHTML = '';
    if (honeypotData.knowledge_fragments) {
        honeypotData.knowledge_fragments.forEach((fragment, index) => {
            const card = document.createElement('div');
            card.className = 'knowledge-card';
            const fragmentTitle = fragment.fragment_id.replace(/_V\d+$/, '').replace(/_/g, ' ');
            card.innerHTML = `
                <div class="card-header">
                    <h3><i class="fas fa-book-open"></i> ${fragmentTitle}</h3>
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
                    <div id="deep-dive-${index}"></div>
                    <button type="button" class="btn btn-secondary btn-sm mt-2" id="btn-add-qa-${index}">
                        <i class="fas fa-plus"></i> <span data-i18n="btn_add_qa"></span>
                    </button>
                </div>`;
            dom.container.appendChild(card);
            renderDeepDives(index);
            document.getElementById(`btn-add-qa-${index}`).addEventListener('click', () => addDeepDive(index));
        });
    }

    // Hours
    dom.hoursContainer.innerHTML = '';
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
                        <select data-path="availability_schedule.hours.${day}.morning.from"></select>
                        -
                        <select data-path="availability_schedule.hours.${day}.morning.to"></select>
                    </div>
                </div>
                <div class="shift-block">
                    <span class="shift-label" data-i18n="lbl_afternoon"></span>
                    <div class="time-inputs">
                        <select data-path="availability_schedule.hours.${day}.afternoon.from"></select>
                        -
                        <select data-path="availability_schedule.hours.${day}.afternoon.to"></select>
                    </div>
                </div>
            </div>`;
        dom.hoursContainer.appendChild(row);
    });
    
    const selectors = dom.hoursContainer.querySelectorAll('select');
    selectors.forEach(selector => {
        selector.innerHTML = `<option value="">--</option>`;
        for (let i = 0; i < 24; i++) {
            selector.innerHTML += `<option value="${i}">${i.toString().padStart(2, '0')}:00</option>`;
        }
    });
    
    if (honeypotData.availability_schedule && honeypotData.availability_schedule.hours) {
        days.forEach(day => {
            const h = honeypotData.availability_schedule.hours[day] || {};
            const m = h.morning || {};
            const a = h.afternoon || {};
            
            dom.hoursContainer.querySelector(`[data-path="availability_schedule.hours.${day}.morning.from"]`).value = m.from ?? '';
            dom.hoursContainer.querySelector(`[data-path="availability_schedule.hours.${day}.morning.to"]`).value = m.to ?? '';
            dom.hoursContainer.querySelector(`[data-path="availability_schedule.hours.${day}.afternoon.from"]`).value = a.from ?? '';
            dom.hoursContainer.querySelector(`[data-path="availability_schedule.hours.${day}.afternoon.to"]`).value = a.to ?? '';
        });
    }
    
    // Assets
    if (honeypotData.assets) {
        if (honeypotData.assets.logo) document.getElementById('logo-preview').innerHTML = `<img src="data:${honeypotData.assets.logo.mime};base64,${honeypotData.assets.logo.base64}"><p class="asset-description">${honeypotData.assets.logo.description}</p>`;
        if (honeypotData.assets.photo) document.getElementById('photo-preview').innerHTML = `<img src="data:${honeypotData.assets.photo.mime};base64,${honeypotData.assets.photo.base64}"><p class="asset-description">${honeypotData.assets.photo.description}</p>`;
    }
    
    // Bot Config
    dom.botTokenInput.value = honeypotData.config?.bot_token || '';
    if (honeypotData.config?.bot_linked) {
        dom.botTokenInput.disabled = true;
        dom.btnLinkBot.style.display = 'none';
        dom.botStatus.style.display = 'block';
        dom.botStatus.style.color = 'var(--success)';
        dom.botStatus.innerHTML = `<i class="fas fa-check-circle"></i> ${dict().status_linked}`;
    }
    
    changeLanguage(currentLang);
}

function renderDeepDives(fragmentIndex) {
    const container = document.getElementById(`deep-dive-${fragmentIndex}`);
    if(!container) return; // Safety check
    container.innerHTML = '';
    if (honeypotData.knowledge_fragments[fragmentIndex].sections) {
        honeypotData.knowledge_fragments[fragmentIndex].sections.forEach((section, s_index) => {
            const item = document.createElement('div');
            item.className = 'card';
            item.style.padding = '10px';
            item.style.marginBottom = '10px';
            item.innerHTML = `
                <div class="input-group" style="margin-bottom:8px;">
                    <input type="text" placeholder="${dict().lbl_question}" data-path="knowledge_fragments.${fragmentIndex}.sections.${s_index}.question" value="${section.question || ''}" style="font-weight:600;">
                </div>
                <div class="input-group" style="margin-bottom:8px;">
                    <textarea placeholder="${dict().lbl_answer}" data-path="knowledge_fragments.${fragmentIndex}.sections.${s_index}.answer" rows="2">${section.answer || ''}</textarea>
                </div>
                <button type="button" class="btn btn-sm btn-delete btn-icon" style="float:right;" onclick="removeDeepDive(${fragmentIndex}, ${s_index})"><i class="fas fa-trash"></i></button>
                <div style="clear:both;"></div>`;
            container.appendChild(item);
        });
    }
}

function addDeepDive(fragmentIndex) {
    if (!honeypotData.knowledge_fragments[fragmentIndex].sections) honeypotData.knowledge_fragments[fragmentIndex].sections = [];
    honeypotData.knowledge_fragments[fragmentIndex].sections.push({ question: '', answer: '' });
    renderDeepDives(fragmentIndex);
    checkIfDirty();
};

function removeDeepDive(fragmentIndex, sectionIndex) {
    honeypotData.knowledge_fragments[fragmentIndex].sections.splice(sectionIndex, 1);
    renderDeepDives(fragmentIndex);
    checkIfDirty();
};

function setObjectValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) {
            current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
        }
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
}

async function saveChanges() {
    dom.saveBtn.disabled = true;
    dom.saveBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> ${dict().saving_progress}`;
    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'save_honeypot_data', vat_number: vatNumber, honeypot_update: honeypotData })
        });
        tg.HapticFeedback.notificationOccurred('success');
        initialDataString = JSON.stringify(honeypotData);
        dom.saveBtn.innerHTML = `<i class="fas fa-check"></i> ${dict().saving_success}`;
        setTimeout(() => {
            dom.saveBtn.innerHTML = `<i class="fas fa-save"></i> ${dict().btn_save}`;
            checkIfDirty();
        }, 2000);
    } catch (error) {
        tg.showAlert(dict().alert_saving_error);
        dom.saveBtn.disabled = false;
        dom.saveBtn.innerHTML = `<i class="fas fa-save"></i> ${dict().btn_save}`;
    }
}

function goBackToDashboard() {
    window.location.href = `dashboard.html${window.location.search}`;
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // EVENT DELEGATION (FIX DEFINITIVO)
    document.getElementById('app-content').addEventListener('click', function(event) {
        const header = event.target.closest('.card-header');
        if (header) {
            header.parentElement.classList.toggle('open');
        }
    });
    
    document.getElementById('btn-back-dashboard').addEventListener('click', goBackToDashboard);
    document.getElementById('btn-generate-offer').addEventListener('click', generateOfferHTML);
    document.getElementById('btn-copy-offer').addEventListener('click', copyOfferText);
    document.getElementById('btn-link-bot').addEventListener('click', linkBot);
    document.getElementById('logo-input').addEventListener('change', (e) => handleAssetUpload('logo', e.target.files[0]));
    document.getElementById('photo-input').addEventListener('change', (e) => handleAssetUpload('photo', e.target.files[0]));
    dom.saveBtn.addEventListener('click', saveChanges);

    document.body.addEventListener('input', (e) => {
        if (e.target.dataset.path) {
            setObjectValue(honeypotData, e.target.dataset.path, e.target.value);
            checkIfDirty();
        } else if (e.target.id === 'bot-token-input') {
            if (!honeypotData.config) honeypotData.config = {};
            honeypotData.config.bot_token = e.target.value;
            checkIfDirty();
        }
    });

    loadData();
});
