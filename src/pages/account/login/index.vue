<template>
  <div class="page-account">
    <div class="index_from" v-if="loginType === 'wx' || loginType === 'work'">
      <div class="title">
        {{ loginType === "wx" ?$t("page.login.wechatLogin") : $t("page.login.enterpriseWechat") }}
      </div>
      <div class="qrcode" v-if="loginType === 'wx'">
        <img :src="wxData.qrcode" alt="" />
      </div>
      <div class="qrcode" id="qr_code" v-if="loginType === 'work'"></div>
      <div class="trip" v-if="loginType == 'wx'">
        {{ $t("page.login.useWechatLogin") }}
        <img
          class="upload"
          src="@/assets/images/upload.png"
          @click="getWechatScan"
          alt=""
        />
      </div>
      <div class="change-login-type" @click="changeLoginType">{{$t("page.login.switchLoginMethod")}}</div>
    </div>
    <div class="index_from" v-if="loginType == 'paw'">
      <div class="title">{{$t("page.login.cashierLogin")}}</div>
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem prop="username">
          <Input
            type="text"
            v-model="formInline.username"
            prefix="ios-contact-outline"
            :placeholder="$t('page.login.username')"
            size="default"
          />
        </FormItem>
        <FormItem prop="password">
          <Input
            type="password"
            v-model="formInline.password"
            prefix="ios-lock-outline"
            :placeholder="$t('page.login.password')"
            size="default"
          />
        </FormItem>
        <FormItem prop="code">
          <div class="code">
            <Input
              type="text"
              v-model="formInline.code"
              prefix="ios-keypad-outline"
              :placeholder="$t('page.login.verifyCode')"
              size="default"
            />
            <img :src="imgcode" class="pictrue" @click="captchas" />
          </div>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            long
            size="default"
            @click="handleSubmit('formInline')"
            class="btn"
            >{{ $t("page.login.submit") }}
          </Button>
        </FormItem>
      </Form>
      <div class="login-type">
        <div class="line"></div>
        <div class="more">{{$t('page.login.moreLoginMethod')}}</div>
        <div class="line"></div>
      </div>
      <div class="login-btn">
        <img src="@/assets/images/wx-login.png" alt="" @click="getWechatScan" />
        <img
          src="@/assets/images/work-chat-login.png"
          alt=""
          @click="getWorkChatConfig"
        />
      </div>
    </div>
    <Modal
      v-model="modals"
      scrollable
      footer-hide
      closable
      :title="$t('page.login.plsDoneVerify')"
      :mask-closable="false"
      :z-index="2"
      width="342"
    >
      <div class="captchaBox">
        <div id="captcha" style="position: relative" ref="captcha"></div>
        <div id="msg"></div>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  AccountLogin,
  loginInfoApi,
  getWechatScan,
  checkScanLogin,
  getWorkChatConfig,
  workScanLogin,
} from "@/api/account";
import mixins from "../mixins";
import Setting from "@/setting";
import util from "@/libs/util";
import "../../../assets/js/jigsaw.js";
import { loadJs } from "@/utils";
import Cookies from "js-cookie";

export default {
  mixins: [mixins],
  data() {
    return {
      modals: false,
      autoLogin: true,
      imgcode: "",
      loginType: "paw", // paw 密码登录 wx 微信登录 work企业微信
      formInline: {
        username: "",
        password: "",
        code: "",
      },
      wxData: {},
      ruleInline: {
        username: [
          { required: true, message: $t('page.login.username'), trigger: "blur" },
        ],
        password: [{ required: true, message: $t('page.login.password'), trigger: "blur" }],
        code: [{ required: true, message: $t('page.login.password'), trigger: "blur" }],
      },
      errorNum: 0,
      jigsaw: null,
      login_logo: "",
      site_name: "",
      site_url: "",
      setTime: undefined,
      initTime: 0,
    };
  },
  created() {
    var _this = this;
    document.onkeydown = function(e) {
      if (_this.$route.name === "login") {
        let key = window.event.keyCode;
        if (key === 13) {
          _this.handleSubmit("formInline");
        }
      }
    };
    if (this.$route.query.code) {
      let data = { code: this.$route.query.code };
      return this.workScanLogin(data);
    }
    if (Cookies.get("cashierData")) {
      return this.loginSuc(JSON.parse(Cookies.get("cashierData")));
    }
  },
  watch: {
    $route(n) {
      this.captchas();
    },
    loginType(nav) {},
  },
  mounted() {
    this.$nextTick(() => {
      // /* eslint-disable */
      let that = this;
      this.jigsaw = jigsaw.init({
        el: this.$refs.captcha,
        onSuccess() {
          that.modals = false;
          that.closeModel();
        },
        onFail: this.closefail,
        onRefresh() {},
      });
      this.swiperData();
    });
    this.captchas();
  },
  destroyed() {
    clearInterval(this.setTime);
    this.setTime = undefined;
    this.initTime = 0;
  },
  methods: {
    // 企业微信回调登录
    workScanLogin(data) {
      workScanLogin(data)
        .then((res) => {
          this.loginSuc(res);
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    getWorkChatConfig() {
      this.loginType = "work";
      loadJs(
        "https://wwcdn.weixin.qq.com/node/wework/wwopen/js/wwLogin-1.2.5.js"
      ).then(() => {
        getWorkChatConfig().then((res) => {
          new WwLogin({
            id: "qr_code",
            appid: res.data.work_corp_id,
            agentid: res.data.work_agent_id,
            lang: "zh",
            redirect_uri: encodeURIComponent(
              window.location.protocol +
                "//" +
                window.location.host +
                "/cashier/login"
            ),
            href:
              "data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDIwMHB4O30KLmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lO30KLmltcG93ZXJCb3ggLmluZm8ge3dpZHRoOiAyMDBweDt9Ci5zdGF0dXNfaWNvbiB7ZGlzcGxheTogbm9uZSAgIWltcG9ydGFudH0KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30g",
          });
        });
      });
    },
    changeLoginType() {
      clearInterval(this.setTime);
      this.setTime = undefined;
      this.loginType = "paw";
      this.initTime = 0;
    },
    getWechatScan() {
      clearInterval(this.setTime);
      this.setTime = undefined;
      this.initTime = 0;
      getWechatScan()
        .then((res) => {
          this.loginType = "wx";
          this.wxData = res.data;
          this.setTime = setInterval(() => {
            this.getLoginStatus();
            this.initTime++;
            if (this.initTime >= 60 && this.loginType == "wx") {
              this.getWechatScan();
            }
          }, 1000);
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    getLoginStatus() {
      let data = {
        key: this.wxData.key,
        type: this.loginType == "wx" ? 1 : 2, //1微信 2企业微信
      };
      checkScanLogin(data).then((res) => {
        clearInterval(this.setTime);
        this.initTime = 0;
        this.setTime = undefined;
        this.loginSuc(res);
      });
    },
    swiperData() {
      loginInfoApi()
        .then((res) => {
          let data = res.data || {};
          this.login_logo = data.login_logo
            ? data.login_logo
            : require("@/assets/images/logo.png");
          this.site_name = data.site_name;
          this.site_url = data.site_url;
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    // 关闭模态框
    closeModel() {
      let msg = this.$Message.loading({
        content: "登录中...",
        duration: 0,
      });
      AccountLogin({
        account: this.formInline.username,
        pwd: this.formInline.password,
        imgcode: this.formInline.code,
      })
        .then(async (res) => {
          this.$store.dispatch("store/account/setPageTitle");
          msg();
          this.loginSuc(res);
        })
        .catch((res) => {
          msg();
          let data = res === undefined ? {} : res;
          this.errorNum++;
          this.captchas();
          this.formInline.code = "";
          this.$Message.error(data.msg || "登录失败");
          if (this.jigsaw) this.jigsaw.reset();
        });
    },
    async loginSuc(res) {
      let expires = res.data.expires_time;
      // 记录用户登陆信息
      util.cookies.set("uuid", res.data.user_info.id, {
        expires: expires,
      });
      util.cookies.set("token", res.data.token, {
        expires: expires,
      });
      util.cookies.set("expires_time", res.data.expires_time, {
        expires: expires,
      });
      const db = await this.$store.dispatch("store/db/database", {
        user: true,
      });
      // 保存菜单信息
      // db.set('menus', res.data.menus).set('unique_auth', res.data.unique_auth).set('user_info', res.data.user_info).write();
      db.set("cashier_unique_auth", res.data.unique_auth)
        .set("cashier_user_info", res.data.user_info)
        .write();
      this.$store.commit("store/menus/getmenusNav", res.data.menus);

      let userInfoCashier = {
        account: res.data.user_info.account,
        avatar: res.data.user_info.avatar,
        logo: res.data.logo,
        logoSmall: res.data.logo_square,
      };
      let storage = window.localStorage;
      storage.setItem("cashier_user_info", JSON.stringify(userInfoCashier));

      // 记录用户信息
      this.$store.dispatch("cashier/user/set", {
        name: res.data.user_info.account,
        avatar: res.data.user_info.avatar,
        access: res.data.unique_auth,
        logo: res.data.logo,
        logoSmall: res.data.logo_square,
        version: res.data.version,
        newOrderAudioLink: res.data.newOrderAudioLink,
      });
      if (this.jigsaw) this.jigsaw.reset();
      Cookies.remove("cashierData");
      return this.$router.replace({
        path: this.$route.query.redirect || "/cashier/cashier/index",
      });
    },
    getExpiresTime(expiresTime) {
      let nowTimeNum = Math.round(new Date() / 1000);
      let expiresTimeNum = expiresTime - nowTimeNum;
      return parseFloat(parseFloat(parseFloat(expiresTimeNum / 60) / 60) / 24);
    },
    closefail() {
      if (this.jigsaw) this.jigsaw.reset();
      this.$Message.error("校验错误");
    },
    captchas: function() {
      this.imgcode =
        Setting.apiBaseURL + "/captcha_store?" + Date.parse(new Date());
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.errorNum >= 2) {
            this.modals = true;
          } else {
            this.closeModel();
          }
        }
      });
    },
  },
};
</script>
<style scoped lang="stylus">
.page-account {
  width: 100%;
  height: 100vh;
  background-image: url('../../../assets/images/bg.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;

  .container {
    .page-account-top {
      img {
        height: 41px;
      }
    }
  }
}

.page-account .code {
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-account .code .pictrue {
  height: 32px;
}

.swiperPic img {
  width: 100%;
  height: 100%;
}

.index_from {
  width: 400px;
  padding: 0 40px 32px 40px;
  height: 440px;
  border-radius: 30px;
  background-color: #fff;

  .title {
    font-size: 24px;
    font-weight: 500;
    text-align: center;
    color: rgba(0, 0, 0, 0.85);
    padding-top: 36px;
    margin-bottom: 31px;
  }

  .info {
    color: #CCCCCC;
    font-size: 12px;
    margin-top: 53px;
  }

  .qrcode {
    margin: 0 auto;
    text-align: center;
    width: 100%;

    img {
      width: 200px;
      height: 200px;
    }
  }

  /deep/ iframe {
    height: 270px !important;
  }

  .trip {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;

    .upload {
      width: 14px;
      height: 14px;
      cursor: pointer;
      margin-left: 5px;
    }
  }

  .change-login-type {
    text-align: center;
    color: #1890FF;
    margin-top: 18px;
    cursor: pointer;
    font-size: 14px;
  }
}

.page-account-container {
}

.btn {
  background: #1890FF !important;
}

.captchaBox {
  width: 310px;
}

input {
  display: block;
  width: 290px;
  line-height: 40px;
  margin: 10px 0;
  padding: 0 10px;
  outline: none;
  border: 1px solid #c8cccf;
  border-radius: 4px;
  color: #6a6f77;
}

#msg {
  width: 100%;
  line-height: 40px;
  font-size: 14px;
  text-align: center;
}

a:link, a:visited, a:hover, a:active {
  margin-left: 100px;
  color: #0366D6;
}

.index_from >>> .ivu-input-large {
  font-size: 14px !important;
}

.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    margin: 25px 44px 0 44px;
    width: 39px;
    height: 31px;
    cursor: pointer;
  }
}

.login-type {
  display: flex;
  align-items: center;
  color: #DDE4EC;
  justify-content: space-between;

  .more {
    font-size: 14px;
  }

  .line {
    width: 100px;
    height: 1.5px;
    background-color: #DDE4EC;
  }
}
</style>
