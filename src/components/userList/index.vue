<template>
  <div style="width: 100%;background-color: #fff;padding-bottom: 19px;">
    <Row>
      <Col class="mb10 ml10">
        <Input v-model="userFrom.keyword" element-id="nickname" enter-button placeholder="请输入ID或者手机号"
               search style="width: 500px" @on-search="orderSearch">
        </Input>
      </Col>
    </Row>
    <div v-if="dataList.length" class="store-people" @scroll="getList">
      <div class="store-list">
        <div v-for="(item, index) in dataList" :key="index" :class="uid === item.uid ? 'on' : ''" class="item"
             @click="selectStore(item)">
          <span v-if="item.delete_time" class="del">已注销</span>
          <div class="avatar">
            <img :src="item.avatar" alt="">
          </div>
          <div class="msg">
            <div class="msg-top">
              <span class="name">{{ item.nickname }}</span>
              <span class="id">(id:{{ item.uid }})</span>
            </div>
            <div class="msg-mid">
              手机号:{{ item.phone || '无' }}
            </div>
            <div class="msg-btn">
              <span>类型:{{ item.user_type || '无' }}</span>
              <span class="now-money">
                余额:{{ item.now_money }}
              </span>

            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-cump">
      <img alt="" src="../../assets/images/no-user.png">
      <span class="trip">噢噢～目前暂无用户</span>
    </div>
  </div>
</template>

<script>
import {
  userListApi,
  usersearchApi
} from "@/api/user"

export default {
  name: 'userList',
  props: ['uid'],
  data() {
    return {
      total: 0,
      userFrom: {
        keyword: "",
        page: 1,
        limit: 12,
        field_key: "all",
      },
      loading: false,
      dataList: [],
      currentid: 0,
      columns: [
        {
          title: "ID",
          key: "uid",
          width: 80,
        },
        {
          title: "头像",
          slot: "avatars",
          minWidth: 50,
        },
        {
          title: '昵称',
          key: 'nickname',
          minWidth: 70
        },
        {
          title: "手机号",
          key: "phone",
          minWidth: 70,
        },
        {
          title: "用户类型",
          key: "user_type",
          minWidth: 70,
        },
        {
          title: "余额",
          key: "now_money",
          sortable: 'custom',
          minWidth: 70,
        }
      ],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    selectStore(item) {
      if (item.delete_time) {
        this.$Message.error('用户已注销')
      } else {
        this.$emit("getUserId", item);
      }
    },
    // 排序
    sortChanged(e) {
      this.userFrom[e.key] = e.order;
      this.getList();
    },
    //用户列表
    getList(e) {
      if (!e || (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 0 && this.dataList.length < this.total)) {
        this.loading = true
        userListApi(this.userFrom).then(res => {
          this.loading = false
          this.total = res.data.count
          this.dataList = this.dataList.concat(res.data.list)
          // this.dataList = res.data.list
          if (this.dataList.length < res.data.count) this.userFrom.page++
        }).catch(err => {
          this.loading = false
          this.$Message.error(err.msg)
        })
      }

    },
    usersearchList() {
      this.loading = true
      usersearchApi(this.userFrom).then(res => {
        this.dataList = res.data.list
        this.total = res.data.count
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$Message.error(err.msg)
      })
    },
    //搜索
    orderSearch() {
      this.userFrom.page = 1;
      this.dataList = []
      this.getList()
    },
    // cancel(){
    //     this.currentid = 0
    // },
    pageChange(page) {
      this.userFrom.page = page;
      this.getList()

      // if (this.userFrom.keyword == '') {
      // } else {
      //   this.usersearchList()
      // }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ivu-table {
  // height: 330px;
  // overflow-x: hidden;
  // overflow-y: auto;
}

/deep/ .ivu-table-overflowX {
  overflow-x: hidden !important;
}

.tabBox_img {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }
}

.store-people::-webkit-scrollbar {
  width: 0 !important
}

.store-people {
  -ms-overflow-style: none;
}

.store-people {
  overflow: -moz-scrollbars-none;
}

.store-people {

  min-height: 300px;
  max-height: 400px;
  overflow-y: scroll;

  .store-list {
    display: flex;
    flex-wrap: wrap;


    .item {
      cursor: pointer;
      display: flex;
      width: 31.33%;
      background: #F5F5F5;
      border-radius: 10px;
      margin: 1%;
      height: max-content;
      padding: 15px 20px;
      color: #000000;
      position: relative;
      overflow: hidden;

      .del {
        position: absolute;
        right: 0;
        top: 0;
        padding: 3px 5px;
        font-size: 12px;
        background-color: #f5222d;
        color: #fff;
        font-weight: bold;
        border-radius: 0 0 0 10px;
      }

      .avatar {
        width: 50px;
        height: 50px;
        margin-right: 12px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .msg {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 80px;

        .msg-top {

          .name {
            font-size: 16px;
            font-weight: 600;
            padding-right: 12px;
            white-space: nowrap;
          }

          .id {
            color: #999999;
            font-size: 12px;
          }
        }

        .msg-mid {
          color: rgba(0, 0, 0, 0.85);
          font-size: 13px;
          padding: 10px 0 10px 0;
        }

        .msg-btn {
          color: rgba(0, 0, 0, 0.85);
          font-size: 13px;
          white-space: nowrap;

          .now-money {
            white-space: nowrap;
            padding-left: 10px;
          }
        }
      }
    }

    .item.on {
      color: #fff !important;
      background-color: #1890FF;

      .msg .id,
      .msg-btn,
      .msg-mid {
        color: #fff;
      }
    }
  }

}

.no-cump {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding: 50px 0;

  img {
    width: 180px;
    height: 140px;
  }

  .trip {
    margin-top: 20px;
    color: #999999;
    font-size: 14px;
  }
}
</style>
