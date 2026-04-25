import { useState, useEffect } from 'react';
import { interviewAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import MainLayout from '../components/MainLayout'

function InterviewProgress({ userId }) {
    const [interviews, setInterviews] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        avgScore: 0,
        bestScore: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInterviewData();
    }, [userId]);

    const loadInterviewData = async () => {
        try {
            const response = await interviewAPI.getUserInterviews(userId);
            const interviewData = response.interviews || [];
            setInterviews(interviewData);

            const completed = interviewData.filter(i => i.status === 'completed');
            const scores = completed.map(i => i.overallScore || 0);

            const avgScore = scores.length > 0
                ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
                : 0;

            const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

            setStats({
                total: interviewData.length,
                completed: completed.length,
                avgScore,
                bestScore
            });

        } catch (error) {
            console.error('Error loading interview data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
            </div>
        );
    }

    const chartData = interviews
        .filter(i => i.status === 'completed' && i.overallScore)
        .slice(-10)
        .map((interview, index) => ({
            name: `#${index + 1}`,
            score: interview.overallScore,
            date: new Date(interview.completedAt).toLocaleDateString()
        }));

    const companyData = interviews.reduce((acc, interview) => {
        const company = interview.company;
        acc[company] = (acc[company] || 0) + 1;
        return acc;
    }, {});

    const companyChartData = Object.entries(companyData).map(([company, count]) => ({
        company,
        count
    }));

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4">
                        <div className="text-sm opacity-90">Total Interviews</div>
                        <div className="text-3xl font-bold mt-1">{stats.total}</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4">
                        <div className="text-sm opacity-90">Completed</div>
                        <div className="text-3xl font-bold mt-1">{stats.completed}</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4">
                        <div className="text-sm opacity-90">Average Score</div>
                        <div className="text-3xl font-bold mt-1">{stats.avgScore}</div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4">
                        <div className="text-sm opacity-90">Best Score</div>
                        <div className="text-3xl font-bold mt-1">{stats.bestScore}</div>
                    </div>
                </div>

                {/* Score Trend Chart */}
                {chartData.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Score Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{ fill: '#8b5cf6', r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Company Distribution */}
                {companyChartData.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Interviews by Company</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={companyChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="company" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Recent Interviews List */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Interviews</h3>
                    <div className="space-y-3">
                        {interviews.slice(0, 5).map((interview) => (
                            <div
                                key={interview._id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                            >
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-800">
                                        {interview.company} - {interview.role}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {interview.type} • {new Date(interview.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${interview.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        interview.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {interview.status}
                                    </div>
                                    {interview.overallScore && (
                                        <div className="text-2xl font-bold text-blue-600">
                                            {interview.overallScore}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default InterviewProgress;