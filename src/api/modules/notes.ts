import http from "@/api"
import {Notes} from "@/types/notes"
import {ResultData} from "@/types/api";

// 创建笔记簿
export const createNoteBookApi = (params:Notes.ReqNotesForm) => http.post<ResultData<number>>(`/article/notes/notebook`, params);
// 修改笔记簿
export const updateNoteBookApi = (params:Notes.ReqNotesForm) => http.put<ResultData<number>>(`/article/notes/notebook`, params);
// 删除笔记簿
export const deleteNoteBookApi = (params:number) => http.delete<ResultData<number>>(`/article/notes/notebook/${params}`, {});
// 获取笔记簿
export const noteBookListApi = () => http.get<ResultData<Array<Notes.ResNotes>>>(`/article/notes/notebook`, {});

// // 创建笔记
// export const createNoteApi = params => RequestHttp.post(`${backendAPI}/content/notes`, params).then(data =>{return {err:null, result:data}}).catch(err => {return {err:err, result:null}});
// // 修改笔记
// export const updateNoteApi = params => RequestHttp.put(`${backendAPI}/content/notes`, params).then(data =>{return {err:null, result:data}}).catch(err => {return {err:err, result:null}});
// // 删除笔记
// export const deleteNoteApi = params => RequestHttp.delete(`${backendAPI}/content/notes/${params}`, {}).then(data =>{return {err:null, result:data}}).catch(err => {return {err:err, result:null}});
// // 获取笔记
// export const notePageApi = params => RequestHttp.get(`${backendAPI}/content/notes`, params).then(data =>{return {err:null, result:data}}).catch(err => {return {err:err, result:null}});
// // 查询笔记详情
// export const noteInfoApi = params => RequestHttp.get(`${backendAPI}/content/notes/${params}`, {}).then(data =>{return {err:null, result:data}}).catch(err => {return {err:err, result:null}});
