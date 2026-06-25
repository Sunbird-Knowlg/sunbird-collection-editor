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
  const ctx = state.editorConfig?.context;

  config.headers = config.headers ?? {};

  if (ctx?.authToken) {
    config.headers['Authorization'] = `Bearer ${ctx.authToken}`;
  }

  // Portal proxy routes (/api/*) require the user session token in addition
  // to the Bearer auth token. The dialcode validate and link APIs use /api/*.
  if (ctx?.userToken) {
    config.headers['X-Authenticated-User-Token'] = ctx.userToken;
  }

  // Sunbird user/content APIs scope results to the tenant via X-Channel-Id.
  // Omitting it causes user-search to return cross-tenant results or nothing.
  if (ctx?.channel) {
    config.headers['X-Channel-Id'] = ctx.channel;
  }

  if (baseUrl) {
    config.baseURL = baseUrl;
  }

  return config;
});

export default apiClient;
