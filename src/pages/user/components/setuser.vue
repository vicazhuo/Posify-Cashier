<template>
    <div style="width: 100%">
        <Modal v-model="modals" scrollable footer-hide closable :title="$t('page.common.amend_staff')" :mask-closable="false" width="900" @on-cancel="cancel">
			<Table
			  :loading="loading"
			  highlight-row
			  :no-userFrom-text="$t('page.common.nonData')"
			  :no-filtered-userFrom-text="$t('page.common.nonDataResult')"
			  ref="selection"
			  :columns="columns"
			  :data="tableList"
			>
				<template slot-scope="{ row, index }" slot="avatars">
				  <viewer>
				    <div class="tabBox_img">
				      <img v-lazy="row.avatar" />
				    </div>
				  </viewer>
				</template>
				<template slot-scope="{ row, index }" slot="status">
				  <span v-if="row.status == 1">{{$t('page.common.enable')}}</span>
				  <span v-if="row.status == 0">{{$t('page.common.close')}}</span>
				</template>
			</Table>
			<div class="acea-row row-right page">
			  <Page
			    :total="total"
			    show-elevator
			    show-total
				:current="formValidate.page"
			    @on-change="pageChange"
			    :page-size="formValidate.limit"
			  />
			</div>
			<!-- <div class="footer">确定</div> -->
        </Modal>
    </div>
</template>

<script>
    import { staffListInfo } from '@/api/staff';
	import { setUserSaveApi } from '@/api/user'
    export default {
        name: 'setusers',
        data () {
            return {
                modals: false,
				total: 0,
				formValidate: {
				  page: 1,
				  limit: 15,
				},
				loading: false,
				tableList: [],
				currentChoose: '',
				id: '',
				columns: [
				  {
				    title: $t('page.common.choose'),
					key: 'id',
					width: 70,
					align: 'center',
					render: (h, params) => {
					  let id = params.row.id;
					  let flag = false;
					  if (this.currentChoose === id) {
						this.current(params.row)
						flag = true
					  } else {
						flag = false
					  }
					  let self = this
					  return h('div', [
						h('Radio', {
						  props: {
							value: flag
						  },
						  on: {
							'on-change': () => {
							  self.currentChoose = id;
							  this.$parent.getList()
							}
						  }
						})
					  ])
					}

				  },
				  {
				    title: $t('page.tabel.headerImage'),
				    slot: "avatars",
				    Width: 60,
				  },
				  {
				  	title:$t('page.tabel.wechat_nickname'),
				  	key: 'staff_name',
				  	minWidth: 80
				  },
				  {
				  	title: $t('page.tabel.phoneNo'),
				  	key: 'phone',
				  	minWidth: 100
				  },
				  {
				      title: $t('page.tabel.accout_status'),
				      slot: 'status',
				      minWidth: 80
				  }
				],

            }
        },
        mounted () {
			this.getList()
        },
        methods: {
			getList(){
				staffListInfo(this.formValidate).then(res=>{
					this.tableList = res.data.list
					this.total = res.data.count
				})
			},
			getId(id){
				this.id = id
			},
			cancel(){
				this.$Message.info($t('page.messages.cancled'));
				this.currentChoose = ''
			},
			pageChange(index){
				this.formValidate.page = index
				this.getList()
			},
			current(data){
				// data.id   店员ID
				// this.id   用户ID
				let datas = {
					uid: this.id,
					staff_id: data.id
				}
				setUserSaveApi(datas).then(res=>{
					this.modals = false
					this.$Message.success(res.msg)
					this.currentChoose = ''
					this.$parent.getList()
				}).catch(err=>{
					this.modals = false
					this.$Message.error(err.msg)
					this.currentChoose = ''
				})
			}
		}
    }
</script>

<style lang="less" scoped>
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
</style>
