'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { petSchema, PetFormData } from '@/lib/validations'
import Image from 'next/image'

interface PetFormProps {
  defaultValues?: Partial<PetFormData>
  onSubmit: (data: PetFormData) => Promise<void>
  submitLabel?: string
  isLoading?: boolean
}

export default function PetForm({
  defaultValues,
  onSubmit,
  submitLabel = 'บันทึก',
  isLoading = false,
}: PetFormProps) {
  const [imagePreview, setImagePreview] = useState<string>(
    defaultValues?.imageUrl || ''
  )
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: defaultValues || {},
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Frontend validation
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setUploadError('รองรับเฉพาะไฟล์ JPG, PNG, WebP, GIF')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('ขนาดไฟล์ต้องไม่เกิน 5MB')
      return
    }

    setUploadError('')
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setImagePreview(data.url)
      setValue('imageUrl', data.url)
    } catch (err) {
      setUploadError('อัปโหลดรูปภาพล้มเหลว')
    } finally {
      setUploading(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
  const errorClass = 'text-red-500 text-xs mt-1'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* ชื่อสัตว์เลี้ยง */}
      <div>
        <label className={labelClass}>
          ชื่อสัตว์เลี้ยง <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          className={inputClass}
          placeholder="เช่น บ้อง, มีมี่, โต้ง"
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      {/* ประเภทสัตว์ */}
      <div>
        <label className={labelClass}>
          ประเภทสัตว์เลี้ยง <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'dog', label: '🐕 หมา' },
            { value: 'cat', label: '🐈 แมว' },
            { value: 'bird', label: '🐦 นก' },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer has-[:checked]:border-green-500 has-[:checked]:bg-green-50 border-gray-200 hover:border-green-300 transition-colors"
            >
              <input
                {...register('type')}
                type="radio"
                value={opt.value}
                className="hidden"
              />
              <span className="text-sm font-medium">{opt.label}</span>
            </label>
          ))}
        </div>
        {errors.type && <p className={errorClass}>{errors.type.message}</p>}
      </div>

      {/* อายุ และ เพศ */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            อายุ (ปี) <span className="text-red-500">*</span>
          </label>
          <input
            {...register('age', { valueAsNumber: true })}
            type="number"
            min="0"
            max="100"
            className={inputClass}
            placeholder="0"
          />
          {errors.age && <p className={errorClass}>{errors.age.message}</p>}
        </div>
        <div>
          <label className={labelClass}>
            เพศ <span className="text-red-500">*</span>
          </label>
          <select {...register('gender')} className={inputClass}>
            <option value="">-- เลือกเพศ --</option>
            <option value="male">เพศผู้</option>
            <option value="female">เพศเมีย</option>
          </select>
          {errors.gender && <p className={errorClass}>{errors.gender.message}</p>}
        </div>
      </div>

      {/* ลักษณะเด่น */}
      <div>
        <label className={labelClass}>
          ลักษณะเด่น <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className={inputClass}
          placeholder="เช่น ขนสีน้ำตาล หางยาว ชอบวิ่งเล่น..."
        />
        {errors.description && (
          <p className={errorClass}>{errors.description.message}</p>
        )}
      </div>

      {/* ชื่อเจ้าของ */}
      <div>
        <label className={labelClass}>
          ชื่อเจ้าของ <span className="text-red-500">*</span>
        </label>
        <input
          {...register('ownerName')}
          className={inputClass}
          placeholder="เช่น นายสมชาย ใจดี"
        />
        {errors.ownerName && (
          <p className={errorClass}>{errors.ownerName.message}</p>
        )}
      </div>

      {/* อัปโหลดรูปภาพ */}
      <div>
        <label className={labelClass}>รูปภาพ</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-400 transition-colors">
          {imagePreview ? (
            <div className="relative">
              <div className="relative h-40 w-full">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setImagePreview('')
                  setValue('imageUrl', '')
                }}
                className="mt-2 text-xs text-red-500 hover:text-red-700"
              >
                ลบรูปภาพ
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-2 cursor-pointer">
              <span className="text-3xl">📷</span>
              <span className="text-sm text-gray-500">คลิกเพื่ออัปโหลดรูปภาพ</span>
              <span className="text-xs text-gray-400">JPG, PNG, WebP, GIF (สูงสุด 5MB)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          )}
          {uploading && (
            <p className="text-center text-sm text-green-600 mt-2">⏳ กำลังอัปโหลด...</p>
          )}
          {uploadError && <p className={errorClass + ' text-center'}>{uploadError}</p>}
        </div>
        <input type="hidden" {...register('imageUrl')} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || uploading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? '⏳ กำลังบันทึก...' : `💾 ${submitLabel}`}
      </button>
    </form>
  )
}