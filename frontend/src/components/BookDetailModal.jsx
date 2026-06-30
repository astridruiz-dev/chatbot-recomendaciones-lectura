function BookDetailModal({
  book,
  language,
  onClose,
  onInterested,
  onAddToList,
  isSaved
}) {
  if (!book) return null

  const isEnglish = language === "English"

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">

      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 relative">

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-5 text-slate-400 hover:text-slate-700 text-xl"
        >
          ×
        </button>

        <div className="flex gap-6">

          <div className="w-36 h-52 bg-violet-100 rounded-2xl flex items-center justify-center text-6xl shrink-0">
            {book.coverEmoji}
          </div>

          <div className="flex-1">

            <h2 className="text-2xl font-bold text-indigo-950">
              {book.title}
            </h2>

            <p className="mt-1 text-slate-500">
              {book.author}
            </p>

            <div className="mt-5 space-y-2 text-sm text-slate-700">

              <p>
                <span className="font-semibold">
                  {isEnglish ? "Year:" : "Año:"}
                </span>{" "}
                {book.year || "2024"}
              </p>

              <p>
                <span className="font-semibold">
                  {isEnglish ? "Genre:" : "Género:"}
                </span>{" "}
                {book.genre}
              </p>

              <p>
                <span className="font-semibold">
                  {isEnglish ? "Pages:" : "Páginas:"}
                </span>{" "}
                {book.pages}
              </p>

              <p>
                <span className="font-semibold">
                  {isEnglish ? "Availability:" : "Disponibilidad:"}
                </span>{" "}
                {book.available
                  ? isEnglish ? "Available" : "Disponible"
                  : isEnglish ? "Not available" : "No disponible"}
              </p>

              <p>
                <span className="font-semibold">
                  {isEnglish ? "Location:" : "Ubicación:"}
                </span>{" "}
                {book.location || (isEnglish ? "LRC shelves" : "Estantería del LRC")}
              </p>

            </div>

            <p className="mt-5 text-sm text-slate-600 leading-relaxed">
              {book.summary ||
                (isEnglish
                  ? "This book matches the reading preferences selected."
                  : "Este libro coincide con las preferencias seleccionadas.")}
            </p>

          </div>

        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">

          <button
            type="button"
            onClick={() => onInterested(book)}
            className="rounded-xl bg-indigo-950 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-900"
          >
            {isEnglish ? "I want this book" : "Me interesa este libro"}
          </button>

          <button
            type="button"
            onClick={() => onAddToList(book)}
            disabled={isSaved}
            className={`
              rounded-xl
              px-4
              py-3
              text-sm
              font-semibold
              ${isSaved
                ? "bg-violet-100 text-indigo-950 cursor-not-allowed"
                : "bg-white border border-indigo-950 text-indigo-950 hover:bg-violet-50"}
            `}
          >
            {isSaved
              ? isEnglish ? "Added to my list" : "Agregado a mi lista"
              : isEnglish ? "Add to my list" : "Agregar a mi lista"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-violet-100 px-4 py-3 text-sm font-semibold text-indigo-950 hover:bg-violet-200"
          >
            {isEnglish ? "See more options" : "Ver más opciones"}
          </button>

        </div>

      </div>

    </div>
  )
}

export default BookDetailModal