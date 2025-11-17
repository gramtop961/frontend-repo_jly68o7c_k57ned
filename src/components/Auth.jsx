import { useMemo, useState } from 'react'
import { api } from '../lib/api'
import { COUNTRIES, PH_PROVINCES } from '../lib/locations'

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', country: 'Philippines', province: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const provincesForCountry = useMemo(() => {
    if (form.country?.toLowerCase() === 'philippines') return PH_PROVINCES
    return []
  }, [form.country])

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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg ring-1 ring-slate-200 p-6">
        <div className="flex justify-center space-x-3 mb-6">
          <button className={`px-4 py-2 rounded-full text-sm font-medium transition ${mode==='login'?'bg-indigo-600 text-white shadow':'bg-slate-100 hover:bg-slate-200'}`} onClick={()=>setMode('login')}>Login</button>
          <button className={`px-4 py-2 rounded-full text-sm font-medium transition ${mode==='signup'?'bg-indigo-600 text-white shadow':'bg-slate-100 hover:bg-slate-200'}`} onClick={()=>setMode('signup')}>Sign Up</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode==='signup' && (
            <input className="w-full border border-slate-200 focus:border-indigo-400 outline-none rounded-lg px-3 py-2 bg-white" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
          )}
          <input className="w-full border border-slate-200 focus:border-indigo-400 outline-none rounded-lg px-3 py-2 bg-white" type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          <input className="w-full border border-slate-200 focus:border-indigo-400 outline-none rounded-lg px-3 py-2 bg-white" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />

          {mode==='signup' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select className="w-full border border-slate-200 focus:border-indigo-400 outline-none rounded-lg px-3 py-2 bg-white" value={form.country} onChange={e=>setForm({...form,country:e.target.value, province: ''})}>
                {COUNTRIES.map(c => (<option key={c} value={c}>{c}</option>))}
              </select>
              {provincesForCountry.length ? (
                <select className="w-full border border-slate-200 focus:border-indigo-400 outline-none rounded-lg px-3 py-2 bg-white" value={form.province} onChange={e=>setForm({...form,province:e.target.value})}>
                  <option value="">Select province</option>
                  {PH_PROVINCES.map(p => (<option key={p} value={p}>{p}</option>))}
                </select>
              ) : (
                <input className="w-full border border-slate-200 focus:border-indigo-400 outline-none rounded-lg px-3 py-2 bg-white" placeholder="Province/State" value={form.province} onChange={e=>setForm({...form,province:e.target.value})} />
              )}
            </div>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white rounded-lg px-4 py-2 transition">{loading? 'Please wait...': mode==='login'? 'Login':'Create account'}</button>
        </form>
      </div>
    </div>
  )
}
