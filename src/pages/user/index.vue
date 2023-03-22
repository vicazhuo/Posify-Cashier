<template>
    <div>
        <Card :bordered="false" dis-hover class="ivu-mt listbox">
            <Form
                    ref="userFrom"
                    :model="userFrom"
                    :label-width="labelWidth"
                    :label-position="labelPosition"
                    @submit.native.prevent
            >
                <Row :gutter="16" class="mart">
                    <Col span="18">
                        <FormItem :label="$t('page.label.userSearch')" :labelWidth="100" label-for="nickname">
                            <Input
                                    v-model="userFrom.keyword"
                                    :placeholder="$t('page.placeholder.userIdPhone')"
                                    element-id="nickname"
                                    style="width: 50%"
                                    clearable
                            >
                                <Select
                                        v-model="userFrom.field_key"
                                        slot="prepend"
                                        style="width: 80px"
                                >
                                    <Option value="all">{{$t("page.common.all")}}</Option>
                                    <Option value="uid">{{$t("page.common.id")}}</Option>
                                    <Option value="phone">{{$t("page.common.phoneNo")}}</Option>
                                </Select>
                            </Input>
                        </FormItem>
                    </Col>
                    <Col span="6" class="ivu-text-right userFrom">
                        <FormItem>
                            <Button
                                    type="primary"
                                    icon="ios-search"
                                    label="default"
                                    class="mr15"
                                    @click="userSearchs"
                            >{{$t("page.common.search")}}
                            </Button
                            >
                            <Button class="ResetSearch" @click="reset('userFrom')"
                            >{{$t("page.common.reset")}}
                            </Button
                            >
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Card>
        <Card :bordered="false" dis-hover class="ivu-mt">
            <Row type="flex" justify="space-between">
                <Col span="24">
                    <Button class="button" :disabled="datanew.length<=0" @click="setLabel">
                        {{$t("page.common.setTag")}}
                    </Button>
                </Col>
                <Col span="24">
                    <Table :columns="columns"
                           :data="dataList" ref="selection"
                           @on-select-all="selectall"
                           @on-select-all-cancel="selectall"
                           @on-sort-change="sortChanged"
                           @on-selection-change="select"
                           :loading="loading" highlight-row
                           :no-userFrom-text="$t('page.common.nonData')"
                           :no-filtered-userFrom-text="$t('page.common.nonDataResult')"
                           class="ivu-mt">
                        <template slot-scope="{ row, index }" slot="avatars">
                            <viewer>
                                <div class="tabBox_img">
                                    <img v-lazy="row.avatar"/>
                                </div>
                            </viewer>
                        </template>
                        <template slot-scope="{ row, index }" slot="nickname">
                            <div class="acea-row">
                                <Icon
                                        type="md-male"
                                        v-show="row.sex === $t('page.common.male')"
                                        color="#2db7f5"
                                        size="15"
                                        class="mr5"
                                />
                                <Icon
                                        type="md-female"
                                        v-show="row.sex ===$t('page.common.female')"
                                        color="#ed4014"
                                        size="15"
                                        class="mr5"
                                />
                                <div v-text="row.nickname"></div>
                            </div>
                            <!-- <div v-show="row.vip_name" class="vipName">{{row.vip_name}}</div> -->
                        </template>
                        <template slot-scope="{ row, index }" slot="isMember">
                            <div>{{ row.isMember ?$t('page.common.yes') :$t('page.common.no') }}</div>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                            <a @click="detail(row)">{{$t('page.common.details')}}</a>
                            <Divider type="vertical"/>
                            <a @click="recharge(row)">{{$t('page.common.recharge')}}</a>
                            <Divider type="vertical"/>
                            <a @click="paying(row)">{{$t('page.common.vip')}}</a>
                            <Divider type="vertical"/>
                            <a @click="openLabel(row)">{{$t('page.common.setTag')}}</a>
                            <!-- <Divider type="vertical"/>
                            <a @click="setUser(row)">修改店员</a> -->
                        </template>
                    </Table>
                    <div class="acea-row row-right page">
                        <Page
                                :total="total"
                                :current="userFrom.page"
                                show-elevator
                                show-total
                                @on-change="pageChange"
                                :page-size="userFrom.limit"
                                class="box"
                        />
                    </div>
                </Col>
            </Row>
        </Card>
        <!-- 详情-->
        <user-details ref="userDetails"></user-details>
        <!-- 充值 -->
        <Recharges ref="recharges"></Recharges>
        <Paying ref="payings"></Paying>
        <Setusers ref="setusers"></Setusers>
        <!-- 选择用户标签 -->
        <Modal
                v-model="labelShow"
                scrollable
                :title="$t('page.common.chioceUserTag')"
                :closable="false"
                width="320"
                :footer-hide="true"
        >
            <userLabel :uid="labelActive.uid" @close="labelClose"></userLabel>
        </Modal>
    </div>
</template>

<script>
    import Setusers from './components/setuser'
    import Recharges from './components/recharge'
    import Paying from './components/paying'
    import {userListApi, usersearchApi, userSetLabelApi} from "@/api/user"
    import userDetails from "./components/userDetails";
    import userLabel from "./components/userLabel";
    import {mapState} from "vuex";

    export default {
        name: 'user',
        components: {
            userDetails,
            userLabel,
            Recharges,
            Setusers,
            Paying
        },
        data() {
            return {
                total: 0,
                loading: false,
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: $t("page.tabel.id"),
                        key: "uid",
                        width: 60,
                    },
                    {
                        title: $t("page.tabel.headerImage"),
                        slot: "avatars",
                        minWidth: 60,
                    },
                    {
                        title: $t("page.tabel.nickname"),
                        slot: "nickname",
                        minWidth: 150,
                    },
                    {
                        title: $t("page.tabel.vip"),
                        slot: "isMember",
                        minWidth: 90,
                    },
                    {
                        title: $t("page.tabel.level"),
                        key: "level",
                        minWidth: 90,
                    },
                    {
                        title: $t("page.tabel.tag"),
                        key: "labels",
                        minWidth: 90,
                    },
                    {
                        title: $t("page.tabel.phoneNo"),
                        key: "phone",
                        minWidth: 100,
                    },
                    {
                        title: $t("page.tabel.userType"),
                        key: "user_type",
                        minWidth: 100,
                    },
                    {
                        title: $t("page.tabel.balance"),
                        key: "now_money",
                        sortable: "custom",
                        minWidth: 100,
                    },
                    {
                        title: $t("page.tabel.staffName"),
                        key: "staff_name",
                        minWidth: 100,
                    },
                    {
                        title: $t("page.tabel.operation"),
                        slot: 'action',
                        fixed: 'right',
                        minWidth: 290,
                        align: 'center'
                    }
                ],
                dataList: [],
                datanew: [],
                dataid: [],
                userFrom: {
                    keyword: "",
                    page: 1,
                    limit: 15,
                    field_key: "all",
                },
                labelShow: false,
                labelActive: {
                    uid: 0,
                }
            }
        },
        computed: {
            ...mapState("store/layout", ["isMobile"]),
            labelWidth() {
                return this.isMobile ? undefined : 120;
            },
            labelPosition() {
                return this.isMobile ? "top" : "right";
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            getList() {
                this.loading = true
                userListApi(this.userFrom).then(res => {
                    this.loading = false
                    this.total = res.data.count
                    this.dataList = res.data.list
                }).catch(err => {
                    this.loading = false
                    this.$Message.error(err.msg)
                })
            },
            // 搜索
            userSearchs() {
                this.userFrom.page = 1
                if (this.userFrom.keyword == '') {
                    // this.$Message.warning("请输入搜索内容")
                    this.getList()
                } else {
                    this.loading = true
                    usersearchApi(this.userFrom).then(res => {
                        this.dataList = res.data.list
                        this.total = res.data.count
                        this.loading = false
                    })
                }
            },
            // 重置
            reset(name) {
                this.userFrom = {
                    keyword: "",
                    field_key: "all",
                    page: 1, // 当前页
                    limit: 15, // 每页显示条数
                };
                this.getList();
            },
            select(e) {
                this.datanew = e;
                let data = [];
                this.datanew.map((item) => {
                    data.push(item.uid);
                });
                this.dataid = data;
            },
            selectall(e) {
                if (e.length == 0) {
                    this.dataid = []
                } else {
                    this.datanew = e
                    let data = [];
                    this.datanew.map((item) => {
                        data.push(item.uid);
                    });
                    this.dataid = data;
                }

            },
            // 批量设置标签；
            setLabel() {
                if (this.datanew.length == 0) {
                    this.$Message.warning($t("page.messages.chioceUserTag"));
                } else {
                    let a = []
                    a = this.dataid.join(",");

                    let uids = {all: 0};
                    uids.uids = this.dataid;
                    this.$modalForm(userSetLabelApi(uids)).then(() => this.getList());
                }
            },
            // 详情
            detail(row) {
                this.$refs.userDetails.modals = true;
                this.$refs.userDetails.getDetails(row.uid);
            },
            // 充值
            recharge(row) {
                this.$refs.recharges.modals = true
                this.$refs.recharges.getList(row.uid);

            },
            paying(row) {
                this.$refs.payings.modals = true
                this.$refs.payings.getList(row.uid);
            },
            // 修改店员
            setUser(row) {
                this.$refs.setusers.modals = true
                this.$refs.setusers.getId(row.uid);
            },
            // 设置标签弹窗
            openLabel(row) {
                this.labelShow = true;
                this.labelActive.uid = row.uid;
            },
            // 标签弹窗关闭
            labelClose() {
                this.labelShow = false;
                this.labelActive.uid = 0;
                this.getList()
            },
            //分页
            pageChange(page) {
                this.userFrom.page = page;
                this.getList()
            },
            // 排序
            sortChanged(e) {
                this.userFrom[e.key] = e.order;
                this.getList();
            },
        }
    }

</script>

<style scoped lang="stylus">
    /deep/ .ivu-form-label-left .ivu-form-item-label {
        text-align right
    }

    /deep/ .ivu-card-body {
        padding-bottom 0px
    }

    .mart {
        margin-top 10px
    }

    .listbox {
        >>> .ivu-divider-horizontal {
            margin: 0 !important;
        }
    }

    .userFrom {
        >>> .ivu-form-item-content {
            margin-left: 0px !important;
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

    .box {
        padding-bottom: 20px;
    }

    .button {
        margin-left: 20px
    }
</style>
