// Telemetry utility – mirrors Angular's telemetry.service.ts event format.
// Call window.EkTelemetry if available (loaded by host app), else no-op.

interface TelemetryContext {
  channel?: string;
  pdata?: { id: string; ver: string; pid?: string };
  env?: string;
  sid?: string;
  uid?: string;
  did?: string;
  contentId?: string;
}

let _ctx: TelemetryContext = {};

export function initTelemetry(ctx: TelemetryContext): void {
  _ctx = ctx;
}

export function trackInteract(id: string, type: string, subtype = '', extra?: Record<string, unknown>): void {
  try {
    const win = window as unknown as Record<string, unknown>;
    const ek = win['EkTelemetry'] as { interact?: (e: unknown) => void } | undefined;
    ek?.interact?.({
      eid: 'INTERACT',
      context: _ctx,
      edata: { type, subtype, id, extra },
    });
  } catch { /* no-op */ }
}

export function trackImpression(type: string, subtype: string, pageid: string): void {
  try {
    const win = window as unknown as Record<string, unknown>;
    const ek = win['EkTelemetry'] as { impression?: (e: unknown) => void } | undefined;
    ek?.impression?.({ eid: 'IMPRESSION', context: _ctx, edata: { type, subtype, pageid } });
  } catch { /* no-op */ }
}

export function trackError(error: Error, id: string): void {
  try {
    const win = window as unknown as Record<string, unknown>;
    const ek = win['EkTelemetry'] as { error?: (e: unknown) => void } | undefined;
    ek?.error?.({ eid: 'ERROR', context: _ctx, edata: { err: error.message, errtype: 'SYSTEM', stacktrace: error.stack, pageid: id } });
  } catch { /* no-op */ }
}
