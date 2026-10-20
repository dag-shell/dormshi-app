import React from 'react';
import { Avatar, AvatarFallback } from '@/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  initials?: string;
  isMe?: boolean;
  user?: { initials?: string; id?: string; name?: string };
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  sm: 'size-7 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-20 text-2xl'
};

export function UserAvatar({ user, initials, isMe, size = 'md' }: UserAvatarProps) {
  const displayInitials = initials ?? user?.initials ?? 'MO';
  const activeMe = isMe ?? (user?.id === 'u_me');

  return (
    <Avatar className={sizes[size]}>
      <AvatarFallback
        className={cn(
          activeMe ? 'bg-primary text-primary-foreground font-semibold' : 'border border-border bg-secondary text-foreground font-medium'
        )}
      >
        {displayInitials}
      </AvatarFallback>
    </Avatar>
  );
}