export default function Footer() {
  return (
    <footer className="bg-green-800 text-green-100 mt-auto">
      <div className="container mx-auto px-4 max-w-6xl py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-semibold text-white">🐾 ทะเบียนสัตว์เลี้ยงหมู่บ้าน</p>
            <p className="text-sm text-green-300">ระบบจัดการข้อมูลสัตว์เลี้ยง หมา 🐕 แมว 🐈 นก 🐦</p>
          </div>
          <div className="text-sm text-green-300 text-center">
            <p>สร้างด้วย Next.js + Prisma + TailwindCSS</p>
            <p>© {new Date().getFullYear()} Village Pet Registry</p>
          </div>
        </div>
      </div>
    </footer>
  )
}