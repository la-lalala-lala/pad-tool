import {Log} from "@/types/log"
import {LogType} from "@/types/log_type"
import http from "@/api"
import {ResultData} from "@/types/api";

// 上获取日志接口
export const logPageApi = (params: Log.ReqLogForm) => http.get<ResultData<Log.ResPageLog>>(`/system/log/page`, params)
// 获取日志类别接口
export const logTypeListApi = () => http.get<ResultData<Array<LogType.ResLogType>>>(`/system/log/type`, {});
// 导出日志
export const downloadLogExcelApi = `/system/log/page`;