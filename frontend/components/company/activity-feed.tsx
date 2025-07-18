"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, FolderCheck, UserPlus } from "lucide-react"
import React, { useEffect, useState } from "react"
import { subscribeToCompanyActivity } from "@/lib/data" // Import real-time subscription

interface ActivityItem {
  id: string
  type: "client_feedback" | "project_update" | "new_inquiry"
  description: string
  timestamp: string
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    // For initial load, you might fetch existing activities
    // For now, we'll just rely on real-time updates or start with an empty array
    // In a real app, you'd fetch initial data here:
    // const fetchInitialActivities = async () => { ... }
    // fetchInitialActivities()

    const unsubscribe = subscribeToCompanyActivity((newActivity) => {
      // Add new activity to the top of the list
      setActivities((prevActivities) => [newActivity, ...prevActivities])
    })

    return () => unsubscribe()
  }, [])

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "client_feedback":
        return <MessageSquare className="h-5 w-5 text-logo-blue" />
      case "project_update":
        return <FolderCheck className="h-5 w-5 text-logo-orange" />
      case "new_inquiry":
        return <UserPlus className="h-5 w-5 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <Card className="rounded-xl shadow-md border border-gray-100">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">Recent Company Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <div className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="text-gray-700">{activity.description}</p>
                  <p className="text-sm text-gray-500 mt-1">{activity.timestamp}</p>
                </div>
              </div>
              {index < activities.length - 1 && <Separator className="mx-4 bg-gray-100" />}
            </React.Fragment>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No recent activity.</div>
        )}
      </CardContent>
    </Card>
  )
}
