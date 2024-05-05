// login/components/loginForm.tsx
import {Button, Form, Input} from "antd"
import { UserOutlined, LockOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Login } from "@/types/login";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginApi } from "@/api/modules/login";
import { setToken, setUserInfo } from "@/redux/modules/global";

const LoginForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)
    const [form] = Form.useForm()

    //login
    const onFinish = async (loginForm: Login.ReqLoginForm) => {
        try { // 使用try catch来捕获代码块里所有的抛出异常
            loginForm.platform = "1"
            // 将登录按钮的Loading改为true
            setLoading(true)
            // 调用登录Api
            const {data} = await loginApi(loginForm)
            // token存入store
            dispatch(setToken(data?.access_token))
            // 存入userInfo
            dispatch(setUserInfo({userName: loginForm.username}))
            // 跳转到home主页
            navigate("/")
        } catch(e) {
            console.log(e)
        } finally {
            // Loading置为false
            setLoading(false)
        }
    }
    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed", errorInfo)
    }

    return (
        <Form
            form={form}
            name="basic"
            labelCol={{span:5}}
            initialValues={{remenber: true}}
            size="large"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item name="account" rules={[{required:true, message:"请输入用户名"}]}>
                <Input placeholder="用户名：admin/user" prefix={<UserOutlined />}/>
            </Form.Item>
            <Form.Item name="password" rules={[{required:true, message:'请输入密码'}]}>
                <Input.Password autoComplete="new-password" placeholder="密码：123456" prefix={<LockOutlined />}/>
            </Form.Item>
            <Form.Item className="login-btn">
                <Button
                    onClick={() => {
                        form.resetFields()
                    }}
                    icon={<CloseCircleOutlined />}
                >
                    重置
                </Button>
                <Button type="primary" loading={loading} htmlType="submit" icon={<UserOutlined />}>登录</Button>
            </Form.Item>
        </Form>
    )
}

export default LoginForm