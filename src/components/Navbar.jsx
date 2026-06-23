import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiChevronDown, FiLogOut } from 'react-icons/fi'
import useAuth from '../hooks/useAuth.js'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Explore Cars', to: '/explore-cars' },
]

function Navbar() {
  const { user, logoutUser } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleLogout = async () => {
    await logoutUser()
    setMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex flex-col">
          <p className="text-xl font-semibold text-slate-900">
            Drive<span className="text-blue-600">Fleet</span>
          </p>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Car Rental
          </p>
        </Link>

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
          {user && (
            <>
              <NavLink
                to="/add-car"
                className={({ isActive }) =>
                  `relative pb-1 transition ${
                    isActive
                      ? 'text-blue-600 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-blue-600'
                      : 'hover:text-slate-900'
                  }`
                }
              >
                Add Car
              </NavLink>
              <NavLink
                to="/my-bookings"
                className={({ isActive }) =>
                  `relative pb-1 transition ${
                    isActive
                      ? 'text-blue-600 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-blue-600'
                      : 'hover:text-slate-900'
                  }`
                }
              >
                My Bookings
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-blue-600"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition hover:border-blue-200"
              >
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-xs font-semibold text-white">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User profile'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>
                      {(user.displayName || 'U')
                        .split(' ')
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <FiChevronDown
                  size={14}
                  className={`text-slate-500 transition ${menuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {user.displayName || 'Signed in user'}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-2 text-sm text-slate-600">
                    <Link
                      to="/add-car"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      Add Car
                    </Link>
                    <Link
                      to="/my-bookings"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/my-added-cars"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      My Added Cars
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-rose-600 transition hover:bg-rose-50"
                    >
                      <FiLogOut size={14} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
