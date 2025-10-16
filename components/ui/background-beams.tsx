"use client"

import { motion } from "framer-motion"
import React from "react"
import { cn } from "@/lib/utils"

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const paths = [
    "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
    "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
    "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
  ]

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <svg
        className="absolute w-full h-full"
        width="100%"
        height="100%"
        viewBox="0 0 696 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {paths.map((path, index) => (
          <motion.path
            key={`path-${index}`}
            d={path}
            stroke={`url(#linearGradient-${index})`}
            strokeOpacity="0.4"
            strokeWidth="0.5"
          />
        ))}
        <defs>
          {paths.map((_, index) => (
            <motion.linearGradient
              key={`gradient-${index}`}
              id={`linearGradient-${index}`}
              initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
              animate={{
                x1: ["0%", "100%"],
                x2: ["0%", "95%"],
                y1: ["0%", "100%"],
                y2: ["0%", `${93 + index * 1}%`],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <stop stopColor="#0088cc" stopOpacity="0" />
              <stop stopColor="#0088cc" />
              <stop offset="1" stopColor="#00d4ff" />
            </motion.linearGradient>
          ))}
        </defs>
      </svg>
    </div>
  )
}

