import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faBolt,
  faPlay,
  faCopy,
  faCheck,
  faClock,
  faCircleCheck,
  faCircleExclamation,
  faRotateRight,
  faCode,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { discoveredEndpoints } from 'virtual:tgcloud-endpoints';
import { EndpointCallRecord } from './types';
import { executeServerlessEndpoint } from './serverlessBridge';

interface DevToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  endpoints?: string[];
}

export function DevToolModal({
  isOpen,
  onClose,
  title = 'Telegram Serverless DevTool',
  endpoints: customEndpointList,
}: DevToolModalProps) {
  const initialEndpoints = customEndpointList || discoveredEndpoints || ['hello', 'ping'];
  const [endpoints, setEndpoints] = useState<string[]>(initialEndpoints);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>(
    initialEndpoints[0] || 'hello'
  );
  const [customEndpoint, setCustomEndpoint] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // Payload state
  const [payloadStr, setPayloadStr] = useState<string>('{\n  "name": "Student"\n}');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Execution state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastRecord, setLastRecord] = useState<EndpointCallRecord | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Listen to Vite HMR event when endpoint files are added or removed
  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.on('tgcloud-endpoints-changed', (data: { endpoints: string[] }) => {
        if (Array.isArray(data.endpoints)) {
          setEndpoints(data.endpoints);
        }
      });
    }
  }, []);

  if (!isOpen) return null;

  const targetEndpoint = isCustom ? customEndpoint.trim() : selectedEndpoint;

  const handlePrettify = () => {
    try {
      const parsed = JSON.parse(payloadStr || '{}');
      setPayloadStr(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (e: unknown) {
      setJsonError((e as Error).message);
    }
  };

  const handleRun = async () => {
    if (!targetEndpoint) {
      setJsonError('Please select or enter an endpoint');
      return;
    }

    let parsedPayload: Record<string, unknown> = {};
    if (payloadStr.trim()) {
      try {
        parsedPayload = JSON.parse(payloadStr);
        setJsonError(null);
      } catch (e: unknown) {
        setJsonError(`Invalid JSON: ${(e as Error).message}`);
        return;
      }
    }

    setIsLoading(true);
    try {
      const record = await executeServerlessEndpoint(targetEndpoint, parsedPayload);
      setLastRecord(record);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  };

  const copyResponse = () => {
    if (!lastRecord) return;
    const content = lastRecord.response
      ? JSON.stringify(lastRecord.response, null, 2)
      : JSON.stringify(lastRecord.error, null, 2);
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
    >
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative flex flex-col w-full sm:max-w-2xl h-[100dvh] sm:h-[94vh] rounded-none sm:rounded-lg border-0 sm:border border-border bg-background shadow-2xl overflow-hidden z-10 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/40 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full bg-primary text-white">
              <FontAwesomeIcon icon={faBolt} className="size-3" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                {title}
              </h2>
              <p className="text-[10px] text-muted-foreground">
                Test tgcloud endpoints inside Mini App
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <FontAwesomeIcon icon={faXmark} className="size-3.5" />
          </button>
        </div>

        {/* Modal Body: Endpoint Tester */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-xs">
          {/* Endpoint Dropdown */}
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
            <label htmlFor="endpoint-select" className="font-semibold text-foreground">
              Endpoint
            </label>

            <div className="relative">
              <select
                id="endpoint-select"
                value={isCustom ? '__custom__' : selectedEndpoint}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setIsCustom(true);
                  } else {
                    setIsCustom(false);
                    setSelectedEndpoint(e.target.value);
                    if (e.target.value === 'hello') {
                      setPayloadStr('{\n  "name": "Student"\n}');
                    } else if (e.target.value === 'ping') {
                      setPayloadStr('{}');
                    }
                  }
                }}
                className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
              >
                {endpoints.map((ep) => (
                  <option key={ep} value={ep}>
                    {ep}
                  </option>
                ))}
                <option value="__custom__">+ Custom endpoint...</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <FontAwesomeIcon icon={faChevronDown} className="size-3" />
              </div>
            </div>

            {isCustom && (
              <div className="pt-1 animate-in fade-in duration-150">
                <input
                  type="text"
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                  placeholder="e.g. createOrder or customEndpoint"
                  autoFocus
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* JSON Payload Editor */}
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-foreground">
                Input Payload (JSON)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrettify}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground hover:bg-neutral-200 dark:hover:bg-neutral-800"
                >
                  Format JSON
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPayloadStr('{}');
                    setJsonError(null);
                  }}
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
            </div>

            <textarea
              rows={5}
              value={payloadStr}
              onChange={(e) => {
                setPayloadStr(e.target.value);
                if (jsonError) setJsonError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="{}"
              className="w-full rounded-lg border border-border bg-background p-2.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
              spellCheck={false}
            />

            {jsonError && (
              <p className="flex items-center gap-1 text-[11px] text-destructive">
                <FontAwesomeIcon icon={faCircleExclamation} className="size-3" />
                {jsonError}
              </p>
            )}

            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleRun}
                className="flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 font-medium text-white transition-opacity hover:opacity-90 active:scale-98 disabled:opacity-50"
              >
                <FontAwesomeIcon
                  icon={isLoading ? faRotateRight : faPlay}
                  className={`size-3 ${isLoading ? 'animate-spin' : ''}`}
                />
                <span>{isLoading ? 'Calling...' : `Call ${targetEndpoint}`}</span>
                <span className="opacity-70 text-[10px] hidden sm:inline">(⌘↵)</span>
              </button>
            </div>
          </div>

          {/* Response Section */}
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Response</span>
                {lastRecord && (
                  <>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        lastRecord.status === 'success'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={
                          lastRecord.status === 'success'
                            ? faCircleCheck
                            : faCircleExclamation
                        }
                        className="size-2.5"
                      />
                      {lastRecord.status === 'success'
                        ? `${lastRecord.statusCode || 200} OK`
                        : `${lastRecord.statusCode || 'ERR'}`}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                      <FontAwesomeIcon icon={faClock} className="size-2.5" />
                      {lastRecord.durationMs}ms
                    </span>
                  </>
                )}
              </div>

              {lastRecord && (
                <button
                  type="button"
                  onClick={copyResponse}
                  className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground hover:bg-neutral-200 dark:hover:bg-neutral-800"
                >
                  <FontAwesomeIcon
                    icon={copied ? faCheck : faCopy}
                    className="size-2.5"
                  />
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {lastRecord ? (
              <div className="flex flex-col gap-2">
                {lastRecord.error && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-destructive text-[11px]">
                    <p className="font-semibold">
                      {lastRecord.error.type || 'Error'}: {lastRecord.error.message}
                    </p>
                    {lastRecord.error.parameters && (
                      <pre className="mt-1 font-mono text-[10px] opacity-90 overflow-x-auto">
                        {JSON.stringify(lastRecord.error.parameters, null, 2)}
                      </pre>
                    )}
                  </div>
                )}

                <pre className="max-h-[48vh] overflow-auto rounded-md bg-neutral-900 p-3 font-mono text-[11px] text-neutral-100 dark:bg-black">
                  {JSON.stringify(lastRecord.response ?? lastRecord.error, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                <FontAwesomeIcon icon={faCode} className="mb-2 size-5 opacity-40" />
                <p className="text-xs">Select an endpoint from the dropdown and click "Call" to test.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
