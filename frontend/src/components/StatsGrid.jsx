// Stats cards component - shows 4 key metrics
const StatsGrid = ({ stats }) => {

    const displayStats = stats || {
        interviewsCompleted: 0,
        averageScore: 0,
        timeSpent: 0,
        totalInterviews: 0
    }

    const statsData = [
        {
            icon: '🎯',
            value: displayStats.interviewsCompleted.toString(),
            label: 'Interviews Done',
            gradient: 'from-purple-500 to-indigo-500'
        },
        {
            icon: '⭐',
            value: displayStats.averageScore || '0',
            label: 'Average Score',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: <span class="material-symbols-outlined">exercise</span>,
            value: `${displayStats.timeSpent}h`,
            label: 'Time Practiced',
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            icon: '📝',
            value: displayStats.totalInterviews.toString(),
            label: 'Total Sessions',
            gradient: 'from-orange-500 to-pink-500'
        }
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, idx) => (
                <div
                    key={idx}
                    className="group bg-white/70 backdrop-blur-sm border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                    {/* ICON */}
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-xl mb-4 shadow-md`}>
                        <span className="text-white">{stat.icon}</span>
                    </div>

                    {/* VALUE */}
                    <div className="text-3xl font-bold text-gray-900 tracking-tight">
                        {stat.value}
                    </div>

                    {/* LABEL */}
                    <div className="text-gray-500 text-sm mt-1">
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default StatsGrid