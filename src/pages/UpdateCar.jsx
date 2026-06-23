import { Link, useParams } from 'react-router-dom'

function UpdateCar() {
  const { id } = useParams()

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Placeholder Route
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          Update Car
        </h1>
        <p className="text-sm text-slate-600 md:text-base">
          This route is ready for the future update form. Selected car ID: {id}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
        The update experience is not connected yet. Use this page as a temporary
        placeholder for the update button flow.
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/my-added-cars"
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Back to My Added Cars
        </Link>
      </div>
    </section>
  )
}

export default UpdateCar