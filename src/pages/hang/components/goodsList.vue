<script src="../../../../../crmeb_pro_admin/src/libs/util.cookies.js"></script>
<template>
  <div class="table">
    <div class="header">
      <div :class="item.class" v-for="(item,tindex) in header" :key="tindex">
        {{ item.name }}
      </div>
    </div>
    <div class="list" v-for="(l,index) in cartList" :key="index">
      <div class="activity" v-for="(p,pIndex) in  l.promotions" :key="pIndex">
        <div class="activity-type">
          {{ p.title }}
        </div>
        <div class="desc">
          {{ p.desc }}
        </div>
      </div>
      <div class="item" v-for="(list,indexs) in l.cart" :key="indexs+'l'">
        <div class="goods" v-if="!list.is_gift">
          <div class="img">
            <img v-if="list.productInfo.attrInfo" :src="list.productInfo.attrInfo.image" alt="">
            <img v-else :src="list.productInfo.image"/>
          </div>
          <div class="name line2">{{ list.productInfo.store_name }}</div>
        </div>
        <div class="o_price alc" v-if="!list.is_gift">{{ list.sum_price }}</div>
        <div class="num alc" v-if="!list.is_gift">{{ list.cart_num }}</div>
        <div class="price alc" v-if="!list.is_gift">{{ list.sum_price * list.cart_num }}</div>
        <div class="give-goods" v-else>
          <div class="img">
            <img v-if="list.productInfo.attrInfo" :src="list.productInfo.attrInfo.image" alt="">
            <img v-else :src="list.productInfo.image"/>
          </div>
          <div class="name line1">{{ list.productInfo.store_name }}</div>
          <div class="give">赠品</div>

          <div class="num">x{{ list.cart_num }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  props: ['cartList'],
  data() {
    return {
      header: [
        {
          name: '商品',
          class: 'goods',
          width: 15
        },
        {
          name: '单价',
          class: 'o_price',
        },
        {
          name: '数量',
          class: 'num',
          width: 15
        },
        {
          name: '金额',
          class: 'price',
          width: 15
        }
      ]
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

  .header {
    display flex
    background: #F5F5F5;
    border-radius: 10px 10px 0px 0px;
    padding: 14px 25px;
    color: #666666;
    font-size 14px
  }

  .list {
    border-bottom 1px solid #f2f2f2;
    .activity {
      display flex
      align-items center
      padding: 14px 0px;
      margin: 0px 25px;
      color: rgba(0, 0, 0, 0.85);
      border-bottom 1px solid #f2f2f2;
      .activity-type {
        border-radius: 3px;
        color: #F5222D;
        border: 1px solid #F5222D;
        padding: 0 5px;
        margin-right: 15px;
        font-size 12px
      }

      .desc {
        color: #333;
        font-size 14px
      }
    }
  }

  .goods {
    .store_name {
      flex 1
    }
  }

  .item {
    display: flex;
    padding: 14px 0px;
    margin: 0px 25px;
    border-bottom 1px solid #eee;
    font-size 14px

  }

  .item:nth-last-child(1) {
    border-bottom none;
  }

  .goods {
    width: 40%;
    display: flex;
    align-items center
    padding-right: 20px;

    .img {
      width: 54px;
      height: 54px;
      margin-right 15px

      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }

    }

    .name {
      max-width 80%
      color: rgba(0, 0, 0, 0.85);
    }
  }

  .give-goods {
    display: flex;
    align-items center

    .img {
      width: 24px;
      height: 24px;
      margin-right 15px

      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;

      }
    }

    .name {
      max-width 60%
    }

    .give {
      width: 30px;
      white-space nowrap
      color: #666666;
    }

    .num {
      margin-left 30px
    }
  }

  .o_price {
    width: 20%;
  }

  .num {
    width: 20%;
  }

  .price {
    width: 20%;
  }
}
</style>