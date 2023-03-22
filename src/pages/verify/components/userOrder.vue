<template>
  <div class="order-user">
    <div class="sel-user">
      <div class="avatar">
        <img :src="selectData.avatar" alt="头像" />
      </div>
      <div class="item-right">
        <div class="user">
          <div>{{ selectData.nickname }}</div>
        </div>
        <div class="money">
          <div>
            <span class="pr20" v-if="selectData.phone">{{
              selectData.phone
            }}</span
            >{{$t("page.common.balance")}} <span class="num">{{ selectData.now_money || 0 }}</span>
          </div>
          <div>
            {{$t("page.common.redit")}} <span class="num">{{ selectData.integral || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="cart-num">
      <div class="cart-num-left">
        <span>{{$t("page.common.count")}}</span>
        <span class="num">{{ selectData.total_num }}</span>
        <span>{{$t("page.common.unitGodds")}}</span>
      </div>
    </div>
    <div class="goods-list">
      <!--      <goodsList></goodsList>-->
      <Table
        :columns="columns"
        ref="selection"
        :border="false"
        :data="writeOffData"
        :loading="loading"
        :no-data-text="$t('page.common.nonData')"
        @on-selection-change="selectOne"
        :no-filtered-data-text="$t('page.common.nonDataResult')"
      >
        <template slot-scope="{ row }" slot="image">
          <div class="product-data">
            <img class="image" :src="row.cart_info.productInfo.image" />
            <div class="name line2">
              <span class="is-gift" v-if="row.is_gift">{{$t('page.common.present')}}</span>
              {{ row.cart_info.productInfo.store_name }}
            </div>
          </div>
        </template>
        <template slot-scope="{ row }" slot="value">
          <div>{{ row.cart_info.productInfo.attrInfo.suk }}</div>
        </template>
        <template slot-scope="{ row }" slot="sellPrice">
          <div>
            {{
              row.cart_info.productInfo.attrInfo
                ? row.cart_info.productInfo.attrInfo.price
                : row.cart_info.productInfo.price
            }}
          </div>
        </template>
        <template slot-scope="{ row }" slot="price">
          <div>{{ row.cart_info.truePrice }}</div>
        </template>
        <template slot-scope="{ row }" slot="writeOff">
          <div v-if="row.is_writeoff !== null">
            <div v-if="row.is_writeoff">{{$t('page.common.verifyed')}}</div>
            <div
              v-else-if="row.surplus_num !== row.cart_num"
              style="color: #1890ff;"
            >
              {{$t('page.common.verifyed')}} {{ row.waite_num }} {{$t('page.common.piece')}}
            </div>
            <div v-else style="color: #F5222D;">{{$t('page.common.wait_verify')}}</div>
          </div>
        </template>
        <template slot-scope="{ row }" slot="cartNum">
          <div>{{ row.cart_info.cart_num }}</div>
        </template>
        <template slot-scope="{ row, index }" slot="surplus_num">
          <div class="surplus-num">
            <div
              class="operation reduce"
              :class="row.surplus_num <= 1 ? 'off' : ''"
              @click="reduce(row, index)"
            >
              <Icon type="md-remove-circle" />
            </div>
            <InputNumber
              :min="1"
              :disabled="row.surplus_num == 0"
              :max="row.numShow"
              v-model="row.surplus_num"
            ></InputNumber>
            <div
              class="operation add"
              :class="
                row.surplus_num === row.numShow || row.surplus_num < 1
                  ? 'off'
                  : ''
              "
              @click="add(row, index)"
            >
              <Icon type="md-add-circle" />
            </div>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import goodsList from "@/pages/hang/components/goodsList";
import { putWriteUpdate, writeCartList } from "@api/order";

export default {
  name: "userOrder",
  props: ["selectData", "orderNumId"],
  components: { goodsList },
  data() {
    return {
      writeOffData: [],
      writeOffItem: [],
      columns: [
        {
          type: "selection",
          width: 50,
          align: "center",
        },
        {
          title: $t('page.tabel.goods'),
          slot: "image",
          align: "left",
          minWidth: 150,
        },
        {
          title: $t('page.tabel.sku'),
          slot: "value",
          align: "left",
          minWidth: 90,
        },
        {
          title: $t('page.tabel.goods_price'),
          slot: "sellPrice",
          align: "left",
          minWidth: 60,
        },
        {
          title: $t('page.tabel.goods_discount'),
          slot: "price",
          align: "left",
          minWidth: 60,
        },
        {
          title: $t('page.tabel.status'),
          slot: "writeOff",
          align: "left",
          minWidth: 30,
        },
        {
          title: $t('page.tabel.total'),
          slot: "cartNum",
          align: "left",
          minWidth: 30,
        },
        {
          title:$t('page.tabel.wait_verify_quality'),
          slot: "surplus_num",
          align: "left",
          minWidth: 130,
        },
      ],
      selectDataList: [],
      loading: false,
      give_integral_img: require("@/assets/images/give_integral.png"),
      give_coupon_img: require("@/assets/images/give_coupon.png"),
    };
  },
  watch: {
    selectData: {
      handler: function(newV, oldV) {
        if (newV) {
          let data = {
            oid: newV.id,
          };
          if (newV.id) this.getWriteOff(data);
          // if(this.selectData.give_coupon.length){
          //   this.selectData.give_coupon.forEach(item=>{
          //     let couponObj = {
          //       info:{},
          //       is_gift:true,
          //       productInfo:{
          //         image:this.give_coupon_img,
          //         store_name:"优惠券",
          //       },
          //       sellPrice:"",
          //       sum_price:"-",
          //       cart_num:"-",
          //       sum_true_price:""
          //     }
          //     this.writeOffData.push(couponObj)
          //   })
          // }
        }
      },
      deep: true,
    },
  },
  mounted() {
    let data = {
      oid: this.selectData.id,
    };
    if (this.selectData.id) this.getWriteOff(data);
  },
  methods: {
    // 减核销数量
    reduce(row, index) {
      if (row.surplus_num > 1) row.surplus_num--;
      this.writeOffData[index].surplus_num = row.surplus_num;
      this.selectDataList.forEach((v) => {
        if (v.id === row.id) {
          v.surplus_num = row.surplus_num;
        }
      });
    },
    add(row, index) {
      if (row.numShow > row.surplus_num) row.surplus_num++;
      this.writeOffData[index].surplus_num = row.surplus_num;
      this.selectDataList.forEach((v) => {
        if (v.id === row.id) {
          v.surplus_num = row.surplus_num;
        }
      });
    },
    getVerifyData() {
      if (!this.selectDataList.length)
        return this.$Message.error($t('page.messages.choose_verify_goods'));
      let cartIds = [];
      this.selectDataList.forEach((v) => {
        cartIds.push({
          cart_id: v.cart_id,
          cart_num: v.surplus_num,
        });
      });
      // putWriteUpdate(this.orderNumId, {'cart_ids': cartIds}).then(res => {
      //   this.$Message.success(res.msg);
      //   this.modals = false;
      //   this.$refs.selection.selectAll(false);
      //   this.$emit('getVerifyData')
      // }).catch(err => {
      //   this.$Message.error(err.msg);
      // })
    },
    remarks() {
      this.$emit("remarks");
    },
    cancel() {
      this.$refs.selection.selectAll(false);
    },
    selectOne(data) {
      data.forEach((item) => {
        this.writeOffData.forEach((j) => {
          if (item.id == j.id) {
            item.surplus_num = j.surplus_num;
          }
        });
      });
      this.selectDataList = data;
      this.$emit("selectData", data);
    },
    // 核销列表
    getWriteOff(data) {
      writeCartList(data)
        .then((res) => {
          let data = res.data.cart_info;
          data.forEach((item) => {
            item.numShow = item.surplus_num;
            item.waite_num = item.cart_num - item.surplus_num;
            if (item.is_writeoff) {
              item._disabled = true;
            }
          });
          this.writeOffData = data;
          //如果赠送了积分，就组装一个商品对象让积分展示在商品列表里，
          //我很不理解，但还是按照要求做了
          //下面的优惠券也是一样，遍历赠送的优惠券数组，push到商品列表，让优惠券也像商品一样展示
          if (this.selectData.give_integral) {
            this.writeOffData.push({
              image: {},
              is_gift: true,
              cart_info: {
                productInfo: {
                  image: this.give_integral_img,
                  store_name: `赠送${this.selectData.give_integral}积分`,
                  attrInfo: {
                    price: "-",
                    suk: "-",
                  },
                },
                truePrice: "-",
                cart_num: "-",
              },
              is_writeoff: null,
              value: "",
              sellPrice: "",
              price: "",
              writeOff: "",
              sum_price: "-",
              cart_num: "-",
              surplus_num: null,
            });
          }
          if (this.selectData.give_coupon.length) {
            this.selectData.give_coupon.forEach((item) => {
              let couponObj = {
                image: {},
                is_gift: true,
                cart_info: {
                  productInfo: {
                    image: this.give_coupon_img,
                    store_name: item.coupon_title,
                    attrInfo: {
                      price: "-",
                      suk: "-",
                    },
                  },
                  truePrice: "-",
                  cart_num: "-",
                },
                is_writeoff: null,
                value: "",
                sellPrice: "",
                price: "",
                writeOff: "",
                sum_price: "-",
                cart_num: "-",
                surplus_num: null,
              };
              this.writeOffData.push(couponObj);
            });
          }
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
  },
};
</script>

<style lang="stylus" scoped>
.order-user {
  height: 100%;
}

.sel-user {
  display: flex;
  align-items center
  background-color #FFF8F2
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
      border-radius 50%
    }
  }

  .item-right {
    flex 1

    .user {
      font-size 18px
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }

    .money {
      display: flex;
      align-items: flex-end;
      font-weight: 400;
      color: rgba(51, 51, 51, 0.85);
      font-size 12px

      .num {
        font-weight: 600;
        color: #F5222D;
        font-size 17px
        padding-right: 20px;
      }

      .pr20 {
        padding-right: 20px;
      }
    }
  }
}

.cart-num {
  display flex
  justify-content space-between
  font-weight: 500;
  align-items: flex-end;
  padding: 0 30px;
  margin 0px 0 30px 0

  .cart-num-left {
    color: #303133;
    font-size 16px;

    .num {
      color: #FF7700;
    }
  }

  .money {
    color: #F5222D;
    font-size 24px
    font-weight bold
  }
}

.goods-list {
  padding: 0 30px;

  /deep/ table {
    width: 100% !important;
  }

  /deep/ .ivu-table {
    border 1px solid #f2f2f2;
    border-bottom: none;
  }
}


.product-data {
  display: flex;
  align-items: center;
  padding-right: 10px;
}

.product-data .name {
  line-height: 1.4;
  text-align: left;
  margin-left: 5px;
  .is-gift {
    font-size: 12px;
    border: 1px solid #f5222d;
    background: #f5222d;
    color: #fff;
    padding: 0px 4px;
    border-radius: 3px;
  }
}

.product-data .image {
  width: 50px !important;
  height: 50px !important;
  margin-right 5px
  border-radius 5px
}

.surplus-num {
  display: flex;
  align-items center

  /deep/ .ivu-input-number {
    width: 50px;
    border none
  }

  /deep/ .ivu-input-number-input {
    text-align center
  }

  /deep/ .ivu-input-number-handler-wrap {
    display: none;
  }

  .operation {
    margin: 0 5px;
    font-size 28px
    color: #000;
  }

  .operation.off {
    color: #EEEEEE;
  }

  .reduce {
    color: #1890FF;
  }

  .add {
    color: #1890FF;
  }
}
</style>
