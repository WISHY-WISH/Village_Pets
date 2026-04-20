import Link from 'next/link'
import Image from 'next/image'
import { petTypeLabels, genderLabels } from '@/lib/validations'

interface Pet {
  id: number
  name: string
  type: string
  age: number
  gender: string
  description: string
  ownerName: string
  imageUrl?: string | null
  createdAt: string
}

export default function PetCard({ pet }: { pet: Pet }) {
  const typeEmoji: Record<string, string> = {
    dog: '🐕',
    cat: '🐈',
    bird: '🐦',
  }

  return (
    <Link href={`/pets/${pet.id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-amber-100 overflow-hidden cursor-pointer group">
        {/* Image */}
        <div className="relative h-48 bg-amber-50">
          {pet.imageUrl ? (
            <Image
              src={pet.imageUrl}
              alt={pet.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-6xl">
              {typeEmoji[pet.type] || '🐾'}
            </div>
          )}
          <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium shadow">
            {petTypeLabels[pet.type]}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-800">{pet.name}</h3>
          <div className="mt-1 space-y-1 text-sm text-gray-600">
            <p>อายุ {pet.age} ปี · {genderLabels[pet.gender]}</p>
            <p className="line-clamp-2 text-gray-500">{pet.description}</p>
            <p className="text-green-700 font-medium">👤 {pet.ownerName}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}