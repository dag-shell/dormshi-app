import React, { useState } from 'react';
import { DevToolTrigger } from './DevToolTrigger';
import { DevToolModal } from './DevToolModal';

export interface DevToolProps {
  title?: string;
  endpoints?: string[];
  defaultEnabled?: boolean;
}

export function DevTool({
  title = 'Telegram Serverless DevTool',
  endpoints,
  defaultEnabled,
}: DevToolProps = {}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Determine if DevTool should be active
  const isEnabled = React.useMemo(() => {
    if (defaultEnabled !== undefined) return defaultEnabled;
    if (typeof window === 'undefined') return false;
    if (import.meta.env.DEV) return true;

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('devtool') === 'true') {
      localStorage.setItem('dormshi_devtool', 'true');
      return true;
    }
    if (urlParams.get('devtool') === 'false') {
      localStorage.removeItem('dormshi_devtool');
      return false;
    }

    return localStorage.getItem('dormshi_devtool') === 'true';
  }, [defaultEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      <DevToolTrigger
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      <DevToolModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        endpoints={endpoints}
      />
    </>
  );
}
