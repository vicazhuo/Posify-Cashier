<template>
	<div>
		<Card :bordered="false" dis-hover class="cardCon">
			<Tabs v-model="currentTab" @on-click="onClickTab">
				<TabPane :label="$t('page.common.invoicePrint')" name="store_printing_deploy" />
				<TabPane :label="$t('page.common.onlineInvoice')" name="store_electronic_sheet" />
			</Tabs>
		</Card>
		<Card :bordered="false" dis-hover class="cardCon">
			<form-create :option="option" :rule="rules" @on-submit="onSubmit"></form-create>
			<Spin size="large" fix v-if="spinShow"></Spin>
		</Card>
	</div>
</template>

<script>
	import {
		configEdit
	} from '@/api/setting';
	import request from '@/plugins/request';
	export default {
		name: 'index',
		data() {
			return {
				spinShow: false,
				currentTab: 'store_printing_deploy',
				rules: [],
				option: {
					form: {
						labelWidth: 185
					},
					submitBtn: {
						col: {
							span: 3,
							push: 3
						}
					},
					global: {
						upload: {
							props: {
								onSuccess(res, file) {
									if (res.status === 200) {
										file.url = res.data.src;
									} else {
										this.$Message.error(res.msg);
									}
								}
							}
						},
						frame: {
							props: {
								closeBtn: false,
								okBtn: false
							}
						}
					}
				},
			}
		},
		mounted() {
			this.getInfo();
		},
		methods: {
			onClickTab() {
				this.getInfo();
			},
			getInfo() {
				this.spinShow = true;
				let data = {
					name: this.currentTab
				}
				configEdit(data).then(res => {
					if (res.data.status === false) {
						return this.$authLapse(res.data);
					}
					this.rules = res.data.rules;
					this.spinShow = false;
				}).catch(err => {
					this.spinShow = false;
					this.$Message.error(err.msg)
				})
			},
			// 提交表单
			onSubmit(formData) {
				request({
					url: `system/config/${this.currentTab}`,
					method: 'post',
					data: formData
				}).then(res => {
					this.$Message.success(res.msg);
				}).catch(res => {
					this.$Message.error(res.msg);
				});
			}
		}
	}
</script>

<style>
</style>
