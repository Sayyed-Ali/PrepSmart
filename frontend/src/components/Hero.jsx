import { ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'  // Add this

const Hero = () => {
    const navigate = useNavigate()  // Add this

    return (
        <section className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left side */}
                    <div className="space-y-8">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
                            <Sparkles size={18} className="text-purple-600" />
                            <span className="text-sm font-semibold text-purple-700">
                                AI-Powered Interview Prep
                            </span>
                        </div>

                        {/* Main heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                            Ace Your Next{' '}
                            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                                Interview
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
                            Practice with AI-powered mock interviews, get personalized feedback,
                            and prepare for your dream job—all in one place.
                        </p>

                        {/* CTA Buttons - now navigate to dashboard */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 inline-flex items-center justify-center gap-2">
                                Start Practicing Free
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:border-purple-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                                Watch Demo
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                            <div className="text-center sm:text-left">
                                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    1000+
                                </div>
                                <div className="text-sm text-gray-600 font-medium mt-1">
                                    Students Prepared
                                </div>
                            </div>

                            <div className="text-center sm:text-left">
                                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    50+
                                </div>
                                <div className="text-sm text-gray-600 font-medium mt-1">
                                    Companies Covered
                                </div>
                            </div>

                            <div className="text-center sm:text-left">
                                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    95%
                                </div>
                                <div className="text-sm text-gray-600 font-medium mt-1">
                                    Success Rate
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="relative order-first lg:order-last">
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl shadow-2xl p-12 h-96 flex items-center justify-center relative overflow-hidden">

                            {/* Content */}
                            <div className="text-center text-white z-10 relative">
                                <div className="text-7xl mb-6">🎯</div>
                                <p className="text-2xl font-bold mb-3">Mock Interview Interface</p>
                                <p className="text-base opacity-90">Interactive demo coming soon</p>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full opacity-20 blur-3xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-pink-400 rounded-full opacity-20 blur-3xl"></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Hero