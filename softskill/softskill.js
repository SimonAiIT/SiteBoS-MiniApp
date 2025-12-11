// Soft Skill Selector - Main Application
// Integrato con sistema moduli e webhook Make.com

let questions = [];
let currentQuestionIndex = 0;
let answers = {};
let webhook;
let moduleId = 'complete';
let startTime;

// Carica le domande usando il loader
async function loadQuestions() {
    try {
        // Inizializza webhook handler
        webhook = new WebhookHandler();
        
        // Recupera parametro modulo dall'URL
        const urlParams = new URLSearchParams(window.location.search);
        moduleId = urlParams.get('module') || 'complete';
        
        // Usa il loader per caricare tutti i file TypeScript
        const allQuestions = await getQuestions();
        
        if (allQuestions.length === 0) {
            throw new Error('Nessuna domanda caricata');
        }
        
        // Filtra domande per modulo
        if (moduleId !== 'complete' && MODULE_MAPPING[moduleId]) {
            const moduleQuestionNums = MODULE_MAPPING[moduleId].questions;
            questions = allQuestions.filter(q => moduleQuestionNums.includes(q.num));
            
            // 🔥 RIMUOVI DUPLICATI (stesso num)
            const seenNums = new Set();
            questions = questions.filter(q => {
                if (seenNums.has(q.num)) {
                    console.warn(`⚠️ Domanda duplicata rimossa: Q${q.num}`);
                    return false;
                }
                seenNums.add(q.num);
                return true;
            });
            
            console.log(`🎯 Caricato modulo: ${MODULE_MAPPING[moduleId].name}`);
        } else {
            questions = allQuestions;
            console.log(`🎯 Caricato percorso completo`);
        }
        
        console.log(`✅ ${questions.length} domande pronte!`);
        
        // Salva tempo inizio
        startTime = Date.now();
        
        displayQuestion();
        
    } catch (error) {
        console.error('❌ Errore nel caricamento:', error);
        document.getElementById('scenario').innerHTML = 
            `<div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>Errore di caricamento</strong>
                <p>${error.message}</p>
                <p style="font-size: 12px; margin-top: 10px;">Assicurati di aver copiato tutti i file .ts nella cartella questions/</p>
            </div>`;
    }
}

// 🔥 Funzione che prova png, jpg, jpeg in ordine
function tryImageFormats(questionNum, optionIndex) {
    const formats = ['png', 'jpg', 'jpeg'];
    const basePath = `../images/softskill/question${questionNum}/${optionIndex + 1}`;
    
    return formats.map(ext => `${basePath}.${ext}`);
}

// Mostra la domanda corrente
function displayQuestion() {
    if (!questions.length) return;

    const question = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    // Aggiorna progress bar
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = 
        `Domanda ${currentQuestionIndex + 1} di ${questions.length}`;

    // Mostra scenario
    document.getElementById('scenario').textContent = question.scenario;

    // Mostra opzioni (2x2 grid)
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const card = document.createElement('div');
        card.className = 'option-card';
        if (answers[currentQuestionIndex] === index) {
            card.classList.add('selected');
        }

        // 🔥 Prova tutti i formati possibili
        const imagePaths = tryImageFormats(question.num, index);
        
        const img = document.createElement('img');
        img.className = 'option-image';
        img.alt = question.captions[index];
        
        let currentFormatIndex = 0;
        
        // Funzione ricorsiva che prova i formati
        const tryNextFormat = () => {
            if (currentFormatIndex < imagePaths.length) {
                img.src = imagePaths[currentFormatIndex];
                currentFormatIndex++;
            } else {
                // Nessun formato ha funzionato, nascondi l'immagine
                img.style.display = 'none';
                console.warn(`⚠️ Immagine non trovata per Q${question.num} opzione ${index + 1}`);
            }
        };
        
        img.onerror = tryNextFormat;
        tryNextFormat(); // Inizia con il primo formato (png)
        
        const caption = document.createElement('div');
        caption.className = 'option-caption';
        caption.textContent = question.captions[index];
        
        card.appendChild(img);
        card.appendChild(caption);

        // 🔥 Click diretto avanza alla domanda successiva
        card.onclick = () => selectOptionAndAdvance(index);
        optionsContainer.appendChild(card);
    });

    updateNavigation();
}

// 🆕 Seleziona un'opzione e avanza automaticamente
function selectOptionAndAdvance(index) {
    answers[currentQuestionIndex] = index;
    
    // Breve delay per mostrare la selezione prima di avanzare
    displayQuestion();
    
    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            finishQuiz();
        }
    }, 300);
}

// Aggiorna i bottoni di navigazione
function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = currentQuestionIndex === 0;
    
    // Il bottone "Avanti" ora è sempre attivo (per chi vuole saltare)
    nextBtn.disabled = false;

    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.innerHTML = '<i class="fas fa-trophy"></i> Vedi Risultati';
    } else {
        nextBtn.innerHTML = 'Salta <i class="fas fa-forward"></i>';
    }
}

// Domanda successiva (ora serve solo per "Salta" o "Vedi Risultati")
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        finishQuiz();
    }
}

// Domanda precedente
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 🔥 NUOVO: Mostra overlay di valutazione con sponsor
function showEvaluationOverlay() {
    // Crea overlay se non esiste
    let overlay = document.getElementById('evaluationOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'evaluationOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        overlay.innerHTML = `
            <div style="text-align: center; max-width: 500px; width: 100%;">
                <!-- ICON ANIMATO -->
                <div style="margin-bottom: 30px;">
                    <i class="fas fa-brain" style="font-size: 64px; color: var(--primary); animation: pulse 2s ease-in-out infinite;"></i>
                </div>
                
                <!-- TITOLO -->
                <h2 style="color: #fff; font-size: 28px; margin-bottom: 12px; font-weight: 700;">
                    🧠 Valutazione in Corso...
                </h2>
                
                <!-- SOTTOTITOLO -->
                <p style="color: var(--text-muted); font-size: 16px; margin-bottom: 30px; line-height: 1.6;">
                    La nostra AI sta analizzando le tue risposte e generando il profilo personalizzato.
                    <br><strong style="color: var(--primary);">Ci vorranno pochi secondi.</strong>
                </p>
                
                <!-- PROGRESS BAR -->
                <div style="background: rgba(255,255,255,0.1); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 40px;">
                    <div id="evalProgressBar" style="background: linear-gradient(90deg, #5b6fed, #4cd964); height: 100%; width: 0%; transition: width 0.3s ease; border-radius: 4px;"></div>
                </div>
                
                <!-- SPONSOR CAROUSEL -->
                <div style="margin-bottom: 20px;">
                    <p style="color: var(--text-muted); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; opacity: 0.7;">
                        Nel frattempo, scopri i nostri pacchetti crediti
                    </p>
                    <div id="sponsorCarousel" style="min-height: 100px;"></div>
                </div>
            </div>
            
            <style>
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
            </style>
        `;
        
        document.body.appendChild(overlay);
    }
    
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Avvia animazione progress bar (simulata)
    const progressBar = document.getElementById('evalProgressBar');
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90; // Non superare 90% finché non finisce davvero
        progressBar.style.width = `${progress}%`;
    }, 500);
    
    // Salva l'interval per pulirlo dopo
    overlay.dataset.progressInterval = progressInterval;
    
    // Inizializza sponsor carousel
    if (window.SponsorManager) {
        window.SponsorManager.inject('#sponsorCarousel', 'loader');
    }
}

// 🔥 CHIUDI OVERLAY E COMPLETA PROGRESS
function closeEvaluationOverlay() {
    const overlay = document.getElementById('evaluationOverlay');
    if (overlay) {
        // Completa progress bar
        const progressBar = document.getElementById('evalProgressBar');
        if (progressBar) progressBar.style.width = '100%';
        
        // Ferma animazione progress
        const intervalId = overlay.dataset.progressInterval;
        if (intervalId) clearInterval(parseInt(intervalId));
        
        // Chiudi dopo breve delay
        setTimeout(() => {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 500);
    }
}

// 🔥 AGGIORNATO: Invia risposte e gestisce overlay
async function finishQuiz() {
    const completionTime = Math.floor((Date.now() - startTime) / 1000);
    
    // 🔥 MOSTRA OVERLAY IMMEDIATAMENTE
    showEvaluationOverlay();
    
    // 🔥 PREPARA SOLO LE RISPOSTE SENZA CALCOLARE NULLA
    const answersArray = [];

    questions.forEach((question, index) => {
        const selectedOption = answers[index];
        if (selectedOption !== undefined) {
            const optionObject = question.options[selectedOption];
            const skills = question.softSkill.split(', ').map(s => s.trim());
            
            answersArray.push({
                question_num: question.num,
                scenario: question.scenario,
                answer: optionObject.value,
                answer_text: optionObject.text,
                soft_skills: skills
            });
        }
    });

    // 🔥 INVIA AL WEBHOOK
    try {
        const moduleData = {
            module_id: moduleId,
            module_name: moduleId !== 'complete' ? MODULE_MAPPING[moduleId].name : 'Percorso Completo',
            total_questions: questions.length,
            answered_questions: answersArray.length,
            completion_time_seconds: completionTime,
            completion_date: new Date().toISOString(),
            answers: answersArray
        };
        
        await webhook.saveModule(moduleData);
        
        console.log('✅ Risposte inviate con successo! La valutazione è stata completata dal backend.');
        
        // 🔥 CHIUDI OVERLAY
        closeEvaluationOverlay();
        
        // 🔥 REDIRECT AUTOMATICO SENZA ALERT
        setTimeout(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const params = new URLSearchParams();
            
            if (urlParams.get('vat')) params.set('vat', urlParams.get('vat'));
            if (urlParams.get('user_id')) params.set('user_id', urlParams.get('user_id'));
            if (urlParams.get('token')) params.set('token', urlParams.get('token'));
            if (urlParams.get('owner')) params.set('owner', urlParams.get('owner'));
            if (urlParams.get('ragione_sociale')) params.set('ragione_sociale', urlParams.get('ragione_sociale'));
            
            window.location.href = `dashboard.html?${params.toString()}`;
        }, 800);
        
    } catch (error) {
        console.error('❌ Errore salvataggio webhook:', error);
        
        // Chiudi overlay anche in caso di errore
        closeEvaluationOverlay();
        
        setTimeout(() => {
            alert('⚠️ Errore nel salvataggio dati. Riprova più tardi.');
        }, 600);
    }
}

// Ricomincia il quiz
function restartQuiz() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = new URLSearchParams();
    
    if (urlParams.get('vat')) params.set('vat', urlParams.get('vat'));
    if (urlParams.get('user_id')) params.set('user_id', urlParams.get('user_id'));
    if (urlParams.get('token')) params.set('token', urlParams.get('token'));
    if (urlParams.get('owner')) params.set('owner', urlParams.get('owner'));
    if (urlParams.get('ragione_sociale')) params.set('ragione_sociale', urlParams.get('ragione_sociale'));
    
    window.location.href = `dashboard.html?${params.toString()}`;
}

// Inizializza al caricamento della pagina
window.addEventListener('DOMContentLoaded', loadQuestions);