// AI service to generate aptitude questions
// for now we'll use hardcoded questions, but structured to easily add OpenAI later

const generateAptitudeQuestions = async (category, difficulty, count = 10) => {
    // TODO: integrate OpenAI API later for dynamic generation
    // For now, return sample questions

    const questionBank = {
        quantitative: [
            {
                question: "If a train travels 60 km in 45 minutes, what is its speed in km/hr?",
                options: ["70", "75", "80", "85"],
                correctAnswer: "80",
                explanation: "Speed = Distance/Time = 60/(45/60) = 60/(3/4) = 80 km/hr"
            },
            {
                question: "What is 15% of 200?",
                options: ["25", "30", "35", "40"],
                correctAnswer: "30",
                explanation: "15% of 200 = (15/100) × 200 = 30"
            },
            {
                question: "If x + 5 = 12, what is the value of x?",
                options: ["5", "6", "7", "8"],
                correctAnswer: "7",
                explanation: "x = 12 - 5 = 7"
            },
            {
                question: "A shopkeeper offers 20% discount on marked price. If marked price is ₹500, what is selling price?",
                options: ["₹400", "₹420", "₹450", "₹480"],
                correctAnswer: "₹400",
                explanation: "Selling price = 500 - (20% of 500) = 500 - 100 = ₹400"
            },
            {
                question: "What is the next number in series: 2, 6, 12, 20, ?",
                options: ["28", "30", "32", "36"],
                correctAnswer: "30",
                explanation: "Difference increases by 2 each time: +4, +6, +8, +10"
            }
        ],
        logical: [
            {
                question: "If all roses are flowers and some flowers fade quickly, can we conclude that some roses fade quickly?",
                options: ["Yes", "No", "Cannot be determined", "Depends on season"],
                correctAnswer: "Cannot be determined",
                explanation: "We cannot determine which specific flowers fade quickly"
            },
            {
                question: "Complete the pattern: A, C, F, J, ?",
                options: ["M", "N", "O", "P"],
                correctAnswer: "O",
                explanation: "Gaps increase: +2, +3, +4, +5"
            },
            {
                question: "If CODE is written as DPEF, how is MIND written?",
                options: ["NKOE", "NJOE", "NJNE", "NKNE"],
                correctAnswer: "NJOE",
                explanation: "Each letter is shifted by +1"
            },
            {
                question: "Which one is different: Apple, Mango, Banana, Potato?",
                options: ["Apple", "Mango", "Banana", "Potato"],
                correctAnswer: "Potato",
                explanation: "Potato is a vegetable, others are fruits"
            },
            {
                question: "If SISTER = 535301, BROTHER = ?",
                options: ["2935103", "2935301", "2935310", "2953103"],
                correctAnswer: "2935103",
                explanation: "S=5, I=3, T=0, E=1, R=1, B=2, O=9, H=3"
            }
        ],
        verbal: [
            {
                question: "Choose the synonym of 'Abundant':",
                options: ["Scarce", "Plentiful", "Rare", "Limited"],
                correctAnswer: "Plentiful",
                explanation: "Abundant means existing in large quantities"
            },
            {
                question: "Choose the antonym of 'Transparent':",
                options: ["Clear", "Opaque", "Visible", "Bright"],
                correctAnswer: "Opaque",
                explanation: "Opaque means not able to be seen through"
            },
            {
                question: "Complete the analogy: Book : Author :: Painting : ?",
                options: ["Canvas", "Artist", "Museum", "Color"],
                correctAnswer: "Artist",
                explanation: "As author creates book, artist creates painting"
            },
            {
                question: "Which sentence is grammatically correct?",
                options: [
                    "She don't like coffee",
                    "She doesn't likes coffee",
                    "She doesn't like coffee",
                    "She not like coffee"
                ],
                correctAnswer: "She doesn't like coffee",
                explanation: "Subject-verb agreement with singular subject"
            },
            {
                question: "Identify the error: 'Neither of the students have completed their homework.'",
                options: ["Neither", "have", "completed", "No error"],
                correctAnswer: "have",
                explanation: "'Neither' is singular, should use 'has'"
            }
        ]
    }

    // get questions for the category
    const categoryQuestions = questionBank[category] || questionBank.quantitative

    // shuffle and pick random questions
    const shuffled = categoryQuestions.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, Math.min(count, categoryQuestions.length))

    // format questions
    return selected.map((q, index) => ({
        id: `${category}_${Date.now()}_${index}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        category,
        difficulty,
        createdBy: 'ai'
    }))
}

module.exports = { generateAptitudeQuestions }