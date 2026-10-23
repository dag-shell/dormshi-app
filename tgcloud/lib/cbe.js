// CBE deposit verification.
// Legacy apps.cbe.com.et:100 is often unreachable from isolates — verify via
// cheki.et (FT + account) or CBE's public mb receipt JSON API (receipt id/link).
import { fetch, EndpointError } from 'sdk';

export const CBE_ACCOUNT_NUMBER = '1000431177278';

/** Legacy FT refs: FT + 10 alphanumeric chars (e.g. FT2429402941, FT26140P01YB). */
const FT_RE = /^FT[A-Z0-9]{10}$/i;
const MBRECEIPT_URL_RE = /mbreciept\.cbe\.com\.et\/([A-Za-z0-9_-]+)/i;

function invalid(txnId, detail) {
  throw new EndpointError('CBE transaction not found or not credited.', {
    code: 'INVALID_TRANSACTION',
    txnId,
    ...(detail ? { detail } : {}),
  });
}

/**
 * Normalize client input into either { kind:'ft', id } or { kind:'receipt', id }.
 * Accepts bare FT refs, mbreciept links, or short receipt ids.
 */
export function parseDepositReference(raw) {
  if (typeof raw !== 'string' || !raw.trim()) {
    throw new EndpointError('txnId is required.', { code: 'INVALID_TRANSACTION' });
  }

  const trimmed = raw.trim();

  const urlMatch = trimmed.match(MBRECEIPT_URL_RE);
  if (urlMatch) {
    return { kind: 'receipt', id: urlMatch[1] };
  }

  if (/^https?:\/\//i.test(trimmed)) {
    throw new EndpointError('Unsupported receipt URL. Use a CBE FT ref or mbreciept link.', {
      code: 'INVALID_TRANSACTION',
      txnId: trimmed,
    });
  }

  const upper = trimmed.toUpperCase();
  if (FT_RE.test(upper)) {
    return { kind: 'ft', id: upper };
  }

  // Short receipt id from QR / share link (no FT prefix).
  if (/^[A-Za-z0-9_-]{8,64}$/.test(trimmed)) {
    return { kind: 'receipt', id: trimmed };
  }

  throw new EndpointError('Invalid CBE transaction reference format.', {
    code: 'INVALID_TRANSACTION',
    txnId: trimmed,
  });
}

function pickAmount(payload) {
  if (!payload || typeof payload !== 'object') return null;
  const candidates = [
    payload.amount,
    payload.transferredAmount,
    payload.transactionAmount,
    payload.data?.amount,
    payload.result?.amount,
  ];
  for (const c of candidates) {
    const n = Number(c);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

function pickReference(payload, fallback) {
  if (!payload || typeof payload !== 'object') return fallback;
  return (
    payload.reference ||
    payload.ftNumber ||
    payload.transactionReference ||
    payload.data?.reference ||
    fallback
  );
}

async function verifyViaCheki(reference) {
  let res;
  try {
    res = await fetch('https://cheki.et/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bank: 'cbe',
        reference,
        accountNumber: CBE_ACCOUNT_NUMBER,
      }),
    });
  } catch (err) {
    invalid(reference, err?.message || 'cheki fetch failed');
  }

  if (!res.ok) {
    invalid(reference, `cheki HTTP ${res.status}`);
  }

  let data;
  try {
    data = await res.json();
  } catch {
    invalid(reference, 'cheki returned non-JSON');
  }

  if (!data?.success || !data?.verified) {
    invalid(reference, data?.error || data?.message || 'not verified');
  }

  const amount = pickAmount(data);
  if (amount == null) invalid(reference, 'no amount in cheki response');

  return {
    txnId: String(pickReference(data, reference)).toUpperCase(),
    amount,
  };
}

async function verifyViaMbApi(receiptId) {
  let res;
  try {
    res = await fetch(
      `https://mb.cbe.com.et/api/v1/transactions/public/transaction-detail/${receiptId}`,
      {
        headers: {
          'X-App-ID': 'dormshi',
          'X-App-Version': '1.0.0',
          Accept: 'application/json',
        },
      },
    );
  } catch (err) {
    invalid(receiptId, err?.message || 'mb.cbe fetch failed');
  }

  if (!res.ok) {
    invalid(receiptId, `mb.cbe HTTP ${res.status}`);
  }

  let data;
  try {
    data = await res.json();
  } catch {
    invalid(receiptId, 'mb.cbe returned non-JSON');
  }

  const amount = pickAmount(data);
  if (amount == null) invalid(receiptId, 'no amount in mb.cbe response');

  return {
    txnId: String(pickReference(data, receiptId)).toUpperCase(),
    amount,
  };
}

/**
 * Verify a CBE transfer to the Dormshi account and return { txnId, amount }.
 * `txnId` input may be an FT reference, mbreciept URL, or short receipt id.
 */
export async function verifyCbeDeposit(txnId) {
  const ref = parseDepositReference(txnId);

  if (ref.kind === 'ft') {
    // Prefer cheki for FT refs — legacy PDF host is frequently down.
    return verifyViaCheki(ref.id);
  }

  // Receipt id / link: try CBE JSON first, then cheki with the full mbreciept URL.
  try {
    return await verifyViaMbApi(ref.id);
  } catch (first) {
    if (!(first instanceof EndpointError)) throw first;
    return verifyViaCheki(`https://mbreciept.cbe.com.et/${ref.id}`);
  }
}
