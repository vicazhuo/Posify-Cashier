<template>
	<div>
		<Row class="ivu-mt box-wrapper">
			<Col span="4" class="left-wrapper">
			  <Menu :theme="theme3" :active-name="sortName" width="auto">
			    <MenuGroup>
			      <MenuItem
			        :name="item.id"
			        class="menu-item"
			        :class="index === current ? 'showOn' : ''"
			        v-for="(item, index) in labelSort"
			        :key="index"
			        @click.native="bindMenuItem(item.id, index)"
			      >
			        {{ item.name }}
			        <div class="icon-box" v-if="index != 0">
			          <Icon type="ios-more" size="24" @click.stop="showMenu(item)" />
			        </div>
			        <div
			          class="right-menu ivu-poptip-inner"
			          v-show="item.status"
			          v-if="index != 0"
			        >
			          <div class="ivu-poptip-body" @click="labelEdit(item)">
			            <div class="ivu-poptip-body-content">
			              <div class="ivu-poptip-body-content-inner">{{$t('page.common.edit')}}</div>
			            </div>
			          </div>
			          <div
			            class="ivu-poptip-body"
			            @click="deleteSort(item, $t('page.common.delCate'), index)"
			          >
			            <div class="ivu-poptip-body-content">
			              <div class="ivu-poptip-body-content-inner">{{$t("page.common.del")}}</div>
			            </div>
			          </div>
			        </div>
			      </MenuItem>
			    </MenuGroup>
			  </Menu>
			</Col>
			<Col span="20" class="right-wrapper ">
				<div class="bottom" v-if="tab == 0">
					<Col v-bind="grid">
					  <Button
					    type="primary"
						v-auth="['user-user_label-create']"
					    icon="md-add"
					    @click="add"
					    >添加标签</Button
					  >
					  <Button
					    type="success"
						v-auth="['user-user_label_cate-create']"
					    icon="md-add"
					    @click="addSort"
					    style="margin-left: 10px"
					    >添加分类</Button
					  >
					</Col>
					<!-- <Button type="primary" @click="add">添加标签</Button>
					<Button class="button" @click="addSort">添加分类</Button> -->
					<div class="bottom-table">
						<Table :columns="columns" :data="labelLists" ref="table" class="mt25"
						       :loading="loading" highlight-row
						       :no-userFrom-text="$t('page.common.nonData')"
						       :no-filtered-userFrom-text="$t('page.common.nonDataResult')">
						   <template slot-scope="{ row, index }" slot="status">
						     <i-switch
						       v-model="row.status"
						       :value="row.status"
						       :true-value="1"
						       :false-value="0"
						       @on-change="changeSwitch(row)"
						       size="large"
						     >
						       <span slot="open">{{ $t("page.common.enable")}}</span>
						       <span slot="close">{{ $t("page.common.close")}}</span>
						     </i-switch>
						   </template>
						    <template slot-scope="{ row, index }" slot="action">
						        <a @click="edit(row.id)">{{ $t("page.common.edit")}}</a>
						        <Divider type="vertical"/>
						        <a  @click="del(row,  $t('page.common.del'), index)">{{$t("page.common.del")}}</a>
						    </template>
						</Table>
						<div class="acea-row row-right page">
						  <Page
						    :total="total"
						    :current="labelFrom.page"
						    show-elevator
						    show-total
						    @on-change="pageChange"
						    :page-size="labelFrom.limit"
						  />
						</div>
					</div>
				</div>
			</Col>
		</Row>
	</div>
</template>

<script>
	import { userlabelListInfo, userLabelCreate, userLabelEdit, LabeInfo, usercreateApi, userEditApi } from "@/api/user"
	export default {
		name: "ccc",
		data(){
			return{
				grid: {
				  xl: 7,
				  lg: 7,
				  md: 12,
				  sm: 24,
				  xs: 24,
				},
				total: 0,
				tab:0,
				theme3: "light",
				labelSort:[],
				labelFrom: {
				  page: 1,
				  limit: 15,
				  label_cate: "",
				},
				current: 0,
				sortName: "",
				loading:false,
				columns: [
				  {
				    title: "ID",
				    key: "id",
				    minWidth: 120,
				  },
				  {
				    title:  $t("page.tabel.tagName"),
				    key: "label_name",
				    minWidth: 600,
				  },
				  {
				    title: $t("page.tabel.operation"),
				    slot: "action",
				    fixed: "right",
				    minWidth: 120,
				  },
				],
				labelLists:[],
			}
		},
		mounted() {
			this.getUserLabelAll()
			this.bindMenuItem("",0)
		},
		methods:{
			bindMenuItem(id, index) {
			  this.current = index;
			  this.labelFrom.page = 1
			  this.labelSort.forEach((el) => {
			    el.status = false;
			  });
			  this.labelFrom.label_cate = id;
			  this.getList();
			},
			// 标签分类
			getUserLabelAll(key) {
			  userlabelListInfo().then((res) => {
			    let obj = {
			      name: $t('page.common.all'),
			      id: "",
			    };
			    res.data.list.unshift(obj);
			    res.data.list.forEach((el) => {
			      el.status = false;
			    });
			    if (!key) {
			      this.sortName = res.data.list[0].id;
			      this.labelFrom.label_cate = res.data.list[0].id;
			      // this.getList();
			    }
			    this.labelSort = res.data.list;
			  });
			},
			// 显示标签小菜单
			showMenu(item) {
			  this.labelSort.forEach((el) => {
			    if (el.id == item.id) {
			      el.status = item.status ? false : true;
			    } else {
			      el.status = false;
			    }
			  });
			},
			//编辑标签分类
			labelEdit(item) {
			  this.$modalForm(userLabelEdit(item.id)).then(() =>
			    this.getUserLabelAll(1)
			  );
			},
			//删除标签分类
			deleteSort(row, tit, num) {
			  let delfromData = {
			    title: tit,
			    num: num,
			    url: `user/user_label_cate/${row.id}`,
			    method: "DELETE",
			    ids: "",
			  };
			  this.$modalSure(delfromData)
			    .then((res) => {
			      this.$Message.success(res.msg);
			      this.labelSort.splice(num, 1);
			      this.labelSort = [];
			      this.getUserLabelAll();
			    })
			    .catch((res) => {
			      this.$Message.error(res.msg);
			    });
			},
			// 添加分类
			addSort() {
			  this.$modalForm(userLabelCreate()).then(() => this.getUserLabelAll());
			},
			// 添加标签
			add() {
			  this.$modalForm(usercreateApi(0)).then(() => this.getList());
			},
			changeSwitch(e){
			},
			getList(){
				this.loading = true;
				LabeInfo(this.labelFrom)
				  .then(async (res) => {
				    let data = res.data;
				    this.labelLists = data.list;
				    this.total = data.count;
				    this.loading = false;
				  })
				  .catch((res) => {
				    this.loading = false;
				    this.$Message.error(res.msg);
				  });
			},
			// 标签列表编辑
			edit(id) {
			  this.$modalForm(userEditApi(id)).then(() => this.getList());
			},
			// 标签列表删除
			del(row, tit, num) {
			  let delfromData = {
			    title: tit,
			    num: num,
			    url: `user/user_label/${row.id}`,
			    method: "DELETE",
			    ids: "",
			  };
			  this.$modalSure(delfromData)
			    .then((res) => {
			      this.$Message.success(res.msg);
			      this.labelLists.splice(num, 1);

			      this.getList();
			    })
			    .catch((res) => {
			      this.$Message.error(res.msg);
			    });
			},
			//分页
			pageChange(page) {
			  this.labelFrom.page = page;
			  this.getList()
			},
		}
	}
</script>

<style scoped lang="stylus">
	/deep/.ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title{
	  text-align left;
	}
	/deep/.i-layout-page-header{
	  height 66px;
	  background-color #fff;
	  border-bottom: 1px solid #e8eaec;
	}
	/deep/.ivu-page-header{
	  border-bottom: unset;
	  position: fixed;
	  // z-index 9;
	  width 100%;
	}
	/deep/.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
		background: #ecf6ff;
		color: #1890FF;
	}
	/deep/ .ivu-menu-vertical .ivu-menu-item-group-title {
	  display: none;
	}
	/deep/ .ivu-menu-vertical.ivu-menu-light:after {
	  display: none;
	}
	.menu-item {
	  position: relative;
	  display: flex;
	  justify-content: space-between;
	  word-break: break-all;
	  .icon-box {
	    position: absolute;
	    right: 20px;
	    top: 50%;
	    transform: translateY(-50%);
	    display: none;
	  }

	  &:hover .icon-box {
	    display: block;
	  }

	  .right-menu {
	    position: absolute;
	    right: -124px;
	    top: -11px;
	    width: auto;
	    min-width: 121px;
	  }
	}
	.showOn {
	  color: #2d8cf0;
	  background: #f0faff;
	}

	.left-wrapper {
	  background: #fff;
	  border-right: 1px solid #dcdee2;
	}

	.right-wrapper{
		background: #fff;
		.bottom{
			padding 17px 15px
			.bottom-table{

			}
		}
	}
	.dsableds{
		color #999999
		display: flex;
		justify-content: space-between;
	}
	.dsableds:hover{
		color #999999
		cursor:not-allowed;//是禁用的样式 一个圆圈中间一个斜杠
		//其中还有一个属性也是这个样式
		cursor:no-drop;
	}
	.button{margin-left: 20px}
</style>
