declare module '@uswds/uswds' {
  export function initAll(): void;
  export function on(): void;
  export function off(): void;
}

// Extend the global Window interface for USWDS
declare global {
  interface Window {
    uswds?: {
      initAll(): void;
      on(): void;
      off(): void;
    };
  }
}
