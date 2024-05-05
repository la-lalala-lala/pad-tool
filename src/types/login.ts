// types/login.ts
//  * 登录
export namespace Login {
    export interface ReqLoginForm {
        account: string;
        password: string;
        platform: string
    }

    export interface ResLogin {
        user: any,
        access_token: String,
        plan: any,
        log: any,
    }
}