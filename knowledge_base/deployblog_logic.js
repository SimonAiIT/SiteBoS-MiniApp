'use strict';

console.log('📜 deployblog_logic.js caricato');

const WEBHOOK_BLOG_URL = "https://trinai.api.workflow.dcmake.it/webhook/914bd78e-8a41-46d7-8935-7eb73cbbae66";

const params = new URLSearchParams(window.location.search);
const fragmentId = params.get('fragment_id');
const lang = params.get('lang') || 'it';
const apiCredentials = {
    vat: params.get('vat'),
    token: params.get('token'),
    owner: params.get('owner'),
    ragione_sociale: params.get('ragione_sociale')
};

const tg = window.Telegram.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
}

if (!fragmentId) {
    console.error('❌ ID frammento mancante!');
    alert('Errore: ID frammento mancante.');
    window.history.back();
}

// ✅ ATTENDI CHE IL DOM SIA PRONTO
document.addEventListener('DOMContentLoaded', () => {
    console.log('📦 DOM caricato');
    
    const confirmOverlay = document.getElementById('confirmOverlay');
    const confirmCancel = document.getElementById('confirmCancel');
    const confirmProceed = document.getElementById('confirmProceed');
    
    console.log('🔍 Elementi trovati:', {
        overlay: !!confirmOverlay,
        cancel: !!confirmCancel,
        proceed: !!confirmProceed
    });

    // Mostra popup conferma
    if (confirmOverlay) {
        confirmOverlay.style.display = 'flex';
        console.log('✅ Popup conferma mostrato');
    }

    // Click su "Annulla"
    if (confirmCancel) {
        confirmCancel.addEventListener('click', () => {
            console.log('❌ Utente ha annullato');
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            window.history.back();
        });
    }

    // Click su "Procedi"
    if (confirmProceed) {
        confirmProceed.addEventListener('click', async () => {
            console.log('✅ Utente ha confermato!');
            
            // 1. Nascondi popup
            confirmOverlay.style.display = 'none';
            
            // 2. Haptic feedback
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            
            // 3. Avvia minigame
            console.log('🎮 Avvio minigame...');
            if (typeof openGame === 'function') {
                openGame();
            } else {
                console.error('❌ Funzione openGame non trovata!');
                alert('Errore: impossibile avviare il gioco.');
                return;
            }
            
            // 4. Attendi 500ms
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 5. Avvia API call in background
            console.log('🚀 Avvio chiamata API...');
            
            try {
                const response = await fetch(WEBHOOK_BLOG_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'create',
                        fragment_id: fragmentId,
                        vat_number: apiCredentials.vat,
                        token: apiCredentials.token,
                        chat_id: apiCredentials.owner,
                        ragione_sociale: apiCredentials.ragione_sociale,
                        lang: lang
                    })
                });

                if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

                const data = await response.json();
                console.log('📥 Risposta API:', data);
                
                if (data.status === 'success' || data.blog_id) {
                    console.log('✅ Blog generato con successo!');
                    
                    let bonusCredits = 0;
                    if (window.MiniGame && MiniGame.active) {
                        bonusCredits = Math.min(MiniGame.score || 0, 500);
                        MiniGame.stop();
                        console.log(`🎮 Crediti bonus: ${bonusCredits}`);
                    }
                    
                    if (typeof closeGame === 'function') {
                        closeGame();
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    const editUrl = new URL('edit_blog.html', window.location.href);
                    editUrl.searchParams.set('blog_id', data.blog_id || fragmentId);
                    editUrl.searchParams.set('vat', apiCredentials.vat);
                    editUrl.searchParams.set('token', apiCredentials.token);
                    editUrl.searchParams.set('owner', apiCredentials.owner);
                    editUrl.searchParams.set('ragione_sociale', apiCredentials.ragione_sociale);
                    editUrl.searchParams.set('lang', lang);
                    if (bonusCredits > 0) editUrl.searchParams.set('bonus_credits', bonusCredits);
                    
                    console.log('🔄 Redirect a:', editUrl.toString());
                    window.location.href = editUrl.toString();

                } else {
                    throw new Error(data.error || 'Unknown error');
                }

            } catch (error) {
                console.error('❌ Errore API:', error);
                if (typeof closeGame === 'function') {
                    closeGame();
                }
                alert(`Errore: ${error.message}`);
                window.history.back();
            }
        });
    }
});