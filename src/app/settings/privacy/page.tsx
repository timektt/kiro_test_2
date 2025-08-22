'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Shield, Users, Database, Trash2, Download, FileText } from 'lucide-react'
import { PrivacySettingsForm } from '@/components/privacy/privacy-settings-form'
import { BlockedUsersList } from '@/components/privacy/blocked-users-list'

export default function PrivacySettingsPage() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="text-center">
          <p>Please sign in to access privacy settings</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Privacy Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your privacy settings, security, and data control
        </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="blocked" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Blocked Users
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              My Data
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Privacy Settings */}
          <TabsContent value="settings">
            <PrivacySettingsForm />
          </TabsContent>

          {/* Blocked Users */}
          <TabsContent value="blocked">
            <BlockedUsersList />
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Download or manage your personal data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Export Data */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Export Data</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Download a copy of your data in JSON format
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button variant="outline" className="justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Profile Data
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Posts and Comments
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Followers List
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Database className="h-4 w-4 mr-2" />
                      All Data
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Data Retention */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Data Retention</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your data will be stored according to our privacy policy
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Profile Data</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Stored until you delete your account
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Posts and Comments</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Stored until you delete them
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Chat Messages</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Stored for 2 years after sending
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Usage Data</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Stored for 1 year for analytics
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Management */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Account Management
                </CardTitle>
                <CardDescription>
                  Options for deleting your account and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Deactivate Account */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Temporarily Deactivate Account</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Hide your profile and posts from others, but you can still reactivate
                    </p>
                  </div>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Temporarily Deactivate Account
                  </Button>
                </div>

                <Separator />

                {/* Delete Account */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-destructive">Permanently Delete Account</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Permanently delete your account and all data. This action cannot be undone
                    </p>
                  </div>
                  
                  <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div className="flex items-start gap-3">
                      <Trash2 className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-destructive">
                          Deleting your account will:
                        </p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>&bull; Permanently delete all your profile and posts</li>
                <li>&bull; Delete all chat messages and conversation history</li>
                <li>&bull; Cancel all follows and followers</li>
                <li>&bull; Cannot recover data after deletion</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Permanently Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}