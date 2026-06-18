import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

let baseUrl = '';

export function setApiBaseUrl(url: string): void {
  baseUrl = url;
}

export const apiClient = axios.create({
  timeout: 30000,
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // Lazy import to avoid circular dependency
  const { useEditorStore } = await import('../store/editor.store');
  const state = useEditorStore.getState();
  const authToken = state.editorConfig?.context?.authToken;

  if (authToken) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (baseUrl) {
    config.baseURL = baseUrl;
  }

  return config;
});

export default apiClient;
