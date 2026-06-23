import { useMemo, useState } from 'react'
import { FiAlertTriangle, FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth.js'

const initialBookings = [
  {
    id: 'booking-1',
    ownerEmail: '',
    carName: 'Toyota RAV4',
    carImage:
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80',
    bookingDate: 'May 20, 2024 10:30 AM',
    totalPrice: 320,
    driverNeeded: 'Yes',
    bookingStatus: 'Upcoming',
    pickupLocation: 'Dhaka',
  },
  {
    id: 'booking-2',
    ownerEmail: '',
    carName: 'Honda Civic',
    carImage:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    bookingDate: 'May 17, 2024 09:15 AM',
    totalPrice: 120,
    driverNeeded: 'No',
    bookingStatus: 'Completed',
    pickupLocation: 'Chattogram',
  },
  {
    id: 'booking-3',
    ownerEmail: '',
    carName: 'Suzuki Swift',
    carImage:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80',
    bookingDate: 'May 9, 2024 11:45 AM',
    totalPrice: 90,
    driverNeeded: 'Yes',
    bookingStatus: 'Completed',
    pickupLocation: 'Sylhet',
  },
  {
    id: 'booking-4',
    ownerEmail: '',
    carName: 'BMW X5',
    carImage:
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
    bookingDate: 'May 22, 2024 02:20 PM',
    totalPrice: 480,
    driverNeeded: 'No',
    bookingStatus: 'Upcoming',
    pickupLocation: 'Dhaka',
  },
  {
    id: 'booking-5',
    ownerEmail: 'another.customer@example.com',
    carName: 'Hyundai Tucson',
    carImage:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80',
    bookingDate: 'May 14, 2024 08:10 AM',
    totalPrice: 150,
    driverNeeded: 'Yes',
    bookingStatus: 'Cancelled',
    pickupLocation: 'Khulna',
  },
  {
    id: 'booking-6',
    ownerEmail: '',
    carName: 'Kia Sportage',
    carImage:
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80',
    bookingDate: 'May 25, 2024 01:30 PM',
    totalPrice: 210,
    driverNeeded: 'No',
    bookingStatus: 'Upcoming',
    pickupLocation: 'Dhaka',
  },
]

function MyBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState(initialBookings)
  const [cancelTarget, setCancelTarget] = useState(null)

  const visibleBookings = useMemo(() => {
    const currentUserEmail = user?.email

    return bookings.map((booking) =>
      booking.ownerEmail === '' && currentUserEmail
        ? { ...booking, ownerEmail: currentUserEmail }
        : booking,
    )
  }, [bookings, user?.email])

  const userBookings = useMemo(
    () => visibleBookings.filter((booking) => booking.ownerEmail === user?.email),
    [user?.email, visibleBookings],
  )

  const upcomingCount = userBookings.filter(
    (booking) => booking.bookingStatus === 'Upcoming',
  ).length
  const completedCount = userBookings.filter(
    (booking) => booking.bookingStatus === 'Completed',
  ).length
  const cancelledCount = userBookings.filter(
    (booking) => booking.bookingStatus === 'Cancelled',
  ).length
  const totalSpent = userBookings.reduce(
    (sum, booking) => sum + booking.totalPrice,
    0,
  )

  const handleCancel = () => {
    if (!cancelTarget) {
      return
    }

    setBookings((currentBookings) =>
      currentBookings.filter((booking) => booking.id !== cancelTarget.id),
    )
    toast.success(`${cancelTarget.carName} booking cancelled.`)
    setCancelTarget(null)
  }

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          My Bookings
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 md:text-base">
          Review and manage your current bookings.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FiUsers size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Bookings</p>
              <p className="text-2xl font-semibold text-slate-900">
                {userBookings.length}
              </p>
              <p className="text-xs text-slate-500">All your bookings</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <FiCalendar size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Upcoming Bookings</p>
              <p className="text-2xl font-semibold text-slate-900">
                {upcomingCount}
              </p>
              <p className="text-xs text-slate-500">Currently active</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <FiMapPin size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <p className="text-2xl font-semibold text-slate-900">
                {completedCount}
              </p>
              <p className="text-xs text-slate-500">Finished trips</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <FiAlertTriangle size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Spent</p>
              <p className="text-2xl font-semibold text-slate-900">
                ${totalSpent.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">
                {cancelledCount} cancelled
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Bookings
            </h2>
            <p className="text-sm text-slate-500">
              Showing {userBookings.length} bookings for your account.
            </p>
          </div>
          <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
            Booking count summary: {userBookings.length}
          </div>
        </div>

        <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 lg:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Car</th>
                <th className="px-4 py-3">Booking Date</th>
                <th className="px-4 py-3">Total Price</th>
                <th className="px-4 py-3">Driver Needed</th>
                <th className="px-4 py-3">Booking Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {userBookings.map((booking) => (
                <tr key={booking.id} className="align-top">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={booking.carImage}
                        alt={booking.carName}
                        className="h-14 w-20 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">
                          {booking.carName}
                        </p>
                        <p className="text-sm text-slate-500">
                          Pickup: {booking.pickupLocation}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {booking.bookingDate}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-blue-600">
                    ${booking.totalPrice}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {booking.driverNeeded}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        booking.bookingStatus === 'Upcoming'
                          ? 'bg-blue-100 text-blue-700'
                          : booking.bookingStatus === 'Completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setCancelTarget(booking)}
                      className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                    >
                      Cancel Booking
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {userBookings.length === 0 && (
            <div className="border-t border-slate-200 px-6 py-14 text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                No bookings found for your account
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Book a car first to see it listed here.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-4 lg:hidden">
          {userBookings.map((booking) => (
            <article
              key={booking.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex gap-4 p-4">
                <img
                  src={booking.carImage}
                  alt={booking.carName}
                  className="h-24 w-28 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {booking.carName}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Pickup: {booking.pickupLocation}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        booking.bookingStatus === 'Upcoming'
                          ? 'bg-blue-100 text-blue-700'
                          : booking.bookingStatus === 'Completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-sm text-slate-600">
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-xs text-slate-500">Booking Date</p>
                      <p className="font-medium text-slate-900">
                        {booking.bookingDate}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-xs text-slate-500">Total Price</p>
                      <p className="font-medium text-slate-900">
                        ${booking.totalPrice}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-xs text-slate-500">Driver Needed</p>
                      <p className="font-medium text-slate-900">
                        {booking.driverNeeded}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-xs text-slate-500">Status</p>
                      <p className="font-medium text-slate-900">
                        {booking.bookingStatus}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCancelTarget(booking)}
                    className="mt-3 w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </article>
          ))}

          {userBookings.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                No bookings found for your account
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Book a car first to see it listed here.
              </p>
            </div>
          )}
        </div>
      </div>

      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <FiAlertTriangle size={22} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">
                  Cancel this booking?
                </h3>
                <p className="text-sm text-slate-600">
                  {cancelTarget.carName} will be removed from your local list only.
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Confirm Cancel
              </button>
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default MyBookings
