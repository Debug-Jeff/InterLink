import { ContentManagementTable } from "@/components/admin/content-management-table"
import { getAllContent } from "@/lib/data" // Import the new data fetching function

export default async function AdminContentPage() {
  const content = await getAllContent()

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Manage Content</h1>
      <p className="text-lg text-gray-600">
        Oversee internship listings, company profiles, and other platform content.
      </p>

      <ContentManagementTable initialContent={content} />
    </div>
  )
}
