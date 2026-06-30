import { useState } from "react"

function KnownSearch({ language, onBack, onStartSearch }) {
  const isEnglish = language === "English"

  const [searchType, setSearchType] = useState("keyword")
  const [searchText, setSearchText] = useState("")

  const searchOptions = [
    {
      id: "title",
      icon: "📘",
      title: isEnglish ? "Title" : "Título",
      description: isEnglish
        ? "Search for a specific book title."
        : "Busca el título específico de un libro."
    },
    {
      id: "author",
      icon: "✍️",
      title: isEnglish ? "Author" : "Autor",
      description: isEnglish
        ? "Search books by an author."
        : "Busca libros por autor."
    },
    {
      id: "topic",
      icon: "🧠",
      title: isEnglish ? "Topic" : "Tema",
      description: isEnglish
        ? "Search by subject or theme."
        : "Busca por materia o tema."
    },
    {
      id: "keyword",
      icon: "💬",
      title: isEnglish ? "Keyword" : "Palabra clave",
      description: isEnglish
        ? "Use a phrase like “books about dragons”."
        : "Usa una frase como “libros sobre dragones”."
    }
  ]

  const selectedOption = searchOptions.find(
    (option) => option.id === searchType
  )

  function handleSubmit(event) {
    event.preventDefault()

    if (!searchText.trim()) return

    onStartSearch({
      route: "known-search",
      searchType,
      searchTypeTitle: selectedOption.title,
      query: searchText.trim()
    })
  }

  return (
    <div className="w-full max-w-5xl mx-auto">

      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm font-semibold text-indigo-700 hover:text-indigo-950"
      >
        ← {isEnglish ? "Back to options" : "Volver a opciones"}
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">
          {isEnglish ? "I know what I’m looking for" : "Ya sé qué busco"}
        </h2>

        <p className="mt-3 text-slate-500">
          {isEnglish
            ? "Choose how you want to search the library."
            : "Elige cómo quieres buscar en la biblioteca."}
        </p>
      </div>

      <section>
        <h3 className="text-lg font-bold text-indigo-950 mb-4">
          {isEnglish ? "Search by" : "Buscar por"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {searchOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSearchType(option.id)}
              className={`
                text-left
                bg-white
                border
                rounded-2xl
                p-4
                min-h-[145px]
                shadow-sm
                hover:shadow-md
                transition
                ${searchType === option.id
                  ? "border-indigo-700 ring-2 ring-indigo-200"
                  : "border-violet-100"}
              `}
            >
              <div className="text-3xl mb-3">
                {option.icon}
              </div>

              <h4 className="font-bold text-indigo-950">
                {option.title}
              </h4>

              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                {option.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      <form onSubmit={handleSubmit} className="mt-8 bg-white rounded-3xl border border-violet-100 shadow-sm p-6">

        <label className="block text-sm font-bold text-indigo-950 mb-3">
          {isEnglish
            ? `Enter ${selectedOption.title.toLowerCase()}`
            : `Escribe ${selectedOption.title.toLowerCase()}`}
        </label>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder={
              isEnglish
                ? "Example: graphic novels about friendship"
                : "Ejemplo: novelas gráficas sobre amistad"
            }
            className="flex-1 rounded-2xl border border-violet-100 px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
          />

          <button
            type="submit"
            disabled={!searchText.trim()}
            className="
              rounded-2xl
              bg-indigo-950
              px-8
              py-3
              font-semibold
              text-white
              shadow-md
              hover:bg-indigo-900
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            {isEnglish ? "Search" : "Buscar"}
          </button>
        </div>

      </form>

    </div>
  )
}

export default KnownSearch