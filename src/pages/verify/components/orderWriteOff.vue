<template>
  <Modal v-model="modals" scrollable :title="$t('page.common.verifyOrder')" width="1000" class="order_box" @on-cancel="cancel" footer-hide>
    <Card :bordered="false" dis-hover>
      <Table :columns="columns" border ref="selection" :data="writeOffData" :loading="loading" :no-data-text="$t('page.common.nonData')"
             highlight-row @on-selection-change="selectOne" :no-filtered-data-text="$t('page.common.nonDataResult')">
        <template slot-scope="{ row, index }" slot="image">
          <div class="product-data">
            <img class="image" :src="row.cart_info.productInfo.image"/>
            <div class="name line2">
              {{ row.cart_info.productInfo.store_name }}
            </div>
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="value">
          <div>{{ row.cart_info.productInfo.attrInfo.suk }}</div>
        </template>
        <template slot-scope="{ row, index }" slot="sellPrice">
          <div>{{
              row.cart_info.productInfo.attrInfo ? row.cart_info.productInfo.attrInfo.price : row.cart_info.productInfo.price
            }}
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="price">
          <div>{{ row.cart_info.truePrice }}</div>
        </template>
        <template slot-scope="{ row, index }" slot="writeOff">
          <div v-if="row.is_writeoff">{{$t('page.common.verifyed')}}</div>
          <div v-else style="color: #F5222D;">{{$t('page.common.wait_verify')}}</div>
        </template>
        <template slot-scope="{ row, index }" slot="cartNum">
          <div>{{ row.cart_info.cart_num }}</div>
        </template>
      </Table>
      <Button type="primary" @click="submitWriteOff">{{$t('page.common.sureVerify')}}</Button>
    </Card>
  </Modal>
</template>

<script>
import {writeCartList, putWriteUpdate} from '@api/order';

export default {
  name: 'orderRecord',
  props: {
    orderNumId: String
  },
  data() {
    return {
      modals: false,
      loading: false,
      writeOffData: [],
      writeOffItem: [],
      columns: [{
        type: "selection",
        width: 50,
        align: "center",
      },
        {
          title: $t('page.common.goods'),
          slot: "image",
          align: "center",
          minWidth: 150,
        },
        {
          title: $t('page.tabel.sku'),
          slot: "value",
          align: "center",
          minWidth: 90,
        },
        {
          title: $t('page.tabel.goods_price'),
          slot: "sellPrice",
          align: "center",
          minWidth: 60,
        },
        {
          title: $t('page.tabel.goods_discount'),
          slot: "price",
          align: "center",
          minWidth: 60,
        },
        {
          title: $t('page.tabel.status'),
          slot: "writeOff",
          align: "center",
          minWidth: 30,
        },
        {
          title: $t('page.tabel.total'),
          slot: "cartNum",
          align: "center",
          minWidth: 30,
        },
        {
          title: $t('page.tabel.wait_verify_quality'),
          slot: "surplus_num",
          align: "center",
          minWidth: 130,
          render: (h, params) => {
            return h("div", [
              h("InputNumber", {
                props: {
                  min: 1,
                  max: params.row.numShow,
                  value: params.row.surplus_num || 1,
                  disabled: params.row.is_writeoff ? true : false
                },
                on: {
                  "on-change": (e) => {
                    params.row.surplus_num = e || 1;
                    if (this.writeOffItem.length) {
                      this.writeOffItem.forEach((item) => {
                        if (item.id == params.row.id) {
                          item.surplus_num = params.row.surplus_num
                        } else {
                          this.writeOffItem.push(params.row)
                        }
                      })
                    } else {
                      this.writeOffItem.push(params.row)
                    }
                    this.selectData.forEach((v, index) => {
                      if (v.cart_id === params.row.cart_id) {
                        this.selectData.splice(index, 1, params
                            .row);
                      }
                    });
                  },
                },
              }),
            ]);
          },
        }
      ],
      selectData: []
    }
  },
  mounted() {
  },
  methods: {
    cancel() {
      this.$refs.selection.selectAll(false);
    },
    selectOne(data) {
      data.forEach((item) => {
        this.writeOffItem.forEach((j) => {
          if (item.id == j.id) {
            item.surplus_num = j.surplus_num
          }
        })
      })
      this.selectData = data;
    },
    // 核销列表
    getWriteOff(data) {
      writeCartList(data).then(res => {
        let data = res.data.cart_info;
        data.forEach((item) => {
          item.numShow = item.surplus_num
          if (item.is_writeoff) {
            item._disabled = true
          }
        })
        this.writeOffData = data;
      }).catch(err => {
        this.$Message.error(err.msg);
      })
    },
    submitWriteOff() {
      if (!this.selectData.length) {
        return this.$Message.error($t('page.messages.choose_verify_goods'));
      }
      let cartIds = []
      this.selectData.forEach((v) => {
        cartIds.push({
          cart_id: v.cart_id,
          cart_num: v.surplus_num,
        });
      });
      putWriteUpdate(this.orderNumId, {'cart_ids': cartIds}).then(res => {
        this.$Message.success(res.msg);
        this.modals = false;
        this.$refs.selection.selectAll(false);
        this.$emit("submitSuccess");
      }).catch(err => {
        this.$Message.error(err.msg);
      })
    }
  }
}
</script>

<style scoped lang="stylus">
/deep/ .ivu-table {
  max-height: 400px;
  overflow-x: hidden !important;
  overflow-y: auto !important;
}

/deep/ .ivu-table-overflowX {
  overflow-x: hidden !important;
}

.order_box /deep/ .ivu-btn {
  display: block;
  margin: 20px auto 0 auto;
  padding: 0 50px;
}

.order_box >>> .ivu-table th {
  background: #f8f8f9 !important;
}

.product-data {
  display: flex;
  align-items: center;
}

.product-data .name {
  line-height: 1.4;
  text-align: left;
  margin-left: 5px;
}

.product-data .image {
  width: 50px !important;
  height: 50px !important;
}
</style>
