export function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div className={`skeleton rounded-none h-64 ${className}`} />
    )
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className={`skeleton h-4 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
            ))}
        </div>
    )
}

export function SkeletonServiceCard() {
    return (
        <div className="glass-card overflow-hidden">
            <div className="skeleton h-56 w-full" />
            <div className="p-6">
                <SkeletonText lines={2} />
                <div className="mt-4 flex gap-2">
                    <div className="skeleton h-6 w-20 rounded" />
                    <div className="skeleton h-6 w-16 rounded" />
                </div>
            </div>
        </div>
    )
}

export function SkeletonTableRow() {
    return (
        <tr className="border-b border-[#c9a84c]/10">
            {Array.from({ length: 5 }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="skeleton h-4 rounded w-full" />
                </td>
            ))}
        </tr>
    )
}
