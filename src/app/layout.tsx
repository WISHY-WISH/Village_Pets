import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Village Pet Registry | ทะเบียนสัตว์เลี้ยงหมู่บ้าน',
  description: 'ระบบจัดการข้อมูลสัตว์เลี้ยงในหมู่บ้าน',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={`${inter.className} bg-amber-50 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}