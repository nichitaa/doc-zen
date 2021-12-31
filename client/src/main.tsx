import { render } from 'react-dom';
import 'antd/dist/antd.less';
import './index.less';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { setupStore } from '@feature/store';
import { Provider as StoreProvider } from 'react-redux';
import { Auth0Provider, Auth0ProviderOptions } from '@auth0/auth0-react';
import { auth0Config } from './config/auth0-config';

const store = setupStore();

const app = (
  <Auth0Provider {...(auth0Config as Auth0ProviderOptions)}>
    <BrowserRouter>
      <StoreProvider store={store}>
        <App />
      </StoreProvider>
    </BrowserRouter>
  </Auth0Provider>
);
render(app, document.getElementById('root'));
