/**
 * PROCESSOR CORE - LOGIC ONLY (v2.3 - Final)
 * 
 * 1. Legge l'azione ('call'), la chiave ('owner_key') e il comando finale ('cmd') dall'URL.
 * 2. Recupera il payload completo dalla memoria di sessione usando la 'owner_key'.
 * 3. Chiama l'UNICO webhook processore passandogli l'azione e il payload.
 * 4. Aspetta la risposta del backend (mentre il gioco intrattiene l'utente).
 * 5. Esegue il redirect finale alla dashboard, accodando il 'cmd' per la pagina di destinazione.
 */

const tg = window.Telegram.WebApp; 
tg.ready(); tg.expand();

// L'UNICO WEBHOOK CHE GESTISCE TUTTE LE PIPE LUNGHE
const PROCESSOR_WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/35667aed-ee1c-4074-92df-d4334967a1b3";

async function runProcessor() {
    
    // 1. Avvia l'interfaccia di attesa (Gioco e Timer)
    if(window.SiteBoSGame) { 
        SiteBoSGame.init();
        SiteBoSGame.start();
    }
    let sec = 0;
    setInterval(() => { 
        sec++; 
        const m = Math.floor(sec/60).toString().padStart(2,'0');
        const s = (sec%60).toString().padStart(2,'0');
        document.getElementById('timer').innerText = `${m}:${s}`; 
    }, 1000);

    // 2. Recupera l'incarico e i parametri dall'URL
    const params = new URLSearchParams(window.location.search);
    const callAction = params.get('call');
    const ownerKey = params.get('owner_key');
    const finalCommand = params.get('cmd');
    
    if(!callAction || !ownerKey) {
        return showError("CONFIG ERROR: Manca 'call' o 'owner_key' nell'URL.");
    }

    // 3. Recupera il payload completo dalla memoria di sessione
    const sessionKey = `pending_payload_${ownerKey}`;
    const payloadStr = sessionStorage.getItem(sessionKey);
    if(!payloadStr) {
        return showError("DATA ERROR: Nessun payload in attesa trovato. Riprova dall'inizio.");
    }
    
    // Pulisci subito la memoria per sicurezza
    sessionStorage.removeItem(sessionKey);
    
    const originalPayload = JSON.parse(payloadStr);

    // 4. Costruisci il payload finale per il Webhook Processore
    const processorPayload = {
        action: callAction,
        owner_key: ownerKey,
        data: originalPayload
    };

    try {
        console.log("Calling Processor Webhook with action:", callAction);
        
        // 5. Esegui la chiamata al backend e attendi la risposta
        const response = await fetch(PROCESSOR_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(processorPayload)
        });

        if(!response.ok) {
            throw new Error(`Errore di rete: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // 6. Chiamata terminata: ferma il gioco
        if(window.SiteBoSGame) {
            SiteBoSGame.stop();
        }
        
        // 7. Esegui il redirect in base alla risposta del backend
        if (result.checkout_url) {
            // Caso A: Il backend richiede un pagamento
            window.location.href = result.checkout_url;
        } 
        else if (result.owner_data) {
            // Caso B: Successo, vai alla dashboard
            const responseData = result.owner_data; 
            
            const vat = responseData.vat_number;
            const ownerId = responseData.chat_id;
            const name = encodeURIComponent(responseData.ragione_sociale || "Company");
            const token = responseData.access_token;
            
            let finalUrl = `dashboard.html?vat=${vat}&owner=${ownerId}&ragione_sociale=${name}&token=${token}`;
            if (finalCommand) {
                finalUrl += `&cmd=${finalCommand}`;
            }
            
            console.log("Redirecting to:", finalUrl);
            window.location.href = finalUrl;
        } 
        else {
            // Caso C: Risposta non valida dal backend
            showError("ERRORE RISPOSTA SERVER: Formato dati non valido.");
        }

    } catch (err) {
        if(window.SiteBoSGame) {
            SiteBoSGame.stop();
        }
        showError("ERRORE CRITICO: " + err.message);
    }
}

// Funzione Helper per mostrare errori a schermo
function showError(msg) {
    const errorText = document.getElementById('error-text');
    const errorOverlay = document.getElementById('error-overlay');
    if (errorText) errorText.innerText = msg;
    if (errorOverlay) errorOverlay.classList.remove('hidden');
}

// Avvia tutto quando la pagina è pronta
document.addEventListener('DOMContentLoaded', runProcessor);
