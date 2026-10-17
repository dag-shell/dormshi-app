import React from 'react';
import type { User } from '../types/dormshi';
import { CURRENT_USER_ID } from '../data/users';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  sm: 'size-7 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-20 text-2xl'
};

export function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const isMe = user.id === CURRENT_USER_ID;
  return (
    <span
      aria-hidden="true"
      className={`inline-grid shrink-0 place-items-center rounded-full font-medium ${sizes[size]} ${
      isMe ? 'bg-primary text-primary-foreground' : 'border border-border bg-secondary text-foreground'}`
      }>
      
      {user.initials}
    </span>);

}