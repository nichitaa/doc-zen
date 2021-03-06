import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Layout, Menu } from 'antd';
import {
  LockOutlined,
  LoginOutlined,
  LogoutOutlined,
  ShareAltOutlined,
  UnlockOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@hooks/rtk-hooks';
import { clearToken } from '@feature/authorization/authorization-slice';
import { FaRegMoon, FaRegSun } from 'react-icons/fa';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import './layout-styles.less';

const { Sider } = Layout;

const LayoutWrapper = ({ children }) => {
  const { isAuthenticated, logout, loginWithPopup } = useAuth0();
  const { switcher, themes, currentTheme } = useThemeSwitcher();

  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const toggle = () => setSidebarCollapsed((prev) => !prev);

  // collapse menu if on nested page url
  useEffect(() => {
    if (location.pathname.split('/').length >= 3 && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname]);

  const dispatch = useAppDispatch();

  const userLogout = () => {
    dispatch(clearToken());
    logout();
  };

  return (
    <>
      <div className={'app-wrapper-layout'}>
        <Sider
          className={'app-sider'}
          trigger={null}
          collapsible={true}
          collapsed={sidebarCollapsed}
        >
          <Menu
            mode='inline'
            defaultSelectedKeys={['1']}
            selectedKeys={location.pathname === '/profile' ? ['/home'] : [location.pathname]}
          >
            <Menu.Item
              onClick={toggle}
              key='0'
              icon={sidebarCollapsed ? <LockOutlined /> : <UnlockOutlined />}
            />
            {/* Will redirect to authenticated or non-authenticated Home page */}
            <Menu.Item
              key='/home'
              icon={<UserOutlined />}
              onClick={() => isAuthenticated ? navigate('/profile') : navigate('/')}
            >
              {isAuthenticated ? 'Profile' : 'Home'}
            </Menu.Item>
            {isAuthenticated && (
              <Menu.Item
                key='/upload'
                icon={<UploadOutlined />}
                onClick={() => navigate('/upload')}
              >
                Upload
              </Menu.Item>
            )}
            <Menu.Item
              key={'/shared'}
              icon={<ShareAltOutlined />}
              onClick={() => navigate('/shared')}
            >
              Shared
            </Menu.Item>
            <Menu.Item
              key={'logout-login'}
              icon={isAuthenticated ? <LogoutOutlined /> : <LoginOutlined />}
              onClick={() => isAuthenticated ? userLogout() : loginWithPopup()}
            >
              {isAuthenticated ? 'Logout' : 'Login'}
            </Menu.Item>
            <Menu.Divider />

            <Menu.Item
              icon={currentTheme === 'light' ? <FaRegSun /> : <FaRegMoon />}
              key={'toggle-theme'}
              onClick={() => switcher({ theme: currentTheme === 'light' ? themes.dark : themes.light })}
            >
              Change to {currentTheme === 'light' ? 'Dark Theme' : 'Light Theme'}
            </Menu.Item>
          </Menu>
        </Sider>

        <div className={'content-wrapper'}>
          <div className={'content'}>{children}</div>
        </div>
      </div>
      <footer style={{ paddingLeft: sidebarCollapsed ? '80px' : '220px' }}>
        ???? doc-zen pbl ??2021 ????
      </footer>
    </>
  );
};

export default LayoutWrapper;
