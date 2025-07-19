"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, PlusCircle, Search, Edit, Trash2 } from "lucide-react"
import { useActionState } from "react"
import { addClient, updateClient, deleteClient } from "@/app/company/client-actions" // Import server actions
import { useRouter } from "next/navigation"

// Define a type for client items
type ClientItem = {
  id: string
  name: string
  contact_email: string
  contact_person: string
  status: string
  created_at: string
}

interface ClientsManagementTableProps {
  initialClients: ClientItem[]
}

export function ClientsManagementTable({ initialClients }: ClientsManagementTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [clients, setClients] = React.useState<ClientItem[]>(initialClients)
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [editingClient, setEditingClient] = React.useState<ClientItem | null>(null)

  // Action states for forms
  const [addClientState, addAction, addPending] = useActionState(addClient, null)
  const [updateClientState, updateAction, updatePending] = useActionState(updateClient, null)

  React.useEffect(() => {
    setClients(initialClients) // Update local state when initialClients prop changes
  }, [initialClients])

  React.useEffect(() => {
    if (addClientState?.success) {
      setIsAddClientDialogOpen(false)
      router.refresh() // Revalidate data after successful add
    }
    if (addClientState?.message && !addClientState.success) {
      console.error("Add client error:", addClientState.message)
    }
  }, [addClientState, router])

  React.useEffect(() => {
    if (updateClientState?.success) {
      setIsEditDialogOpen(false)
      router.refresh() // Revalidate data after successful update
    }
    if (updateClientState?.message && !updateClientState.success) {
      console.error("Update client error:", updateClientState.message)
    }
  }, [updateClientState, router])

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditClick = (client: ClientItem) => {
    setEditingClient(client)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      const result = await deleteClient(id)
      if (result.success) {
        router.refresh() // Revalidate data after successful delete
      } else {
        console.error("Delete client error:", result.message)
      }
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="relative w-full md:max-w-sm">
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-lg-custom shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Button
          onClick={() => setIsAddClientDialogOpen(true)}
          className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Client
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Contact Email</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium text-gray-800">{client.name}</TableCell>
                <TableCell>{client.contact_email}</TableCell>
                <TableCell>{client.contact_person}</TableCell>
                <TableCell>
                  <Badge
                    className={`rounded-md px-2 py-1 text-xs font-semibold ${
                      client.status === "active"
                        ? "bg-green-100 text-green-700"
                        : client.status === "lead"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {client.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(client.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleEditClick(client)}
                      >
                        <Edit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-red-600 cursor-pointer"
                        onClick={() => handleDelete(client.id)}
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                No clients found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add Client Dialog */}
      <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <form action={addAction} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" placeholder="Client Company Name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactEmail" className="text-right">
                Contact Email
              </Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="contact@example.com"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactPerson" className="text-right">
                Contact Person
              </Label>
              <Input id="contactPerson" name="contactPerson" placeholder="Jane Doe" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select name="status" defaultValue="active" required>
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
            {addClientState?.message && (
              <p className={`text-center text-sm ${addClientState.success ? "text-green-500" : "text-red-500"}`}>
                {addClientState.message}
              </p>
            )}
            <DialogFooter>
              <Button type="submit" disabled={addPending}>
                {addPending ? "Adding..." : "Add Client"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          {editingClient && (
            <form action={updateAction} className="grid gap-4 py-4">
              <input type="hidden" name="id" value={editingClient.id} />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editName" className="text-right">
                  Name
                </Label>
                <Input id="editName" name="name" defaultValue={editingClient.name} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editContactEmail" className="text-right">
                  Contact Email
                </Label>
                <Input
                  id="editContactEmail"
                  name="contactEmail"
                  type="email"
                  defaultValue={editingClient.contact_email}
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
                  defaultValue={editingClient.contact_person}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editStatus" className="text-right">
                  Status
                </Label>
                <Select name="status" defaultValue={editingClient.status} required>
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
              {updateClientState?.message && (
                <p className={`text-center text-sm ${updateClientState.success ? "text-green-500" : "text-red-500"}`}>
                  {updateClientState.message}
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
