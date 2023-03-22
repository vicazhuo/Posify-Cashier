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

export default {
    install (Vue, options) {
        // 快速打印 log
        Vue.prototype.$log = {
            ...util.log,
            push (data) {
                if (typeof data === 'string') {
                    // 如果传递来的数据是字符串
                    // 赋值给 message 字段
                    // 为了方便使用
                    // eg: this.$log.push('foo text')
                    store.dispatch('store/log/push', {
                        message: data
                    });
                } else if (typeof data === 'object') {
                    // 如果传递来的数据是对象
                    store.dispatch('store/log/push', data);
                }
            }
        }
    }
}
