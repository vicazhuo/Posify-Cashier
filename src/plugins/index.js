// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
/**
 * 插件
 * */

// 错误捕获
import pluginError from '@/plugins/error';
// 日志插件
import pluginLog from '@/plugins/log';
// 鉴权指令
import directiveAuth from '@/plugins/auth';

export default {
    async install (Vue, options) {
        // 插件
        Vue.use(pluginError);
        Vue.use(pluginLog);

        // 指令
        Vue.directive('auth', directiveAuth);
    }
}
