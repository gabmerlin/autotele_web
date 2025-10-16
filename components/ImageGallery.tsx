'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'

interface ImageItem {
  src: string
  title: string
}

interface ImageGalleryProps {
  images: ImageItem[]
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => setSelectedImage(image)}
            className="group relative aspect-video overflow-hidden rounded-2xl cursor-pointer glass-panel hover:border-blue-500/50 transition-all duration-300"
          >
            {/* Image */}
            <div className="relative w-full h-full">
              <Image
                src={image.src}
                alt={image.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 rounded-full bg-blue-500/80 backdrop-blur-sm flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white" />
                </div>
              </div>
              
              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-semibold text-lg drop-shadow-lg">
                  {image.title}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Title */}
            <div className="absolute top-6 left-6 z-10">
              <p className="text-white text-2xl font-bold drop-shadow-lg">
                {selectedImage.title}
              </p>
            </div>

            {/* Image container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-7xl max-h-[90vh] w-full"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  width={1920}
                  height={1080}
                  className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-2xl shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Instructions */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-white/60 text-sm">
                Cliquez n'importe où pour fermer
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}


