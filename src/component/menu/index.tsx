import React from "react";
import {useEffect,useState} from "react";
import {Routes,Route,useNavigate,useLocation} from "react-router-dom";
import { Button, Radio, Space, Divider, Tag, ConfigProvider, Badge,notification} from 'antd';
import routes from "@/config/routes";
import * as Icon from '@ant-design/icons';
import {ArrowRightOutlined} from '@ant-design/icons';
//import RouterNode from '@/config/routes'


import './index.less'



/**
 * 左侧的菜单树（不接受对外公共使用）
 * @param props
 * @constructor
 */
const MenuTree:React.FC = (props) => {

    const navigate = useNavigate();

    // 左侧菜单li数据
    const [menuNodes,setMenuNodes] = useState([])
    const [openAppMenu,setOpenAppMenu] = useState<string>('')

    const location = useLocation()

    useEffect(()=>{
        // 初始化左侧导航
        setMenuNodes(getMenuNodes(routes,location.pathname,''));
    },[])

    useEffect(()=>{
        // 初始化左侧导航
        setMenuNodes(getMenuNodes(routes,location.pathname,openAppMenu));
    },[openAppMenu])


    /**
     * 展开app菜单
     * @param expectPath
     */
    const openAppMenuHandle = (expectPath:string) => {
        console.log('expectPath:'+expectPath)
        console.log('openAppMenu:'+openAppMenu)
        if (expectPath === openAppMenu){
            // 本次展开的和上次相同，执行收缩
            setOpenAppMenu('')
            setMenuNodes(getMenuNodes(routes,location.pathname,''));
        }else {
            setMenuNodes(getMenuNodes(routes,location.pathname,expectPath));
            setOpenAppMenu(expectPath)
        }
    }

    const pageHandle = (path:string,parentPath:string) => {
        navigate(`/backstage${path}`)
        setMenuNodes(getMenuNodes(routes,`/backstage${path}`,parentPath));
        if (parentPath == ''){
            // 单击只有一级节点的菜单时，关闭已展开的选项
            setOpenAppMenu('')
        }
    }

    /**
     * 根据menu的数据数组生成对应的标签数组
     * 使用reduce() + 递归调用
     * @param menuList 原始配置的菜单数据
     * @param currentPath 当前url
     * @returns {*}
     */
    const getMenuNodes = (menuList,currentPath=location.pathname,expectPath='') => {
        const _menu = [];
        for (const groupIndex  in menuList) {
            const group = menuList[groupIndex];
            // 处理分组级别
            if (!group.children || !group.display){
                continue
            }
            _menu.push((<li className="menu-divider" key={`${group.name+groupIndex}`}>{group.name}</li>));
            // 处理一级菜单
            const groups = group.children;
            for (const appIndex in groups) {
                const app = groups[appIndex];
                if (!app.display){
                    continue
                }
                if (app.children){
                    // 有二级菜单
                    const apps = app.children
                    let leafMenu = [];
                    // 判断菜单是否选中
                    let menuOpen = false;
                    // 是否需要展开
                    let _appOpen = expectPath==app.path
                    for (const menuIndex in apps) {
                        const menu = apps[menuIndex];
                        console.warn('menu.path:'+menu.path)
                        // 如果有一子项选中，则外层完全展开
                        menuOpen = menuOpen || `/backstage${menu.path}`==currentPath
                        leafMenu.push(
                            <li key={`${menu.name+menuIndex}`}><a href="#" onClick={()=>pageHandle(menu.path,app.path)} className={`/backstage${menu.path}`===currentPath?'active':null}><span>{menu.name}</span></a></li>
                        )
                    }
                    // 有子级节点，不允许被选中，只能下级才能被选中
                    let appMenu = (<a href="#" onClick={(e)=>openAppMenuHandle(app.path)}>
                            <span className="nav-link-icon">
                                <Button type="link"  icon={React.createElement(Icon[app.icon])} className="menu-icon"/>
                            </span>
                        <span>{app.name}</span>
                        <ArrowRightOutlined className={(_appOpen)?'sub-menu-arrow rotate-in':'sub-menu-arrow'}/>
                        {!app.content?null:<span className="badge-rounded-circle">{app.content}</span>}
                    </a>);
                    console.warn(app.path,expectPath,menuOpen,_appOpen)
                    _menu.push(<li key={`${app.name+appIndex}`} className={(_appOpen)?'open':null}>{appMenu}<ul>{leafMenu}</ul></li>)
                }else {
                    //console.warn(app.path,currentPath)
                    // 无子级节点，允许被选中
                    let appMenu = (<a href="#" onClick={()=>pageHandle(app.path,'')} className={`/backstage${app.path}`==currentPath?'active':null}>
                            <span className="nav-link-icon">
                                <Button type="link" icon={React.createElement(Icon[app.icon])} className="menu-icon"/>
                            </span>
                        <span>{app.name}</span>
                        {!app.content?null:<span className="badge-rounded-circle">{app.content}</span>}
                </a>);
                    _menu.push(<li key={`${app.name+appIndex}`}>{appMenu}</li>)
                }
            }
        }
        return _menu;
    };

    return (

        <ul>
            {menuNodes}
        </ul>
    )
}

export default MenuTree
