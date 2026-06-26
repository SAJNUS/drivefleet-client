import { Link } from 'react-router-dom'
import { FiHome } from 'react-icons/fi'

function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-3xl font-bold tracking-tight text-blue-600">
          404
        </div>
        <h1 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
          Page Not Found
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-slate-500">
          Oops! The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        <Link 
          to="/"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
        >
          <FiHome size={16} />
          Back to Home
        </Link>
      </div>
    </section>
  )
}

export default NotFound
