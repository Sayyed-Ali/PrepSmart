import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, interviewAPI } from '../services/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Progress() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [interviews, setInterviews] = useState([]);
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

            console.log('🔍 Fetching interviews for user:', userId);

            try {
                const response = await interviewAPI.getUserInterviews(userId);
                console.log('🔍 Full API Response:', JSON.stringify(response, null, 2));

                // Try different response structures
                let interviewData = [];
                if (Array.isArray(response)) {
                    interviewData = response;
                } else if (response.success && response.interviews) {
                    interviewData = response.interviews;
                } else if (response.interviews) {
                    interviewData = response.interviews;
                } else if (response.data) {
                    interviewData = response.data;
                }
                console.log('🔍 Interview data extracted:', interviewData);
                setInterviews(interviewData);
            } catch (error) {
                console.error('Error fetching interviews:', error);
                setInterviews([]);
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

    // ✅ SAFETY CHECK - Make sure interviews is an array
    const safeInterviews = Array.isArray(interviews) ? interviews : [];

    // ✅ DEBUG LOGS
    console.log('🔍 PROGRESS PAGE DEBUG:');
    console.log('All interviews:', safeInterviews);
    console.log('Total count:', safeInterviews.length);

    // ===== ANALYTICS CALCULATIONS =====
    const completedInterviews = safeInterviews.filter(i => i.status === 'completed');
    const inProgressInterviews = safeInterviews.filter(i => i.status === 'in-progress');

    console.log('Completed interviews:', completedInterviews);
    console.log('Completed count:', completedInterviews.length);
    console.log('In-progress count:', inProgressInterviews.length);

    // Check first completed interview
    if (completedInterviews.length > 0) {
        console.log('First completed interview:', completedInterviews[0]);
        console.log('Has overallScore?', completedInterviews[0].overallScore);
        console.log('Interview status:', completedInterviews[0].status);
    }

    // Score trend data
    const scoreTrendData = completedInterviews
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((interview, index) => ({
            name: `#${index + 1}`,
            score: interview.overallScore || 0,
            date: new Date(interview.createdAt).toLocaleDateString()
        }));

    console.log('Score trend data:', scoreTrendData);

    // Company-wise performance
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

    console.log('Company performance:', companyPerformance);

    // Interview type breakdown
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

    console.log('Type pie data:', typePieData);

    // Overall stats
    const totalScore = completedInterviews.reduce((sum, i) => sum + (i.overallScore || 0), 0);
    console.log('Total score sum:', totalScore);

    const averageScore = completedInterviews.length > 0 ? Math.round(totalScore / completedInterviews.length) : 0;
    console.log('Average score calculated:', averageScore);

    const bestScore = completedInterviews.length > 0 ? Math.max(...completedInterviews.map(i => i.overallScore || 0)) : 0;
    console.log('Best score:', bestScore);

    const worstScore = completedInterviews.length > 0 ? Math.min(...completedInterviews.map(i => i.overallScore || 0)) : 0;
    console.log('Worst score:', worstScore);

    return (
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
                    <button
                        onClick={() => navigate('/interview-setup')}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
                    >
                        + New Interview
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="text-sm text-gray-600 mb-1">Total Interviews</div>
                        <div className="text-3xl font-bold text-blue-600">{safeInterviews.length}</div>
                        <div className="text-xs text-gray-500 mt-1">
                            {completedInterviews.length} completed, {inProgressInterviews.length} in progress
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="text-sm text-gray-600 mb-1">Average Score</div>
                        <div className="text-3xl font-bold text-green-600">{averageScore}</div>
                        <div className="text-xs text-gray-500 mt-1">Across all completed interviews</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="text-sm text-gray-600 mb-1">Best Score</div>
                        <div className="text-3xl font-bold text-yellow-600">{bestScore}</div>
                        <div className="text-xs text-gray-500 mt-1">Your highest achievement</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="text-sm text-gray-600 mb-1">Improvement</div>
                        <div className="text-3xl font-bold text-purple-600">
                            {scoreTrendData.length >= 2
                                ? (scoreTrendData[scoreTrendData.length - 1].score - scoreTrendData[0].score > 0 ? '+' : '')
                                + (scoreTrendData[scoreTrendData.length - 1].score - scoreTrendData[0].score)
                                : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Since first interview</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            📊 Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('interviews')}
                            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${activeTab === 'interviews' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            🎤 All Interviews
                        </button>
                        <button
                            onClick={() => setActiveTab('companies')}
                            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${activeTab === 'companies' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            🏢 By Company
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">

                        {/* Score Trend Chart */}
                        {scoreTrendData.length > 0 ? (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Score Trend</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={scoreTrendData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} name="Score" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                <div className="text-6xl mb-4">📈</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Data Yet</h3>
                                <p className="text-gray-600">Complete interviews to see your progress chart</p>
                            </div>
                        )}

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Interview Type Breakdown */}
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

                            {/* Top Companies */}
                            {companyPerformance.length > 0 ? (
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Top Companies</h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={companyPerformance.slice(0, 5)}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="company" />
                                            <YAxis domain={[0, 100]} />
                                            <Tooltip />
                                            <Bar dataKey="avgScore" fill="#10B981" name="Avg Score" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                    <div className="text-6xl mb-4">🏢</div>
                                    <p className="text-gray-600">No company data yet</p>
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
    );
}

export default Progress;