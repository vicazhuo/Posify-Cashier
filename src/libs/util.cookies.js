// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import Cookies from 'js-cookie';
import Setting from '@/setting';

const cookies = {};

/**
 * @description 存储 cookie 值
 * @param {String} name cookie name
 * @param {String} value cookie value
 * @param {Object} cookieSetting cookie setting
 */
cookies.set = function (name = 'default', value = '', cookieSetting = {}) {
    let currentCookieSetting = {
        expires: Setting.cookiesExpires
    };
    Object.assign(currentCookieSetting, cookieSetting);
    Cookies.set(`cashier_${name}`, value, currentCookieSetting);
};

/**
 * @description 客服存储 cookie 值
 * @param {String} name cookie name
 * @param {String} value cookie value
 * @param {Object} cookieSetting cookie setting
 */
cookies.setKefu = function (name = 'default', value = '', cookieSetting = {}) {
    let currentCookieSetting = {
        expires: Setting.cookiesExpires
    };
    Object.assign(currentCookieSetting, cookieSetting);
    Cookies.set(`kefu-${name}`, value, currentCookieSetting);
};



/**
 * @description 拿到 cookie 值
 * @param {String} name cookie name
 */
cookies.get = function (name = 'default') {
    return Cookies.get(`cashier_${name}`);
};

/**
 * @description 拿到客服 cookie 值
 * @param {String} name cookie name
 */
cookies.kefuGet = function (name = 'default') {
    return Cookies.get(`kefu-${name}`);
};

/**
 * @description 拿到 cookie 全部的值
 */
cookies.getAll = function () {
    return Cookies.get();
};

/**
 * @description 删除 cookie
 * @param {String} name cookie name
 */
cookies.remove = function (name = 'default') {
    return Cookies.remove(`cashier_${name}`);
};


/**
 * @description 删除客服 cookie
 * @param {String} name cookie name
 */
cookies.kefuRemove = function (name = 'default') {
    return Cookies.remove(`kefu-${name}`);
};

export default cookies;
