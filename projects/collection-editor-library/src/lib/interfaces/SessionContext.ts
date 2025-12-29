export interface SessionContextBase {
  topic?: any;
  author?: string;
  channel?: string;
  framework?: string;
  copyright?: string;
  license?: string;
  attributions?: any;
  audience?: any;
}

export interface SessionContext extends SessionContextBase {
  [key: string]: any;
}