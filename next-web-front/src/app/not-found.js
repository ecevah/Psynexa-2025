import Link from 'next/link'
import { headers } from 'next/headers'
import { getSiteData } from '@/lib/siteData'

export default async function NotFound() {
  const headersList = await headers()
  const domain = headersList.get('host')
  const data = await getSiteData(domain)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Not Found: {data.name}
        </h2>
        <p className="mt-2 text-gray-600">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link href="/" className="mt-6 inline-block px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition">
          Go Back Home
        </Link>
      </div>
    </div>
  )
}