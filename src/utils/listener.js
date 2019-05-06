import Vue from 'vue';
/* eslint-disable */

// event bus
Vue.prototype.$bus = new Vue();

// add listener
Vue.prototype.$_on = Vue.prototype.$on;
Vue.prototype.$on = function (key, handler) {
  if (!handler) { return; }
  Vue.prototype.$bus.$_on(key, handler);
  this._eventListeners = this._eventListeners || [];
  this._eventListeners[key] = this._eventListeners[key] || [];
  this._eventListeners[key].push(handler);
};

// remove listener, if no handler given，remove all listener about this key
Vue.prototype.$_off = Vue.prototype.$off;
Vue.prototype.$off = function (key, handler) {
  this._eventListeners = this._eventListeners || [];
  const handlers = this._eventListeners[key];
  if (!handlers) { return; }
  if (!handler) {
    handlers.forEach(h => Vue.prototype.$bus.$_off(key, h));
    delete this._eventListeners[key];
    return;
  }
  const index = handlers.indexOf(handler);
  if (index >= 0) {
    Vue.prototype.$bus.$_off(key, handler);
    handlers.splice(index, 1);
  }
};

Vue.prototype.$_once = Vue.prototype.$once;
Vue.prototype.$once = function (key, handler) {
  if (!handler) { return; }
  const _this = this;
  Vue.prototype.$bus.$_once(key, (e, ...args) => {
    handler.apply(_this, [e, ...args]);
    const handlers = _this._eventListeners[key];
    const index = handlers.indexOf(handler);
    if (index >= 0) {
      handlers.splice(index, 1);
    }
  });
  this._eventListeners = this._eventListeners || [];
  this._eventListeners[key] = this._eventListeners[key] || [];
  this._eventListeners[key].push(handler);
}

Vue.prototype.$_emit = Vue.prototype.$emit;
Vue.prototype.$emit = function (e, ...args) {
  Vue.prototype.$bus.$_emit(e, ...args);
}


// hook component's destroyed lifecycle, remove all listener on the components
Vue.mixin({
  beforeDestroy() {
    if (!this._eventListeners) { return; }
    for (let key in this._eventListeners) {
      this._eventListeners[key].forEach(h => Vue.prototype.$bus.$_off(key, h));
    }
    delete this._eventListeners;
  },
});
