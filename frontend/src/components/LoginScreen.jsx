import { useState } from "react"
import { GoogleLogin } from "@react-oauth/google"
import { googleLogin } from "../services/userService"

function LoginScreen({ onLogin }) {
  const [language, setLanguage] = useState("Spanish")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleGoogleSuccess(credentialResponse) {
    setError("")
    setLoading(true)

    try {
      const user = await googleLogin(
        credentialResponse.credential,
        language
      )

      onLogin(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleGoogleError() {
    setError("No se pudo iniciar sesión con Google.")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F3FF] px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-violet-100">

        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-950">
            ABC LRC
          </h1>

          <p className="mt-3 text-slate-600">
            Asistente de descubrimiento de libros
          </p>
        </div>

        <div className="mt-8">
          <p className="text-sm font-medium text-slate-700 mb-3">
            ¿En qué idioma quieres buscar hoy?
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setLanguage("English")}
              className={`rounded-xl border px-4 py-3 font-semibold ${
                language === "English"
                  ? "bg-indigo-950 text-white"
                  : "bg-white text-slate-700"
              }`}
            >
              English
            </button>

            <button
              type="button"
              onClick={() => setLanguage("Spanish")}
              className={`rounded-xl border px-4 py-3 font-semibold ${
                language === "Spanish"
                  ? "bg-indigo-950 text-white"
                  : "bg-white text-slate-700"
              }`}
            >
              Español
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="continue_with"
            shape="pill"
            size="large"
          />
        </div>

        {loading && (
          <p className="mt-4 text-center text-sm text-slate-500">
            Validando cuenta institucional...
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          Solo cuentas institucionales @abc-net.edu.sv
        </p>

      </div>
    </div>
  )
}

export default LoginScreen