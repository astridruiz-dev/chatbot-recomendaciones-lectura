function SurpriseMe({
  language,
  favoriteCategories,
  onBack,
  onStartSurprise
}) {
  const isEnglish = language === "English"

  const hasInterests = favoriteCategories.length > 0

  const selectedInterest = hasInterests
  ? favoriteCategories[0].title
  : null

  return (
    <div className="w-full max-w-4xl mx-auto">

      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm font-semibold text-indigo-700 hover:text-indigo-950"
      >
        ← {isEnglish ? "Back to options" : "Volver a opciones"}
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">
          {isEnglish ? "Surprise me" : "Sorpréndeme"}
        </h2>

        <p className="mt-3 text-slate-500">
          {isEnglish
            ? "Choose how you want the assistant to surprise you."
            : "Elige cómo quieres que el asistente te sorprenda."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <button
          type="button"
          onClick={() => onStartSurprise("based-on-interests")}
          disabled={!hasInterests}
          className={`
            text-left
            bg-white
            border
            border-violet-100
            rounded-2xl
            p-6
            min-h-[180px]
            shadow-sm
            hover:shadow-lg
            transition
            ${!hasInterests ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-1"}
          `}
        >
          <div className="text-4xl mb-4">
            ⭐
          </div>

          <h3 className="text-xl font-bold text-indigo-950">
            {isEnglish ? "Based on my interests" : "Basado en mis intereses"}
          </h3>

          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          {hasInterests
            ? isEnglish
              ? "Use your recent interests to suggest something new."
              : "Usa tus intereses recientes para sugerir algo nuevo."
            : isEnglish
              ? "Choose some interests first in Independent reading."
              : "Primero elige algunos intereses en Lectura independiente."}
        </p>

        {selectedInterest && (
          <p className="mt-4 rounded-xl bg-violet-50 px-3 py-2 text-sm font-semibold text-indigo-950">
            {isEnglish ? "Based on:" : "Basado en:"} {selectedInterest}
          </p>
        )}
        </button>

        <button
          type="button"
          onClick={() => onStartSurprise("something-new")}
          className="
            text-left
            bg-white
            border
            border-violet-100
            rounded-2xl
            p-6
            min-h-[180px]
            shadow-sm
            hover:shadow-lg
            hover:-translate-y-1
            transition
          "
        >
          <div className="text-4xl mb-4">
            🎲
          </div>

          <h3 className="text-xl font-bold text-indigo-950">
            {isEnglish ? "Something completely new" : "Algo completamente nuevo"}
          </h3>

          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            {isEnglish
              ? "Explore a book outside your usual choices."
              : "Explora un libro fuera de tus elecciones habituales."}
          </p>
        </button>

      </div>

    </div>
  )
}

export default SurpriseMe