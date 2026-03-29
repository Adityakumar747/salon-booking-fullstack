'use client'

import Image from 'next/image'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { motion } from 'framer-motion'

const testimonials = [
    {
        id: 1,
        name: 'Priya Sharma',
        text: 'Absolutely transformed my look! The stylists at Jawed Habib are true artists. The bridal package was everything I dreamed of and more.',
        service: 'Bridal Package',
        rating: 5,
        avatar: '/assets/photos/Gemini_Generated_Image_6o8xj6o8xj6o8xj6.png',
    },
    {
        id: 2,
        name: 'Rahul Mehta',
        text: 'The grooming experience here is on another level. Precise, clean, and honestly relaxing. A heritage legacy worth experiencing.',
        service: 'Premium Grooming',
        rating: 5,
        avatar: '/assets/photos/Gemini_Generated_Image_j01uicj01uicj01u.png',
    },
    {
        id: 3,
        name: 'Anika Kapoor',
        text: 'I\'ve visited many salons in Mumbai, none compare to the technique and history at Jawed Habib. My hair has never felt this healthy.',
        service: 'Hair Therapy',
        rating: 5,
        avatar: '/assets/photos/b_create_a_such_and_lu.jpeg',
    },
]

export default function TestimonialsSection() {
    return (
        <section className="py-24 px-6 bg-[#fafafa]">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal className="text-center mb-16">
                    <p className="text-[10px] tracking-[0.5em] uppercase text-brand-red mb-4 font-bold">Client Stories</p>
                    <h2 className="section-heading text-brand-black">Our Heritage Impact</h2>
                    <div className="red-divider" />
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <ScrollReveal key={t.id} delay={i * 0.15}>
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white p-10 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col h-full relative"
                            >
                                <div className="absolute top-8 right-8 text-brand-red/10 text-6xl font-serif">"</div>
                                {/* Stars */}
                                <div className="flex gap-1 mb-6">
                                    {Array.from({ length: t.rating }).map((_, j) => (
                                        <svg key={j} className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    ))}
                                </div>

                                <p className="text-gray-500 text-sm leading-relaxed flex-1 italic font-medium">"{t.text}"</p>

                                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-4">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={t.avatar}
                                            alt={t.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-bold text-brand-black uppercase tracking-tight text-sm">{t.name}</div>
                                        <div className="text-[10px] text-brand-red tracking-widest uppercase mt-1 font-black">{t.service}</div>
                                    </div>
                                </div>
                            </motion.div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
