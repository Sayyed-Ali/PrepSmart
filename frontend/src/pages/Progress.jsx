import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import InterviewProgress from '../components/InterviewProgress';

function Progress() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('interviews');

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser);
        }
    }, [navigate]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="max-w-7xl mx-auto pt-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-blue-600 hover:text-blue-700 font-semibold mb-2"
                        >
                            ← Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-bold text-gray-800">Your Progress</h1>
                        <p className="text-gray-600 mt-2">Track your performance and improvement</p>
                    </div>
                    <button
                        onClick={() => navigate('/interview-setup')}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
                    >
                        + New Interview
                    </button>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('interviews')}
                            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${activeTab === 'interviews'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            🎤 Interviews
                        </button>
                        <button
                            onClick={() => setActiveTab('aptitude')}
                            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${activeTab === 'aptitude'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            🧮 Aptitude Tests
                        </button>
                        <button
                            onClick={() => setActiveTab('overall')}
                            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${activeTab === 'overall'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            📊 Overall
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'interviews' && <InterviewProgress userId={user.id} />}

                {activeTab === 'aptitude' && (
                    <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                        <div className="text-6xl mb-4">🧮</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Aptitude Progress Coming Soon
                        </h3>
                        <p className="text-gray-600">
                            Track your aptitude test scores and improvement here
                        </p>
                    </div>
                )}

                {activeTab === 'overall' && (
                    <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Overall Progress Coming Soon
                        </h3>
                        <p className="text-gray-600">
                            See your complete preparation journey across all modules
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Progress;