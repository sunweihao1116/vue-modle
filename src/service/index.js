import fetch from '../utils/fetch';

const wechatConfig = params => fetch('wechat/config', params, 'post');

const sendCaptcha = params => fetch('/login/captcha', params, 'POST');
const userLogin = params => fetch('/login', params, 'POST');

const orderPackage = params => fetch('/products/1000004', params, 'GET');
const getUserDetail = params => fetch('/resources' , params, "GET");


export {
  wechatConfig,
  sendCaptcha,
  userLogin,
  orderPackage,
  getUserDetail,
};
