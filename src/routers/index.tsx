import {useRoutes} from "react-router-dom"
import lazyLoad from "@/utils/lazyLoad"
import React from "react"

export const rootRouter = [
    {
        path:"/",
        element: lazyLoad(React.lazy(() => import("@/views/home")))
    },
    {
        path:'/login',
        element: lazyLoad(React.lazy(() => import("@/views/login")))
    }
]

const Router = () => {
    return useRoutes(rootRouter)
}

export default Router