//  登录
export namespace Login {
    export interface ReqLoginForm {
        account: string;
        password: string;
        platform: string;
    }

    export interface ResLogin {
        access_token: string;
    }
}