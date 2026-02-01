// Math - Algebra Basics Quiz (15 questions)
const algebraBasicsQuiz = {
    id: "algebra-basics",
    name: "Algebra Basics",
    subject: "math",
    author: "Hajime",
    difficulty: "Easy",
    description: "Fundamental algebra concepts and equations",
    questions: [
        {
            question: "Solve for x: 2x + 5 = 15",
            options: ["x = 5", "x = 10", "x = 7.5", "x = 3"],
            correct: 0,
            explanation: "2x + 5 = 15 → 2x = 10 → x = 5",
            category: "Linear Equations"
        },
        {
            question: "Simplify: 3(x + 4) - 2x",
            options: ["x + 12", "5x + 4", "3x + 10", "x + 4"],
            correct: 0,
            explanation: "3(x + 4) - 2x = 3x + 12 - 2x = x + 12",
            category: "Expressions"
        },
        {
            question: "What is the value of y if 3y - 7 = 8?",
            options: ["y = 5", "y = 3", "y = 7", "y = 15"],
            correct: 0,
            explanation: "3y - 7 = 8 → 3y = 15 → y = 5",
            category: "Linear Equations"
        },
        {
            question: "Factor: x² - 9",
            options: ["(x-3)(x+3)", "(x-9)(x+1)", "(x-3)²", "(x+3)²"],
            correct: 0,
            explanation: "Difference of squares: x² - 9 = (x-3)(x+3)",
            category: "Factoring"
        },
        {
            question: "Solve: 4x - 3 = 2x + 7",
            options: ["x = 5", "x = 2", "x = 10", "x = 1"],
            correct: 0,
            explanation: "4x - 3 = 2x + 7 → 2x = 10 → x = 5",
            category: "Linear Equations"
        },
        {
            question: "Simplify: (2x² - 3x + 1) + (x² + 2x - 3)",
            options: ["3x² - x - 2", "3x² + x - 2", "x² - x + 4", "3x² - 5x - 2"],
            correct: 0,
            explanation: "Combine like terms: 2x² + x² = 3x², -3x + 2x = -x, 1 - 3 = -2",
            category: "Polynomials"
        },
        {
            question: "Solve for a: a/3 = 12",
            options: ["a = 4", "a = 36", "a = 15", "a = 9"],
            correct: 1,
            explanation: "a/3 = 12 → a = 12 × 3 = 36",
            category: "Fractions"
        },
        {
            question: "What is the slope of the line y = 3x - 2?",
            options: ["3", "-2", "2", "-3"],
            correct: 0,
            explanation: "In y = mx + b, m is the slope. Here m = 3",
            category: "Linear Equations"
        },
        {
            question: "Solve the system: x + y = 10, x - y = 2",
            options: ["x=6, y=4", "x=8, y=2", "x=5, y=5", "x=7, y=3"],
            correct: 0,
            explanation: "Add equations: 2x = 12 → x=6, then 6 + y = 10 → y=4",
            category: "Systems"
        },
        {
            question: "Expand: (x + 2)(x + 3)",
            options: ["x² + 5x + 6", "x² + 6x + 5", "x² + 5", "x² + 6"],
            correct: 0,
            explanation: "FOIL method: x*x + x*3 + 2*x + 2*3 = x² + 3x + 2x + 6 = x² + 5x + 6",
            category: "Expanding"
        },
        {
            question: "What is 3² × 3³?",
            options: ["3⁵", "3⁶", "9⁵", "9⁶"],
            correct: 0,
            explanation: "When multiplying with same base, add exponents: 2 + 3 = 5 → 3⁵",
            category: "Exponents"
        },
        {
            question: "Solve: 2(x - 3) = 4x + 6",
            options: ["x = -6", "x = -3", "x = 0", "x = 3"],
            correct: 0,
            explanation: "2x - 6 = 4x + 6 → -6 - 6 = 4x - 2x → -12 = 2x → x = -6",
            category: "Linear Equations"
        },
        {
            question: "Factor: x² + 5x + 6",
            options: ["(x+2)(x+3)", "(x+1)(x+6)", "(x+5)(x+1)", "(x+2)(x+4)"],
            correct: 0,
            explanation: "Find two numbers that multiply to 6 and add to 5: 2 and 3",
            category: "Factoring"
        },
        {
            question: "What is the y-intercept of y = 2x - 4?",
            options: ["-4", "2", "4", "-2"],
            correct: 0,
            explanation: "In y = mx + b, b is the y-intercept. Here b = -4",
            category: "Linear Equations"
        },
        {
            question: "Simplify: √25 + √16",
            options: ["9", "7", "10", "8"],
            correct: 0,
            explanation: "√25 = 5, √16 = 4, 5 + 4 = 9",
            category: "Radicals"
        }
    ]
};