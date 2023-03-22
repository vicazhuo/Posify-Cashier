<template>
  <span
    class="i-layout-header-trigger i-layout-header-trigger-min i-layout-header-trigger-in"
  >
    <Notification
      :wide="isMobile"
      :badge-props="badgeProps"
      class="i-layout-header-notice"
      :class="{ 'i-layout-header-notice-mobile': isMobile }"
      @on-clear="handleClear"
    >
      <Icon slot="icon" custom="i-icon i-icon-notification" />
      <NotificationTab title="消息" name="message">
        <NotificationItem
          v-for="(item, index) in messageList"
          :key="index"
          :title="item.title"
          :icon="item.icon"
          :icon-color="item.iconColor"
          :time="item.time"
          :read="item.read"
        />
      </NotificationTab>
      <NotificationTab title="待办" name="need">
        <NotificationItem
          v-for="(item, index) in needList"
          :key="index"
          :title="item.title"
          :icon="item.icon"
          :icon-color="item.iconColor"
          :time="item.time"
          :read="item.read"
          @on-item-click="jumpUrl(item.url)"
        />
      </NotificationTab>
    </Notification>
  </span>
</template>
<script>
import { mapState } from "vuex";
import { jnoticeRequest } from "@/api/common";
// import { adminSocket } from "@/libs/socket";
import util from "@/libs/util";

export default {
  name: "iHeaderNotice",
  data() {
    return {
      badgeProps: {
        offset: [20, 0],
        dot: true,
      },
      needList: [],
      messageList: [],
      messageLoading: false,
      newOrderAudioLink: "",
      pageWs: "",
    };
  },
  computed: {
    ...mapState("store/layout", ["isMobile"]),
  },
  mounted() {
    this.getNotict();
    this.$store
      .dispatch("store/db/get", {
        dbName: "sys",
        path: "user.info",
        user: true,
      })
      .then((res) => {
        this.newOrderAudioLink = res.newOrderAudioLink;
      });
    // this.pageWs = adminSocket(true, util.cookies.get("token"));
    // this.wsStart();
  },
  methods: {
    wsStart() {
      this.pageWs
        .then((ws) => {
          let that = this;
          ws.send({
            type: "login",
            data: util.cookies.get("token"),
          });

          ws.$on("ADMIN_NEW_PUSH", function (data) {
            that.getNotict();
          });
          ws.$on("success", () => {
            this.$store.commit("store/kefu/setStatus", true);
          });
          ws.$on("NEW_ORDER", function (data) {
            that.$Notice.info({
              title: "新订单",
              duration: 8,
              desc: "您有一个新的订单(" + data.order_id + "),请注意查看",
            });
            if (this.newOrderAudioLink)
              new Audio(this.newOrderAudioLink).play();
            that.messageList.push({
              title: "新订单提醒",
              icon: "md-bulb",
              iconColor: "#87d068",
              time: 0,
              read: 0,
            });
          });
          ws.$on("NEW_REFUND_ORDER", function (data) {
            that.$Notice.warning({
              title: "退款订单提醒",
              duration: 8,
              desc: "您有一个订单(" + data.order_id + ")申请退款,请注意查看",
            });
            if (window.newOrderAudioLink)
              new Audio(window.newOrderAudioLink).play();
            that.messageList.push({
              title: "退款订单提醒",
              icon: "md-information",
              iconColor: "#fe5c57",
              time: 0,
              read: 0,
            });
          });
          ws.$on("WITHDRAW", function (data) {
            that.$Notice.warning({
              title: "提现提醒",
              duration: 8,
              desc: "有用户申请提现(" + data.id + "),请注意查看",
            });
            that.messageList.push({
              title: "退款订单提醒",
              icon: "md-people",
              iconColor: "#f06292",
              time: 0,
              read: 0,
            });
          });
          ws.$on("STORE_STOCK", function (data) {
            that.$Notice.warning({
              title: "库存预警",
              duration: 8,
              desc: "(" + data.id + ")商品库存不足,请注意查看",
            });
            that.messageList.push({
              title: "库存预警",
              icon: "md-information",
              iconColor: "#fe5c57",
              time: 0,
              read: 0,
            });
          });
          ws.$on("PAY_SMS_SUCCESS", function (data) {
            that.$Notice.info({
              title: "短信充值成功",
              duration: 8,
              desc:
                "恭喜您充值" + data.price + "元，获得" + data.number + "条短信",
            });
            that.messageList.push({
              title: "短信充值成功",
              icon: "md-bulb",
              iconColor: "#87d068",
              time: 0,
              read: 0,
            });
          });
          ws.$on("timeout", (data) => {
            setTimeout(() => {
              this.wsRestart();
            }, 2000);
          });
        })
        .catch((error) => {
          setTimeout(() => {
            this.wsRestart();
          }, 2000);
        });
    },
    wsRestart() {
      // this.pageWs = adminSocket(true, util.cookies.get("token"));
      // this.wsStart();
    },
    jumpUrl(url) {
      this.$router.push({ path: url });
    },
    getNotict() {
      jnoticeRequest()
        .then((res) => {
          this.needList = res.data || [];
          this.badgeProps.dot = res.data.length > 0;
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    handleClear(tab) {
      this.badgeProps.dot = false;
      this.clearUnread(tab.name);
    },
    clearUnread(type) {
      this[`${type}List`] = this[`${type}List`].map((item) => {
        item.read = 1;
        return item;
      });
      this[`${type}List`] = [];
    },
  },
};
</script>
