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
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CarCard from '../components/CarCard.jsx'

const heroImage = '/banner-section-picture.png'

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

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [featuredCars, setFeaturedCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)

    async function fetchLatestCars() {
      try {
        const response = await fetch(`${API_URL}/cars`)
        if (response.ok) {
          const result = await response.json()
          const data = Array.isArray(result.data) ? result.data : []

          const transformed = data.map((car) => ({
            id: car._id,
            name: car.carName ?? '',
            type: car.carType ?? 'General',
            image: car.imageUrl || 'https://placehold.co/600x400?text=Car',
            location: car.pickupLocation ?? 'Unknown Location',
            dailyRentPrice: car.dailyRentPrice ?? 0,
            seats: car.seatCapacity ?? 'N/A',
            rating: car.rating ?? 0,
            status: car.availabilityStatus ?? 'Available',
          }))

          setFeaturedCars(transformed.reverse().slice(0, 6))
        }
      } catch (error) {
        console.error('Failed to fetch latest cars:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLatestCars()
  }, [])

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
              <Link
                to="/explore-cars"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-blue-600"
              >
                Explore Cars
                <FiArrowRight size={16} />
              </Link>
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
          <Link
            to="/explore-cars"
            className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700"
          >
            View All Cars <FiArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-slate-200/70 bg-white/50 text-sm font-medium text-slate-500">
            Loading latest arrivals...
          </div>
        ) : featuredCars.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {featuredCars.map((car) => (
              <motion.article
                key={car.id}
                variants={sectionVariant}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className=""
              >
                <CarCard car={car} variant="home" />
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-slate-200/70 bg-white/50 text-sm font-medium text-slate-500">
            No cars available at the moment.
          </div>
        )}
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
        <Link
          to="/explore-cars"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg"
        >
          Explore Cars Now <FiArrowRight size={16} />
        </Link>
      </motion.section>
    </div>
  )
}

export default Home
