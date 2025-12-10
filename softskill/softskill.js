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

// 🔥 NUOVO: Invia solo risposte grezze - la valutazione la fa il backend!
async function finishQuiz() {
    const completionTime = Math.floor((Date.now() - startTime) / 1000);
    
    // 🔥 PREPARA SOLO LE RISPOSTE SENZA CALCOLARE NULLA
    const answersArray = [];

    questions.forEach((question, index) => {
        const selectedOption = answers[index];
        if (selectedOption !== undefined) {
            const optionObject = question.options[selectedOption];
            const skills = question.softSkill.split(', ').map(s => s.trim());
            
            // Prepara array risposte GREZZE per webhook
            answersArray.push({
                question_num: question.num,
                scenario: question.scenario,
                answer: optionObject.value,
                answer_text: optionObject.text,
                option: optionObject,
                soft_skills: skills
            });
        }
    });

    // 🔥 INVIA AL WEBHOOK - LA VALUTAZIONE LA FA IL BACKEND!
    try {
        const moduleData = {
            module_id: moduleId,
            module_name: moduleId !== 'complete' ? MODULE_MAPPING[moduleId].name : 'Percorso Completo',
            total_questions: questions.length,
            answered_questions: answersArray.length,
            completion_time_seconds: completionTime,
            completion_date: new Date().toISOString(),
            answers: answersArray
            // ❌ RIMOSSO: results, skillPercentages, sortedSkills
            // 👆 LA VALUTAZIONE LA FA IL BACKEND!
        };
        
        await webhook.saveModule(moduleData);
        
        console.log('✅ Risposte inviate con successo! La valutazione verrà fatta dal backend.');
        
        // Redirect alla dashboard per vedere i risultati calcolati dal backend
        const urlParams = new URLSearchParams(window.location.search);
        const vat = urlParams.get('vat') || 'TEST_VAT';
        const userId = urlParams.get('user_id') || 'TEST_USER';
        
        alert('✅ Test completato! Verrai reindirizzato alla dashboard per vedere i risultati.');
        window.location.href = `dashboard.html?vat=${vat}&user_id=${userId}`;
        
    } catch (error) {
        console.error('❌ Errore salvataggio webhook:', error);
        alert('⚠️ Errore nel salvataggio dati. Riprova più tardi.');
    }
}

// Ricomincia il quiz
function restartQuiz() {
    // Torna alla dashboard invece di riavviare
    const urlParams = new URLSearchParams(window.location.search);
    const vat = urlParams.get('vat') || 'TEST_VAT';
    const userId = urlParams.get('user_id') || 'TEST_USER';
    window.location.href = `dashboard.html?vat=${vat}&user_id=${userId}`;
}

// Inizializza al caricamento della pagina
window.addEventListener('DOMContentLoaded', loadQuestions);