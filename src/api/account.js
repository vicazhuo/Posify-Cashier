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

/*
 * 登录
 * */
export function AccountLogin(data) {
    return request({
        url: '/login',
        method: 'post',
        data
    });
}

/**
 * 退出登陆
 * @constructor
 */
export function AccountLogout() {
    return request({
        url: '/logout',
        method: 'get'
    });
}

/**
 * 获取轮播图和logo
 */
export function loginInfoApi() {
    return request({
        url: '/login/info',
        method: 'get'
    });
}

/**
 * 获取菜单数据
 */
export function menusApi() {
    return request({
        url: '/menus',
        method: 'get'
    });
}

/**
 * 搜索菜单数据
 */
export function menusListApi() {
    return request({
        url: '/menusList',
        method: 'get'
    });
}

export function getSysInfo() {
    return request({
        url: '/logo',
        method: 'get'
    });
}
// 微信登录
export function getWechatScan() {
    return request({
        url: '/wechat_scan_login',
        method: 'get'
    });
}
// 企业微信登录配置信息
export function getWorkChatConfig() {
    return request({
        url: '/work/config',
        method: 'get'
    });
}
// 轮询登录回调
export function checkScanLogin(data) {
    return request({
        url: '/check_scan_login',
        method: 'post',
        data
    });
}

// 企业微信登录回调
export function workScanLogin(data) {
    return request({
        url: '/work_scan_login',
        method: 'get',
        params: data
    });
}

export function AccountRegister() {

}
