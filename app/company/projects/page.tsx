import { ProjectsManagementTable } from "@/components/company/projects-management-table"
import { getAllProjects, getAllClients, getAuthenticatedUser } from "@/lib/data"
import { redirect } from "next/navigation"

export default async function CompanyProjectsPage() {
  const user = await getAuthenticatedUser()

  if (!user) {
    redirect("/signin") // Should be caught by layout, but good to have
  }

  const projects = await getAllProjects(user.id)
  const clients = await getAllClients(user.id) // Fetch clients to populate dropdown in project form

  // Map clients to a simpler format for the dropdown
  const clientOptions = clients.map((client) => ({
    id: client.id,
    name: client.name,
  }))

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Manage Projects</h1>
      <p className="text-lg text-gray-600">Oversee all projects, their status, and team assignments.</p>

      <ProjectsManagementTable initialProjects={projects} clients={clientOptions} />
    </div>
  )
}
