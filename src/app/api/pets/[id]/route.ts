import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { petSchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const pet = await prisma.pet.findUnique({
      where: { id: Number(id) },
    })

    if (!pet) {
      return NextResponse.json({ error: 'ไม่พบสัตว์เลี้ยง' }, { status: 404 })
    }

    return NextResponse.json(pet)
  } catch (error) {
    console.error('GET pet error:', error)
    return NextResponse.json({ error: 'ดึงข้อมูลล้มเหลว' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    const validated = petSchema.parse({
      ...body,
      age: Number(body.age),
    })

    const pet = await prisma.pet.update({
      where: { id: Number(id) },
      data: validated,
    })

    return NextResponse.json(pet)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง', details: error.issues },
        { status: 400 }
      )
    }
    console.error('PUT pet error:', error)
    return NextResponse.json({ error: 'แก้ไขข้อมูลล้มเหลว' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await prisma.pet.delete({
      where: { id: Number(id) },
    })

    return NextResponse.json({ message: 'ลบสัตว์เลี้ยงสำเร็จ' })
  } catch (error) {
    console.error('DELETE pet error:', error)
    return NextResponse.json({ error: 'ลบข้อมูลล้มเหลว' }, { status: 500 })
  }
}