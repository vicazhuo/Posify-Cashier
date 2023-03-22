<template>
  <div>
    <Modal v-model="modals" scrollable footer-hide closable title="商品规格" :mask-closable="false" width="600">
      <div class="productAttr">
        <div>
          <div class="header">
            <div class="pictrue">
              <img :src="attr.productSelect.image"/>
            </div>
            <div class='text'>
              <div class="name line1">{{ attr.productSelect.store_name }}</div>
              <div class="info">{{ $t("page.home.stock") }} {{ attr.productSelect.stock }}</div>
              <div class="money">¥<span class="num">{{ attr.productSelect.price }}</span></div>
            </div>
          </div>
          <div class="attr">
            <div class="list" v-for="(item, indexw) in attr.productAttr" :key="indexw">
              <div class="title">{{ item.attr_name }}</div>
              <div class="listn acea-row">
                <div class="item acea-row row-center-wrapper"
                     :class="item.index === itemn.attr ? 'on' : ''"
                     v-for="(itemn, indexn) in item.attr_value" @click="tapAttr(indexw, indexn)"
                     :key="indexn">{{ itemn.attr }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <button type="primary" :disabled="disabled" class="bnt acea-row row-center-wrapper" @click="goCat">{{isSkill?'立即购买': '确定' }}</button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'productAttr',
  props: {
    attr: {
      type: Object,
      default: () => {
      }
    },
    isCart: {
      type: Number,
      value: 0
    },
    disabled: {
      type: Boolean,
      value: false
    },
    isSkill: {
      type: Boolean,
      value: false
    }
  },
  data() {
    return {
      modals: false
    }
  },
  created() {
  },
  methods: {
    goCat: function () {
      this.$emit('goCat', this.isCart);
    },
    tapAttr: function (indexw, indexn) {
      let that = this;
      that.$emit("attrVal", {
        indexw: indexw,
        indexn: indexn
      });
      this.$set(this.attr.productAttr[indexw], 'index', this.attr.productAttr[indexw].attr_values[indexn]);
      let value = that
          .getCheckedValue()
          .join(",");
      that.$emit("ChangeAttr", value);
    },
    //获取被选中属性；
    getCheckedValue: function () {
      let productAttr = this.attr.productAttr;
      let value = [];
      for (let i = 0; i < productAttr.length; i++) {
        for (let j = 0; j < productAttr[i].attr_values.length; j++) {
          if (productAttr[i].index === productAttr[i].attr_values[j]) {
            value.push(productAttr[i].attr_values[j]);
          }
        }
      }
      return value;
    }
  }
}
</script>

<style lang="stylus" scoped>
::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px #eee;
}

::-webkit-scrollbar {
  width: 4px !important;
  /*对垂直流动条有效*/
}

/deep/ .ivu-modal-header {
  background-color #fff

}

/deep/ .ivu-modal {
  border-radius 8px;
  overflow hidden;
}

.productAttr {
  .header {
    display: flex;
    flex-wrap nowrap
    width: 100%;
  }

  .pictrue {
    width: 116px;
    height: 116px;
    margin-right: 20px;

    img {
      width: 100%;
      height: 100%;
      border-radius 10px;
    }
  }

  .text {
    width: 70%;
    display: flex;
    flex-direction column
    justify-content: space-between;
  }

  .bnt {
    width: 100%;
    height: 36px;
    background: #1890FF;
    font-size: 12px;
    color: #fff;
    border-radius: 4px;
    margin: 20px auto 0;
    cursor: pointer;
    border: none;
  }

  .attr {
    height: 300px;
    overflow-x: hidden;
    overflow-y: scroll;

  }

  .list {
    .title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 16px;
      font-weight: bold;
      margin-top: 14px;
    }

    .listn {
      .item {
        min-width: 158px;
        line-height:20px;
        background: #F5F5F5;
        border-radius: 6px;
        color: #666666;
        font-size 14px
        margin-top: 10px;
        margin-right: 10px;
        cursor: pointer;
        padding: 10px 6px;

        &.on {
          background: #1890FF;
          color: #fff;
        }
      }
    }
  }

  .name {
    color: #000;
    font-size: 18px;
    font-weight: 400;
  }

  .info {
    font-size: 13px;
    color: #999999;
    margin: 8px 0 6px 0;
  }

  .money {
    font-size: 18px;
    color: #F5222D;
    width: 100%;
    font-weight: bold;

    .num {
      font-size: 21px;
    }
  }
}
/deep/.ivu-modal-body{
  padding:25px !important;
}
</style>
