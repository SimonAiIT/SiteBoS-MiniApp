/**
 * HONEYPOT EDITOR - LOGIC (v1.0 - Refactored)
 * Questo file contiene tutta la logica di interazione per honeypot_editor.html.
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

// --- I18N DICTIONARY ---
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
        // ... (altre traduzioni omesse per brevità, ma presenti nel file)
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
    // ... (Logica invariata)
}

// ... (tutte le altre funzioni: loadData, renderAll, renderDeepDives, add/removeDeepDive, toggleCard, setObjectValue, ecc.)

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // Aggiungi event listener agli elementi statici
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
