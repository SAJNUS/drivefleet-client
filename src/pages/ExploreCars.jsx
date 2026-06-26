import { useEffect, useMemo, useState } from 'react'
import {

  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiMapPin,
  FiSearch,
  FiStar,
  FiUsers,
} from 'react-icons/fi'
import CarCard, { carTagStyles } from '../components/CarCard.jsx'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL;
const apiUrl = `${API_URL}/cars`
const placeholderImageUrl = 'https://placehold.co/600x400?text=Car'

const bannerImage = '/banner-section-picture.png'

function ExploreCars() {
  const itemsPerPage = 9
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTypes, setSelectedTypes] = useState(['All Types'])
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const controller = new AbortController()

    const timeoutId = setTimeout(async () => {
      try {
        setError('')

        const searchParam = searchTerm.trim() ? `?search=${encodeURIComponent(searchTerm.trim())}` : ''
        const response = await fetch(`${apiUrl}${searchParam}`, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Failed to load cars (${response.status})`)
        }

        const payload = await response.json()
        const nextCars = Array.isArray(payload?.data) ? payload.data : []
        setCars(nextCars)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Failed to load cars')
          setCars([])
        }
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [searchTerm])

  const transformedCars = useMemo(
    () =>
      cars.map((car) => ({
        id: car._id,
        name: car.carName ?? '',
        type: car.carType ?? 'General',
        image: car.imageUrl || placeholderImageUrl,
        location: car.pickupLocation ?? 'Unknown Location',
        dailyRentPrice: car.dailyRentPrice ?? 0,
        seats: car.seatCapacity ?? 'N/A',
        rating: car.rating ?? 0,
        status: car.availabilityStatus ?? 'Available',
      })),
    [cars],
  )

  const exploreCarTypes = useMemo(() => {
    const uniqueTypes = Array.from(
      new Set(transformedCars.map((car) => car.type).filter(Boolean)),
    )

    return ['All Types', ...uniqueTypes]
  }, [transformedCars])

  const filteredCars = useMemo(() => {
    let result = transformedCars.filter((car) => {
      const matchesType =
        selectedTypes.includes('All Types') || selectedTypes.includes(car.type)

      return matchesType
    })

    result = [...result].sort((firstCar, secondCar) => {
      if (sortOrder === 'high-to-low') {
        return secondCar.dailyRentPrice - firstCar.dailyRentPrice
      }
      if (sortOrder === 'low-to-high') {
        return firstCar.dailyRentPrice - secondCar.dailyRentPrice
      }
      if (sortOrder === 'newest') {
        return secondCar.id.localeCompare(firstCar.id)
      }
      if (sortOrder === 'oldest') {
        return firstCar.id.localeCompare(secondCar.id)
      }

      return 0
    })

    return result
  }, [transformedCars, selectedTypes, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filteredCars.length / itemsPerPage))

  const paginatedCars = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredCars.slice(startIndex, startIndex + itemsPerPage)
  }, [currentPage, filteredCars])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedTypes, sortOrder])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleTypeToggle = (type) => {
    setSelectedTypes((currentTypes) => {
      if (type === 'All Types') {
        return ['All Types']
      }

      const nextTypes = currentTypes.filter((currentType) => currentType !== 'All Types')

      if (nextTypes.includes(type)) {
        const updatedTypes = nextTypes.filter((currentType) => currentType !== type)
        return updatedTypes.length > 0 ? updatedTypes : ['All Types']
      }

      return [...nextTypes, type]
    })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedTypes(['All Types'])
    setSortOrder('newest')
    setCurrentPage(1)
  }

  const startItem = filteredCars.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, filteredCars.length)

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200/70 bg-white p-8 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Loading Cars
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Fetching the latest car listings
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Please wait while we load data from the server.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200/70 bg-white p-8 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
          Error Loading Cars
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Unable to load car listings
        </h1>
        <p className="mt-2 text-sm text-slate-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div
        className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-linear-to-r from-blue-50 via-white to-slate-50 px-6 py-10 shadow-xl md:px-10"
      >
        <div className="absolute inset-0">
          <img
            src={bannerImage}
            alt="Explore cars"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-blue-50/90 via-blue-50/70 to-blue-50/20" />
        </div>
        <div className="relative grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
              Explore Cars
            </h1>
            <p className="max-w-sm text-sm text-slate-600 md:text-base">
              Find the perfect car for your next journey. Choose from a wide
              range of vehicles.
            </p>
          </div>
          <div className="hidden md:block" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside
          className="space-y-6 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.5)]"
        >
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">Filter Cars</h2>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-600">
              Search
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <FiSearch className="text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by car name..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-700 outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-600">Car Type</p>
            {exploreCarTypes.map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeToggle(type)}
                />
                <span className="text-slate-700">{type}</span>
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={clearFilters}
              className="w-full rounded-lg bg-linear-to-r from-blue-600 to-blue-500 px-4 py-2 text-xs font-semibold text-white"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-600">
              Showing {startItem}-{endItem} of {filteredCars.length} cars
            </p>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                <span>Sort by:</span>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  className="bg-transparent text-xs font-medium text-slate-700 outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>
              </label>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {paginatedCars.map((car) => (
              <div key={car.id}>
                <CarCard car={car} variant="explore" />
              </div>
            ))}
          </div>


          {filteredCars.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
              No cars match your current search and filter settings.
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold ${page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-600'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExploreCars
