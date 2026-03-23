import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI, interviewAPI } from '../services/api'

function InterviewSetup() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // form data
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        interviewType: 'mixed'
    })

    // list of companies - hardcoded for now
    const companies = [
        'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple',
        'Netflix', 'Tesla', 'Uber', 'Airbnb', 'Salesforce',
        'Adobe', 'Oracle', 'IBM', 'Intel', 'Cisco'
    ]

    // get current user
    useEffect(() => {
        const currentUser = authAPI.getCurrentUser()
        if (!currentUser) {
            navigate('/login')
        } else {
            setUser(currentUser)
        }
    }, [navigate])

    // handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    // handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // create interview session
            const interviewData = {
                userId: user.id,
                company: formData.company,
                role: formData.role,
                interviewType: formData.interviewType
            }

            const response = await interviewAPI.create(interviewData)
            console.log('Interview created:', response)

            // redirect to interview page with the interview ID
            navigate(`/interview/${response.interview._id}`)

        } catch (err) {
            console.error('Error creating interview:', err)
            setError('Failed to start interview. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
            <div className="max-w-3xl mx-auto pt-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-purple-600 hover:text-purple-700 font-semibold mb-4 inline-flex items-center gap-2"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">
                        Setup Your Mock Interview
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Tell us about the position you're preparing for
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Company Selection */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Select Company <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-700"
                            >
                                <option value="">Choose a company...</option>
                                {companies.map((company) => (
                                    <option key={company} value={company}>
                                        {company}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-2 text-sm text-gray-500">
                                Questions will be tailored to this company's interview style
                            </p>
                        </div>

                        {/* Role Input */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Job Role <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Software Engineer, Data Scientist, Product Manager"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                Be specific - this helps generate relevant questions
                            </p>
                        </div>

                        {/* Interview Type */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                Interview Type <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Technical */}
                                <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.interviewType === 'technical'
                                        ? 'border-purple-600 bg-purple-50'
                                        : 'border-gray-200 hover:border-purple-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="interviewType"
                                        value="technical"
                                        checked={formData.interviewType === 'technical'}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className="text-center">
                                        <div className="text-3xl mb-2">💻</div>
                                        <div className="font-bold text-gray-800">Technical</div>
                                        <div className="text-xs text-gray-600 mt-1">Coding & algorithms</div>
                                    </div>
                                </label>

                                {/* Behavioral */}
                                <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.interviewType === 'behavioral'
                                        ? 'border-purple-600 bg-purple-50'
                                        : 'border-gray-200 hover:border-purple-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="interviewType"
                                        value="behavioral"
                                        checked={formData.interviewType === 'behavioral'}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className="text-center">
                                        <div className="text-3xl mb-2">💬</div>
                                        <div className="font-bold text-gray-800">Behavioral</div>
                                        <div className="text-xs text-gray-600 mt-1">Past experiences</div>
                                    </div>
                                </label>

                                {/* Mixed */}
                                <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.interviewType === 'mixed'
                                        ? 'border-purple-600 bg-purple-50'
                                        : 'border-gray-200 hover:border-purple-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="interviewType"
                                        value="mixed"
                                        checked={formData.interviewType === 'mixed'}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className="text-center">
                                        <div className="text-3xl mb-2">🎯</div>
                                        <div className="font-bold text-gray-800">Mixed</div>
                                        <div className="text-xs text-gray-600 mt-1">Both types</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <div className="text-2xl">ℹ️</div>
                                <div>
                                    <h4 className="font-bold text-blue-900 mb-1">What to expect</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• 5-10 interview questions based on your selections</li>
                                        <li>• AI-powered feedback on your answers</li>
                                        <li>• Detailed performance scoring and tips</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Starting Interview...' : 'Start Interview 🚀'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tips Section */}
                <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg">💡 Quick Tips</h3>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex gap-2">
                            <span>✓</span>
                            <span>Find a quiet place with no distractions</span>
                        </div>
                        <div className="flex gap-2">
                            <span>✓</span>
                            <span>Speak clearly and take your time</span>
                        </div>
                        <div className="flex gap-2">
                            <span>✓</span>
                            <span>Use the STAR method for behavioral questions</span>
                        </div>
                        <div className="flex gap-2">
                            <span>✓</span>
                            <span>Think out loud during technical problems</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InterviewSetup