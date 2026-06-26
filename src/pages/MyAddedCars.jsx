import { useEffect, useState } from 'react'
import { FiAlertTriangle, FiEdit3, FiMapPin, FiTrash2, FiStar, FiGrid, FiCheckCircle, FiClock, FiUsers, FiSlash, FiSearch } from 'react-icons/fi'
import { FaCar } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth.js'
import { carTagStyles } from '../components/CarCard.jsx'

const API_URL = import.meta.env.VITE_API_URL;

function MyAddedCars() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cars, setCars] = useState([])
  const [ownerBookings, setOwnerBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('newest')

  useEffect(() => {
    if (!user?.email) return

    const controller = new AbortController()

    const timeoutId = setTimeout(async () => {
      try {
        setError('')

        const token = await user.getIdToken()

        const searchParam = searchQuery.trim() ? `&search=${encodeURIComponent(searchQuery.trim())}` : ''

        // Fetch user's cars
        const carsResponse = await fetch(
          `${API_URL}/cars?email=${encodeURIComponent(user.email)}${searchParam}`,
          {
            signal: controller.signal,
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!carsResponse.ok) {
          throw new Error(`Failed to load your cars (${carsResponse.status})`)
        }

        const carsPayload = await carsResponse.json()
        setCars(Array.isArray(carsPayload?.data) ? carsPayload.data : [])

        // Fetch user's car bookings (to calculate total earnings)
        const bookingsResponse = await fetch(
          `${API_URL}/bookings?ownerEmail=${encodeURIComponent(user.email)}`,
          {
            signal: controller.signal,
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (bookingsResponse.ok) {
          const bookingsPayload = await bookingsResponse.json()
          setOwnerBookings(Array.isArray(bookingsPayload?.data) ? bookingsPayload.data : [])
        }

      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Failed to load your cars')
          setCars([])
          setOwnerBookings([])
        }
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [user?.email, searchQuery])

  const userCars = cars
  const activeCars = userCars.filter((car) => car.availabilityStatus === 'Available')
  const inactiveCars = userCars.filter((car) => car.availabilityStatus === 'Unavailable')

  const ratedCars = userCars.filter(car => typeof car.rating === 'number' && car.rating > 0);
  const averageRating = ratedCars.length > 0
    ? (ratedCars.reduce((acc, car) => acc + car.rating, 0) / ratedCars.length).toFixed(1)
    : 0;

  // Filter and Sort
  let processedCars = [...userCars]



  processedCars.sort((a, b) => {
    if (sortOption === 'price_low') return (a.dailyRentPrice || 0) - (b.dailyRentPrice || 0)
    if (sortOption === 'price_high') return (b.dailyRentPrice || 0) - (a.dailyRentPrice || 0)

    // Sort by MongoDB ObjectId timestamp (first 8 hex chars)
    const timeA = a._id ? parseInt(a._id.substring(0, 8), 16) : 0
    const timeB = b._id ? parseInt(b._id.substring(0, 8), 16) : 0

    if (sortOption === 'oldest') return timeA - timeB
    return timeB - timeA // newest first
  })

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      const token = await user.getIdToken()
      const response = await fetch(
        `${API_URL}/cars/${deleteTarget._id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message || 'Failed to delete car')
      }

      setCars((current) => current.filter((car) => car._id !== deleteTarget._id))
      toast.success(`${deleteTarget.carName} deleted successfully.`)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.')
    } finally {
      setDeleting(false)
    }
  }


  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Loading</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">Fetching your car listings</h1>
        <p className="mt-2 text-sm text-slate-600">Please wait while we load your data.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">Error</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">Unable to load your cars</h1>
        <p className="mt-2 text-sm text-slate-600">{error}</p>
      </div>
    )
  }

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          My Added Cars
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 md:text-base">
          Manage, update or remove the cars you have added.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FaCar size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Cars</p>
              <p className="text-2xl font-semibold text-slate-900">
                {userCars.length}
              </p>
              <p className="text-xs text-slate-500">All cars you added</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <FiCheckCircle size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Cars</p>
              <p className="text-2xl font-semibold text-slate-900">
                {activeCars.length}
              </p>
              <p className="text-xs text-slate-500">Currently live</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <FiSlash size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Inactive Cars</p>
              <p className="text-2xl font-semibold text-slate-900">
                {inactiveCars.length}
              </p>
              <p className="text-xs text-slate-500">Not active</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <FiStar size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Average Rating</p>
              <div className="flex items-baseline gap-1 text-2xl text-slate-900">
                <span className="font-bold">{averageRating}</span>
                <span className="text-sm font-normal text-slate-500">/ 5</span>
              </div>
              <p className="text-xs text-slate-500">Across all cars</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 sm:w-[300px] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
              <FiSearch size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by car name or type..."
                className="w-full bg-transparent outline-none placeholder:text-slate-400 text-slate-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-500">Sort by:</label>
            <select
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
            <button
              type="button"
              onClick={() => navigate('/add-car')}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <span className="text-lg leading-none">+</span>
              Add New Car
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
          <div className="grid grid-cols-1 gap-4 p-3 md:grid-cols-2 xl:grid-cols-3">
            {processedCars.map((car) => (
              <article
                key={car._id}
                className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <Link to={`/car-details/${car._id}`} className="absolute inset-0 z-10">
                  <span className="sr-only">View {car.carName} details</span>
                </Link>
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={car.imageUrl}
                    alt={car.carName}
                    className="h-full w-full object-cover"
                  />
                  <span
                    className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${car.availabilityStatus === 'Available'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-600'
                      }`}
                  >
                    {car.availabilityStatus}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-slate-900 line-clamp-1">
                      {car.carName}
                    </h3>
                    <span
                      className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm ${carTagStyles[car.carType] || 'bg-slate-600 text-white'
                        }`}
                    >
                      {car.carType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-baseline gap-1 text-sm text-blue-600">
                      <span className="font-normal">BDT</span>
                      <span className="font-bold">{car.dailyRentPrice}</span>
                      <span className="text-[10px] font-medium text-slate-500">/day</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs">
                      <FiUsers size={14} /> {car.seatCapacity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <FiMapPin size={14} /> {car.pickupLocation}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiStar size={14} className="text-amber-500" />
                      {car.rating || 0}
                    </span>
                  </div>

                  <div className="mt-auto pt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to={`/update-car/${car._id}`}
                        className="relative z-20 inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        <FiEdit3 size={14} />
                        Update
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(car)}
                        className="relative z-20 inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {processedCars.length === 0 && userCars.length > 0 && (
            <div className="border-t border-slate-200 px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                No cars match your search
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Try adjusting your search or filter criteria.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-6 rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Clear Search
              </button>
            </div>
          )}

          {userCars.length === 0 && (
            <div className="border-t border-slate-200 px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                No cars found for your account
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Add a car first to see it listed here.
              </p>
              <button
                type="button"
                onClick={() => navigate('/add-car')}
                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Add Car
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <p>
            Showing {processedCars.length} of {cars.length} cars
          </p>
          <p>Use the actions above to manage your listings</p>
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <FiAlertTriangle size={22} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">
                  Delete this car?
                </h3>
                <p className="text-sm text-slate-600">
                  {deleteTarget.carName} will be permanently deleted from the database.
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default MyAddedCars
