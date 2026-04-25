import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddDSAQuestion() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        title: '',
        category: 'Arrays & Hashing',
        difficulty: 'Easy',
        company: '',
        companies: [],
        leetcodeLink: '',
        articleLink: '',
        youtubeLink: '',
        estimatedTime: 30,
        isPremium: false,
        approaches: {
            bruteForce: '',
            better: '',
            optimal: ''
        }
    });

    const [companyInput, setCompanyInput] = useState('');

    const categories = [
        'Arrays & Hashing',
        'Two Pointers',
        'Sliding Window',
        'Stack',
        'Binary Search',
        'Linked List',
        'Trees',
        'Tries',
        'Heap / Priority Queue',
        'Backtracking',
        'Graphs',
        'Advanced Graphs',
        'Dynamic Programming',
        'Greedy',
        'Intervals',
        'Math & Geometry',
        'Bit Manipulation'
    ];

    const handleAddCompany = () => {
        if (companyInput.trim() && !formData.companies.includes(companyInput.trim())) {
            setFormData({
                ...formData,
                companies: [...formData.companies, companyInput.trim()]
            });
            setCompanyInput('');
        }
    };

    const handleRemoveCompany = (company) => {
        setFormData({
            ...formData,
            companies: formData.companies.filter(c => c !== company)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('http://localhost:5001/api/admin/dsa-problems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'DSA problem added successfully!' });
                // Reset form
                setFormData({
                    title: '',
                    category: 'Arrays & Hashing',
                    difficulty: 'Easy',
                    company: '',
                    companies: [],
                    leetcodeLink: '',
                    articleLink: '',
                    youtubeLink: '',
                    estimatedTime: 30,
                    isPremium: false,
                    approaches: {
                        bruteForce: '',
                        better: '',
                        optimal: ''
                    }
                });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to add problem' });
            }
        } catch (error) {
            console.error('Error adding DSA problem:', error);
            setMessage({ type: 'error', text: 'Error adding problem' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="max-w-4xl mx-auto pt-8 pb-12">

                <button
                    onClick={() => navigate('/admin')}
                    className="text-blue-600 hover:text-blue-700 font-semibold mb-4 flex items-center gap-2"
                >
                    ← Back to Admin Dashboard
                </button>

                <h1 className="text-4xl font-bold text-gray-800 mb-2">Add DSA Problem</h1>
                <p className="text-gray-600 mb-8">Add a new DSA problem to the practice module</p>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-700'
                            : 'bg-red-50 border border-red-200 text-red-700'
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">

                    {/* Basic Info */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Problem Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="Two Sum"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Difficulty *
                            </label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    {/* Companies */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Companies
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={companyInput}
                                onChange={(e) => setCompanyInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCompany())}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Amazon, Google, etc."
                            />
                            <button
                                type="button"
                                onClick={handleAddCompany}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.companies.map(company => (
                                <span key={company} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    {company}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCompany(company)}
                                        className="text-blue-900 hover:text-red-600"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                LeetCode Link *
                            </label>
                            <input
                                type="url"
                                value={formData.leetcodeLink}
                                onChange={(e) => setFormData({ ...formData, leetcodeLink: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                                placeholder="https://leetcode.com/problems/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Estimated Time (minutes)
                            </label>
                            <input
                                type="number"
                                value={formData.estimatedTime}
                                onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                min="5"
                                step="5"
                            />
                        </div>
                    </div>

                    {/* Approaches */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800">Solution Approaches</h3>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Brute Force Approach
                            </label>
                            <textarea
                                value={formData.approaches.bruteForce}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    approaches: { ...formData.approaches, bruteForce: e.target.value }
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Explain brute force approach with time and space complexity"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Better Approach
                            </label>
                            <textarea
                                value={formData.approaches.better}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    approaches: { ...formData.approaches, better: e.target.value }
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Explain better approach with time and space complexity"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Optimal Approach
                            </label>
                            <textarea
                                value={formData.approaches.optimal}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    approaches: { ...formData.approaches, optimal: e.target.value }
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Explain optimal approach with time and space complexity"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Adding Problem...' : 'Add DSA Problem'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddDSAQuestion;