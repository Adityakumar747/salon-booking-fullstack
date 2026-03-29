'use client'

import { ReactNode, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Props {
    children: ReactNode
    delay?: number
    direction?: 'up' | 'down' | 'left' | 'right' | 'none'
    className?: string
    once?: boolean
}

export default function ScrollReveal({ children, delay = 0, direction = 'up', className = '', once = true }: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once, margin: '-80px 0px' })

    const directionVars = {
        up: { y: 40 },
        down: { y: -40 },
        left: { x: 40 },
        right: { x: -40 },
        none: {},
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, ...directionVars[direction] }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
