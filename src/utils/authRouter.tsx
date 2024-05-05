// utils/authRouter.tsx
import {useLocation,useNavigate} from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { State } from "@/types/redux"

const AuthRouter = (props:any) => {
    const { token } = useSelector((state:State) => state.global)

    const { pathname } = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        !token && navigate('/login')
    },[token, pathname])

    return props.children
}

export default AuthRouter