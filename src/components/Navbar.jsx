import { NavLink } from 'react-router-dom'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Explore Cars', to: '/explore-cars' },
  { label: 'Add Car', to: '/add-car' },
  { label: 'My Bookings', to: '/my-bookings' },
]

function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xl font-semibold text-slate-900">
            Drive<span className="text-blue-600">Fleet</span>
          </p>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Car Rental
          </p>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative pb-1 transition ${
                  isActive
                    ? 'text-blue-600 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-blue-600'
                    : 'hover:text-slate-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-500 shadow-sm sm:flex">
            JD
          </div>
          <button
            type="button"
            className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2 text-xs font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-blue-600"
          >
            Login / Register
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
