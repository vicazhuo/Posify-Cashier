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
// 用户标签
/**
 *用户标签-标签分类
 */
export function userlabelListInfo() {
    return request({
        url: 'user/user_label_cate',
        method: 'get',
    });
}

/**
 *用户标签-添加标签分类
 */
export function userLabelCreate() {
    return request({
        url: `user/user_label_cate/create`,
        method: 'get'
    });
}

/**
 *用户标签-标签分类编辑
 */
export function userLabelEdit(id) {
    return request({
        url: `user/user_label_cate/${id}/edit`,
        method: 'get'
    });
}

/**
 *用户标签-获取标签列表
 */
export function LabeInfo(data) {
    return request({
        url: `user/user_label`,
        method: 'get',
		params: data
    });
}

/**
 *用户标签-添加标签列表
 */

export function usercreateApi() {
    return request({
        url: `user/user_label/create`,
        method: 'get'
    });
}

/**
 *用户标签-标签列表编辑
 */
export function userEditApi(id) {
    return request({
        url: `user/user_label/${id}/edit`,
        method: 'get'
    });
}


/**
 *用户-用户列表-获取用户列表
 */
export function userListApi(data) {
    return request({
        url: `user/get_list`,
        method: 'get',
		params: data
    });
}
/**
 *用户-当前门店店员列表和店员信息
 */
export function cashierList(data) {
    return request({
        url: `user/cashier_list`,
        method: 'get',
		params: data
    });
}


/**
 *用户-用户列表-获取搜索用户列表
 */
export function usersearchApi(data) {
    return request({
        url: `user/search`,
        method: 'get',
		params: data
    });
}

/**
 * 获取用户标签
 */
export function getUserLabel(uid) {
    return request({
        url: `user/label/${uid}`,
        method: 'get'
    });
}

/**
 * 设置用户标签
 */
export function putUserLabel(uid, data) {
    return request({
        url: `user/label/${uid}`,
        method: 'post',
        data
    });
}


/**
 *用户-用户列表- 详情
 */
export function detailsApi(id) {
    return request({
        url: `user/info/${id}`,
        method: 'get'
    });
}


/**
 *用户-用户列表-详情中tab选项
 */
export function infoApi(data) {
    return request({
        url: `user/record/${data.id}`,
        method: 'get',
        params: data.datas
    });
}


/**
 *用户-用户列表- 获取设置会员标签表单
 */
export function userSetLabelApi(data) {
    return request({
        url: `user/set_label`,
        method: 'post',
        data
    });
}

/**
 *用户-用户列表- 充值列表
 */
export function userRechargelApi() {
    return request({
        url: `store/recharge_info`,
        method: 'get'
    });
}


/**
 *用户-用户列表- 充值会员列表
 */
export function usermemberApi() {
    return request({
        url: `user/member/ship`,
        method: 'get'
    });
}


/**
 *用户-用户列表- 充值保存
 */
export function userSaveApi(data) {
    return request({
        url: `store/recharge`,
        method: 'post',
        data
    });
}


/**
 *用户-用户列表- 充值保存
 */
export function usermeberApi(data) {
    return request({
        url: `/user/member`,
        method: 'post',
        data
    });
}

/**
 *用户-用户列表- 修改店员保存
 */
export function setUserSaveApi(data) {
    return request({
        url: `staff/binding/user`,
        method: 'post',
        data
    });
}

/**
 * @description 个人中心 --- 修改密码
 * data 请求参数
 */
export function updtaeAdmin(data) {
    return request({
        url: `updatePwd`,
        method: 'PUT',
        data
    });
}

/**
 *用户-用户列表- 修改店员保存
 */
export function checkOrderApi(type,data) {
    return request({
        url: `check_order_status/${type}`,
        method: 'post',
        data
    });
}

/**
 *用户-个人中心
 */
export function staffInfoApi() {
    return request({
        url: `user/cashier_info `,
        method: 'get'
    });
}

/**
 *收银台-获取用户详情
 */
export function getUserInfo(uid) {
    return request({
        url: `user/info/${uid}`,
        method: 'get',
    });
}
