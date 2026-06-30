function RouteMenu({ language, user, favoriteCategories, onSelectRoute }) {
  const isEnglish = language === "English"
  const isStaff = user?.is_staff

  const gradeText = isStaff
    ? isEnglish
      ? "ABC Staff"
      : "Personal ABC"
    : isEnglish
      ? `Grade ${user?.grade}`
      : `${user?.grade}.º grado`

  const texts = {
    title: isEnglish
      ? "What would you like to do today?"
      : "¿Qué deseas hacer hoy?",

    subtitle: isEnglish
      ? `Options for ${gradeText}`
      : `Opciones disponibles para ${gradeText}`,

    knownSearch: isEnglish
      ? "I know what I’m looking for"
      : "Ya sé qué busco",

    independentReading: isEnglish
      ? "Independent reading"
      : "Lectura independiente",

    assignment: isStaff
      ? isEnglish
        ? "Explore LRC collections"
        : "Explorar colecciones del LRC"
      : isEnglish
        ? "Work on an assignment"
        : "Hacer una tarea",

    surprise: isEnglish
      ? "Surprise me"
      : "Sorpréndeme",

    popular: isEnglish
      ? "Most read by students in your grade"
      : "Más leído por estudiantes de tu grado"
  }

  const routes = [
    {
      id: "known-search",
      icon: "🔍",
      title: texts.knownSearch,
      description: isEnglish
        ? "Search by title, author, topic, or keyword."
        : "Busca por título, autor, tema o palabra clave."
    },
    {
      id: "independent-reading",
      icon: "📖",
      title: texts.independentReading,
      description: isEnglish
        ? "Find books based on your interests."
        : "Encuentra libros según tus intereses."
    },
    {
      id: "assignment",
      icon: "📝",
      title: texts.assignment,
      description: isStaff
        ? isEnglish
          ? "Browse library collections and academic resources."
          : "Consulta colecciones y recursos académicos de la biblioteca."
        : isEnglish
          ? "Find resources for school tasks."
          : "Encuentra recursos para tareas escolares."
    },
    {
      id: "surprise",
      icon: "🎲",
      title: texts.surprise,
      description: isEnglish
        ? "Discover something unexpected."
        : "Descubre algo inesperado."
    }
  ]

  if (!isStaff) {
    routes.push({
      id: "popular-grade",
      icon: "🏆",
      title: texts.popular,
      description: isEnglish
        ? "See what other students in your grade are reading."
        : "Mira qué están leyendo otros estudiantes de tu grado."
    })
  }

  const topCategories = [...(favoriteCategories || [])]
  .sort((a, b) => b.count - a.count)
  .slice(0, 3)

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-5xl">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            {texts.title}
          </h2>

          <p className="mt-3 text-slate-500">
            {texts.subtitle}
          </p>
  
         {topCategories.length > 0 && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <span className="text-sm font-semibold text-indigo-950">
            {isEnglish ? "Recent interests:" : "Intereses recientes:"}
          </span>

          {topCategories.map((category) => (
            <span
              key={category.title}
              className="rounded-full bg-violet-100 px-3 py-1 text-sm text-indigo-950"
            >
              {category.title}
            </span>
          ))}
        </div>
      )}
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {routes.map((route) => (
            <button
              key={route.id}
              type="button"
              onClick={() => onSelectRoute(route.id)}
              className={`
                text-left
                bg-white
                border
                border-violet-100
                rounded-2xl
                p-5
                min-h-[135px]
                shadow-sm
                hover:shadow-lg
                hover:-translate-y-1
                transition
                ${route.id === "popular-grade" ? "md:col-span-2 md:max-w-xl md:mx-auto md:w-full" : ""}
              `}
            >
              <div className="text-3xl mb-3">
                {route.icon}
              </div>

              <h3 className="text-lg font-bold text-indigo-950">
                {route.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                {route.description}
              </p>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}

export default RouteMenu