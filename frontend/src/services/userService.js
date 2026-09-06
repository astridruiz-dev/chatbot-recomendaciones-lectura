const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
const API_URL = `${API_BASE_URL}/api/v1/users`

export async function googleLogin(credential, language) {
  const response = await fetch(`${API_URL}/google-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      credential,
      language,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "No se pudo iniciar sesión con Google")
  }

  return data
}