// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import request from '@/plugins/request';


/**
 *店员列表-获取列表
 */
export function cashierList() {
    return request({
        url: 'user/cashier_list',
        method: 'get',
    });
}/**
 *店员列表-获取列表
 */
export function staffallInfo() {
    return request({
        url: 'staff/staff/all',
        method: 'get',
    });
}


/**
 *店员列表-获取列表
 */
export function staffListInfo(data) {
    return request({
        url: 'staff/staff',
        method: 'get',
		params: data
    });
}

/**
 *店员列表-添加店员
 */
export function staffcreate() {
    return request({
        url: 'staff/staff/create',
        method: 'get'
    });
}


/**
 * 店员列表-编辑
 */
export function staffEditApi (id) {
    return request({
        url: `staff/staff/${id}/edit`,
        method: 'get'
    });
}

/**
 *  员工列表-删除
 */
export function staffDelApi (id) {
    return request({
        url: `staff/staff/${id}`,
        method: 'DELETE'
    });
}


/**
 * 店员列表-状态
 */
export function staffshowApi (id,status) {
    return request({
        url: `staff/staff/set_show/${id}/${status}`,
        method: 'put'
    });
}

//   配送员列表



/**
 * 配送员列表-获取列表
 */
export function deliveryListInfo(data) {
    return request({
        url: 'staff/delivery',
        method: 'get',
		params: data
    });
}

/**
 *配送员列表-添加店员
 */
export function deliverycreate() {
    return request({
        url: '/staff/delivery/create',
        method: 'get'
    });
}

/**
 * 配送员列表-编辑
 */
export function deliveryEditApi (id) {
    return request({
        url: `/staff/delivery/${id}/edit`,
        method: 'get'
    });
}

/**
 *  配送员列表-删除
 */
export function deliveryDelApi (id) {
    return request({
        url: `/staff/delivery/${id}`,
        method: 'DELETE'
    });
}


/**
 * 店员列表-状态
 */
export function deliveryshowApi (id,status) {
    return request({
        url: `/staff/delivery/set_show/${id}/${status}`,
        method: 'put'
    });
}

/**
 *-详情
 */
export function detailsApi(id) {
    return request({
        url: `staff/staff/${id}`,
        method: 'get'
    });
}

/**
 * @description 会员管理详情中tab选项
 * @param {Number} param id {Number} 用户id
 */
export function infoApi(data) {
    return request({
        url: `staff/info/${data.id}`,
        method: 'get',
        params: data.datas
    });
}



/**
 *-员工-业绩统计
 */
export function staffStatisticsApi(data) {
    return request({
        url: `staff/statistics`,
        method: 'get',
		params: data
    });
}

/**
 *-员工-业绩统计-柱行/饼状图
 */
export function staffStatisticsHeaderApi(data) {
    return request({
        url: `staff/statisticsHeader`,
        method: 'get',
		params: data
    });
}


/**
 *-员工-账单统计图
 */
export function staffDeliveryStatisticsHeaderApi(data) {
    return request({
        url: `staff/delivery/statisticsHeader`,
        method: 'get',
		params: data
    });
}



/**
 *-员工-账单统计-选择配送员
 */
export function staffDeliveryselectApi() {
    return request({
        url: `staff/delivery/get_delivery_select`,
        method: 'get'
    });
}

/**
 *-员工-账单统计-选择配送员
 */
export function deliveryStatisticsApi(data) {
    return request({
        url: `staff/delivery/statistics`,
        method: 'get',
		params: data
    });
}



/**
 *-员工-配送员详情
 */
export function deliveryInfoApi(id,data) {
    return request({
        url: `staff/delivery/info/${id}`,
        method: 'get',
		params:  data
    });
}
