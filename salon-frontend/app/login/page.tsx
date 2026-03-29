'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'
import { Suspense } from 'react'

function LoginForm() {
    const { login } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect') || '/'

    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await login(form.email, form.password)
            toast.success('Welcome back!')
            router.push(redirect)
        } catch (err: any) {
            console.error('Full Login Error:', err)
            const msg = err.response?.data?.message || (err.code === 'ERR_NETWORK' ? 'Cannot reach server. Is backend running?' : 'Login failed')
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {['email', 'password'].map((field) => (
                <div key={field}>
                    <label className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold block mb-3 capitalize">{field}</label>
                    <input
                        type={field === 'password' ? 'password' : 'email'}
                        value={(form as any)[field]}
                        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                        required
                        className="w-full bg-white border-2 border-gray-50 text-brand-black placeholder-gray-300 px-5 py-4 text-sm font-medium focus:outline-none focus:border-brand-red transition-all duration-300 shadow-sm"
                        placeholder={field === 'email' ? 'YOUR@EMAIL.COM' : '••••••••'}
                    />
                </div>
            ))}

            <button type="submit" disabled={loading} className="btn-red w-full mt-4 py-4 uppercase font-bold tracking-widest text-xs shadow-lg shadow-brand-red/10">
                {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Enter Salon'}
            </button>

            <p className="text-center text-[10px] text-gray-400 mt-6 tracking-widest uppercase font-bold">
                New to the family?{' '}
                <Link href={`/register${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="text-brand-red hover:underline decoration-2 underline-offset-4">Create Profile</Link>
            </p>
        </form>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center bg-[#fafafa]">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-12">
                    <div className="font-serif text-4xl text-brand-black font-black uppercase tracking-tight mb-2">JAWED HABIB</div>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-8 bg-brand-red" />
                        <span className="text-[10px] tracking-[0.5em] text-brand-red font-bold uppercase">Heritage Legacy</span>
                        <div className="h-px w-8 bg-brand-red" />
                    </div>
                </div>
                <div className="bg-white p-10 border border-gray-100 shadow-xl shadow-brand-red/5">
                    <Suspense><LoginForm /></Suspense>
                </div>
            </motion.div>
        </div>
    )
}
