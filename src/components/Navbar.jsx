import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiChevronDown, FiLogOut, FiUser, FiList, FiBell, FiCheck, FiMenu, FiX } from 'react-icons/fi'
import { io } from 'socket.io-client'
import useAuth from '../hooks/useAuth.js'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Explore Cars', to: '/explore-cars' },
]

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE_NOTIFICATIONS = `${API_URL}/notifications`

function Navbar() {
  const { user, logoutUser } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const menuRef = useRef(null)
  const notificationsRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  useEffect(() => {
    if (!user) return

    const fetchNotifications = async () => {
      try {
        const token = await user.getIdToken()
        const res = await fetch(API_BASE_NOTIFICATIONS, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setNotifications(data.data || [])
          setUnreadCount(data.data.filter(n => !n.isRead).length)
        }
      } catch (error) {
        console.error('Failed to fetch notifications', error)
      }
    }

    fetchNotifications()
  }, [user])

  useEffect(() => {
    if (!user || !user.email) return

    const socket = io(API_URL)

    socket.on('connect', () => {
      socket.emit('join_room', user.email)
    })

    socket.on('new_notification', (notification) => {
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)
    })

    return () => {
      socket.off('new_notification')
      socket.disconnect()
    }
  }, [user])

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return
    try {
      const token = await user.getIdToken()
      const res = await fetch(`${API_BASE_NOTIFICATIONS}/mark-read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Failed to mark notifications as read', error)
    }
  }

  const handleLogout = async () => {
    await logoutUser()
    setMenuOpen(false)
    navigate('/login')
  }

  const formatNotificationText = (notification) => {
    if (notification.type === 'EARNINGS') {
      // Split the text assuming it starts with BDT <amount>
      const match = notification.message.match(/^(BDT\s[\d,]+)(.*)$/)
      if (match) {
        return (
          <span className="text-slate-800">
            <span className="font-bold">{match[1]}</span>{match[2]}
          </span>
        )
      }
      return <span className="text-slate-800 font-medium">{notification.message}</span>
    }
    
    if (notification.type === 'BOOKING') {
      return <span className="text-blue-600 font-medium">{notification.message}</span>
    }
    
    if (notification.type === 'CANCELLED') {
      return <span className="text-rose-600 font-medium">{notification.message}</span>
    }
    
    if (notification.type === 'COMPLETED') {
      return <span className="text-emerald-600 font-medium">{notification.message}</span>
    }

    return <span className="text-slate-700">{notification.message}</span>
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-start">
          <Link 
            to="/" 
            className="flex flex-col"
          >
            <p className="text-xl font-semibold text-slate-900">
              Drive<span className="text-blue-600">Fleet</span>
            </p>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Car Rental
            </p>
          </Link>
        </div>

        <nav className="hidden items-center justify-center gap-8 text-sm font-semibold text-slate-600 md:flex">
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

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
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
            <div className="flex items-center gap-1 sm:gap-4">
              {/* Notification Bell */}
              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen)
                    setMenuOpen(false)
                    setMobileMenuOpen(false)
                  }}
                  className="relative flex items-center justify-center p-2 text-slate-500 transition hover:text-blue-600"
                >
                  <FiBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute right-2 top-2 flex h-2 w-2 items-center justify-center rounded-full bg-rose-500 ring-2 ring-white"></span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="fixed left-4 right-4 top-20 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-96">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50">
                      <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="flex items-center gap-1 text-xs font-medium text-blue-600 transition hover:text-blue-700"
                        >
                          <FiCheck size={14} />
                          Mark all as read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-[28rem] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                            <FiBell size={24} />
                          </div>
                          <p className="mt-3 text-sm font-medium text-slate-900">No notifications yet</p>
                          <p className="mt-1 text-xs text-slate-500">When you receive bookings, they'll appear here.</p>
                        </div>
                      ) : (
                        <ul className="divide-y divide-slate-100">
                          {notifications.map((notification) => (
                            <li
                              key={notification._id}
                              className={`px-4 py-3 transition hover:bg-slate-50 ${
                                notification.isRead ? 'opacity-70' : 'bg-blue-50/30'
                              }`}
                            >
                              <div className="flex gap-3">
                                {!notification.isRead && (
                                  <div className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-blue-600"></div>
                                )}
                                <div className={`${notification.isRead ? 'ml-5' : ''} flex-1`}>
                                  <p className="text-sm leading-snug">
                                    {formatNotificationText(notification)}
                                  </p>
                                  <p className="mt-1 text-xs font-medium text-slate-400">
                                    {formatTime(notification.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(!menuOpen)
                    setNotificationsOpen(false)
                    setMobileMenuOpen(false)
                  }}
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
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        <FiUser size={14} />
                        Profile
                      </Link>
                      <Link
                        to="/my-added-cars"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        <FiList size={14} />
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
            </div>
          )}
          
          {/* Hamburger Menu Button */}
          <button
            type="button"
            className="flex items-center justify-center p-1 sm:p-2 text-slate-700 transition hover:text-blue-600 md:hidden"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen)
              setMenuOpen(false)
              setNotificationsOpen(false)
            }}
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="absolute left-0 top-full w-full flex flex-col items-center gap-4 border-b border-slate-200/70 bg-white px-4 py-6 text-sm font-semibold text-slate-600 shadow-md md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `transition ${isActive ? 'text-blue-600' : 'hover:text-slate-900'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user && (
            <>
              <NavLink
                to="/add-car"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `transition ${isActive ? 'text-blue-600' : 'hover:text-slate-900'}`
                }
              >
                Add Car
              </NavLink>
              <NavLink
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `transition ${isActive ? 'text-blue-600' : 'hover:text-slate-900'}`
                }
              >
                My Bookings
              </NavLink>
            </>
          )}
        </nav>
      )}
    </header>
  )
}

export default Navbar
