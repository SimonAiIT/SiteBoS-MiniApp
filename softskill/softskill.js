// Soft Skill Selector - Main Logic
// Vanilla JavaScript Implementation

let questions = [];
let currentQuestionIndex = 0;
let answers = {};

// Carica le domande
async function loadQuestions() {
    try {
        const response = await fetch('questions_data.json');
        questions = await response.json();
        displayQuestion();
    } catch (error) {
        console.error('Errore nel caricamento delle domande:', error);
        document.getElementById('scenario').innerHTML = 
            '<p style="color: red;">⚠️ Errore nel caricamento delle domande. Assicurati che questions_data.json sia presente.</p>';
    }
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

    // Mostra opzioni
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const card = document.createElement('div');
        card.className = 'option-card';
        if (answers[currentQuestionIndex] === index) {
            card.classList.add('selected');
        }

        const imgPath = `../images/softskill/question${question.num}/${index + 1}.png`;
        
        card.innerHTML = `
            <img src="${imgPath}" 
                 alt="${question.captions[index]}" 
                 class="option-image"
                 onerror="this.src='../images/softskill/${index + 1}.png'">
            <div class="option-caption">${question.captions[index]}</div>
        `;

        card.onclick = () => selectOption(index);
        optionsContainer.appendChild(card);
    });

    updateNavigation();
}

// Seleziona un'opzione
function selectOption(index) {
    answers[currentQuestionIndex] = index;
    displayQuestion();
}

// Aggiorna i bottoni di navigazione
function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = answers[currentQuestionIndex] === undefined;

    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.textContent = '🎯 Vedi Risultati';
    } else {
        nextBtn.textContent = 'Successiva ➡️';
    }
}

// Domanda successiva
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        showResults();
    }
}

// Domanda precedente
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
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

    // Mostra risultati
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.innerHTML = sortedSkills.map(([skill, count]) => `
        <div class="skill-result">
            <strong>${skill}</strong>: ${count} occorrenze
            <div style="background: linear-gradient(90deg, #667eea ${(count / questions.length) * 100}%, #e0e0e0 0%); height: 10px; border-radius: 5px; margin-top: 5px;"></div>
        </div>
    `).join('');

    document.getElementById('questionSection').style.display = 'none';
    document.querySelector('.navigation').style.display = 'none';
    document.getElementById('results').classList.add('active');

    // Salva in localStorage
    localStorage.setItem('softSkillResults', JSON.stringify({
        answers,
        skills: sortedSkills,
        completedAt: new Date().toISOString()
    }));
}

// Ricomincia il quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    answers = {};
    localStorage.removeItem('softSkillResults');

    document.getElementById('questionSection').style.display = 'block';
    document.querySelector('.navigation').style.display = 'flex';
    document.getElementById('results').classList.remove('active');

    displayQuestion();
}

// Inizializza al caricamento della pagina
window.addEventListener('DOMContentLoaded', loadQuestions);
