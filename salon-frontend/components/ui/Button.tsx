'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'gold' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    href?: string
    isLoading?: boolean
    children: ReactNode
}

const variants = {
    gold: 'btn-gold',
    outline: 'btn-outline-gold',
    ghost: 'text-sm text-gray-400 hover:text-[#c9a84c] transition-colors tracking-widest uppercase',
}

const sizes = {
    sm: 'text-xs px-5 py-2',
    md: 'text-sm px-8 py-3',
    lg: 'text-base px-10 py-4',
}

export default function Button({ variant = 'gold', size = 'md', href, isLoading, children, className = '', ...rest }: ButtonProps) {
    const classes = `${variants[variant]} ${sizes[size]} ${className} relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed`

    const content = (
        <motion.span
            whileHover={{ scale: variant !== 'ghost' ? 1.03 : 1 }}
            whileTap={{ scale: 0.97 }}
            className={classes}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
            {isLoading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : children}
        </motion.span>
    )

    if (href) return <Link href={href}>{content}</Link>

    return (
        <button {...rest} className={classes} disabled={isLoading || rest.disabled}>
            {isLoading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : children}
        </button>
    )
}
