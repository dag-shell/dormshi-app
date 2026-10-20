import { initData } from '@tma.js/sdk';
import { EndpointCallRecord } from '../types';

interface TelegramServerlessError {
  message?: string;
  type?: string;
  parameters?: Record<string, unknown>;
}

interface TelegramWebApp {
  initData?: string;
  Serverless?: {
    call?: (
      name: string,
      payload: Record<string, unknown>,
      callback: (err: TelegramServerlessError | null, result: unknown) => void
    ) => void;
  };
}

export function getSafeInitData(): string {
  try {
    const raw = initData.raw();
    if (raw) return raw;
  } catch {
    // outside TMA
  }

  if (typeof window !== 'undefined') {
    const tg = (window as unknown as { Telegram?: { WebApp?: TelegramWebApp } }).Telegram?.WebApp;
    if (tg?.initData) return tg.initData;
  }

  return '';
}

/**
 * Invokes a Telegram serverless endpoint.
 * - In Telegram Cloud, uses Telegram.WebApp.Serverless.call(name, payload, cb).
 * - Otherwise calls POST /api/<name> with initData from @tma.js/sdk.
 */
export async function executeServerlessEndpoint(
  endpointName: string,
  payload: Record<string, unknown>
): Promise<EndpointCallRecord> {
  const callId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const cleanName = endpointName.trim().replace(/^\/api\//, '').replace(/^\/+/, '');
  const startTime = performance.now();
  const rawInitData = getSafeInitData();

  const tg = (window as unknown as { Telegram?: { WebApp?: TelegramWebApp } }).Telegram?.WebApp;

  // 1. Telegram Cloud native Serverless call
  if (typeof tg?.Serverless?.call === 'function') {
    return new Promise<EndpointCallRecord>((resolve) => {
      try {
        tg.Serverless!.call!(cleanName, payload, (err, result) => {
          const durationMs = Math.round(performance.now() - startTime);

          if (err) {
            resolve({
              id: callId,
              endpoint: cleanName,
              timestamp: Date.now(),
              durationMs,
              status: err.type === 'ENDPOINT_ERROR' ? 'endpoint_error' : 'network_error',
              statusCode: err.type || 400,
              inputPayload: payload,
              response: null,
              error: {
                message: err.message || 'Endpoint returned an error',
                type: err.type,
                parameters: err.parameters,
              },
            });
            return;
          }

          resolve({
            id: callId,
            endpoint: cleanName,
            timestamp: Date.now(),
            durationMs,
            status: 'success',
            statusCode: 200,
            inputPayload: payload,
            response: result,
          });
        });
      } catch (err: unknown) {
        const durationMs = Math.round(performance.now() - startTime);
        const error = err as Error;
        resolve({
          id: callId,
          endpoint: cleanName,
          timestamp: Date.now(),
          durationMs,
          status: 'network_error',
          statusCode: 'EXCEPTION',
          inputPayload: payload,
          response: null,
          error: { message: error?.message || 'Serverless.call exception' },
        });
      }
    });
  }

  // 2. Fetch with initData from @tma.js/sdk
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (rawInitData) {
      headers['Authorization'] = `tma ${rawInitData}`;
      headers['X-Telegram-Init-Data'] = rawInitData;
    }

    const response = await fetch(`/api/${cleanName}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const durationMs = Math.round(performance.now() - startTime);
    const contentType = response.headers.get('content-type') || '';
    let data: unknown = null;

    if (contentType.includes('application/json')) {
      data = await response.json().catch(() => null);
    } else {
      const textData = await response.text().catch(() => '');
      if (textData.trim().toLowerCase().startsWith('<!doctype') || textData.includes('<html')) {
        return {
          id: callId,
          endpoint: cleanName,
          timestamp: Date.now(),
          durationMs,
          status: 'network_error',
          statusCode: 'HTML_RESPONSE',
          inputPayload: payload,
          response: null,
          error: {
            message:
              'Server returned HTML page. Telegram serverless endpoints are POST requests handled by tgcloud or the Vite dev runner.',
          },
        };
      }
      try {
        data = JSON.parse(textData);
      } catch {
        data = textData;
      }
    }

    if (!response.ok) {
      const errObj = data as {
        ok?: boolean;
        error_type?: string;
        description?: string;
        error?: string;
        parameters?: Record<string, unknown>;
      } | null;

      return {
        id: callId,
        endpoint: cleanName,
        timestamp: Date.now(),
        durationMs,
        status:
          errObj?.error_type === 'ENDPOINT_ERROR' ? 'endpoint_error' : 'network_error',
        statusCode: response.status,
        inputPayload: payload,
        response: data,
        error: {
          message:
            errObj?.description ||
            errObj?.error ||
            response.statusText ||
            `HTTP ${response.status} error`,
          type: errObj?.error_type,
          parameters: errObj?.parameters,
        },
      };
    }

    return {
      id: callId,
      endpoint: cleanName,
      timestamp: Date.now(),
      durationMs,
      status: 'success',
      statusCode: response.status,
      inputPayload: payload,
      response:
        (data as { result?: unknown })?.result !== undefined
          ? (data as { result: unknown }).result
          : data,
    };
  } catch (err: unknown) {
    const durationMs = Math.round(performance.now() - startTime);
    const error = err as Error;
    return {
      id: callId,
      endpoint: cleanName,
      timestamp: Date.now(),
      durationMs,
      status: 'network_error',
      statusCode: 'FETCH_ERROR',
      inputPayload: payload,
      response: null,
      error: { message: error?.message || `Failed to call ${cleanName}` },
    };
  }
}
