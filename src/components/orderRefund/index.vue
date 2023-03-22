<template>
  <div>
    <div>
      <Form :model="formItem" :label-width="80">
        <FormItem label="退款单号">
          <Input v-model="formItem.order_id" size="large" disabled placeholder="" style="width: 100%"></Input>
        </FormItem>
        <FormItem label="退款金额">
          <InputNumber v-model="formItem.refund_price" size="large"  :min="0" placeholder="请输入退款金额" style="width: 100%"></InputNumber>
        </FormItem>
      </Form>
      <div class="footer">
      <Button @click="sub" type="primary" size="large" long>提交</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "orderRefund",
  props:['selectData'],
  data(){
    return{
      formItem:{
        order_id:'',
        refund_price:'',
        type:1
      }
    }
  },
  created() {
    console.log(this.selectData.refund_price)
    this.formItem.order_id = this.selectData.order_id
    this.formItem.refund_price = Number(this.selectData.refund_price) || 0
  },
  methods:{
    sub(){
      this.$emit('refund',this.formItem)
    },
    clear(){
      this.$emit('clear')
    },
  }
}
</script>

<style lang="stylus" scoped>
.footer{
  display: flex;
  justify-content center
  margin-top: 40px;
  .btn{
    padding: 14px 68px;
    font-size: 20px;
    margin: 0 20px;
    border-radius: 6px;
    cursor pointer
  }
  .clear{
    background-color #F5F5F5
    color: #666;
  }
  .sub{
    color: #fff;
    background: #1890FF;
  }
}
</style>