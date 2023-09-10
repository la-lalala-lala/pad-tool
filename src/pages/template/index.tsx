import React, { useState,Suspense } from 'react';
import {Routes,Route,useNavigate,useLocation,NavLink} from "react-router-dom";
import { Button,Spin, Radio, Space, Divider, Tag, ConfigProvider, Badge,notification} from 'antd';
import {MailOutlined,SearchOutlined,DownloadOutlined,BellOutlined,ArrowRightOutlined} from '@ant-design/icons';
import routes from "@/config/routes";
import './index.less'
import MenuTree from "@/component/menu"; '@/component/menu'


// 规定没有设置侧边打开时的配置项目
const noneTransformSetting = ['translateX(0px)','none']
// 打开消息列表时的设置
const noticeTransformX = 420;
// 打开编辑器时的设置
const editorTransformX = 1000;

const pages = () => {
    let page = [];
    for(let group of routes){
        if (group.children){
            for(let app of group.children){
                if (app.children){
                    // 还有子级
                    for(let menu of app.children){
                        page.push(
                            <Route key={menu.path} path={menu.path} element={
                                <Suspense fallback={<div><Spin size="large"/></div>}>
                                    <menu.element/>
                                </Suspense>
                            } />
                        )
                    }
                }else{
                    page.push(
                        <Route key={app.path} path={app.path} element={
                            <Suspense fallback={<div><Spin size="large"/></div>}>
                                <app.element/>
                            </Suspense>
                        } />
                    )
                }
            }
        }
    }
    return page
}
const Template = () => {



    const [bodyTransform,setBodyTransform] = useState<string>('none')
    const [noticeTransform,setNoticeTransform] = useState<string>('none')
    const [editorTransform,setEditorTransform] = useState<string>('none')

    const openNotification = (placement: string) => {
        notification.open({
            message: 'Notification Title',
            description:placement
        });
    };

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
            openNotification('请先关闭右侧已打开弹窗')
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
            openNotification('请先关闭右侧已打开弹窗')
            return;
        }
        setBodyTransform(`translateX(${value+'px'})`)
        setEditorTransform(`translateX(${0-value+'px'})`);
    }

    return (
        <div className="template-container-body" style={{transform:bodyTransform}}>
            {/** 头部的组件 */}
            <div className="template-left">
                <div className="menu-header">
                    <div className='project-div' style={{backgroundImage:`url('/picture/favicon.svg')`}}>
                    </div>
                    <div className='project-name'>
                        亲亲里
                    </div>
                </div>
                <div className="menu-body">
                    <div className="dropdown">
                        <a href="#">
                            <div className="avatar">
                                <div style={{backgroundImage:`url('/picture/2023012735446.png')`}} className="rounded-circle" alt="image"></div>
                            </div>
                            <div className="detail">
                                <div className="account">
                                    Shmily
                                </div>
                                <small className="notice">
                                    上次登录时间：2023-09-09 16:54:40
                                </small>
                            </div>
                        </a>
                    </div>
                    <MenuTree/>
                </div>
            </div>
            <div className="template-right">
                <div className="header">
                    <div className="page-title">Chats</div>
                    <form className="search-form">
                        <div className="input-group">
                            <button className="btn-outline-light" type="button">
                                <SearchOutlined className="bi bi-search"/>
                            </button>
                            <input type="text" className="form-control" placeholder="Search..." aria-label="Example text with button addon" aria-describedby="button-addon1"/>
                        </div>
                    </form>
                    <div className="navbar-nav">
                        <Badge count={9} overflowCount={99} size="small">
                            <BellOutlined style={{fontSize:'20px'}} onClick={e => handleNoticePanelClick(-noticeTransformX)}/>
                        </Badge>
                        <Button type="primary" icon={<DownloadOutlined />}>
                            Download
                        </Button>
                    </div>
                </div>
                <div className="content">
                    <Suspense>
                        <Routes>
                            {pages()}
                        </Routes>
                    </Suspense>
                    {/*<div className="card">*/}
                    {/*    <span onClick={e => handleEditorPanelClick(-editorTransformX)}>打开编辑器</span>*/}
                    {/*</div>*/}
                </div>
                <div className="footer">
                    <div className="copyright">© 2021 Vetra - <a href="#" target="_blank">Laborasyon</a></div>
                    <nav className="concat">
                        <a href="#" className="nav-link">Licenses</a>
                        <a href="#" className="nav-link">Change Log</a>
                        <a href="#" className="nav-link">Get Help</a>
                    </nav>
                </div>
            </div>
            <div className={(noneTransformSetting[0]!=noticeTransform && noneTransformSetting[1]!==noticeTransform)?'notice-panel panel-show':'notice-panel'} style={{transform:noticeTransform,width:`${noticeTransformX}px`}}>
                <div className="header">
                    <span>通知</span>
                    <ArrowRightOutlined onClick={e => handleNoticePanelClick(0)}/>
                </div>
            </div>
            {/*<div className={(noneTransformSetting[0]!=editorTransform && noneTransformSetting[1]!==editorTransform)?'editor-panel panel-show':'editor-panel'} style={{transform:editorTransform,width:`${editorTransformX}px`}}>*/}
            {/*    <span onClick={e => handleEditorPanelClick(0)}>关闭编辑器</span>*/}
            {/*</div>*/}
        </div>
    )
}
export default Template