// api.js - Lightweight fetch wrapper to automatically attach JWT token

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
    }
  } catch (e) {
    console.error('Error reading token from localStorage', e);
  }
  return headers;
};

const handleResponse = async (response) => {
  if (response.status === 401 || response.status === 403) {
    console.warn("Unauthorized access detected. Token might be expired.");
    localStorage.removeItem('user');
    window.location.href = '/'; 
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'API request failed');
  }
  
  return response.json();
};

export const api = {
  get: async (url) => {
    const response = await fetch(`http://localhost:8080/api${url}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  
  post: async (url, body) => {
    const response = await fetch(`http://localhost:8080/api${url}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
  
  put: async (url, body) => {
    const response = await fetch(`http://localhost:8080/api${url}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : null,
    });
    return handleResponse(response);
  }
};
