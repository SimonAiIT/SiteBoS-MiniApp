/**
 * HONEYPOT EDITOR - LOGIC (v1.1 - Unabridged)
 * Contiene tutta la logica di interazione per honeypot_editor.html.
 */

// --- CONFIG & GLOBAL STATE ---
const WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/48ee3cba-99dc-407a-98af-624e97b1e888";
const BOTFATHER_VIDEO_URL = "https://www.youtube.com/watch?v=7a8UWhJWurs";
const GROUP_VIDEO_URL = "https://www.youtube.com/watch?v=UunrYuBkQaw";

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const urlParams = new URLSearchParams(window.location.search);
const vatNumber = urlParams.get('vat');

let honeypotData = {};
let initialDataString = '';
let currentLang = 'it';

const i18n = {
  it: {
    title: "Editor Base di Conoscenza", subtitle: "Modella l'anima AI della tua azienda.",
    section_offer_title: "Azione Richiesta: Offerta Benvenuto", offer_desc: "L'AI genererà un'offerta accattivante per te.", lbl_offer_prompt: "Descrivi la tua offerta", btn_generate_offer: "Genera Offerta", lbl_offer_preview: "Anteprima", offer_preview_placeholder: "Qui vedrai l'anteprima...", alert_offer_required: "Inserisci una descrizione.", generating: "Generazione...", alert_generation_error: "Errore AI.", lbl_click_copy: "Copia", alert_copied: "Copiato!",
    section_hours_title: "Orari di Apertura", section_assets_title: "Asset Visivi", lbl_logo: "Logo Aziendale", upload_logo: "Carica logo", lbl_photo: "Foto Rappresentativa", upload_photo: "Carica foto",
    section_bot_title: "Azione Richiesta: Configura Bot", guide_bot_1: "Apri <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Invia <code>/newbot</code>", guide_bot_3: "Scegli nome/username", guide_bot_4: "<b>Copia Token</b> e incollalo", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Video Tutorial</a>", btn_link_bot: "Associa", status_linked: "Bot Associato ✅", alert_token_required: "Inserisci il token.", alert_token_invalid: "Token non valido.", alert_link_error: "Errore Associazione",
    section_group_title: "Azione Richiesta: Gruppo", guide_group_1: "Crea gruppo privato", guide_group_2: "Aggiungi il tuo bot e <code>@TrinAi_SiteBoS_bot</code>", guide_group_3: "Falli Admin", guide_group_video: "<a href='{groupVideoUrl}' target='_blank'>Video Tutorial</a>",
    lbl_utterances: "Domande Esempio", lbl_answer: "Risposta Principale", lbl_summary: "Sintesi", lbl_deepdive: "Approfondimenti (Q&A Specifiche)", lbl_question: "Domanda", btn_add_qa: "Aggiungi D&R",
    day_monday: "Lunedì", day_tuesday: "Martedì", day_wednesday: "Mercoledì", day_thursday: "Giovedì", day_friday: "Venerdì", day_saturday: "Sabato", day_sunday: "Domenica",
    btn_save: "Salva Modifiche", saving_progress: "Salvataggio...", saving_success: "Salvato!",
    alert_loading_error: "Errore caricamento.", alert_saving_error: "Errore salvataggio."
  },
  en: {
    title: "Knowledge Base Editor", subtitle: "Shape your business AI soul.",
    section_offer_title: "Action Required: Welcome Offer", offer_desc: "AI will generate an engaging offer.", lbl_offer_prompt: "Describe your offer", btn_generate_offer: "Generate Offer", lbl_offer_preview: "Preview", offer_preview_placeholder: "Preview will appear here...", alert_offer_required: "Please enter a description.", generating: "Generating...", alert_generation_error: "AI Error.", lbl_click_copy: "Copy", alert_copied: "Copied!",
    section_hours_title: "Opening Hours", section_assets_title: "Visual Assets", lbl_logo: "Company Logo", upload_logo: "Upload logo", lbl_photo: "Main Photo", upload_photo: "Upload photo",
    section_bot_title: "Action Required: Configure Bot", guide_bot_1: "Open <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Send <code>/newbot</code>", guide_bot_3: "Choose name/username", guide_bot_4: "<b>Copy Token</b> and paste it here", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Video Tutorial</a>", btn_link_bot: "Link", status_linked: "Bot Linked ✅", alert_token_required: "Please enter the token.", alert_token_invalid: "Invalid token.", alert_link_error: "Linking Error",
    section_group_title: "Action Required: Group", guide_group_1: "Create a private group", guide_group_2: "Add your bot and <code>@TrinAi_SiteBoS_bot</code>", guide_group_3: "Make them Admins", guide_group_video: "<a href='{groupVideoUrl}' target='_blank'>Video Tutorial</a>",
    lbl_utterances: "Sample Questions", lbl_answer: "Main Answer", lbl_summary: "Summary", lbl_deepdive: "Deep Dives (Specific Q&A)", lbl_question: "Question", btn_add_qa: "Add Q&A",
    day_monday: "Monday", day_tuesday: "Tuesday", day_wednesday: "Wednesday", day_thursday: "Thursday", day_friday: "Friday", day_saturday: "Saturday", day_sunday: "Sunday",
    btn_save: "Save Changes", saving_progress: "Saving...", saving_success: "Saved!",
    alert_loading_error: "Loading error.", alert_saving_error: "Saving error."
  },
  fr: {
    title: "Éditeur de Base de Connaissances", subtitle: "Modelez l'âme IA de votre entreprise.",
    section_offer_title: "Action Requise : Offre de Bienvenue", offer_desc: "L'IA générera une offre attrayante.", lbl_offer_prompt: "Décrivez votre offre", btn_generate_offer: "Générer Offre", lbl_offer_preview: "Aperçu", offer_preview_placeholder: "L'aperçu apparaîtra ici...", alert_offer_required: "Veuillez entrer une description.", generating: "Génération...", alert_generation_error: "Erreur IA.", lbl_click_copy: "Copier", alert_copied: "Copié !",
    section_hours_title: "Heures d'Ouverture", section_assets_title: "Éléments Visuels", lbl_logo: "Logo de l'entreprise", upload_logo: "Charger logo", lbl_photo: "Photo Principale", upload_photo: "Charger photo",
    section_bot_title: "Action Requise : Configurer le Bot", guide_bot_1: "Ouvrir <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Envoyer <code>/newbot</code>", guide_bot_3: "Choisir nom/utilisateur", guide_bot_4: "<b>Copiez le Jeton</b> et collez-le", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Tutoriel Vidéo</a>", btn_link_bot: "Associer", status_linked: "Bot Associé ✅", alert_token_required: "Veuillez entrer le jeton.", alert_token_invalid: "Jeton invalide.", alert_link_error: "Erreur d'association",
    section_group_title: "Action Requise : Groupe", guide_group_1: "Créer un groupe privé", guide_group_2: "Ajoutez votre bot et <code>@TrinAi_SiteBoS_bot</code>", guide_group_3: "Nommez-les Admin", guide_group_video: "<a href='{groupVideoUrl}' target='_blank'>Tutoriel Vidéo</a>",
    lbl_utterances: "Questions Exemples", lbl_answer: "Réponse Principale", lbl_summary: "Résumé", lbl_deepdive: "Détails (Q&R Spécifiques)", lbl_question: "Question", btn_add_qa: "Ajouter Q&R",
    day_monday: "Lundi", day_tuesday: "Mardi", day_wednesday: "Mercredi", day_thursday: "Jeudi", day_friday: "Vendredi", day_saturday: "Samedi", day_sunday: "Dimanche",
    btn_save: "Enregistrer", saving_progress: "Enregistrement...", saving_success: "Enregistré !",
    alert_loading_error: "Erreur de chargement.", alert_saving_error: "Erreur d'enregistrement."
  },
  de: {
    title: "Wissensdatenbank-Editor", subtitle: "Gestalten Sie die KI-Seele Ihres Unternehmens.",
    section_offer_title: "Aktion Erforderlich: Willkommensangebot", offer_desc: "Die KI wird ein ansprechendes Angebot erstellen.", lbl_offer_prompt: "Beschreiben Sie Ihr Angebot", btn_generate_offer: "Angebot Erstellen", lbl_offer_preview: "Vorschau", offer_preview_placeholder: "Vorschau wird hier angezeigt...", alert_offer_required: "Bitte geben Sie eine Beschreibung ein.", generating: "Erstelle...", alert_generation_error: "KI-Fehler.", lbl_click_copy: "Kopieren", alert_copied: "Kopiert!",
    section_hours_title: "Öffnungszeiten", section_assets_title: "Visuelle Assets", lbl_logo: "Firmenlogo", upload_logo: "Logo hochladen", lbl_photo: "Hauptfoto", upload_photo: "Foto hochladen",
    section_bot_title: "Aktion Erforderlich: Bot Konfigurieren", guide_bot_1: "Öffnen Sie <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Senden Sie <code>/newbot</code>", guide_bot_3: "Wählen Sie Name/Benutzername", guide_bot_4: "<b>Token kopieren</b> und einfügen", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Video-Tutorial</a>", btn_link_bot: "Verbinden", status_linked: "Bot Verbunden ✅", alert_token_required: "Bitte Token eingeben.", alert_token_invalid: "Ungültiges Token.", alert_link_error: "Verbindungsfehler",
    section_group_title: "Aktion Erforderlich: Gruppe", guide_group_1: "Private Gruppe erstellen", guide_group_2: "Fügen Sie Ihren Bot und <code>@TrinAi_SiteBoS_bot</code> hinzu", guide_group_3: "Machen Sie sie zu Admins", guide_group_video: "<a href='{groupVideoUrl}' target='_blank'>Video-Tutorial</a>",
    lbl_utterances: "Beispielfragen", lbl_answer: "Hauptantwort", lbl_summary: "Zusammenfassung", lbl_deepdive: "Details (Spezifische F&A)", lbl_question: "Frage", btn_add_qa: "F&A Hinzufügen",
    day_monday: "Montag", day_tuesday: "Dienstag", day_wednesday: "Mittwoch", day_thursday: "Donnerstag", day_friday: "Freitag", day_saturday: "Samstag", day_sunday: "Sonntag",
    btn_save: "Änderungen Speichern", saving_progress: "Speichern...", saving_success: "Gespeichert!",
    alert_loading_error: "Ladefehler.", alert_saving_error: "Speicherfehler."
  },
  es: {
    title: "Editor de Base de Conocimiento", subtitle: "Modela el alma de IA de tu negocio.",
    section_offer_title: "Acción Requerida: Oferta de Bienvenida", offer_desc: "La IA generará una oferta atractiva.", lbl_offer_prompt: "Describe tu oferta", btn_generate_offer: "Generar Oferta", lbl_offer_preview: "Vista Previa", offer_preview_placeholder: "La vista previa aparecerá aquí...", alert_offer_required: "Por favor, introduce una descripción.", generating: "Generando...", alert_generation_error: "Error de IA.", lbl_click_copy: "Copiar", alert_copied: "¡Copiado!",
    section_hours_title: "Horario de Apertura", section_assets_title: "Activos Visuales", lbl_logo: "Logo de la Empresa", upload_logo: "Subir logo", lbl_photo: "Foto Principal", upload_photo: "Subir foto",
    section_bot_title: "Acción Requerida: Configurar Bot", guide_bot_1: "Abrir <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Enviar <code>/newbot</code>", guide_bot_3: "Elegir nombre/usuario", guide_bot_4: "<b>Copiar Token</b> y pegarlo", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Video Tutorial</a>", btn_link_bot: "Enlazar", status_linked: "Bot Enlazado ✅", alert_token_required: "Por favor, introduce el token.", alert_token_invalid: "Token inválido.", alert_link_error: "Error al enlazar",
    section_group_title: "Acción Requerida: Grupo", guide_group_1: "Crear grupo privado", guide_group_2: "Añade tu bot y <code>@TrinAi_SiteBoS_bot</code>", guide_group_3: "Hazlos Administradores", guide_group_video: "<a href='{groupVideoUrl}' target='_blank'>Video Tutorial</a>",
    lbl_utterances: "Preguntas de Ejemplo", lbl_answer: "Respuesta Principal", lbl_summary: "Resumen", lbl_deepdive: "Detalles (P&R Específicas)", lbl_question: "Pregunta", btn_add_qa: "Añadir P&R",
    day_monday: "Lunes", day_tuesday: "Martes", day_wednesday: "Miércoles", day_thursday: "Jueves", day_friday: "Viernes", day_saturday: "Sábado", day_sunday: "Domingo",
    btn_save: "Guardar Cambios", saving_progress: "Guardando...", saving_success: "¡Guardado!",
    alert_loading_error: "Error al cargar.", alert_saving_error: "Error al guardar."
  },
  pt: {
    title: "Editor da Base de Conhecimento", subtitle: "Molde a alma de IA do seu negócio.",
    section_offer_title: "Ação Necessária: Oferta de Boas-Vindas", offer_desc: "A IA irá gerar uma oferta atraente.", lbl_offer_prompt: "Descreva a sua oferta", btn_generate_offer: "Gerar Oferta", lbl_offer_preview: "Pré-visualização", offer_preview_placeholder: "A pré-visualização aparecerá aqui...", alert_offer_required: "Por favor, insira uma descrição.", generating: "Gerando...", alert_generation_error: "Erro de IA.", lbl_click_copy: "Copiar", alert_copied: "Copiado!",
    section_hours_title: "Horário de Funcionamento", section_assets_title: "Ativos Visuais", lbl_logo: "Logotipo da Empresa", upload_logo: "Carregar logo", lbl_photo: "Foto Principal", upload_photo: "Carregar foto",
    section_bot_title: "Ação Necessária: Configurar Bot", guide_bot_1: "Abrir <a href='{botFatherUrl}' target='_blank'>@BotFather</a>", guide_bot_2: "Enviar <code>/newbot</code>", guide_bot_3: "Escolher nome/utilizador", guide_bot_4: "<b>Copiar Token</b> e colar", guide_bot_video: "<a href='{botVideoUrl}' target='_blank'>Tutorial em Vídeo</a>", btn_link_bot: "Ligar", status_linked: "Bot Ligado ✅", alert_token_required: "Por favor, insira o token.", alert_token_invalid: "Token inválido.", alert_link_error: "Erro ao ligar",
    section_group_title: "Ação Necessária: Grupo", guide_group_1: "Criar grupo privado", guide_group_2: "Adicione o seu bot e <code>@TrinAi_SiteBoS_bot</code>", guide_group_3: "Torne-os Administradores", guide_group_video: "<a href='{groupVideoUrl}' target='_blank'>Tutorial em Vídeo</a>",
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

// --- CORE LOGIC ---

function dict() { return i18n[currentLang] || i18n.en; }

function changeLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict()[key]) {
            el.innerHTML = dict()[key]
                .replace('{botFatherUrl}', 'https://t.me/BotFather')
                .replace('{botVideoUrl}', BOTFATHER_VIDEO_URL)
                .replace('{groupVideoUrl}', GROUP_VIDEO_URL);
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
    if (!vatNumber) { tg.showAlert('ID not found'); return; }
    try {
        const res = await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_honeypot_data', vat_number: vatNumber }) });
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        honeypotData = data.oHONEYPOT.HoneyPot;
        renderAll();
        initialDataString = JSON.stringify(honeypotData);
        changeLanguage(urlParams.get('lang') || 'it');
        checkIfDirty();
        dom.loader.classList.add('hidden');
        dom.app.classList.remove('hidden');
    } catch (error) {
        tg.showAlert(dict().alert_loading_error);
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
                    <button type="button" class="btn btn-secondary btn-sm mt-2" onclick="addDeepDive(${index})">
                        <i class="fas fa-plus"></i> <span data-i18n="btn_add_qa"></span>
                    </button>
                </div>`;
            dom.container.appendChild(card);
            renderDeepDives(index);
        });
    }

    // Hours
    dom.hoursContainer.innerHTML = '';
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach(day => {
        const row = document.createElement('div');
        row.style.marginBottom = '10px';
        row.innerHTML = `<label data-i18n="day_${day}" style="margin-bottom:4px;display:block;"></label>
                         <div class="d-flex align-center gap-2">
                            <select data-path="availability_schedule.hours.${day}.from" style="flex:1;"></select>
                            <span>-</span>
                            <select data-path="availability_schedule.hours.${day}.to" style="flex:1;"></select>
                         </div>`;
        dom.hoursContainer.appendChild(row);
    });
    
    const selectors = dom.hoursContainer.querySelectorAll('select');
    selectors.forEach(selector => {
        for (let i = 0; i < 24; i++) {
            selector.innerHTML += `<option value="${i}">${i.toString().padStart(2, '0')}:00</option>`;
        }
    });
    
    if (honeypotData.availability_schedule && honeypotData.availability_schedule.hours) {
        days.forEach(day => {
            const hours = honeypotData.availability_schedule.hours[day];
            if(hours) {
                dom.hoursContainer.querySelector(`[data-path="availability_schedule.hours.${day}.from"]`).value = hours.from;
                dom.hoursContainer.querySelector(`[data-path="availability_schedule.hours.${day}.to"]`).value = hours.to;
            }
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
    container.innerHTML = '';
    if (honeypotData.knowledge_fragments[fragmentIndex].sections) {
        honeypotData.knowledge_fragments[fragmentIndex].sections.forEach((section, s_index) => {
            const item = document.createElement('div');
            item.style.marginBottom = '15px';
            item.style.padding = '10px';
            item.style.background = 'rgba(0,0,0,0.1)';
            item.style.borderRadius = '8px';
            item.innerHTML = `
                <div class="input-group" style="margin-bottom:8px;">
                    <input type="text" placeholder="Domanda" data-path="knowledge_fragments.${fragmentIndex}.sections.${s_index}.question" value="${section.question || ''}" style="font-weight:600;">
                </div>
                <div class="input-group" style="margin-bottom:8px;">
                    <textarea placeholder="Risposta" data-path="knowledge_fragments.${fragmentIndex}.sections.${s_index}.answer" rows="2">${section.answer || ''}</textarea>
                </div>
                <button type="button" class="btn btn-remove btn-sm btn-icon" style="float:right;" onclick="removeDeepDive(${fragmentIndex}, ${s_index})"><i class="fas fa-trash"></i></button>
                <div style="clear:both;"></div>`;
            container.appendChild(item);
        });
    }
}

window.addDeepDive = (fragmentIndex) => {
    if (!honeypotData.knowledge_fragments[fragmentIndex].sections) honeypotData.knowledge_fragments[fragmentIndex].sections = [];
    honeypotData.knowledge_fragments[fragmentIndex].sections.push({ question: '', answer: '' });
    renderDeepDives(fragmentIndex);
    checkIfDirty();
};

window.removeDeepDive = (fragmentIndex, sectionIndex) => {
    honeypotData.knowledge_fragments[fragmentIndex].sections.splice(sectionIndex, 1);
    renderDeepDives(fragmentIndex);
    checkIfDirty();
};

window.toggleCard = (header) => header.parentElement.classList.toggle('open');

function setObjectValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const lastObj = keys.reduce((o, key) => o[key] = o[key] || {}, obj);
    lastObj[lastKey] = value;
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

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card-header').forEach(header => header.addEventListener('click', () => toggleCard(header)));
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
