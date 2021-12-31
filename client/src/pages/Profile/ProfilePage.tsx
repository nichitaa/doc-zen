import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch, useAppSelector } from '@hooks/rtk-hooks';
import { setToken } from '@feature/authorization/authorization-slice';
import Header from './components/Header/Header';
import DocumentList from './components/DocumentList/DocumentList';
import { Spin } from 'antd';

const ProfilePage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useAppDispatch();
  const { auth0AccessToken } = useAppSelector(s => s.authorization);

  // update authenticated user access token
  useEffect(() => {
    (async () => {
      const accessToken = await getAccessTokenSilently();
      dispatch(setToken(accessToken));
    })();
  }, []);

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
