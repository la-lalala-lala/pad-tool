# pad-tool(工具板)

## 问题记录

1、模板页面的链接中，点击左侧的链接时，会发生整个页面的刷新
原因：在原本的react-router-dom v6 中，本身默认就是支持路由切换而不刷新整个页面，但是在这个项目中，由于左侧的菜单列表是手写的，里面用到了原生的a标签，由于href的设置不合理（原来是#），触发了二次的页面的刷新，所以替换为href="#！"或者href="javascript:void(0)"即可

1、参考：https://github.com/Ostask/daodao-knowledge/tree/master/docs/react/02.react%2Bantd%2Breact-router%2Bredux%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F
2、参考：https://github.com/Ostask/Hooks-Admin/tree/master

末路狂花钱
##  框架组成
- 1.React
- 2.TypeScript
- 3.Vite

## 搭建步骤

### 1、创建项目
```text
saya@liunengkaideiMac pad-tool % npm init vite@latest
Need to install the following packages:
create-vite@5.2.3
Ok to proceed? (y) y
✔ Project name: … pad-tool
✔ Select a framework: › React
✔ Select a variant: › TypeScript

Scaffolding project in /Users/saya/project/web/pad-tool/pad-tool...

Done. Now run:

  cd pad-tool
  npm install
  npm run dev

npm notice 
npm notice New minor version of npm available! 10.2.4 -> 10.7.0
npm notice Changelog: https://github.com/npm/cli/releases/tag/v10.7.0
npm notice Run npm install -g npm@10.7.0 to update!
npm notice 
```

### 2、配置alias别名@

开发的时候写一堆'./ ../'体验很不好，非常糟心，所以配一下别名

这里必须要使用绝对路径，因此在vite.config.ts引入path 在node中，可以使用__dirname变量获取当前模块文件所在目录的完整绝对路径,完整配置如下

```js
    resolve: {
        // 配置别名，@作为src引入
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
```
配置了@别名之后去导入文件发现没有智能提示，需要到根目录tsconfig.json文件，添加下面的配置
```js
    {
        "baseUrl": "./",//配置paths前先配置baseUrl
        "paths": {
            "@/*": [
                "src/*"// 模块名到基于 baseUrl的路径映射的列表
            ]
        }
    }
```

### 3、配置环境指标
vite 提供了开发模式和生产模式这里我们可以建立 2 个 .env 文件，一个通用配置和透明环境：开发、生产。env 文件中的标记名建议与 VITE_APP 开头，和 vue cli 中的 VUE_APP 相同，最合适也一致

首先修改src/vite-env.d.ts文件，根据环境变量定义接口
```typescript
interface ImportMetaEnv {
    readonly VITE_API: string;
    readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
```

.env文件通用配置用于配置一些公用的，栗子：网页的title VITE_APP_TITLE=hello
.env.dev文件 开发环境配置以api url为例 VITE_APP_PROXY_URL=/api
.env.pro文件 测试环境以api url为例 VITE_APP_PROXY_URL=/apiProd

修改启动入口：
```js
{
    "scripts": {
        "dev": "vite --mode dev",
        "build": "vite build --mode pro",
        "preview": "vite preview"
    }
}
```

注意：--mode 后面的 dev 或者pro，一定要和.env.*文件匹配，
(嚯嚯嚯，你问我为什么把tsc去掉了，因为。。老子ts太菜了 = w =)

在vite.config.ts中这样使用
```typescript
import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path";

// https://vitejs.dev/config/


export default ({mode}) => {
    const env = loadEnv(mode, process.cwd());
    console.info('-----env.config-----')
    console.info(env)
}
```

在写api的时候可以这么用

```js
    const baseUrl = import.meta.env.VITE_APP_PROXY_URL
    export const getTabList = (params) => {
      return axios({
        method: 'post',
        url: baseUrl + 'QueryTabReq',
        data: params
      })
    }
```

### 4、配置proxy代理

vite.config.js中配置服务器
```typescript
    {
        server: {
            host: "0.0.0.0", // 指定服务器应该监听哪个 IP 地址。 如果将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
                port: 3000, //指定开发服务器端口。注意：如果端口已经被使用，Vite 会自动尝试下一个可用的端口
                proxy: {
                '/backend': {
                    target: env.VITE_APP_PROXY_URL,
                    changeOrigin: true,
                    //rewrite: path => path.replace(/^\/api/, "") //因为实际的地址不带api，所以要去掉api
                },
            }
        },
    }
```

### 5、配置打包

```typescript
import { defineConfig, ConfigEnv, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from "path"

// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv):UserConfig => {
 return {
   //...
   build: {
     outDir: "dist", // 指定输出路径（相对于 项目根目录).
     minify: "esbuild",  //设置为 false 可以禁用最小化混淆，或是用来指定使用哪种混淆器。默认为 Esbuild，它比 terser 快 20-40 倍，压缩率只差 1%-2%
     rollupOptions: {
       output: {
           chunkFileNames: "js/[name]-[hash].js",
           entryFileNames: "js/[name]-[hash].js",
           assetFileNames: "[ext]/[name]-[hash].[ext]"
       }
     }
   }
 }
})
```

### 6、定义路由
#### 1.安装

现在界面光秃秃的不好看，而且只有一页，我们先安装一下react router，老规矩，这是react router的文档,一定要多看文档，一定要多看文档，一定要多看文档，重要的事情说三遍。

```shell
npm install react-router-dom -S
```

#### 2、定义路由

react router有两种路由，一种是HashRouter，另一种是BrowserRouter,其中HashRouter并不需要服务端做配置，而是路由中带一个#键，由前端来转发，所以我们选用HashRouter

- 在App.tsx中引入HashRouter,并让HashRouter包裹在最外层
```typescript
// app.tsx
import { HashRouter } from "react-router-dom"

const App = () => {
  return (
    <HashRouter>
      App
    </HashRouter>
  )
}

export default App
```

- 新建views文件夹，在下面再新建login和home文件夹，里面都创建index页面
```text
├── App.tsx
├── assets
│   └── react.svg
├── main.tsx
├── views
│   ├── home
│   │   └── index.ts
│   └── login
│       └── index.ts
└── vite-env.d.ts

```

- 新建routers文件夹，里面定义路由相关的东西，首先创建 index.ts，我们使用useRoute钩子

```typescript
import {useRoutes} from "react-router-dom"

import LoginView from "@/views/login/index"
import Home from "@/views/home/index"

export const rootRouter = [
    {
        path:"/",
        element: <Home></Home>
    },
    {
        path:'/login',
        element: <LoginView></LoginView>
    }
]

const Router = () => {
    const routes = useRoutes(rootRouter)

    return routes
}

export default Router
```

- 在App.tsx中引入Router
```typescript
import { HashRouter } from "react-router-dom"
import Router from "@/routers/index"

const App = () => {
  return (
    <HashRouter>
      <Router />
    </HashRouter>
  )
}

export default App
```

### 7、安装antd

因为后面会用到antd中的一些组件，所以安装antd,antd官网

```shell
npm install antd -S
```

然后在main.tsx中引入样式文件

后面需要使用antd组件的时候再按需加载即可


### 8、路由懒加载

随着页面越来越多，一次性加载所有页面资源非常的占用时间，有没有一种办法，可以只加载当然要访问的那个页面呢？
在react官方文档上其实给出了解决方案，React.Lazy

但是懒加载会花上一段时间，在这段时间内会有白屏的现象，可以将懒加载的组件用Suspense标签包裹起来，Suspense的fallback属性是组件没有加载出来时显示的内容。

- 在routers下新建 utils/lazyLoadByFunction.tsx
- lazyLoad接收React.lazy()加载的组件,加载过程中显示antd的Spin组件
```typescript
import React, { Suspense } from 'react';
import { Spin } from 'antd';

/**
 * @description 路由懒加载
 * @param 需要访问的组件
 * @returns 
 */
const lazyLoadByFunction = (Comp:React.LazyExoticComponent<() => JSX.Element>) => { 
  return (
    <>
      <Suspense fallback={
        <Spin
            size="large"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
            }}
        />
      }>
        <Comp />
      </Suspense>
    </>
  );
}

export default lazyLoadByFunction
```

- 在router/index.tsx中将路由中加载的组件改写为懒加载方式

```typescript
import {useRoutes} from "react-router-dom"
import lazyLoadByFunction from "./utils/lazyLoadByFunction"
import React from "react"

export const rootRouter = [
    {
        path:"/",
        element: lazyLoadByFunction(React.lazy(() => import("@/views/home")))
    },
    {
        path:'/login',
        element: lazyLoadByFunction(React.lazy(() => import("@/views/login")))
    }
]

const Router = () => {
    const routes = useRoutes(rootRouter)

    return routes
}

export default Router
```

### 8、登录界面
登录界面比较简陋，简单用antd的Form组件写个登录界面
```typescript
  // login.tsx
  import LoginForm from "./components/loginForm"
  import logo from "@/assets/images/react.svg"
  import "./index.less"

  const LoginView = () => {
      return (
          <div className="login-container">
              <div className="login-box">
                  <div className="login-form">
                      <div className="login-logo">
                          <img className="login-icon" src={logo} alt="logo" />
                          <span className="logo-text">My-React-Admin</span>
                      </div>
                      <LoginForm />
                  </div>
              </div>
          </div>
      )
  }

  export default LoginView
```

### 9、使用redux

Redux是应用的状态管理容器，对标vue的vuex，redux官方推荐使用redux toolkit，先安装一下：

```shell
npm install @reduxjs/toolkit react-redux -S
```

#### store设计
redux toolkit 可以使用 createSlice 来创建store的切片，然后通过combineReducers再将它们组装起来。 先创建一个切片专门存放token和用户信息。

```typescript
// redux/modules/global.ts
 import { GlobalState } from "@/types/redux";
 import { createSlice } from "@reduxjs/toolkit"

 const globalState: GlobalState = {
     token:"",
     userInfo:{
         username:""
     }
 }

 const globalSlice = createSlice({
     name: "global",
     initialState: globalState,
     reducers: {
         setToken(state: GlobalState, {payload}) {
             state.token = payload
         },
         setUserInfo(state: GlobalState, {payload}) {
             state.userInfo = payload
         }
     }
 })

 export const {setToken, setUserInfo} = globalSlice.actions
 export default globalSlice.reducer
```

在types/redux.ts中定义一下GlobalState的类型：

```typescript
export interface UserInfo {
    username:string;
}

/* GlobalState */
export interface GlobalState {
    token:string;
    userInfo:UserInfo;
}

/* State */
export interface State {
    global: GlobalState
}
```

然后在redux/index.ts中创建store:

```typescript
import { configureStore } from "@reduxjs/toolkit";
import global from "./modules/global";
import { combineReducers } from "@reduxjs/toolkit";

// combineReducers合并reducer
const reducers = combineReducers({
    global
})

export const store = configureStore({
    reducer: reducers
})
```

store创建完，需要在main.ts中使用Provider来包裹住需要使用store的组件：

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import "@/styles/reset.less"
import "antd/dist/reset.css"
import { Provider } from 'react-redux'
import { store } from "@/redux"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={store}>
        <App />
    </Provider>
)
```

#### redux-persist持久化

redux-persist 主要用于帮助我们实现redux的状态持久化 所谓状态持久化就是将状态与本地存储联系起来，达到刷新或者关闭重新打开后依然能得到保存的状态。 先安装redux-persist,这个插件配合redux-toolkit使用时，需要redux-thunk

```shell
npm install redux-persist redux-thunk -S
```

安装完毕后改造一下redux/index.ts,创建persistedReducer,并且使用reduxThunk

```typescript
import { configureStore } from "@reduxjs/toolkit";
import global from "./modules/global";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist"; //数据持久化

// combineReducers合并reducer
const reducers = combineReducers({
    global
})

const presistConfig = {
    key:'react-admin',
    storage
}

const persistedReducer = persistReducer(presistConfig, reducers)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck:{
            ignoreActions:[
                FLUSH,
                REHYDRATE,
                PAUSE,
                PERSIST,
                PURGE,
                REGISTER
            ]
        }
    })
})

export const persistor = persistStore(store)
```

在main.tsx中使用PersistGate标签包裹App组件：


```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import "@/styles/reset.less"
import "antd/dist/reset.css"
import { Provider } from 'react-redux'
import { store, persistor } from "@/redux"
import { PersistGate } from 'redux-persist/integration/react'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
)
```

### 10、封装axios

先安装axios和nprogress

```shell
npm install axios nprogress qs -S
npm install @types/nprogress @types/qs -D
```

#### 定义枚举
```typescript
// enum/httpEnum.ts
// * 请求枚举配置
/**
 * @description: 请求配置
 */
export enum ResultEnum {
    SUCCESS = 200,
    ERROR = 500,
    OVERDUE = 599,
    TIMEOUT = 10000,
    TYPE = "success"
}
```

#### 定义判断类型的工具函数
```typescript
// utils/is.ts
const toString = Object.prototype.toString

/**
 * @description: 判断值是否为某个类型
 */
export function is(val: unknown, type: string) {
    return toString.call(val) === `[object ${type}]`
}

/**
 * @description: 是否为函数
 */
export function isFunction<T = Function>(val: unknown): val is T {
    return is(val, "Function")
}
```

#### 定义response返回类型
```typescript
// types/api.ts
// * 请求响应参数（不包含data)
export interface Result {
    code: string;
    msg: string;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
    data?:T;
}
```

#### 配置nprogress
```typescript
// api/helper/nprogress.ts
import NProgress from "nprogress"
import "nprogress/nprogress.css"

NProgress.configure({
    easing: "ease", //动画方式
    speed: 500, // 递增进度条的速度
    showSpinner: true, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3 //初始化时的最小百分比
})

export default NProgress
```

#### 封装错误状态判断方法

```typescript
// api/helper/checkStatus.ts
import {message} from "antd"

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const checkStatus = (status: number): void => {
	switch (status) {
		case 400:
			message.error("请求失败！请您稍后重试");
			break;
		case 401:
			message.error("登录失效！请您重新登录");
			break;
		case 403:
			message.error("当前账号无权限访问！");
			break;
		case 404:
			message.error("你所访问的资源不存在！");
			break;
		case 405:
			message.error("请求方式错误！请您稍后重试");
			break;
		case 408:
			message.error("请求超时！请您稍后重试");
			break;
		case 500:
			message.error("服务异常！");
			break;
		case 502:
			message.error("网关错误！");
			break;
		case 503:
			message.error("服务不可用！");
			break;
		case 504:
			message.error("网关超时！");
			break;
		default:
			message.error("请求失败！");
	}
};
```

#### 封装取消请求方法

```typescript
// api/helper/axiosCancel.ts
import axios, {AxiosRequestConfig, Canceler} from "axios"
import {isFunction} from "@/utils/is"
import qs from "qs"

// * 声明一个Map用于存储每个请求的标识和取消函数
let pendingMap = new Map<string, Canceler>()

// * 序列化参数
export const getPendingUrl = (config: AxiosRequestConfig) => 
    [config.method,config.url,qs.stringify(config.data), qs.stringify(config.params)].join("&")

export class AxiosCanceler {
    /**
     * @description: 添加请求
     * @param {Object} config
     */
    addPending(config: AxiosRequestConfig) {
        // * 在请求开始前，对之前的请求做检查取消操作
        this.removePending(config)
        const url = getPendingUrl(config)
        config.cancelToken = 
            config.cancelToken || new axios.CancelToken(cancel => {
                if(!pendingMap.has(url)) {
                    // 如果pending中不存在当前请求，则添加进去
                    pendingMap.setTransform(url, cancel)
                }
            })
    }

    /**
     * @description: 移除请求
     * @param {Object} config
     */
    removePending(config: AxiosRequestConfig) {
        const url = getPendingUrl(config)

        if(pendingMap.has(url)) {
            //如果在pending中存在当前请求标识，需要取消当前请求，并且移除
            const cancel = pendingMap.get(url)
            cancel && cancel()
            pendingMap.delete(url)
        }
    }

    /**
     * @description: 清空所有pending
     */
    removeAllPending() {
        pendingMap.forEach(cancel => {
            cancel && isFunction(cancel) && cancel()
        })
        pendingMap.clear()
    }

    /**
     * @description: 重置
     */
    reset():void {
        pendingMap = new Map<string, Canceler>()
    }
}
```

#### 封装axios

```typescript
import NProgress from "./helper/nprogress";
import axios, {AxiosInstance, AxiosRequestConfig, AxiosError} from "axios"
import { store } from "@/redux"
import { setToken } from "@/redux/modules/global"
import { ResultEnum } from "@/enums/httpEnum"
import { message } from "antd"
import { checkStatus } from "./helper/checkStatus"
import { ResultData } from "@/types/api"
import { AxiosCanceler } from "./helper/axiosCancel"

const axiosCanceler = new AxiosCanceler()

const config = {
    //默认地址请求地址，可在.env开头文件中修改
    baseURL: import.meta.env.VITE_API_URL as string,
    // 设置超时时间（10s)
    timeout: ResultEnum.TIMEOUT as number,
    // 跨域时允许携带凭证
    widthCredentials: true
}

class RequestHttp {
    service: AxiosInstance;
    constructor(config: AxiosRequestConfig) {
        // 实例化axios
        this.service = axios.create(config)

        /**
         * @description 请求拦截器
         * 客户端发送请求 -> [请求拦截器] -> 服务器
         * token校验（JWT): 接受服务器返回的token，存储到redux/本地存储当中
         */
        this.service.interceptors.request.use(
            (config) => {
                NProgress.start()
                // * 将当前请求添加到 pending 中
                axiosCanceler.addPending(config)
                const token:string = store.getState().global.token
                config.headers["x-access-token"] = token
                return config
            },
            (error: AxiosError) => {
                return Promise.reject(error)
            }
        )

        /**
         * @description 响应拦截器
         * 服务器返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
         */
        this.service.interceptors.response.use(
            (response) => {
                const {data, config} = response
                NProgress.done()
                // * 在请求结束后，移除本次请求（关闭loading)
                axiosCanceler.removePending(config)
                // * 登录失败（code == 599）
                if (data.code == ResultEnum.OVERDUE) {
                    store.dispatch(setToken(""))
                    message.error(data.msg)
                    window.location.hash = "/login"
                    return Promise.reject(data)
                }
                // * 全局错误信息拦截（防止下载文件的时候返回数据流，没有code，直接报错)
                if(data.code && data.code !== ResultEnum.SUCCESS) {
                    message.error(data.msg)
                    return Promise.reject(data)
                }
                // * 请求成功（在页面上除非特殊情况，否则不用处理失败逻辑）
                return data;
            },
            (error: AxiosError) => {
                const {response} = error
                NProgress.done()
                // 请求超时单独判断，请求超时没有response
                if(error.message.indexOf("timeout") !== -1) {
                    message.error("请求超时，请稍后再试")
                }
                // 根据响应的错误状态码， 做不同的处理
                if(response) {
                    checkStatus(response.status)
                }
                // 服务器结果都没有返回(可能服务器错误可能客户端断网) 断网处理：可以跳转到断网页面
                if(!window.navigator.onLine) {
                    window.location.hash = "/500"
                }
                return Promise.reject(error)
            }
        )
    }

    // * 常用请求方法封装
    get<T>(url:string,params?:object,_object = {}): Promise<ResultData<T>> {
        return this.service.get(url, {...params, ..._object})
    }
    post<T>(url:string,params?:object,_object = {}): Promise<ResultData<T>> {
        return this.service.post(url, {...params, ..._object})
    }
    put<T>(url:string,params?:object,_object = {}): Promise<ResultData<T>> {
        return this.service.put(url, {...params, ..._object})
    }
    delete<T>(url:string,params?:object,_object = {}): Promise<ResultData<T>> {
        return this.service.delete(url, {...params, ..._object})
    }
}

export default new RequestHttp(config)
```

#### 封装全局Loading
```typescript
// components/Loading/index
import {Spin} from "antd"
import "./index.less"

const Loading = ({tip = "Loading"}: {tip?: string}) => {
    return <Spin tip={tip} size="large" className="request-loading"></Spin>
}

export default Loading
```

然后定义一下显示和隐藏loading的方法

```typescript
// api/helper/serviceLoading.tsx
import ReactDOM from "react-dom/client"
import Loading from "@/components/Loading/index"

let needLoadingRequestCount = 0

// * 显示loading
export const showFullScreenLoading = () => {
    if(needLoadingRequestCount === 0) {
        let dom = document.createElement("div")
        dom.setAttribute("id", "loading")
        document.body.appendChild(dom)
        ReactDOM.createRoot(dom).render(<Loading />)
    }
    needLoadingRequestCount++
}

// * 隐藏loading
export const tryHideFullScreenLoading = () => {
    if(needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if(needLoadingRequestCount == 0) {
        document.body.removeChild(document.getElementById("loading") as HTMLElement)
    }
}
```

然后在封装的RequestHttp类中使用：
```typescript
//...
import { showFullScreenLoading, tryHideFullScreenLoading } from "./helper/serviceLoading"
//...

const axiosCanceler = new AxiosCanceler()

//...
class RequestHttp {
    service: AxiosInstance;
    constructor(config: AxiosRequestConfig) {
        //...
        this.service.interceptors.request.use(
            (config) => {
               //...
                config?.headers!.noLoading || showFullScreenLoading()
                //...
            },
            //...
        )

        /**
         * @description 响应拦截器
         * 服务器返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
         */
        this.service.interceptors.response.use(
            (response) => {
                //...
                tryHideFullScreenLoading()
               //...
            },
            (error: AxiosError) => {
                //...
                tryHideFullScreenLoading()
                //...
            }
        )
    }
  //...
}

export default new RequestHttp(config)
```

### 11、对接登录

做了这么多，终于可以对接之前的登录接口了，需要做以下几件事

1.封装登录api
新建/api/modules/login.ts，调用刚刚封装好的HttpRequest类中的post方法：

```typescript
  import {LoginView} from "@/types/login"
  import http from "@/api"

  /**
  * @name 登录模块
  */
  // 用户登录接口
  export const loginApi = (params: LoginView.ReqLoginForm) => {
      return http.post<LoginView.ResLogin>(`/login`, params)
  }
```

补全一下Login命名空间下登录接口返回的类型

```typescript
  //  * 登录
  export namespace LoginView {
      export interface ReqLoginForm {
          username: string;
          password: string;
      }

      export interface ResLogin {
          access_token: string;
      }
  }
```

然后在 views/login/components/loginForm.tsx中调用

```typescript
import {Button, Form, Input} from "antd"
import { UserOutlined, LockOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { LoginView } from "@/types/login";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginApi } from "@/api/modules/login";
import { setToken, setUserInfo } from "@/redux/modules/global";

const LoginForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)
    const [form] = Form.useForm()

    //login
    const onFinish = async (loginForm: LoginView.ReqLoginForm) => {
        try { // 使用try catch来捕获代码块里所有的抛出异常
            // 将登录按钮的Loading改为true
            setLoading(true)
            // 调用登录Api
            const {data} = await loginApi(loginForm)
            // token存入store
            dispatch(setToken(data?.access_token))
            // 存入userInfo
            dispatch(setUserInfo({userName: loginForm.username}))
            // 跳转到home主页
            navigate("/")
        } catch(e) {
            console.log(e)
        } finally {
            // Loading置为false
            setLoading(false)
        }
    }

    //...后面的省略
```

### 11、导航守卫

刚刚登录成功保存了token,新的需求就来了，在我们没有token的时候应该是禁止访问主页的，应该直接跳转回登录界面。
新建 routers/utils/authRouter.tsx,AuthRouter组件包裹在Router外，当token和pathname发生变化时，判断有没有token，如果没有就跳转到登录页面。

```typescript
// routers/utils/authRouter.tsx
import {useLocation,useNavigate} from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { State } from "@/types/redux"

const AuthRouter = (props:any) => {
    const { token } = useSelector((state:State) => state.global)

    const { pathname } = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        !token && navigate('/login')
    },[token, pathname])

    return props.children
}

export default AuthRouter
```

```typescript
// App.tsx
import { HashRouter } from "react-router-dom"
import Router from "@/routers/index"
import AuthRouter from "./routers/utils/authRouter"

const App = () => {
  return (
    <HashRouter>
      <AuthRouter>
        <Router />
      </AuthRouter>
    </HashRouter>
  )
}

export default App
```