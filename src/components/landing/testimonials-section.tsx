import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    mbti: 'INTJ',
    avatar: '/avatars/sarah-chen.jpg',
    content: 'Finally found a platform where I can connect with people who actually understand how I think. The MBTI matching is incredibly accurate!',
    rating: 5
  },
  {
    name: 'Marcus Johnson',
    role: 'Creative Director',
    mbti: 'ENFP',
    avatar: '/avatars/marcus-johnson.jpg',
    content: 'The community here is amazing. I\'ve made genuine friendships and found collaborators for my creative projects. The personality insights are spot-on.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Psychology Student',
    mbti: 'INFJ',
    avatar: '/avatars/emily-rodriguez.jpg',
    content: 'As someone studying psychology, I appreciate how thoughtfully the MBTI system is integrated. It\'s not just a gimmick - it really helps with meaningful connections.',
    rating: 5
  },
  {
    name: 'David Kim',
    role: 'Entrepreneur',
    mbti: 'ENTJ',
    avatar: '/avatars/david-kim.jpg',
    content: 'Great for networking and finding like-minded individuals. The ranking system motivates me to contribute quality content and engage meaningfully.',
    rating: 5
  },
  {
    name: 'Lisa Thompson',
    role: 'Teacher',
    mbti: 'ESFJ',
    avatar: '/avatars/lisa-thompson.jpg',
    content: 'I love how supportive and understanding this community is. Everyone respects different personality types and communication styles.',
    rating: 5
  },
  {
    name: 'Alex Rivera',
    role: 'Data Analyst',
    mbti: 'ISTP',
    avatar: '/avatars/alex-rivera.jpg',
    content: 'The platform is well-designed and intuitive. I appreciate the focus on quality conversations over mindless scrolling.',
    rating: 5
  }
]

const mbtiColors: Record<string, string> = {
  INTJ: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  ENFP: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  INFJ: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  ENTJ: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  ESFJ: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ISTP: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
}

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="mb-4">
              <Star className="w-4 h-4 mr-2" />
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold">
              What our community
              <span className="block text-primary">members say</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real stories from real people who have found their tribe and grown through meaningful connections.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 relative">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote className="h-8 w-8" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.avatar}
                        alt={`${testimonial.name} avatar`}
                        fill
                        className="object-cover"
                        sizes="48px"
                        priority={index < 3}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <Badge variant="secondary" className={mbtiColors[testimonial.mbti] || 'bg-gray-100'}>
                          {testimonial.mbti}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 text-muted-foreground mb-4">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">4.9/5</span>
              <span>average rating from 2,000+ reviews</span>
            </div>
            <p className="text-lg text-muted-foreground">
              Join thousands of satisfied members who have found their community
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
