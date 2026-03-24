import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authAPI, aptitudeAPI } from '../services/api'

function AptitudeTest() {
    const navigate = useNavigate()
    const location = useLocation()
    const { category, difficulty, count } = location.state || {}

    const [user, setUser] = useState(null)
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState('')
    const [answers, setAnswers] = useState([])
    const [timeLeft, setTimeLeft] = useState(60)
    const [loading, setLoading] = useState(true)
    const [testStartTime] = useState(Date.now())

    // get user and load questions
    useEffect(() => {
        const currentUser = authAPI.getCurrentUser()
        if (!currentUser) {
            navigate('/login')
            return
        }
        setUser(currentUser)
        loadQuestions()
    }, [])

    // timer countdown
    useEffect(() => {
        if (loading || !questions.length) return

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // time's up - auto submit and move to next
                    handleNext()
                    return 60
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [currentIndex, loading, questions])

    const loadQuestions = async () => {
        try {
            const response = await aptitudeAPI.generateQuestions(category, difficulty, count)
            console.log('Questions loaded:', response)
            setQuestions(response.questions)
        } catch (error) {
            console.error('Error loading questions:', error)
            alert('Failed to load questions')
            navigate('/aptitude-setup')
        } finally {
            setLoading(false)
        }
    }

    const handleNext = () => {
        // save current answer
        const currentQuestion = questions[currentIndex]
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer

        const answerData = {
            questionId: currentQuestion.id,
            question: currentQuestion.question,
            options: currentQuestion.options,
            userAnswer: selectedAnswer || 'Not answered',
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect,
            timeTaken: 60 - timeLeft
        }

        const newAnswers = [...answers, answerData]
        setAnswers(newAnswers)

        // check if last question
        if (currentIndex === questions.length - 1) {
            // submit test
            submitTest(newAnswers)
        } else {
            // move to next question
            setCurrentIndex(currentIndex + 1)
            setSelectedAnswer('')
            setTimeLeft(60)
        }
    }

    const submitTest = async (finalAnswers) => {
        try {
            const totalTime = Math.floor((Date.now() - testStartTime) / 1000)

            const testData = {
                userId: user.id,
                category,
                difficulty,
                questions: finalAnswers,
                timeTaken: totalTime
            }

            const response = await aptitudeAPI.submitTest(testData)
            console.log('Test submitted:', response)

            // navigate to results page
            navigate('/aptitude-result', {
                state: {
                    testId: response.result.testId,
                    score: response.result.score,
                    answers: finalAnswers,
                    timeTaken: totalTime
                }
            })

        } catch (error) {
            console.error('Error submitting test:', error)
            alert('Failed to submit test')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">🔄</div>
                    <div className="text-gray-600">Loading questions...</div>
                </div>
            </div>
        )
    }

    if (!questions.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">❌</div>
                    <div className="text-gray-600">No questions available</div>
                </div>
            </div>
        )
    }

    const currentQuestion = questions[currentIndex]
    const progress = ((currentIndex + 1) / questions.length) * 100

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <div className="max-w-3xl mx-auto pt-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <span className="text-sm font-semibold text-gray-600">
                                Question {currentIndex + 1} of {questions.length}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm font-semibold text-gray-600">
                                {category.toUpperCase()} • {difficulty.toUpperCase()}
                            </div>
                            <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-blue-600'
                                }`}>
                                {timeLeft}s
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {currentQuestion.question}
                    </h2>

                    {/* Options */}
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedAnswer(option)}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedAnswer === option
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswer === option
                                            ? 'border-blue-600 bg-blue-600'
                                            : 'border-gray-300'
                                        }`}>
                                        {selectedAnswer === option && (
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        )}
                                    </div>
                                    <span className="font-medium">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                    {currentIndex === questions.length - 1 ? 'Submit Test' : 'Next Question'} →
                </button>

                {/* Warning */}
                {!selectedAnswer && (
                    <p className="text-center text-yellow-600 text-sm mt-4">
                        ⚠️ No answer selected - will be marked as incorrect
                    </p>
                )}
            </div>
        </div>
    )
}

export default AptitudeTest