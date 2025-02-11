declare module NodeJS {
  interface Module {
    hot?: {
      accept: (path?: string, callback?: () => void) => void;
      dispose: (callback: (data: any) => void) => void;
    };
  }
}
