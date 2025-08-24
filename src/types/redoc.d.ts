declare global {
  interface Window {
    Redoc?: {
      init: (specUrl: string, options: unknown, element: HTMLElement) => void;
    };
  }
}
export {};
