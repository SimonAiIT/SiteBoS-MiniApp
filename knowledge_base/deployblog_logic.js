'use strict';

// DIZIONARIO TRADUZIONI (6 lingue) - AGGIORNATO CON "CREDITI"
const i18n = {
    it: {
        pageTitle: "Generatore Blog IA",
        pageSubtitle: "Trasforma questo frammento di conoscenza in un articolo SEO completo.",
        loadingText: "Caricamento ID...",
        btnStart: "Genera Blog Post",
        btnBack: "Torna alla Knowledge Base",
        confirmTitle: "Conferma Operazione",
        confirmMessage: "Stai per spendere <strong>100 crediti</strong> per generare questo articolo blog con l'IA.<br><br>Vuoi procedere?",
        btnCancel: "Annulla",
        btnProceed: "Procedi",
        processingTitle: "Generazione in Corso",
        processingSubtitle: "L'intelligenza artificiale sta creando il tuo contenuto...",
        fragmentId: "Frammento ID:",
        logStart: "> Avvio richiesta per ID:",
        logCredits: "> 💰 Scalamento 100 crediti in corso...",
        logResponse: "> Risposta ricevuta dal server.",
        logSuccess: "> ✅ Blog post generato con successo!",
        logError: "> ❌ Errore:",
        logCancelled: "> ❌ Operazione annullata dall'utente.",
        errorMissingId: "Errore: ID frammento mancante."
    },
    en: {
        pageTitle: "AI Blog Generator",
        pageSubtitle: "Transform this knowledge fragment into a complete SEO article.",
        loadingText: "Loading ID...",
        btnStart: "Generate Blog Post",
        btnBack: "Back to Knowledge Base",
        confirmTitle: "Confirm Operation",
        confirmMessage: "You are about to spend <strong>100 credits</strong> to generate this blog article with AI.<br><br>Do you want to proceed?",
        btnCancel: "Cancel",
        btnProceed: "Proceed",
        processingTitle: "Generation in Progress",
        processingSubtitle: "The artificial intelligence is creating your content...",
        fragmentId: "Fragment ID:",
        logStart: "> Starting request for ID:",
        logCredits: "> 💰 Deducting 100 credits...",
        logResponse: "> Response received from server.",
        logSuccess: "> ✅ Blog post generated successfully!",
        logError: "> ❌ Error:",
        logCancelled: "> ❌ Operation cancelled by user.",
        errorMissingId: "Error: Fragment ID missing."
    },
    fr: {
        pageTitle: "Générateur de Blog IA",
        pageSubtitle: "Transformez ce fragment de connaissance en un article SEO complet.",
        loadingText: "Chargement de l'ID...",
        btnStart: "Générer Article de Blog",
        btnBack: "Retour à la Base de Connaissances",
        confirmTitle: "Confirmer l'Opération",
        confirmMessage: "Vous allez dépenser <strong>100 crédits</strong> pour générer cet article de blog avec l'IA.<br><br>Voulez-vous continuer?",
        btnCancel: "Annuler",
        btnProceed: "Continuer",
        processingTitle: "Génération en Cours",
        processingSubtitle: "L'intelligence artificielle crée votre contenu...",
        fragmentId: "ID du Fragment:",
        logStart: "> Démarrage de la requête pour l'ID:",
        logCredits: "> 💰 Déduction de 100 crédits...",
        logResponse: "> Réponse reçue du serveur.",
        logSuccess: "> ✅ Article de blog généré avec succès!",
        logError: "> ❌ Erreur:",
        logCancelled: "> ❌ Opération annulée par l'utilisateur.",
        errorMissingId: "Erreur: ID du fragment manquant."
    },
    de: {
        pageTitle: "KI-Blog-Generator",
        pageSubtitle: "Verwandeln Sie dieses Wissensfragment in einen vollständigen SEO-Artikel.",
        loadingText: "ID wird geladen...",
        btnStart: "Blog-Beitrag Generieren",
        btnBack: "Zurück zur Wissensdatenbank",
        confirmTitle: "Operation Bestätigen",
        confirmMessage: "Sie sind dabei, <strong>100 Credits</strong> auszugeben, um diesen Blog-Artikel mit KI zu generieren.<br><br>Möchten Sie fortfahren?",
        btnCancel: "Abbrechen",
        btnProceed: "Fortfahren",
        processingTitle: "Generierung Läuft",
        processingSubtitle: "Die künstliche Intelligenz erstellt Ihren Inhalt...",
        fragmentId: "Fragment-ID:",
        logStart: "> Anfrage für ID wird gestartet:",
        logCredits: "> 💰 100 Credits werden abgezogen...",
        logResponse: "> Antwort vom Server erhalten.",
        logSuccess: "> ✅ Blog-Beitrag erfolgreich generiert!",
        logError: "> ❌ Fehler:",
        logCancelled: "> ❌ Operation vom Benutzer abgebrochen.",
        errorMissingId: "Fehler: Fragment-ID fehlt."
    },
    es: {
        pageTitle: "Generador de Blog IA",
        pageSubtitle: "Transforma este fragmento de conocimiento en un artículo SEO completo.",
        loadingText: "Cargando ID...",
        btnStart: "Generar Artículo de Blog",
        btnBack: "Volver a la Base de Conocimiento",
        confirmTitle: "Confirmar Operación",
        confirmMessage: "Estás a punto de gastar <strong>100 créditos</strong> para generar este artículo de blog con IA.<br><br>¿Quieres continuar?",
        btnCancel: "Cancelar",
        btnProceed: "Continuar",
        processingTitle: "Generación en Curso",
        processingSubtitle: "La inteligencia artificial está creando tu contenido...",
        fragmentId: "ID del Fragmento:",
        logStart: "> Iniciando solicitud para ID:",
        logCredits: "> 💰 Descontando 100 créditos...",
        logResponse: "> Respuesta recibida del servidor.",
        logSuccess: "> ✅ ¡Artículo de blog generado con éxito!",
        logError: "> ❌ Error:",
        logCancelled: "> ❌ Operación cancelada por el usuario.",
        errorMissingId: "Error: ID del fragmento faltante."
    },
    pt: {
        pageTitle: "Gerador de Blog IA",
        pageSubtitle: "Transforme este fragmento de conhecimento em um artigo SEO completo.",
        loadingText: "Carregando ID...",
        btnStart: "Gerar Artigo de Blog",
        btnBack: "Voltar à Base de Conhecimento",
        confirmTitle: "Confirmar Operação",
        confirmMessage: "Você está prestes a gastar <strong>100 créditos</strong> para gerar este artigo de blog com IA.<br><br>Deseja prosseguir?",
        btnCancel: "Cancelar",
        btnProceed: "Prosseguir",
        processingTitle: "Geração em Andamento",
        processingSubtitle: "A inteligência artificial está criando seu conteúdo...",
        fragmentId: "ID do Fragmento:",
        logStart: "> Iniciando solicitação para ID:",
        logCredits: "> 💰 Deduzindo 100 créditos...",
        logResponse: "> Resposta recebida do servidor.",
        logSuccess: "> ✅ Artigo de blog gerado com sucesso!",
        logError: "> ❌ Erro:",
        logCancelled: "> ❌ Operação cancelada pelo usuário.",
        errorMissingId: "Erro: ID do fragmento ausente."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const WEBHOOK_BLOG_URL = "https://trinai.api.workflow.dcmake.it/webhook/914bd78e-8a41-46d7-8935-7eb73cbbae66";
    
    // Elementi DOM
    const startBtn = document.getElementById('startBtn');
    const logArea = document.getElementById('logArea');
    const previewInfo = document.getElementById('previewInfo');
    const backBtn = document.getElementById('backBtn');
    const confirmOverlay = document.getElementById('confirmOverlay');
    const confirmCancel = document.getElementById('confirmCancel');
    const confirmProceed = document.getElementById('confirmProceed');

    // Recupera parametri dall'URL
    const params = new URLSearchParams(window.location.search);
    const fragmentId = params.get('fragment_id');
    const lang = params.get('lang') || 'it';
    const apiCredentials = {
        vat: params.get('vat'),
        token: params.get('token'),
        owner: params.get('owner'),
        ragione_sociale: params.get('ragione_sociale')
    };

    // Carica traduzioni
    const t = i18n[lang] || i18n['it'];
    applyTranslations(t);

    // Telegram WebApp init
    const tg = window.Telegram.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
    }

    // Verifica ID frammento
    if (!fragmentId) {
        log(t.errorMissingId, logArea);
        logArea.style.display = 'block';
        startBtn.disabled = true;
        return;
    }

    document.getElementById('loadingText').textContent = `${t.fragmentId} ${fragmentId}`;

    // Configura pulsante "Indietro"
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.back();
    });

    // Click su "Genera Blog Post" -> Mostra overlay conferma
    startBtn.addEventListener('click', () => {
        confirmOverlay.style.display = 'flex';
        if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    });

    // Click su "Annulla" in overlay conferma
    confirmCancel.addEventListener('click', () => {
        confirmOverlay.style.display = 'none';
        log(t.logCancelled, logArea);
        logArea.style.display = 'block';
        if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    });

    // Click su "Procedi" in overlay conferma -> Avvia generazione CON MINIGAME
    confirmProceed.addEventListener('click', async () => {
        confirmOverlay.style.display = 'none';
        
        // ✅ AVVIA MINIGAME (copiato da processor.html)
        if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
        openGame();

        try {
            const response = await fetch(WEBHOOK_BLOG_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create',
                    fragment_id: fragmentId,
                    vat_number: apiCredentials.vat,
                    token: apiCredentials.token,
                    chat_id: apiCredentials.owner,
                    ragione_sociale: apiCredentials.ragione_sociale,
                    lang: lang
                })
            });

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            const data = await response.json();
            
            if (data.status === 'success' || data.blog_id) {
                console.log('✅ Blog generato con successo!');
                
                // Stop minigame e ottieni punteggio
                let bonusCredits = 0;
                if (window.MiniGame && MiniGame.active) {
                    bonusCredits = Math.min(MiniGame.score || 0, 500); // CAP a 500
                    MiniGame.stop();
                    console.log(`🎮 Crediti bonus guadagnati: ${bonusCredits}`);
                }
                
                closeGame();
                
                // Attendi 1 secondo
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Redirect a edit_blog.html
                const editUrl = new URL('edit_blog.html', window.location.href);
                editUrl.searchParams.set('blog_id', data.blog_id || fragmentId);
                editUrl.searchParams.set('vat', apiCredentials.vat);
                editUrl.searchParams.set('token', apiCredentials.token);
                editUrl.searchParams.set('owner', apiCredentials.owner);
                editUrl.searchParams.set('ragione_sociale', apiCredentials.ragione_sociale);
                editUrl.searchParams.set('lang', lang);
                if (bonusCredits > 0) editUrl.searchParams.set('bonus_credits', bonusCredits);
                
                window.location.href = editUrl.toString();

            } else {
                throw new Error(data.error || 'Unknown error');
            }

        } catch (error) {
            console.error(error);
            closeGame();
            alert(`${t.logError} ${error.message}`);
        }
    });

    function applyTranslations(translations) {
        document.getElementById('pageTitle').textContent = translations.pageTitle;
        document.getElementById('pageSubtitle').textContent = translations.pageSubtitle;
        document.getElementById('loadingText').textContent = translations.loadingText;
    }

    function log(msg, target) {
        target = target || logArea;
        target.innerHTML += `<div class="terminal-line">${msg}</div>`;
        target.scrollTop = target.scrollHeight;
    }
});