<template>
  <div class="i-layout-header-logo" :class="[
    { 'i-layout-header-logo-stick': !isMobile },
    { small_logo: menuCollapse },
  ]">
    <!-- <img :src="logo"/> -->
    <img :src="logoSmall" v-if="isMobile" />
    <img :src="logo" v-else-if="headerTheme === 'light'" />
    <img :src="logoSmall" v-else-if="menuCollapse" alt="" />
    <img :src="logo" v-else />
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "iHeaderLogo",
  computed: {
    ...mapState("store/layout", ["isMobile", "headerTheme", "menuCollapse"]),
  },
  data() {
    return {
      logo: require("@/assets/images/m_logo.png"),
      logoSmall: require("@/assets/images/logo-small.png"),
    };
  },
  mounted() {
    this.getLogo();
  },
  methods: {
    getLogo() {
      let storage = window.localStorage;
      let value = storage.getItem('cashier_user_info')
      let infoUser = JSON.parse(value);
      this.logo = infoUser.logoSmall ? infoUser.logoSmall : this.logoSmall;
      this.logoSmall = infoUser.logoSmall ? infoUser.logoSmall : this.logoSmall;
    },
  },
};
</script>
<style scoped lang="stylus">
.i-layout-header-logo-stick.small_logo {
  width: 80px;
}

.i-layout-header-logo-stick {
  width: 100px;

  image {
    height: 40px;
  }
}

.i-layout-header-logo {
  width: 100px;
  height: 60px;
  img{
    max-width: 100%;
    max-height 100%;
    padding: 5px;
  }
}
</style>
