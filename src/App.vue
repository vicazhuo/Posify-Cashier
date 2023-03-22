<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import { on, off } from "view-design/src/utils/dom";
import { setMatchMedia } from "view-design/src/utils/assist";
import { mapMutations } from "vuex";

setMatchMedia();

export default {
  name: "app",
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  methods: {
    ...mapMutations("store/layout", ["setDevice"]),
    handleWindowResize() {
      this.handleMatchMedia();
    },
    handleMatchMedia() {
      const matchMedia = window.matchMedia;
      if (matchMedia("(max-width: 600px)").matches) {
        var deviceWidth =
          document.documentElement.clientWidth || window.innerWidth;
        let css = "calc(100vw/7.5)";
        document.documentElement.style.fontSize = css;
        this.setDevice("Mobile");
      } else if (matchMedia("(max-width: 992px)").matches) {
        document.documentElement.style.fontSize = "12px";
        this.setDevice("Tablet");
      } else {
        document.documentElement.style.fontSize = "12px";
        this.setDevice("Desktop");
      }
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
  },
  mounted() {
    on(window, "resize", this.handleWindowResize);
    this.handleMatchMedia();
  },
  beforeDestroy() {
    off(window, "resize", this.handleWindowResize);
  },
};
</script>

<style lang="less">
@media screen and (min-width: 1024px) {
  html {
    font-size: 154.5px !important;
    /*no*/
    overflow: hidden;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
  }
}
/* 屏幕小于1300px的时候写死html的font-size值为130px */
@media screen and (max-width: 1440px) {
  html {
    font-size: 140px !important;
    /*no*/
    overflow: hidden;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
  }
}
/* 屏幕小于1300px的时候写死html的font-size值为130px */
@media screen and (max-width: 1024px) {
  html {
    font-size: 130px !important;
    /*no*/
    overflow: hidden;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
  }
}
body {
  font-size: 16px;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  margin: 0;
  height: 100%;
}
.size {
  width: 100%;
  height: 100%;
}

html,
body {
  .size;
  //   overflow: hidden;
  margin: 0;
  padding: 0;
}

#app {
  background: #f5f7f9 !important;
  .size;
}
</style>
