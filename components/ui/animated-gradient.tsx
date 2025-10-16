"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const AnimatedGradient = ({ className }: { className?: string }) => {
  return (
    <motion.div
      animate={{
        background: [
          "radial-gradient(circle at 0% 0%, rgba(102, 126, 234, 0.3) 0%, transparent 50%)",
          "radial-gradient(circle at 100% 100%, rgba(118, 75, 162, 0.3) 0%, transparent 50%)",
          "radial-gradient(circle at 0% 100%, rgba(102, 126, 234, 0.3) 0%, transparent 50%)",
          "radial-gradient(circle at 100% 0%, rgba(118, 75, 162, 0.3) 0%, transparent 50%)",
          "radial-gradient(circle at 0% 0%, rgba(102, 126, 234, 0.3) 0%, transparent 50%)",
        ],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      }}
      className={cn("absolute inset-0 opacity-50", className)}
    />
  )
}

