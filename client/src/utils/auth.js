import API from '../services/api';

export async function registerUser({ username, email, password }) {
  const { data } = await API.post('/auth/register', { username, email, password });
  persistAuth(data);
  return data;
}

export async function loginUser({ email, password }) {
  const { data } = await API.post('/auth/login', { email, password });
  persistAuth(data);
  return data;
}

export function persistAuth({ user, token }) {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
}

export function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

export function getCurrentUser() {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}