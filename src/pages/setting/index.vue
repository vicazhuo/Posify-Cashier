<template>
	<div>
		<Card :bordered="false" dis-hover class="ivu-mt acea-row row-center-wrapper">
			<Form ref="formItem" :model="formItem" :label-width="labelWidth" :label-position="labelPosition" :rules="ruleValidate" @submit.native.prevent>
				<Row type="flex" style="width: 580px;margin: 0 auto">
					<Col span="24">
						<Col v-bind="grid">
							<FormItem :label="$t('page.form.storePhoto')：" prop="image">
								<div class="picBox" @click="modalPicTap($t('page.form.singleSelection'))">
									<div class="pictrue" v-if="formItem.image"><img v-lazy="formItem.image"></div>
									<div class="upLoad acea-row row-center-wrapper"   v-else>
										<!-- <Icon type="ios-camera-outline" size="26" class="iconfont"/> -->
										<span class="iconfont icontupian"></span>
									</div>
								</div>
							</FormItem>
						</Col>
					</Col>
					<Col span="24">
						<Col v-bind="grid">
							<FormItem :label="$t('page.form.storeName')：" prop="name" label-for="name">
								<Input v-model="formItem.name" maxlength="20" show-word-limit :placeholder="$t('page.form.placeholder')+$t('page.form.storeName')" class="inputW"/>
							</FormItem>
						</Col>
					</Col>
					<Col span="24">
						<Col v-bind="grid">
							<FormItem :label="$t('page.form.storeDescript')：" label-for="introduction">
								<Input v-model="formItem.introduction" maxlength="100" show-word-limit :placeholder="$t('page.form.placeholder')+$t('page.form.storeDescript')"  class="inputW" />
							</FormItem>
						</Col>
					</Col>
					<Col span="24">
						<Col v-bind="grid">
							<FormItem :label="$t('page.form.storePhone')：" label-for="phone" prop="phone">
								<Input v-model="formItem.phone"  :placeholder="$t('page.form.placeholder')+$t('page.form.storePhone')"   class="inputW"/>
							</FormItem>
						</Col>
					</Col>
					<Col span="24">
						<Col v-bind="grid">
							<FormItem :label="$t('page.form.businessStatus')：" label-for="is_show" prop="is_show">
								<Switch size="large" v-model="formItem.is_show" :false-value="0" :true-value="1">
									<span slot="open" :true-value="1">{{$t('page.common.enable')}}</span>
									<span slot="close" :false-value="0">{{$t('page.common.close')}}</span>
								</Switch>
							</FormItem>
						</Col>
					</Col>
					<Col span="24" v-if="formItem.is_show == 1">
						<Col v-bind="grid">
							<FormItem :label="$t('page.form.businessTime')：" label-for="day_time" prop="day_time">
								<TimePicker type="timerange" @on-change="onchangeTime" v-model="formItem.day_time"  format="HH:mm:ss" :value="formItem.day_time" placement="bottom-end" :placeholder="$t('page.form.placeholder')+$t('page.form.businessTime')"  class="inputW" ></TimePicker>
							</FormItem>
						</Col>
					</Col>
					<Col span="24">
						<Col v-bind="grid">
							<FormItem :label="$t('page.form.selfPickup')：" label-for="mention" prop="mention">
								<Switch size="large" v-model="formItem.is_store" :false-value="0" :true-value="1">
									<span slot="open" :true-value="1">{{$t('page.common.enable')}}</span>
									<span slot="close" :false-value="0">{{$t(page.common.close)}}</span>
								</Switch>
							</FormItem>
						</Col>
					</Col>
					<Col span="24">
						<Col v-bind="grid">
							<FormItem :label="$t('page.form.storeAddress')：" label-for="address" prop="address">
								<Cascader :data="addresData" :load-data="loadData" v-model="formItem.addressSelect" @on-change="addchack" class="inputW"></Cascader>
							</FormItem>
						</Col>
					</Col>
					<Col span="24">
						<Col v-bind="grid">
							<FormItem :label="$t('page.form.deliveryRegin')：" label-for="valid_range" prop="valid_range">
								<InputNumber :min="0" :step="0.001" v-model="formItem.valid_range" :formatter="value => `${formItem.valid_range}`" :parser="value => value.replace('%', '')"></InputNumber><span style="margin-left: 10px;">km</span>
							</FormItem>
						</Col>
					</Col>
					<Col span="24">
						<Col v-bind="grid">
							<FormItem :label="$t('page.form.storeDetailAddress')：" label-for="detailed_address" prop="detailed_address">
								<Input search :enter-button="$t('page.form.searchPlace')" v-model="formItem.detailed_address"  :placeholder="$t('page.form.placeholder')+$t('page.form.address_details1')" class="inputW" @on-search="onSearch" />
							<!-- 	提示：定位地址后，手动补充完详细地址，禁止再次点击查找 -->
							</FormItem>
						</Col>
					</Col>
					<Col span="24" v-if="isApi">
						<Maps v-if="mapKey" ref="mapChild" class="map-sty" :mapKey="mapKey" :lat="Number(formItem.latitude || 34.34127)" :lon="Number(formItem.longitude || 108.93984)" :address="formItem.detailed_address" @getCoordinates="getCoordinates" />
					</Col>
				</Row>
				<div class="footer acea-row row-center-wrapper">
					<Button type="primary" class="ml20" @click="handleSubmit('formItem')">{{$t('page.form.save')}}</Button>
				</div>
				<Spin size="large" fix v-if="spinShow"></Spin>
			</Form>
		</Card>
		<Modal v-model="modalPic" width="950px" scrollable  footer-hide closable :title="$t('page.form.updatePhoto')" :mask-closable="false" :z-index="1">
			<uploadPictures :isChoice="isChoice" @getPic="getPic" :gridBtn="gridBtn" :gridPic="gridPic" v-if="modalPic"></uploadPictures>
		</Modal>
	</div>
</template>


<script>
	import { keyApi, storeUpdateApi, storeGetInfoApi, cityApi } from '@/api/setting';
	import { mapState } from 'vuex';
	import uploadPictures from '@/components/uploadPictures';
	import Maps from '@/components/map/map.vue'
	export default {
		name: 'systemStore',
		components: { uploadPictures,Maps },
		props: { },
		data () {
			const validatePhone = (rule, value, callback) => {
				if (!value) {
					return callback(new Error($t('page.messages.plsfiltePhone')));
				} else if (!/^1[3456789]\d{9}$/.test(value)) {
					callback(new Error($t('page.messages.plscheckPhone')));
				} else {
					callback();
				}
			};
			const validateUpload = (rule, value, callback) => {
				if (!this.formItem.image) {
					callback(new Error($t('page.messages.plsuploadStorePhoto')))
				} else {
					callback()
				}
			};
			return {
				formItem: {
					image: '',
					name: '',
					introduction: '',
					phone: '',
					is_show: true,
					day_time: [],
					is_store: true,
					address: '',
					detailed_address: '',
					latitude:'',
					longitude:'',
					province:0,
					city:0,
					area:0,
					street:0,
					addressSelect:[],
					valid_range:0
				},
				spinShow: false,
				addresData: [],
				ruleValidate: {
					name: [
						{ required: true, message:$t('page.messages.plsTypeStoreName'), trigger: 'blur' }
					],
					phone: [
						{ required: true, validator: validatePhone, trigger: 'blur' }
					],
					detailed_address: [
						{ required: true, message:$t('page.messages.plsTypeAddress'), trigger: 'blur' }
					],
					image: [
						{ required: true, validator: validateUpload, trigger: 'plsuploadStorePhoto' }
					],
					day_time: [
						{required: true,type: "array", message: $t('page.messages.plsChooseBusinessTime'),trigger: "change"},
						{validator(rule, value, callback, source, options)
							{
								if (value[0] === "") {
								callback($t('page.messages.plsChooseBusinessTime'));
								}
							 callback();//这个一定要有。不然无法验证通过
							}
						}
					],//TimePicker-timerange，自定义的
				},
				mapKey: '',
				grid: {
					xl: 20,
					lg: 20,
					md: 20,
					sm: 24,
					xs: 24
				},
				gridPic: {
					xl: 6,
					lg: 8,
					md: 12,
					sm: 12,
					xs: 12
				},
				gridBtn: {
					xl: 4,
					lg: 8,
					md: 8,
					sm: 8,
					xs: 8
				},
				modalPic: false,
				isChoice: '单选',
				pid:0,
				isApi:0
			}
		},
		created () {
			this.getKey();
			this.getInfo();
			let data = {pid:0}
			this.cityInfo(data);
		},
		computed: {
			...mapState('store/layout', [
				'isMobile'
			]),
			labelWidth () {
				return this.isMobile ? undefined : 120;
			},
			labelPosition () {
				return this.isMobile ? 'top' : 'right';
			}
		},
		mounted: function () {},
		methods: {
			addchack(e,selectedData){
				e.forEach((i,index)=>{
					if(index==0){
						this.formItem.province = i
					}else if(index==1){
						this.formItem.city = i
					}else if(index==2){
						this.formItem.area = i
					}else {
						this.formItem.street = i
					}
				})
				this.formItem.address = (selectedData.map(o => o.label)).join("/");
			},
			cityInfo(data){
				cityApi(data).then(res=>{
					this.addresData = res.data
				})
			},
			loadData (item, callback) {
				item.loading = true;
				cityApi({pid:item.value}).then(res=>{
					item.children = res.data;
					item.loading = false;
					callback();
				});
			},
			// 地图信息获取
			getCoordinates(data) {
				if(this.isApi){
					this.formItem.latitude = data.location.lat || 34.34127
					this.formItem.longitude = data.location.lng || 108.93984
					// // this.formItem.detailed_address = data.address
					let components = data.addressComponents;
					if(this.formItem.detailed_address.indexOf(components.street) == -1){
						this.formItem.detailed_address = data.address+(components.town?components.town:'');
					}
				}
			},
			// 查找位置
			onSearch() {
				this.$refs.mapChild.searchKeyword(this.formItem.detailed_address)
			},
			// key值
			getKey () {
				keyApi().then(res => {
					this.mapKey = res.data.tengxun_map_key
				}).catch(res => {
					this.$Message.error(res.msg)
				})
			},
			// 详情
			getInfo () {
				let that = this;
				that.spinShow = true;
				storeGetInfoApi().then(res => {
					this.isApi = 1;
					let addressSelect = []
					this.formItem = res.data;
					if(res.data.province){
						addressSelect.push(res.data.province)
					}
					if(res.data.city){
						addressSelect.push(res.data.city)
					}
					if(res.data.area){
						addressSelect.push(res.data.area)
					}
					if(res.data.street){
						addressSelect.push(res.data.street)
					}
					this.formItem.addressSelect = addressSelect;
					this.$set(this.formItem,'valid_range',(this.formItem.valid_range)/1000)
					that.spinShow = false;
				}).catch(function (res) {
					that.spinShow = false;
					that.$Message.error(res.msg);
				})
			},
			// 选择图片
			modalPicTap () {
				this.modalPic = true;
			},
			// 选中图片
			getPic (pc) {
				this.formItem.image = pc.att_dir;
				this.modalPic = false;
			},
			// 营业时间
			onchangeTime (e) {
				this.formItem.day_time = e;
			},
			// 提交
			handleSubmit (name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						if(this.formItem.day_time[0] == ''){
							this.formItem.day_time = ['00:00:00', '23:59:59']
						}

						if(this.formItem.valid_range == ''||this.formItem.valid_range<0){
							return this.$Message.error($t('page.messages.plsfilteInvildstoreregion'));
						}
						storeUpdateApi(this.formItem).then(async res => {
							this.$Message.success(res.msg);
						}).catch(res => {
							this.$Message.error(res.msg);
						})
					} else {
						this.$Message.error($t(''));
					}
				})
			}
		}
	}
</script>

<style scoped lang="stylus">
	.map-sty {
		width: 90%;
		text-align: right;
		margin: 0 0 0 10%;
	}
	/deep/.ivu-card-body{
		padding 16px 0 0 0!important;
	}
	.footer{
		width 100%;
		height 50px;
		box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
		margin-top 50px;
	}
	/deep/.ivu-btn-primary{
		width 86px;
	}
	.inputW{
		width 400px;
	}
	.ivu-mt{
		min-width 580px;
	}
	.picBox
		display: inline-block;
		cursor: pointer;
		.upLoad
			width: 58px;
			height: 58px;
			line-height: 58px;
			border: 1px dotted rgba(0, 0, 0, 0.1);
			border-radius: 4px;
			background: rgba(0, 0, 0, 0.02);
		.pictrue
			width: 60px;
			height: 60px;
			border: 1px dotted rgba(0, 0, 0, 0.1);
			margin-right: 10px;
			img
				width: 100%;
				height: 100%;
		.iconfont
			color: #898989;
</style>
