import { wechatConfig } from '../service/index';
import store from '../store';

const jsConfig = (apiList, ready = () => {}) => {
  let url = window.location.href.split('#')[0];
  if (navigator.userAgent.toLowerCase().indexOf('iphone') !== -1) {
    url = store.getters.initUrl;
  }
  const params = {
    url,
  };
  wechatConfig(params).then(r => {
    const conf = {
      appId: r.appid,
      timestamp: +r.timestamp,
      nonceStr: r.nonceStr,
      signature: r.signature,
      jsApiList: apiList,
    };
    wx.config(conf);
    wx.ready(() => { ready(); });
    wx.error(err => {
      console.error('WxAPI Config Error', JSON.stringify(err));
      ready(err);
    });
  }).catch(err => {
    console.log('获取鉴权配置失败', JSON.stringify(err));
  });
};

export default jsConfig;
