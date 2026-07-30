const API_URL = import.meta.env.VITE_API_URL;

// Reads the saved token so every request can prove who's logged in
function getToken() {
  return localStorage.getItem('token');
}

// The one function everything else uses to talk to the backend
async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    // Backend error messages (e.g. "Invalid email or password.") bubble up as thrown errors
    throw new Error(data.message || 'Something went wrong.');
  }

  return data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};