
import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export function getEnvironment() {
  if (__API__ === '3' || __API__ === '"3"') {
    return 'live';
  } else if (__API__ === '2' || __API__ === '"2"') {
    return 'dev';
  } else if (__API__ === '1' || __API__ === '"1"') {
    return 'local';
  }

  return 'live';
}

export function dNc(data) {
  return (
    typeof data !== 'undefined' &&
    data !== null &&
    !(typeof data === 'string' && data.length === 0)
  );
}

export function deleteAuthenticationCookie() {
  const Cookies = require('js-cookie');
  Cookies.remove('authentication');
}

export function authenticationCookieExists() {
  const Cookies = require('js-cookie');
  const bearer = Cookies.get('authentication');

  if (dNc(bearer)) {
    return true;
  }

  return false;
}

// the api returns something called 'authStatus' as part of all responses - we should examine it and check that the api has not revoked access or anything every time we hit the API
export function handleAuthStatus(authStatus, dispatch) {
  if (authenticationCookieExists() && authStatus === 'error') {
    deleteAuthenticationCookie();
    dispatch({ type: 'LOGOUT_FINISHED' });
  }
}

export function getAPIUrl() {
  const env = getEnvironment();

  if (env === 'live') {
    return 'https://api.alumnibaseapp.com/';
  } else if (env === 'dev') {
    return 'https://beta-api.alumnibaseapp.com/';
  } else if (env === 'local') {
    return 'https://local.sliips.com:8080/';
  }

  return '';
}

export function logError(data) {
  axios
    .post(getAPIUrl() + 'api/general/logError', { data })
    // eslint-disable-next-line no-unused-vars
    .then((res) => {
      // do nothing
    })
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      // do nothing
    });
}

export function getAuthenticationCookie() {
  const Cookies = require('js-cookie');
  return Cookies.get('authentication');
}

