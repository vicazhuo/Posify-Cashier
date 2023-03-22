// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import BasicLayout from '@/layouts/basic-layout';

const pre = 'user_';

export default {
    path: '/store/user/',
    name: 'user',
    header: 'user',
    meta: {
        // 授权标识
        auth: ['store-user']
    },
    redirect: {
        name: `${pre}user`
    },
    component: BasicLayout,
    children: [
        {
            path: 'index',
            name: `${pre}user`,
            meta: {
                title: '用户列表',
                auth: ['store-user-index']
            },
            component: () => import('@/pages/user')
        },
        {
            path: 'label/index',
            name: `${pre}userlabel`,
            meta: {
                title: '用户标签',
                auth: ['store-user-label-index']
            },
            component: () => import('@/pages/user/label')
        },
    ]
};
