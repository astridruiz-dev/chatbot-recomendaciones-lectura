import { useState } from "react"

function IndependentReading({ language, user, onBack, onStartRecommendations }) {
  const isEnglish = language === "English"

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedLength, setSelectedLength] = useState(null)

  const categories = [
  {
    id: "mystery",
    icon: "🕵️",
    apiCategory: "Resolver un misterio",
    title: isEnglish ? "Solve a mystery" : "Resolver un misterio",
    description: isEnglish
      ? "Secrets, clues, investigations, and unexpected endings."
      : "Secretos, pistas, investigaciones y finales inesperados."
  },
  {
    id: "fantasy",
    icon: "🐉",
    apiCategory: "Fantasía y magia",
    title: isEnglish ? "Fantasy and magic" : "Fantasía y magia",
    description: isEnglish
      ? "Magic worlds, creatures, quests, and adventure."
      : "Mundos mágicos, criaturas, misiones y aventura."
  },
  {
    id: "science-fiction",
    icon: "🚀",
    apiCategory: "Explorar otros mundos",
    title: isEnglish ? "Explore other worlds" : "Explorar otros mundos",
    description: isEnglish
      ? "Technology, space, futures, and big ideas."
      : "Tecnología, espacio, futuros posibles y grandes ideas."
  },
  {
    id: "adventure",
    icon: "🧭",
    apiCategory: "Aventura y acción",
    title: isEnglish ? "Adventure and action" : "Aventura y acción",
    description: isEnglish
      ? "Fast-paced stories with journeys, danger, and challenges."
      : "Historias ágiles con viajes, peligros y desafíos."
  },
  {
    id: "historical-fiction",
    icon: "🏛️",
    apiCategory: "Eventos del pasado",
    title: isEnglish ? "Events from the past" : "Eventos del pasado",
    description: isEnglish
      ? "Stories connected to historical moments and places."
      : "Historias relacionadas con momentos y lugares históricos."
  },
  {
    id: "sports",
    icon: "🏀",
    apiCategory: "Deportes y competencia",
    title: isEnglish ? "Sports and competition" : "Deportes y competencia",
    description: isEnglish
      ? "Teams, goals, effort, rivalry, and personal growth."
      : "Equipos, metas, esfuerzo, rivalidad y superación."
  },
  {
    id: "graphic-novel",
    icon: "💬",
    apiCategory: "Novelas gráficas",
    title: isEnglish ? "Graphic novels" : "Novelas gráficas",
    description: isEnglish
      ? "Stories told with panels, dialogue, and visual sequences."
      : "Historias contadas con viñetas, diálogo y secuencias visuales."
  },
  {
    id: "dystopia",
    icon: "👁️",
    apiCategory: "Sociedades vigiladas",
    title: isEnglish ? "Controlled societies" : "Sociedades vigiladas",
    description: isEnglish
      ? "Rules, surveillance, rebellion, and uncertain futures."
      : "Reglas, vigilancia, rebelión y futuros inciertos."
  },
  {
    id: "romance",
    icon: "❤️",
    apiCategory: "Amor y emociones",
    title: isEnglish ? "Love and emotions" : "Amor y emociones",
    description: isEnglish
      ? "Relationships, feelings, friendship, and personal choices."
      : "Relaciones, sentimientos, amistad y decisiones personales."
  },
  {
    id: "horror",
    icon: "🧛",
    apiCategory: "Horror y suspenso",
    title: isEnglish ? "Horror and suspense" : "Horror y suspenso",
    description: isEnglish
      ? "Dark places, fear, mystery, and tense moments."
      : "Lugares oscuros, miedo, misterio y momentos de tensión."
  }
]

  const lengths = [
  {
    id: "short",
    apiLength: "Corto",
    title: isEnglish ? "Short" : "Corto",
    description: isEnglish
      ? "100 pages or fewer."
      : "100 páginas o menos."
  },
  {
    id: "medium",
    apiLength: "Medio",
    title: isEnglish ? "Medium" : "Medio",
    description: isEnglish
      ? "101 to 200 pages."
      : "101 a 200 páginas."
  },
  {
    id: "long",
    apiLength: "Largo",
    title: isEnglish ? "Long" : "Largo",
    description: isEnglish
      ? "More than 200 pages."
      : "Más de 200 páginas."
  }
]

  function handleContinue() {
  if (!selectedCategory || !selectedLength) return

  const category = categories.find(
    (item) => item.id === selectedCategory
  )

  const length = lengths.find(
    (item) => item.id === selectedLength
  )

  onStartRecommendations({
  route: "independent-reading",
  category: selectedCategory,
  categoryTitle: category.title,
  apiCategory: category.apiCategory,
  length: selectedLength,
  lengthTitle: length.title,
  apiLength: length.apiLength,
  lengthDescription: length.description,
  grade: user?.grade,
  is_staff: user?.is_staff
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
          {isEnglish
            ? "What would you like to read?"
            : "¿Qué te gustaría leer?"}
        </h2>

        <p className="mt-3 text-slate-500">
          {isEnglish
            ? "Choose a type of story and how long you want it to be."
            : "Elige un tipo de historia y la extensión que prefieres."}
        </p>
      </div>

      <section>
        <h3 className="text-lg font-bold text-indigo-950 mb-4">
          {isEnglish ? "Choose an interest" : "Elige un interés"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`
                text-left
                bg-white
                border
                rounded-2xl
                p-4
                min-h-[150px]
                shadow-sm
                hover:shadow-md
                transition
                ${selectedCategory === category.id
                  ? "border-indigo-700 ring-2 ring-indigo-200"
                  : "border-violet-100"}
              `}
            >
              <div className="text-3xl mb-3">
                {category.icon}
              </div>

              <h4 className="font-bold text-indigo-950">
                {category.title}
              </h4>

              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                {category.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-bold text-indigo-950 mb-4">
          {isEnglish ? "Choose length" : "Elige extensión"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lengths.map((length) => (
            <button
              key={length.id}
              type="button"
              onClick={() => setSelectedLength(length.id)}
              className={`
                text-left
                bg-white
                border
                rounded-2xl
                p-4
                shadow-sm
                hover:shadow-md
                transition
                ${selectedLength === length.id
                  ? "border-indigo-700 ring-2 ring-indigo-200"
                  : "border-violet-100"}
              `}
            >
              <h4 className="font-bold text-indigo-950">
                {length.title}
              </h4>

              <p className="mt-2 text-sm text-slate-500">
                {length.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedCategory || !selectedLength}
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
          {isEnglish ? "See recommendations" : "Ver recomendaciones"}
        </button>
      </div>

    </div>
  )
}

export default IndependentReading