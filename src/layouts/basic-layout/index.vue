<template>
  <Layout class="i-layout">
    <transition name="fade-quick">
      <Header
          class="i-layout-header"
          :style="headerStyle"
          v-resize="handleHeaderWidthChange"
      >
        <i-header-logo/>
        <i-header-breadcrumb ref="breadcrumb"/>
        <div class="i-layout-header-right">
          <!-- <i-header-fullscreen v-if="isDesktop && showFullscreen" /> -->
          <!-- <i-header-notice v-if="showNotice" /> -->
          <i-header-user/>
        </div>
      </Header>
    </transition>
    <Layout
        class="i-layout-inside"
        :class="isChildren ? 'bodyBig' : 'bodySmall'"
    >
      <Sider class="i-layout-sider" :class="siderClasses" :width="menuWidth">
        <i-menu-side :hide-logo="isHeaderStick && headerFix && showHeader"/>
      </Sider>
      <main>
        <Content class="i-layout-content" :class="contentClasses">
          <div class="i-layout-content-main">
            <keep-alive :include="keepAlive">
              <router-view v-if="loadRouter"/>
            </keep-alive>
          </div>
        </Content>
        <!-- <i-copyright /> -->
      </main>
    </Layout>
    <!--<div v-if="isMobile && !hideSider">-->
    <!--<Drawer v-model="showDrawer" placement="left" :closable="false" :class-name="drawerClasses">-->
    <!--<i-menu-side />-->
    <!--</Drawer>-->
    <!--</div>-->
    <!--        <div class="open-image" @click="clear" v-if="openImage"><img src="@/assets/images/wechat_demo.png" alt=""></div>-->
  </Layout>
</template>
<script>
import iMenuHead from "./menu-head";
import iMenuSide from "./menu-side/index";
import iHeaderLogo from "./header-logo";
import iHeaderCollapse from "./header-collapse";
import iHeaderReload from "./header-reload";
import iHeaderBreadcrumb from "./header-breadcrumb";
import iHeaderSearch from "./header-search";
import iHeaderLog from "./header-log";
import iHeaderFullscreen from "./header-fullscreen";
import iHeaderNotice from "./header-notice";
import iHeaderUser from "./header-user";
import iHeaderI18n from "./header-i18n";
import iHeaderSetting from "./header-setting";
import iTabs from "./tabs";
import iCopyright from "@/components/copyright";

import {mapState, mapGetters, mapMutations} from "vuex";
import Setting from "@/setting";

import {requestAnimation} from "@/libs/util";

export default {
  name: "BasicLayout",
  components: {
    iMenuHead,
    iMenuSide,
    iCopyright,
    iHeaderLogo,
    iHeaderCollapse,
    iHeaderReload,
    iHeaderBreadcrumb,
    iHeaderSearch,
    iHeaderUser,
    iHeaderI18n,
    iHeaderLog,
    iHeaderFullscreen,
    iHeaderSetting,
    iHeaderNotice,
    iTabs,
  },
  // provide (){
  //     return {
  //         reload:this.handleReload
  //     }
  // },
  data() {
    return {
      showDrawer: false,
      ticking: false,
      headerVisible: true,
      oldScrollTop: 0,
      isDelayHideSider: false, // hack，当从隐藏侧边栏的 header 切换到正常 header 时，防止 Logo 抖动
      loadRouter: true,
      openImage: true,
      menuWidth: 140,
    };
  },
  computed: {
    ...mapState("store/layout", [
      "siderTheme",
      "headerTheme",
      "headerStick",
      "tabs",
      "tabsFix",
      "siderFix",
      "headerFix",
      "headerHide",
      "headerMenu",
      "isMobile",
      "isTablet",
      "isDesktop",
      "menuCollapse",
      "showMobileLogo",
      "showSearch",
      "showNotice",
      "showFullscreen",
      "showSiderCollapse",
      "showBreadcrumb",
      "showLog",
      "showI18n",
      "showReload",
      "enableSetting",
      "isChildren",
    ]),
    ...mapState("store/page", ["keepAlive"]),
    ...mapGetters("store/menu", ["hideSider"]),
    // 如果开启 headerMenu，且当前 header 的 hideSider 为 true，则将顶部按 headerStick 处理
    // 这时，即使没有开启 headerStick，仍然按开启处理
    isHeaderStick() {
      let state = this.headerStick;
      if (this.hideSider) state = true;
      return state;
    },
    showHeader() {
      let visible = true;
      if (this.headerFix && this.headerHide && !this.headerVisible)
        visible = false;
      return visible;
    },
    headerClasses() {
      return [
        `i-layout-header-color-${this.headerTheme}`,
        {
          "i-layout-header-fix": this.headerFix,
          "i-layout-header-fix-collapse": this.headerFix && this.menuCollapse,
          "i-layout-header-mobile": this.isMobile,
          "i-layout-header-stick": this.isHeaderStick && !this.isMobile,
          "i-layout-header-with-menu": this.headerMenu,
          "i-layout-header-with-hide-sider":
              this.hideSider || this.isDelayHideSider,
        },
      ];
    },
    headerStyle() {
      // const menuWidth = this.isHeaderStick ? 0 : this.menuCollapse ? 80 : Setting.menuSideWidth;
      return {width: `calc(100% - ${this.menuWidth}px)`};
      // return this.isMobile || !this.headerFix ? {} : {
      //     width: `calc(100% - ${menuWidth}px)`
      // };
    },
    siderClasses() {
      return {
        "i-layout-sider-fix": this.siderFix,
        "i-layout-sider-dark": this.siderTheme === "dark",
      };
    },
    contentClasses() {
      return {
        "i-layout-content-fix-with-header": this.headerFix,
        "i-layout-content-with-tabs": this.tabs,
        "i-layout-content-with-tabs-fix": this.tabs && this.tabsFix,
      };
    },
    insideClasses() {
      return {
        "i-layout-inside-fix-with-sider": this.siderFix,
        "i-layout-inside-fix-with-sider-collapse":
            this.siderFix && this.menuCollapse,
        "i-layout-inside-with-hide-sider": this.hideSider,
        "i-layout-inside-mobile": this.isMobile,
      };
    },
    drawerClasses() {
      let className = "i-layout-drawer";
      if (this.siderTheme === "dark") className += " i-layout-drawer-dark";
      return className;
    },
    menuSideWidth() {
      return this.menuCollapse ? 60 : Setting.menuSideWidth;
    },
  },
  watch: {
    hideSider() {
      this.isDelayHideSider = true;
      setTimeout(() => {
        this.isDelayHideSider = false;
      }, 0);
    },
    $route(to, from) {
      if (to.path === from.path) {
        // 相同路由，不同参数，跳转时，重载页面
        if (Setting.sameRouteForceUpdate) {
          this.handleReload();
        }
      }
    },
  },
  methods: {
    ...mapMutations("store/layout", ["updateMenuCollapse"]),
    ...mapMutations("store/order", [
      "getOrderStatus",
      "getOrderTime",
      "getOrderNum",
    ]),
    handleToggleDrawer(state) {
      if (typeof state === "boolean") {
        this.showDrawer = state;
      } else {
        this.showDrawer = !this.showDrawer;
      }
    },
    handleScroll() {
      if (!this.headerHide) return;

      const scrollTop =
          document.body.scrollTop + document.documentElement.scrollTop;

      if (!this.ticking) {
        this.ticking = true;
        requestAnimation(() => {
          if (this.oldScrollTop > scrollTop) {
            this.headerVisible = true;
          } else if (scrollTop > 300 && this.headerVisible) {
            this.headerVisible = false;
          } else if (scrollTop < 300 && !this.headerVisible) {
            this.headerVisible = true;
          }
          this.oldScrollTop = scrollTop;
          this.ticking = false;
        });
      }
    },
    handleHeaderWidthChange() {
      const $breadcrumb = this.$refs.breadcrumb;
      if ($breadcrumb) {
        $breadcrumb.handleGetWidth();
        $breadcrumb.handleCheckWidth();
      }
      const $menuHead = this.$refs.menuHead;
      if ($menuHead) {
        $menuHead.handleGetMenuHeight();
      }
    },
    handleReload() {
      this.loadRouter = false;
      this.getOrderStatus("");
      this.getOrderTime("");
      this.getOrderNum("");
      this.$nextTick(() => {
        this.loadRouter = true;
      });
    },
    clear() {
      this.openImage = false;
    },
  },
  mounted() {
    document.addEventListener("scroll", this.handleScroll, {passive: true});
  },
  beforeDestroy() {
    document.removeEventListener("scroll", this.handleScroll);
  },
  created() {
    if (this.isTablet && this.showSiderCollapse) this.updateMenuCollapse(true);
  },
};
</script>
<style scoped lang="stylus">
/deep/ .i-layout {
  display: flex;
  flex-direction: column;
}

/deep/ .i-layout-header-fix {
  left: 0;
}

/deep/ .i-layout-sider {
  margin-top: 66px;
}

/deep/ .i-layout-menu-head-title-text {
  font-size: 20px;
  font-weight: 500;
  margin-left: 30px;
  color: #fff;
}

/deep/ .ivu-layout-header {
  height: 66px;
  line-height: 66px;
}

/deep/ .bodyBig {
  padding-left: 150px;
}

/deep/ .bodySmall {
  padding-left: 150px;
}

/deep/ .onBig {
}

/deep/ .onSmall {
  left: 150px !important;
}

.i-layout-content-main {
  // height: calc(100% - 66px);
}

.i-layout-header {
  position: fixed !important;
  color: #fff;
  top: 0;
  width: 100% !important;
  background-color: #001529;
  z-index: 15;
}

.open-image {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
}

.i-layout-content-fix-with-header {
  padding-top: 0px;
}

main {
  display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
  display: -moz-box; /* Firefox 17- */
  display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
  display: -moz-flex; /* Firefox 18+ */
  display: -ms-flexbox; /* IE 10 */
  display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
  flex-direction: column;
  border-top-left-radius: 20px;
  margin-top: 66px;
  margin-left: -45px;
  width: calc(100% - 100px);
  height: calc(100% - 66px);
  background-color: #fff;
  overflow hidden
  z-index: 9;
  position: absolute;
  right: 0;
  bottom: 0;
}

.i-layout-sider {
  z-index: 8;
}

.i-layout-header-trigger:hover {
  background: rgba(#001529, 0.3);
}
</style>
