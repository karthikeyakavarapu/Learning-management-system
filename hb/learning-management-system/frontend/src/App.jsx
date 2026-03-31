import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'
import InstructorDashboard from './components/InstructorDashboard'
import StudentDashboard from './components/StudentDashboard'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [role, setRole] = useState(localStorage.getItem('role') || null)

  const handleLogin = (data) => {
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('role', data.role)
    setToken(data.access_token)
    setRole(data.role)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setToken(null)
    setRole(null)
  }

  return (
    <div className="app-container">
      <header>
        <h1>Aura<span>Learn</span></h1>
        <p>Futuristic Learning Management System</p>
        {role && <span className="role-badge">{role}</span>}
        {token && <button onClick={handleLogout} className="logout-btn">DISCONNECT</button>}
      </header>

      <main>
        {!token ? (
          <Login onLogin={handleLogin} />
        ) : role === 'instructor' ? (
          <InstructorDashboard />
        ) : (
          <StudentDashboard />
        )}
      </main>
    </div>
  )
}

export default App
