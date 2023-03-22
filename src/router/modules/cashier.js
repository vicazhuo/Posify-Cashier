import BasicLayout from '@/layouts/basic-layout';
const meta = {
    auth: true
};
const pre = 'home_';

export default {
    path: '/cashier/',
    name: 'home',
    header: 'home',
    redirect: {
        name: `${pre}index`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'cashier/index',
            name: `${pre}index`,
            meta: {
                auth: ['cashier-cashier-index'],
                title: '收银'
            },
            component: () => import('@/pages/cashier/index')
        },
        {
            path: 'hang/index',
            name: `${pre}hang`,
            meta: {
                auth: ['cashier-hang-index'],
                title: '挂单'
            },
            component: () => import('@/pages/hang/index')
        },
        {
            path: 'order/index',
            name: `${pre}order`,
            meta: {
                auth: ['cashier-order-index'],
                title: '订单'
            },
            component: () => import('@/pages/order/index')
        },
        {
            path: 'verify/index',
            name: `${pre}verify`,
            meta: {
                auth: ['cashier-verify-index'],
                title: '核销'
            },
            component: () => import('@/pages/verify/index')
        },
        {
            path: 'refund/index',
            name: `${pre}refund`,
            meta: {
                auth: ['cashier-refund-index'],
                title: '退款'
            },
            component: () => import('@/pages/refund/index')
        },
        {
            path: 'recharge/index',
            name: `${pre}recharge`,
            meta: {
                auth: ['cashier-recharge-index'],
                title: '充值'
            },
            component: () => import('@/pages/recharge/index')
        }

    ]
};
