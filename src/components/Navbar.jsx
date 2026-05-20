import { NavLink } from 'react-router-dom'
import { FaCarSide } from 'react-icons/fa'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Explore Cars', to: '/explore-cars' },
  { label: 'Add Car', to: '/add-car' },
  { label: 'My Bookings', to: '/my-bookings' },
]

function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <FaCarSide size={20} />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">DriveFleet</p>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Car Rental
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition ${
                  isActive ? 'text-blue-600' : 'hover:text-slate-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-xs font-semibold text-slate-500 sm:flex">
            JD
          </div>
          <button
            type="button"
            className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            Login / Register
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
