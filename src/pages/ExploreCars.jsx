import { motion } from 'framer-motion'
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiHeart,
  FiList,
  FiMapPin,
  FiSearch,
  FiStar,
  FiUsers,
} from 'react-icons/fi'

const bannerImage = '/banner-section-picture.png'

const carTagStyles = {
  SUV: 'bg-blue-600 text-white',
  Sedan: 'bg-emerald-600 text-white',
  Hatchback: 'bg-amber-500 text-white',
  Luxury: 'bg-violet-600 text-white',
}

const cars = [
  {
    id: 1,
    name: 'BMW X5',
    type: 'SUV',
    price: '$120',
    seats: '5 Seats',
    location: 'Dhaka',
    rating: 4.8,
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Toyota Camry',
    type: 'Sedan',
    price: '$60',
    seats: '5 Seats',
    location: 'Chattogram',
    rating: 4.6,
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Suzuki Swift',
    type: 'Hatchback',
    price: '$30',
    seats: '4 Seats',
    location: 'Sylhet',
    rating: 4.5,
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Mercedes-Benz E-Class',
    type: 'Luxury',
    price: '$150',
    seats: '5 Seats',
    location: 'Dhaka',
    rating: 4.9,
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Hyundai Tucson',
    type: 'SUV',
    price: '$65',
    seats: '5 Seats',
    location: 'Khulna',
    rating: 4.6,
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'Honda Civic',
    type: 'Sedan',
    price: '$45',
    seats: '5 Seats',
    location: 'Rajshahi',
    rating: 4.4,
    status: 'Available',
    image:
      'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=900&q=80',
  },
]

const sectionVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

function ExploreCars() {
  return (
    <div className="space-y-10">
      <motion.section
        variants={sectionVariant}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-r from-blue-50 via-white to-slate-50 px-6 py-10 shadow-xl md:px-10"
      >
        <div className="absolute inset-0">
          <img
            src={bannerImage}
            alt="Explore cars"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30" />
        </div>
        <div className="relative grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
              Explore Cars
            </h1>
            <p className="max-w-sm text-sm text-slate-600 md:text-base">
              Find the perfect car for your next journey. Choose from a wide
              range of vehicles.
            </p>
          </div>
          <div className="hidden md:block" />
        </div>
      </motion.section>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <motion.aside
          variants={sectionVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-6 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.5)]"
        >
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">Filter Cars</h2>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-600">
              Search
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <FiSearch className="text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by car name..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-600">Car Type</p>
            {['All Types', 'SUV', 'Sedan', 'Hatchback', 'Luxury'].map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4" />
                <span className="text-slate-700">{type}</span>
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-600">Price Range</p>
            <input type="range" className="w-full" />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>$10 / day</span>
              <span>$200 / day</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-600">
              Pickup Location
            </label>
            <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
              <option>Select location</option>
              <option>Dhaka</option>
              <option>Chattogram</option>
              <option>Sylhet</option>
            </select>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-600">Availability</p>
            {['All Cars', 'Available Only'].map((status) => (
              <label key={status} className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4" />
                <span className="text-slate-700">{status}</span>
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-xs font-semibold text-white"
            >
              Apply Filters
            </button>
            <button
              type="button"
              className="w-full rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700"
            >
              Clear Filters
            </button>
          </div>
        </motion.aside>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-600">Showing 12 cars</p>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                Sort by: Newest First <FiChevronDown size={14} />
              </button>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1">
                <button className="rounded-md bg-blue-50 p-2 text-blue-600">
                  <FiGrid size={14} />
                </button>
                <button className="rounded-md p-2 text-slate-500">
                  <FiList size={14} />
                </button>
              </div>
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {cars.map((car) => (
              <motion.article
                key={car.id}
                variants={sectionVariant}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.6)]"
              >
                <div className="relative overflow-hidden rounded-2xl bg-slate-50">
                  <span
                    className={`absolute left-3 top-3 rounded-md px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow opacity-90 ${
                      carTagStyles[car.type] || 'bg-slate-600 text-white'
                    }`}
                  >
                    {car.type}
                  </span>
                  <button
                    type="button"
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-500 shadow"
                  >
                    <FiHeart size={14} />
                  </button>
                  <img
                    src={car.image}
                    alt={car.name}
                    className="h-40 w-full object-cover"
                  />
                </div>
                <div className="mt-4 flex flex-1 flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900">
                      {car.name}
                    </h3>
                    <span className="text-sm font-semibold text-blue-600">
                      {car.price}
                      <span className="text-xs font-medium text-slate-500">
                        /day
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <FiUsers size={14} /> {car.seats}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiMapPin size={14} /> {car.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiStar size={14} className="text-amber-500" />
                      {car.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                      {car.status}
                    </span>
                    <button
                      type="button"
                      className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
              <FiChevronLeft size={14} />
            </button>
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                  page === 1
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-600'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
              <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExploreCars
