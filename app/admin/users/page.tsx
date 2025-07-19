import { UserManagementTable } from "@/components/admin/user-management-table"
import { getAllUsers } from "@/lib/data" // Import data fetching function

export default async function AdminUsersPage() {
  const users = await getAllUsers()

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Manage Users</h1>
      <p className="text-lg text-gray-600">View, edit, and manage all registered users on the platform.</p>

      <UserManagementTable initialUsers={users} />
    </div>
  )
}
