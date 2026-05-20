import { Outlet } from 'react-router-dom'

function PrivateLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <header className="border-b border-slate-200">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6">
          <div className="text-sm font-medium text-slate-500">
            Private layout placeholder
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default PrivateLayout
