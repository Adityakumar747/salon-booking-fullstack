'use client'

import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Calendar, IndianRupee, Scissors, Star, TrendingUp, BarChart2 } from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts'

export default function AnalyticsTab() {
    const [range, setRange] = useState('month')
    const [customStart, setCustomStart] = useState('')
    const [customEnd, setCustomEnd] = useState('')
    const [pendingStart, setPendingStart] = useState('')
    const [pendingEnd, setPendingEnd] = useState('')
    const [showPicker, setShowPicker] = useState(false)
    const pickerRef = useRef<HTMLDivElement>(null)

    // Close picker when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setShowPicker(false)
            }
        }
        if (showPicker) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showPicker])

    const queryUrl =
        range === 'custom' && customStart && customEnd
            ? `/admin/analytics?range=custom&start=${customStart}&end=${customEnd}`
            : `/admin/analytics?range=${range}`

    const { data, isLoading } = useQuery({
        queryKey: ['admin-analytics', range, customStart, customEnd],
        queryFn: () => api.get(queryUrl).then((res) => res.data),
        enabled: range !== 'custom' || (!!customStart && !!customEnd),
    })

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-[#fafafa] p-8 -m-8 min-h-screen">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="skeleton h-32 bg-white border border-gray-100 shadow-sm" />
                ))}
            </div>
        )
    }

    const stats = [
        { label: 'Total Reservations', value: data?.totalBookings || 0, icon: Calendar },
        { label: 'Projected Revenue', value: `₹${data?.totalRevenue?.toLocaleString() || 0}`, icon: IndianRupee },
        { label: 'Service Coverage', value: `${data?.popularServices?.length || 0} Specialties`, icon: Scissors },
        { label: 'Customer Satisfaction', value: '98%', icon: Star },
    ]

    const ranges = [
        { id: 'today', label: 'Today' },
        { id: 'week', label: 'Week' },
        { id: 'month', label: 'Month' },
        { id: 'previous', label: 'Previous' },
        { id: 'custom', label: 'Custom' },
    ]

    const hasBookingData = data?.bookingsOverTime && data.bookingsOverTime.length > 0
    const hasServiceData = data?.popularServices && data.popularServices.length > 0

    return (
        <div className="bg-[#fafafa] p-8 -m-8 min-h-screen space-y-12">
            {/* Range Selector */}
            <div className="flex justify-end">
                <div className="relative" ref={pickerRef}>
                    <div className="flex bg-white border border-gray-100 p-1 shadow-sm">
                        {ranges.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => {
                                    if (r.id === 'custom') {
                                        setRange('custom')
                                        setShowPicker((prev) => !prev)
                                    } else {
                                        setRange(r.id)
                                        setShowPicker(false)
                                    }
                                }}
                                className={`px-4 py-2 text-[10px] tracking-widest uppercase transition-all duration-300 font-black ${range === r.id
                                    ? 'bg-brand-black text-white'
                                    : 'text-gray-400 hover:text-brand-red'
                                    }`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>

                    {/* Date picker dropdown — absolutely positioned, zero layout impact */}
                    {showPicker && (
                        <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-100 shadow-lg p-4 flex flex-col gap-3 min-w-[240px]">
                            <div className="flex flex-col gap-1">
                                <label className="text-[9px] tracking-widest uppercase font-black text-gray-400">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={pendingStart}
                                    onChange={(e) => setPendingStart(e.target.value)}
                                    className="border border-gray-100 px-3 py-2 text-[10px] font-black tracking-widest uppercase text-brand-black bg-white outline-none focus:border-brand-red transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[9px] tracking-widest uppercase font-black text-gray-400">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={pendingEnd}
                                    onChange={(e) => setPendingEnd(e.target.value)}
                                    className="border border-gray-100 px-3 py-2 text-[10px] font-black tracking-widest uppercase text-brand-black bg-white outline-none focus:border-brand-red transition-colors"
                                />
                            </div>
                            <button
                                disabled={!pendingStart || !pendingEnd}
                                onClick={() => {
                                    setCustomStart(pendingStart)
                                    setCustomEnd(pendingEnd)
                                    setShowPicker(false)
                                }}
                                className="mt-1 px-4 py-2 text-[10px] tracking-widest uppercase font-black bg-brand-black text-white disabled:opacity-30 hover:bg-brand-red transition-colors duration-300"
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.label} className="bg-white p-8 border border-gray-100 shadow-sm border-t-4 border-t-brand-red hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 group">
                            <div className="flex justify-between items-center mb-6">
                                <Icon className="w-8 h-8 text-brand-black opacity-20 group-hover:text-brand-red group-hover:opacity-100 transition-all duration-500" strokeWidth={1.5} />
                                <span className="text-brand-red/10 font-black text-4xl select-none group-hover:text-brand-red/20 transition-colors">0{i + 1}</span>
                            </div>
                            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold mb-2">{stat.label}</p>
                            <h3 className="text-3xl font-black text-brand-black uppercase tracking-tight">{stat.value}</h3>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Bookings Trend */}
                <div className="bg-white p-10 border border-gray-100 shadow-sm">
                    <div className="mb-10 flex justify-between items-start">
                        <div>
                            <h3 className="font-serif text-3xl text-brand-black font-black uppercase tracking-tight">Booking Growth</h3>
                            <p className="text-xs text-brand-red font-bold tracking-widest uppercase mt-1">Heritage Legacy Metrics</p>
                        </div>
                        <TrendingUp className="text-brand-red/20" size={24} />
                    </div>
                    <div className="h-80 w-full flex items-center justify-center">
                        {hasBookingData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data?.bookingsOverTime}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                    <XAxis dataKey="_id" stroke="#aaa" fontSize={10} fontWeight="bold" tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                                    <YAxis stroke="#aaa" fontSize={10} fontWeight="bold" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '0px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                        labelStyle={{ display: 'none' }}
                                    />
                                    <Line type="monotone" dataKey="count" stroke="#D62828" strokeWidth={4} dot={{ r: 6, fill: '#D62828', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, fill: '#111', stroke: '#D62828', strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center">
                                <BarChart2 size={32} className="mx-auto text-gray-100 mb-4" />
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Data will appear once bookings begin.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Popular Services */}
                <div className="bg-white p-10 border border-gray-100 shadow-sm">
                    <div className="mb-10 flex justify-between items-start">
                        <div>
                            <h3 className="font-serif text-3xl text-brand-black font-black uppercase tracking-tight">Demand Analysis</h3>
                            <p className="text-xs text-brand-red font-bold tracking-widest uppercase mt-1">Specialty Performance</p>
                        </div>
                        <Scissors className="text-brand-red/20" size={24} />
                    </div>
                    <div className="h-80 w-full flex items-center justify-center">
                        {hasServiceData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.popularServices}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                    <XAxis dataKey="name" stroke="#aaa" fontSize={10} fontWeight="bold" tickFormatter={(val) => val.toUpperCase()} />
                                    <YAxis stroke="#aaa" fontSize={10} fontWeight="bold" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '0px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                        labelStyle={{ display: 'none' }}
                                    />
                                    <Bar dataKey="count" fill="#D62828" radius={[2, 2, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center">
                                <BarChart2 size={32} className="mx-auto text-gray-100 mb-4" />
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Data will appear once bookings begin.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
