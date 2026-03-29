'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '@/lib/api'

interface User {
    _id: string
    name: string
    email: string
    phone?: string
    role: 'customer' | 'admin'
}

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>
    logout: () => void
    isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const savedToken = localStorage.getItem('salon_token')
        const savedUser = localStorage.getItem('salon_user')
        if (savedToken && savedUser) {
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password })
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem('salon_token', data.token)
        localStorage.setItem('salon_user', JSON.stringify(data.user))
    }

    const register = async (formData: { name: string; email: string; password: string; phone?: string }) => {
        const { data } = await api.post('/auth/register', formData)
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem('salon_token', data.token)
        localStorage.setItem('salon_user', JSON.stringify(data.user))
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('salon_token')
        localStorage.removeItem('salon_user')
    }

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}
