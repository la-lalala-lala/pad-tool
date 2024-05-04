import {Logo} from "@/types/logo"
import http from "@/api"

// 上传头像
export const uploadLogoApi = (params: Logo.ReqLogo) => http.post<string>(`/backend/system/user/logo`, params)