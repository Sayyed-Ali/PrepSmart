import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import DashboardSidebar from './DashboardSidebar'

function MainLayout({ children }) {
    const navigate = useNavigate()

    const handleLogout = () => {
        authAPI.logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen flex">
            <DashboardSidebar onLogout={handleLogout} />

            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    )
}

export default MainLayout