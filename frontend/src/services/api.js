const API_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"

export async function getHealth() {

    const response = await fetch(
        `${API_URL}/health`
    )

    return response.json()
}