<template>
  <div class="order-list" @scroll="addPage">
    <div
      class="item"
      :class="{ sel: sel === index }"
      v-for="(item, index) in orderData"
      :key="index"
      @click="selectOrder(item, index)"
    >
      <div class="top">
        <div class="order-sty">
          <span
            class="type-sty"
            :style="'color: ' + item.color + ';border-color:' + item.color"
            v-if="item.pink_name && orderType !== 'verify'"
            >{{ item.pink_name }}</span
          >
          <span class="order">单号:{{ item.order_id }}</span>
        </div>
        <div class="time">
          {{ item.add_time }}
        </div>
      </div>
      <div class="mid acea-row row-between">
        <div class="acea-row" v-if="item._infoData.length > 1">
          <div class="pic" v-show="i < 5" v-for="(val, i) in item._infoData" :key="i">
            <img :src="val.cart_info.productInfo.image"/>
          </div>
        </div>
        <div v-else class="acea-row row-middle">
           <div class="pic" v-for="(val, i) in item._infoData" :key="i">
            <img :src=" val.cart_info.productInfo.image"/>
          </div>
          <div class="store_name line2">
          {{item._infoData[0].cart_info.productInfo.store_name}}
          </div>
        </div>
        <div>
          <p><span class="num">¥{{ item.pay_price }}</span></p>
          <p class="total_num">共{{ item.total_num }}件商品</p>
        </div>
        
      </div>
      <div class="footer">
        <div class="text-333">
          {{ item.status_name.status_name }}
          <span class="trip" v-if="!item.is_all_refund && item.refund.length">
            (部分退款中)
          </span>
          <span
            class="trip"
            v-if="
              item.is_all_refund && item.refund.length && item.refund_type != 6
            "
          >
            (退款中)
          </span>
        </div>
        <div class="shouyin" v-if="item.clerk_name">
          收银员：{{item.clerk_name}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "orderList",
  props: {
    orderData: {
      type: Array,
    },
    total: {
      type: Number,
    },
    orderType: {
      type: String,
      default: "order",
    },
  },
  data() {
    return {
      sel: 0,
    };
  },
  methods: {
    selectOrder(item, index) {
      this.sel = index;
      this.$emit("selectOrder", item);
    },
    addPage(e) {
      if (
        !e ||
        (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <=
          0 &&
          this.orderData.length < this.total)
      ) {
        console.log(
          e
            ? e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight
            : ""
        );
        this.$emit("addPage");
      } else {
        return;
      }
    },
  },
};
</script>

<style scoped lang="stylus">
.order-list::-webkit-scrollbar {
  width: 0 !important;
}

.order-list {
  -ms-overflow-style: none;
}

.order-list {
  overflow: -moz-scrollbars-none;
}

.order-list {
  overflow: hidden;
  overflow-y: scroll;

  .item {
    padding: 18px 20px;
    border-bottom: 1px solid #EEEEEE;
    cursor: pointer;

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .order-sty {
        font-size: 14px;
        white-space: nowrap;

        .type-sty {
          font-size: 12px;
          color: #E93323;
          padding: 2px;
          border-radius: 2px;
          border: 1px solid #E93323;
          margin-right: 6px;
        }

        .order {
          color: rgba(0, 0, 0, 0.85);
          font-size: 14px;
          font-weight: 600;
        }
      }

      .time {
        font-size: 14px;
        white-space: nowrap;
        color: #999999;
      }
    }

    .mid {
      margin: 14px 0;
      max-width: 100%;
      overflow: hidden;

      .pic {
        width: 56px;
        height: 56px;
        margin-right: 12px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }
      }
    }
    .store_name{
      width: 224px;
      height: 36px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 18px;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      .trip{
        color: #F5222D;
      }
      .num {
        color: #F5222D;
        font-size: 16px;
        font-weight: bold;
      }
      .text-333{
        color:#333333;
      }
      .shouyin{
        color:#666;
      }
    }
  }

  .sel {
    background-color: #F3F9FF;
  }
}
.num {
  color: #F5222D;
  font-size: 16px;
  font-weight: bold;
  text-align right
}
.total_num{
  color:#999;
  font-size:12px;
  margin-top:4px;
  text-align: right ;
}
</style>