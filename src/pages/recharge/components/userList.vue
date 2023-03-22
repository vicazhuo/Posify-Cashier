<template>
  <div class="pending-user" @scroll="userListApi">
    <div class="list" :class="selIndex === index?'bor':''" v-for="(item,index) in userList" :key="index"
         @click="selectUser(item,index)">
      <div class="item">
        <div class="avatar">
          <img :src="item.avatar" alt="头像">
        </div>
        <div class="item-right">
          <div class="user">
            <div class="name">{{ item.nickname || '游客' }}</div>
            <div class="time">余额：
              
              <span class="now-money">
                {{ item.now_money }}
              </span></div>
          </div>
          <div class="money">
            <div>手机号： <span class="num">{{ item.phone || '暂无' }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "orderList",
  props: {
    userList: {
      type: Array
    },
    total:{
      type:Number
    }
  },
  data() {
    return {
      selIndex: 0
    }
  },
  methods: {
    userListApi(e) {
      if (!e || (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 0 && this.userList.length < this.total)) {
        this.$emit('addPage')
      } else {
        return
      }
    },
    selectUser(item, index) {
      this.selIndex = index
      this.$emit('selectUser', item)
    }
  }
}
</script>

<style scoped lang="stylus">
.pending-user::-webkit-scrollbar { width: 0 !important }
.pending-user { -ms-overflow-style: none; }
.pending-user { overflow: -moz-scrollbars-none; }
.pending-user {
  width: 100%;
  height: calc(100% - 96px);
  overflow hidden;
  overflow-y scroll
  .list {
    padding: 15px 18px;
    cursor pointer
  }

  .bor {
    background: #F3F9FF;
    border none
    border-radius: 6px;
  }

  .item {
    display: flex;
    align-items center
    font-size 16px
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
      height: 46px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .user {
        display: flex;
        justify-content: space-between;
        .name {
          font-weight: bold;
          font-size 16px
          color: rgba(0, 0, 0, 0.85);
        }

        .time {
          font-size 14px
          font-weight: 400;
          color: rgba(102, 102, 102, 0.85);
          .now-money{
            color: #F5222D;
          }
        }
      }

      .money {
        display: flex;
        justify-content: space-between;
        color: #000;
        line-height: 14px;
        font-size 14px
        .num {
          color: #F5222D;
        }
      }
    }
  }
}
</style>