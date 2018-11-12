import Vue from 'vue';
import { Indicator, Toast } from 'mint-ui';

Vue.component(Indicator);
Vue.component(Toast);

const showLoading = (obj = {}) => {
  const val = {
    text: '加载中...',
    spinnerType: 'fading-circle',
  };
  Object.assign(val, obj);
  Indicator.open(val);
};

const hideLoading = Indicator.close;

const showToast = (obj = {}) => {
  hideLoading();
  if (obj.break) { return; }
  const position = 'middle';
  const duration = 1500;
  const message = '未知错误';
  if (typeof obj === 'string') {
    obj = {
      message: obj,
    };
  }
  obj.position = obj.position || position;
  obj.duration = obj.duration || duration;
  obj.message = obj.message || message;
  Toast(obj);
};

export { showLoading, hideLoading, showToast };
