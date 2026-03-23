const RecentInterviews = ({ interviews }) => {
    // if no interviews, show empty state
    if (!interviews || interviews.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 lg:p-7 shadow-sm">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-5">Recent Interviews</h3>

                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎤</div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">No interviews yet</h4>
                    <p className="text-gray-600 mb-4">Start your first mock interview to see your progress here</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl p-6 lg:p-7 shadow-sm">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-800">Recent Interviews</h3>
                <span className="text-purple-600 font-semibold cursor-pointer hover:text-purple-700 text-sm lg:text-base">
                    View All →
                </span>
            </div>

            <div className="space-y-3">
                {interviews.map((item, index) => {
                    // calculate time ago
                    const timeAgo = getTimeAgo(new Date(item.createdAt))

                    return (
                        <div
                            key={item._id || index}
                            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                                    {item.company.charAt(0)}
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-800 text-sm lg:text-base">
                                        {item.company} - {item.role}
                                    </h4>
                                    <p className="text-xs lg:text-sm text-gray-600">
                                        {timeAgo} • {item.interviewType}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                                {item.status === 'completed' && item.feedback?.overallScore ? (
                                    <>
                                        <div className="text-2xl lg:text-3xl font-bold text-purple-600">
                                            {item.feedback.overallScore}
                                        </div>
                                        <div className="text-xs text-gray-500">Score</div>
                                    </>
                                ) : (
                                    <div className="text-sm text-orange-600 font-semibold">
                                        In Progress
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// helper function to calculate time ago
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000)

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    }

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit)
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`
        }
    }

    return 'Just now'
}

export default RecentInterviews