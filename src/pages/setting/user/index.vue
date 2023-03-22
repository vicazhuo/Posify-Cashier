<template>
  <div>
    <div class="">
      <PageHeader
        class="product_tabs"
        :title="$route.meta.title"
        hidden-breadcrumb
      >
        <div slot="title">
          <div style="float: left">
            <router-link :to="{ path: '/cashier/cashier/index' }">
              <Button icon="ios-arrow-back" size="small" class="mr20"
                >{{$t("page.common.back")}}
              </Button>
            </router-link>
            <span v-text="$route.meta.title" class="mr20"></span>
          </div>
        </div>
      </PageHeader>
    </div>
    <Card :bordered="false" dis-hover class="ivu-mt">
      <div class="box">
        <Form
          ref="formValidate"
          :model="formValidate"
          :rules="ruleValidate"
          :label-width="120"
          label-position="right"
        >
          <FormItem :label="$t('page.from.headImages')：" prop="avatar">
            <div class="picBox">
              <Upload
                :action="uploadUrl"
                :headers="header"
                :show-upload-list="false"
                :on-success="handleSuccess"
              >
                <div class="pictrue" v-if="formValidate.avatar">
                  <img v-lazy="formValidate.avatar" />
                </div>
                <div class="upLoad acea-row row-center-wrapper" v-else>
                  <Icon type="ios-camera-outline" size="26" />
                </div>
              </Upload>
            </div>
          </FormItem>
          <FormItem :label="$t('page.from.account')：" prop="">
            <Input
              type="text"
              v-model="account"
              :disabled="true"
              class="input"
            ></Input>
          </FormItem>
          <FormItem :label="$t('page.form.name')" prop="real_name">name:"姓名",headImages:"头像",account:"账号"
            <Input
              type="text"
              v-model="formValidate.real_name"
              class="input"
            ></Input>
          </FormItem>
          <FormItem label="$t('page.form.oldPassword')" prop="pwd">
            <Input
              type="password"
              v-model="formValidate.pwd"
              class="input"
            ></Input>
          </FormItem>
          <FormItem :label="$t('page.form.newPassword')" prop="new_pwd">
            <Input
              type="password"
              v-model="formValidate.new_pwd"
              class="input"
            ></Input>
          </FormItem>
          <FormItem :label="$t('page.form.confirmPassword')" prop="conf_pwd">
            <Input
              type="password"
              v-model="formValidate.conf_pwd"
              class="input"
            ></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')"
              >{{$t('page.form.save')}}</Button
            >
          </FormItem>
        </Form>
      </div>
    </Card>
    <Modal
      v-model="modalPic"
      width="950px"
      scrollable
      footer-hide
      closable
      title="上传用户头像"
      :mask-closable="false"
      :z-index="1"
    >
      <uploadPictures
        :isChoice="isChoice"
        @getPic="getPic"
        :gridBtn="gridBtn"
        :gridPic="gridPic"
        v-if="modalPic"
      ></uploadPictures>
    </Modal>
  </div>
</template>

<script>
import { updtaeAdmin, staffInfoApi } from "@/api/user";
import { mapState } from "vuex";
import uploadPictures from "@/components/uploadPictures";
import Setting from "@/setting";
import util from "@/libs/util";

export default {
  name: "setting_user",
  components: { uploadPictures },
  computed: {
    ...mapState("store/layout", ["isMobile"]),
    ...mapState("store/userLevel", ["categoryId"]),
    labelWidth() {
      return this.isMobile ? undefined : 75;
    },
    labelPosition() {
      return this.isMobile ? "top" : "left";
    },
  },
  data() {
    return {
      uploadUrl: Setting.apiBaseURL + "/upload/image",
      modalPic: false,
      isChoice: $t('page.form.singleSelection'),
      account: "",
      formValidate: {
        real_name: "",
        pwd: "",
        new_pwd: "",
        conf_pwd: "",
        avatar: "",
      },
      ruleValidate: {
        real_name: [
          { required: true, message: $t('page.form.singleSelection'), trigger: "blur" },
        ],
        pwd: [
          { required: true, message: $t('page.form.singleSelection'), trigger: "blur" },
        ],
        new_pwd: [
          { required: true, message: $t('page.form.singleSelection'), trigger: "blur" },
        ],
        conf_pwd: [
          { required: true, message: $t('page.form.singleSelection'), trigger: "blur" },
        ],
      },
      gridPic: {
        xl: 6,
        lg: 8,
        md: 12,
        sm: 12,
        xs: 12,
      },
      gridBtn: {
        xl: 4,
        lg: 8,
        md: 8,
        sm: 8,
        xs: 8,
      },
      header: {},
    };
  },
  mounted() {
    // const db = await this.$store.dispatch('store/db/database', {
    //     user: true
    // });
    // this.account = db.get('user_info').value().account;
    this.getInfo();
    this.getToken();
  },
  methods: {
    // 上传头部token
    getToken() {
      this.header["Authori-zation"] = "Bearer " + util.cookies.get("token");
    },
    // 选择图片
    modalPicTap() {
      this.modalPic = true;
    },
    // 选中图片
    getPic(pc) {
      this.formValidate.avatar = pc.att_dir;
      this.modalPic = false;
    },
    // 上传成功
    handleSuccess(res, file, fileList) {
      if (res.status === 200) {
        let data = {
          avatar: res.data.url,
        };
        updtaeAdmin(data)
          .then((res) => {
            this.$Message.success(res.msg);
            this.formValidate.avatar = data.avatar;
            this.$store.dispatch("cashier/user/set", {
              avatar: data.avatar,
            });
            let storage = window.localStorage;
            let value = storage.getItem("cashier_user_info");
            let infor = JSON.parse(value);
            infor.avatar = data.avatar;
            storage.setItem("cashier_user_info", JSON.stringify(infor));
          })
          .catch((res) => {
            this.$Message.error(res.msg);
          });
      } else {
        this.$Message.error(res.msg);
      }
    },
    getInfo() {
      staffInfoApi()
        .then((res) => {
          let data = res.data;
          this.account = data.account;
          this.formValidate.avatar = data.avatar;
          this.formValidate.real_name = data.staff_name;
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    handleSubmit(name) {
      updtaeAdmin(this.formValidate)
        .then((res) => {
          this.$Message.success(res.msg);
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
  },
};
</script>

<style scoped lang="stylus">
.box {
  max-width: 700px;
  margin: 0 auto;
  margin-top: 40px;
}

.input {
  width: 90%;
}

.picBox {
  display: inline-block;
  cursor: pointer;

  .upLoad {
    width: 58px;
    height: 58px;
    line-height: 58px;
    border: 1px dotted rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.02);
  }

  .pictrue {
    width: 60px;
    height: 60px;
    border: 1px dotted rgba(0, 0, 0, 0.1);
    margin-right: 10px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .iconfont {
    color: #898989;
  }
}
</style>
