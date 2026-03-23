const RecentInterviews = () => {
    // sample data - replace with actual API call later
    const interviews = [
        {
            company: 'Google',
            logo: 'G',
            role: 'Software Engineer',
            time: '2 hours ago',
            type: 'Technical',
            score: '8.5'
        },
        {
            company: 'Amazon',
            logo: 'A',
            role: 'Backend Developer',
            time: 'Yesterday',
            type: 'Behavioral',
            score: '7.8'
        },
        {
            company: 'Microsoft',
            logo: 'M',
            role: 'Full Stack',
            time: '3 days ago',
            type: 'Mixed',
            score: '9.2'
        }
    ]

    return (
        <div className="bg-white rounded-xl p-6 lg:p-7 shadow-sm">
            {/* header with view all link */}
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-800">Recent Interviews</h3>
                <span className="text-purple-600 font-semibold cursor-pointer hover:text-purple-700 text-sm lg:text-base">
                    View All →
                </span>
            </div>

            {/* list of interviews */}
            <div className="space-y-3">
                {interviews.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                        >
                            {/* left side - company info */}
                            <div className="flex items-center gap-3">
                                {/* company logo */}
                                <div className="w-11 h-11 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                                    {item.logo}
                                </div>

                                {/* interview details */}
                                <div>
                                    <h4 className="font-semibold text-gray-800 text-sm lg:text-base">
                                        {item.company} - {item.role}
                                    </h4>
                                    <p className="text-xs lg:text-sm text-gray-600">
                                        {item.time} • {item.type}
                                    </p>
                                </div>
                            </div>

                            {/* right side - score */}
                            <div className="text-right flex-shrink-0">
                                <div className="text-2xl lg:text-3xl font-bold text-purple-600">
                                    {item.score}
                                </div>
                                <div className="text-xs text-gray-500">Score</div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default RecentInterviews