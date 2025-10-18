"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export const FloatingNav = ({
  navItems,
  className,
  rightElement,
}: {
  navItems: { name: string; link: string; icon?: React.ReactNode }[]
  className?: string
  rightElement?: React.ReactNode
}) => {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(true) // Toujours visible

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)"]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor }}
      className={cn(
        "fixed top-6 inset-x-0 max-w-fit mx-auto z-50 px-8 py-4 rounded-full border border-white/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
        className
      )}
    >
      <div className="flex items-center justify-between space-x-8">
        <div className="flex items-center space-x-8">
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
        {rightElement && (
          <div className="ml-8">
            {rightElement}
          </div>
        )}
      </div>
    </motion.div>
  )
}

