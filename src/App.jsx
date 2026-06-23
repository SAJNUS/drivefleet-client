import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import appRouter from './routes/appRouter.jsx'
import AuthProvider from './providers/AuthProvider.jsx'

function App() {
  return (
    <AuthProvider>
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              background: '#0f172a',
              color: '#fff',
            },
          }}
        />
        <RouterProvider router={appRouter} />
      </>
    </AuthProvider>
  )
}

export default App
