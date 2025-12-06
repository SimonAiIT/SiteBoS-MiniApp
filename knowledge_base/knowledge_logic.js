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

    // --- 2. INIZIALIZZAZIONE ---
    async function init() {
        if (!apiCredentials.vat || !apiCredentials.token) {
            showError("Parametri essenziali (vat, token) mancanti.");
            return;
        }
        companyNameEl.textContent += (apiCredentials.ragione_sociale || 'N/D');
        await loadKnowledgeBase();
    }

    // --- 3. CARICAMENTO KNOWLEDGE BASE ---
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
            
            console.log('📦 RAW RESPONSE:', JSON.stringify(data, null, 2));
            console.log('📦 Type:', Array.isArray(data) ? 'Array' : typeof data);
            console.log('📦 Length/Keys:', Array.isArray(data) ? data.length : Object.keys(data));
            
            // 🔧 PARSING ULTRA-ROBUSTO
            let rawData = data;
            
            // Se è array, prendi primo elemento
            if (Array.isArray(data)) {
                console.log('✅ Data is array, taking first element');
                rawData = data[0] || {};
            }
            
            // Estrai fragments (prova tutti i possibili nomi)
            let fragments = rawData.fragment || rawData.Fragment || rawData.fragments || rawData.Fragments || [];
            
            // Se fragments non è array, wrappa
            if (!Array.isArray(fragments)) {
                console.log('⚠️ Fragments not array, wrapping:', fragments);
                fragments = fragments ? [fragments] : [];
            }
            
            allFragments = fragments;
            console.log('✅ Fragments extracted:', allFragments.length);
            if (allFragments.length > 0) {
                console.log('📄 First fragment:', allFragments[0]);
            }
            
            // Estrai catalog
            catalogData = rawData.catalog || rawData.Catalog || null;
            console.log('✅ Catalog:', catalogData ? `${catalogData.categories?.length || 0} categories` : 'NULL');
            
            renderKnowledgeByCategory();
            
            loader.classList.add('hidden');
            appContent.classList.remove('hidden');
            
        } catch (error) {
            console.error('❌ Error loading knowledge base:', error);
            showError(`Errore caricamento: ${error.message}`);
        }
    }

    // --- 4. RENDERING PER CATEGORIA ---
    function renderKnowledgeByCategory() {
        console.log('🎨 renderKnowledgeByCategory called');
        console.log('   - Fragments:', allFragments.length);
        console.log('   - Catalog:', catalogData ? 'present' : 'NULL');
        
        if (!allFragments || allFragments.length === 0) {
            console.warn('⚠️ No fragments to display');
            blogList.innerHTML = '';
            emptyState.classList.remove('hidden');
            updateStats(0, 0);
            return;
        }

        emptyState.classList.add('hidden');

        // Se non c'è catalog, usa fallback
        if (!catalogData || !catalogData.categories || catalogData.categories.length === 0) {
            console.warn('⚠️ No catalog, using fallback view');
            renderFallbackView();
            return;
        }

        console.log('🏗️ Building categorized view...');

        // Genera HTML per categorie
        const categoriesHTML = catalogData.categories.map((category, catIndex) => {
            console.log(`  Category ${catIndex}: ${category.short_name}`);
            
            const categoryFragments = [];
            
            if (category.subcategories && Array.isArray(category.subcategories)) {
                category.subcategories.forEach((subcat, subIndex) => {
                    const matchingFragment = allFragments.find(frag => {
                        const fragId = frag.fragment_id || frag._id || '';
                        const match = fragId.includes(subcat.callback_data);
                        if (match) {
                            console.log(`    ✅ Match: ${fragId} <-> ${subcat.callback_data}`);
                        }
                        return match;
                    });
                    
                    if (matchingFragment) {
                        categoryFragments.push({
                            fragment: matchingFragment,
                            subcategory: subcat
                        });
                    }
                });
            }

            if (categoryFragments.length === 0) {
                console.log(`    ⏭️ Skip ${category.short_name} (empty)`);
                return '';
            }

            console.log(`    ✅ ${category.short_name}: ${categoryFragments.length} fragments`);

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
            console.warn('⚠️ No categories with fragments, fallback');
            renderFallbackView();
            return;
        }

        console.log('✅ Rendering categories HTML');
        blogList.innerHTML = categoriesHTML;

        const draftCount = allFragments.filter(f => !f.content_generated).length;
        const publishedCount = allFragments.filter(f => f.content_generated === true).length;
        updateStats(draftCount, publishedCount);
    }

    // --- 5. FALLBACK VIEW ---
    function renderFallbackView() {
        console.log('📋 Rendering fallback view');
        
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

    // --- 6. RENDER FRAGMENT CARD ---
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
            <div class="blog-item ${statusClass}">
                <div class="blog-info">
                    <div class="blog-meta">${statusIcon} ${statusText}${serviceName ? ` • ${serviceName}` : ''}</div>
                    <div class="blog-title">${escapeHtml(title)}</div>
                    <div class="blog-desc">${escapeHtml(summary)}</div>
                </div>
                <div class="blog-actions-group">
                    ${hasGenerated 
                        ? `<button class="btn-action btn-edit" onclick="goToEditBlog('${fragId}')">
                            <i class="fas fa-edit"></i>
                            <span>Modifica</span>
                           </button>` 
                        : `<button class="btn-action btn-create" onclick="goToDeployBlog('${fragId}')">
                            <i class="fas fa-magic"></i>
                            <span>Genera</span>
                           </button>`
                    }
                </div>
            </div>
        `;
    }

    // --- 7. HELPERS ---
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

    // --- 8. TOGGLE ---
    window.toggleCategory = function(headerElement) {
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        const card = headerElement.closest('.cat-card');
        card.classList.toggle('open');
    }

    // --- 9. NAVIGAZIONE ---
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