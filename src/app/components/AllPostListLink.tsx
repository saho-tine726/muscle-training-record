import Link from "next/link"

const AllPostListLink = () => {
  return (
    <div className="mb-6">
      <Link href="/post/" className="bg-gray-500 px-3 sm:px-4 py-2 rounded-md text-white text-md font-medium transition duration-500 hover:bg-gray-600">トレーニング記録全一覧へ</Link>
    </div>
  )
}

export default AllPostListLink