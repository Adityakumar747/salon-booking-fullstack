'use client'

import { useState, useEffect, Suspense } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { format, addDays, startOfToday } from 'date-fns'

function BookingForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { user } = useAuth()

    const preselectedServiceId = searchParams.get('serviceId') || ''
    const [step, setStep] = useState(preselectedServiceId ? 2 : 1)
    const [selectedService, setSelectedService] = useState(preselectedServiceId)
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedSlot, setSelectedSlot] = useState('')
    const [selectedStylist, setSelectedStylist] = useState('')
    const [notes, setNotes] = useState('')
    const [success, setSuccess] = useState(false)

    // Generate next 30 days for date picker
    const today = startOfToday()
    const dates = Array.from({ length: 30 }, (_, i) => addDays(today, i))

    const { data: servicesData } = useQuery({
        queryKey: ['services-book'],
        queryFn: () => api.get('/services').then((r) => r.data.services),
    })

    const { data: stylistsData } = useQuery({
        queryKey: ['stylists'],
        queryFn: () => api.get('/stylists').then((r) => r.data.stylists),
    })

    const { data: slotsData, isFetching: slotsLoading } = useQuery({
        queryKey: ['slots', selectedDate, selectedService],
        queryFn: () =>
            api.get(`/slots?date=${selectedDate}&serviceId=${selectedService}`).then((r) => r.data.slots),
        enabled: !!selectedDate && !!selectedService,
    })

    // Restore draft from localStorage if resuming
    useEffect(() => {
        const saved = localStorage.getItem('booking_draft')
        const resume = searchParams.get('resume')
        if (saved && resume) {
            try {
                const draft = JSON.parse(saved)
                if (draft.step) setStep(draft.step)
                if (draft.selectedService) setSelectedService(draft.selectedService)
                if (draft.selectedDate) setSelectedDate(draft.selectedDate)
                if (draft.selectedSlot) setSelectedSlot(draft.selectedSlot)
                if (draft.selectedStylist) setSelectedStylist(draft.selectedStylist)
                if (draft.notes) setNotes(draft.notes)
                router.replace('/book')
            } catch (e) { console.error('Failed to restore booking draft', e) }
        }
    }, [])

    useEffect(() => {
        const draft = { step, selectedService, selectedDate, selectedSlot, selectedStylist, notes }
        localStorage.setItem('booking_draft', JSON.stringify(draft))
    }, [step, selectedService, selectedDate, selectedSlot, selectedStylist, notes])

    const bookMutation = useMutation({
        mutationFn: (payload: any) => api.post('/appointments', payload),
        onSuccess: () => {
            setSuccess(true)
            localStorage.removeItem('booking_draft')
            setTimeout(() => router.push('/profile'), 3500)
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Booking failed. Please try again.')
        },
    })

    const handleBook = () => {
        if (!user) {
            router.push('/login?redirect=/book?resume=true');
            return
        }
        bookMutation.mutate({
            serviceId: selectedService,
            date: selectedDate,
            timeSlot: selectedSlot,
            stylistId: selectedStylist || undefined,
            notes,
        })
    }

    const selectedServiceObj = servicesData?.find((s: any) => s._id === selectedService)

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="w-24 h-24 rounded-full border-2 border-brand-red flex items-center justify-center mx-auto mb-8 bg-brand-red/5"
                >
                    <motion.svg
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="w-10 h-10 text-brand-red"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                        />
                    </motion.svg>
                </motion.div>
                <h2 className="font-serif text-4xl text-brand-black mb-4 font-black uppercase">Booking Confirmed!</h2>
                <p className="text-gray-500 text-sm tracking-wide">Thank you for choosing Jawed Habib. Redirecting you to your profile...</p>
            </motion.div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-16">
                {['Service', 'Date & Time', 'Confirm'].map((label, i) => (
                    <div key={label} className="flex items-center gap-2">
                        <div className={`flex flex-col items-center gap-2`}>
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500 ${step > i + 1 ? 'bg-brand-red text-white border-brand-red' : 'border-gray-100 text-gray-300'
                                    } ${step === i + 1 ? 'border-brand-red text-brand-red shadow-lg shadow-brand-red/10' : ''}`}
                            >
                                {step > i + 1 ? '✓' : i + 1}
                            </div>
                            <span className={`text-[9px] font-bold tracking-[0.2em] uppercase ${step === i + 1 ? 'text-brand-red' : 'text-gray-400'}`}>
                                {label}
                            </span>
                        </div>
                        {i < 2 && <div className={`h-0.5 w-16 transition-all duration-700 ${step > i + 1 ? 'bg-brand-red' : 'bg-gray-100'}`} />}
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div key="step1" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}>
                        <h2 className="font-serif text-3xl text-brand-black mb-8 font-bold uppercase tracking-tight">Select Specialty</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(servicesData || []).map((s: any) => (
                                <motion.button
                                    key={s._id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedService(s._id)}
                                    className={`bg-white p-6 text-left transition-all duration-500 border-2 ${selectedService === s._id ? 'border-brand-red shadow-lg shadow-brand-red/5' : 'border-gray-50 hover:border-gray-200 shadow-sm'
                                        }`}
                                >
                                    <p className="font-bold text-brand-black text-sm uppercase tracking-wide">{s.name}</p>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-medium">{s.category} · {s.duration} min</p>
                                    <p className="text-brand-red font-black mt-3 text-lg">₹{s.price.toLocaleString()}</p>
                                </motion.button>
                            ))}
                        </div>
                        <div className="flex justify-end mt-12">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!selectedService}
                                className="btn-red px-14 py-4 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Select Time →
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="step2" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}>
                        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                            <h2 className="font-serif text-3xl text-brand-black font-bold uppercase tracking-tight">Date & Time</h2>
                            {selectedServiceObj && (
                                <div className="bg-brand-red/5 border border-brand-red/20 px-5 py-3 flex items-center gap-3">
                                    <div>
                                        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Selected Service</p>
                                        <p className="text-sm font-bold text-brand-black uppercase tracking-wide">{selectedServiceObj.name}</p>
                                    </div>
                                    <span className="text-brand-red font-black text-lg ml-2">₹{selectedServiceObj.price?.toLocaleString()}</span>
                                </div>
                            )}
                        </div>

                        {/* Date Picker */}
                        <div className="mb-10">
                            <label className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold block mb-4">Choose Date</label>
                            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none">
                                {dates.map((d) => {
                                    const dayStr = format(d, 'yyyy-MM-dd')
                                    return (
                                        <button
                                            key={dayStr}
                                            onClick={() => { setSelectedDate(dayStr); setSelectedSlot('') }}
                                            className={`flex-shrink-0 flex flex-col items-center px-5 py-4 border-2 transition-all duration-300 min-w-[72px] ${selectedDate === dayStr
                                                ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/20'
                                                : 'bg-white border-gray-50 text-gray-400 hover:border-brand-red shadow-sm'
                                                }`}
                                        >
                                            <span className="text-[9px] font-bold uppercase tracking-tighter">{format(d, 'EEE')}</span>
                                            <span className="text-xl font-black my-0.5">{format(d, 'd')}</span>
                                            <span className="text-[9px] uppercase font-bold">{format(d, 'MMM')}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Time Slots */}
                        {selectedDate && (
                            <div className="mb-10">
                                <label className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold block mb-4">Available Slots</label>
                                {slotsLoading ? (
                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <div key={i} className="skeleton h-12" />
                                        ))}
                                    </div>
                                ) : !slotsData?.length ? (
                                    <p className="text-brand-red font-medium text-sm border border-brand-red/10 bg-brand-red/5 p-4 text-center">Fully booked for this date.</p>
                                ) : (
                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                        {slotsData.map((slot: string) => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`py-3 text-[11px] font-bold transition-all duration-300 border-2 ${selectedSlot === slot
                                                    ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/10'
                                                    : 'bg-white border-gray-50 text-gray-500 hover:border-brand-red shadow-sm'
                                                    }`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Stylist (optional) */}
                        {(stylistsData?.length > 0) && (
                            <div className="mb-10">
                                <label className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold block mb-4">
                                    Stylist Selection <span className="opacity-50 text-[8px] font-normal tracking-normal">(Optional)</span>
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => setSelectedStylist('')}
                                        className={`px-6 py-2.5 text-[10px] font-bold border-2 transition-all duration-300 ${!selectedStylist ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/10' : 'bg-white border-gray-50 text-gray-500 hover:border-brand-red shadow-sm'}`}
                                    >
                                        ANY EXPERT
                                    </button>
                                    {stylistsData.map((s: any) => (
                                        <button
                                            key={s._id}
                                            onClick={() => setSelectedStylist(s._id)}
                                            className={`px-6 py-2.5 text-[10px] font-bold border-2 transition-all duration-300 ${selectedStylist === s._id ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/10' : 'bg-white border-gray-50 text-gray-500 hover:border-brand-red shadow-sm'}`}
                                        >
                                            {s.name.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        <div className="mb-12">
                            <label className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold block mb-3">Special Instructions</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any specific requirements for your look..."
                                rows={3}
                                className="w-full bg-white border-2 border-gray-50 text-brand-black placeholder-gray-300 px-5 py-4 text-sm font-medium focus:outline-none focus:border-brand-red transition-all duration-300 shadow-sm"
                            />
                        </div>

                        <div className="flex justify-between items-center bg-gray-50/50 p-6 -mx-6 sm:mx-0">
                            <button onClick={() => setStep(1)} className="btn-outline-red px-10">← BACK</button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!selectedDate || !selectedSlot}
                                className="btn-red px-14 py-4 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                CONTINUE →
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div key="step3" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}>
                        <h2 className="font-serif text-3xl text-brand-black mb-8 font-bold uppercase tracking-tight">Summary</h2>
                        <div className="bg-white border-2 border-gray-50 p-8 mb-10 space-y-6 shadow-sm">
                            {[
                                { label: 'Service', value: servicesData?.find((s: any) => s._id === selectedService)?.name },
                                { label: 'Date', value: selectedDate },
                                { label: 'Time', value: selectedSlot },
                                { label: 'Stylist', value: selectedStylist ? stylistsData?.find((s: any) => s._id === selectedStylist)?.name : 'Any Available' },
                                { label: 'Total Due', value: `₹${servicesData?.find((s: any) => s._id === selectedService)?.price?.toLocaleString()}` },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between items-center text-sm border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                                    <span className="text-gray-400 tracking-[0.2em] uppercase text-[10px] font-bold">{label}</span>
                                    <span className={`font-bold ${label === 'Total Due' ? 'text-brand-red text-xl' : 'text-brand-black uppercase'}`}>{value || '—'}</span>
                                </div>
                            ))}
                        </div>

                        {!user && (
                            <div className="bg-brand-red/5 border-2 border-brand-red/10 p-6 mb-8 text-center">
                                <p className="text-sm text-brand-black font-medium">
                                    Secure your slot by logging in.{' '}
                                    <Link href="/login?redirect=/book" className="text-brand-red underline font-bold">LOGIN NOW</Link>
                                </p>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <button onClick={() => setStep(2)} className="btn-outline-red px-10">← BACK</button>
                            <button
                                onClick={handleBook}
                                disabled={bookMutation.isPending || !user}
                                className="btn-red px-16 py-4 disabled:opacity-30 flex items-center gap-3"
                            >
                                {bookMutation.isPending ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>RESERVING...</span>
                                    </>
                                ) : 'CONFIRM & BOOK'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function BookPage() {
    return (
        <div className="min-h-screen pt-32 pb-24 px-6">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal className="text-center mb-16">
                    <p className="text-xs tracking-[0.5em] uppercase text-brand-red mb-4 font-bold">Reserve Your Slot</p>
                    <h1 className="section-heading text-5xl md:text-7xl font-black uppercase text-brand-black">Online Booking</h1>
                    <div className="red-divider" />
                </ScrollReveal>
                <Suspense fallback={<div className="text-center text-gray-400">Loading...</div>}>
                    <BookingForm />
                </Suspense>
            </div>
        </div>
    )
}
