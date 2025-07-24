'use client'

import { useState } from 'react'
import { MBTIType } from '@/types'
import { 
  MBTI_DATA, 
  MBTI_CATEGORIES, 
  CATEGORY_INFO, 
  getMBTIInfo, 
  getMBTIColorClass,
  getMBTICategory 
} from '@/lib/mbti'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface MBTISelectorProps {
  selectedType?: MBTIType | null
  onSelect: (type: MBTIType) => void
  onConfirm: () => void
  isLoading?: boolean
  disabled?: boolean
}

export function MBTISelector({ 
  selectedType, 
  onSelect, 
  onConfirm, 
  isLoading = false,
  disabled = false 
}: MBTISelectorProps) {
  const [activeCategory, setActiveCategory] = useState<keyof typeof MBTI_CATEGORIES>('ANALYSTS')

  const handleTypeSelect = (type: MBTIType) => {
    if (disabled) return
    onSelect(type)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Identity</h2>
        <p className="text-muted-foreground">
          Select an MBTI personality type that represents you in the community
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as keyof typeof MBTI_CATEGORIES)}>
        <TabsList className="grid w-full grid-cols-4">
          {Object.entries(CATEGORY_INFO).map(([key, info]) => (
            <TabsTrigger key={key} value={key} className="text-xs">
              {info.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(MBTI_CATEGORIES).map(([categoryKey, types]) => (
          <TabsContent key={categoryKey} value={categoryKey} className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {CATEGORY_INFO[categoryKey as keyof typeof CATEGORY_INFO].name}
                </CardTitle>
                <CardDescription>
                  {CATEGORY_INFO[categoryKey as keyof typeof CATEGORY_INFO].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {types.map((type) => {
                    const info = getMBTIInfo(type)
                    const isSelected = selectedType === type
                    const colorClass = getMBTIColorClass(type)

                    return (
                      <Card
                        key={type}
                        className={cn(
                          'cursor-pointer transition-all duration-200 hover:shadow-md',
                          isSelected && 'ring-2 ring-primary ring-offset-2',
                          disabled && 'opacity-50 cursor-not-allowed'
                        )}
                        onClick={() => handleTypeSelect(type)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl" aria-hidden="true">
                                {info.emoji}
                              </span>
                              <div>
                                <Badge className={cn('font-bold', colorClass)}>
                                  {type}
                                </Badge>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <h4 className="font-semibold text-sm">{info.name}</h4>
                              <p className="text-xs text-muted-foreground">{info.nickname}</p>
                            </div>
                            
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {info.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-1">
                              {info.traits.slice(0, 3).map((trait) => (
                                <Badge key={trait} variant="secondary" className="text-xs px-1.5 py-0.5">
                                  {trait}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {selectedType && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {getMBTIInfo(selectedType).emoji}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className={getMBTIColorClass(selectedType)}>
                      {selectedType}
                    </Badge>
                    <span className="font-semibold">
                      {getMBTIInfo(selectedType).name}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getMBTIInfo(selectedType).nickname}
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={onConfirm}
                disabled={isLoading || disabled}
                className="min-w-24"
              >
                {isLoading ? 'Saving...' : 'Confirm'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface MBTIQuickSelectorProps {
  selectedType?: MBTIType | null
  onSelect: (type: MBTIType) => void
  disabled?: boolean
}

export function MBTIQuickSelector({ selectedType, onSelect, disabled = false }: MBTIQuickSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Quick Select</h3>
      <div className="grid grid-cols-4 gap-2">
        {Object.values(MBTI_DATA).map((info) => {
          const isSelected = selectedType === info.type
          const colorClass = getMBTIColorClass(info.type)

          return (
            <Button
              key={info.type}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={cn(
                'h-auto p-2 flex flex-col items-center gap-1',
                !isSelected && colorClass,
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => !disabled && onSelect(info.type)}
              disabled={disabled}
            >
              <span className="text-lg">{info.emoji}</span>
              <span className="text-xs font-bold">{info.type}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}