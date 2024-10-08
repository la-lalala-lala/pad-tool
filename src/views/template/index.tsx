import React, {useState, Suspense, useEffect} from 'react';
import {Routes, Route, useNavigate, useLocation, NavLink, useRoutes} from "react-router-dom";
import { Button,Spin, Radio, Space, Divider, Tag, ConfigProvider, Badge,notification} from 'antd';
import {MailOutlined,SearchOutlined,SettingOutlined,BellOutlined,ArrowRightOutlined} from '@ant-design/icons';
import {RouterNode,routerNodes} from "@/routers/TemplateRouter";
import './index.less'
import MenuTree from "@/components/menu";
import {openNotificationWithIcon} from '@/utils/window'
import {useDispatch, useSelector} from "react-redux";
import {State} from "@/types/redux";
import {setLog, setMenu} from "@/redux/modules/global"
import {lazyLoadByString} from "@/utils/lazy_load";
import {Dom} from "@/types/dom";
import {noteBookListApi} from "@/api/modules/notes";
import {ResultData} from "@/types/api";
import {Notes} from "@/types/notes";
import {deepClone} from "@/utils/var";
import {store} from "@/redux";
import {withRouter} from "@/utils/withRouter"

// 规定没有设置侧边滑动时的位移
const unsetTransform:string = 'translateX(0vw)';
// 规定没有设置侧边滑动时的位移
const unsetWidth:string = '0vw';
// 规定侧边打开时的配置项目（生效配置） 第一项默认值，第二项展开值
const defaultTransformSetting:Array<Dom.TemplateTransform> = [{setTransform:'translateX(-20vw)',setWidth:'20vw'},{setTransform:'translateX(-60vw)',setWidth:'60vw'}];
const SETTING_PANEL = 0;
const OTHER_PANEL = 2;
const Template = () => {

    const location = useLocation();
    const {user,plan,menu} = useSelector((state:State) => state.global)
    const [view,setView] = useState<Array<Route>>([])
    const [bodyTransform,setBodyTransform] = useState<string>(unsetTransform)
    const [currentTransform,setCurrentTransform] = useState<Dom.TemplateTransform>({setTransform:unsetTransform,setWidth:unsetWidth})
    const [drawerContext,setDrawerContext] = useState()

    useEffect(()=>{
        initView();
    },[]);

    /**
     * 渲染需要的视图
     */
    const initView = () => {
        let _view:Array<Route> = [];
        const _router = menu;//store.getState().global.menu;
        console.log(_router)
        let _menu = deepClone(_router);
        for(let group:RouterNode of _menu){
            if (group.children){
                for(let app:RouterNode of group.children){
                    if (app.children){
                        // 还有子级
                        for(let link:RouterNode of app.children){
                            // view.push(
                            //     <Route key={link.path} path={link.path} element={React.cloneElement(link.element, { openDrawer: openDrawer})}/>
                            // )
                            link.element = React.lazy( () => import(`${link.location}`));
                            _view.push(
                                <Route key={link.path} path={link.path} element={
                                    lazyLoadByString(<link.element openDrawer={openDrawer}/>)
                                } />
                            )
                        }
                    }else{
                        // view.push(
                        //     <Route key={app.path} path={app.path} element={React.cloneElement(app.element, { openDrawer: openDrawer})}/>
                        // )
                        app.element = React.lazy( () => import(`${app.location}`));
                        _view.push(
                            <Route key={app.path} path={app.path} element={
                                lazyLoadByString(<app.element openDrawer={openDrawer}/>)
                            } />
                        )
                    }
                }
            }
        }
        setView(_view)
    }


    // 准备模板页面的title名称细信息
    const title = () => {
        const currentPage = location.pathname
        const _router = menu;//store.getState().global.menu;
        for(let group of _router){
            if (group.children){
                for(let app of group.children){
                    if (app.children){
                        // 还有子级
                        for(let _menu of app.children){
                            if (currentPage === `/backstage${_menu.path}`){
                                return _menu.name;
                            }
                        }
                    }else{
                        if (currentPage === `/backstage${app.path}`){
                            return app.name;
                        }
                    }
                }
            }
        }
    }

    // 右侧消息面板切换
    const panelToggle = (setting:Dom.TemplateTransform,data:any) => {
        if (setting == null || data == null){
            setBodyTransform(unsetTransform)
            setCurrentTransform({setTransform:unsetTransform,setWidth:unsetWidth});
            return
        }
        if (currentTransform.setTransform == setting.setTransform){
            // 已经打开，再次点击，意味关闭
            setBodyTransform(unsetTransform)
            setCurrentTransform({setTransform:unsetTransform,setWidth:unsetWidth});
            return
        }
        if (setting.setTransform == unsetTransform){
            // 期待关闭
            setBodyTransform(unsetTransform)
            setCurrentTransform({setTransform:unsetTransform,setWidth:unsetWidth});
            return
        }else{
            if(unsetTransform != bodyTransform){
                // 已有打开项目
                openNotificationWithIcon('info','操作提示','请先关闭右侧已打开弹窗')
                return;
            }
            setDrawerContext(data)
            setBodyTransform(defaultTransformSetting[0].setTransform)
            setCurrentTransform({...defaultTransformSetting[0]});
        }
    }

    // 打开抽屉
    const openDrawer = (data) => {
        setDrawerContext(data)
        //handleEditorPanelClick(-editorTransformX)
    }

    // 右侧设置面板切换
    const settingPanelHandle = (value:number) => {
        panelToggle(defaultTransformSetting[value],<div>234556</div>);
    }


    return (
        <div className="template-container">
            <div className="template-container-body" style={{transform:bodyTransform}}>
                {/** 头部的组件 */}
                <div className="template-left">
                    <div className="menu-header">
                        <div className='project-div' style={{backgroundImage:`url('/picture/favicon.svg')`}}>
                        </div>
                        <div className='project-name'>
                            映记
                        </div>
                    </div>
                    <div className="menu-account">
                        <div className="dropdown">
                            <a href="#">
                                <div className="avatar">
                                    <div style={{backgroundImage: 'url(' + user.logo + ')'}} className="rounded-circle" alt="image"></div>
                                </div>
                                <div className="detail">
                                    <div className="account">
                                        {user.account}
                                    </div>
                                    <small className="name">
                                        {user.name}
                                    </small>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div className="menu-body">
                        <MenuTree/>
                    </div>
                </div>
                <div className="template-right">
                    <div className="header">
                        <div className="page-title">{title()}</div>
                        <form className="search-form">
                            <div className="input-group">
                                <button className="btn-outline-light" type="button">
                                    <SearchOutlined className="bi bi-search"/>
                                </button>
                                <input type="text" className="search-form" placeholder="Search..." aria-label="Example text with button addon" aria-describedby="button-addon1"/>
                            </div>
                        </form>
                        <div className="navbar-nav">
                            <SettingOutlined className='setting-icon' onClick={() => settingPanelHandle(SETTING_PANEL)}/>
                            <Button type="primary" icon={<BellOutlined/>}>
                                新建
                            </Button>
                        </div>
                    </div>
                    <div className="content">
                        <Suspense>
                            {/*<TemplateRouter/>*/}
                            <Routes>
                                {view}
                            </Routes>
                        </Suspense>

                    </div>
                    <div className="footer">
                        <div className="copyright">
                            Copyright &copy; 2016-{(new Date()).getFullYear()} saya.ac.cn - 映记(亲亲里实验室下属文档中心)
                        </div>
                        <nav className="concat">
                            <a href="#" className="nav-link">亲亲里·门户</a>
                            <a href="#" className="nav-link">亲亲里·一站通</a>
                            <a href="#" className="nav-link">亲亲里·映记</a>
                            <a href="#" className="nav-link">Github</a>
                        </nav>
                    </div>
                </div>
            </div>
            <div className={(unsetTransform != currentTransform.setTransform && unsetWidth != currentTransform.setWidth)?'notice-panel panel-show':'notice-panel'} style={{transform:currentTransform.setTransform,width:currentTransform.setWidth}}>
                <div className="header">
                    <span>通知</span>
                    <ArrowRightOutlined onClick={e => panelToggle()}/>
                </div>
                {drawerContext}
            </div>
        </div>
    )
}
export default Template