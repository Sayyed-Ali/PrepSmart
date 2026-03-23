import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { authAPI } from './services/api'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import InterviewSetup from './pages/InterviewSetup'  // Add this
import './App.css'

// protected route component
function ProtectedRoute({ children }) {
  const isAuth = authAPI.isAuthenticated()
  return isAuth ? children : <Navigate to="/login" />
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
          {/* Add this route */}
          <Route
            path="/interview-setup"
            element={
              <ProtectedRoute>
                <InterviewSetup />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App