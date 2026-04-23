import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI, interviewAPI } from '../services/api';

function Interview() {
    const navigate = useNavigate();
    const location = useLocation();
    const { interviewId, company, role, type } = location.state || {};

    const [user, setUser] = useState(null);
    const [interview, setInterview] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);

        if (!interviewId) {
            navigate('/interview-setup');
            return;
        }

        loadInterview();
    }, [interviewId, navigate]);

    const loadInterview = async () => {
        try {
            const response = await interviewAPI.getById(interviewId);
            setInterview(response.data);  // ✅ Changed from response.interview
            setStartTime(Date.now());
        } catch (error) {
            console.error('Error loading interview:', error);
            alert('Failed to load interview');
            navigate('/interview-setup');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        if (!answer.trim()) {
            alert('Please provide an answer before proceeding');
            return;
        }

        try {
            setSubmitting(true);

            const timeTaken = Math.floor((Date.now() - startTime) / 1000);

            await interviewAPI.submitAnswer(
                interviewId,
                interview.questions[currentIndex].id,
                answer,
                timeTaken
            );

            if (currentIndex === interview.questions.length - 1) {
                await submitInterview();
            } else {
                setCurrentIndex(currentIndex + 1);
                setAnswer('');
                setStartTime(Date.now());
            }

        } catch (error) {
            console.error('Error saving answer:', error);
            alert('Failed to save answer. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const submitInterview = async () => {
        try {
            setSubmitting(true);

            const response = await interviewAPI.submit(interviewId);

            if (response.success) {
                navigate('/interview-result', {
                    state: {
                        result: response.data  // ✅ Changed from response.result
                    }
                });
            }

        } catch (error) {
            console.error('Error submitting interview:', error);
            alert('Failed to submit interview');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <div className="text-gray-600">Loading interview...</div>
                </div>
            </div>
        );
    }

    if (!interview || !interview.questions || interview.questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <div className="text-gray-600 text-xl">No questions available</div>
                    <button
                        onClick={() => navigate('/interview-setup')}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Setup
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = interview.questions[currentIndex];
    const progress = ((currentIndex + 1) / interview.questions.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
            <div className="max-w-4xl mx-auto pt-6">
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {company} - {role}
                            </h2>
                            <p className="text-gray-600">
                                {type.charAt(0).toUpperCase() + type.slice(1)} Interview
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-600">Question</div>
                            <div className="text-3xl font-bold text-blue-600">
                                {currentIndex + 1}/{interview.questions.length}
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <div className="flex items-start gap-3 mb-6">
                        <div className="bg-blue-100 text-blue-600 rounded-lg px-3 py-1 text-sm font-semibold">
                            {currentQuestion.difficulty}
                        </div>
                        <div className="bg-purple-100 text-purple-600 rounded-lg px-3 py-1 text-sm font-semibold">
                            {currentQuestion.type}
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        {currentQuestion.question}
                    </h3>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Your Answer:
                        </label>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your answer here... Be specific and provide examples where possible."
                            rows="12"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        />
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-gray-500">
                                {answer.length} characters
                            </p>
                            <p className="text-sm text-gray-500">
                                Recommended: 150-300 words
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                    <h4 className="font-bold text-yellow-900 mb-2">💡 Tips for a great answer:</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                        {type === 'technical' ? (
                            <>
                                <li>• Explain your thought process step-by-step</li>
                                <li>• Mention time and space complexity if relevant</li>
                                <li>• Discuss edge cases and trade-offs</li>
                                <li>• Use specific technical terms and concepts</li>
                            </>
                        ) : (
                            <>
                                <li>• Use the STAR method (Situation, Task, Action, Result)</li>
                                <li>• Provide specific examples from your experience</li>
                                <li>• Show self-awareness and learning</li>
                                <li>• Be honest and authentic</li>
                            </>
                        )}
                    </ul>
                </div>

                <button
                    onClick={handleNext}
                    disabled={submitting || !answer.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {currentIndex === interview.questions.length - 1 ? 'Evaluating Answers...' : 'Saving...'}
                        </div>
                    ) : (
                        currentIndex === interview.questions.length - 1 ? 'Submit Interview 🎉' : 'Next Question →'
                    )}
                </button>
            </div>
        </div>
    );
}

export default Interview;