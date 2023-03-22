<template>
  <div class="order">
    <div class="left">
      <div class="left-top">
        <div class="title">会员充值</div>
      </div>
      <div class="order-box">
        <div class="search">
          <Input
            search
            enter-button="搜索"
            v-model="userFrom.keyword"
            placeholder="搜索手机号/ID"
            size="large"
            @on-search="search"
          />
        </div>
        <userList
          v-if="userList.length"
          :userList="userList"
          :total="total"
          @selectUser="selectUser"
          @addPage="addPage"
        ></userList>
        <div v-else class="no-order">
          <img src="../../assets/images/no-order.png" alt="" />
          <span class="trip">噢～目前暂无用户</span>
        </div>
      </div>
    </div>
    <div class="order-data">
      <div>
        <div class="header">
          <div
            class="item"
            :class="
              sle === index
                ? 'sel'
                : index === 0
                ? 'neighbor-left'
                : index === sle + 1
                ? 'neighbor-right'
                : 'def'
            "
            v-for="(tab, index) in tabs"
            :key="index"
            @click="selectTab(index)"
          >
            {{ tab }}
          </div>
          <div class="box" :class="sle === 1 ? 'neighbor-right' : ''"></div>
        </div>
        <div v-if="sle === 0">
          <div class="recharge">
            <div
              class="item"
              :class="rechargeData.rechar_id === item.id ? 'sel' : ''"
              v-for="(item, index) in rechargeList"
              :key="item.id"
              @click="selectType(item, index)"
              @dblclick="recharge"
            >
              <div class="price">¥{{ item.price }}</div>
              <div class="give-price">额外赠送：¥{{ item.give_money }}</div>
            </div>
          </div>
        </div>
        <div v-if="sle === 1">
          <div class="diy-recharge">
            <span class="text">
              自定义充值金额
            </span>
            <InputNumber
              size="large"
              :min="1"
              :max="9999999"
              v-model="payPrice"
              placeholder="0.00"
              class="inputNum"
              @keyup.native="keyupEvent(payPrice)"
            ></InputNumber>
            <span class="tip">自定义充值的金额无赠送优惠</span>
          </div>
        </div>
      </div>

      <div class="footer" @click="recharge">
        <div class="btn">
          充值
        </div>
      </div>
    </div>
    <Modal
      v-model="modalPay"
      footer-hide
      width="450px"
      class="modalPay"
      @on-cancel="yuePayClear"
    >
      <div class="payPage">
        <div class="header acea-row row-center-wrapper">
          <div class="pictrue"><img src="../../assets/images/gold.png" /></div>
          <div class="text">应收金额(元)</div>
        </div>
        <div class="money">
          ¥<span class="num">{{ rechargeData.price }}</span>
        </div>
        <Input
          v-model="rechargeData.auth_code"
          ref="rechargeNum"
          size="large"
          type="url"
          placeholder="请点击输入框聚焦扫码或输入编码号"
          style="margin-top: 16px;"
        />
        <div class="process">
          <div class="pictrue">
            <img src="../../assets/images/process2.png" />
          </div>
          <div class="list acea-row row-between-wrapper">
            <div class="item one">
              <div class="name">出示付款码</div>
              <div>支付宝/微信</div>
            </div>
            <div class="item two">
              <div class="name">扫描付款码</div>
              <div>扫码枪</div>
            </div>
            <div class="item three">
              <div class="name">确认收款</div>
              <div>收银台点击确认</div>
            </div>
          </div>
        </div>
        <Button type="primary" class="bnt" @click="confirm">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import userList from "./components/userList";
import goodsList from "@/pages/hang/components/goodsList";
import userOrder from "@/pages/order/components/userOrder";
import orderDetails from "@/pages/order/components/orderDetails";
import orderRecord from "@/components/orderRecord";
import { getRechargeData } from "@/api/recharge";
import { userListApi, userSaveApi } from "@api/user";

export default {
  components: { userList, goodsList, userOrder, orderDetails, orderRecord },
  data() {
    return {
      userList: [],
      orderListData: [{}],
      tabs: ["优惠充值", "自定义充值"],
      sle: 0,
      filterModal: false,
      rechargeList: [],
      searchData: {
        type: 0,
        status: 0,
        time: 0,
        people: 0,
      },
      rechargeData: {
        uid: 0,
        price: "",
        rechar_id: 0,
        pay_type: 3,
        auth_code: "",
      },
      selTypeIndex: 0,
      payPrice: 1,
      payNum: 0,
      total: 0,
      modalPay: false,
      userFrom: {
        keyword: "",
        page: 1,
        limit: 15,
        field_key: "all",
      },
      selectUserData: {},
    };
  },
  created() {
    this.getRechargeData();
    this.userListApi();
  },
  methods: {
    addPage() {
      if (this.userList.length < this.total) this.userFrom.page++;
      this.userListApi();
    },
    search() {
      this.userList = [];
      this.userFrom.page = 1;
      this.userListApi();
    },
    // 用户列表
    userListApi() {
      this.loading = true;
      userListApi(this.userFrom)
        .then((res) => {
          this.loading = false;
          this.total = res.data.count;
          if (this.userFrom.page === 1) {
            this.selectUserData = res.data.list.length ? res.data.list[0] : {};
            this.rechargeData.uid = res.data.list.length
              ? res.data.list[0].uid
              : "";
          }
          this.userList = this.userList.concat(res.data.list);
        })
        .catch((err) => {
          this.loading = false;
          this.$Message.error(err.msg);
        });
    },
    keyupEvent(val) {
      console.log(val);
      if (val) {
        var re = /^\D*([0-9]\d*\.?\d{0,2})?.*$/;
        let price = val.toString().replace(re, "$1");
        this.payPrice = Number(price);
      } else {
        this.payPrice = "";
      }
    },
    selectTab(index) {
      this.sle = index;
      if (index === 1) this.rechargeData.rechar_id = 0;
    },
    clear() {
      this.payPrice = 0;
      this.sel = 0;
    },
    yuePayClear() {
      this.$Message.destroy();
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    selectType(item, index) {
      this.rechargeData.rechar_id = item.id;
      this.selTypeIndex = index;
    },
    getRechargeData() {
      getRechargeData().then((res) => {
        this.rechargeList = res.data.recharge_quota;
        this.selType = res.data.recharge_quota[0].id;
      });
    },
    // 确认充值
    confirm() {
      userSaveApi(this.rechargeData)
        .then((res) => {
          this.payNum = "";
          let status = res.data.status;
          let orderId = res.data.data.order_id;
          switch (status) {
            case "SUCCESS":
              this.$Message.success("支付成功");
              this.modalPay = false;
              this.modal = false;
              this.search();
              this.rechargeData.auth_code = "";
              this.payPrice = "";
              this.$emit("getSuccess", this.totalPrice);
              break;
            case "PAY_ING":
              let msg = this.$Message.loading({
                content: "等待支付中...",
                duration: 0,
              });
              this.checkOrderTime(orderId, msg);
              break;
            default:
              this.$Message.warning("支付失败");
              break;
          }
        })
        .catch((err) => {
          this.payNum = "";
          this.rechargeData.auth_code = "";
          this.$Message.error(err.msg);
        });
    },
    selectUser(data) {
      this.selectUserData = data;
      this.rechargeData.uid = data.uid;
      this.sle = 0;
      this.rechargeData.rechar_id = 0;
      this.selTypeIndex = 0;
      this.payPrice = 0;
    },
    recharge() {
      if (!this.selectUserData.uid) {
        return this.$Message.error("请先选择会员");
      }
      this.$nextTick(() => {
        this.$refs.rechargeNum.focus();
      });
      if (this.sle === 1) {
        if (!this.payPrice) {
          return this.$Message.error("请先输入金额");
        }
        this.rechargeData.rechar_id = 0;
        this.givePrice = 0;
        this.rechargeData.price = this.payPrice;
        this.modalPay = true;
      } else {
        this.rechargeData.price = this.rechargeList[this.selTypeIndex].price;
        this.rechargeData.rechar_id = this.rechargeList[this.selTypeIndex].id;
        this.givePrice = this.rechargeList[this.selTypeIndex].give_money;
        this.modalPay = true;
      }
    },
  },
};
</script>
<style scoped lang="stylus">
.order {
  display: flex;

  .left {
    width: 500px;
    max-width: 500px;
    padding: 20px 20px;
    height: calc(100vh - 66px);
    box-shadow: 5px 0px 14px 0px rgba(0, 0, 0, 0.04);
    z-index 2

    .left-top {
      display: flex;
      justify-content: space-between;

      .title {
        color: rgba(0, 0, 0, 0.85);
        font-weight: 600;
        font-size 20px
      }

      .sx {
        color: #666666;

        .ios-funnel-outline {
          font-weight bold
          font-size 12px
        }
      }
    }

    .order-box {
      position relative
      height: 100%;

      .search {
        padding: 20px 0;
      }
    }

  }

  .order-data {
    flex 1
    z-index 1
    display: flex;
    flex-direction column;
    justify-content space-between
    height: calc(100vh - 66px);
    user-select: none;
    overflow: scroll;

    .header {
      display: flex;
      width: 100%;
      font-size 18px

      .box {
        flex 1
        background-color #F4F4F4
      }

      .item {
        padding: 16px 28px;
        cursor: pointer;
        background-color #F4F4F4
        transition all .1s
      }

      .sel {
        background-color #fff;
        color: rgba(0, 0, 0, 0.85);
        font-weight:600;
      }

      .neighbor-left {
        border-bottom-right-radius 10px

      }

      .neighbor-right {
        border-bottom-left-radius 10px
      }

      .def {
      }
    }

    .recharge {
      display: flex;
      flex-wrap wrap;
      padding: 10px;

      .item {
        display: flex;
        flex-direction column
        align-items center
        border-radius: 10px;
        border: 1px solid #1890FF;
        padding: 24px 34px;
        width: 30%
        height: 102px;
        margin: 1%
        cursor pointer

        .price {
          font-size 24px
          color: #1890FF;
        }

        .give-price {
          color: #999999;
          font-size 14px
          white-space nowrap
        }
      }

      .item.sel {
        background-color #1890FF
        color: #fff;

        .price {
          font-size 24px
          color: #fff;
        }

        .give-price {
          color: #fff;
        }
      }


    }

    .diy-recharge {
      display: flex;
      flex-direction column
      align-items center
      justify-content center
      margin-top 200px;

      .text {
        font-size 20px
      }

      .inputNum {
        width: 45%;
        margin: 28px 0 14px 0;
        height: 66px;
      }

      /deep/ .ivu-input-number-large {
        height: 66px;
        font-size 30px
      }

      /deep/ .ivu-input-number-input-wrap {
        height: 66px;
      }

      /deep/ .ivu-input-number-handler-wrap {
        display none

      }

      /deep/ .ivu-input-number-large input {
        height: 66px;
        line-height 66px
      }

      .tip {
        font-size: 13px;
        color: rgba(153, 153, 153, 0.85);
        margin-top 15px;
      }
    }

    .footer {
      display: flex;
      align-items center
      justify-content center
      margin: 20px 31px;
      background-color: #1890FF;
      padding: 14px 0
      color: #fff;
      box-shadow: 5px 0px 14px 0px rgba(0, 0, 0, 0.06);
      border-radius: 4px;
      cursor pointer
      font-size 18px
    }

  }
}

.payPage {
  text-align: center;
  padding: 16px;

  /deep/ .ivu-input {
    width: 394px !important;
    text-align: center;
  }

  .header {
    margin: 35px 0 3px 0;
  }

  .process {
    width 394px;
    height 158px;
    border: 1px dashed #D8D8D8;
    border-top: 1px dashed #fff;
    margin: -1px auto 0 auto;

    &.on {
      border-top: 1px dashed #D8D8D8;
      margin-top: 20px;

      .list {
        padding-left 14px !important
      }
    }

    .list {
      padding 6px 10px 0 18px;

      .item {
        font-size 12px;
        color #666;

        .name {
          color #333;
          font-size 13px;
          font-weight bold;
        }
      }
    }

    .pictrue {
      width 362px;
      height 68px;
      margin 24px auto 0 auto;

      img {
        width 100%;
        height 100%;
      }
    }
  }

  .pictrue {
    width: 18px;
    height: 18px;

    img {
      width: 100%;
      height: 100%;
    }
    margin-right 7px
  }

  .text {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }

  .money {
    font-size: 18px;
    color: rgba(0, 0, 0, 0.85);

    .num {
      font-size: 32px;
      margin-left: 5px;
    }
  }

  .tip {
    width: 310px;
    height: 26px;
    background: rgba(255, 126, 0, 0.1);
    border-radius: 13px;
    font-size: 13px;
    color: #FF7E00;
    margin: 10px auto 0 auto;

    .icon {
      font-size: 16px;
      margin-right: 5px;
    }
  }

  .bnt {
    width: 394px;
    height 38px;
    margin: 28px 0 15px 0;
  }
}
</style>
