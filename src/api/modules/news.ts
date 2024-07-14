import http from "@/api"
import {News} from "@/types/news"
import {ResultData} from "@/types/api";

// 获取动态
export const newsPageApi = (params:News.ReqNewsForm) => http.get<ResultData<News.ResPageNews>>(`/backend/content/news`, params);
// 发布动态
export const createNewsApi = (params:News.ReqNewsForm) => http.post<ResultData>(`/backend/content/news`, params);
// 删除动态
export const deleteNewsApi = (params:number) => http.delete<ResultData>(`/backend/content/news/${params}`, {});
// 查询动态
export const newsInfoApi = (params:number) => http.get<News.ResNews>(`/backend/content/news/${params}`, {});
// 修改动态
export const editNewsApi = (params:News.ReqNewsForm) => http.put<ResultData>(`/backend/content/news`, params);