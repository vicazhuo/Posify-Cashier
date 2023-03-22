<template>
  <Modal
      v-model="modals"
      scrollable
      title="订单备注"
      class="order_box"
       class-name="vertical-center-modal"
      footer-hide
  >
    <Input
        v-model="formValidate.remark"
        maxlength="200"
        show-word-limit
        :rows="5"
        type="textarea"
        placeholder="订单备注"
        style="width: 100%"
    />
    <Button class="mt20" type="primary" size="large" long @click="putRemark('formValidate')">提交</Button>
  </Modal>
</template>

<script>
import {
  putRemarkData,
  rechargeRemark,
  vipRemark,
  postVipRemark,
  postRechargeRemark,
  putRefundRemarkData,
} from "@api/order";

export default {
  name: "orderMark",
  data() {
    return {
      formValidate: {
        remark: "",
      },
      modals: false,
      ruleValidate: {
        remark: [
          {
            required: true,
            message: "请输入备注信息",
            trigger: "blur",
          },
        ],
      },
    };
  },
  props: {
    orderId: Number,
    currentTab: {
      type: String,
      default: "",
    },
    remarkType: {
      default: "",
      type: String,
    },
  },
  created() {
  },
  methods: {
    cancel(name) {
      this.modals = false;
    },
    refundmark(remark) {
      this.formValidate.remark = remark;
    },
    // 获取充值订单备注
    getRemark(orderId) {
      rechargeRemark(orderId)
          .then((res) => {
            this.formValidate.remark = res.data.remarks;
          })
          .catch((err) => {
            this.$Message.error(err.msg);
          });
    },
    // 获取会员订单备注
    getVipRemark(orderId) {
      vipRemark(orderId)
          .then((res) => {
            this.formValidate.remark = res.data.remarks;
          })
          .catch((err) => {
            this.$Message.error(err.msg);
          });
    },
    putRemark(name) {
      let data = {
        id: this.orderId,
        remark: this.formValidate,
      };
      if (this.formValidate.remark.trim()) {
        let header = null;
        if (this.remarkType) {
          header = putRefundRemarkData(data);
        } else if (this.currentTab == 3) {
          header = postRechargeRemark(data.id, {
            remarks: this.formValidate.remark,
          });
        } else if (this.currentTab == 4) {
          header = postVipRemark(data.id, {
            remarks: this.formValidate.remark,
          });
        } else {
          header = putRemarkData(data);
        }
        header
            .then(async (res) => {
              this.$Message.success(res.msg);
              this.modals = false;
              this.$emit("submitFail");
            })
            .catch((res) => {
              this.$Message.error(res.msg);
            });
      } else {
        this.$Message.warning("请填写备注信息");
      }
    },
  },
};
</script>

<style scoped>
</style>
