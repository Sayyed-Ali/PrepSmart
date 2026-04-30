const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const generateAptitudeQuestions = async (category, difficulty, count = 10, companyId = null) => {
    try {
        const companyContext = companyId
            ? `Focus on questions commonly asked in ${companyId} interviews.`
            : '';

        const prompt = `Generate ${count} ${difficulty} ${category} aptitude questions.
${companyContext}

IMPORTANT: Return ONLY valid JSON. No markdown, no explanation, no backticks.

{
  "questions": [
    {
      "id": 1,
      "question": "What is 2 + 2?",
      "options": ["2", "3", "4", "5"],
      "correctAnswer": "4",
      "explanation": "Basic addition: 2 + 2 = 4"
    }
  ]
}`;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2000,
                responseMimeType: "application/json"
            }
        });

        const result = await model.generateContent(prompt);
        const response = result.response;
        let content = response.text().trim();

        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const data = JSON.parse(content);
        return data.questions || [];

    } catch (error) {
        console.error('Gemini API error:', error.message);
        return getHardcodedQuestions(category, difficulty, count);
    }
};

const generateInterviewQuestions = async ({ company, role, type, jobDescription, resumeText }) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 2500,
                responseMimeType: "application/json"
            }
        });

        const prompt = `Generate 5 ${type} interview questions for a ${role} position at ${company}.

${jobDescription ? `Job Description: ${jobDescription.substring(0, 500)}` : ''}
${resumeText ? `Resume: ${resumeText.substring(0, 500)}` : ''}

IMPORTANT: Return ONLY valid JSON. No markdown, no explanation.

{
  "questions": [
    {
      "id": 1,
      "question": "What is your question here?",
      "difficulty": "medium",
      "type": "${type}",
      "expectedAnswer": "Brief answer guide"
    }
  ]
}`;

        console.log(`Generating ${type} interview questions for ${role} at ${company}...`);

        const result = await model.generateContent(prompt);
        let content = result.response.text().trim();

        // Clean markdown
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Parse JSON
        const data = JSON.parse(content);

        //  Validate and return
        if (data.questions && Array.isArray(data.questions)) {
            return data.questions;
        }

        throw new Error('Invalid response format');

    } catch (error) {
        console.error('AI generation failed:', error.message);
        return getDefaultInterviewQuestions(type);
    }
};

const evaluateInterviewAnswer = async (question, answer, role, company) => {
    if (!answer || answer.trim().length < 20) {
        return {
            score: 2,
            strengths: ["Answer provided", "Attempted the question"],
            improvements: ["Add much more detail", "Include specific examples", "Explain reasoning thoroughly"],
            idealApproach: "Provide a detailed, structured response with concrete examples"
        };
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 800,
                responseMimeType: "application/json"
            }
        });

        const prompt = `Score this interview answer from 1-10. Return ONLY this JSON format with NO newlines:

{"score":7,"strengths":["point1","point2","point3"],"improvements":["point1","point2","point3"],"idealApproach":"brief summary"}

Question: ${question.substring(0, 200)}
Answer: ${answer.substring(0, 500)}`;

        const result = await model.generateContent(prompt);
        let content = result.response.text().trim();

        // console.log(' RAW GEMINI RESPONSE:', content);
        // console.log(' LENGTH:', content.length);

        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // console.log('🔍 CLEANED RESPONSE:', content);

        const parsed = JSON.parse(content);

        console.log('PARSED SUCCESSFULLY:', parsed);

        return {
            score: Math.min(10, Math.max(1, Number(parsed.score))) || 5,
            strengths: (parsed.strengths || []).slice(0, 3),
            improvements: (parsed.improvements || []).slice(0, 3),
            idealApproach: String(parsed.idealApproach || "Structured response").substring(0, 150)
        };

    } catch (error) {
        console.log(' GEMINI ERROR:', error.message);
        console.log('AI evaluation failed, using smart fallback');

        const words = answer.trim().split(/\s+/).length;
        const hasExamples = /example|instance|such as|like|for example/i.test(answer);
        const hasStructure = /first|second|finally|additionally|furthermore/i.test(answer);

        let score = 5;
        if (words > 150) score += 1;
        if (words > 250) score += 1;
        if (hasExamples) score += 1;
        if (hasStructure) score += 1;

        return {
            score: Math.min(10, score),
            strengths: [
                words > 100 ? "Detailed response" : "Answer provided",
                hasExamples ? "Included examples" : "Addressed question",
                hasStructure ? "Well structured" : "Attempted explanation"
            ],
            improvements: [
                words < 100 ? "Add more detail" : "Further refine",
                !hasExamples ? "Include concrete examples" : "Add more cases",
                !hasStructure ? "Use clearer structure" : "Enhance flow"
            ],
            idealApproach: "Provide well-structured response with specific examples and clear reasoning"
        };
    }
};

// Default fallback questions
const getDefaultInterviewQuestions = (type) => {
    const technical = [
        {
            id: 1,
            question: "Explain the difference between var, let, and const in JavaScript.",
            difficulty: "easy",
            type: "technical",
            expectedAnswer: "Explain scope, hoisting, and reassignment"
        },
        {
            id: 2,
            question: "How would you optimize a slow database query?",
            difficulty: "medium",
            type: "technical",
            expectedAnswer: "Discuss indexing and caching"
        },
        {
            id: 3,
            question: "Design a URL shortener. What are the key components?",
            difficulty: "hard",
            type: "technical",
            expectedAnswer: "System design: hashing, database, scalability"
        },
        {
            id: 4,
            question: "What is the time complexity of common sorting algorithms?",
            difficulty: "medium",
            type: "technical",
            expectedAnswer: "O(n log n) for merge/quick sort"
        },
        {
            id: 5,
            question: "How do you handle errors in production code?",
            difficulty: "medium",
            type: "technical",
            expectedAnswer: "Try-catch, logging, monitoring"
        }
    ];

    const behavioral = [
        {
            id: 1,
            question: "Tell me about a time you worked with a difficult team member.",
            difficulty: "medium",
            type: "behavioral",
            expectedAnswer: "STAR format response"
        },
        {
            id: 2,
            question: "Describe a project where you learned a new technology quickly.",
            difficulty: "medium",
            type: "behavioral",
            expectedAnswer: "Show learning ability"
        },
        {
            id: 3,
            question: "How do you prioritize tasks with multiple deadlines?",
            difficulty: "easy",
            type: "behavioral",
            expectedAnswer: "Time management approach"
        },
        {
            id: 4,
            question: "Tell me about a time you failed.",
            difficulty: "medium",
            type: "behavioral",
            expectedAnswer: "Show growth mindset"
        },
        {
            id: 5,
            question: "Why do you want to work at our company?",
            difficulty: "easy",
            type: "behavioral",
            expectedAnswer: "Research and alignment"
        }
    ];

    return type === 'behavioral' ? behavioral : technical;
};

const getHardcodedQuestions = (category, difficulty, count) => {
    const questions = {
        quantitative: [
            {
                id: 1,
                question: "If a train travels 60 km in 45 minutes, what is its speed in km/h?",
                options: ["70", "75", "80", "85"],
                correctAnswer: "80",
                explanation: "Speed = 60/(45/60) = 80 km/h"
            },
            {
                id: 2,
                question: "What is 15% of 200?",
                options: ["25", "30", "35", "40"],
                correctAnswer: "30",
                explanation: "15% of 200 = 30"
            }
        ],
        logical: [
            {
                id: 1,
                question: "What comes next: 2, 6, 12, 20, 30, ?",
                options: ["40", "42", "44", "46"],
                correctAnswer: "42",
                explanation: "Differences are 4, 6, 8, 10, 12"
            }
        ],
        verbal: [
            {
                id: 1,
                question: "Choose the synonym of 'Abundant':",
                options: ["Scarce", "Plentiful", "Lacking", "Rare"],
                correctAnswer: "Plentiful",
                explanation: "Abundant means plentiful"
            }
        ]
    };

    return (questions[category] || questions.quantitative).slice(0, count);
};

module.exports = {
    generateAptitudeQuestions,
    generateInterviewQuestions,
    evaluateInterviewAnswer
};