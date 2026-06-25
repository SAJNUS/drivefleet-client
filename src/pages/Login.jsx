import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
import useAuth from '../hooks/useAuth.js'

function Login() {
  const { loginUser, googleLogin } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/'

  const getAuthErrorMessage = (error) => {
    if (!error) return 'Failed to log in'
    const code = error.code || ''
    
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
      return 'Invalid email or password.'
    }
    if (code === 'auth/user-not-found') {
      return 'No account found with this email. Please register first.'
    }
    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address.'
    }
    
    // Fallback to stripping the "Firebase:" prefix if possible, or use raw message
    return error.message?.replace('Firebase: ', '') || 'Failed to log in'
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      await loginUser(formData.email, formData.password)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)

    try {
      await googleLogin()
      navigate(redirectTo, { replace: true })
    } catch (error) {
      toast.error(error?.message || 'Google login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
        <p className="text-slate-600">Access your DriveFleet account.</p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FcGoogle size={18} />
          {loading ? 'Please wait...' : 'Continue with Google'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        New to DriveFleet?{' '}
        <Link to="/register" className="font-semibold text-blue-600">
          Create an account
        </Link>
      </p>
    </section>
  )
}

export default Login
