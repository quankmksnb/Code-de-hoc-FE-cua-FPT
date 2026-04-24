let questions = [];
let currentIndex = 0;
let answeredCount = 0;
let correctCount = 0;

const questionCard = document.getElementById('question-card');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressText = document.getElementById('progress-text');
const feedbackText = document.getElementById('feedback-text');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const completionState = document.getElementById('completion-state');
const scoreText = document.getElementById('score-text');

// Load questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        
        if (questions.length === 0) {
            questionText.innerText = "No questions found in the document.";
            return;
        }

        showQuestion(currentIndex);
    } catch (error) {
        console.error('Error loading questions:', error);
        questionText.innerText = "Error loading questions. Make sure questions.json exists.";
    }
}

function showQuestion(index) {
    const q = questions[index];
    questionText.innerText = q.question;
    progressText.innerText = `Question ${index + 1} of ${questions.length}`;
    
    optionsContainer.innerHTML = '';
    feedbackText.innerText = '';
    
    q.options.forEach(option => {
        const div = document.createElement('div');
        div.className = 'option';
        div.innerHTML = `
            <div class="option-letter">${option.letter.toUpperCase()}</div>
            <div class="option-content">${option.text}</div>
        `;
        
        div.addEventListener('click', () => handleAnswer(div, option));
        optionsContainer.appendChild(div);
    });

    prevBtn.disabled = index === 0;
    nextBtn.innerText = index === questions.length - 1 ? 'Finish' : 'Next';
}

function handleAnswer(element, option) {
    // Prevent multiple clicks if already answered (optional, but good for UX)
    if (optionsContainer.classList.contains('answered')) return;
    
    optionsContainer.classList.add('answered');
    
    if (option.isCorrect) {
        element.classList.add('correct');
        feedbackText.innerText = 'Correct! ✨';
        feedbackText.style.color = 'var(--success)';
        correctCount++;
    } else {
        element.classList.add('wrong');
        feedbackText.innerText = 'Wrong. Try again next time.';
        feedbackText.style.color = 'var(--error)';
        
        // Show the correct answer
        const options = optionsContainer.querySelectorAll('.option');
        const q = questions[currentIndex];
        const correctIndex = q.options.findIndex(o => o.isCorrect);
        if (correctIndex !== -1) {
            options[correctIndex].classList.add('correct');
        }
    }
    
    answeredCount++;
}

nextBtn.addEventListener('click', () => {
    if (currentIndex < questions.length - 1) {
        currentIndex++;
        optionsContainer.classList.remove('answered');
        showQuestion(currentIndex);
    } else {
        showCompletion();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        optionsContainer.classList.remove('answered');
        showQuestion(currentIndex);
    }
});

function showCompletion() {
    questionCard.classList.add('hidden');
    completionState.classList.remove('hidden');
    scoreText.innerText = `You finished all ${questions.length} questions.`;
}

// Start
loadQuestions();
