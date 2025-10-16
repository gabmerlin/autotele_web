"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: { name: string; link: string; icon?: React.ReactNode }[]
  className?: string
}) => {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const updateVisibility = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > 100) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener("scroll", updateVisibility)
    return () => window.removeEventListener("scroll", updateVisibility)
  }, [])

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)"]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      style={{ backgroundColor }}
      className={cn(
        "fixed top-6 inset-x-0 max-w-fit mx-auto z-50 px-8 py-4 rounded-full border border-white/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
        className
      )}
    >
      <div className="flex items-center justify-center space-x-8">
        {navItems.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            className="text-white hover:text-purple-300 transition-colors duration-200 flex items-center space-x-2 text-sm font-medium"
          >
            {item.icon}
            <span>{item.name}</span>
          </a>
        ))}
      </div>
    </motion.div>
  )
}

