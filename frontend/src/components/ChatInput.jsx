function ChatInput({
  message,
  setMessage,
  sendMessage,
  placeholder,
  buttonText
}) {

  return (

    <div className="mt-6 flex gap-4">

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage()
          }
        }}
        type="text"
        placeholder={placeholder}
        className="
          flex-1
          bg-[#F5F3FF]
          border border-slate-200
          rounded-2xl
          px-5
          py-4
          text-slate-700
          placeholder-slate-400
          focus:outline-none
          focus:ring-2
          focus:ring-violet-500
        "
      />

      <button
        onClick={sendMessage}
        className="
          bg-indigo-900
          hover:bg-indigo-950
          text-white
          font-medium
          px-8
          rounded-2xl
          shadow-md
          transition
        "
      >
        {buttonText}
      </button>

    </div>

  )

}

export default ChatInput