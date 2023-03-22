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
 * 布局配置
 * */
export default {
	namespaced: true,
	state: {
		splitOrder: 0
	},
	mutations: {
		//是否拆单
		setSplitOrder(state, splitOrder) {
			state.splitOrder = splitOrder;
		}
	},
	actions: {
		
	}
};
