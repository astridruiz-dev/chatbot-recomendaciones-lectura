import { useEffect, useRef } from "react"

function ProfileView({
  language,
  user,
  readingList,
  favoriteCategories,
  onBack,
  onViewBook,
  onRemoveBook,
  focusSection,
  onLogout
}) {
  
  const isEnglish = language === "English"
  const isStaff = user?.is_staff
  const safeReadingList = readingList || []
  const safeFavoriteCategories = favoriteCategories || []
  const readingListSectionRef = useRef(null)

useEffect(() => {
  if (focusSection === "reading-list" && readingListSectionRef.current) {
    readingListSectionRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }
}, [focusSection])

  const gradeText = isStaff
    ? isEnglish
      ? "ABC Staff"
      : "Personal ABC"
    : isEnglish
      ? `Grade ${user?.grade}`
      : `${user?.grade}.º grado`

  return (
  <div className="w-full max-w-6xl mx-auto">
    <div className="mb-4">
  <button
    type="button"
    onClick={onBack}
    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-violet-100 hover:text-indigo-950 transition"
  >
    <span aria-hidden="true">←</span>
    {isEnglish ? "Back to main menu" : "Volver al menú principal"}
  </button>


<button
  type="button"
  onClick={onLogout}
  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 transition"
>
  {isEnglish ? "Log out" : "Cerrar sesión"}
</button>

    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-slate-800">
        {isEnglish ? "My profile" : "Mi perfil"}
      </h2>

        <p className="mt-3 text-slate-500">
          {isEnglish
            ? "Review your reading list and recent interests."
            : "Revisa tu lista de lectura e intereses recientes."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-indigo-950">
            {isEnglish ? "User" : "Usuario"}
          </h3>

          <p className="mt-3 text-sm text-slate-500">
            {user?.email}
          </p>

          <p className="mt-2 inline-flex rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-indigo-950">
            {gradeText}
          </p>
        </div>

        <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-indigo-950">
            {isEnglish ? "Reading list" : "Lista de lectura"}
          </h3>

          <p className="mt-3 text-3xl font-bold text-indigo-950">
            {safeReadingList.length}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {isEnglish
              ? safeReadingList.length === 1
                ? "saved book"
                : "saved books"
              : safeReadingList.length === 1
                ? "libro guardado"
                : "libros guardados"}
          </p>
        </div>

        <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-indigo-950">
            {isEnglish ? "Recent interests" : "Intereses recientes"}
          </h3>

          {safeFavoriteCategories.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              {isEnglish
                ? "No interests saved yet."
                : "Aún no hay intereses guardados."}
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {safeFavoriteCategories.slice(0, 3).map((category) => (
                <span
                  key={category.apiCategory || category.title}
                  className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-indigo-950"
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
  ref={readingListSectionRef}
  className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm"
>
  <h3 className="text-xl font-bold text-indigo-950">
    {isEnglish ? "My reading list" : "Mi lista de lectura"}
  </h3>

        {safeReadingList.length === 0 ? (
          <p className="mt-4 text-slate-500">
            {isEnglish
              ? "You have not saved any books yet. Explore recommendations and add books to your list."
              : "Todavía no has guardado libros. Explora recomendaciones y agrega libros a tu lista."}
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            
{safeReadingList.map((book) => (
  <div
    key={book.id}
    className="rounded-2xl border border-violet-100 bg-violet-50 p-5"
  >
    <h4 className="text-lg font-bold text-indigo-950">
      {book.title}
    </h4>

    <p className="mt-1 text-sm text-slate-600">
      {book.author}
    </p>

    <p className="mt-3 text-sm text-slate-700">
      {isEnglish ? "Pages:" : "Páginas:"} {book.pages}
    </p>

    {book.sublocation && (
      <p className="mt-1 text-sm text-slate-700">
        Sublocation del LRC: {book.sublocation}
      </p>
    )}

    <p className="mt-1 text-sm text-slate-700">
      {isEnglish ? "Availability:" : "Disponibilidad:"}{" "}
      {book.available
        ? isEnglish
          ? "Available"
          : "Disponible"
        : isEnglish
          ? "Not available"
          : "No disponible"}
    </p>

    <div className="mt-4 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => onViewBook(book)}
        className="rounded-xl bg-indigo-950 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 transition"
      >
        {isEnglish ? "View details" : "Ver detalles"}
      </button>

      <button
        type="button"
        onClick={() => onRemoveBook(book.id)}
        className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 transition"
      >
        {isEnglish ? "Remove" : "Quitar"}
      </button>
    </div>
  </div>
))}

          </div>
        )}
      </div>
    </div>
    </div>
  )
}

export default ProfileView