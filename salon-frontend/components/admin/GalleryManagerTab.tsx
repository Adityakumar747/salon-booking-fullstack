'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { Upload, Trash2, Image as ImageIcon, Inbox } from 'lucide-react'

export default function GalleryManagerTab() {
    const queryClient = useQueryClient()
    const [isUploading, setIsUploading] = useState(false)

    const { data, isLoading } = useQuery({
        queryKey: ['admin-gallery'],
        queryFn: () => api.get('/gallery').then((res) => res.data),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/gallery/${id}`),
        onSuccess: () => {
            toast.success('Image removed')
            queryClient.invalidateQueries({ queryKey: ['admin-gallery'] })
        },
    })

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('image', file)
        formData.append('category', 'general')

        try {
            await api.post('/gallery', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            toast.success('Image uploaded')
            queryClient.invalidateQueries({ queryKey: ['admin-gallery'] })
        } catch (err) {
            toast.error('Upload failed')
        } finally {
            setIsUploading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="bg-[#fafafa] p-8 -m-8 min-h-screen">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="skeleton aspect-square bg-white border border-gray-100 shadow-sm" />
                    ))}
                </div>
            </div>
        )
    }

    const hasImages = data?.images && data.images.length > 0

    return (
        <div className="bg-[#fafafa] p-8 -m-8 min-h-screen">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h3 className="font-serif text-3xl text-brand-black font-black uppercase tracking-tight">Gallery</h3>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Manage portfolio images</p>
                </div>
                <label className="btn-red text-[10px] px-8 py-4 cursor-pointer shadow-lg shadow-brand-red/10 font-black tracking-widest uppercase flex items-center gap-2 hover:bg-brand-black transition-colors">
                    <Upload size={14} strokeWidth={3} />
                    <span>Upload Image</span>
                    <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
                </label>
            </div>

            {hasImages ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data.images.map((img: any) => (
                        <div key={img._id} className="relative aspect-square group overflow-hidden bg-white border border-gray-100 shadow-sm">
                            <Image src={img.cloudinaryUrl} alt="Gallery" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />

                            <div className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(img._id) }}
                                    className="w-14 h-14 bg-white text-brand-red flex items-center justify-center hover:bg-brand-red hover:text-white transition-all shadow-2xl rounded-full"
                                    title="Delete"
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-gray-200 bg-white">
                    <ImageIcon className="text-gray-100 mb-6" size={64} strokeWidth={1} />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Data will appear once bookings begin.</p>
                </div>
            )}
        </div>
    )
}
