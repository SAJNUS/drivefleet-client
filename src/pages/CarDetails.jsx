import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiMapPin,
  FiTag,
  FiTool,
  FiUser,
  FiUsers,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth.js'
import { carTagStyles } from '../components/CarCard.jsx'

const API_BASE = 'http://localhost:5050'
const placeholderImageUrl = 'https://placehold.co/1200x800?text=Car+Image'

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

// ─── Reusable spec tile ────────────────────────────────────────────────────────
function SpecTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Icon size={12} />
        {label}
      </div>
      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value ?? 'N/A'}
      </p>
    </div>
  )
}

// ─── Calculate rental days between two ISO date strings ───────────────────────
function calcRentalDays(start, end) {
  if (!start || !end) return 0
  const diff = new Date(end) - new Date(start)
  return diff > 0 ? Math.ceil(diff / 86400000) : 0
}

function CarDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [selectedCar, setSelectedCar] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Booking form state
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Live cost calculation
  const rentalDays = calcRentalDays(startDate, endDate)
  const totalCost = rentalDays > 0 && selectedCar
    ? rentalDays * selectedCar.dailyRentPrice
    : 0

  useEffect(() => {
    const controller = new AbortController()

    async function loadCar() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${API_BASE}/cars/${id}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          if (response.status === 404) {
            setError('Car not found')
            return
          }
          throw new Error(`Failed to load car (${response.status})`)
        }

        const payload = await response.json()
        const car = payload?.data ?? null

        if (!car) {
          setError('Car not found')
          return
        }

        setSelectedCar({
          id: car._id ?? id,
          name: car.carName ?? 'Unknown Car',
          type: car.carType ?? 'General',
          image: car.imageUrl || placeholderImageUrl,
          location: car.pickupLocation ?? 'Unknown Location',
          dailyRentPrice: car.dailyRentPrice ?? 0,
          seats: car.seatCapacity ?? null,
          status: car.availabilityStatus ?? 'Available',
          description: car.description ?? '',
          transmission: car.transmission ?? null,
          fuelType: car.fuelType ?? null,
          mileage: car.mileage ?? null,
          modelYear: car.modelYear ?? null,
          ownerEmail: car.ownerEmail ?? null,
        })
        
        // Fetch recommendations in the background
        fetch(`${API_BASE}/cars`, { signal: controller.signal })
          .then((res) => res.json())
          .then((data) => {
            let all = Array.isArray(data?.data) ? data.data : []
            // Exclude current car
            all = all.filter((c) => c._id !== (car._id ?? id))
            // Sort by matching type first
            all.sort((a, b) => {
              const aSame = a.carType === car.carType ? 1 : 0
              const bSame = b.carType === car.carType ? 1 : 0
              return bSame - aSame
            })
            setRecommendations(all.slice(0, 4))
          })
          .catch(() => {}) // Ignore fetch errors for recommendations

      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Failed to load car')
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadCar()
    } else {
      setLoading(false)
      setError('Car not found')
    }

    return () => controller.abort()
  }, [id])

  // ── Book Now handler ─────────────────────────────────────────────────────────
  const handleBooking = async () => {
    // Guard: must be logged in
    if (!user) {
      toast.error('Please log in to book a car.')
      return
    }

    // Guard: car unavailable
    if (selectedCar.status !== 'Available') {
      toast.error('This car is currently unavailable.')
      return
    }

    // Guard: cannot book own car
    if (selectedCar.ownerEmail && user.email === selectedCar.ownerEmail) {
      toast.error('You cannot book your own car.')
      return
    }

    // Guard: dates required
    if (!startDate || !endDate) {
      toast.error('Please select both pickup and return dates.')
      return
    }

    // Guard: date order
    if (rentalDays <= 0) {
      toast.error('Return date must be after the pickup date.')
      return
    }

    setSubmitting(true)

    const bookingPayload = {
      carId: selectedCar.id,
      carName: selectedCar.name,
      carImage: selectedCar.image,
      pickupLocation: selectedCar.location,
      ownerEmail: selectedCar.ownerEmail ?? '',
      renterEmail: user.email,
      startDate,
      endDate,
      totalCost,
      bookingStatus: 'Upcoming',
    }

    try {
      const token = await user.getIdToken()
      const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingPayload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create booking.')
      }

      toast.success(`${selectedCar.name} booked successfully!`)
      navigate('/my-bookings')
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Today's date for min attribute ──────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0]

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Loading
        </p>
        <h1 className="mt-2 text-xl font-semibold text-slate-900">
          Fetching car information…
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Please wait while we load the selected listing.
        </p>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error || !selectedCar) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-500">
          Not Found
        </p>
        <h1 className="mt-2 text-xl font-semibold text-slate-900">
          {error || 'Car not found'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Please go back to Explore Cars and choose a valid listing.
        </p>
      </div>
    )
  }

  const isAvailable = selectedCar.status === 'Available'
  const isOwnCar = user && selectedCar.ownerEmail && user.email === selectedCar.ownerEmail
  const canBook = isAvailable && !isOwnCar

  return (
    <div className="space-y-8">

      {/* ── Main two-column grid ─────────────────────────────────────────────── */}
      <motion.section
        variants={sectionVariant}
        initial="hidden"
        animate="show"
        className="grid gap-6 lg:grid-cols-[1.6fr_1fr]"
      >
        {/* ── LEFT COLUMN ── */}
        <div className="space-y-4">

          {/* Car image */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span
              className={`absolute left-4 top-4 z-10 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide shadow-sm opacity-90 ${
                carTagStyles[selectedCar.type] || 'bg-slate-600 text-white'
              }`}
            >
              {selectedCar.type}
            </span>
            <img
              src={selectedCar.image}
              alt={selectedCar.name}
              className="h-72 w-full object-cover sm:h-80 md:h-[380px]"
              onError={(e) => { e.currentTarget.src = placeholderImageUrl }}
            />
          </div>

          {/* Car info card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            {/* Name + price */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                {selectedCar.name}
              </h1>
              <div className="flex items-baseline gap-1 text-xl text-blue-600">
                <span className="font-normal">BDT</span>
                <span className="font-bold">{selectedCar.dailyRentPrice}</span>
                <span className="text-sm font-normal text-slate-400">/day</span>
              </div>
            </div>

            {/* Location + availability */}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <FiMapPin size={13} />
                {selectedCar.location}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isAvailable
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {selectedCar.status}
              </span>
            </div>

            {/* Description */}
            {selectedCar.description ? (
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {selectedCar.description}
              </p>
            ) : (
              <p className="mt-4 text-sm italic text-slate-400">
                No description available.
              </p>
            )}

            <hr className="my-4 border-slate-100" />

            {/* Specs — 2×3 grid */}
            <div className="grid grid-cols-3 gap-3">
              <SpecTile
                icon={FiUsers}
                label="Seats"
                value={selectedCar.seats ? `${selectedCar.seats} Seats` : null}
              />
              <SpecTile
                icon={FiTag}
                label="Body Type"
                value={selectedCar.type}
              />
              <SpecTile
                icon={FiCalendar}
                label="Model Year"
                value={selectedCar.modelYear}
              />
              <SpecTile
                icon={FiTool}
                label="Transmission"
                value={selectedCar.transmission}
              />
              <SpecTile
                icon={FiCheckCircle}
                label="Fuel Type"
                value={selectedCar.fuelType}
              />
              <SpecTile
                icon={FiClock}
                label="Mileage"
                value={selectedCar.mileage}
              />
            </div>
          </div>

          {/* Owner card */}
          {selectedCar.ownerEmail && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <FiUser size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Listed by</p>
                    <p className="text-sm font-semibold text-slate-800">Owner</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <FiMail size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Contact</p>
                    <p className="truncate text-sm font-medium text-blue-600">
                      {selectedCar.ownerEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN — booking card ── */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Book This Car</h2>
            <div className="mt-1 flex items-baseline gap-1 text-xl text-blue-600">
              <span className="font-normal">BDT</span>
              <span className="font-bold">{selectedCar.dailyRentPrice}</span>
              <span className="text-sm font-normal text-slate-400">/day</span>
            </div>

            {/* Unavailable notice */}
            {!isAvailable && (
              <div className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">
                This car is currently unavailable for booking.
              </div>
            )}

            {/* Own car notice */}
            {isOwnCar && (
              <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                This is your own listing — you cannot book it.
              </div>
            )}

            <div className="mt-4 space-y-4">

              {/* Pickup location */}
              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Pickup Location
                </label>
                <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600">
                  <FiMapPin size={13} className="shrink-0 text-slate-400" />
                  {selectedCar.location}
                </div>
              </div>

              {/* Pickup date */}
              <div>
                <label htmlFor="startDate" className="text-xs font-semibold text-slate-500">
                  Pickup Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value)
                    // If endDate is now invalid, clear it
                    if (endDate && e.target.value >= endDate) setEndDate('')
                  }}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
                />
              </div>

              {/* Return date */}
              <div>
                <label htmlFor="endDate" className="text-xs font-semibold text-slate-500">
                  Return Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
                />
              </div>

              {/* Live rental summary */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                <span className="font-medium text-slate-600">Total Price</span>
                {rentalDays > 0 ? (
                  <div className="flex items-baseline gap-1 text-slate-900">
                    <span className="font-normal">BDT</span>
                    <span className="font-bold">{totalCost}</span>
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      ({rentalDays} {rentalDays === 1 ? 'day' : 'days'})
                    </span>
                  </div>
                ) : (
                  <span className="text-xs italic text-slate-400">
                    Select dates to calculate total
                  </span>
                )}
              </div>

              {/* Book Now */}
              <button
                type="button"
                onClick={handleBooking}
                disabled={!canBook || submitting}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Booking…' : 'Book Now'}
              </button>

              {/* Cancellation note */}
              <div className="flex items-center gap-2 text-xs text-emerald-600">
                <FiCheckCircle size={13} />
                Free cancellation up to 24 hours
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Cars You May Like ─────────────────────────────────────────────────── */}
      {recommendations.length > 0 && (
        <motion.section
          variants={sectionVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-bold text-slate-900">Cars You May Like</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {recommendations.map((rec) => (
              <Link
                key={rec._id}
                to={`/car-details/${rec._id}`}
                className="group block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex h-28 overflow-hidden items-center justify-center rounded-xl bg-slate-100">
                  <img 
                    src={rec.imageUrl} 
                    alt={rec.carName} 
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105" 
                    onError={(e) => { e.currentTarget.src = placeholderImageUrl }} 
                  />
                </div>
                <div className="mt-3 text-center">
                  <h3 className="truncate text-sm font-semibold text-slate-900 group-hover:text-blue-600">
                    {rec.carName}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    BDT {rec.dailyRentPrice}/day
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

    </div>
  )
}

export default CarDetails
