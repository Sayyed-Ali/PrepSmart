import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddAptitudeQuestion() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        question: '',
        category: 'quantitative',
        difficulty: 'medium',
        options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
        ],
        correctAnswer: '',
        explanation: '',
        timeLimit: 60
    })

    // for bulk upload
    const [bulkMode, setBulkMode] = useState(false)
    const [bulkText, setBulkText] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const updateOption = (index, value) => {
        const newOptions = [...formData.options]
        newOptions[index].text = value
        setFormData({ ...formData, options: newOptions })
    }

    const setCorrectOption = (index) => {
        const newOptions = formData.options.map((opt, i) => ({
            ...opt,
            isCorrect: i === index
        }))
        setFormData({
            ...formData,
            options: newOptions,
            correctAnswer: formData.options[index].text
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // validate at least one correct answer
            const hasCorrect = formData.options.some(opt => opt.isCorrect)
            if (!hasCorrect) {
                alert('Please mark one option as correct')
                setLoading(false)
                return
            }

            const response = await fetch('http://localhost:5001/api/admin/aptitude/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (data.success) {
                alert('Question added successfully!')
                // reset form
                setFormData({
                    question: '',
                    category: 'quantitative',
                    difficulty: 'medium',
                    options: [
                        { text: '', isCorrect: false },
                        { text: '', isCorrect: false },
                        { text: '', isCorrect: false },
                        { text: '', isCorrect: false }
                    ],
                    correctAnswer: '',
                    explanation: '',
                    timeLimit: 60
                })
            } else {
                alert('Error: ' + data.message)
            }

        } catch (error) {
            console.error('Error adding question:', error)
            alert('Failed to add question')
        } finally {
            setLoading(false)
        }
    }

    const handleBulkUpload = async () => {
        setLoading(true)
        try {
            // parse bulk text - expecting JSON array format
            const questions = JSON.parse(bulkText)

            if (!Array.isArray(questions)) {
                alert('Invalid format. Please provide an array of questions.')
                return
            }

            const response = await fetch('http://localhost:5001/api/admin/aptitude/questions/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questions })
            })

            const data = await response.json()

            if (data.success) {
                alert(`${data.count} questions added successfully!`)
                setBulkText('')
            } else {
                alert('Error: ' + data.message)
            }

        } catch (error) {
            console.error('Error bulk uploading:', error)
            alert('Failed to parse JSON. Please check format.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/admin')}
                        className="text-blue-600 hover:text-blue-700 font-semibold mb-4"
                    >
                        ← Back to Admin
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Add Aptitude Question
                    </h1>
                    <p className="text-gray-600">
                        Add questions one by one or upload in bulk
                    </p>
                </div>

                {/* Mode Toggle */}
                <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setBulkMode(false)}
                            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${!bulkMode
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Single Question
                        </button>
                        <button
                            onClick={() => setBulkMode(true)}
                            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${bulkMode
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Bulk Upload (JSON)
                        </button>
                    </div>
                </div>

                {/* Single Question Form */}
                {!bulkMode ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Question Details */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Question Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Question Text *
                                    </label>
                                    <textarea
                                        name="question"
                                        value={formData.question}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Enter your question here..."
                                    />
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="quantitative">Quantitative</option>
                                            <option value="logical">Logical</option>
                                            <option value="verbal">Verbal</option>
                                            <option value="general">General Knowledge</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Difficulty *
                                        </label>
                                        <select
                                            name="difficulty"
                                            value={formData.difficulty}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Time Limit (seconds) *
                                        </label>
                                        <input
                                            type="number"
                                            name="timeLimit"
                                            value={formData.timeLimit}
                                            onChange={handleChange}
                                            min="30"
                                            max="180"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Answer Options</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Click the radio button to mark the correct answer
                            </p>

                            <div className="space-y-3">
                                {formData.options.map((option, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="correctOption"
                                            checked={option.isCorrect}
                                            onChange={() => setCorrectOption(index)}
                                            className="w-5 h-5 text-blue-600"
                                        />
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={option.text}
                                                onChange={(e) => updateOption(index, e.target.value)}
                                                required
                                                placeholder={`Option ${index + 1}`}
                                                className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${option.isCorrect
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-300'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Explanation */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Explanation (Optional)</h2>
                            <textarea
                                name="explanation"
                                value={formData.explanation}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Explain why this is the correct answer..."
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loading ? 'Adding Question...' : 'Add Question'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin')}
                                className="px-8 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Bulk Upload */
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Bulk Upload via JSON</h2>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Paste JSON Array of Questions
                                </label>
                                <textarea
                                    value={bulkText}
                                    onChange={(e) => setBulkText(e.target.value)}
                                    rows="15"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                    placeholder='[
  {
    "question": "What is 2 + 2?",
    "category": "quantitative",
    "difficulty": "easy",
    "options": [
      {"text": "3", "isCorrect": false},
      {"text": "4", "isCorrect": true},
      {"text": "5", "isCorrect": false},
      {"text": "6", "isCorrect": false}
    ],
    "correctAnswer": "4",
    "explanation": "Basic addition",
    "timeLimit": 60
  }
]'
                                />
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <h4 className="font-bold text-blue-900 mb-2">JSON Format Guide:</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Must be a valid JSON array</li>
                                    <li>• Each question must have: question, category, difficulty, options, correctAnswer</li>
                                    <li>• Options must be an array of 4 objects with text and isCorrect</li>
                                    <li>• Mark exactly one option as isCorrect: true</li>
                                </ul>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleBulkUpload}
                                    disabled={loading || !bulkText.trim()}
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {loading ? 'Uploading...' : 'Upload Questions'}
                                </button>
                                <button
                                    onClick={() => setBulkText('')}
                                    className="px-8 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        {/* Example JSON */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold mb-2">Example JSON:</h3>
                            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
                                {`[
  {
    "question": "If x + 5 = 12, what is x?",
    "category": "quantitative",
    "difficulty": "easy",
    "options": [
      {"text": "5", "isCorrect": false},
      {"text": "6", "isCorrect": false},
      {"text": "7", "isCorrect": true},
      {"text": "8", "isCorrect": false}
    ],
    "correctAnswer": "7",
    "explanation": "x = 12 - 5 = 7",
    "timeLimit": 60
  },
  {
    "question": "Choose synonym of 'Happy'",
    "category": "verbal",
    "difficulty": "easy",
    "options": [
      {"text": "Sad", "isCorrect": false},
      {"text": "Joyful", "isCorrect": true},
      {"text": "Angry", "isCorrect": false},
      {"text": "Tired", "isCorrect": false}
    ],
    "correctAnswer": "Joyful",
    "explanation": "Joyful means happy",
    "timeLimit": 45
  }
]`}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddAptitudeQuestion