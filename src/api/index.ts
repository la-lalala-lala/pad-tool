import NProgress from "./helper/nprogress";
import axios, {AxiosInstance, AxiosRequestConfig, AxiosError} from "axios"
import { store } from "@/redux"
import { setToken } from "@/redux/modules/global"
import { ResultEnum } from "@/enums/httpEnum"
import {openNotificationWithIcon} from "@/utils/window";
import { checkStatus } from "./helper/checkStatus"
import { ResultData } from "@/types/api"
import { AxiosCanceler } from "./helper/axiosCancel"
import { showFullScreenLoading, tryHideFullScreenLoading } from "./helper/serviceLoading"

const axiosCanceler = new AxiosCanceler()

const config = {
    //默认地址请求地址，可在.env开头文件中修改(vite.config.ts中已经设置了)
    //baseURL: import.meta.env.VITE_API as string,
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
                config?.headers!.noLoading || showFullScreenLoading()
                // 需要添加的token 自行设置
                if ('/backend/login' !== config.url){
                    //const token:string = store.getState().global.token
                    //config.headers["x-access-token"] = token
                    const token:string = store.getState().global.token
                    config.headers["access_token"] = token;
                }
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
                tryHideFullScreenLoading()
                // * 在请求结束后，移除本次请求（关闭loading)
                axiosCanceler.removePending(config)
                // 会话过期操作，或者未登录
                if (data.code && data.code == ResultEnum.UNAUTHORIZED) {
                    store.dispatch(setToken(""))
                    store.dispatch(setToken(""))
                    window.location.href = "/"
                    return Promise.reject(data)
                }
                // * 全局错误信息拦截（防止下载文件的时候返回数据流，没有code，直接报错)
                if(data.code && data.code !== ResultEnum.SUCCESS) {
                    openNotificationWithIcon("error", "错误提示", data.msg);
                    return Promise.reject(data)
                }
                // * 请求成功（在页面上除非特殊情况，否则不用处理失败逻辑）
                return data;
            },
            (error: AxiosError) => {
                const {response} = error
                NProgress.done()
                tryHideFullScreenLoading()
                // 请求超时单独判断，请求超时没有response
                if(error.message.indexOf("timeout") !== -1) {
                    openNotificationWithIcon("error", "错误提示", '请求超时，请稍后再试！');
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
        return this.service.get(url, {params, ..._object})
    }
    post<T>(url:string,params?:object,_object = {}): Promise<ResultData<T>> {
        return this.service.post(url, {...params, ..._object})
    }
    put<T>(url:string,params?:object,_object = {}): Promise<ResultData<T>> {
        return this.service.put(url, {...params, ..._object})
    }
    delete<T>(url:string,params?:object,_object = {}): Promise<ResultData<T>> {
        return this.service.delete(url, {params, ..._object})
    }
}

export default new RequestHttp(config)