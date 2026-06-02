import RecommendationCard from "./RecommendationCard"

function MessageBubble({ msg }) {

  return (

    <div
      className={`flex mb-6 ${
        msg.sender === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >

      <div
        className={`
          px-5 py-4 rounded-2xl shadow-md
          ${
            msg.sender === "user"
              ? "max-w-xl"
              : "max-w-2xl"
          }
          ${
            msg.sender === "user"
              ? "bg-violet-600 text-white rounded-tr-sm"
              : "bg-violet-100 text-slate-800 rounded-tl-sm"
          }
        `}
      >

        <div
          className={`
            text-xs font-semibold mb-2
            ${
              msg.sender === "user"
                ? "text-violet-100"
                : "text-violet-700"
            }
          `}
        >
          {msg.sender === "user" ? "Tú" : "Asistente"}
        </div>

        <div className="whitespace-pre-line">
          {msg.text}
        </div>

        {msg.books?.length > 0 && (

          <div className="mt-4 space-y-4">

            {msg.books.map((book, index) => (

              <RecommendationCard
                key={index}
                book={book}
              />

            ))}

          </div>

        )}

      </div>

    </div>

  )

}

export default MessageBubble