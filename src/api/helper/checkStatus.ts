// api/helper/checkStatus.ts
import { setToken } from "@/redux/modules/global"
import {store} from "@/redux";
import {openNotificationWithIcon} from "@/utils/window";

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const checkStatus = (status: number): void => {
    switch (status) {
        case 400:
            openNotificationWithIcon("error", "错误提示", '请求失败！请您稍后重试');
            break;
        case 401:
            openNotificationWithIcon("error", "错误提示", '登录过期！请您重新登录');
            store.dispatch(setToken(""))
            window.location.href = "/"
            break;
        case 403:
            openNotificationWithIcon("error", "错误提示", '当前账号无权限访问！');
            break;
        case 404:
            openNotificationWithIcon("error", "错误提示", '你所访问的资源不存在！');
            break;
        case 405:
            openNotificationWithIcon("error", "错误提示", '请求方式错误！请您稍后重试！');
            break;
        case 408:
            openNotificationWithIcon("error", "错误提示", '请求超时！请您稍后重试！');
            break;
        case 423:
            openNotificationWithIcon("error", "错误提示", '当前资源被锁定！请您稍后重试！');
            break;
        case 500:
            openNotificationWithIcon("error", "错误提示", '服务异常！');
            break;
        case 502:
            openNotificationWithIcon("error", "错误提示", '网关错误！');
            break;
        case 503:
            openNotificationWithIcon("error", "错误提示", '服务不可用！');
            break;
        case 504:
            openNotificationWithIcon("error", "错误提示", '网关超时！');
            break;
        default:
            openNotificationWithIcon("error", "错误提示", '请求失败！');
    }
};