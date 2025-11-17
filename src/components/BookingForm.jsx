import { useState } from 'react'

export default function BookingForm({ service, onSubmit }) {
  const [form, setForm] = useState({ date:'', time:'', message:'', answers:{} })

  const submit = (e) => {
    e.preventDefault()
    const scheduled_start = form.date && form.time ? new Date(`${form.date}T${form.time}:00`).toISOString() : null
    const payload = {
      service_id: service.id,
      scheduled_start,
      scheduled_end: null,
      message: form.message,
      answers: Object.entries(form.answers).map(([question_id, answer]) => ({ question_id, answer }))
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={submit} className="space-y-4 bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold text-lg">Book {service.name}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">Date</label>
          <input type="date" className="w-full border rounded px-3 py-2" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
        </div>
        <div>
          <label className="text-sm text-gray-600">Time</label>
          <input type="time" className="w-full border rounded px-3 py-2" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} />
        </div>
      </div>

      {service.questions?.length ? (
        <div className="space-y-2">
          <h4 className="font-semibold">Required Information</h4>
          {service.questions.map(q => (
            <div key={q.id} className="flex flex-col gap-1">
              <label className="text-sm">{q.text}{q.required? ' *':''}</label>
              {q.type === 'textarea' ? (
                <textarea className="border rounded px-3 py-2" rows="3" value={form.answers[q.id]||''} onChange={e=>setForm({...form,answers:{...form.answers,[q.id]: e.target.value}})} />
              ) : q.type === 'number' ? (
                <input type="number" className="border rounded px-3 py-2" value={form.answers[q.id]||''} onChange={e=>setForm({...form,answers:{...form.answers,[q.id]: e.target.value}})} />
              ) : (
                <input className="border rounded px-3 py-2" value={form.answers[q.id]||''} onChange={e=>setForm({...form,answers:{...form.answers,[q.id]: e.target.value}})} />
              )}
            </div>
          ))}
        </div>
      ) : null}

      <textarea className="w-full border rounded px-3 py-2" rows="3" placeholder="Message to provider (optional)" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} />

      <button className="w-full bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2">Send Booking Request</button>
    </form>
  )
}
