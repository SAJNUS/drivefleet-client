import { useEffect, useState } from 'react'
import { FiArrowLeft, FiImage, FiMapPin, FiSave } from 'react-icons/fi'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

const API_BASE = 'http://localhost:5050/cars'

const carTypes = ['SUV', 'Sedan', 'Hatchback', 'Luxury', 'Pickup', 'Electric']
const availabilityOptions = ['Available', 'Unavailable']

const emptyForm = {
  carName: '',
  dailyRentPrice: '',
  carType: '',
  imageUrl: '',
  seatCapacity: '',
  pickupLocation: '',
  description: '',
  availabilityStatus: 'Available',
}

function UpdateCar() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Fetch the car from MongoDB by id and pre-fill the form
  useEffect(() => {
    if (!id) {
      setError('No car ID provided.')
      setLoading(false)
      return
    }

    const controller = new AbortController()

    async function loadCar() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${API_BASE}/${id}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          const result = await response.json().catch(() => ({}))
          throw new Error(
            result.message || `Failed to load car (${response.status})`,
          )
        }

        const payload = await response.json()
        const car = payload?.data

        if (!car) {
          throw new Error('Car not found.')
        }

        // Pre-fill form with values stored in MongoDB
        setFormData({
          carName: car.carName ?? '',
          dailyRentPrice: String(car.dailyRentPrice ?? ''),
          carType: car.carType ?? '',
          imageUrl: car.imageUrl ?? '',
          seatCapacity: String(car.seatCapacity ?? ''),
          pickupLocation: car.pickupLocation ?? '',
          description: car.description ?? '',
          availabilityStatus: car.availabilityStatus ?? 'Available',
        })
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Failed to load car.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadCar()

    return () => controller.abort()
  }, [id])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const validateForm = () => {
    const requiredFields = [
      'carName',
      'dailyRentPrice',
      'carType',
      'imageUrl',
      'seatCapacity',
      'pickupLocation',
      'description',
      'availabilityStatus',
    ]

    const hasEmptyField = requiredFields.some((field) => {
      const value = formData[field]
      return typeof value === 'string' ? !value.trim() : !value
    })

    if (hasEmptyField) {
      toast.error('Please complete all fields before saving.')
      return false
    }

    if (Number(formData.dailyRentPrice) <= 0) {
      toast.error('Daily rent price must be greater than 0.')
      return false
    }

    if (Number(formData.seatCapacity) <= 0) {
      toast.error('Seat capacity must be greater than 0.')
      return false
    }

    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)

    const updatedCarObject = {
      carName: formData.carName.trim(),
      dailyRentPrice: Number(formData.dailyRentPrice),
      carType: formData.carType,
      imageUrl: formData.imageUrl.trim(),
      seatCapacity: Number(formData.seatCapacity),
      pickupLocation: formData.pickupLocation.trim(),
      description: formData.description.trim(),
      availabilityStatus: formData.availabilityStatus,
    }

    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCarObject),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update car.')
      }

      toast.success(`${formData.carName} updated successfully!`)
      navigate('/my-added-cars')
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Update Car
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
          Loading car details
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Please wait while we fetch the listing from the database.
        </p>
      </section>
    )
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <section className="mx-auto max-w-3xl rounded-3xl border border-rose-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
          Error
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
          Car not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">{error}</p>
        <div className="mt-6">
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

  // ── Edit form ─────────────────────────────────────────────────────────────
  return (
    <section className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Left: live image preview */}
        <div className="relative min-h-[260px] bg-slate-900 lg:min-h-full">
          <img
            src={formData.imageUrl || 'https://placehold.co/900x600?text=Car+Image'}
            alt={formData.carName || 'Car preview'}
            className="h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 space-y-4 p-6 text-white md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
              {formData.carType || 'Car Type'}
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

        {/* Right: form */}
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                {id}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Update details for {formData.carName}
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
                  <option value="">Select car type</option>
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
                disabled={submitting}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FiSave size={14} />
                {submitting ? 'Saving...' : 'Save Changes'}
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