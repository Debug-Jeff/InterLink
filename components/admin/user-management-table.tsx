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
import { addUser, updateUser, deleteUser } from "@/app/admin/actions" // Import server actions
import { useRouter } from "next/navigation"

// Define a type for user items
type UserItem = {
  id: string
  full_name: string
  email: string
  role: string // 'user', 'client', 'company', 'admin'
  created_at: string
}

interface UserManagementTableProps {
  initialUsers: UserItem[]
}

export function UserManagementTable({ initialUsers }: UserManagementTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [users, setUsers] = React.useState<UserItem[]>(initialUsers)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<UserItem | null>(null)

  // Action states for forms
  const [addUserState, addAction, addPending] = useActionState(addUser, null)
  const [updateUserState, updateAction, updatePending] = useActionState(updateUser, null)

  React.useEffect(() => {
    if (addUserState?.success) {
      setIsAddUserDialogOpen(false)
      router.refresh() // Revalidate data after successful add
    }
    if (addUserState?.message && !addUserState.success) {
      // Handle add error, e.g., show a toast
      console.error("Add user error:", addUserState.message)
    }
  }, [addUserState, router])

  React.useEffect(() => {
    if (updateUserState?.success) {
      setIsEditDialogOpen(false)
      router.refresh() // Revalidate data after successful update
    }
    if (updateUserState?.message && !updateUserState.success) {
      // Handle update error
      console.error("Update user error:", updateUserState.message)
    }
  }, [updateUserState, router])

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditClick = (user: UserItem) => {
    setEditingUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const result = await deleteUser(id)
      if (result.success) {
        router.refresh() // Revalidate data after successful delete
      } else {
        console.error("Delete user error:", result.message)
      }
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="relative w-full md:max-w-sm">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-lg-custom shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Button
          onClick={() => setIsAddUserDialogOpen(true)}
          className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New User
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[200px]">Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-gray-800">{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    className={`rounded-md px-2 py-1 text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "company"
                          ? "bg-blue-100 text-blue-700"
                          : user.role === "client"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
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
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-red-600 cursor-pointer"
                        onClick={() => handleDelete(user.id)}
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
              <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <form action={addAction} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Full Name
              </Label>
              <Input id="fullName" name="fullName" placeholder="John Doe" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select name="role" defaultValue="user" required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {addUserState?.message && (
              <p className={`text-center text-sm ${addUserState.success ? "text-green-500" : "text-red-500"}`}>
                {addUserState.message}
              </p>
            )}
            <DialogFooter>
              <Button type="submit" disabled={addPending}>
                {addPending ? "Adding..." : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <form action={updateAction} className="grid gap-4 py-4">
              <input type="hidden" name="id" value={editingUser.id} />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editFullName" className="text-right">
                  Full Name
                </Label>
                <Input
                  id="editFullName"
                  name="fullName"
                  defaultValue={editingUser.full_name}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEmail" className="text-right">
                  Email
                </Label>
                <Input
                  id="editEmail"
                  name="email"
                  type="email"
                  defaultValue={editingUser.email}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editRole" className="text-right">
                  Role
                </Label>
                <Select name="role" defaultValue={editingUser.role} required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {updateUserState?.message && (
                <p className={`text-center text-sm ${updateUserState.success ? "text-green-500" : "text-red-500"}`}>
                  {updateUserState.message}
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
