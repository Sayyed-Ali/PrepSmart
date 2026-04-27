import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_BASE_URL

function AddVacancy() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        company: '',
        role: '',
        location: '',
        type: 'Full-time',
        experience: '0-2 years',
        salary: '',
        deadline: '',
        description: '',
        requirements: [],
        skills: [],
        applyLink: '',
        status: 'active'
    });

    const [requirementInput, setRequirementInput] = useState('');
    const [skillInput, setSkillInput] = useState('');

    const handleAddRequirement = () => {
        if (requirementInput.trim() && !formData.requirements.includes(requirementInput.trim())) {
            setFormData({
                ...formData,
                requirements: [...formData.requirements, requirementInput.trim()]
            });
            setRequirementInput('');
        }
    };

    const handleRemoveRequirement = (req) => {
        setFormData({
            ...formData,
            requirements: formData.requirements.filter(r => r !== req)
        });
    };

    const handleAddSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData({
                ...formData,
                skills: [...formData.skills, skillInput.trim()]
            });
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skill) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(s => s !== skill)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(`${BASE_URL}/api/vacancies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Vacancy added successfully!' });
                // Reset form
                setFormData({
                    company: '',
                    role: '',
                    location: '',
                    type: 'Full-time',
                    experience: '0-2 years',
                    salary: '',
                    deadline: '',
                    description: '',
                    requirements: [],
                    skills: [],
                    applyLink: '',
                    status: 'active'
                });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to add vacancy' });
            }
        } catch (error) {
            console.error('Error adding vacancy:', error);
            setMessage({ type: 'error', text: 'Error adding vacancy' });
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

                <h1 className="text-4xl font-bold text-gray-800 mb-2">Add Job Vacancy</h1>
                <p className="text-gray-600 mb-8">Post a new job vacancy for students</p>

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                                placeholder="Amazon"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Role *
                            </label>
                            <input
                                type="text"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                                placeholder="Software Development Engineer"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                                placeholder="Bangalore, India"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Job Type *
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Experience *
                            </label>
                            <input
                                type="text"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                                placeholder="0-2 years"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Salary
                            </label>
                            <input
                                type="text"
                                value={formData.salary}
                                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="₹10-15 LPA"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Deadline *
                            </label>
                            <input
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Job Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows="5"
                            required
                            placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                        />
                    </div>

                    {/* Requirements */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Requirements
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={requirementInput}
                                onChange={(e) => setRequirementInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Bachelor's degree in Computer Science"
                            />
                            <button
                                type="button"
                                onClick={handleAddRequirement}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                            >
                                Add
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.requirements.map((req, index) => (
                                <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                                    <span className="flex-1 text-sm">{req}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveRequirement(req)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Required Skills
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Python, React, AWS, etc."
                            />
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.skills.map(skill => (
                                <span key={skill} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(skill)}
                                        className="text-blue-900 hover:text-red-600"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Apply Link */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Application Link *
                        </label>
                        <input
                            type="url"
                            value={formData.applyLink}
                            onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="https://careers.amazon.com/..."
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Adding Vacancy...' : 'Add Job Vacancy'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddVacancy;