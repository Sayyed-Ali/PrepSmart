import { useNavigate } from 'react-router-dom'

function WelcomeCard() {
    const navigate = useNavigate()

    const handleStartInterview = () => {
        navigate('/interview-setup')
    }

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 rounded-2xl p-8 lg:p-10 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-lg">

            {/* subtle glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

            {/* LEFT CONTENT */}
            <div className="text-white z-10 max-w-lg">
                <h2 className="text-2xl lg:text-3xl font-bold mb-3 tracking-tight">
                    Start New Interview
                </h2>

                <p className="text-white/80 mb-6 text-sm lg:text-base leading-relaxed">
                    Practice makes perfect. Build confidence with AI-powered mock interviews and real-time feedback.
                </p>

                <button
                    onClick={handleStartInterview}
                    className="bg-white text-purple-600 px-7 py-3 rounded-xl font-semibold text-sm lg:text-base shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                    Start Interview →
                </button>
            </div>

            {/* RIGHT VISUAL */}
            <div className="text-7xl lg:text-8xl opacity-90">
                🎯
            </div>
        </div>
    )
}

export default WelcomeCard