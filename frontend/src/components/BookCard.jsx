function BookCard({ book, language, onViewDetails }) {
  const isEnglish = language === "English"

  const publicationYear = book.publicationYear || book.year
  const collection = book.collection || book.sublocation
  const availabilityText = book.available
    ? isEnglish
      ? "Available"
      : "Disponible"
    : isEnglish
      ? "Not available"
      : "No disponible"

  return (
    <div className="bg-white border border-violet-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition">
      <div className="h-44 bg-violet-100 flex items-center justify-center text-5xl">
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

      <div className="p-5">
        <h3 className="text-lg font-bold text-indigo-950 leading-tight">
          {book.title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {book.author}
        </p>

        <div className="mt-4 space-y-1.5 text-sm text-slate-700">
          {publicationYear && (
            <p>
              <span className="font-semibold">
                {isEnglish ? "Year:" : "Año:"}
              </span>{" "}
              {publicationYear}
            </p>
          )}

          {collection && (
           <p>
              <span className="font-semibold">
                {isEnglish ? "LRC sublocation:" : "Sublocation del LRC:"}
              </span>{" "}
              {book.sublocation || book.collection || "N/A"}
          </p>
          )}

          {book.callNumber && (
            <p>
              <span className="font-semibold">
                Call number:
              </span>{" "}
              {book.callNumber}
            </p>
          )}

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
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(book)}
          className="mt-5 w-full rounded-xl bg-indigo-950 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-900 transition"
        >
          {isEnglish ? "View details" : "Ver detalles"}
        </button>
      </div>
    </div>
  )
}

export default BookCard