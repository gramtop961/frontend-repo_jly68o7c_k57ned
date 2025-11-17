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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white grid place-items-center font-bold">S</div>
            <div>
              <div className="text-xl font-extrabold tracking-tight">Servizo</div>
              <div className="text-xs text-slate-500 -mt-0.5">Find. Book. Get it done.</div>
            </div>
          </div>
          <div className="text-sm text-slate-600 hidden sm:block">Modern service marketplace</div>
        </div>
      </div>

      {!token || !user ? (
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Welcome to Servizo</h1>
            <p className="text-slate-600 mt-2">Book services or become a provider and list your own.</p>
          </div>
          <Auth onAuthed={onAuthed} />
        </div>
      ) : (
        <Dashboard token={token} user={user} onLogout={logout} />
      )}

      <footer className="mt-10 py-8 text-center text-xs text-slate-500">© {new Date().getFullYear()} Servizo. All rights reserved.</footer>
    </div>
  )
}

export default App
