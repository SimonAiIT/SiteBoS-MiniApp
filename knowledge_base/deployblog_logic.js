'use strict';

const i18n = {
    it: {
        pageTitle: "Generatore Blog IA",
        pageSubtitle: "Trasforma questo frammento di conoscenza in un articolo SEO completo.",
        loadingText: "Caricamento ID...",
        btnStart: "Genera Blog Post",
        btnBack: "Torna alla Knowledge Base",
        confirmTitle: "Conferma Operazione",
        confirmMessage: "Stai per spendere <strong>1000 crediti</strong> per generare questo articolo blog con l'IA.<br><br>Vuoi procedere?",
        btnCancel: "Annulla",
        btnProceed: "Procedi",
        fragmentId: "Frammento ID:",
        logCancelled: "> ❌ Operazione annullata dall'utente.",
        errorMissingId: "Errore: ID frammento mancante."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const WEBHOOK_BLOG_URL = "https://trinai.api.workflow.dcmake.it/webhook/914bd78e-8a41-46d7-8935-7eb73cbbae66";
    
    const startBtn = document.getElementById('startBtn');
    const logArea = document.getElementById('logArea');
    const backBtn = document.getElementById('backBtn');
    const confirmOverlay = document.getElementById('confirmOverlay');
    const confirmCancel = document.getElementById('confirmCancel');
    const confirmProceed = document.getElementById('confirmProceed');

    const params = new URLSearchParams(window.location.search);
    const fragmentId = params.get('fragment_id');
    const lang = params.get('lang') || 'it';
    const apiCredentials = {
        vat: params.get('vat'),
        token: params.get('token'),
        owner: params.get('owner'),
        ragione_sociale: params.get('ragione_sociale')
    };

    const t = i18n[lang] || i18n['it'];
    const tg = window.Telegram.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
    }

    if (!fragmentId) {
        log(t.errorMissingId, logArea);
        logArea.style.display = 'block';
        startBtn.disabled = true;
        return;
    }

    document.getElementById('loadingText').textContent = `${t.fragmentId} ${fragmentId}`;

    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.back();
    });

    startBtn.addEventListener('click', () => {
        confirmOverlay.style.display = 'flex';
        if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    });

    confirmCancel.addEventListener('click', () => {
        confirmOverlay.style.display = 'none';
        log(t.logCancelled, logArea);
        logArea.style.display = 'block';
        if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    });

    confirmProceed.addEventListener('click', async () => {
        confirmOverlay.style.display = 'none';
        if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
        openGame();

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
            
            if (data.status === 'success' || data.blog_id) {
                console.log('✅ Blog generato con successo!');
                
                let bonusCredits = 0;
                if (window.MiniGame && MiniGame.active) {
                    bonusCredits = Math.min(MiniGame.score || 0, 500);
                    MiniGame.stop();
                    console.log(`🎮 Crediti bonus guadagnati: ${bonusCredits}`);
                }
                
                closeGame();
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const editUrl = new URL('edit_blog.html', window.location.href);
                editUrl.searchParams.set('blog_id', data.blog_id || fragmentId);
                editUrl.searchParams.set('vat', apiCredentials.vat);
                editUrl.searchParams.set('token', apiCredentials.token);
                editUrl.searchParams.set('owner', apiCredentials.owner);
                editUrl.searchParams.set('ragione_sociale', apiCredentials.ragione_sociale);
                editUrl.searchParams.set('lang', lang);
                if (bonusCredits > 0) editUrl.searchParams.set('bonus_credits', bonusCredits);
                
                window.location.href = editUrl.toString();

            } else {
                throw new Error(data.error || 'Unknown error');
            }

        } catch (error) {
            console.error(error);
            closeGame();
            alert(`Errore: ${error.message}`);
        }
    });

    function log(msg, target) {
        target = target || logArea;
        target.innerHTML += `<div class="terminal-line">${msg}</div>`;
        target.scrollTop = target.scrollHeight;
    }
});