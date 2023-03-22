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
import screenfull from 'screenfull';

import Setting from '@/setting';

export default {
    namespaced: true,
    state: {
        ...Setting.layout,
        isMobile: false, // 是否为手机
        isTablet: false, // 是否为平板
        isDesktop: true, // 是否为桌面
        isFullscreen: false,// 是否切换到了全屏
        isChildren: false,
    },
    mutations: {
        //导航是否有子级
        setChildren (state, val){
            state.isChildren = val
        },
        /**
         * @description 设置设备类型
         * @param {Object} state vuex state
         * @param {String} type 设备类型，可选值为 Mobile、Tablet、Desktop
         */
        setDevice (state, type) {
            state.isMobile = false;
            state.isTablet = false;
            state.isDesktop = false;
            state[`is${type}`] = true;
        },
        /**
         * @description 修改 menuCollapse
         * @param {Object} state vuex state
         * @param {Boolean} collapse 折叠状态
         * */
        updateMenuCollapse (state, collapse) {
            state.menuCollapse = false;
        },
        /**
         * @description 设置全屏状态
         * @param {Object} state vuex state
         * @param {Boolean} isFullscreen vuex
         * */
        setFullscreen (state, isFullscreen) {
            state.isFullscreen = isFullscreen;
        },
        /**
         * @description 更改指定布局配置
         * @param {Object} state vuex state
         * @param {Object} key layout 名称，对应 Setting.layout
         * @param {Object} value layout 值
         * */
        updateLayoutSetting (state, { key, value }) {
            state[key] = value;
        }
    },
    actions: {
        /**
         * @description 初始化监听全屏状态
         */
        listenFullscreen ({ commit }) {
            return new Promise(resolve => {
                if (screenfull.enabled) {
                    screenfull.on('change', () => {
                        if (!screenfull.isFullscreen) {
                            commit('setFullscreen', false)
                        }
                    })
                }
                // end
                resolve();
            });
        },
        /**
         * @description 切换全屏
         */
        toggleFullscreen ({ commit }) {
            return new Promise(resolve => {
                if (screenfull.isFullscreen) {
                    screenfull.exit();
                    commit('setFullscreen', false);
                } else {
                    screenfull.request();
                    commit('setFullscreen', true);
                }
                // end
                resolve();
            });
        }
    }
};
