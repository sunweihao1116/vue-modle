import Vue from 'Vue'
import { Indicator, Toast, Popup } from 'mint-ui';

Vue.component(Indicator)
Vue.component(Toast)
// Vue.component(Popup.name, Popup);
const showLoading = (obj = {
  text: '加载中...',
  spinnerType: 'fading-circle'
})=>{
  Indicator.open(obj)
}

const hideLoading = Indicator.close

const showToast = (obj = {
  message: '网络错误',
  position: 'middle',
  duration: 1500
})=>{
  hideLoading();
  Toast(obj);
}

export {showLoading, hideLoading, showToast}
