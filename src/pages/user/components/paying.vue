<template>
    <div style="width: 100%">
        <Modal v-model="modals" scrollable footer-hide closable title="用户充值" :mask-closable="false" width="583" @on-cancel="cancel">
            <div slot="header" class="header">
				<div class="header_tab left" :class="tabs==1?'on':''" @click="tab(1)">充值会员</div>
			</div>
			<div class="content" v-if="tabs == 1">
				<div v-for="(item,index) in data" class="content_box" :class="contTabs == index?'content_tab':''" @click="contTab(item,index)">
					<div class="top">¥{{item.pre_price}}</div>
					<div class="bottom">{{item.title}}原价：¥ {{item.price}}</div>
				</div>
			</div>
			<Button class="footer" type="primary" v-preventReClick @click="save" >确定</Button>
        </Modal>
		<Modal v-model="qr" scrollable footer-hide closable title="付款码详情" :mask-closable="false" width="400" @on-cancel="cancel">
			<div class="qrbox">
				<div class="qrcode" ref="qrCodeUrl"></div>
				<div v-if="!qrtip">微信扫码充值，将于 {{$moment(codeKey.invalid * 1000).format('YYYY-MM-DD H:mm:ss')}} 过期</div>
				<div v-if="qrtip" class="tips">若已充值，联系客服</div>
				<div class="qrtips" v-if="qrtip">已失效，请重新刷新</div>
			</div>
		</Modal>
    </div>
</template>

<script>
    import { usermemberApi, usermeberApi,checkOrderApi } from '@/api/user';
    import QRCode from 'qrcodejs2'
    export default {
        name: 'userDetails',
        data () {
            return {
				codeKey: '',
				value: '',
                modals: false,
				tabs: 1, //顶部切换
				contTabs: 0, //选择金额
				data: '', //金额的数据
				tabdata: '',
				id: '',
				qr: false,
				timeNum:0,
				qrtip : false,
            }
        },
        mounted () {
			
        },
        methods: {
			// 生成二维码
			creatQrCode() {
			    let url= this.codeKey.code_url;
			    var qrcode = new QRCode(this.$refs.qrCodeUrl, {
			        text: url, // 需要转换为二维码的内容
			        width: 160,
			        height: 160,
			        colorDark: '#000000',
			        colorLight: '#ffffff',
			        correctLevel: QRCode.CorrectLevel.H
			    })
			},
			tab(type){
				this.tabs = type
			},
			contTab(data,type){
				this.contTabs = type
				this.tabdata = data
			},
			getList(id){
				usermemberApi().then(res=>{
					this.data = res.data
					this.id = id
					this.contTab(this.data[0],0)
				})
			},
			save(){
				let that = this
				let money = {
					uid: this.id,
					member_id: this.tabdata.id,
				}
				usermeberApi(money).then(res=>{
					if(res.msg == "领取成功"){
						this.$Message.success(res.msg);
						this.$parent.getList()
						this.modals = false
					}else{
						this.modals = false
						this.codeKey = res.data.result.jsConfig
						this.qr = true
						this.creatQrCode()
						this.scanTime = setInterval(()=>{
						    this.timeNum++
						    if(this.timeNum>=60){
						        this.timeNum = 0
						        window.clearInterval(this.scanTime)
								let time = Date.parse(new Date())/1000
								if(time>=this.codeKey.invalid){
									that.qrtip = true
								}
						    }else{
						        this.getScanStatus(res.data.result.order_id)
						    }
						},1000)
						this.tabs = 1
						this.value = ''
					}
				}).catch(err=>{
					this.timeNum = 0
					window.clearInterval(this.scanTime)
					this.$Message.error(err.msg);
				})
			},
			// 扫码登录情况
			getScanStatus(id){
				checkOrderApi(2,{order_id:id,end_time:this.codeKey.invalid}).then(res=>{
					if(res.data.status){
						this.$parent.getList()
						this.timeNum = 0
						window.clearInterval(this.scanTime)
						this.qr = false
						this.qrtip = false
						this.$Message.success("充值成功");
						this.$refs.qrCodeUrl.innerHTML = '';
					}
				})
			},
			cancel(){
				// this.$Message.info("已取消");
				this.tabs = 1
				this.qr = false
				this.qrtip = false
				this.$refs.qrCodeUrl.innerHTML = '';
				this.timeNum = 0
				window.clearInterval(this.scanTime)
			}
		},
		beforeDestroy: function () {
		    this.timeNum = 0
		    this.$refs.qrCodeUrl.innerHTML = ''
		    window.clearInterval(this.scanTime)
		    // window.removeEventListener('resize', this.handleResize);
		    // document.getElementsByTagName('canvas')[0].removeAttribute('class', 'index_bg');
		}
    }
</script>

<style lang="less" scoped>
	/deep/.ivu-modal-header{padding-bottom: 0px;}
	/deep/.ivu-modal-body{padding-top: 23px;}
	/deep/.ivu-input{height: 56px;font-size: 30px !important;}
	
	/deep/.contents input::-webkit-outer-spin-button,
	/deep/.contents input::-webkit-inner-spin-button {
	    -webkit-appearance: none;
	}
	/deep/.contents input[type="number"] {
	    -moz-appearance: textfield;
	}
	.header{
		display: flex;
		justify-content: left;
		.header_tab{
			font-size: 14px;
			font-weight: 500;
			cursor: pointer;
			height: 28px;
			min-width: 56px;
			text-align: center;
		}
		.left{margin-right: 34px;}
		.on{
			color: #0091FF;
			border-bottom: 2px solid #0091FF;
		}
	}
	.content{
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		.content_box{
			cursor: pointer;
			width: 165px;
			height: 90px;
			background: #FFFFFF;
			border-radius: 3px;
			border: 1px solid #DADFE6;
			margin-bottom: 20PX;
			text-align: center;
			color: #0091FF;
			margin-right: 9px;
			margin-left: 9px;
			.top{
				font-size: 30px;
				font-weight: 500;
				margin-top: 10px;
			}
			.bottom{
				font-size: 12px;
				font-weight: 400;
				color: #000000
			}
			
		}
		.content_tab{
			background: #0091FF;
			box-shadow: 0px 6px 30px 0px rgba(0, 145, 255, 0.2);
			border-radius: 3px;
			color: #FFFFFF;
			.bottom{
				color: #FFFFFF;
			}
		}
	}
	.contents{
		.title{
			font-size: 13px;
			font-weight: 400;
			color: #999999 !important;
			margin-top: 15px;
		}
	}
	.footer{
		display: block;
		width: 535px;
		height: 36px;
		background: #1890FF;
		margin: 0 auto;
		font-weight: 400;
		color: #FFFFFF;
		font-size: 12px;
		text-align: center;
		line-height: 36px;
		margin-top: 47px;
		border-radius: 4px;
		cursor: pointer;
	}
	.qrbox{
		text-align: center;
		position: relative;
		.qrcode{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 180px;
			height: 180px;
			border: 1px solid #E5E5E6;
			margin: 0 auto;
			margin-bottom: 17px;
		}
		.qrtips{
			position: absolute;
			width: 180px;
			height: 50px;
			padding: 10px 20px;
			background-color: red;
			color: #FFFFFF;
			text-align: center;
			line-height: 30px;
			left: 94px;
			top: 65px;
			
		}
		.tips{
			color: red
		}
	}
	
	    
	
</style>
