import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-brand-black border-t border-brand-red/20 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
                    {/* Brand */}
                    <div>
                        <div className="font-serif text-3xl font-bold tracking-[0.1em] text-brand-white mb-1">JAWED HABIB</div>
                        {/* Removed HINO suffix */}
                        <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                            World-class hair and beauty expertise. India's leading salon chain, bringing you the latest in grooming and style.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-xs tracking-[0.4em] uppercase text-brand-white mb-8 border-b border-brand-red/30 pb-2 inline-block">Explore</h3>
                        <ul className="flex flex-col gap-4">
                            {[
                                { label: 'Home', href: '/' },
                                { label: 'About Us', href: '/about' },
                                { label: 'Services', href: '/services' },
                                { label: 'Gallery', href: '/gallery' },
                                { label: 'Book Appointment', href: '/book' },
                                { label: 'My Journey', href: '/profile' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-gray-400 hover:text-brand-red transition-all duration-300 tracking-wide">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xs tracking-[0.4em] uppercase text-brand-white mb-8 border-b border-brand-red/30 pb-2 inline-block">Visit Us</h3>
                        <ul className="flex flex-col gap-4 text-sm text-gray-400">
                             <li>{process.env.NEXT_PUBLIC_SALON_ADDRESS || 'Jawed Habib Heritage Wing, Mumbai, Maharashtra 400001'}</li>
                            <li>
                                <a href={`tel:${process.env.NEXT_PUBLIC_SALON_PHONE}`} className="hover:text-brand-red transition-colors font-medium">
                                    {process.env.NEXT_PUBLIC_SALON_PHONE || '+91 9999999999'}
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${process.env.NEXT_PUBLIC_SALON_EMAIL}`} className="hover:text-brand-red transition-colors">
                                    {process.env.NEXT_PUBLIC_SALON_EMAIL || 'support@jawedhabib.com'}
                                </a>
                            </li>
                            <li className="text-brand-red font-medium mt-2">Open Daily: 9:00 AM – 9:00 PM</li>
                        </ul>
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-red/30 to-transparent mb-8" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-gray-500 tracking-widest uppercase font-medium">
                    <p>© {new Date().getFullYear()} JAWED HABIB. ALL RIGHTS RESERVED.</p>
                    <p className="flex items-center gap-2">
                        <span>PREMIUM EXPERIENCE</span>
                        <span className="w-1 h-1 rounded-full bg-brand-red"></span>
                        <span>MODERN DESIGN</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}
