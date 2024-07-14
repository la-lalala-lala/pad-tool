import {PageData} from "@/types/api";

export namespace Log{
    export interface ReqLogForm {
        page_no: number;
        page_size: number;
        category: number;
        begin_time: string;
        end_time: string;
    }
    export interface ResLog{
        id: number;
        organize: number;
        user: string;
        category: string;
        ip: string;
        city: string;
        date: string;
        detail: string;
    }
    export interface ResPageLog extends PageData {
        records: Array<ResLog>
    }


}