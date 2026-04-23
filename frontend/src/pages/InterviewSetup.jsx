import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, interviewAPI } from '../services/api';

function InterviewSetup() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        company: '',
        role: '',
        type: 'technical',
        jobDescription: '',
        resume: null
    });

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser);
        }
    }, [navigate]);

    const companies = [
        'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple',
        'Netflix', 'Tesla', 'Adobe', 'Salesforce', 'Oracle',
        'IBM', 'Intel', 'Cisco', 'VMware', 'Uber',
        'TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB');
            return;
        }
        setFormData(prev => ({ ...prev, resume: file }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.company || !formData.role || !formData.type) {
            alert('Please fill all required fields');
            return;
        }

        try {
            setLoading(true);

            const submitData = new FormData();
            submitData.append('company', formData.company);
            submitData.append('role', formData.role);
            submitData.append('type', formData.type);
            submitData.append('jobDescription', formData.jobDescription);
            submitData.append('userId', user.id);

            if (formData.resume) {
                submitData.append('resume', formData.resume);
            }

            const response = await interviewAPI.create(submitData);

            if (response.success) {
                navigate('/interview', {
                    state: {
                        interviewId: response.data.interviewId,  // ✅ Changed from response.interview.id
                        company: response.data.company,
                        role: response.data.role,
                        type: response.data.type
                    }
                });
            }

        } catch (error) {
            console.error('Error creating interview:', error);
            alert('Failed to create interview. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
            <div className="max-w-3xl mx-auto pt-10">
                <div className="text-center mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-blue-600 hover:text-blue-700 font-semibold mb-4"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">
                        Mock Interview
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Practice with AI-powered interview questions
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Select Company
                        </h2>
                        <select
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        >
                            <option value="">Choose a company...</option>
                            {companies.map(company => (
                                <option key={company} value={company.toLowerCase()}>
                                    {company}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Target Role
                        </h2>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            placeholder="e.g., Software Engineer, Data Scientist, Product Manager"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Interview Type
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                { id: 'technical', name: 'Technical', icon: '💻', desc: 'Coding, system design, algorithms' },
                                { id: 'behavioral', name: 'Behavioral', icon: '💬', desc: 'Leadership, teamwork, conflict' },
                                { id: 'mixed', name: 'Mixed', icon: '🔀', desc: 'Both technical & behavioral' }
                            ].map(type => (
                                <label
                                    key={type.id}
                                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${formData.type === type.id
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="type"
                                        value={type.id}
                                        checked={formData.type === type.id}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <div className="text-4xl mb-3">{type.icon}</div>
                                    <h3 className="font-bold text-lg mb-1">{type.name}</h3>
                                    <p className="text-sm text-gray-600">{type.desc}</p>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Job Description (Optional)
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Paste the job description to get more relevant questions
                        </p>
                        <textarea
                            name="jobDescription"
                            value={formData.jobDescription}
                            onChange={handleChange}
                            placeholder="Paste the job description here..."
                            rows="6"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Upload Resume (Optional)
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Upload your resume for personalized questions
                        </p>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                                id="resume-upload"
                            />
                            <label htmlFor="resume-upload" className="cursor-pointer">
                                <div className="text-5xl mb-3">📄</div>
                                {formData.resume ? (
                                    <div>
                                        <p className="text-green-600 font-semibold mb-2">
                                            ✓ {formData.resume.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Click to change file
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-gray-700 font-semibold mb-2">
                                            Click to upload resume
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            PDF, DOC, or DOCX (Max 5MB)
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex gap-4">
                            <div>
                                <h4 className="font-bold text-blue-900 mb-2">Interview Guidelines</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• You'll receive 5 interview questions</li>
                                    <li>• Type your answers (3-5 minutes per question)</li>
                                    <li>• AI will evaluate and provide detailed feedback</li>
                                    <li>• Resume and JD help generate more relevant questions</li>
                                    <li>• Take your time - quality matters more than speed</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Generating Questions...
                            </div>
                        ) : (
                            'Start Interview'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default InterviewSetup;