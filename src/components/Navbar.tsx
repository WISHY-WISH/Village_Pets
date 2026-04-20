'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: '/', label: '🏠 หน้าแรก' },
    { href: '/pets/add', label: '➕ เพิ่มสัตว์เลี้ยง' },
    { href: '/about', label: 'ℹ️ เกี่ยวกับ' },
  ]

  return (
    <header className="bg-green-700 text-white shadow-md">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="text-2xl">🐾</span>
            <span className="hidden sm:inline">ทะเบียนสัตว์เลี้ยงหมู่บ้าน</span>
            <span className="sm:hidden">สัตว์เลี้ยงหมู่บ้าน</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-green-900 text-white'
                    : 'hover:bg-green-600 text-green-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-green-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white" />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden pb-3 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-green-900 text-white'
                    : 'hover:bg-green-600 text-green-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}