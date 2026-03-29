'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Calendar, Scissors, Image as ImageIcon, Clock } from 'lucide-react'
import AnalyticsTab from '@/components/admin/AnalyticsTab'
import AppointmentsTab from '@/components/admin/AppointmentsTab'
import ServiceManagerTab from '@/components/admin/ServiceManagerTab'
import GalleryManagerTab from '@/components/admin/GalleryManagerTab'
import ScrollReveal from '@/components/ui/ScrollReveal'

const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'services', label: 'Services', icon: Scissors },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
]

export default function AdminPage() {
    const { user, isAdmin, isLoading } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('analytics')
    const [lastUpdated, setLastUpdated] = useState<string>('')

    useEffect(() => {
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

        const interval = setInterval(() => {
            setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
        }, 60000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (!isLoading && (!user || !isAdmin)) {
            router.push('/login?redirect=/admin')
        }
    }, [user, isAdmin, isLoading, router])

    if (isLoading || !user || !isAdmin) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-[#fafafa]">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <p className="text-xs tracking-[0.4em] uppercase text-brand-red font-bold">Control Center</p>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                                    <Clock size={10} />
                                    <span>Last updated: {lastUpdated || 'just now'}</span>
                                </div>
                            </div>
                            <h1 className="section-heading text-5xl md:text-6xl text-brand-black">Admin Dashboard</h1>
                        </div>

                        {/* Tab Switcher - Now Sticky */}
                        <div className="flex bg-white border border-gray-100 p-1 shadow-sm sticky top-24 z-30">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2.5 px-6 py-3.5 text-[10px] tracking-widest uppercase transition-all duration-300 font-bold ${activeTab === tab.id
                                            ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                                            : 'text-gray-400 hover:text-brand-red hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon size={14} strokeWidth={2.5} />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </ScrollReveal>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'analytics' && <AnalyticsTab />}
                        {activeTab === 'appointments' && <AppointmentsTab />}
                        {activeTab === 'services' && <ServiceManagerTab />}
                        {activeTab === 'gallery' && <GalleryManagerTab />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
