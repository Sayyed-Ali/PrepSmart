// Stats cards component - shows 4 key metrics
const StatsGrid = () => {
    // hardcoded for now, will connect to backend later
    const statsData = [
        {
            icon: '🎯',
            value: '12',
            label: 'Interviews Done',
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-600'
        },
        {
            icon: '⭐',
            value: '8.5',
            label: 'Average Score',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600'
        },
        {
            icon: '📊',
            value: '45h',
            label: 'Time Practiced',
            bgColor: 'bg-green-100',
            textColor: 'text-green-600'
        },
        {
            icon: '🏢',
            value: '8',
            label: 'Companies Studied',
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
                    {/* icon with colored background */}
                    <div className={`w-11 h-11 ${stat.bgColor} ${stat.textColor} rounded-lg flex items-center justify-center text-xl mb-3`}>
                        {stat.icon}
                    </div>

                    {/* main stat value */}
                    <div className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
                        {stat.value}
                    </div>

                    {/* description label */}
                    <div className="text-gray-600 text-xs lg:text-sm">{stat.label}</div>
                </div>
            ))}
        </div>
    )
}

export default StatsGrid