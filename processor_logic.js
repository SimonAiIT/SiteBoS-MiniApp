/**
 * PROCESSOR CORE - LOGIC ONLY (v3.0 - Final Production)
 * FEATURES:
 * 1. Direct Game Score Access (No data loss)
 * 2. HTTP 501 Handling (AI Glitch Retry) with Data Persistence
 * 3. Multilingual Error Messages
 */

const tg = window.Telegram.WebApp; 
tg.ready(); tg.expand();

// CONFIG
const PROCESSOR_WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/35667aed-ee1c-4074-92df-d4334967a1b3";

// DIZIONARIO ERRORI (501 AI GLITCH)
const i18nErrors = {
    it: { t: "L'AI ha avuto un singhiozzo", m: "Capita anche ai migliori. Riprova, sarai più fortunato!", b: "🔄 Riprova Subito" },
    en: { t: "The AI had a hiccup", m: "It happens to the best of us. Try again, you'll be luckier!", b: "🔄 Try Again" },
    fr: { t: "L'IA a eu un hoquet", m: "Ça arrive. Réessayez, la chance vous sourira !", b: "🔄 Réessayer" },
    de: { t: "Die KI hatte Schluckauf", m: "Passiert den Besten. Versuch's nochmal, viel Glück!", b: "🔄 Nochmal versuchen" },
    es: { t: "La IA tuvo un hipo", m: "Pasa en las mejores familias. ¡Prueba otra vez, tendrás suerte!", b: "🔄 Reintentar" },
    pt: { t: "A IA teve um soluço", m: "Acontece. Tente de novo, vai ter mais sorte!", b: "🔄 Tentar Novamente" }
};

async function runProcessor() {
    
    // 1. RECUPERA LINGUA
    const userLang = (navigator.language || "it").slice(0,2);
    const txt = i18nErrors[userLang] || i18nErrors['en'];

    // 2. RECUPERA PARAMETRI
    const params = new URLSearchParams(window.location.search);
    const callAction = params.get('call');
    const ownerKey = params.get('owner_key');
    const finalCommand = params.get('cmd');
    
    if(!callAction || !ownerKey) return showError("CONFIG ERROR: Call params missing");

    // 3. RECUPERA PAYLOAD (Senza cancellarlo subito!)
    const sessionKey = `pending_payload_${ownerKey}`;
    const payloadStr = sessionStorage.getItem(sessionKey);
    
    if(!payloadStr) return showError("DATA ERROR: Payload expired or missing. Please restart onboarding.");
    
    const originalPayload = JSON.parse(payloadStr);

    const processorPayload = {
        action: callAction,
        owner_key: ownerKey,
        data: originalPayload
    };

    try {
        console.log("📡 Calling Processor...");
        
        const response = await fetch(PROCESSOR_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(processorPayload)
        });

        // --- GESTIONE SPECIALE ERRORE 501 (AI FAIL) ---
        if (response.status === 501) {
            // NON cancelliamo il sessionStorage, così al reload i dati ci sono ancora.
            if(window.SiteBoSGame) SiteBoSGame.stop();
            
            const overlay = document.getElementById('error-overlay');
            overlay.innerHTML = `
                <div style="font-size:50px; margin-bottom:20px;">🎲</div>
                <h2 style="color:#f59e0b; font-family:'Orbitron', sans-serif;">${txt.t}</h2>
                <p style="color:#ccc; font-size:14px; margin-bottom:30px;">${txt.m}</p>
                <button class="btn-game" onclick="window.location.reload()">
                    ${txt.b}
                </button>
            `;
            overlay.classList.remove('hidden');
            return; // Stop execution here
        }

        if(!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const result = await response.json();
        
        // ==========================================
        // SUCCESSO! ORA POSSIAMO PULIRE E USCIRE
        // ==========================================
        
        // 1. Ferma il gioco
        if(window.SiteBoSGame) SiteBoSGame.stop();

        // 2. Recupera Punti (Direct Access Fix)
        let bonusPoints = 0;
        if (window.SiteBoSGame && typeof window.SiteBoSGame.score === 'number') {
            bonusPoints = window.SiteBoSGame.score;
        } else {
            const scoreEl = document.getElementById('score');
            if(scoreEl) bonusPoints = parseInt(scoreEl.innerText) || 0;
        }

        // 3. Pulisce la memoria (Solo ora è sicuro)
        sessionStorage.removeItem(sessionKey);

        // 4. Redirect
        if (result.checkout_url) {
            window.location.href = result.checkout_url;
        } 
        else if (result.owner_data) {
            const vat = result.owner_data.vat_number;
            const ownerId = result.owner_data.chat_id;
            const name = encodeURIComponent(result.owner_data.ragione_sociale || "Company");
            const token = result.owner_data.access_token;
            
            let finalUrl = `dashboard.html?vat=${vat}&owner=${ownerId}&ragione_sociale=${name}&token=${token}`;
            if (finalCommand) finalUrl += `&cmd=${finalCommand}`;
            
            // Inietta punti
            if(bonusPoints > 0) {
                finalUrl += `&bonus_credits=${bonusPoints}`;
            }
            
            console.log("🚀 Redirecting to:", finalUrl);
            window.location.href = finalUrl;
        } 
        else if (result.status === 'error') {
            handleLogicError(result.error, originalPayload);
        }
        else {
            showError("SERVER RESPONSE ERROR: Invalid data structure.");
        }

    } catch (err) {
        if(window.SiteBoSGame) SiteBoSGame.stop();
        showError("SYSTEM ERROR: " + err.message);
    }
}

function handleLogicError(errorObj, payload) {
    // Gestione Errore Recuperabile (es. dati sporchi ma correggibili)
    if (errorObj && errorObj.code === 'SETUP_FAILED_RETRYABLE') {
        const overlay = document.getElementById('error-overlay');
        overlay.innerHTML = `
            <div style="font-size:40px; color:#ff6b6b; margin-bottom:20px;"><i class="fas fa-tools"></i></div>
            <p class="error-msg">${errorObj.message}</p>
            <button class="btn-game" onclick="location.href='reset.html?vat=${payload.owner_data.vat_number}'">
                RESET CONFIG
            </button>
        `;
        overlay.classList.remove('hidden');
    } else {
        showError(`${errorObj?.title || 'Error'}\n${errorObj?.message || 'Unknown error'}`);
    }
}

function showError(msg) {
    const el = document.getElementById('error-text');
    if(el) el.innerText = msg;
    const ov = document.getElementById('error-overlay');
    if(ov) ov.classList.remove('hidden');
    else alert(msg);
}

document.addEventListener('DOMContentLoaded', runProcessor);
