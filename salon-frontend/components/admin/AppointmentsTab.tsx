'use client'

import { useState } from 'react'
import { User, Scissors, Calendar, Clock, MoreHorizontal, Inbox } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { SkeletonTableRow } from '@/components/ui/SkeletonLoader'

const statusColors: Record<string, string> = {
    pending: 'text-orange-600 bg-orange-50/50 border-orange-100/50',
    confirmed: 'text-brand-black bg-gray-50 border-gray-100',
    completed: 'text-emerald-600 bg-emerald-50/50 border-emerald-100/50',
    cancelled: 'text-brand-red bg-brand-red/5 border-brand-red/10',
    archived: 'text-gray-400 bg-gray-50 border-gray-100 opacity-60',
}

export default function AppointmentsTab() {
    const [view, setView] = useState<'active' | 'archived'>('active')
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ['admin-appointments', view],
        queryFn: () => api.get(`/appointments?includeArchived=${view === 'archived'}&${view === 'archived' ? 'status=archived' : ''}`).then((res) => res.data),
    })

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            api.patch(`/appointments/${id}/status`, { status }),
        onSuccess: () => {
            toast.success('Record updated')
            queryClient.invalidateQueries({ queryKey: ['admin-appointments'] })
        },
        onError: () => toast.error('Update failed'),
    })

    const handleArchive = (id: string) => {
        if (confirm('Archive this record? It will be removed from your active view but preserved in history.')) {
            updateStatusMutation.mutate({ id, status: 'archived' })
        }
    }

    if (isLoading) {
        return (
            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#fafafa] border-b border-gray-100">
                        <tr>
                            {[
                                { label: 'Client', icon: User },
                                { label: 'Service', icon: Scissors },
                                { label: 'Date', icon: Calendar },
                                { label: 'Time', icon: Clock },
                                { label: 'Status', icon: MoreHorizontal },
                                { label: 'Actions', icon: null },
                            ].map((h) => {
                                const Icon = h.icon
                                return (
                                    <th key={h.label} className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gray-400 font-black">
                                            {Icon && <Icon size={12} strokeWidth={2.5} />}
                                            {h.label}
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map((i) => <SkeletonTableRow key={i} />)}
                    </tbody>
                </table>
            </div>
        )
    }

    const hasAppointments = data?.appointments && data.appointments.length > 0

    return (
        <div className="space-y-6">
            {/* View Toggle */}
            <div className="flex justify-end">
                <div className="flex bg-white border border-gray-100 p-1 shadow-sm">
                    <button
                        onClick={() => setView('active')}
                        className={`px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase font-black transition-all ${view === 'active' ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' : 'text-gray-400 hover:text-brand-red'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setView('archived')}
                        className={`px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase font-black transition-all ${view === 'archived' ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' : 'text-gray-400 hover:text-brand-red'}`}
                    >
                        History
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto text-brand-black">
                    <table className="w-full text-left">
                        <thead className="bg-[#fafafa] border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gray-400 font-black">
                                        <User size={12} strokeWidth={2.5} />
                                        Client Details
                                    </div>
                                </th>
                                <th className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gray-400 font-black">
                                        <Scissors size={12} strokeWidth={2.5} />
                                        Reserved Service
                                    </div>
                                </th>
                                <th className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gray-400 font-black">
                                        <Calendar size={12} strokeWidth={2.5} />
                                        Schedule
                                    </div>
                                </th>
                                <th className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gray-400 font-black">
                                        <MoreHorizontal size={12} strokeWidth={2.5} />
                                        Status
                                    </div>
                                </th>
                                <th className="px-6 py-5 text-[10px] tracking-[0.2em] uppercase text-gray-400 font-black text-right">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {hasAppointments ? (
                                data.appointments.map((apt: any) => (
                                    <tr key={apt._id} className="hover:bg-[#fafafa]/50 transition-colors">
                                        <td className="px-6 py-6">
                                            <div className="text-brand-black text-sm font-bold uppercase tracking-tight">{apt.user?.name}</div>
                                            <div className="text-gray-400 text-[10px] mt-1 font-medium italic">{apt.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="text-brand-black text-sm font-bold uppercase tracking-tight">{apt.service?.name}</div>
                                            <div className="text-brand-red text-[9px] mt-1 font-black uppercase tracking-widest">{apt.service?.category}</div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="text-brand-black text-sm font-bold uppercase tracking-tight">{apt.date}</div>
                                            <div className="text-gray-400 text-[10px] mt-1 font-medium uppercase tracking-widest leading-none flex items-center gap-1">
                                                <Clock size={10} className="text-brand-red/40" />
                                                {apt.timeSlot}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`px-3 py-1.5 text-[9px] tracking-[0.1em] uppercase font-black border ${statusColors[apt.status]}`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            {view === 'active' ? (
                                                <div className="flex items-center justify-end gap-3">
                                                    <select
                                                        className="bg-[#fafafa] border-2 border-gray-50 text-[10px] font-black uppercase tracking-widest text-brand-black px-4 py-2 focus:border-brand-red outline-none transition-all cursor-pointer hover:border-gray-200"
                                                        value={apt.status}
                                                        onChange={(e) => updateStatusMutation.mutate({ id: apt._id, status: e.target.value })}
                                                    >
                                                        <option value="pending">PENDING</option>
                                                        <option value="confirmed">CONFIRM</option>
                                                        <option value="completed">COMPLETE</option>
                                                        <option value="cancelled">CANCEL</option>
                                                    </select>
                                                    <button
                                                        onClick={() => handleArchive(apt._id)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-brand-red transition-colors"
                                                        title="Archive"
                                                    >
                                                        <Inbox size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => updateStatusMutation.mutate({ id: apt._id, status: 'pending' })}
                                                    className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-red hover:underline"
                                                >
                                                    Restore to Active
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Inbox className="text-gray-100" size={48} strokeWidth={1} />
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                                                {view === 'active' ? 'Data will appear once bookings begin.' : 'No archived records found.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
