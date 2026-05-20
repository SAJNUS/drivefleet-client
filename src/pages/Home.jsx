import { motion } from 'framer-motion'
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiShield,
  FiStar,
  FiUsers,
} from 'react-icons/fi'

const heroImage = '/banner-section-picture.png'

const cars = [
  {
    id: 1,
    name: 'BMW X5',
    type: 'SUV',
    price: '$85',
    seats: '5 Seats',
    location: 'Dhaka, Bangladesh',
    image:
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Audi A4',
    type: 'Sedan',
    price: '$65',
    seats: '5 Seats',
    location: 'Chattogram, Bangladesh',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Volkswagen Golf',
    type: 'Hatchback',
    price: '$45',
    seats: '4 Seats',
    location: 'Sylhet, Bangladesh',
    image:
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Mercedes C-Class',
    type: 'Luxury',
    price: '$95',
    seats: '5 Seats',
    location: 'Dhaka, Bangladesh',
    image:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Toyota Camry',
    type: 'Sedan',
    price: '$55',
    seats: '5 Seats',
    location: 'Khulna, Bangladesh',
    image:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'Range Rover Evoque',
    type: 'SUV',
    price: '$90',
    seats: '5 Seats',
    location: 'Rajshahi, Bangladesh',
    image:
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=80',
  },
]

const highlights = [
  {
    icon: FiCheckCircle,
    title: 'Wide Range of Cars',
    description: 'SUV, Sedan, Hatchback and more',
  },
  {
    icon: FiShield,
    title: 'Best Price Guarantee',
    description: 'Get the best rates for every booking',
  },
  {
    icon: FiClock,
    title: 'Easy Booking',
    description: 'Book in just a few simple steps',
  },
  {
    icon: FiStar,
    title: '24/7 Support',
    description: 'We are here to help you anytime',
  },
]

const reasons = [
  'Well maintained and quality cars',
  'Flexible rental options (daily, weekly, monthly)',
  'No hidden charges with transparent pricing',
  'Trusted by thousands of happy customers',
  'Instant booking confirmation and support',
]

const services = [
  {
    icon: FiShield,
    title: 'Premium Insurance',
    description: 'Drive with confidence backed by comprehensive coverage.',
  },
  {
    icon: FiUsers,
    title: 'Personalized Support',
    description: 'Dedicated concierge assistance for every journey.',
  },
  {
    icon: FiMapPin,
    title: 'Multiple Pickup Points',
    description: 'Convenient locations across major districts.',
  },
]

const carTagStyles = {
  SUV: 'bg-blue-600 text-white',
  Sedan: 'bg-emerald-600 text-white',
  Hatchback: 'bg-amber-500 text-white',
  Luxury: 'bg-violet-600 text-white',
}

const sectionVariant = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

function Home() {
  return (
    <div className="space-y-24">
      <motion.section
        variants={sectionVariant}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-[32px] border border-slate-200/70 shadow-xl"
      >
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="DriveFleet hero"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="relative grid min-h-[420px] gap-12 px-6 py-14 md:grid-cols-[1.15fr_0.85fr] md:px-12 lg:px-14">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white/70 px-4 py-1 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur">
              Premium rentals for modern travel
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-6xl">
                Your Journey,
                <br /> Our <span className="text-blue-600">Drive</span>
              </h1>
              <p className="max-w-sm text-sm leading-relaxed text-slate-600 md:max-w-md md:text-base">
                Explore a wide range of cars and book your perfect ride
                anywhere, anytime. DriveFleet makes every trip effortless.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-blue-600"
              >
                Explore Cars
                <FiArrowRight size={16} />
              </button>
              <div className="rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-xs text-slate-500 shadow-sm backdrop-blur">
                4.9/5 average rating
              </div>
            </div>
          </div>

          <div className="hidden md:block" />
        </div>

        <div className="mt-10 grid gap-6 border-t border-slate-100/70 bg-white/80 px-6 py-6 shadow-inner backdrop-blur sm:grid-cols-2 md:grid-cols-4 md:px-12 lg:px-14">
          {highlights.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
                <item.icon size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">Available Cars</p>
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              Choose from the latest arrivals
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700"
          >
            View All Cars <FiArrowRight size={16} />
          </button>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {cars.map((car) => (
            <motion.article
              key={car.id}
              variants={sectionVariant}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_18px_40px_-30px_rgba(15,23,42,0.6)]"
            >
              <div className="relative bg-gradient-to-b from-slate-50 to-white">
                <span
                  className={`absolute left-4 top-4 rounded-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wide shadow ${
                    carTagStyles[car.type] || 'bg-slate-600 text-white'
                  }`}
                >
                  {car.type}
                </span>
                <img
                  src={car.image}
                  alt={car.name}
                  className="h-48 w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {car.name}
                  </h3>
                  <p className="text-xs text-slate-500">{car.location}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span className="text-lg font-semibold text-blue-600">
                    {car.price}
                    <span className="text-xs font-medium text-slate-500">
                      /day
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-xs">
                    <FiUsers size={14} /> {car.seats}
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-auto rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
                >
                  View Details
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        variants={sectionVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-8 lg:grid-cols-2"
      >
        <div className="min-h-[320px] rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100/60 p-8 shadow-[0_24px_60px_-45px_rgba(59,130,246,0.55)]">
          <p className="text-sm font-semibold text-blue-700">Why Choose Us</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
            Why Choose <span className="text-blue-600">DriveFleet</span>?
          </h3>
          <ul className="mt-6 space-y-4 text-sm text-slate-600">
            {reasons.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                  <FiCheckCircle size={14} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-h-[320px] rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-emerald-50 to-emerald-100/60 p-8 shadow-[0_24px_60px_-45px_rgba(16,185,129,0.5)]">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-emerald-700">
              How It Works
            </p>
            <h3 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              Book your ride in minutes
            </h3>
            <div className="space-y-5 text-sm text-slate-600">
              {['Choose your car', 'Make a booking', 'Enjoy your ride'].map(
                (step, index) => (
                  <div key={step} className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{step}</p>
                      <p className="text-xs text-slate-500">
                        Smooth steps to get you on the road quickly.
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-8"
      >
        <div>
          <p className="text-sm font-semibold text-blue-600">Premium Services</p>
          <h3 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            Designed for comfort and confidence
          </h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.6)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
                <item.icon size={20} />
              </div>
              <h4 className="mt-4 text-lg font-semibold text-slate-900">
                {item.title}
              </h4>
              <p className="mt-2 text-sm text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-900 to-blue-900 px-8 py-12 text-white shadow-[0_25px_60px_-40px_rgba(15,23,42,0.8)] md:flex-row md:items-center"
      >
        <div>
          <p className="text-sm text-blue-200">Ready to start your journey?</p>
          <h3 className="mt-2 text-2xl font-semibold md:text-3xl">
            Find the perfect car for your next adventure.
          </h3>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg"
        >
          Explore Cars Now <FiArrowRight size={16} />
        </button>
      </motion.section>
    </div>
  )
}

export default Home
