'use strict';

// Global vars
let currentBlogData = null;
let currentSections = [];
let currentLang = 'it';
let apiCredentials = {};
let tg = null;
let isRecording = false;

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
        
        // ✅ Gestisce array wrapper da n8n
        const responseData = Array.isArray(data) ? data[0] : data;
        
        if (responseData.status === 'error') {
            throw new Error(responseData.message || 'Unknown error');
        }

        currentBlogData = responseData.blog_data;

        loadingState.style.display = 'none';
        editorGrid.style.display = 'grid';

        populateEditor(currentBlogData);
        setupFABs(blogId);

    } catch (error) {
        console.error('Error loading blog:', error);
        showError("Errore di Caricamento", error.message);
    }

    function populateEditor(blog) {
        const statusBadge = document.getElementById('statusBadge');
        const statusText = document.getElementById('statusText');
        if (blog.status === 'published') {
            statusBadge.classList.remove('draft');
            statusBadge.classList.add('published');
            statusText.textContent = 'Pubblicato';
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
        }

        document.getElementById('imageContainer').addEventListener('click', () => {
            if (blog.featured_image && blog.featured_image.url) {
                showImagePreview(blog.featured_image.url);
            }
        });

        // ✅ 1. Rigenera con AI
        document.getElementById('btnRegenerateImage').addEventListener('click', async () => {
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            
            const btn = document.getElementById('btnRegenerateImage');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
            
            try {
                const response = await callWebhook('regenerate_image', blog.id);
                
                if (response.image_url) {
                    const img = document.getElementById('featuredImage');
                    const placeholder = document.getElementById('imagePlaceholder');
                    img.src = response.image_url;
                    img.style.display = 'block';
                    placeholder.style.display = 'none';
                    document.getElementById('btnDownloadImage').style.display = 'block';
                    currentBlogData.featured_image.url = response.image_url;
                }
                
                btn.innerHTML = '<i class="fas fa-magic"></i> Rigenera con AI';
                btn.disabled = false;
            } catch (error) {
                alert('Errore generazione immagine: ' + error.message);
                btn.innerHTML = '<i class="fas fa-magic"></i> Rigenera con AI';
                btn.disabled = false;
            }
        });

        // ✅ 2. Upload Manuale → Chiama upload_image webhook
        document.getElementById('btnUploadImage').addEventListener('click', () => {
            document.getElementById('imageFileInput').click();
        });

        document.getElementById('imageFileInput').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            
            // Preview temporaneo
            const tempUrl = URL.createObjectURL(file);
            const img = document.getElementById('featuredImage');
            const placeholder = document.getElementById('imagePlaceholder');
            img.src = tempUrl;
            img.style.display = 'block';
            placeholder.style.display = 'none';
            
            const btn = document.getElementById('btnUploadImage');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Caricando...';
            
            try {
                // Converti file in base64
                const base64 = await fileToBase64(file);
                
                // ✅ Chiama webhook upload_image
                const response = await callWebhook('upload_image', blog.id, {
                    image_base64: base64,
                    filename: `${blog.id}.jpg`
                });
                
                if (response.image_url) {
                    img.src = response.image_url;
                    currentBlogData.featured_image.url = response.image_url;
                    document.getElementById('btnDownloadImage').style.display = 'block';
                }
                
                btn.innerHTML = '<i class="fas fa-upload"></i> Carica Immagine';
                btn.disabled = false;
            } catch (error) {
                alert('Errore upload immagine: ' + error.message);
                btn.innerHTML = '<i class="fas fa-upload"></i> Carica Immagine';
                btn.disabled = false;
            }
        });

        // ✅ 3. Scarica Immagine
        document.getElementById('btnDownloadImage').addEventListener('click', () => {
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            
            const imageUrl = currentBlogData.featured_image.url;
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `${currentBlogData.id}.jpg`;
            link.target = '_blank';
            link.click();
        });

        // 2. Content Section
        document.getElementById('editableTitle').value = blog.title || '';
        document.getElementById('editableMeta').value = blog.meta_description || '';
        
        // ✅ Parse HTML to Editable Sections
        currentSections = parseHTMLtoSections(blog.content?.html || '');
        renderEditableSections(currentSections);

        // ✅ Anteprima Live - Apre pagina GitHub Pages
        document.getElementById('btnPreviewFull').addEventListener('click', () => {
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            
            const liveUrl = `https://trinaibusinessoperatingsystem.github.io/SiteBoS-MiniApp/posts/${currentBlogData.id}.html`;
            window.open(liveUrl, '_blank');
        });

        // 3. Social Media Section
        renderSocialCards(blog.social_media, blog.article_url);
    }

    // ✅ Helper: Converti file in base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]); // Rimuove "data:image/jpeg;base64,"
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // ✅ Parser HTML → Sezioni Editabili
    function parseHTMLtoSections(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const articleContent = doc.querySelector('.article-content');
        
        if (!articleContent) return [];
        
        const sections = [];
        const elements = articleContent.children;
        
        for (let el of elements) {
            if (el.tagName === 'DIV' && el.classList.contains('cta-block')) continue;
            if (el.tagName === 'HR') continue;
            
            sections.push({
                type: el.tagName.toLowerCase(),
                content: el.innerHTML,
                text: el.textContent.trim()
            });
        }
        
        return sections;
    }

    // ✅ Render Sezioni Editabili (FONT SIZE PIU PICCOLI)
    function renderEditableSections(sections) {
        const container = document.getElementById('articlePreview');
        container.innerHTML = '';
        
        sections.forEach((section, index) => {
            const block = document.createElement('div');
            block.className = 'editable-section-block';
            block.dataset.index = index;
            block.dataset.type = section.type;
            
            if (section.type === 'h1' || section.type === 'h2' || section.type === 'h3') {
                // ✅ OTTIMIZZATO: H1=1.3rem, H2=1.2rem, H3=1.1rem
                const fontSize = section.type === 'h1' ? '1.3rem' : section.type === 'h2' ? '1.2rem' : '1.1rem';
                block.innerHTML = `
                    <input type="text" class="editable-heading" value="${section.text.replace(/"/g, '&quot;')}" 
                           style="font-size: ${fontSize}; font-weight: 600; border: none; 
                                  border-bottom: 2px dashed var(--glass-border); background: transparent; 
                                  color: var(--primary); width: 100%; padding: 10px 0;">
                `;
            } else if (section.type === 'p' || section.type === 'blockquote') {
                block.innerHTML = `
                    <textarea class="editable-paragraph" rows="3" 
                              style="width: 100%; border: 1px solid var(--glass-border); 
                                     border-radius: 8px; padding: 10px; background: rgba(0,0,0,0.1); 
                                     color: var(--text-main); resize: vertical; font-family: inherit; line-height: 1.6;">${section.text}</textarea>
                `;
            } else {
                block.innerHTML = `<div style="opacity: 0.7; padding: 10px; background: rgba(0,0,0,0.05); border-radius: 8px;">${section.content}</div>`;
            }
            
            container.appendChild(block);
        });
        
        // Attach listeners per salvare modifiche
        container.querySelectorAll('.editable-heading, .editable-paragraph').forEach(input => {
            input.addEventListener('input', (e) => {
                const block = e.target.closest('.editable-section-block');
                const index = parseInt(block.dataset.index);
                currentSections[index].text = e.target.value;
            });
        });
    }

    function renderSocialCards(socialData, articleUrl) {
        const socialGrid = document.getElementById('socialGrid');
        socialGrid.innerHTML = '';

        // ✅ Forza sempre GitHub Pages URL
        const liveUrl = `https://trinaibusinessoperatingsystem.github.io/SiteBoS-MiniApp/posts/${currentBlogData.id}.html`;

        const platforms = [
            { key: 'facebook', name: 'Facebook', icon: 'fab fa-facebook', color: '#1877f2' },
            { key: 'instagram', name: 'Instagram', icon: 'fab fa-instagram', color: '#e4405f' },
            { key: 'twitter', name: 'X (Twitter)', icon: 'fab fa-x-twitter', color: '#000' },
            { key: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0a66c2' }
        ];

        platforms.forEach(platform => {
            if (socialData && socialData[platform.key] && socialData[platform.key].text) {
                const card = createSocialCard(platform, socialData[platform.key].text, liveUrl);
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
        card.dataset.text = text + '\n\n' + (articleUrl || '');
        return card;
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

        // 🎤 VOICE EDIT FAB
        document.getElementById('fabVoiceEdit').addEventListener('click', async () => {
            if (isRecording) return;
            
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            
            const btn = document.getElementById('fabVoiceEdit');
            
            try {
                // Check browser support
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (!SpeechRecognition) {
                    alert('Il tuo browser non supporta il riconoscimento vocale. Usa Chrome o Safari.');
                    return;
                }
                
                const recognition = new SpeechRecognition();
                recognition.lang = currentLang === 'it' ? 'it-IT' : currentLang === 'en' ? 'en-US' : `${currentLang}-${currentLang.toUpperCase()}`;
                recognition.continuous = false;
                recognition.interimResults = false;
                
                // Start recording
                isRecording = true;
                btn.classList.add('recording');
                btn.innerHTML = '<i class="fas fa-stop"></i>';
                
                recognition.start();
                
                recognition.onresult = async (event) => {
                    const transcript = event.results[0][0].transcript;
                    console.log('Voice command:', transcript);
                    
                    // Stop recording UI
                    isRecording = false;
                    btn.classList.remove('recording');
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    
                    try {
                        // Send to AI Assistant for interpretation
                        const response = await callWebhook('voice_edit_interpret', blogId, {
                            voice_command: transcript,
                            current_sections: currentSections,
                            current_title: document.getElementById('editableTitle').value,
                            current_meta: document.getElementById('editableMeta').value
                        });
                        
                        // Show preview and ask for confirmation
                        if (response.proposed_change) {
                            showVoiceEditPreview(response.proposed_change);
                        }
                        
                    } catch (error) {
                        alert('Errore interpretazione comando: ' + error.message);
                    } finally {
                        btn.innerHTML = '<i class="fas fa-microphone"></i>';
                    }
                };
                
                recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    isRecording = false;
                    btn.classList.remove('recording');
                    btn.innerHTML = '<i class="fas fa-microphone"></i>';
                    
                    if (event.error === 'not-allowed') {
                        alert('Permesso microfono negato. Abilita il microfono nelle impostazioni del browser.');
                    } else {
                        alert(`Errore riconoscimento vocale: ${event.error}`);
                    }
                };
                
                recognition.onend = () => {
                    if (isRecording) {
                        isRecording = false;
                        btn.classList.remove('recording');
                        btn.innerHTML = '<i class="fas fa-microphone"></i>';
                    }
                };
                
            } catch (error) {
                isRecording = false;
                btn.innerHTML = '<i class="fas fa-microphone"></i>';
                alert('Errore registrazione vocale: ' + error.message);
            }
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

    // 🎤 Show Voice Edit Preview
    function showVoiceEditPreview(change) {
        const actionText = change.action_description || 'modificare il contenuto';
        const message = `Vuoi ${actionText}?\n\n"${change.new_text || change.description}"`;
        
        if (confirm(message)) {
            // Apply change based on action type
            if (change.action === 'edit_section' && change.section_index !== undefined) {
                currentSections[change.section_index].text = change.new_text;
                renderEditableSections(currentSections);
            } else if (change.action === 'edit_title') {
                document.getElementById('editableTitle').value = change.new_text;
            } else if (change.action === 'edit_meta') {
                document.getElementById('editableMeta').value = change.new_text;
            }
            
            if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        }
    }

    function collectEditorData() {
        return {
            title: document.getElementById('editableTitle').value,
            meta_description: document.getElementById('editableMeta').value,
            featured_image: currentBlogData.featured_image,
            content_sections: currentSections
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
