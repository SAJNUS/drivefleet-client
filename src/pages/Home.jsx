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

const heroImage =
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'

const cars = [
  {
    id: 1,
    name: 'Toyota RAV4',
    type: 'SUV',
    price: '$55',
    seats: '5 Seats',
    location: 'Dhaka, Bangladesh',
    image:
      'https://images.unsplash.com/photo-1619767886558-efdc7b9c3fda?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Honda Civic',
    type: 'Sedan',
    price: '$45',
    seats: '5 Seats',
    location: 'Chattogram, Bangladesh',
    image:
      'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Suzuki Swift',
    type: 'Hatchback',
    price: '$30',
    seats: '4 Seats',
    location: 'Sylhet, Bangladesh',
    image:
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'BMW 3 Series',
    type: 'Luxury',
    price: '$85',
    seats: '5 Seats',
    location: 'Dhaka, Bangladesh',
    image:
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Hyundai Tucson',
    type: 'SUV',
    price: '$60',
    seats: '5 Seats',
    location: 'Khulna, Bangladesh',
    image:
      'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    name: 'Toyota Corolla',
    type: 'Sedan',
    price: '$40',
    seats: '5 Seats',
    location: 'Rajshahi, Bangladesh',
    image:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
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

const sectionVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

function Home() {
  return (
    <div className="space-y-20">
      <motion.section
        variants={sectionVariant}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50"
      >
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="relative grid gap-12 px-6 py-12 md:grid-cols-[1.1fr_1fr] md:px-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Premium rentals for modern travel
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
                Your Journey, <br /> Our Drive
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-slate-600 md:text-base">
                Explore a wide range of cars and book your perfect ride
                anywhere, anytime. DriveFleet makes every trip effortless.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Explore Cars
                <FiArrowRight size={16} />
              </button>
              <div className="text-xs text-slate-500">
                4.9/5 average rating
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-2xl bg-white/80 shadow-lg backdrop-blur" />
            <img
              src={heroImage}
              alt="DriveFleet premium car"
              className="h-full max-h-[320px] w-full rounded-3xl object-cover shadow-xl md:max-h-[380px]"
            />
          </div>
        </div>

        <div className="grid gap-6 border-t border-slate-100 bg-white/70 px-6 py-6 sm:grid-cols-2 md:grid-cols-4 md:px-12">
          {highlights.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
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
            <h2 className="text-2xl font-semibold text-slate-900">
              Choose from the latest arrivals
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
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
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative">
                <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  {car.type}
                </span>
                <img
                  src={car.image}
                  alt={car.name}
                  className="h-44 w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {car.name}
                  </h3>
                  <p className="text-sm text-slate-500">{car.location}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span className="font-semibold text-blue-600">
                    {car.price}/day
                  </span>
                  <span className="flex items-center gap-1">
                    <FiUsers size={14} /> {car.seats}
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-auto rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
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
        className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-blue-600">Why Choose Us</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            Why Choose DriveFleet?
          </h3>
          <ul className="mt-6 space-y-4 text-sm text-slate-600">
            {reasons.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 text-blue-600">
                  <FiCheckCircle size={18} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-8">
          <div className="absolute -right-20 top-10 h-48 w-48 rounded-full bg-blue-100/60 blur-2xl" />
          <div className="relative space-y-4">
            <p className="text-sm font-semibold text-blue-600">How It Works</p>
            <h3 className="text-2xl font-semibold text-slate-900">
              Book your ride in minutes
            </h3>
            <div className="space-y-5 text-sm text-slate-600">
              {['Choose your car', 'Make a booking', 'Enjoy your ride'].map(
                (step, index) => (
                  <div key={step} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-blue-600 shadow">
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
          <h3 className="text-2xl font-semibold text-slate-900">
            Designed for comfort and confidence
          </h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
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
        className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-8 py-10 text-white md:flex-row md:items-center"
      >
        <div>
          <p className="text-sm text-blue-200">Ready to start your journey?</p>
          <h3 className="mt-2 text-2xl font-semibold">
            Find the perfect car for your next adventure.
          </h3>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900"
        >
          Explore Cars Now <FiArrowRight size={16} />
        </button>
      </motion.section>
    </div>
  )
}

export default Home
