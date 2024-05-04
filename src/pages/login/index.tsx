import {useState, useEffect, useContext} from "react";
import "./index.less"
import {LoadingOutlined} from "@ant-design/icons";
import {isEmptyObject} from "@/utils/var";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import { setToken, setUser,setPlan,setLog } from "@/redux/modules/global"
import { State } from "@/types/redux"
import { loginApi } from "@/api/modules/login";
import {NotificationContext,openNotificationWithIcon} from "@/utils/notification-context";
import {notification} from 'antd'
const Login = () => {

    const navigate = useNavigate();
    const [login, setLogin] = useState({userName:'',passWord:''});
    const [loading, setLoading] = useState(false);
    const notificationContext = useContext(NotificationContext)

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
        if (isEmptyObject(plan)){
            return
        }
        if (isEmptyObject(log)){
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
        notification.error({
            placement: 'bottomRight',
            message: 'message',
            description: 'description',
        });
        return
        try {
            let {userName,passWord} = login;
            if (null == userName || null == passWord || '' === userName || '' === passWord){
                openNotificationWithIcon(notificationContext,"错误提示", '请输入用户名和密码')
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
                // 跳转到管理界面 (不需要再回退回到登陆),push是需要回退
                navigate('/backstage/home')
            } else if (code == 5) {
                 openNotificationWithIcon(notificationContext,"错误提示", '请输入用户名和密码')
            } else {
                openNotificationWithIcon(notificationContext,"错误提示", '用户名或密码错误')
            }
        }catch (e) {
            console.error('登录异常:',e)
        }finally {
            setLoading(false);
        }
    };

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
        <div title='亲亲里·统一身份认证入口'>
            <div className="login-register-container" style={{backgroundImage: `url(/picture/login/background.jpg`}}>
                <div className='logo-area'>
                    <span>映记·亲亲里数字实验室</span>
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

export default Login