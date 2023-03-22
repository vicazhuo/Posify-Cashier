<template>
    <div style="width: 100%">
        <Modal v-model="modals" scrollable footer-hide closable title="用户详情" :mask-closable="false"
               width="900">
            <Spin size="large" fix v-if="spinShow"></Spin>
            <div class="acea-row">
                <div class="avatar mr15"><img :src="psInfo.avatar"></div>
                <div class="dashboard-workplace-header-tip">
                    <p class="dashboard-workplace-header-tip-title" v-text="psInfo.nickname || '-'"></p>
                    <div class="dashboard-workplace-header-tip-desc">
                        <span class="dashboard-workplace-header-tip-desc-sp" v-for="(item, index) in detailsData" :key="index">{{item.title+'：'+item.value}}</span>
                    </div>
                </div>
            </div>
            <Row type="flex" justify="space-between" class="mt25">
                <Col span="4" class="user_menu">
                    <Menu :theme="theme2" :active-name="activeName" @on-select="changeType">
                        <MenuItem :name="item.val" v-for="(item, index) in list" :key="index" >
                            {{item.label}}
                        </MenuItem>
                    </Menu>
                </Col>
                <Col span="20">
                    <Table :columns="columns" :data="userLists" max-height="400"
                           ref="table"
                           :loading="loading"
                           :no-userFrom-text="$t('page.common.nonData')"
                           :no-filtered-userFrom-text="$t('page.common.nonDataResult')"
                    ></Table>
                    <div class="acea-row row-right page">
                        <Page :total="total" :current="userFrom.page" show-elevator show-total @on-change="pageChange"
                              :page-size="userFrom.limit"  /></div>
                </Col>
            </Row>
        </Modal>
    </div>
</template>

<script>
    import { detailsApi, infoApi } from '@/api/user';

    export default {
        name: 'userDetails',
        data () {
            return {
                theme2: 'light',
                list: [
                    { val: 'order', label: $t('page.common.consume_record') },
                    { val: 'integral', label:  $t('page.common.redit_detail') },
                    { val: 'sign', label:  $t('page.common.sign_record') },
                    { val: 'coupon', label:  $t('page.common.keep_on_coupon') },
                    { val: 'balance_change', label:  $t('page.common.balance_amend')},
                    { val: 'spread', label:  $t('page.common.frient_relate') }
                ],
                modals: false,
                spinShow: false,
                detailsData: [],
                userId: 0,
                loading: false,
                userFrom: {
                    type: 'order',
                    page: 1, // 当前页
                    limit: 20 // 每页显示条数
                },
                total: 0,
                columns: [],
                userLists: [],
                psInfo: {},
                activeName:'order'
            }
        },
        created () {
        },
        methods: {
            // 会员详情
            getDetails (id) {
                this.activeName = 'order';
                this.userId = id;
                this.spinShow = true;
                detailsApi(id).then(async res => {
                    if (res.status === 200) {
                        let data = res.data
                        this.detailsData = data.headerList;
                        this.psInfo = data.ps_info;
                        this.changeType(this.activeName,1);
                        this.spinShow = false;
                    } else {
                        this.spinShow = false;
                        this.$Message.error(res.msg);
                    }
                }).catch(res => {
                    this.spinShow = false;
                    this.$Message.error(res.msg);
                })
            },
            pageChange (index) {
                this.userFrom.page = index
                this.changeType(this.userFrom.type,index);
            },
            // tab选项
            changeType (name,idnex) {
                this.loading = true;
                this.userFrom.type = name;
                this.activeName = name;
                if (this.userFrom.type === '') {
                    this.userFrom.type = 'order';
                }
                let data = {
                    id: this.userId,
                    datas: this.userFrom
                }
								if(!idnex) idnex = 1
								this.userFrom.page = idnex
                infoApi(data).then(async res => {
                    if (res.status === 200) {
                        let data = res.data
                        this.userLists = data.list;
                        this.total = data.count;
						this.loading = false;
                        switch (this.userFrom.type) {
                        case 'order':
                            this.columns = [
                                {
                                    title:$t("page.tabel.id"),
                                    key: 'order_id',
                                    minWidth: 160
                                },
                                {
                                    title: $t("page.tabel.receive_person"),
                                    key: 'real_name',
                                    minWidth: 100
                                },
                                {
                                    title:  $t("page.tabel.receive_person"),
                                    key: 'total_num',
                                    minWidth: 90
                                },
                                {
                                    title:  $t("page.tabel.total_price"),
                                    key: 'total_price',
                                    minWidth: 110
                                },
                                {
                                    title:  $t("page.tabel.pay_price"),
                                    key: 'pay_price',
                                    minWidth: 120
                                },
                                {
                                    title:  $t("page.tabel.pay_time"),
                                    key: 'pay_time',
                                    minWidth: 120
                                }
                            ]
                            break;
                        case 'integral':
                            this.columns = [
                                {
                                    title:  $t("page.tabel.useFrom"),
                                    key: 'title',
                                    minWidth: 120
                                },
                                {
                                    title:  $t("page.tabel.redit_change"),
                                    key: 'number',
                                    minWidth: 120
                                },
                                {
                                    title:  $t("page.tabel.befor_amend"),
                                    key: 'balance',
                                    minWidth: 120
                                },
                                {
                                    title:  $t("page.tabel.date"),
                                    key: 'add_time',
                                    minWidth: 120
                                },
                                {
                                    title:  $t("page.tabel.mark"),
                                    key: 'mark',
                                    minWidth: 120
                                }
                            ]
                            break;
                        case 'sign':
                            this.columns = [
                                {
                                    title:  $t("page.tabel.act"),
                                    key: 'title',
                                    minWidth: 120
                                },
                                {
                                    title:  $t("page.tabel.get_redit"),
                                    key: 'number',
                                    minWidth: 120
                                },
                                {
                                    title:  $t("page.tabel.create_time"),
                                    key: 'add_time',
                                    minWidth: 120
                                },
                                {
                                    title:  $t("page.tabel.mark"),
                                    key: 'mark',
                                    minWidth: 120
                                }
                            ]
                            break;
                        case 'coupon':
                            this.columns = [
                                {
                                    title:  $t("page.tabel.receive_person"),
                                    key: 'coupon_title',
                                    minWidth: 120
                                },
                                {
                                    title:  $t("page.tabel.coupon_price"),
                                    key: 'coupon_price',
                                    minWidth: 120
                                },
                                {
                                    title:  $t("page.tabel.expier_time"),
                                    key: 'coupon_time',
                                    minWidth: 120
                                },
                                {
                                    title:  $t("page.tabel.get_time"),
                                    key: '_add_time',
                                    minWidth: 120
                                }
                            ]
                            break;
                        case 'balance_change':
                            this.columns = [
								{
								    title:  $t("page.tabel.act"),
								    key: 'title',
								    minWidth: 120
								},
                                {
                                    title:  $t("page.tabel.remend_amunt"),
                                    key: 'number',
                                    minWidth: 120
                                },
                                {
                                    title:  $t("page.tabel.after_amend"),
                                    key: 'balance',
                                    minWidth: 120
                                },
                                {
                                    title:  $t("page.tabel.create_time"),
                                    key: 'add_time',
                                    minWidth: 120
                                },
                                {
                                    title:  $t("page.tabel.marke"),
                                    key: 'mark',
                                    minWidth: 120
                                }
                            ]
                            break;
                        default:
                            this.columns = [
                                {
                                    title: 'ID',
                                    key: 'uid',
                                    minWidth: 120
                                },
                                {
                                    title:  $t("page.tabel.nickname"),
                                    key: 'nickname',
                                    minWidth: 120
                                },
                                {
                                    title:  $t("page.tabel.levle"),
                                    key: 'type',
                                    minWidth: 120
                                },
                                {
                                    title:  $t("page.tabel.join_time"),
                                    key: 'add_time',
                                    minWidth: 120
                                }
                            ]
                        }
                        this.loading = false;
                    } else {
                        this.loading = false;
                        this.$Message.error(res.msg);
                    }
                }).catch(res => {
                    this.loading = false;
                    this.$Message.error(res.msg);
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .avatar{
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .dashboard-workplace {
        &-header {
            &-avatar {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                margin-right: 16px;
                font-weight: 600;
            }

            &-tip {
                width: 82%;
                display: inline-block;
                vertical-align: middle;

                &-title {
                    font-size: 13px;
                    color: #000000;
                    margin-bottom: 12px;
                }

                &-desc {
                    &-sp {
                        width: 33.33%;
                        color: #17233D;
                        font-size: 13px;
                        display: inline-block;
                    }
                }
            }

            &-extra {
                .ivu-col {
                    p {
                        text-align: right;
                    }

                    p:first-child {
                        span:first-child {
                            margin-right: 4px;
                        }

                        span:last-child {
                            color: #808695;
                        }
                    }

                    p:last-child {
                        font-size: 22px;
                    }
                }
            }
        }
    }
</style>
<style scoped lang="stylus">
    .user_menu >>> .ivu-menu
       width 100% !important
</style>
