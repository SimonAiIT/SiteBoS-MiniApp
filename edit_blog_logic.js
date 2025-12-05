'use strict';

// DIZIONARIO TRADUZIONI (6 lingue)
const i18n = {
    it: {
        pageTitle: "Editor Blog Post",
        pageSubtitle: "Rivedi il tuo articolo generato e i testi per i social media",
        loadingText: "Caricamento articolo...",
        errorTitle: "Errore di Caricamento",
        errorMessage: "Impossibile caricare l'articolo. Riprova più tardi.",
        btnBack: "Torna Indietro",
        articleTitle: "Articolo Generato",
        socialTitle: "Testi per i Social",
        btnPublishText: "Pubblica",
        btnEditText: "Modifica",
        btnCopy: "Copia",
        btnCopied: "Copiato!",
        publishSuccess: "Articolo pubblicato con successo!",
        publishError: "Errore durante la pubblicazione"
    },
    en: {
        pageTitle: "Blog Post Editor",
        pageSubtitle: "Review your generated article and social media texts",
        loadingText: "Loading article...",
        errorTitle: "Loading Error",
        errorMessage: "Unable to load the article. Please try again later.",
        btnBack: "Go Back",
        articleTitle: "Generated Article",
        socialTitle: "Social Media Texts",
        btnPublishText: "Publish",
        btnEditText: "Edit",
        btnCopy: "Copy",
        btnCopied: "Copied!",
        publishSuccess: "Article published successfully!",
        publishError: "Error during publication"
    },
    fr: {
        pageTitle: "Éditeur d'Article de Blog",
        pageSubtitle: "Examinez votre article généré et les textes pour les réseaux sociaux",
        loadingText: "Chargement de l'article...",
        errorTitle: "Erreur de Chargement",
        errorMessage: "Impossible de charger l'article. Veuillez réessayer plus tard.",
        btnBack: "Retour",
        articleTitle: "Article Généré",
        socialTitle: "Textes pour les Réseaux Sociaux",
        btnPublishText: "Publier",
        btnEditText: "Modifier",
        btnCopy: "Copier",
        btnCopied: "Copié!",
        publishSuccess: "Article publié avec succès!",
        publishError: "Erreur lors de la publication"
    },
    de: {
        pageTitle: "Blog-Beitrag-Editor",
        pageSubtitle: "Überprüfen Sie Ihren generierten Artikel und Social-Media-Texte",
        loadingText: "Artikel wird geladen...",
        errorTitle: "Ladefehler",
        errorMessage: "Der Artikel konnte nicht geladen werden. Bitte versuchen Sie es später erneut.",
        btnBack: "Zurück",
        articleTitle: "Generierter Artikel",
        socialTitle: "Social-Media-Texte",
        btnPublishText: "Veröffentlichen",
        btnEditText: "Bearbeiten",
        btnCopy: "Kopieren",
        btnCopied: "Kopiert!",
        publishSuccess: "Artikel erfolgreich veröffentlicht!",
        publishError: "Fehler bei der Veröffentlichung"
    },
    es: {
        pageTitle: "Editor de Artículo de Blog",
        pageSubtitle: "Revisa tu artículo generado y los textos para redes sociales",
        loadingText: "Cargando artículo...",
        errorTitle: "Error de Carga",
        errorMessage: "No se pudo cargar el artículo. Inténtalo de nuevo más tarde.",
        btnBack: "Volver",
        articleTitle: "Artículo Generado",
        socialTitle: "Textos para Redes Sociales",
        btnPublishText: "Publicar",
        btnEditText: "Editar",
        btnCopy: "Copiar",
        btnCopied: "¡Copiado!",
        publishSuccess: "¡Artículo publicado con éxito!",
        publishError: "Error durante la publicación"
    },
    pt: {
        pageTitle: "Editor de Artigo de Blog",
        pageSubtitle: "Revise seu artigo gerado e os textos para as redes sociais",
        loadingText: "Carregando artigo...",
        errorTitle: "Erro de Carregamento",
        errorMessage: "Não foi possível carregar o artigo. Tente novamente mais tarde.",
        btnBack: "Voltar",
        articleTitle: "Artigo Gerado",
        socialTitle: "Textos para Redes Sociais",
        btnPublishText: "Publicar",
        btnEditText: "Editar",
        btnCopy: "Copiar",
        btnCopied: "Copiado!",
        publishSuccess: "Artigo publicado com sucesso!",
        publishError: "Erro durante a publicação"
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const WEBHOOK_BLOG_URL = "https://trinai.api.workflow.dcmake.it/webhook/914bd78e-8a41-46d7-8935-7eb73cbbae66";
    
    // Elementi DOM
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const articleSection = document.getElementById('articleSection');
    const socialSection = document.getElementById('socialSection');
    const articleViewer = document.getElementById('articleViewer');
    
    // Recupera parametri dall'URL
    const params = new URLSearchParams(window.location.search);
    const blogId = params.get('blog_id');
    const lang = params.get('lang') || 'it';
    const apiCredentials = {
        vat: params.get('vat'),
        token: params.get('token'),
        owner: params.get('owner'),
        ragione_sociale: params.get('ragione_sociale')
    };
    const bonusCredits = params.get('bonus_credits');

    // Carica traduzioni
    const t = i18n[lang] || i18n['it'];
    applyTranslations(t);

    // Telegram WebApp init
    const tg = window.Telegram.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
    }

    // Mostra bonus credits se disponibili
    if (bonusCredits && parseInt(bonusCredits) > 0) {
        if (tg && tg.showPopup) {
            tg.showPopup({
                title: "🎮 Bonus!",
                message: `Hai guadagnato ${bonusCredits} punti bonus giocando!`
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
                lang: lang
            })
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        
        if (data.status === 'error') {
            throw new Error(data.message || 'Unknown error');
        }

        // Nasconde loading e mostra contenuto
        loadingState.style.display = 'none';
        articleSection.style.display = 'block';
        socialSection.style.display = 'block';

        // Carica articolo HTML
        if (data.article_html) {
            articleViewer.innerHTML = data.article_html;
        } else {
            articleViewer.innerHTML = '<p style="color: var(--text-muted);">Contenuto non disponibile</p>';
        }

        // Carica testi social
        loadSocialTexts(data.social_texts || {});

        // Configura pulsanti
        setupButtons(blogId, apiCredentials, lang, t);

    } catch (error) {
        console.error('Error loading blog:', error);
        showError(t.errorTitle, `${t.errorMessage}\n${error.message}`);
    }

    function applyTranslations(translations) {
        document.getElementById('pageTitle').innerHTML = `<i class="fas fa-edit"></i> ${translations.pageTitle}`;
        document.getElementById('pageSubtitle').textContent = translations.pageSubtitle;
        document.getElementById('loadingText').textContent = translations.loadingText;
        document.getElementById('errorTitle').textContent = translations.errorTitle;
        document.getElementById('errorMessage').textContent = translations.errorMessage;
        document.getElementById('btnBack').textContent = translations.btnBack;
        document.getElementById('articleTitle').textContent = translations.articleTitle;
        document.getElementById('socialTitle').textContent = translations.socialTitle;
        document.getElementById('btnPublishText').textContent = translations.btnPublishText;
        document.getElementById('btnEditText').textContent = translations.btnEditText;
        
        // Copy buttons
        document.querySelectorAll('.copy-btn span').forEach(el => {
            if (el.id.startsWith('btnCopy')) el.textContent = translations.btnCopy;
        });
    }

    function loadSocialTexts(socialTexts) {
        // Facebook
        if (socialTexts.facebook) {
            document.getElementById('facebookBox').style.display = 'block';
            document.getElementById('facebookText').textContent = socialTexts.facebook;
        }

        // Instagram
        if (socialTexts.instagram) {
            document.getElementById('instagramBox').style.display = 'block';
            document.getElementById('instagramText').textContent = socialTexts.instagram;
        }

        // Twitter/X
        if (socialTexts.twitter) {
            document.getElementById('twitterBox').style.display = 'block';
            document.getElementById('twitterText').textContent = socialTexts.twitter;
        }

        // LinkedIn
        if (socialTexts.linkedin) {
            document.getElementById('linkedinBox').style.display = 'block';
            document.getElementById('linkedinText').textContent = socialTexts.linkedin;
        }
    }

    function setupButtons(blogId, credentials, lang, translations) {
        const btnPublish = document.getElementById('btnPublish');
        const btnEdit = document.getElementById('btnEdit');

        // Pulsante Pubblica
        btnPublish.addEventListener('click', async () => {
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            
            btnPublish.disabled = true;
            btnPublish.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';

            try {
                const response = await fetch(WEBHOOK_BLOG_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'publish_blog',
                        blog_id: blogId,
                        vat_number: credentials.vat,
                        token: credentials.token,
                        chat_id: credentials.owner,
                        lang: lang
                    })
                });

                const data = await response.json();
                
                if (data.status === 'success') {
                    if (tg && tg.showPopup) {
                        tg.showPopup({
                            title: "✅ Successo",
                            message: translations.publishSuccess
                        });
                    } else {
                        alert(translations.publishSuccess);
                    }
                    
                    // Redirect to dashboard after 2 seconds
                    setTimeout(() => {
                        window.location.href = `dashboard.html?vat=${credentials.vat}&owner=${credentials.owner}&ragione_sociale=${credentials.ragione_sociale}&token=${credentials.token}`;
                    }, 2000);
                } else {
                    throw new Error(data.message || translations.publishError);
                }

            } catch (error) {
                console.error('Publish error:', error);
                alert(`${translations.publishError}: ${error.message}`);
                btnPublish.disabled = false;
                btnPublish.innerHTML = `<i class="fas fa-rocket"></i> ${translations.btnPublishText}`;
            }
        });

        // Pulsante Modifica (TODO: implementare editor)
        btnEdit.addEventListener('click', () => {
            if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            alert('Funzionalità di editing in arrivo!');
        });
    }

    function showError(title, message) {
        loadingState.style.display = 'none';
        errorState.style.display = 'block';
        document.getElementById('errorTitle').textContent = title;
        document.getElementById('errorMessage').textContent = message;
    }
});

// Funzione globale per copiare testo
function copyToClipboard(elementId, button) {
    const text = document.getElementById(elementId).textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(button);
        }).catch(err => {
            console.error('Copy failed:', err);
            fallbackCopy(text, button);
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
    
    try {
        document.execCommand('copy');
        showCopyFeedback(button);
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }
    
    document.body.removeChild(textarea);
}

function showCopyFeedback(button) {
    const originalHTML = button.innerHTML;
    button.classList.add('copied');
    button.innerHTML = '<i class="fas fa-check"></i> Copiato!';
    
    const tg = window.Telegram?.WebApp;
    if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    
    setTimeout(() => {
        button.classList.remove('copied');
        button.innerHTML = originalHTML;
    }, 2000);
}
