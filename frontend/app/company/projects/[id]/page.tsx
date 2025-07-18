"use client"

import { getProjectById, getAllClients } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, DollarSign, FileText, User, Edit } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useActionState } from "react"
import { updateProject } from "@/app/company/project-actions"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

// Define types for data fetched from server
type ProjectItem = Awaited<ReturnType<typeof getProjectById>>
type ClientOption = { id: string; name: string }

interface ProjectDetailPageProps {
  params: {
    id: string
  }
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const router = useRouter()
  const [project, setProject] = useState<ProjectItem>(null)
  const [clients, setClients] = useState<ClientOption[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Action state for update form
  const [updateState, updateAction, updatePending] = useActionState(updateProject, null)

  // Fetch data on component mount and when ID changes
  useEffect(() => {
    const fetchData = async () => {
      const fetchedProject = await getProjectById(params.id)
      const fetchedClients = await getAllClients(fetchedProject?.company_id || "") // Assuming company_id is available or fetched separately
      if (fetchedProject) {
        setProject(fetchedProject)
      } else {
        notFound()
      }
      setClients(fetchedClients.map((c) => ({ id: c.id, name: c.name })))
    }
    fetchData()
  }, [params.id])

  // Handle update success/error
  useEffect(() => {
    if (updateState?.success) {
      setIsEditDialogOpen(false)
      // Optionally update local state with new data from server action response
      if (updateState.data) {
        setProject(updateState.data as ProjectItem)
      }
      router.refresh() // Revalidate data
    }
    if (updateState?.message && !updateState.success) {
      console.error("Update project error:", updateState.message)
      // You might want to show a toast here
    }
  }, [updateState, router])

  if (!project) {
    return null // Or a loading spinner, notFound() is handled in useEffect
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800">{project.name}</h1>
        <div className="flex items-center gap-4">
          <Badge
            className={`px-3 py-1 text-sm font-semibold capitalize ${
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
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Project
          </Button>
        </div>
      </div>

      <Card className="rounded-xl shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{project.description || "No description provided."}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-gray-500" />
              <p className="text-gray-700">
                <span className="font-medium">Start Date:</span>{" "}
                {project.start_date ? new Date(project.start_date).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-gray-500" />
              <p className="text-gray-700">
                <span className="font-medium">End Date:</span>{" "}
                {project.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-gray-500" />
              <p className="text-gray-700">
                <span className="font-medium">Budget:</span>{" "}
                {project.budget ? `$${project.budget.toLocaleString()}` : "N/A"}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Associated Client</h3>
            {project.clients ? (
              <div className="space-y-2">
                <p className="text-gray-700 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Name:</span> {project.clients.name}
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Contact:</span> {project.clients.contact_person} (
                  {project.clients.contact_email})
                </p>
                <Button variant="outline" size="sm" asChild className="mt-2 bg-transparent">
                  <Link href={`/company/clients/${project.client_id}`}>View Client Profile</Link>
                </Button>
              </div>
            ) : (
              <p className="text-gray-500">No client associated with this project.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {project && (
            <form action={updateAction} className="grid gap-4 py-4">
              <input type="hidden" name="id" value={project.id} />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editName" className="text-right">
                  Name
                </Label>
                <Input id="editName" name="name" defaultValue={project.name} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editDescription" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="editDescription"
                  name="description"
                  defaultValue={project.description || ""}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editClientId" className="text-right">
                  Client
                </Label>
                <Select name="clientId" defaultValue={project.client_id || ""} required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editStatus" className="text-right">
                  Status
                </Label>
                <Select name="status" defaultValue={project.status} required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editStartDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="editStartDate"
                  name="startDate"
                  type="date"
                  defaultValue={project.start_date || ""}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEndDate" className="text-right">
                  End Date
                </Label>
                <Input
                  id="editEndDate"
                  name="endDate"
                  type="date"
                  defaultValue={project.end_date || ""}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editBudget" className="text-right">
                  Budget ($)
                </Label>
                <Input
                  id="editBudget"
                  name="budget"
                  type="number"
                  step="0.01"
                  defaultValue={project.budget || ""}
                  className="col-span-3"
                />
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
