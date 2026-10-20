import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faXmark } from '@fortawesome/free-solid-svg-icons';

interface DevToolTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function DevToolTrigger({ isOpen, onToggle }: DevToolTriggerProps) {
  const [dockLeft, setDockLeft] = useState<boolean>(false);

  return (
    <div
      className={`fixed bottom-20 z-50 transition-all duration-200 select-none ${
        dockLeft ? 'left-4' : 'right-4'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onToggle}
          title="Toggle Telegram Serverless DevTool"
          className="group flex h-10 items-center gap-2 rounded-full bg-neutral-900 px-3.5 text-xs font-semibold text-white shadow-xl ring-1 ring-white/10 transition-transform active:scale-95 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
        >
          <div className="flex size-5 items-center justify-center rounded-full bg-primary text-white">
            <FontAwesomeIcon icon={isOpen ? faXmark : faTerminal} className="size-2.5" />
          </div>
          <span>DevTool</span>
        </button>

        {/* Small position flip toggle */}
        <button
          type="button"
          onClick={() => setDockLeft(!dockLeft)}
          title={`Dock to ${dockLeft ? 'right' : 'left'}`}
          className="hidden sm:flex size-6 items-center justify-center rounded-full bg-neutral-800/80 text-[10px] text-neutral-400 hover:text-white"
        >
          ⇄
        </button>
      </div>
    </div>
  );
}
