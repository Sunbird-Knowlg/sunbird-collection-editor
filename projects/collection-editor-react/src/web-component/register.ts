import reactToWebComponent from 'react-to-webcomponent';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { CollectionEditor } from '../components/CollectionEditor';

function injectGlobalStyles(): void {
  if (document.getElementById('sb-ce-react-styles')) return;
  const style = document.createElement('style');
  style.id = 'sb-ce-react-styles';
  // Inject the Google Fonts import for Plus Jakarta Sans
  style.textContent = "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');";
  document.head.insertBefore(style, document.head.firstChild);
}

export function registerCollectionEditor(tagName = 'sb-collection-editor'): void {
  injectGlobalStyles();
  if (typeof customElements === 'undefined') return;
  if (customElements.get(tagName)) return;

  const WebComponent = reactToWebComponent(
    CollectionEditor as Parameters<typeof reactToWebComponent>[0],
    React,
    ReactDOM as Parameters<typeof reactToWebComponent>[2],
    {
      props: {
        config: 'json',
        onToolbarEvent: 'function',
        onContentAdded: 'function',
        onHierarchySaved: 'function',
        onError: 'function',
      },
    }
  );

  customElements.define(tagName, WebComponent);
}
