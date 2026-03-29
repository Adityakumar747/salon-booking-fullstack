'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Service {
    _id: string
    name: string
    category: string
    audience?: string
    description: string
    price: number
    duration: number
    imageUrl: string
}

const categoryColors: Record<string, string> = {
    hair: '#D62828',
    skin: '#111111',
    bridal: '#B91D1D',
    grooming: '#C9A227',
}

const categoryImages: Record<string, string> = {
    hair: '/assets/photos/hair-service.png',
    skin: '/assets/photos/facial-service.png',
    bridal: '/assets/photos/bridal-service.png',
    grooming: '/assets/photos/barber-service.png',
}

export default function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
    const color = categoryColors[service.category] || '#D62828'
    const displayImage = service.imageUrl || categoryImages[service.category] || categoryImages.hair

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="bg-white overflow-hidden group border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-brand-red/5 transition-all duration-500 cursor-pointer flex flex-col rounded-none"
        >
            {/* Image */}
            <div className="relative h-60 overflow-hidden">
                <Image
                    src={displayImage}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Category badge */}
                <span
                    className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.3em] px-4 py-1.5 font-bold shadow-sm"
                    style={{ background: 'white', color: '#111', borderLeft: `3px solid ${color}` }}
                >
                    {service.category}
                </span>
            </div>

            {/* Content */}
            <div className="p-7 flex flex-col flex-1 relative">
                {/* Red accent bar on hover */}
                <div className="absolute top-0 left-0 w-0 h-1 bg-brand-red group-hover:w-full transition-all duration-500" />

                <h3 className="font-serif text-2xl text-brand-black mb-3 group-hover:text-brand-red transition-colors duration-300 font-bold">
                    {service.name}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-2">
                    {service.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Starting At</span>
                        <span className="text-brand-red font-bold text-xl">₹{service.price.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Duration</span>
                        <span className="text-sm text-brand-black font-semibold uppercase">{service.duration} min</span>
                    </div>
                </div>

                {/* Book CTA */}
                <Link
                    href={`/book?serviceId=${service._id}`}
                    className="mt-6 btn-red w-full text-[10px] py-3.5 flex items-center justify-center gap-2 group-hover:bg-brand-black transition-colors duration-500"
                >
                    <span>Reserve Seat</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </motion.div>
    )
}
