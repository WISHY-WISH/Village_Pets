import { z } from 'zod'

export const petSchema = z.object({
  name: z
    .string()
    .min(1, 'กรุณากรอกชื่อสัตว์เลี้ยง')
    .max(50, 'ชื่อต้องไม่เกิน 50 ตัวอักษร'),
  type: z.enum(['dog', 'cat', 'bird'], {
    errorMap: () => ({ message: 'กรุณาเลือกประเภทสัตว์เลี้ยง' }),
  }),
  age: z
    .number({ invalid_type_error: 'กรุณากรอกอายุเป็นตัวเลข' })
    .int('อายุต้องเป็นจำนวนเต็ม')
    .min(0, 'อายุต้องไม่ติดลบ')
    .max(100, 'อายุไม่ควรเกิน 100 ปี'),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'กรุณาเลือกเพศ' }),
  }),
  description: z
    .string()
    .min(1, 'กรุณากรอกลักษณะเด่น')
    .max(500, 'ลักษณะเด่นต้องไม่เกิน 500 ตัวอักษร'),
  ownerName: z
    .string()
    .min(1, 'กรุณากรอกชื่อเจ้าของ')
    .max(50, 'ชื่อเจ้าของต้องไม่เกิน 50 ตัวอักษร'),
  imageUrl: z.string().optional(),
})

export type PetFormData = z.infer<typeof petSchema>

export const petTypeLabels: Record<string, string> = {
  dog: 'หมา 🐕',
  cat: 'แมว 🐈',
  bird: 'นก 🐦',
}

export const genderLabels: Record<string, string> = {
  male: 'เพศผู้',
  female: 'เพศเมีย',
}