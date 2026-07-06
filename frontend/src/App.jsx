import { useState, useEffect, useRef } from "react"
import MessageBubble from "./components/MessageBubble"
import ChatInput from "./components/ChatInput"
import LoginScreen from "./components/LoginScreen"
import RouteMenu from "./components/RouteMenu"
import IndependentReading from "./components/IndependentReading"
import RecommendationsView from "./components/RecommendationsView"
import SurpriseMe from "./components/SurpriseMe"
import KnownSearch from "./components/KnownSearch"
import AssignmentCollections from "./components/AssignmentCollections"

function App() {

  const [user, setUser] = useState(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [language, setLanguage] = useState("Spanish")
  const [recommendedBooks, setRecommendedBooks] = useState([])
  const [favoriteCategories, setFavoriteCategories] = useState([])
  const [messages, setMessages] = useState([])

const texts = {
  Spanish: {
    title: "Descubre tu próxima lectura",
    language: "Idioma",
    placeholder: "Escribe tu mensaje...",
    send: "Enviar",
    footer:
      "Descubre libros según tus intereses, temas y nivel lector."
  },

  English: {
    title: "Discover your next read",
    language: "Language",
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


  const userDescription = user?.is_staff
    ? language === "English"
      ? "ABC Staff"
      : "Personal ABC"
    : language === "English"
      ? `Grade ${user?.grade}`
      : `${user?.grade}.º grado`

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
          reading_level: user?.grade
            ? `${user.grade}° grado`
            : "Staff"
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

      const handleLogin = (loggedUser) => {
        setUser(loggedUser)
      setLanguage(loggedUser.language || "Spanish")

      
  }
      const handleSelectRoute = (routeId) => {
  setSelectedRoute(routeId)
}

      const saveFavoriteCategory = (categoryTitle) => {
  setFavoriteCategories((prev) => {
    const existingCategory = prev.find(
      (category) => category.title === categoryTitle
    )

    if (existingCategory) {
      return prev.map((category) =>
        category.title === categoryTitle
          ? {
              ...category,
              count: category.count + 1
            }
          : category
      )
    }

    return [
      ...prev,
      {
        title: categoryTitle,
        count: 1
      }
    ]
  })
}
      const handleStartRecommendations = (preferences) => {
  console.log("Preferencias seleccionadas:", preferences)
  
  saveFavoriteCategory(preferences.categoryTitle)
  console.log("Guardando categoría:", preferences.categoryTitle)
  
  const mockBooks = [
    {
      id: 1,
      title: language === "English" ? "The Last Star Map" : "El último mapa estelar",
      author: "A. Rivera",
      pages: 168,
      genre: preferences.categoryTitle,
      available: true,
      coverEmoji: "🚀"
    },
    {
      id: 2,
      title: language === "English" ? "Beyond the Red Planet" : "Más allá del planeta rojo",
      author: "M. Carter",
      pages: 142,
      genre: preferences.categoryTitle,
      available: true,
      coverEmoji: "🪐"
    },
    {
      id: 3,
      title: language === "English" ? "The Robot Who Dreamed" : "El robot que soñaba",
      author: "L. Chen",
      pages: 196,
      genre: preferences.categoryTitle,
      available: false,
      coverEmoji: "🤖"
    }
  ]

  setRecommendedBooks(mockBooks)
  setSelectedRoute("recommendations")
}
     
  const handleStartSurprise = (surpriseType) => {
  const isBasedOnInterests = surpriseType === "based-on-interests"

  const selectedInterest = favoriteCategories.length > 0
    ? favoriteCategories[0].title
    : language === "English"
      ? "adventure"
      : "aventura"

  const mockBooks = [
    {
      id: 101,
      title: language === "English" ? "The Hidden Door" : "La puerta escondida",
      author: "S. Morgan",
      pages: 128,
      genre: isBasedOnInterests
        ? selectedInterest
        : language === "English"
          ? "Unexpected discovery"
          : "Descubrimiento inesperado",
      available: true,
      coverEmoji: "🚪",
      year: 2023,
      location: language === "English" ? "LRC shelves" : "Estantería del LRC",
      summary: language === "English"
        ? "A story chosen to help you discover something different."
        : "Una historia elegida para ayudarte a descubrir algo diferente."
    },
    {
      id: 102,
      title: language === "English" ? "Moonlight Library" : "La biblioteca de la luna",
      author: "R. Castillo",
      pages: 214,
      genre: isBasedOnInterests
        ? selectedInterest
        : language === "English"
          ? "Fantasy"
          : "Fantasía",
      available: true,
      coverEmoji: "🌙",
      year: 2022,
      location: language === "English" ? "LRC shelves" : "Estantería del LRC",
      summary: language === "English"
        ? "A mysterious recommendation for curious readers."
        : "Una recomendación misteriosa para lectores curiosos."
    },
    {
      id: 103,
      title: language === "English" ? "The Map Nobody Read" : "El mapa que nadie leyó",
      author: "L. Méndez",
      pages: 96,
      genre: isBasedOnInterests
        ? selectedInterest
        : language === "English"
          ? "Adventure"
          : "Aventura",
      available: false,
      coverEmoji: "🗺️",
      year: 2021,
      location: language === "English" ? "LRC shelves" : "Estantería del LRC",
      summary: language === "English"
        ? "A short book that invites readers to follow clues and take risks."
        : "Un libro corto que invita a seguir pistas y tomar riesgos."
    }
  ]

  setRecommendedBooks(mockBooks)
  setSelectedRoute("recommendations")
}
  const handleStartKnownSearch = (searchData) => {
  console.log("Búsqueda seleccionada:", searchData)

  const mockBooks = [
    {
      id: 201,
      title: language === "English" ? "The Secret Pages" : "Las páginas secretas",
      author: "D. Herrera",
      pages: 118,
      genre: searchData.searchTypeTitle,
      available: true,
      coverEmoji: "📘",
      year: 2020,
      location: language === "English" ? "LRC shelves" : "Estantería del LRC",
      summary: language === "English"
        ? `This recommendation is related to your search: "${searchData.query}".`
        : `Esta recomendación está relacionada con tu búsqueda: "${searchData.query}".`
    },
    {
      id: 202,
      title: language === "English" ? "Clues in the Library" : "Pistas en la biblioteca",
      author: "M. Torres",
      pages: 156,
      genre: searchData.searchTypeTitle,
      available: true,
      coverEmoji: "🔎",
      year: 2021,
      location: language === "English" ? "LRC shelves" : "Estantería del LRC",
      summary: language === "English"
        ? `A possible match for: "${searchData.query}".`
        : `Una posible coincidencia para: "${searchData.query}".`
    },
    {
      id: 203,
      title: language === "English" ? "A Book of Many Doors" : "Un libro de muchas puertas",
      author: "L. Chen",
      pages: 204,
      genre: searchData.searchTypeTitle,
      available: false,
      coverEmoji: "🚪",
      year: 2022,
      location: language === "English" ? "LRC shelves" : "Estantería del LRC",
      summary: language === "English"
        ? `This book may connect with the topic or keyword you entered.`
        : `Este libro puede relacionarse con el tema o palabra clave que escribiste.`
    }
  ]

  setRecommendedBooks(mockBooks)
  setSelectedRoute("recommendations")
}

const handleStartCollectionSearch = (collectionData) => {
  console.log("Colección seleccionada:", collectionData)

  const mockBooks = [
    {
      id: 301,
      title: language === "English"
        ? `${collectionData.collectionTitle}: Essential Readings`
        : `${collectionData.collectionTitle}: lecturas esenciales`,
      author: "ABC LRC",
      pages: 124,
      genre: collectionData.collectionTitle,
      sublocation: collectionData.collectionTitle,
      available: true,
      coverEmoji: "📚",
      sublocation: collectionData.collectionTitle,
      callNumber: "FIC LRC",
      isbn: "978-0000000000",
      year: 2022,
      location: language === "English" ? "LRC collection shelves" : "Colección del LRC",
      summary: language === "English"
        ? `A selected resource connected to the ${collectionData.collectionTitle} collection.`
        : `Un recurso seleccionado relacionado con la colección ${collectionData.collectionTitle}.`
    },
    {
      id: 302,
      title: language === "English"
        ? `Introduction to ${collectionData.collectionTitle}`
        : `Introducción a ${collectionData.collectionTitle}`,
      author: "LRC Research Guide",
      pages: 96,
      genre: collectionData.collectionTitle,
      sublocation: collectionData.collectionTitle,
      available: true,
      coverEmoji: "📝",
      sublocation: collectionData.collectionTitle,
      callNumber: "REF LRC",
      isbn: "978-0000000000",
      year: 2021,
      location: language === "English" ? "LRC shelves" : "Estantería del LRC",
      summary: language === "English"
        ? "A useful starting point for research, class assignments, or academic exploration."
        : "Un buen punto de partida para investigación, tareas o exploración académica."
    },
    {
      id: 303,
      title: language === "English"
        ? `Stories and Contexts: ${collectionData.collectionTitle}`
        : `Historias y contextos: ${collectionData.collectionTitle}`,
      author: "Academic Collection",
      pages: 210,
      genre: collectionData.collectionTitle,
      sublocation: collectionData.collectionTitle,
      available: false,
      coverEmoji: "🔎",
      sublocation: collectionData.collectionTitle,
      callNumber: "NF LRC",
      isbn: "978-0000000000",
      year: 2020,
      location: language === "English" ? "LRC shelves" : "Estantería del LRC",
      summary: language === "English"
        ? "A related resource that may support deeper reading and classroom projects."
        : "Un recurso relacionado que puede apoyar lecturas más profundas y proyectos de clase."
    }
  ]

  setRecommendedBooks(mockBooks)
  setSelectedRoute("recommendations")
}

  if (!user) {
  return (
    <LoginScreen onLogin={handleLogin} />
    )
  }

  return (
  <div className="min-h-screen bg-[#F5F3FF]">

    {/* Top bar */}
    <header className="bg-indigo-950 text-white px-8 py-5 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">
          ABC LRC
        </h1>

        <p className="text-violet-200 text-sm mt-1">
          {language === "English"
            ? "Book discovery assistant"
            : "Asistente de descubrimiento de libros"}
        </p>
      </div>

      <div className="flex items-center gap-4">

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-indigo-900 rounded-xl px-4 py-2 outline-none text-white"
        >
          <option value="Spanish">Español</option>
          <option value="English">English</option>
        </select>

        <div className="bg-indigo-900 rounded-xl px-4 py-2 text-violet-100">
          {userDescription}
        </div>

      </div>
    </header>

    {/* Main Content */}
    <main className="px-8 py-8">

      <div className="max-w-6xl mx-auto">

        {!selectedRoute ? (
        <RouteMenu
          language={language}
          user={user}
          favoriteCategories={favoriteCategories}
          onSelectRoute={handleSelectRoute}
        />
      ) : selectedRoute === "independent-reading" ? (
        <IndependentReading
          language={language}
          user={user}
          onBack={() => setSelectedRoute(null)}
          onStartRecommendations={handleStartRecommendations}
        />
      ) : selectedRoute === "surprise" ? (
        <SurpriseMe
          language={language}
          favoriteCategories={favoriteCategories}
          onBack={() => setSelectedRoute(null)}
          onStartSurprise={handleStartSurprise}
        />

      ) : selectedRoute === "known-search" ? (
        <KnownSearch
          language={language}
          onBack={() => setSelectedRoute(null)}
          onStartSearch={handleStartKnownSearch}
        />

      ) : selectedRoute === "assignment" ? (
        <AssignmentCollections
          language={language}
          user={user}
          onBack={() => setSelectedRoute(null)}
          onStartCollectionSearch={handleStartCollectionSearch}
        />

      ) : selectedRoute === "recommendations" ? (
        <RecommendationsView
          language={language}
          books={recommendedBooks}
          onBack={() => setSelectedRoute(null)}
        />
      ) : (
        <>
            {/* Top Header */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setSelectedRoute(null)}
                className="mb-4 text-sm font-semibold text-indigo-700 hover:text-indigo-950"
              >
                ← {language === "English" ? "Back to options" : "Volver a opciones"}
              </button>

              <h2 className="text-3xl font-bold text-slate-800">
                {t.title}
              </h2>
            </div>

            {/* Chat Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 p-6 flex flex-col h-[75vh]">

              <div className="flex-1 overflow-y-auto space-y-6">

                {messages.map((msg, index) => (

                  <MessageBubble
                    key={index}
                    msg={msg}
                    userLabel={
                      language === "English"
                        ? "You"
                        : "Tú"
                    }
                    assistantLabel={
                      language === "English"
                        ? "Assistant"
                        : "Asistente"
                    }
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

              <ChatInput
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                placeholder={t.placeholder}
                buttonText={t.send}
              />

            </div>
          </>
        )}

      </div>

    </main>

  </div>
)
}

export default App