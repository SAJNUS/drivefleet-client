import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  FiCalendar,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiMapPin,
  FiStar,
  FiTool,
  FiUsers,
} from 'react-icons/fi'

const apiBaseUrl = 'http://localhost:5050/cars'
const placeholderImageUrl = 'https://placehold.co/1200x800?text=Car+Details'


const features = [
  'Dual Zone Climate Control',
  'Panoramic Sunroof',
  'Leather Seats',
  'Navigation System',
  'Keyless Entry',
  'Cruise Control',
  'Parking Sensors',
  'ABS & Airbags',
  'USB Charging Port',
]

const similarCars = [
  {
    name: 'Audi Q7 2023',
    price: '$110',
    rating: 4.6,
    bookings: 8,
    image:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Mercedes-Benz GLE',
    price: '$130',
    rating: 4.7,
    bookings: 10,
    image:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Toyota Fortuner',
    price: '$70',
    rating: 4.5,
    bookings: 15,
    image:
      'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Range Rover Sport',
    price: '$150',
    rating: 4.9,
    bookings: 7,
    image:
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=600&q=80',
  },
]

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
          rating: car.rating ?? 0,
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
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-xl">
            <img
              src={selectedCar.image}
              alt={selectedCar.name}
              className="h-80 w-full object-cover md:h-95"
            />
            <div className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
              {selectedCar.type}
            </div>
            <button
              type="button"
              className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow"
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow"
            >
              <FiChevronRight />
            </button>
            <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600 shadow">
              1 / 6
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            {[selectedCar.image, selectedCar.image, selectedCar.image, selectedCar.image].map((image, index) => (
              <div
                key={index}
                className={`overflow-hidden rounded-2xl border ${
                  index === 0
                    ? 'border-blue-500 shadow-lg'
                    : 'border-slate-200/70'
                }`}
              >
                <img
                  src={image}
                  alt={`${selectedCar.name} view ${index + 1}`}
                  className="h-20 w-full object-cover"
                />
              </div>
            ))}
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

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <FiStar className="text-amber-500" size={14} />{' '}
                {selectedCar.rating} (56 reviews)
              </span>
              <span className="flex items-center gap-1">
                <FiMapPin size={14} /> {selectedCar.location}, Bangladesh
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                {selectedCar.status}
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-600">
              The {selectedCar.name} combines comfort, style, and versatility.
              Perfect for city drives or long road trips with premium comfort
              and reliable performance.
            </p>

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
                <p className="text-lg font-semibold text-slate-900">$480</p>
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
        className="grid gap-6 lg:grid-cols-[1.2fr_1fr]"
      >
        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.6)]">
          <h2 className="text-lg font-semibold text-slate-900">About This Car</h2>
          <p className="mt-3 text-sm text-slate-600">
            {selectedCar.description || `The ${selectedCar.name} combines comfort, style, and versatility. Perfect for city drives or long road trips.`}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.6)]">
          <h2 className="text-lg font-semibold text-slate-900">Features</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <FiCheckCircle size={12} />
                </span>
                <span className="text-slate-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Similar Cars You Might Like
          </h2>
          <button className="text-sm font-semibold text-blue-600">
            View All Cars
          </button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {similarCars.map((car) => (
            <div
              key={car.name}
              className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.5)]"
            >
              <img
                src={car.image}
                alt={car.name}
                className="h-24 w-full rounded-xl object-cover"
              />
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                  <span>{car.name}</span>
                  <span className="text-blue-600">
                    {car.price}
                    <span className="text-xs text-slate-500">/day</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <FiStar size={12} className="text-amber-500" /> {car.rating}
                  </span>
                  <span>{car.bookings} Bookings</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}

export default CarDetails
