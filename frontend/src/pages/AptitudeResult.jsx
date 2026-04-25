import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import MainLayout from '../components/MainLayout'

function AptitudeResult() {
    const location = useLocation()
    const navigate = useNavigate()
    const { score, answers, timeTaken } = location.state || {}

    useEffect(() => {
        if (!score) {
            navigate('/aptitude-setup')
        }
    }, [score, navigate])

    if (!score) return null

    const minutes = Math.floor(timeTaken / 60)
    const seconds = timeTaken % 60

    return (
        <MainLayout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                <div className="max-w-4xl mx-auto pt-10">
                    {/* Score Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center">
                        <div className="text-6xl mb-4">
                            {score.percentage >= 80 ? '🎉' : score.percentage >= 60 ? '👏' : '💪'}
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            Test Completed!
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {score.percentage >= 80
                                ? 'Excellent work! Keep it up!'
                                : score.percentage >= 60
                                    ? 'Good job! Room for improvement.'
                                    : 'Keep practicing, you can do better!'}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <div className="text-3xl font-bold text-blue-600">
                                    {score.percentage}%
                                </div>
                                <div className="text-sm text-gray-600">Score</div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-xl">
                                <div className="text-3xl font-bold text-green-600">
                                    {score.correct}
                                </div>
                                <div className="text-sm text-gray-600">Correct</div>
                            </div>
                            <div className="p-4 bg-red-50 rounded-xl">
                                <div className="text-3xl font-bold text-red-600">
                                    {score.incorrect}
                                </div>
                                <div className="text-sm text-gray-600">Incorrect</div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-xl">
                                <div className="text-3xl font-bold text-purple-600">
                                    {minutes}:{seconds.toString().padStart(2, '0')}
                                </div>
                                <div className="text-sm text-gray-600">Time</div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate('/aptitude-setup')}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                                Take Another Test
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>

                    {/* Answers Review */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Review Your Answers
                        </h2>

                        <div className="space-y-4">
                            {answers.map((answer, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-xl border-2 ${answer.isCorrect
                                        ? 'border-green-200 bg-green-50'
                                        : 'border-red-200 bg-red-50'
                                        }`}
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className={`text-2xl ${answer.isCorrect ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {answer.isCorrect ? '✓' : '✗'}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 mb-2">
                                                Q{index + 1}. {answer.question}
                                            </h4>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex gap-2">
                                                    <span className="font-semibold text-gray-700">Your answer:</span>
                                                    <span className={answer.isCorrect ? 'text-green-700' : 'text-red-700'}>
                                                        {answer.userAnswer}
                                                    </span>
                                                </div>
                                                {!answer.isCorrect && (
                                                    <div className="flex gap-2">
                                                        <span className="font-semibold text-gray-700">Correct answer:</span>
                                                        <span className="text-green-700">{answer.correctAnswer}</span>
                                                    </div>
                                                )}
                                                <div className="flex gap-2 text-gray-600">
                                                    <span>Time taken:</span>
                                                    <span>{answer.timeTaken}s</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default AptitudeResult