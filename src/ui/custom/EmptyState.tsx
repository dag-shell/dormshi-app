import React from 'react';
import { Card, CardContent, CardTitle, CardDescription } from '@/ui/card';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center border-dashed py-10 text-center">
      <CardContent className="flex flex-col items-center p-0">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <CardDescription className="mt-1 max-w-64 text-sm text-muted-foreground">
          {description}
        </CardDescription>
        {action && <div className="mt-4">{action}</div>}
      </CardContent>
    </Card>
  );
}