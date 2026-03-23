import { Bot, Building2, Brain, Code, TrendingUp, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'  // Add this

const Features = () => {
    const navigate = useNavigate()  // Add this

    const features = [
        {
            icon: Bot,
            title: 'AI Mock Interviews',
            description: 'Practice with AI that adapts to your resume and job description. Get realistic interview experience anytime.',
            color: 'purple'
        },
        {
            icon: Building2,
            title: 'Company Insights',
            description: 'Access detailed profiles of 50+ companies with culture info, common questions, and interview patterns.',
            color: 'indigo'
        },
        {
            icon: Brain,
            title: 'Aptitude Tests',
            description: 'Practice quantitative, logical, and verbal reasoning with timed tests across multiple difficulty levels.',
            color: 'pink'
        },
        {
            icon: Code,
            title: 'DSA Practice',
            description: 'Company-wise coding questions organized by topic. Know exactly what Google, Amazon, or Microsoft asks.',
            color: 'blue'
        },
        {
            icon: TrendingUp,
            title: 'Progress Tracking',
            description: 'Detailed analytics showing your improvement over time. Identify weak areas and track your growth.',
            color: 'green'
        },
        {
            icon: Users,
            title: 'Community Insights',
            description: 'Learn from real interview experiences shared by students who already cracked these companies.',
            color: 'orange'
        }
    ]

    const colorClasses = {
        purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
        indigo: 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
        pink: 'bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white',
        blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
        green: 'bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white',
        orange: 'bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'
    }

    return (
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                        Everything You Need to Succeed
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        All the tools you need for interview preparation, organized in one platform
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon
                        return (
                            <div
                                key={index}
                                className="group p-8 rounded-2xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 transform hover:-translate-y-2"
                            >
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${colorClasses[feature.color]}`}>
                                    <IconComponent size={28} />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* Bottom CTA - now goes to dashboard */}
                <div className="text-center mt-16">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                        Start Your Free Trial
                    </button>
                </div>

            </div>
        </section>
    )
}

export default Features