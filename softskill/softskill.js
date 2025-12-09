// Soft Skill Selector - Main Application
// Carica direttamente i file TypeScript dalla cartella questions/

let questions = [];
let currentQuestionIndex = 0;
let answers = {};

// Carica le domande usando il loader
async function loadQuestions() {
    try {
        // Usa il loader per caricare tutti i file TypeScript
        questions = await getQuestions();
        
        if (questions.length === 0) {
            throw new Error('Nessuna domanda caricata');
        }
        
        console.log(`✅ ${questions.length} domande pronte!`);
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
            showResults();
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
        showResults();
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

// Mostra i risultati
function showResults() {
    const skillCounts = {};

    // Conta le soft skill
    questions.forEach((question, index) => {
        const selectedOption = answers[index];
        if (selectedOption !== undefined) {
            const skills = question.softSkill.split(', ');
            skills.forEach(skill => {
                skillCounts[skill] = (skillCounts[skill] || 0) + 1;
            });
        }
    });

    // Ordina per frequenza
    const sortedSkills = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    // Mostra risultati con il nuovo design
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.innerHTML = sortedSkills.map(([skill, count]) => {
        const percentage = Math.round((count / questions.length) * 100);
        return `
            <div class="skill-card">
                <div class="skill-name">
                    <i class="fas fa-star" style="color: var(--primary); margin-right: 8px;"></i>
                    ${skill}
                </div>
                <div class="skill-count">${count} occorrenze (${percentage}%)</div>
                <div class="skill-bar">
                    <div class="skill-bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');

    // Nascondi quiz, mostra risultati
    document.getElementById('questionSection').style.display = 'none';
    document.getElementById('navButtons').style.display = 'none';
    document.getElementById('results').classList.add('active');

    // Salva in localStorage
    localStorage.setItem('softSkillResults', JSON.stringify({
        answers,
        skills: sortedSkills,
        completedAt: new Date().toISOString()
    }));

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Ricomincia il quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    answers = {};
    localStorage.removeItem('softSkillResults');

    document.getElementById('questionSection').style.display = 'block';
    document.getElementById('navButtons').style.display = 'flex';
    document.getElementById('results').classList.remove('active');

    displayQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Inizializza al caricamento della pagina
window.addEventListener('DOMContentLoaded', loadQuestions);
