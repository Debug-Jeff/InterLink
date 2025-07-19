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
import { Textarea } from "@/components/ui/textarea"
import { MoreHorizontal, PlusCircle, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { useActionState } from "react"
import { addContent, updateContent, deleteContent, toggleContentStatus } from "@/app/admin/actions" // Import server actions
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast" // Import toast

// Define a type for content items, matching the database schema and join
type ContentItem = {
  id: string
  title: string
  type: "Internship" | "Company Profile" | "Blog Post"
  status: "Published" | "Draft" | "Pending Review" | "Archived"
  author_id: string | null
  users: { full_name: string | null } | null // For displaying author name
  content_body: string | null
  created_at: string
  updated_at: string
}

interface ContentManagementTableProps {
  initialContent: ContentItem[]
}

export function ContentManagementTable({ initialContent }: ContentManagementTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [content, setContent] = React.useState<ContentItem[]>(initialContent)
  const [isAddContentDialogOpen, setIsAddContentDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [editingContent, setEditingContent] = React.useState<ContentItem | null>(null)

  // Action states for forms
  const [addContentState, addAction, addPending] = useActionState(addContent, null)
  const [updateContentState, updateAction, updatePending] = useActionState(updateContent, null)

  React.useEffect(() => {
    setContent(initialContent) // Update local state when initialContent prop changes
  }, [initialContent])

  React.useEffect(() => {
    if (addContentState?.success) {
      setIsAddContentDialogOpen(false)
      toast.success(addContentState.message)
      router.refresh() // Revalidate data after successful add
    } else if (addContentState?.message) {
      toast.error(addContentState.message)
    }
  }, [addContentState, router])

  React.useEffect(() => {
    if (updateContentState?.success) {
      setIsEditDialogOpen(false)
      toast.success(updateContentState.message)
      router.refresh() // Revalidate data after successful update
    } else if (updateContentState?.message) {
      toast.error(updateContentState.message)
    }
  }, [updateContentState, router])

  const filteredContent = content.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const result = await toggleContentStatus(id, currentStatus)
    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      const result = await deleteContent(id)
      if (result.success) {
        toast.success(result.message)
        router.refresh() // Revalidate data after successful delete
      } else {
        toast.error(result.message)
      }
    }
  }

  const handleEditClick = (item: ContentItem) => {
    setEditingContent(item)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="relative w-full md:max-w-sm">
          <Input
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-lg-custom shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Button
          onClick={() => setIsAddContentDialogOpen(true)}
          className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Content
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[200px]">Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContent.length > 0 ? (
            filteredContent.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium text-gray-800">{item.title}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  <Badge
                    className={`rounded-md px-2 py-1 text-xs font-semibold ${
                      item.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Draft"
                          ? "bg-gray-100 text-gray-700"
                          : item.status === "Pending Review"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700" // For 'Archived' or other statuses
                    }`}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.users?.full_name || "N/A"}</TableCell>
                <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
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
                        onClick={() => handleEditClick(item)}
                      >
                        <Edit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleStatusToggle(item.id, item.status)}
                      >
                        {item.status === "Published" ? (
                          <>
                            <EyeOff className="h-4 w-4" /> Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" /> Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-red-600 cursor-pointer"
                        onClick={() => handleDelete(item.id)}
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
                No content found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add Content Dialog */}
      <Dialog open={isAddContentDialogOpen} onOpenChange={setIsAddContentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Content</DialogTitle>
          </DialogHeader>
          <form action={addAction} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" name="title" placeholder="Content Title" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select name="type" defaultValue="Blog Post" required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Company Profile">Company Profile</SelectItem>
                  <SelectItem value="Blog Post">Blog Post</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="contentBody" className="text-right pt-2">
                Content
              </Label>
              <Textarea
                id="contentBody"
                name="contentBody"
                placeholder="Content body..."
                rows={5}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select name="status" defaultValue="Draft" required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Pending Review">Pending Review</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {addContentState?.message && (
              <p className={`text-center text-sm ${addContentState.success ? "text-green-500" : "text-red-500"}`}>
                {addContentState.message}
              </p>
            )}
            <DialogFooter>
              <Button type="submit" disabled={addPending}>
                {addPending ? "Adding..." : "Add Content"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          {editingContent && (
            <form action={updateAction} className="grid gap-4 py-4">
              <input type="hidden" name="id" value={editingContent.id} />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editTitle" className="text-right">
                  Title
                </Label>
                <Input
                  id="editTitle"
                  name="title"
                  defaultValue={editingContent.title}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editType" className="text-right">
                  Type
                </Label>
                <Select name="type" defaultValue={editingContent.type} required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Company Profile">Company Profile</SelectItem>
                    <SelectItem value="Blog Post">Blog Post</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="editContentBody" className="text-right pt-2">
                  Content
                </Label>
                <Textarea
                  id="editContentBody"
                  name="contentBody"
                  defaultValue={editingContent.content_body || ""}
                  rows={5}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editStatus" className="text-right">
                  Status
                </Label>
                <Select name="status" defaultValue={editingContent.status} required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Pending Review">Pending Review</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {updateContentState?.message && (
                <p className={`text-center text-sm ${updateContentState.success ? "text-green-500" : "text-red-500"}`}>
                  {updateContentState.message}
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
