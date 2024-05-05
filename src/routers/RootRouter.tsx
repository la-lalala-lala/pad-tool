import {useRoutes} from "react-router-dom"
import lazyLoad from "@/utils/lazyLoad"
import React from "react"


/**
 * 根路由（一级路由）
 */
export const rootRouter = [
    {
        path:"/backstage/*",
        element: lazyLoad(React.lazy(() => import("@/views/template")))
    },
    {
        path:'/',
        element: lazyLoad(React.lazy(() => import("@/views/login")))
    }
]

const RootRouter = () => {
    return useRoutes(rootRouter)
}

export default RootRouter