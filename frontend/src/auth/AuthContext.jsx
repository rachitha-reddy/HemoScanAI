/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import api from '../api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        // Verify token is still valid
        verifyToken()
      } catch (error) {
        console.error('Error parsing stored user:', error)
        logout()
      }
    }
    setLoading(false)
  }, [])

  const verifyToken = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data)
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (error) {
      console.error('Token verification failed:', error)
      logout()
    }
  }

  const signup = async (username, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/signup', {
        username,
        email,
        password,
      })

      const { access_token, user: userData } = response.data
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)

      return { success: true, user: userData }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Signup failed',
      }
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      })

      const { access_token, user: userData } = response.data
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)

      return { success: true, user: userData }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const isAuthenticated = () => {
    return user !== null
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


