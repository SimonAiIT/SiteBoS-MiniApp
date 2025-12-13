// edit_owner_logic.js
// Gestione Dati Owner con Auto-Save per Operatori e Salvataggio Manuale per Dati Anagrafici

// CONFIG
const WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/83acc670-15ae-4da0-ae0e-3587c85bd5f4";
const BOT_USERNAME = "TrinAi_SiteBoS_bot"; // Tuo bot username
const OPERATOR_COST = 10000; // Costo in crediti per operatore

// INIT TELEGRAM
const tg = window.Telegram.WebApp; 
tg.ready(); 
tg.expand();

// URL PARAMS
const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('token'); 
const langParam = urlParams.get('lang') || 'it';

// STATE
let ownerData = null; 
let operators = [];   
let initialHash = ""; 

// DOM ELEMENTS
const dom = {
    loader: document.getElementById('loader'),
    app: document.getElementById('app-content'),
    denied: document.getElementById('access-denied'),
    saveBtn: document.getElementById('saveBtn'),
    name: document.getElementById('name'), surname: document.getElementById('surname'),
    email: document.getElementById('email'), phone: document.getElementById('phone'),
    ragioneSociale: document.getElementById('ragione_sociale'), vatNumber: document.getElementById('vat_number'),
    indirizzo: document.getElementById('indirizzo'), site: document.getElementById('site'),
    linkedin: document.getElementById('linkedin_page'), facebook: document.getElementById('facebook_page'),
    geminiKey: document.getElementById('gemini_key'),
    tO_from: document.getElementById('owner_unav_from'), tO_to: document.getElementById('owner_unav_to'),
    tP_from: document.getElementById('operator_unav_from'), tP_to: document.getElementById('operator_unav_to'),
    opList: document.getElementById('operators-list'),
    slotCount: document.getElementById('slot-counter'),
    operatorCount: document.getElementById('operator-count'),
    addOpBtn: document.getElementById('add-operator-btn'),
    modal: document.getElementById('operator-modal'),
    opName: document.getElementById('op-name'),
    opInfoModal: document.getElementById('operator-info-modal')
};

// I18N TRANSLATIONS
const i18n = {
    it: {
      title: "Gestione Dati Azienda", subtitle: "Modifica le informazioni per aggiornare il sistema.",
      section_core: "Dati Anagrafici", section_company: "Dati Aziendali", section_config: "Configurazione Operativa",
      lbl_name: "Nome", lbl_surname: "Cognome", lbl_email: "Email", lbl_phone: "Telefono",
      lbl_company_name: "Ragione Sociale", lbl_vat: "P.IVA (Non modificabile)", lbl_address: "Indirizzo", lbl_site: "Sito Web",
      lbl_owner_avail: "Orari NON reperibilità (Owner)", lbl_op_avail: "Orari NON reperibilità (Operatori)",
      op_title: "Gestione Operatori", op_btn_invite: "Invita Nuovo Operatore", op_limit_reached: "Limite raggiunto.",
      op_status_pending: "In attesa", op_invite_text: "Invia questo link:", op_btn_copy: "Copia", op_copied: "Copiato!",
      modal_title: "Invita Operatore", modal_subtitle: "Inserisci il nome per generare il link.", modal_lbl_name: "Nome Operatore",
      btn_cancel: "Annulla", btn_generate: "Genera Invito", btn_save: "Salva Modifiche", hint_close: "Puoi chiudere questa finestra dopo aver salvato.",
      error_token_title: "Link Scaduto", error_token_desc: "Il token di accesso non è valido o è scaduto.",
      alert_del: "Eliminare operatore?", alert_revoke: "Revocare invito?", alert_saved: "Dati salvati con successo!", alert_err: "Errore durante il salvataggio.",
      alert_no_credits: "Crediti insufficienti. Necessari {cost} crediti.\nCrediti disponibili: {available}"
    },
    en: {
      title: "Company Data Management", subtitle: "Edit your account information.",
      section_core: "Personal Data", section_company: "Company Data", section_config: "Operational Config",
      lbl_name: "Name", lbl_surname: "Surname", lbl_email: "Email", lbl_phone: "Phone",
      lbl_company_name: "Company Name", lbl_vat: "VAT ID (Read Only)", lbl_address: "Address", lbl_site: "Website",
      lbl_owner_avail: "Unavailability Hours (Owner)", lbl_op_avail: "Unavailability Hours (Operators)",
      op_title: "Operator Management", op_btn_invite: "Invite New Operator", op_limit_reached: "Limit reached.",
      op_status_pending: "Pending", op_invite_text: "Send this link:", op_btn_copy: "Copy", op_copied: "Copied!",
      modal_title: "Invite Operator", modal_subtitle: "Enter name to generate link.", modal_lbl_name: "Operator Name",
      btn_cancel: "Cancel", btn_generate: "Generate Invite", btn_save: "Save Changes", hint_close: "Close after saving.",
      error_token_title: "Link Expired", error_token_desc: "Access token is invalid or expired.",
      alert_del: "Delete operator?", alert_revoke: "Revoke invite?", alert_saved: "Data saved successfully!", alert_err: "Error saving data.",
      alert_no_credits: "Insufficient credits. Required {cost} credits.\nAvailable: {available}"
    }
};

// LANGUAGE SETUP
const lang = i18n[langParam] ? langParam : 'it';
const t = i18n[lang] || i18n['en'];

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(t[key]) el.innerText = t[key];
    });
}
applyTranslations();

// TIME SELECTORS
function initTimeSelectors() {
    const selects = [dom.tO_from, dom.tO_to, dom.tP_from, dom.tP_to];
    selects.forEach(sel => {
        for(let i=0; i<24; i++) {
            let opt = document.createElement('option');
            opt.value = i;
            opt.innerText = `${i.toString().padStart(2, '0')}:00`;
            sel.appendChild(opt);
        }
    });
}
initTimeSelectors();

// BACK BUTTON LOGIC
window.goBack = function() {
    if(window.history.length > 1) {
        window.history.back();
    } else {
        tg.close();
    }
}

// LOAD DATA
async function loadData() {
    if(!accessToken) {
        dom.loader.classList.add('hidden');
        dom.denied.classList.remove('hidden');
        return;
    }
    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ action: 'get_owner_data_by_token', token: accessToken })
        });
        if(!res.ok) throw new Error("Auth Failed");
        
        const data = await res.json();
        ownerData = data.owner_data || data;

        // POPULATE FIELDS
        dom.name.value = ownerData.name || '';
        dom.surname.value = ownerData.surname || '';
        dom.email.value = ownerData.email || '';
        dom.phone.value = ownerData.phone || '';
        dom.ragioneSociale.value = ownerData.ragione_sociale || '';
        dom.vatNumber.value = ownerData.vat_number || '';
        dom.indirizzo.value = ownerData.indirizzo || '';
        dom.site.value = ownerData.site || '';
        dom.linkedin.value = ownerData.linkedin_page || '';
        dom.facebook.value = ownerData.facebook_page || '';
        dom.geminiKey.value = ownerData.gemini_key || '';

        const owTime = (ownerData.owner_unavailable_time || "21-7").split('-');
        dom.tO_from.value = owTime[0]; dom.tO_to.value = owTime[1];
        const opTime = (ownerData.operator_unavailable_time || "19-9").split('-');
        dom.tP_from.value = opTime[0]; dom.tP_to.value = opTime[1];

        operators = (ownerData.operators || []).filter(op => op.Role !== 'Owner');
        renderOperators();

        initialHash = JSON.stringify(getDataObj());
        dom.loader.classList.add('hidden');
        dom.app.classList.remove('hidden');
    } catch (e) {
        console.error(e);
        dom.loader.classList.add('hidden');
        dom.denied.classList.remove('hidden');
    }
}

// RENDER OPERATORS
function renderOperators() {
    dom.opList.innerHTML = '';
    operators.forEach((op, idx) => {
        const isPending = !op.OperatorChatID; 
        const inviteLink = `https://t.me/${BOT_USERNAME}?start=${op.invitation_code}`;
        
        let html = `
        <div class="card" style="padding:12px; margin-bottom:10px; background:#252525; border-radius:10px; border-left:4px solid ${isPending ? 'var(--warning)' : 'var(--success)'};">            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="flex:1;">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                        <strong style="color:#fff; font-size:15px;">${op.OperatorName}</strong>
                        ${isPending ? `<span class="badge badge-warning">In attesa</span>` : `<span class="badge badge-success">Attivo</span>`}
                    </div>
                    <div style="font-size:11px; color:var(--text-secondary);">
                        <i class="fas fa-coins"></i> ${OPERATOR_COST.toLocaleString('it-IT')} crediti
                    </div>
                </div>
                <button onclick="deleteOp(${idx})" style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:18px;" title="Elimina operatore">
                    <i class="fas fa-trash"></i>
                </button>
            </div>`;
        
        if(isPending) {
            html += `
            <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px; margin-top:10px;">
                <small style="color:var(--text-secondary); display:block; margin-bottom:6px;">
                    <i class="fas fa-link"></i> Link di invito:
                </small>
                <div style="display:flex; gap:6px;">
                    <input type="text" value="${inviteLink}" readonly style="font-size:11px; padding:6px 10px; flex:1; background:#111; border:1px solid var(--glass-border); color:#ccc; border-radius:6px;">
                    <button onclick="copyLink('${inviteLink}', this)" style="padding:6px 12px; font-size:11px; background:var(--primary); border:none; color:white; border-radius:6px; cursor:pointer; white-space:nowrap;">
                        <i class="fas fa-copy"></i> Copia
                    </button>
                </div>
            </div>`;
        }
        html += `</div>`;
        dom.opList.innerHTML += html;
    });
    
    // Aggiorna contatore
    if(dom.operatorCount) {
        dom.operatorCount.innerText = operators.length;
    }
    
    checkDirty();
}

// DATA OBJECT HELPER
function getDataObj() {
    return {
        name: dom.name.value, surname: dom.surname.value,
        email: dom.email.value, phone: dom.phone.value,
        ragione_sociale: dom.ragioneSociale.value,
        indirizzo: dom.indirizzo.value, site: dom.site.value,
        linkedin_page: dom.linkedin.value, facebook_page: dom.facebook.value,
        gemini_key: dom.geminiKey.value,
        owner_unavailable_time: `${dom.tO_from.value}-${dom.tO_to.value}`,
        operator_unavailable_time: `${dom.tP_from.value}-${dom.tP_to.value}`,
        operators: operators
    };
}

function checkDirty() {
    const curr = JSON.stringify(getDataObj());
    dom.saveBtn.disabled = (curr === initialHash);
    dom.saveBtn.style.opacity = (curr === initialHash) ? 0.5 : 1;
}

document.querySelectorAll('input, select').forEach(el => el.addEventListener('input', checkDirty));

// OPERATOR INFO MODAL
window.showOperatorInfo = () => {
    if(dom.opInfoModal) dom.opInfoModal.classList.remove('hidden');
}

window.closeOperatorInfo = () => {
    if(dom.opInfoModal) dom.opInfoModal.classList.add('hidden');
}

// REQUEST NEW OPERATOR WITH CREDIT CHECK
window.requestNewOperator = async () => {
    // Verifica crediti disponibili
    if (!ownerData.credits || ownerData.credits < OPERATOR_COST) {
        const msg = t.alert_no_credits
            .replace('{cost}', OPERATOR_COST.toLocaleString('it-IT'))
            .replace('{available}', (ownerData.credits || 0).toLocaleString('it-IT'));
        alert(msg);
        return;
    }
    
    // Mostra modal inserimento nome
    openModal();
}

// MODAL
window.openModal = () => { dom.opName.value = ''; dom.modal.classList.remove('hidden'); }
window.closeModal = () => dom.modal.classList.add('hidden');

// --- LOGICA AUTO-SAVE OPERATORI ---

// 1. GENERAZIONE (AUTO-SAVE)
window.generateInvitation = async () => {
    const name = dom.opName.value.trim();
    if(!name) return;
    
    // Double-check credits
    if (!ownerData.credits || ownerData.credits < OPERATOR_COST) {
        alert(`Crediti insufficienti per aggiungere operatore.`);
        closeModal();
        return;
    }
    
    const btn = document.querySelector('#operator-modal .btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
    btn.disabled = true;

    const rnd = Math.random().toString(36).substring(7);
    const code = `INV-${rnd}`; 
    
    operators.push({ 
        OperatorName: name, 
        invitation_code: code, 
        OperatorChatID: null, 
        Role: 'Operator', 
        OperatorLenguage: ownerData.lenguage || 'it',
        cost: OPERATOR_COST,
        created_at: new Date().toISOString()
    });

    try {
        closeModal();
        
        // Scala crediti localmente
        ownerData.credits -= OPERATOR_COST;
        
        renderOperators(); 
        await saveData(true); // Silent Save with credit deduction
        
        // Success feedback
        tg.HapticFeedback.notificationOccurred('success');
        
    } catch (e) {
        alert(t.alert_err);
        operators.pop(); // Rollback
        ownerData.credits += OPERATOR_COST; // Restore credits
        renderOperators();
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// 2. ELIMINAZIONE (AUTO-SAVE)
window.deleteOp = async (idx) => { 
    if(confirm(t.alert_del)) { 
        const removed = operators[idx];
        operators.splice(idx, 1); 
        renderOperators(); 
        
        try {
            await saveData(true); // Silent Save
        } catch(e) {
            alert(t.alert_err);
            operators.splice(idx, 0, removed); // Rollback
            renderOperators();
        }
    } 
}

window.copyLink = (txt, btn) => { navigator.clipboard.writeText(txt); const old = btn.innerText; btn.innerText = t.op_copied; setTimeout(() => btn.innerText = old, 2000); }

// 3. SAVE DATA (Principale e Silent)
window.saveData = async (silent = false) => {
    dom.saveBtn.disabled = true;
    const icon = dom.saveBtn.querySelector('i');
    const oldClass = icon.className;
    icon.className = 'fas fa-circle-notch fa-spin';
    
    const payload = { action: 'save_owner_data_by_token', token: accessToken, data_update: getDataObj() };
    
    try {
        const res = await fetch(WEBHOOK_URL, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        
        if(res.ok) { 
            if(!silent) {
                tg.HapticFeedback.notificationOccurred('success'); 
                alert(t.alert_saved); 
            }
            initialHash = JSON.stringify(getDataObj()); 
            checkDirty(); 
        } else {
            throw new Error("Save Failed");
        }
    } catch(e) { 
        if(!silent) alert(t.alert_err); 
        throw e; 
    } finally { 
        icon.className = oldClass; 
        checkDirty(); 
    }
}

// START
loadData();