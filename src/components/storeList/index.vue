<template>
  <div>
    <Modal v-model="modals" scrollable footer-hide closable title="店员列表" :mask-closable="false" width="900"
           @on-cancel="cancel">
      <Row class="mb10">
        <Col>
          <Input v-model="userFrom.keyword" placeholder="请输入用户名称/ID/手机号" element-id="nickname"
                 style="width: 500px" @on-search="storeSearch" search enter-button>
          </Input>
        </Col>
      </Row>
      <div v-if="dataList.length" class="store-people" @scroll="getList">
        <div class="store-list">
          <div class="item" :class="id === item.id?'on':''" v-for="(item,index) in dataList" :key="index"
               @click="selectStore(item)">
            <div class="avatar">
              <img :src="item.avatar" alt="">
            </div>
            <div class="msg">
              <div class="msg-top">
                <span class="name">{{ item.staff_name }}</span>

                <span class="id">(id:{{ item.id }})</span>
              </div>
              <div class="msg-btn">
                手机号:{{ item.phone }}
              </div>
            </div>
          </div>
        </div>

      </div>
      <div v-else class="no-cump">
        <img src="../../assets/images/no-staff.png" alt="">
        <span class="trip">sorry～目前暂无店员</span>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  cashierList
} from "@/api/user"
import {userListApi} from "@api/user";

export default {
  name: 'userList',
  props: {
    storeInfo: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      id: 0,
      modals: false,
      total: 0,
      userFrom: {
        keyword: "",
        page: 1,
        limit: 12
      },
      loading: false,
      dataList: [],
      currentid: '',
      search: false
    }
  },
  created() {
    this.getList()
  },
  watch: {
    'storeInfo'(val, oldVal) {
      this.id = val.id;
    }
  },
  methods: {
    selectStore(item) {
      this.modals = false;
      this.$emit("getStoreId", item);
    },
    //用户列表
    getList(e, name) {
      this.loading = true
      if (!e || (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 0 && this.dataList.length < this.total)) {
        cashierList(this.userFrom).then(res => {
          this.loading = false
          this.total = res.data.count;
          let dataList = res.data.staffList;
          let userInfo = res.data.staffInfo;
          this.dataList = dataList;
          if (this.search || !e) {
            this.$emit("getUserInfo", {
              'users': userInfo,
              'storeList': dataList
            });
            this.search = false
          }
        }).catch(err => {
          this.loading = false
          this.$Message.error(err.msg)
        })
      }
    },
    //搜索
    storeSearch() {
      this.userFrom.page = 1;
      this.search = true
      this.getList()
    },
    cancel() {
      this.currentid = ''
    },
    pageChange(page) {
      this.userFrom.page = page;
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ivu-table {
  height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
}

/deep/ .ivu-table-overflowX {
  overflow-x: hidden !important;
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
      display: flex;
      align-items: center;
      width: 258px;
      height: 92px;
      background: #F5F5F5;
      border-radius: 10px;
      margin: 0 20px 20px 0;
      padding: 21px 20px;
      color: #000000;
      cursor: pointer;

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
        .msg-top {
          .name {
            font-size: 16px;
            font-weight: 600;
          }

          .id {
            padding-left: 12px;
            color: #999999;
            font-size: 12px;
          }
        }

        .msg-btn {
          color: rgba(0, 0, 0, 0.85);
          font-size: 13px;
        }
      }
    }

    .item.on {
      color: #fff !important;
      background-color: #1890FF;

      .msg .id, .msg-btn {
        color: #fff;
      }
    }
  }

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
    margin-bottom: 20px;
  }

  .trip {
    color: #999999;
    font-size: 14px;
  }
}
</style>
