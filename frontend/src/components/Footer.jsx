import { Github, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Main Footer Content */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Column 1 - About */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-2xl">PrepSmart</h3>
                        <p className="text-sm leading-relaxed text-gray-400">
                            AI-powered platform helping students ace their campus placements
                            and job interviews.
                        </p>
                    </div>

                    {/* Column 2 - Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="#features" className="hover:text-purple-400 transition-colors duration-200 inline-block">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-purple-400 transition-colors duration-200 inline-block">
                                    Mock Interview
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-purple-400 transition-colors duration-200 inline-block">
                                    Companies
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-purple-400 transition-colors duration-200 inline-block">
                                    Pricing
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3 - Resources */}
                    <div className="space-y-4">
                        <h4 className="text-white font-semibold text-lg mb-4">Resources</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="#" className="hover:text-purple-400 transition-colors duration-200 inline-block">
                                    Interview Tips
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-purple-400 transition-colors duration-200 inline-block">
                                    DSA Practice
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-purple-400 transition-colors duration-200 inline-block">
                                    Aptitude Tests
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-purple-400 transition-colors duration-200 inline-block">
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4 - Connect */}
                    <div className="space-y-4">
                        <h4 className="text-white font-semibold text-lg mb-4">Connect With Us</h4>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-all duration-200 transform hover:-translate-y-1"
                            >
                                <Github size={20} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-all duration-200 transform hover:-translate-y-1"
                            >
                                <Linkedin size={20} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-all duration-200 transform hover:-translate-y-1"
                            >
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Copyright Bar */}
                <div className="border-t border-gray-800 pt-8 text-center">
                    <p className="text-sm text-gray-400">
                        &copy; 2024 PrepSmart. Built with ❤️ by students, for students.
                    </p>
                </div>

            </div>
        </footer>
    )
}

export default Footer