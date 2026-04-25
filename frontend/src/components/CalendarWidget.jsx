import { useState, useEffect } from 'react';

function CalendarWidget() {
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVacancies();
    }, []);

    const fetchVacancies = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/vacancies?status=active');
            const data = await response.json();
            setVacancies(data.vacancies || []);
        } catch (error) {
            console.error('Error fetching vacancies:', error);
            setVacancies([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading vacancies...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    💼 Job Vacancies
                </h3>
                <button
                    onClick={() => window.location.href = '/vacancies'}
                    className="text-xs text-purple-600 hover:text-purple-700 font-semibold"
                >
                    View All →
                </button>
            </div>

            {/* Vacancies List */}
            {vacancies.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-5xl mb-3">💼</div>
                    <p className="text-gray-600 text-sm">No active job postings</p>
                    <p className="text-xs text-gray-500 mt-1">Check back soon!</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                    {vacancies.map((vacancy) => {
                        const deadline = new Date(vacancy.deadline);
                        const now = new Date();
                        const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

                        return (
                            <div
                                key={vacancy._id}
                                className="border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-purple-200 transition-all group cursor-pointer"
                            >
                                {/* Company & Role */}
                                <div className="mb-2">
                                    <h4 className="font-semibold text-gray-800 text-sm group-hover:text-purple-600 transition">
                                        {vacancy.role}
                                    </h4>
                                    <p className="text-xs text-gray-600 mt-0.5">{vacancy.company}</p>
                                </div>

                                {/* Details */}
                                <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
                                    <span className="flex items-center gap-1">
                                        📍 {vacancy.location}
                                    </span>
                                    <span>•</span>
                                    <span>{vacancy.experience}</span>
                                    {vacancy.salary && (
                                        <>
                                            <span>•</span>
                                            <span className="text-green-600 font-medium">{vacancy.salary}</span>
                                        </>
                                    )}
                                </div>

                                {/* Type Badge */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${vacancy.type === 'Internship' ? 'bg-blue-100 text-blue-700' :
                                            vacancy.type === 'Full-time' ? 'bg-green-100 text-green-700' :
                                                'bg-purple-100 text-purple-700'
                                        }`}>
                                        {vacancy.type}
                                    </span>
                                    <span className={`text-xs font-semibold ${daysLeft <= 3 ? 'text-red-600' :
                                            daysLeft <= 7 ? 'text-orange-600' :
                                                'text-gray-600'
                                        }`}>
                                        {daysLeft > 0 ? `⏰ ${daysLeft}d left` : '⏰ Expired'}
                                    </span>
                                </div>

                                {/* Skills */}
                                {vacancy.skills && vacancy.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {vacancy.skills.slice(0, 3).map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {vacancy.skills.length > 3 && (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                +{vacancy.skills.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Apply Button */}
                                <a
                                    href={vacancy.applyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Apply Now →
                                </a>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
            `}</style>
        </div>
    );
}

export default CalendarWidget;