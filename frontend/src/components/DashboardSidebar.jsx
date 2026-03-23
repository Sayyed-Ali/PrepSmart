import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DashboardSidebar = ({ onLogout }) => {
    const navigate = useNavigate()
    const [activeItem, setActiveItem] = useState('dashboard')

    // all menu items with icons
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
        { id: 'interview', label: 'Mock Interview', icon: '🎤', path: '/interview-setup' },
        { id: 'companies', label: 'Companies', icon: '🏢', path: '/companies' },
        { id: 'aptitude', label: 'Aptitude Tests', icon: '📝', path: '/aptitude' },
        { id: 'dsa', label: 'DSA Practice', icon: '💻', path: '/dsa' },
        { id: 'progress', label: 'Progress', icon: '📈', path: '/progress' },
        { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' }
    ]

    // handle click on menu item
    const handleClick = (item) => {
        console.log('Navigating to:', item.label)
        setActiveItem(item.id)

        // navigate to the page
        if (item.path) {
            navigate(item.path)
        }
    }

    return (
        <div className="w-64 bg-gradient-to-b from-purple-600 to-indigo-700 flex-shrink-0 p-5 flex flex-col min-h-screen">
            {/* logo at top */}
            <div className="pb-5 mb-6 border-b border-white/20">
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                    🎯 PrepSmart
                </h2>
            </div>

            {/* navigation links */}
            <nav className="flex-1 space-y-1.5">
                {menuItems.map((item) => {
                    const isActive = activeItem === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleClick(item)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium
                ${isActive
                                    ? 'bg-white text-purple-600 shadow-lg'
                                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            {/* Logout button at bottom */}
            {onLogout && (
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white mt-4"
                >
                    <span className="text-lg">🚪</span>
                    <span>Logout</span>
                </button>
            )}
        </div>
    )
}

export default DashboardSidebar