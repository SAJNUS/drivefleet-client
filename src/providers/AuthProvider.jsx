import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import toast from 'react-hot-toast'
import { auth, googleProvider } from '../firebase/firebase.init.js'
import AuthContext from '../context/AuthContext.js'

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const registerUser = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    toast.success('Account created successfully')
    return result
  }

  const loginUser = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    toast.success('Logged in successfully')
    return result
  }

  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider)
    toast.success('Google sign-in successful')
    return result
  }

  const updateUserProfile = async (profileData) => {
    const result = await updateProfile(auth.currentUser, profileData)
    toast.success('Profile updated successfully')
    return result
  }

  const logoutUser = async () => {
    const result = await signOut(auth)
    toast.success('Logged out successfully')
    return result
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const authValue = useMemo(
    () => ({
      user,
      loading,
      setLoading,
      registerUser,
      loginUser,
      googleLogin,
      updateUserProfile,
      logoutUser,
    }),
    [loading, user],
  )

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
}

export default AuthProvider
