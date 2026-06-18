import React, { useEffect, useRef, useState } from 'react';
import type { INode, EditorMode } from '../../types/editor';
import { useEditorStore } from '../../store/editor.store';
import styles from './ContentPlayer.module.scss';

// ── MIME-type → player type mapping (mirrors player.config.json) ─────────────
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

// ── Build playerConfig the same way as Angular's PlayerService ───────────────
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
      pdata: {
        id: ctx?.pdata?.id ?? 'sunbird.portal',
        ver: 1.0,
        pid: 'sunbird-portal',
      },
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
    // For ECML content include body; otherwise empty object
    data: mimeType === 'application/vnd.ekstep.ecml-archive'
      ? (metadata.body ?? {})
      : {},
  };
}

// ── Script loader (idempotent) ───────────────────────────────────────────────
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
    () =>
      new Promise((resolve) => {
        if (customElements.get(tag)) { resolve(); return; }
        let attempts = 0;
        const id = setInterval(() => {
          attempts++;
          if (customElements.get(tag) || attempts >= maxAttempts) {
            clearInterval(id);
            resolve();
          }
        }, 100);
      }),
  );
}

// ── Props ────────────────────────────────────────────────────────────────────
interface ContentPlayerProps {
  node: INode;
  editorMode: EditorMode;
  type: 'content' | 'quml';
}

// ── Metadata labels (mirrors label.config.json lbl section) ─────────────────
const META_LABELS: Record<string, string> = {
  name:         'Name',
  author:       'Author',
  license:      'License',
  copyright:    'Copyright',
  attributions: 'Attributions',
  audience:     'Audience',
  board:        'Board',
  medium:       'Medium',
  gradeLevel:   'Class',
  subject:      'Subject',
  topic:        'Topic',
  contentType:  'Content Type',
  language:     'Language',
};

// Fields shown below the player (same order as Angular's sessionContext)
const META_FIELDS = [
  'name', 'author', 'license', 'copyright',
  'board', 'medium', 'gradeLevel', 'subject',
  'topic', 'audience', 'attributions', 'contentType', 'language',
];

interface MetaField { key: string; label: string; value: string }

function buildMetaFields(node: INode): MetaField[] {
  const meta = (node.metadata ?? {}) as Record<string, unknown>;
  const fields: MetaField[] = [];

  for (const key of META_FIELDS) {
    const raw = meta[key] ?? (node as unknown as Record<string, unknown>)[key];
    if (raw === undefined || raw === null || raw === '') continue;
    const value = Array.isArray(raw) ? raw.join(', ') : String(raw);
    if (!value) continue;
    fields.push({ key, label: META_LABELS[key] ?? key, value });
  }
  return fields;
}

// ── Content metadata strip (mirrors Angular's contentInfoArray grid) ──────────
function ContentMetaInfo({ node }: { node: INode }) {
  const fields = buildMetaFields(node);
  if (!fields.length) return null;

  // Column width cycle: wide → medium → narrow (mirrors Angular's 6/4/2 column pattern)
  const colStyles = [styles.metaColWide, styles.metaColMed, styles.metaColNarrow];

  return (
    <div className={styles.metaGrid}>
      {fields.map((f, i) => (
        <div key={f.key} className={colStyles[i % colStyles.length]}>
          <div className={styles.metaField}>
            <span className={styles.metaLabel}>{f.label}</span>
            <span className={styles.metaValue}>{f.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Root component ───────────────────────────────────────────────────────────
export const ContentPlayer: React.FC<ContentPlayerProps> = ({ node, editorMode, type }) => {
  if (type === 'quml') return <QumlPlayer node={node} editorMode={editorMode} />;
  return (
    <div className={styles.contentPlayerRoot}>
      <SunbirdContentPlayer node={node} />
      <ContentMetaInfo node={node} />
    </div>
  );
};

// ── Sunbird content player (mirrors ContentplayerPageComponent) ───────────────
function SunbirdContentPlayer({ node }: { node: INode }) {
  const editorConfig = useEditorStore((s) => s.editorConfig);
  const [playerType, setPlayerType] = useState<string>(() => resolvePlayerType(node.mimeType ?? ''));
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const webComponentRef = useRef<HTMLDivElement>(null);

  const playerConfig = buildPlayerConfig(node, { editorConfig } as any);

  // ── When content changes, re-resolve player type ─────────────────────────
  useEffect(() => {
    setPlayerType(resolvePlayerType(node.mimeType ?? ''));
  }, [node.identifier, node.mimeType]);

  // ── Default player — iframe + initializePreview() ────────────────────────
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
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.identifier, playerType]);

  // ── Web component players (pdf / video / epub) ────────────────────────────
  useEffect(() => {
    if (playerType === 'default-player') return;
    const container = webComponentRef.current;
    if (!container) return;

    const tag = PLAYER_TAGS[playerType];
    if (!tag) return;

    waitForCustomElement(tag, playerType).then(() => {
      if (!webComponentRef.current) return; // unmounted

      if (!customElements.get(tag)) {
        // Web component script unavailable — fall back to default player
        setPlayerType('default-player');
        return;
      }

      const el = document.createElement(tag) as any;
      el.setAttribute('player-config', JSON.stringify(playerConfig));
      el.addEventListener('playerEvent', () => {});
      el.addEventListener('telemetryEvent', () => {});

      container.innerHTML = '';
      container.appendChild(el);

      // Give web component a tick to upgrade, then push config via property
      setTimeout(() => {
        try {
          el.playerConfig = playerConfig;
        } catch {
          // some players only use the attribute
        }
      }, 200);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.identifier, playerType]);

  return (
    <div className={styles.aspectRatio}>
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

// ── QuML player (web component) ───────────────────────────────────────────────
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
      config: {
        enable: false,
        showShare: false,
        showDownload: false,
        showReplay: true,
        showExit: false,
      },
      metadata: node.metadata ?? {},
      data: {},
    };

    const el = document.createElement('sunbird-quml-player') as any;
    el.setAttribute('player-config', JSON.stringify(qumlConfig));
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(el);
  }, [node.identifier, editorMode]);

  return <div ref={containerRef} className={styles.playerWrapper} />;
}
