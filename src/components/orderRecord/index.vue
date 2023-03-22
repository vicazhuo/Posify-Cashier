<template>
  <div class="table">
    <div class="header">
      <div :class="item.class" v-for="(item,index) in header" :key="index">
        {{ item.name }}
      </div>
    </div>
    <div class="item" v-for="(list,indexs) in orderStatusList" :key="indexs">
      <div class="goods">
        <div>{{ list.oid }}</div>
      </div>
      <div class="o_price alc">{{ list.change_message }}</div>
      <div class="num alc">{{ list.change_time }}</div>
    </div>
  </div>
</template>

<script>
import {getOrderStatusList} from "@api/order";

export default {
  name: "index",
  props: {
    id: {
      type: Number
    }
  },
  watch: {
    id(val) {
      this.getOrderStatusList()
    }
  },
  data() {
    return {
      header: [
        {
          name: '订单ID',
          class: 'goods',
          width: 15
        },
        {
          name: '操作记录',
          class: 'o_price',
        },
        {
          name: '操作时间',
          class: 'num',
          width: 15
        },
      ],
      orderStatusList:[]
    }
  },
  mounted() {
    console.log(this.id)
    this.getOrderStatusList()
  },
  methods: {
    getOrderStatusList() {
      getOrderStatusList(this.id).then(res => {
        this.orderStatusList = res.data
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.alc {
  display flex
  align-items: center;
}

.table {
  border 1px solid #eee;
  border-radius 10px
  margin: 30px;
  overflow-y scroll
  height: max-content;

  .header {
    display flex
    background: #F5F5F5;
    border-radius: 10px 10px 0px 0px;
    padding: 14px 25px;
    color: #666666;
    font-size 15px
  }

  .activity {
    display flex
    align-items center
    padding: 14px 0px;
    margin: 0px 25px;
    color: rgba(0, 0, 0, 0.85);

    border-bottom 1px solid #eee;

    .activity-type {
      border-radius: 3px;
      opacity: 0.5;
      border: 1px solid #F5222D;
      padding: 0 5px;
      margin-right: 15px;
    }
  }

  .item {
    display: flex;
    padding: 28px 0px;
    margin: 0px 25px;
    border-bottom 1px solid #eee;
    font-size 14px

  }

  .item:nth-last-child(1) {
    border-bottom none;
  }


  .goods {
    width: 30%;
    display: flex;
    align-items center

    img {
      width: 54px;
      height: 54px;
      margin-right 15px

      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }
  }

  .o_price {
    width: 40%;
  }

  .num {
    width: 30%;
  }
}
</style>