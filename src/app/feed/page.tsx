import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FeedLayout } from '@/components/layouts/feed-layout';
import { TrendingSidebar } from '@/components/ui/trending-sidebar';
import { RealTimeFeed } from '@/components/feed/real-time-feed';
import { FloatingActionWrapper } from '@/components/feed/floating-action-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Community Feed',
  description:
    'Stay connected with your community. Discover new posts, engage with content, and share your thoughts with like-minded people.',
  keywords: [
    'feed',
    'community',
    'posts',
    'social',
    'updates',
    'timeline',
    'content',
  ],
  openGraph: {
    title: 'Community Feed | Community Platform',
    description:
      'Stay connected with your community. Discover new posts, engage with content, and share your thoughts.',
    type: 'website',
    url: '/feed',
  },
  twitter: {
    card: 'summary',
    title: 'Community Feed | Community Platform',
    description:
      'Stay connected with your community. Discover new posts and engage with content.',
  },
  alternates: {
    canonical: '/feed',
  },
};

export default async function FeedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/feed');
  }

  // Sidebar content
  const sidebar = <TrendingSidebar />;

  return (
    <FeedLayout sidebar={sidebar}>
      <div className="space-y-6">
        {/* Welcome Message */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  Welcome back, {session.user.name}! [WAVE]
                </h1>
                <p className="text-sm text-muted-foreground">
                  Catch up with your community and share what&apos;s on your
                  mind.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Feed with integrated post composer */}
        <RealTimeFeed />
      </div>

      {/* Floating Action Button for Mobile */}
      <FloatingActionWrapper />
    </FeedLayout>
  );
}

