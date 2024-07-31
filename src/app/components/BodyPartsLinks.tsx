import Link from "next/link"
import { bodyPartsMap } from "@/constants/bodyPartsMap"

export const BodyPartsLinks = () => {
  return (
    <>
      <div className="mb-5 md:mb-9 p-4 mt-4 bg-gray-300 rounded-md">
        <p className="font-bold mb-3 text-lg text-center">部位ごとの一覧ページ</p>
        <div className="grid grid-cols-5 gap-2 md:gap-6">
          {Object.keys(bodyPartsMap).map(part => (
            <div key={part}>
              <Link href={`/post/${part.toLowerCase()}`} className="py-2 bg-teal-500 text-white font-bold md:text-lg flex items-center justify-center transition duration-500 hover:bg-teal-600">
                {bodyPartsMap[part]}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
