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
import { getRecommendations } from "./services/recommendationService"

function App() {

  const [user, setUser] = useState(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [language, setLanguage] = useState("Spanish")
  const [recommendedBooks, setRecommendedBooks] = useState([])
  const [favoriteCategories, setFavoriteCategories] = useState([])
  const [messages, setMessages] = useState([])
  const [recommendationContext, setRecommendationContext] = useState(null)

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
  const handleStartRecommendations = async (preferences) => {
  console.log("Preferencias seleccionadas:", preferences)

  saveFavoriteCategory(preferences.categoryTitle)
  console.log("Guardando categoría:", preferences.categoryTitle)

  try {
    const data = await getRecommendations({
      category: preferences.apiCategory,
      length: preferences.apiLength,
      grade: preferences.is_staff ? null : preferences.grade,
      available: true
    })

    setRecommendationContext({
      title: language === "English"
        ? `${preferences.categoryTitle} recommendations`
        : `Recomendaciones de ${preferences.categoryTitle}`,
      description: language === "English"
        ? `Length: ${preferences.lengthTitle}`
        : `Extensión: ${preferences.lengthTitle}`,
      source: "independent-reading",
      suggestions: data.suggestions || []
    })

    setRecommendedBooks(data.recommendations || [])
    setSelectedRoute("recommendations")
  } catch (error) {
    console.error("Error al obtener recomendaciones:", error)

    setRecommendationContext({
      title: language === "English"
        ? "Recommendation error"
        : "Error al obtener recomendaciones",
      description: language === "English"
        ? "We could not load recommendations right now."
        : "No pudimos cargar recomendaciones en este momento.",
      source: "independent-reading",
      suggestions: []
    })

    setRecommendedBooks([])
    setSelectedRoute("recommendations")
  }
}

const handleStartSurprise = async (surpriseType) => {
  const isBasedOnInterests = surpriseType === "based-on-interests"

  const selectedInterest = favoriteCategories.length > 0
    ? favoriteCategories[0].title
    : null

  try {
    const filters = isBasedOnInterests && selectedInterest
      ? {
          category: selectedInterest,
          available: true
        }
      : {
          available: true
        }

    const data = await getRecommendations(filters)

    let books = data.recommendations || []

    if (!isBasedOnInterests) {
      books = [...books].sort(() => Math.random() - 0.5).slice(0, 3)
    }

    setRecommendationContext({
      title: isBasedOnInterests
        ? language === "English"
          ? "Based on your interests"
          : "Basado en tus intereses"
        : language === "English"
          ? "Something completely new"
          : "Algo completamente nuevo",
      description: isBasedOnInterests
        ? language === "English"
          ? `Based on: ${selectedInterest}`
          : `Basado en: ${selectedInterest}`
        : language === "English"
          ? "A few available books outside a specific filter."
          : "Algunos libros disponibles fuera de un filtro específico.",
      source: "surprise",
      suggestions: data.suggestions || []
    })

    setRecommendedBooks(books)
    setSelectedRoute("recommendations")
  } catch (error) {
    console.error("Error al obtener sorpresa:", error)

    setRecommendationContext({
      title: language === "English"
        ? "Surprise error"
        : "Error al sorprender",
      description: language === "English"
        ? "We could not load surprise recommendations right now."
        : "No pudimos cargar recomendaciones sorpresa en este momento.",
      source: "surprise",
      suggestions: []
    })

    setRecommendedBooks([])
    setSelectedRoute("recommendations")
  }
}
  
const handleStartKnownSearch = async (searchData) => {
  console.log("Búsqueda seleccionada:", searchData)

  try {
    const data = await getRecommendations({
  search: searchData.query
})

    console.log("Respuesta del backend recommendations:", data)
    console.log("Libros recibidos:", data.recommendations)

    setRecommendationContext({
      title: language === "English"
        ? `Results for: ${searchData.query}`
        : `Resultados para: ${searchData.query}`,
      description: language === "English"
        ? `Search type: ${searchData.searchTypeTitle}`
        : `Tipo de búsqueda: ${searchData.searchTypeTitle}`,
      source: "known-search",
      suggestions: data.suggestions || []
    })

    setRecommendedBooks(data.recommendations || [])
    setSelectedRoute("recommendations")
  } catch (error) {
    console.error("Error al obtener recomendaciones:", error)

    setRecommendationContext({
      title: language === "English"
        ? "Search error"
        : "Error en la búsqueda",
      description: language === "English"
        ? "We could not load recommendations right now."
        : "No pudimos cargar recomendaciones en este momento.",
      source: "known-search",
      suggestions: []
    })

    setRecommendedBooks([])
    setSelectedRoute("recommendations")
  }
}

const handleStartCollectionSearch = async (collectionData) => {
  console.log("Colección seleccionada:", collectionData)

  try {
    const data = await getRecommendations({
      sublocation: collectionData.sublocation || collectionData.collectionTitle,
      available: true
    })

    setRecommendationContext({
      title: language === "English"
        ? `Resources from ${collectionData.collectionTitle}`
        : `Recursos de ${collectionData.collectionTitle}`,
      description: language === "English"
        ? "Results from this LRC sublocation."
        : "Resultados de esta sublocation del LRC.",
      source: "lrc-collection",
      suggestions: data.suggestions || []
    })

    setRecommendedBooks(data.recommendations || [])
    setSelectedRoute("recommendations")
  } catch (error) {
    console.error("Error al obtener recomendaciones:", error)

    setRecommendationContext({
      title: language === "English"
        ? "Collection error"
        : "Error en la colección",
      description: language === "English"
        ? "We could not load recommendations right now."
        : "No pudimos cargar recomendaciones en este momento.",
      source: "lrc-collection",
      suggestions: []
    })

    setRecommendedBooks([])
    setSelectedRoute("recommendations")
  }
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
          context={recommendationContext}
          onBack={() => {
            if (recommendationContext?.source === "lrc-collection") {
              setSelectedRoute("assignment")
            } else if (recommendationContext?.source === "independent-reading") {
              setSelectedRoute("independent-reading")
            } else if (recommendationContext?.source === "known-search") {
              setSelectedRoute("known-search")
            } else if (recommendationContext?.source === "surprise") {
              setSelectedRoute("surprise")
            } else {
              setSelectedRoute(null)
            }
          }}
          onMoreOptions={() => {
            if (recommendationContext?.source === "lrc-collection") {
              setSelectedRoute("assignment")
            } else if (recommendationContext?.source === "independent-reading") {
              setSelectedRoute("independent-reading")
            } else if (recommendationContext?.source === "known-search") {
              setSelectedRoute("known-search")
            } else if (recommendationContext?.source === "surprise") {
              setSelectedRoute("surprise")
            } else {
              setSelectedRoute(null)
    }
  }}
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