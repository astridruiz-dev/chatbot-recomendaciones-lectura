function BookCard({ book, language, onViewDetails }) {
  const isEnglish = language === "English"

  return (
    <div className="bg-white border border-violet-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition">

      <div className="h-44 bg-violet-100 flex items-center justify-center text-5xl">
        {book.coverEmoji}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-indigo-950">
          {book.title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {book.author}
        </p>

        <div className="mt-4 space-y-1 text-sm text-slate-600">
          <p>
            <span className="font-semibold">
              {isEnglish ? "Pages:" : "Páginas:"}
            </span>{" "}
            {book.pages}
          </p>
            {book.sublocation && (
              <p>
                <span className="font-semibold">
                  {isEnglish ? "LRC sublocation:" : "Sublocation del LRC:"}
                </span>{" "}
                {book.sublocation}
              </p>
            )}
          <p>
            <span className="font-semibold">
              {isEnglish ? "Availability:" : "Disponibilidad:"}
            </span>{" "}
            {book.available
              ? isEnglish ? "Available" : "Disponible"
              : isEnglish ? "Not available" : "No disponible"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(book)}
          className="mt-5 w-full rounded-xl bg-indigo-950 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-900"
        >
          {isEnglish ? "View details" : "Ver detalles"}
        </button>
      </div>

    </div>
  )
}

export default BookCard