import { ClientsManagementTable } from "@/components/company/clients-management-table"
import { getAllClients, getAuthenticatedUser } from "@/lib/data"
import { redirect } from "next/navigation"

export default async function CompanyClientsPage() {
  const user = await getAuthenticatedUser()

  if (!user) {
    redirect("/signin") // Should be caught by layout, but good to have
  }

  const clients = await getAllClients(user.id)

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Manage Clients</h1>
      <p className="text-lg text-gray-600">Manage your client relationships and view their details.</p>

      <ClientsManagementTable initialClients={clients} />
    </div>
  )
}
