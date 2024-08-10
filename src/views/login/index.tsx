import React, {useState, useEffect, useContext} from "react";
import "./index.less"
import {LoadingOutlined} from "@ant-design/icons";
import {deepClone, isEmptyObject} from "@/utils/var";
import {Route, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import {setToken, setUser, setPlan, setLog, setMenu} from "@/redux/modules/global"
import { State } from "@/types/redux"
import { loginApi } from "@/api/modules/login";
import {openNotificationWithIcon} from '@/utils/window'
import {ResultData} from "@/types/api";
import {Notes} from "@/types/notes";
import {noteBookListApi} from "@/api/modules/notes";
import {RouterNode, routerNodes} from "@/routers/TemplateRouter";
import {lazyLoadByString} from "@/utils/lazy_load";

const LoginView = () => {

    const navigate = useNavigate();
    const [login, setLogin] = useState({userName:'',passWord:''});
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch()
    const {token,user,plan,log} = useSelector((state:State) => state.global)

    useEffect(()=>{
        checkLogin()
    },[])

    const checkLogin = () => {
        // 缓存数据缺一不可
        if (isEmptyObject(token)){
            return
        }
        if (isEmptyObject(user)){
            return
        }
        // if (isEmptyObject(organize)){
        //     return
        // }
        navigate('/backstage/home')
    }


    /**
     * 双向绑定登录文本框
     * @param event
     */
    const loginInputChange = (event,field) => {
        const value = event.target.value;
        const _login= {...login}
        _login[field] = value.trim();
        setLogin(_login)
    };


    /**
     * 响应登录事件
     */
    const loginHandle = async () => {
        try {
            let {userName,passWord} = login;
            if (null == userName || null == passWord || '' === userName || '' === passWord){
                openNotificationWithIcon("error","错误提示", '请输入用户名和密码')
                return
            }
            let loginParams = {account: userName, password: passWord,platform:'browser'};
            setLoading(true);
            const {code, data} = await loginApi(loginParams);
            if (code == 0) {
                let {access_token,log,plan,user} = data
                // 存入store
                dispatch(setToken(access_token))
                dispatch(setUser(user))
                dispatch(setPlan(plan))
                dispatch(setLog(log))
                // 获取组织用户列表信息
                //await getOwnOrganizeUser()
                // 获取笔记簿
                await getNoteBook();
                // 跳转到管理界面 (不需要再回退回到登陆),push是需要回退
                navigate('/backstage/home')
            } else if (code == 5) {
                openNotificationWithIcon("error","错误提示", '请输入用户名和密码')
            } else {
                openNotificationWithIcon("error","错误提示", '用户名或密码错误')
            }
        }catch (e) {
            console.error('登录异常:',e)
            openNotificationWithIcon("error","错误提示", '登录环境异常，请稍后再试')
        }finally {
            setLoading(false);
        }
    };

    /**
     * 得到笔记簿下拉选择列表数据
     */
    const getNoteBook = async () => {
        // 发异步ajax请求, 获取数据
        const result:ResultData<Array<Notes.ResNotes>> = await noteBookListApi();
        const {code,msg,data} = result;
        if (code == 0) {
            // 准备笔记簿的菜单
            let notebook:Array<RouterNode> = [];
            for (let item:Notes.ResNotes of data){
                const _item = {
                    name: item.name,
                    path: `/notebook/${item.id}`,
                    root: false,
                    children: null,
                    location: "../note",
                    element: null,
                    display: true,
                    icon: '',
                    content: `${item.notes_count}`
                };
                notebook.push(_item);
            }
            let _menu = deepClone(routerNodes);
            for(let group:RouterNode of _menu){
                if (group.children){
                    for(let app:RouterNode of group.children){
                        if (app.children){
                            // 还有子级
                            // 如果是笔记栏目，那么就用接口返回的笔记簿代替
                            if ('笔记' === app.name){
                                // 回填到全局store里面
                                app.children = notebook;
                            }
                            for(let link:RouterNode of app.children){
                                link.element = null;
                            }
                        }else{
                            app.element = null;
                        }
                    }
                }
            }
            dispatch(setMenu(_menu))
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    }


    /**
     * 获取自己所在组织下的用户
     */
    // const getOwnOrganizeUser = async () => {
    //     // 发异步ajax请求, 获取数据
    //     const {err,result} = await ownOrganizeUserApi()
    //     if (err){
    //         console.error('获取自己所在组织数据异常:',err)
    //         return
    //     }
    //     const {msg, code, data} = result
    //     if (code === 0) {
    //         let organize = {};
    //         for (let index in data) {
    //             const item = data[index]
    //             organize[item.account] = item.name
    //         }
    //         //Storage.add(Storage.ORGANIZE_KEY,organize)
    //     } else {
    //         openNotificationWithIcon(notificationContext,"错误提示", msg)
    //     }
    // }

    return (
        <div title='统一身份认证入口'>
            <div className="login-register-container" style={{backgroundImage: `url(/picture/login/background.jpg`}}>
                <div className='logo-area'>
                    <span>映记·知识百宝箱</span>
                </div>
                <div className="panel">
                    <div className="content">
                        <div className="switch">
                            <article>
                                <div className='hello-title'>欢迎回来~</div>
                            </article>
                        </div>
                        <div className='form' id="fromLogin">
                            <div className='section'>
                                <div className="input">
                                    <input className={`${!login.userName?'':'hasValue'}`} value={login.userName} type="text" onChange={(e)=> loginInputChange(e,'userName')} />
                                    <label>用户名</label>
                                </div>
                                <div className="input">
                                    <input className={`${!login.passWord?'':'hasValue'}`} value={login.passWord} type="password" onChange={(e)=> loginInputChange(e,'passWord')} />
                                    <label>密码</label>
                                </div>
                                <div className="input auto-height">
                                    {loading?
                                        <button type="button"><LoadingOutlined className='loading'/></button>
                                        :
                                        <button type="button" onClick={loginHandle}>登录</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginView