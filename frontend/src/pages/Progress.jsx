import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, interviewAPI, dsaAPI } from '../services/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MainLayout from '../components/MainLayout'
const BASE_URL = import.meta.env.VITE_BASE_URL

function Progress() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [dsaStats, setDsaStats] = useState(null);
    const [aptitudeTests, setAptitudeTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            const currentUser = authAPI.getCurrentUser();
            if (!currentUser) {
                navigate('/login');
                return;
            }

            setUser(currentUser);
            const userId = currentUser._id || currentUser.id;

            try {
                // Fetch interview, DSA, and aptitude data
                const [interviewResponse, dsaResponse, aptitudeResponse] = await Promise.all([
                    interviewAPI.getUserInterviews(userId),
                    dsaAPI.getStats(),
                    fetch(`${BASE_URL}/api/aptitude/results/${userId}`).then(res => res.json()).catch(() => ({ tests: [] }))
                ]);

                // Handle interview data
                let interviewData = [];
                if (Array.isArray(interviewResponse)) {
                    interviewData = interviewResponse;
                } else if (interviewResponse.success && interviewResponse.interviews) {
                    interviewData = interviewResponse.interviews;
                } else if (interviewResponse.interviews) {
                    interviewData = interviewResponse.interviews;
                } else if (interviewResponse.data) {
                    interviewData = interviewResponse.data;
                }
                setInterviews(interviewData);

                // Handle DSA stats
                setDsaStats(dsaResponse.stats || dsaResponse);

                // Handle aptitude data
                const aptitudeData = aptitudeResponse.tests || aptitudeResponse.data || [];
                setAptitudeTests(Array.isArray(aptitudeData) ? aptitudeData : []);

            } catch (error) {
                console.error('Error fetching progress data:', error);
                setInterviews([]);
                setDsaStats(null);
                setAptitudeTests([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    // ===== INTERVIEW ANALYTICS =====
    const safeInterviews = Array.isArray(interviews) ? interviews : [];
    const completedInterviews = safeInterviews.filter(i => i.status === 'completed');
    const inProgressInterviews = safeInterviews.filter(i => i.status === 'in-progress');

    const scoreTrendData = completedInterviews
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((interview, index) => ({
            name: `#${index + 1}`,
            score: interview.overallScore || 0,
            date: new Date(interview.createdAt).toLocaleDateString()
        }));

    const companyStats = {};
    completedInterviews.forEach(interview => {
        if (!companyStats[interview.company]) {
            companyStats[interview.company] = { total: 0, count: 0, interviews: [] };
        }
        companyStats[interview.company].total += interview.overallScore || 0;
        companyStats[interview.company].count += 1;
        companyStats[interview.company].interviews.push(interview);
    });

    const companyPerformance = Object.entries(companyStats).map(([company, data]) => ({
        company,
        avgScore: Math.round(data.total / data.count),
        count: data.count
    })).sort((a, b) => b.avgScore - a.avgScore);

    const typeStats = {
        technical: completedInterviews.filter(i => i.type === 'technical').length,
        behavioral: completedInterviews.filter(i => i.type === 'behavioral').length,
        mixed: completedInterviews.filter(i => i.type === 'mixed').length
    };

    const typePieData = [
        { name: 'Technical', value: typeStats.technical, color: '#3B82F6' },
        { name: 'Behavioral', value: typeStats.behavioral, color: '#10B981' },
        { name: 'Mixed', value: typeStats.mixed, color: '#F59E0B' }
    ].filter(item => item.value > 0);

    const totalScore = completedInterviews.reduce((sum, i) => sum + (i.overallScore || 0), 0);
    const averageScore = completedInterviews.length > 0 ? Math.round(totalScore / completedInterviews.length) : 0;
    const bestScore = completedInterviews.length > 0 ? Math.max(...completedInterviews.map(i => i.overallScore || 0)) : 0;

    // ===== DSA ANALYTICS =====
    const dsaDifficultyData = dsaStats ? [
        { name: 'Easy', value: dsaStats.byDifficulty?.easy || 0, color: '#10B981' },
        { name: 'Medium', value: dsaStats.byDifficulty?.medium || 0, color: '#F59E0B' },
        { name: 'Hard', value: dsaStats.byDifficulty?.hard || 0, color: '#EF4444' }
    ].filter(item => item.value > 0) : [];

    const dsaCategoryData = dsaStats?.byCategory ?
        Object.entries(dsaStats.byCategory)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
        : [];

    // ===== APTITUDE ANALYTICS =====
    const safeAptitudeTests = Array.isArray(aptitudeTests) ? aptitudeTests : [];

    // Score trend
    const aptitudeScoreTrend = safeAptitudeTests
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((test, index) => ({
            name: `#${index + 1}`,
            score: parseFloat(test.score?.percentage || 0),
            date: new Date(test.createdAt).toLocaleDateString()
        }));

    // Category breakdown
    const aptitudeByCategory = {};
    safeAptitudeTests.forEach(test => {
        if (!aptitudeByCategory[test.category]) {
            aptitudeByCategory[test.category] = { total: 0, count: 0 };
        }
        aptitudeByCategory[test.category].total += parseFloat(test.score?.percentage || 0);
        aptitudeByCategory[test.category].count += 1;
    });

    const aptitudeCategoryData = Object.entries(aptitudeByCategory).map(([category, data]) => ({
        category,
        avgScore: Math.round(data.total / data.count),
        count: data.count
    }));

    const aptitudeCategoryPieData = aptitudeCategoryData.map((item, index) => ({
        name: item.category,
        value: item.count,
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
    }));

    // Difficulty breakdown
    const aptitudeByDifficulty = {};
    safeAptitudeTests.forEach(test => {
        if (!aptitudeByDifficulty[test.difficulty]) {
            aptitudeByDifficulty[test.difficulty] = 0;
        }
        aptitudeByDifficulty[test.difficulty] += 1;
    });

    const aptitudeDifficultyData = [
        { name: 'Easy', value: aptitudeByDifficulty.easy || 0, color: '#10B981' },
        { name: 'Medium', value: aptitudeByDifficulty.medium || 0, color: '#F59E0B' },
        { name: 'Hard', value: aptitudeByDifficulty.hard || 0, color: '#EF4444' }
    ].filter(item => item.value > 0);

    // Average stats
    const totalAptitudeScore = safeAptitudeTests.reduce((sum, test) => sum + parseFloat(test.score?.percentage || 0), 0);
    const avgAptitudeScore = safeAptitudeTests.length > 0 ? Math.round(totalAptitudeScore / safeAptitudeTests.length) : 0;
    const bestAptitudeScore = safeAptitudeTests.length > 0 ? Math.max(...safeAptitudeTests.map(t => parseFloat(t.score?.percentage || 0))) : 0;

    return (
        <MainLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                <div className="max-w-7xl mx-auto pt-8 pb-12">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="text-blue-600 hover:text-blue-700 font-semibold mb-2 flex items-center gap-2"
                            >
                                ← Back to Dashboard
                            </button>
                            <h1 className="text-4xl font-bold text-gray-800">Your Progress</h1>
                            <p className="text-gray-600 mt-2">Track your performance and improvement over time</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/aptitude-setup')}
                                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition shadow-lg"
                            >
                                📝 Aptitude Test
                            </button>
                            <button
                                onClick={() => navigate('/dsa')}
                                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition shadow-lg"
                            >
                                💻 Practice DSA
                            </button>
                            <button
                                onClick={() => navigate('/interview-setup')}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
                            >
                                🎤 New Interview
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Interview Stats */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🎤</span>
                                <div className="text-sm text-gray-600">Interviews</div>
                            </div>
                            <div className="text-3xl font-bold text-blue-600">{safeInterviews.length}</div>
                            <div className="text-xs text-gray-500 mt-1">
                                {completedInterviews.length} completed
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">⭐</span>
                                <div className="text-sm text-gray-600">Interview Score</div>
                            </div>
                            <div className="text-3xl font-bold text-green-600">{averageScore}</div>
                            <div className="text-xs text-gray-500 mt-1">Average performance</div>
                        </div>

                        {/* DSA Stats */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">💻</span>
                                <div className="text-sm text-gray-600">DSA Solved</div>
                            </div>
                            <div className="text-3xl font-bold text-purple-600">
                                {dsaStats?.totalSolved || 0}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {dsaStats?.byDifficulty?.easy || 0}E • {dsaStats?.byDifficulty?.medium || 0}M • {dsaStats?.byDifficulty?.hard || 0}H
                            </div>
                        </div>

                        {/* Aptitude Stats */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">📝</span>
                                <div className="text-sm text-gray-600">Aptitude Tests</div>
                            </div>
                            <div className="text-3xl font-bold text-orange-600">
                                {safeAptitudeTests.length}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                Avg: {avgAptitudeScore}%
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
                        <div className="flex gap-2 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition whitespace-nowrap ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                📊 Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('interviews')}
                                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition whitespace-nowrap ${activeTab === 'interviews' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                🎤 Interviews
                            </button>
                            <button
                                onClick={() => setActiveTab('aptitude')}
                                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition whitespace-nowrap ${activeTab === 'aptitude' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                📝 Aptitude
                            </button>
                            <button
                                onClick={() => setActiveTab('dsa')}
                                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition whitespace-nowrap ${activeTab === 'dsa' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                💻 DSA Practice
                            </button>
                            <button
                                onClick={() => setActiveTab('companies')}
                                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition whitespace-nowrap ${activeTab === 'companies' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                🏢 Companies
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Interview Score Trend */}
                                {scoreTrendData.length > 0 ? (
                                    <div className="bg-white rounded-xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4">Interview Score Trend</h3>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={scoreTrendData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis domain={[0, 100]} />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} name="Score" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                        <div className="text-6xl mb-4">🎤</div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Interview Data</h3>
                                        <p className="text-gray-600">Complete interviews to see your progress</p>
                                    </div>
                                )}

                                {/* Aptitude Score Trend */}
                                {aptitudeScoreTrend.length > 0 ? (
                                    <div className="bg-white rounded-xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4">Aptitude Score Trend</h3>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={aptitudeScoreTrend}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis domain={[0, 100]} />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="score" stroke="#F59E0B" strokeWidth={2} name="Score %" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                        <div className="text-6xl mb-4">📝</div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Aptitude Data</h3>
                                        <p className="text-gray-600 mb-4">Take tests to see your progress</p>
                                        <button
                                            onClick={() => navigate('/aptitude-setup')}
                                            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
                                        >
                                            Take Test
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Second Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* DSA by Difficulty */}
                                {dsaDifficultyData.length > 0 ? (
                                    <div className="bg-white rounded-xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4">DSA by Difficulty</h3>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie data={dsaDifficultyData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                                    {dsaDifficultyData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                        <div className="text-6xl mb-4">💻</div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">No DSA Progress</h3>
                                        <p className="text-gray-600 mb-4">Start solving problems!</p>
                                        <button
                                            onClick={() => navigate('/dsa')}
                                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                                        >
                                            Practice Now
                                        </button>
                                    </div>
                                )}

                                {/* Aptitude by Category */}
                                {aptitudeCategoryPieData.length > 0 ? (
                                    <div className="bg-white rounded-xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4">Aptitude by Category</h3>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie data={aptitudeCategoryPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                                    {aptitudeCategoryPieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                        <div className="text-6xl mb-4">📊</div>
                                        <p className="text-gray-600">No aptitude data yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Third Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Interview Types */}
                                {typePieData.length > 0 ? (
                                    <div className="bg-white rounded-xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4">Interview Types</h3>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie data={typePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                                    {typePieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                        <div className="text-6xl mb-4">📊</div>
                                        <p className="text-gray-600">No interview types data</p>
                                    </div>
                                )}

                                {/* DSA by Category */}
                                {dsaCategoryData.length > 0 ? (
                                    <div className="bg-white rounded-xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4">Top DSA Categories</h3>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={dsaCategoryData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="count" fill="#8B5CF6" name="Solved" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                        <div className="text-6xl mb-4">📈</div>
                                        <p className="text-gray-600">No category data yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'interviews' && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">All Interviews</h3>

                            {safeInterviews.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🎤</div>
                                    <p className="text-gray-600 text-lg mb-4">No interviews yet</p>
                                    <button
                                        onClick={() => navigate('/interview-setup')}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Start Your First Interview
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {safeInterviews.map((interview, index) => (
                                        <div key={interview._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-gray-500 font-mono">#{safeInterviews.length - index}</span>
                                                        <h4 className="text-lg font-semibold text-gray-800">{interview.company}</h4>
                                                        <span className="text-sm text-gray-600">•</span>
                                                        <span className="text-sm text-gray-600">{interview.role}</span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${interview.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {interview.status === 'completed' ? 'Completed' : 'In Progress'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span className="capitalize">{interview.type} Interview</span>
                                                        <span>•</span>
                                                        <span>{interview.questions?.length || 0} Questions</span>
                                                        <span>•</span>
                                                        <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    {interview.status === 'completed' && interview.overallScore !== undefined && (
                                                        <div className="text-center">
                                                            <div className="text-sm text-gray-600">Score</div>
                                                            <div className={`text-2xl font-bold ${interview.overallScore >= 70 ? 'text-green-600' : interview.overallScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                                {interview.overallScore}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={() => navigate('/interview-result', { state: { result: interview } })}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                                    >
                                                        {interview.status === 'completed' ? 'View Results' : 'Continue'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'aptitude' && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Aptitude Test Results</h3>
                                <button
                                    onClick={() => navigate('/aptitude-setup')}
                                    className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
                                >
                                    Take New Test
                                </button>
                            </div>

                            {safeAptitudeTests.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📝</div>
                                    <p className="text-gray-600 text-lg mb-4">No aptitude tests taken yet</p>
                                    <button
                                        onClick={() => navigate('/aptitude-setup')}
                                        className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
                                    >
                                        Take Your First Test
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Performance Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                                            <div className="text-sm text-blue-700 mb-1">Total Tests</div>
                                            <div className="text-3xl font-bold text-blue-600">{safeAptitudeTests.length}</div>
                                        </div>
                                        <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                                            <div className="text-sm text-green-700 mb-1">Average Score</div>
                                            <div className="text-3xl font-bold text-green-600">{avgAptitudeScore}%</div>
                                        </div>
                                        <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                                            <div className="text-sm text-yellow-700 mb-1">Best Score</div>
                                            <div className="text-3xl font-bold text-yellow-600">{Math.round(bestAptitudeScore)}%</div>
                                        </div>
                                    </div>

                                    {/* Category Performance */}
                                    {aptitudeCategoryData.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Performance by Category</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {aptitudeCategoryData.map((cat) => (
                                                    <div key={cat.category} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-gray-700 font-medium capitalize">{cat.category}</span>
                                                            <span className={`text-2xl font-bold ${cat.avgScore >= 70 ? 'text-green-600' : cat.avgScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                                {cat.avgScore}%
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-600">{cat.count} test{cat.count > 1 ? 's' : ''}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Test History */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Tests</h4>
                                        <div className="space-y-3">
                                            {safeAptitudeTests.slice(0, 10).reverse().map((test, index) => (
                                                <div key={test._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <span className="text-gray-500 font-mono">#{safeAptitudeTests.length - index}</span>
                                                                <span className="font-semibold text-gray-800 capitalize">{test.category}</span>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${test.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                                    test.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                        'bg-red-100 text-red-700'
                                                                    }`}>
                                                                    {test.difficulty}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                                <span>{test.score.correct}/{test.score.total} correct</span>
                                                                <span>•</span>
                                                                <span>{Math.floor(test.timeTaken / 60)}m {test.timeTaken % 60}s</span>
                                                                <span>•</span>
                                                                <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-sm text-gray-600">Score</div>
                                                            <div className={`text-2xl font-bold ${parseFloat(test.score.percentage) >= 70 ? 'text-green-600' :
                                                                parseFloat(test.score.percentage) >= 50 ? 'text-yellow-600' :
                                                                    'text-red-600'
                                                                }`}>
                                                                {Math.round(test.score.percentage)}%
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'dsa' && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">DSA Practice Progress</h3>
                                <button
                                    onClick={() => navigate('/dsa')}
                                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                                >
                                    Practice Now
                                </button>
                            </div>

                            {!dsaStats || dsaStats.totalSolved === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">💻</div>
                                    <p className="text-gray-600 text-lg mb-4">No DSA problems solved yet</p>
                                    <button
                                        onClick={() => navigate('/dsa')}
                                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                                    >
                                        Start Practicing
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Difficulty Breakdown */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4">By Difficulty</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                                                <div className="text-sm text-green-700 mb-1">Easy</div>
                                                <div className="text-3xl font-bold text-green-600">{dsaStats.byDifficulty?.easy || 0}</div>
                                            </div>
                                            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                                                <div className="text-sm text-yellow-700 mb-1">Medium</div>
                                                <div className="text-3xl font-bold text-yellow-600">{dsaStats.byDifficulty?.medium || 0}</div>
                                            </div>
                                            <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                                                <div className="text-sm text-red-700 mb-1">Hard</div>
                                                <div className="text-3xl font-bold text-red-600">{dsaStats.byDifficulty?.hard || 0}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Category Breakdown */}
                                    {dsaCategoryData.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 mb-4">By Category</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {Object.entries(dsaStats.byCategory || {}).map(([category, count]) => (
                                                    <div key={category} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-700 font-medium">{category}</span>
                                                            <span className="text-2xl font-bold text-purple-600">{count}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'companies' && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Performance by Company</h3>

                            {companyPerformance.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🏢</div>
                                    <p className="text-gray-600 text-lg">Complete interviews to see company-wise analytics</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {companyPerformance.map((company) => (
                                        <div key={company.company} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                            <h4 className="text-lg font-semibold text-gray-800 mb-2">{company.company}</h4>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-600">Average Score</span>
                                                <span className={`text-2xl font-bold ${company.avgScore >= 70 ? 'text-green-600' : company.avgScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {company.avgScore}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {company.count} interview{company.count > 1 ? 's' : ''} completed
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

export default Progress;