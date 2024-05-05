export interface UserInfo {
    username:string;
}

/* GlobalState */
export interface GlobalState {
    token:string;
    userInfo:UserInfo;
}

/* State */
export interface State {
    global: GlobalState
}