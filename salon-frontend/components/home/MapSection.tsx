import ScrollReveal from '@/components/ui/ScrollReveal'

export default function MapSection() {
    const mapsUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.8!2d72.8562!3d19.1190!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA3JzA4LjQiTiA3MsKwNTEnMjIuMyJF!5e0!3m2!1sen!2sin!4v1612345678901'

    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal className="text-center mb-16">
                    <p className="text-[10px] tracking-[0.5em] uppercase text-brand-red mb-4 font-bold">Find Us</p>
                    <h2 className="section-heading text-brand-black">Our Heritage Location</h2>
                    <div className="red-divider" />
                    <p className="text-gray-500 text-sm mt-6 font-medium italic">
                        {process.env.NEXT_PUBLIC_SALON_ADDRESS || 'Jawed Habib Heritage Wing, Mumbai, Maharashtra 400001'}
                    </p>
                </ScrollReveal>

                <ScrollReveal>
                    <div className="relative overflow-hidden border-2 border-gray-50 shadow-xl" style={{ height: '450px' }}>
                        {/* Google Maps iframe */}
                        <iframe
                            src={mapsUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'grayscale(20%) contrast(100%)', opacity: 0.9 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Salon Location"
                        />
                        {/* Red overlay frame */}
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-brand-red" />
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}
