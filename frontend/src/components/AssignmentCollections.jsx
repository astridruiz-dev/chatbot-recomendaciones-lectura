import { useMemo, useState } from "react"

function AssignmentCollections({
  language,
  user,
  onBack,
  onStartCollectionSearch
}) {
  const isEnglish = language === "English"
  const isStaff = user?.is_staff

  const [searchText, setSearchText] = useState("")

  const collectionGroups = [
    {
      id: "history-society",
      title: isEnglish ? "History and society" : "Historia y sociedad",
      collections: [
        { name: "Black History", icon: "✊🏾" },
        { name: "World War I", icon: "🪖" },
        { name: "World War II", icon: "🌍" },
        { name: "Women’s History", icon: "👩🏽‍🏫" },
        { name: "LRC El Salvador Collection", icon: "🇸🇻" },
        { name: "LRC Biographies", icon: "👤" }
      ]
    },
    {
      id: "languages-literature",
      title: isEnglish ? "Languages and literature" : "Idiomas y literatura",
      collections: [
        { name: "LRC French Collection", icon: "🇫🇷" },
        { name: "World Languages", icon: "🗣️" },
        { name: "LRC Spanish Fiction", icon: "📗" },
        { name: "LRC English Fiction", icon: "📘" },
        { name: "LRC Graphic Collection", icon: "💬" },
        { name: "LRC Audiobooks", icon: "🎧" }
      ]
    },
    {
      id: "research-nonfiction",
      title: isEnglish ? "Research and nonfiction" : "Investigación y no ficción",
      collections: [
        { name: "LRC General Non fiction", icon: "📖" },
        { name: "LRC NONFICTION SPANISH", icon: "📕" },
        { name: "LRC Reference", icon: "🔎" },
        { name: "LRC TOK", icon: "🧠" },
        { name: "Textbook", icon: "📚" }
      ]
    },
    {
      id: "technology-creation",
      title: isEnglish ? "Technology and creation" : "Tecnología y creación",
      collections: [
        { name: "Technology", icon: "💻" },
        { name: "ICT", icon: "🧑‍💻" },
        { name: "ITGS/Film", icon: "🎥" },
        { name: "LRC MakerSpace", icon: "🛠️" },
        { name: "LRC Lab", icon: "🧪" },
        { name: "LRC Studio", icon: "🎬" }
      ]
    },
    {
      id: "support-services",
      title: isEnglish ? "Support and LRC areas" : "Apoyo y áreas del LRC",
      collections: [
        { name: "Social Emotional Support", icon: "💛" },
        { name: "LRC", icon: "🏫" },
        { name: "LRC Circulation Desk", icon: "🏷️" },
        { name: "LRC Cuatro gavetas", icon: "🗄️" },
        { name: "LRC Pulled for Review", icon: "📦" }
      ]
    }
  ]

  const staffOnlyCollections = [
    { name: "LRC Teacher's Section", icon: "👩‍🏫" }
  ]

  const visibleGroups = useMemo(() => {
    const groups = isStaff
      ? [
          ...collectionGroups,
          {
            id: "staff-only",
            title: isEnglish ? "Staff collection" : "Colección para personal",
            collections: staffOnlyCollections
          }
        ]
      : collectionGroups

    const normalizedSearch = searchText.trim().toLowerCase()

    if (!normalizedSearch) {
      return groups
    }

    return groups
      .map((group) => ({
        ...group,
        collections: group.collections.filter((collection) =>
          collection.name.toLowerCase().includes(normalizedSearch)
        )
      }))
      .filter((group) => group.collections.length > 0)
  }, [searchText, isStaff, isEnglish])

  function createCollectionId(name) {
    return name
      .toLowerCase()
      .replaceAll(" ", "-")
      .replaceAll("/", "-")
      .replaceAll("’", "")
      .replaceAll("'", "")
  }

  function handleSelectCollection(collection) {
    onStartCollectionSearch({
      route: isStaff ? "lrc-collections" : "assignment",
      collectionId: createCollectionId(collection.name),
      collectionTitle: collection.name,
      query: collection.name,
      sublocation: collection.name,
      isStaff
    })
  }

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
          {isStaff
            ? isEnglish
              ? "Explore LRC collections"
              : "Explorar colecciones del LRC"
            : isEnglish
              ? "Work on an assignment"
              : "Hacer una tarea"}
        </h2>

        <p className="mt-3 text-slate-500">
          {isStaff
            ? isEnglish
              ? "Select an LRC sublocation or academic collection to explore resources."
              : "Selecciona una sublocation o colección académica del LRC para explorar recursos."
            : isEnglish
              ? "Choose an LRC collection to find useful resources for schoolwork."
              : "Elige una colección del LRC para encontrar recursos útiles para tus tareas escolares."}
        </p>
      </div>

      <div className="mb-8 rounded-3xl border border-violet-100 bg-white p-5 shadow-sm">
        <label className="block text-sm font-bold text-indigo-950 mb-3">
          {isEnglish ? "Search collection" : "Buscar colección"}
        </label>

        <input
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder={
            isEnglish
              ? "Example: Spanish, World War, Graphic, Teacher..."
              : "Ejemplo: Spanish, World War, Graphic, Teacher..."
          }
          className="w-full rounded-2xl border border-violet-100 px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      {visibleGroups.length === 0 ? (
        <div className="rounded-3xl border border-violet-100 bg-white p-8 text-center shadow-sm">
          <p className="font-semibold text-indigo-950">
            {isEnglish
              ? "No collections found."
              : "No se encontraron colecciones."}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            {isEnglish
              ? "Try another keyword."
              : "Prueba con otra palabra clave."}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {visibleGroups.map((group) => (
            <section key={group.id}>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-indigo-950">
                  {group.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.collections.map((collection) => (
                  <button
                    key={collection.name}
                    type="button"
                    onClick={() => handleSelectCollection(collection)}
                    className="
                      text-left
                      bg-white
                      border
                      border-violet-100
                      rounded-2xl
                      p-5
                      min-h-[150px]
                      shadow-sm
                      hover:shadow-lg
                      hover:-translate-y-1
                      transition
                    "
                  >
                    <div className="text-3xl mb-4">
                      {collection.icon}
                    </div>

                    <h4 className="font-bold text-indigo-950">
                      {collection.name}
                    </h4>

                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                      {isEnglish
                        ? "Explore resources from this LRC sublocation."
                        : "Explora recursos de esta sublocation del LRC."}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

    </div>
  )
}

export default AssignmentCollections