import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MainLayout from '../components/MainLayout'
const BASE_URL = import.meta.env.VITE_BASE_URL

function CompanyDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [company, setCompany] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCompany()
    }, [id])

    const fetchCompany = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/admin/companies`)
            const data = await response.json()

            if (data.success) {
                const foundCompany = data.companies.find(c => c._id === id)
                setCompany(foundCompany)
            }
        } catch (error) {
            console.error('Error fetching company:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>Loading...</div>
            </div>
        )
    }

    if (!company) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Company not found</h2>
                    <button
                        onClick={() => navigate('/companies')}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg"
                    >
                        Back to Companies
                    </button>
                </div>
            </div>
        )
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <button
                            onClick={() => navigate('/companies')}
                            className="text-white/90 hover:text-white mb-4 inline-flex items-center gap-2"
                        >
                            ← Back to Companies
                        </button>

                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-4xl font-bold backdrop-blur">
                                {company.logo || company.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
                                <p className="text-xl text-white/90">{company.description?.substring(0, 100) || 'No description'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold">{company.founded || 'N/A'}</div>
                                <div className="text-sm text-white/80">Founded</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{company.headquarters || 'N/A'}</div>
                                <div className="text-sm text-white/80">Headquarters</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">
                                    {company.interviewProcess?.difficulty || 'Medium'}
                                </div>
                                <div className="text-sm text-white/80">Difficulty</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">
                                    {company.commonQuestions?.length || 0}
                                </div>
                                <div className="text-sm text-white/80">Questions</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* About Section */}
                    <section className="bg-white rounded-xl p-6 shadow-sm mb-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">About {company.name}</h2>
                        <p className="text-gray-700 mb-4">{company.description || 'No description available'}</p>

                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <span className="font-semibold text-gray-700">Industry:</span>
                                <span className="ml-2 text-gray-600">{company.industry || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Headquarters:</span>
                                <span className="ml-2 text-gray-600">{company.headquarters || 'N/A'}</span>
                            </div>
                            {company.founders && company.founders.length > 0 && (
                                <div className="md:col-span-2">
                                    <span className="font-semibold text-gray-700">Founders:</span>
                                    <span className="ml-2 text-gray-600">{company.founders.join(', ')}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Interview Process */}
                    {company.interviewProcess?.rounds && company.interviewProcess.rounds.length > 0 && (
                        <section className="bg-white rounded-xl p-6 shadow-sm mb-6">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Interview Process</h2>
                            <div className="space-y-4">
                                {company.interviewProcess.rounds.map((round, index) => (
                                    <div key={index} className="border-l-4 border-purple-600 pl-4 py-2">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-gray-800">
                                                {index + 1}. {round.name}
                                            </h3>
                                            {round.duration && (
                                                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                    {round.duration}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600">{round.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Common Questions */}
                    {company.commonQuestions && company.commonQuestions.length > 0 && (
                        <section className="bg-white rounded-xl p-6 shadow-sm mb-6">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Commonly Asked Questions</h2>
                            <div className="space-y-3">
                                {company.commonQuestions.map((q, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-800">{q.question}</h4>
                                            <span className={`text-xs px-2 py-1 rounded-full ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {q.difficulty || 'medium'}
                                            </span>
                                        </div>
                                        <span className="text-sm text-purple-600 font-medium">{q.type || 'General'}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Culture & Values */}
                    {company.culture && (
                        <section className="bg-white rounded-xl p-6 shadow-sm mb-6">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Culture & Values</h2>

                            {company.culture.values && company.culture.values.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="font-bold text-lg mb-2">Core Values</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {company.culture.values.map((value, index) => (
                                            <span key={index} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                                                {value}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {company.culture.workEnvironment && (
                                <div className="mb-4">
                                    <h3 className="font-bold text-lg mb-2">Work Environment</h3>
                                    <p className="text-gray-700">{company.culture.workEnvironment}</p>
                                </div>
                            )}

                            {company.culture.benefits && company.culture.benefits.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Benefits</h3>
                                    <ul className="grid md:grid-cols-2 gap-2">
                                        {company.culture.benefits.map((benefit, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-green-600">✓</span>
                                                <span className="text-gray-700">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </section>
                    )}

                    {/* CTA */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate('/interview-setup')}
                            className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition shadow-lg hover:shadow-xl"
                        >
                            Practice Interview for {company.name} 🚀
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default CompanyDetail