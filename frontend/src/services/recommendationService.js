const API_URL = "http://127.0.0.1:8000/api/v1/recommendations/"

export async function getRecommendations(filters = {}) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value)
    }
  })

  const response = await fetch(`${API_URL}?${params.toString()}`)

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "No se pudieron obtener recomendaciones")
  }

  return data
}

export async function getPopularBooksByGrade(grade) {
  const response = await fetch(
    `http://127.0.0.1:8000/api/v1/recommendations/popular-by-grade?grade=${grade}`
  )

  if (!response.ok) {
    throw new Error("Error al obtener libros populares por grado")
  }

  return response.json()
}