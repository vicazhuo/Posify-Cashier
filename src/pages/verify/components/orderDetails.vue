<template>
  <div class="detail">
    <div class="section">
      <div class="title">{{$t("page.common.receiveStockInfo")}}</div>
      <ul class="list">
        <!-- <li class="item">
            <div>用户昵称：</div>
            <div class="value">{{orderDatalist.userInfo.uid?orderDatalist.userInfo.nickname:'游客'}}</div>
        </li> -->
        <li class="item">
          <div>{{$t("page.common.real_name")}}：</div>
          <div class="value">{{ orderDatalist.orderInfo.real_name }}</div>
        </li>
        <li class="item">
          <div>{{$t("page.common.user_phone")}}：</div>
          <div class="value">{{ orderDatalist.orderInfo.user_phone }}</div>
        </li>
        <li class="item">
          <div>{{$t("page.common.user_address")}}：</div>
          <div class="value">{{ orderDatalist.orderInfo.user_address }}</div>
        </li>
      </ul>
    </div>
    <div class="section">
      <div class="title">{{$t("page.common.user_info")}}</div>
      <ul class="list">
        <li class="item">
          <div>{{$t("page.common.user_nickname")}}：</div>
          <div class="value">
            {{
              orderDatalist.userInfo.uid
                ? orderDatalist.userInfo.nickname
                : $t('page.common.visitor')
            }}
          </div>
        </li>
        <li class="item">
          <div>{{$t("page.common.bind_phone")}}：</div>
          <div class="value">{{ orderDatalist.userInfo.phone }}</div>
        </li>
      </ul>
    </div>
    <div class="section">
      <div class="title">{{$t("page.common.user_nickname")}}</div>
      <ul class="list">
        <li class="item">
          <div>{{$t("page.common.create_time")}}：</div>
          <div class="value">{{ orderDatalist.orderInfo._add_time }}</div>
        </li>
        <li class="item">
          <div>{{$t("page.common.total_num")}}：</div>
          <div class="value">{{ orderDatalist.orderInfo.total_num }}</div>
        </li>
        <li class="item">
          <div>{{$t("page.common.total_price")}}：</div>
          <div class="value">{{ orderDatalist.orderInfo.total_price }}</div>
        </li>
        <li class="item">
          <div>{{$t("page.common.coupon_price")}}：</div>
          <div class="value">{{ orderDatalist.orderInfo.coupon_price }}</div>
        </li>
        <li class="item">
          <div>{{$t("page.common.deduction_price")}}：</div>
          <div class="value">
            {{ orderDatalist.orderInfo.deduction_price || 0.0 }}
          </div>
        </li>
        <li
          class="item"
          v-if="parseFloat(orderDatalist.orderInfo.use_integral)"
        >
          <div>{{$t("page.common.use_integral")}}：</div>
          <div class="value">
            {{ parseFloat(orderDatalist.orderInfo.use_integral) }}
          </div>
        </li>
        <li class="item">
          <div>{{$t("page.common.pay_postage")}}：</div>
          <div class="value">{{ orderDatalist.orderInfo.pay_postage }}</div>
        </li>
        <li class="item">
          <div>{{$t("page.common.vip_true_price")}}：</div>
          <div class="value">
            {{ orderDatalist.orderInfo.vip_true_price || 0.0 }}
          </div>
        </li>
        <li class="item" v-if="orderDatalist.orderInfo.shipping_type === 2 && orderDatalist.orderInfo.refund_status === 0 && orderDatalist.orderInfo.paid === 1">
          <div>{{$t("page.common.store_name")}}：</div>
          <div class="value">{{ orderDatalist.orderInfo._store_name }}</div>
        </li>
        <li
          class="item"
          v-if="
            orderDatalist.orderInfo.shipping_type === 2 &&
              orderDatalist.orderInfo.refund_status === 0 &&
              orderDatalist.orderInfo.paid === 1
          "
        >
          <div>{{$t("page.common.verify_code")}}：</div>
          <div class="value">{{ orderDatalist.orderInfo.verify_code }}</div>
        </li>
        <li class="item">
          <div>{{$t("page.common.spread_man")}}：</div>
          <div class="value">
            {{ orderDatalist.userInfo.spread_name }}/ID:{{
              orderDatalist.userInfo.spread_uid
            }}
          </div>
        </li>
        <li class="item">
          <div>{{$t("page.common.pay_time")}}：</div>
          <div class="value">{{ orderDatalist.orderInfo._pay_time }}</div>
        </li>
        <li class="item">
          <div>{{$t("page.common.pay_type")}}：</div>
          <div class="value">
            {{ orderDatalist.orderInfo._status._payType }}
          </div>
        </li>
        <li class="item" v-if="orderDatalist.orderInfo.store_order_sn">
          <div>{{$t("page.common.originOrderNo")}}：</div>
          <div class="value">{{ orderDatalist.orderInfo.store_order_sn }}</div>
        </li>
      </ul>
    </div>
    <div
      class="section"
      v-if="orderDatalist.orderInfo.promotions_detail.length"
    >
      <div class="title">{{$t("page.common.promotions_info")}}</div>
      <ul class="list">
        <li
          class="item"
          v-for="(item, index) in orderDatalist.orderInfo.promotions_detail"
          :key="index"
        >
          <div>{{ item.title }}：</div>
          <div class="value">{{ item.promotions_price }}</div>
        </li>
      </ul>
    </div>
    <div v-if="orderDatalist.orderInfo.custom_form.length" class="section">
      <div class="title">{{$t("page.common.self_mark")}}</div>
      <ul class="list">
        <li
          v-for="(item, index) in orderDatalist.orderInfo.custom_form"
          :key="index"
          class="item"
          v-show="item.value"
        >
          <div>{{ item.title }}：</div>
          <div v-if="item.label === 'img'" class="value">
            <div v-for="(img, i) in item.value" :key="i" class="image" v-viewer>
              <img v-lazy="img" />
            </div>
          </div>
          <div v-else class="value">{{ item.value || "-" }}</div>
        </li>
      </ul>
    </div>
    <div class="section" v-if="orderDatalist.orderInfo.mark">
      <div class="title">{{$t("page.common.customerMark")}}</div>
      <ul class="list">
        <li class="item mark">
          <div>{{$t("page.common.orderMark")}}：</div>
          <div class="value">{{ orderDatalist.orderInfo.mark || "-" }}</div>
        </li>
      </ul>
    </div>
    <div class="section" v-if="orderDatalist.orderInfo.remark">
      <div class="title">{{$t("page.common.orderMark")}}</div>
      <ul class="list">
        <li class="item mark">
          <div class="item1" >{{$t("page.common.mark")}}：</div>
            <Tooltip max-width="300" placement="top-start">
							<span class="">{{orderDatalist.orderInfo.remark}}</span>
							<p slot="content">{{orderDatalist.orderInfo.remark || "-" }}</p>
						</Tooltip>
          <!-- <div class="value">{{ orderDatalist.orderInfo.remark || "-" }}</div> -->
        </li>
      </ul>
    </div>
    <div
      class="section"
      v-if="orderDatalist.orderInfo.delivery_type === 'express'"
    >
      <div class="title">{{$t("page.common.user_nickname")}}</div>
      <ul class="list">
        <li class="item">
          <div>{{$t("page.common.delivery_type")}}：</div>
          <div class="value">
            {{ orderDatalist.orderInfo.delivery_name || "-" }}
          </div>
        </li>
        <li class="item">
          <div>{{$t("page.common.expressNo")}}：</div>
          <div class="value">
            {{ orderDatalist.orderInfo.delivery_id
            }}<span class="logisticsLook" @click="openLogistics">{{$t("page.common.search")}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div
      class="section"
      v-if="orderDatalist.orderInfo.delivery_type === 'send'"
    >
      <div class="title">{{$t("page.common.delivery_info")}}</div>
      <ul class="list">
        <li class="item">
          <div>{{$t("page.common.delivery_name")}}送货人姓名：</div>
          <div class="value">
            {{ orderDatalist.orderInfo.delivery_name || "-" }}
          </div>
        </li>
        <li class="item">
          <div>{{$t("page.common.delivery_phone")}}：</div>
          <div class="value">{{ orderDatalist.orderInfo.delivery_id }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getOrderInfo } from "@/api/order";

export default {
  name: "orderDetails",
  props: {
    id: {
      type: Number,
    },
  },
  data() {
    return {
      orderDatalist: [],
    };
  },
  watch: {
    id(val) {
      this.getOrderInfo();
    },
  },
  mounted() {
    this.getOrderInfo();
  },
  methods: {
    getOrderInfo() {
      getOrderInfo(this.id).then((res) => {
        this.orderDatalist = res.data;
      });
    },
  },
};
</script>

<style scoped lang="stylus">
ul, li {
  list-style: none;
}

.detail {
  padding: 30px;

  .section {
    border-bottom: 1px dashed #EEEEEE;
    padding: 25px 0;

    .title {
      font-size: 16px;
      color: #303133;
      margin-bottom: 16px;
      font-weight: 600;
    }

    .list {
      display: flex;
      flex-wrap: wrap;
      color: #606266;
      font-size: 14px;
      font-weight: 400;

      .item {
        display: flex;
        width: 30%;
        margin-bottom: 16px;
      }
      .item1 {
        display: flex;
        min-width: 50px;
        margin-bottom: 16px;
      }
      .item.mark{
        flex: 1;
      }
       .value {
        flex: 1;

        .image {
          display: inline-block;
          width: 40px;
          height: 40px;
          margin: 0 12px 12px 0;
          vertical-align: middle;
        }

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
