'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { motion } from 'framer-motion'

export default function GalleryPreview() {
    const { data } = useQuery({
        queryKey: ['gallery-preview'],
        queryFn: () => api.get('/gallery?limit=6').then((r) => r.data.images),
    })

    const assetImages = [
        '/assets/photos/Gemini_Generated_Image_6o8xj6o8xj6o8xj6.png',
        '/assets/photos/Gemini_Generated_Image_j01uicj01uicj01u.png',
        '/assets/photos/b_create_a_such_and_lu.jpeg',
        '/assets/photos/imagen-4.0-ultra-generate-001_b_i_want_a_photo_of_a.png',
    ]

    const getPlaceholderImages = () => {
        return Array.from({ length: 6 }).map((_, i) => ({
            _id: `placeholder-${i}`,
            cloudinaryUrl: assetImages[i % assetImages.length],
            caption: `Gallery Image ${i + 1}`,
        }))
    }

    const placeholders = getPlaceholderImages()

    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal className="text-center mb-16">
                    <p className="text-[10px] tracking-[0.5em] uppercase text-brand-red mb-4 font-bold">Portfolio</p>
                    <h2 className="section-heading text-brand-black">The Heritage Gallery</h2>
                    <div className="red-divider" />
                </ScrollReveal>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(data || placeholders).map((img: any, i: number) => (
                        <ScrollReveal key={img?._id || i} delay={i * 0.07}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                                className="relative overflow-hidden aspect-square group shadow-sm"
                            >
                                <Image
                                    src={img?.cloudinaryUrl || assetImages[i % assetImages.length]}
                                    alt={img?.caption || 'Gallery image'}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/10 transition-colors duration-500" />
                                <div className="absolute inset-x-0 bottom-0 py-4 bg-brand-black/60 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex items-center justify-center">
                                    <span className="text-[9px] text-white font-bold tracking-[0.3em] uppercase">View Masterpiece</span>
                                </div>
                            </motion.div>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal delay={0.3} className="text-center mt-16">
                    <Link href="/gallery" className="btn-outline-red px-10 py-3 text-[10px] tracking-widest font-bold uppercase">Complete Portfolio</Link>
                </ScrollReveal>
            </div>
        </section>
    )
}
