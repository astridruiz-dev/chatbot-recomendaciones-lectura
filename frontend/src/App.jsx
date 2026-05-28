import { useState, useEffect, useRef } from "react"

function App() {

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)


 const [messages, setMessages] = useState([
  {
    sender: "bot",
    text: `¡Hola! 👋

Estoy aquí para ayudarte a descubrir libros que realmente puedan interesarte. 📚

Puedes probar mensajes como:

📖 Me gustan las novelas históricas
🕵️ Quiero libros de misterio
⚔️ Recomiéndame lecturas sobre guerra

¿Qué te gustaría leer hoy?`
  }
])

  const messagesEndRef = useRef(null)

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth"
  })
}, [messages])

  const sendMessage = async () => {

    if (!message.trim()) return

    // Guardar mensaje usuario
    const userMessage = {
      sender: "user",
      text: message
    }

    setMessages((prev) => [...prev, userMessage])

    const currentMessage = message

    setMessage("")
    setLoading(true)

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: currentMessage
          })
        }
      )

      const data = await response.json()

      const botMessage = {
          sender: "bot",
          text: data.response,
          books: data.books || []
        }

      setMessages((prev) => [...prev, botMessage])
      setLoading(false)

    } catch (error) {

      const errorMessage = {
        sender: "bot",
        text: "Error conectando con el servidor."
      }

      setMessages((prev) => [...prev, errorMessage])
      setLoading(false)

    }

  }

  return (
    <div className="min-h-screen bg-[#F5F3FF] flex">

      {/* Sidebar */}
      <aside className="w-72 bg-indigo-950 text-white p-6 flex flex-col">

        <h1 className="text-3xl font-bold">
          Library Chatbot
        </h1>

        <p className="text-violet-100 mt-2 text-sm">
          Plataforma inteligente de recomendaciones literarias.
        </p>

        {/* Options */}
        <div className="mt-10 space-y-6">

          <div>
            <label className="block mb-2 text-sm font-medium">
              Idioma
            </label>

            <select className="w-full bg-indigo-900 rounded-xl p-3 outline-none">
              <option>Español</option>
              <option>English</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Nivel lector
            </label>

            <select className="w-full bg-indigo-900 rounded-xl p-3 outline-none">
              <option>6° grado</option>
              <option>7° grado</option>
              <option>8° grado</option>
              <option>9° grado</option>
              <option>10° grado</option>
              <option>11° grado</option>
              <option>12° grado</option>
            </select>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-auto text-sm text-violet-200">
          Descubre libros según tus intereses, temas y nivel lector.
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Top Header */}
        <div className="mb-6">

          <h2 className="text-3xl font-bold text-slate-800">
            Descubre tu próxima lectura 
          </h2>

        </div>

        {/* Chat Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 p-6 flex flex-col h-[80vh]">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-6 ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
            className={`
              px-5 py-4 rounded-2xl shadow-md
              ${
                msg.sender === "user"
                  ? "max-w-xl"
                  : "max-w-2xl"
              }

              ${
                msg.sender === "user"
                  ? "bg-violet-600 text-white rounded-tr-sm"
                  : "bg-violet-100 text-slate-800 rounded-tl-sm"
              }
            `}
          >

            <div
              className={`
                text-xs font-semibold mb-2
                ${
                  msg.sender === "user"
                    ? "text-violet-100"
                    : "text-violet-700"
                }
              `}
            >
              {msg.sender === "user" ? "Tú" : "Asistente"}
            </div>

            <div className="whitespace-pre-line">
              {msg.text}

              {msg.books?.length > 0 && (

  <div className="mt-4 space-y-3">

    {msg.books.map((book, index) => (

      <div
        key={index}
        className="
          bg-white
          border
          border-violet-200
          rounded-xl
          p-4
          shadow-sm
        "
      >

        <h3 className="font-semibold text-slate-800">
          {book.title}
        </h3>

        <p className="text-sm text-slate-600">
          {book.author}
        </p>

        <p className="text-sm text-slate-500 mt-1">
          Nivel lector: {book.reading_level}
        </p>

        <p className="text-sm text-slate-500">
          Temas: {book.themes.join(", ")}
        </p>

      </div>

    ))}

  </div>

)}
                </div>

            </div>

              </div>
            ))}

            <div ref={messagesEndRef}></div>

            {loading && (
              <div className="flex justify-start">
                <div
                  className="
                    bg-violet-100
                    text-slate-700
                    px-5
                    py-4
                    rounded-2xl
                    rounded-tl-sm
                    shadow-md
                  "
                >
                  Pensando...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
      
          <div className="mt-6 flex gap-4">

            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage()
                  }
                }}
                type="text"
                placeholder="Escribe tu mensaje..."
                className="
                  flex-1
                  bg-[#F5F3FF]
                  border border-slate-200
                  rounded-2xl
                  px-5
                  py-4
                  text-slate-700
                  placeholder-slate-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-violet-500
                "
              />

            <button
              onClick={sendMessage}
              className="
                bg-indigo-900
                hover:bg-indigo-950
                text-white
                font-medium
                px-8
                rounded-2xl
                shadow-md
                transition
              "
            >
              Enviar
            </button>

          </div>

        </div>

      </main>

    </div>
  )
}

export default App