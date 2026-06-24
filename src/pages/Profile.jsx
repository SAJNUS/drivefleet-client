import useAuth from '../hooks/useAuth.js'

function Profile() {
  const { user } = useAuth()

  return (
    <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          My Profile
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 md:text-base">
          View and manage your personal information.
        </p>
      </div>

      <div className="mt-8 flex items-center gap-6">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-3xl font-semibold text-blue-600">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <span>
              {(user?.displayName || 'U')
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{user?.displayName || 'User'}</h2>
          <p className="text-slate-500">{user?.email}</p>
        </div>
      </div>
    </section>
  )
}

export default Profile
