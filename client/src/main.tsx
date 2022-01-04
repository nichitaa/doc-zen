import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { setupStore } from '@feature/store';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { Provider as StoreProvider } from 'react-redux';
import { Auth0Provider, Auth0ProviderOptions } from '@auth0/auth0-react';
import { App } from './App';
import { auth0Config } from './config/auth0-config';
import './index.less';

const store = setupStore();

/**
 * https://vitejs.dev/guide/assets.html#the-public-directory
 * public directory is served as root path during dev and copied to the root of dist on build
 */
const themes = {
  dark: `${import.meta.env.VITE_PUBLIC_BASE_URL}/themes/dark-theme.css`,
  light: `${import.meta.env.VITE_PUBLIC_BASE_URL}/themes/light-theme.css`,
};

const app = (
  <ThemeSwitcherProvider
    themeMap={themes}
    defaultTheme={'dark'}
    insertionPoint='styles-insertion-point'>
    <Auth0Provider {...(auth0Config as Auth0ProviderOptions)}>
      <BrowserRouter>
        <StoreProvider store={store}>
          <App />
        </StoreProvider>
      </BrowserRouter>
    </Auth0Provider>
  </ThemeSwitcherProvider>);
render(app, document.getElementById('root'));
