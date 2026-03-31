import { useState } from 'react'
import { API_BASE_URL } from '../config'

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
    
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isRegister 
            ? { username, password, role } 
            : { username, password }
        )
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.detail || 'Authentication failed')
      
      if (isRegister) {
        alert('Registered successfully! Please login.')
        setIsRegister(false)
      } else {
        onLogin(data)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="glass-panel" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2 className="text-center" style={{ marginBottom: '2rem' }}>
        {isRegister ? 'SYSTEM ACCESS' : 'IDENTIFY'}
      </h2>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign:'center' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>USERNAME_ID</label>
          <input 
            type="text" 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>SECURITY_KEY</label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {isRegister && (
          <div className="form-group">
            <label>ASSIGN_ROLE</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">STUDENT (LEARNER)</option>
              <option value="instructor">INSTRUCTOR (MASTER)</option>
            </select>
          </div>
        )}

        <button type="submit" className="btn">
          {isRegister ? 'ENTER MATRIX' : 'AUTHENTICATE'}
        </button>
      </form>

      <div className="text-center mt-4">
        <span className="link" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have access? Login' : 'Request new access? Register'}
        </span>
      </div>
    </div>
  )
}
