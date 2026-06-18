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
  | 'sendBackForCorrections'
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
  userId: string;
  sid: string;
  did: string;
  uid?: string;
  channel: string;
  pdata: { id: string; ver: string; pid?: string };
  env: string;
  contentId?: string;
  identifier?: string;
  framework?: string;
  targetFWIds?: string[];
  rollup?: Record<string, string>;
  tags?: string[];
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
}

export interface IEditorConfig {
  context: IContext;
  config: IConfig;
  metadata?: Record<string, unknown>;
  data?: unknown;
  enableSplitBuilder?: boolean;
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
  sendBackCollection: boolean;
  sourcingApproveCollection: boolean;
  sourcingRejectCollection: boolean;
}

