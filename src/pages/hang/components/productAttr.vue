<template>
	<div>
		<Modal v-model="modals" scrollable footer-hide closable title="商品规格" :mask-closable="false" width="600">
			<div class="productAttr">
				<div class="acea-row">
					<div class="pictrue">
						<img :src="attr.productSelect.image" />
					</div>
					<div class='text'>
						<div class="name line1">{{ attr.productSelect.store_name }}</div>
						<div class="info">库存 {{ attr.productSelect.stock }}</div>
						<div class="money">¥<span class="num">{{ attr.productSelect.price }}</span></div>
						<div class="attr">
							<div class="list" v-for="(item, indexw) in attr.productAttr" :key="indexw">
								<div class="title">{{ item.attr_name }}</div>
								<div class="listn acea-row">
									<div class="item acea-row row-center-wrapper"
										:class="item.index === itemn.attr ? 'on' : ''"
										v-for="(itemn, indexn) in item.attr_value" @click="tapAttr(indexw, indexn)"
										:key="indexn">{{ itemn.attr }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<button type="primary" :disabled="disabled" class="bnt acea-row row-center-wrapper" @click="goCat">确定</button>
			</div>
		</Modal>
	</div>
</template>

<script>
	export default {
		name: 'productAttr',
		props: {
			attr: {
				type: Object,
				default: () => {}
			},
			isCart: {
				type: Number,
				value: 0
			},
			disabled: {
				type:Boolean,
				value: false
			}
		},
		data() {
			return {
				modals: false
			}
		},
		created() {
		},
		methods: {
			goCat: function() {
				this.$emit('goCat',this.isCart);
			},
			tapAttr: function(indexw, indexn) {
				let that = this;
				that.$emit("attrVal", {
					indexw: indexw,
					indexn: indexn
				});
				this.$set(this.attr.productAttr[indexw], 'index', this.attr.productAttr[indexw].attr_values[indexn]);
				let value = that
					.getCheckedValue()
					.join(",");
				that.$emit("ChangeAttr", value);
			},
			//获取被选中属性；
			getCheckedValue: function() {
				let productAttr = this.attr.productAttr;
				let value = [];
				for (let i = 0; i < productAttr.length; i++) {
					for (let j = 0; j < productAttr[i].attr_values.length; j++) {
						if (productAttr[i].index === productAttr[i].attr_values[j]) {
							value.push(productAttr[i].attr_values[j]);
						}
					}
				}
				return value;
			}
		}
	}
</script>

<style lang="stylus" scoped>
	::-webkit-scrollbar-thumb {
		-webkit-box-shadow: inset 0 0 6px #eee;
	}

	::-webkit-scrollbar {
		width: 4px !important;
		/*对垂直流动条有效*/
	}

	.productAttr {
		.pictrue {
			width: 180px;
			height: 180px;
			margin-right: 20px;

			img {
				width: 100%;
				height: 100%;
			}
		}

		.bnt {
			width: 550px;
			height: 36px;
			background: #1890FF;
			font-size: 12px;
			color: #fff;
			border-radius: 4px;
			margin: 20px auto 0 auto;
			cursor: pointer;
			border: none;
		}

		.text {
			width: 365px;

			.attr {
				height: 300px;
				overflow-x: hidden;
				overflow-y: scroll;

			}

			.list {
				.title {
					color: rgba(0, 0, 0, 0.85);
					font-size: 14px;
					font-weight: 500;
					margin-top: 14px;
				}

				.listn {
					.item {
						min-width: 158px;
						height: 35px;
						border: 1px solid #EEEEEE;
						margin-top: 10px;
						margin-right: 10px;
						cursor: pointer;
						padding: 0 6px;

						&.on {
							background-color: #1890FF;
							color: #fff;
						}
					}
				}
			}

			.name {
				color: #000;
				font-size: 18px;
				font-weight: 400;
			}

			.info {
				font-size: 13px;
				color: #999999;
				margin: 8px 0 6px 0;
			}

			.money {
				font-size: 14px;
				color: #F5222D;
				border-bottom: 1px solid #eee;
				width: 100%;
				padding-bottom: 13px;
				.num {
					font-size: 21px;
				}
			}
		}
	}
</style>
