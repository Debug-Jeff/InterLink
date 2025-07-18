"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, FileText } from "lucide-react"
import React, { useEffect, useState } from "react"
import { subscribeToClientActivity, getAuthenticatedUser } from "@/lib/data" // Import real-time subscription and user fetch

interface ActivityItem {
  id: string
  type: "project" | "approval" | "message"
  description: string
  timestamp: string
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserAndSubscribe = async () => {
      const user = await getAuthenticatedUser() // Fetch user on client side
      if (user) {
        setUserId(user.id)
        const unsubscribe = subscribeToClientActivity(user.id, (newActivity) => {
          setActivities((prevActivities) => [newActivity, ...prevActivities])
        })
        return () => unsubscribe()
      }
    }
    fetchUserAndSubscribe()
  }, [])

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "project":
        return <FileText className="h-5 w-5 text-logo-blue" />
      case "approval":
        return <CheckCircle className="h-5 w-5 text-logo-orange" />
      case "message":
        return <Clock className="h-5 w-5 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <Card className="rounded-xl shadow-md border border-gray-100">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">Recent Activity</CardTitle>
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
