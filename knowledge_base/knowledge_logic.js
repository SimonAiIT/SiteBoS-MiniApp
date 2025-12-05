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
    const backToManagerBtn = document.getElementById('backToManagerBtn');

    const params = new URLSearchParams(window.location.search);
    const apiCredentials = {
        vat: params.get('vat'),
        token: params.get('token'),
        owner: params.get('owner'),
        ragione_sociale: params.get('ragione_sociale')
    };

    let knowledgeData = [];

    // ⬅️ GESTIONE BOTTONE TORNA INDIETRO (CORRETTO: dashboard.html)
    if (backToManagerBtn) {
        backToManagerBtn.addEventListener('click', () => {
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            
            // ✅ Costruisci URL DASHBOARD mantenendo i parametri
            const dashboardUrl = new URL('../dashboard.html', window.location.href);
            const currentParams = new URLSearchParams(window.location.search);
            currentParams.forEach((value, key) => {
                dashboardUrl.searchParams.set(key, value);
            });
            
            window.location.href = dashboardUrl.toString();
        });
    }

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
                tg?.HapticFeedback?.impactOccurred('light');
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
    
    // ✅ CHECK: Se blog post già generato
    const hasGeneratedBlog = fragment.content_generated === true;
    
    const actionsBarStyle = `
        display: flex; 
        justify-content: flex-end; 
        margin-bottom: 15px; 
        padding-bottom: 10px; 
        border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    `;

    const btnStyle = (isEdit) => `
        background: ${isEdit ? '#4cd964' : '#5B6FED'};
        color: white; 
        border: none; 
        padding: 10px 18px; 
        border-radius: 12px; 
        cursor: pointer; 
        font-size: 0.9rem; 
        font-weight: 600; 
        display: flex; 
        align-items: center; 
        gap: 8px; 
        box-shadow: 0 4px 12px ${isEdit ? 'rgba(76, 217, 100, 0.3)' : 'rgba(91, 111, 237, 0.3)'};
        transition: transform 0.2s ease, background 0.2s, box-shadow 0.2s;
    `;

    const btnHoverStyle = (isEdit) => `
        background: ${isEdit ? '#3cb54a' : '#4a5ecf'};
        transform: translateY(-2px);
        box-shadow: 0 6px 16px ${isEdit ? 'rgba(76, 217, 100, 0.4)' : 'rgba(91, 111, 237, 0.4)'};
    `;

    // ✅ Bottone condizionale
    const buttonHTML = hasGeneratedBlog 
        ? `<button 
                class="btn-blog-edit" 
                data-id="${id}" 
                style="${btnStyle(true)}" 
                onmouseover="this.style.cssText='${btnStyle(true)}${btnHoverStyle(true)}'" 
                onmouseout="this.style.cssText='${btnStyle(true)}'" 
                onmousedown="this.style.transform='scale(0.96)'" 
                onmouseup="this.style.transform='scale(1)'">
                <i class="fas fa-edit"></i> Modifica Blog Post
            </button>`
        : `<button 
                class="btn-blog-deploy" 
                data-id="${id}" 
                style="${btnStyle(false)}" 
                onmouseover="this.style.cssText='${btnStyle(false)}${btnHoverStyle(false)}'" 
                onmouseout="this.style.cssText='${btnStyle(false)}'" 
                onmousedown="this.style.transform='scale(0.96)'" 
                onmouseup="this.style.transform='scale(1)'">
                <i class="fas fa-magic"></i> Genera Blog Post
            </button>`;

    body.innerHTML = `
        <div class="actions-bar" style="${actionsBarStyle}">
            ${buttonHTML}
        </div>

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

    // ✅ Event listener per bottone GENERA
    const blogDeployBtn = body.querySelector('.btn-blog-deploy');
    if (blogDeployBtn) {
        blogDeployBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }
            
            goToDeployBlog(id);
        });
    }

    // ✅ Event listener per bottone MODIFICA
    const blogEditBtn = body.querySelector('.btn-blog-edit');
    if (blogEditBtn) {
        blogEditBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }
            
            goToEditBlog(id);
        });
    }
}

function goToDeployBlog(fragmentId) {
    const targetUrl = new URL('deployblog.html', window.location.href);
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.forEach((value, key) => {
        targetUrl.searchParams.set(key, value);
    });
    targetUrl.searchParams.set('fragment_id', fragmentId);
    window.location.href = targetUrl.toString();
}

function goToEditBlog(fragmentId) {
    const targetUrl = new URL('edit_blog.html', window.location.href);
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.forEach((value, key) => {
        targetUrl.searchParams.set(key, value);
    });
    targetUrl.searchParams.set('blog_id', fragmentId);
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
