import { useEffect, useState } from "react"
import { getHealth } from "../services/api"

function Home() {

  const [status, setStatus] = useState("Cargando...")

  useEffect(() => {

    async function fetchHealth() {

      try {

        const data = await getHealth()

        setStatus(data.status)

      } catch (error) {

        setStatus("Backend desconectado")
      }
    }

    fetchHealth()

  }, [])

  return (
    <div>

      <h1>Library Chatbot</h1>

      <p>
        Sistema inteligente de recomendación
        de libros escolares
      </p>

      <h3>
        Estado API: {status}
      </h3>

    </div>
  )
}

export default Home