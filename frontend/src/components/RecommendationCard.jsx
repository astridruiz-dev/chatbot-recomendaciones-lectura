function RecommendationCard({ book }) {

  return (

    <div
      className="
        bg-white
        border border-violet-200
        rounded-2xl
        p-5
        shadow-md
        hover:shadow-lg
        transition
      "
    >

      <div className="flex justify-between items-start">

        <div>

          <h3 className="font-bold text-lg text-slate-800">
            📚 {book.title}
          </h3>

          <p className="text-slate-600">
            {book.author}
          </p>

        </div>

        <div
          className="
            bg-violet-100
            text-violet-700
            text-xs
            font-semibold
            px-3
            py-1
            rounded-full
          "
        >
          ⭐ {book.score}
        </div>

      </div>

      <div className="mt-4">

        <span
          className="
            inline-block
            bg-slate-100
            text-slate-700
            text-xs
            px-3
            py-1
            rounded-full
          "
        >
          📖 {book.reading_level}
        </span>

      </div>

      <div className="flex flex-wrap gap-2 mt-4">

        {book.themes.map((theme, index) => (

          <span
            key={index}
            className="
              bg-violet-50
              text-violet-700
              text-xs
              px-3
              py-1
              rounded-full
            "
          >
            {theme}
          </span>

        ))}

      </div>

    </div>

  )

}

export default RecommendationCard