"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, FileText } from "lucide-react"
import React, { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface ActivityItem {
  id: string
  type: "project" | "approval" | "message"
  description: string
  timestamp: string
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchUserAndActivities = async () => {
      try {
        // Get current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          console.error('Error fetching user:', userError)
          setLoading(false)
          return
        }

        setUserId(user.id)

        // Fetch client activities from database
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('client_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (activitiesError) {
          console.error('Error fetching activities:', activitiesError)
        } else {
          const formattedActivities = activitiesData.map(activity => ({
            id: activity.id,
            type: activity.activity_type,
            description: activity.description,
            timestamp: activity.created_at
          }))
          setActivities(formattedActivities)
        }

        // Set up real-time subscription for new activities
        const subscription = supabase
          .channel('client_activities')
          .on('postgres_changes', 
            { 
              event: 'INSERT', 
              schema: 'public', 
              table: 'client_activities',
              filter: `user_id=eq.${user.id}`
            }, 
            (payload) => {
              const newActivity = {
                id: payload.new.id,
                type: payload.new.activity_type,
                description: payload.new.description,
                timestamp: payload.new.created_at
              }
              setActivities(prev => [newActivity, ...prev])
            }
          )
          .subscribe()

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Error in fetchUserAndActivities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndActivities()
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

  if (loading) {
    return (
      <Card className="rounded-xl shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
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
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
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
