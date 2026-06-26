import { FiMapPin, FiStar, FiUsers } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export const carTagStyles = {
  SUV: 'bg-blue-600 text-white',
  Sedan: 'bg-emerald-600 text-white',
  Hatchback: 'bg-amber-500 text-white',
  Luxury: 'bg-violet-600 text-white',
}

function CarCard({ car, variant = 'explore' }) {
  return (
    <article
      className={
        variant === 'home'
          ? 'relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_18px_40px_-30px_rgba(15,23,42,0.6)]'
          : 'relative flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.6)]'
      }
    >
      <Link to={`/car-details/${car.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View details for {car.name}</span>
      </Link>
      <div className={variant === 'home' ? 'relative bg-gradient-to-b from-slate-50 to-white' : 'relative overflow-hidden rounded-2xl bg-slate-50'}>
        <span
          className={`absolute left-3 top-3 rounded-md px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow opacity-90 ${carTagStyles[car.type] || 'bg-slate-600 text-white'
            }`}
        >
          {car.type}
        </span>

        <img
          src={car.image}
          alt={car.name}
          className={variant === 'home' ? 'h-48 w-full object-cover' : 'h-40 w-full object-cover'}
        />
      </div>

      <div className={variant === 'home' ? 'flex flex-1 flex-col gap-4 p-5' : 'mt-4 flex flex-1 flex-col gap-3'}>
        <div>
          <h3 className={variant === 'home' ? 'text-lg font-semibold text-slate-900' : 'text-base font-semibold text-slate-900'}>
            {car.name}
          </h3>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className={variant === 'home' ? 'flex items-baseline gap-1 text-lg text-blue-600' : 'flex items-baseline gap-1 text-sm text-blue-600'}>
            <span className="font-normal">BDT</span>
            <span className="font-bold">{car.dailyRentPrice}</span>
            <span className={variant === 'home' ? 'text-xs font-medium text-slate-500' : 'text-[10px] font-medium text-slate-500'}>/day</span>
          </div>
          <span className="flex items-center gap-1 text-xs">
            <FiUsers size={14} /> {car.seats}
          </span>
        </div>

        {variant === 'explore' && (
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <FiMapPin size={14} /> {car.location}
            </span>
            <span className="flex items-center gap-1">
              <FiStar size={14} className="text-amber-500" />
              {car.rating}
            </span>
          </div>
        )}

        {variant === 'explore' ? (
          <div className="flex items-center justify-between">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${car.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {car.status}
            </span>
            <Link
              to={`/car-details/${car.id}`}
              className="relative z-20 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700"
            >
              View Details
            </Link>
          </div>
        ) : (
          <Link
            to={`/car-details/${car.id}`}
            className="relative z-20 mt-auto rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-center text-xs font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
          >
            View Details
          </Link>
        )}
      </div>
    </article>
  )
}

export default CarCard