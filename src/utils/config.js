import { wechatConfig } from '../service/index';

const url = window.location.href.split('#')[0];
const params = {
  url,
};
// wechatConfig(params).then(r => {
//   const conf = {
//     appId: r.app_id,
//     timestamp: Number(r.timestamp),
//     nonceStr: r.nonce_str,
//     signature: r.signature,
//     jsApiList: ['openLocation', 'getLocation'],
//   };
//   // conf.timestamp = Number(conf.timestamp);
//   // conf.jsApiList = ['scanQRCode', 'openLocation'];
//   wx.config(conf);
//   wx.error(res => console.error('WxAPI Config Error', JSON.stringify(res)));
// }).catch(err => {
//   console.error('获取鉴权配置失败');
// });
