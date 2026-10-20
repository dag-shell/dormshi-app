export interface EndpointCallRecord {
  id: string;
  endpoint: string;
  timestamp: number;
  durationMs: number;
  status: 'success' | 'endpoint_error' | 'network_error';
  statusCode?: number | string;
  inputPayload: Record<string, unknown> | null;
  response: unknown;
  error?: {
    message: string;
    type?: string;
    parameters?: Record<string, unknown>;
  };
}
