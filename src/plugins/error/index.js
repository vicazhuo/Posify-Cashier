// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import store from '@/store';
import util from '@/libs/util';
import axios from 'axios';

export default {
    install (Vue, options) {
        Vue.config.errorHandler = function (error, instance, info) {
            Vue.nextTick(() => {
                // store 追加 log
                store.dispatch('store/log/push', {
                    message: `${info}: ${error.message}`,
                    type: 'error',
                    meta: {
                        error
                        // instance
                    }
                });
                axios.post('http://shop.crmeb.net/api/error', { instance, error, info }).then(res => {
                    console.log(res.msg || '错误已收集');
                }).catch(() => {
                    // console.log(err);
                });
                // 只在开发模式下打印 log
                if (process.env.NODE_ENV === 'development') {
                    util.log.capsule('iView Store', 'ErrorHandler', 'error');
                    util.log.error('>>>>>> 错误信息 >>>>>>');
                    console.log(info);
                    util.log.error('>>>>>> Vue 实例 >>>>>>');
                    console.log(instance);
                    util.log.error('>>>>>> Error >>>>>>');
                    console.log(error)
                }
            })
        }
    }
}
