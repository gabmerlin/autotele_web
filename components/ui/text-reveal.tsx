"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export const TextReveal = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const text = typeof children === "string" ? children : ""
  const words = text.split(" ")

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

