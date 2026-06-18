declare module 'react-to-webcomponent' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function reactToWebComponent(
    component: any,
    React: any,
    ReactDOM: any,
    options?: {
      props?: Record<string, string>;
      shadow?: 'open' | 'closed';
    }
  ): CustomElementConstructor;
  export default reactToWebComponent;
}
