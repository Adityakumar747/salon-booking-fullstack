import HeroSection from '@/components/home/HeroSection'
import ServicesPreview from '@/components/home/ServicesPreview'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import GalleryPreview from '@/components/home/GalleryPreview'
import MapSection from '@/components/home/MapSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesPreview />
      <TestimonialsSection />
      <GalleryPreview />
      <MapSection />
    </>
  )
}
