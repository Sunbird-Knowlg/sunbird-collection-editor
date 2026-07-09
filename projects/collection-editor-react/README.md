# @project-sunbird/collection-editor-react

A React component library for the Sunbird Collection Editor — build, organise and manage hierarchical content collections (courses, textbooks, playlists) inside any React 18 application or as a framework-agnostic web component.

---

## Installation

```bash
npm install @project-sunbird/collection-editor-react
```

**Peer dependencies** (install separately if not already present):

```bash
npm install react@^18 react-dom@^18
```

---

## Quick start — React

```tsx
import { CollectionEditor } from '@project-sunbird/collection-editor-react';
import '@project-sunbird/collection-editor-react/dist/style.css';

const config = {
  context: {
    authToken: 'your-bearer-token', // omit when using a server-side proxy
    userId: 'user-id',
    sid: 'session-id',
    did: 'device-id',
    channel: 'channel-id',
    pdata: { id: 'your.app.id', ver: '1.0' },
    env: 'collection_editor',
    identifier: 'do_123456789',   // content identifier to load
    contentId: 'do_123456789',
  },
  config: {
    mode: 'edit',                 // 'edit' | 'review' | 'read' | 'sourcingreview'
    objectType: 'Collection',
    primaryCategory: 'Content Playlist',
    maxDepth: 4,
  },
};

export default function App() {
  return (
    <CollectionEditor
      {...config}
      onToolbarEvent={({ action, data }) => {
        if (action === 'back') window.history.back();
      }}
    />
  );
}
```

---

## Quick start — Web component (framework-agnostic)

Register once (e.g. in your app entry point), then use the custom element anywhere:

```ts
import { registerCollectionEditor } from '@project-sunbird/collection-editor-react';
import '@project-sunbird/collection-editor-react/dist/style.css';

registerCollectionEditor(); // registers <sb-collection-editor>
```

```html
<sb-collection-editor id="editor"></sb-collection-editor>

<script>
  const el = document.getElementById('editor');
  el.config = JSON.stringify({
    context: { /* ... */ },
    config: { mode: 'edit', objectType: 'Collection' },
  });
  el.onToolbarEvent = (e) => console.log('toolbar:', e.detail);
</script>
```

You can pass a custom tag name to avoid collisions:

```ts
registerCollectionEditor('my-collection-editor');
```

---

## API

### `<CollectionEditor>` props

| Prop | Type | Required | Description |
|---|---|---|---|
| `context` | `IContext` | ✅ | Runtime context — user, session, channel, framework |
| `config` | `IConfig` | ✅ | Editor behaviour — mode, objectType, depth, category |
| `metadata` | `Record<string, unknown>` | — | Pre-loaded content metadata |
| `apiBaseUrl` | `string` | — | Base URL for all API calls. Omit when using a server-side proxy |
| `onToolbarEvent` | `(e: { action: ToolbarAction; data?: unknown }) => void` | — | Fired on every toolbar button click |
| `onContentAdded` | `(item: unknown, targetNodeId: string) => void` | — | Fired when content is added from library |
| `onHierarchySaved` | `(hierarchy: unknown) => void` | — | Fired after a successful hierarchy save |
| `onError` | `(error: Error) => void` | — | Fired on unrecoverable editor errors |

### `IContext`

```ts
interface IContext {
  authToken: string;          // Bearer token; use '' when auth is cookie-based
  userId: string;
  sid: string;                // Session ID
  did: string;                // Device ID
  channel: string;            // Org channel / hashTagId
  pdata: { id: string; ver: string; pid?: string }; // Producer data (telemetry)
  env: string;                // e.g. 'collection_editor'
  contentId?: string;         // Identifier of the collection to load
  identifier?: string;        // Alias for contentId
  framework?: string;         // Org framework ID
  targetFWIds?: string[];     // Target framework IDs
  uid?: string;
  rollup?: Record<string, string>;
  tags?: string[];
}
```

### `IConfig`

```ts
interface IConfig {
  mode: 'edit' | 'review' | 'read' | 'sourcingreview';
  objectType: string;          // e.g. 'Collection'
  primaryCategory?: string;    // e.g. 'Content Playlist', 'Course'
  framework?: string[];
  targetFWIds?: string[];
  maxDepth?: number;           // Max folder nesting depth (default: 4)
  allowContentUnderRoot?: boolean;
  hierarchy?: Record<string, unknown>;
  defaultFields?: Record<string, unknown>;
}
```

### `ToolbarAction`

```ts
type ToolbarAction =
  | 'back' | 'preview' | 'saveCollection' | 'publish'
  | 'sendForReview' | 'reject' | 'sendBackForCorrections'
  | 'sourcingApprove' | 'sourcingReject'
  | 'addUnit' | 'addSubUnit'
  | 'manageCollaborators' | 'csvUpload'
  | 'onFormValueChange' | 'onFormStatusChange';
```

---

## API base URL

By default all API calls are made relative to the page origin (works with a server-side proxy). To point directly at a backend:

```ts
import { setApiBaseUrl } from '@project-sunbird/collection-editor-react';

setApiBaseUrl('https://api.your-sunbird-instance.com');
```

Or pass it inline — the editor calls `setApiBaseUrl` automatically on mount:

```tsx
<CollectionEditor
  {...config}
  apiBaseUrl="https://api.your-sunbird-instance.com"
/>
```

---

## Stores (advanced)

The editor exposes its internal Zustand stores for advanced integration scenarios — for example, reading the current tree selection from outside the component:

```ts
import { useEditorStore, useTreeStore, useLibraryStore } from '@project-sunbird/collection-editor-react';

// Inside a React component
const selectedNodeId = useTreeStore((s) => s.selectedNodeId);
const editorMode    = useEditorStore((s) => s.editorMode);
```

---

## Styles

The stylesheet **must** be imported once in your app — it is not auto-injected:

```ts
import '@project-sunbird/collection-editor-react/dist/style.css';
```

---

## Development setup

```bash
# Clone the monorepo
git clone https://github.com/Sunbird-Ed/sunbird-collection-editor.git
cd sunbird-collection-editor/projects/collection-editor-react

# Install
npm install

# Dev server (proxies /action and /api to localhost:3000)
npm run dev

# Build library
npm run build

# Run tests
npm test
```

---

## Compatibility

| Dependency | Version |
|---|---|
| React | 18.x |
| React DOM | 18.x |
| Node | 18+ |

---

## License

MIT — see the repository root for the full licence text.
