/**
 * PROCESSOR CORE - ROUTER EDITION (v4.1)
 * Mantiene la logica v3.0 (Errori, Gioco, Punti) e aggiunge il Routing Multi-Webhook.
 */

const tg = window.Telegram.WebApp; 
tg.ready(); tg.expand();

// CONFIG: MAPPA WEBHOOKS
const WEBHOOKS = {
    // Default (Onboarding) - Retrocompatibilità
    'default': "https://trinai.api.workflow.dcmake.it/webhook/35667aed-ee1c-4074-92df-d4334967a1b3",
    
    // Explicit Onboarding
    'onboarding': "https://trinai.api.workflow.dcmake.it/webhook/35667aed-ee1c-4074-92df-d4334967a1b3",
    
    // Save Product (Nuovo)
    'save_product': "https://trinai.api.workflow.dcmake.it/webhook/20fd95c0-4218-400e-ae2a-cd881a757b80"
};

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
    const returnUrl = params.get('return_url'); // NUOVO PARAMETRO
    
    if(!callAction || !ownerKey) return showError("CONFIG ERROR: Call params missing");

    // SELEZIONE WEBHOOK (Nuova Logica Router)
    const targetWebhook = WEBHOOKS[callAction] || WEBHOOKS['default'];

    // 3. RECUPERA PAYLOAD
    const sessionKey = `pending_payload_${ownerKey}`;
    const payloadStr = sessionStorage.getItem(sessionKey);
    
    if(!payloadStr) return showError("DATA ERROR: Payload expired or missing. Please restart operation.");
    
    const originalPayload = JSON.parse(payloadStr);

    // Costruzione Payload per n8n
    // Se è 'save_product', mandiamo il payload PURO (senza wrapper 'data') come richiesto
    let finalPayload;
    if (callAction === 'save_product') {
        finalPayload = originalPayload; // Pass-through diretto
    } else {
        // Wrapper legacy per Onboarding
        finalPayload = {
            action: callAction,
            owner_key: ownerKey,
            data: originalPayload
        };
    }

    try {
        console.log(`📡 Calling Processor Action: ${callAction} -> ${targetWebhook}`);
        
        const response = await fetch(targetWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalPayload)
        });

        // --- GESTIONE SPECIALE ERRORE 501 (AI FAIL) ---
        if (response.status === 501) {
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
            return; 
        }

        if(!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const result = await response.json();
        
        // 🔧 FIX: Normalizza risposta se è array
        const normalizedResult = Array.isArray(result) ? result[0] : result;
        
        // ==========================================
        // SUCCESSO!
        // ==========================================
        
        if(window.SiteBoSGame) SiteBoSGame.stop();

        // Recupera Punti
        let bonusPoints = 0;
        if (window.SiteBoSGame && typeof window.SiteBoSGame.score === 'number') {
            bonusPoints = window.SiteBoSGame.score;
        } else {
            const scoreEl = document.getElementById('score');
            if(scoreEl) bonusPoints = parseInt(scoreEl.innerText) || 0;
        }

        sessionStorage.removeItem(sessionKey);

        // --- LOGICA DI REDIRECT (ROUTING) ---
        
        // 1. Priorità: Checkout URL (Onboarding Stripe)
        if (normalizedResult.checkout_url) {
            window.location.href = normalizedResult.checkout_url;
        } 
        // 2. Onboarding Dashboard Redirect (Legacy)
        else if (normalizedResult.owner_data && callAction === 'onboarding') {
            const vat = normalizedResult.owner_data.vat_number;
            const ownerId = normalizedResult.owner_data.chat_id;
            const name = encodeURIComponent(normalizedResult.owner_data.ragione_sociale || "Company");
            const token = normalizedResult.owner_data.access_token;
            
            let finalUrl = `dashboard.html?vat=${vat}&owner=${ownerId}&ragione_sociale=${name}&token=${token}`;
            if (finalCommand) finalUrl += `&cmd=${finalCommand}`;
            if (bonusPoints > 0) finalUrl += `&bonus_credits=${bonusPoints}`;
            
            console.log("🚀 Redirecting to Dashboard:", finalUrl);
            window.location.href = finalUrl;
        } 
        // 3. NUOVO: Return URL Generico (Save Product)
        else if (returnUrl) {
            let finalUrl = decodeURIComponent(returnUrl);
            // Appendiamo i crediti se non ci sono già
            if (bonusPoints > 0 && !finalUrl.includes('bonus_credits')) {
                finalUrl += (finalUrl.includes('?') ? '&' : '?') + `bonus_credits=${bonusPoints}`;
            }
            console.log("🚀 Returning to Origin:", finalUrl);
            window.location.href = finalUrl;
        }
        // 4. Gestione Errori Logici n8n
        else if (normalizedResult.status === 'error') {
            handleLogicError(normalizedResult.error, originalPayload);
        }
        // 5. Fallback generico per successo senza redirect (es. API pure)
        else {
            showError("Operazione completata con successo, ma nessuna destinazione trovata.");
        }

    } catch (err) {
        if(window.SiteBoSGame) SiteBoSGame.stop();
        showError("SYSTEM ERROR: " + err.message);
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
