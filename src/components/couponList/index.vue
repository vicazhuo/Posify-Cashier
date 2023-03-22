<template>
  <div style="width: 100%">
    <Modal
      v-model="modals"
      scrollable
      footer-hide
      closable
      title="优惠券列表"
      :mask-closable="false"
      width="1070"
      @on-cancel="cancel"
    >
      <div class="wrapper" v-if="dataList.length">
        <div
          class="item"
          v-for="(item, index) in dataList"
          :key="index"
          :class="item.used && couponId == item.id ? 'used' : ''"
        >
          <div class="item-left">
            <div class="itemCon acea-row row-between-wrapper">
              <div class="span">
                <div class="money" v-if="item.coupon_type === 1">
                  <span class="fu">¥</span>{{ item.coupon_price }}
                </div>
                <div class="money" v-if="item.coupon_type === 2">
                  {{ (item.coupon_price / 10).toFixed(2)
                  }}<span class="fu">折</span>
                </div>
                <div class="info">满{{ item.use_min_price }}元可用</div>
              </div>
              <div class="bnt" v-if="item.is_use === true">
                <span>已 领 取</span>
              </div>
              <div
                class="bnt"
                v-else-if="item.is_use === false"
                @click="receiveCoupon(item)"
              >
                <span>立 即 领 取</span>
              </div>
              <div class="bnt" v-else-if="item.is_use === 2">
                <span>已 过 期</span>
              </div>
            </div>
            <div class="roll up-roll"></div>
            <div class="roll down-roll"></div>
            <div class="cou-msg">
              <div class="title line1">{{ item.coupon_title }}</div>
              <div class="type">
                {{
                  item.type === 0
                    ? "通用券"
                    : item.type === 1
                    ? "品类券"
                    : "商品券"
                }}
              </div>
              <div class="time" v-if="item.end_time">
                <span>{{ item.add_time | formatDate }}</span>
                ~
                <span>{{ item.end_time | formatDate }}</span>
              </div>
              <div class="time" v-else>
                <span>不限时</span>
              </div>
            </div>
          </div>
          <div
            class="use"
            :class="item.used && couponId == item.id ? 'use-on' : ''"
            @click="select(item)"
          >
            {{
              couponId == item.id
                ? "已选择"
                : item.used
                ? "立即使用"
                : "领取并使用"
            }}
          </div>
        </div>
      </div>
      <div v-else class="no-cump">
        <img src="../../assets/images/no-cup.png" alt="" />
        <span class="trip">暂无优惠券，可以看看其他活动哟～</span>
      </div>
    </Modal>
  </div>
</template>

<script>
import { cashierCouponList } from "@/api/order";
import { receiveCoupon } from "@/api/coupon";
import { formatDate } from "@/utils/validate";

export default {
  name: "userList",
  filters: {
    formatDate(time) {
      if (time !== 0) {
        let date = new Date(time * 1000);
        return formatDate(date, "yyyy-MM-dd");
      }
    },
  },
  props: {
    uid: {
      type: Number,
      value: 0,
    },
    couponId: {
      type: Number,
      value: 0,
    },
    cartList: {
      type: Array,
      value: 0,
    },
  },
  data() {
    return {
      modals: false,
      loading: false,
      dataList: [],
    };
  },
  created() {},
  methods: {
    select(item) {
      if (!item.used) {
        let data = {
          couponId: item.id,
        };
        receiveCoupon(this.uid, data)
          .then((res) => {
            this.$emit("getCouponId", res.data);
          })
          .catch((err) => {
            this.$Message.error(err.msg);
          });
      } else {
        this.$emit("getCouponId", item);
      }
    },
    //优惠券列表
    getList() {
      this.loading = true;
      let ids = [];
      this.cartList.forEach((item) => {
        item.cart.forEach((i) => {
          ids.push(i.id);
        });
      });
      cashierCouponList(this.uid, { cart_id: ids })
        .then((res) => {
          this.loading = false;
          this.dataList = res.data;
        })
        .catch((err) => {
          this.loading = false;
          this.$Message.error(err.msg);
        });
    },
    cancel() {
      this.currentid = "";
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .ivu-modal-body {
  background-color: #f5f5f5;
  padding-right: 5px;
}
.wrapper::-webkit-scrollbar {
  width: 0 !important;
}

.wrapper {
  -ms-overflow-style: none;
}

.wrapper {
  display: flex;
  min-height: 350px;
  flex-wrap: wrap;
  overflow-y: scroll;
  justify-content: space-between;
  max-height: 450px;
}
.wrapper::after {
  content: "";
  width: 33%;
}
.item {
  background-color: #ffebda;
  width: 32%;
  height: 122px;
  display: flex;
  margin: 1% 1% 0 0;
  border-radius: 8px;

  .item-left {
    width: 87%;
    height: 122px;
    background-color: #fff;
    display: flex;
    position: relative;
    border-radius: 8px;

    flex-shrink: 0;
  }

  .use {
    width: 13%;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    writing-mode: vertical-lr;
    color: #ff7700;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
  }
  .use-on {
    color: #fff;
  }

  .roll {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #f5f5f5;

    &.up-roll {
      left: 30%;
      top: -10px;
    }

    &.down-roll {
      left: 30%;
      bottom: -10px;
    }
  }

  .itemCon {
    width: 36%;
    height: 100%;

    .span {
      width: 100%;
      height: 100%;
      border-right: 1px dashed #eeeeee;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .money {
        color: #e93323;
        font-size: 34px;
        font-weight: bold;

        .fu {
          font-size: 18px;
        }
      }

      .info {
        color: #e93323;
        font-size: 13px;
      }
    }
  }

  .cou-msg {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 0 17px;
    width: 70%;

    .title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      font-weight: bold;
      width: 140px;
    }

    .type {
      border: 1px solid #ff6053;
      width: max-content;
      color: #ff6053;
      font-size: 12px;
      padding: 0 5px;
      border-radius: 20px;
      margin: 5px 0 10px 0;
    }

    .time {
      color: #999999;
      font-size: 13px;
    }
  }
}

.no-cump {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 350px;
  padding: 50px 0;

  img {
    width: 180px;
    height: 140px;
    margin-bottom: 20px;
  }

  .trip {
    color: #999999;
    font-size: 14px;
  }
}
.used {
  background-color: #ff7700 !important;
}
</style>
