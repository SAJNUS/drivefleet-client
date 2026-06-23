import { useEffect, useMemo, useState } from 'react'
import { FiArrowLeft, FiImage, FiMapPin, FiSave } from 'react-icons/fi'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

const editableCars = [
  {
    id: 'car-1',
    carName: 'Toyota RAV4',
    dailyRentPrice: '55',
    carType: 'SUV',
    imageUrl:
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80',
    seatCapacity: '5',
    pickupLocation: 'Gulshan, Dhaka',
    description:
      'A reliable SUV for family trips, airport pickups, and long drives.',
    availabilityStatus: 'Active',
  },
  {
    id: 'car-2',
    carName: 'Honda Civic',
    dailyRentPrice: '45',
    carType: 'Sedan',
    imageUrl:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    seatCapacity: '5',
    pickupLocation: 'Banani, Dhaka',
    description:
      'Comfortable sedan with efficient fuel economy for city and highway use.',
    availabilityStatus: 'Active',
  },
  {
    id: 'car-3',
    carName: 'Suzuki Swift',
    dailyRentPrice: '30',
    carType: 'Hatchback',
    imageUrl:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80',
    seatCapacity: '4',
    pickupLocation: 'Dhanmondi, Dhaka',
    description:
      'Compact and easy to drive, ideal for quick errands and short trips.',
    availabilityStatus: 'Active',
  },
  {
    id: 'car-4',
    carName: 'BMW X5',
    dailyRentPrice: '85',
    carType: 'SUV',
    imageUrl:
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
    seatCapacity: '5',
    pickupLocation: 'Uttara, Dhaka',
    description:
      'Premium SUV with strong performance and a comfortable ride experience.',
    availabilityStatus: 'Active',
  },
  {
    id: 'car-5',
    carName: 'Hyundai Elantra',
    dailyRentPrice: '40',
    carType: 'Sedan',
    imageUrl:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80',
    seatCapacity: '5',
    pickupLocation: 'Khulna',
    description:
      'Modern sedan with smooth handling and a clean, practical cabin.',
    availabilityStatus: 'Inactive',
  },
]

const carTypes = ['SUV', 'Sedan', 'Hatchback', 'Luxury', 'Pickup', 'Electric']
const availabilityOptions = ['Active', 'Inactive']

function UpdateCar() {
  const { id } = useParams()
  const navigate = useNavigate()

  const selectedCar = useMemo(
    () => editableCars.find((car) => car.id === id),
    [id],
  )

  const [formData, setFormData] = useState(selectedCar || editableCars[0])

  useEffect(() => {
    setFormData(selectedCar || editableCars[0])
  }, [selectedCar])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!selectedCar) {
      toast.error('No car found for this update route.')
      return
    }

    if (
      !formData.carName.trim() ||
      !formData.dailyRentPrice.trim() ||
      !formData.carType.trim() ||
      !formData.imageUrl.trim() ||
      !formData.seatCapacity.trim() ||
      !formData.pickupLocation.trim() ||
      !formData.description.trim() ||
      !formData.availabilityStatus.trim()
    ) {
      toast.error('Please complete all fields before saving.')
      return
    }

    if (Number(formData.dailyRentPrice) <= 0 || Number(formData.seatCapacity) <= 0) {
      toast.error('Price and seat capacity must be greater than 0.')
      return
    }

    toast.success(`${formData.carName} saved locally.`)
    navigate('/my-added-cars')
  }

  if (!selectedCar) {
    return (
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Update Car
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            Car not found
          </h1>
          <p className="text-sm text-slate-600 md:text-base">
            The selected car ID does not match any local listing in this
            frontend prototype.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
          Try one of the demo listings from My Added Cars to continue the update
          flow.
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/my-added-cars"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Back to My Added Cars
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative min-h-[260px] bg-slate-900 lg:min-h-full">
          <img
            src={formData.imageUrl}
            alt={formData.carName}
            className="h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 space-y-4 p-6 text-white md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
              {formData.carType}
            </div>
            <div>
              <h1 className="text-3xl font-semibold md:text-4xl">
                Update Car
              </h1>
              <p className="mt-2 max-w-md text-sm text-slate-200 md:text-base">
                Edit the saved listing and keep your inventory current.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <FiImage />
              <span>Live image preview updates as you edit the form.</span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                {id}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Update details for {selectedCar.carName}
              </p>
            </div>
            <Link
              to="/my-added-cars"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
            >
              <FiArrowLeft size={14} />
              Back
            </Link>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="carName">
                  Car Name
                </label>
                <input
                  id="carName"
                  name="carName"
                  type="text"
                  value={formData.carName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                  placeholder="Enter car name"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="dailyRentPrice"
                >
                  Daily Rent Price
                </label>
                <input
                  id="dailyRentPrice"
                  name="dailyRentPrice"
                  type="number"
                  min="1"
                  value={formData.dailyRentPrice}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                  placeholder="Enter daily rent price"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="carType">
                  Car Type
                </label>
                <select
                  id="carType"
                  name="carType"
                  value={formData.carType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                >
                  {carTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="seatCapacity">
                  Seat Capacity
                </label>
                <input
                  id="seatCapacity"
                  name="seatCapacity"
                  type="number"
                  min="1"
                  value={formData.seatCapacity}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                  placeholder="Enter seat capacity"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="imageUrl">
                  Image URL
                </label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                  placeholder="Paste image URL"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="pickupLocation"
                >
                  Pickup Location
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                  <FiMapPin className="shrink-0 text-slate-400" size={16} />
                  <input
                    id="pickupLocation"
                    name="pickupLocation"
                    type="text"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Enter pickup location"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                  placeholder="Describe the car"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="availabilityStatus"
                >
                  Availability Status
                </label>
                <select
                  id="availabilityStatus"
                  name="availabilityStatus"
                  value={formData.availabilityStatus}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                >
                  {availabilityOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <FiSave size={14} />
                Save Changes
              </button>
              <Link
                to="/my-added-cars"
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default UpdateCar