import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
const BASE_URL = import.meta.env.VITE_BASE_URL

function AdminDashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser()

        if (!currentUser) {
            navigate('/login')
            return
        }

        if (currentUser.role !== 'admin') {
            alert('Access denied. Admin only.')
            navigate('/dashboard')
            return
        }

        setUser(currentUser)
    }, [navigate])

    if (!user) {
        return <div>Loading...</div>
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'companies', label: 'Manage Companies', icon: '🏢' },
        { id: 'users', label: 'Manage Users', icon: '👥' },
        { id: 'questions', label: 'Questions Bank', icon: '📝' },
        { id: 'dsa', label: 'DSA Problems', icon: '💻' },
        { id: 'vacancies', label: 'Job Vacancies', icon: '💼' }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
                            <p className="text-white/90">Manage PrepSmart platform</p>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold transition"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-4 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 font-semibold transition border-b-2 whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-red-600 text-red-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'companies' && <CompaniesTab />}
                {activeTab === 'users' && <UsersTab />}
                {activeTab === 'questions' && <QuestionsTab />}
                {activeTab === 'dsa' && <DSATab />}
                {activeTab === 'vacancies' && <VacanciesTab />}
            </div>
        </div>
    )
}

// Overview Tab Component
function OverviewTab() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCompanies: 0,
        totalInterviews: 0,
        activeToday: 0
    })

    useEffect(() => {
        setStats({
            totalUsers: 25,
            totalCompanies: 5,
            totalInterviews: 48,
            activeToday: 8
        })
    }, [])

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Platform Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
                    <div className="text-3xl mb-2">👥</div>
                    <div className="text-3xl font-bold text-gray-800">{stats.totalUsers}</div>
                    <div className="text-gray-600">Total Users</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-600">
                    <div className="text-3xl mb-2">🏢</div>
                    <div className="text-3xl font-bold text-gray-800">{stats.totalCompanies}</div>
                    <div className="text-gray-600">Companies</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-600">
                    <div className="text-3xl mb-2">🎤</div>
                    <div className="text-3xl font-bold text-gray-800">{stats.totalInterviews}</div>
                    <div className="text-gray-600">Interviews</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-600">
                    <div className="text-3xl mb-2">🔥</div>
                    <div className="text-3xl font-bold text-gray-800">{stats.activeToday}</div>
                    <div className="text-gray-600">Active Today</div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition text-left">
                        <div className="text-2xl mb-2">🏢</div>
                        <div className="font-semibold">Add Company</div>
                        <div className="text-sm text-gray-600">Add new company data</div>
                    </button>

                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition text-left">
                        <div className="text-2xl mb-2">📤</div>
                        <div className="font-semibold">Bulk Upload</div>
                        <div className="text-sm text-gray-600">Import companies via JSON</div>
                    </button>

                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition text-left">
                        <div className="text-2xl mb-2">📊</div>
                        <div className="font-semibold">View Reports</div>
                        <div className="text-sm text-gray-600">Platform analytics</div>
                    </button>
                </div>
            </div>
        </div>
    )
}

// Companies Tab
function CompaniesTab() {
    const navigate = useNavigate()

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Companies</h2>
                <button
                    onClick={() => navigate('/admin/add-company')}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                    + Add Company
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl mb-3">🏢</div>
                    <h3 className="font-bold text-lg mb-2">Add Single Company</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Use the form to add company details one by one
                    </p>
                    <button
                        onClick={() => navigate('/admin/add-company')}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Add Company
                    </button>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl mb-3">📤</div>
                    <h3 className="font-bold text-lg mb-2">Bulk Upload</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Use the upload script to add multiple companies
                    </p>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-700">
                        node scripts/uploadCompanies.js
                    </div>
                </div>
            </div>
        </div>
    )
}

// Questions Tab
function QuestionsTab() {
    const navigate = useNavigate()

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Questions</h2>
                <button
                    onClick={() => navigate('/admin/add-aptitude-question')}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                    + Add Question
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl mb-3">📝</div>
                    <h3 className="font-bold text-lg mb-2">Aptitude Questions</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Add questions for quantitative, logical, and verbal tests
                    </p>
                    <button
                        onClick={() => navigate('/admin/add-aptitude-question')}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Add Questions
                    </button>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl mb-3">📚</div>
                    <h3 className="font-bold text-lg mb-2">Question Bank</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        View and manage all aptitude questions
                    </p>
                    <button className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg font-semibold cursor-not-allowed" disabled>
                        View All Questions
                    </button>
                </div>
            </div>
        </div>
    )
}

// DSA Tab (NEW)
function DSATab() {
    const navigate = useNavigate()

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage DSA Problems</h2>
                <button
                    onClick={() => navigate('/admin/add-dsa-question')}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                    + Add DSA Problem
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl mb-3">💻</div>
                    <h3 className="font-bold text-lg mb-2">Add DSA Problem</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Add coding problems with multiple solution approaches
                    </p>
                    <button
                        onClick={() => navigate('/admin/add-dsa-question')}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Add Problem
                    </button>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl mb-3">📊</div>
                    <h3 className="font-bold text-lg mb-2">Problem Statistics</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        View stats on DSA problems and user progress
                    </p>
                    <button className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg font-semibold cursor-not-allowed" disabled>
                        View Statistics
                    </button>
                </div>
            </div>
        </div>
    )
}

// Vacancies Tab (NEW)
function VacanciesTab() {
    const navigate = useNavigate()

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Job Vacancies</h2>
                <button
                    onClick={() => navigate('/admin/add-vacancy')}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                    + Add Vacancy
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl mb-3">💼</div>
                    <h3 className="font-bold text-lg mb-2">Post New Vacancy</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Add new job postings for students
                    </p>
                    <button
                        onClick={() => navigate('/admin/add-vacancy')}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Add Vacancy
                    </button>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl mb-3">📋</div>
                    <h3 className="font-bold text-lg mb-2">Active Vacancies</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        View and manage all job postings
                    </p>
                    <button className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg font-semibold cursor-not-allowed" disabled>
                        View All Vacancies
                    </button>
                </div>
            </div>
        </div>
    )
}

// Users Tab
function UsersTab() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/admin/users`)
            const data = await response.json()
            setUsers(data.users || [])
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'student' : 'admin'

        try {
            const response = await fetch(`${BASE_URL}/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            })

            if (response.ok) {
                alert('User role updated!')
                fetchUsers()
            }
        } catch (error) {
            console.error('Error updating role:', error)
            alert('Failed to update role')
        }
    }

    if (loading) {
        return <div>Loading users...</div>
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Manage Users</h2>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleRole(user._id, user.role)}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                                    >
                                        Make {user.role === 'admin' ? 'Student' : 'Admin'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminDashboard