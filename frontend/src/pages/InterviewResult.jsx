import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

function InterviewResult() {
    const navigate = useNavigate();
    const location = useLocation();
    const { result } = location.state || {};

    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);

        if (!result) {
            navigate('/dashboard');
        }
    }, [navigate, result]);

    // ✅ ENHANCED SAFETY CHECK - Check for questions array
    if (!result || !user || !result.questions || !Array.isArray(result.questions)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <div className="text-gray-600 text-lg">Loading results...</div>
                </div>
            </div>
        );
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreGrade = (score) => {
        if (score >= 90) return { grade: 'A+', emoji: '🌟' };
        if (score >= 80) return { grade: 'A', emoji: '🎉' };
        if (score >= 70) return { grade: 'B', emoji: '👍' };
        if (score >= 60) return { grade: 'C', emoji: '😊' };
        return { grade: 'D', emoji: '📚' };
    };

    const scoreInfo = getScoreGrade(result.overallScore || 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
            <div className="max-w-5xl mx-auto pt-10">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">{scoreInfo.emoji}</div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">
                        Interview Complete!
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Here's how you performed
                    </p>
                </div>

                {/* Overall Score Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center">
                    <div className="text-sm text-gray-600 mb-2">Overall Score</div>
                    <div className={`text-7xl font-bold mb-2 ${getScoreColor(result.overallScore || 0)}`}>
                        {result.overallScore || 0}
                    </div>
                    <div className="text-2xl font-bold text-gray-600 mb-4">
                        Grade: {scoreInfo.grade}
                    </div>
                    <div className="flex justify-center gap-4 text-sm">
                        <div className="bg-gray-100 px-4 py-2 rounded-lg">
                            <div className="text-gray-600">Questions</div>
                            <div className="font-bold">{result.questions.length}</div>
                        </div>
                        <div className="bg-gray-100 px-4 py-2 rounded-lg">
                            <div className="text-gray-600">Answered</div>
                            <div className="font-bold">
                                {result.questions.filter(q => q.userAnswer).length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Strengths and Improvements Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
                            <span>✓</span> Strengths
                        </h3>
                        <ul className="space-y-2">
                            {(result.feedback?.strengths || []).map((strength, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>{strength}</span>
                                </li>
                            ))}
                            {(!result.feedback?.strengths || result.feedback.strengths.length === 0) && (
                                <li className="text-gray-500 italic">No specific strengths identified</li>
                            )}
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h3 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
                            <span>⚠</span> Areas to Improve
                        </h3>
                        <ul className="space-y-2">
                            {(result.feedback?.improvements || []).map((improvement, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700">
                                    <span className="text-orange-600 mt-1">•</span>
                                    <span>{improvement}</span>
                                </li>
                            ))}
                            {(!result.feedback?.improvements || result.feedback.improvements.length === 0) && (
                                <li className="text-gray-500 italic">No specific improvements identified</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Question-by-Question Review */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        Question-by-Question Review
                    </h3>

                    <div className="space-y-6">
                        {result.questions.map((question, index) => (
                            <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                                <div className="flex items-start justify-between mb-3">
                                    <h4 className="text-lg font-semibold text-gray-800 flex-1">
                                        Q{index + 1}: {question.question || 'Question not available'}
                                    </h4>
                                    {question.evaluation?.score !== undefined && (
                                        <div className={`text-2xl font-bold ml-4 ${question.evaluation.score >= 7 ? 'text-green-600' :
                                            question.evaluation.score >= 5 ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>
                                            {question.evaluation.score}/10
                                        </div>
                                    )}
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                                    <div className="text-sm font-semibold text-gray-600 mb-2">
                                        Your Answer:
                                    </div>
                                    <div className="text-gray-700 whitespace-pre-wrap">
                                        {question.userAnswer || 'No answer provided'}
                                    </div>
                                </div>

                                {question.evaluation && (
                                    <div className="space-y-3">
                                        {question.evaluation.strengths?.length > 0 && (
                                            <div>
                                                <div className="text-sm font-semibold text-green-600 mb-1">
                                                    ✓ What you did well:
                                                </div>
                                                <ul className="text-sm text-gray-700 space-y-1">
                                                    {question.evaluation.strengths.map((s, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-green-600">•</span>
                                                            <span>{s}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {question.evaluation.improvements?.length > 0 && (
                                            <div>
                                                <div className="text-sm font-semibold text-orange-600 mb-1">
                                                    ⚠ How to improve:
                                                </div>
                                                <ul className="text-sm text-gray-700 space-y-1">
                                                    {question.evaluation.improvements.map((imp, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <span className="text-orange-600">•</span>
                                                            <span>{imp}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {question.evaluation.idealApproach && (
                                            <div className="bg-blue-50 rounded-lg p-3">
                                                <div className="text-sm font-semibold text-blue-600 mb-1">
                                                    💡 Ideal Approach:
                                                </div>
                                                <div className="text-sm text-gray-700">
                                                    {question.evaluation.idealApproach}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Show message if no evaluation available */}
                                {!question.evaluation && question.userAnswer && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                        <div className="text-sm text-yellow-800">
                                            ⚠️ Evaluation not available for this question
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Steps / Recommendations */}
                {result.feedback?.recommendations && result.feedback.recommendations.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl shadow-xl p-8 mb-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            📚 Next Steps
                        </h3>
                        <ul className="space-y-2">
                            {result.feedback.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700">
                                    <span className="text-purple-600 mt-1">→</span>
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pb-10">
                    <button
                        onClick={() => navigate('/interview-setup')}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
                    >
                        Take Another Interview
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex-1 bg-white text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg border-2 border-gray-200"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InterviewResult;