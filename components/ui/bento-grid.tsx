"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  )
}

export const BentoGridItem = ({
  className,
  title,
  description,
  icon,
  index,
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  icon?: React.ReactNode
  index?: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index ? index * 0.1 : 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 hover:border-white/40 transition-all duration-300",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
        className
      )}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="mb-4 text-5xl text-blue-400">{icon}</div>
        <div className="mb-3 text-2xl font-bold text-white">
          {title}
        </div>
        <div className="text-base text-gray-200 leading-relaxed">
          {description}
        </div>
      </div>

      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl" />
      </div>
    </motion.div>
  )
}

