import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiTool,
  FiUsers,
} from 'react-icons/fi'

const apiBaseUrl = 'http://localhost:5050/cars'
const placeholderImageUrl = 'https://placehold.co/1200x800?text=Car+Details'



const sectionVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
          seats: car.seatCapacity ?? 'N/A',
          status: car.availabilityStatus ?? 'Available',
          description: car.description ?? '',
          transmission: car.transmission ?? null,
          fuelType: car.fuelType ?? null,
          mileage: car.mileage ?? null,
          modelYear: car.modelYear ?? null,
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

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200/70 bg-white p-8 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Loading Car Details
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Fetching car information
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Please wait while we load the selected listing.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-slate-200/70 bg-white p-8 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Car not found
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          {error}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Please go back to Explore Cars and choose a valid listing.
        </p>
      </div>
    )
  }

  if (!selectedCar) {
    return (
      <div className="rounded-3xl border border-slate-200/70 bg-white p-8 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Car not found
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          The selected car does not exist
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Please go back to Explore Cars and choose a valid listing.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <motion.section
        variants={sectionVariant}
        initial="hidden"
        animate="show"
        className="grid gap-8 lg:grid-cols-[1.7fr_1fr]"
      >
        <div>
          <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-xl">
            <img
              src={selectedCar.image}
              alt={selectedCar.name}
              className="h-80 w-full object-cover md:h-[420px]"
              onError={(e) => { e.currentTarget.src = placeholderImageUrl }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.6)]">
            <div className="flex items-center justify-between">
              <div>
                <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  {selectedCar.type}
                </span>
                <h1 className="mt-3 text-2xl font-semibold text-slate-900">
                  {selectedCar.name}
                </h1>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-blue-600">
                  ${selectedCar.dailyRentPrice}
                  <span className="text-xs font-medium text-slate-500">
                    /day
                  </span>
                </p>
                <p className="text-xs text-slate-500">{selectedCar.status}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <FiMapPin size={14} /> {selectedCar.location}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  selectedCar.status === 'Available'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {selectedCar.status}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Seats — real DB value */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiUsers size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Seats</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedCar.seats} Seats
                  </p>
                </div>
              </div>
              {/* Transmission — real DB value */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiTool size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Transmission</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedCar.transmission ?? 'N/A'}
                  </p>
                </div>
              </div>
              {/* Fuel Type — real DB value */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiCheckCircle size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Fuel Type</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedCar.fuelType ?? 'N/A'}
                  </p>
                </div>
              </div>
              {/* Mileage — real DB value */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiClock size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Mileage</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedCar.mileage ?? 'N/A'}
                  </p>
                </div>
              </div>
              {/* Model Year — real DB value */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiCalendar size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Model Year</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedCar.modelYear ?? 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.6)]">
            <h2 className="text-lg font-semibold text-slate-900">
              Book This Car
            </h2>
            <p className="mt-2 text-xl font-semibold text-blue-600">
              ${selectedCar.dailyRentPrice}
              <span className="text-xs font-medium text-slate-500">/day</span>
            </p>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Pickup Location
                </label>
                <select className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  <option>{selectedCar.location}</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Pickup Date
                </label>
                <input
                  type="date"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Return Date
                </label>
                <input
                  type="date"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Driver Needed?
                </label>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="driver" /> Yes
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="driver" defaultChecked /> No
                  </label>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Special Note (Optional)
                </label>
                <textarea
                  rows="3"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Write any special note..."
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <p className="text-slate-500">Total Price</p>
                <p className="text-sm text-slate-400 italic">Select dates to calculate total</p>
              </div>
              <button
                type="button"
                className="w-full rounded-lg bg-linear-to-r from-blue-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white"
              >
                Book Now
              </button>
              <div className="flex items-center gap-2 text-xs text-emerald-600">
                <FiCheckCircle size={14} /> Free cancellation up to 24 hours
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.6)]">
          <h2 className="text-lg font-semibold text-slate-900">About This Car</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {selectedCar.description || 'No description available.'}
          </p>
        </div>
      </motion.section>
    </div>
  )
}

export default CarDetails
