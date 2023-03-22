<template>
  <div class="order-user">
    <div class="sel-user">
      <div class="avatar">
        <img
          :src="selectData.avatar ? selectData.avatar : defaultAvatar"
          alt="头像"
        />
      </div>
      <div class="item-right">
        <div class="user">
          <div>{{ selectData.nickname }}</div>
        </div>
        <div class="money">
          <div>
            <span class="pr20" v-if="selectData.phone">{{ selectData.phone }}</span
            >余额 <span class="num">{{ selectData.now_money || 0 }}</span>
          </div>
          <div>
            积分 <span class="num">{{ selectData.integral || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="cart-num">
      <div class="cart-num-left">
        <span>共</span>
        <span class="num">{{ selectData.total_num }}</span>
        <span>件商品</span>
      </div>
    </div>
    <div class="goods-list">
      <Table
        :columns="columns"
        :data="tableList"
        class="ivu-mt"
        :loading="loading"
        no-data-text="暂无数据"
        highlight-row
        no-filtered-data-text="暂无筛选结果"
      >
        <template slot-scope="{ row }" slot="info">
          <div class="tabBox">
            <div class="tabBox_img" v-viewer>
              <img
                v-lazy="
                  row.productInfo.attrInfo
                    ? row.productInfo.attrInfo.image
                    : row.productInfo.image
                "
              />
            </div>
            <span class="tabBox_tit line2">
              <span class="is-gift" v-if="row.is_gift">赠品</span>
              {{ row.productInfo.store_name + " | "
              }}{{
                row.productInfo.attrInfo ? row.productInfo.attrInfo.suk : ""
              }}
            </span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="price">
          <div class="tabBox">
            {{ row.sum_price * row.cart_num }}
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import goodsList from "@/pages/hang/components/goodsList";

export default {
  name: "userOrder",
  props: ["selectData", "canSend"],
  components: { goodsList },
  data() {
    return {
      columns: [
        {
          title: "商品信息",
          slot: "info",
          minWidth: 250,
        },
        {
          title: "单价",
          key: "sum_price",
          minWidth: 80,
        },
        {
          title: "数量",
          key: "cart_num",
          minWidth: 50,
        },
        {
          title: "金额",
          slot: "price",
          minWidth: 50,
        },
      ],
      tableList: [],
      loading: false,
      defaultAvatar: require("@/assets/images/yonghu.png"),
    };
  },
  watch: {
    selectData: {
      handler(nel) {
        this.tableList = [];
        let tab = Object.values(this.selectData._info);
        tab.map((i) => {
          this.tableList.push(i.cart_info);
        });
      },
      deep: true,
    },
  },
  created() {
    if (this.selectData._info) {
      let tab = Object.values(this.selectData._info);
      tab.map((i) => {
        this.tableList.push(i.cart_info);
      });
    }
  },
  methods: {},
};
</script>

<style lang="stylus" scoped>
.order-user {
  height: 100%;
}

.sel-user {
  display: flex;
  align-items: center;
  background-color: #FFF8F2;
  margin: 30px;
  padding: 18px;
  border-radius: 10px;

  .avatar {
    width: 46px;
    height: 46px;
    margin-right: 16px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .item-right {
    flex: 1;

    .user {
      font-size: 18px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }

    .money {
      display: flex;
      align-items: flex-end;
      font-weight: 400;
      color: rgba(51, 51, 51, 0.85);
      font-size: 12px;

      .num {
        font-weight: 600;
        color: #F5222D;
        font-size: 17px;
        padding-right: 20px;
      }

      .refund-price {
      }

      .pr20 {
        padding-right: 20px;
      }
    }
  }
}

.cart-num {
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  align-items: flex-end;
  padding: 0 30px;

  .cart-num-left {
    color: #303133;
    font-size: 16px;

    .num {
      color: #FF7700;
    }
  }

  .money {
    color: #F5222D;
    font-size: 24px;
    font-weight: bold;
  }
}

.goods-list {
  padding: 0 30px;

  /deep/ table {
    width: 100% !important;
  }

  /deep/ .ivu-table {
    border: 1px solid #f2f2f2;
    border-bottom: none;
  }

  .tabBox {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;

    .tabBox_img {
      width: 36px;
      height: 36px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .tabBox_tit {
      width: 60%;
      font-size: 12px !important;
      margin: 0 2px 0 10px;
      letter-spacing: 1px;
      box-sizing: border-box;

      .is-gift {
        font-size: 12px;
        border: 1px solid #f5222d;
        background: #f5222d;
        color: #fff;
        padding: 0px 4px;
        border-radius: 3px;
      }
    }
  }
}
</style>