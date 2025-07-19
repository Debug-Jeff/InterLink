import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-600 mb-8">
        You do not have permission to view this page. Please sign in with an authorized account.
      </p>
      <Button asChild className="px-8 py-4 text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
        <Link href="/signin">Go to Sign In</Link>
      </Button>
    </div>
  )
}
