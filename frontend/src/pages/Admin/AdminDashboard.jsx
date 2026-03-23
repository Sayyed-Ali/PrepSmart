import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'

function AdminDashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser()

        // check if user is admin
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
        { id: 'questions', label: 'Questions Bank', icon: '❓' }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">🔧 Admin Panel</h1>
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
        // fetch stats from API
        // for now using dummy data
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
                    <div className="text-3xl mb-2">⚡</div>
                    <div className="text-3xl font-bold text-gray-800">{stats.activeToday}</div>
                    <div className="text-gray-600">Active Today</div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition text-left">
                        <div className="text-2xl mb-2">➕</div>
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

// Companies Tab Component
function CompaniesTab() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Companies</h2>
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition">
                    + Add Company
                </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                    <div className="text-2xl">⚠️</div>
                    <div>
                        <h4 className="font-bold text-yellow-900">Under Construction</h4>
                        <p className="text-sm text-yellow-800">Company management UI coming soon. Use bulk upload script for now.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold mb-4">How to Add Companies</h3>
                <ol className="space-y-3 text-gray-700">
                    <li className="flex gap-3">
                        <span className="font-bold">1.</span>
                        <span>Prepare company data in JSON format (see example below)</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-bold">2.</span>
                        <span>Use the bulk upload script in backend folder</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-bold">3.</span>
                        <span>Run: <code className="bg-gray-100 px-2 py-1 rounded">node scripts/uploadCompanies.js</code></span>
                    </li>
                </ol>
            </div>
        </div>
    )
}

// Users Tab Component
function UsersTab() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/admin/users')
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
            const response = await fetch(`http://localhost:5001/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            })

            if (response.ok) {
                alert('User role updated!')
                fetchUsers() // refresh list
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
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-blue-100 text-blue-700'
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

// Questions Tab Component
function QuestionsTab() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Questions Bank</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                    <div className="text-2xl">💡</div>
                    <div>
                        <h4 className="font-bold text-blue-900">Coming Soon</h4>
                        <p className="text-sm text-blue-800">Question management interface will be added in next iteration.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard