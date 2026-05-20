import { RouterProvider } from 'react-router-dom'
import appRouter from './routes/appRouter.jsx'

function App() {
  return <RouterProvider router={appRouter} />
}

export default App
