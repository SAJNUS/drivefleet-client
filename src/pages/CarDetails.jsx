import { useParams } from 'react-router-dom'

function CarDetails() {
  const { id } = useParams()

  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold">Car Details</h1>
      <p className="text-slate-600">Showing details for car ID: {id}</p>
    </section>
  )
}

export default CarDetails
