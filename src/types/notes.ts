import {PageData} from "@/types/api";

export namespace Notes{
    export interface ReqNotesForm {
        id: number;
        name: string;
        organize: number;
        source: string;
        status: number;
        descript: string;
        token: string;
    }
    export interface ResNotes{
        id: number;
        name: string;
        organize: number;
        source: string;
        status: number;
        descript: string;
        notes_count: number;
    }

}