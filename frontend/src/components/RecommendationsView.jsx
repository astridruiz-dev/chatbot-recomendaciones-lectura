import { useState } from "react"
import BookCard from "./BookCard"
import BookDetailModal from "./BookDetailModal"

function RecommendationsView({
  language,
  books,
  context,
  readingList,
  onAddToReadingList,
  onBack,
  onMoreOptions,
  onSuggestionClick,
  onGoToReadingList
}) {

  const isEnglish = language === "English"

  const title = context?.title || (isEnglish ? "Recommended books" : "Libros recomendados")

  const description = context?.description || (
  isEnglish
    ? "Here are three options based on your choices."
    : "Aquí tienes tres opciones según tus elecciones."
  )

  const suggestions = context?.suggestions || []
  const hasBooks = books.length > 0
  const safeReadingList = readingList || []

  function getSuggestionLabel(suggestion) {
  const normalizedSuggestion = suggestion
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

  const suggestionLabels = {
    fantasia: {
      es: "Fantasía y magia",
      en: "Fantasy and magic"
    },
    "fantasia y magia": {
      es: "Fantasía y magia",
      en: "Fantasy and magic"
    },
    distopia: {
      es: "Distopía",
      en: "Dystopia"
    },
    grafica: {
      es: "Novelas gráficas",
      en: "Graphic novels"
    },
    "novelas graficas": {
      es: "Novelas gráficas",
      en: "Graphic novels"
    },
    guerra: {
      es: "Guerra / eventos del pasado",
      en: "War / historical events"
    },
    historia: {
      es: "Historia",
      en: "History"
    },
    misterio: {
      es: "Misterio",
      en: "Mystery"
    },
    amor: {
      es: "Amor y emociones",
      en: "Love and emotions"
    },
    amistad: {
      es: "Amistad",
      en: "Friendship"
    }
  }

  const label = suggestionLabels[normalizedSuggestion]

  if (!label) {
    return suggestion
  }

  return isEnglish ? label.en : label.es
}

  const [selectedBook, setSelectedBook] = useState(null)
  const [statusMessage, setStatusMessage] = useState("")

  function getUniqueSuggestions() {
  const seenLabels = new Set()

  return suggestions.filter((suggestion) => {
    const label = getSuggestionLabel(suggestion)
    const normalizedLabel = label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

    if (seenLabels.has(normalizedLabel)) {
      return false
    }

    seenLabels.add(normalizedLabel)
    return true
  })
}

const uniqueSuggestions = getUniqueSuggestions()
const hasSuggestions = uniqueSuggestions.length > 0

  function handleAddToList(book) {
  const alreadySaved = safeReadingList.some(
    (savedBook) => savedBook.id === book.id
  )

  if (alreadySaved) {
    setStatusMessage(
      isEnglish
        ? `"${book.title}" is already in your reading list.`
        : `"${book.title}" ya está en tu lista de lectura.`
    )

    setSelectedBook(null)
    return
  }

  onAddToReadingList(book)

  setStatusMessage(
    isEnglish
      ? `"${book.title}" was added to your reading list.`
      : `"${book.title}" fue agregado a tu lista de lectura.`
  )

  setSelectedBook(null)
}

  function handleInterested(book) {
    if (book.available) {
      setStatusMessage(
        isEnglish
          ? `"${book.title}" is available. You can visit the LRC and ask for this book.`
          : `"${book.title}" está disponible. Puedes pasar al LRC y solicitar este libro.`
      )
    } else {
      setStatusMessage(
        isEnglish
          ? `"${book.title}" is not available right now. Check again in a few days or keep exploring.`
          : `"${book.title}" no está disponible por el momento. Consulta nuevamente dentro de algunos días o sigue explorando.`
      )
    }

    setSelectedBook(null)
  }

  function handleMoreOptions() {
  setSelectedBook(null)

  if (onMoreOptions) {
    onMoreOptions()
  } else {
    onBack()
  }
}

  const isSelectedBookSaved = selectedBook
    ? safeReadingList.some((book) => book.id === selectedBook.id)
    : false

  return (
    <div className="w-full max-w-6xl mx-auto">

      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm font-semibold text-indigo-700 hover:text-indigo-950"
      >
        ← {isEnglish ? "Back to options" : "Volver a opciones"}
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">
          {title}
        </h2>

        <p className="mt-3 text-slate-500">
          {description}
        </p>

        <button
  type="button"
  onClick={onGoToReadingList}
  className="mt-2 text-sm text-indigo-700 font-semibold hover:text-indigo-950 hover:underline transition"
>
  {isEnglish
  ? `View my reading list (${safeReadingList.length})`
  : `Ver mi lista de lectura (${safeReadingList.length})`}
</button>
      </div>

      {statusMessage && (
        <div className="mb-6 rounded-2xl bg-violet-100 px-5 py-4 text-sm text-indigo-950 shadow-sm">
          {statusMessage}
        </div>
      )}

      {!hasBooks && (
        <div className="rounded-3xl border border-violet-100 bg-white p-8 text-center shadow-sm">
          <h3 className="text-xl font-bold text-indigo-950">
            {isEnglish
              ? "No books found"
              : "No se encontraron libros"}
          </h3>

          <p className="mt-3 text-slate-500">
            {isEnglish
              ? "Try another word, author, topic or category."
              : "Prueba con otra palabra, autor, tema o categoría."}
          </p>

      {hasSuggestions && (
        <div className="mt-6">
          <p className="text-sm font-bold text-indigo-950 mb-3">
            {isEnglish ? "Did you mean...?" : "¿Quisiste decir...?"}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {uniqueSuggestions.map((suggestion) => (
  <button
    key={suggestion}
    type="button"
    onClick={() => onSuggestionClick(suggestion)}
    className="
      rounded-full
      bg-violet-100
      px-4
      py-2
      text-sm
      font-semibold
      text-indigo-950
      hover:bg-violet-200
      transition
    "
  >
    {getSuggestionLabel(suggestion)}
  </button>
))}
          </div>
        </div>
      )}
    </div>
  )}

      {hasBooks && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              language={language}
              onViewDetails={setSelectedBook}
            />
          ))}
        </div>
)}

      <BookDetailModal
        book={selectedBook}
        language={language}
        onClose={() => setSelectedBook(null)}
        onInterested={handleInterested}
        onAddToList={handleAddToList}
        onMoreOptions={handleMoreOptions}
        isSaved={isSelectedBookSaved}
      />

    </div>
  )
}

export default RecommendationsView