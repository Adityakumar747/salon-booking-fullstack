'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const text = ['Elevate Your', 'Natural Beauty']
const subtext = `The most distinguished luxury salon, where artistry meets elegance`

export default function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
            {/* Background with subtle image overlay */}
            <div className="absolute inset-0 z-0 opacity-40">
                <img
                    src="/assets/photos/salon-hero.png"
                    alt="Salon Background"
                    className="w-full h-full object-cover grayscale-[10%] contrast-[105%]"
                />
            </div>

            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-40"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-b from-white via-white/10 to-white"
                />

                {/* Brand Red accent lines */}
                <div className="absolute top-0 left-0 w-full h-px bg-gray-100" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gray-100" />

                {/* Decorative circles - subtle light version */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-gray-100"
                />
            </div>

            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto py-20">
                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center justify-center gap-4 mb-8"
                >
                    <div className="h-px w-10 bg-brand-red" />
                    <span className="text-xs tracking-[0.5em] uppercase text-brand-black font-semibold">Franchise Excellence</span>
                    <div className="h-px w-10 bg-brand-red" />
                </motion.div>

                {/* Main Headline */}
                <div className="overflow-hidden mb-8">
                    {text.map((line, lineIdx) => (
                        <div key={lineIdx} className="overflow-hidden">
                            <motion.h1
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1, delay: 0.3 + lineIdx * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                                className="font-serif text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] text-brand-black uppercase tracking-tight"
                            >
                                {lineIdx === 1 ? (
                                    <span className="text-brand-red italic font-light">{line}</span>
                                ) : (
                                    line
                                )}
                            </motion.h1>
                        </div>
                    ))}
                </div>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="text-gray-500 text-base md:text-lg max-w-lg mx-auto mb-14 leading-relaxed tracking-wide"
                >
                    {subtext}
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.1 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Link href="/book" className="btn-red text-xs px-12 py-4 shadow-lg shadow-brand-red/10">
                            Book Appointment
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Link href="/services" className="btn-outline-red text-xs px-12 py-4">
                            Explore Services
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.4 }}
                    className="grid grid-cols-3 items-center justify-center gap-6 sm:gap-16 mt-24 pt-12 border-t border-gray-100"
                >
                    {[
                        { value: '25+', label: 'Years Of Legacy' },
                        { value: '500+', label: 'Salons Worldwide' },
                        { value: 'Brand', label: 'By Jawed Habib' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center group">
                            <div className="font-serif text-2xl md:text-3xl text-brand-black font-bold group-hover:text-brand-red transition-colors">{stat.value}</div>
                            <div className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mt-1.5">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
