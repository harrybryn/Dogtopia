// authService.js – authentication helpers stub
export async function login(email, password) {
  // TODO: call POST /auth/login
  throw new Error('authService.login not implemented')
}

export async function logout() {
  // TODO: call POST /auth/logout
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('user') ?? 'null')
}

