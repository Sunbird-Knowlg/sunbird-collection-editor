import { useEditorStore } from '../store/editor.store';

interface EData {
  type: string;
  subtype?: string;
  id?: string;
  pageid?: string;
  [k: string]: unknown;
}

type TelemetryWindow = {
  Telemetry?: {
    interact: (d: unknown) => void;
    impression: (d: unknown) => void;
    error: (d: unknown) => void;
  };
};

export function useTelemetry() {
  const config = useEditorStore((s) => s.editorConfig);
  const ctx = config?.context;

  function interact(edata: EData) {
    const win = (typeof window !== 'undefined' ? window : {}) as TelemetryWindow;
    if (win.Telemetry?.interact) {
      win.Telemetry.interact({ context: ctx, edata });
    } else {
      console.debug('[Telemetry] interact', edata);
    }
  }

  function impression(edata: EData) {
    const win = (typeof window !== 'undefined' ? window : {}) as TelemetryWindow;
    if (win.Telemetry?.impression) {
      win.Telemetry.impression({ context: ctx, edata });
    } else {
      console.debug('[Telemetry] impression', edata);
    }
  }

  function error(edata: EData) {
    console.error('[Telemetry] error', edata);
  }

  return { interact, impression, error };
}
