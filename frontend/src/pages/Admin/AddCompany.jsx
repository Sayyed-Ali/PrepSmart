import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const BASE_URL = import.meta.env.VITE_BASE_URL

function AddCompany() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        description: '',
        industry: '',
        founded: '',
        founders: '',
        headquarters: '',

        // culture
        values: '',
        workEnvironment: '',
        benefits: '',

        // interview process
        difficulty: 'medium',
        rounds: [{ name: '', description: '', duration: '' }],

        // questions
        commonQuestions: [{ question: '', type: '', difficulty: 'medium' }]
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const addRound = () => {
        setFormData({
            ...formData,
            rounds: [...formData.rounds, { name: '', description: '', duration: '' }]
        })
    }

    const updateRound = (index, field, value) => {
        const newRounds = [...formData.rounds]
        newRounds[index][field] = value
        setFormData({ ...formData, rounds: newRounds })
    }

    const removeRound = (index) => {
        const newRounds = formData.rounds.filter((_, i) => i !== index)
        setFormData({ ...formData, rounds: newRounds })
    }

    const addQuestion = () => {
        setFormData({
            ...formData,
            commonQuestions: [...formData.commonQuestions, { question: '', type: '', difficulty: 'medium' }]
        })
    }

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...formData.commonQuestions]
        newQuestions[index][field] = value
        setFormData({ ...formData, commonQuestions: newQuestions })
    }

    const removeQuestion = (index) => {
        const newQuestions = formData.commonQuestions.filter((_, i) => i !== index)
        setFormData({ ...formData, commonQuestions: newQuestions })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // prepare data
            const companyData = {
                name: formData.name,
                logo: formData.logo,
                description: formData.description,
                industry: formData.industry,
                founded: formData.founded,
                founders: formData.founders.split(',').map(f => f.trim()),
                headquarters: formData.headquarters,

                culture: {
                    values: formData.values.split(',').map(v => v.trim()),
                    workEnvironment: formData.workEnvironment,
                    benefits: formData.benefits.split(',').map(b => b.trim())
                },

                interviewProcess: {
                    difficulty: formData.difficulty,
                    rounds: formData.rounds
                },

                commonQuestions: formData.commonQuestions
            }

            const response = await fetch(`${BASE_URL}/api/admin/companies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(companyData)
            })

            const data = await response.json()

            if (data.success) {
                alert('Company added successfully!')
                navigate('/admin')
            } else {
                alert('Error: ' + data.message)
            }

        } catch (error) {
            console.error('Error adding company:', error)
            alert('Failed to add company')
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
                    <h1 className="text-3xl font-bold text-gray-800">Add New Company</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Basic Information</h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Google"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Logo (emoji or letter) *
                                </label>
                                <input
                                    type="text"
                                    name="logo"
                                    value={formData.logo}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="G"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Industry *
                                </label>
                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Technology"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Founded *
                                </label>
                                <input
                                    type="text"
                                    name="founded"
                                    value={formData.founded}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="1998"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Founders (comma separated) *
                                </label>
                                <input
                                    type="text"
                                    name="founders"
                                    value={formData.founders}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Larry Page, Sergey Brin"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Headquarters *
                                </label>
                                <input
                                    type="text"
                                    name="headquarters"
                                    value={formData.headquarters}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Mountain View, California"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Brief description of the company..."
                            />
                        </div>
                    </div>

                    {/* Culture */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Culture & Values</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Core Values (comma separated) *
                                </label>
                                <input
                                    type="text"
                                    name="values"
                                    value={formData.values}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Innovation, User Focus, Openness"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Work Environment *
                                </label>
                                <textarea
                                    name="workEnvironment"
                                    value={formData.workEnvironment}
                                    onChange={handleChange}
                                    required
                                    rows="2"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Describe the work environment..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Benefits (comma separated) *
                                </label>
                                <input
                                    type="text"
                                    name="benefits"
                                    value={formData.benefits}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Competitive salary, Free meals, Wellness programs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Interview Process */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Interview Process</h2>

                        <div className="mb-4">
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

                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-semibold text-gray-700">
                                    Interview Rounds *
                                </label>
                                <button
                                    type="button"
                                    onClick={addRound}
                                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                                >
                                    + Add Round
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.rounds.map((round, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-semibold text-sm">Round {index + 1}</span>
                                            {formData.rounds.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeRound(index)}
                                                    className="text-red-600 hover:text-red-700 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid gap-3">
                                            <input
                                                type="text"
                                                value={round.name}
                                                onChange={(e) => updateRound(index, 'name', e.target.value)}
                                                placeholder="Round name (e.g., Phone Screen)"
                                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                required
                                            />
                                            <textarea
                                                value={round.description}
                                                onChange={(e) => updateRound(index, 'description', e.target.value)}
                                                placeholder="Description..."
                                                rows="2"
                                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                required
                                            />
                                            <input
                                                type="text"
                                                value={round.duration}
                                                onChange={(e) => updateRound(index, 'duration', e.target.value)}
                                                placeholder="Duration (e.g., 45 minutes)"
                                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Common Questions */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Common Interview Questions</h2>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                            >
                                + Add Question
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.commonQuestions.map((q, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-semibold text-sm">Question {index + 1}</span>
                                        {formData.commonQuestions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(index)}
                                                className="text-red-600 hover:text-red-700 text-sm"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid gap-3">
                                        <textarea
                                            value={q.question}
                                            onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                                            placeholder="Question text..."
                                            rows="2"
                                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            required
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                value={q.type}
                                                onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                                                placeholder="Type (e.g., coding, behavioral)"
                                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                required
                                            />
                                            <select
                                                value={q.difficulty}
                                                onChange={(e) => updateQuestion(index, 'difficulty', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            >
                                                <option value="easy">Easy</option>
                                                <option value="medium">Medium</option>
                                                <option value="hard">Hard</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Adding Company...' : 'Add Company'}
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
            </div>
        </div>
    )
}

export default AddCompany