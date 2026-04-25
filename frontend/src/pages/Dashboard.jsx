import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI, interviewAPI } from '../services/api'
import StatsGrid from '../components/StatsGrid'
import WelcomeCard from '../components/WelcomeCard'
import RecentInterviews from '../components/RecentInterviews'
import CalendarWidget from '../components/CalendarWidget'
import ProgressChart from '../components/ProgressChart'
import MainLayout from '../components/MainLayout'

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

            console.log('Current user object:', currentUser); // ✅ DEBUG - see what's in the user object

            setUser(currentUser)

            // ✅ FIXED - Try both _id and id
            const userId = currentUser._id || currentUser.id;

            if (!userId) {
                console.error('User ID not found in user object:', currentUser);
                setLoading(false);
                return;
            }

            // fetch user's interviews
            try {
                console.log('Fetching interviews for user:', userId);
                const response = await interviewAPI.getUserInterviews(userId);
                console.log('API Response:', response);

                if (response.success && response.interviews) {
                    setInterviews(response.interviews);
                } else if (response.data) {
                    setInterviews(response.data);
                } else {
                    setInterviews([]);
                }
            } catch (error) {
                console.error('Error fetching interviews:', error);
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
    const completedInterviews = interviews.filter(i => i.status === 'completed');
    const stats = {
        interviewsCompleted: completedInterviews.length,
        totalInterviews: interviews.length,
        averageScore: completedInterviews.length > 0
            ? (completedInterviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / completedInterviews.length).toFixed(1)
            : 0,
        timeSpent: user.stats?.timeSpent || 0
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">

                <div className="flex-1 overflow-auto">
                    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">

                        {/* HEADER */}
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">

                            {/* LEFT TEXT */}
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                                    Hello, {user.name}!
                                </h1>
                                <p className="text-gray-600 text-base lg:text-lg">
                                    {stats.totalInterviews === 0
                                        ? "Ready to start your first interview?"
                                        : "Ready to ace your next interview?"}
                                </p>
                            </div>

                            {/* RIGHT ACTIONS */}
                            <div className="flex items-center gap-4">

                                {/* NOTIFICATION */}
                                <button className="relative w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200">
                                    <span className="text-lg">
                                        <span className="material-symbols-outlined" style={{ color: '#F19E39' }}>
                                            notifications_unread
                                        </span>
                                    </span>
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-semibold">
                                        0
                                    </span>
                                </button>

                                {/* USER PROFILE */}
                                <div className="flex items-center gap-3 bg-white py-2 px-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden sm:block">
                                        <h4 className="text-sm font-semibold text-gray-800">
                                            {user.name}
                                        </h4>
                                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* STATS */}
                        <div className="mb-10">
                            <StatsGrid stats={stats} />
                        </div>

                        {/* MAIN GRID */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-10">

                            {/* LEFT SECTION */}
                            <div className="xl:col-span-8 space-y-8">

                                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
                                    <WelcomeCard />
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
                                    <RecentInterviews interviews={interviews.slice(0, 3)} />
                                </div>
                            </div>

                            {/* RIGHT SECTION */}
                            <div className="xl:col-span-4">
                                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
                                    <CalendarWidget />
                                </div>
                            </div>
                        </div>

                        {/* PROGRESS */}
                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
                            <ProgressChart />
                        </div>

                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default Dashboard