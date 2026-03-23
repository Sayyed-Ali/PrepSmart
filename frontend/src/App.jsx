import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { authAPI } from './services/api'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import InterviewSetup from './pages/InterviewSetup'
import Companies from './pages/Companies'
import CompanyDetail from './pages/CompanyDetail'
import AdminDashboard from './pages/Admin/AdminDashboard'  // Add this
import './App.css'

// protected route component
function ProtectedRoute({ children }) {
  const isAuth = authAPI.isAuthenticated()
  return isAuth ? children : <Navigate to="/login" />
}

// admin route component
function AdminRoute({ children }) {
  const isAuth = authAPI.isAuthenticated()
  const user = authAPI.getCurrentUser()

  if (!isAuth) return <Navigate to="/login" />
  if (user.role !== 'admin') return <Navigate to="/dashboard" />

  return children
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview-setup"
            element={
              <ProtectedRoute>
                <InterviewSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies"
            element={
              <ProtectedRoute>
                <Companies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies/:id"
            element={
              <ProtectedRoute>
                <CompanyDetail />
              </ProtectedRoute>
            }
          />
          {/* Add admin route */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App