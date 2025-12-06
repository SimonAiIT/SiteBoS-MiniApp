'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURAZIONE ---
    const WEBHOOK_URL = "https://trinai.api.workflow.dcmake.it/webhook/914bd78e-8a41-46d7-8935-7eb73cbbae66"; // Webhook blog
    
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

    let allBlogs = [];

    // --- 2. INIZIALIZZAZIONE ---
    async function init() {
        if (!apiCredentials.vat || !apiCredentials.token) {
            showError("Parametri essenziali (vat, token) mancanti.");
            return;
        }
        companyNameEl.textContent += (apiCredentials.ragione_sociale || 'N/D');
        await loadBlogs();
    }

    // --- 3. CARICAMENTO BLOG ---
    window.loadBlogs = async function(forceReload = false) {
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
                    action: 'list_blogs',
                    vat_number: apiCredentials.vat,
                    token: apiCredentials.token,
                    chat_id: apiCredentials.owner,
                    lang: apiCredentials.lang
                })
            });

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            const data = await response.json();
            
            console.log('📦 Blog data received:', data);
            
            // Parsing risposta (potrebbe essere array o oggetto con blogs)
            allBlogs = Array.isArray(data) ? data : (data.blogs || []);
            
            renderBlogsByCategory();
            
            loader.classList.add('hidden');
            appContent.classList.remove('hidden');
            
        } catch (error) {
            console.error('❌ Error loading blogs:', error);
            showError(`Errore caricamento: ${error.message}`);
        }
    }

    // --- 4. RENDERING PER CATEGORIA ---
    function renderBlogsByCategory() {
        if (!allBlogs || allBlogs.length === 0) {
            blogList.innerHTML = '';
            emptyState.classList.remove('hidden');
            updateStats(0, 0);
            return;
        }

        emptyState.classList.add('hidden');

        // Raggruppa per primary_topic
        const categoriesMap = {};
        allBlogs.forEach(blog => {
            const topic = blog.primary_topic || blog.seo?.primary_topic || 'Altro';
            if (!categoriesMap[topic]) {
                categoriesMap[topic] = [];
            }
            categoriesMap[topic].push(blog);
        });

        // Genera HTML categorie
        const categoriesHTML = Object.keys(categoriesMap).map(categoryName => {
            const blogs = categoriesMap[categoryName];
            const count = blogs.length;

            const blogsHTML = blogs.map(blog => renderBlogCard(blog)).join('');

            return `
                <div class="cat-card">
                    <div class="cat-header" onclick="toggleCategory(this)">
                        <div class="cat-title">
                            ${getCategoryIcon(categoryName)} ${categoryName}
                            <span class="cat-badge">${count}</span>
                        </div>
                        <i class="fas fa-chevron-down chevron"></i>
                    </div>
                    <div class="cat-body">
                        ${blogsHTML}
                    </div>
                </div>
            `;
        }).join('');

        blogList.innerHTML = categoriesHTML;

        // Update stats
        const draftCount = allBlogs.filter(b => b.status === 'draft').length;
        const publishedCount = allBlogs.filter(b => b.status === 'published').length;
        updateStats(draftCount, publishedCount);
    }

    // --- 5. RENDER SINGOLO BLOG CARD ---
    function renderBlogCard(blog) {
        const blogId = blog.blog_id || blog.id || blog._id;
        const title = blog.meta_title || blog.seo?.meta_title || blog.title || 'Senza titolo';
        const desc = blog.meta_description || blog.seo?.meta_description || '';
        const status = blog.status || 'draft';
        const date = blog.published_date || blog.created_at || '';

        const statusClass = status === 'published' ? 'status-published' : 'status-draft';
        const statusIcon = status === 'published' ? '✅' : '📝';
        const statusText = status === 'published' ? 'Pubblicato' : 'Bozza';

        return `
            <div class="blog-item ${statusClass}">
                <div class="blog-info">
                    <div class="blog-meta">${statusIcon} ${statusText}${date ? ` • ${formatDate(date)}` : ''}</div>
                    <div class="blog-title">${escapeHtml(title)}</div>
                    <div class="blog-desc">${escapeHtml(desc)}</div>
                </div>
                <div class="blog-actions-group">
                    <button class="btn-action btn-edit" onclick="goToEditBlog('${blogId}')">
                        <i class="fas fa-edit"></i>
                        <span>Modifica</span>
                    </button>
                    <button class="btn-blog-delete" onclick="deleteBlog('${blogId}')">
                        <i class="fas fa-trash"></i> Elimina
                    </button>
                </div>
            </div>
        `;
    }

    // --- 6. HELPER FUNCTIONS ---
    function getCategoryIcon(categoryName) {
        const icons = {
            'AI Automation': '🤖',
            'Digital Transformation': '🚀',
            'ROI Optimization': '📈',
            'Business': '💼',
            'Tech': '⚙️',
            'Marketing': '📢',
            'Altro': '📁'
        };
        return icons[categoryName] || '📄';
    }

    function updateStats(draft, published) {
        document.getElementById('count-draft').textContent = draft;
        document.getElementById('count-published').textContent = published;
    }

    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch (e) {
            return '';
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // --- 7. TOGGLE CATEGORIA ---
    window.toggleCategory = function(headerElement) {
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        
        const card = headerElement.closest('.cat-card');
        card.classList.toggle('open');
    }

    // --- 8. NAVIGAZIONE ---
    window.goToNewArticle = function() {
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
        
        // TODO: Redirect a pagina creazione nuovo articolo
        // Per ora redirect a deployblog senza fragment_id
        const targetUrl = new URL('deployblog.html', window.location.href);
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.forEach((value, key) => {
            targetUrl.searchParams.set(key, value);
        });
        window.location.href = targetUrl.toString();
    }

    window.goToEditBlog = function(blogId) {
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        
        const targetUrl = new URL('edit_blog.html', window.location.href);
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.forEach((value, key) => {
            targetUrl.searchParams.set(key, value);
        });
        targetUrl.searchParams.set('blog_id', blogId);
        window.location.href = targetUrl.toString();
    }

    window.deleteBlog = async function(blogId) {
        if (!confirm('Sei sicuro di voler eliminare questo articolo?')) return;
        
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
        
        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'delete_blog',
                    blog_id: blogId,
                    vat_number: apiCredentials.vat,
                    token: apiCredentials.token,
                    chat_id: apiCredentials.owner,
                    lang: apiCredentials.lang
                })
            });

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            const result = await response.json();
            
            if (result.status === 'success') {
                if (tg?.showPopup) {
                    tg.showPopup({ message: '✅ Articolo eliminato!' });
                } else {
                    alert('Articolo eliminato!');
                }
                loadBlogs(true); // Ricarica lista
            } else {
                throw new Error(result.message || 'Errore eliminazione');
            }
            
        } catch (error) {
            console.error('❌ Error deleting blog:', error);
            if (tg?.showPopup) {
                tg.showPopup({ message: `❌ ${error.message}` });
            } else {
                alert(`Errore: ${error.message}`);
            }
        }
    }

    window.goBack = function() {
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        
        const dashboardUrl = new URL('../dashboard.html', window.location.href);
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.forEach((value, key) => {
            dashboardUrl.searchParams.set(key, value);
        });
        window.location.href = dashboardUrl.toString();
    }

    function showError(message) {
        loader.innerHTML = `<p style="color: #ff6b6b; padding: 20px; text-align: center;">${message}</p>`;
    }

    init();
});