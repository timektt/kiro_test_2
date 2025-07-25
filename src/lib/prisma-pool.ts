/**
 * Prisma Client with Connection Pooling
 * Optimized for production performance
 */

import { PrismaClient } from '@prisma/client'

// Global variable to store the Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Connection pool configuration
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Connection pool settings
    __internal: {
      engine: {
        // Connection pool size (adjust based on your needs)
        connection_limit: parseInt(process.env.DATABASE_CONNECTION_LIMIT || '10'),
        // Connection timeout
        connect_timeout: parseInt(process.env.DATABASE_CONNECT_TIMEOUT || '60'),
        // Pool timeout
        pool_timeout: parseInt(process.env.DATABASE_POOL_TIMEOUT || '60'),
        // Schema cache TTL
        schema_cache_ttl: parseInt(process.env.DATABASE_SCHEMA_CACHE_TTL || '300'),
      },
    },
  })
}

// Create or reuse Prisma client instance
export const prismaPool = globalForPrisma.prisma ?? createPrismaClient()

// In development, store the client on the global object to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaPool
}

// Connection health check
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy'
  latency: number
  error?: string
}> {
  const startTime = Date.now()
  
  try {
    await prismaPool.$queryRaw`SELECT 1`
    const latency = Date.now() - startTime
    
    return {
      status: 'healthy',
      latency,
    }
  } catch (error) {
    const latency = Date.now() - startTime
    
    return {
      status: 'unhealthy',
      latency,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Connection pool metrics
export async function getConnectionPoolMetrics() {
  try {
    // Get database connection info
    const result = await prismaPool.$queryRaw`
      SELECT 
        count(*) as total_connections,
        count(*) FILTER (WHERE state = 'active') as active_connections,
        count(*) FILTER (WHERE state = 'idle') as idle_connections
      FROM pg_stat_activity 
      WHERE datname = current_database()
    ` as any[]

    return {
      totalConnections: Number(result[0]?.total_connections || 0),
      activeConnections: Number(result[0]?.active_connections || 0),
      idleConnections: Number(result[0]?.idle_connections || 0),
    }
  } catch (error) {
    console.error('Failed to get connection pool metrics:', error)
    return {
      totalConnections: 0,
      activeConnections: 0,
      idleConnections: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Graceful shutdown
export async function closeDatabaseConnection() {
  try {
    await prismaPool.$disconnect()
    console.log('Database connection closed gracefully')
  } catch (error) {
    console.error('Error closing database connection:', error)
  }
}

// Handle process termination
if (typeof process !== 'undefined') {
  process.on('SIGINT', closeDatabaseConnection)
  process.on('SIGTERM', closeDatabaseConnection)
  process.on('beforeExit', closeDatabaseConnection)
}

// Query optimization helpers
export class QueryOptimizer {
  // Batch multiple queries together
  static async batchQueries<T>(queries: (() => Promise<T>)[]): Promise<T[]> {
    return Promise.all(queries.map(query => query()))
  }

  // Execute queries in transaction for consistency
  static async executeInTransaction<T>(
    operations: (prisma: PrismaClient) => Promise<T>
  ): Promise<T> {
    return prismaPool.$transaction(operations, {
      maxWait: 5000, // 5 seconds
      timeout: 10000, // 10 seconds
    })
  }

  // Paginated query with cursor-based pagination
  static async paginatedQuery<T>(
    model: any,
    options: {
      cursor?: any
      take: number
      where?: any
      orderBy?: any
      include?: any
      select?: any
    }
  ): Promise<{ data: T[]; nextCursor?: any; hasMore: boolean }> {
    const { cursor, take, where, orderBy, include, select } = options
    
    const items = await model.findMany({
      take: take + 1, // Fetch one extra to check if there are more
      cursor: cursor ? { id: cursor } : undefined,
      where,
      orderBy,
      include,
      select,
    })

    const hasMore = items.length > take
    const data = hasMore ? items.slice(0, -1) : items
    const nextCursor = hasMore ? items[items.length - 2]?.id : undefined

    return {
      data,
      nextCursor,
      hasMore,
    }
  }

  // Optimized count query
  static async getCount(model: any, where?: any): Promise<number> {
    return model.count({ where })
  }

  // Bulk operations
  static async bulkCreate<T>(model: any, data: T[]): Promise<{ count: number }> {
    return model.createMany({
      data,
      skipDuplicates: true,
    })
  }

  static async bulkUpdate<T>(
    model: any,
    updates: { where: any; data: T }[]
  ): Promise<void> {
    await prismaPool.$transaction(
      updates.map(({ where, data }) => model.update({ where, data }))
    )
  }

  static async bulkDelete(model: any, where: any): Promise<{ count: number }> {
    return model.deleteMany({ where })
  }
}

export default prismaPool