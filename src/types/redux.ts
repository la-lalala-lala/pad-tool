import {User} from "@/types/user";
import {Log} from "@/types/log";
import {RouterNode} from "@/routers/TemplateRouter";

export interface GlobalState {
    token: string;
    user: User.ResUser;
    plan: Array<string>;
    log: Log.ResLog;
    menu: Array<RouterNode>;
}

/* State */
export interface State {
    global: GlobalState
}