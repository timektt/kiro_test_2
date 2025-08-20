'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonProps } from '@/components/ui/button'

interface ClientLinkButtonProps extends Omit<ButtonProps, 'asChild'> {
  href: string
  children: React.ReactNode
}

export function ClientLinkButton({ href, children, ...props }: ClientLinkButtonProps) {
  // Filter out event handlers that shouldn't be passed to Link
  const { onKeyDown, onClick, onMouseDown, onMouseUp, onFocus, onBlur, ...buttonProps } = props
  
  return (
    <Button asChild {...buttonProps}>
      <Link href={href}>
        {children}
      </Link>
    </Button>
  )
}
