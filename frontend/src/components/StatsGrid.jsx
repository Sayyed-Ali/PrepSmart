// Stats cards component - shows 4 key metrics
const StatsGrid = ({ stats }) => {
    // use passed stats or defaults
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
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-600'
        },
        {
            icon: '⭐',
            value: displayStats.averageScore || '0',
            label: 'Average Score',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600'
        },
        {
            icon: '📊',
            value: `${displayStats.timeSpent}h`,
            label: 'Time Practiced',
            bgColor: 'bg-green-100',
            textColor: 'text-green-600'
        },
        {
            icon: '📝',
            value: displayStats.totalInterviews.toString(),
            label: 'Total Sessions',
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-600'
        }
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {statsData.map((stat, idx) => (
                <div
                    key={idx}
                    className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                >
                    <div className={`w-11 h-11 ${stat.bgColor} ${stat.textColor} rounded-lg flex items-center justify-center text-xl mb-3`}>
                        {stat.icon}
                    </div>

                    <div className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
                        {stat.value}
                    </div>

                    <div className="text-gray-600 text-xs lg:text-sm">{stat.label}</div>
                </div>
            ))}
        </div>
    )
}

export default StatsGrid