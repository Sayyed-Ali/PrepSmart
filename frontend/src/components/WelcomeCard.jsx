import { useNavigate } from 'react-router-dom'

// Big welcome card with start button
function WelcomeCard() {
    const navigate = useNavigate()

    const handleStartInterview = () => {
        console.log('Navigating to interview setup...')
        navigate('/interview-setup')
    }

    return (
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 lg:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-lg">
            <div className="text-white text-center sm:text-left">
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                    Start New Interview
                </h2>
                <p className="text-white/90 mb-5 text-sm lg:text-base">
                    Practice makes perfect! Ready for your next session?
                </p>
                <button
                    onClick={handleStartInterview}
                    className="bg-white text-purple-600 px-6 lg:px-8 py-2.5 lg:py-3 rounded-lg font-bold text-sm lg:text-base hover:shadow-xl transition-all hover:-translate-y-0.5">
                    Start Interview
                </button>
            </div>

            {/* emoji illustration on the right */}
            <div className="text-6xl lg:text-7xl">🎯</div>
        </div>
    )
}

export default WelcomeCard