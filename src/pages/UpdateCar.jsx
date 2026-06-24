import { useEffect, useState } from 'react'
import {
  FiArrowLeft,
  FiCalendar,
  FiMapPin,
  FiRefreshCw,
  FiTag,
  FiUsers,
} from 'react-icons/fi'
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

// ─── Shared input / label class tokens ────────────────────────────────────────
const labelCls = 'block text-xs font-semibold text-slate-500 mb-1.5'
const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
const selectCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

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

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Link
            to="/my-added-cars"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
          >
            <FiArrowLeft size={14} />
            Back to My Added Cars
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Update Car
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">
            Loading car details…
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Please wait while we fetch the listing from the database.
          </p>
        </div>
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <Link
            to="/my-added-cars"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
          >
            <FiArrowLeft size={14} />
            Back to My Added Cars
          </Link>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-500">
            Error
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">
            Car not found
          </h1>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <div className="mt-6">
            <Link
              to="/my-added-cars"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Back to My Added Cars
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Edit form ──────────────────────────────────────────────────────────────
  const isAvailable = formData.availabilityStatus === 'Available'
  const placeholderImage = 'https://placehold.co/900x500?text=No+Image'

  return (
    <div className="space-y-6">

      {/* ── Top navigation ── */}
      <div>
        <Link
          to="/my-added-cars"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
        >
          <FiArrowLeft size={14} />
          Back to My Added Cars
        </Link>
      </div>

      {/* ── Page heading ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Update Car
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update the details of your car listing below.
        </p>
      </div>

      {/* ── Summary card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-start sm:gap-6 md:p-6">

          {/* Car image */}
          <div className="h-48 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-44 sm:w-72">
            <img
              src={formData.imageUrl || placeholderImage}
              alt={formData.carName || 'Car preview'}
              className="h-full w-full object-cover"
              onError={(e) => { e.currentTarget.src = placeholderImage }}
            />
          </div>

          {/* Car meta */}
          <div className="flex flex-1 flex-col justify-center gap-3">
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              {formData.carName || '—'}
            </h2>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  isAvailable
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {formData.availabilityStatus || '—'}
              </span>
              {formData.seatCapacity && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <FiUsers size={11} />
                  {formData.seatCapacity} Seats
                </span>
              )}
            </div>

            {/* Detail rows */}
            <div className="space-y-1.5 text-sm text-slate-600">
              {formData.carType && (
                <div className="flex items-center gap-2">
                  <FiTag size={13} className="shrink-0 text-slate-400" />
                  <span>{formData.carType}</span>
                </div>
              )}
              {formData.pickupLocation && (
                <div className="flex items-center gap-2">
                  <FiMapPin size={13} className="shrink-0 text-slate-400" />
                  <span>{formData.pickupLocation}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-400">
                <FiCalendar size={13} className="shrink-0" />
                <span className="text-xs">Editing listing · ID: {id?.slice(-8)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Form card ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="p-5 md:p-6">
            <div className="grid gap-5 sm:grid-cols-2">

              {/* Car Name */}
              <div>
                <label className={labelCls} htmlFor="carName">Car Name</label>
                <input
                  id="carName"
                  name="carName"
                  type="text"
                  value={formData.carName}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="e.g. Nissan X-Trail 2024"
                />
              </div>

              {/* Daily Rent Price */}
              <div>
                <label className={labelCls} htmlFor="dailyRentPrice">
                  Daily Rent Price (USD)
                </label>
                <input
                  id="dailyRentPrice"
                  name="dailyRentPrice"
                  type="number"
                  min="1"
                  value={formData.dailyRentPrice}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="e.g. 75"
                />
              </div>

              {/* Car Type */}
              <div>
                <label className={labelCls} htmlFor="carType">Car Type</label>
                <select
                  id="carType"
                  name="carType"
                  value={formData.carType}
                  onChange={handleChange}
                  className={selectCls}
                >
                  <option value="">Select car type</option>
                  {carTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Seat Capacity */}
              <div>
                <label className={labelCls} htmlFor="seatCapacity">Seat Capacity</label>
                <input
                  id="seatCapacity"
                  name="seatCapacity"
                  type="number"
                  min="1"
                  value={formData.seatCapacity}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="e.g. 5"
                />
              </div>

              {/* Pickup Location — full width */}
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="pickupLocation">Pickup Location</label>
                <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <FiMapPin size={14} className="shrink-0 text-slate-400" />
                  <input
                    id="pickupLocation"
                    name="pickupLocation"
                    type="text"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    placeholder="e.g. Savar, Dhaka"
                  />
                </div>
              </div>

              {/* Image URL — full width */}
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="imageUrl">Image URL</label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="https://example.com/car-image.jpg"
                />
                <p className="mt-1.5 text-xs text-blue-500">
                  Enter a direct image URL of your car.
                </p>
              </div>



              {/* Availability Status — full width */}
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="availabilityStatus">Availability</label>
                <select
                  id="availabilityStatus"
                  name="availabilityStatus"
                  value={formData.availabilityStatus}
                  onChange={handleChange}
                  className={selectCls}
                >
                  {availabilityOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Description — full width */}
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`${inputCls} resize-none`}
                  placeholder="Describe the car's condition, features, and suitability…"
                />
              </div>
            </div>
          </div>

          {/* ── Action bar ── */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row md:px-6">
            <Link
              to="/my-added-cars"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FiRefreshCw size={14} className={submitting ? 'animate-spin' : ''} />
              {submitting ? 'Updating…' : 'Update Car'}
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default UpdateCar