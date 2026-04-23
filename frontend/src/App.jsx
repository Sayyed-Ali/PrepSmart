import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { authAPI } from './services/api'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import InterviewSetup from './pages/InterviewSetup'
import Interview from './pages/Interview'
import InterviewResult from './pages/InterviewResult'
import Companies from './pages/Companies'
import CompanyDetail from './pages/CompanyDetail'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AptitudeSetup from './pages/AptitudeSetup'
import AptitudeTest from './pages/AptitudeTest'
import AptitudeResult from './pages/AptitudeResult'
import AddCompany from './pages/Admin/AddCompany'
import AddAptitudeQuestion from './pages/Admin/AddAptitudeQuestion'
import Progress from './pages/Progress'

import './App.css'

function ProtectedRoute({ children }) {
  const isAuth = authAPI.isAuthenticated()
  return isAuth ? children : <Navigate to="/login" />
}

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
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
          <Route path="/companies/:id" element={<ProtectedRoute><CompanyDetail /></ProtectedRoute>} />

          {/* Interview Routes */}
          <Route path="/interview-setup" element={<ProtectedRoute><InterviewSetup /></ProtectedRoute>} />
          <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
          <Route path="/interview-result" element={<ProtectedRoute><InterviewResult /></ProtectedRoute>} />

          {/* Aptitude Routes */}
          <Route path="/aptitude-setup" element={<ProtectedRoute><AptitudeSetup /></ProtectedRoute>} />
          <Route path="/aptitude-test" element={<ProtectedRoute><AptitudeTest /></ProtectedRoute>} />
          <Route path="/aptitude-result" element={<ProtectedRoute><AptitudeResult /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/add-company" element={<AdminRoute><AddCompany /></AdminRoute>} />
          <Route path="/admin/add-aptitude-question" element={<AdminRoute><AddAptitudeQuestion /></AdminRoute>} />

          <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App