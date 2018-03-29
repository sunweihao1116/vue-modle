import axios from 'axios';
import md5 from './md5';
import base64 from './base64';
import { getCookie, setCookie } from './cookies'

const APIHOST = process.env.API_HOST;

const version = '/v1'

const authorizationType = 'Bearer'

const isDebug = true;

let token = getCookie('weitingWebToken')


const pushAll = function (...args) {
  return this.concat(args)
}

const getMobilenDelegate = (t, p) => {
  if(t) {
    const i = t.split(".")[1];
    const obj = JSON.parse(base64.decode(i));
    return {
      mobile: obj.jti,
      delegate: obj.aud,
    };
  } else {
    return {
      mobile: p.mobile,
      delegate: p.delegateID,
    }
  }
};

const sign = config => {
  const isGet = config.method === 'GET'
  const params = isGet ? config.params : config.data;
  const timestamp = Math.floor(Date.now() / 1000);
  const { mobile, delegate } = getMobilenDelegate(token, params)

  let arr = pushAll.call([], mobile, delegate, config.method, `${version}${config.url}`, timestamp);

  const ps = Object.entries(params).sort().map(e => `${e[0]}=${e[1]}`).join('&');
  if (isGet) {
    arr = pushAll.call(arr, ps, '')
  } else {
    arr = pushAll.call(arr, '', ps)
  }
  const str = `|${arr.join('|')}|`;
  console.log(str)
  config.headers['X-Signature'] = md5(str);
  config.headers['X-Timestamp'] = timestamp;
};

const goLogin = () => {
  console.log('Login first!!')
  // window.location.href = 'index.html';
};

/**
 *
 * @param {*} url
 * @param {*} params
 * @param {*} method
 */

const fetch = (url, params, method) => {
  const config = {
    url,
    baseURL: APIHOST + version,
    method: method.toLocaleUpperCase() || 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  };
  if (method === 'GET' || method === 'DELETE') {
    config.params = params;
  } else {
    config.data = params;
  }
  if (!config.url) {
    return;
  }
  config.data = config.data || {};
  if (config.method === 'DELETE') {
    config.data = {};
  }

  token = getCookie('weitingWebToken')
  if (isDebug) {
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIyMDEwMDAyIiwiZXhwIjoxNTE3NDE0Mzk5LCJqdGkiOiIxMzAyMjEyOTQ2NCIsImlhdCI6MTUxNzE5MDg3NiwiaXNzIjoiYXBpLjEwMDEwc2guY24iLCJzdWIiOiIxIiwid3QiOjR9.jpEQModXBrJpVyp6gCwhSe4aciYbGJ5fjcDdcYvl-fw';
  }

  if (token) {
    config.headers.Authorization = authorizationType + ' ' + token;
  } else {
    goLogin();
  }

  sign(config);
  return new Promise((resovle, reject) => {
    axios(config)
      .then((res) => {
        const data = res.data;
        if (data) {
          if (data.token && data.authorizationType) {
            setCookie('weitingWebToken', `${data.token}`, 1);
          }
          resovle(data);
        } else {
          reject(data);
        }
      })
      .catch((err) => {
        let error = { content: '服务器错误' };
        if (err && err.response && err.response.data && err.response.data.error) {
          error = err.response.data.error;
        }
        reject(error);
      });
  });
};

export default fetch;
