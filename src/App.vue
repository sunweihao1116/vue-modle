<template>
  <div id="app">
    <keep-alive include="Index">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  overflow: hidden;
  > div {
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
}
body{background: #f3f3f3;}
body, div, span, header, footer, nav, section, aside, article, ul, dl, dt, dd, li, a, p, h1, h2, h3, h4, h5, h6, i, b,em,u textarea, button, input, select, figure, figcaption {
    padding: 0;
    margin: 0;
    list-style: none;
    font-style: normal;
    text-decoration: none;
    box-sizing: border-box;
    font-family: "Microsoft Yahei", sans-serif;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    outline:none;
    border: 0;
    &:focus {
        outline: none;
    }
}

// .bottom-fade-enter, .bottom-fade-leave-to {
//   transform: translateY(100%);
// }
// .bottom-fade-enter-active {
//   transition: all .3s;
// }
// .bottom-fade-leave-active {
//   transition: all .3s;
// }

// .amap-logo, .amap-copyright, .amap-call {
//   display: none!important;
// }

</style>
