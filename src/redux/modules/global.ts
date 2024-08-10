// redux/modules/global.ts
import { GlobalState } from "@/types/redux";
import { createSlice } from "@reduxjs/toolkit"
import {routerNodes} from "@/routers/TemplateRouter";
import {deepClone} from "@/utils/var"
const globalState: GlobalState = {
    token: "",
    user:{
        account: "",
        name: "",
        password: "",
        sex: "",
        qq: "",
        email: "",
        phone: "",
        birthday: "",
        hometown: "",
        autograph: "",
        logo: "",
        background: 2,
        organize_id: 1,
        state: 1,
        create_time: "",
        update_time: "",
        background_url: "",
    },
    plan:[],
    log:{
        id: 1,
        organize: 1,
        user: "",
        category: "",
        ip: "",
        city: "",
        date: "",
        detail: ""
    },
    menu:[],
}

const globalSlice = createSlice({
    name: "global",
    initialState: globalState,
    reducers: {
        setToken(state: GlobalState, {payload}) {
            state.token = payload
        },
        setUser(state: GlobalState, {payload}) {
            state.user = payload
        },
        setPlan(state: GlobalState, {payload}) {
            state.plan = payload
        },
        setLog(state: GlobalState, {payload}) {
            state.log = payload
        },
        setMenu(state: GlobalState, {payload}) {
            state.menu = payload
        }
    }
})

export const {setToken, setUser,setPlan,setLog,setMenu} = globalSlice.actions
export default globalSlice.reducer