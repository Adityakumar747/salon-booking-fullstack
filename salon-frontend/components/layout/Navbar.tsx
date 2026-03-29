'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    {
        label: 'Services',
        href: '/services',
        dropdown: [
            { label: 'Male', href: '/services?audience=male' },
            { label: 'Female', href: '/services?audience=female' },
            { label: 'Kids', href: '/services?audience=kids' },
        ]
    },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Book', href: '/book' },
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [hoveredLink, setHoveredLink] = useState<string | null>(null)
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
    const { user, logout, isAdmin } = useAuth()
    const pathname = usePathname()
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', handleScroll)
        // Initial check
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setIsOpen(false)
        setMobileExpanded(null)
    }, [pathname])

    const handleMouseEnter = (label: string) => {
        // ONLY trigger dropdown if the link is visually apparent to the user
        // 1. On Home page, links are always visible (white vs dark hero)
        // 2. On other pages, links are only visible once the navbar turns solid (scrolled state)
        const isPageHome = pathname === '/'
        const isVisible = isPageHome || scrolled

        if (!isVisible) return

        // Only allow dropdown hover if the link has a dropdown
        const link = navLinks.find(l => l.label === label)
        if (!link?.dropdown) return

        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current)
            closeTimeoutRef.current = null
        }
        setHoveredLink(label)
    }

    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setHoveredLink(null)
        }, 150)
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
                }`}
        >
            <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group relative z-50">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden bg-transparent">
                        <Image
                            src="/assets/photos/logo-new.png"
                            alt="Jawed Habib Logo"
                            fill
                            className="object-contain transition-transform duration-500 group-hover:scale-110 mix-blend-multiply brightness-[1.15] contrast-[1.2] saturate-[1.1]"
                            priority
                        />
                    </div>
                    <div className="flex flex-col items-center leading-none">
                        <span className={`font-serif text-xl md:text-2xl font-bold tracking-[0.1em] transition-colors duration-500 ${scrolled ? 'text-brand-black' : 'text-brand-white'}`}>JAWED HABIB</span>
                        {/* Removed HINO suffix */}
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <div
                            key={link.href}
                            className="relative py-2 flex items-center"
                            onMouseEnter={() => handleMouseEnter(link.label)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link
                                href={link.href}
                                className={`nav-link flex items-center gap-1.5 py-1 px-1 transition-all duration-500 ${scrolled ? 'text-brand-black' : 'text-white'
                                    } ${pathname === link.href ? 'text-brand-red font-semibold' : ''}`}
                                style={{
                                    textShadow: !scrolled ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                                }}
                            >
                                <span className="relative">
                                    {link.label}
                                    {/* Invisible bridge to catch mouse moving to dropdown */}
                                    {link.dropdown && hoveredLink === link.label && (
                                        <div className="absolute top-full left-0 w-full h-8 cursor-default" />
                                    )}
                                </span>
                                {link.dropdown && (
                                    <ChevronDown size={12} className={`transition-transform duration-300 ${hoveredLink === link.label ? 'rotate-180' : ''}`} />
                                )}
                            </Link>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {link.dropdown && hoveredLink === link.label && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute top-[calc(100%+0.5rem)] left-0 w-48 bg-white shadow-2xl border border-gray-100 py-3 z-[110] overflow-hidden rounded-sm"
                                        style={{ pointerEvents: 'auto' }}
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-red" />
                                        {link.dropdown.map((sub) => (
                                            <Link
                                                key={sub.href}
                                                href={sub.href}
                                                className="block px-6 py-3 text-[10px] tracking-[0.25em] font-black uppercase text-gray-500 hover:text-brand-red hover:bg-gray-50 transition-all border-l-0 hover:border-l-4 hover:border-brand-red"
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Desktop Auth */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <>
                            {isAdmin && (
                                <Link href="/admin" className={`nav-link text-xs ${scrolled ? 'text-brand-red' : 'text-brand-gold'}`}>
                                    Dashboard
                                </Link>
                            )}
                            <Link href="/profile" className={`nav-link text-xs ${scrolled ? 'text-brand-black' : 'text-brand-white'}`}>{user.name.split(' ')[0]}</Link>
                            <button onClick={logout} className="btn-outline-red text-[10px] px-5 py-2">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className={`nav-link text-xs transition-colors duration-500 ${scrolled ? 'text-brand-black' : 'text-brand-white'}`}>Login</Link>
                            <Link href="/book" className="btn-red text-[10px] px-7 py-3">Book Now</Link>
                        </>
                    )}
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 relative z-[150] text-brand-red"
                    aria-label="Toggle menu"
                >
                    <motion.span
                        animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
                        className={`block w-6 h-0.5 transition-transform origin-center ${scrolled || isOpen ? 'bg-brand-black' : 'bg-white'}`}
                    />
                    <motion.span
                        animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
                        className={`block w-6 h-0.5 ${scrolled || isOpen ? 'bg-brand-black' : 'bg-white'}`}
                    />
                    <motion.span
                        animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
                        className={`block w-6 h-0.5 transition-transform origin-center ${scrolled || isOpen ? 'bg-brand-black' : 'bg-white'}`}
                    />
                </button>
            </nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[140] md:hidden bg-white flex flex-col pt-24 px-8 shadow-2xl"
                    >
                        <div className="flex flex-col gap-8">
                            {navLinks.map((link, i) => (
                                <div key={link.href} className="flex flex-col border-b border-gray-50 pb-4 last:border-0">
                                    <div className="flex items-center justify-between">
                                        <Link
                                            href={link.href}
                                            className={`font-serif text-3xl font-black uppercase tracking-tight text-brand-black ${pathname === link.href ? 'text-brand-red' : ''}`}
                                        >
                                            {link.label}
                                        </Link>
                                        {link.dropdown && (
                                            <button
                                                onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                                                className="p-2 text-brand-red"
                                            >
                                                <ChevronDown size={28} className={`transition-transform duration-300 ${mobileExpanded === link.label ? 'rotate-180' : ''}`} />
                                            </button>
                                        )}
                                    </div>

                                    <AnimatePresence>
                                        {link.dropdown && mobileExpanded === link.label && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="flex flex-col gap-6 pl-2 pt-6 overflow-hidden"
                                            >
                                                {link.dropdown.map((sub) => (
                                                    <Link
                                                        key={sub.href}
                                                        href={sub.href}
                                                        className="text-xs tracking-[0.4em] uppercase font-bold text-gray-400 hover:text-brand-red active:text-brand-red transition-colors"
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pb-12 flex flex-col gap-4">
                            {user ? (
                                <>
                                    {isAdmin && <Link href="/admin" className="text-sm tracking-widest uppercase font-black text-brand-red">Admin Dashboard</Link>}
                                    <Link href="/profile" className="text-sm tracking-widest uppercase font-black text-brand-black">My Profile</Link>
                                    <button onClick={logout} className="btn-outline-red w-full py-4 text-[10px] font-black">LOGOUT</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="btn-outline-red text-center py-4 text-[10px] font-black">LOGIN</Link>
                                    <Link href="/book" className="btn-red text-center py-4 text-[10px] font-black shadow-xl shadow-brand-red/20">BOOK APPOINTMENT</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
