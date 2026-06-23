import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout.jsx'
import PrivateLayout from '../layouts/PrivateLayout.jsx'
import PrivateRoute from './PrivateRoute.jsx'
import Home from '../pages/Home.jsx'
import ExploreCars from '../pages/ExploreCars.jsx'
import CarDetails from '../pages/CarDetails.jsx'
import AddCar from '../pages/AddCar.jsx'
import MyBookings from '../pages/MyBookings.jsx'
import MyAddedCars from '../pages/MyAddedCars.jsx'
import UpdateCar from '../pages/UpdateCar.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import NotFound from '../pages/NotFound.jsx'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'explore-cars', element: <ExploreCars /> },
      { path: 'car-details/:id', element: <CarDetails /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          { path: 'add-car', element: <AddCar /> },
          { path: 'update-car/:id', element: <UpdateCar /> },
          { path: 'my-bookings', element: <MyBookings /> },
          { path: 'my-added-cars', element: <MyAddedCars /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
])

export default appRouter
