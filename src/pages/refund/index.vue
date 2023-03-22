<template>
  <div class="order">
    <div class="left">
      <div class="left-top">
        <div class="title">{{$t('page.common.soldOrder')}}</div>
        <div class="sx" @click="filterModal = !filterModal">
          {{ filterModal ? $t("page.common.enabel") : $t("page.common.selectOption") }}
          <Icon
            v-if="!filterModal"
            class="ios-funnel-outline"
            color="#666"
            type="ios-funnel-outline"
          />
        </div>
      </div>
      <div class="order-box">
        <div class="search" v-show="!filterModal">
          <Input
            search
            :enter-button="$t('page.common.selectOption')"
            v-model="orderData.keyword"
            size="large"
            :placeholder="$t('page.common.searchOrderNo')"
            @on-search="search"
          />
        </div>
        <orderList
          v-if="refundList.length"
          class="order-list"
          v-show="!filterModal"
          :total="count"
          @addPage="addPage"
          :orderData="refundList"
          @selectOrder="selectOrder"
        ></orderList>
        <div v-else-if="!refundList.length && !filterModal" class="no-order">
          <img src="../../assets/images/no-order.png" alt="" />
          <span class="trip">{{$t('page.common.nonData')}}</span>
        </div>
        <filter-modal v-show="filterModal" @search="searchList"></filter-modal>
      </div>
    </div>
    <div class="order-data">
      <div class="header">
        <div
          class="item"
          :class="
            sle === index
              ? 'sel'
              : index === sle - 1
              ? 'neighbor-left'
              : index === sle + 1
              ? 'neighbor-right'
              : 'def'
          "
          v-for="(tab, index) in tabs"
          :key="index"
          @click="tabClick(index)"
        >
          {{ tab }}
        </div>
        <div class="box" :class="sle === 2 ? 'neighbor-right' : ''"></div>
      </div>
      <div class="content">
        <userOrder
          v-if="sle === 0 && selectOrderData.id"
          class="orders"
          :canSend="canSend"
          :selectData="selectOrderData"
          @submitFail="send"
          @init="searchList"
        ></userOrder>
        <div v-else-if="!selectOrderData.id" class="no-order">
          <img src="../../assets/images/no-record.png" alt="" />
          <span class="trip">{{$t('page.common.nonData')}}</span>
        </div>
        <orderDetails
          v-if="sle === 1 && selectOrderData.id"
          class="orders"
          :orderDatalist="orderInfoData"
        >
        </orderDetails>
        <orderRecord
          v-if="sle === 2 && selectOrderData.id"
          :id="selectOrderData.store_order_id"
        ></orderRecord>
      </div>

      <div class="footer" v-if="selectOrderData.order_id">
        <div class="footer-left">
          <span class="clerk" v-if="selectOrderData.clerk_name"
            >{{$t('page.common.cashier')}}：{{ selectOrderData.clerk_name }}</span
          >
          <span class="pay">{{$t('page.common.netTotalPay')}}：</span>
          <span class="num">¥{{ selectOrderData.pay_price || 0 }}</span>
          <span class="pay">{{$t('page.common.refoundAmount')}}：</span>
          <span class="refund-price"
            >¥{{
              selectOrderData.refunded_price ||
                selectOrderData.refund_price ||
                0
            }}</span
          >
        </div>
        <div class="footer-right">
          <div class="btn pay" @click="remarks">{{$t('page.common.soldMark')}}</div>
          <!-- <div class="btn" @click="point">小票打印</div> -->
          <div
            class="btn pay refund-btn"
            @click="getRefundData"
            v-if="
              [1, 5].includes(selectOrderData.refund_type) &&
                canSend &&
                !open_erp
            "
          >
            {{$t('page.common.fastRefound')}}
          </div>
          <div
            class="btn  no-btn"
            @click="rejectRefund"
            v-if="
              [1, 5].includes(selectOrderData.refund_type) &&
                canSend &&
                !open_erp
            "
          >
            {{$t('page.common.rejectRecfound')}}
          </div>
          <div
            class="btn  refund-btn"
            @click="getRefund"
            v-if="selectOrderData.refund_type === 2 && !open_erp"
          >
            {{$t('page.common.reFoundAndRegoods')}}
          </div>
        </div>
      </div>
    </div>
    <!-- 备注 -->
    <order-remark
      ref="remarks"
      remarkType="refund"
      :orderId="selectOrderData.id"
      @submitFail="submitFail"
    >
    </order-remark>
    <Modal
      v-model="orderRefundModal"
      scrollable
      title="退款处理"
      class="order_box"
      width="600"
      class-name="vertical-center-modal"
      footer-hide
    >
      <order-refund
        v-if="orderRefundModal"
        :selectData="selectOrderData"
        @refund="refund"
        @clear="orderRefundModal = false"
      ></order-refund>
    </Modal>
  </div>
</template>

<script>
import orderList from "@/components/orderList";
import goodsList from "@/pages/hang/components/goodsList";
import userOrder from "./components/userOrder";
import orderDetails from "./components/orderDetails";
import orderRecord from "@/components/orderRecord";
import orderRemark from "@/components/orderRemark";
import filterModal from "@/components/filterModal";
import orderRefund from "@/components/orderRefund";
import {
  getOrderRefundInfo,
  getRefundList,
  getRefundOrderFrom,
  refund,
  erpConfig,
} from "@/api/order";

export default {
  components: {
    orderList,
    goodsList,
    userOrder,
    orderDetails,
    orderRecord,
    orderRemark,
    filterModal,
    orderRefund,
  },
  data() {
    return {
      refundList: [],
      tabs: ["商品信息", "订单详情", "订单记录"],
      sle: 0,
      orderId: 0,
      filterModal: false,
      orderRefundModal: false,
      orderInfoData: {},
      selectOrderData: {},
      orderData: {
        type: "",
        status: "",
        time: "",
        staff_id: "",
        real_name: "",
        page: 1,
        limit: 10,
      },
      count: 0,
      canSend: true,
      tengxun_map_key: "",
      open_erp: null,
    };
  },
  created() {
    this.getRefundList();
    this.getErpConfig();
  },
  methods: {
    addPage() {
      if (this.refundList.length < this.count) this.orderData.page++;
      this.getRefundList();
    },
    // 获取退款表单数据
    getRefund() {
      this.delfromData = {
        title: "退货退款",
        url: `/order/refund/agree/${this.selectOrderData.id}`,
        method: "get",
      };
      this.$modalSure(this.delfromData)
        .then((res) => {
          this.$Message.success(res.msg);
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    //拒绝退款
    rejectRefund() {
      this.delfromData = {
        title: "拒绝退款",
        url: `/order/order_refund/${this.selectOrderData.id}?type=2`,
        method: "put",
      };
      this.$modalSure(this.delfromData)
        .then((res) => {
          this.$Message.success(res.msg);
          this.searchList();
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    //搜索
    searchList(data = {}) {
      this.filterModal = false;
      this.orderData.page = 1;
      this.selectOrderData = {};
      this.orderData = { ...this.orderData, ...data };
      this.refundList = [];
      this.getRefundList();
    },
    tabClick(index) {
      switch (index) {
        case 1:
          this.getOrderRefundInfo(this.selectOrderData.id);
        default:
          this.sle = index;
      }
    },
    send() {
      this.canSend = fasle;
    },
    getOrderRefundInfo(id) {
      getOrderRefundInfo(id).then((res) => {
        this.orderInfoData = res.data;
        this.sle = 1;
      });
    },
    // 备注修改成功
    submitFail() {
      // this.getOrderList();
      // this.getData(this.orderId,1);
    },
    // 选中的订单
    selectOrder(data) {
      this.selectOrderData = data;
      this.$nextTick((e) => {
        this.sle = 0;
      });
    },
    selectFilter(item, index) {
      this.searchData[item.type] = index;
    },
    search() {
      this.refundList = [];
      this.orderData.page = 1;
      this.selectOrderData = {};
      this.getRefundList();
    },
    // 获取退款表单数据
    getRefundData() {
      this.orderRefundModal = true;
    },
    getRefundList() {
      getRefundList(this.orderData)
        .then((res) => {
          res.data.list = res.data.list.map((item) => {
            let infoArr = [];
            for (let key in item._info) {
              let obj = item._info[key];
              infoArr.push(obj);
            }
            this.$set(item, "_infoData", infoArr);
            return item;
          });

          this.selectOrderData =
            res.data.list.length && this.orderData.page == 1
              ? res.data.list[0]
              : this.selectOrderData;
          this.refundList = this.refundList.concat(res.data.list);
          this.count = res.data.count;
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    point() {
      this.delfromData = {
        title: "立即打印订单",
        info: "您确认打印此订单吗?",
        url: `/order/print/${this.selectOrderData.id}`,
        method: "get",
        ids: "",
      };
      this.$modalSure(this.delfromData)
        .then((res) => {
          this.$Message.success(res.msg);
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    remarks() {
      this.$refs.remarks.modals = true;
      this.$refs.remarks.formValidate.remark = this.selectOrderData.remark;
    },
    refund(data) {
      refund(this.selectOrderData.id, data)
        .then((res) => {
          this.orderRefundModal = false;
          this.$Message.success("退款成功");
          this.search();
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    getErpConfig() {
      erpConfig()
        .then((res) => {
          this.open_erp = res.data.open_erp;
          this.tengxun_map_key = res.data.tengxun_map_key;
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
  },
};
</script>
<style scoped lang="stylus">
::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px #ccc;
}

::-webkit-scrollbar {
  width: 0px !important;
  /* 对垂直流动条有效 */
}

.order {
  display: flex;

  .left {
    width: 500px;
    max-width: 500px;
    height: calc(100vh - 66px);
    box-shadow: 5px 0px 14px 0px rgba(0, 0, 0, 0.04);
    z-index: 2;
    display: flex;
    flex-direction: column;

    .left-top {
      display: flex;
      justify-content: space-between;
      padding: 20px 20px 0 20px;

      .title {
        color: rgba(0, 0, 0, 0.85);
        font-weight: 600;
        font-size: 20px;
      }

      .sx {
        color: #666666;
        cursor: pointer;
        font-size: 14px;

        .ios-funnel-outline {
          font-weight: bold;
          font-size: 12px;
        }
      }
    }

    .order-box {
      position: relative;
      flex: 1;
      display: flex;
      overflow: hidden;
      flex-direction: column;
      font-size: 18px;

      .search {
        padding: 20px 20px;
      }

      .order-list {
        padding: 0 20px;
      }
    }
  }

  .order-data {
    flex: 1;
    z-index: 1;
    display: flex;
    flex-direction: column;
max-height: calc(100vh - 66px);
    .content {
      flex: 1;
      overflow-y: scroll;
    }

    .header {
      display: flex;
      width: 100%;
      font-size: 18px;

      .box {
        flex: 1;
        background-color: #F4F4F4;
      }

      .item {
        padding: 16px 28px;
        cursor: pointer;
        background-color: #F4F4F4;
        transition: all 0.1s;
      }

      .sel {
        background-color: #fff;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 600;
      }

      .neighbor-left {
        border-bottom-right-radius: 10px;
      }

      .neighbor-right {
        border-bottom-left-radius: 10px;
      }

      .def {
      }
    }

    .orders {
      flex: 1;
      display: flex;
      flex-direction: column;
      max-height: calc(100% - 53px);
    }
  }
}

.footer {
  display: flex;
  padding: 20px 30px;
  justify-content: space-between;
  align-items: center;
  box-shadow: 5px 0px 14px 0px rgba(0, 0, 0, 0.06);

  .footer-left {
    font-size: 15px;
    font-weight: bold;
    color: #000;

    .clerk {
      font-weight: bold;
    }

    .pay {
      padding-left: 40px;
    }

    .refund-price {
      color: #F5222D;
      font-size: 20px;
    }
  }

  .footer-right {
    color: rgba(0, 0, 0, 0.85);
    font-size: 17px;
    display: flex;

    .btn {
      height: 46px;
      padding: 0 18px;
      margin-left: 14px;
      border-radius: 4px;
      background-color: #F2F3F5;
      cursor: pointer;
      display flex
      align-items: center;
    }

    .pay {
      color:rgba(0, 0, 0, 0.85);
      background-color: #f2f3f5;
    }
    .no-btn{
      color: #FFFFFF;
      background-color: #1890FF;
    }
    .refund-btn{
      color: #FFFFFF;
      background-color: #F5222D;
    }
  }
}
</style>
