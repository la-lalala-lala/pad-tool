import React, {useState, Suspense, useContext} from 'react';
import {Routes,Route,useNavigate,useLocation,NavLink} from "react-router-dom";
import { Button,Spin, Radio, Space, Divider, Tag, ConfigProvider, Badge,notification} from 'antd';
import {MailOutlined,SearchOutlined,SettingOutlined,BellOutlined,ArrowRightOutlined} from '@ant-design/icons';
import {routerNodes,TemplateRouter} from "@/routers/TemplateRouter";
import './index.less'
import MenuTree from "@/components/menu";
import {openNotificationWithIcon} from '@/utils/window'



// 规定没有设置侧边打开时的配置项目
const noneTransformSetting = ['translateX(0px)','none']
// 打开消息列表时的设置
const noticeTransformX = 420;
// 打开编辑器时的设置
const editorTransformX = 1000;
// 打开设置时的设置
const settingTransformX = 420;
const Template = () => {

    const location = useLocation();

    const [bodyTransform,setBodyTransform] = useState<string>('none')
    const [noticeTransform,setNoticeTransform] = useState<string>('none')
    const [editorTransform,setEditorTransform] = useState<string>('none')
    const [settingTransform,setSettingTransform] = useState<string>('none')
    const [drawerContext,setDrawerContext] = useState()


    // 右侧消息面板切换
    const handleNoticePanelClick = (value:number) => {
        // 规定 为0 时表示恢复默认
        if (0 == value){
            setBodyTransform('none')
            setNoticeTransform('none');
            return
        }
        if (`translateX(${value+'px'})` == bodyTransform){
            // 如果和之前的相同，理解为用户要关闭
            setBodyTransform('none')
            setNoticeTransform('none');
            return
        }
        if(noneTransformSetting[0]!=bodyTransform && noneTransformSetting[1]!==bodyTransform){
            // 已有打开项目
            openNotificationWithIcon('info','操作提示','请先关闭右侧已打开弹窗')
            return;
        }
        setBodyTransform(`translateX(${value+'px'})`)
        setNoticeTransform(`translateX(${0-value+'px'})`);
    }

    // 右侧编辑器面板切换
    const handleEditorPanelClick = (value:number) => {
        // 规定 为0 时表示恢复默认
        if (0 == value){
            setBodyTransform('none')
            setEditorTransform('none');
            return
        }
        if (`translateX(${value+'px'})` == bodyTransform){
            // 如果和之前的相同，理解为用户要关闭
            setBodyTransform('none')
            setEditorTransform('none');
            return
        }
        if(noneTransformSetting[0]!=bodyTransform && noneTransformSetting[1]!==bodyTransform){
            // 已有打开项目
            openNotificationWithIcon('info','操作提示','请先关闭右侧已打开弹窗')
            return;
        }
        setBodyTransform(`translateX(${value+'px'})`)
        setEditorTransform(`translateX(${0-value+'px'})`);
    }

    // 右侧设置面板切换
    const handleSettingPanelClick = (value:number) => {
        // 规定 为0 时表示恢复默认
        if (0 == value){
            setBodyTransform('none')
            setSettingTransform('none');
            return
        }
        if (`translateX(${value+'px'})` == bodyTransform){
            // 如果和之前的相同，理解为用户要关闭
            setBodyTransform('none')
            setSettingTransform('none');
            return
        }
        if(noneTransformSetting[0]!=bodyTransform && noneTransformSetting[1]!==bodyTransform){
            // 已有打开项目
            openNotificationWithIcon('info','操作提示','请先关闭右侧已打开弹窗')
            return;
        }
        setBodyTransform(`translateX(${value+'px'})`)
        setSettingTransform(`translateX(${0-value+'px'})`);
    }

    // 准备模板页面的title名称细信息
    const title = () => {
        const currentPage = location.pathname
        for(let group of routerNodes){
            if (group.children){
                for(let app of group.children){
                    if (app.children){
                        // 还有子级
                        for(let menu of app.children){
                            if (currentPage === `/backstage${menu.path}`){
                                return menu.name;
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

    // 打开抽屉
    const openDrawer = (data) => {
        setDrawerContext(data)
        handleEditorPanelClick(-editorTransformX)
    }


    return (
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
                                <div style={{backgroundImage:`url(/picture/2023012735446.png)`}} className="rounded-circle" alt="image"></div>
                            </div>
                            <div className="detail">
                                <div className="account">
                                    Shmily
                                </div>
                                <small className="name">
                                    亲亲里
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
                        <SettingOutlined className='setting-icon' onClick={() => handleSettingPanelClick(-settingTransformX)}/>
                        <Badge count={9} overflowCount={99} size="small">
                            <BellOutlined style={{fontSize:'20px'}} onClick={() => handleNoticePanelClick(-noticeTransformX)}/>
                        </Badge>
                        {/*<Button type="primary" icon={<PlusOutlined/>} onClick={e => openDrawer("1111")}>*/}
                        {/*    新建*/}
                        {/*</Button>*/}
                    </div>
                </div>
                <div className="content">
                    <Suspense>
                        <TemplateRouter/>
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
            <div className={(noneTransformSetting[0]!=noticeTransform && noneTransformSetting[1]!==noticeTransform)?'notice-panel panel-show':'notice-panel'} style={{transform:noticeTransform,width:`${noticeTransformX}px`}}>
                <div className="header">
                    <span>通知</span>
                    <ArrowRightOutlined onClick={e => handleNoticePanelClick(0)}/>
                </div>
            </div>
            <div className={(noneTransformSetting[0]!=editorTransform && noneTransformSetting[1]!==editorTransform)?'editor-panel panel-show':'editor-panel'} style={{transform:editorTransform,width:`${editorTransformX}px`}}>
                <span onClick={e => handleEditorPanelClick(0)}>关闭编辑器</span>
                {drawerContext}
            </div>
            <div className={(noneTransformSetting[0]!=settingTransform && noneTransformSetting[1]!==settingTransform)?'setting-panel panel-show':'setting-panel'} style={{transform:settingTransform,width:`${settingTransformX}px`}}>
                <div className="header">
                    <span>设置</span>
                    <ArrowRightOutlined onClick={e => handleSettingPanelClick(0)}/>
                </div>
                2335454645645
            </div>
        </div>
    )
}
export default Template