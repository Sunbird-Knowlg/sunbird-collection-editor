import React, { useEffect, useRef, useState } from 'react';
import type { INode, EditorMode } from '../../types/editor';
import { useEditorStore } from '../../store/editor.store';
import styles from './ContentPlayer.module.scss';

// ── MIME-type classification ──────────────────────────────────────────────────
const MIME_GROUPS: Array<{ key: string; mimes: string[]; label: string; icon: string }> = [
  { key: 'video',  mimes: ['video/mp4','video/webm','video/ogg'],               label: 'Video',  icon: '🎬' },
  { key: 'audio',  mimes: ['audio/mp3','audio/mpeg','audio/ogg','audio/wav'],    label: 'Audio',  icon: '🎵' },
  { key: 'pdf',    mimes: ['application/pdf'],                                   label: 'PDF',    icon: '📄' },
  { key: 'epub',   mimes: ['application/epub'],                                  label: 'ePub',   icon: '📖' },
  { key: 'ecml',   mimes: ['application/vnd.ekstep.ecml-archive'],               label: 'ECML',   icon: '✏️'  },
  { key: 'h5p',    mimes: ['application/vnd.ekstep.h5p-archive'],                label: 'H5P',    icon: '🎮'  },
  { key: 'scorm',  mimes: ['application/vnd.ekstep.content-collection'],         label: 'SCORM',  icon: '📦'  },
];

function getMimeGroup(mimeType: string) {
  return MIME_GROUPS.find(g => g.mimes.includes(mimeType)) ?? { key: 'other', label: 'Content', icon: '📱' };
}

// ── Player type resolution ────────────────────────────────────────────────────
const PLAYER_TYPE_MAP: Record<string, string[]> = {
  'pdf-player':   ['application/pdf'],
  'video-player': ['video/mp4', 'video/webm'],
  'epub-player':  ['application/epub'],
};

const PLAYER_SCRIPTS: Record<string, string> = {
  'pdf-player':   '/assets/sunbird-pdf-player.js',
  'video-player': '/assets/sunbird-video-player.js',
  'epub-player':  '/assets/sunbird-epub-player.js',
};

const PLAYER_TAGS: Record<string, string> = {
  'pdf-player':   'sunbird-pdf-player',
  'video-player': 'sunbird-video-player',
  'epub-player':  'sunbird-epub-player',
};

const DEFAULT_PLAYER_URL =
  '/content/preview/preview.html?webview=true&build_number=2.8.0.e552fcd';

function resolvePlayerType(mimeType: string): string {
  for (const [type, mimes] of Object.entries(PLAYER_TYPE_MAP)) {
    if (mimes.includes(mimeType)) return type;
  }
  return 'default-player';
}

// ── Player config builder ─────────────────────────────────────────────────────
function buildPlayerConfig(
  node: INode,
  editorConfig: ReturnType<typeof useEditorStore.getState>['editorConfig'],
) {
  const ctx = editorConfig?.context;
  const metadata = (node.metadata ?? {}) as Record<string, unknown>;
  const mimeType = node.mimeType ?? '';

  return {
    context: {
      mode: 'play',
      partner: [],
      pdata: { id: ctx?.pdata?.id ?? 'sunbird.portal', ver: 1.0, pid: 'sunbird-portal' },
      contentId: node.identifier,
      sid: ctx?.sid ?? '',
      uid: ctx?.uid ?? '',
      channel: ctx?.channel ?? '',
      did: ctx?.did ?? '',
      timeDiff: 0,
      contextRollup: {},
      tags: [],
      app: [ctx?.channel ?? ''],
      dims: '',
    },
    config: {
      showEndPage: false,
      showStartPage: true,
      host: '',
      overlay: { showUser: false },
      splash: { text: '', icon: '', bgImage: '', webLink: '' },
      sideMenu: { showDownload: true, showExit: false, showShare: true },
      apislug: '/action',
      repos: ['/sunbird-plugins/renderer'],
      plugins: [
        { id: 'org.sunbird.iframeEvent', ver: 1.0, type: 'plugin' },
        { id: 'org.sunbird.player.endpage', ver: 1.1, type: 'plugin' },
      ],
      enableTelemetryValidation: false,
      previewCdnUrl: undefined,
    },
    metadata,
    data: mimeType === 'application/vnd.ekstep.ecml-archive' ? (metadata.body ?? {}) : {},
  };
}

// ── Script loader ─────────────────────────────────────────────────────────────
function loadScript(src: string): Promise<void> {
  if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

function waitForCustomElement(tag: string, playerType: string, maxAttempts = 100): Promise<void> {
  return loadScript(PLAYER_SCRIPTS[playerType] ?? '').then(
    () => new Promise((resolve) => {
      if (customElements.get(tag)) { resolve(); return; }
      let attempts = 0;
      const id = setInterval(() => {
        attempts++;
        if (customElements.get(tag) || attempts >= maxAttempts) { clearInterval(id); resolve(); }
      }, 100);
    }),
  );
}

// ── Info strip ────────────────────────────────────────────────────────────────
const INFO_FIELDS: Array<{ key: string; label: string; icon: string }> = [
  { key: 'author',      label: 'Author',   icon: '👤' },
  { key: 'license',     label: 'License',  icon: '⚖️'  },
  { key: 'copyright',   label: '©',        icon: ''   },
  { key: 'language',    label: 'Language', icon: '🌐'  },
  { key: 'gradeLevel',  label: 'Class',    icon: '🏫'  },
  { key: 'subject',     label: 'Subject',  icon: '📚'  },
  { key: 'contentType', label: 'Type',     icon: '🏷️'  },
];

function InfoStrip({ node }: { node: INode }) {
  const meta = (node.metadata ?? {}) as Record<string, unknown>;
  const chips = INFO_FIELDS.flatMap(f => {
    const raw = meta[f.key];
    if (!raw) return [];
    const val = Array.isArray(raw) ? raw.join(', ') : String(raw);
    if (!val) return [];
    return [{ ...f, val }];
  });
  if (!chips.length) return null;

  return (
    <div className={styles.infoStrip}>
      {chips.map(c => (
        <div key={c.key} className={styles.infoChip}>
          {c.icon && <span className={styles.infoChipIcon}>{c.icon}</span>}
          <span className={styles.infoChipLabel}>{c.label}</span>
          {c.val}
        </div>
      ))}
    </div>
  );
}

// ── Cover overlay (shown while player initialises) ────────────────────────────
function CoverOverlay({ node, hidden }: { node: INode; hidden: boolean }) {
  const thumb = node.appIcon ?? (node.metadata?.appIcon as string | undefined);
  return (
    <div className={`${styles.coverOverlay} ${hidden ? styles.coverHidden : ''}`}>
      {thumb ? (
        <>
          <img src={thumb} alt={node.name} className={styles.coverThumb} />
          <div className={styles.coverPlayRing}>
            <div className={styles.coverPlayIcon} />
          </div>
          <span className={styles.coverLabel}>Loading preview…</span>
        </>
      ) : (
        <div className={styles.coverSkeleton} />
      )}
    </div>
  );
}

// ── Type badge ────────────────────────────────────────────────────────────────
function TypeBadge({ mimeType }: { mimeType: string }) {
  const group = getMimeGroup(mimeType);
  return (
    <span className={styles.typeBadge} data-type={group.key}>
      <span className={styles.typeDot} />
      {group.label}
    </span>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface ContentPlayerProps {
  node: INode;
  editorMode: EditorMode;
  type: 'content' | 'quml';
}

// ── Root ──────────────────────────────────────────────────────────────────────
export const ContentPlayer: React.FC<ContentPlayerProps> = ({ node, editorMode, type }) => {
  if (type === 'quml') return <QumlPlayer node={node} editorMode={editorMode} />;

  const thumb = node.appIcon ?? (node.metadata?.appIcon as string | undefined);

  return (
    <div className={styles.contentPlayerRoot}>
      {/* Dark cinema stage */}
      <div className={styles.stage}>
        {/* Header gradient bar */}
        <div className={styles.playerHeader}>
          {thumb && (
            <img src={thumb} alt="" className={styles.playerHeaderThumb} />
          )}
          <span className={styles.playerHeaderTitle}>{node.name}</span>
          <TypeBadge mimeType={node.mimeType ?? ''} />
        </div>

        {/* Actual player */}
        <SunbirdContentPlayer node={node} />
      </div>

      {/* Compact info strip below the stage */}
      <InfoStrip node={node} />
    </div>
  );
};

// ── Sunbird content player ────────────────────────────────────────────────────
function SunbirdContentPlayer({ node }: { node: INode }) {
  const editorConfig = useEditorStore((s) => s.editorConfig);
  const [playerType, setPlayerType] = useState(() => resolvePlayerType(node.mimeType ?? ''));
  const [coverHidden, setCoverHidden] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const webComponentRef = useRef<HTMLDivElement>(null);

  const playerConfig = buildPlayerConfig(node, { editorConfig } as any);

  useEffect(() => {
    setCoverHidden(false);
    setPlayerType(resolvePlayerType(node.mimeType ?? ''));
  }, [node.identifier, node.mimeType]);

  // Default player — iframe
  useEffect(() => {
    if (playerType !== 'default-player') return;
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.src = DEFAULT_PLAYER_URL;
    iframe.onload = () => {
      try {
        (iframe.contentWindow as any)?.initializePreview(playerConfig);
      } catch (err) {
        console.error('initializePreview failed', err);
      }
      setTimeout(() => setCoverHidden(true), 300);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.identifier, playerType]);

  // Web-component players (pdf / video / epub)
  useEffect(() => {
    if (playerType === 'default-player') return;
    const container = webComponentRef.current;
    if (!container) return;
    const tag = PLAYER_TAGS[playerType];
    if (!tag) return;

    waitForCustomElement(tag, playerType).then(() => {
      if (!webComponentRef.current) return;
      if (!customElements.get(tag)) { setPlayerType('default-player'); return; }

      const el = document.createElement(tag) as any;
      el.setAttribute('player-config', JSON.stringify(playerConfig));
      el.addEventListener('playerEvent', () => {});
      el.addEventListener('telemetryEvent', () => {});
      container.innerHTML = '';
      container.appendChild(el);
      setTimeout(() => {
        try { el.playerConfig = playerConfig; } catch { /* attribute-only player */ }
        setCoverHidden(true);
      }, 200);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.identifier, playerType]);

  return (
    <div className={styles.aspectRatio}>
      <CoverOverlay node={node} hidden={coverHidden} />
      {playerType === 'default-player' ? (
        <iframe
          ref={iframeRef}
          id="contentPlayer"
          title={node.name}
          className={styles.playerFrame}
          name="contentPlayer"
          allowFullScreen
        />
      ) : (
        <div ref={webComponentRef} className={styles.playerFrame} />
      )}
    </div>
  );
}

// ── QuML player ───────────────────────────────────────────────────────────────
function QumlPlayer({ node, editorMode }: { node: INode; editorMode: EditorMode }) {
  const editorConfig = useEditorStore((s) => s.editorConfig);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = editorConfig?.context;
    const qumlConfig = {
      context: {
        mode: editorMode === 'edit' ? 'edit' : 'play',
        pdata: { id: ctx?.pdata?.id ?? 'sunbird.portal', ver: '1.0', pid: 'sunbird-portal' },
        contentId: node.identifier,
        sid: ctx?.sid ?? '',
        uid: ctx?.uid ?? '',
        channel: ctx?.channel ?? '',
        did: ctx?.did ?? '',
      },
      config: { enable: false, showShare: false, showDownload: false, showReplay: true, showExit: false },
      metadata: node.metadata ?? {},
      data: {},
    };

    const el = document.createElement('sunbird-quml-player') as any;
    el.setAttribute('player-config', JSON.stringify(qumlConfig));
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(el);
  }, [node.identifier, editorMode]);

  return (
    <div className={styles.qumlRoot}>
      <div ref={containerRef} className={styles.playerWrapper} />
    </div>
  );
}
