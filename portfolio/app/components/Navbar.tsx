"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { IoMenu, IoClose } from "react-icons/io5"

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "https://docsend.com/view/p3nh96a24tgtp6sz", label: "Resume" },
  { href: "/#contact", label: "Contact" },
  { href: "https://calendly.com/prashaant-rn/15-min-intro-meeting", label: "Calendly" }
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-[5vw] transform -translate-x-1/2 w-full z-50 transition-colors duration-200 bg-white/80 backdrop-blur-md ${
        scrolled ? 'bg-white/90' : ''
      } md:top-4 md:w-[90vw] md:rounded-[200px] md:border md:border-gray-300`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/navbarLogo.svg"
              alt="Website Logo"
              width={40}
              height={40}
            />
            <span className="ml-2 text-xl font-bold text-black">PR</span>
          </Link>
          <div className="flex items-center md:hidden mr-5">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <IoClose className="h-6 w-6 text-black" /> : <IoMenu className="h-6 w-6 text-black" />}
            </button>
          </div>
          <div className={`flex-col md:flex-row md:flex items-center gap-8 ${menuOpen ? 'flex' : 'hidden'} md:flex absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent p-4`}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm hover:text-black transition-colors block md:inline-block ${
                  item.label === "Resume" ? "border-2 border-purple-500 text-purple-500 rounded-full px-4 py-1" : "text-gray-600"
                }`}
                target={item.label === "Resume" ? "_blank" : "_self"}
                rel={item.label === "Resume" ? "noopener noreferrer" : ""}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

