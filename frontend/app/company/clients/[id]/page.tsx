"use client"
import { getClientById, getProjectsByClientId } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, User, CalendarDays, Edit } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useActionState } from "react"
import { updateClient } from "@/app/company/client-actions"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead as TableHeadComponent,
  TableRow as TableRowComponent,
  TableCell as TableCellComponent,
} from "@/components/ui/table"

// Define types for data fetched from server
type ClientItem = Awaited<ReturnType<typeof getClientById>>
type ProjectItem = Awaited<ReturnType<typeof getProjectsByClientId>>[number]

interface ClientDetailPageProps {
  params: {
    id: string
  }
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  const router = useRouter()
  const [client, setClient] = useState<ClientItem>(null)
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Action state for update form
  const [updateState, updateAction, updatePending] = useActionState(updateClient, null)

  // Fetch data on component mount and when ID changes
  useEffect(() => {
    const fetchData = async () => {
      const fetchedClient = await getClientById(params.id)
      const fetchedProjects = await getProjectsByClientId(params.id)
      if (fetchedClient) {
        setClient(fetchedClient)
      } else {
        notFound() // If client not found, trigger Next.js notFound
      }
      setProjects(fetchedProjects)
    }
    fetchData()
  }, [params.id])

  // Handle update success/error
  useEffect(() => {
    if (updateState?.success) {
      setIsEditDialogOpen(false)
      // Optionally update local state with new data from server action response
      if (updateState.data) {
        setClient(updateState.data as ClientItem)
      }
      router.refresh() // Revalidate data
    }
    if (updateState?.message && !updateState.success) {
      console.error("Update client error:", updateState.message)
      // You might want to show a toast here
    }
  }, [updateState, router])

  if (!client) {
    return null // Or a loading spinner, notFound() is handled in useEffect
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800">{client.name}</h1>
        <div className="flex items-center gap-4">
          <Badge
            className={`px-3 py-1 text-sm font-semibold capitalize ${
              client.status === "active"
                ? "bg-green-100 text-green-700"
                : client.status === "lead"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
            }`}
          >
            {client.status}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Client
          </Button>
        </div>
      </div>

      <Card className="rounded-xl shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Client Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-500" />
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {client.contact_email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-500" />
            <p className="text-gray-700">
              <span className="font-medium">Contact Person:</span> {client.contact_person}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-gray-500" />
            <p className="text-gray-700">
              <span className="font-medium">Joined:</span> {new Date(client.created_at).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Associated Projects</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {projects.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRowComponent className="bg-gray-50">
                  <TableHeadComponent>Project Name</TableHeadComponent>
                  <TableHeadComponent>Status</TableHeadComponent>
                  <TableHeadComponent>Start Date</TableHeadComponent>
                  <TableHeadComponent>End Date</TableHeadComponent>
                  <TableHeadComponent className="text-right">Actions</TableHeadComponent>
                </TableRowComponent>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRowComponent key={project.id}>
                    <TableCellComponent className="font-medium text-gray-800">{project.name}</TableCellComponent>
                    <TableCellComponent>
                      <Badge
                        className={`rounded-md px-2 py-1 text-xs font-semibold capitalize ${
                          project.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : project.status === "in_progress"
                              ? "bg-blue-100 text-blue-700"
                              : project.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {project.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCellComponent>
                    <TableCellComponent>
                      {project.start_date ? new Date(project.start_date).toLocaleDateString() : "N/A"}
                    </TableCellComponent>
                    <TableCellComponent>
                      {project.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}
                    </TableCellComponent>
                    <TableCellComponent className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/company/projects/${project.id}`}>View Details</Link>
                      </Button>
                    </TableCellComponent>
                  </TableRowComponent>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="p-6 text-gray-500">No projects associated with this client yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          {client && (
            <form action={updateAction} className="grid gap-4 py-4">
              <input type="hidden" name="id" value={client.id} />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editName" className="text-right">
                  Name
                </Label>
                <Input id="editName" name="name" defaultValue={client.name} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editContactEmail" className="text-right">
                  Contact Email
                </Label>
                <Input
                  id="editContactEmail"
                  name="contactEmail"
                  type="email"
                  defaultValue={client.contact_email}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editContactPerson" className="text-right">
                  Contact Person
                </Label>
                <Input
                  id="editContactPerson"
                  name="contactPerson"
                  defaultValue={client.contact_person}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editStatus" className="text-right">
                  Status
                </Label>
                <Select name="status" defaultValue={client.status} required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {updateState?.message && (
                <p className={`text-center text-sm ${updateState.success ? "text-green-500" : "text-red-500"}`}>
                  {updateState.message}
                </p>
              )}
              <DialogFooter>
                <Button type="submit" disabled={updatePending}>
                  {updatePending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
