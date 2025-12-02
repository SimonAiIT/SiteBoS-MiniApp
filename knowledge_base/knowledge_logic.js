'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURAZIONE ---
    const WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/0ca76af1-8c02-47f4-a3a4-fd19ad495afe";
    
    const tg = window.Telegram.WebApp;
    try {
        if (tg && tg.ready) {
            tg.ready();
            tg.expand();
        }
    } catch (e) {
        console.warn("L'ambiente Telegram WebApp non è presente o ha causato un errore.", e);
    }
    
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('mainContent');
    const kbContainer = document.getElementById('kb-container');
    const companyNameEl = document.getElementById('companyName');
    const saveBtn = document.getElementById('saveBtn');

    const params = new URLSearchParams(window.location.search);
    const apiCredentials = {
        vat: params.get('vat'),
        token: params.get('token'),
        owner: params.get('owner'),
        ragione_sociale: params.get('ragione_sociale')
    };

    let knowledgeData = [];

    // --- 2. INIZIALIZZAZIONE ---
    async function init() {
        if (!apiCredentials.vat || !apiCredentials.token) {
            showError("Parametri essenziali (vat, token) mancanti.");
            return;
        }
        companyNameEl.textContent += (apiCredentials.ragione_sociale || 'N/D');
        await fetchKnowledgeList();
    }

    // --- 3. CHIAMATE API ---
    async function fetchKnowledgeList() {
        const response = await makeApiCall({ action: 'get_kb' });
        if (response) {
            renderKnowledgeList(response);
            loader.classList.add('hidden');
            mainContent.classList.remove('hidden');
        }
    }

    async function fetchFragmentDetails(fragmentId, cardElement) {
        if (cardElement.dataset.loaded === 'true') {
            cardElement.classList.toggle('open');
            return;
        }
        
        cardElement.classList.add('loading');
        const response = await makeApiCall({ action: 'get_kb_details', fragment_id: fragmentId });
        
        cardElement.classList.remove('loading');
        if (response) {
            const fragment = response.Fragment || response; 
            if (fragment) {
                tg?.HapticFeedback?.impactOccurred('light'); // Sicuro: non si rompe se tg non esiste
                knowledgeData.push(fragment);
                renderFragmentDetails(fragment, cardElement);
                cardElement.dataset.loaded = 'true';
                cardElement.classList.add('open');
            }
        }
    }

    async function handleSave() {
        tg?.HapticFeedback?.impactOccurred('medium');
        
        // Feedback visivo universale (funziona sempre)
        saveBtn.classList.add('saving');
        saveBtn.disabled = true;

        const payload = { fragments: knowledgeData };
        const response = await makeApiCall({ action: 'save_kb', payload });

        // Rimuovi feedback universale
        saveBtn.classList.remove('saving');
        saveBtn.disabled = false;
        
        if(response) {
            // Feedback specifico di Telegram (se disponibile), altrimenti un alert
            if (tg && tg.showPopup) {
                tg.showPopup({ message: "✅ Salvataggio completato!" });
            } else {
                alert("Salvataggio completato!");
            }
        } else {
            if (tg && tg.showPopup) {
                tg.showPopup({ message: "❌ Errore durante il salvataggio." });
            } else {
                alert("Errore durante il salvataggio.");
            }
        }
    }

    async function makeApiCall(body) {
        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...body, ...apiCredentials })
            });
            if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
            return await response.json();
        } catch (error) {
            showError(`Errore di rete: ${error.message}`);
            return null;
        }
    }

    // --- 4. RENDERING HTML EDITABILE ---
    function renderKnowledgeList(fragments) {
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
    const id = fragment.fragment_id || fragment._id;
    
    // Stili inline per la barra delle azioni per renderla pulita e visibile in alto
    const actionsBarStyle = `
        display: flex; 
        justify-content: flex-end; 
        margin-bottom: 15px; 
        padding-bottom: 10px; 
        border-bottom: 1px solid #eee;
    `;

    const btnStyle = `
        background: linear-gradient(135deg, #6c5ce7, #a29bfe); 
        color: white; 
        border: none; 
        padding: 8px 15px; 
        border-radius: 6px; 
        cursor: pointer; 
        font-size: 0.85rem; 
        font-weight: 600; 
        display: flex; 
        align-items: center; 
        gap: 6px; 
        box-shadow: 0 2px 5px rgba(108, 92, 231, 0.2);
        transition: transform 0.1s ease;
    `;

    body.innerHTML = `
        <!-- BARRA AZIONI IN ALTO -->
        <div class="actions-bar" style="${actionsBarStyle}">
            <button class="btn-blog-deploy" data-id="${id}" style="${btnStyle}" onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform='scale(1)'">
                <i class="fas fa-magic"></i> Genera Blog Post
            </button>
        </div>

        <!-- CONTENUTO ESISTENTE -->
        <h3>Titolo</h3>
        <input type="text" class="editable-input" data-id="${id}" data-field="title" value="${fragment.title}">
        <h3>Riepilogo</h3>
        <textarea class="editable-textarea" data-id="${id}" data-field="summary" rows="3">${fragment.summary}</textarea>
        <h3>Risposta Diretta</h3>
        <textarea class="editable-textarea" data-id="${id}" data-field="answer_fragment" rows="5">${fragment.answer_fragment}</textarea>
        <h3>Domande Utente (una per riga)</h3>
        <textarea class="editable-textarea" data-id="${id}" data-field="user_utterances" rows="4">${fragment.user_utterances.join('\n')}</textarea>
        <h3>Approfondimenti (Q&A)</h3>
        <div class="qa-container">
        ${fragment.sections.map((section, index) => `
            <div class="kb-section">
                <input type="text" class="editable-input" placeholder="Domanda" data-id="${id}" data-field="sections.${index}.question" value="${section.question}">
                <textarea class="editable-textarea" placeholder="Risposta" data-id="${id}" data-field="sections.${index}.answer" rows="3">${section.answer}</textarea>
                <textarea class="editable-textarea analogy" placeholder="Analogia" data-id="${id}" data-field="sections.${index}.analogy" rows="2">${section.analogy}</textarea>
            </div>
        `).join('')}
        </div>
    `;

    // Gestione click del pulsante Blog
    const blogBtn = body.querySelector('.btn-blog-deploy');
    if (blogBtn) {
        blogBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Importante: evita che il click si propaghi chiudendo l'accordion
            
            // Feedback aptico leggero se su Telegram
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }
            
            goToDeployBlog(id);
        });
    }
}

function goToDeployBlog(fragmentId) {
    // Crea l'URL per la nuova pagina
    const targetUrl = new URL('deployblog.html', window.location.href);
    
    // Prende tutti i parametri attuali dell'URL (vat, token, owner, ragione_sociale)
    // e li copia nel nuovo URL per non perdere l'autenticazione
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.forEach((value, key) => {
        targetUrl.searchParams.set(key, value);
    });

    // Aggiunge l'ID specifico del frammento che vogliamo processare
    targetUrl.searchParams.set('fragment_id', fragmentId);
    
    // Reindirizza l'utente
    window.location.href = targetUrl.toString();
}


    
    // --- 5. GESTIONE EVENTI ---
    kbContainer.addEventListener('click', (e) => {
        const header = e.target.closest('.kb-header');
        if (header) {
            const card = header.closest('.kb-card');
            fetchFragmentDetails(card.dataset.fragmentId, card);
        }
    });

    kbContainer.addEventListener('input', (e) => {
        const target = e.target;
        const id = target.dataset.id;
        const fieldPath = target.dataset.field;
        if (!id || !fieldPath) return;

        const fragment = knowledgeData.find(f => (f.fragment_id || f._id) === id);
        if (!fragment) return;

        const pathParts = fieldPath.split('.');
        let current = fragment;
        for (let i = 0; i < pathParts.length - 1; i++) {
            current = current[pathParts[i]];
        }
        
        if (fieldPath === 'user_utterances') {
            current[pathParts[pathParts.length - 1]] = target.value.split('\n').filter(Boolean);
        } else {
            current[pathParts[pathParts.length - 1]] = target.value;
        }
    });

    saveBtn.addEventListener('click', handleSave);

    function showError(message) {
        loader.innerHTML = `<p style="color: #ff6b6b; padding: 20px; text-align: center;">${message}</p>`;
    }

    init();
});
