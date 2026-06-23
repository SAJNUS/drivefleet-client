import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth.js'

const passwordRules = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  minLength: /^.{6,}$/,
}

function Register() {
  const { registerUser, updateUserProfile, googleLogin } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoURL: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/'

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const validatePassword = (password) => {
    if (!passwordRules.uppercase.test(password)) {
      return 'Password must contain at least one uppercase letter.'
    }

    if (!passwordRules.lowercase.test(password)) {
      return 'Password must contain at least one lowercase letter.'
    }

    if (!passwordRules.minLength.test(password)) {
      return 'Password must be at least 6 characters long.'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      toast.error(passwordError)
      return
    }

    setLoading(true)

    try {
      await registerUser(formData.email, formData.password)
      await updateUserProfile({
        displayName: formData.name,
        photoURL: formData.photoURL,
      })
      toast.success('Registration successful')
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(error?.message || 'Failed to register')
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
        <h1 className="text-2xl font-semibold text-slate-900">Register</h1>
        <p className="text-slate-600">Create a new DriveFleet account.</p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            placeholder="Enter your name"
            required
          />
        </div>

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
          <label className="text-sm font-medium text-slate-700" htmlFor="photoURL">
            Photo URL
          </label>
          <input
            id="photoURL"
            name="photoURL"
            type="url"
            value={formData.photoURL}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            placeholder="Enter your photo URL"
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
            placeholder="Create a password"
            required
          />
          <p className="text-xs text-slate-500">
            Password must include uppercase, lowercase, and be at least 6 characters.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Please wait...' : 'Continue with Google'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-blue-600">
          Login here
        </Link>
      </p>
    </section>
  )
}

export default Register
