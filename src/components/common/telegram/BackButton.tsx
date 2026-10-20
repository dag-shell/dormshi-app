import { useEffect } from 'react';
import { backButton } from '@tma.js/sdk-react';
import { useRouter } from '@tanstack/react-router';

/**
 * Component which controls the Back Button visibility.
 */
export interface BackButtonProps {
  show?: boolean;
  onClick?: () => void;
}

export function BackButton({ show = true, onClick }: BackButtonProps = {}) {
  const router = useRouter();

  if (!backButton.isMounted()) {
    backButton.mount();
  }

  useEffect(() => {
    show ? backButton.show() : backButton.hide();

    return () => {
      backButton.hide();
    };
  }, [show]);

  useEffect(() => {
    if (!show) return;

    const offClick = backButton.onClick(() => {
      if (onClick) {
        onClick();
      } else {
        router.history.back();
      }
    });

    return () => {
      offClick();
    };
  }, [show, onClick, router]);

  return null;
}