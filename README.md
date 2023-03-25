# Posify Cashier

## 开发规范
统一使用ES6 语法
方法注释
/*
* th => 表头
* data => 数据
* fileName => 文件名
* fileType => 文件类型
* sheetName => sheet页名
*/
export default function toExcel ({ th, data, fileName, fileType, sheetName }) 
行注释 //

### 命名

页面目录 文件夹命名格式骆驼式命名法,例如：用户列表 userList 
例如：商品模块
product 商品
    ├─ product 商品管理
        ├─productList 商品管理目录
            ├- index.vue  首页
        ├─ components  组建
            ├─ tableFrom.vue
            ├─ tableList.vue
        ├─ handle 操作功能页面目录
            ├─ delete.vue
    ├─productCategory 商品分类目录
        ├─ index.vue 商品分类首页

页面命名、组建、文件夹 命名格式小驼峰命名法,例如：用户列表 userList

类名函数命名 大驼峰式 例如：addUser
变量命名 小驼峰式 例如：user 或者 userInfo _userinfo user-info
常量 采用全大些下划线命名 例如：VUE_APP_API_URl

### 文件管理规范
pages 页面模块必须件文件夹区分
api 接口一个模块一个文件
组建 一个组建一个文件夹
plugins 插件一个插件一个文件夹
vuex 路由状态管理，一个模块在modules 中建一个文件夹
router 一个模块一个模块在modules 中建一个文件夹
style 样式尽量采用iView自带组建，common.less 系统通用样式不要轻易动
自定义通用样式 style.less,每次添加必须加注释，页面独立样式在在页面内写，后缀less 格式
组建样式 styles 中添加文件夹 composents 对应components 目录新建样式文件
utils 自定义工具js 独立命名，一般不用新建文件夹

## 模块命名
~~~
├─ product 商品管理
├─ user 用户管理
├─ order 系统订单管理
├─ setting 系统设置维护 系统权限管理、系统菜单管理 客服管理
├─ chat 客服管理（列表，添加，删除，编辑）
├─ application 各个应用模块功能管理公众号、小程序、支付宝、百度小程序、今日头条小程序
├─ system 系统更新日志 数据库管理
├─ finance  财务管理
├─ agent 分销管理
├─ marketing 优惠券、积分、拼团、砍价、秒杀
├─ echarts 数据统计分析
├─ notification  消息通知管理、模版消息（列表，通知，添加，编辑）、短信
├─ file 附件文件管理
├─ freight 运费模版管理 物流公司
├─ merchant 商户管理
├─ widget 组件 小插件
└─ cms 文章管理
~~~
## 目录结构
主要目录结构及说明：
~~~
├── public                      # 静态资源
│   ├── favicon.ico             # favicon图标
│   └── index.html              # html 模板
├── src                         # 源代码
│   ├── api                     # 所有请求
│   │    └──account.js          # 有关登录的接口
│   │    └──index.js            # 有关首页的接口
│   │    └──order.js            # 有关订单的接口
│   │    └──product.js          # 有关商品的接口
│   │    └──staff.js            # 有关店员的接口
│   │    └──setting.js          # 有关设置的接口
│   │    └──system.js           # 有关维护（开发配置、安全维护）的接口
│   │    └──uploadPictures.js   # 有关上传图片附件的接口
│   │    └──user.js             # 有关会员的接口
│   ├── assets                  # 图片、svg 等静态资源
│   ├── components              # 公共组件
│   │    └──cards               # 统计
│   │    └──copyright           # 页面footer的底部声明
│   │    └──customerInfo        # 选择用户
│   │    └──echarts             # 统计图
│   │    └──freightTemplate     # 运费模板
│   │    └──from                # 生成表单
│   │    └──goodsList           # 商品列表
│   │    └──iconFrom            # 导航添加图标
│   │    └──link                # a连接
│   │    └──mde                 # 多文本框
│   │    └──modelSure           # 确认模态框
│   │    └──newsCategory        # 图文管理页
│   │    └──publicSearchFrom    # 头部搜索（没用到）
│   │    └──quill               # 编辑器（没用到）
│   │    └──referrerInfo        # 推荐人信息
│   │    └──searchFrom          # 订单页的搜索
│   │    └──sendCoupons         # 发送优惠券
│   │    └──systemStore         # 添加提货点
│   │    └──ueditorFrom         # 编辑器组件（供参考，没用到，主要用安装组件--vue-ueditor-wrap）
│   │    └──uploadPictures      # 上传图片
│   │    └──uploadVideo         # 上传视频（用于商品编辑器里面）
│   ├── i18n                    # 多语言
│   ├── layouts                 # 布局
│   │    └──header-breadcrumb   # 头部面包屑样式
│   │    └──header-collapse     # 头部控制折叠面板的图标
│   │    └──header-fullscreen   # 头部控制是否全屏的图标
│   │    └──header-i18n         # 头部控制多语言
│   │    └──header-log          # 头部控制日志异常图标
│   │    └──header-logo         # 头部logo
│   │    └──header-notice       # 头部提示消息
│   │    └──header-reload       # 头部控制刷新的图标
│   │    └──header-search       # 头部搜索
│   │    └──header-setting      # 设置页面风格
│   │    └──header-user         # 我的（个人中心、退出登录）
│   │    └──menu-head           # 
│   │    └──menu-side           # 侧边导航栏
│   │    └──tabs                # 头部的横向导航标签
│   │    └──mixins              # 用于横向滚动获取title的一个js
│   ├── libs                    # 公共方法
│   ├── menu                    # 菜单配置
│   ├── mixins                  # 通用混合
│   ├── mock                    # 数据模拟
│   ├── pages                   # 所有页面
│   │    └──account             # 有关登录页
│   │         └──login          # 登录
│   │    └──cashier                  # 收银台
│   │         └──index               # 收银台首页
│   │         └──components          # 收银台组件
│   │    └──hang                     # 挂单
│   │         └──index               # 挂单列表
│   │         └──components          # 挂单组件
│   │    └──recharge                 # 充值
│   │         └──index               # 充值列表
│   │         └──components          # 充值组件
│   │   └──recharge                  # 充值
│   │         └──index               # 充值列表
│   │         └──components          # 充值组件
│   │    └──refund                   # 退款
│   │         └──index               # 退款列表
│   │         └──components          # 退款组件
│   │    └──verify                   # 核销
│   │         └──index               # 核销列表
│   │         └──components          # 核销组件
│   │    └──order                    # 订单管理
│   │    └──setting                  # 设置
│   │         └──systemAdmin         # 管理员列表
│   │         └──systemMenus         # 权限规则
│   │         └──user                # 个人中心
│   │    └──system                   # 维护
│   │         └──auth                # 商业授权
│   │         └──clear               # 刷新缓存
│   │         └──configTab           # 配置
│   │              └──index          # 配置分类
│   │              └──list           # 配置列表
│   │         └──error               # 错误页
│   │              └──403            # 403
│   │              └──404            # 404
│   │              └──500            # 500
│   │         └──group               # 组合数据
│   │         └──maintain              
│   │              └──systemCleardata    # 清除数据
│   │              └──systemDatabackup   # 数据备份
│   │              └──systemFile         # 文件校验
│   │                   └──opendir       # 文件管理
│   │              └──systemLog          # 系统日志
│   │    └──user                         # 会员
│   │         └──group                   # 会员分组
│   │         └──label                   # 会员标签
│   │         └──level                   # 会员等级
│   │         └──list                    # 会员管理
│   ├── plugins                           # 插件
│   ├── router                            # 路由配置
│   │    └──modules                      # 页面路由模块
│   │         └──agent.js                     # 有关分销
│   │         └──app.js                       # 有关应用（小程序、公众号）
│   │         └──cms.js                       # 有关内容（文章管理、文章分类）
│   │         └──echarts.js                   # 有关统计
│   │         └──finance.js                   # 有关财务
│   │         └──marketing.js                 # 有关营销
│   │         └──order.js                     # 有关订单
│   │         └──user.js                      # 有关会员
│   │    └──index.js                          # 路由的导出以及拦截处理
│   │    └──routes.js                         # 路由的汇总
│   ├── store                                  # Vuex 状态管理
│   ├── utils                                  # js工具
│   │    └──authLapse.js                      # 授权提示框
│   │    └──modalForm.js                      # 表单模态框
│   │    └──videoCloud.js                     # 上传云储存视频（七牛、腾讯、阿里）
│   │    └──validate.js                       # 将时间戳转化成时间；
│   │    └──public.js                         # 询问模态框；
│   ├── styles            # 样式管理
│   ├── setting.env.js    # 开发配置文件
│   ├── setting.js        # 业务配置文件
│   ├── main.js           # 入口文件 加载组件 初始化等
│   └── App.vue           # 入口页面
├── tests                  # 测试管理
├── alias.config.js        # 别名，仅用于配置 WebStorm 识别别名，无实际用处
├── babel.config.js        # babel 配置
├── jest.config.js         # jest 配置
├── package.json           # package.json
└── vue.config.js          # Vue CLI 3 配置
~~~
## 开发打包项目
~~~
# 进入项目目录
$ cd admin-iView

# 安装依赖
$ npm install

# 启动项目(本地开发环境)
$ npm run dev

# 打包项目
$ npm run build
~~~

## 配置


