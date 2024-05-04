/* GlobalState */
import {User} from "@/types/user";
import {Log} from "@/types/log";

export interface GlobalState {
    token: string;
    user: User.ResUser;
    plan: Array<string>;
    log: Log.ResLog;
}

/* State */
export interface State {
    global: GlobalState
}