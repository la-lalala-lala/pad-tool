import {useLocation,useNavigate} from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { State } from "@/types/redux"


// 导航守卫,在没有token的时候禁止访问主页的，直接跳转回登录界面。当token和pathname发生变化时，判断有没有token，如果没有就跳转到登录页面。
const AuthRouter = (props:any) => {
    const { token } = useSelector((state:State) => state.global)

    const { pathname } = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        !token && navigate('/')
    },[token, pathname])

    return props.children
}

export default AuthRouter