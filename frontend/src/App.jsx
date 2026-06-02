import { useState, useEffect, useRef } from "react"
import MessageBubble from "./components/MessageBubble"

function App() {

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const [language, setLanguage] = useState("Spanish")
  const [readingLevel, setReadingLevel] = useState("11° grado")

 const welcomeMessages = {
  Spanish: `¡Hola! 👋

Estoy aquí para ayudarte a descubrir libros que realmente puedan interesarte. 📚

Puedes probar mensajes como:

📖 Me gustan las novelas históricas
🕵️ Quiero libros de misterio
⚔️ Recomiéndame lecturas sobre guerra

¿Qué te gustaría leer hoy?`,

  English: `Hello! 👋

I'm here to help you discover books you may enjoy. 📚

Try asking:

📖 I like historical novels
🕵️ I want mystery books
⚔️ Recommend books about war

What would you like to read today?`
}

const [messages, setMessages] = useState([
  {
    sender: "bot",
    text: welcomeMessages["Spanish"]
  }
])

const texts = {
  Spanish: {
    title: "Descubre tu próxima lectura",
    language: "Idioma",
    readingLevel: "Nivel lector",
    placeholder: "Escribe tu mensaje...",
    send: "Enviar",
    footer:
      "Descubre libros según tus intereses, temas y nivel lector."
  },

  English: {
    title: "Discover your next read",
    language: "Language",
    readingLevel: "Reading level",
    placeholder: "Type your message...",
    send: "Send",
    footer:
      "Discover books based on your interests, themes and reading level."
  }
}

const t = texts[language]

  const messagesEndRef = useRef(null)

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth"
  })
}, [messages])

useEffect(() => {

  setMessages([
    {
      sender: "bot",
      text: welcomeMessages[language]
    }
  ])

}, [language])

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
          message: currentMessage,
          language: language,
          reading_level: readingLevel
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
          ABC LRC
        </h1>

        <p className="text-violet-200 mt-3 text-xs leading-relaxed">
          Discover books and resources tailored for you.
        </p>

        {/* Options */}
        <div className="mt-10 space-y-6">

          <div>
            <label className="block mb-2 text-sm font-medium">
              {t.language}
            </label>

           <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-indigo-900 rounded-xl p-3 outline-none"
          >
            <option>Spanish</option>
            <option>English</option>
          </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              {t.readingLevel}
            </label>

            <select
              value={readingLevel}
              onChange={(e) => setReadingLevel(e.target.value)}
              className="w-full bg-indigo-900 rounded-xl p-3 outline-none"
        >
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
          {t.footer}
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Top Header */}
        <div className="mb-6">

          <h2 className="text-3xl font-bold text-slate-800">
            {t.title}
          </h2>

        </div>

        {/* Chat Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 p-6 flex flex-col h-[80vh]">

{/* Messages */}
<div className="flex-1 overflow-y-auto space-y-6">

 {messages.map((msg, index) => (

  <MessageBubble
    key={index}
    msg={msg}
  />

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

        <div className="flex gap-1 items-center">

          <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" />

          <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:0.15s]" />

          <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:0.3s]" />

        </div>

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
                placeholder={t.placeholder}
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
              {t.send}
            </button>

          </div>

        </div>

      </main>

    </div>
  )
}

export default App