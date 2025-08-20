import { NextRequest, NextResponse } from 'next/server'
import { createAdminHandler } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const getReportsSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  status: z.enum(['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED', 'ALL']).optional().default('ALL'),
  type: z.enum(['POST', 'USER', 'COMMENT', 'CHAT_MESSAGE', 'ALL']).optional().default('ALL'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT', 'ALL']).optional().default('ALL'),
})

const updateReportSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED']),
  adminNotes: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
})

export const GET = createAdminHandler('CONTENT_MODERATION')(
  async (request: NextRequest, adminUser) => {
    try {
      const { searchParams } = new URL(request.url)
      const { page, limit, status, type, priority } = getReportsSchema.parse({
        page: searchParams.get('page') || '1',
        limit: searchParams.get('limit') || '20',
        status: searchParams.get('status') || 'ALL',
        type: searchParams.get('type') || 'ALL',
        priority: searchParams.get('priority') || 'ALL',
      })

      const pageNum = parseInt(page)
      const limitNum = parseInt(limit)
      const skip = (pageNum - 1) * limitNum

      // Build where clause
      const where: any = {}
      
      if (status !== 'ALL') {
        where.status = status
      }
      
      if (type !== 'ALL') {
        where.type = type
      }
      
      if (priority !== 'ALL') {
        where.priority = priority
      }

      // Get reports with related data
      const [reports, totalCount] = await Promise.all([
        prisma.report.findMany({
          where,
          include: {
            reporter: {
              select: {
                id: true,
                username: true,
                name: true,
                email: true,
                image: true,
              },
            },
            reportedUser: {
              select: {
                id: true,
                username: true,
                name: true,
                email: true,
                image: true,
              },
            },
            reportedPost: {
              select: {
                id: true,
                content: true,
                createdAt: true,
                author: {
                  select: {
                    username: true,
                    name: true,
                  },
                },
              },
            },
            reportedComment: {
              select: {
                id: true,
                content: true,
                createdAt: true,
                author: {
                  select: {
                    username: true,
                    name: true,
                  },
                },
              },
            },
            reviewedBy: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
          },
          orderBy: [
            { priority: 'desc' },
            { createdAt: 'desc' },
          ],
          skip,
          take: limitNum,
        }),
        prisma.report.count({ where }),
      ])

      const totalPages = Math.ceil(totalCount / limitNum)

      return NextResponse.json({
        success: true,
        data: {
          reports,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: totalCount,
            totalPages,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1,
          },
        },
      })
    } catch (error) {
      console.error('Error fetching reports:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch reports' },
        { status: 500 }
      )
    }
  }
)

export const POST = createAdminHandler('CONTENT_MODERATION')(
  async (request: NextRequest, adminUser) => {
    try {
      const body = await request.json()
      const { reportId, ...updateData } = body

      if (!reportId) {
        return NextResponse.json(
          { success: false, error: 'Report ID is required' },
          { status: 400 }
        )
      }

      const validatedData = updateReportSchema.parse(updateData)

      // Update report
      const updatedReport = await prisma.report.update({
        where: { id: reportId },
        data: {
          ...validatedData,
          reviewedById: adminUser.id,
          reviewedAt: new Date(),
        },
        include: {
          reporter: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
          reportedUser: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
          reviewedBy: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
      })

      return NextResponse.json({
        success: true,
        data: updatedReport,
        message: 'Report updated successfully',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { success: false, error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }

      console.error('Error updating report:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update report' },
        { status: 500 }
      )
    }
  }
)
