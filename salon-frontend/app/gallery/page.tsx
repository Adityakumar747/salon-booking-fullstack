'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { motion, AnimatePresence } from 'framer-motion'

export default function GalleryPage() {
    const [lightbox, setLightbox] = useState<string | null>(null)
    const [page, setPage] = useState(1)

    const { data, isLoading } = useQuery({
        queryKey: ['gallery', page],
        queryFn: () => api.get(`/gallery?page=${page}&limit=18`).then((r) => r.data),
    })

    const assetImages = [
        '/assets/photos/hair-service.png',
        '/assets/photos/facial-service.png',
        '/assets/photos/bridal-service.png',
        '/assets/photos/barber-service.png',
        '/assets/photos/hair-kids-service.png',
        '/assets/photos/hair-color-service.png',
    ]

    const getPlaceholderImages = () => {
        return Array.from({ length: 18 }).map((_, i) => ({
            _id: `placeholder-${i}`,
            cloudinaryUrl: assetImages[i % assetImages.length],
            caption: `Gallery Image ${i + 1}`,
        }))
    }

    const images: any[] = data?.images && data.images.length > 0 ? data.images : getPlaceholderImages()

    return (
        <div className="min-h-screen pt-32 pb-24 px-6">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal className="text-center mb-16">
                    <p className="text-xs tracking-[0.5em] uppercase text-brand-red mb-4 font-bold">Portfolio</p>
                    <h1 className="section-heading text-5xl md:text-7xl font-black uppercase text-brand-black">The Gallery</h1>
                    <div className="red-divider" />
                </ScrollReveal>

                {/* Masonry Grid */}
                {isLoading ? (
                    <div className="columns-2 md:columns-3 gap-4 space-y-4">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className={`skeleton w-full break-inside-avoid ${i % 3 === 0 ? 'h-72' : 'h-48'}`} />
                        ))}
                    </div>
                ) : images.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-sm tracking-widest uppercase">Masterpieces in progress...</p>
                    </div>
                ) : (
                    <div className="columns-2 md:columns-3 gap-4 space-y-4">
                        {images.map((img: any, i: number) => (
                            <ScrollReveal key={img._id} delay={i * 0.05} className="break-inside-avoid">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="relative overflow-hidden cursor-pointer group shadow-sm border border-gray-100"
                                    onClick={() => setLightbox(img.cloudinaryUrl)}
                                >
                                    <div className="relative" style={{ paddingBottom: i % 3 === 0 ? '133%' : '75%' }}>
                                        <Image
                                            src={img.cloudinaryUrl || assetImages[i % assetImages.length]}
                                            alt={img.caption || 'Gallery image'}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                            sizes="(max-width: 768px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/20 transition-all duration-500 flex items-center justify-center">
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            whileHover={{ opacity: 1, y: 0 }}
                                            className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 bg-brand-red p-3 rounded-full"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </motion.div>
                                    </div>
                                    {img.caption && (
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 border-t border-brand-red/20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <p className="text-xs text-brand-black font-semibold tracking-wide truncate uppercase">{img.caption}</p>
                                        </div>
                                    )}
                                </motion.div>
                            </ScrollReveal>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {data?.pages > 1 && (
                    <div className="flex justify-center gap-4 mt-16">
                        {Array.from({ length: data.pages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`w-12 h-12 text-sm font-bold transition-all duration-300 flex items-center justify-center border-2 ${page === i + 1 ? 'bg-brand-red text-white border-brand-red' : 'border-gray-100 text-gray-400 hover:border-brand-red hover:text-brand-red shadow-sm'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightbox(null)}
                        className="fixed inset-0 z-[100] bg-brand-black/98 flex items-center justify-center p-6 cursor-pointer backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-5xl max-h-[85vh] w-full cursor-default"
                        >
                            <div className="relative aspect-[3/2] w-full">
                                <Image src={lightbox} alt="Gallery preview" fill className="object-contain" />
                            </div>
                            <button
                                onClick={() => setLightbox(null)}
                                className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center bg-brand-red text-white hover:bg-brand-red-dark transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
