// Progress chart showing weekly performance
const ProgressChart = () => {

    // weekly progress data - hardcoded for now
    const progressData = [
        { week: 'Week 1', percentage: 65 },
        { week: 'Week 2', percentage: 80 },
        { week: 'Week 3', percentage: 75 },
        { week: 'Week 4', percentage: 90 }
    ]

    return (
        <div className="bg-white rounded-xl p-6 lg:p-7 shadow-sm">
            {/* section header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
                    Your Progress This Month
                </h3>
                <span className="text-purple-600 font-semibold cursor-pointer hover:text-purple-700 text-sm lg:text-base">
                    View Details →
                </span>
            </div>

            {/* bar chart */}
            <div className="flex items-end justify-between h-48 lg:h-56 gap-4 lg:gap-6">
                {progressData.map((data, index) => {
                    const barHeight = `${data.percentage}%`

                    return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            {/* animated bar */}
                            <div
                                className="w-full bg-gradient-to-t from-purple-600 to-indigo-600 rounded-t-lg hover:opacity-80 transition-all cursor-pointer relative group"
                                style={{ height: barHeight }}
                            >
                                {/* tooltip on hover */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {data.percentage}%
                                </div>
                            </div>

                            {/* week label */}
                            <div className="text-xs lg:text-sm text-gray-600 mt-3 font-medium">
                                {data.week}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ProgressChart