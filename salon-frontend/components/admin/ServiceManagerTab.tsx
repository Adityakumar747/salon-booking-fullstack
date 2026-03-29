'use client'

import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Pencil, Trash2, Plus, Clock, Scissors, IndianRupee, Type, Image as ImageIcon, Sparkles, Users } from 'lucide-react'

export default function ServiceManagerTab() {
    const queryClient = useQueryClient()
    const [editingService, setEditingService] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const { data, isLoading } = useQuery({
        queryKey: ['admin-services'],
        queryFn: () => api.get('/services').then((res) => res.data.services),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/services/${id}`),
        onSuccess: () => {
            toast.success('Service deleted')
            queryClient.invalidateQueries({ queryKey: ['admin-services'] })
        },
    })

    const openModal = (service: any = null) => {
        setEditingService(service)
        setIsModalOpen(true)
        setTimeout(() => formRef.current?.reset(), 0)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingService(null)
        formRef.current?.reset()
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isSubmitting) return

        const formData = new FormData(e.currentTarget)

        const name = (formData.get('name') as string)?.trim()
        const description = (formData.get('description') as string)?.trim()
        const price = formData.get('price')
        const duration = formData.get('duration')

        if (!name || name.length < 2) return toast.error('Service title must be at least 2 characters')
        if (!description || description.length < 10) return toast.error('Description must be at least 10 characters')
        if (!price || Number(price) < 0) return toast.error('Enter a valid price')
        if (!duration || Number(duration) < 15) return toast.error('Duration must be at least 15 minutes')

        setIsSubmitting(true)
        try {
            if (editingService) {
                await api.put(`/services/${editingService._id}`, formData, { timeout: 60000 })
                toast.success('Service updated successfully')
            } else {
                await api.post('/services', formData, { timeout: 60000 })
                toast.success('Service added successfully')
            }
            closeModal()
            queryClient.invalidateQueries({ queryKey: ['admin-services'] })
        } catch (err: any) {
            const serverMessage =
                err?.response?.data?.errors?.[0] ||
                err?.response?.data?.message ||
                err?.message ||
                'Something went wrong. Please try again.'

            if (err?.response?.status === 422 || (serverMessage as string).toLowerCase().includes('upload')) {
                toast.error('Image upload failed — check Cloudinary credentials in .env')
            } else if (err?.response?.status === 400) {
                toast.error(`Validation: ${serverMessage}`)
            } else {
                toast.error(serverMessage)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-[#fafafa] p-8 -m-8 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 className="font-serif text-3xl text-brand-black font-black uppercase tracking-tight">Service Catalog</h3>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Manage salon offerings</p>
                </div>
                <button
                    onClick={() => openModal(null)}
                    className="btn-red text-[10px] px-8 py-3.5 shadow-lg shadow-brand-red/20 font-bold tracking-widest uppercase flex items-center gap-2"
                >
                    <Plus size={14} strokeWidth={3} />
                    <span>New Specialty</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data?.map((service: any) => (
                    <div key={service._id} className="bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group overflow-hidden">
                        <div className="relative h-56 bg-gray-100 overflow-hidden">
                            {service.imageUrl && (
                                <Image
                                    src={service.imageUrl}
                                    alt={service.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            )}
                            <div className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button
                                    onClick={() => openModal(service)}
                                    className="w-12 h-12 flex items-center justify-center bg-white text-brand-black hover:bg-brand-red hover:text-white transition-all shadow-xl rounded-full"
                                    title="Edit"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(service._id) }}
                                    className="w-12 h-12 flex items-center justify-center bg-white text-brand-red hover:bg-brand-red hover:text-white transition-all shadow-xl rounded-full"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <span className="bg-brand-red text-white text-[9px] font-black uppercase px-3 py-1 tracking-widest">
                                    {service.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4 gap-4">
                                <h4 className="font-serif text-2xl text-brand-black font-black uppercase tracking-tight leading-none">{service.name}</h4>
                                <span className="text-xl font-black text-brand-red">₹{service.price}</span>
                            </div>
                            <p className="text-sm text-gray-400 mb-6 line-clamp-2 leading-relaxed font-medium italic">"{service.description}"</p>
                            <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] font-black uppercase text-gray-300 pt-6 border-t border-gray-50">
                                <span className="flex items-center gap-2">
                                    <Clock size={12} className="text-brand-red" strokeWidth={2.5} />
                                    {service.duration} MINS
                                </span>
                                {service.audience && service.audience !== 'all' && (
                                    <span className="flex items-center gap-2 ml-auto">
                                        <Users size={12} className="text-brand-red" strokeWidth={2.5} />
                                        {service.audience}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] bg-brand-black/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white w-full max-w-xl p-10 shadow-2xl border border-gray-100 relative"
                    >
                        <div className="flex items-center gap-3 mb-10">
                            <div className="bg-brand-red/5 p-3">
                                <Sparkles className="text-brand-red" size={24} />
                            </div>
                            <h2 className="font-serif text-3xl text-brand-black font-black uppercase tracking-tight">{editingService ? 'Modify' : 'Create'} Specialty</h2>
                        </div>

                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <Type size={12} strokeWidth={2.5} />
                                    Service Title
                                </label>
                                <input type="text" name="name" defaultValue={editingService?.name} placeholder="e.g. Signature Haircut" required className="w-full bg-[#fafafa] border-2 border-gray-50 px-5 py-4 text-sm text-brand-black font-bold focus:border-brand-red outline-none transition-all" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                        <Scissors size={12} strokeWidth={2.5} />
                                        Category
                                    </label>
                                    <select name="category" defaultValue={editingService?.category || 'hair'} className="w-full bg-[#fafafa] border-2 border-gray-50 px-5 py-4 text-sm text-brand-black font-bold focus:border-brand-red outline-none transition-all">
                                        <option value="hair">Hair</option>
                                        <option value="skin">Skin</option>
                                        <option value="bridal">Bridal</option>
                                        <option value="grooming">Grooming</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                        <IndianRupee size={12} strokeWidth={2.5} />
                                        Price (₹)
                                    </label>
                                    <input type="number" name="price" defaultValue={editingService?.price} placeholder="0" required className="w-full bg-[#fafafa] border-2 border-gray-50 px-5 py-4 text-sm text-brand-black font-bold focus:border-brand-red outline-none transition-all" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <Users size={12} strokeWidth={2.5} />
                                    Audience
                                </label>
                                <select name="audience" defaultValue={editingService?.audience || 'all'} className="w-full bg-[#fafafa] border-2 border-gray-50 px-5 py-4 text-sm text-brand-black font-bold focus:border-brand-red outline-none transition-all">
                                    <option value="all">All Audiences</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="kids">Kids</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                        <Clock size={12} strokeWidth={2.5} />
                                        Duration (Min)
                                    </label>
                                    <input type="number" name="duration" defaultValue={editingService?.duration} placeholder="45" required className="w-full bg-[#fafafa] border-2 border-gray-50 px-5 py-4 text-sm text-brand-black font-bold focus:border-brand-red outline-none transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                        <ImageIcon size={12} strokeWidth={2.5} />
                                        Featured Image
                                    </label>
                                    <input type="file" name="image" accept="image/jpeg,image/png,image/webp" className="text-[10px] text-gray-400 file:bg-brand-red/5 file:border-0 file:text-brand-red file:px-4 file:py-2 file:mr-4 file:font-black file:uppercase file:cursor-pointer hover:file:bg-brand-red/10 pt-2" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Marketing Description</label>
                                <textarea name="description" defaultValue={editingService?.description} rows={3} placeholder="Describe the luxury experience..." required className="w-full bg-[#fafafa] border-2 border-gray-50 px-5 py-4 text-sm text-brand-black font-bold focus:border-brand-red outline-none transition-all" />
                            </div>

                            <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-50">
                                <button type="button" onClick={closeModal} className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-8 py-4 hover:text-brand-black transition-colors">Discard</button>
                                <button type="submit" disabled={isSubmitting} className="btn-red text-[10px] px-10 py-4 shadow-xl shadow-brand-red/10 font-bold tracking-widest disabled:opacity-60 disabled:cursor-not-allowed">
                                    {isSubmitting ? 'SAVING...' : editingService ? 'SAVE CHANGES' : 'PUBLISH SPECIALTY'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
