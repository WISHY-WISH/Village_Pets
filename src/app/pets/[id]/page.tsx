'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PetForm from '@/components/PetForm'
import { PetFormData, petTypeLabels, genderLabels } from '@/lib/validations'
import Image from 'next/image'
import Link from 'next/link'

interface Pet extends PetFormData {
  id: number
  createdAt: string
}

export default function PetDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/pets/${id}`)
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'ดึงข้อมูลล้มเหลว')
        } else {
          setPet(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setError('ไม่สามารถดึงข้อมูลได้')
        setLoading(false)
      })
  }, [id])

  const handleUpdate = async (data: PetFormData) => {
    setIsSubmitting(true)
    setError('')
    try {
      const res = await fetch(`/api/pets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'แก้ไขข้อมูลล้มเหลว')
      }
      const updated = await res.json()
      setPet(updated)
      setIsEditing(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/pets/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('ลบข้อมูลล้มเหลว')
      router.push('/')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
      setIsDeleting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-400">⏳ กำลังโหลด...</div>
  }

  if (error && !pet) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">{error}</p>
        <Link href="/" className="mt-4 inline-block text-green-600 hover:underline">
          ← กลับหน้าแรก
        </Link>
      </div>
    )
  }

  if (!pet) return null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">หน้าแรก</Link>
        <span>/</span>
        <span className="text-gray-800">{pet.name}</span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          ❌ {error}
        </div>
      )}

      {isEditing ? (
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-green-800">✏️ แก้ไขข้อมูล</h1>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              ยกเลิก
            </button>
          </div>
          <PetForm
            defaultValues={pet}
            onSubmit={handleUpdate}
            submitLabel="บันทึกการแก้ไข"
            isLoading={isSubmitting}
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
          {pet.imageUrl && (
            <div className="relative h-64 w-full">
              <Image
                src={pet.imageUrl}
                alt={pet.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{pet.name}</h1>
                <p className="text-green-600 font-medium mt-1">{petTypeLabels[pet.type]}</p>
              </div>
              {!pet.imageUrl && (
                <span className="text-5xl">
                  {pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐈' : '🐦'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">อายุ</p>
                <p className="font-semibold text-gray-800">{pet.age} ปี</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">เพศ</p>
                <p className="font-semibold text-gray-800">{genderLabels[pet.gender]}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 col-span-2">
                <p className="text-xs text-gray-500">เจ้าของ</p>
                <p className="font-semibold text-gray-800">👤 {pet.ownerName}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-1">ลักษณะเด่น</p>
              <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{pet.description}</p>
            </div>

            <p className="text-xs text-gray-400 mb-6">
              บันทึกเมื่อ {new Date(pet.createdAt).toLocaleDateString('th-TH', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                ✏️ แก้ไข
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-lg font-medium border border-red-200 transition-colors"
              >
                🗑️ ลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-lg font-bold text-gray-800 mb-2">ยืนยันการลบ</h2>
            <p className="text-gray-600 text-sm mb-6">
              คุณต้องการลบข้อมูลของ <strong>{pet.name}</strong> ใช่หรือไม่?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition-colors"
              >
                {isDeleting ? 'กำลังลบ...' : 'ยืนยันลบ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}