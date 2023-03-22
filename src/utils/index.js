// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import Vue from 'vue'
export default new Vue

export function importAll (r) {
    let __modules = {}
    r.keys().forEach(key => {
        let m = r(key).default
        let n = m.name;
        __modules[n] = m
    });
    return __modules
}


export function loadJs(src) {
    return new Promise((resolve,reject)=>{
        let script = document.createElement('script');
        script.type = "text/javascript";
        script.src= src;
        document.body.appendChild(script);

        script.onload = ()=>{
            resolve();
        }
        script.onerror = ()=>{
            reject();
        }
    })
}