import { useState } from "react"

function BookDetailModal({
  book,
  language,
  onClose,
  onAddToList,
  onMoreOptions,
  isSaved
}) {
  const [feedbackMessage, setFeedbackMessage] = useState("")

  if (!book) return null

  const isEnglish = language === "English"

  const publicationYear = book.publicationYear || book.year
  const lrcSublocation = book.sublocation || book.collection || "N/A"
  const publisher = book.publisher
  const format = book.format
  const series = book.series
  const relatedSubjects = book.relatedSubjects || []
  const follettTags = book.follettTags || []

  const destinyUrl =
    book.destinyUrl ||
    "https://dc.abc.edu.sv/portal/portal?app=Destiny%20Discover"

  const summaryText = isEnglish
    ? book.summaryEn || book.summary
    : book.summaryEs || book.summary

  const availabilityText = book.available
    ? isEnglish
      ? "Available"
      : "Disponible"
    : isEnglish
      ? "Not available"
      : "No disponible"

  const handleOpenDestiny = () => {
    window.open(destinyUrl, "_blank", "noopener,noreferrer")
  }

  const handleInterestedClick = () => {
    if (book.available) {
      setFeedbackMessage(
        isEnglish
          ? `"${book.title}" is available. You can visit the LRC and ask for this book.`
          : `"${book.title}" está disponible. Puedes pasar al LRC y solicitar este libro.`
      )
    } else {
      setFeedbackMessage(
        isEnglish
          ? `"${book.title}" is not available right now. Check again in a few days or keep exploring.`
          : `"${book.title}" no está disponible por el momento. Consulta nuevamente dentro de algunos días o sigue explorando.`
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-5 text-slate-400 hover:text-slate-700 text-xl"
        >
          ×
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_1.4fr] gap-6">
          <div className="w-full md:w-40 h-56 bg-violet-100 rounded-2xl flex items-center justify-center text-6xl shrink-0 overflow-hidden">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{book.coverEmoji}</span>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-indigo-950 pr-8">
              {book.title}
            </h2>

            <p className="mt-1 text-slate-500">
              {book.author}
            </p>

            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold">
                  {isEnglish ? "Availability:" : "Disponibilidad:"}
                </span>{" "}
                <span
                  className={
                    book.available
                      ? "font-semibold text-emerald-700"
                      : "font-semibold text-rose-700"
                  }
                >
                  {availabilityText}
                </span>
              </p>

              {series && (
                <p>
                  <span className="font-semibold">
                    {isEnglish ? "Series:" : "Serie:"}
                  </span>{" "}
                  {series}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-indigo-950">
              {isEnglish ? "Overview" : "Resumen"}
            </h3>

            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {summaryText ||
                (isEnglish
                  ? "This book matches the reading preferences selected."
                  : "Este libro coincide con las preferencias seleccionadas.")}
            </p>

            <div className="mt-5">
              <h3 className="text-sm font-bold text-indigo-950">
                {isEnglish ? "Catalog details" : "Detalles del catálogo"}
              </h3>

              <div className="mt-2 space-y-1 text-sm text-slate-700">
                <p>
                  <span className="font-semibold">
                    {isEnglish ? "LRC sublocation:" : "Sublocation del LRC:"}
                  </span>{" "}
                  {lrcSublocation}
                </p>

                {book.callNumber && (
                  <p>
                    <span className="font-semibold">
                      Call number:
                    </span>{" "}
                    {book.callNumber}
                  </p>
                )}

                {book.isbn && (
                  <p>
                    <span className="font-semibold">
                      ISBN:
                    </span>{" "}
                    {book.isbn}
                  </p>
                )}

                {book.pages && (
                  <p>
                    <span className="font-semibold">
                      {isEnglish ? "Pages:" : "Páginas:"}
                    </span>{" "}
                    {book.pages}
                  </p>
                )}

                {publisher && (
                  <p>
                    <span className="font-semibold">
                      {isEnglish ? "Publisher:" : "Editorial:"}
                    </span>{" "}
                    {publisher}
                  </p>
                )}

                {publicationYear && (
                  <p>
                    <span className="font-semibold">
                      {isEnglish ? "Published:" : "Publicado:"}
                    </span>{" "}
                    {publicationYear}
                  </p>
                )}

                {format && (
                  <p>
                    <span className="font-semibold">
                      {isEnglish ? "Format:" : "Formato:"}
                    </span>{" "}
                    {format}
                  </p>
                )}
              </div>
            </div>

            {relatedSubjects.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-bold text-indigo-950">
                  {isEnglish ? "Related subjects" : "Temas relacionados"}
                </h3>

                <div className="mt-2 flex flex-wrap gap-2">
                  {relatedSubjects.map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-indigo-950"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {follettTags.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-bold text-indigo-950">
                  Follett tags
                </h3>

                <div className="mt-2 flex flex-wrap gap-2">
                  {follettTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {feedbackMessage && (
          <div className="mt-6 rounded-2xl bg-violet-100 px-5 py-4 text-sm font-semibold text-indigo-950">
            {feedbackMessage}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={handleInterestedClick}
            className="rounded-xl bg-indigo-950 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-900 transition"
          >
            {isEnglish ? "I'm interested" : "Me interesa"}
          </button>

          <button
            type="button"
            onClick={() => onAddToList(book)}
            disabled={isSaved}
            className={`
              rounded-xl
              border
              px-4
              py-3
              text-sm
              font-semibold
              transition
              ${isSaved
                ? "border-violet-200 bg-violet-100 text-indigo-950 cursor-not-allowed"
                : "border-indigo-950 bg-white text-indigo-950 hover:bg-violet-50"}
            `}
          >
            {isSaved
              ? isEnglish ? "Added to list" : "Agregado a lista"
              : isEnglish ? "Add to list" : "Agregar a lista"}
          </button>

          <button
            type="button"
            onClick={handleOpenDestiny}
            title={
              isEnglish
                ? "Open Destiny Discover to place a hold"
                : "Abre Destiny Discover para reservar el libro"
            }
            className="rounded-xl bg-violet-100 px-4 py-3 text-sm font-semibold text-indigo-950 hover:bg-violet-200 transition"
          >
            {isEnglish ? "Open in Destiny ↗" : "Abrir en Destiny ↗"}
          </button>

          <button
            type="button"
            onClick={onMoreOptions}
            className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
          >
            {isEnglish ? "See more books" : "Ver más libros"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookDetailModal