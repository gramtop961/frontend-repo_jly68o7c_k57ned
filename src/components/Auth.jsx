import { useState } from 'react'
import { api } from '../lib/api'

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', country: '', province: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = mode === 'login' ? await api.login({ email: form.email, password: form.password }) : await api.signup(form)
      onAuthed(res.token, res.user)
    } catch (err) {
      setError(err.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
      <div className="flex justify-center space-x-4 mb-6">
        <button className={`px-4 py-2 rounded ${mode==='login'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={()=>setMode('login')}>Login</button>
        <button className={`px-4 py-2 rounded ${mode==='signup'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={()=>setMode('signup')}>Sign Up</button>
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode==='signup' && (
          <input className="w-full border rounded px-3 py-2" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
        )}
        <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
        {mode==='signup' && (
          <div className="grid grid-cols-2 gap-3">
            <input className="w-full border rounded px-3 py-2" placeholder="Country" value={form.country} onChange={e=>setForm({...form,country:e.target.value})} />
            <input className="w-full border rounded px-3 py-2" placeholder="Province/State" value={form.province} onChange={e=>setForm({...form,province:e.target.value})} />
          </div>
        )}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">{loading? 'Please wait...': mode==='login'? 'Login':'Create account'}</button>
      </form>
    </div>
  )
}
