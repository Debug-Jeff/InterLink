"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, FolderCheck, UserPlus } from "lucide-react"
import React, { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface ActivityItem {
  id: string
  type: "client_feedback" | "project_update" | "new_inquiry"
  description: string
  timestamp: string
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchInitialActivities = async () => {
      try {
        // Get current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          return
        }

        // Fetch initial company activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('company_activities')
          .select('*')
          .eq('company_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (activitiesError) {
          console.error('Error fetching activities:', activitiesError)
        } else {
          // Transform data to match ActivityItem interface
          const transformedActivities = (activitiesData || []).map(activity => ({
            id: activity.id,
            type: activity.type as ActivityItem["type"],
            description: activity.description,
            timestamp: new Date(activity.created_at).toLocaleString()
          }))
          setActivities(transformedActivities)
        }
      } catch (error) {
        console.error('Error in fetchInitialActivities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialActivities()

    // Set up real-time subscription
    const channel = supabase
      .channel('company_activity_feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'company_activities' }, (payload) => {
        if (payload.new) {
          const newActivity = {
            id: payload.new.id,
            type: payload.new.type as ActivityItem["type"],
            description: payload.new.description,
            timestamp: new Date(payload.new.created_at).toLocaleString()
          }
          setActivities((prevActivities) => [newActivity, ...prevActivities])
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

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
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              Loading activities...
            </div>
          </div>
        ) : activities.length > 0 ? (
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
