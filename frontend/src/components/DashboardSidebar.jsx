import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'

const DashboardSidebar = ({ onLogout }) => {
    const navigate = useNavigate()
    const [activeItem, setActiveItem] = useState('dashboard')
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        // Check if current user is admin
        const currentUser = authAPI.getCurrentUser()
        if (currentUser && currentUser.role === 'admin') {
            setIsAdmin(true)
        }
    }, [])

    // All menu items with icons
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <span className="material-symbols-outlined">dashboard</span>, path: '/dashboard' },
        { id: 'interview', label: 'Mock Interview', icon: <span className="material-symbols-outlined">frame_person_mic</span>, path: '/interview-setup' },
        { id: 'companies', label: 'Companies', icon: <span className="material-symbols-outlined">corporate_fare</span>, path: '/companies' },
        { id: 'aptitude', label: 'Aptitude Tests', icon: <span className="material-symbols-outlined">auto_stories</span>, path: '/aptitude-setup' },
        { id: 'dsa', label: 'DSA Practice', icon: <span className="material-symbols-outlined">code_blocks</span>, path: '/dsa' },
        { id: 'progress', label: 'Progress', icon: <span className="material-symbols-outlined">bar_chart_4_bars</span>, path: '/progress' },
        { id: 'settings', label: 'Settings', icon: <span className="material-symbols-outlined">settings</span>, path: '/settings' }
    ]

    // Handle click on menu item
    const handleClick = (item) => {
        console.log('Navigating to:', item.label)
        setActiveItem(item.id)

        // Navigate to the page
        if (item.path) {
            navigate(item.path)
        }
    }

    return (
        <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-purple-600 to-indigo-700 flex-shrink-0 p-5 flex flex-col min-h-screen transition-all duration-300 relative`}>

            {/* Collapse Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-8 bg-white rounded-full p-1.5 shadow-lg hover:shadow-xl transition z-10 border-2 border-purple-600"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                <span className="material-symbols-outlined text-purple-600 text-sm">
                    {isCollapsed ? 'chevron_right' : 'chevron_left'}
                </span>
            </button>

            {/* Logo at top */}
            <div className="pb-5 mb-6 border-b border-white/20">
                {!isCollapsed ? (
                    <h2 className="text-white text-3xl font-bold flex items-center gap-3">
                        <span className="text-4xl">🎯</span>
                        PrepSmart
                    </h2>
                ) : (
                    <h2 className="text-white text-3xl font-bold flex justify-center">
                        <span className="text-4xl">🎯</span>
                    </h2>
                )}
            </div>

            {/* Navigation links */}
            <nav className="flex-1 space-y-1.5">
                {menuItems.map((item) => {
                    const isActive = activeItem === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleClick(item)}
                            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-2.5 rounded-lg transition-all text-sm font-medium
                                ${isActive
                                    ? 'bg-white text-purple-600 shadow-lg'
                                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                                }`}
                            title={isCollapsed ? item.label : ''}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {!isCollapsed && <span>{item.label}</span>}
                        </button>
                    )
                })}
            </nav>

            {/* Admin Panel Button (only for admins) */}
            {isAdmin && (
                <button
                    onClick={() => navigate('/admin')}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-2.5 rounded-lg transition-all text-sm font-medium bg-red-500/20 text-white hover:bg-red-500/30 border border-red-400/30 mb-2`}
                    title={isCollapsed ? 'Admin Panel' : ''}
                >
                    <span className="text-lg">
                        <span className="material-symbols-outlined">admin_panel_settings</span>
                    </span>
                    {!isCollapsed && <span>Admin Panel</span>}
                </button>
            )}

            {/* Logout button at bottom */}
            {onLogout && (
                <button
                    onClick={onLogout}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-2.5 rounded-lg transition-all text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white`}
                    title={isCollapsed ? 'Logout' : ''}
                >
                    <span className="text-lg">
                        <span className="material-symbols-outlined">logout</span>
                    </span>
                    {!isCollapsed && <span>Logout</span>}
                </button>
            )}
        </div>
    )
}

export default DashboardSidebar