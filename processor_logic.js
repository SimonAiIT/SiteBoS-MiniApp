/**
 * PROCESSOR CORE - LOGIC ONLY (v2.6 - STABLE & SAFE)
 * Basato sulla v2.4 funzionante.
 * Fix: Prevenzione perdita dati su errore di rete.
 */

const tg = window.Telegram.WebApp; 
tg.ready(); tg.expand();

// CONFIG
const PROCESSOR_WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/35667aed-ee1c-4074-92df-d4334967a1b3";

async function runProcessor() {
    console.log("System Start...");

    // 1. RECUPERA PARAMETRI URL
    const params = new URLSearchParams(window.location.search);
    const callAction = params.get('call');
    const ownerKey = params.get('owner_key');
    const finalCommand = params.get('cmd');
    
    if(!callAction || !ownerKey) return showError("CONFIG ERROR: Parametri mancanti (call o owner_key).");

    // 2. RECUPERA PAYLOAD
    const sessionKey = `pending_payload_${ownerKey}`;
    const payloadStr = sessionStorage.getItem(sessionKey);
    
    if(!payloadStr) return showError("DATA ERROR: Nessun dato trovato in memoria. Riavvia la procedura.");
    
    // NOTA: Non cancelliamo subito il sessionStorage per sicurezza. 
    // Lo cancelleremo solo dopo il successo.
    
    let originalPayload;
    try {
        originalPayload = JSON.parse(payloadStr);
    } catch(e) {
        return showError("JSON ERROR: Dati corrotti in memoria.");
    }

    // 3. COSTRUZIONE PAYLOAD (Struttura Nidificata come da v2.4)
    const processorPayload = {
        action: callAction,      // Usato dallo Switch n8n
        owner_key: ownerKey,     // Usato per Lookup DB
        data: originalPayload    // I dati veri (owner_data, etc.) annidati qui
    };

    // 4. CHIAMATA WEBHOOK
    try {
        console.log("Calling Webhook...");
        
        const response = await fetch(PROCESSOR_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(processorPayload)
        });

        if(!response.ok) throw new Error(`HTTP Error ${response.status}`);
        
        const result = await response.json();
        console.log("Response:", result);
        
        // 5. GESTIONE SUCCESSO
        
        // Stop Gioco
        if(window.SiteBoSGame && typeof SiteBoSGame.stop === 'function') {
            SiteBoSGame.stop();
        }
        
        // CASO A: CHECKOUT URL
        if (result.checkout_url) {
            // Pulizia dati solo ora che siamo sicuri
            sessionStorage.removeItem(sessionKey); 
            window.location.href = result.checkout_url;
        } 
        // CASO B: SUCCESSO DASHBOARD
        else if (result.owner_data) {
            // Pulizia dati
            sessionStorage.removeItem(sessionKey);
            
            const vat = result.owner_data.vat_number;
            const ownerId = result.owner_data.chat_id;
            const name = encodeURIComponent(result.owner_data.ragione_sociale || "Company");
            const token = result.owner_data.access_token;
            
            let finalUrl = `dashboard.html?vat=${vat}&owner=${ownerId}&ragione_sociale=${name}&token=${token}`;
            if (finalCommand) finalUrl += `&cmd=${finalCommand}`;
            
            // Gestione Crediti Gioco
            const score = sessionStorage.getItem('last_game_score');
            if(score && parseInt(score) > 0) {
                finalUrl += `&bonus_credits=${score}`;
                sessionStorage.removeItem('last_game_score');
            }
            
            console.log("Redirecting...");
            window.location.href = finalUrl;
        } 
        // CASO C: ERRORE DAL SERVER
        else if (result.status === 'error') {
            const errData = result.error || {};
            
            // Errore recuperabile (es. Account già esistente -> Reset)
            if (errData.code === 'SETUP_FAILED_RETRYABLE' || errData.code === 'DUPLICATE_INSTANCE') {
                const overlay = document.getElementById('error-overlay');
                // Se è un duplicato, offriamo il reset o il supporto
                overlay.innerHTML = `
                    <div style="font-size:40px; color:#f59e0b; margin-bottom:20px;"><i class="fas fa-exclamation-circle"></i></div>
                    <p class="error-msg" style="color:white; margin-bottom:20px;">${errData.message}</p>
                    <!-- Qui potresti mettere un link a reset.html se esiste -->
                    <button class="btn-game" onclick="history.back()">Indietro</button>
                `;
                overlay.classList.remove('hidden');
                return;
            }
            
            showError(`${errData.title || 'Errore Server'}\n${errData.message || 'Si è verificato un errore imprevisto.'}`);
        }
        else {
            showError("Risposta del server non valida o incompleta.");
        }

    } catch (err) {
        if(window.SiteBoSGame && typeof SiteBoSGame.stop === 'function') SiteBoSGame.stop();
        showError("ERRORE DI CONNESSIONE: " + err.message);
    }
}

function showError(msg) {
    const el = document.getElementById('error-text');
    if(el) el.innerText = msg;
    
    const overlay = document.getElementById('error-overlay');
    if(overlay) overlay.classList.remove('hidden');
    
    const loader = document.querySelector('.loader-container');
    if(loader) loader.style.display = 'none';
    
    console.error(msg);
}

document.addEventListener('DOMContentLoaded', runProcessor);
