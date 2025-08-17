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
          <p>กรุณาเข้าสู่ระบบเพื่อเข้าถึงการตั้งค่าความเป็นส่วนตัว</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">การตั้งค่าความเป็นส่วนตัว</h1>
          <p className="text-muted-foreground mt-2">
            จัดการการตั้งค่าความเป็นส่วนตัว ความปลอดภัย และการควบคุมข้อมูลของคุณ
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              การตั้งค่า
            </TabsTrigger>
            <TabsTrigger value="blocked" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              ผู้ใช้ที่บล็อก
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              ข้อมูลของฉัน
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              บัญชี
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
                  การจัดการข้อมูล
                </CardTitle>
                <CardDescription>
                  ดาวน์โหลดหรือจัดการข้อมูลส่วนตัวของคุณ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Export Data */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">ส่งออกข้อมูล</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      ดาวน์โหลดสำเนาข้อมูลของคุณในรูปแบบ JSON
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button variant="outline" className="justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      ข้อมูลโปรไฟล์
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      โพสต์และความคิดเห็น
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      รายชื่อผู้ติดตาม
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Database className="h-4 w-4 mr-2" />
                      ข้อมูลทั้งหมด
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Data Retention */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">การเก็บรักษาข้อมูล</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      ข้อมูลของคุณจะถูกเก็บไว้ตามนโยบายความเป็นส่วนตัวของเรา
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">ข้อมูลโปรไฟล์</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        เก็บไว้จนกว่าคุณจะลบบัญชี
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">โพสต์และความคิดเห็น</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        เก็บไว้จนกว่าคุณจะลบ
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">ข้อความแชท</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        เก็บไว้ 2 ปี หลังจากส่ง
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">ข้อมูลการใช้งาน</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        เก็บไว้ 1 ปี สำหรับการวิเคราะห์
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
                  การจัดการบัญชี
                </CardTitle>
                <CardDescription>
                  ตัวเลือกสำหรับการลบบัญชีและข้อมูลของคุณ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Deactivate Account */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">ปิดใช้งานบัญชีชั่วคราว</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      ซ่อนโปรไฟล์และโพสต์ของคุณจากผู้อื่น แต่ยังสามารถกลับมาใช้งานได้
                    </p>
                  </div>
                  <Button variant="outline" className="w-full sm:w-auto">
                    ปิดใช้งานบัญชีชั่วคราว
                  </Button>
                </div>

                <Separator />

                {/* Delete Account */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-destructive">ลบบัญชีถาวร</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      ลบบัญชีและข้อมูลทั้งหมดของคุณอย่างถาวร การดำเนินการนี้ไม่สามารถย้อนกลับได้
                    </p>
                  </div>
                  
                  <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div className="flex items-start gap-3">
                      <Trash2 className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-destructive">
                          การลบบัญชีจะมีผลดังนี้:
                        </p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• โปรไฟล์และโพสต์ทั้งหมดจะถูกลบอย่างถาวร</li>
                          <li>• ข้อความแชทและประวัติการสนทนาจะถูกลบ</li>
                          <li>• การติดตามและผู้ติดตามจะถูกยกเลิกทั้งหมด</li>
                          <li>• ไม่สามารถกู้คืนข้อมูลได้หลังจากลบแล้ว</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="h-4 w-4 mr-2" />
                    ลบบัญชีถาวร
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