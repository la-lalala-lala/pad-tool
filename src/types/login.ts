//  登录
export namespace Login {
    export interface ReqLoginForm {
        account: string;
        password: string;
        platform: string;
    }

    export interface ResLogin {
        user: object;
        access_token: string;
        plan: Array<object>;
        log: object;
    }
}