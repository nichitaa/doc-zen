import React from 'react';
import Header from './components/Header/Header';
import DocumentList from './components/DocumentList/DocumentList';
import { Spin } from 'antd';
import { useAuth } from '@hooks/useAuth';

const ProfilePage = () => {
  const { auth0AccessToken } = useAuth();

  return <>
    {auth0AccessToken
      ? <>
        <Header />
        <DocumentList />
      </>
      : <Spin spinning={true} />}
  </>;
};

export default ProfilePage;
