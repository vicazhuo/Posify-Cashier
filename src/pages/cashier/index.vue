<template>
  <div class="content">
    <div class="goodsCard acea-row row-between">
      <div class="conter">
        <div class="cart">
          <div :style="'height:' + 100 + '%'" class="acea-row">
            <div class="acea-row row-between row-bottom cart-left">
              <div class="left-top">
                <div v-if="checkOut == 0" class="cart">
                  <!--                  <div class="tourist" v-if="hangData.length">-->
                  <!--                    <div class="item acea-row row-middle" :class="activeHangon == index ? 'on' : ''"-->
                  <!--                      :style="{ minWidth: (item.is_check ? '100px' : '140px') }" v-for="(item, index) in hangData"-->
                  <!--                      :key="index" @click="hangDataTap(index, item)">-->
                  <!--                      <div class="picture">-->
                  <!--                        <img :src="item.avatar" v-if="item.uid" />-->
                  <!--                        <img src="@/assets/images/yonghu.png" v-else />-->
                  <!--                      </div>-->
                  <!--                      <div class="name line1">-->
                  <!--                        {{ item.uid ? item.nickname : "游客" }}-->
                  <!--                      </div>-->
                  <!--                      <div class="guadan" v-if="!item.is_check">挂单</div>-->
                  <!--                    </div>-->
                  <!--                  </div>-->

                  <div v-if="userInfo" class="title acea-row row-middle">
                    <div class="picture" @click="getUserDetail">
                      <img :src="userInfo.avatar" />
                    </div>
                    <div class="text">
                      <div class="textCon line1">
                        <div>
                          <span class="name">{{ userInfo.nickname }}</span>
                          <span v-if="userInfo.phone" class="phone mr10"
                            >{{ $t("page.user.phoneNo") }}：{{ userInfo.phone }}</span
                          >
                        </div>
                        <Dropdown
                          class="switchs"
                          trigger="click"
                          @on-click="changeMenu($event)"
                        >
                          <a href="javascript:void(0)">
                            {{ $t("page.user.changeMember") }}
                            <Icon type="ios-arrow-down"></Icon>
                          </a>
                          <DropdownMenu slot="list">
                            <DropdownItem name="1">{{ $t("page.user.chooseUser") }}</DropdownItem>
                            <DropdownItem name="2">{{ $t("page.user.visiter") }}</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                      <div v-if="userInfo.uid" class="user-msg">
                        <span class="balance"
                          >{{ $t("page.user.score") }}<span class="num">{{
                            userInfo.integral
                          }}</span></span
                        >
                        <span class="balance"
                          >{{ $t("page.user.balance") }}<span class="num">{{
                            userInfo.now_money
                          }}</span></span
                        ><span class="recharge" @click="rechargeBnt">{{ $t("page.user.recharge") }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="count">
                    <div class="cart-sel">
                      {{ $t("page.home.boughted") }}<span class="num">{{ cartSum }}</span
                      >{{ $t("page.home.piece") }}
                    </div>
                    <div class="count-r">
                      <!--                      <span class="coupon" @click="couponTap">优惠券</span>-->
                      <span class="clear" @click="delAll">
                        <img alt="" src="../../assets/images/clear.png" />
                        {{ $t("page.user.clear") }}</span
                      >
                    </div>
                  </div>
                  <div class="listCon">
                    <div class="list">
                      <div
                        v-for="(data, proindex) in cartList"
                        :key="proindex + 'data'"
                        class="promotions"
                      >
                        <div
                          v-for="(pro, index) in data.promotions"
                          :key="index + 'pro'"
                          class="promotions-msg"
                        >
                          <div class="flex-1">
                            <span class="card">{{ pro.title }}</span>
                            <span class="desc">{{ pro.desc }}</span>
                          </div>
                          <div class="collect" @click="collectOrder(pro)">
                            {{ pro.promotions_type == 1 ?  $t("page.home.casualStrollPages")  : $t("page.home.toAddOnItem")  }}
                            <span class="iconfont iconjinru"></span>
                          </div>
                        </div>
                        <div
                          v-for="(item, indexs) in data.cart"
                          :key="indexs + 'car'"
                          :class="{ is_give: item.is_gift }"
                          class="item acea-row row-middle"
                        >
                          <div class="picture">
                            <img
                              v-if="item.productInfo.attrInfo"
                              :src="item.productInfo.attrInfo.image"
                            />
                            <img v-else :src="item.productInfo.image" />
                          </div>
                          <div v-if="!item.is_gift" class="text">
                            <div class="name line1">
                              {{ item.productInfo.store_name }}
                            </div>
                            <div
                              v-if="
                                item.productInfo.attrInfo &&
                                  item.productInfo.spec_type
                              "
                              class="info"
                              @click="cartAttr(item)"
                            >
                              <div class="suk line1">
                                {{ item.productInfo.attrInfo.suk }}
                              </div>
                              <span class="iconfont iconxiayi"></span>
                            </div>
                            <div v-else class="info">{{ $t("page.home.default") }}</div>
                            <div class="sum_price">¥ {{ item.sum_price }}</div>
                          </div>
                          <div v-else class="text">
                            <div class="give-name line1">
                              {{ item.productInfo.store_name }}
                            </div>
                            <div class="give-info">{{ $t("page.home.gift") }}</div>
                          </div>
                          <div
                            v-if="!item.is_gift"
                            class="del"
                            @click="delCart(item, proindex, indexs, 'cart')"
                          >
                            {{ $t("page.common.delete") }}
                          </div>
                          <div
                            v-if="!item.is_gift"
                            class="cartBnt acea-row row-center-wrapper"
                          >
                            <div
                              class="iconfont iconjian"
                              @click="calculate(item, 'reduce')"
                            ></div>
                            <!--                            <input type="text" v-model="item.cart_num">-->
                            <InputNumber
                              v-model="item.cart_num"
                              :max="item.productInfo.attrInfo.stock"
                              :min="1"
                              @on-blur="
                                (e) => {
                                  changeCart(e, item);
                                }
                              "
                            ></InputNumber>
                            <div
                              class="iconfont iconjia"
                              @click="calculate(item, 'add')"
                            ></div>
                          </div>
                          <div v-else class="cartBnt">
                            <span>x{{ item.cart_num }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="invalidList.length" class="list promotions">
                      <div
                        v-for="(item, index) in invalidList"
                        :key="index"
                        class="item acea-row row-middle"
                      >
                        <div class="picture">
                          <img
                            v-if="item.productInfo.attrInfo"
                            :src="item.productInfo.attrInfo.image"
                          />
                          <img v-else :src="item.productInfo.image" />
                        </div>
                        <div class="text invalid">
                          <div class="name line1">
                            {{ item.productInfo.store_name }}
                          </div>
                          <div v-if="item.productInfo.attrInfo" class="info">
                            <div class="suk line1">
                              {{ item.productInfo.attrInfo.suk }}
                            </div>
                            <span class="iconfont iconxiayi"></span>
                          </div>
                          <div v-else class="info">{{ $t("page.home.default") }}</div>
                          <div class="end">{{ $t("page.home.invalid") }}</div>
                        </div>
                        <div
                          class="del"
                          @click="delCart(item, index, 1, 'inv')"
                        >
                          {{ $t("page.common.delete") }}
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="!invalidList.length && !cartList.length"
                      class="noCart acea-row row-center-wrapper v-center"
                    >
                      <div>
                        <div class="picture">
                          <img src="@/assets/images/no-cart.png" />
                        </div>
                        <div class="tip">{{ $t("page.home.nonCartGoods") }}</div>
                      </div>
                    </div>
                    <div class="left">
                      <div class="conInfo">
                        <div></div>
                        <div class="right">
                          <div class="storeBnt" @click="storeTap">
                            <span class="text line1">{{
                              storeInfos ? storeInfos.staff_name : $t("page.user.switchStaff")
                            }}</span>
                            <Icon
                              style="display: inline-block; padding-left: 10px"
                              type="ios-arrow-down"
                            />
                          </div>
                          <div class="discount">
                            {{ $t("page.home.discount") }}: ¥{{
                              this.$computes.Sub(
                                priceInfo.sumPrice || 0,
                                priceInfo.payPrice || 0
                              ) || 0
                            }}
                          </div>
                          <div
                            v-if="cartList.length"
                            class="detailed"
                            @click="discountCon"
                          >
                            {{ $t("page.home.detail") }}
                          </div>
                          <span class="discount">{{ $t("page.home.payment") }}: </span>
                          <span class="rmb">¥</span>
                          <span class="num">{{
                            priceInfo.payPrice ? priceInfo.payPrice : 0
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="cart" style="padding-top: 15px">
                  <Form
                    ref="lodgeFrom"
                    :label-width="100"
                    :model="lodgeFrom"
                    @submit.native.prevent
                  >
                    <FormItem :labelWidth="20" label="" label-for="nickname">
                      <Row>
                        <Col>
                          <Input
                            v-model="lodgeFrom.keyword"
                            element-id="nickname"
                            enter-button
                            :placeholder="$t('page.tips.userConnect')"
                            search
                            style="width: 370px"
                            @on-search="storeSearch"
                          >
                          </Input>
                        </Col>
                      </Row>
                    </FormItem>
                  </Form>
                  <Table
                    ref="selection"
                    :columns="columns"
                    :data="tableHang"
                    :loading="loading"
                    class="tableList"
                    highlight-row
                    :no-filtered-userFrom-text="$t('page.home.noResult')"
                    :no-userFrom-text="$t('page.home.noData')"
                  >
                    <template slot="nickname" slot-scope="{ row }">
                      <div>{{ row.uid ? row.nickname : "游客" }}</div>
                    </template>
                    <template slot="action" slot-scope="{ row, index }">
                      <a @click="billHang(row, index)">{{ $t("page.home.pickup") }}</a>
                      <a class="ml10" @click="hangDel(row, index)">{{ $t("page.common.delete") }}</a>
                    </template>
                  </Table>
                  <div class="acea-row row-right page mr5">
                    <Page
                      :current="lodgeFrom.page"
                      :page-size="lodgeFrom.limit"
                      :total="totalHang"
                      show-total
                      size="small"
                      @on-change="pageHangChange"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods">
        <div class="acea-row" style="height: 100%">
          <div class="goodsCon">
            <div class="goods-top">
              <Input
                v-model="goodFrom.store_name"
                :maxlength="20"
                class="input"
                element-id="name"
                enter-button
                :placeholder="$t('page.tips.goodsSearch')"
                search
                size="large"
                @on-search="orderSearch"
              >
                <Select
                  slot="prepend"
                  v-model="goodFrom.field_key"
                  style="width: 90px"
                >
                  <Option value="all">{{ $t("page.home.all") }}</Option>
                  <Option value="store_name">{{ $t("page.home.allGoods") }}</Option>
                  <Option value="id">ID</Option>
                  <Option value="bar_code">{{ $t("page.home.uniqueCode") }}</Option>
                </Select>
              </Input>
              <div
                v-if="
                  goodData.length &&
                    (goodFrom.cate_id !== '99999' || activityFrom.type)
                "
                class="list acea-row"
              >
                <div
                  v-for="(item, index) in goodData"
                  :key="index"
                  :class="item.stock > 0 ? 'on' : ''"
                  class="item"
                  @click="attrTap(item)"
                >
                  <div class="name line1">
                    {{ item.store_name || item.title }}
                  </div>
                  <div class="text">
                    <div class="text-left">
                      <div class="stock">
                        <span v-if="item.coupon">券</span>
                        <span
                          v-if="
                            item.promotions && !Array.isArray(item.promotions)
                          "
                          >{{ item.promotions.title }}</span
                        >
                        <span v-if="activityFrom.type == 5">{{ $t("page.home.seckilled") }}</span>
                      </div>
                      <div class="money">
                        <span class="rmb">¥</span>{{ item.price }}
                      </div>
                    </div>
                    <div class="picture">
                      <img :src="item.image" :alt="$t('page.home.productionImage')" />
                      <!-- 查找 -->
                    </div>
                    <div
                      v-if="item.cart_num && cartList.length"
                      class="icon-cart-num"
                    >
                      {{ item.cart_num > 99 ? "99+" : item.cart_num }}
                    </div>
                    <div v-if="!item.stock && !item.cart_num" class="no-stock">
                      <div class="trip">
                        <div>{{ $t("page.home.nonData") }}</div>
                        <div>{{ $t("page.home.stock") }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-else-if="goodFrom.cate_id === '99999' && !activityFrom.type"
              >
                <activityCard
                  v-if="!activityFrom.type"
                  :uid="userInfo.uid"
                  @selectaActivity="selectaActivity"
                >
                </activityCard>
              </div>
              <div v-else class="noGood acea-row row-center-wrapper">
                <div>
                  <div class="picture">
                    <img
                      :src="
                        require(`@/assets/images/${
                          goodFrom.cate_id == '99999'
                            ? 'no-active.png'
                            : 'no-goods.png'
                        }`)
                      "
                    />
                  </div>
                  <div class="tip">
                    {{
                      goodFrom.cate_id === "99999" ?$t("page.home.nonActivity")  :$t("page.home.nonGoods")
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="goodData.length &&(goodFrom.cate_id !== '99999' || activityFrom.type)" class="acea-row row-right page">
              <Page
                :page-size="goodFrom.limit"
                :total="total"
                show-elevator
                show-total
                @on-change="pageChange"
              />
            </div>
          </div>
          <div class="goodClass acea-row row-center">
            <div>
              <div
                v-for="(item, index) in cateData"
                :key="index"
                :class="currentCate == index ? 'on' : ''"
                class="item line1"
                @click="cateTap(item, index)"
              >
                {{ item.cate_name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <div class="footer">
        <div v-if="cartList.length" class="pay acea-row row-between-wrapper">
          <div class="bnt acea-row row-center row-middle" @click="payPrice('cash')">
            <span>现金收款</span>
          </div>
          <div class="bnt acea-row row-center row-middle" @click="payPrice('')">
            <span>微信/支付宝</span>
          </div>
          <div
            v-if="
              userInfo.uid && userInfo.now_money >= (priceInfo.payPrice || 0)
            "
            class="bnt on acea-row row-center row-middle"
            @click="payPrice('yue')"
          >
            <span>余额收款</span>
          </div>
          <div v-else class="bnt on bntUid acea-row row-center row-middle">
            余额收款
          </div>
        </div>
        <div v-else class="pay noCart acea-row row-between-wrapper">
          <div class="bnt acea-row row-center row-middle">
            <span>现金收款</span>
          </div>
          <div class="bnt acea-row row-center row-middle">
            <span>微信/支付宝</span>
          </div>
          <div class="bnt on acea-row row-center row-middle">
            <span>余额收款</span>
          </div>
        </div>
      </div>
      <div class="right">
        <div v-if="cartList.length" class="rightCon">
          <div v-if="!checkOut" class="item goast" @click="lodgeTap">挂单</div>
          <div :class="integral ? 'on' : ''" class="item" @click="integralTap">
            积分
          </div>
          <div class="item" @click="couponTap">优惠券</div>
          <div class="item" @click="changePrice">改价</div>
          <div class="item" @click="remarks">备注</div>
        </div>
        <div v-else class="noCart">
          <div v-if="!checkOut" class="item">挂单</div>
          <div class="item">积分</div>
          <div class="item">改价</div>
          <div class="item">备注</div>
        </div>
        <!-- <div
          class="item"
          @click="delAll"
          v-if="cartList.length || invalidList.length"
        >
          清空
        </div>
        <div class="noCart" v-else>
          <div class="item">清空</div>
        </div> -->
      </div>
    </footer>
    <Modal
      v-model="modalUser"
      :mask-closable="false"
      :scrollable="true"
      closable
      footer-hide
      :title="$t('page.user.userList')"
      width="950"
    >
      <userList
        v-if="modalUser"
        ref="users"
        :uid="userInfo.uid || 0"
        @getUserId="getUserId"
      ></userList>
    </Modal>
    <recharge
      ref="recharge"
      :userInfo="userInfo"
      @getSuccess="getSuccess"
    ></recharge>
    <couponList
      v-if="userInfo && cartList.length"
      ref="coupon"
      :couponId="couponId"
      :cartList="cartList"
      :uid="userInfo.uid"
      @getCouponId="getCouponId"
    ></couponList>
    <storeList
      ref="store"
      :storeInfo="storeInfos"
      @getStoreId="getStoreId"
      @getUserInfo="getUserInfo"
    ></storeList>
    <!-- :uid="userInfo?userInfo.uid:0" -->
    <productAttr
      ref="attrs"
      :attr="attr"
      :disabled="disabled"
      :isCart="isCart"
      @ChangeAttr="ChangeAttr"
      @goCat="goCat"
    >
    </productAttr>
    <productAttr
      ref="skillAttrs"
      :attr="attr"
      :disabled="disabled"
      :isCart="isCart"
      :isSkill="true"
      @ChangeAttr="ChangeAttr"
      @goCat="goPay"
    ></productAttr>
    <Modal
      v-model="payTypeModal"
      footer-hide
      :title="$t('page.home.payMehod')"
      @on-visible-change="changeModal"
    >
      <div class="payModal">
        <div class="type" @click="payPrice('cash')">
          <div class="img">
            <img alt="" src="../../assets/images/xpay.png" />
          </div>
          <div class="text">现金收款</div>
        </div>
        <div class="type" @click="payPrice('')">
          <div class="img">
            <img alt="" src="../../assets/images/wx_zfb_pay.png" />
          </div>
          <div class="text">微信/支付宝</div>
        </div>
        <div class="type" @click="payPrice('yue')">
          <div class="img">
            <img alt="" src="../../assets/images/yue.png" />
          </div>
          <div class="text">余额收款</div>
        </div>
      </div>
    </Modal>
    <Modal v-model="modal" footer-hide title="备注">
      <!--      <form-create-->
      <!--          v-model="fapi"-->
      <!--          :rule="rule"-->
      <!--          @on-submit="onSubmit"-->
      <!--          class="remark"-->
      <!--      ></form-create>-->
      <Input
        v-model="createOrder.remarks"
        :rows="5"
        maxlength="200"
        placeholder="订单备注"
        show-word-limit
        style="width: 100%"
        type="textarea"
      />
      <Button class="mt20" long type="primary" @click="onSubmit()">提交</Button>
    </Modal>
    <Modal
      v-model="modal2"
      footer-hide
      title="订单改价"
      @on-cancel="cancelPrice"
    >
      <Form :label-width="100" :model="formItem">
        <FormItem label="订单改价：">
          <div class="acea-row">
            <div class="inputNum">
              <InputNumber
                v-model="formItem.price"
                :max="9999999"
                :min="0"
                @on-change="tapPrice"
              ></InputNumber>
              元
            </div>
            <div class="inputNum discount">
              <InputNumber
                v-model="discountPrice"
                :max="100"
                :min="0"
                @on-change="tapDiscount"
              ></InputNumber>
              %
            </div>
          </div>
        </FormItem>
        <FormItem label="改价后金额：">
          <div class="changePrice">
            ¥<span class="price">{{ formItem.price || 0 }}</span>
          </div>
        </FormItem>
        <div class="acea-row row-center-wrapper">
          <Button class="buttonPrice" type="primary" @click="onSubmit2"
            >确认改价
          </Button>
        </div>
      </Form>
      <!-- 			<form-create v-model="fapi2" :rule="rule2" @on-submit="onSubmit2" class="remark"></form-create> -->
    </Modal>

    <Modal
      v-model="modalPay"
      class="modalPay"
      footer-hide
      width="430px"
      @on-cancel="modalPayCancel"
    >
      <div class="payPage">
        <div class="header acea-row row-center-wrapper">
          <div class="picture"><img src="../../assets/images/gold.png" /></div>
          <div class="text">应收金额(元)</div>
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
          placeholder="请点击输入框聚焦扫码或输入编码号"
          size="large"
          style="margin-top: 16px"
          type="url"
          @input="inputSaoMa"
        />
        <div class="process">
          <div class="picture">
            <img
              v-if="createOrder.pay_type == 'yue'"
              src="../../assets/images/process1.png"
            />
            <img v-else src="../../assets/images/process2.png" />
          </div>
          <div class="list acea-row row-between-wrapper">
            <div class="item one">
              <div class="name">
                {{
                  createOrder.pay_type == "yue" ? "出示付款码" : "扫描收银码"
                }}
              </div>
              <div>
                {{
                  createOrder.pay_type == "yue"
                    ? "用户打开个人中心"
                    : "引导用户扫描"
                }}
              </div>
            </div>
            <div class="item two">
              <div class="name">
                {{ createOrder.pay_type == "yue" ? "扫描付款码" : "完成支付" }}
              </div>
              <div>
                {{ createOrder.pay_type == "yue" ? "扫码枪" : "用户线上支付" }}
              </div>
            </div>
            <div class="item three">
              <div class="name">确认收款</div>
              <div>收银台点击确认</div>
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
      class="cash"
      footer-hide
      width="770px"
      @on-cancel="cancel"
    >
      <div class="cashPage acea-row">
        <div class="left">
          <div class="picture">
            <img src="../../assets/images/gold.png" />
          </div>
          <div class="text">应收金额(元)</div>
          <div class="money">
            ¥<span class="num">{{
              priceInfo.payPrice ? priceInfo.payPrice : 0
            }}</span>
          </div>
        </div>
        <div class="right">
          <div class="rightCon">
            <div class="top acea-row row-between-wrapper">
              <div>实际收款(元)</div>
              <div class="num">{{ collection }}</div>
            </div>
            <div class="center acea-row row-between-wrapper">
              <div>需找零(元)</div>
              <div
                v-if="
                  this.$computes.Sub(
                    collection,
                    priceInfo.payPrice ? priceInfo.payPrice : 0
                  ) > 0
                "
                class="num"
              >
                {{
                  this.$computes.Sub(
                    collection,
                    priceInfo.payPrice ? priceInfo.payPrice : 0
                  )
                }}
              </div>
              <div v-else class="num">0</div>
            </div>
            <div class="bottom acea-row">
              <div
                v-for="(item, index) in numList"
                :key="index"
                :class="item == '.' ? 'spot' : ''"
                class="item acea-row row-center-wrapper"
                @click="numTap(item)"
              >
                {{ item }}
              </div>
              <div class="item acea-row row-center-wrapper" @click="delNum">
                <Icon type="ios-backspace" />
              </div>
            </div>
          </div>
          <Button type="primary" @click="cashBnt">确认</Button>
        </div>
      </div>
    </Modal>
    <Modal
      v-model="discount"
      class-name="vertical-center-modal"
      footer-hide
      :title="$t('page.home.decountDetails')"
      width="400"
    >
      <div class="discountCon">
        <div class="item acea-row row-between-wrapper">
          <div>{{$t('page.home.orderPrice')}}</div>
          <div>{{ priceInfo.sumPrice || 0 }}</div>
        </div>
        <div class="item acea-row row-between-wrapper">
          <div>{{$t('page.home.memberShipDiscount')}}：</div>
          <div>{{ priceInfo.vipPrice || 0 }}</div>
        </div>
        <div class="item acea-row row-between-wrapper">
          <div>{{$t('page.home.payByCoupon')}}：</div>
          <div>{{ priceInfo.couponPrice || 0 }}</div>
        </div>
        <div class="item acea-row row-between-wrapper">
          <div>{{$t('page.home.payByScore')}}：</div>
          <div>{{ priceInfo.deductionPrice || 0 }}</div>
        </div>
        <div
          v-for="(item, index) in priceInfo.promotionsDetail"
          :key="index"
          class="item acea-row row-between-wrapper"
        >
          <div>{{ item.title }}：</div>
          <div>{{ item.promotions_price || 0 }}</div>
        </div>
      </div>
    </Modal>
    <Modal
      v-model="userInfoShow"
      class-name="vertical-center-modal"
      footer-hide
      :title="$t('page.home.whetherSwitchUser')"
      width="340"
    >
      <div class="search_user_info">
        <div class="picture">
          <img :src="modalUserInfo.avatar" alt="" />
        </div>
        <p class="user_name">{{ modalUserInfo.real_name }}</p>
        <p class="user_id">ID:{{ modalUserInfo.uid }}</p>
        <p class="user_phone">{{$t('page.user.phoneNo')}}：{{ modalUserInfo.phone }}</p>
        <div class="sure_btn" @click="checkUser()">{{$t('page.common.confirm')}}</div>
      </div>
    </Modal>
    <!-- 会员详情-->
    <user-details ref="userDetails" @operation="operation"></user-details>
  </div>
</template>

<script>
import userList from "@/components/userList";
import storeList from "@/components/storeList";
import couponList from "@/components/couponList";
import productAttr from "./components/productAttr";
import recharge from "@/components/recharge";
import activityCard from "@/components/activityCard";
import userDetails from "@/components/userDetail/userDetails";

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
  cashierGetAttr,
} from "@/api/order";
import { checkOrderApi, getUserInfo } from "@/api/user";
import { activityList } from "@/api/product";

export default {
  name: "index",
  components: {
    userList,
    storeList,
    productAttr,
    couponList,
    recharge,
    activityCard,
    userDetails,
  },
  data() {
    return {
      formItem: {
        price: 0,
      },
      discountPrice: 100,
      loading: false,
      cashBntLoading: false,
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
          title: $t('page.common.choose'),
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
          title: $t('page.common.customer'),
          slot: "nickname",
          minWidth: 70,
        },
        {
          title: $t('page.order.price'),
          key: "price",
          minWidth: 70,
        },
        {
          title: $t('page.order.date'),
          key: "_add_time",
          minWidth: 70,
        },
        {
          title: $t('page.common.operation'),
          slot: "action",
          minWidth: 100,
          align: "center",
        },
      ],
      checkOut: 0,
      modalUser: false,
      flag: true,
      goodFrom: {
        store_name: "",
        field_key: "all",
        cate_id: "",
        page: 1,
        limit: 12,
        uid: 0,
        staff_id: 0,
      },
      activityFrom: {
        page: 1,
        limit: 12,
        type: 0,
        uid: 0,
        promotions_id: 0,
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
      seckillId: 0, //秒杀商品id
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
          title: $t('page.common.mark'),
          props: {
            type: "textarea",
            maxlength: 100,
            "show-word-limit": true,
          },
        },
      ],
      modal2: false,
      rule2: [
        {
          type: "InputNumber",
          field: "change_price",
          title: $t('page.order.netPay'),
          value: 0,
          props: {
            min: 0,
          },
        },
      ],
      integral: false, //是否使用积分
      coupon: false, //是否使用优惠券
      couponId: 0, //优惠券id
      modalPay: false,
      payTypeModal: false,
      cartSum: 0,
      priceInfo: {},
      createOrder: {
        remarks: "",
        change_price: 0,
        cart_id: [], // 购物车id
        userCode: "",
        is_price: 0,
        auth_code: "",
      },
      modalCash: false,
      numList: ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."],
      collectionArray: [],
      collection: 0,
      isOrderCreate: 0,
      discount: false,
      payType: "", // 支付方式
      orderId: "", //订单id
      seckillOrderId: "", //秒杀订单id
      clientHeight: 0,
      cartHeight: 0,
      goodsHeight: 0,
      invalidList: [],
      promotionsList: [],
      defaultcalc: false,
      orderSystem: {
        loadingMsg: null,
        timer: null,
      },
      disabled: false, //阻止属性弹窗多次提交
      unchangedPrice: 0,
      cumping: false, //加减节流
      modalUserInfo: {}, //搜索出来的用户信息
      userInfoShow: false, //扫码枪搜索用户弹窗状态
    };
  },
  created() {
    let clientWidth = document.documentElement.clientWidth;
    let pageLimt;
    if (clientWidth > 2260) {
      pageLimt = 20;
    } else if (clientWidth > 1580) {
      pageLimt = 16;
    } else if (clientWidth > 1270) {
      pageLimt = 12;
    }
    this.goodFrom.limit = pageLimt;
    this.activityFrom.limit = pageLimt;
    this.userInfo = JSON.parse(window.localStorage.getItem("cashierUser"));
    this.cateList();
    if (this.$route.query.uid || this.$route.query.tourist_uid) {
      let uid = this.$route.query.uid,
        touristId = this.$route.query.tourist_uid,
        staffId = this.$route.query.staff_id,
        index = this.$route.query.index;
      this.checkOut = 0;
      this.activeHangon = index;
      this.storeInfos.id = staffId;
      let data = {
        uid,
      };
      if (uid != 0) {
        this.userInfoData(data, true);
      } else {
        this.setUp(touristId, true);
      }
    }
  },
  mounted() {},
  methods: {
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
      this.promotionsList = [];
      this.cartSum = 0;
      this.collection = 0;
      this.collectionArray = [];
      this.createOrder.change_price = 0;
      this.createOrder.remarks = "";
      this.coupon = false;
      this.couponId = 0;
      this.integral = false;
      this.createOrder.is_price = 0;
      this.activityFrom.type = 0;
      this.goodFrom.cate_id = "";
    },
    cancel() {
      this.collection = 0;
      this.collectionArray = [];
    },
    // 挂单区删除
    hangDel(row, index) {
      cashierHang(row.id)
        .then((res) => {
          if (this.tableHang.length == 1) {
            this.lodgeFrom.page = 1;
            this.hangList();
          } else {
            this.tableHang.splice(index, 1);
            this.totalHang = this.totalHang - 1;
          }
          this.hangData[index].is_check = 1;
          this.$Message.success(res.msg);
        })
        .catch((err) => {
          this.$Message.error(err.msg);
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
      this.activityFrom.type = 0;
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
          this.tableHang = res.data.data;
          this.totalHang = res.data.count;
        })
        .catch((err) => {
          this.loading = false;
          this.$Message.error(err.msg);
        });
    },
    pageHangChange(e) {
      this.lodgeFrom.page = e;
      this.hangList();
    },
    // 提单；
    billHang(item, index) {
      this.checkOut = 0;
      this.activeHangon = index;
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
    //快速挂单列表（最左侧的）
    hangDataList() {
      let storeId = this.storeInfos.id;
      getHang(storeId)
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
      // let data = {
      //   cart_ids: this.createOrder.cart_id,
      //   uid: this.userInfo.uid || 0,
      //   tourist_uid: this.userInfo.touristId || "",
      //   staff_id: this.storeInfos.id,
      //   price: this.priceInfo.payPrice || 0,
      // };
      let userInfo = {
        avatar: require("@/assets/images/yonghu.png"),
        nickname: $('page.user.visitor'),
        uid: 0,
        touristId: this.userInfo.touristId,
      };
      this.userInfo = userInfo;
      let storage = window.localStorage;
      storage.setItem("cashierUser", JSON.stringify(userInfo));
      setTimeout((e) => {
        this.hangDataTap(0, this.hangData[0]);
      }, 500);
      // postCashierHang(data)
      //     .then((res) => {
      //       this.activeHangon = -1;
      //       this.$Message.success(res.msg);
      //       this.hangDataList();
      //       this.hangList();
      //       this.setUp();
      //     })
      //     .catch((err) => {
      //       this.$Message.error(err.msg);
      //     });
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
      } else if (touristId) {
        this.activeHangon = -1;
        this.hangData.forEach((item, index) => {
          if (item.tourist_uid == touristId) {
            this.activeHangon = index;
          }
        });

        if (this.activeHangon == -1) {
          this.activeHangon = 0;
          this.userInfo.touristId = this.hangData[0].tourist_uid;
        }
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
          msg();
          that.isOrderCreate = 1;
          that.$Message.success($t("page.common.paySuccess"));
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
            this.$Message.success($t("page.common.paySuccess"));
            this.goodList();
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
    payPrice(payType) {
      this.payType = payType;
      if (payType == "" || payType == "yue") {
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
      } else if (payType == "cash") {
        this.modalCash = true;
        this.collection = this.priceInfo.payPrice ? this.priceInfo.payPrice : 0;
        this.keyboard();
      }
      this.createOrder.integral = this.integral;
      this.createOrder.coupon = this.coupon;
      this.createOrder.coupon_id = this.couponId;
      if (this.coupon && !this.couponId)
        return this.$Message.error($t("page.home.invaildCoupon"));
      this.createOrder.pay_type = payType;
      this.createOrder.staff_id = this.storeInfos.id;
      // this.fapi.resetFields();
    },
    // 线上支付和余额支付
    confirm() {
      if (this.payType == "yue") {
        // this.createOrder.userCode = this.payNum;
        if (!this.createOrder.userCode) {
          return this.$Message.error($t("page.home.sacenQrcoe"));
        }
        if (this.isOrderCreate) {
          this.getCashierPay("yue");
        } else {
          this.orderCreate();
        }
      } else if (this.payType == "") {
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
            this.$Message.success($t("page.common.payScuess"));
            this.modalCash = false;
            this.modalPay = false;
            this.changePoints();
            let storage = window.localStorage;
            storage.setItem("cashierUser", JSON.stringify(this.userInfo));
            this.clear();
            this.goodList();
          } else if (res.data.status == "PAY_ING") {
            let msg = this.$Message.loading({
              content:  $t("page.order.payWaiting"),
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
      if (this.payType == "cash") {
        if (parseFloat(this.priceInfo.payPrice) > parseFloat(this.collection)) {
          return this.$Message.error($t("page.home.balanceLess"));
        }
      }
      this.createOrder.tourist_uid = this.userInfo.touristId;
      if (this.activityFrom.type == 5) {
        this.createOrder.cart_id = [this.seckillOrderId];
        this.createOrder.new = 1;
      }
      cashierCreate(this.userInfo.uid, this.createOrder)
        .then((res) => {
          let storage = window.localStorage;
          this.payNum = "";
          if (this.payType == "yue") {
            this.modalPay = false;
            this.payNum = "";
            this.createOrder.userCode = "";
            if (res.data.status == "ORDER_CREATE") {
              this.isOrderCreate = 1;
              this.orderId = res.data.order_id;
              this.$Message.success(res.data.message);
            } else if (res.data.status == "SUCCESS") {
              this.isOrderCreate = 0;
              this.$Message.success($t('page.common.paySuccess'));
              let money = this.$computes.Sub(
                this.userInfo.now_money,
                this.priceInfo.payPrice
              );
              this.userInfo.now_money = money;
              this.changePoints();
              this.payTypeModal = false;
              this.modalPay = false;
              storage.setItem("cashierUser", JSON.stringify(this.userInfo));
              this.goodList();
              this.clear();
            } else {
              this.isOrderCreate = 1;
              this.orderId = res.data.order_id;
              this.$Message.error(res.data.message);
            }
          }
          if (this.payType == "cash") {
            if (res.data.status == "SUCCESS") {
              this.$Message.success($t('page.common.paySuccess'));
              // storage.removeItem("cashierUser");
              // this.userInfo = null;
              this.changePoints();
              storage.setItem("cashierUser", JSON.stringify(this.userInfo));
              this.goodList();
              this.modalCash = false;
              this.payTypeModal = false;
              this.clear();
            }
          }
          if (this.payType == "") {
            this.payNum = "";
            this.createOrder.auth_code = "";
            if (res.data.status == "ORDER_CREATE") {
              this.isOrderCreate = 1;
              this.orderId = res.data.order_id;
              this.$Message.success(res.data.message);
            } else if (res.data.status == "PAY_ING") {
              let msg = this.$Message.loading({
                content: $t("page.order.payWaiting"),
                duration: 0,
              });
              this.orderId = res.data.order_id;
              this.checkOrderTime(msg);
            } else if (res.data.status == "SUCCESS") {
              this.$Message.success($t('page.common.paySuccess'));
              // storage.removeItem("cashierUser");
              // this.userInfo = null;
              // this.setUp();
              this.changePoints();
              storage.setItem("cashierUser", JSON.stringify(this.userInfo));
              this.goodList();
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
      // this.hangDataList();
      //顶部挂单列表中删除刚才支付成功的用户
      this.hangData.splice(this.activeHangon, 1);
      //重置默认选中
      this.activeHangon = 0;
      this.hangDataTap(0, this.hangData[0]);
      //
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
    changeModal(n) {
      if (!n) {
        this.cartCompute();
      }
    },
    // 计算金额
    cartCompute() {
      if (!this.cartList.length) {
        this.priceInfo = {};
        return;
      }
      let ids = [];
      this.cartList.forEach((item) => {
        item.cart.forEach((good) => {
          ids.push(good.id);
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
        this.$Message.warning($t('page.home.useCustomerScore'));
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
    del(ids, type, index, num, name) {
      this.$Modal.confirm({
        title:$t("page.home.removeCart") ,
        content:$t("page.home.delConfim"),
        onOk: () => {
          cashierCartDel(this.userInfo.uid, ids)
            .then((res) => {
              this.$Message.success($t("page.common.deleteSucess"));
              this.goodList();
              if (type) {
                this.clear();
                this.invalidList = [];
                this.hangDataList();
              } else {
                if (name == "inv" && num) {
                  this.invalidList.splice(index, 1);
                } else {
                  this.cartList[index].cart.splice(num, 1);
                  if (this.cartList.length) {
                    this.getCartList();
                    if (this.activityFrom.type) {
                      this.goodList(this.activityFrom.type);
                    } else {
                      this.goodList();
                    }
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
      if (!this.cartList.length && !this.invalidList.length)
        return this.$Message.warning($t("page.home.nonCartGoods"));
      this.cartList.forEach((item) => {
        item.cart.forEach((good) => {
          ids.push(good.id);
        });
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
    delCart(item, index, num, type) {
      let ids = [];
      ids.push(item.id);
      this.del(
        {
          ids: ids,
        },
        0,
        index,
        num,
        type
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
      if (this.activeHangon == -1) this.activeHangon = 0;
      // let uid = this.userInfo.uid;
      let uid = this.hangData[this.activeHangon].uid || this.userInfo.uid || 0;
      let data = {
        productId: this.productId,
        seckillId: this.seckillId,
        cartNum: 1,
        uniqueId: num
          ? this.attr.productSelect !== undefined
            ? this.attr.productSelect.unique
            : ""
          : "",
        staff_id: this.storeInfos.id,
        tourist_uid: this.userInfo.touristId,
        new: 0,
      };
      cashierCart(uid, data)
        .then((res) => {
          this.$refs.attrs.modals = false;
          this.$Message.success($t("page.home.addGoodsSuccess"));
          this.getCartList();
          if (this.activityFrom.type) {
            cosnole.log("类型");
          } else {
            //如果是扫码查询商品摒弃直接加入购物车的情况下，在加入购物车成功以后，清空输入框的内容，重新请求列表
            this.goodFrom.store_name = "";
            this.goodList();
          }
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
    changeCart(e, item) {
      let uid = item.uid;
      let data = {
        number: item.cart_num,
        id: item.id,
      };
      cashierCartNum(uid, data)
        .then((res) => {
          this.getCartList();
          this.cartCompute();
          this.goodList();
        })
        .catch((err) => {
          if (type === "reduce" && item.cart_num > 1) {
            item.cart_num++;
          } else if (type === "add" && item.cart_num < item.branch_stock) {
            item.cart_num--;
          }
          this.$Message.error(err.msg);
        });
    },
    calculate(item, type) {
      if (this.cumping) return;
      if (type === "reduce" && item.cart_num > 1) {
        item.cart_num--;
      } else if (type === "add" && item.cart_num < item.branch_stock) {
        item.cart_num++;
      } else {
        return this.$Message.error(
          item.cart_num === 1 ? $t("page.home.buyQuanlityNoLess") : $t("page.home.stockLess")
        );
      }
      let uid = item.uid;
      let data = {
        number: item.cart_num,
        id: item.id,
      };
      this.cumping = true;
      cashierCartNum(uid, data)
        .then((res) => {
          this.getCartList();
          this.cartCompute();
          this.goodList();
        })
        .catch((err) => {
          if (type === "reduce" && item.cart_num > 1) {
            item.cart_num++;
          } else if (type === "add" && item.cart_num < item.branch_stock) {
            item.cart_num--;
          }
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
          // this.cartList.forEach(res => {
          // 	if (res.id == this.cartInfo.cart_id) {
          // 		res.productInfo.attrInfo.suk = this.attrValue;
          // 		res.truePrice = this.attr.productSelect.price;
          // 	}
          // })
          this.cartCompute();
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    goCat(e) {
      if (e) {
        this.changeCartAttr();
      } else {
        this.joinCart(1);
      }
    },
    //秒杀购买
    goPay() {
      this.joinSkillCart(0);
    },
    joinSkillCart(num) {
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
        secKillId: this.seckillId,
        cartNum: 1,
        uniqueId: this.attr.productSelect.unique,
        staff_id: this.storeInfos.id,
        tourist_uid: this.userInfo.touristId,
        new: 1,
      };
      cashierCart(uid, data)
        .then((res) => {
          this.seckillOrderId = res.data.cartId;
          this.$refs.skillAttrs.modals = false;
          this.payTypeModal = true;
          this.cartComputeActivity(res.data.cartId);
          this.disabled = true;
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    // 获取用户详情
    getUserDetail() {
      if (this.userInfo.uid) {
        this.$refs.userDetails.modals = true;
        this.$refs.userDetails.activeName = "info";
        this.$refs.userDetails.getDetails(this.userInfo.uid);
      }
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
            // this.promotionsList = res.data.promotions;
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
    // 选择属性
    attrTap(item) {
      this.disabled = false;
      if (this.userInfo && this.userInfo.uid >= 0) {
        this.productId = item.product_id;
        if (!item.stock) return this.$Message.error($t("page.home.stockLess"));

        if (this.activityFrom.type === "5") {
          this.seckillId = item.id;
          this.isCart = 0; //判断切换属性或是加入购物车：0加入购物车；1切换属性
          this.$refs.skillAttrs.modals = true;
          this.cashierGetAttr(item.id);
        } else if (item.spec_type) {
          this.isCart = 0; //判断切换属性或是加入购物车：0加入购物车；1切换属性
          this.$refs.attrs.modals = true;
          this.goodsInfo(item.product_id || item.id);
        } else {
          // 0为单规格属性
          this.joinCart(0);
        }
      } else {
        this.$Message.error($t("page.home.switchOtherCustomer"));
      }
    },
    // 商品详情
    goodsInfo(id) {
      cashierDetail(id, this.userInfo.uid)
        .then((res) => {
          let data = res.data;
          this.storeInfo = data.storeInfo;
          this.productValue = data.productValue;
          this.$set(this.attr, "productAttr", data.productAttr);
          this.DefaultSelect();
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    // 商品详情
    cashierGetAttr(id) {
      cashierGetAttr(id, this.userInfo.uid)
        .then((res) => {
          let data = res.data;
          this.storeInfo = data.storeInfo;
          this.productValue = data.productValue;
          this.$set(this.attr, "productAttr", data.productAttr);
          this.DefaultSelect();
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    /**
     * 默认选中属性
     *
     */
    DefaultSelect: function() {
      let productAttr = this.attr.productAttr;
      let value = [];
      for (var key in this.productValue) {
        if (this.productValue[key].stock > 0) {
          value = this.attr.productAttr.length ? key.split(",") : [];
          break;
        }
      }
      //isCart 1为触发购物车 0为商品
      if (this.isCart) {
        //购物车默认打开时，随着选中的属性改变
        let attrValue = [];
        // this.cartList.forEach((res) => {
        //   if (res.id == this.cartInfo.cart_id) {
        //     attrValue = res.productInfo.attrInfo.suk.split(",");
        //   }
        // });
        this.cartList.forEach((item) => {
          item.cart.forEach((res) => {
            if (res.id == this.cartInfo.cart_id) {
              attrValue = res.productInfo.attrInfo.suk.split(",");
            }
          });
        });
        for (let i = 0; i < productAttr.length; i++) {
          this.$set(productAttr[i], "index", attrValue[i]);
        }
      } else {
        for (let i = 0; i < productAttr.length; i++) {
          this.$set(productAttr[i], "index", value[i]);
        }
      }
      //sort();排序函数:数字-英文-汉字；
      let productSelect = this.productValue[value.join(",")];
      if (productSelect && productAttr.length) {
        this.$set(
          this.attr.productSelect,
          "store_name",
          this.storeInfo.store_name
        );
        this.$set(this.attr.productSelect, "image", productSelect.image);
        this.$set(this.attr.productSelect, "price", productSelect.price);
        this.$set(this.attr.productSelect, "stock", productSelect.stock);
        this.$set(this.attr.productSelect, "unique", productSelect.unique);
        this.$set(this.attr.productSelect, "cart_num", 1);
        this.$set(this, "attrValue", value.join(","));
      } else if (!productSelect && productAttr.length) {
        this.$set(
          this.attr.productSelect,
          "store_name",
          this.storeInfo.store_name
        );
        this.$set(this.attr.productSelect, "image", this.storeInfo.image);
        this.$set(this.attr.productSelect, "price", this.storeInfo.price);
        this.$set(this.attr.productSelect, "stock", 0);
        this.$set(this.attr.productSelect, "unique", "");
        this.$set(this.attr.productSelect, "cart_num", 0);
        this.$set(this, "attrValue", "");
      } else if (!productSelect && !productAttr.length) {
        this.$set(
          this.attr.productSelect,
          "store_name",
          this.storeInfo.store_name
        );
        this.$set(this.attr.productSelect, "image", this.storeInfo.image);
        this.$set(this.attr.productSelect, "price", this.storeInfo.price);
        this.$set(this.attr.productSelect, "stock", this.storeInfo.stock);
        this.$set(
          this.attr.productSelect,
          "unique",
          this.storeInfo.unique || ""
        );
        this.$set(this.attr.productSelect, "cart_num", 1);
        this.$set(this, "attrValue", "");
      }
    },
    /**
     * 属性变动赋值
     *
     */
    ChangeAttr(res) {
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
    setUp(touristId, init) {
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
      if (init) return;
      this.getCartList();
      this.goodList();
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
      // this.$refs.users.currentid = 0;
      // this.$refs.users.modals = true
      // this.$refs.users.cancel();
    },
    // 当前选中门店店员信息
    getStoreId(e) {
      this.clear();
      this.storeList.forEach((i) => {
        if (i.id == e.id) {
          sessionStorage.setItem("staffInfo", JSON.stringify(e));
          this.goodFrom.staff_id = e.id;
          this.storeInfos = i;
          this.getCartList();
          this.goodList();
          this.hangDataList();
          // this.hangList();
        }
      });
    },
    // 门店店员信息以及门店店员列表
    getUserInfo(e) {
      this.storeInfos = e.users;
      this.storeList = e.storeList;
      this.goodFrom.staff_id = e.users.id;
      sessionStorage.setItem("staffInfo", JSON.stringify(e.users));
      if (this.userInfo) {
        this.getCartList();
      } else {
        this.setUp();
      }
      this.goodList();
      this.hangDataList();
      // this.hangList();
    },
    // 收银台切换购物车用户
    cashierSwitch(data) {
      postCashierSwitch(data, this.storeInfos.id)
        .then((res) => {})
        .catch((err) => {
          this.$Message.error(err.msg);
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
    checkUser() {
      this.userInfoShow = false;
      this.goodFrom.store_name = "";
      this.getUserId(this.modalUserInfo);
    },
    // 获取收银台用户信息
    userInfoData(data, init) {
      cashierUser(data)
        .then((res) => {
          this.userInfo = res.data;
          let storage = window.localStorage;
          storage.setItem("cashierUser", JSON.stringify(res.data));
          if (init) return;
          this.hangDataList();
          this.getCartList();
          this.goodList();
          this.defaultSel(1);
        })
        .catch((err) => {
          this.$Message.error(err.msg);
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
    // 用户详情操作
    operation(type) {
      this.$refs.userDetails.modals = false;
      if (type === 1) {
        this.rechargeBnt();
      } else {
        this.setUser();
      }
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
                content:  $t("page.user.changeMemberConfirm"),
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
          this.goodList();
          this.getCartList();
        })
        .catch((err) => {
          this.codeNum = "";
          this.$Message.error(err.msg);
        });
    },
    //点击分类
    cateTap(item, index) {
      this.currentCate = index;
      this.goodFrom.cate_id = item.id;
      this.goodFrom.promotions_id = 0;
      this.activityFrom.type = 0;
      this.goodFrom.page = 1;
      this.goodFrom.store_name = "";
      if (index !== 1) {
        this.seckillId = 0;
        this.goodList();
      }
    },
    //分类列表
    cateList() {
      cashierCate()
        .then((res) => {
          let all = [
            {
              cate_name: $t("page.home.allGoods"),
              id: "",
            },
            {
              cate_name: $t("page.home.activityGoods"),
              id: "99999",
            },
          ];
          let data = [...all, ...res.data];
          this.cateData = data;
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    //商品列表
    goodList(type) {
      if (this.activityFrom.type) {
        this.activityFrom.uid = this.userInfo ? this.userInfo.uid : 0;
        this.activityFrom.type = type;
        this.activityFrom.staff_id = this.storeInfos.id;
        if (!this.userInfo.uid)
          this.activityFrom.tourist_uid = this.userInfo.touristId;
        activityList(this.activityFrom).then((res) => {
          let data = res.data;
          this.total = data.count;
          this.goodData = data.list;
        });
      } else {
        this.goodFrom.uid = this.userInfo ? this.userInfo.uid : 0;
        if (!this.userInfo.uid)
          this.goodFrom.tourist_uid = this.userInfo.touristId;
        cashierProduct(this.goodFrom)
          .then((res) => {
            let data = res.data;
            this.total = data.count;
            this.goodData = data.list;
            if (data.attrValue) {
              // 加入购物车
              this.attr.productSelect.unique = data.attrValue.unique;
              this.productId = data.attrValue.product_id;
              this.joinCart(1);
            }
            if (data.userInfo) {
              this.modalUserInfo = data.userInfo;
              this.userInfoShow = true;
            }
          })
          .catch((err) => {
            this.$Message.error(err.msg);
          });
      }
    },
    // 活动商品列表
    selectaActivity(type) {
      this.goodData = [];
      this.activityFrom.type = type;
      this.goodList(type);
    },
    cartComputeActivity(id) {
      let data = {
        integral: this.integral,
        coupon: this.coupon,
        coupon_id: this.couponId,
        cart_id: [id],
        new: 1,
      };
      cashierCompute(this.userInfo.uid, data)
        .then((res) => {
          this.priceInfo = res.data;
          this.unchangedPrice = this.priceInfo.payPrice || 0;
          this.formItem.price = this.priceInfo.payPrice || 0;
          this.tapPrice();
        })
        .catch((err) => {
          this.$Message.error(err.msg);
          this.coupon = false;
        });
    },
    // 去凑单
    collectOrder(item) {
      this.currentCate = 1;
      this.activityFrom.promotions_id = item.id;
      this.activityFrom.page = 1;
      this.activityFrom.type = item.promotions_type;
      this.goodList(item.promotions_type);
    },
    //搜索
    orderSearch() {
      this.goodFrom.page = 1;
      this.goodData = [];
      if (this.activityFrom.type) {
        this.activityFrom.page = 1;
        this.activityFrom.store_name = this.goodFrom.store_name;
        this.goodList(this.activityFrom.type);
      } else {
        this.goodFrom.page = 1;
        this.goodList();
      }
    },
    pageChange(e) {
      if (this.activityFrom.type) {
        this.activityFrom.page = e;
        this.goodList(this.activityFrom.type);
      } else {
        this.goodFrom.page = e;
        this.goodList();
      }
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

<style lang="stylus" scoped>
@media screen and (min-width: 2260px) {
  .goodsCon {
    .item {
      width: 19% !important;
    }
    .list:after{
      content:'';
      width: 20%;
    }
  }
}

@media screen and (max-width: 1580px) {
  .goodsCon {
    .item {
      width: 32% !important;
    }
   .list:after{
      content:'';
      width: 33%;
    }
  }

}

@media screen and (max-width: 1270px) {
  .goodsCon {
    .item {
      width: 49% !important;
    }
  }
}

::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px #ccc;
}

::-webkit-scrollbar {
  width: 2px !important;
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
  max-height: 100%;
  display: flex;

  .tip {
    text-align: center;
    color: #ccc;
    font-size: 14px;
  }

  .picture {
    width: 180px;
    height: 140px;
    margin: 20px 160px;

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
  height: calc(100vh - 155px);
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

.discountCon {
  .item {
    font-size: 15px;
    margin-bottom: 10px;
  }
}

.content {
  height: calc(100vh - 66px);
  display: flex;
  flex-direction: column;
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

    .picture {
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
    margin: -1px auto 43px;

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

    .picture {
      width: 362px;
      height: 68px;
      margin: 24px auto 0 auto;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .picture {
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
  width: calc(100% - 500px);
  height: 100%;

  /deep/ .ivu-card-body {
    height: 100%;
    padding: 10px 0 0px 0 !important;
  }

  .smCode {
    padding: 0 16px;

    /deep/ .ivu-input-large {
      height: 350px !important;
      text-align: center;
      font-size: 20px !important;
    }
  }

  .goodsCon {
    flex: auto;
    padding:0 30px;
    width: calc(100% - 140px);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    /deep/ .ivu-input-group {
      .ivu-input {
        text-align: center;
      }
    }

    .input {
      padding: 20px 10px 10px 0;
      /deep/ .ivu-input-group-prepend,.ivu-input-group-append{
        border-radius: 6px;

      }
    }

    .goods-top {
      display: flex;
      flex-direction: column;
      height: calc(100% - 66px);
    }

    .page {
      margin-top: 0;
      padding: 10px 16px 10px 0;
    }

    .noGood {
      flex: 1;

      .picture {
        width: 180px;
        height: 140px;
      }

      img {
        width: 100%;
        height: 100%;
      }

      .tip {
        margin-top: 30px;
        font-size: 15px;
        text-align: center;
        color: #ccc;
      }
    }

    .list {
      overflow-x: hidden;
      overflow-y: auto;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .item {
        position: relative;
        display: flex;
        width: 24%;
        background: #F5F5F5;
        border-radius: 10px;
        margin: 1% 1% 0% 0%;
        padding: 18px 12px;
        cursor: pointer;
        flex-direction: column;
        justify-content: space-between;
        transition: all 0.2s;

        &.on:hover {
          background-color: #1890FF;
          color: #fff !important;
          box-shadow: 0px 0px 14px 0px rgba(0, 84, 161, 0.18);

          .name {
            color: #fff !important;
            margin-bottom:10px;
          }

          .stock {
            color: #fff !important;

            span {
              border-color: #fff !important;
            }
          }

          .money {
            color: #fff !important;
          }
        }

        .icon-cart-num {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: #FF7700;
          border-radius: 30px;
          padding: 0 8px;
          // min-width 28px
          // max-width 28px
          height: 22px;
          color: #fff;
          text-align: center;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .no-stock {
          top: 0;
          left: 0;
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;

          .trip {
            background: #4E4E4E;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            color: #FFFFFF;
            font-size: 14px;
          }
        }

        .picture {
          width: 70px;
          height: 70px;

          img {
            width: 100%;
            height: 100%;
            border-radius: 4px;
          }
        }

        .name {
          font-size: 16px;
          line-height:16px;
          color: rgba(0, 0, 0, 0.85);
            margin-bottom:10px;

        }

        .text {
          display: flex;
          justify-content: space-between;
          max-height: 80px;

          .text-left {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .iconfont {
            position: absolute;
            color: #1890FF;
            font-size: 20px;
            right: 5px;
            bottom: 5px;
          }

          .stock {
            font-size: 13px;
            color: #606266;
            margin: 2px 0;

            span {
              border-radius: 3px;
              border: 1px solid #606266;
              padding: 3px 6px;
              margin-right: 8px;
              font-size: 12px;
            }
          }

          .money {
            font-weight: 500;
            color: #333333;
            font-size: 18px;
            line-height: 18px;
            .rmb{
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  .goodClass {
    width: 140px;
    border-left: 1px solid #F0F2F5;
    overflow-y: auto;
    height: calc(100vh - 146px);
    padding-top: 15px;
    .item {
      cursor: pointer;
      width: 110px;
      height: 38px;
      text-align: center;
      line-height: 38px;
      margin-bottom: 6px;
      font-size: 15px;
      color: #000;
      border-radius: 6px;
      transition: all 0.1s;

      &.on {
        background-color: #1890FF;
        color: #fff;
      }
    }

    .item:hover {
      background-color: #1890FF;
      color: #fff;
    }
  }
}

.conter {
  height: 100%;
  width: 500px;

  /deep/ .ivu-card-body {
    height: 100%;
    padding: 0 !important;
  }

  .cart {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: 500px;

    .title {
      padding: 18px;
      border: 2px solid #FF7700;
    }

    .left-top {
      width: 100%;
      height: 100%;
      display: flex;
      // justify-content space-between
      flex-direction: column;

      .cart {
        // height: calc(100% - 82px);
      }
    }

    .cart-left {
      display: flex;
      flex-direction: column;
      width: 100%;
      box-shadow: 5px 0px 14px 0px rgba(0, 0, 0, 0.04);
      height: 100%;

      .count {
        padding: 0px 24px 13px 24px;
        border-bottom: 1px solid #EEEEEE;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .num {
          color: #FF7700;
          padding: 0 5px;
        }

        .cart-sel {
          font-size: 14px;
        }

        .count-r {
          display: flex;
          align-items: center;

          .coupon {
            border-radius: 4px;
            border: 1px solid #FF7700;
            color: #FF7700;
            padding: 3px 10px;
            cursor: pointer;
            font-size: 14px;
          }

          .clear {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 12px;

            img {
              width: 16px;
              height: 16px;
              margin: 0 6px 0 14px;
            }
          }
        }
      }
    }

    .tourist::-webkit-scrollbar {
      height: 4px !important;
    }

    .tourist {
      width: 100%;
      padding-left: 13px;
      padding-top: 15px;
      display: flex;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      /* 解决ios手机页面滑动卡顿问题 */
      -webkit-overflow-scrolling: touch;

      .item-w1 {
        min-width: 100px;
      }

      .item-w2 {
        min-width: 140px;
      }

      .item {
        height: 38px;
        background: #F7F7F7;
        border-radius: 50px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.85);
        position: relative;
        padding-left: 7px;
        margin-bottom: 9px;
        margin-right: 12px;
        cursor: pointer;

        .picture {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          margin-right: 6px;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .name {
          width: 50px;
        }

        .guadan {
          font-size: 10px;
          border: 1px solid #FF7700;
          color: #FF7700;
          padding: 0 3px;
          border-radius: 2px;
          margin-right: 12px;
        }

        &:hover {
          background: #FF7700;
          color: #fff;

          .guadan {
            border: 1px solid #fff;
            color: #fff;
          }
        }

        &.on {
          background: #FF7700;
          color: #fff;

          .guadan {
            border: 1px solid #fff;
            color: #fff;
          }
        }
      }
    }

    .right {
      width: 90px;

      .navTabs {
        position: absolute;
        top: 15px;
        cursor: pointer;

        img {
          display: block;
          width: 40px;
          height: 85px;
        }

        .label01 {
          z-index: 5;
          position: relative;
        }

        .label02 {
          margin-top: -16px;
        }
      }

      .item {
        width: 72px;
        background: #F2F3F5;
        margin: 0 auto 13px auto;
        text-align: center;
        padding: 9px 0;
        cursor: pointer;
        position: relative;

        .iconfont {
          position: absolute;
          font-size: 20px;
          top: -9px;
          right: -7px;
          color: #bbb;
        }

        &:hover {
          background-color: #1890FF;
          color: #fff;
        }

        &.on {
          background-color: #1890FF;
          color: #fff;
        }
      }
    }

    .title {
      // border-bottom: 1px solid #D8D8D8;
      // width: 376px;
      height: 76px;
      background: rgba(255, 119, 0, 0.05);
      border-radius: 10px;
      margin: 24px 24px;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      overflow: hidden;

      .picture {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        margin-right: 8px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .switchs {
        color: #FF7700;
        cursor: pointer;

        // position: absolute;
        // right: 19px;
        // top: 10px;

        a {
          font-size: 12px;
          color: #FF7700;
        }
      }

      .text {
        font-size: 12px;
        font-weight: 400;
        color: rgba(51, 51, 51, 0.85);
        flex: 1;
        padding-right: 5px;

        .textCon {
          margin-bottom: 6px;
          display: flex;
          justify-content: space-between;
          width: 100%;
          align-items: center;

          .name {
            font-size: 18px;
          }
          .phone{
            color: #999;
          }
        }

        .user-msg {
        }

        .balance {
          margin-right: 10px;
          .num {
            font-weight: 500;
            color: #303133;
            font-size 17px;
            line-height: 17px;
            margin-left: 4px;
          }
        }

        .recharge {
          color: #1890FF;
          padding: 2px 4px;
          cursor: pointer;
          border-radius: 3px;
        }

        .recharge:hover {
          background-color: #1890FF;
          color: #fff;
        }

        .name {
          color: rgba(0, 0, 0, 0.85);
          font-size: 14px;
          font-weight: 600;
          margin-right: 6px;
        }
      }
    }

    .listCon {
      overflow-x: hidden;
      // height: calc(100% - 168px);
      flex: 1;
      padding-bottom: 70px;

      .promotions {
        border-bottom: 1px solid #f2f2f2;
        margin: 0 24px;

        .promotions-msg {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          color: #333333;
          font-size: 14px;
          border-bottom: 1px solid #f2f2f2;

          .card {
            color: #FF7700;
            padding: 1px 6px;
            margin-right: 8px;
            border-radius: 3px;
            background-color:#Fcf0e2;
            font-size: 12px;
            white-space: nowrap;
          }

          .flex-1 {
            flex: 1;
            display: flex;
            align-items: center;
          }

          .collect {
            cursor: pointer;
            width: 70px;
            display: flex;
            align-items: center;
            flex-basis: max-content;

            .iconjinru {
              font-size: 12px;
            }
          }
        }

        .is_give {
          height: 60px;

          .picture {
            width: 40px;
            height: 40px;

            img {
              width: 100%;
              height: 100%;
              border-radius: 5px;
            }
          }

          .give-name {
            font-size: 12px;
            color: #333;
            max-width: 200px;
          }

          .give-info {
            font-size: 12px;
            color: #ccc;
          }
        }
      }
    }

    .list::-webkit-scrollbar {
      width: 0 !important;
    }

    .list {
      -ms-overflow-style: none;
    }

    .list {
      overflow: -moz-scrollbars-none;
    }

    .list {
      overflow: hidden;
      overflow-y: scroll;

      .item {
        padding: 10px 0px;
        position: relative;
        display: flex;
        flex-wrap: nowrap;
        height: 100%;
        border-radius: 10px;

        &:hover {
          background: rgba(24, 144, 255, 0.05);
        }

        /deep/ .ivu-input-number-input {
          text-align: center;
        }

        /deep/ .ivu-input-number-controls-outside {
          width: 112px !important;
        }

        .picture {
          width: 74px;
          height: 74px;

          img {
            width: 100%;
            height: 100%;
            border-radius: 5px;
          }
        }

        .del {
          position: absolute;
          font-size: 15px;
          color: #1890FF;
          right: 10px;
          top: 15px;
          cursor: pointer;
          padding: 2px 7px;
        }

        .cartBnt {
          position: absolute;
          right: 10px;
          height: 24px;
          bottom: 18px;

          .iconfont {
            width: 24px;
            height: 24px;
            background-color: #F2F3F5;
            text-align: center;
            line-height: 24px;
            color: rgba(0, 0, 0, 0.85);
            border-radius: 50%;
          }

          .iconjia {
            color: #fff;
            background-color: #1890FF;
            font-size: 12px;
          }

          .ivu-input-number {
            outline: unset;
            width: 60px;
            margin: 0 2px;
            text-align: center;
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.85);
            border: none;
            background-color:rgba(255,255,255,0);
            /deep/ .ivu-input-number-handler-wrap {
              display: none;
            }
          }
        }

        .text {
          flex: 1;
          color: #000;
          font-size: 18px;
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          overflow: hidden;

          .end {
            color: #999;
            font-size: 13px;
          }

          .name {
            font-size: 15px;
            margin-top: 5px;
            width: 82%;
          }

          .info {
            color: #999;
            font-size: 12px;
            cursor: pointer;
            padding: 4px 0 7px 0;
            display:flex;
            align-items:center;
            .iconfont {
              font-size: 12px;
              margin-left: 5px;
            }
            .suk{
              max-width:50%;
            }
          }
          .sum_price{
            font-size:16px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
          }
          &.invalid {
            .info {
              cursor: unset;
              display:flex;
              align-items:center;
            }
            .suk{
              max-width:50%;
            }
            .name {
              color: #999;
            }
          }
        }
      }
    }

    .left {
      width: 100%;
      height: 70px;
      position: absolute;
      display: flex;
      align-items: center;
      bottom: 0;
      background-color: #fff;
      padding: 0 15px;
      // box-shadow: 0px -1px 11px 0px rgba(0, 0, 0, 0.06);
      box-shadow: 0px -10px 10px rgba(0, 0, 0, 0.06);
    }

    .conInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      color: #000;

      .storeBnt {
        padding: 0 10px;
        height: 40px;
        border-radius: 6px;
        //border: 1px solid #CCCCCC;
        color: #333333;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        .text {
          max-width: 100px;
        }
      }

      .right {
        display: flex;
        width: max-content;
        align-items: baseline;
        font-size: 12px;
        flex-wrap: nowrap;
        white-space: nowrap;

        div {
          white-space: nowrap;
        }

        .rmb {
          font-size: 16px;
          color: rgba(245, 34, 45, 1);
        }

        .discount {
          font-size: 14px;
          padding: 0 9px
        }

        .detailed {
          color: #1890FF;
          padding: 0 9px 0 3px;
          cursor: pointer;
        }

        .num {
          color: rgba(245, 34, 45, 1);
          font-size: 24px;
          line-height: 22px;
          font-weight: 500;
          white-space: nowrap;
        }
      }

      .num {
        font-size: 24px;
      }
    }
  }

  .title {
    color: rgba(0, 0, 0, 0.85);

    .text {
      font-size: 16px;
      font-weight: 500;
    }

    .picture {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .info {
      font-size: 14px;
      margin-left: 8px;
      cursor: pointer;

      .iconfont {
        font-size: 12px;
        margin-left: 5px;
      }

      &:hover {
        color: #2d8cf0;
      }
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
    .picture {
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
  background-color: #fff;

  .footer {
    width: 500px;
    padding: 13px 17px 13px 17px;

    .pay {
      .bnt {
        border-radius: 6px;
        width: 30%;
        height: 0.32rem;
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
          border: 1px solid #ccc !important;
          color: #ccc;
          cursor: unset;

          &.on {
            border: 1px solid #1890FF;
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
        color: #fff;
        cursor: unset;
        border-radius: 4px;
        margin-right: 14px;
        cursor: pointer;
        color: #000000;
        font-size: 17px;

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

/deep/ .ivu-page {
  font-size: 15px;
}

.payModal {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 67px 52px;

  .type {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #1890FF;
    padding: 33px 37px;
    border-radius: 6px;
    margin: 0 15px;
    cursor: pointer;

    .img {
      width: 66px;
      height: 55px;
      margin-bottom: 33px;

      img {
        width: 100%;
      }
    }

    .text {
      white-space: nowrap;
    }
  }

  .type:hover {
    background-color: #f2f2f2;
  }
}

.goast {
  background: rgba(24, 144, 255, 0.1) !important;
  color: #1890FF !important;
}

.v-center {
  margin-top: 100px;
}

.search_user_info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .picture {
    width: 110px;
    height: 110px;
    margin: 20px 0 20px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .user_name {
    font-size: 18px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 14px;
  }

  .user_id {
    font-size: 12px;
    font-weight: 400;
    color: #999999;
  }

  .user_phone {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    margin: 14px 0 40px;
  }

  .sure_btn {
    width: 176px;
    height: 46px;
    line-height: 46px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    background: #1890FF;
    border-radius: 6px;
    margin-bottom: 30px;
  }
}
</style>
