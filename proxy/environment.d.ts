declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string; // =8000
      PROXY_TARGET: string; //=http://localhost:8080
    }
  }
}

export {};
