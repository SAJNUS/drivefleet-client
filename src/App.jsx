import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import appRouter from './routes/appRouter.jsx'
import AuthProvider from './providers/AuthProvider.jsx'

import useAuth from './hooks/useAuth.js'

function GlobalAuthWrapper({ children }) {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm font-medium text-slate-600">
            Checking authentication...
          </span>
        </div>
      </div>
    )
  }

  return children
}

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
        <GlobalAuthWrapper>
          <RouterProvider router={appRouter} />
        </GlobalAuthWrapper>
      </>
    </AuthProvider>
  )
}

export default App
