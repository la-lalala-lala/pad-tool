import {lazy} from 'react'

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
 *
 */
const routes: Array<RouterNode> = [
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
                element: lazy(() => import('../pages/account')),
                display: true,
                icon: 'HomeOutlined',
                content: '2'
            },
            {
                name: '最近的笔记',
                path: '/home1',
                root: true,
                children: null,
                element: lazy(() => import('../pages/account')),
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
                        element: lazy(() => import('../pages/account')),
                        display: true,
                        icon: '',
                        content: ''
                    },
                    {
                        name: '草稿',
                        path: '/plan/archive',
                        root: false,
                        children: null,
                        element: lazy(() => import('../pages/editor')),
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
                        path: '/plan/activity1',
                        root: false,
                        children: null,
                        element: lazy(() => import('../pages/account')),
                        display: true,
                        icon: '',
                        content: ''
                    },
                    {
                        name: '日志',
                        path: '/plan/archive1',
                        root: false,
                        children: null,
                        element: lazy(() => import('../pages/account')),
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
export default routes