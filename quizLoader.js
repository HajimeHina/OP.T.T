// ===== QUIZ METADATA LOADER =====
const availableQuizzes = {
    "math": [
        {
            id: "algebra-basics",
            name: "Algebra Basics",
            description: "Fundamental algebra concepts and equations",
            difficulty: "Easy",
            author: "Hajime",
            questions: 15,
            estimatedTime: "10-15 min",
            categories: ["Equations", "Expressions", "Variables"],
            icon: "📐"
        },
        {
            id: "geometry-master",
            name: "Geometry Master",
            description: "Shapes, angles, and spatial reasoning",
            difficulty: "Medium",
            author: "AI",
            questions: 20,
            estimatedTime: "15-20 min",
            categories: ["Shapes", "Angles", "Theorems"],
            icon: "🔺"
        },
        {
            id: "calculus-challenge",
            name: "Calculus Challenge",
            description: "Advanced calculus problems",
            difficulty: "Hard",
            author: "Hajime",
            questions: 25,
            estimatedTime: "25-30 min",
            categories: ["Derivatives", "Integrals", "Limits"],
            icon: "📈"
        },
        {
            id: "trigonometry-tests",
            name: "Trigonometry Tests",
            description: "Trigonometric functions and identities",
            difficulty: "Medium",
            author: "AI",
            questions: 18,
            estimatedTime: "12-18 min",
            categories: ["Sine", "Cosine", "Tangent"],
            icon: "📐"
        },
        {
            id: "math-olympiad",
            name: "Math Olympiad",
            description: "Competition-level math problems",
            difficulty: "Hard",
            author: "Hajime",
            questions: 10,
            estimatedTime: "20-25 min",
            categories: ["Advanced", "Competition", "Logic"],
            icon: "🏆"
        }
    ],
    "physics": [
        {
            id: "mechanics-101",
            name: "Mechanics 101",
            description: "Motion, forces, and energy",
            difficulty: "Medium",
            author: "AI",
            questions: 20,
            estimatedTime: "15-20 min",
            categories: ["Motion", "Forces", "Energy"],
            icon: "⚙️"
        },
        {
            id: "electricity-fundamentals",
            name: "Electricity Fundamentals",
            description: "Circuits, current, and voltage",
            difficulty: "Medium",
            author: "Hajime",
            questions: 15,
            estimatedTime: "12-18 min",
            categories: ["Circuits", "Current", "Voltage"],
            icon: "⚡"
        }
        // ... add other physics quizzes
    ],
    "chemistry": [
        // ... add chemistry quizzes
    ],
    "english": [
        // ... add english quizzes
    ]
};

// Load quizzes for each subject
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('subjects.html') || window.location.pathname.includes('subjects')) {
        loadAllQuizzes();
    }
});

function loadAllQuizzes() {
    Object.keys(availableQuizzes).forEach(subject => {
        const container = document.getElementById(`${subject}-quizzes`);
        if (!container) return;
        
        const quizzes = availableQuizzes[subject];
        
        if (quizzes.length === 0) {
            container.innerHTML = '<div class="no-quizzes">No quizzes available for this subject yet.</div>';
            return;
        }
        
        let quizzesHTML = '';
        
        quizzes.forEach(quiz => {
            quizzesHTML += `
                <div class="quiz-card" onclick="startQuiz('${subject}', '${quiz.id}')">
                    <div class="quiz-header">
                        <div>
                            <div style="font-size: 1.5em; margin-bottom: 5px;">${quiz.icon}</div>
                            <h3 class="quiz-name">${quiz.name}</h3>
                        </div>
                        <div class="quiz-meta">
                            <span class="quiz-tag difficulty-${quiz.difficulty.toLowerCase()}">
                                ${quiz.difficulty}
                            </span>
                            <span class="quiz-tag author-${quiz.author.toLowerCase()}">
                                ${quiz.author}
                            </span>
                        </div>
                    </div>
                    <p style="font-size: 0.9em; color: #ccc; margin: 10px 0; min-height: 40px;">${quiz.description}</p>
                    <div class="quiz-stats">
                        <span>📝 ${quiz.questions} questions</span>
                        <span>⏱️ ${quiz.estimatedTime}</span>
                    </div>
                    <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 5px;">
                        ${quiz.categories.map(cat => 
                            `<span style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 10px; font-size: 0.75em;">${cat}</span>`
                        ).join('')}
                    </div>
                    <button class="start-quiz-btn" onclick="event.stopPropagation(); startQuiz('${subject}', '${quiz.id}')">
                        Start Quiz →
                    </button>
                </div>
            `;
        });
        
        container.innerHTML = quizzesHTML;
    });
}

// ===== QUIZ METADATA LOADER =====
// (Keep the availableQuizzes object as is...)

// Modified startQuiz function to include the quiz path
function startQuiz(subject, quizId) {
    sessionStorage.setItem('selectedQuiz', JSON.stringify({
        subject: subject,
        quizId: quizId,
        quizPath: `quizzes/${subject}/${quizId}.js`,
        timestamp: new Date().toISOString()
    }));
    window.location.href = `quiz.html?subject=${subject}&quiz=${quizId}`;
}

// Make function available globally
window.startQuiz = startQuiz;

// Add this function for quiz page initialization
function getQuizFromStorage() {
    const saved = sessionStorage.getItem('selectedQuiz');
    return saved ? JSON.parse(saved) : null;
}
