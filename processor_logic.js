/**
 * PROCESSOR CORE - LOGIC ONLY (v2.4 - Bonus Credits Edition)
 * 1. Chiama il webhook.
 * 2. Gestisce il redirect passando anche i CREDITI GUADAGNATI GIOCANDO.
 */

const tg = window.Telegram.WebApp; 
tg.ready(); tg.expand();

// CONFIG: UNICO WEBHOOK PROCESSORE
const PROCESSOR_WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/35667aed-ee1c-4074-92df-d4334967a1b3";

async function runProcessor() {
    
    // 2. RECUPERA INCARICO
    const params = new URLSearchParams(window.location.search);
    const callAction = params.get('call');
    const ownerKey = params.get('owner_key');
    const finalCommand = params.get('cmd');
    
    if(!callAction || !ownerKey) return showError("CONFIG ERROR: CALL or OWNER_KEY missing");

    // 3. RECUPERA PAYLOAD
    const sessionKey = `pending_payload_${ownerKey}`;
    const payloadStr = sessionStorage.getItem(sessionKey);
    if(!payloadStr) return showError("DATA ERROR: NO PAYLOAD FOUND");
    
    sessionStorage.removeItem(sessionKey);
    
    const originalPayload = JSON.parse(payloadStr);

    const processorPayload = {
        action: callAction,
        owner_key: ownerKey,
        data: originalPayload
    };

    try {
        console.log("Calling Processor...");
        
        const response = await fetch(PROCESSOR_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(processorPayload)
        });

        if(!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        
        // 6. SUCCESSO -> FERMA GIOCO E SALVA SCORE
        if(window.SiteBoSGame) SiteBoSGame.stop();
        
        // CHECKOUT REDIRECT
        if (result.checkout_url) {
            window.location.href = result.checkout_url;
        } 
        // SUCCESS REDIRECT (DASHBOARD)
        else if (result.owner_data) {
            const vat = result.owner_data.vat_number;
            const ownerId = result.owner_data.chat_id;
            const name = encodeURIComponent(result.owner_data.ragione_sociale || "Company");
            const token = result.owner_data.access_token;
            
            let finalUrl = `dashboard.html?vat=${vat}&owner=${ownerId}&ragione_sociale=${name}&token=${token}`;
            if (finalCommand) finalUrl += `&cmd=${finalCommand}`;
            
            // --- BONUS CREDITS LOGIC ---
            const score = sessionStorage.getItem('last_game_score');
            if(score && parseInt(score) > 0) {
                finalUrl += `&bonus_credits=${score}`;
                sessionStorage.removeItem('last_game_score'); // Clean
            }
            // --------------------------
            
            console.log("Redirecting:", finalUrl);
            window.location.href = finalUrl;
        } 
        // ERROR FROM N8N
        else if (result.status === 'error' && result.error) {
            showError(`${result.error.title}\n${result.error.message}`);
        }
        else {
            showError("SERVER RESPONSE ERROR: Invalid data.");
        }

    } catch (err) {
        if(window.SiteBoSGame) SiteBoSGame.stop();
        showError("SERVER ERROR: " + err.message);
    }
}

function showError(msg) {
    document.getElementById('error-text').innerText = msg;
    document.getElementById('error-overlay').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', runProcessor);
