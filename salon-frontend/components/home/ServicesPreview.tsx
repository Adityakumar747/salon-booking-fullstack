'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import ServiceCard from '@/components/services/ServiceCard'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { SkeletonServiceCard } from '@/components/ui/SkeletonLoader'

export default function ServicesPreview() {
    const { data, isLoading } = useQuery({
        queryKey: ['services-preview'],
        queryFn: () => api.get('/services').then((r) => r.data.services.slice(0, 3)),
    })

    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal className="text-center mb-16">
                    <p className="text-[10px] tracking-[0.5em] uppercase text-brand-red mb-4 font-bold">What We Offer</p>
                    <h2 className="section-heading text-brand-black">Signature Services</h2>
                    <div className="red-divider" />
                    <p className="text-gray-400 mt-6 max-w-md mx-auto text-sm leading-relaxed font-medium italic">
                        From transformative hair artistry to indulgent skincare rituals — each service is a testament to the Jawed Habib legacy.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {isLoading
                        ? Array.from({ length: 3 }).map((_, i) => <SkeletonServiceCard key={i} />)
                        : (data || []).map((s: any, i: number) => <ServiceCard key={s._id} service={s} index={i} />)
                    }
                </div>

                <ScrollReveal delay={0.3} className="text-center mt-16">
                    <Link href="/services" className="btn-outline-red px-10 py-3 text-[10px] tracking-widest font-bold uppercase">
                        Discover More Master Stylists
                    </Link>
                </ScrollReveal>
            </div>
        </section>
    )
}
