'use client'

import { MBTI } from '@/types'
import { getMBTIInfo, getMBTIColorClass, getMBTICategory, CATEGORY_INFO } from '@/lib/mbti'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface MBTIProfileProps {
  mbti: MBTI
  showDetails?: boolean
  className?: string
}

export function MBTIProfile({ mbti, showDetails = true, className }: MBTIProfileProps) {
  const info = getMBTIInfo(mbti.type)
  const category = getMBTICategory(mbti.type)
  const categoryInfo = CATEGORY_INFO[category]
  const colorClass = getMBTIColorClass(mbti.type)

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">
              {info.emoji}
            </span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className={cn('font-bold text-sm', colorClass)}>
                  {mbti.type}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {categoryInfo.name}
                </Badge>
              </div>
              <CardTitle className="text-xl">{info.name}</CardTitle>
              <CardDescription className="text-sm">
                {info.nickname}
              </CardDescription>
            </div>
          </div>
          
          {mbti.isLocked && (
            <Badge variant="outline" className="text-xs">
              🔒 Locked
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {info.description}
          </p>
        </div>

        {showDetails && (
          <>
            <Separator />
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Key Traits</h4>
                <div className="flex flex-wrap gap-1">
                  {info.traits.map((trait) => (
                    <Badge key={trait} variant="secondary" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-green-700">
                    💪 Strengths
                  </h4>
                  <ul className="space-y-1">
                    {info.strengths.map((strength) => (
                      <li key={strength} className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 text-orange-700">
                    ⚠️ Challenges
                  </h4>
                  <ul className="space-y-1">
                    {info.challenges.map((challenge) => (
                      <li key={challenge} className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="w-1 h-1 bg-orange-500 rounded-full flex-shrink-0"></span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            <div className="text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Assigned on {mbti.assignedAt.toLocaleDateString()}</span>
                {mbti.description && (
                  <span className="italic">"{mbti.description}"</span>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

interface MBTIStatsProps {
  mbti: MBTI
  stats?: {
    postsCount: number
    likesReceived: number
    commentsCount: number
    followersCount: number
  }
}

export function MBTIStats({ mbti, stats }: MBTIStatsProps) {
  const info = getMBTIInfo(mbti.type)
  const colorClass = getMBTIColorClass(mbti.type)

  if (!stats) return null

  const maxStat = Math.max(
    stats.postsCount,
    stats.likesReceived,
    stats.commentsCount,
    stats.followersCount
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span>{info.emoji}</span>
          <Badge className={colorClass}>{mbti.type}</Badge>
          Activity Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Posts Created</span>
            <span className="font-medium">{stats.postsCount}</span>
          </div>
          <Progress value={(stats.postsCount / maxStat) * 100} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Likes Received</span>
            <span className="font-medium">{stats.likesReceived}</span>
          </div>
          <Progress value={(stats.likesReceived / maxStat) * 100} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Comments Made</span>
            <span className="font-medium">{stats.commentsCount}</span>
          </div>
          <Progress value={(stats.commentsCount / maxStat) * 100} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Followers</span>
            <span className="font-medium">{stats.followersCount}</span>
          </div>
          <Progress value={(stats.followersCount / maxStat) * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}

export default MBTIProfile