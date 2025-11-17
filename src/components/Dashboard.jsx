import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import ServiceForm from './ServiceForm'

export default function Dashboard({ token, user, onLogout }) {
  const [tab, setTab] = useState('browse')
  const [filters, setFilters] = useState({ q:'', country:'', province:'', category:'' })
  const [selectedService, setSelectedService] = useState(null)
  const [bookings, setBookings] = useState({ customer: [], provider: [] })
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [me, setMe] = useState(user)

  const refreshBookings = async () => {
    setLoadingBookings(true)
    try {
      const c = await api.listBookings(token, 'customer')
      const p = await api.listBookings(token, 'provider')
      setBookings({ customer: c, provider: p })
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingBookings(false)
    }
  }

  useEffect(() => { refreshBookings() }, [])

  const createService = async (payload) => {
    await api.createService(token, payload)
    alert('Service created!')
    setTab('browse')
  }

  const sendBooking = async (payload) => {
    const res = await api.createBooking(token, payload)
    alert('Booking sent!')
    setSelectedService(null)
    await refreshBookings()
  }

  const toggleProvider = async () => {
    const next = !me.provider_mode
    await api.setProviderMode(token, next)
    setMe({ ...me, provider_mode: next })
  }

  const respond = async (id, status) => {
    await api.updateBookingStatus(token, id, status)
    await refreshBookings()
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Service Marketplace</h1>
          <p className="text-gray-600">Welcome, {me.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 bg-white border rounded px-3 py-2">
            <input type="checkbox" checked={!!me.provider_mode} onChange={toggleProvider} />
            Provider Mode
          </label>
          <button onClick={onLogout} className="bg-gray-200 rounded px-3 py-2">Logout</button>
        </div>
      </header>

      <nav className="flex gap-2">
        <button onClick={()=>setTab('browse')} className={`px-4 py-2 rounded ${tab==='browse'?'bg-blue-600 text-white':'bg-white border'}`}>Browse</button>
        {me.provider_mode && <button onClick={()=>setTab('create')} className={`px-4 py-2 rounded ${tab==='create'?'bg-blue-600 text-white':'bg-white border'}`}>Create Service</button>}
        <button onClick={()=>setTab('bookings')} className={`px-4 py-2 rounded ${tab==='bookings'?'bg-blue-600 text-white':'bg-white border'}`}>Bookings</button>
      </nav>

      {tab==='browse' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3">
            <input className="border rounded px-3 py-2" placeholder="Search" value={filters.q} onChange={e=>setFilters({...filters,q:e.target.value})} />
            <input className="border rounded px-3 py-2" placeholder="Country" value={filters.country} onChange={e=>setFilters({...filters,country:e.target.value})} />
            <input className="border rounded px-3 py-2" placeholder="Province/State" value={filters.province} onChange={e=>setFilters({...filters,province:e.target.value})} />
            <input className="border rounded px-3 py-2" placeholder="Category" value={filters.category} onChange={e=>setFilters({...filters,category:e.target.value})} />
          </div>
          <BrowseSection token={token} filters={filters} onSelect={setSelectedService} />
          {selectedService && <BookingModal service={selectedService} onClose={()=>setSelectedService(null)} onBook={sendBooking} />}
        </div>
      )}

      {tab==='create' && me.provider_mode && (
        <ServiceForm onSubmit={createService} />
      )}

      {tab==='bookings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BookingList title="Your Booking Requests" items={bookings.customer} role="customer" onRespond={respond} />
          <BookingList title="Requests To Your Services" items={bookings.provider} role="provider" onRespond={respond} />
        </div>
      )}
    </div>
  )
}

function BrowseSection({ token, filters, onSelect }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.listServices(filters)
      setServices(data)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [JSON.stringify(filters)])

  if (loading) return <p>Loading...</p>
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map(s => (
        <div key={s.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
          {s.photos?.[0] && <img src={s.photos[0]} alt="" className="h-40 w-full object-cover rounded mb-3" />}
          <h3 className="font-bold text-lg">{s.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-3">{s.description}</p>
          <div className="mt-2 text-sm text-gray-700">{s.category} • {s.country || 'N/A'} {s.province? `• ${s.province}`:''}</div>
          <div className="mt-2 font-semibold">${s.price?.toFixed?.(2) ?? s.price}</div>
          <button onClick={()=>onSelect(s)} className="mt-auto bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2">Book</button>
        </div>
      ))}
    </div>
  )
}

function BookingModal({ service, onClose, onBook }) {
  const [submitting, setSubmitting] = useState(false)
  const submit = async (payload) => {
    setSubmitting(true)
    try {
      await onBook(payload)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-4 max-w-lg w-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">Book {service.name}</h3>
          <button onClick={onClose} className="px-3 py-1 bg-gray-100 rounded">Close</button>
        </div>
        <ServiceDetails service={service} />
        <hr className="my-3" />
        <ServiceBookingForm service={service} onSubmit={submit} submitting={submitting} />
      </div>
    </div>
  )
}

function ServiceDetails({ service }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 overflow-x-auto">{service.photos?.map((p,i)=>(<img key={i} src={p} className="h-20 w-28 object-cover rounded" />))}</div>
      <p className="text-sm text-gray-700">{service.description}</p>
      <div className="text-sm text-gray-600">{service.category} • {service.country} {service.province? `• ${service.province}`:''}</div>
    </div>
  )
}

function ServiceBookingForm({ service, onSubmit, submitting }) {
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
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input type="date" className="border rounded px-3 py-2" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
        <input type="time" className="border rounded px-3 py-2" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} />
      </div>
      {service.questions?.map(q => (
        <div key={q.id} className="flex flex-col gap-1">
          <label className="text-sm">{q.text}{q.required? ' *':''}</label>
          <input className="border rounded px-3 py-2" value={form.answers[q.id]||''} onChange={e=>setForm({...form,answers:{...form.answers,[q.id]: e.target.value}})} />
        </div>
      ))}
      <textarea className="w-full border rounded px-3 py-2" rows="3" placeholder="Message to provider (optional)" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} />
      <button disabled={submitting} className="w-full bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2">{submitting? 'Submitting...' : 'Send Request'}</button>
    </form>
  )
}

function BookingList({ title, items, role, onRespond }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="space-y-3">
        {items.map(b => (
          <div key={b.id} className="border rounded p-3">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">Service: {b.service_id}</div>
                <div className="text-sm text-gray-600">Status: {b.status}</div>
                {b.scheduled_start && <div className="text-sm">Start: {new Date(b.scheduled_start).toLocaleString()}</div>}
              </div>
              {role==='provider' && (
                <div className="flex gap-2">
                  <button className="bg-green-600 text-white rounded px-3 py-1" onClick={()=>onRespond(b.id,'accepted')}>Accept</button>
                  <button className="bg-red-600 text-white rounded px-3 py-1" onClick={()=>onRespond(b.id,'declined')}>Decline</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {!items.length && <p className="text-sm text-gray-500">No items.</p>}
      </div>
    </div>
  )
}
