import { useState } from "react"
import BookCard from "./BookCard"
import BookDetailModal from "./BookDetailModal"

function RecommendationsView({ language, books, context, onBack, onMoreOptions }) {
  const isEnglish = language === "English"

  const title = context?.title || (isEnglish ? "Recommended books" : "Libros recomendados")

  const description = context?.description || (
  isEnglish
    ? "Here are three options based on your choices."
    : "Aquí tienes tres opciones según tus elecciones."
  )

  const suggestions = context?.suggestions || []
  const hasBooks = books.length > 0
  const hasSuggestions = suggestions.length > 0

  const [selectedBook, setSelectedBook] = useState(null)
  const [readingList, setReadingList] = useState([])
  const [statusMessage, setStatusMessage] = useState("")

  function handleAddToList(book) {
    const alreadySaved = readingList.some(
      (savedBook) => savedBook.id === book.id
    )

    if (alreadySaved) return

    setReadingList((prev) => [...prev, book])

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
    ? readingList.some((book) => book.id === selectedBook.id)
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

        <p className="mt-2 text-sm text-indigo-700 font-semibold">
          {isEnglish
            ? readingList.length === 1
              ? "1 book in your reading list"
              : `${readingList.length} books in your reading list`
            : readingList.length === 1
              ? "1 libro en tu lista de lectura"
              : `${readingList.length} libros en tu lista de lectura`}
        </p>
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
            {suggestions.map((suggestion) => (
              <span
                key={suggestion}
                className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-indigo-950"
              >
                {suggestion}
              </span>
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