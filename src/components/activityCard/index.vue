<template>
  <div class="card">
    <div
      class="item"
      v-for="(item, index) in cardData"
      :key="index"
      @click="selectaActivity(item)"
    >
      <div class="img">
        <img :src="item.url" alt="" />
      </div>
      <div class="item-right">
        <div class="name">{{ item.name }}</div>
        <div class="num">
          共有 <span class="count"> {{ item.num }} </span>件商品
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { promotionsCount } from "@/api/order";

export default {
  name: "index",
  props: ["uid"],
  data() {
    return {
      cardData: [
        {
          url: require("@/assets/images/xszk.png"),
          name: "限时折扣",
          num: 0,
        },
        {
          url: require("@/assets/images/mjhd.png"),
          name: "满送活动",
          num: 0,
        },
        {
          url: require("@/assets/images/mjmz.png"),
          name: "满减满折",
          num: 0,
        },
        {
          url: require("@/assets/images/njnz.png"),
          name: "N件N折",
          num: 0,
        },
        {
          url: require("@/assets/images/mshd.png"),
          name: "秒杀活动",
          num: 0,
        },
        //   {
        //   url: require('@/assets/images/dpg.png'),
        //   name: '搭配购',
        //   num: 0
        // }
      ],
    };
  },
  created() {
    this.promotionsCount();
  },
  methods: {
    promotionsCount() {
      promotionsCount(this.uid || 0).then((res) => {
        // 限时折扣 满送 满减折   N件N折 秒杀  套餐
        let type = [
          "time_discount",
          "full_give",
          "full_discount",
          "n_piece_n_discount",
          "seckill",
        ];
        let resData = res.data;
        type.map((e, i) => {
          this.cardData[i].num = resData[e].count;
          this.cardData[i].type = resData[e].type;
        });
      });
    },
    selectaActivity(item) {
      this.$emit("selectaActivity", item.type);
    },
  },
};
</script>

<style lang="stylus" scoped>
.card {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-right 10px;
}
 .card:after {
    content: "";
    width: 32%;
  }
.item {
  display: flex;
  background: rgba(24, 144, 255, 0.04);
  border-radius: 10px;
  border: 1px solid #1890FF;
  padding: 24px 34px;
  width: 32%;
  min-width: 225px;
  height: 102px;
  margin: 2% 0% 0 0;
  cursor: pointer;

  .img {
    width: 54px;
    height: 54px;
    margin-right: 15px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .item-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .name {
      font-weight: bold;
      color: #000;
      font-size: 18px;
    }

    .num {
      color: #444444;
      font-size: 12px;

      .count {
        color: #1890FF;
      }
    }
  }
}
</style>
