'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'

function RegisterForm() {
    const { register } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect') || '/'

    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await register(form)
            toast.success('Account created! Welcome to Jawed Habib.')
            router.push(redirect)
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    const fields = [
        { key: 'name', label: 'Full Name', type: 'text', placeholder: 'YOUR FULL NAME' },
        { key: 'email', label: 'Email Address', type: 'email', placeholder: 'YOUR@EMAIL.COM' },
        { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 9999999999' },
        { key: 'password', label: 'Secure Password', type: 'password', placeholder: '••••••••' },
    ]

    return (
        <div className="bg-white p-10 border border-gray-100 shadow-xl shadow-brand-red/5">
            <form onSubmit={handleSubmit} className="space-y-6">
                {fields.map(({ key, label, type, placeholder }) => (
                    <div key={key}>
                        <label className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold block mb-3">{label}</label>
                        <input
                            type={type}
                            value={(form as any)[key]}
                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                            required={key !== 'phone'}
                            className="w-full bg-white border-2 border-gray-50 text-brand-black placeholder-gray-300 px-5 py-4 text-sm font-medium focus:outline-none focus:border-brand-red transition-all duration-300 shadow-sm"
                            placeholder={placeholder}
                        />
                    </div>
                ))}
                <button type="submit" disabled={loading} className="btn-red w-full mt-4 py-4 uppercase font-bold tracking-widest text-xs shadow-lg shadow-brand-red/10">
                    {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Create Profile'}
                </button>
            </form>
            <p className="text-center text-[10px] text-gray-400 mt-8 tracking-widest uppercase font-bold">
                Part of the family?{' '}
                <Link href={`/login${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="text-brand-red hover:underline decoration-2 underline-offset-4">Sign In</Link>
            </p>
        </div>
    )
}

export default function RegisterPage() {
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
                <Suspense fallback={<div className="h-96 flex items-center justify-center bg-white border border-gray-100 italic text-gray-400">Loading heritage catalog...</div>}>
                    <RegisterForm />
                </Suspense>
            </motion.div>
        </div>
    )
}
