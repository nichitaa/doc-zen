export const auth0Config = {
  domain: import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN as string,
  clientId: import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID as string,
  audience: import.meta.env.VITE_REACT_APP_AUTH0_API_AUTH_AUDIENCE as string,
  redirectUri: `${window.location.origin}/home`,
  cacheLocation: 'memory',
};
