const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  signup: (data) => request('/auth/signup', { method: 'POST', body: data }),
  login: (data) => request('/auth/login', { method: 'POST', body: data }),
  me: (token) => request('/me', { token }),
  setProviderMode: (token, enabled) => request('/me/provider-mode', { method: 'POST', token, body: { enabled } }),

  // Services
  listServices: (params = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') q.append(k, v);
    });
    const qs = q.toString();
    return request(`/services${qs ? `?${qs}` : ''}`);
  },
  getService: (id) => request(`/services/${id}`),
  createService: (token, data) => request('/services', { method: 'POST', token, body: data }),
  updateService: (token, id, data) => request(`/services/${id}`, { method: 'PUT', token, body: data }),
  deleteService: (token, id) => request(`/services/${id}`, { method: 'DELETE', token }),

  // Bookings
  createBooking: (token, data) => request('/bookings', { method: 'POST', token, body: data }),
  listBookings: (token, role) => request(`/bookings?role=${role}`, { token }),
  updateBookingStatus: (token, id, status) => request(`/bookings/${id}/status`, { method: 'PATCH', token, body: { status } }),
};
