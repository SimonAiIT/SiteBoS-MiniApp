/**
 * PROCESSOR CORE - LOGIC ONLY
 * Gestione Webhook, Security Handshake e Redirect.
 * Dipende da un oggetto globale 'SiteBoSGame' definito nell'HTML.
 */

const tg = window.Telegram.WebApp; 
tg.ready(); tg.expand();

// CONFIGURAZIONE API (L'unica cosa da cambiare qui se sposti i webhook)
const API_BASE = "https://trinai.api.workflow.dcmake.it/webhook/35667aed-ee1c-4074-92df-d4334967a1b3";

async function runProcessor() {
    
    // 1. AVVIA INTRATTENIMENTO
    if(window.SiteBoSGame) {
        SiteBoSGame.init();
        SiteBoSGame.start();
    }

    // 2. TIMER VISUALE
    let sec = 0;
    setInterval(() => { 
        sec++; 
        const m = Math.floor(sec/60).toString().padStart(2,'0');
        const s = (sec%60).toString().padStart(2,'0');
        document.getElementById('timer').innerText = `${m}:${s}`; 
    }, 1000);

    // 3. RECUPERA ID WEBHOOK dall'URL
    const params = new URLSearchParams(window.location.search);
    const webhookId = params.get('wh');
    
    if(!webhookId) return showError("CONFIG ERROR: NO WEBHOOK ID");

    // 4. RECUPERA DATI DALLA SESSIONE E CANCELLALI
    const payloadStr = sessionStorage.getItem('pending_payload');
    if(!payloadStr) return showError("DATA ERROR: NO PAYLOAD");
    
    sessionStorage.removeItem('pending_payload'); // Sicurezza
    
    const payload = JSON.parse(payloadStr);

    try {
        console.log("Calling Webhook:", webhookId);
        
        // 5. CHIAMATA AL SERVER (Lunga attesa)
        const response = await fetch(API_BASE + webhookId, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if(!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();
        
        // 6. SUCCESSO: Ferma gioco e reindirizza
        if(window.SiteBoSGame) SiteBoSGame.stop();
        
        if (result.checkout_url) {
            window.location.href = result.checkout_url;
        } 
        else if (result.owner_data) {
            const vat = result.owner_data.vat_number;
            const owner = payload.user_id;
            const name = encodeURIComponent(result.owner_data.ragione_sociale || "Company");
            window.location.href = `dashboard.html?vat=${vat}&owner=${owner}&ragione_sociale=${name}`;
        } 
        else {
            const vat = payload.owner_data.vat_number; 
            window.location.href = `dashboard.html?vat=${vat}`;
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

// AVVIA LA LOGICA
document.addEventListener('DOMContentLoaded', runProcessor);
