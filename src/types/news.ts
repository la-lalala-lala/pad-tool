import {PageData} from "@/types/api";

export namespace News{
    export interface ReqNewsForm {
        id: number;
        topic: string;
        label: string;
        abstracts: string;
        content: string;
        organize: number;
        source: string;
        token: string;
        page_no: number;
        page_size: number;
        begin_time: string;
        end_time: string;
    }
    export interface ResNews{
        id: number;
        topic: string;
        label: string;
        abstracts: string;
        path: string;
        content: string;
        organize: number;
        source: string;
        create_time: string;
        update_time: string;
    }

    export interface ResPageNews extends PageData {
        records: Array<ResNews>
    }


}