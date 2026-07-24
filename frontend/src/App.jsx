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
import ProfileView from "./components/ProfileView"
import BookDetailModal from "./components/BookDetailModal"
import {
  getRecommendations,
  getPopularBooksByGrade
} from "./services/recommendationService"

function App() {

  const [user, setUser] = useState(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [language, setLanguage] = useState("Spanish")
  const [recommendedBooks, setRecommendedBooks] = useState([])
  const [favoriteCategories, setFavoriteCategories] = useState([])
  const [readingList, setReadingList] = useState([])
  const [messages, setMessages] = useState([])
  const [profileSelectedBook, setProfileSelectedBook] = useState(null)
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
  if (routeId === "popular-grade") {
    handlePopularByGrade()
    return
  }

  setSelectedRoute(routeId)
}

const handleCloseProfileBookModal = () => {
  setProfileSelectedBook(null)
}

const handleAddToReadingList = (book) => {
  setReadingList((prev) => {
    const alreadySaved = prev.some(
      (savedBook) => savedBook.id === book.id
    )

    if (alreadySaved) {
      return prev
    }

    return [...prev, book]
  })
}

const handlePopularByGrade = async () => {
  if (!user?.grade) {
    setRecommendationContext({
      title: language === "English"
        ? "Grade not available"
        : "Grado no disponible",
      description: language === "English"
        ? "We could not detect your grade from your profile."
        : "No pudimos detectar tu grado desde tu perfil.",
      source: "popular-grade",
      suggestions: []
    })

    setRecommendedBooks([])
    setSelectedRoute("recommendations")
    return
  }

  try {
    const data = await getPopularBooksByGrade(user.grade)

    setRecommendationContext({
      title: language === "English"
        ? `Most read by students in Grade ${user.grade}`
        : `Más leído por estudiantes de ${user.grade}.º grado`,
      description: language === "English"
        ? "Based on a simulated popularity list for this MVP."
        : "Basado en una lista simulada de popularidad para este MVP.",
      source: "popular-grade",
      suggestions: []
    })

    setRecommendedBooks(data.recommendations || [])
    setSelectedRoute("recommendations")
  } catch (error) {
    console.error("Error al obtener libros populares por grado:", error)

    setRecommendationContext({
      title: language === "English"
        ? "Popular books unavailable"
        : "No se pudieron cargar los libros populares",
      description: language === "English"
        ? "Please try again later."
        : "Intenta nuevamente más tarde.",
      source: "popular-grade",
      suggestions: []
    })

    setRecommendedBooks([])
    setSelectedRoute("recommendations")
  }
}

      const saveFavoriteCategory = (categoryTitle, apiCategory) => {
  setFavoriteCategories((prev) => {
    const existingCategory = prev.find(
      (category) => category.apiCategory === apiCategory
    )

    const otherCategories = prev.filter(
      (category) => category.apiCategory !== apiCategory
    )

    if (existingCategory) {
      return [
        {
          ...existingCategory,
          title: categoryTitle,
          apiCategory,
          count: existingCategory.count + 1
        },
        ...otherCategories
      ]
    }

    return [
      {
        title: categoryTitle,
        apiCategory,
        count: 1
      },
      ...prev
    ]
  })
}
  const handleStartRecommendations = async (preferences) => {
  console.log("Preferencias seleccionadas:", preferences)

  saveFavoriteCategory(preferences.categoryTitle, preferences.apiCategory)
  console.log("Guardando categoría:", preferences.categoryTitle, preferences.apiCategory)

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

const handleBackToMenu = () => {
  setSelectedRoute(null)
}

const handleStartSurprise = async (surpriseType) => {
  const isBasedOnInterests = surpriseType === "based-on-interests"

  const selectedInterest = favoriteCategories.length > 0
    ? favoriteCategories[0]
    : null

  try {
    const filters = isBasedOnInterests && selectedInterest
      ? {
          category: selectedInterest.apiCategory,
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
      description: isBasedOnInterests && selectedInterest
        ? language === "English"
          ? `Based on: ${selectedInterest.title}`
          : `Basado en: ${selectedInterest.title}`
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

const handleSuggestionClick = async (suggestion) => {
  console.log("Sugerencia seleccionada:", suggestion)

  try {
    const data = await getRecommendations({
      search: suggestion
    })

    setRecommendationContext({
      title: language === "English"
        ? `Results for: ${suggestion}`
        : `Resultados para: ${suggestion}`,
      description: language === "English"
        ? "Search based on a suggested term."
        : "Búsqueda basada en una sugerencia.",
      source: "known-search",
      suggestions: data.suggestions || []
    })

    setRecommendedBooks(data.recommendations || [])
    setSelectedRoute("recommendations")
  } catch (error) {
    console.error("Error al buscar sugerencia:", error)

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
  console.log("Colección o tema seleccionado:", collectionData)

  const isTaskTopicSearch = collectionData.searchMode === "task-topic"

  try {
    const filters = isTaskTopicSearch
      ? {
          search: collectionData.taskTopic || collectionData.query,
          available: true
        }
      : {
          sublocation: collectionData.sublocation || collectionData.collectionTitle,
          available: true
        }

    console.log("Filtros enviados al backend:", filters)

    const data = await getRecommendations(filters)

    console.log("Respuesta de búsqueda LRC:", data)

    setRecommendationContext({
      title: isTaskTopicSearch
        ? language === "English"
          ? `Resources for: ${collectionData.taskTopic}`
          : `Recursos para: ${collectionData.taskTopic}`
        : language === "English"
          ? `Resources from ${collectionData.collectionTitle}`
          : `Recursos de ${collectionData.collectionTitle}`,
      description: isTaskTopicSearch
        ? language === "English"
          ? "Results based on the assignment topic."
          : "Resultados basados en el tema de la tarea."
        : language === "English"
          ? "Results from this LRC sublocation."
          : "Resultados de esta sublocation del LRC.",
      source: "lrc-collection",
      suggestions: data.suggestions || []
    })

    setRecommendedBooks(data.recommendations || [])
    setSelectedRoute("recommendations")
  } catch (error) {
    console.error("Error al obtener recursos del LRC:", error)

    setRecommendationContext({
      title: language === "English"
        ? "LRC search error"
        : "Error al buscar recursos del LRC",
      description: language === "English"
        ? "We could not load resources right now."
        : "No pudimos cargar recursos en este momento.",
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

      <div className="flex items-center gap-3">

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-indigo-900 rounded-xl px-4 py-2 outline-none text-white"
        >
          <option value="Spanish">Español</option>
          <option value="English">English</option>
        </select>

 
         <button
  type="button"
  onClick={() => setSelectedRoute("profile")}
  className="
    bg-indigo-900
    rounded-xl
    h-10
    w-10
    outline-none
    text-white
    hover:bg-indigo-800
    transition
    flex
    items-center
    justify-center
  "
  title={language === "English" ? "My profile" : "Mi perfil"}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5 text-white"
  >
    <path
      fillRule="evenodd"
      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
      clipRule="evenodd"
    />
  </svg>
</button>

        <div className="bg-indigo-900 rounded-xl h-10 px-4 flex items-center text-violet-100">
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

      ) : selectedRoute === "profile" ? (
      
        <ProfileView
          language={language}
          user={user}
          readingList={readingList}
          favoriteCategories={favoriteCategories}
          onBack={handleBackToMenu}
          onViewBook={setProfileSelectedBook}
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
          onSuggestionClick={handleSuggestionClick}
          readingList={readingList}
          onAddToReadingList={handleAddToReadingList}
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

     <BookDetailModal
                book={profileSelectedBook}
                language={language}
                onClose={handleCloseProfileBookModal}
                onInterested={() => {
                  setProfileSelectedBook(null)
                }}
                onAddToList={handleAddToReadingList}
                onMoreOptions={() => {
                  setProfileSelectedBook(null)
                  setSelectedRoute(null)
                }}
                isSaved={
                  profileSelectedBook
                    ? readingList.some((book) => book.id === profileSelectedBook.id)
                    : false
                }
              />

  </div>
)
}

export default App