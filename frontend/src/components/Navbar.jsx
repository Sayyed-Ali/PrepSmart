import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'  // Add this

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()  // Add this

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    // function to go to dashboard
    const goToDashboard = () => {
        navigate('/dashboard')
    }

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <div className="flex items-center cursor-pointer">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            PrepSmart
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a
                            href="#features"
                            className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
                        >
                            Features
                        </a>
                        <a
                            href="#how-it-works"
                            className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
                        >
                            How it Works
                        </a>
                        <a
                            href="#about"
                            className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
                        >
                            About
                        </a>
                        {/* Updated button - now goes to dashboard */}
                        <button
                            onClick={goToDashboard}
                            className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                            Get Started
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t shadow-lg">
                    <div className="px-4 py-4 space-y-4">
                        <a
                            href="#features"
                            className="block text-gray-700 hover:text-purple-600 py-2 font-medium transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Features
                        </a>
                        <a
                            href="#how-it-works"
                            className="block text-gray-700 hover:text-purple-600 py-2 font-medium transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            How it Works
                        </a>
                        <a
                            href="#about"
                            className="block text-gray-700 hover:text-purple-600 py-2 font-medium transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            About
                        </a>
                        {/* Mobile button also goes to dashboard */}
                        <button
                            onClick={goToDashboard}
                            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-md">
                            Get Started
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar