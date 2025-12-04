'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const WEBHOOK_BLOG_URL = "https://trinai.api.workflow.dcmake.it/webhook/914bd78e-8a41-46d7-8935-7eb73cbbae66";
    
    const startBtn = document.getElementById('startBtn');
    const loader = document.getElementById('loader');
    const logArea = document.getElementById('logArea');
    const previewInfo = document.getElementById('previewInfo');
    const backBtn = document.getElementById('backBtn');

    // ✅ FORZA NASCONDI LOADER ALL'AVVIO (protezione contro cache)
    loader.style.display = 'none';
    logArea.style.display = 'none';

    // Recupera parametri dall'URL
    const params = new URLSearchParams(window.location.search);
    const fragmentId = params.get('fragment_id');
    const apiCredentials = {
        vat: params.get('vat'),
        token: params.get('token'),
        owner: params.get('owner'),
        ragione_sociale: params.get('ragione_sociale')
    };

    // Configura pulsante "Indietro"
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.back();
    });

    if (!fragmentId) {
        log("Errore: ID frammento mancante.");
        logArea.style.display = 'block'; // Mostra solo se c'è errore
        startBtn.disabled = true;
        return;
    }

    previewInfo.textContent = `Frammento ID: ${fragmentId}`;

    // Telegram WebApp init
    const tg = window.Telegram.WebApp;
    if (tg) tg.ready();

    startBtn.addEventListener('click', async () => {
        // ✨ CONFERMA CON DETTAGLIO COSTO
        const confirmed = await showConfirmation();
        if (!confirmed) {
            logArea.style.display = 'block';
            log("> ❌ Operazione annullata dall'utente.");
            return;
        }

        startBtn.disabled = true;
        startBtn.textContent = "Generazione in corso...";
        loader.style.display = 'block'; // ✅ Mostra SOLO dopo conferma
        logArea.style.display = 'block';
        
        log(`> Avvio richiesta per ID: ${fragmentId}...`);
        log("> 💰 Scalamento 1000 punti in corso...");
        if(tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');

        try {
            const response = await fetch(WEBHOOK_BLOG_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'generate_draft', // ✅ CAMBIATO DA generate_blog_post
                    fragment_id: fragmentId,
                    vat_number: apiCredentials.vat,
                    token: apiCredentials.token,
                    chat_id: apiCredentials.owner,
                    ragione_sociale: apiCredentials.ragione_sociale
                })
            });

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            const data = await response.json();
            
            loader.style.display = 'none'; // ✅ Nascondi dopo risposta
            log("> Risposta ricevuta dal server.");
            
            if (data.status === 'success' || data.url) {
                log(`> ✅ Blog post generato con successo!`);
                log(`> URL: ${data.url || 'N/D'}`);
                
                startBtn.textContent = "Apri Articolo";
                startBtn.disabled = false;
                startBtn.style.background = "var(--primary)";
                
                // Cambia comportamento pulsante: ora apre il link
                const blogUrl = data.url;
                startBtn.onclick = () => {
                    if(tg && tg.openLink) tg.openLink(blogUrl);
                    else window.open(blogUrl, '_blank');
                };

                if(tg && tg.showPopup) tg.showPopup({ message: "Articolo generato con successo!" });

            } else {
                log(`> ⚠️ Risposta imprevista: ${JSON.stringify(data)}`);
                startBtn.textContent = "Riprova";
                startBtn.disabled = false;
            }

        } catch (error) {
            console.error(error);
            loader.style.display = 'none'; // ✅ Nascondi in caso di errore
            log(`> ❌ Errore: ${error.message}`);
            startBtn.disabled = false;
            startBtn.textContent = "Riprova";
        }
    });

    /**
     * Mostra una conferma nativa Telegram con dettaglio costo
     * @returns {Promise<boolean>}
     */
    async function showConfirmation() {
        if (tg && tg.showConfirm) {
            return new Promise((resolve) => {
                tg.showConfirm(
                    "💰 Questa operazione scalerà 1000 punti dal tuo saldo.\n\n🤖 Generare l'articolo blog con l'IA?",
                    (confirmed) => resolve(confirmed)
                );
            });
        } else {
            // Fallback browser standard
            return confirm("💰 ATTENZIONE\n\nQuesta operazione scalerà 1000 punti dal tuo saldo.\n\nVuoi continuare?");
        }
    }

    function log(msg) {
        logArea.innerHTML += `<div class="terminal-line">${msg}</div>`;
        logArea.scrollTop = logArea.scrollHeight;
    }
});
