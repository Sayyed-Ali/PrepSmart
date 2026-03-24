const RecentInterviews = ({ interviews }) => {

    if (!interviews || interviews.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Recent Interviews
                </h3>

                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-6xl mb-4 opacity-80">🎤</div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        No interviews yet
                    </h4>
                    <p className="text-gray-500 text-sm max-w-sm">
                        Start your first mock interview and track your progress here.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                    Recent Interviews
                </h3>

                <span className="text-purple-600 font-medium cursor-pointer hover:underline text-sm">
                    View All →
                </span>
            </div>

            {/* LIST */}
            <div className="space-y-4">
                {interviews.map((item, index) => {
                    const timeAgo = getTimeAgo(new Date(item.createdAt))

                    return (
                        <div
                            key={item._id || index}
                            className="flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all"
                        >
                            {/* LEFT */}
                            <div className="flex items-center gap-4">

                                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                                    {item.company.charAt(0)}
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 text-sm">
                                        {item.company} • {item.role}
                                    </h4>

                                    <p className="text-xs text-gray-500 mt-1">
                                        {timeAgo} • {item.interviewType}
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="text-right">
                                {item.status === 'completed' && item.feedback?.overallScore ? (
                                    <div>
                                        <div className="text-xl font-bold text-purple-600">
                                            {item.feedback.overallScore}
                                        </div>
                                        <div className="text-xs text-gray-500">Score</div>
                                    </div>
                                ) : (
                                    <span className="px-3 py-1 text-xs font-semibold bg-orange-100 text-orange-600 rounded-full">
                                        In Progress
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

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