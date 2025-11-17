import { useState, useMemo } from 'react'
import { PH_PROVINCES } from '../lib/locations'

export default function ServiceForm({ onSubmit, initial }) {
  const [form, setForm] = useState(initial || { name:'', description:'', price:'', category:'', country:'Philippines', province:'', photos:'', videos:'', questions:[], availability:[] })
  const [qText, setQText] = useState('')
  const [qType, setQType] = useState('text')
  const [qRequired, setQRequired] = useState(true)

  const addQuestion = () => {
    if (!qText) return
    const id = Math.random().toString(36).slice(2)
    setForm({ ...form, questions: [...(form.questions||[]), { id, text: qText, type: qType, required: qRequired }] })
    setQText('')
  }

  const submit = (e) => {
    e.preventDefault()
    const photos = form.photos ? form.photos.split(',').map(s=>s.trim()).filter(Boolean) : []
    const videos = form.videos ? form.videos.split(',').map(s=>s.trim()).filter(Boolean) : []
    const payload = { ...form, price: parseFloat(form.price||'0'), photos, videos }
    onSubmit(payload)
  }

  const provinceOptions = useMemo(() => PH_PROVINCES, [])

  return (
    <form onSubmit={submit} className="space-y-4 bg-white/80 backdrop-blur p-4 rounded-2xl shadow ring-1 ring-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="border border-slate-200 focus:border-indigo-400 rounded-lg px-3 py-2" placeholder="Service name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
        <input className="border border-slate-200 focus:border-indigo-400 rounded-lg px-3 py-2" placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} required />
        <input className="border border-slate-200 focus:border-indigo-400 rounded-lg px-3 py-2" placeholder="Price" type="number" min="0" step="0.01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required />
        <select className="border border-slate-200 focus:border-indigo-400 rounded-lg px-3 py-2" value={form.country} onChange={e=>setForm({...form,country:e.target.value})}>
          <option value="Philippines">Philippines</option>
        </select>
        <select className="border border-slate-200 focus:border-indigo-400 rounded-lg px-3 py-2" value={form.province} onChange={e=>setForm({...form,province:e.target.value})}>
          <option value="">Province/State</option>
          {provinceOptions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <textarea className="w-full border border-slate-200 focus:border-indigo-400 rounded-lg px-3 py-2" rows="3" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required />
      <input className="w-full border border-slate-200 focus:border-indigo-400 rounded-lg px-3 py-2" placeholder="Photo URLs (comma separated)" value={form.photos} onChange={e=>setForm({...form,photos:e.target.value})} />
      <input className="w-full border border-slate-200 focus:border-indigo-400 rounded-lg px-3 py-2" placeholder="Video URLs (comma separated)" value={form.videos} onChange={e=>setForm({...form,videos:e.target.value})} />

      <div className="border border-slate-200 rounded-2xl p-3 bg-white">
        <h4 className="font-semibold mb-2">Pre-service Questions</h4>
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <input className="flex-1 border border-slate-200 focus:border-indigo-400 rounded-lg px-3 py-2" placeholder="Question text" value={qText} onChange={e=>setQText(e.target.value)} />
          <select className="border border-slate-200 focus:border-indigo-400 rounded-lg px-2" value={qType} onChange={e=>setQType(e.target.value)}>
            <option value="text">Text</option>
            <option value="textarea">Paragraph</option>
            <option value="number">Number</option>
            <option value="select">Select</option>
            <option value="checkbox">Checkbox</option>
          </select>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={qRequired} onChange={e=>setQRequired(e.target.checked)} /> required</label>
          <button type="button" onClick={addQuestion} className="px-3 py-2 bg-slate-900 text-white rounded-lg">Add</button>
        </div>
        <ul className="space-y-1 text-sm">
          {(form.questions||[]).map(q => (
            <li key={q.id} className="flex justify-between bg-slate-50 rounded-lg px-2 py-1"><span>{q.text} {q.required? '*':''}</span><span className="text-slate-500">{q.type}</span></li>
          ))}
        </ul>
      </div>

      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2">Save Service</button>
    </form>
  )
}
