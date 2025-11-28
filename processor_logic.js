/**
 * PROCESSOR CORE - LOGIC ONLY (v2.5 - SYNTAX FIX)
 * 1. Chiama il webhook.
 * 2. Gestisce il redirect passando anche i CREDITI GUADAGNATI GIOCANDO.
 */

const tg = window.Telegram.WebApp; 
tg.ready(); tg.expand();

// CONFIG: UNICO WEBHOOK PROCESSORE
const PROCESSOR_WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/35667aed-ee1c-4074-92df-d4334967a1b3";

async function runProcessor() {
    
    // 1. RECUPERA PARAMETRI URL
    const params = new URLSearchParams(window.location.search);
    const callAction = params.get('call');
    const ownerKey = params.get('owner_key');
    const finalCommand = params.get('cmd');
    
    if(!callAction || !ownerKey) return showError("CONFIG ERROR: CALL or OWNER_KEY missing");

    // 2. RECUPERA PAYLOAD DA SESSION STORAGE
    const sessionKey = `pending_payload_${ownerKey}`;
    const payloadStr = sessionStorage.getItem(sessionKey);
    
    if(!payloadStr) {
        // Fallback: se non c'è payload, forse è un reload o accesso diretto errato
        return showError(`DATA ERROR: Nessun dato trovato per ${ownerKey}. Riprova la procedura.`);
    }
    
    // Pulizia immediata per sicurezza (opzionale, meglio tenerlo se serve retry)
    // sessionStorage.removeItem(sessionKey); 
    
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
        
        // 3. GESTIONE RISPOSTA
        
        // SUCCESSO -> FERMA GIOCO E SALVA SCORE
        if(window.SiteBoSGame) SiteBoSGame.stop();
        
        // CASO A: CHECKOUT URL (Pagamento)
        if (result.checkout_url) {
            window.location.href = result.checkout_url;
        } 
        // CASO B: SUCCESSO COMPLETO (Dashboard)
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
                sessionStorage.removeItem('last_game_score'); 
            }
            
            console.log("Redirecting to:", finalUrl);
            window.location.href = finalUrl;
        } 
        // CASO C: ERRORE GESTITO
        else if (result.status === 'error') {
            
            // Gestione errore recuperabile (es. dati mancanti)
            if (result.error && result.error.code === 'SETUP_FAILED_RETRYABLE') {
                if(window.SiteBoSGame) SiteBoSGame.stop();
                
                const overlay = document.getElementById('error-overlay');
                overlay.innerHTML = `
                    <div style="font-size:40px; color:#f59e0b; margin-bottom:20px;"><i class="fas fa-tools"></i></div>
                    <p class="error-msg">${result.error.message}</p>
                    <button class="btn-game" onclick="history.back()">
                        TORNA INDIETRO E CORREGGI
                    </button>
                `;
                overlay.classList.remove('hidden');
                return;
            }
            
            // Errore generico dal backend
            showError(`${result.error ? result.error.title : 'Errore'}\n${result.error ? result.error.message : 'Errore sconosciuto'}`);
        }
        else {
            showError("SERVER RESPONSE ERROR: Invalid data format.");
        }

    } catch (err) {
        if(window.SiteBoSGame) SiteBoSGame.stop();
        showError("CONNECTION ERROR: " + err.message);
    }
}

function showError(msg) {
    const el = document.getElementById('error-text');
    if(el) el.innerText = msg;
    const overlay = document.getElementById('error-overlay');
    if(overlay) overlay.classList.remove('hidden');
    console.error(msg);
}

// Avvio automatico al caricamento
document.addEventListener('DOMContentLoaded', runProcessor);
