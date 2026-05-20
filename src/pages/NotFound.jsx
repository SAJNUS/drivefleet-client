import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-slate-600">
          The page you are looking for does not exist.
        </p>
      </div>
      <Link className="text-sm font-medium text-blue-600" to="/">
        Back to home
      </Link>
    </section>
  )
}

export default NotFound
