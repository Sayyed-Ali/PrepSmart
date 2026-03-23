import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Companies() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)

    // fetch companies from database
    useEffect(() => {
        fetchCompanies()
    }, [])

    const fetchCompanies = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/admin/companies')
            const data = await response.json()

            if (data.success) {
                setCompanies(data.companies)
            }
        } catch (error) {
            console.error('Error fetching companies:', error)
        } finally {
            setLoading(false)
        }
    }

    // filter companies based on search
    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <div className="text-gray-600">Loading companies...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-purple-600 hover:text-purple-700 font-semibold mb-4 inline-flex items-center gap-2"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Company Guides
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Everything you need to know about interviewing at top companies
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Search Bar */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="text-3xl font-bold text-purple-600">
                            {companies.length}
                        </div>
                        <div className="text-sm text-gray-600">Companies</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="text-3xl font-bold text-blue-600">
                            {companies.reduce((sum, c) => sum + c.commonQuestions.length, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Questions</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="text-3xl font-bold text-green-600">1000+</div>
                        <div className="text-sm text-gray-600">Success Stories</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="text-3xl font-bold text-orange-600">95%</div>
                        <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                </div>

                {/* Companies Grid */}
                {companies.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl">
                        <div className="text-6xl mb-4">🏢</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            No companies yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Admin needs to upload company data
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCompanies.map((company) => (
                            <div
                                key={company._id}
                                onClick={() => navigate(`/companies/${company._id}`)}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer p-6 border-2 border-transparent hover:border-purple-300"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                                        {company.logo}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">
                                            {company.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">{company.industry}</p>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {company.description}
                                </p>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Founded:</span>
                                        <span className="font-semibold">{company.founded}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Difficulty:</span>
                                        <span className={`font-semibold ${company.interviewProcess.difficulty === 'hard'
                                                ? 'text-red-600'
                                                : company.interviewProcess.difficulty === 'medium'
                                                    ? 'text-orange-600'
                                                    : 'text-green-600'
                                            }`}>
                                            {company.interviewProcess.difficulty}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Questions:</span>
                                        <span className="font-semibold">
                                            {company.commonQuestions.length}
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
                                    View Details →
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {filteredCompanies.length === 0 && companies.length > 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            No companies found
                        </h3>
                        <p className="text-gray-600">
                            Try adjusting your search terms
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Companies