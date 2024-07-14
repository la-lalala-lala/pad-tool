import {useRoutes} from "react-router-dom"
import {lazyLoadByFunction} from "@/utils/lazy_load"
import React from "react"


/**
 * 根路由（一级路由）
 */
export const rootRouter = [
    {
        path:"/backstage/*",
        element: lazyLoadByFunction(React.lazy(() => import("@/views/template")))
    },
    {
        path:'/',
        element: lazyLoadByFunction(React.lazy(() => import("@/views/login")))
    }
]

const RootRouter = () => {
    return useRoutes(rootRouter)
}

export default RootRouter