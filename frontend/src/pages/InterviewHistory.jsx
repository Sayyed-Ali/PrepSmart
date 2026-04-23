import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, interviewAPI } from '../services/api';
import InterviewProgress from '../components/InterviewProgress';

function InterviewHistory() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

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
                        <h1 className="text-4xl font-bold text-gray-800">Interview Progress</h1>
                        <p className="text-gray-600 mt-2">Track your interview performance over time</p>
                    </div>
                    <button
                        onClick={() => navigate('/interview-setup')}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
                    >
                        + New Interview
                    </button>
                </div>

                {/* Progress Component */}
                <InterviewProgress userId={user.id} />
            </div>
        </div>
    );
}

export default InterviewHistory;