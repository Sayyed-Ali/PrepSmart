import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'

function AptitudeSetup() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedDifficulty, setSelectedDifficulty] = useState('')
    const [questionCount, setQuestionCount] = useState(10)

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser()
        if (!currentUser) {
            navigate('/login')
        } else {
            setUser(currentUser)
        }
    }, [navigate])

    const categories = [
        {
            id: 'quantitative',
            name: 'Quantitative Aptitude',
            icon: '🔢',
            description: 'Math, numbers, calculations'
        },
        {
            id: 'logical',
            name: 'Logical Reasoning',
            icon: '🧩',
            description: 'Patterns, sequences, logic'
        },
        {
            id: 'verbal',
            name: 'Verbal Ability',
            icon: '📝',
            description: 'Grammar, vocabulary, comprehension'
        }
    ]

    const difficulties = [
        { id: 'easy', name: 'Easy', color: 'green', icon: '😊' },
        { id: 'medium', name: 'Medium', color: 'yellow', icon: '😐' },
        { id: 'hard', name: 'Hard', color: 'red', icon: '😰' }
    ]

    const handleStart = () => {
        if (!selectedCategory || !selectedDifficulty) {
            alert('Please select category and difficulty')
            return
        }

        navigate('/aptitude-test', {
            state: {
                category: selectedCategory,
                difficulty: selectedDifficulty,
                count: questionCount
            }
        })
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <div className="max-w-4xl mx-auto pt-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-blue-600 hover:text-blue-700 font-semibold mb-4"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">
                        📝 Aptitude Test
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Test your skills and improve your placement preparation
                    </p>
                </div>

                {/* Category Selection */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Select Category
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`p-6 rounded-xl border-2 transition-all text-left ${selectedCategory === cat.id
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300'
                                    }`}
                            >
                                <div className="text-4xl mb-3">{cat.icon}</div>
                                <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                                <p className="text-sm text-gray-600">{cat.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Difficulty Selection */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Select Difficulty
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        {difficulties.map(diff => (
                            <button
                                key={diff.id}
                                onClick={() => setSelectedDifficulty(diff.id)}
                                className={`p-4 rounded-xl border-2 transition-all ${selectedDifficulty === diff.id
                                        ? `border-${diff.color}-600 bg-${diff.color}-50`
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-3xl mb-2">{diff.icon}</div>
                                <div className="font-bold">{diff.name}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Number of Questions */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Number of Questions
                    </h2>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="5"
                            max="20"
                            value={questionCount}
                            onChange={(e) => setQuestionCount(e.target.value)}
                            className="flex-1"
                        />
                        <span className="text-2xl font-bold text-blue-600 w-16 text-center">
                            {questionCount}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Estimated time: {questionCount * 1} minutes
                    </p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                    <div className="flex gap-4">
                        <div className="text-3xl">ℹ️</div>
                        <div>
                            <h4 className="font-bold text-blue-900 mb-2">Test Guidelines</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Each question has a time limit of 60 seconds</li>
                                <li>• You cannot go back to previous questions</li>
                                <li>• Results will be shown immediately after completion</li>
                                <li>• All questions are auto-generated using AI</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Start Button */}
                <button
                    onClick={handleStart}
                    disabled={!selectedCategory || !selectedDifficulty}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Start Test 🚀
                </button>
            </div>
        </div>
    )
}

export default AptitudeSetup