// AquaShield API client
// Keeps all frontend requests in one place.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json();
}

export const api = {
  health: () => request("/health"),
  history: (station, limit = 100) => request(`/readings?station=${encodeURIComponent(station)}&limit=${limit}`),
  latest: (station) => request(`/readings/latest?station=${encodeURIComponent(station)}`),
  saveReading: (reading) => request("/readings", { method: "POST", body: JSON.stringify(reading) }),
};
