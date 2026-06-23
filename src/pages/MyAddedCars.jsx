import { useMemo, useState } from 'react'
import { FiAlertTriangle, FiEdit3, FiMapPin, FiTrash2 } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth.js'

const initialCars = [
  {
    id: 'car-1',
    ownerEmail: '',
    carName: 'Toyota RAV4',
    dailyRentPrice: 55,
    carType: 'SUV',
    imageUrl:
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80',
    seatCapacity: 5,
    pickupLocation: 'Gulshan, Dhaka',
    availabilityStatus: 'Active',
  },
  {
    id: 'car-2',
    ownerEmail: '',
    carName: 'Honda Civic',
    dailyRentPrice: 45,
    carType: 'Sedan',
    imageUrl:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    seatCapacity: 5,
    pickupLocation: 'Banani, Dhaka',
    availabilityStatus: 'Active',
  },
  {
    id: 'car-3',
    ownerEmail: '',
    carName: 'Suzuki Swift',
    dailyRentPrice: 30,
    carType: 'Hatchback',
    imageUrl:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80',
    seatCapacity: 4,
    pickupLocation: 'Dhanmondi, Dhaka',
    availabilityStatus: 'Active',
  },
  {
    id: 'car-4',
    ownerEmail: '',
    carName: 'BMW X5',
    dailyRentPrice: 85,
    carType: 'SUV',
    imageUrl:
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
    seatCapacity: 5,
    pickupLocation: 'Uttara, Dhaka',
    availabilityStatus: 'Active',
  },
  {
    id: 'car-5',
    ownerEmail: 'another.owner@example.com',
    carName: 'Hyundai Elantra',
    dailyRentPrice: 40,
    carType: 'Sedan',
    imageUrl:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80',
    seatCapacity: 5,
    pickupLocation: 'Khulna',
    availabilityStatus: 'Inactive',
  },
]

function MyAddedCars() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cars, setCars] = useState(initialCars)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const visibleCars = useMemo(() => {
    const currentUserEmail = user?.email

    return cars.map((car) =>
      car.ownerEmail === '' && currentUserEmail
        ? { ...car, ownerEmail: currentUserEmail }
        : car,
    )
  }, [cars, user?.email])

  const userCars = useMemo(
    () => visibleCars.filter((car) => car.ownerEmail === user?.email),
    [user?.email, visibleCars],
  )

  const activeCars = userCars.filter((car) => car.availabilityStatus === 'Active')
  const inactiveCars = userCars.filter(
    (car) => car.availabilityStatus === 'Inactive',
  )

  const totalEarnings = userCars.reduce(
    (sum, car) => sum + car.dailyRentPrice * 12,
    0,
  )

  const handleDelete = () => {
    if (!deleteTarget) {
      return
    }

    setCars((currentCars) =>
      currentCars.filter((car) => car.id !== deleteTarget.id),
    )
    toast.success(`${deleteTarget.carName} removed from your list.`)
    setDeleteTarget(null)
  }

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          My Added Cars
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 md:text-base">
          Manage, update or remove the cars you have added.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
              🚘
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Cars</p>
              <p className="text-2xl font-semibold text-slate-900">
                {userCars.length}
              </p>
              <p className="text-xs text-slate-500">All cars you added</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600">
              ✅
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Cars</p>
              <p className="text-2xl font-semibold text-slate-900">
                {activeCars.length}
              </p>
              <p className="text-xs text-slate-500">Currently live</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-2xl text-amber-600">
              ⏱️
            </div>
            <div>
              <p className="text-sm text-slate-500">Inactive Cars</p>
              <p className="text-2xl font-semibold text-slate-900">
                {inactiveCars.length}
              </p>
              <p className="text-xs text-slate-500">Not active</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-2xl text-violet-600">
              $
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Earnings</p>
              <p className="text-2xl font-semibold text-slate-900">
                ${totalEarnings.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">From your cars</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 sm:w-[300px]">
              <span className="text-slate-400">Search by car name or model...</span>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:text-blue-700"
            >
              Filter
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-500">Sort by:</label>
            <select className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none">
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>Price: Low to High</option>
            </select>
            <button
              type="button"
              onClick={() => navigate('/add-car')}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <span className="text-lg leading-none">+</span>
              Add New Car
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
          <div className="grid grid-cols-1 gap-4 p-3 md:grid-cols-2 xl:grid-cols-3">
            {userCars.map((car) => (
              <article
                key={car.id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={car.imageUrl}
                    alt={car.carName}
                    className="h-full w-full object-cover"
                  />
                  <span
                    className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                      car.availabilityStatus === 'Active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-600'
                    }`}
                  >
                    {car.availabilityStatus}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          {car.carName}
                        </h2>
                        <p className="text-sm text-slate-500">{car.carType}</p>
                      </div>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {car.seatCapacity} Seats
                      </span>
                    </div>

                    <p className="text-xl font-semibold text-blue-600">
                      ${car.dailyRentPrice}
                      <span className="text-sm font-medium text-slate-500"> / day</span>
                    </p>
                  </div>

                  <div className="mt-5 flex flex-1 flex-col justify-between gap-5">
                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-slate-400" />
                        <span>{car.pickupLocation}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-medium text-slate-500">
                        <span>Car Type</span>
                        <span className="text-slate-900">{car.carType}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-medium text-slate-500">
                        <span>Availability</span>
                        <span
                          className={`font-semibold ${
                            car.availabilityStatus === 'Active'
                              ? 'text-emerald-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {car.availabilityStatus}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to={`/update-car/${car.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        <FiEdit3 size={14} />
                        Update
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(car)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {userCars.length === 0 && (
            <div className="border-t border-slate-200 px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                No cars found for your account
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Add a car first to see it listed here.
              </p>
              <button
                type="button"
                onClick={() => navigate('/add-car')}
                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Add Car
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <p>
            Showing {userCars.length} of {cars.length} cars
          </p>
          <p>Use the actions above to manage your listings</p>
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <FiAlertTriangle size={22} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">
                  Delete this car?
                </h3>
                <p className="text-sm text-slate-600">
                  {deleteTarget.carName} will be removed from your local list only.
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default MyAddedCars
