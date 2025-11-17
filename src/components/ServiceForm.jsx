import { useState } from 'react'

export default function ServiceForm({ onSubmit, initial }) {
  const [form, setForm] = useState(initial || { name:'', description:'', price:'', category:'', country:'', province:'', photos:'', videos:'', questions:[], availability:[] })
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

  return (
    <form onSubmit={submit} className="space-y-4 bg-white p-4 rounded-xl shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="border rounded px-3 py-2" placeholder="Service name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
        <input className="border rounded px-3 py-2" placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} required />
        <input className="border rounded px-3 py-2" placeholder="Price" type="number" min="0" step="0.01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required />
        <input className="border rounded px-3 py-2" placeholder="Country" value={form.country} onChange={e=>setForm({...form,country:e.target.value})} />
        <input className="border rounded px-3 py-2" placeholder="Province/State" value={form.province} onChange={e=>setForm({...form,province:e.target.value})} />
      </div>
      <textarea className="w-full border rounded px-3 py-2" rows="3" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required />
      <input className="w-full border rounded px-3 py-2" placeholder="Photo URLs (comma separated)" value={form.photos} onChange={e=>setForm({...form,photos:e.target.value})} />
      <input className="w-full border rounded px-3 py-2" placeholder="Video URLs (comma separated)" value={form.videos} onChange={e=>setForm({...form,videos:e.target.value})} />

      <div className="border rounded p-3">
        <h4 className="font-semibold mb-2">Pre-service Questions</h4>
        <div className="flex gap-2 mb-2">
          <input className="flex-1 border rounded px-3 py-2" placeholder="Question text" value={qText} onChange={e=>setQText(e.target.value)} />
          <select className="border rounded px-2" value={qType} onChange={e=>setQType(e.target.value)}>
            <option value="text">Text</option>
            <option value="textarea">Paragraph</option>
            <option value="number">Number</option>
            <option value="select">Select</option>
            <option value="checkbox">Checkbox</option>
          </select>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={qRequired} onChange={e=>setQRequired(e.target.checked)} /> required</label>
          <button type="button" onClick={addQuestion} className="px-3 py-2 bg-gray-200 rounded">Add</button>
        </div>
        <ul className="space-y-1 text-sm">
          {(form.questions||[]).map(q => (
            <li key={q.id} className="flex justify-between bg-gray-50 rounded px-2 py-1"><span>{q.text} {q.required? '*':''}</span><span className="text-gray-500">{q.type}</span></li>
          ))}
        </ul>
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">Save Service</button>
    </form>
  )
}
