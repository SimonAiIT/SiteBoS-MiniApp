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
        console.warn("L'ambiente Telegram WebApp non è presente.", e);
    }
    
    const loader = document.getElementById('loader');
    const appContent = document.getElementById('app-content');
    const blogList = document.getElementById('blog-list');
    const emptyState = document.getElementById('empty-state');
    const companyNameEl = document.getElementById('companyName');

    const params = new URLSearchParams(window.location.search);
    const apiCredentials = {
        vat: params.get('vat'),
        token: params.get('token'),
        owner: params.get('owner'),
        ragione_sociale: params.get('ragione_sociale'),
        lang: params.get('lang') || 'it'
    };

    let catalogData = null;
    let allFragments = [];
    let knowledgeData = []; // Per salvataggio

    // --- 2. INIZIALIZZAZIONE ---
    async function init() {
        if (!apiCredentials.vat || !apiCredentials.token) {
            showError("Parametri essenziali (vat, token) mancanti.");
            return;
        }
        companyNameEl.textContent += (apiCredentials.ragione_sociale || 'N/D');
        await loadKnowledgeBase();
    }

    // --- 3. CARICAMENTO LISTA ---
    window.loadKnowledgeBase = async function(forceReload = false) {
        if (forceReload && tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
        
        loader.classList.remove('hidden');
        appContent.classList.add('hidden');
        
        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'get_kb',
                    ...apiCredentials
                })
            });

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            const data = await response.json();
            
            console.log('📦 RAW RESPONSE:', data);
            
            let rawData = data;
            if (Array.isArray(data)) {
                rawData = data[0] || {};
            }
            
            let fragments = rawData.fragment || rawData.Fragment || rawData.fragments || rawData.Fragments || [];
            if (!Array.isArray(fragments)) {
                fragments = fragments ? [fragments] : [];
            }
            
            allFragments = fragments;
            catalogData = rawData.catalog || rawData.Catalog || null;
            
            console.log('✅ Fragments:', allFragments.length);
            console.log('✅ Catalog:', catalogData ? 'present' : 'NULL');
            
            renderKnowledgeByCategory();
            
            loader.classList.add('hidden');
            appContent.classList.remove('hidden');
            
        } catch (error) {
            console.error('❌ Error:', error);
            showError(`Errore caricamento: ${error.message}`);
        }
    }

    // --- 4. RENDERING CATEGORIE ---
    function renderKnowledgeByCategory() {
        if (!allFragments || allFragments.length === 0) {
            blogList.innerHTML = '';
            emptyState.classList.remove('hidden');
            updateStats(0, 0);
            return;
        }

        emptyState.classList.add('hidden');

        if (!catalogData || !catalogData.categories || catalogData.categories.length === 0) {
            renderFallbackView();
            return;
        }

        const categoriesHTML = catalogData.categories.map(category => {
            const categoryFragments = [];
            
            if (category.subcategories && Array.isArray(category.subcategories)) {
                category.subcategories.forEach(subcat => {
                    const matchingFragment = allFragments.find(frag => {
                        const fragId = frag.fragment_id || frag._id || '';
                        return fragId.includes(subcat.callback_data);
                    });
                    
                    if (matchingFragment) {
                        categoryFragments.push({
                            fragment: matchingFragment,
                            subcategory: subcat
                        });
                    }
                });
            }

            if (categoryFragments.length === 0) return '';

            const count = categoryFragments.length;
            const fragmentsHTML = categoryFragments.map(item => 
                renderFragmentCard(item.fragment, item.subcategory)
            ).join('');

            return `
                <div class="cat-card">
                    <div class="cat-header" onclick="toggleCategory(this)">
                        <div class="cat-title">
                            ${category.short_name}
                            <span class="cat-badge">${count}</span>
                        </div>
                        <i class="fas fa-chevron-down chevron"></i>
                    </div>
                    <div class="cat-body">
                        ${fragmentsHTML}
                    </div>
                </div>
            `;
        }).filter(html => html !== '').join('');

        if (categoriesHTML === '') {
            renderFallbackView();
            return;
        }

        blogList.innerHTML = categoriesHTML;

        const draftCount = allFragments.filter(f => !f.content_generated).length;
        const publishedCount = allFragments.filter(f => f.content_generated === true).length;
        updateStats(draftCount, publishedCount);
    }

    // --- 5. FALLBACK VIEW ---
    function renderFallbackView() {
        const fragmentsHTML = allFragments.map(frag => 
            renderFragmentCard(frag, null)
        ).join('');

        blogList.innerHTML = `
            <div class="cat-card open">
                <div class="cat-header">
                    <div class="cat-title">
                        📚 Tutti i Contenuti
                        <span class="cat-badge">${allFragments.length}</span>
                    </div>
                </div>
                <div class="cat-body">
                    ${fragmentsHTML}
                </div>
            </div>
        `;

        const draftCount = allFragments.filter(f => !f.content_generated).length;
        const publishedCount = allFragments.filter(f => f.content_generated === true).length;
        updateStats(draftCount, publishedCount);
    }

    // --- 6. RENDER FRAGMENT CARD (COLLAPSED) ---
    function renderFragmentCard(fragment, subcategory) {
        const fragId = fragment.fragment_id || fragment._id || 'unknown';
        const title = fragment.title || 'Senza titolo';
        const summary = fragment.summary || '';
        const hasGenerated = fragment.content_generated === true;

        const statusClass = hasGenerated ? 'status-published' : 'status-draft';
        const statusIcon = hasGenerated ? '✅' : '📝';
        const statusText = hasGenerated ? 'Blog Generato' : 'Da Generare';
        
        const serviceName = subcategory ? subcategory.short_name : '';

        return `
            <div class="blog-item ${statusClass}" data-fragment-id="${fragId}" data-loaded="false">
                <div class="blog-info" onclick="expandFragment('${fragId}', this)" style="cursor: pointer;">
                    <div class="blog-meta">${statusIcon} ${statusText}${serviceName ? ` • ${serviceName}` : ''}</div>
                    <div class="blog-title">${escapeHtml(title)}</div>
                    <div class="blog-desc">${escapeHtml(summary)}</div>
                </div>
                <div class="blog-details" style="display: none; padding: 15px; border-top: 1px solid var(--glass-border);"></div>
            </div>
        `;
    }

    // --- 7. ESPANDI FRAGMENT E CARICA DETTAGLI ---
    window.expandFragment = async function(fragmentId, clickedElement) {
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        
        const cardElement = clickedElement.closest('.blog-item');
        const detailsContainer = cardElement.querySelector('.blog-details');
        
        // Se già caricato, toggle
        if (cardElement.dataset.loaded === 'true') {
            const isVisible = detailsContainer.style.display !== 'none';
            detailsContainer.style.display = isVisible ? 'none' : 'block';
            return;
        }
        
        // Carica dettagli
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
            
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            const data = await response.json();
            const fragment = data.Fragment || data.fragment || data;
            
            console.log('📄 Fragment details loaded:', fragment);
            
            // Aggiungi a knowledgeData per salvataggio
            knowledgeData.push(fragment);
            
            // Render dettagli
            renderFragmentDetails(fragment, detailsContainer);
            
            cardElement.dataset.loaded = 'true';
            detailsContainer.style.display = 'block';
            
        } catch (error) {
            console.error('❌ Error loading details:', error);
            alert(`Errore caricamento dettagli: ${error.message}`);
        } finally {
            cardElement.classList.remove('loading');
        }
    }

    // --- 8. RENDER DETTAGLI EDITABILI ---
    function renderFragmentDetails(fragment, container) {
        const id = fragment.fragment_id || fragment._id;
        const hasGenerated = fragment.content_generated === true;
        
        const btnStyle = (isEdit) => `
            background: ${isEdit ? '#4cd964' : '#5B6FED'};
            color: white; border: none; padding: 10px 18px; border-radius: 12px; cursor: pointer;
            font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 8px;
            box-shadow: 0 4px 12px ${isEdit ? 'rgba(76, 217, 100, 0.3)' : 'rgba(91, 111, 237, 0.3)'};
            transition: transform 0.2s;
        `;
        
        const buttonHTML = hasGenerated 
            ? `<button onclick="goToEditBlog('${id}')" style="${btnStyle(true)}">
                <i class="fas fa-edit"></i> Modifica Blog Post
               </button>`
            : `<button onclick="goToDeployBlog('${id}')" style="${btnStyle(false)}">
                <i class="fas fa-magic"></i> Genera Blog Post
               </button>`;
        
        container.innerHTML = `
            <div style="display: flex; justify-content: flex-end; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.15);">
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
                    <textarea class="editable-textarea analogy" placeholder="Analogia" data-id="${id}" data-field="sections.${index}.analogy" rows="2">${section.analogy || ''}</textarea>
                </div>
            `).join('')}
            </div>
        `;
        
        // Attach input listeners
        container.querySelectorAll('.editable-input, .editable-textarea').forEach(input => {
            input.addEventListener('input', handleInputChange);
        });
    }

    // --- 9. HANDLE INPUT CHANGE ---
    function handleInputChange(e) {
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
    }

    // --- 10. SALVATAGGIO ---
    window.handleSave = async function() {
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
        
        // TODO: Implementa chiamata save_kb
        const payload = { fragments: knowledgeData };
        console.log('💾 Saving:', payload);
        
        if (tg?.showPopup) {
            tg.showPopup({ message: '✅ Salvataggio completato!' });
        } else {
            alert('Salvataggio completato!');
        }
    }

    // --- 11. HELPERS ---
    function updateStats(draft, published) {
        document.getElementById('count-draft').textContent = draft;
        document.getElementById('count-published').textContent = published;
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    window.toggleCategory = function(headerElement) {
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        const card = headerElement.closest('.cat-card');
        card.classList.toggle('open');
    }

    // --- 12. NAVIGAZIONE ---
    window.goToNewArticle = function() {
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
        const targetUrl = new URL('deployblog.html', window.location.href);
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.forEach((value, key) => targetUrl.searchParams.set(key, value));
        window.location.href = targetUrl.toString();
    }

    window.goToDeployBlog = function(fragmentId) {
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        const targetUrl = new URL('deployblog.html', window.location.href);
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.forEach((value, key) => targetUrl.searchParams.set(key, value));
        targetUrl.searchParams.set('fragment_id', fragmentId);
        window.location.href = targetUrl.toString();
    }

    window.goToEditBlog = function(fragmentId) {
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        const targetUrl = new URL('edit_blog.html', window.location.href);
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.forEach((value, key) => targetUrl.searchParams.set(key, value));
        targetUrl.searchParams.set('blog_id', fragmentId);
        window.location.href = targetUrl.toString();
    }

    window.goBack = function() {
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        const dashboardUrl = new URL('../dashboard.html', window.location.href);
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.forEach((value, key) => dashboardUrl.searchParams.set(key, value));
        window.location.href = dashboardUrl.toString();
    }

    window.loadBlogs = window.loadKnowledgeBase;

    function showError(message) {
        loader.innerHTML = `<p style="color: #ff6b6b; padding: 20px; text-align: center;">${message}</p>`;
    }

    init();
});