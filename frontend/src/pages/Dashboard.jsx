import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI, interviewAPI } from '../services/api'
import Sidebar from '../components/DashboardSidebar'
import StatsGrid from '../components/StatsGrid'
import WelcomeCard from '../components/WelcomeCard'
import RecentInterviews from '../components/RecentInterviews'
import CalendarWidget from '../components/CalendarWidget'
import ProgressChart from '../components/ProgressChart'

function Dashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [interviews, setInterviews] = useState([])
    const [loading, setLoading] = useState(true)

    // get user data and interviews on mount
    useEffect(() => {
        const fetchData = async () => {
            const currentUser = authAPI.getCurrentUser()
            if (!currentUser) {
                navigate('/login')
                return
            }

            setUser(currentUser)

            // fetch user's interviews
            try {
                const response = await interviewAPI.getUserInterviews(currentUser.id)
                console.log('User interviews:', response)
                setInterviews(response.interviews || [])
            } catch (error) {
                console.error('Error fetching interviews:', error)
                setInterviews([])
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [navigate])

    const handleLogout = () => {
        authAPI.logout()
        navigate('/login')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <div className="text-gray-600">Loading your dashboard...</div>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    // calculate stats from actual data
    const stats = {
        interviewsCompleted: interviews.filter(i => i.status === 'completed').length,
        totalInterviews: interviews.length,
        averageScore: interviews.length > 0
            ? (interviews.reduce((sum, i) => sum + (i.feedback?.overallScore || 0), 0) / interviews.length).toFixed(1)
            : 0,
        // for time spent, we'll use user.stats if available
        timeSpent: user.stats?.timeSpent || 0
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar onLogout={handleLogout} />

            <div className="flex-1 overflow-auto">
                <div className="max-w-[1400px] mx-auto p-6 lg:p-10">

                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                                Hello, {user.name}! 👋
                            </h1>
                            <p className="text-gray-600 text-base lg:text-lg">
                                {stats.totalInterviews === 0
                                    ? "Ready to start your first interview?"
                                    : "Ready to ace your next interview?"}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="relative w-11 h-11 bg-white rounded-xl flex items-center justify-center hover:shadow-lg transition-all">
                                <span className="text-lg">🔔</span>
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-semibold">
                                    0
                                </span>
                            </button>

                            <div className="flex items-center gap-3 bg-white py-2 px-4 rounded-full hover:shadow-lg transition-all cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden sm:block">
                                    <h4 className="text-sm font-semibold text-gray-800">
                                        {user.name}
                                    </h4>
                                    <p className="text-xs text-gray-500">{user.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pass real stats to StatsGrid */}
                    <StatsGrid stats={stats} />

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
                        <div className="xl:col-span-8 space-y-6">
                            <WelcomeCard />
                            {/* Pass real interviews data */}
                            <RecentInterviews interviews={interviews.slice(0, 3)} />
                        </div>
                        <div className="xl:col-span-4">
                            <CalendarWidget />
                        </div>
                    </div>

                    <ProgressChart />
                </div>
            </div>
        </div>
    )
}

export default Dashboard