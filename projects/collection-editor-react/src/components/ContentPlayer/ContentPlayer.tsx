import React, { useEffect, useRef, useState } from 'react';
import { User, Scale, Globe, School, BookOpen, Tag, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { INode, EditorMode } from '../../types/editor';
import { useEditorStore } from '../../store/editor.store';
import { useTreeStore } from '../../store/tree.store';
import { fetchContentDetails } from '../../api/content';
import { useQumlContent, buildSingleQuestionHierarchy } from '../../hooks/useQumlContent';
import { qumlPlayerService, QumlPlayerService } from '../../services/quml/QumlPlayerService';
import { useLabels } from '../../hooks/useLabels';
import styles from './ContentPlayer.module.scss';

const QUESTIONSET_MIME = 'application/vnd.sunbird.questionset';

/**
 * Walks the tree from a question node up to the nearest ancestor QuestionSet —
 * the base hierarchy for a single-question preview. The QuestionSet may be the
 * editor root or a leaf inside a Collection, so we resolve it from the tree
 * rather than the editor context.
 */
function findAncestorQuestionSetId(nodes: INode[], nodeId: string): string | null {
  const byId = new Map<string, INode>();
  const index = (list: INode[]) => {
    for (const n of list) {
      byId.set(n.id, n);
      if (n.children) index(n.children);
    }
  };
  index(nodes);

  let current = byId.get(nodeId);
  while (current) {
    if (current.mimeType === QUESTIONSET_MIME) return current.identifier;
    current = current.parent ? byId.get(current.parent) : undefined;
  }
  return null;
}

// ── MIME-type classification ──────────────────────────────────────────────────
const MIME_GROUPS: Array<{ key: string; mimes: string[] }> = [
  { key: 'video',  mimes: ['video/mp4','video/webm','video/ogg'] },
  { key: 'audio',  mimes: ['audio/mp3','audio/mpeg','audio/ogg','audio/wav'] },
  { key: 'pdf',    mimes: ['application/pdf'] },
  { key: 'epub',   mimes: ['application/epub'] },
  { key: 'ecml',   mimes: ['application/vnd.ekstep.ecml-archive'] },
  { key: 'h5p',    mimes: ['application/vnd.ekstep.h5p-archive'] },
  { key: 'scorm',  mimes: ['application/vnd.ekstep.content-collection'] },
];

function getMimeGroup(mimeType: string) {
  return MIME_GROUPS.find(g => g.mimes.includes(mimeType)) ?? { key: 'other' };
}

// Maps a MIME group key to its translated display label. Kept separate from
// MIME_GROUPS (a module-level constant) since label lookup needs the current
// LabelConfig from useLabels(), which is only available inside components.
function getMimeGroupLabel(key: string, lbl: ReturnType<typeof useLabels>): string {
  switch (key) {
    case 'video': return lbl.contentPlayer.mimeLabelVideo;
    case 'audio': return lbl.contentPlayer.mimeLabelAudio;
    case 'pdf': return lbl.contentPlayer.mimeLabelPdf;
    case 'epub': return lbl.contentPlayer.mimeLabelEpub;
    case 'ecml': return lbl.contentPlayer.mimeLabelEcml;
    case 'h5p': return lbl.contentPlayer.mimeLabelH5p;
    case 'scorm': return lbl.contentPlayer.mimeLabelScorm;
    default: return lbl.contentPlayer.mimeLabelOther;
  }
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
// fullMetadata: merged object — search-result fields overwritten by full content read
function buildPlayerConfig(
  node: INode,
  fullMetadata: Record<string, unknown>,
  editorConfig: ReturnType<typeof useEditorStore.getState>['editorConfig'],
) {
  const ctx = editorConfig?.context;
  const mimeType = (fullMetadata.mimeType as string) ?? node.mimeType ?? '';

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
    },
    // Full content data — includes artifactUrl, streamingUrl, body, etc.
    metadata: fullMetadata,
    data: mimeType === 'application/vnd.ekstep.ecml-archive'
      ? (fullMetadata.body ?? {})
      : {},
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

async function waitForCustomElement(tag: string, playerType: string, maxAttempts = 100): Promise<void> {
  await loadScript(PLAYER_SCRIPTS[playerType] ?? '');
  if (customElements.get(tag)) return;
  await new Promise<void>((resolve, reject) => {
    let attempts = 0;
    const id = setInterval(() => {
      attempts++;
      if (customElements.get(tag)) {
        clearInterval(id);
        resolve();
      } else if (attempts >= maxAttempts) {
        clearInterval(id);
        reject(new Error(`Custom element <${tag}> did not register`));
      }
    }, 100);
  });
}

// ── Info strip ────────────────────────────────────────────────────────────────
const INFO_FIELDS: Array<{ key: string; icon: LucideIcon }> = [
  { key: 'author',      icon: User },
  { key: 'license',     icon: Scale },
  { key: 'language',    icon: Globe },
  { key: 'gradeLevel',  icon: School },
  { key: 'subject',     icon: BookOpen },
  { key: 'contentType', icon: Tag },
];

// Maps an info field key to its translated display label — see getMimeGroupLabel
// for why this can't just live on the INFO_FIELDS constant itself.
function getInfoFieldLabel(key: string, lbl: ReturnType<typeof useLabels>): string {
  switch (key) {
    case 'author': return lbl.contentPlayer.infoFieldAuthor;
    case 'license': return lbl.contentPlayer.infoFieldLicense;
    case 'language': return lbl.contentPlayer.infoFieldLanguage;
    case 'gradeLevel': return lbl.contentPlayer.infoFieldClass;
    case 'subject': return lbl.contentPlayer.infoFieldSubject;
    case 'contentType': return lbl.contentPlayer.infoFieldType;
    default: return key;
  }
}

function InfoStrip({ node }: { node: INode }) {
  const lbl = useLabels();
  const meta = (node.metadata ?? {}) as Record<string, unknown>;
  const chips = INFO_FIELDS.flatMap(f => {
    const raw = meta[f.key];
    if (!raw) return [];
    const val = Array.isArray(raw) ? raw.join(', ') : String(raw);
    if (!val) return [];
    return [{ ...f, label: getInfoFieldLabel(f.key, lbl), val }];
  });
  if (!chips.length) return null;

  return (
    <div className={styles.infoStrip}>
      {chips.map(c => (
        <div key={c.key} className={styles.infoChip}>
          {c.icon && <c.icon size={13} className={styles.infoChipIcon} />}
          <span className={styles.infoChipLabel}>{c.label}</span>
          {c.val}
        </div>
      ))}
    </div>
  );
}

// ── Cover overlay ─────────────────────────────────────────────────────────────
function CoverOverlay({ node, hidden }: { node: INode; hidden: boolean }) {
  const lbl = useLabels();
  const thumb = node.appIcon ?? (node.metadata?.appIcon as string | undefined);
  return (
    <div className={`${styles.coverOverlay} ${hidden ? styles.coverHidden : ''}`}>
      {thumb ? (
        <>
          <img src={thumb} alt={node.name} className={styles.coverThumb} />
          <div className={styles.coverPlayRing}>
            <div className={styles.coverPlayIcon} />
          </div>
          <span className={styles.coverLabel}>{lbl.contentPlayer.loadingPreview}</span>
        </>
      ) : (
        <div className={styles.coverSkeleton} />
      )}
    </div>
  );
}

// ── Player error overlay ──────────────────────────────────────────────────────
function PlayerError({ message }: { message: string }) {
  return (
    <div className={styles.playerError}>
      <AlertTriangle size={28} className={styles.playerErrorIcon} />
      <span className={styles.playerErrorMsg}>{message}</span>
    </div>
  );
}

// ── Type badge ────────────────────────────────────────────────────────────────
function TypeBadge({ mimeType }: { mimeType: string }) {
  const lbl = useLabels();
  const group = getMimeGroup(mimeType);
  return (
    <span className={styles.typeBadge} data-type={group.key}>
      <span className={styles.typeDot} />
      {getMimeGroupLabel(group.key, lbl)}
    </span>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface ContentPlayerProps {
  node: INode;
  editorMode: EditorMode;
  type: 'content' | 'quml';
  /** For type='quml': render a single question rather than the whole set. */
  singleQuestion?: boolean;
  /**
   * 'fill' (default): player flex-fills its container (library preview modal).
   * 'flow': player keeps an intrinsic 16:9 height so it can sit in a
   * scrollable column with the info strip and edit form below (leaf content).
   */
  layout?: 'fill' | 'flow';
}

// ── Root ──────────────────────────────────────────────────────────────────────
export const ContentPlayer: React.FC<ContentPlayerProps> = ({ node, editorMode, type, singleQuestion, layout = 'fill' }) => {
  if (type === 'quml') return <QumlPlayer node={node} editorMode={editorMode} singleQuestion={!!singleQuestion} />;

  const thumb = node.appIcon ?? (node.metadata?.appIcon as string | undefined);

  return (
    <div className={`${styles.contentPlayerRoot} ${layout === 'flow' ? styles.flowLayout : ''}`}>
      <div className={styles.stage}>
        <div className={styles.playerHeader}>
          {thumb && <img src={thumb} alt="" className={styles.playerHeaderThumb} />}
          <span className={styles.playerHeaderTitle}>{node.name}</span>
          <TypeBadge mimeType={node.mimeType ?? ''} />
        </div>
        <SunbirdContentPlayer node={node} />
      </div>
      <InfoStrip node={node} />
    </div>
  );
};

// ── Sunbird content player ────────────────────────────────────────────────────
function SunbirdContentPlayer({ node }: { node: INode }) {
  const lbl = useLabels();
  const editorConfig = useEditorStore((s) => s.editorConfig);
  const [playerType, setPlayerType] = useState(() => resolvePlayerType(node.mimeType ?? ''));
  const [coverHidden, setCoverHidden] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [fullMetadata, setFullMetadata] = useState<Record<string, unknown>>(
    (node.metadata ?? {}) as Record<string, unknown>,
  );
  // Gate: don't start the player until the full content fetch has resolved,
  // so playerConfig.metadata always contains artifactUrl when initializePreview is called.
  const [contentReady, setContentReady] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const webComponentRef = useRef<HTMLDivElement>(null);

  const previewUrl = editorConfig?.config?.previewCdnUrl ?? DEFAULT_PLAYER_URL;

  // Fetch full content details — provides artifactUrl, streamingUrl, body, etc.
  useEffect(() => {
    let cancelled = false;
    setContentReady(false);
    setCoverHidden(false);
    setPlayerError(null);
    setFullMetadata((node.metadata ?? {}) as Record<string, unknown>);
    setPlayerType(resolvePlayerType(node.mimeType ?? ''));

    fetchContentDetails(node.identifier)
      .then((content) => {
        if (cancelled) return;
        const merged = { ...(node.metadata ?? {}), ...content } as Record<string, unknown>;
        setFullMetadata(merged);
        const mime = (content.mimeType as string) ?? node.mimeType ?? '';
        setPlayerType(resolvePlayerType(mime));
        setContentReady(true);
      })
      .catch(() => {
        // Proceed with whatever sparse metadata we have
        if (!cancelled) setContentReady(true);
      });

    return () => { cancelled = true; };
  }, [node.identifier]);

  // Build playerConfig after fullMetadata is populated — this runs on every render
  // so by the time contentReady=true the config already has artifactUrl
  const playerConfig = buildPlayerConfig(node, fullMetadata, editorConfig);

  // Default player — iframe. Only runs after contentReady so playerConfig has full metadata.
  useEffect(() => {
    if (!contentReady || playerType !== 'default-player') return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    iframe.src = previewUrl;

    const handleLoad = () => {
      try {
        const win = iframe.contentWindow as Record<string, unknown> | null;
        if (typeof win?.['initializePreview'] !== 'function') {
          setPlayerError(lbl.contentPlayer.previewPlayerUnavailable);
          return;
        }
        // playerConfig is captured here — contentReady gate ensures fullMetadata is set
        (win['initializePreview'] as (cfg: unknown) => void)(playerConfig);
        setTimeout(() => setCoverHidden(true), 300);
      } catch (err) {
        console.error('[ContentPlayer] initializePreview failed', err);
        setPlayerError(lbl.contentPlayer.failedToInitializePlayer);
      }
    };

    const handleError = () => setPlayerError(lbl.contentPlayer.previewPlayerLoadFailed);

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);
    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
      iframe.src = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.identifier, playerType, previewUrl, contentReady, lbl]);

  // Web-component players (pdf / video / epub)
  useEffect(() => {
    if (!contentReady || playerType === 'default-player') return;
    const container = webComponentRef.current;
    if (!container) return;
    const tag = PLAYER_TAGS[playerType];
    if (!tag) return;

    // Snapshot playerConfig at effect-run time — contentReady gate ensures fullMetadata is set
    const config = playerConfig;

    waitForCustomElement(tag, playerType)
      .then(() => {
        if (!webComponentRef.current) return;
        if (!customElements.get(tag)) {
          setPlayerType('default-player');
          return;
        }
        const el = document.createElement(tag) as HTMLElement & Record<string, unknown>;
        el.setAttribute('player-config', JSON.stringify(config));
        el.addEventListener('playerEvent', () => {});
        el.addEventListener('telemetryEvent', () => {});
        container.innerHTML = '';
        container.appendChild(el);
        setTimeout(() => {
          try { el['playerConfig'] = config; } catch { /* attribute-only */ }
          setCoverHidden(true);
        }, 200);
      })
      .catch(() => {
        console.warn(`[ContentPlayer] ${playerType} script unavailable, falling back to iframe`);
        setPlayerType('default-player');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.identifier, playerType, contentReady]);

  return (
    <div className={styles.aspectRatio}>
      {playerError ? (
        <PlayerError message={playerError} />
      ) : (
        <CoverOverlay node={node} hidden={coverHidden} />
      )}

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
// Renders through the <sunbird-quml-player> web component. Two modes:
//  • whole set   — fetch the questionset hierarchy (questions inlined) for the node.
//  • single question — fetch the ancestor questionset, then expose only the one
//    selected question (mirrors Angular's isSingleQuestionPreview).
function QumlPlayer({
  node,
  editorMode,
  singleQuestion,
}: {
  node: INode;
  editorMode: EditorMode;
  singleQuestion: boolean;
}) {
  const lbl = useLabels();
  const editorConfig = useEditorStore((s) => s.editorConfig);
  const treeData = useTreeStore((s) => s.treeData);
  const containerRef = useRef<HTMLDivElement>(null);

  // Base questionset id: the node itself for a set, or its nearest ancestor
  // questionset when previewing a single question.
  const baseQuestionSetId = singleQuestion
    ? findAncestorQuestionSetId(treeData, node.id)
    : node.identifier;

  const { data: baseHierarchy, isLoading, error } = useQumlContent(
    baseQuestionSetId ?? '',
    { enabled: !!baseQuestionSetId },
  );

  // For single-question mode, derive a one-question hierarchy from the set.
  const metadata = React.useMemo(() => {
    if (!baseHierarchy) return null;
    if (!singleQuestion) return baseHierarchy;
    return buildSingleQuestionHierarchy(baseHierarchy, node.identifier);
  }, [baseHierarchy, singleQuestion, node.identifier]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !metadata) return;

    let el: HTMLElement | null = null;
    let cancelled = false;

    (async () => {
      try {
        // Single-question preview needs no player flags: metadata is already a
        // one-question hierarchy, so the derived inline section has one entry.
        const config = await qumlPlayerService.createConfig(
          metadata,
          editorConfig?.context,
          { mode: editorMode === 'edit' ? 'edit' : 'play' },
        );
        if (cancelled || !containerRef.current) return;
        const element = qumlPlayerService.createElement(config);
        el = element;
        qumlPlayerService.attachEventListeners(
          element,
          (e: CustomEvent) => console.debug('[QumlPlayer] playerEvent', e.detail),
          (detail: unknown) => console.debug('[QumlPlayer] telemetryEvent', detail),
        );
        container.innerHTML = '';
        container.appendChild(element);
      } catch (err) {
        console.error('[QumlPlayer] failed to initialize', err);
      }
    })();

    return () => {
      cancelled = true;
      if (el) {
        qumlPlayerService.removeEventListeners(el);
        el.remove();
      }
      QumlPlayerService.unloadStyles();
    };
  }, [metadata, editorConfig, editorMode, singleQuestion]);

  const errorMessage = error
    ? `${lbl.contentPlayer.unableToLoadQuestionset} ${error.message}`
    : singleQuestion && !baseQuestionSetId
      ? lbl.contentPlayer.parentQuestionsetNotResolved
      : singleQuestion && baseHierarchy && !metadata
        ? lbl.contentPlayer.questionNotFoundInQuestionset
        : null;

  return (
    <div className={styles.qumlRoot}>
      {errorMessage ? (
        <PlayerError message={errorMessage} />
      ) : isLoading || !metadata ? (
        <CoverOverlay node={node} hidden={false} />
      ) : null}
      <div ref={containerRef} className={styles.playerWrapper} />
    </div>
  );
}
