import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { petSchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const type = searchParams.get('type') || ''

        const pets = await prisma.pet.findMany({
            where: {
                AND: [
                    type ? { type } : {},
                    search
                        ? {
                            OR: [
                                { name: { contains: search } },
                                { ownerName: { contains: search } },
                            ],
                        }
                        : {},
                ],
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(pets)
    } catch (error) {
        console.error('GET pets error:', error)
        return NextResponse.json({ error: 'ดึงข้อมูลล้มเหลว' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const validated = petSchema.parse({
            ...body,
            age: Number(body.age),
        })

        const pet = await prisma.pet.create({
            data: validated,
        })

        return NextResponse.json(pet, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'ข้อมูลไม่ถูกต้อง', details: error.issues },
                { status: 400 }
            )
        }
        console.error('POST pet error:', error)
        return NextResponse.json({ error: 'บันทึกข้อมูลล้มเหลว' }, { status: 500 })
    }
}