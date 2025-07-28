// src/components/common/InteractiveLinkButton.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
};

export default function InteractiveLinkButton({ href, children, className, variant = 'default' }: Props) {
  return (
    <Button variant={variant} asChild className={className}>
      <Link href={href}>
        {children}
      </Link>
    </Button>
  );
}
