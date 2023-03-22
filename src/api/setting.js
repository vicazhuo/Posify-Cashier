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
 *门店权限设置-管理员身份列表
 */
export function systemRole() {
    return request({
        url: 'system/role',
        method: 'get'
    });
}
/**
 *门店权限设置-提交管理员身份
 */
export function roleCreatApi(data) {
    return request({
        url: `system/role/${data.id}`,
        method: 'post',
        data
    });
}

/**
 *门店权限设置-添加编辑管理员身份
 */
export function roleInfoApi(id) {
    return request({
        url: `system/role/${id}/edit`,
        method: 'get'
    });
}

/**
 *门店权限设置-菜单列表
 */
export function menuList() {
    return request({
        url: `system/menusList`,
        method: 'get'
    });
}

/**
 *门店权限设置-子菜单列表
 * roleId为角色id，id为菜单id
 */
export function sonMenusList(roleId,id) {
    return request({
        url: `system/sonMenusList/${roleId}/${id}`,
        method: 'get'
    });
}

/**
 *门店权限设置-门店管理员列表
 */
export function systemAdmin(data) {
    return request({
        url: `system/admin`,
        method: 'get',
        params: data
    });
}

/**
 *门店权限设置-门店管理员列表修改状态
 */
export function adminSetStatus(id,status) {
    return request({
        url: `system/admin/set_status/${id}/${status}`,
        method: 'put'
    });
}

/**
 *门店权限设置-添加门店管理员
 */
export function adminCreate() {
    return request({
        url: `system/admin/create`,
        method: 'get'
    });
}

/**
 *门店权限设置-编辑门店管理员
 */
export function adminEdit(id) {
    return request({
        url: `system/admin/${id}/edit`,
        method: 'get'
    });
}

/**
 * @description 门店设置 获取地图key
 */
export function keyApi () {
    return request({
        url: 'config',
        method: 'get'
    });
}

/**
 * @description 门店设置 获取当前登录门店信息
 */
export function storeGetInfoApi () {
    return request({
        url: 'system/store/info',
        method: 'get'
    });
}

/**
 * @description 门店设置 获取当前登录门店信息
 */
export function storeUpdateApi (data) {
    return request({
        url: 'system/store/update',
        method: 'put',
        data
    });
}

/**
 * @description 门店设置 获取省市区街道
 */
export function cityApi (data) {
    return request({
        url: 'city',
        method: 'get',
        params: data
    });
}

/**
 * @description 设置 小票打印、电子面单
 */
export function configEdit (data) {
    return request({
        url: 'system/config/edit_basics',
        method: 'get',
        params: data
    });
}




