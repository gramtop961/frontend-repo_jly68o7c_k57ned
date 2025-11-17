import { useEffect, useState } from 'react'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import './index.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  const onAuthed = (t, u) => {
    setToken(t)
    setUser(u)
  }

  const logout = () => {
    setToken('')
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!token || !user ? (
        <div className="max-w-3xl mx-auto py-12">
          <h1 className="text-3xl font-bold text-center mb-6">Service Marketplace</h1>
          <p className="text-center text-gray-600 mb-8">Book services or become a provider and list your own.</p>
          <Auth onAuthed={onAuthed} />
        </div>
      ) : (
        <Dashboard token={token} user={user} onLogout={logout} />
      )}
    </div>
  )
}

export default App
