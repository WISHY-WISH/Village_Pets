'use client'

import { useEffect, useState } from 'react'
import PetCard from '@/components/PetCard'
import Link from 'next/link'

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

export default function HomePage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [fact, setFact] = useState('')
  const [factLoading, setFactLoading] = useState(false)

  const fetchPets = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (typeFilter) params.set('type', typeFilter)

    const res = await fetch(`/api/pets?${params.toString()}`)
    const data = await res.json()
    setPets(data)
    setLoading(false)
  }

  // External API: fetch animal fact
  const fetchFact = async (type: string) => {
    setFactLoading(true)
    setFact('')
    try {
      let url = ''
      if (type === 'dog' || type === '') {
        const res = await fetch('https://dogapi.dog/api/v2/facts?limit=1')
        const data = await res.json()
        setFact(`🐕 ${data.data[0].attributes.body}`)
      } else if (type === 'cat') {
        const res = await fetch('https://catfact.ninja/fact')
        const data = await res.json()
        setFact(`🐈 ${data.fact}`)
      } else if (type === 'bird') {
        const res = await fetch('https://freetestapi.com/api/v1/birds?limit=1')
        const data = await res.json()
        setFact(`🐦 ${data[0].name}: ${data[0].habitat}`)
      }
    } catch {
      setFact('ไม่สามารถดึงข้อมูลสัตว์ได้ในขณะนี้')
    }
    setFactLoading(false)
  }

  useEffect(() => {
    fetchPets()
  }, [typeFilter])

  useEffect(() => {
    fetchFact(typeFilter)
  }, [typeFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPets()
  }

  const counts = {
    all: pets.length,
    dog: pets.filter((p) => p.type === 'dog').length,
    cat: pets.filter((p) => p.type === 'cat').length,
    bird: pets.filter((p) => p.type === 'bird').length,
  }

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
          🐾 ทะเบียนสัตว์เลี้ยงหมู่บ้าน
        </h1>
        <p className="text-gray-600">รวมข้อมูลสัตว์เลี้ยงทุกตัวในหมู่บ้านของเรา</p>
      </div>

      {/* Animal Fact Card (External API) */}
      <div className="bg-white border border-green-200 rounded-xl p-4 mb-6 shadow-sm">
        <p className="text-xs text-green-600 font-medium mb-1">💡 ความรู้เกี่ยวกับสัตว์ (External API)</p>
        {factLoading ? (
          <p className="text-gray-400 text-sm animate-pulse">กำลังโหลดข้อมูล...</p>
        ) : (
          <p className="text-gray-700 text-sm">{fact || 'เลือกประเภทสัตว์เพื่อดูความรู้'}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'ทั้งหมด', count: counts.all, emoji: '🐾', value: '' },
          { label: 'หมา', count: counts.dog, emoji: '🐕', value: 'dog' },
          { label: 'แมว', count: counts.cat, emoji: '🐈', value: 'cat' },
          { label: 'นก', count: counts.bird, emoji: '🐦', value: 'bird' },
        ].map((stat) => (
          <button
            key={stat.value}
            onClick={() => setTypeFilter(stat.value)}
            className={`p-3 rounded-xl border-2 transition-all text-center ${
              typeFilter === stat.value
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-green-300'
            }`}
          >
            <div className="text-2xl">{stat.emoji}</div>
            <div className="font-bold text-green-800">{stat.count}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อสัตว์เลี้ยงหรือชื่อเจ้าของ..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          🔍 ค้นหา
        </button>
      </form>

      {/* Pet Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">⏳ กำลังโหลด...</div>
      ) : pets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">ยังไม่มีสัตว์เลี้ยงในระบบ</p>
          <Link
            href="/pets/add"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            ➕ เพิ่มสัตว์เลี้ยงตัวแรก
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  )
}