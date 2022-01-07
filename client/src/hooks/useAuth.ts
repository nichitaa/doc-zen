import { useEffect } from 'react';
import { DocZenAPI } from '@services/docZenAPI';
import { setCSRFToken, setToken } from '@feature/authorization/authorization-slice';
import { useAppDispatch, useAppSelector } from '@hooks/rtk-hooks';
import { useAuth0 } from '@auth0/auth0-react';

export const useAuth = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useAppDispatch();
  const { csrfToken, auth0AccessToken } = useAppSelector(s => s.authorization);

  const setCSRF = async () => {
    const csrf = await DocZenAPI.getInstance().getCSRFToken();
    if (csrf) dispatch(setCSRFToken(csrf));
    console.log(`csrf ${csrf}`);
  };

  const setAuth0AccessToken = async () => {
    const accessToken = await getAccessTokenSilently();
    console.log(`access token received`);
    dispatch(setToken(accessToken));
  };

  useEffect(() => {

    // save auth0 access token first
    setAuth0AccessToken();

    // save CSRF token
    setCSRF();

    // set an interval on updating CSRF token every 1h
    const getCSRFTokenInterval = setInterval(setCSRF, 1000 * 60 * 60);

    // on unmount remove the CSRF token interval
    return () => clearInterval(getCSRFTokenInterval);

  }, []);

  return { csrfToken, auth0AccessToken };

};