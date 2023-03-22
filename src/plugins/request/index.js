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
import axios from 'axios';
import util from '@/libs/util';
import Setting from '@/setting';
import { Message, Notice, LoadingBar } from 'view-design';

// 创建一个错误
// function errorCreate (msg) {
//     const err = new Error(msg);
//     errorLog(err);
//     throw err;
// }

// 记录和显示错误
function errorLog(err) {
    // 添加到日志
    store.dispatch('store/log/push', {
        message: '数据请求异常',
        type: 'error',
        meta: {
            error: err
        }
    });
    // 打印到控制台
    if (process.env.NODE_ENV === 'development') {
        util.log.error('>>>>>> Error >>>>>>');
    }
    // 显示提示，可配置使用 iView 的 $Message 还是 $Notice 组件来显示
    if (Setting.errorModalType === 'Message') {
        Message.error({
            content: err.message,
            duration: Setting.modalDuration
        });
    } else if (Setting.errorModalType === 'Notice') {
        Notice.error({
            title: '提示',
            desc: err.message,
            duration: Setting.modalDuration
        });
    }
}

// 创建一个 axios 实例
const service = axios.create({
    baseURL: Setting.apiBaseURL,
    timeout: 10000 // 请求超时时间
});

axios.defaults.withCredentials = true;// 携带cookie

// 网络加载
// function startLoading () {
//     LoadingBar.start();
// }
//
// function endLoading () {
//     LoadingBar.finish();
// }

// 那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
// 声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
// 调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        // startLoading()
    }
    needLoadingRequestCount++
}
export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        // endLoading()
    }
}

// 请求拦截器
service.interceptors.request.use(
    async config => {
        if (config.kefu) {
            let baseUrl = Setting.apiBaseURL.replace(/cashierapi/, "kefuapi")
            config.baseURL = baseUrl
        } else {
            config.baseURL = Setting.apiBaseURL
        }
        const token = util.cookies.get('token');
        const kefuToken = util.cookies.kefuGet('token');
        if (token || kefuToken) {

            config.headers['Authori-zation'] = config.kefu ? 'Bearer ' + kefuToken : 'Bearer ' + token;
        }
        // 开启loading
        showFullScreenLoading();
        return config;
    },
    error => {
        // 发送失败
        Promise.reject(error);
    }
);
// 响应拦截器
service.interceptors.response.use(
    response => {
        // 获取服务器类型
        if (!sessionStorage.getItem("SERVER_TYPE")) {
            sessionStorage.setItem("SERVER_TYPE", response.headers['server']);
        }
        // 关闭loading
        tryHideFullScreenLoading();
        const code = response.data.status;
        switch (code) {
            case 200:
                // [ 示例 ] code === 0 代表没有错误
                return response.data;
            case 400: case 400011: case 400012:
                return Promise.reject(response.data || { msg: '未知错误' });
            // [ 示例 ] 其它和后台约定的 code
            // errorCreate(response.data.msg);
            // break;
            case 410000:
            case 410001:
            case 410002:
                window.router.replace('/cashier/login');
								localStorage.clear();
								sessionStorage.clear()
								util.cookies.remove('token')
								util.cookies.remove('expires_time')
								util.cookies.remove('uuid')
								// 删除localStorage
								store.dispatch('cashier/db/databaseClear', {
								    user: true
								});
								// 清空 vuex 用户信息
								dispatch('cashier/user/set', {}, { root: true });
                break;
            case 410003:
                window.router.replace('/kefu');
                break;
            default:
                // 不是正确的 code
                // errorCreate(`${dataAxios.msg}: ${response.config.url}`);
                break;
        }
    },
    error => {
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = '请求错误';
                    break;
                case 401:
                    error.message = '未授权，请登录';
                    break;
                case 403:
                    error.message = '拒绝访问';
                    break;
                case 404:
                    error.message = `请求地址出错: ${error.response.config.url}`;
                    break;
                case 408:
                    error.message = '请求超时';
                    break;
                case 500:
                    error.message = '服务器内部错误';
                    break;
                case 501:
                    error.message = '服务未实现';
                    break;
                case 502:
                    error.message = '网关错误';
                    break;
                case 503:
                    error.message = '服务不可用';
                    break;
                case 504:
                    error.message = '网关超时';
                    break;
                case 505:
                    error.message = 'HTTP版本不受支持';
                    break;
                default:
                    break;
            }
        }
        errorLog(error);
        // return Promise.reject(error);
    }
);

export default service;
