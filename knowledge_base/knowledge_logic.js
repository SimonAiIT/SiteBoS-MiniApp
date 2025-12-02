'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURAZIONE E ELEMENTI DOM ---
    const WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/0ca76af1-8c02-47f4-a3a4-fd19ad495afe";
    
    // INIZIALIZZAZIONE TELEGRAM WEB APP
    const tg = window.Telegram.WebApp;
    try {
        tg.ready();
        tg.expand();
    } catch (e) {
        console.error("Telegram WebApp non disponibile.", e);
    }
    
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('mainContent');
    const kbContainer = document.getElementById('kb-container');
    const companyNameEl = document.getElementById('companyName');

    const params = new URLSearchParams(window.location.search);
    const apiCredentials = {
        vat: params.get('vat'),
        token: params.get('token'),
        owner: params.get('owner'),
        ragione_sociale: params.get('ragione_sociale')
    };

    // --- 2. INIZIALIZZAZIONE ---
    async function init() {
        if (!apiCredentials.vat || !apiCredentials.token) {
            showError("Parametri essenziali (vat, token) mancanti nell'URL.");
            return;
        }
        
        companyNameEl.textContent += (apiCredentials.ragione_sociale || 'N/D');
        await fetchKnowledgeList();
    }

    // --- 3. CHIAMATE API ---
    async function fetchKnowledgeList() {
        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'get_kb',
                    ...apiCredentials
                })
            });

            if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
            
            const data = await response.json();
            
            const fragments = data?.[0]?.Fragment || data?.Fragment;

            if (fragments) {
                renderKnowledgeList(fragments);
                loader.classList.add('hidden');
                mainContent.classList.remove('hidden');
            } else {
                showError("La risposta dell'API non ha il formato atteso.");
            }

        } catch (error) {
            showError(`Impossibile caricare la Knowledge Base: ${error.message}`);
        }
    }

    async function fetchFragmentDetails(fragmentId, cardElement) {
        if (cardElement.dataset.loaded === 'true') {
            cardElement.classList.toggle('open');
            return;
        }
        
        cardElement.classList.add('loading');

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'get_kb_details',
                    fragment_id: fragmentId,
                    ...apiCredentials
                })
            });

            if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
            
            const data = await response.json();
            const fragment = data?.[0]?.Fragment?.[0] || data?.Fragment?.[0];
            
            if (fragment) {
                if(tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
                renderFragmentDetails(fragment, cardElement);
                cardElement.dataset.loaded = 'true';
                cardElement.classList.add('open');
            } else {
                throw new Error("Dettaglio fragment non trovato.");
            }

        } catch (error) {
            alert(`Errore nel caricare il dettaglio: ${error.message}`);
            if(tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('error');
        } finally {
            cardElement.classList.remove('loading');
        }
    }

    // --- 4. RENDERING HTML ---
    function renderKnowledgeList(fragments) {
        if (!fragments || fragments.length === 0) {
            kbContainer.innerHTML = '<p class="note">Nessun elemento trovato nella Knowledge Base.</p>';
            return;
        }

        kbContainer.innerHTML = fragments.map(fragment => `
            <div class="kb-card" data-fragment-id="${fragment.fragment_id || fragment._id}">
                <div class="kb-header">
                    <span class="kb-title">${fragment.title}</span>
                    <i class="fas fa-chevron-down chevron"></i>
                </div>
                <div class="kb-body"></div>
            </div>
        `).join('');
    }

    function renderFragmentDetails(fragment, cardElement) {
        const body = cardElement.querySelector('.kb-body');
        if (!body) return;

        body.innerHTML = `
            <h3>Riepilogo</h3>
            <p class="summary">${fragment.summary}</p>

            <h3>Risposta Diretta</h3>
            <p class="answer-fragment">${fragment.answer_fragment}</p>

            <h3>Domande Utente Tipiche</h3>
            <ul class="utterance-list">
                ${fragment.user_utterances.map(u => `<li>${u}</li>`).join('')}
            </ul>

            <h3>Approfondimenti (Q&A)</h3>
            ${fragment.sections.map(section => `
                <div class="kb-section">
                    <p class="question">${section.question}</p>
                    <p class="answer">${section.answer}</p>
                    <blockquote class="analogy">${section.analogy}</blockquote>
                </div>
            `).join('')}
        `;
    }

    // --- 5. GESTIONE EVENTI ---
    kbContainer.addEventListener('click', (e) => {
        const header = e.target.closest('.kb-header');
        if (!header) return;

        const card = header.closest('.kb-card');
        const fragmentId = card.dataset.fragmentId;

        if (card.classList.contains('open') && card.dataset.loaded === 'true') {
             card.classList.remove('open');
        } else {
             fetchFragmentDetails(fragmentId, card);
        }
    });

    function showError(message) {
        loader.innerHTML = `<p style="color: #ff6b6b; padding: 20px; text-align: center;">${message}</p>`;
    }

    init();
});
