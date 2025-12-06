'use strict';

/**
 * STRUTTURA DATI BACKEND (N8N Response):
 * ========================================================
 * {
 *   "status": "success",
 *   "blog_content_structure": {
 *     "seo": { "meta_title": "...", "meta_description": "...", "keywords": "...", "image_alt_text": "..." },
 *     "hero": { "title": "...", "subtitle": "...", "cta_text": "...", "cta_link": "...", "risk_reversal": "..." },
 *     "problem": { "title": "...", "paragraphs": ["..."], "quote": "..." },
 *     "solution": { "title": "...", "paragraphs": ["..."], "subsection": {...} },
 *     "authority": { "title": "...", "paragraphs": ["..."] },
 *     "comparison": { "title": "...", "intro": "...", "table_html": "<table>...</table>" },
 *     "cta_final": { "title": "...", "paragraphs": ["..."], "urgency": "...", "button_text": "...", "link": "...", "risk_reversal": "..." }
 *   }
 * }
 */

// DIZIONARIO TRADUZIONI (6 lingue)
const i18n = {
    it: {
        pageTitle: "Editor Blog Post",
        statusDraft: "Bozza",
        statusPublished: "Pubblicato",
        loadingText: "Caricamento articolo...",
        errorTitle: "Errore di Caricamento",
        errorMessage: "Impossibile caricare l'articolo. Riprova più tardi.",
        imageTitle: "Immagine Featured",
        noImageText: "Nessuna immagine",
        btnSetImageText: "Imposta Immagine",
        btnDownloadText: "Scarica Immagine",
        contentTitle: "Contenuto Articolo",
        btnPreviewText: "Anteprima Completa",
        socialTitle: "Testi per i Social",
        btnCopy: "Copia",
        btnCopied: "Copiato!",
        publishSuccess: "Articolo pubblicato con successo!",
        publishError: "Errore durante la pubblicazione",
        saveSuccess: "Bozza salvata!",
        saveError: "Errore durante il salvataggio",
        deleteConfirm: "Sei sicuro di voler eliminare questa bozza?",
        deleteSuccess: "Bozza eliminata",
        deleteError: "Errore durante l'eliminazione"
    },
    en: {
        pageTitle: "Blog Post Editor",
        statusDraft: "Draft",
        statusPublished: "Published",
        loadingText: "Loading article...",
        errorTitle: "Loading Error",
        errorMessage: "Unable to load the article. Please try again later.",
        imageTitle: "Featured Image",
        noImageText: "No image",
        btnSetImageText: "Set Image",
        btnDownloadText: "Download Image",
        contentTitle: "Article Content",
        btnPreviewText: "Full Preview",
        socialTitle: "Social Media Texts",
        btnCopy: "Copy",
        btnCopied: "Copied!",
        publishSuccess: "Article published successfully!",
        publishError: "Error during publication",
        saveSuccess: "Draft saved!",
        saveError: "Error saving draft",
        deleteConfirm: "Are you sure you want to delete this draft?",
        deleteSuccess: "Draft deleted",
        deleteError: "Error deleting draft"
    },
    fr: {
        pageTitle: "Éditeur d'Article",
        statusDraft: "Brouillon",
        statusPublished: "Publié",
        loadingText: "Chargement de l'article...",
        errorTitle: "Erreur de Chargement",
        errorMessage: "Impossible de charger l'article. Veuillez réessayer.",
        imageTitle: "Image en Vedette",
        noImageText: "Aucune image",
        btnSetImageText: "Définir l'Image",
        btnDownloadText: "Télécharger l'Image",
        contentTitle: "Contenu de l'Article",
        btnPreviewText: "Aperçu Complet",
        socialTitle: "Textes Réseaux Sociaux",
        btnCopy: "Copier",
        btnCopied: "Copié!",
        publishSuccess: "Article publié avec succès!",
        publishError: "Erreur lors de la publication",
        saveSuccess: "Brouillon enregistré!",
        saveError: "Erreur lors de l'enregistrement",
        deleteConfirm: "Êtes-vous sûr de vouloir supprimer ce brouillon?",
        deleteSuccess: "Brouillon supprimé",
        deleteError: "Erreur lors de la suppression"
    },
    de: {
        pageTitle: "Blog-Beitrag-Editor",
        statusDraft: "Entwurf",
        statusPublished: "Veröffentlicht",
        loadingText: "Artikel wird geladen...",
        errorTitle: "Ladefehler",
        errorMessage: "Der Artikel konnte nicht geladen werden. Bitte versuchen Sie es erneut.",
        imageTitle: "Hauptbild",
        noImageText: "Kein Bild",
        btnSetImageText: "Bild Festlegen",
        btnDownloadText: "Bild Herunterladen",
        contentTitle: "Artikelinhalt",
        btnPreviewText: "Vollständige Vorschau",
        socialTitle: "Social-Media-Texte",
        btnCopy: "Kopieren",
        btnCopied: "Kopiert!",
        publishSuccess: "Artikel erfolgreich veröffentlicht!",
        publishError: "Fehler bei der Veröffentlichung",
        saveSuccess: "Entwurf gespeichert!",
        saveError: "Fehler beim Speichern",
        deleteConfirm: "Möchten Sie diesen Entwurf wirklich löschen?",
        deleteSuccess: "Entwurf gelöscht",
        deleteError: "Fehler beim Löschen"
    },
    es: {
        pageTitle: "Editor de Artículo",
        statusDraft: "Borrador",
        statusPublished: "Publicado",
        loadingText: "Cargando artículo...",
        errorTitle: "Error de Carga",
        errorMessage: "No se pudo cargar el artículo. Inténtalo de nuevo.",
        imageTitle: "Imagen Destacada",
        noImageText: "Sin imagen",
        btnSetImageText: "Establecer Imagen",
        btnDownloadText: "Descargar Imagen",
        contentTitle: "Contenido del Artículo",
        btnPreviewText: "Vista Previa Completa",
        socialTitle: "Textos para Redes Sociales",
        btnCopy: "Copiar",
        btnCopied: "¡Copiado!",
        publishSuccess: "¡Artículo publicado con éxito!",
        publishError: "Error durante la publicación",
        saveSuccess: "¡Borrador guardado!",
        saveError: "Error al guardar",
        deleteConfirm: "¿Estás seguro de que quieres eliminar este borrador?",
        deleteSuccess: "Borrador eliminado",
        deleteError: "Error al eliminar"
    },
    pt: {
        pageTitle: "Editor de Artigo",
        statusDraft: "Rascunho",
        statusPublished: "Publicado",
        loadingText: "Carregando artigo...",
        errorTitle: "Erro de Carregamento",
        errorMessage: "Não foi possível carregar o artigo. Tente novamente.",
        imageTitle: "Imagem Destacada",
        noImageText: "Sem imagem",
        btnSetImageText: "Definir Imagem",
        btnDownloadText: "Baixar Imagem",
        contentTitle: "Conteúdo do Artigo",
        btnPreviewText: "Visualização Completa",
        socialTitle: "Textos para Redes Sociais",
        btnCopy: "Copiar",
        btnCopied: "Copiado!",
        publishSuccess: "Artigo publicado com sucesso!",
        publishError: "Erro durante a publicação",
        saveSuccess: "Rascunho salvo!",
        saveError: "Erro ao salvar",
        deleteConfirm: "Tem certeza de que deseja excluir este rascunho?",
        deleteSuccess: "Rascunho excluído",
        deleteError: "Erro ao excluir"
    }
};

// Global vars
let currentBlogData = null;
let currentLang = 'it';
let apiCredentials = {};
let tg = null;
let t = null;

document.addEventListener('DOMContentLoaded', async () => {
    const WEBHOOK_BLOG_URL = "https://trinai.api.workflow.dcmake.it/webhook/914bd78e-8a41-46d7-8935-7eb73cbbae66";
    
    // Elementi DOM
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const editorGrid = document.getElementById('editorGrid');
    
    // Recupera parametri dall'URL
    const params = new URLSearchParams(window.location.search);
    const blogId = params.get('blog_id');
    currentLang = params.get('lang') || 'it';
    apiCredentials = {
        vat: params.get('vat'),
        token: params.get('token'),
        owner: params.get('owner'),
        ragione_sociale: params.get('ragione_sociale')
    };
    const bonusCredits = params.get('bonus_credits');

    // Carica traduzioni
    t = i18n[currentLang] || i18n['it'];
    applyTranslations(t);

    // Telegram WebApp init
    tg = window.Telegram?.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
    }

    // Mostra bonus credits se disponibili
    if (bonusCredits && parseInt(bonusCredits) > 0) {
        if (tg && tg.showPopup) {
            tg.showPopup({
                title: "🎮 Bonus!",
                message: `Hai guadagnato ${bonusCredits} punti bonus!`
            });
        }
    }

    // Verifica blog_id
    if (!blogId) {
        showError(t.errorTitle, t.errorMessage);
        return;
    }

    try {
        // Carica dati del blog
        const response = await fetch(WEBHOOK_BLOG_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'get_blog',
                blog_id: blogId,
                vat_number: apiCredentials.vat,
                token: apiCredentials.token,
                chat_id: apiCredentials.owner,
                lang: currentLang
            })
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        
        console.log('📦 RAW DATA:', data);
        
        // Verifica status
        if (data.status !== 'success') {
            throw new Error(data.message || 'Backend returned non-success status');
        }

        // Verifica presenza blog_content_structure
        if (!data.blog_content_structure) {
            console.error('❌ blog_content_structure not found in:', data);
            throw new Error('Struttura blog_content_structure non trovata nella risposta');
        }

        console.log('✅ blog_content_structure trovata:', data.blog_content_structure);

        // Trasforma la struttura in formato editor
        currentBlogData = transformContentStructure(data.blog_content_structure, blogId);

        // Nasconde loading e mostra contenuto
        loadingState.style.display = 'none';
        editorGrid.style.display = 'grid';

        // Popola i settori
        populateEditor(currentBlogData);
        setupFABs(blogId);

    } catch (error) {
        console.error('❌ Error loading blog:', error);
        showError(t.errorTitle, `${t.errorMessage}\n\nDettagli: ${error.message}`);
    }

    /**
     * FUNZIONE DI TRASFORMAZIONE: Converte blog_content_structure in formato compatibile editor
     */
    function transformContentStructure(contentStruct, blogId) {
        const seo = contentStruct.seo || {};
        const hero = contentStruct.hero || {};
        const problem = contentStruct.problem || {};
        const solution = contentStruct.solution || {};
        const authority = contentStruct.authority || {};
        const comparison = contentStruct.comparison || {};
        const ctaFinal = contentStruct.cta_final || {};

        console.log('🔧 Trasformazione in corso...');

        // Genera HTML completo dal contenuto strutturato
        let htmlContent = '';

        // Hero Section
        if (hero.title) {
            htmlContent += `
                <section class="hero-section" style="margin-bottom: 40px;">
                    <h1 style="font-size: 2.2em; line-height: 1.3; margin-bottom: 20px; color: var(--primary);">${hero.title}</h1>
                    ${hero.subtitle ? `<p class="subtitle" style="font-size: 1.2em; color: var(--text-muted); margin-bottom: 30px;">${hero.subtitle}</p>` : ''}
                    ${hero.cta_text ? `
                        <a href="${hero.cta_link || '#'}" class="cta-button" style="display: inline-block; background: var(--primary); color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-bottom: 15px;">${hero.cta_text}</a>
                    ` : ''}
                    ${hero.risk_reversal ? `<p style="font-size: 0.9em; color: var(--text-muted); font-style: italic;">${hero.risk_reversal}</p>` : ''}
                </section>
            `;
        }

        // Problem Section
        if (problem.title) {
            htmlContent += `
                <section class="problem-section" style="margin-bottom: 40px; padding: 30px; background: var(--bg-secondary); border-left: 4px solid var(--warning); border-radius: 8px;">
                    <h2 style="font-size: 1.8em; margin-bottom: 20px; color: var(--warning);">${problem.title}</h2>
                    ${problem.paragraphs ? problem.paragraphs.map(p => `<p style="margin-bottom: 15px; line-height: 1.6;">${p}</p>`).join('') : ''}
                    ${problem.quote ? `<blockquote style="margin: 20px 0; padding: 15px 20px; background: rgba(255,193,7,0.1); border-left: 3px solid var(--warning); font-style: italic;">${problem.quote}</blockquote>` : ''}
                </section>
            `;
        }

        // Solution Section
        if (solution.title) {
            htmlContent += `
                <section class="solution-section" style="margin-bottom: 40px;">
                    <h2 style="font-size: 1.8em; margin-bottom: 20px; color: var(--success);">${solution.title}</h2>
                    ${solution.paragraphs ? solution.paragraphs.map(p => `<p style="margin-bottom: 15px; line-height: 1.6;">${p}</p>`).join('') : ''}
                    ${solution.subsection && solution.subsection.title ? `
                        <div class="subsection" style="margin-top: 30px; padding: 20px; background: var(--bg-secondary); border-radius: 8px;">
                            <h3 style="font-size: 1.4em; margin-bottom: 15px;">${solution.subsection.title}</h3>
                            ${solution.subsection.paragraphs ? solution.subsection.paragraphs.map(p => `<p style="margin-bottom: 15px; line-height: 1.6;">${p}</p>`).join('') : ''}
                        </div>
                    ` : ''}
                </section>
            `;
        }

        // Authority Section
        if (authority.title) {
            htmlContent += `
                <section class="authority-section" style="margin-bottom: 40px; padding: 30px; background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1)); border-radius: 8px;">
                    <h2 style="font-size: 1.8em; margin-bottom: 20px; color: var(--primary);">${authority.title}</h2>
                    ${authority.paragraphs ? authority.paragraphs.map(p => `<p style="margin-bottom: 15px; line-height: 1.6;">${p}</p>`).join('') : ''}
                </section>
            `;
        }

        // Comparison Section
        if (comparison.title) {
            htmlContent += `
                <section class="comparison-section" style="margin-bottom: 40px;">
                    <h2 style="font-size: 1.8em; margin-bottom: 15px;">${comparison.title}</h2>
                    ${comparison.intro ? `<p style="margin-bottom: 25px; line-height: 1.6; color: var(--text-muted);">${comparison.intro}</p>` : ''}
                    ${comparison.table_html ? `
                        <div style="overflow-x: auto; margin-bottom: 20px;">
                            ${comparison.table_html}
                        </div>
                    ` : ''}
                </section>
            `;
        }

        // CTA Final Section
        if (ctaFinal.title) {
            htmlContent += `
                <section class="cta-final-section" style="margin-bottom: 40px; padding: 40px; background: linear-gradient(135deg, var(--primary), var(--accent)); border-radius: 12px; color: white; text-align: center;">
                    <h2 style="font-size: 2em; margin-bottom: 20px; color: white;">${ctaFinal.title}</h2>
                    ${ctaFinal.paragraphs ? ctaFinal.paragraphs.map(p => `<p style="margin-bottom: 15px; line-height: 1.6; opacity: 0.95;">${p}</p>`).join('') : ''}
                    ${ctaFinal.urgency ? `<p style="font-size: 1.1em; font-weight: 600; margin: 25px 0; padding: 15px; background: rgba(255,255,255,0.2); border-radius: 8px;">⏰ ${ctaFinal.urgency}</p>` : ''}
                    ${ctaFinal.button_text ? `
                        <a href="${ctaFinal.link || '#'}" style="display: inline-block; background: white; color: var(--primary); padding: 18px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 1.1em; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">${ctaFinal.button_text}</a>
                    ` : ''}
                    ${ctaFinal.risk_reversal ? `<p style="font-size: 0.9em; margin-top: 20px; opacity: 0.9; font-style: italic;">${ctaFinal.risk_reversal}</p>` : ''}
                </section>
            `;
        }

        // Genera dati social media
        const socialMedia = {
            facebook: {
                text: `💡 ${hero.title || seo.meta_title}\n\n${seo.meta_description || hero.subtitle || ''}\n\n👉 Scopri di più:`
            },
            instagram: {
                text: `🚀 ${hero.title || seo.meta_title}\n\n${seo.meta_description || hero.subtitle || ''}\n\n🔗 Link in bio`
            },
            twitter: {
                text: `${hero.title || seo.meta_title}\n\n${seo.meta_description || hero.subtitle || ''}`
            },
            linkedin: {
                text: `${hero.title || seo.meta_title}\n\n${seo.meta_description || hero.subtitle || ''}\n\nApprofondisci:`
            }
        };

        console.log('✅ Trasformazione completata');

        // Ritorna struttura compatibile con populateEditor
        return {
            id: blogId || 'draft_' + Date.now(),
            title: seo.meta_title || hero.title || 'Untitled',
            slug: (seo.meta_title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''),
            meta_description: seo.meta_description || hero.subtitle || '',
            featured_image: {
                url: '',
                alt: seo.image_alt_text || seo.meta_title || '',
                generated_by_ai: false
            },
            content: {
                html: htmlContent,
                plain_text: htmlContent.replace(/<[^>]*>/g, ''),
                word_count: htmlContent.replace(/<[^>]*>/g, '').split(/\s+/).length
            },
            social_media: socialMedia,
            article_url: hero.cta_link || ctaFinal.link || '',
            status: 'draft',
            language: currentLang,
            _original_structure: contentStruct
        };
    }

    function applyTranslations(translations) {
        document.getElementById('pageTitle').innerHTML = `<i class="fas fa-edit"></i> ${translations.pageTitle}`;
        document.getElementById('statusText').textContent = translations.statusDraft;
        document.getElementById('loadingText').textContent = translations.loadingText;
        document.getElementById('errorTitle').textContent = translations.errorTitle;
        document.getElementById('errorMessage').textContent = translations.errorMessage;
        document.getElementById('imageTitle').textContent = translations.imageTitle;
        document.getElementById('noImageText').textContent = translations.noImageText;
        document.getElementById('btnSetImageText').textContent = translations.btnSetImageText;
        document.getElementById('btnDownloadText').textContent = translations.btnDownloadText;
        document.getElementById('contentTitle').textContent = translations.contentTitle;
        document.getElementById('btnPreviewText').textContent = translations.btnPreviewText;
        document.getElementById('socialTitle').textContent = translations.socialTitle;
    }

    function populateEditor(blog) {
        console.log('🎨 Populating editor with blog data...');
        
        // Status Badge
        const statusBadge = document.getElementById('statusBadge');
        const statusText = document.getElementById('statusText');
        if (blog.status === 'published') {
            statusBadge.classList.remove('draft');
            statusBadge.classList.add('published');
            statusText.textContent = t.statusPublished;
        }

        // 1. Hero Image Section
        if (blog.featured_image && blog.featured_image.url) {
            const img = document.getElementById('featuredImage');
            const placeholder = document.getElementById('imagePlaceholder');
            img.src = blog.featured_image.url;
            img.alt = blog.featured_image.alt || blog.title;
            img.style.display = 'block';
            placeholder.style.display = 'none';
            document.getElementById('btnDownloadImage').style.display = 'block';
            document.getElementById('imageUrlInput').value = blog.featured_image.url;
        }

        // Click to preview image
        document.getElementById('imageContainer').addEventListener('click', () => {
            if (blog.featured_image && blog.featured_image.url) {
                showImagePreview(blog.featured_image.url);
            }
        });

        // Set image button
        document.getElementById('btnSetImage').addEventListener('click', () => {
            const url = document.getElementById('imageUrlInput').value.trim();
            if (url) {
                const img = document.getElementById('featuredImage');
                const placeholder = document.getElementById('imagePlaceholder');
                img.src = url;
                img.style.display = 'block';
                placeholder.style.display = 'none';
                document.getElementById('btnDownloadImage').style.display = 'block';
                if (!currentBlogData.featured_image) currentBlogData.featured_image = {};
                currentBlogData.featured_image.url = url;
            }
        });

        // Download image button
        document.getElementById('btnDownloadImage').addEventListener('click', () => {
            if (blog.featured_image && blog.featured_image.url) {
                window.open(blog.featured_image.url, '_blank');
            }
        });

        // 2. Content Section
        document.getElementById('editableTitle').value = blog.title || '';
        document.getElementById('editableMeta').value = blog.meta_description || '';
        document.getElementById('articlePreview').innerHTML = blog.content?.html || '<p style="color: var(--text-muted);">Contenuto non disponibile</p>';

        // Full preview button
        document.getElementById('btnPreviewFull').addEventListener('click', () => {
            showFullPreview(blog);
        });

        // 3. Social Media Section
        renderSocialCards(blog.social_media, blog.article_url);
        
        console.log('✅ Editor popolato con successo');
    }

    function renderSocialCards(socialData, articleUrl) {
        const socialGrid = document.getElementById('socialGrid');
        socialGrid.innerHTML = '';

        const platforms = [
            { key: 'facebook', name: 'Facebook', icon: 'fab fa-facebook', color: '#1877f2' },
            { key: 'instagram', name: 'Instagram', icon: 'fab fa-instagram', color: '#e4405f' },
            { key: 'twitter', name: 'X (Twitter)', icon: 'fab fa-x-twitter', color: '#000' },
            { key: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0a66c2' }
        ];

        platforms.forEach(platform => {
            if (socialData && socialData[platform.key] && socialData[platform.key].text) {
                const card = createSocialCard(platform, socialData[platform.key].text, articleUrl);
                socialGrid.appendChild(card);
            }
        });
    }

    function createSocialCard(platform, text, articleUrl) {
        const card = document.createElement('div');
        card.className = 'social-card';
        card.innerHTML = `
            <div class="social-platform" style="color: ${platform.color};">
                <i class="${platform.icon}"></i>
                <span>${platform.name}</span>
            </div>
            <div class="social-text">${text}</div>
            <div class="social-link">
                <i class="fas fa-link"></i>
                <span>${articleUrl || 'Link non disponibile'}</span>
            </div>
            <button class="btn-sm btn-block copy-btn-inline" onclick="copySocialText(this, '${platform.key}')">
                <i class="fas fa-copy"></i> ${t.btnCopy}
            </button>
        `;
        card.dataset.text = text + '\n\n' + (articleUrl || '');
        return card;
    }

    function setupFABs(blogId) {
        // FAB: Torna Indietro
        document.getElementById('fabBack').addEventListener('click', () => {
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            window.history.back();
        });

        // FAB: Elimina
        document.getElementById('fabDelete').addEventListener('click', async () => {
            if (!confirm(t.deleteConfirm)) return;
            
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
            
            try {
                await callWebhook('delete_blog', blogId);
                alert(t.deleteSuccess);
                window.location.href = `dashboard.html?vat=${apiCredentials.vat}&owner=${apiCredentials.owner}&ragione_sociale=${apiCredentials.ragione_sociale}&token=${apiCredentials.token}`;
            } catch (error) {
                alert(`${t.deleteError}: ${error.message}`);
            }
        });

        // FAB: Salva Draft
        document.getElementById('fabSave').addEventListener('click', async () => {
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            
            try {
                const updatedData = collectEditorData();
                await callWebhook('save_blog', blogId, updatedData);
                alert(t.saveSuccess);
            } catch (error) {
                alert(`${t.saveError}: ${error.message}`);
            }
        });

        // FAB: Pubblica
        document.getElementById('fabPublish').addEventListener('click', async () => {
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
            
            try {
                const updatedData = collectEditorData();
                await callWebhook('publish_blog', blogId, updatedData);
                alert(t.publishSuccess);
                setTimeout(() => {
                    window.location.href = `dashboard.html?vat=${apiCredentials.vat}&owner=${apiCredentials.owner}&ragione_sociale=${apiCredentials.ragione_sociale}&token=${apiCredentials.token}`;
                }, 2000);
            } catch (error) {
                alert(`${t.publishError}: ${error.message}`);
            }
        });
    }

    function collectEditorData() {
        return {
            title: document.getElementById('editableTitle').value,
            meta_description: document.getElementById('editableMeta').value,
            featured_image: currentBlogData.featured_image,
            original_structure: currentBlogData._original_structure
        };
    }

    async function callWebhook(action, blogId, data = {}) {
        const response = await fetch("https://trinai.api.workflow.dcmake.it/webhook/914bd78e-8a41-46d7-8935-7eb73cbbae66", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: action,
                blog_id: blogId,
                vat_number: apiCredentials.vat,
                token: apiCredentials.token,
                chat_id: apiCredentials.owner,
                lang: currentLang,
                ...data
            })
        });

        const result = await response.json();
        if (result.status === 'error') throw new Error(result.message);
        return result;
    }

    function showError(title, message) {
        loadingState.style.display = 'none';
        errorState.style.display = 'block';
        document.getElementById('errorTitle').textContent = title;
        document.getElementById('errorMessage').textContent = message;
    }

    function showImagePreview(url) {
        const overlay = document.getElementById('previewOverlay');
        const content = document.getElementById('fullPreviewContent');
        content.innerHTML = `<img src="${url}" style="max-width: 100%; height: auto; border-radius: 12px;">`;
        overlay.style.display = 'flex';
    }

    function showFullPreview(blog) {
        const overlay = document.getElementById('previewOverlay');
        const content = document.getElementById('fullPreviewContent');
        content.innerHTML = `
            <h1 style="margin-bottom: 10px;">${blog.title}</h1>
            <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 30px;">${blog.meta_description}</p>
            ${blog.content?.html || ''}
        `;
        overlay.style.display = 'flex';
    }
});

function closePreview() {
    document.getElementById('previewOverlay').style.display = 'none';
}

function copySocialText(button, platform) {
    const card = button.closest('.social-card');
    const text = card.dataset.text;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(button);
        });
    } else {
        fallbackCopy(text, button);
    }
}

function fallbackCopy(text, button) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showCopyFeedback(button);
}

function showCopyFeedback(button) {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Copiato!';
    button.style.background = 'var(--success)';
    
    const tg = window.Telegram?.WebApp;
    if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
    }, 2000);
}
