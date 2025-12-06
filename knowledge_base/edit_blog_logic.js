'use strict';

// Global vars
let currentBlogData = null;
let currentStructuredContent = null; // Sostituisce currentSections
let currentLang = 'it';
let apiCredentials = {};
let tg = null;

document.addEventListener('DOMContentLoaded', async () => {
    const WEBHOOK_BLOG_URL = "https://trinai.api.workflow.dcmake.it/webhook/914bd78e-8a41-46d7-8935-7eb73cbbae66";
    
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const editorGrid = document.getElementById('editorGrid');
    
    const params = new URLSearchParams(window.location.search);
    const blogId = params.get('blog_id');
    currentLang = params.get('lang') || 'it';
    apiCredentials = {
        vat: params.get('vat'),
        token: params.get('token'),
        owner: params.get('owner'),
        ragione_sociale: params.get('ragione_sociale')
    };

    tg = window.Telegram?.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
    }

    if (!blogId) {
        showError("Errore", "ID blog mancante");
        return;
    }

    try {
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
        const responseData = Array.isArray(data) ? data[0] : data;
        
        if (responseData.status === 'error') {
            throw new Error(responseData.message || 'Unknown error');
        }

        // 🆕 Nuovo: estrai blog_content_structure
        currentBlogData = responseData.blog_data;
        
        // Se i dati arrivano come array con blog_content_structure
        if (Array.isArray(currentBlogData) && currentBlogData[0]?.blog_content_structure) {
            currentStructuredContent = currentBlogData[0].blog_content_structure;
        } else if (currentBlogData?.blog_content_structure) {
            currentStructuredContent = currentBlogData.blog_content_structure;
        } else {
            throw new Error('Struttura dati blog non valida');
        }

        loadingState.style.display = 'none';
        editorGrid.style.display = 'grid';

        populateEditor(blogId, currentStructuredContent);
        setupFABs(blogId);
        setupTextEditor(blogId);

    } catch (error) {
        console.error('Error loading blog:', error);
        showError("Errore di Caricamento", error.message);
    }

    // 🆕 Nuova funzione di popolazione
    function populateEditor(blogId, structuredContent) {
        // Status Badge (mantieni logica esistente se disponibile)
        const statusBadge = document.getElementById('statusBadge');
        const statusText = document.getElementById('statusText');
        const blogStatus = currentBlogData?.status || 'draft';
        
        if (blogStatus === 'published') {
            statusBadge.classList.remove('draft');
            statusBadge.classList.add('published');
            statusText.textContent = 'Pubblicato';
        }

        // 🆕 Featured Image - SEMPRE da CDN
        const imageFilename = `${blogId}.jpg`;
        const featuredImageUrl = `https://cdn.jsdelivr.net/gh/TrinAiBusinessOperatingSystem/SiteBoS-MiniApp/images/${imageFilename}`;
        
        const img = document.getElementById('featuredImage');
        const placeholder = document.getElementById('imagePlaceholder');
        
        img.src = featuredImageUrl;
        img.alt = structuredContent.seo?.image_alt_text || structuredContent.seo?.meta_title || 'Blog Image';
        img.style.display = 'block';
        placeholder.style.display = 'none';
        document.getElementById('btnDownloadImage').style.display = 'block';

        // Click per preview
        document.getElementById('imageContainer').addEventListener('click', () => {
            showImagePreview(featuredImageUrl);
        });

        // Rigenera immagine
        document.getElementById('btnRegenerateImage').addEventListener('click', async () => {
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            
            const btn = document.getElementById('btnRegenerateImage');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
            
            try {
                await callWebhook('regenerate_image', blogId);
                
                // Forza reload immagine con cache bust
                img.src = `${featuredImageUrl}?t=${Date.now()}`;
                
                btn.innerHTML = '<i class="fas fa-magic"></i> Rigenera con AI';
                btn.disabled = false;
            } catch (error) {
                alert('Errore generazione immagine: ' + error.message);
                btn.innerHTML = '<i class="fas fa-magic"></i> Rigenera con AI';
                btn.disabled = false;
            }
        });

        // Upload immagine
        document.getElementById('btnUploadImage').addEventListener('click', () => {
            document.getElementById('imageFileInput').click();
        });

        document.getElementById('imageFileInput').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            
            const tempUrl = URL.createObjectURL(file);
            img.src = tempUrl;
            
            const btn = document.getElementById('btnUploadImage');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Caricando...';
            
            try {
                const base64 = await fileToBase64(file);
                
                await callWebhook('upload_image', blogId, {
                    image_base64: base64,
                    filename: imageFilename
                });
                
                // Reload con cache bust
                img.src = `${featuredImageUrl}?t=${Date.now()}`;
                
                btn.innerHTML = '<i class="fas fa-upload"></i> Carica Immagine';
                btn.disabled = false;
            } catch (error) {
                alert('Errore upload immagine: ' + error.message);
                btn.innerHTML = '<i class="fas fa-upload"></i> Carica Immagine';
                btn.disabled = false;
            }
        });

        // Download immagine
        document.getElementById('btnDownloadImage').addEventListener('click', () => {
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            
            const link = document.createElement('a');
            link.href = featuredImageUrl;
            link.download = imageFilename;
            link.target = '_blank';
            link.click();
        });

        // 🆕 Popola Titolo e Meta da SEO
        document.getElementById('editableTitle').value = structuredContent.seo?.meta_title || '';
        document.getElementById('editableMeta').value = structuredContent.seo?.meta_description || '';

        // 🆕 Renderizza sezioni strutturate
        renderStructuredSections(structuredContent);

        // Preview Live
        document.getElementById('btnPreviewFull').addEventListener('click', () => {
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            
            const liveUrl = `https://trinaibusinessoperatingsystem.github.io/SiteBoS-MiniApp/posts/${blogId}.html`;
            window.open(liveUrl, '_blank');
        });

        // 🆕 Renderizza social (se presenti)
        renderSocialCards(structuredContent, blogId);
    }

    // 🆕 Nuova funzione: renderizza sezioni strutturate
    function renderStructuredSections(structuredContent) {
        const container = document.getElementById('articlePreview');
        container.innerHTML = '';

        const sectionsOrder = ['hero', 'problem', 'solution', 'authority', 'comparison', 'cta_final'];
        
        sectionsOrder.forEach(sectionKey => {
            const section = structuredContent[sectionKey];
            if (!section) return;

            const sectionBlock = document.createElement('div');
            sectionBlock.className = 'editable-section-block';
            sectionBlock.dataset.sectionKey = sectionKey;

            // HERO Section
            if (sectionKey === 'hero') {
                sectionBlock.innerHTML = `
                    <h3 style="color: var(--primary); margin-bottom: 10px;">🎯 Hero</h3>
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px;">Titolo</label>
                    <textarea class="editable-paragraph" data-field="title" rows="3">${section.title || ''}</textarea>
                    
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px; margin-top: 10px;">Sottotitolo</label>
                    <textarea class="editable-paragraph" data-field="subtitle" rows="2">${section.subtitle || ''}</textarea>
                    
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px; margin-top: 10px;">CTA Text</label>
                    <input type="text" class="editable-heading" data-field="cta_text" value="${section.cta_text || ''}" style="font-size: 14px;">
                    
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px; margin-top: 10px;">CTA Link</label>
                    <input type="text" class="editable-heading" data-field="cta_link" value="${section.cta_link || ''}" style="font-size: 12px;">
                    
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px; margin-top: 10px;">Risk Reversal</label>
                    <textarea class="editable-paragraph" data-field="risk_reversal" rows="2">${section.risk_reversal || ''}</textarea>
                `;
            }
            // PROBLEM Section
            else if (sectionKey === 'problem') {
                sectionBlock.innerHTML = `
                    <h3 style="color: var(--primary); margin-bottom: 10px;">⚠️ Problema</h3>
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px;">Titolo</label>
                    <input type="text" class="editable-heading" data-field="title" value="${section.title || ''}" style="font-size: 16px;">
                    
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px; margin-top: 10px;">Paragrafi</label>
                    ${(section.paragraphs || []).map((p, i) => `
                        <textarea class="editable-paragraph" data-field="paragraph_${i}" rows="3" style="margin-bottom: 8px;">${p}</textarea>
                    `).join('')}
                    
                    ${section.quote ? `
                        <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px; margin-top: 10px;">Citazione</label>
                        <textarea class="editable-paragraph" data-field="quote" rows="2" style="font-style: italic; border-left: 3px solid var(--warning);">${section.quote}</textarea>
                    ` : ''}
                `;
            }
            // SOLUTION Section
            else if (sectionKey === 'solution') {
                sectionBlock.innerHTML = `
                    <h3 style="color: var(--primary); margin-bottom: 10px;">✅ Soluzione</h3>
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px;">Titolo</label>
                    <input type="text" class="editable-heading" data-field="title" value="${section.title || ''}" style="font-size: 16px;">
                    
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px; margin-top: 10px;">Paragrafi</label>
                    ${(section.paragraphs || []).map((p, i) => `
                        <textarea class="editable-paragraph" data-field="paragraph_${i}" rows="3" style="margin-bottom: 8px;">${p}</textarea>
                    `).join('')}
                    
                    ${section.subsection ? `
                        <div style="margin-top: 15px; padding-left: 15px; border-left: 2px solid var(--primary);">
                            <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px;">Sottosezione - Titolo</label>
                            <input type="text" class="editable-heading" data-field="subsection_title" value="${section.subsection.title || ''}" style="font-size: 14px;">
                            
                            <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px; margin-top: 10px;">Sottosezione - Paragrafi</label>
                            ${(section.subsection.paragraphs || []).map((p, i) => `
                                <textarea class="editable-paragraph" data-field="subsection_paragraph_${i}" rows="2" style="margin-bottom: 8px;">${p}</textarea>
                            `).join('')}
                        </div>
                    ` : ''}
                `;
            }
            // AUTHORITY Section
            else if (sectionKey === 'authority') {
                sectionBlock.innerHTML = `
                    <h3 style="color: var(--primary); margin-bottom: 10px;">🏆 Autorità</h3>
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px;">Titolo</label>
                    <input type="text" class="editable-heading" data-field="title" value="${section.title || ''}" style="font-size: 16px;">
                    
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px; margin-top: 10px;">Paragrafi</label>
                    ${(section.paragraphs || []).map((p, i) => `
                        <textarea class="editable-paragraph" data-field="paragraph_${i}" rows="3" style="margin-bottom: 8px;">${p}</textarea>
                    `).join('')}
                `;
            }
            // COMPARISON Section
            else if (sectionKey === 'comparison') {
                sectionBlock.innerHTML = `
                    <h3 style="color: var(--primary); margin-bottom: 10px;">📊 Confronto</h3>
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px;">Titolo</label>
                    <input type="text" class="editable-heading" data-field="title" value="${section.title || ''}" style="font-size: 16px;">
                    
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px; margin-top: 10px;">Intro</label>
                    <textarea class="editable-paragraph" data-field="intro" rows="2">${section.intro || ''}</textarea>
                    
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px; margin-top: 10px;">Tabella HTML</label>
                    <div style="padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px; font-size: 11px; overflow-x: auto;">
                        ${section.table_html || '<p style="color: var(--text-muted);">Nessuna tabella</p>'}
                    </div>
                    <textarea class="editable-paragraph" data-field="table_html" rows="5" style="margin-top: 8px; font-family: monospace; font-size: 11px;">${section.table_html || ''}</textarea>
                `;
            }
            // CTA FINAL Section
            else if (sectionKey === 'cta_final') {
                sectionBlock.innerHTML = `
                    <h3 style="color: var(--primary); margin-bottom: 10px;">🚀 CTA Finale</h3>
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px;">Titolo</label>
                    <input type="text" class="editable-heading" data-field="title" value="${section.title || ''}" style="font-size: 16px;">
                    
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px; margin-top: 10px;">Paragrafi</label>
                    ${(section.paragraphs || []).map((p, i) => `
                        <textarea class="editable-paragraph" data-field="paragraph_${i}" rows="3" style="margin-bottom: 8px;">${p}</textarea>
                    `).join('')}
                    
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px; margin-top: 10px;">Urgenza</label>
                    <textarea class="editable-paragraph" data-field="urgency" rows="2">${section.urgency || ''}</textarea>
                    
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px; margin-top: 10px;">Testo Bottone</label>
                    <input type="text" class="editable-heading" data-field="button_text" value="${section.button_text || ''}" style="font-size: 14px;">
                    
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px; margin-top: 10px;">Link</label>
                    <input type="text" class="editable-heading" data-field="link" value="${section.link || ''}" style="font-size: 12px;">
                    
                    <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 5px; margin-top: 10px;">Risk Reversal</label>
                    <textarea class="editable-paragraph" data-field="risk_reversal" rows="2">${section.risk_reversal || ''}</textarea>
                `;
            }

            container.appendChild(sectionBlock);
        });

        // Event listeners per modifiche
        container.querySelectorAll('.editable-heading, .editable-paragraph').forEach(input => {
            input.addEventListener('input', (e) => {
                const block = e.target.closest('.editable-section-block');
                const sectionKey = block.dataset.sectionKey;
                const field = e.target.dataset.field;
                
                // Aggiorna struttura dati
                if (field.startsWith('paragraph_')) {
                    const index = parseInt(field.split('_')[1]);
                    if (!currentStructuredContent[sectionKey].paragraphs) {
                        currentStructuredContent[sectionKey].paragraphs = [];
                    }
                    currentStructuredContent[sectionKey].paragraphs[index] = e.target.value;
                } else if (field.startsWith('subsection_paragraph_')) {
                    const index = parseInt(field.split('_')[2]);
                    if (!currentStructuredContent[sectionKey].subsection.paragraphs) {
                        currentStructuredContent[sectionKey].subsection.paragraphs = [];
                    }
                    currentStructuredContent[sectionKey].subsection.paragraphs[index] = e.target.value;
                } else if (field.startsWith('subsection_')) {
                    const subField = field.replace('subsection_', '');
                    currentStructuredContent[sectionKey].subsection[subField] = e.target.value;
                } else {
                    currentStructuredContent[sectionKey][field] = e.target.value;
                }
            });
        });
    }

    function renderSocialCards(structuredContent, blogId) {
        const socialGrid = document.getElementById('socialGrid');
        socialGrid.innerHTML = '';

        const liveUrl = `https://trinaibusinessoperatingsystem.github.io/SiteBoS-MiniApp/posts/${blogId}.html`;

        // Se non ci sono dati social, mostra placeholder
        if (!currentBlogData?.social_media) {
            socialGrid.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">Nessun contenuto social disponibile</p>';
            return;
        }

        const platforms = [
            { key: 'facebook', name: 'Facebook', icon: 'fab fa-facebook', color: '#1877f2' },
            { key: 'instagram', name: 'Instagram', icon: 'fab fa-instagram', color: '#e4405f' },
            { key: 'twitter', name: 'X (Twitter)', icon: 'fab fa-x-twitter', color: '#000' },
            { key: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0a66c2' }
        ];

        platforms.forEach(platform => {
            if (currentBlogData.social_media[platform.key]?.text) {
                const card = createSocialCard(platform, currentBlogData.social_media[platform.key].text, liveUrl);
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
                <i class="fas fa-copy"></i> Copia
            </button>
        `;
        
        card.dataset.socialText = text;
        card.dataset.articleUrl = articleUrl || '';
        
        return card;
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // 🔥 TEXT EDITOR PANEL SETUP
    function setupTextEditor(blogId) {
        const textEditorPanel = document.getElementById('textEditorPanel');
        const textCommandInput = document.getElementById('textCommandInput');
        const btnSendTextCommand = document.getElementById('btnSendTextCommand');
        const btnCloseTextEditor = document.getElementById('btnCloseTextEditor');

        btnSendTextCommand.addEventListener('click', async () => {
            const command = textCommandInput.value.trim();
            if (!command) return;

            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');

            btnSendTextCommand.disabled = true;
            btnSendTextCommand.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Elaborando...';

            try {
                const response = await callWebhook('voice_edit_interpret', blogId, {
                    voice_command: command,
                    current_content: currentStructuredContent,
                    current_title: document.getElementById('editableTitle').value,
                    current_meta: document.getElementById('editableMeta').value
                });

                if (response.proposed_change) {
                    showCommandPreview(response.proposed_change);
                    textCommandInput.value = '';
                    textEditorPanel.classList.remove('open');
                }

            } catch (error) {
                alert('Errore interpretazione comando: ' + error.message);
            } finally {
                btnSendTextCommand.disabled = false;
                btnSendTextCommand.innerHTML = '<i class="fas fa-paper-plane"></i> Invia Comando';
            }
        });

        btnCloseTextEditor.addEventListener('click', () => {
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            textEditorPanel.classList.remove('open');
        });
    }

    function setupFABs(blogId) {
        document.getElementById('fabBack').addEventListener('click', () => {
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            
            const knowledgeUrl = new URL('knowledge.html', window.location.href);
            const currentParams = new URLSearchParams(window.location.search);
            currentParams.forEach((value, key) => {
                if (key !== 'blog_id' && key !== 'bonus_credits') {
                    knowledgeUrl.searchParams.set(key, value);
                }
            });
            
            window.location.href = knowledgeUrl.toString();
        });

        const fabVoiceEdit = document.getElementById('fabVoiceEdit');
        const textEditorPanel = document.getElementById('textEditorPanel');

        fabVoiceEdit.addEventListener('click', () => {
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            textEditorPanel.classList.add('open');
            document.getElementById('textCommandInput').focus();
        });

        document.getElementById('fabDelete').addEventListener('click', async () => {
            if (!confirm("Sei sicuro di voler eliminare questa bozza?")) return;
            
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
            
            try {
                await callWebhook('delete_blog', blogId);
                alert("Bozza eliminata");
                
                const knowledgeUrl = new URL('knowledge.html', window.location.href);
                const currentParams = new URLSearchParams(window.location.search);
                currentParams.forEach((value, key) => {
                    if (key !== 'blog_id' && key !== 'bonus_credits') {
                        knowledgeUrl.searchParams.set(key, value);
                    }
                });
                window.location.href = knowledgeUrl.toString();
            } catch (error) {
                alert(`Errore durante l'eliminazione: ${error.message}`);
            }
        });

        document.getElementById('fabSave').addEventListener('click', async () => {
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            
            try {
                const updatedData = collectEditorData();
                await callWebhook('save_blog', blogId, updatedData);
                alert("Bozza salvata!");
            } catch (error) {
                alert(`Errore durante il salvataggio: ${error.message}`);
            }
        });

        document.getElementById('fabPublish').addEventListener('click', async () => {
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
            
            try {
                const updatedData = collectEditorData();
                await callWebhook('publish_blog', blogId, updatedData);
                alert("Articolo pubblicato con successo!");
                setTimeout(() => {
                    const knowledgeUrl = new URL('knowledge.html', window.location.href);
                    const currentParams = new URLSearchParams(window.location.search);
                    currentParams.forEach((value, key) => {
                        if (key !== 'blog_id' && key !== 'bonus_credits') {
                            knowledgeUrl.searchParams.set(key, value);
                        }
                    });
                    window.location.href = knowledgeUrl.toString();
                }, 2000);
            } catch (error) {
                alert(`Errore durante la pubblicazione: ${error.message}`);
            }
        });
    }

    function showCommandPreview(change) {
        const actionText = change.action_description || 'modificare il contenuto';
        const message = `Vuoi ${actionText}?\n\n"${change.new_text || change.description}"`;
        
        if (confirm(message)) {
            // Logica di applicazione modifiche AI
            if (change.section_key && change.field) {
                currentStructuredContent[change.section_key][change.field] = change.new_text;
                renderStructuredSections(currentStructuredContent);
            } else if (change.action === 'edit_title') {
                document.getElementById('editableTitle').value = change.new_text;
                currentStructuredContent.seo.meta_title = change.new_text;
            } else if (change.action === 'edit_meta') {
                document.getElementById('editableMeta').value = change.new_text;
                currentStructuredContent.seo.meta_description = change.new_text;
            }
            
            if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        }
    }

    // 🆕 Nuova funzione: raccolta dati strutturati
    function collectEditorData() {
        return {
            blog_content_structure: {
                seo: {
                    meta_title: document.getElementById('editableTitle').value,
                    meta_description: document.getElementById('editableMeta').value,
                    keywords: currentStructuredContent.seo?.keywords || '',
                    image_alt_text: currentStructuredContent.seo?.image_alt_text || ''
                },
                ...currentStructuredContent
            }
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
        const responseData = Array.isArray(result) ? result[0] : result;
        if (responseData.status === 'error') throw new Error(responseData.message);
        return responseData;
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
});

function closePreview() {
    document.getElementById('previewOverlay').style.display = 'none';
}

function copySocialText(button, platform) {
    const card = button.closest('.social-card');
    const socialText = card.dataset.socialText || '';
    const articleUrl = card.dataset.articleUrl || '';
    
    let finalText;
    
    if (socialText.includes('[LINK]')) {
        finalText = socialText.replace('[LINK]', articleUrl);
    } else {
        finalText = socialText + '\n\n' + articleUrl;
    }
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(finalText).then(() => {
            showCopyFeedback(button);
        });
    } else {
        fallbackCopy(finalText, button);
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
