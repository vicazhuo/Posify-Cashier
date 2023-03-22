<template>
	<div>
		<Card :bordered="false" dis-hover class="ivu-mt">
			<Row>
				<Col span="5">
					<div class="menu" v-if="roleList.length ==0">
						<div class="title acea-row row-between-wrapper">
							<span>{{$t('page.common.adminIdentity')}}</span>
							<span v-auth="['system-role-create']" class="add" @click="roleAdd">{{$t('page.common.addition')}}</span>
						</div>
						<div class="title titletips">{{$t('page.common.nonData')}}</div>
					</div>
					<Menu class="menu" :active-name="active" width="auto" v-if="roleList.length">
						<div class="title acea-row row-between-wrapper">
							<span>{{$t('page.common.adminIdentity')}}</span>
							<span v-auth="['system-role-create']" class="add" @click="roleAdd">{{$t('page.common.addition')}}</span>
						</div>
						<MenuGroup>
							<MenuItem class="menu-item" :class="item.status?'':'disable'" :name="item.id"
								v-for="(item,index) in roleList" :key="index" @click.native="roleManager(item)">
							<div @mouseleave="onMouseOver">
								<div class="acea-row row-between-wrapper">
									<span>{{item.role_name}} ({{item.count}})</span>
									<span v-if="!item.status" class="stop">{{$t('page.common.prohibit')}}</span>
									<Icon class="icon-box" type="ios-more" size="24" @click.stop="showMenu(index)" />
								</div>
								<div class="ivu-select-dropdown" v-if="activeIndex === index">
									<ul class="ivu-dropdown-menu">
										<li class="ivu-dropdown-item" @click="roleEdit(item.id)">{{$t('page.common.edit')}}</li>
										<li class="ivu-dropdown-item" @click="del(item,$t('page.common.del'),index)">{{$t('page.common.del')}}</li>
									</ul>
								</div>
							</div>
							</MenuItem>
						</MenuGroup>
					</Menu>
				</Col>
				<Col span="19" class="pl15">
				<Button v-auth="['system-admin-create']" type="primary" @click="addManage">{{$t('page.common.addition')}}{{$t('page.common.admin')}}</Button>
				<Table :columns="columns" :data="manageList" ref="table" class="mt25" :loading="loading" highlight-row
					:no-userFrom-text="$t('page.common.nonData)" :no-filtered-userFrom-text="$t('page.common.nonDataResult')">
					<template slot-scope="{ row, index }" slot="status">
						<Switch size="large" v-model="row.status" :false-value="0" :true-value="1"
							@on-change="changeSwitch(row)">
							<span slot="open" :true-value="1">{{$t('page.common.enable')}}</span>
							<span slot="close" :false-value="0">{{$t('page.common.close')}}</span>
						</Switch>
					</template>
					<template slot-scope="{ row, index }" slot="avatar">
						<viewer v-if="row.avatar">
						  <div class="tabBox_img">
						    <img v-lazy="row.avatar" />
						  </div>
						</viewer>
					</template>
					<template slot-scope="{ row, index }" slot="action">
						<a @click="editManage(row.id)">{{$t('page.common.edit')}}</a>
						<Divider type="vertical" />
						<a @click="manageDel(row, $t('page.common.del'), index)">{{$t('page.common.del')}}</a>
					</template>
				</Table>
				<div class="acea-row row-right page">
					<Page :total="total" show-elevator show-total @on-change="pageChange"
						:page-size="manageFrom.limit" />
				</div>
				</Col>
			</Row>
		</Card>
		<Modal v-model="modals" @on-cancel="onCancel" :z-index="1000" class="Box" scrollable footer-hide closable
			:title="`${modelTit}`$t('page.common.adminIdentity')" :mask-closable="false" width="700">
			<limits :manage="1" ref="mychild" @updateRole="updateRole"></limits>
		</Modal>
	</div>
</template>

<script>
	import limits from '@/components/limits';
	import {
		systemRole,
		roleCreatApi,
		systemAdmin,
		adminSetStatus,
		adminCreate,
		adminEdit
	} from '@/api/setting';
	export default {
		name: 'index',
		components: {
			limits
		},
		data() {
			return {
				modals: false,
				modelTit: '',
				loading: false,
				roleList: [],
				active: '',
				activeIndex: '',
				columns: [{
						title: "ID",
						key: "id",
						width: 60,
					},
					{
						title: $t('page.tabel.headerImage'),
						slot: "avatar",
						minWidth: 100,
					},
					{
						title: $t('page.tabel.title'),
						key: "staff_name",
						minWidth: 100,
					},
					{
						title: $t("page.tabel.account"),
						key: "account",
						minWidth: 120,
					},
					{
						title: $t("page.tabel.adminIdentify"),
						key: "roles",
						minWidth: 200,
					},
					{
						title: $t("page.tabel.status"),
						slot: "status",
						minWidth: 100,
					},
					{
						title: $t("page.tabel.operation"),
						slot: "action",
						fixed: "right",
						minWidth: 120,
					}
				],
				manageList: [],
				total: 0,
				manageFrom: {
					page: 1,
					limit: 15,
					roles: 0
				},
				tatus: 1
			}
		},
		created() {
		},
		mounted() {
			this.roleInfo(this.tatus);
		},
		methods: {
			roleManager(item) {
				this.manageFrom.roles = item.id
				this.manageFrom.page = 1
				if (!item.status) return
				this.adminList();
			},
			onCancel() {
				this.$refs.mychild.onCancel()
			},
			addManage() {
				this.$modalForm(adminCreate()).then((res) => {
					this.$Message.success(res.msg)
					this.adminList();
					this.roleInfo();
				})
			},
			editManage(id) {
				this.$modalForm(adminEdit(id)).then((res) => {
					this.$Message.success(res.msg)
					this.adminList();
					this.roleInfo();
				})
			},
			// 上下架
			changeSwitch(row) {
				adminSetStatus(row.id, row.status)
					.then((res) => {
						this.$Message.success(res.msg);
						this.manageList();
					})
					.catch((res) => {
						this.$Message.error(res.msg);
					});
			},
			adminList() {
				this.loading = true;
				systemAdmin(this.manageFrom).then(res => {
					let data = res.data;
					this.manageList = data.list;
					this.total = data.count;
					this.loading = false;
				}).catch(err => {
					this.loading = false;
					this.$Message.error(err.msg)
				})
			},
			pageChange(index) {
				this.manageFrom.page = index;
				this.adminList();
			},
			updateRole(e) {
				this.modals = e;
				this.roleInfo();
			},
			roleInfo(sta) {
					systemRole().then(res => {
						// this.$nextTick(()=>{
							this.roleList = res.data.list || [];
							this.active = res.data.list[0].id || '';
							this.manageFrom.roles = this.manageFrom.roles || res.data.list[0].id;
							// this.adminList();
							if(sta == 1){
								this.roleManager(this.roleList[0]);
							}
						// })

					}).catch(err => {
						this.$Message.error(err.msg)
					})

			},
			manageDel(row, tit, num) {
				let delfromData = {
					title: tit,
					num: num,
					url: `system/admin/${row.id}`,
					method: 'DELETE',
					ids: ''
				};
				this.$modalSure(delfromData).then((res) => {
					this.$Message.success(res.msg);
					this.manageList.splice(num, 1)
					this.adminList();
					this.roleInfo();
				}).catch(res => {
					this.$Message.error(res.msg);

				});
			},
			// 删除
			del(row, tit, num) {
				let delfromData = {
					title: tit,
					num: num,
					url: `system/role/${row.id}`,
					method: 'DELETE',
					ids: ''
				};
				this.$modalSure(delfromData).then((res) => {
					this.$Message.success(res.msg);
					this.roleList.splice(num, 1)
				}).catch(res => {
					this.$Message.error(res.msg);
				});
			},
			roleAdd() {
				this.modelTit = $t('page.common.addition')
				this.modals = true
				this.$refs.mychild.getMenuList();
			},
			roleEdit(id) {
				this.modelTit =$t("page.common.edit")
				this.modals = true
				this.$refs.mychild.getInfo(id)
			},
			showMenu(index) {
				this.activeIndex = index;
			},
			onMouseOver() {
				this.activeIndex = ''
			}
		}
	}
</script>

<style lang="less" scoped>
	/*定义滑块 内阴影+圆角*/
	.Box /deep/::-webkit-scrollbar-thumb {
		-webkit-box-shadow: inset 0 0 6px #eee;
	}

	.Box /deep/::-webkit-scrollbar {
		width: 2px !important;
		/*对垂直流动条有效*/
	}

	.Box /deep/.treeList {
		height: 450px;
		min-height: unset;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.Box /deep/.ivu-modal-body {
		padding: 16px 0 0 0;
	}

	/deep/.ivu-menu-vertical .ivu-menu-item-group-title {
		display: none;
	}

	/deep/.ivu-menu-vertical .ivu-menu-item,
	/deep/.ivu-menu-vertical .ivu-menu-submenu-title,
	.menu .title {
		height: 40px;
		line-height: 40px;
		padding: 0 22px;
	}

	/deep/.ivu-menu-item {
		z-index: unset !important;
	}
	/deep/.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after {
		z-index: 9;
	}

	/deep/.ivu-menu-vertical .ivu-menu-item.disable,
	/deep/.ivu-menu-vertical .ivu-menu-submenu-title.disable {
		color: #999999 !important;
		background: #fff !important;
	}

	/deep/.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active.disable:not(.ivu-menu-submenu):after {
		background: unset;
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
	.menu-item {
		position: relative;

		.ivu-select-dropdown {
			right: 0;
			top: 0;
		}
	}

	.menu .title {
		color: #666;

		.add {
			color: #2d8cf0;
			cursor: pointer;
		}
	}

	.menu-item {
		.icon-box {
			display: none;
		}

		.stop {
			display: block;
		}
	}

	.menu-item:hover {
		.icon-box {
			display: block;
		}

		.stop {
			display: none;
		}
	}
	.titletips{
		margin-top: 80px;
		text-align: center;
	}
</style>
