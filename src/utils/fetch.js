import axios from 'axios';
import md5 from './md5';
import store from '../store';
import router from '../router';
import { autoLogin, updateToken } from './auth';

function pushAll(...args) {
  return this.concat(args);
}

const cleanParams = (p = {}) => {
  Object.keys(p).forEach(k => {
    if (p[k] === undefined || p[k] === null) {
      delete p[k];
    }
  });
};

const symbols = { '%': '%25', '&': '%26', '*': '%2a', '+': '%2b', ';': '%3b' };
const encodeParames = (p = {}) => {
  Object.keys(p).forEach(k => {
    Object.keys(symbols).forEach(sk => {
      if (typeof p[k] === 'string') {
        const str = new RegExp(`\\${sk}`, 'g');
        p[k] = p[k].replace(str, symbols[sk]);
      }
    });
  });
};

const goLogin = (config) => {
  if (store.state.wxAppid) {
    autoLogin(config);
  } else {
    router.replace(config.tokenType.url);
  }
};

const sign = config => {
  const isGet = ['GET', 'DELETE'].indexOf(config.method) >= 0;
  const params = isGet ? config.params : config.data;
  const timestamp = Math.floor(Date.now() / 1000);
  const account = config.tokenType ? config.tokenType.jwtInfo.jti : '';
  const delegate = store.state.delegate;
  let arr = pushAll.call([], account, delegate, config.method, config.url, timestamp);
  const ps = params ? Object.entries(params).sort().map(e => `${e[0]}=${e[1]}`).join('&') : '';
  if (isGet) {
    arr = pushAll.call(arr, ps, '', '');
  } else {
    arr = pushAll.call(arr, '', ps, '');
  }
  const str = `|${arr.join('|')}|`;
  config.headers['X-Signature'] = md5(str);
  config.headers['X-Timestamp'] = timestamp;
};

const genPromiseWithErrorMessage = message => new Promise((resovle, reject) => reject({ message }));
const genPromiseWithOutErrorMessage = () => new Promise((resovle, reject) => reject({ break: true }));

/**
 *
 * @param {*} url
 * @param {*} params
 * @param {*} method
 */

const fetch = (host, url, params = {}, method, tokenType) => {
  const config = {
    url,
    baseURL: host,
    method: method.toLocaleUpperCase() || 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    tokenType,
    transformRequest: [
      data =>
        Object.entries(data)
          .map(kv => `${kv[0]}=${kv[1]}`)
          .join('&'),
    ],
    autoJumpFlag: params.autoJumpFlag || false,
  };
  delete params.autoJumpFlag;
  params.delegate_code = store.state.delegate;
  if (method === 'UPLOAD') {
    config.method = 'POST';
    config.headers['Content-Type'] = 'multipart/form-data';
    delete config.transformRequest;
    const _params = new FormData();
    // eslint-disable-next-line
    Object.entries(params).map(val => {
      _params.append(val[0], val[1]);
    });
    params = _params;
  }
  if (method === 'GET' || method === 'DELETE') {
    config.params = params;
  } else {
    config.data = params;
  }
  if (!config.url) {
    return genPromiseWithErrorMessage('no url');
  }
  config.data = config.data || {};
  // if (config.method === 'DELETE') {
  //   config.params = {};
  // }
  if (config.tokenType) {
    const token = config.tokenType.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      goLogin(config);
      // eslint-disable-next-line
      return genPromiseWithOutErrorMessage();
    }
  }
  cleanParams(config.params);
  sign(config);
  encodeParames(params);
  return new Promise((resovle, reject) => {
    axios(config)
      .then(res => {
        const data = res.data;
        resovle(data);
      })
      .catch(err => {
        let error = { message: '服务器错误' };
        if (err.response && err.response.status === 401) {
          if (tokenType) {
            reject({ break: true });
            updateToken('', tokenType);
            goLogin(config);
          }
          return;
        }
        if (err && err.response && err.response.data) {
          const d = err.response.data;
          error = {
            message: d.displayedMsg,
            httpstatus: err.response.status,
          };
        }
        reject(error);
      });
  });
};

export const fetchData = (host, url, params, method) => fetch(host, url, params, method);

export const fetchMB = (host, url, params, method) => fetch(host, url, params, method, store.state.tokenTypes.mbTokenType);

export const fetchBB = (host, url, params, method) => fetch(host, url, params, method, store.state.tokenTypes.bbTokenType);

export const fetchNC = (host, url, params, method) => fetch(host, url, params, method, store.state.tokenTypes.ncTokenType);

