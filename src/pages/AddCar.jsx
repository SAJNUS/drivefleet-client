import { useState } from 'react'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth.js'

const initialFormData = {
  carName: '',
  dailyRentPrice: '',
  carType: '',
  imageUrl: '',
  seatCapacity: '',
  pickupLocation: '',
  modelYear: '',
  transmission: '',
  fuelType: '',
  mileage: '',
  description: '',
  availabilityStatus: 'Available',
}

const carTypes = ['SUV', 'Sedan', 'Hatchback', 'Luxury', 'Pickup', 'Electric']
const transmissionOptions = ['Automatic', 'Manual', 'CVT']
const fuelTypeOptions = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG']
const availabilityOptions = ['Available', 'Unavailable']

function AddCar() {
  const { user } = useAuth()
  const [formData, setFormData] = useState(initialFormData)
  const [loading, setLoading] = useState(false)

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
      'modelYear',
      'transmission',
      'fuelType',
      'mileage',
      'description',
      'availabilityStatus',
    ]

    const hasEmptyField = requiredFields.some((field) => {
      const value = formData[field]
      return typeof value === 'string' ? !value.trim() : !value
    })

    if (hasEmptyField) {
      toast.error('Please fill in every field before submitting.')
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

    if (!validateForm()) {
      return
    }

    setLoading(true)

    const carObject = {
      carName: formData.carName.trim(),
      dailyRentPrice: Number(formData.dailyRentPrice),
      carType: formData.carType,
      imageUrl: formData.imageUrl.trim(),
      seatCapacity: Number(formData.seatCapacity),
      pickupLocation: formData.pickupLocation.trim(),
      modelYear: Number(formData.modelYear),
      transmission: formData.transmission,
      fuelType: formData.fuelType,
      mileage: formData.mileage.trim(),
      description: formData.description.trim(),
      availabilityStatus: formData.availabilityStatus,
      ownerEmail: user?.email ?? '',
    }

    try {
      const response = await fetch('http://localhost:5050/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carObject),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add car')
      }

      toast.success('Car listing added successfully!')
      setFormData(initialFormData)
    } catch (error) {
      toast.error(error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          Add Car
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 md:text-base">
          Create a new car listing with the details below. Submitted cars are
          saved directly to the database.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
              required
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
              required
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
              required
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
              required
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="seatCapacity"
            >
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
              required
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="pickupLocation"
            >
              Pickup Location
            </label>
            <input
              id="pickupLocation"
              name="pickupLocation"
              type="text"
              value={formData.pickupLocation}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              placeholder="Enter pickup location"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="modelYear">
              Model Year
            </label>
            <input
              id="modelYear"
              name="modelYear"
              type="number"
              min="1990"
              max={new Date().getFullYear() + 1}
              value={formData.modelYear}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              placeholder="e.g. 2024"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="transmission">
              Transmission
            </label>
            <select
              id="transmission"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              required
            >
              <option value="">Select transmission</option>
              {transmissionOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="fuelType">
              Fuel Type
            </label>
            <select
              id="fuelType"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              required
            >
              <option value="">Select fuel type</option>
              {fuelTypeOptions.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="mileage">
              Mileage
            </label>
            <input
              id="mileage"
              name="mileage"
              type="text"
              value={formData.mileage}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              placeholder="e.g. 12.5 km/l"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
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
            required
          />
        </div>

        <div className="grid gap-5 md:grid-cols-[1fr_220px]">
          <div className="space-y-2">
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
              required
            >
              {availabilityOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Submitting...' : 'Add Car'}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}

export default AddCar
