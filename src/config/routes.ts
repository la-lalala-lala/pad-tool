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
        name: '个人',
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
            }
        ],
        element: null,
        display: true,
        icon: '',
        content: ''
    },
    {
        name: '应用',
        path: '',
        root: true,
        children: [
            {
                name: '提醒事项',
                path: '/plan',
                root: true,
                children: [
                    {
                        name: '进行中的',
                        path: '/plan/activity',
                        root: false,
                        children: null,
                        element: lazy(() => import('../pages/account')),
                        display: true,
                        icon: '',
                        content: ''
                    },
                    {
                        name: '所有提醒',
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
        name: '应用1',
        path: '',
        root: true,
        children: [
            {
                name: '提醒事项1',
                path: '/plan1',
                root: true,
                children: [
                    {
                        name: '进行中的1',
                        path: '/plan/activity1',
                        root: false,
                        children: null,
                        element: lazy(() => import('../pages/account')),
                        display: true,
                        icon: '',
                        content: ''
                    },
                    {
                        name: '所有提醒1',
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