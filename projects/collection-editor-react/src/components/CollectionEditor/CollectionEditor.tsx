import React, { Component } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import type { IEditorConfig, IEditorEvents } from '../../types/editor';
import { SplitBuilderShell } from '../SplitBuilderShell';
import { useEditorInit } from '../../hooks/useEditorInit';
import { useEditorStore } from '../../store/editor.store';
import '../../styles/global.scss';
import styles from './CollectionEditor.module.scss';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

// ---------------------------------------------------------------------------
// Error boundary (class component required by React error boundary API)
// ---------------------------------------------------------------------------
interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (e: Error) => void;
}
interface ErrorBoundaryState {
  error: Error | null;
}

class EditorErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error): void {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className={styles.errorState}>
          <h3>Something went wrong</h3>
          <p>{this.state.error.message}</p>
          <button onClick={() => this.setState({ error: null })}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Inner component — uses hooks (must live inside QueryClientProvider)
// ---------------------------------------------------------------------------
interface CollectionEditorInnerProps extends IEditorConfig, IEditorEvents {}

function CollectionEditorInner(props: CollectionEditorInnerProps) {
  const { isLoading, error } = useEditorInit({
    config: props as IEditorConfig,
    onError: props.onError,
  });
  const editorMode = useEditorStore((s) => s.editorMode);

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner} />
        <p>Loading editor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <h3>Failed to load editor</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className={`sb-split-builder ${styles.root}`}>
      <SplitBuilderShell
        editorMode={editorMode}
        onToolbarEvent={props.onToolbarEvent}
        onContentAdded={props.onContentAdded}
        onHierarchySaved={props.onHierarchySaved}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public API component
// ---------------------------------------------------------------------------
export type CollectionEditorProps = IEditorConfig & IEditorEvents;

export const CollectionEditor: React.FC<CollectionEditorProps> = (props) => {
  return (
    <EditorErrorBoundary onError={props.onError}>
      <QueryClientProvider client={queryClient}>
        <CollectionEditorInner {...props} />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </QueryClientProvider>
    </EditorErrorBoundary>
  );
};
