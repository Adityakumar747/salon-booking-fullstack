'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AboutPage() {
    return (
        <div className="pt-20">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-brand-black">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="/assets/photos/facial-service.png"
                        alt="Heritage Salon"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-serif text-brand-white uppercase mb-4 tracking-tight">
                            Our <span className="text-brand-red italic">Legacy</span>
                        </h1>
                        <div className="w-20 h-1 bg-brand-red mx-auto mb-6" />
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                            Crafting beauty and confidence through decades of hair-styling excellence.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Heritage Section */}
            <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-brand-red text-sm font-semibold tracking-[0.3em] uppercase mb-4 block">The Beginning</span>
                        <h2 className="section-heading mb-8">A Journey Of <br />Precision & Artistry</h2>
                        <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                            <p>
                                Jawed Habib is more than just a name; it is a heritage. With a legacy spanning over three generations in the hair styling industry, our brand has become synonymous with luxury, innovation, and trust.
                            </p>
                            <p>
                                Our journey began with a vision to revolutionize hair fashion in India, bringing international standards and techniques to the local landscape. Today, we stand as one of the largest and most respected salon chains globally.
                            </p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-2xl"
                    >
                        <img
                            src="/assets/photos/hair-service.png"
                            alt="Jawed Habib Craft"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-black/80 to-transparent p-8 text-white">
                            <p className="font-serif italic text-xl">"Hair styling is not just a profession; it's a way to express who you truly are."</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-gray-50 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse" />
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white p-12 shadow-sm border-t-4 border-brand-red"
                        >
                            <h3 className="font-serif text-3xl mb-6 text-brand-black">Our Mission</h3>
                            <p className="text-gray-500 leading-relaxed">
                                To provide world-class hair and beauty services that empower individuals to look and feel their best, using cutting-edge techniques and premium products delivered by highly trained professionals.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white p-12 shadow-sm border-t-4 border-brand-red"
                        >
                            <h3 className="font-serif text-3xl mb-6 text-brand-black">Our Vision</h3>
                            <p className="text-gray-500 leading-relaxed">
                                To remain at the forefront of the global beauty industry, expanding our reach while maintaining the same dedication to quality and craftsmanship that has defined us for generations.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="py-32 bg-brand-black text-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="max-w-4xl mx-auto"
                >
                    <span className="text-brand-red text-6xl font-serif">"</span>
                    <h2 className="text-3xl md:text-5xl font-serif text-brand-white leading-tight mb-8">
                        We don't just cut hair; <br />
                        we <span className="text-brand-red">sculpt</span> personalities.
                    </h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-8 bg-gray-700" />
                        <span className="text-gray-400 uppercase tracking-[0.4em] text-xs">Jawed Habib</span>
                        <div className="h-px w-8 bg-gray-700" />
                    </div>
                </motion.div>
            </section>
        </div>
    )
}
