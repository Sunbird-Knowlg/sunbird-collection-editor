export type EditorMode = 'edit' | 'review' | 'read' | 'sourcingreview';

export type ToolbarAction =
  | 'back'
  | 'preview'
  | 'sendForReview'
  | 'onFormValueChange'
  | 'onFormStatusChange'
  | 'addUnit'
  | 'addSubUnit'
  | 'saveCollection'
  | 'publish'
  | 'reject'
  | 'sourcingApprove'
  | 'sourcingReject'
  | 'manageCollaborators'
  | 'csvUpload';

export interface IUser {
  id: string;
  fullName: string;
  orgIds: string[];
}

export interface IContext {
  authToken: string;
  userToken?: string;
  userId: string;
  sid: string;
  did: string;
  uid?: string;
  channel: string;
  pdata: { id: string; ver: string; pid?: string };
  env: string;
  /** Current user profile — user.fullName auto-fills the author field.
   *  When absent, the editor resolves it via /portal/user/v5/read. */
  user?: { fullName?: string };
  contentId?: string;
  identifier?: string;
  framework?: string;
  targetFWIds?: string[];
  rollup?: Record<string, string>;
  tags?: string[];
  cloudStorage?: {
    provider?: string;
    presigned_headers?: Record<string, string>;
  };
}

export interface IConfig {
  mode: EditorMode;
  objectType: string;
  primaryCategory?: string;
  framework?: string[];
  targetFWIds?: string[];
  toolbarConfig?: Record<string, unknown>;
  hierarchy?: Record<string, unknown>;
  children?: unknown[];
  defaultFields?: Record<string, unknown>;
  maxDepth?: number;
  allowContentUnderRoot?: boolean;
  /** URL for the iframe-based content preview player. Defaults to the bundled preview.html path. */
  previewCdnUrl?: string;
  /**
   * API version for object/category/definition endpoint.
   * Defaults to 'v1' (works on both sandbox and test environments).
   * Set to 'v4' only if your backend specifically requires it.
   */
  categoryDefinitionApiVersion?: 'v1' | 'v4';
  /**
   * Asset upload constraints for the app icon picker.
   * Defaults: size = 1 MB, accepted = 'image/png,image/jpeg'.
   * SVG is intentionally excluded to prevent active-content / XSS vectors.
   */
  assetConfig?: {
    size?: number;
    accepted?: string;
  };
}

export interface IEditorConfig {
  context: IContext;
  config: IConfig;
  metadata?: Record<string, unknown>;
  data?: unknown;
  enableSplitBuilder?: boolean;
  /** Base URL for all API calls (e.g. "https://your-domain.com"). Omit when using a proxy. */
  apiBaseUrl?: string;
}

export interface IEditorEvents {
  onToolbarEvent?: (event: { action: ToolbarAction; data?: unknown }) => void;
  onContentAdded?: (item: unknown, targetNodeId: string) => void;
  onHierarchySaved?: (hierarchy: unknown) => void;
  onError?: (error: Error) => void;
}

export interface INode {
  id: string;
  identifier: string;
  name: string;
  title?: string;
  description?: string;
  primaryCategory?: string;
  mimeType?: string;
  objectType?: string;
  contentType?: string;
  visibility?: string;
  status?: string;
  appIcon?: string;
  isFolder?: boolean;
  children?: INode[];
  metadata?: Record<string, unknown>;
  parent?: string;
  index?: number;
}

export interface IButtonLoaders {
  saveCollection: boolean;
  publishCollection: boolean;
  addFromLibrary: boolean;
  rejectCollection: boolean;
  sourcingApproveCollection: boolean;
  sourcingRejectCollection: boolean;
}

