import { useEffect, useMemo, useState } from 'react'
import {
  FiAlertTriangle,
  FiCalendar,
  FiLoader,
  FiMapPin,
  FiFlag,
  FiUsers,
  FiCheck,
  FiCheckCircle,
  FiCreditCard,
  FiX,
  FiXCircle,
  FiStar,
  FiUser,
  FiMessageSquare,
  FiList
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth.js'

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = `${API_URL}/bookings`

// ─── Format an ISO date string into a readable short date ─────────────────────
function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Status badge helper ──────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const colourMap = {
    Upcoming: 'bg-blue-100 text-blue-700',
    Completed: 'bg-emerald-100 text-emerald-700',
    Cancelled: 'bg-rose-100 text-rose-700',
  }
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${colourMap[status] ?? 'bg-slate-100 text-slate-600'
        }`}
    >
      {status}
    </span>
  )
}

function MyBookings() {
  const { user } = useAuth()

  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  const [completeTarget, setCompleteTarget] = useState(null)
  const [completing, setCompleting] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [openNoteId, setOpenNoteId] = useState(null)

  // ── Fetch all bookings for the logged-in user ─────────────────────────────
  useEffect(() => {
    if (!user?.email) return

    const controller = new AbortController()

    async function fetchBookings() {
      try {
        setLoadingBookings(true)

        const token = await user.getIdToken()
        const response = await fetch(
          `${API_BASE}?email=${encodeURIComponent(user.email)}`,
          {
            signal: controller.signal,
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!response.ok) {
          throw new Error(`Failed to load bookings (${response.status})`)
        }

        const result = await response.json()
        setBookings(result.data ?? [])
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast.error(err.message || 'Could not load your bookings.')
        }
      } finally {
        setLoadingBookings(false)
      }
    }

    fetchBookings()
    return () => controller.abort()
  }, [user?.email])

  // ── Derived stats ─────────────────────────────────────────────────────────
  const upcomingCount = useMemo(
    () => bookings.filter((b) => b.bookingStatus === 'Upcoming').length,
    [bookings],
  )
  const completedCount = useMemo(
    () => bookings.filter((b) => b.bookingStatus === 'Completed').length,
    [bookings],
  )
  const cancelledCount = useMemo(
    () => bookings.filter((b) => b.bookingStatus === 'Cancelled').length,
    [bookings],
  )
  const totalBookingsCount = useMemo(
    () => bookings.length,
    [bookings]
  )

  // ── Complete Trip ─────────────────────────────────────────────────────────
  const handleCompleteTrip = async () => {
    if (!completeTarget) return

    setCompleting(true)
    try {
      const token = await user.getIdToken()
      const response = await fetch(`${API_BASE}/${completeTarget._id}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating: selectedRating > 0 ? selectedRating : null })
      })

      if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.message || 'Failed to complete booking.')
      }

      setBookings((current) =>
        current.map((b) =>
          b._id === completeTarget._id ? { ...b, bookingStatus: 'Completed' } : b
        )
      )
      toast.success('Trip marked as completed successfully.')
      setCompleteTarget(null)
      setSelectedRating(0)
      setHoveredRating(0)
    } catch (err) {
      toast.error(err.message || 'Something went wrong.')
    } finally {
      setCompleting(false)
    }
  }

  // ── Cancel booking ────────────────────────────────────────────────────────
  const handleCancel = async () => {
    if (!cancelTarget) return

    setCancelling(true)
    try {
      const token = await user.getIdToken()
      const response = await fetch(`${API_BASE}/${cancelTarget._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.message || 'Failed to cancel booking.')
      }

      setBookings((current) =>
        current.map((b) =>
          b._id === cancelTarget._id ? { ...b, bookingStatus: 'Cancelled' } : b
        )
      )
      toast.success(`${cancelTarget.carName} booking cancelled.`)
      setCancelTarget(null)
    } catch (err) {
      toast.error(err.message || 'Something went wrong.')
    } finally {
      setCancelling(false)
    }
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loadingBookings) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm font-medium text-slate-600">
            Loading your bookings...
          </span>
        </div>
      </div>
    )
  }

  return (
    <section className="space-y-8">

      {/* ── Page heading ── */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          My Bookings
        </h1>
        <p className="text-sm text-slate-500 md:text-base">
          Review and manage your current bookings.
        </p>
      </div>

      {/* ── Stats row ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <FiList size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Bookings</p>
              <p className="text-2xl font-semibold text-slate-900">
                {totalBookingsCount}
              </p>
              <p className="text-xs text-slate-400">All time</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FiCalendar size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Upcoming</p>
              <p className="text-2xl font-semibold text-slate-900">
                {upcomingCount}
              </p>
              <p className="text-xs text-slate-400">Active bookings</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <FiFlag size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <p className="text-2xl font-semibold text-slate-900">
                {completedCount}
              </p>
              <p className="text-xs text-slate-400">Finished trips</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <FiXCircle size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Cancelled Cars</p>
              <p className="text-2xl font-semibold text-slate-900">
                {cancelledCount}
              </p>
              <p className="text-xs text-slate-400">Cancelled trips</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bookings table / card list ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Bookings
            </h2>
            <p className="text-sm text-slate-500">
              {bookings.length === 0
                ? 'No bookings yet.'
                : `Showing ${bookings.length} booking${bookings.length === 1 ? '' : 's'} for your account.`}
            </p>
          </div>
          {bookings.length > 0 && (
            <span className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              {bookings.length} total
            </span>
          )}
        </div>

        {/* ── Desktop table ── */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr className="text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Car</th>
                <th className="px-5 py-3">Rental Period</th>
                <th className="px-5 py-3">Details</th>
                <th className="px-5 py-3">Total Cost</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {bookings.map((booking) => (
                <tr key={booking._id} className="align-middle">
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-start gap-3">
                      <img
                        src={booking.carImage}
                        alt={booking.carName}
                        className="h-14 w-20 rounded-xl object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/160x90?text=Car'
                        }}
                      />
                      <div>
                        <p className="font-semibold text-slate-900">
                          {booking.carName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {booking.pickupLocation}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center text-sm text-slate-600">
                    <span>{formatDate(booking.startDate)}</span>
                    <span className="mx-1 text-slate-300">→</span>
                    <span>{formatDate(booking.endDate)}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      {/* Driver Icon */}
                      <div 
                        className={`tooltip flex items-center justify-center ${booking.driverNeeded ? 'text-emerald-500' : 'text-slate-300'}`} 
                        data-tip={booking.driverNeeded ? 'Driver required' : 'No driver required'}
                      >
                        <FiUser size={18} />
                      </div>

                      {/* Note Icon */}
                      {booking.specialNote ? (
                        <div className="relative">
                          <button 
                            type="button" 
                            className="flex items-center justify-center text-emerald-500 hover:text-emerald-600 transition"
                            onClick={() => setOpenNoteId(openNoteId === booking._id ? null : booking._id)}
                          >
                            <FiMessageSquare size={18} />
                          </button>
                          {openNoteId === booking._id && (
                            <>
                              <div 
                                className="fixed inset-0 z-[40] bg-slate-900/20 backdrop-blur-sm" 
                                onClick={() => setOpenNoteId(null)}
                              />
                              <div 
                                className="fixed left-1/2 top-1/2 z-[50] w-[85%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-100 bg-white p-5 shadow-2xl text-left cursor-auto"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-semibold text-slate-800 text-sm">Special Note</span>
                                  <button 
                                    type="button"
                                    className="text-slate-400 hover:text-slate-600 transition"
                                    onClick={() => setOpenNoteId(null)}
                                  >
                                    <FiX size={16} />
                                  </button>
                                </div>
                                <p className="text-slate-600 leading-relaxed text-sm break-words">
                                  {booking.specialNote}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div 
                          className="tooltip flex items-center justify-center text-slate-300" 
                          data-tip="No special note"
                        >
                          <FiMessageSquare size={18} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center text-sm text-blue-600">
                    <span className="font-normal mr-1">BDT</span>
                    <span className="font-bold">{booking.totalCost?.toLocaleString() ?? '—'}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <StatusBadge status={booking.bookingStatus} />
                  </td>
                  <td className="px-5 py-4 text-center">
                    {booking.bookingStatus === 'Upcoming' ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          title="Complete Booking"
                          onClick={() => setCompleteTarget(booking)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                        >
                          <FiCheck size={18} />
                        </button>
                        <button
                          type="button"
                          title="Cancel Booking"
                          onClick={() => setCancelTarget(booking)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bookings.length === 0 && (
            <div className="border-t border-slate-100 px-6 py-16 text-center">
              <h3 className="text-base font-semibold text-slate-900">
                No bookings yet
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Book a car from Explore Cars to see it here.
              </p>
            </div>
          )}
        </div>

        {/* ── Mobile card list ── */}
        <div className="space-y-3 p-4 lg:hidden">
          {bookings.map((booking) => (
            <article
              key={booking._id}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50"
            >
              <div className="flex gap-4 p-4">
                <img
                  src={booking.carImage}
                  alt={booking.carName}
                  className="h-24 w-28 shrink-0 rounded-xl object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/160x90?text=Car'
                  }}
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {booking.carName}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {booking.pickupLocation}
                      </p>
                    </div>
                    <StatusBadge status={booking.bookingStatus} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-white px-3 py-2">
                      <p className="text-slate-400">Pickup</p>
                      <p className="font-medium text-slate-800">
                        {formatDate(booking.startDate)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white px-3 py-2">
                      <p className="text-slate-400">Return</p>
                      <p className="font-medium text-slate-800">
                        {formatDate(booking.endDate)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white px-3 py-2">
                      <p className="text-slate-400 mb-1">Details</p>
                      <div className="flex items-center gap-3">
                        <div 
                          className={booking.driverNeeded ? 'text-emerald-500' : 'text-slate-300'} 
                          title={booking.driverNeeded ? 'Driver required' : 'No driver required'}
                        >
                          <FiUser size={16} />
                        </div>
                        {booking.specialNote ? (
                          <div className="relative">
                            <button 
                              type="button" 
                              className="text-emerald-500 hover:text-emerald-600 transition"
                              onClick={() => setOpenNoteId(openNoteId === booking._id ? null : booking._id)}
                            >
                              <FiMessageSquare size={16} />
                            </button>
                            {openNoteId === booking._id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-[40] bg-slate-900/20 backdrop-blur-sm" 
                                  onClick={() => setOpenNoteId(null)}
                                />
                                <div 
                                  className="fixed left-1/2 top-1/2 z-[50] w-[85%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-100 bg-white p-5 shadow-2xl text-left cursor-auto"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-slate-800 text-sm">Special Note</span>
                                    <button 
                                      type="button"
                                      className="text-slate-400 hover:text-slate-600 transition"
                                      onClick={() => setOpenNoteId(null)}
                                    >
                                      <FiX size={16} />
                                    </button>
                                  </div>
                                  <p className="text-slate-600 leading-relaxed text-sm break-words">
                                    {booking.specialNote}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <div 
                            className="text-slate-300" 
                            title="No special note"
                          >
                            <FiMessageSquare size={16} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white px-3 py-2">
                      <p className="text-slate-400">Total Cost</p>
                      <div className="flex items-baseline gap-1 text-blue-600">
                        <span className="font-normal">BDT</span>
                        <span className="font-bold">{booking.totalCost?.toLocaleString() ?? '—'}</span>
                      </div>
                    </div>
                  </div>

                  {booking.bookingStatus === 'Upcoming' && (
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        title="Complete Booking"
                        onClick={() => setCompleteTarget(booking)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                      >
                        <FiCheck size={20} />
                      </button>
                      <button
                        type="button"
                        title="Cancel Booking"
                        onClick={() => setCancelTarget(booking)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}

          {bookings.length === 0 && (
            <div className="rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center">
              <h3 className="text-base font-semibold text-slate-900">
                No bookings yet
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Book a car from Explore Cars to see it here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Cancel confirmation modal ── */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <FiAlertTriangle size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  Cancel this booking?
                </h3>
                <p className="text-sm text-slate-500">
                  Your booking for{' '}
                  <span className="font-semibold text-slate-800">
                    {cancelTarget.carName}
                  </span>{' '}
                  will be permanently removed. This cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
              >
                {cancelling ? 'Cancelling…' : 'Confirm Cancel'}
              </button>
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                disabled={cancelling}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Complete confirmation & Rating modal ── */}
      {completeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FiCheckCircle size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  Rate your trip
                </h3>
                <p className="text-sm text-slate-500">
                  How was your experience with the{' '}
                  <span className="font-semibold text-slate-800">
                    {completeTarget.carName}
                  </span>?
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setSelectedRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <FiStar
                    size={32}
                    className={`transition-colors ${(hoveredRating || selectedRating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                      }`}
                  />
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleCompleteTrip}
                disabled={completing || selectedRating === 0}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {completing ? 'Submitting…' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={handleCompleteTrip}
                disabled={completing}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Skip Rating
              </button>
            </div>
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => {
                  setCompleteTarget(null)
                  setSelectedRating(0)
                  setHoveredRating(0)
                }}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Cancel and go back
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  )
}

export default MyBookings
