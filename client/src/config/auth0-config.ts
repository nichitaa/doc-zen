export const auth0Config = {
  domain: import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN as string, // pbl-doclock.eu.auth0.com
  clientId: import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID as string, // 'JTeksvTi18pXoHCizoZj3FAk0YfVWJfW';
  audience: import.meta.env.VITE_DOCLOCK_API_AUTH_AUDIENCE as string, // 'https://pbl-doclock-api/';
  redirectUri: `${window.location.origin}/home`,
  cacheLocation: 'memory',
};
