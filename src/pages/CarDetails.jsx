import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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

const apiBaseUrl = 'http://localhost:5050/cars'
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

function CarDetails() {
  const { id } = useParams()

  const [selectedCar, setSelectedCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadCar() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${apiBaseUrl}/${id}`, {
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
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <img
              src={selectedCar.image}
              alt={selectedCar.name}
              className="h-72 w-full object-cover sm:h-80 md:h-[380px]"
              onError={(e) => { e.currentTarget.src = placeholderImageUrl }}
            />
          </div>

          {/* Car info card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            {/* Name + price row */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                {selectedCar.name}
              </h1>
              <p className="text-xl font-bold text-blue-600">
                ${selectedCar.dailyRentPrice}
                <span className="text-sm font-normal text-slate-400"> / day</span>
              </p>
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
            {selectedCar.description && (
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {selectedCar.description}
              </p>
            )}
            {!selectedCar.description && (
              <p className="mt-4 text-sm italic text-slate-400">
                No description available.
              </p>
            )}

            {/* Divider */}
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
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Book This Car</h2>
            <p className="mt-1 text-xl font-bold text-blue-600">
              ${selectedCar.dailyRentPrice}
              <span className="text-sm font-normal text-slate-400"> / day</span>
            </p>

            <div className="mt-4 space-y-4">
              {/* Pickup location */}
              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Pickup Location
                </label>
                <select className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400">
                  <option>{selectedCar.location}</option>
                </select>
              </div>

              {/* Pickup date */}
              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Pickup Date
                </label>
                <input
                  type="date"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
                />
              </div>

              {/* Return date */}
              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Return Date
                </label>
                <input
                  type="date"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
                />
              </div>

              {/* Driver needed */}
              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Driver Needed?
                </label>
                <div className="mt-1.5 flex items-center gap-5 text-sm text-slate-700">
                  <label className="flex cursor-pointer items-center gap-1.5">
                    <input type="radio" name="driver" /> Yes
                  </label>
                  <label className="flex cursor-pointer items-center gap-1.5">
                    <input type="radio" name="driver" defaultChecked /> No
                  </label>
                </div>
              </div>

              {/* Special note */}
              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Special Note (Optional)
                </label>
                <textarea
                  rows="3"
                  className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400"
                  placeholder="Write any special note..."
                />
              </div>

              {/* Total price */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                <span className="font-medium text-slate-600">Total Price</span>
                <span className="text-xs italic text-slate-400">
                  Select dates to calculate total
                </span>
              </div>

              {/* Book now */}
              <button
                type="button"
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Book Now
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
      <motion.section
        variants={sectionVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="space-y-4"
      >
        <h2 className="text-lg font-bold text-slate-900">Cars You May Like</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex h-28 items-center justify-center rounded-xl bg-slate-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM3 12l2-5h14l2 5M3 12h18"
                  />
                </svg>
              </div>
              <p className="mt-3 text-center text-xs text-slate-400">
                Coming soon
              </p>
            </div>
          ))}
        </div>
      </motion.section>

    </div>
  )
}

export default CarDetails
