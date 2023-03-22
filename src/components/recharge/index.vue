<template>
  <div>
    <Modal v-model="modal" width="583" @on-cancel="clear">
      <Tabs v-model="currentTab" @on-click="changeTabs">
        <TabPane label="优惠充值" name="0"></TabPane>
        <TabPane label="自定义充值" name="1"></TabPane>
      </Tabs>
      <div class="discount">
        <div class="infoData acea-row row-middle" v-if="userInfo">
          <div class="pictrue">
            <img :src="userInfo.avatar">
          </div>
          <div class="info">
            <span>{{ userInfo.nickname }}(ID: {{ userInfo.uid }})</span>
            <span>余额：{{ userInfo.now_money }}</span>
            <span>积分：{{ userInfo.integral }}</span>
          </div>
        </div>
        <div class="list" v-if="currentTab == 0">
          <div class="item" :class="active==index?'on':''" v-for="(item,index) in moneyList"
               @click="activeMoney(index,item)">
            <div class="money"><span>¥</span>{{ item.price }}</div>
            <div>额外赠送：¥ {{ item.give_money }}</div>
          </div>
        </div>
        <div class="custom" v-if="currentTab == 1">
          <InputNumber size="large" :min="1" v-model="payPrice" class="inputNum"></InputNumber>
          <div class="tip">自定义充值的金额无赠送优惠</div>
        </div>
      </div>
      <div slot="footer" class="acea-row row-center-wrapper">
        <Button class="button" type="primary" @click="save">确定</Button>
      </div>
    </Modal>
    <Modal v-model="modalPay" footer-hide width='430px' class="modalPay" @on-cancel='yuePayClear'>
      <div class="payPage">
        <div class="header acea-row row-center-wrapper">
          <div class="pictrue"><img src="../../assets/images/gold.png"></div>
          <div class="text">应收金额(元)</div>
        </div>
        <div class="money">¥<span class="num">{{ rechargeData.price }}</span></div>
        <Input v-model="payNum" ref="rechargeNum" size="large" type="url" @input="inputSaoMa"
               placeholder="请点击输入框聚焦扫码或输入编码号"
               style="margin-top: 16px;"/>
        <div class="process">
          <div class="pictrue">
            <img src="../../assets/images/process1.png">
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
        <!-- 	<Button type="primary" class="bnt" @click="confirm">确认</Button> -->
      </div>
    </Modal>
  </div>
</template>
<script>
import {userRechargelApi, userSaveApi, checkOrderApi} from '@/api/user';

export default {
  name: 'recharge',
  props: {
    userInfo: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      modal: false,
      timer: null,
      currentTab: 0,
      moneyList: [],
      active: 0,
      modalPay: false,
      payNum: '',
      payPrice: 1,
      rechargeData: {
        uid: 0,
        price: '',
        rechar_id: 0,
        pay_type: 3,
        auth_code: ''
      },
      givePrice: 0,
      totalPrice: 0
    }
  },
  watch: {
    modal(n) {
      if (!n) {
        return
      }
      let that = this;
      document.onkeydown = function (e) {
        if (e.which == 13) {
          if (that.payNum) {
            that.rechargeData.auth_code = that.payNum;
            that.confirm();
          }
        }
      };
    }
  },
  created() {
    this.getList();
    let that = this;
    //扫码枪扫码，针对纯数字
    // document.onkeydown = function(e) {
    // 	if (e.which == 13) {
    // 		if (that.payNum) {
    // 			that.rechargeData.auth_code = that.payNum;
    // 			console.log('klklk');
    // 			that.confirm();
    // 		}
    // 	}
    // };
  },
  methods: {
    clear() {
      this.payPrice = 0;
      this.currentTab = '0';
    },
    yuePayClear() {
      this.$Message.destroy()
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null
      }
    },
    //扫码枪扫码，针对带有字母的
    inputSaoMa(e) {
      // setTimeout定时器的作用是，等待扫码枪输入完，拿到完整的二维码信息，再调接口（扫码枪输入速度大概8~20毫秒，手动输速度大概是80毫秒），否则拿不到完整的二维信息。
      // let val = e
      // if (val === '') return false
      // clearTimeout(this.endTimeout)
      // this.endTimeout = null
      // this.endTimeout = setTimeout(() => {
      // 	if (this.payNum === val) {
      // 		clearTimeout(this.endTimeout)
      // 		if (val) {
      // 			this.rechargeData.auth_code = val;
      // 			this.confirm();
      // 		}
      // 	}
      // }, 500)
    },
    changeTabs(e) {
      if (e == 0) {
        this.active = 0;
      }
    },
    getList() {
      userRechargelApi().then(res => {
        this.moneyList = res.data.recharge_quota
      })
    },
    activeMoney(index, item) {
      this.active = index;
    },
    save() {
      this.modalPay = true;
      this.$nextTick(() => {
        this.$refs.rechargeNum.focus();
      })
      if (this.currentTab == 1) {
        this.rechargeData.rechar_id = 0;
        this.givePrice = 0;
        this.rechargeData.price = this.payPrice;
      } else {
        this.rechargeData.price = this.moneyList[this.active].price;
        this.rechargeData.rechar_id = this.moneyList[this.active].id;
        this.givePrice = this.moneyList[this.active].give_money;
      }
      this.totalPrice = this.$computes.Add(this.rechargeData.price, this.givePrice);
    },
    confirm() {
      this.rechargeData.uid = this.userInfo.uid;
      userSaveApi(this.rechargeData).then(res => {
        this.payNum = '';
        let status = res.data.status;
        let orderId = res.data.data.order_id;
        switch (status) {
          case 'SUCCESS':
            this.$Message.success('支付成功');
            this.modalPay = false;
            this.modal = false;
            this.$emit("getSuccess", this.totalPrice);
            break;
          case 'PAY_ING':
            let msg = this.$Message.loading({
              content: '等待支付中...',
              duration: 0
            });
            this.checkOrderTime(orderId, msg);
            break;
          default:
            this.$Message.warning('支付失败');
            break;
        }
      }).catch(err => {
        this.payNum = '';
        this.$Message.error(err.msg)
      })
    },
    checkOrderTime(orderId, msg) {
      let that = this;
      let num = 1;
      let timer = this.timer = setInterval(function () {
        that.checkOrder(orderId, timer, msg);
        num++;
        if (num >= 60) {
          clearInterval(timer);
          msg();
          that.$Message.success("支付失败");
          // that.modalPay = false;
          // that.modal = false;
        }
      }, 1000)
    },
    checkOrder(orderId, timer, msg) {
      checkOrderApi(1, {order_id: orderId}).then(res => {
        if (res.data.status == true) {
          msg();
          this.$Message.success("支付成功");
          this.$emit("getSuccess", this.totalPrice);
          this.modalPay = false;
          this.modal = false;
          clearInterval(timer);
        }
      }).catch(err => {
        msg();
        this.$Message.error(err.msg)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
/deep/ .ivu-modal-body {
  padding 0 !important;
}

/deep/ .ivu-tabs-nav-scroll {
  padding 16px 24px 0 24px !important;
}

/deep/ .ivu-modal-footer {
  border-top: 0 !important;
}

/deep/ .ivu-input-number-large input {
  height 56px !important;
  line-height 56px !important;
}

/deep/ .ivu-input-number-large {
  height 56px !important;
}

/deep/ .ivu-input-number-large .ivu-input-number-input-wrap {
  height 56px !important;
}

/deep/ .ivu-input-number-large .ivu-input-number-handler {
  height 28px;
}

/deep/ .ivu-input-number-large .ivu-input-number-handler-up-inner {
  top 6px;
}

/deep/ .ivu-input-number-large .ivu-input-number-handler-down-inner {
  bottom 6px;
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
      padding 6px 10px 0 3px;

      .item {
        font-size 12px;
        color #666;
        width: 24%;
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

.button {
  width: 535px;
  height: 36px;
  background: #1890FF;
  margin-top 28px;
  margin-bottom 8px;
}

.discount {
  padding 0 24px;

  .custom {
    margin-top 24px;

    .inputNum {
      width: 100%;
    }

    .tip {
      font-size: 13px;
      color: rgba(153, 153, 153, 0.85);
      margin-top 15px;
    }
  }

  .infoData {
    .pictrue {
      width 32px;
      height 32px;
      border-radius 50%;

      img {
        width 100%;
        height 100%;
        border-radius 50%;
      }
    }

    .info {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);

      span {
        padding: 0 8px;

        & ~ span {
          border-left: 1px solid #DDDDDD;
        }
      }
    }
  }

  .list {
    display flex
    flex-wrap wrap
    .item {
      width 165px;
      height 90px;
      border-radius: 7px;
      border: 1px solid #DADFE6;
      color: rgba(0, 0, 0, 0.5);
      font-size 12px;
      text-align center;
      padding 8px 0;
      margin-right 20px;
      margin-top 20px;
      cursor pointer;

      &:nth-child(3n) {
        margin-right 0;
      }

      .money {
        color: #0091FF;
        font-size 30px;
      }

      &:hover {
        background-color #0091FF;
        color #fff;

        .money {
          color #fff;
        }
      }

      &.on {
        background-color #0091FF;
        color #fff;

        .money {
          color #fff;
        }
      }
    }
  }
}
</style>
