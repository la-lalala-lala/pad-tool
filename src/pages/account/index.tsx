import React, {useState,useEffect} from "react";
import "./index.less"
import {Button,Row,Col, Input, DatePicker, Result} from "antd";
import {EditOutlined,CloseOutlined,CheckOutlined,FormOutlined} from "@ant-design/icons";
import {disabledDate, returnDefaultValue} from '@/utils/var'
import dayjs from 'dayjs';
import Edit from './edit'
const { TextArea } = Input;

const Account = (props) => {

    const [loading, setLoading] = useState({
        password:false,
        autograph:false,
        birthday:false,
        hometown:false,
    });
    const [status, setStatus] = useState({
        autograph:false,
        birthday:false,
        hometown:false,
        password:false,
    });
    const [currentUser,setCurrentUser] = useState({})
    const [form, setForm] = useState({});



    /**
     * 双向绑定日期选择
     * @param date
     * @param dateString
     */
    const dateChange = (date, dateString) => {
        setForm({...form,birthday:dateString})
    };

    /**
     * 切换 文本框编辑状态
     * @param field 字段名
     * @param value 字段值
     */
    const handleEditInput = (field,value) => {
        const _status = {...status}
        _status[field] = value
        if (value){
            // 用户进入编辑
            const _form = {...form}
            _form[field] = currentUser[field]
            setForm(_form);
        }
        setStatus(_status);
    };

    /**
     * 双向绑定文本框
     * @param event 时间
     * @param field 字段
     */
    const inputChange = (event,field) => {
        const value = event.target.value;
        const _form = {...form};
        _form[field] = value.replace(/\s+/g, '');
        setForm(_form)
    };

    /**
     * 文本框保存
     * @param field 字段名
     */
    const handleEditInputSubmit = async (field) => {
        // 首先是从form中提取数据，主要是判断是否为空
        // const value = form[field]
        // if (!value || '' === value) {
        //     showNotificationError();// "error", "错误提示", '不允许提交空内容'
        //     return;
        // }
        // // 构造提交参数
        // let args = {account: currentUser.account,token:token}
        // args[field] = value
        // // 修改loading
        // let _loading = {...loading}
        // _loading[field] = true
        // setLoading(_loading)
        // const {err,result} = await editUserInfoApi(args);
        // if(err){
        //     console.error('修改用户信息异常:',err)
        //     _loading = {...loading}
        //     _loading[field] = false
        //     setLoading(_loading)
        //     setToken(null)
        //     return
        // }
        // _loading = {...loading}
        // _loading[field] = false
        // setLoading(_loading)
        // let {msg, code} = result;
        // // 为下一次的提交申请一个token
        // setToken(await getToken());
        // if (code === 0) {
        //     // 修改成功后，及时回填值
        //     const _status = {...status}
        //     _status[field] = false
        //     setStatus(_status)
        //
        //     const user = {...currentUser}
        //     user[field] = value
        //     setCurrentUser(user);
        //     Storage.add(Storage.USER_KEY,user)
        //     openNotificationWithIcon("success", "操作结果", "个人信息修改成功");
        // } else {
        //     console.error('修改用户信息异常:')
        //     openNotificationWithIcon("error", "错误提示", msg);
        // }
    }


    return (
        <div className="account-content">
            <div className="profile-cover" style={{backgroundImage:"url(/picture/profile-bg.jpg)"}}>
                <div className="profile-container">
                    <div className="avatar-description">
                        <div className="avatar">
                            <img src="/picture/2023012735446.png" className="rounded-circle"/>
                        </div>
                        <div className="description">
                            <h3 className="mb-1">亲亲里</h3>
                            <small>Accountant</small>
                        </div>
                    </div>
                    <div className="edit-avatar">
                        <Button type="primary" icon={<EditOutlined />}>
                            更换头像
                        </Button>
                    </div>
                </div>
            </div>
            <div className="basic-info">
                <h6 className="card-title">基本信息</h6>
                <Row className="input-control-line">
                    <Col span={12} className="input-field">
                        <label className="field-label">账号</label>
                        <div className='input-field-edit-ed'>
                            <span className='field-label-value'>{returnDefaultValue(currentUser.account)}</span>
                        </div>
                    </Col>
                    <Col span={12} className="input-field">
                        <label className="field-label">姓名</label>
                        <div className='input-field-edit-ed'>
                            <span className='field-label-value'>{returnDefaultValue(currentUser.name)}</span>
                        </div>
                    </Col>
                </Row>
                <Row className="input-control-line">
                    <Col span={12} className="input-field">
                        <label className="field-label">性别</label>
                        <div className='input-field-edit-ed'>
                            <span className='field-label-value'>{returnDefaultValue(currentUser.sex)}</span>
                        </div>
                    </Col>
                    <Col span={12} className="input-field">
                        <label className="field-label">生日</label>
                        {
                            status.birthday?
                                <div className='input-field-edit-ing'>
                                    <DatePicker className='input-control-value' onChange={dateChange} disabledDate={disabledDate} value={(form && form.birthday)?dayjs(form.birthday):null}/>
                                    <div className='input-control-btn'>
                                        <CheckOutlined loading={loading.birthday} onClick={() => handleEditInputSubmit('birthday')} className='input-control-btn-save'/>
                                        <CloseOutlined onClick={() => handleEditInput('birthday',false)}/>
                                    </div>
                                </div>
                                :
                                <div className='input-field-edit-ed'>
                                    <span className='field-label-value'>{returnDefaultValue(currentUser.birthday)}</span>
                                    <FormOutlined onClick={() => handleEditInput('birthday',true)} className='input-control-btn-edit'/>
                                </div>
                        }
                    </Col>
                </Row>
                <Row className="input-control-line">
                    <Col span={12} className="input-field">
                        <label className="field-label">故乡</label>
                        {
                            status.hometown?
                                <div className='input-field-edit-ing'>
                                    <Input className='input-control-value' onChange={(e)=>inputChange(e,'hometown')} value={form.hometown} maxLength={20}/>
                                    <div className='input-control-btn'>
                                        <CheckOutlined onClick={() => handleEditInputSubmit('hometown')} className='input-control-btn-save'/>
                                        <CloseOutlined onClick={() => handleEditInput('hometown',false)} />
                                    </div>
                                </div>
                                :
                                <div className='input-field-edit-ed'>
                                    <span className='field-label-value'>{returnDefaultValue(currentUser.hometown)}</span>
                                    <FormOutlined onClick={() => handleEditInput('hometown',true)} className='input-control-btn-edit'/>
                                </div>
                        }

                    </Col>
                </Row>
                <Row className="input-control-line">
                    <Col span={12} className="input-field">
                        <label className="field-label">组织号</label>
                        <div className='input-field-edit-ed'>
                            <span className='field-label-value'>{returnDefaultValue(currentUser.organize_id)}</span>
                        </div>
                    </Col>
                    <Col span={12} className="input-field">
                        <label className="field-label">绑定QQ</label>
                        <div className='input-field-edit-ed'>
                            <span className='field-label-value'>{returnDefaultValue(currentUser.qq)}</span>
                        </div>
                    </Col>
                </Row>
                <Row className="input-control-line">
                    <Col span={12} className="input-field">
                        <label className="field-label">绑定手机</label>
                        <div className='input-field-edit-ed'>
                            <span className='field-label-value'>{returnDefaultValue(currentUser.phone)}</span>
                        </div>
                    </Col>
                    <Col span={12} className="input-field">
                        <label className="field-label">绑定邮箱</label>
                        <div className='input-field-edit-ed'>
                            <span className='field-label-value'>{returnDefaultValue(currentUser.email)}</span>
                        </div>
                    </Col>
                </Row>
            </div>
            <Row className="password-autograph">
                <div className="autograph">
                    <h6 className="card-title">个性签名</h6>
                    {
                        status.autograph?
                            <div>
                                <TextArea
                                    showCount
                                    maxLength={80}
                                    style={{ height: 120, resize: 'none' }}
                                    placeholder="disable resize"
                                />
                                <div className='input-control-btn'>
                                    <CheckOutlined loading={loading.hometown} onClick={() => handleEditInputSubmit('autograph')} className='input-control-btn-save'/>
                                    <CloseOutlined onClick={() => handleEditInput('autograph',false)} />
                                </div>
                            </div>
                            :
                            <div className='input-field-edit-ed'>
                                <span className='field-label-value'>{returnDefaultValue(currentUser.autograph)}</span>
                                <FormOutlined onClick={() => handleEditInput('autograph',true)} className='input-control-btn-edit'/>
                            </div>
                    }
                </div>
                <div className="password">
                    <h6 className="card-title">安全设置</h6>
                    { status.password?
                        <Button onClick={() => handleEditInput('password',false)}>取消</Button>
                        :
                        <Result
                            status={(currentUser.securityExpire && dayjs(currentUser.securityExpire) >= dayjs().endOf('day'))?'success':'error'}
                            subTitle={
                                (currentUser.securityExpire && dayjs(currentUser.securityExpire) >= dayjs().endOf('day'))?
                                    <span className='result-subtitle'>您的密码正在有效期范围内，如需修改，请点击<Button type="link" onClick={() => handleEditInput('password',true)}>修改</Button>按钮进行修改</span>
                                    :<span className='result-subtitle'>您的密码已经过期，请点击<Button type="link" onClick={() => handleEditInput('password',true)}>修改</Button>按钮及时修改</span>}
                        />
                    }
                </div>
            </Row>
        </div>
    )
}

export default Account;