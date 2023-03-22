<template>
    <span class="i-layout-header-trigger i-layout-header-trigger-min">
        <Dropdown :trigger="isMobile ? 'hover' : 'hover'" class="i-layout-header-user"
                  :class="{ 'i-layout-header-user-mobile': isMobile }" @on-click="handleClick">
            <Avatar size="small" :src="infor.avatar" v-if="infor.avatar"/>
						<Avatar size="small" :src="headPic" v-else/>
            <span class="i-layout-header-user-name">{{ infor.account }}</span>
            <DropdownMenu slot="list">
                <i-link to="/cashier/system/user">
                    <DropdownItem>
                        <Icon type="ios-contact-outline"/>
                        <span>{{ $t('basicLayout.user.center') }}</span>
                    </DropdownItem>
                </i-link>
              <!--<i-link to="/setting/account">-->
              <!--<DropdownItem>-->
              <!--<Icon type="ios-settings-outline" />-->
              <!--<span>{{ $t('basicLayout.user.setting') }}</span>-->
              <!--</DropdownItem>-->
              <!--</i-link>-->
                <DropdownItem divided name="logout">
                    <Icon type="ios-log-out"/>
                    <span>{{ $t('basicLayout.user.logOut') }}</span>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
      <!--        <span class="storeBnt" @click="storeTap">切换店员</span>-->
    </span>
</template>
<script>
import Utils from '@/utils/index';
import {mapState, mapActions} from 'vuex';

export default {
  name: 'iHeaderUser',
  data() {
    return {
      headPic: require('@/assets/images/yonghu.png'),
      infor: ''
    }
  },
  computed: {
    ...mapState('store/user', [
      'info'
    ]),
    ...mapState('store/layout', [
      'isMobile',
      'logoutConfirm'
    ])
  },
  methods: {
    ...mapActions('store/account', [
      'logout'
    ]),
    handleClick(name) {
      if (name === 'logout') {
        this.logout({
          confirm: this.logoutConfirm,
          vm: this
        });
      }
    },
    storeTap() {
      Utils.$emit('demo', 'msg');
    },
  },
  async mounted() {
    let storage = window.localStorage;
    let value = storage.getItem('cashier_user_info')
    this.infor = JSON.parse(value);
    //       const db = await this.$store.dispatch('store/db/database', {
    //           user: true
    //       });
    //       this.inforrr = db.get('user_info').value();
    // console.log('kkkkk',this.inforrr);
  }
}
</script>
<style scoped lang="stylus">
.storeBnt {
  padding: 9px 12px;
  background: #FFFFFF;
  border-radius: 4px;
  color: #222222;
  font-size: 14px;
  text-align: center;
  line-height: 32px;
  margin-left: 10px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }
}

.i-layout-header-user-name {
  font-size 16px
}
</style>
