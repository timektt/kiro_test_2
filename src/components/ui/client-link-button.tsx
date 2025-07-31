'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonProps } from '@/components/ui/button'

interface ClientLinkButtonProps extends Omit<ButtonProps, 'asChild'> {
  href: string
  children: React.ReactNode
}

export function ClientLinkButton({ href, children, ...props }: ClientLinkButtonProps) {
  return (
    <Button asChild {...props}>
      <Link href={href}>
        {children}
      </Link>
    </Button>
  )
}