// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import Vue from 'vue';
import VueRouter from 'vue-router';
import iView from 'view-design';

import util from '@/libs/util'

import Setting from '@/setting';

import store from '@/store/index';

// 路由数据
import routes from './routes';

import { includeArray } from '@/libs/system';

Vue.use(VueRouter);

/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

// 导出路由 在 main.js 里使用
const router = new VueRouter({
    routes,
    mode: Setting.routerMode
});

/**
 * 路由拦截
 * 权限验证
 */

router.beforeEach(async (to, from, next) => {
    if(to.fullPath.indexOf('cashier') != -1){
        return next()
    }
    // if (Setting.showProgressBar) iView.LoadingBar.start();
    // // 判断是否需要登录才可以进入
    if (to.matched.some(_ => _.meta.auth)) {
        // 这里依据 token 判断是否登录，可视情况修改
        const db = await store.dispatch('store/db/database', {
            user: true
        });
        const token = util.cookies.get('token');
        if (token && token !== 'undefined') {
            const access = db.get('cashier_unique_auth').value();
						let accessAuth = ''
						if(access==undefined){
							let storage=window.localStorage;
							let value = storage.getItem('cashier_uniqueAuthCashier')
							 accessAuth = JSON.parse(value);
						}else{
							accessAuth = db.get('cashier_unique_auth').value();
						}
            const isPermission = includeArray(to.meta.auth, accessAuth);
            if (isPermission) {
                next();
            } else {
                next({
                    name: '403'
                });
            }
            // next();
        } else {
            store.dispatch('cashier/db/databaseClear', {
                user: true
            });
            // 没有登录的时候跳转到登录界面
            // 携带上登陆成功之后需要跳转的页面完整路径
            next({
                name: 'login',
                query: {
                    redirect: to.fullPath
                }
            });
        }
    } else {
        // 不需要身份校验 直接通过
        next();
    }
   // next();
});

router.afterEach(to => {
    // if (Setting.showProgressBar) iView.LoadingBar.finish();
    // 多页控制 打开新的页面
    store.dispatch('store/page/open', to);


    // 更改标题
    util.title({
        title: to.meta.title
    });
    // 返回页面顶端
    window.scrollTo(0, 0);
});

export default router;
