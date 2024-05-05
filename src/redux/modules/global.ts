// redux/modules/global.ts
import { GlobalState } from "@/types/redux";
import { createSlice } from "@reduxjs/toolkit"

const globalState: GlobalState = {
    token:"",
    userInfo:{
        username:""
    }
}

const globalSlice = createSlice({
    name: "global",
    initialState: globalState,
    reducers: {
        setToken(state: GlobalState, {payload}) {
            state.token = payload
        },
        setUserInfo(state: GlobalState, {payload}) {
            state.userInfo = payload
        }
    }
})

export const {setToken, setUserInfo} = globalSlice.actions
export default globalSlice.reducer