import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, dsaAPI } from '../services/api';
import MainLayout from '../components/MainLayout'

function DSAPractice() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        company: 'Amazon',
        difficulty: '',
        category: ''
    });
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        fetchProblems();
        fetchStats();
    }, [navigate, filter]);

    const fetchProblems = async () => {
        try {
            setLoading(true);
            const response = await dsaAPI.getProblems(filter);
            setProblems(response.problems || []);
        } catch (error) {
            console.error('Error fetching problems:', error);
            setProblems([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await dsaAPI.getStats();
            setStats(response.stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleToggleComplete = async (problemId) => {
        try {
            const response = await dsaAPI.toggleComplete(problemId);

            // Update local state
            setProblems(problems.map(p =>
                p._id === problemId
                    ? { ...p, isCompleted: response.isCompleted }
                    : p
            ));

            // Refresh stats
            fetchStats();
        } catch (error) {
            console.error('Error toggling completion:', error);
        }
    };

    const handleToggleFavorite = async (problemId) => {
        try {
            const response = await dsaAPI.toggleFavorite(problemId);

            // Update local state
            setProblems(problems.map(p =>
                p._id === problemId
                    ? { ...p, isFavorite: response.isFavorite }
                    : p
            ));
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-100 text-green-700';
            case 'Medium': return 'bg-orange-100 text-orange-700';
            case 'Hard': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getCompanyLogos = (companies) => {
        const companyColors = {
            'Amazon': 'bg-orange-500',
            'Google': 'bg-blue-500',
            'Microsoft': 'bg-green-500',
            'Facebook': 'bg-blue-600',
            'Apple': 'bg-gray-700',
            'Adobe': 'bg-red-500'
        };

        const displayCompanies = companies.slice(0, 3);
        const remainingCount = companies.length - 3;

        return (
            <div className="flex items-center gap-1">
                {displayCompanies.map((company, index) => (
                    <div
                        key={index}
                        className={`w-8 h-8 rounded-full ${companyColors[company] || 'bg-gray-400'} flex items-center justify-center text-white text-xs font-bold`}
                        title={company}
                    >
                        {company.charAt(0)}
                    </div>
                ))}
                {remainingCount > 0 && (
                    <div className="text-sm text-gray-600 ml-1">
                        +{remainingCount}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading problems...</p>
                </div>
            </div>
        );
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-7xl mx-auto pt-8 pb-12">

                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-blue-600 hover:text-blue-700 font-semibold mb-4"
                        >
                            ← Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            DSA Practice - Amazon Coding Sheet
                        </h1>
                        <p className="text-gray-600">
                            Master data structures and algorithms with curated problems
                        </p>
                    </div>

                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="text-sm text-gray-600 mb-1">Total Solved</div>
                                <div className="text-3xl font-bold text-blue-600">{stats.totalSolved}</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="text-sm text-gray-600 mb-1">Easy</div>
                                <div className="text-3xl font-bold text-green-600">{stats.byDifficulty.easy}</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="text-sm text-gray-600 mb-1">Medium</div>
                                <div className="text-3xl font-bold text-orange-600">{stats.byDifficulty.medium}</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="text-sm text-gray-600 mb-1">Hard</div>
                                <div className="text-3xl font-bold text-red-600">{stats.byDifficulty.hard}</div>
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                        <div className="flex gap-4 flex-wrap">
                            <select
                                value={filter.difficulty}
                                onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Difficulties</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>

                            <select
                                value={filter.category}
                                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Categories</option>
                                <option value="Arrays & Hashing">Arrays & Hashing</option>
                                <option value="Graph">Graph</option>
                                <option value="Sliding Window">Sliding Window</option>
                                <option value="Two Pointers">Two Pointers</option>
                                <option value="Stack">Stack</option>
                            </select>
                        </div>
                    </div>

                    {/* Problems Table */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Table Header */}
                        <div className="bg-gray-800 text-white px-6 py-4 grid grid-cols-12 gap-4 items-center text-sm font-semibold">
                            <div className="col-span-1"></div>
                            <div className="col-span-3">Problem</div>
                            <div className="col-span-2 text-center">Resources</div>
                            <div className="col-span-1 text-center">Level</div>
                            <div className="col-span-1 text-center">Time</div>
                            <div className="col-span-2 text-center">Companies</div>
                            <div className="col-span-2 text-center">Actions</div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-gray-200">
                            {problems.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">💻</div>
                                    <p className="text-gray-600 text-lg">No problems found</p>
                                </div>
                            ) : (
                                problems.map((problem) => (
                                    <div
                                        key={problem._id}
                                        className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition"
                                    >
                                        {/* Checkbox */}
                                        <div className="col-span-1">
                                            <button
                                                onClick={() => handleToggleComplete(problem._id)}
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${problem.isCompleted
                                                    ? 'bg-green-500 border-green-500'
                                                    : 'border-gray-400 hover:border-green-500'
                                                    }`}
                                            >
                                                {problem.isCompleted && (
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>

                                        {/* Problem Name */}
                                        <div className="col-span-3">
                                            <h3 className="text-gray-800 font-semibold">{problem.title}</h3>
                                            <p className="text-xs text-gray-500 mt-1">{problem.category}</p>
                                        </div>

                                        {/* Resource Buttons */}
                                        <div className="col-span-2 flex justify-center gap-2">
                                            {problem.articleLink && (
                                                <a
                                                    href={problem.articleLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                                                    title="Article"
                                                >
                                                    <span className="text-white text-sm">📝</span>
                                                </a>
                                            )}
                                            {problem.youtubeLink && (
                                                <a
                                                    href={problem.youtubeLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                                                    title="YouTube"
                                                >
                                                    <span className="text-white text-sm">▶</span>
                                                </a>
                                            )}
                                            <a
                                                href={problem.leetcodeLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                                                title="Practice on LeetCode"
                                            >
                                                <span className="text-white text-sm">&lt;/&gt;</span>
                                            </a>
                                        </div>

                                        {/* Difficulty Badge */}
                                        <div className="col-span-1 flex justify-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                                                {problem.difficulty}
                                            </span>
                                        </div>

                                        {/* Time Estimate */}
                                        <div className="col-span-1 text-center text-gray-700 font-semibold">
                                            {problem.estimatedTime} Min
                                        </div>

                                        {/* Company Logos */}
                                        <div className="col-span-2 flex justify-center">
                                            {getCompanyLogos(problem.companies)}
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-2 flex justify-center gap-3">
                                            {/* Approach Hints Button */}
                                            <button
                                                onClick={() => navigate(`/dsa/${problem._id}`)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                                            >
                                                💡 Hints
                                            </button>

                                            {/* Favorite Button */}
                                            <button
                                                onClick={() => handleToggleFavorite(problem._id)}
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${problem.isFavorite
                                                    ? 'bg-yellow-100 text-yellow-600'
                                                    : 'bg-gray-100 text-gray-400 hover:text-yellow-600'
                                                    }`}
                                                title="Add to favorites"
                                            >
                                                <svg className="w-5 h-5" fill={problem.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default DSAPractice;