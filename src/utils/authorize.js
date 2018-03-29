
/* eslint-disable */

import { getCookie, getURLParameter } from './index';
// import { fetchUser } from '../service/index';
import Vue from 'vue';
import axios from 'axios';

const WX_PREFIX = 'wx oauth url';

function setToken(token, uid) {
  const days = 15;
  const exp = new Date();
  exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `token=${  decodeURIComponent(token)  };expires=${  exp.toGMTString()}`;
  if (uid) {
    document.cookie = `uid=${  decodeURIComponent(uid)  };expires=${  exp.toGMTString()}`;
  }
}

function fetchTokenByOAuth() {
  const url_from = window.location.href;
  const url = `${WX_PREFIX}/rest/user/oauth?url_from=${encodeURIComponent(url_from)}`;
  console.log(url)
  window.location.replace(url);
}

export default function () {
  const token = getCookie('token');
  axios.defaults.headers.common.token = token;
  const newToken = getURLParameter('_t');
  if (newToken) {
    // 如果包含token,设置到cookie
    const uid = getURLParameter('_u');
    setToken(newToken, uid);
    axios.defaults.headers.common.token = newToken;
  }
  if (newToken || token) {
      //验证token
      // fetchUser().then(data => {
      // }, () => fetchTokenByOAuth())
    } else {
      //否则调用授权
      fetchTokenByOAuth()
    }
}

