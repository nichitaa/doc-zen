declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CORS_ORIGIN: string;

      NODE_ENV: string;
      API_PORT: string;

      AUTH0_DOMAIN: string;
      AUTH0_CLIENT_ID: string;
      AUTH0_AUDIENCE: string;

      MONGODB_URL: string;

      AZURE_BLOB_STORAGE_CONNECTION_STRING: string;
    }
  }
}

export {};
