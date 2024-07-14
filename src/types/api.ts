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

// 分页返回结果
export interface PageData {
    page_no: number;
    page_size: number;
    total_page: number;
    total_row: number;
}