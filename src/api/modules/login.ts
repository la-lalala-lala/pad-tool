import {Login} from "@/types/login"
import http from "@/api"


// 用户登录接口
export const loginApi = (params: Login.ReqLoginForm) => http.post<Login.ResLogin>(`/backend/login`, params)