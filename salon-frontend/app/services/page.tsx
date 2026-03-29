'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import api from '@/lib/api'
import ServiceCard from '@/components/services/ServiceCard'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { SkeletonServiceCard } from '@/components/ui/SkeletonLoader'
import { motion, AnimatePresence } from 'framer-motion'

const categories = [
    { value: '', label: 'All Services' },
    { value: 'hair', label: 'Hair' },
    { value: 'skin', label: 'Skin' },
    { value: 'bridal', label: 'Bridal' },
    { value: 'grooming', label: 'Grooming' },
]

const audiences = [
    { value: '', label: 'All' },
    { value: 'male', label: 'Men' },
    { value: 'female', label: 'Women' },
    { value: 'kids', label: 'Kids' },
]

function ServicesContent() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const activeCategory = searchParams.get('category') || ''
    const activeAudience = searchParams.get('audience') || ''

    const updateFilters = (newCat: string, newAud: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (newCat) params.set('category', newCat)
        else params.delete('category')

        if (newAud) params.set('audience', newAud)
        else params.delete('audience')

        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const { data, isLoading } = useQuery({
        queryKey: ['services'],
        queryFn: () => api.get('/services').then((r) => r.data.services),
    })

    const filtered = useMemo(() => {
        if (!data) return []
        return data.filter((s: any) => {
            const catMatch = !activeCategory || s.category === activeCategory
            const audMatch =
                !activeAudience ||
                s.audience === activeAudience ||
                !s.audience ||
                s.audience === 'all'
            return catMatch && audMatch
        })
    }, [data, activeCategory, activeAudience])

    const catBtnClass = (active: boolean) =>
        `px-8 py-2.5 text-[10px] tracking-[0.25em] uppercase font-bold transition-all duration-300 border-2 shadow-sm ${active
            ? 'bg-brand-red text-white border-brand-red'
            : 'border-gray-100 text-gray-500 hover:border-brand-red hover:text-brand-red'
        }`

    const audBtnClass = (active: boolean) =>
        `px-6 py-2 text-[9px] tracking-[0.25em] uppercase font-bold transition-all duration-300 border shadow-sm ${active
            ? 'bg-brand-black text-white border-brand-black'
            : 'border-gray-100 text-gray-400 hover:border-brand-black hover:text-brand-black'
        }`

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <ScrollReveal className="text-center mb-16">
                <p className="text-xs tracking-[0.5em] uppercase text-brand-red mb-4 font-bold">What We Do</p>
                <h1 className="section-heading text-5xl md:text-7xl font-black uppercase text-brand-black">Our Services</h1>
                <div className="red-divider" />
                <p className="text-gray-500 text-sm mt-6 max-w-lg mx-auto leading-relaxed">
                    Industry-leading hair and beauty services. Experience the legacy of style and precision by the master himself.
                </p>
            </ScrollReveal>

            {/* Category Filter */}
            <ScrollReveal className="flex flex-wrap justify-center gap-4 mb-4">
                {categories.map((cat) => (
                    <motion.button
                        key={cat.value}
                        onClick={() => updateFilters(cat.value, activeAudience)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={catBtnClass(activeCategory === cat.value)}
                    >
                        {cat.label}
                    </motion.button>
                ))}
            </ScrollReveal>

            {/* Audience Filter */}
            <ScrollReveal className="flex flex-wrap justify-center gap-3 mb-16">
                {audiences.map((aud) => (
                    <motion.button
                        key={aud.value}
                        onClick={() => updateFilters(activeCategory, aud.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={audBtnClass(activeAudience === aud.value)}
                    >
                        {aud.label}
                    </motion.button>
                ))}
            </ScrollReveal>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => <SkeletonServiceCard key={i} />)
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filtered.map((s: any, i: number) => (
                            <motion.div
                                key={s._id}
                                layout
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.25, delay: i * 0.04 }}
                            >
                                <ServiceCard service={s} index={i} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {!isLoading && filtered.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-sm tracking-widest uppercase">No services available for this selection.</p>
                </div>
            )}
        </div>
    )
}

import { Suspense } from 'react'

export default function ServicesPage() {
    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-[#fafafa]">
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-brand-red/[0.03] to-transparent pointer-events-none" />
            <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading catalog...</div>}>
                <div className="relative z-10">
                    <ServicesContent />
                </div>
            </Suspense>
        </div>
    )
}
