<template>
  <div class="order">
    <div class="left">
      <div class="left-top">
        <div class="title">订单列表</div>
        <div class="sx" @click="filterModal = !filterModal">
          {{ filterModal ? $t("page.common.close") :$t("page.common.select") }}
          <Icon
            v-if="!filterModal"
            class="ios-funnel-outline"
            color="#666"
            type="ios-funnel-outline"
          />
        </div>
      </div>
      <div class="order-box">
        <div class="search" v-if="!filterModal">
          <Input
            search
            v-model="orderData.keyword"
            :enter-button="$t('page.common.search')"
            @on-search="search"
            size="large"
            :placeholder="$t('page.common.searchOrderNo')"
          />
        </div>
        <orderList
          v-if="orderListData.length"
          class="order-list"
          v-show="!filterModal"
          :total="count"
          @addPage="addPage"
          @selectOrder="selectOrder"
          :orderData="orderListData"
        ></orderList>
        <div v-else-if="!orderListData.length && !filterModal" class="no-order">
          <img src="../../assets/images/no-order.png" alt="" />
          <span class="trip">{{ $t('page.home.nonOrder')}}</span>
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
          class="orders"
          v-if="sle === 0 && selectOrderData.id"
          :canSend="canSend"
          :selectData="selectOrderData"
          @remarks="remarks"
        ></userOrder>

        <orderDetails
          class="orders"
          v-if="sle === 1 && selectOrderData.id"
          :orderDatalist="orderInfoData"
        >
        </orderDetails>
        <orderRecord
          v-if="sle === 2 && selectOrderData.id"
          :id="selectOrderData.id"
        ></orderRecord>
        <div v-else-if="!selectOrderData.id" class="no-order">
          <img src="../../assets/images/no-record.png" alt="" />
          <span class="trip">{{ $t('page.home.nonPickup')}}</span>
        </div>
      </div>
      <div class="footer" v-if="selectOrderData.order_id">
        <div class="footer-left">
          <span class="clerk" v-if="selectOrderData.clerk_name"
            >{{ $t('page.home.cashier')}}：{{ selectOrderData.clerk_name }}</span
          >
          <span class="pay">{{ $t('page.home.payment')}}：</span>
          <span class="num">¥{{ selectOrderData.pay_price || 0 }}</span>
        </div>
        <div class="footer-right">
          <div class="btn" @click="remarks" v-if="!open_erp">{{ $t('page.tips.orderMark')}}</div>
          <div class="btn" @click="point" v-if="!open_erp">{{ $t('page.tips.invoicePrint')}}</div>
          <div
            class="btn pay"
            v-if="
              (selectOrderData._status === 2 ||
                selectOrderData._status === 8 ||
                selectOrderData.status === 4) &&
                selectOrderData.shipping_type === 3 &&
                (selectOrderData.pinkStatus === null ||
                  selectOrderData.pinkStatus === 2)
            "
            @click="orderSend"
          >
            {{ $t('page.order.shiping')}}
          </div>
          <div
            class="btn pay"
            @click="getRefundData"
            v-if="
              [0, 1, 2, 5].includes(selectOrderData.refund_type) &&
                (parseFloat(selectOrderData.pay_price) >
                  parseFloat(selectOrderData.refund_price) ||
                  selectOrderData.pay_price == 0) &&
                !selectOrderData.refund.length
            "
          >
            {{ selectOrderData.refund_type == 2 ? $t('page.order.agreeRefound') : $t('page.order.fastRefound') }}
          </div>
        </div>
      </div>
    </div>
    <!-- 备注 -->
    <order-remark
      ref="remarks"
      :orderId="selectOrderData.id"
      @submitFail="submitFail"
    ></order-remark>
    <orderSend
      ref="send"
      :orderId="orderId"
      :status="status"
      :pay_type="pay_type"
      @submitFail="send"
    ></orderSend>
  </div>
</template>

<script>
import orderList from "@/components/orderList";
import goodsList from "@/pages/hang/components/goodsList";
import userOrder from "@/pages/order/components/userOrder";
import orderDetails from "@/pages/order/components/orderDetails";
import orderRecord from "@/components/orderRecord";
import orderRemark from "@/components/orderRemark";
import filterModal from "@/components/filterModal";
import orderSend from "@/pages/order/components/orderSend";
import {
  getOrderList,
  getOrderInfo,
  getRefundOrderFrom,
  erpConfig,
} from "@/api/order";

export default {
  components: {
    orderList,
    goodsList,
    userOrder,
    orderDetails,
    orderRemark,
    orderRecord,
    filterModal,
    orderSend,
  },
  data() {
    return {
      orderId: 0,
      orderListData: [],
      tabs: [$t('page.order.goodsDetails'),$t('page.order.orderDetails'),$t('page.order.orderRecord')],
      sle: 0,
      filterModal: false,
      userFrom: {
        keyword: "",
        page: 1,
        limit: 9,
      },
      orderData: {
        type: "",
        status: "",
        time: "",
        staff_id: "",
        real_name: "",
        page: 1,
        limit: 7,
      },
      selectOrderData: {},
      orderInfoData: {},
      count: 0,
      status: 0,
      pay_type: "",
      canSend: true,
      tengxun_map_key: "",
      open_erp: null,
    };
  },
  created() {
    this.getOrderList();
    this.getErpConfig();
  },
  methods: {
    orderSend() {
      this.$store.commit(
        "store/order/setSplitOrder",
        this.selectOrderData.total_num
      );
      this.$refs.send.modals = true;
      this.orderId = this.selectOrderData.id;
      this.status = this.selectOrderData._status;
      this.pay_type = this.selectOrderData.pay_type;
      this.$refs.send.getList();
      this.$refs.send.getDeliveryList();
      this.$nextTick((e) => {
        this.$refs.send.getCartInfo(
          this.selectOrderData._status,
          this.selectOrderData.id
        );
      });
    },
    addPage() {
      if (this.orderListData.length < this.count) this.orderData.page++;
      this.getOrderList();
    },
    searchList(data) {
      this.filterModal = false;
      this.orderData.page = 1;
      this.orderData = { ...this.orderData, ...data };
      this.orderListData = [];
      this.sle = 0;
      this.search();
    },
    point() {
      this.delfromData = {
        title: $t("page.order.fastPrintInvoice"),
        info: $t("page.order.confirmPrint"),
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
    search() {
      this.orderData.page = 1;
      this.orderListData = [];
      this.selectOrderData = {};
      this.getOrderList();
    },
    // 设置备注
    remarks() {
      this.$refs.remarks.modals = true;
      this.$refs.remarks.formValidate.remark = this.selectOrderData.remark;
    },
    send() {
      this.canSend = false;
      this.search();
    },
    // 备注修改成功
    submitFail() {
      // this.getOrderList();
      // this.getData(this.orderId,1);
    },
    // 获取退款表单数据
    getRefundData() {
      if (this.selectOrderData.refund_type === 2) {
        this.delfromData = {
          title: $t("page.order.whetherFastRefound"),
          url: `/refund/agree/${this.selectOrderData.id}`,
          method: "get",
        };
        this.$modalSure(this.delfromData)
          .then((res) => {
            this.$Message.success(res.msg);
            // this.getOrderList();
            // this.getData(this.orderId, 1);
          })
          .catch((err) => {
            this.$Message.error(err.msg);
          });
      } else {
        this.$modalForm(getRefundOrderFrom(this.selectOrderData.id)).then(
          () => {
            this.getOrderList();
            // this.getData(this.orderId, 1);
            this.$emit("changeGetTabs");
          }
        );
      }
    },
    // 订单详情
    getOrderInfo(id) {
      if (id)
        getOrderInfo(id)
          .then((res) => {
            this.orderInfoData = res.data;
          })
          .catch((err) => {
            this.$Message.error(err.msg);
          });
    },
    selectOrder(data) {
      this.sle = 0;
      this.selectOrderData = {};
      this.$nextTick((e) => {
        this.selectOrderData = data;
      });
    },
    tabClick(index) {
      switch (index) {
        case 1:
          this.getOrderInfo(this.selectOrderData.id);
      }
      this.sle = index;
    },

    getOrderList() {
      getOrderList(this.orderData)
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
          this.orderListData = this.orderListData.concat(res.data.list);
          this.count = res.data.count;
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
        .catch((err) => {
          this.$Message.error(err.msg);
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
        border-radius: 10px;
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

    .clerk {
      color: #000;
      padding-right: 40px;
      font-weight: bold;
    }

    .pay {
      color: #333333;
    }

    .num {
      font-size: 20px;
      color: #F5222D;
      font-weight: bold;
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
      color: #FFFFFF;
      background: #FF7700;
    }
  }
}
</style>
