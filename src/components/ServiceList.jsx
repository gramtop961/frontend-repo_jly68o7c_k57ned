import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function ServiceList({ token, filters = {}, onSelect }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.listServices(filters)
      setServices(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [JSON.stringify(filters)])

  if (loading) return <p>Loading services...</p>
  if (!services.length) return <p>No services found.</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map(s => (
        <div key={s.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
          {s.photos?.[0] && <img src={s.photos[0]} alt="" className="h-40 w-full object-cover rounded mb-3" />}
          <h3 className="font-bold text-lg">{s.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-3">{s.description}</p>
          <div className="mt-2 text-sm text-gray-700">{s.category} • {s.country || 'N/A'} {s.province? `• ${s.province}`:''}</div>
          <div className="mt-2 font-semibold">${s.price?.toFixed?.(2) ?? s.price}</div>
          <button onClick={()=>onSelect?.(s)} className="mt-auto bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2">View</button>
        </div>
      ))}
    </div>
  )
}
