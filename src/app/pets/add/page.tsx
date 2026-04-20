'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import PetForm from '@/components/PetForm'
import { PetFormData } from '@/lib/validations'
import Link from 'next/link'

export default function AddPetPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (data: PetFormData) => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'บันทึกข้อมูลล้มเหลว')
      }

      router.push('/')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">หน้าแรก</Link>
        <span>/</span>
        <span className="text-gray-800">เพิ่มสัตว์เลี้ยง</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
        <h1 className="text-2xl font-bold text-green-800 mb-6">➕ เพิ่มสัตว์เลี้ยงใหม่</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            ❌ {error}
          </div>
        )}

        <PetForm
          onSubmit={handleSubmit}
          submitLabel="เพิ่มสัตว์เลี้ยง"
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}