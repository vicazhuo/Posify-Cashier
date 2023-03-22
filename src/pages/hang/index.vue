<template>
  <div class="content">
    <div class="goodsCard acea-row row-between">
      <div class="conter">
        <div class="cart">
          <Input search :enter-button="$t('page.common.search')" v-model="lodgeFrom.keyword" :placeholder="$t('page.tips.userConnect')" @on-search="searchData" size="large"
          />
        </div>
        <div class="pending-user" v-if="tableHang.length" @scroll="addPage">
          <div
            class="list"
            :class="selIndex === index ? 'bor' : ''"
            v-for="(item, index) in tableHang"
            :key="index"
            @click="selectUser(index, item)"
          >
            <div class="item row-between">
              <div class="left_content acea-row">
                <div class="avatar">
                  <img
                    :src="item.avatar ? item.avatar : defaultAvatar"
                    alt="头像"
                  />
                </div>
                <div class="user">
                  <div class="name">{{ item.nickname || "游客" }}</div>
                  <div class="order-price">
                    {{ $t("page.order.orderPrice") }}：
                    <span class="price-num">￥{{ item.price }}</span>
                  </div>
                </div>
              </div>
              <div class="right_content">
                <div class="time">{{ item._add_time }}</div>
                <div class="acea-row row-right">
                  <span
                    type="text"
                    class="tidan"
                    @click.stop="billHang(item, index)"
                    >{{ $t("page.home.pickup") }}</span
                  >
                  <span
                    type="text"
                    class="shanchu"
                    @click.stop="hangDel(item, index)"
                    >{{ $t("page.common.delete") }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-order">
          <img src="../../assets/images/no-order.png" alt="" />
          <span class="trip">{{ $t("page.home.nonPickup") }}</span>
        </div>
      </div>
      <div class="goods" v-if="cartList.length">
        <div class="sel-user">
          <div class="avatar">
            <img
              :src="
                userData.avatar || require('../../assets/images/tourist.png')
              "
              alt="头像"
            />
          </div>
          <div class="item-right">
            <div class="user">
              <div>{{ userData.nickname || "游客" }}</div>
            </div>
            <div class="money" v-if="userData.uid">
              <div>
                <span class="pr20">{{ userInfo.phone || "暂无手机号" }}</span
                >余额 <span class="num">{{ userInfo.now_money || 0 }}</span>
              </div>
              <div>
                积分 <span class="num">{{ userInfo.integral || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="cart-num">
          <div class="cart-num-left">
            <span>{{ $t("page.home.sum") }}</span>
            <span class="num">{{ cartSum }}</span>
            <span>件商品</span>
          </div>
          <div>
            <span class="text">{{ $t("page.order.netPay") }}：</span>
            <span class="money"
              ><span class="rmb">¥</span
              >{{ priceInfo.payPrice ? priceInfo.payPrice : 0 }}</span
            >
          </div>
        </div>
        <div class="goods-list">
          <goodsList :cartList="cartList"></goodsList>
          <div class="discount-con">
            <div class="item acea-row">
              <div>{{ $t("page.home.memberShipDiscount") }}：</div>
              <div>{{ priceInfo.vipPrice || 0 }}</div>
            </div>
            <div class="item acea-row">
              <div>{{ $t("page.home.payByCoupon") }}：</div>
              <div>{{ priceInfo.couponPrice || 0 }}</div>
            </div>
            <div class="item acea-row">
              <div>{{ $t("page.home.payByScore") }}：</div>
              <div>{{ priceInfo.deductionPrice || 0 }}</div>
            </div>
            <div
              class="item acea-row"
              v-for="(item, index) in priceInfo.promotionsDetail"
              :key="index"
            >
              <div>{{ item.title }}：</div>
              <div>{{ item.promotions_price || 0 }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-order">
        <img src="../../assets/images/no-record.png" alt="" />
        <span class="trip">{{ $t("page.home.nonPickup") }}</span>
      </div>
    </div>
    <footer>
      <div class="footer">
        <div class="pay acea-row row-between-wrapper" v-if="cartList.length">
          <div class="bnt" @click="payPrice('cash')">现金收款</div>
          <div class="bnt" @click="payPrice('')">微信/支付宝</div>
          <div
            class="bnt on"
            @click="payPrice('yue')"
            v-if="
              userInfo.uid && userInfo.now_money >= (priceInfo.payPrice || 0)
            "
          >
            余额收款
          </div>
          <div class="bnt on bntUid" v-else>余额收款</div>
        </div>
        <div class="pay noCart acea-row row-between-wrapper" v-else>
          <div class="bnt">现金收款</div>
          <div class="bnt">微信/支付宝</div>
          <div class="bnt on">余额收款</div>
        </div>
      </div>
      <div class="right">
        <div v-if="cartList.length" class="rightCon">
          <div class="item" :class="integral ? 'on' : ''" @click="integralTap">
            积分
          </div>
          <div class="item" @click="changePrice">改价</div>
          <div class="item" @click="remarks">备注</div>
        </div>
        <div class="noCart" v-else>
          <div class="item">积分</div>
          <div class="item">改价</div>
          <div class="item">备注</div>
        </div>
      </div>
    </footer>
    <Modal
      v-model="modalUser"
      scrollable
      footer-hide
      closable
      :title="$t('page.user.userList')"
      :mask-closable="false"
      width="900"
    >
      <userList ref="users" @getUserId="getUserId" v-if="modalUser"></userList>
    </Modal>
    <recharge
      ref="recharge"
      :userInfo="userInfo"
      @getSuccess="getSuccess"
    ></recharge>
    <couponList
      ref="coupon"
      :uid="userInfo.uid"
      :cartList="cartList"
      @getCouponId="getCouponId"
      v-if="userInfo && cartList.length"
    ></couponList>
    <storeList
      ref="store"
      :uid="userInfo ? userInfo.uid : 0"
      @getStoreId="getStoreId"
      @getUserInfo="getUserInfo"
    >
    </storeList>
    <Modal v-model="modal" :title="$t('page.home.mark')" footer-hide>
      <Input
        v-model="createOrder.remarks"
        maxlength="200"
        show-word-limit
        :rows="5"
        type="textarea"
        :placeholder="$t('page.tips.orderMark')"
        style="width: 100%"
      />
      <Button class="mt20" type="primary" long @click="onSubmit()">提交</Button>
    </Modal>
    <Modal
      v-model="modal2"
      :title="$t('page.home.exchangePrice')"
      footer-hide
      @on-cancel="cancelPrice"
    >
      <Form :model="formItem" :label-width="100">
        <FormItem :label="$t('page.order.exchangeOrderPrice')">
          <div class="acea-row">
            <div class="inputNum">
              <InputNumber
                :min="0"
                v-model="formItem.price"
                @on-change="tapPrice"
              ></InputNumber>
              元
            </div>
            <div class="inputNum discount">
              <InputNumber
                :min="0"
                :max="100"
                v-model="discountPrice"
                @on-change="tapDiscount"
              ></InputNumber>
              %
            </div>
          </div>
        </FormItem>
        <FormItem :label="$t('page.order.exchangeOrderOriceAfter')">
          <div class="changePrice">
            ¥<span class="price">{{ formItem.price || 0 }}</span>
          </div>
        </FormItem>
        <div class="acea-row row-center-wrapper">
          <Button type="primary" class="buttonPrice" @click="onSubmit2"
            >{{ $t('page.order.confirmExchangePrice') }}
          </Button>
        </div>
      </Form>
    </Modal>
    <Modal
      v-model="modalPay"
      footer-hide
      width="430px"
      class="modalPay"
      @on-cancel="modalPayCancel"
    >
      <div class="payPage">
        <div class="header acea-row row-center-wrapper">
          <div class="pictrue"><img src="../../assets/images/gold.png" /></div>
          <div class="text">{{ $t('page.order.netPayTotalPrice') }}</div>
        </div>
        <div class="money">
          ¥<span class="num">{{
            priceInfo.payPrice ? priceInfo.payPrice : 0
          }}</span>
        </div>
        <!-- <div class="tip acea-row row-center-wrapper">
					<Icon type="ios-alert" class="icon" />
					{{createOrder.pay_type=='yue'?'提示：使用扫码枪扫描用户个人中心二维码':'提示：引导用户扫描柜台二维码，注册登录后支付'}}
				</div> -->
        <Input
          ref="focusNum"
          v-model="payNum"
          size="large"
          type="url"
          @input="inputSaoMa"
          :placeholder="$t('page.order.inputScan')"
          style="margin-top: 16px"
        />
        <div class="process">
          <div class="pictrue">
            <img
              src="../../assets/images/process1.png"
              v-if="createOrder.pay_type == 'yue'"
            />
            <img src="../../assets/images/process2.png" v-else />
          </div>
          <div class="list acea-row row-between-wrapper">
            <div class="item one">
              <div class="name">
                {{
                  createOrder.pay_type == "yue" ?$t('page.order.scanPayQrcode') :$t('page.order.scanPayCashier')
                }}
              </div>
              <div>
                {{
                  createOrder.pay_type == "yue" ? $t('page.order.openMine') :$t('page.order.guderUserScan')
                }}
              </div>
            </div>
            <div class="item two">
              <div class="name">
                {{ createOrder.pay_type == "yue" ? $t('page.order.payByScan') :$t('page.order.finishPay') }}
              </div>
              <div>
                {{ createOrder.pay_type == "yue" ? $t('page.order.scanGun') :$t('page.order.olinePay')  }}
              </div>
            </div>
            <div class="item three">
              <div class="name">{{$t('page.order.paymentConfirm')}}</div>
              <div>{{$t('page.order.cashierConfirm')}}</div>
            </div>
          </div>
        </div>
        <!-- <Button type="primary" class="bnt" @click="confirm">确认</Button> -->
        <!-- 	<div v-else>
					<Button type="primary" class="bnt" @click="confirmOrder" v-if="isOrderCreate">确认</Button>
					<Button type="primary" class="bnt" @click="confirm" v-else>创建订单</Button>
				</div> -->
      </div>
    </Modal>
    <Modal
      v-model="modalCash"
      footer-hide
      width="770px"
      class="cash"
      @on-cancel="cancel"
    >
      <div class="cashPage acea-row">
        <div class="left">
          <div class="pictrue">
            <img src="../../assets/images/gold.png" />
          </div>
          <div class="text">{{$t('page.order.netPayTotalPrice')}}</div>
          <div class="money">
            ¥<span class="num">{{
              priceInfo.payPrice ? priceInfo.payPrice : 0
            }}</span>
          </div>
        </div>
        <div class="right">
          <div class="rightCon">
            <div class="top acea-row row-between-wrapper">
              <div>{{$t('page.order.shoulReceiTotal')}}</div>
              <div class="num">{{ collection }}</div>
            </div>
            <div class="center acea-row row-between-wrapper">
              <div>{{$t('page.order.shoulCharge')}}</div>
              <div
                class="num"
                v-if="
                  this.$computes.Sub(
                    collection,
                    priceInfo.payPrice ? priceInfo.payPrice : 0
                  ) > 0
                "
              >
                {{
                  this.$computes.Sub(
                    collection,
                    priceInfo.payPrice ? priceInfo.payPrice : 0
                  )
                }}
              </div>
              <div class="num" v-else>0</div>
            </div>
            <div class="bottom acea-row">
              <div
                class="item acea-row row-center-wrapper"
                :class="item == '.' ? 'spot' : ''"
                v-for="(item, index) in numList"
                :key="index"
                @click="numTap(item)"
              >
                {{ item }}
              </div>
              <div class="item acea-row row-center-wrapper" @click="delNum">
                <Icon type="ios-backspace" />
              </div>
            </div>
          </div>
          <Button type="primary" @click="cashBnt">{{ $t("page.common.confirm") }}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import userList from "@/components/userList";
import storeList from "@/components/storeList";
import couponList from "@/components/couponList";
import productAttr from "./components/productAttr";
import recharge from "@/components/recharge";
import Utils from "@/utils/index";
import goodsList from "./components/goodsList";
import {
  cashierProduct,
  cashierCate,
  cashierUser,
  cashierCode,
  cashierCart,
  cashierDetail,
  cashierCartList,
  cashierCartNum,
  cashierchangeCart,
  cashierCartDel,
  cashierCompute,
  cashierCreate,
  cashierPay,
  postCashierSwitch,
  postCashierHang,
  getHangList,
  getHang,
  cashierHang,
  delHang,
} from "@/api/order";
import { checkOrderApi } from "@/api/user";

export default {
  name: "index",
  components: {
    userList,
    storeList,
    productAttr,
    couponList,
    recharge,
    goodsList,
  },
  data() {
    return {
      formItem: {
        price: 0,
      },
      discountPrice: 100,
      loading: false,
      totalHang: 0,
      tableHang: [],
      activeHangon: -1,
      hangData: [],
      lodgeFrom: {
        keyword: "",
        page: 1,
        limit: 10,
      },
      currentid: "",
      columns: [
        {
          title: $t("page.common.choose"),
          key: "chose",
          width: 60,
          align: "center",
          render: (h, params) => {
            let id = params.row.id;
            let flag = false;
            if (this.currentid === id) {
              flag = true;
            } else {
              flag = false;
            }
            let self = this;
            return h("div", [
              h("Radio", {
                props: {
                  value: flag,
                },
                on: {
                  "on-change": () => {
                    self.currentid = id;
                    self.activeHangon = params.index;
                    let data = {
                      uid: params.row.uid,
                    };
                    let touristId = params.row.tourist_uid;
                    if (params.row.uid) {
                      this.userInfoData(data);
                    } else {
                      this.setUp(touristId);
                    }
                  },
                },
              }),
            ]);
          },
        },
        {
          title: $t("page.common.customer"),
          slot: "nickname",
          minWidth: 70,
        },
        {
          title: $t("page.order.orderPrice"),
          key: "price",
          minWidth: 70,
        },
        {
          title: $t("page.order.date"),
          key: "_add_time",
          minWidth: 70,
        },
        {
          title:$t("page.order.operation"),
          slot: "action",
          minWidth: 100,
          align: "center",
        },
      ],
      checkOut: 0,
      modalUser: false,
      cashBntLoading: false,
      flag: true,
      goodFrom: {
        store_name: "",
        field_key: "",
        cate_id: "",
        page: 1,
        limit: 30,
        uid: 0,
        staff_id: 0,
      },
      total: 0,
      goodData: [],
      cateData: [],
      currentCate: 0, //分类的当前index；
      currentTab: "2",
      codeNum: "",
      payNum: "",
      userInfo: {},
      storeInfos: {}, //门店店员信息
      storeList: [], //门店列表
      attr: {
        productAttr: [],
        productSelect: {},
      },
      storeInfo: {}, //商品信息
      productValue: [],
      attrValue: "", //已选属性
      productId: 0, //产品id
      cartList: [],
      isCart: 0,
      cartInfo: {
        //更改属性所需参数
        cart_id: 0,
        product_id: 0,
        unique: "",
      },
      modal: false,
      fapi: {},
      rule: [
        {
          type: "input",
          field: "remarks",
          title: $t("page.common.date"),
          props: {
            type: "textarea",
            maxlength: 100,
            "show-word-limit": true,
          },
        },
      ],
      modal2: false,
      integral: false, //是否使用积分
      coupon: false, //是否使用优惠券
      couponId: 0, //优惠券id
      modalPay: false,
      cartSum: 0,
      priceInfo: {},
      createOrder: {
        remarks: "",
        change_price: 0,
        cart_id: [], // 购物车id
        userCode: "",
        is_price: 0,
        auth_code: "",
        new: 0,
      },
      modalCash: false,
      numList: ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."],
      collectionArray: [],
      collection: 0,
      isOrderCreate: 0,
      discount: false,
      payTape: "", // 支付方式
      orderId: "", //订单id
      clientHeight: 0,
      cartHeight: 0,
      goodsHeight: 0,
      invalidList: [],
      defaultcalc: false,
      orderSystem: {
        loadingMsg: null,
        timer: null,
      },
      disabled: false, //阻止属性弹窗多次提交
      unchangedPrice: 0,
      selIndex: 0,
      userData: {},
      defaultAvatar: require("@/assets/images/yonghu.png"),
    };
  },
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem("cashierUser"));
    // this.cateList();
    let that = this;
  },
  mounted() {},
  methods: {
    selectUser(index, item) {
      this.createOrder.remarks = "";
      this.selIndex = index;
      this.userData = item;
      this.hangDataTap(index, item);
    },
    tapDiscount() {
      this.formItem.price =
        this.$computes
          .Mul(this.unchangedPrice || 0, this.discountPrice / 100 || 0)
          .toFixed(2) || 0;
    },
    tapPrice() {
      this.formItem.price = Number(this.formItem.price.toFixed(2));
      let num = this.$computes.Div(
        this.formItem.price || 0,
        this.unchangedPrice || 0
      );
      this.discountPrice = Number((num * 100).toFixed(2)) || 0;
    },
    cancelPrice() {
      this.formItem.price = this.priceInfo.payPrice || 0;
      this.tapPrice();
    },
    getSuccess(e) {
      let money = this.$computes.Add(this.userInfo.now_money, e);
      this.userInfo.now_money = money;
      let storage = window.localStorage;
      storage.setItem("cashierUser", JSON.stringify(this.userInfo));
    },
    clear() {
      this.priceInfo.couponPrice = 0;
      this.priceInfo.payPrice = 0;
      this.priceInfo.deductionPrice = 0;
      this.priceInfo.totalPrice = 0;
      this.priceInfo.vipPrice = 0;
      this.cartList = [];
      this.cartSum = 0;
      this.collection = 0;
      this.collectionArray = [];
      this.createOrder.change_price = 0;
      this.createOrder.remarks = "";
      this.coupon = false;
      this.couponId = 0;
      this.integral = false;
      this.createOrder.is_price = 0;
    },
    cancel() {
      this.collection = 0;
      this.collectionArray = [];
    },
    // 挂单区删除
    hangDel(row, index) {
      this.$Modal.confirm({
        title:$t("page.order.removePickupOrder"),
        content:$t("page.order.deletePickOrderConfirm"),
        onOk: () => {
          delHang({ id: row.id })
            .then((res) => {
              this.tableHang.splice(index, 1);
              this.totalHang = this.totalHang - 1;
              this.$Message.success(res.msg);
              if (this.tableHang.length) {
                let i = index - 1 > 0 ? index : 0;
                this.selectUser(i, this.tableHang[i]);
              } else {
                this.selIndex = 0;
                this.userData = {};
                this.cartList = [];
                this.priceInfo = {};
              }
            })
            .catch((err) => {
              this.$Message.error(err.msg);
            });
        },
        onCancel: () => {},
      });
    },
    // 点击左侧挂单
    hangDataTap(index, item) {
      this.activeHangon = index;
      this.checkOut = 0;
      let touristId = item.tourist_uid;
      let data = {
        uid: item.uid,
      };
      if (item.uid) {
        this.userInfoData(data);
      } else {
        this.setUp(touristId);
      }
    },
    // 挂单列表
    hangList() {
      this.loading = true;
      let storeId = this.storeInfos.id;
      getHangList(storeId, this.lodgeFrom)
        .then((res) => {
          this.loading = false;
          this.tableHang = this.tableHang.concat(res.data.list);
          this.totalHang = res.data.count;
          if (this.lodgeFrom.page === 1 && this.tableHang.length) {
            this.selectUser(0, this.tableHang[0]);
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$Message.error(err.msg);
        });
    },
    searchData() {
      this.lodgeFrom.page = 1;
      this.tableHang = [];
      // this.cartList = [];
      this.hangList();
    },
    addPage(e) {
      if (
        !e ||
        (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <=
          0 &&
          this.tableHang.length < this.totalHang)
      ) {
        this.lodgeFrom.page++;
        this.hangList();
      } else {
        return;
      }
    },
    pageHangChange(e) {
      this.lodgeFrom.page = e;
      this.hangList();
    },
    // 提单；
    billHang(item, index) {
      this.$router.push({
        path: "/cashier/cashier/index",
        query: {
          uid: item.uid,
          staff_id: item.staff_id,
          tourist_uid: item.tourist_uid,
          index: index,
        },
      });
      // this.checkOut = 0;
      // this.activeHangon = index;
      // let touristId = item.tourist_uid;
      // let data = {
      //   uid: item.uid,
      // };
      // if (item.uid) {
      //   this.userInfoData(data);
      // } else {
      //   this.setUp(touristId);
      // }
    },
    //快速挂单列表（最左侧的）
    hangDataList() {
      let storeId = this.storeInfos.id;
      getHang(storeId, storeId)
        .then((res) => {
          this.hangData = res.data;
          this.defaultSel();
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    //保存挂单
    lodgeTap() {
      let data = {
        cart_ids: this.createOrder.cart_id,
        uid: this.userInfo.uid || 0,
        tourist_uid: this.userInfo.touristId || "",
        staff_id: this.storeInfos.id,
        price: this.priceInfo.payPrice || 0,
      };
      postCashierHang(data)
        .then((res) => {
          this.activeHangon = -1;
          this.$Message.success(res.msg);
          this.hangDataList();
          this.hangList();
          this.setUp();
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    //搜索挂单
    storeSearch() {
      this.lodgeFrom.page = 1;
      this.hangList();
    },
    //默认选中
    defaultSel(type) {
      let uid = this.userInfo.uid;
      let touristId = this.userInfo.touristId;
      if (uid) {
        let flag = 0;
        this.hangData.forEach((item, index) => {
          if (item.uid == uid) {
            flag = 1;
            this.activeHangon = index;
          }
        });
        if (!flag) {
          this.activeHangon = -1;
        }
      } else {
        if (touristId) {
          this.hangData.forEach((item, index) => {
            if (item.tourist_uid == touristId) {
              this.activeHangon = index;
            }
          });
        }
      }
    },
    // 结账区和挂单区的切换；
    navTab(e) {
      this.checkOut = e;
      if (e == 1) {
        this.currentid = "";
        this.activeHangon = -1;
        this.clear();
        this.lodgeFrom.page = 1;
        this.hangList();
      } else {
        this.getCartList();
        this.defaultSel();
      }
    },
    // 充值
    rechargeBnt() {
      this.$refs.recharge.modal = true;
    },
    //点击出现优惠明细
    discountCon() {
      this.discount = true;
    },
    //现金收款创建订单并支付
    cashBnt() {
      if (this.cashBntLoading) return;
      this.cashBntLoading = true;
      if (this.isOrderCreate) {
        this.getCashierPay("cash");
      } else {
        this.orderCreate();
      }
      setTimeout(() => {
        this.cashBntLoading = false;
      }, 1000);
    },
    //清除计算机输入的数字
    delNum() {
      this.collectionArray.pop();
      this.collection = this.collectionArray.length
        ? this.collectionArray.join("")
        : 0;
    },
    //输入实际收款金额
    numTap(item) {
      if (this.defaultcalc === false) {
        this.collection = "";
        this.defaultcalc = true;
      }
      let x = String(this.collection).indexOf(".") + 1;
      let y = String(this.collection).length - x;
      console.log(x, y);
      if (x === 0 || y < 2) {
        if (this.collectionArray.join("") <= 9999999) {
          this.collectionArray.push(item);
        }
        this.collection =
          this.collectionArray.join("") > 99999999
            ? 99999999
            : this.collectionArray.join("");
      }
    },
    checkOrderTime(msg) {
      let that = this;
      let num = 1;
      let timer = (this.orderSystem.timer = setInterval(function() {
        that.confirmOrder(timer, msg);
        num++;
        if (num >= 60) {
          clearInterval(timer);
          msg;
          that.isOrderCreate = 1;
          that.$Message.warning($t("page.common.payFail"));
        }
      }, 1000));
    },
    confirmOrder(timer, msg) {
      let data = {
        order_id: this.orderId,
      };
      checkOrderApi(3, data)
        .then((res) => {
          if (res.data.status == true) {
            msg();
            clearInterval(timer);
            this.isOrderCreate = 0;
            this.$Message.success($t("page.common.paySucess"));
            this.modalPay = false;
            this.changePoints();
            let storage = window.localStorage;
            storage.setItem("cashierUser", JSON.stringify(this.userInfo));
            this.clear();
          }
        })
        .catch((err) => {
          msg();
          this.$Message.error(err.msg);
        });
    },
    payPrice(payTape) {
      this.payTape = payTape;
      if (payTape == "" || payTape == "yue") {
        this.createOrder.userCode = "";
        this.createOrder.auth_code = "";
        this.payNum = "";
        this.modalPay = true;
        let that = this;
        this.$nextTick(() => {
          this.$refs.focusNum.focus();
          document.onkeydown = function(e) {
            if (e.which == 13) {
              if (that.payNum) {
                that.createOrder.userCode = that.payNum;
                that.createOrder.auth_code = that.payNum;
                that.confirm();
              }
              if (that.codeNum) {
                that.codeInfo({
                  bar_code: that.codeNum,
                });
              }
            }
          };
        });
      } else if (payTape == "cash") {
        this.modalCash = true;
        this.collection = this.priceInfo.payPrice ? this.priceInfo.payPrice : 0;
        this.keyboard();
      }
      this.createOrder.integral = this.integral;
      this.createOrder.coupon = this.coupon;
      this.createOrder.coupon_id = this.couponId;
      if (this.coupon && !this.couponId)
        return this.$Message.error($t("page.home.invaildCoupon"));
      this.createOrder.pay_type = payTape;
      this.createOrder.staff_id = this.storeInfos.id;
      this.fapi.resetFields();
    },
    // 线上支付和余额支付
    confirm() {
      if (this.payTape == "yue") {
        // this.createOrder.userCode = this.payNum;
        if (!this.createOrder.userCode) {
          return this.$Message.error($t("page.home.sacenQrcoe"));
        }
        if (this.isOrderCreate) {
          this.getCashierPay("yue");
        } else {
          this.orderCreate();
        }
      } else if (this.payTape == "") {
        // this.createOrder.auth_code = this.payNum;
        if (!this.createOrder.auth_code) {
          return this.$Message.error($t("page.home.scanQrcodeTopay"));
        }
        if (this.isOrderCreate) {
          this.getCashierPay("");
        } else {
          this.orderCreate();
        }
      }
    },
    modalPayCancel() {
      this.$Message.destroy();
      if (this.orderSystem.timer) {
        clearInterval(this.orderSystem.timer);
        this.orderSystem.timer = null;
      }
    },
    getCashierPay(payType) {
      let data = {
        payType: payType,
        userCode: this.payNum,
        auth_code: this.payNum,
      };
      if (payType == "cash") {
        if (parseFloat(this.priceInfo.payPrice) > parseFloat(this.collection)) {
          return this.$Message.error($t("page.home.balanceLess"));
        }
      }
      cashierPay(this.orderId, data)
        .then((res) => {
          this.payNum = "";
          if (res.data.status == "SUCCESS") {
            this.isOrderCreate = 0;
            this.$Message.success($t("page.common.paySucess"));
            this.modalCash = false;
            this.modalPay = false;
            this.changePoints();
            let storage = window.localStorage;
            storage.setItem("cashierUser", JSON.stringify(this.userInfo));
            this.clear();
          } else if (res.data.status == "PAY_ING") {
            let msg = this.$Message.loading({
              content: "等待支付中...",
              duration: 0,
            });
            this.orderSystem.loadingMsg = msg;
            this.orderId = res.data.order_id;
            this.checkOrderTime(msg);
            // this.confirmOrder();
          } else {
            this.isOrderCreate = 1;
            this.orderId = res.data.order_id;
            this.$Message.error(res.data.message);
          }
        })
        .catch((err) => {
          this.payNum = "";
          this.$Message.error(err.msg);
        });
    },
    // 创建订单
    orderCreate() {
      if (this.payTape == "cash") {
        if (parseFloat(this.priceInfo.payPrice) > parseFloat(this.collection)) {
          return this.$Message.error($t("page.home.balanceLess"));
        }
      }
      this.createOrder.tourist_uid = this.userInfo.touristId;
      cashierCreate(this.userInfo.uid, this.createOrder)
        .then((res) => {
          let storage = window.localStorage;
          this.payNum = "";
          if (this.payTape == "yue") {
            this.modalPay = false;
            this.payNum = "";
            this.createOrder.userCode = "";
            if (res.data.status == "ORDER_CREATE") {
              this.isOrderCreate = 1;
              this.orderId = res.data.order_id;
              this.$Message.success(res.data.message);
            } else if (res.data.status == "SUCCESS") {
              this.isOrderCreate = 0;
              this.$Message.success($t("page.common.paySucess"));
              let money = this.$computes.Sub(
                this.userInfo.now_money,
                this.priceInfo.payPrice
              );
              this.userInfo.now_money = money;
              this.changePoints();
              storage.setItem("cashierUser", JSON.stringify(this.userInfo));
              this.clear();
            } else {
              this.isOrderCreate = 1;
              this.orderId = res.data.order_id;
              this.$Message.error(res.data.message);
            }
          }
          if (this.payTape == "cash") {
            if (res.data.status == "SUCCESS") {
              this.$Message.success($t("page.common.paySucess"));
              // storage.removeItem("cashierUser");
              // this.userInfo = null;
              this.changePoints();
              storage.setItem("cashierUser", JSON.stringify(this.userInfo));
              this.modalCash = false;
              this.clear();
            }
          }
          if (this.payTape == "") {
            this.payNum = "";
            this.createOrder.auth_code = "";
            if (res.data.status == "ORDER_CREATE") {
              this.isOrderCreate = 1;
              this.orderId = res.data.order_id;
              this.$Message.success(res.data.message);
            } else if (res.data.status == "PAY_ING") {
              let msg = this.$Message.loading({
                content: "等待支付中...",
                duration: 0,
              });
              this.orderId = res.data.order_id;
              this.checkOrderTime(msg);
            } else if (res.data.status == "SUCCESS") {
              this.$Message.success($t("page.common.paySucess"));
              // storage.removeItem("cashierUser");
              // this.userInfo = null;
              // this.setUp();
              this.changePoints();
              storage.setItem("cashierUser", JSON.stringify(this.userInfo));
              this.modalPay = false;
              this.clear();
            } else {
              this.isOrderCreate = 1;
              this.orderId = res.data.order_id;
              this.$Message.error(res.data.message);
            }
          }
        })
        .catch((err) => {
          this.payNum = "";
          this.$Message.error(err.msg);
        });
    },
    //更新积分、更新左侧挂单、更新挂单（此函数支付成功调用）
    changePoints() {
      let usedIntegral = this.$computes.Sub(
        this.userInfo.integral,
        this.priceInfo.usedIntegral
      );
      this.userInfo.integral = usedIntegral;
      this.hangDataList();
      this.tableHang.forEach((item, index) => {
        if (item.uid) {
          if (this.userInfo.uid == item.uid) {
            this.tableHang.splice(index, 1);
          }
        } else {
          if (this.userInfo.touristId == item.tourist_uid) {
            this.tableHang.splice(index, 1);
          }
        }
      });
    },
    //计算金额
    cartCompute() {
      let ids = [];
      this.cartList.forEach((item) => {
        item.cart.forEach((c) => {
          ids.push(c.id);
        });
      });
      this.createOrder.cart_id = ids;
      let data = {
        integral: this.integral,
        coupon: this.coupon,
        coupon_id: this.couponId,
        cart_id: ids,
      };
      cashierCompute(this.userInfo.uid, data)
        .then((res) => {
          this.priceInfo = res.data;
          this.unchangedPrice = this.priceInfo.payPrice || 0;
          this.formItem.price = this.priceInfo.payPrice || 0;
          this.tapPrice();
          //处理数据拿到总件数
          let num = this.priceInfo.cartInfo.map(function(value, index) {
            return value.cart_num;
          });
          this.cartSum = num.reduce((count, v) => count + v, 0);
        })
        .catch((err) => {
          this.$Message.error(err.msg);
          this.coupon = false;
        });
    },
    // 点击使用优惠券
    couponTap() {
      this.$refs.coupon.modals = true;
      this.$refs.coupon.currentid = this.couponId || 0;
      this.$refs.coupon.getList();
    },
    getCouponId(e) {
      this.couponId = e.id;
      this.coupon = true;
      this.$refs.coupon.modals = false;
      if (e.id) this.createOrder.is_price = 0;

      this.cartCompute();
    },
    closeCoupon() {
      this.coupon = false;
      this.couponId = 0;
      this.cartCompute();
    },
    // 是否使用积分
    integralTap() {
      if (!this.userInfo.uid) {
        this.$Message.warning($t("page.home.useCustomerScore"));
        return;
      }
      this.integral = !this.integral;
      if (this.integral) this.createOrder.is_price = 0;
      this.cartCompute();
    },
    changePrice() {
      this.modal2 = true;
    },
    remarks() {
      // this.fapi.resetFields();
      this.modal = true;
    },
    // 提交备注
    onSubmit() {
      this.modal = false;
    },
    onSubmit2() {
      if (this.formItem.price >= 0 && this.formItem.price != null) {
        this.priceInfo.payPrice = this.formItem.price;
        this.$Message.success($t("page.home.changeOrderPriceOk"));
        this.createOrder.is_price = 1;
        this.createOrder.change_price = this.formItem.price;
        this.cancelPrice();
        this.modal2 = false;
      } else {
        return this.$Message.error($t("page.home.PriceNolessEmpty"));
      }
    },
    // 删除
    del(ids, type, index, num) {
      this.$Modal.confirm({
        title: $t("page.home.removeCart"),
        content:$t("page.home.delConfim"),
        onOk: () => {
          cashierCartDel(this.userInfo.uid, ids)
            .then((res) => {
              this.$Message.success($t("page.common.deleteSucess"));
              if (type) {
                this.clear();
                this.invalidList = [];
                this.hangDataList();
              } else {
                if (num) {
                  this.invalidList.splice(index, 1);
                } else {
                  this.cartList.splice(index, 1);
                  if (this.cartList.length) {
                    this.cartCompute();
                  } else {
                    this.hangDataList();
                    this.clear();
                  }
                }
                // this.cartSum = this.cartSum - 1;
              }
            })
            .catch((err) => {
              this.$Message.error(err.msg);
            });
        },
        onCancel: () => {},
      });
    },
    delAll() {
      let ids = [];
      this.cartList.forEach((item) => {
        ids.push(item.id);
      });
      this.invalidList.forEach((item) => {
        ids.push(item.id);
      });
      this.del(
        {
          ids: ids,
        },
        1
      );
    },
    delCart(item, index, num) {
      let ids = [];
      ids.push(item.id);
      this.del(
        {
          ids: ids,
        },
        0,
        index,
        num
      );
    },
    // 点击切换属性
    cartAttr(item) {
      this.disabled = false;
      this.$refs.attrs.modals = true;
      this.isCart = 1;
      this.cartInfo.cart_id = item.id;
      this.cartInfo.product_id = item.product_id;
      this.goodsInfo(item.product_id);
    },
    // 加入购物车
    joinCart(num) {
      let that = this;
      if (num) {
        let productSelect = that.productValue[this.attrValue];
        //如果有属性,没有选择,提示用户选择
        if (that.attr.productAttr.length && productSelect === undefined) {
          return this.$Message.warning($t("page.home.stockLess"));
        }
      }
      let uid = this.userInfo.uid;
      let data = {
        productId: this.productId,
        cartNum: 1,
        uniqueId: num
          ? this.attr.productSelect !== undefined
            ? this.attr.productSelect.unique
            : ""
          : "",
        staff_id: this.storeInfos.id,
        tourist_uid: this.userInfo.touristId,
      };
      cashierCart(uid, data)
        .then((res) => {
          this.$refs.attrs.modals = false;
          this.$Message.success($t("page.home.addGoodsSucess"));
          this.getCartList();
          this.hangDataList();
          this.disabled = true;
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    // 购物车加减
    cartChange(item) {
      let uid = item.uid;
      let data = {
        number: item.cart_num,
        id: item.id,
      };
      cashierCartNum(uid, data)
        .then((res) => {
          this.cartCompute();
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    calculate(item, type) {
      if (type === "reduce" && item.cart_num > 1) {
        item.cart_num--;
      } else if (type === "add" && item.cart_num < item.branch_stock) {
        item.cart_num++;
      }
      let uid = item.uid;
      let data = {
        number: item.cart_num,
        id: item.id,
      };
      cashierCartNum(uid, data)
        .then((res) => {
          this.cartCompute();
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    changeCartAttr() {
      this.cartInfo.unique =
        this.attr.productSelect !== undefined
          ? this.attr.productSelect.unique
          : "";
      cashierchangeCart(this.cartInfo)
        .then((res) => {
          this.disabled = true;
          this.$Message.success(res.msg);
          this.$refs.attrs.modals = false;
          this.getCartList();
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    // 购物车列表
    getCartList() {
      let uid = this.userInfo.uid;
      let staffId = this.storeInfos.id;
      if (uid >= 0) {
        let data = { tourist_uid: this.userInfo.touristId };
        cashierCartList(uid, staffId, data)
          .then((res) => {
            this.cartList = res.data.valid;
            this.invalidList = res.data.invalid;
            this.cartSum = res.data.count;
            // this.cartSum = res.data.valid.length;
            if (res.data.valid.length) {
              this.cartCompute();
            } else {
              this.clear();
            }
          })
          .catch((err) => {
            this.$Message.error(err.msg);
          })
          .finally((e) => {
            this.cumping = false;
          });
      } else {
        this.$Message.error($t("page.home.switchOtherCustomer"));
      }
    },
    /**
     * 属性变动赋值
     *
     */
    ChangeAttr: function(res) {
      let productSelect = this.productValue[res];
      if (productSelect && productSelect.stock > 0) {
        this.$set(this.attr.productSelect, "image", productSelect.image);
        this.$set(this.attr.productSelect, "price", productSelect.price);
        this.$set(this.attr.productSelect, "stock", productSelect.stock);
        this.$set(this.attr.productSelect, "unique", productSelect.unique);
        this.$set(this.attr.productSelect, "cart_num", 1);
        this.$set(
          this.attr.productSelect,
          "vip_price",
          productSelect.vip_price
        );
        this.$set(this, "attrValue", res);
      } else {
        this.$set(this.attr.productSelect, "image", this.storeInfo.image);
        this.$set(this.attr.productSelect, "price", this.storeInfo.price);
        this.$set(this.attr.productSelect, "stock", 0);
        this.$set(this.attr.productSelect, "unique", "");
        this.$set(this.attr.productSelect, "cart_num", 0);
        this.$set(
          this.attr.productSelect,
          "vip_price",
          this.storeInfo.vip_price
        );
        this.$set(this, "attrValue", "");
      }
    },
    storeTap() {
      this.$refs.store.modals = true;
      this.$refs.store.cancel();
    },
    setUp(touristId) {
      let timestamp = new Date().getTime();
      let userInfo = {
        avatar: require("@/assets/images/yonghu.png"),
        nickname: "游客",
        uid: 0,
        touristId: touristId || timestamp,
      };
      this.userInfo = userInfo;
      let storage = window.localStorage;
      storage.setItem("cashierUser", JSON.stringify(userInfo));
      this.getCartList();
    },
    // 选择用户
    changeMenu(name) {
      if (name == 1) {
        this.setUser();
      } else {
        this.activeHangon = -1;
        this.clear();
        this.setUp();
      }
    },
    // 修改用户
    setUser() {
      this.modalUser = true;
      this.$refs.users.currentid = 0;
      // this.$refs.users.modals = true
      // this.$refs.users.cancel();
    },
    // 当前选中门店店员信息
    getStoreId(e) {
      this.clear();
      this.storeList.forEach((i) => {
        if (i.id == e.id) {
          this.goodFrom.staff_id = e.id;
          this.storeInfos = i;
          this.getCartList();
          this.hangDataList();
          this.hangList();
        }
      });
    },
    // 门店店员信息以及门店店员列表
    getUserInfo(e) {
      this.storeInfos = e.users;
      this.storeList = e.storeList;
      this.goodFrom.staff_id = e.users.id;
      if (this.userInfo) {
        this.getCartList();
      } else {
        this.setUp();
      }
      this.hangDataList();
      this.hangList();
    },
    // 收银台切换购物车用户
    cashierSwitch(data) {
      postCashierSwitch(data, this.storeInfos.id)
        .then((res) => {
          console.log("jkjkj", res);
        })
        .catch((err) => {
          this.$Message.error(err);
        });
    },
    getUserId(e) {
      this.clear();
      this.modalUser = false;
      let data = {
        uid: e.uid,
      };
      let dataSwitch = {
        uid: this.userInfo.touristId,
        to_uid: e.uid,
        is_tourist: 1,
      };
      this.cashierSwitch(dataSwitch);
      this.userInfoData(data);
    },
    // 获取收银台用户信息
    userInfoData(data) {
      cashierUser(data)
        .then((res) => {
          this.userInfo = res.data;
          let storage = window.localStorage;
          storage.setItem("cashierUser", JSON.stringify(res.data));
          this.getCartList();
          this.defaultSel(1);
        })
        .catch((err) => {
          this.$Message.error(err);
        });
    },
    //扫码枪扫码，针对带有字母的
    inputSaoMa(e) {
      // setTimeout定时器的作用是，等待扫码枪输入完，拿到完整的二维码信息，再调接口（扫码枪输入速度大概8~20毫秒，手动输速度大概是80毫秒），否则拿不到完整的二维信息。
      let val = e;
      if (val === "") return false;
      clearTimeout(this.endTimeout);
      this.endTimeout = null;
      this.endTimeout = setTimeout(() => {
        // if (this.payNum === val) {
        // 	clearTimeout(this.endTimeout)
        // 	if (val) {
        // 		this.createOrder.userCode = val;
        // 		this.createOrder.auth_code = val;
        // 		this.confirm();
        // 	}
        // }
        if (this.codeNum === val) {
          clearTimeout(this.endTimeout);
          if (val) {
            this.codeInfo({
              bar_code: val,
            });
          }
        }
      }, 500);
    },
    codeInfo(data) {
      data.uid = this.userInfo ? this.userInfo.uid : 0;
      data.staff_id = this.storeInfos.id;
      data.tourist_uid = this.userInfo.touristId;
      if (this.userInfo == null) {
        this.codeNum = "";
        return this.$Message.error($t("page.home.switchOtherCustomer"));
      }
      cashierCode(data)
        .then((res) => {
          this.codeNum = "";
          let data = res.data;
          if (data.hasOwnProperty("userInfo")) {
            // 用户 Object.keys(this.userInfo).length
            if (this.userInfo) {
              this.$Modal.confirm({
                title: $t("page.user.changeMember"),
                content:$t("page.user.changeMemberConfirm"),
                onOk: () => {
                  this.userInfo = res.data.userInfo;
                  let storage = window.localStorage;
                  storage.setItem(
                    "cashierUser",
                    JSON.stringify(res.data.userInfo)
                  );
                  this.getCartList();
                },
                onCancel: () => {},
              });
            } else {
              this.userInfo = res.data.userInfo;
              let storage = window.localStorage;
              storage.setItem("cashierUser", JSON.stringify(res.data.userInfo));
            }
          }
          this.getCartList();
        })
        .catch((err) => {
          this.codeNum = "";
          this.$Message.error(err.msg);
        });
    },
    // 监听键盘函数
    keyboard() {
      let that = this;

      function delNums(item) {
        that.collectionArray.pop();
        that.collection = that.collectionArray.length
          ? that.collectionArray.join("")
          : 0;
      }

      function numTaps(item) {
        if (that.defaultcalc === false) {
          that.collection = "";
          that.defaultcalc = true;
        }
        let x = String(that.collection).indexOf(".") + 1;
        let y = String(that.collection).length - x;
        console.log(x, y);
        if (x === 0 || y < 2) {
          if (that.collectionArray.join("") <= 9999999) {
            that.collectionArray.push(item);
          }
          that.collection =
            that.collectionArray.join("") > 99999999
              ? 99999999
              : that.collectionArray.join("");
        }
      }

      document.onkeydown = function(event) {
        let e = event || window.event;
        let key = e.keyCode;
        if (that.modalCash) {
          event.stopPropagation(); // 阻止事件冒泡传递
          event.preventDefault(); //阻止默认事件原有功能
        }
        switch (key) {
          case 96:
          case 48:
            numTaps(0);
            break;
          case 97:
          case 49:
            numTaps(1);
            break;
          case 98:
          case 50:
            numTaps(2);
            break;
          case 99:
          case 51:
            numTaps(3);
            break;
          case 100:
          case 52:
            numTaps(4);
            break;
          case 101:
          case 53:
            numTaps(5);
            break;
          case 102:
          case 54:
            numTaps(6);
            break;
          case 103:
          case 55:
            numTaps(7);
            break;
          case 104:
          case 56:
            numTaps(8);
            break;
          case 105:
          case 57:
            numTaps(9);
            break;
          case 110:
            numTaps(".");
            break;
          case 190:
            numTaps(".");
            break;
          case 8:
            delNums();
            break;
        }
      };
    },
  },
};
</script>

<style scoped lang="stylus">
::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px #ccc;
}

::-webkit-scrollbar {
  width: 0px !important;
  /* 对垂直流动条有效 */
}

.inputNum {
  width: 210px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);

  &.discount {
    width: 130px;
    margin-left: 8px;

    /deep/ .ivu-input-number {
      border: 0 !important;
      width: 105px;
    }
  }

  /deep/ .ivu-input-number {
    border: 0 !important;
    width: 187px;
  }

  /deep/ .ivu-input-number-focused {
    box-shadow: unset !important;
  }

  /deep/ .ivu-input-number-handler-wrap {
    display: none;
  }
}

.changePrice {
  font-size: 12px;
  color: #E93323;

  .price {
    font-size: 17px;
    margin-left: 5px;
  }
}

.buttonPrice {
  width: 460px;
  height: 36px;
  margin-top: 50px;
}

.tableList {
  /deep/ .ivu-table-header table {
    border-top: 0 !important;
  }

  /deep/ .ivu-table th, /deep/ .ivu-table td {
    border-bottom: 0 !important;
    height: 34px !important;
  }

  /deep/ .ivu-table-cell {
    padding: 0 !important;
  }

  /deep/ .ivu-table th {
    color: #999999;
  }
}

.left {
  /deep/ .ivu-form-item {
    margin-bottom: 12px !important;
  }
}

.header .ivu-btn {
  width: 56px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid #FFFFFF;
  background-color: unset !important;
  color: #fff;

  &:hover {
    border-color: #ccc;
    color: #ccc;
  }
}

.headerCard {
  background: #1890FF;
  border-radius: 0 !important;
}

.remark {
  /deep/ .ivu-input-wrapper {
    width: 91% !important;
  }

  /deep/ .ivu-input-number {
    width: 91% !important;
  }

  /deep/ .ivu-form-item-content {
    margin-left: 63px !important;
  }

  /deep/ .ivu-form-item-label {
    width: 63px !important;
  }
}

.noCart {
  height: 100%;
  display: flex;

  .tip {
    text-align: center;
    color: #ccc;
  }

  .pictrue {
    width: 308px;
    height: 200px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.goodsCard {
  flex: 1;
  max-width: 100%;
  min-width: 1100px;
  height: calc(100vh - 140px);
  display: flex;
  flex-wrap: nowrap;
}

.modalPay {
  /deep/ .ivu-modal-body {
    padding: 0;
  }
}

.cash {
  /deep/ .ivu-modal-body {
    padding: 0 !important;
  }
}

.discount-con {
  background-color: #F5F5F5;
  padding: 0px 25px;
  margin-top: 13px;
  border-radius: 10px;

  .item {
    font-size: 14px;
    font-weight: 400;
    margin: 10px 0;
  }
}

.content {
  height: calc(100vh - 66px);
  overflow: hidden;
}

.cashPage {
  text-align: center;

  .left {
    width: 282px;
    padding: 16px 0 16px 16px;

    .pictrue {
      width: 110px;
      height: 110px;
      margin: 180px auto 0 auto;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .text {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      margin-top: 14px;
    }

    .money {
      color: rgba(0, 0, 0, 0.85);
      font-size: 18px;

      .num {
        font-size: 32px;
        margin-left: 5px;
      }
    }
  }
}

.payPage {
  text-align: center;
  padding: 16px;

  /deep/ .ivu-input {
    width: 394px !important;
    text-align: center;
  }

  .header {
    margin: 35px 0 3px 0;
  }

  .process {
    width: 394px;
    height: 158px;
    border: 1px dashed #D8D8D8;
    border-top: 1px dashed #fff;
    margin: -1px auto 0 auto;

    &.on {
      border-top: 1px dashed #D8D8D8;
      margin-top: 20px;

      .list {
        padding-left: 14px !important;
      }
    }

    .list {
      padding: 6px 10px 0 3px;

      .item {
        font-size: 12px;
        color: #666;

        .name {
          color: #333;
          font-size: 13px;
          font-weight: bold;
        }
      }
    }

    .pictrue {
      width: 362px;
      height: 68px;
      margin: 24px auto 0 auto;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .pictrue {
    width: 18px;
    height: 18px;

    img {
      width: 100%;
      height: 100%;
    }

    margin-right: 7px;
  }

  .text {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }

  .money {
    font-size: 18px;
    color: rgba(0, 0, 0, 0.85);

    .num {
      font-size: 32px;
      margin-left: 5px;
    }
  }

  .tip {
    width: 310px;
    height: 26px;
    background: rgba(255, 126, 0, 0.1);
    border-radius: 13px;
    font-size: 13px;
    color: #FF7E00;
    margin: 10px auto 0 auto;

    .icon {
      font-size: 16px;
      margin-right: 5px;
    }
  }

  .bnt {
    width: 394px;
    height: 38px;
    margin: 28px 0 15px 0;
  }
}

.goods {
  flex: 1;
  margin: 30px 30px 10px 30px;
  // height: calc(100vh - 188px);
  display: flex;
  overflow-y: scroll;
  flex-direction: column;

  .sel-user {
    display: flex;
    align-items: center;
    background-color: #FFF8F2;
    padding: 18px;

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

      .time {
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
    margin: 20px 0;

    .text {
      font-size: 15px;
    }

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
      line-height: 24px;
      .rmb{
        font-size:18px;
      }
    }
  }

  .goods-list {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    // overflow-y scroll
  }
}

.conter {
  width: 500px;
  height: 100%;
  padding: 20px;
  box-shadow: 5px 0px 14px 0px rgba(0, 0, 0, 0.04);

  /deep/ .ivu-card-body {
    height: 100%;
    padding: 0 !important;
  }

  .cart {
    position: relative;
  }

  .pending-user {
    width: 100%;
    height: calc(100% - 50px);
    margin-top: 20px;
    overflow: hidden;
    overflow-y: scroll;

    .list {
      padding: 20px 16px;
      border-bottom: 1px solid #EEEEEE;
      cursor: pointer;
    }

    .bor {
      background: #F3F9FF;
      border: none;
      border-radius: 6px;
    }

    .item {
      display: flex;
      justify-content:space-between;

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
      .user {
        .name {
          font-weight: bold;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.85);
          margin-bottom:5px;
        }

        .order-price {
          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.85);
        }
        .price-num{
          color: #F5222D;
        }
      }
      .right_content{
        .time{
          font-size: 14px;
          font-weight: 400;
          color: rgba(102, 102, 102, 0.85);
          margin-bottom:9px;
        }
        .tidan{
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #1890FF;
          display:block;
          margin-right:14px;
          position:relative;
          &::after{
            content:"";
            width:1px;
            height:12px;
            position:absolute;
            top:5px;
            right:-14px;
            background: #DDDDDD;
          }
        }
        .shanchu{
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #F5222D;
          display:block;
          margin-left:14px;
        }
      }
      .item-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 46px;

        .money {
          display: flex;
          justify-content: space-between;
          color: #000;
          font-size: 14px;
          line-height: 14px;

          .num {
            color: #F5222D;
          }
        }
      }
    }

    .right-btn {
      display: flex;
      flex-direction: row-reverse;
      max-height: 34px;
      overflow: hidden;
      transition: max-height 0.3s;
      font-size: 14px;
    }

    .element {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s;
    }

    .btn {
      width: 58px;
      height: 34px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      margin-left: 5px;
      cursor: pointer;
    }

    .suc {
      background: #1890FF;
    }

    .del {
      background: #F5222D;
    }
  }
}

.header {
  color: #fff;

  .title {
    font-size: 18px;
    font-weight: 500;
  }

  .right {
    .pictrue {
      width: 32px;
      height: 32px;
      border-radius: 50%;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .storeBnt {
      width: 80px;
      height: 32px;
      background: #FFFFFF;
      border-radius: 1px;
      color: #1890FF;
      font-size: 14px;
      text-align: center;
      line-height: 32px;
      margin-left: 10px;
      cursor: pointer;

      &:hover {
        background-color: rgba(255, 255, 255, 0.9);
      }
    }

    .info {
      font-size: 14px;
      font-weight: 400;
      color: #fff;

      span {
        padding: 0 8px;

        & ~ span {
          border-left: 1px solid #DDDDDD;
        }
      }
    }

    .bnt {
      margin-left: 20px;
    }
  }
}

footer {
  display: flex;

  .footer {
    width: 500px;
    padding: 10px 17px 15px 17px;

    .conInfo {
      font-size: 14px;
      color: #000;

      .detailed {
        color: #999999;
        font-size: 14px;
        cursor: pointer;
      }
    }

    .pay {
      .bnt {
        border-radius: 6px;
        padding: 0 15px;
        width: 30%;
        height: 0.32rem;
        line-height: 0.32rem;
        border: 1px solid #1890FF;
        color: #1890FF;
        font-size: 0.11rem;
        text-align: center;
        font-weight: 500;
        cursor: pointer;

        &.on {
          background: #1890FF;
          color: #fff;
        }

        &.bntUid {
          background: #1890FF;
          color: #fff;
          cursor: unset;

          &.on {
            background: #ccc;
            border: 1px solid #ccc;
            color: #fff;
          }
        }
      }

      &.noCart {
        .bnt {
          border: 1px solid #ccc;
          color: #ccc;
          cursor: unset;

          &.on {
            background: #ccc;
            color: #fff;
          }
        }
      }
    }
  }

  .right {
    padding: 10px 17px 15px 17px;
    border-radius: 0 6px 6px 0;
    display: flex;
    flex: 1;
    box-shadow: 5px 0px 14px 0px rgba(0, 0, 0, 0.06);
    background-color: #fff;

    /deep/ .ivu-btn-primary {
      width: 100px;
    }

    .rightCon {
      display: flex;
      align-items: center;

      .top {
        height: 80px;
        color: rgba(0, 0, 0, 0.65);
        font-size: 13px;
        padding: 0 20px;

        .num {
          font-size: 42px;
          color: rgba(0, 0, 0, 0.85);
        }
      }

      .center {
        width: 100%;
        height: 46px;
        background-color: #1890FF;
        font-size: 13px;
        color: #fff;
        padding: 0 20px;

        .num {
          font-size: 27px;
        }
      }

      .item {
        width: 80px;
        height: 46px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #F2F3F5;
        font-size: 17px;
        border-radius: 4px;
        margin-right: 10px;
        cursor: pointer;
        color: #000000;

        &.on {
          background: #E7F3FF;
          color: #1890FF;
          font-size: 17px;
          font-weight: 400;
        }

        &.spot {
          padding-bottom: 15px;
        }
      }

      .bottom {
        padding: 10px 0 0 8px;
      }
    }

    .noCart {
      display: flex;
      align-items: center;

      .item {
        background: #ccc;
        color: #fff;
        cursor: unset;
        width: 80px;
        height: 46px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 14px;
        border-radius: 4px;
        font-size: 16px;

        &:nth-child(3) {
          &:hover {
            background-color: #ccc;
          }
        }

        &:nth-child(4) {
          &:hover {
            background-color: #ccc;
          }
        }

        &:nth-child(5) {
          &:hover {
            background-color: #ccc;
          }
        }

        &.on {
          background-color: #ccc;
        }
      }
    }
  }
}

.cashPage {
  text-align: center;

  .right {
    width: 488px;
    background: #F5F5F5;
    padding: 16px 16px 16px 0;
    border-radius: 0 6px 6px 0;

    /deep/ .ivu-btn-primary {
      width: 100px;
    }

    .rightCon {
      width: 388px;
      height: 506px;
      margin: 35px auto 20px auto;
      background-color: #fff;
      border-radius: 14px;

      .top {
        height: 80px;
        color: rgba(0, 0, 0, 0.65);
        font-size: 13px;
        padding: 0 20px;

        .num {
          font-size: 42px;
          color: rgba(0, 0, 0, 0.85);
        }
      }

      .center {
        width: 100%;
        height: 46px;
        background-color: #1890FF;
        font-size: 13px;
        color: #fff;
        padding: 0 20px;

        .num {
          font-size: 27px;
        }
      }

      .bottom {
        padding: 10px 0 0 8px;

        .item {
          width: 108px;
          height: 62px;
          background: #FAFAFA;
          border-radius: 9px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          color: #1890FF;
          font-size: 32px;
          margin-left: 12px;
          margin-top: 12px;
          cursor: pointer;

          &.on {
            background: #1890FF;
            color: #FFFFFF;
            font-size: 20px;
          }

          &.spot {
            padding-bottom: 15px;
          }
        }
      }
    }
  }

  .left {
    width: 282px;
    padding: 16px 0 16px 16px;

    .pictrue {
      width: 110px;
      height: 110px;
      margin: 180px auto 0 auto;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .text {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      margin-top: 14px;
    }

    .money {
      color: rgba(0, 0, 0, 0.85);
      font-size: 18px;

      .num {
        font-size: 32px;
        margin-left: 5px;
      }
    }
  }
}

.no-order {
  img {
    margin: 0 160px;
  }
}
</style>
