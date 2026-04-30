import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authAPI, dsaAPI } from '../services/api';
import MainLayout from '../components/MainLayout'

function DSAProblemDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedApproach, setSelectedApproach] = useState('bruteForce');

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        fetchProblem();
    }, [navigate, id]);

    const fetchProblem = async () => {
        try {
            setLoading(true);
            const response = await dsaAPI.getProblem(id);
            setProblem(response.problem);
        } catch (error) {
            console.error('Error fetching problem:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleComplete = async () => {
        try {
            const response = await dsaAPI.toggleComplete(id);
            setProblem({ ...problem, isCompleted: response.isCompleted });
        } catch (error) {
            console.error('Error toggling completion:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading problem...</p>
                </div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="text-6xl mb-4"></div>
                    <p className="text-gray-600 text-lg mb-4">Problem not found</p>
                    <button
                        onClick={() => navigate('/dsa')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Back to Problems
                    </button>
                </div>
            </div>
        );
    }

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-100 text-green-700';
            case 'Medium': return 'bg-orange-100 text-orange-700';
            case 'Hard': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-5xl mx-auto pt-8 pb-12">

                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate('/dsa')}
                            className="text-blue-600 hover:text-blue-700 font-semibold mb-4"
                        >
                            ← Back to Problems
                        </button>

                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <h1 className="text-3xl font-bold text-gray-800">{problem.title}</h1>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </span>
                                </div>
                                <p className="text-gray-600">{problem.category}</p>
                            </div>

                            <button
                                onClick={handleToggleComplete}
                                className={`px-6 py-3 rounded-xl font-semibold transition ${problem.isCompleted
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {problem.isCompleted ? '✓ Completed' : 'Mark as Done'}
                            </button>
                        </div>
                    </div>

                    {/* Practice Button */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">Ready to solve?</h3>
                                <p className="text-gray-600 text-sm">Estimated time: {problem.estimatedTime} minutes</p>
                            </div>
                            <a
                                href={problem.leetcodeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-yellow-600 transition shadow-lg"
                            >
                                Practice on LeetCode →
                            </a>
                        </div>
                    </div>

                    {/* Approach Selection */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Solution Approaches</h2>

                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={() => setSelectedApproach('bruteForce')}
                                className={`flex-1 py-3 rounded-lg font-semibold transition ${selectedApproach === 'bruteForce'
                                    ? 'bg-gray-800 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                I. Brute Force
                            </button>
                            <button
                                onClick={() => setSelectedApproach('better')}
                                className={`flex-1 py-3 rounded-lg font-semibold transition ${selectedApproach === 'better'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                II. Better
                            </button>
                            <button
                                onClick={() => setSelectedApproach('optimal')}
                                className={`flex-1 py-3 rounded-lg font-semibold transition ${selectedApproach === 'optimal'
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                III. Best (Optimal)
                            </button>
                        </div>

                        {/* Approach Details */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-3">
                                {selectedApproach === 'bruteForce' && ' Brute Force Approach'}
                                {selectedApproach === 'better' && '⚡ Better Approach'}
                                {selectedApproach === 'optimal' && ' Optimal Approach'}
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {selectedApproach === 'bruteForce' && problem.approaches.bruteForce}
                                {selectedApproach === 'better' && problem.approaches.better}
                                {selectedApproach === 'optimal' && problem.approaches.optimal}
                            </p>
                        </div>
                    </div>

                    {/* Additional Resources */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Additional Resources</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {problem.articleLink && (
                                <a
                                    href={problem.articleLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl">

                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-800">Article</div>
                                        <div className="text-sm text-gray-600">Read detailed explanation</div>
                                    </div>
                                </a>
                            )}

                            {problem.youtubeLink && (
                                <a
                                    href={problem.youtubeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white text-xl">
                                        ▶
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-800">Video Tutorial</div>
                                        <div className="text-sm text-gray-600">Watch explanation</div>
                                    </div>
                                </a>
                            )}

                            <a
                                href={problem.leetcodeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                            >
                                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl">
                                    &lt;/&gt;
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-800">LeetCode</div>
                                    <div className="text-sm text-gray-600">Practice & submit</div>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Companies */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Asked by Companies</h2>
                        <div className="flex gap-3 flex-wrap">
                            {problem.companies.map((company, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold"
                                >
                                    {company}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default DSAProblemDetail;