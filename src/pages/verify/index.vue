<template>
    <div class="order">
        <div class="left">
            <div class="left-top">
                <div class="title">核销订单</div>
                <div class="sx" @click="filterModal = !filterModal">
                    {{ filterModal ? "关闭" : "筛选" }}
                    <Icon
                            v-if="!filterModal"
                            class="ios-funnel-outline"
                            color="#666"
                            type="ios-funnel-outline"
                    />
                </div>
            </div>
            <div class="order-box">
                <div v-show="!filterModal" class="search">
                    <Input
                            v-model="orderData.keyword"
                            enter-button="搜索"
                            placeholder="搜索订单编号"
                            search
                            size="large"
                            @on-search="search"
                    />
                </div>
                <orderList
                        v-if="orderListData.length"
                        v-show="!filterModal"
                        :orderData="orderListData"
                        :total="count"
                        class="order-list"
                        orderType="verify"
                        @addPage="addPage"
                        @selectOrder="selectOrder"
                ></orderList>
                <div v-else-if="!orderListData.length && !filterModal" class="no-order">
                    <img alt="" src="../../assets/images/no-order.png"/>
                    <span class="trip">噢～目前暂无订单</span>
                </div>
                <filter-modal
                        v-show="filterModal"
                        order-type="verify"
                        @search="searchList"
                ></filter-modal>
            </div>
        </div>
        <div class="order-data">
            <div class="header">
                <div
                        v-for="(tab, index) in tabs"
                        :key="index"
                        :class="
            sle === index
              ? 'sel'
              : index === sle - 1
              ? 'neighbor-left'
              : index === sle + 1
              ? 'neighbor-right'
              : 'def'
          "
                        class="item"
                        @click="tabClick(index)"
                >
                    {{ tab }}
                </div>
                <div :class="sle === 2 ? 'neighbor-right' : ''" class="box"></div>
            </div>
            <div class="content">
                <userOrder
                        v-if="sle === 0 && selectOrderData.order_id"
                        :orderNumId="selectOrderData.order_id"
                        :selectData="selectOrderData"
                        class="orders"
                        @remarks="remarks"
                        @selectData="selectData"
                ></userOrder>
                <div v-else-if="!selectOrderData.order_id" class="no-order">
                    <img alt="" src="../../assets/images/no-record.png"/>
                    <span class="trip">噢～目前暂无订单</span>
                </div>
                <orderDetails
                        v-if="sle === 1 && selectOrderData.order_id"
                        :id="selectOrderData.id"
                        class="orders"
                ></orderDetails>
                <orderRecord
                        v-if="sle === 2 && selectOrderData.order_id"
                        :id="selectOrderData.id"
                ></orderRecord>
            </div>
            <div v-if="selectOrderData.order_id" class="footer">
                <div class="footer-left">
          <span class="clerk" v-if="selectOrderData.clerk_name"
          >收银员：{{ selectOrderData.clerk_name }}</span
          >
                    <span class="pay">实付：</span>
                    <span class="num">¥{{ selectOrderData.pay_price || 0 }}</span>
                </div>
                <div class="footer-right">
                    <div class="btn" @click="remarks">订单备注</div>
                    <div class="btn" @click="point">小票打印</div>
                    <!--        <div class="btn pay" @click="getVerifyData">立即核销</div>-->
                    <div
                            v-if="
              (!selectOrderData.status || selectOrderData.status === 5) &&
                selectOrderData.refund_type !== 6 &&
                selectOrderData.paid === 1
            "
                            class="btn pay"
                            @click="getVerifyData"
                    >
                        {{$t("page.common.flashVerify")}}
                    </div>
                </div>
            </div>
        </div>
        <!-- 备注 -->
        <order-remark
                ref="remarks"
                :orderId="selectOrderData.id"
                @submitFail="submitFail"
        ></order-remark>
        <orderWriteOff
                ref="writeOff"
                :orderNumId="selectOrderData.order_id"
        ></orderWriteOff>
    </div>
</template>

<script>
    import orderList from "@/components/orderList";
    import goodsList from "@/pages/hang/components/goodsList";
    import userOrder from "./components/userOrder";
    import orderDetails from "./components/orderDetails";
    import orderRecord from "@/components/orderRecord";
    import orderRemark from "@/components/orderRemark";
    import orderWriteOff from "./components/orderWriteOff";
    import filterModal from "@/components/filterModal";

    import {getVerifyList, putWriteUpdate} from "@/api/order";

    export default {
        components: {
            orderList,
            goodsList,
            userOrder,
            orderDetails,
            orderRemark,
            orderRecord,
            orderWriteOff,
            filterModal,
        },
        data() {
            return {
                orderId: 0,
                orderListData: [],
                tabs: [$t('page.common.goodsInfo'), $t('page.common.orderDetail'), $t('page.common.orderRecord')],
                sle: 0,
                filterModal: false,
                userFrom: {
                    keyword: "",
                    page: 1,
                    limit: 9,
                },
                dataList: [],
                orderData: {
                    type: "",
                    status: "",
                    time: "",
                    staff_id: "",
                    real_name: "",
                    page: 1,
                    limit: 10,
                },
                selectOrderData: {},
                orderInfoData: {},
                count: 0,
                orderStatusList: [],
                selectOrderDatas: [],
            };
        },
        created() {
            this.getVerifyList();
        },
        methods: {
            addPage() {
                if (this.orderListData.length < this.count) this.orderData.page++;
                this.getVerifyList();
            },
            search() {
                this.orderListData = [];
                this.selectOrderData = {};
                this.orderData.page = 1;
                this.sle = 0;
                this.getVerifyList();
            },
            //搜索
            searchList(data) {
                this.filterModal = false;
                this.orderData.page = 1;
                this.orderData = {...this.orderData, ...data};
                this.orderListData = [];
                this.search();
            },
            // 设置备注
            remarks() {
                this.$refs.remarks.modals = true;
                this.$refs.remarks.formValidate.remark = this.selectOrderData.remark;
            },
            // 备注修改成功
            submitFail() {
            },
            point() {
                this.delfromData = {
                    title:$t('page.dialogs.flashPrintInvoice'),
                    info: $t('page.dialogs.areYouSurePrintOrder'),
                    url: `/order/print/${this.selectOrderData.id}`,
                    method: "get",
                    ids: "",
                };
                this.$modalSure(this.delfromData)
                    .then((res) => {
                        this.$Message.success(res.msg);
                    })
                    .catch((res) => {
                        this.$Message.error(res.msg);
                    });
            },
            selectData(data) {
                this.selectOrderDatas = data;
            },
            // 立即核销
            getVerifyData() {
                if (!this.selectOrderDatas.length) {
                    return this.$Message.error($t('page.messages.plsChoiceVerifyGoods'));
                }
                let cartIds = [];
                this.selectOrderDatas.forEach((v) => {
                    cartIds.push({
                        cart_id: v.cart_id,
                        cart_num: v.surplus_num,
                    });
                });
                putWriteUpdate(this.selectOrderData.id, {cart_ids: cartIds})
                    .then((res) => {
                        this.$Message.success(res.msg);
                        // this.search();
                        this.getVerifyList();
                        this.selectOrderData.status = 2;
                    })
                    .catch((err) => {
                        this.$Message.error(err.msg);
                    });
            },
            selectOrder(data) {
                this.selectOrderData = data;
            },
            tabClick(index) {
                this.sle = index;
                switch (index) {
                    case 1:
                        break;
                }
            },

            // 核销列表
            getVerifyList() {
                getVerifyList(this.orderData)
                    .then((res) => {
                        res.data.data = res.data.data.map((item) => {
                            let infoArr = [];
                            for (let key in item._info) {
                                let obj = item._info[key];
                                infoArr.push(obj);
                            }
                            this.$set(item, "_infoData", infoArr);
                            return item;
                        });

                        this.selectOrderData =
                            res.data.data.length && this.orderData.page == 1
                                ? res.data.data[0]
                                : this.selectOrderData;
                        this.orderListData = this.orderListData.concat(res.data.data);
                        this.count = res.data.count;
                    })
                    .catch((err) => {
                        this.$Message.error(err.msg);
                    });
            },
        },
    };
</script>
<style lang="stylus" scoped>
    ::-webkit-scrollbar-thumb {
        -webkit-box-shadow: inset 0 0 6px #ccc;
    }

    ::-webkit-scrollbar {
        width: 0px !important;
        /* 对垂直流动条有效 */
    }

    .order {
        display: flex;

        .left {
            width: 500px;
            max-width: 500px;
            height: calc(100vh - 66px);
            box-shadow: 5px 0px 14px 0px rgba(0, 0, 0, 0.04);
            z-index: 2;
            display: flex;
            flex-direction: column;

            .content {
                height: 100%;
            }

            .left-top {
                display: flex;
                justify-content: space-between;
                padding: 20px 20px 0 20px;

                .title {
                    color: rgba(0, 0, 0, 0.85);
                    font-weight: 600;
                    font-size: 20px;
                }

                .sx {
                    color: #666666;
                    cursor: pointer;
                    font-size: 14px;

                    .ios-funnel-outline {
                        font-weight: bold;
                        font-size: 12px;
                    }
                }
            }

            .order-box {
                position: relative;
                flex: 1;
                display: flex;
                overflow: hidden;
                flex-direction: column;
                font-size: 18px;

                .search {
                    padding: 20px 20px;
                }

                .order-list {
                    padding: 0 20px;
                }
            }
        }

        .order-data {
            flex: 1;
            z-index: 1;
            display: flex;
            flex-direction: column;
            max-height: calc(100vh - 66px);

            .content {
                flex: 1;
                overflow-y: scroll;
            }

            .header {
                display: flex;
                width: 100%;
                font-size: 18px;

                .box {
                    flex: 1;
                    background-color: #F4F4F4;
                }

                .item {
                    padding: 16px 28px;
                    cursor: pointer;
                    background-color: #F4F4F4;
                    transition: all 0.1s;
                }

                .sel {
                    background-color: #fff;
                    color: rgba(0, 0, 0, 0.85);
                    font-weight: 600;
                }

                .neighbor-left {
                    border-bottom-right-radius: 10px;
                }

                .neighbor-right {
                    border-bottom-left-radius: 10px;
                }

                .def {
                }
            }

            .orders {
                flex: 1;
                display: flex;
                flex-direction: column;
                max-height: calc(100% - 53px);
            }
        }
    }

    .footer {
        display: flex;
        padding: 20px 30px;
        justify-content: space-between;
        align-items: center;
        box-shadow: 5px 0px 14px 0px rgba(0, 0, 0, 0.06);

        .footer-left {
            font-size: 15px;

            .clerk {
                color: #000;
                padding-right: 40px;
                font-weight: bold;
            }

            .pay {
                color: #333333;
            }

            .num {
                font-size: 20px;
                color: #F5222D;
                font-weight: bold;
            }
        }

        .footer-right {
            color: rgba(0, 0, 0, 0.85);
            font-size: 17px;
            display: flex;

            .btn {
                height: 46px;
                padding: 0 18px;
                margin-left: 14px;
                border-radius: 4px;
                background-color: #F2F3F5;
                cursor: pointer;
                display flex
                align-items: center;
            }

            .pay {
                color: #FFFFFF;
                background: #FF7700;
            }
        }
    }
</style>
