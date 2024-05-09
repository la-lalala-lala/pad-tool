import {Route, useRoutes} from "react-router-dom"
import lazyLoad from "@/utils/lazyLoad"
import React, {Suspense} from "react"
import {Spin} from "antd";
import {rootRouter} from "@/routers/RootRouter";

export interface RouterNode {
    name: string,   // 组件名
    path: string,   // 打开路由
    root: boolean, // 是否为根节点，由于在antd渲染根节点时，需要特殊处理，
    children: any, // 子组件
    element: any,    // 组件
    display: boolean,  // 是否在菜单中显示
    icon: string,// 图标
    content: string // 右侧描述信息(只在应用级别有效)
}

/**
 * 母版路由（二级路由）
 */
export const routerNodes: Array<RouterNode> = [
    {
        name: '概览',
        path: '',
        root: true,
        children: [
            {
                name: '主页',
                path: '/home',
                root: true,
                children: null,
                element: lazyLoad(React.lazy(() => import("@/views/account"))),
                display: true,
                icon: 'HomeOutlined',
                content: '2'
            },
            {
                name: '最近的笔记',
                path: '/home1',
                root: true,
                children: null,
                element: lazyLoad(React.lazy(() => import("@/views/home"))),
                display: true,
                icon: 'HomeOutlined',
                content: ''
            }
        ],
        element: null,
        display: true,
        icon: '',
        content: ''
    },
    {
        name: '随手记',
        path: '',
        root: true,
        children: [
            {
                name: '笔记',
                path: '/plan',
                root: true,
                children: [
                    {
                        name: '归档',
                        path: '/plan/activity',
                        root: false,
                        children: null,
                        element: lazyLoad(React.lazy(() => import("@/views/home"))),
                        display: true,
                        icon: '',
                        content: ''
                    },
                    {
                        name: '草稿',
                        path: '/plan/archive',
                        root: false,
                        children: null,
                        element: lazyLoad(React.lazy(() => import("@/views/home"))),
                        display: true,
                        icon: '',
                        content: ''
                    }
                ],
                element: null,
                display: true,
                icon: 'FlagOutlined',
                content: ''
            }
        ],
        element: null,
        display: true,
        icon: '',
        content: ''
    },
    {
        name: '设置',
        path: '',
        root: true,
        children: [
            {
                name: '个人',
                path: '/plan1',
                root: true,
                children: [
                    {
                        name: '基本信息',
                        path: '/setting/activity1',
                        root: false,
                        children: null,
                        element: lazyLoad(React.lazy(() => import("@/views/account"))),
                        display: true,
                        icon: '',
                        content: ''
                    },
                    {
                        name: '日志',
                        path: '/setting/log',
                        root: false,
                        children: null,
                        element: lazyLoad(React.lazy(() => import("@/views/log"))),
                        display: true,
                        icon: '',
                        content: ''
                    }
                ],
                element: null,
                display: true,
                icon: 'FlagOutlined',
                content: ''
            }
        ],
        element: null,
        display: true,
        icon: '',
        content: ''
    }
]

export const TemplateRouter = () => {
    let _router = [];
    for(let group of routerNodes){
        if (group.children){
            for(let app of group.children){
                if (app.children){
                    // 还有子级
                    for(let menu of app.children){
                        _router.push({path: menu.path, element: menu.element})
                    }
                }else{
                    _router.push({path: app.path, element: app.element})
                }
            }
        }
    }
    return useRoutes(_router)
}