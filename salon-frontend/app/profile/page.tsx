'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import ScrollReveal from '@/components/ui/ScrollReveal'
import toast from 'react-hot-toast'

const statusColors: Record<string, string> = {
    pending: '#D62828', // Brand Red
    confirmed: '#111111', // Black
    completed: '#6b7280',
    cancelled: '#ef4444',
}

export default function ProfilePage() {
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!authLoading && !user) router.push('/login?redirect=/profile')
    }, [user, authLoading, router])

    const { data, isLoading } = useQuery({
        queryKey: ['my-appointments'],
        queryFn: () => api.get('/appointments/my').then((r) => r.data.appointments),
        enabled: !!user,
    })

    const cancelMutation = useMutation({
        mutationFn: (id: string) => api.patch(`/appointments/${id}/cancel`, {}),
        onSuccess: () => {
            toast.success('Appointment cancelled')
            queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
        },
        onError: () => toast.error('Failed to cancel'),
    })

    if (authLoading || !user) return null

    const upcoming = (data || []).filter((a: any) => ['pending', 'confirmed'].includes(a.status))
    const history = (data || []).filter((a: any) => ['completed', 'cancelled'].includes(a.status))

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-[#fafafa]">
            <div className="max-w-4xl mx-auto">
                <ScrollReveal>
                    <div className="flex items-center gap-6 mb-16 bg-white p-8 border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 rounded-full bg-brand-red flex items-center justify-center text-white text-3xl font-serif font-black shadow-lg shadow-brand-red/20 uppercase">
                            {user.name[0]}
                        </div>
                        <div>
                            <h1 className="font-serif text-4xl text-brand-black font-black uppercase tracking-tight">{user.name}</h1>
                            <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-brand-red"></span>
                                <span>{user.email}</span>
                            </p>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Upcoming Appointments */}
                <ScrollReveal className="mb-16">
                    <h2 className="font-serif text-2xl text-brand-black mb-8 flex items-center gap-4 font-bold uppercase tracking-wider">
                        Active Reservations
                        <span className="text-[10px] tracking-normal px-3 py-1 bg-brand-red text-white font-bold rounded-full">
                            {upcoming.length}
                        </span>
                    </h2>
                    {isLoading ? (
                        <div className="skeleton h-40" />
                    ) : upcoming.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-gray-100 p-12 text-center">
                            <p className="text-gray-400 text-sm italic">You don't have any active bookings.</p>
                            <Link href="/book" className="btn-red inline-block mt-6 px-10">Start Your Journey</Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {upcoming.map((apt: any) => (
                                <motion.div
                                    key={apt._id}
                                    layout
                                    className="bg-white border border-gray-100 shadow-sm p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md transition-shadow duration-300"
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">Reservation #{apt._id.slice(-6).toUpperCase()}</span>
                                            <span
                                                className="text-[9px] tracking-widest uppercase px-3 py-1 font-bold"
                                                style={{ background: `${statusColors[apt.status]}10`, color: statusColors[apt.status], borderLeft: `2px solid ${statusColors[apt.status]}` }}
                                            >
                                                {apt.status}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-xl text-brand-black uppercase tracking-tight">{apt.service?.name}</h3>
                                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                {apt.date}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {apt.timeSlot}
                                            </div>
                                            {apt.stylist && (
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                    {apt.stylist.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0 sm:border-l border-gray-50 pt-6 sm:pt-0 sm:pl-8">
                                        <span className="text-2xl font-black text-brand-red">₹{apt.service?.price?.toLocaleString()}</span>
                                        {apt.status !== 'cancelled' && (
                                            <button
                                                onClick={() => { if (confirm('Cancel this appointment?')) cancelMutation.mutate(apt._id) }}
                                                className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b-2 border-transparent hover:border-brand-red hover:text-brand-red transition-all duration-300"
                                            >
                                                Cancel Booking
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </ScrollReveal>

                {/* Booking History */}
                {history.length > 0 && (
                    <ScrollReveal>
                        <h2 className="font-serif text-2xl text-brand-black mb-8 font-bold uppercase tracking-wider">History</h2>
                        <div className="space-y-4">
                            {history.map((apt: any) => (
                                <div key={apt._id} className="bg-white border border-gray-50 p-6 flex justify-between items-center opacity-60 hover:opacity-100 transition-all duration-300 shadow-sm">
                                    <div>
                                        <p className="text-sm text-brand-black font-bold uppercase tracking-tight">{apt.service?.name}</p>
                                        <p className="text-[10px] text-gray-400 mt-1 font-medium">{apt.date} · {apt.timeSlot}</p>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className="text-[9px] tracking-[0.2em] uppercase font-bold"
                                            style={{ color: statusColors[apt.status] }}
                                        >
                                            {apt.status}
                                        </span>
                                        <p className="text-xs font-bold text-brand-black mt-1">₹{apt.service?.price?.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                )}
            </div>
        </div>
    )
}
