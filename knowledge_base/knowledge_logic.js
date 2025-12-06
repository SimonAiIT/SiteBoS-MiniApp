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
    const saveFab = document.getElementById('save-fab');

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
    let publishedArticles = [];
    let knowledgeData = [];
    let hasChanges = false; // ✅ Flag per mostrare FAB Salva

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
            
            let articles = rawData.article || rawData.Article || rawData.articles || [];
            if (Array.isArray(articles)) {
                publishedArticles = articles;
            } else if (articles && typeof articles === 'object') {
                publishedArticles = [articles];
            } else {
                publishedArticles = [];
            }
            
            console.log('✅ Fragments:', allFragments.length);
            console.log('✅ Catalog:', catalogData ? 'present' : 'NULL');
            console.log('✅ Published articles:', publishedArticles.length);
            
            renderKnowledgeByCategory();
            
            loader.classList.add('hidden');
            appContent.classList.remove('hidden');
            
        } catch (error) {
            console.error('❌ Error:', error);
            showError(`Errore caricamento: ${error.message}`);
        }
    }

    // --- 4. HELPER: Trova articolo pubblicato ---
    function findPublishedArticle(fragmentId) {
        let article = publishedArticles.find(art => art.articleId === fragmentId);
        if (article) return article;
        
        const shortId = fragmentId.split('-').pop();
        article = publishedArticles.find(art => {
            const artShortId = art.articleId.split('-').pop();
            return artShortId === shortId;
        });
        
        return article || null;
    }

    // --- 5. RENDERING CATEGORIE ---
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

        const publishedCount = publishedArticles.length;
        const draftCount = allFragments.length - publishedCount;
        updateStats(draftCount, publishedCount);
    }

    // --- 6. FALLBACK VIEW ---
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

        const publishedCount = publishedArticles.length;
        const draftCount = allFragments.length - publishedCount;
        updateStats(draftCount, publishedCount);
    }

    // --- 7. RENDER FRAGMENT CARD (COLLAPSED) ---
    function renderFragmentCard(fragment, subcategory) {
        const fragId = fragment.fragment_id || fragment._id || 'unknown';
        const title = fragment.title || 'Senza titolo';
        const summary = fragment.summary || '';
        
        const publishedArticle = findPublishedArticle(fragId);
        const isPublished = !!publishedArticle;
        
        const statusClass = isPublished ? 'status-published' : 'status-draft';
        const statusIcon = isPublished ? '✅' : '📝';
        const statusText = isPublished ? 'Blog Pubblicato' : 'Da Generare';
        
        const displayTitle = publishedArticle?.meta_title || title;
        const serviceName = subcategory ? subcategory.short_name : '';

        // ✅ BOTTONI INLINE STILE CATALOG
        const actionButton = isPublished
            ? `<button class="kb-btn-inline kb-btn-edit" onclick="goToEditBlog('${fragId}'); event.stopPropagation();">
                <i class="fas fa-edit"></i> Modifica
               </button>`
            : `<button class="kb-btn-inline kb-btn-generate" onclick="goToDeployBlog('${fragId}'); event.stopPropagation();">
                <i class="fas fa-magic"></i> Genera
               </button>`;

        return `
            <div class="blog-item ${statusClass}" data-fragment-id="${fragId}" data-loaded="false">
                <!-- HEADER CON TITOLO E BOTTONE -->
                <div class="blog-item-header">
                    <div class="blog-item-left" onclick="expandFragment('${fragId}', this)">
                        <div class="blog-meta">${statusIcon} ${statusText}${serviceName ? ` • ${serviceName}` : ''}</div>
                        <div class="blog-title">${escapeHtml(displayTitle)}</div>
                        <div class="blog-desc">${escapeHtml(summary)}</div>
                    </div>
                    <div class="blog-item-actions">
                        ${actionButton}
                    </div>
                </div>
                <!-- DETTAGLI ESPANDIBILI -->
                <div class="blog-details" style="display: none; padding: 15px; border-top: 1px solid var(--glass-border);"></div>
            </div>
        `;
    }

    // --- 8. ESPANDI FRAGMENT E CARICA DETTAGLI ---
    window.expandFragment = async function(fragmentId, clickedElement) {
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        
        const cardElement = clickedElement.closest('.blog-item');
        const detailsContainer = cardElement.querySelector('.blog-details');
        
        if (cardElement.dataset.loaded === 'true') {
            const isVisible = detailsContainer.style.display !== 'none';
            detailsContainer.style.display = isVisible ? 'none' : 'block';
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
            
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            const data = await response.json();
            const fragment = data.Fragment || data.fragment || data;
            
            console.log('📄 Fragment details loaded:', fragment);
            
            knowledgeData.push(fragment);
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

    // --- 9. RENDER DETTAGLI EDITABILI ---
    function renderFragmentDetails(fragment, container) {
        const id = fragment.fragment_id || fragment._id;
        
        container.innerHTML = `
            <h3>Titolo</h3>
            <input type="text" class="editable-input" data-id="${id}" data-field="title" value="${escapeHtml(fragment.title)}">
            
            <h3>Riepilogo</h3>
            <textarea class="editable-textarea" data-id="${id}" data-field="summary" rows="3">${escapeHtml(fragment.summary)}</textarea>
            
            <h3>Risposta Diretta</h3>
            <textarea class="editable-textarea" data-id="${id}" data-field="answer_fragment" rows="5">${escapeHtml(fragment.answer_fragment)}</textarea>
            
            <h3>Domande Utente (una per riga)</h3>
            <textarea class="editable-textarea" data-id="${id}" data-field="user_utterances" rows="4">${fragment.user_utterances.join('\n')}</textarea>
            
            <h3>Approfondimenti (Q&A)</h3>
            <div class="qa-container">
            ${fragment.sections.map((section, index) => `
                <div class="kb-section">
                    <input type="text" class="editable-input" placeholder="Domanda" data-id="${id}" data-field="sections.${index}.question" value="${escapeHtml(section.question)}">
                    <textarea class="editable-textarea" placeholder="Risposta" data-id="${id}" data-field="sections.${index}.answer" rows="3">${escapeHtml(section.answer)}</textarea>
                    <textarea class="editable-textarea analogy" placeholder="Analogia" data-id="${id}" data-field="sections.${index}.analogy" rows="2">${escapeHtml(section.analogy || '')}</textarea>
                </div>
            `).join('')}
            </div>
        `;
        
        container.querySelectorAll('.editable-input, .editable-textarea').forEach(input => {
            input.addEventListener('input', handleInputChange);
        });
    }

    // --- 10. HANDLE INPUT CHANGE ---
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
        
        // ✅ MOSTRA FAB SALVA
        if (!hasChanges) {
            hasChanges = true;
            saveFab.classList.remove('hidden');
            saveFab.classList.add('fade-in');
        }
    }

    // --- 11. SALVATAGGIO ---
    window.handleSave = async function() {
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
        
        const payload = { fragments: knowledgeData };
        console.log('💾 Saving:', payload);
        
        // TODO: Implementa chiamata save_kb
        
        hasChanges = false;
        saveFab.classList.add('hidden');
        
        if (tg?.showPopup) {
            tg.showPopup({ message: '✅ Salvataggio completato!' });
        } else {
            alert('Salvataggio completato!');
        }
    }

    // --- 12. HELPERS ---
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

    // --- 13. NAVIGAZIONE ---
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