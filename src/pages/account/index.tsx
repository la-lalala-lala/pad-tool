import React, {useState,useEffect} from "react";
import "./index.less"
import {Button,Row,Col, Input, DatePicker, Steps, Result} from "antd";
import {EditOutlined,CloseOutlined,CheckOutlined,FormOutlined} from "@ant-design/icons";
import {disabledDate, isEmptyObject, returnDefaultValue} from '@/utils/var'
import dayjs from 'dayjs';
import Cropper from '@/components/cropper'
import {useDispatch, useSelector} from "react-redux";
import {State} from "@/types/redux";
import {User} from "@/types/user";
import {formatDate_zh_CN} from "@/utils/date";
import {userStatus} from "@/utils/code";
const { TextArea } = Input;


const steps = [
    {
        title: '输入原密码',
        content: 'First-content',
    },
    {
        title: '输入新密码',
        content: 'Second-content',
    },
    {
        title: '修改完成',
        content: 'Last-content',
    },
];

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
        hometown:false
    });
    const dispatch = useDispatch()
    const {user,log} = useSelector((state:State) => state.global)
    const [currentUser,setCurrentUser] = useState<User.ResUser>(user)
    const [form, setForm] = useState({});
    // 指示当前进度条位置
    const [stepsIndex, setStepsIndex] = useState(0);
    const [stepsContent, setStepsContent] = useState([{key: 0,title: '输入原密码', content: <span>.</span>},]);

    useEffect(()=>{
        initStepsContent();
    },[])



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

    const initStepsContent = () => {
        let steps1 = <div className='steps1'><div className='steps-field-label'>原密码：</div><Input onChange={(e)=>inputChange(e,'password')}  maxLength={20}/></div>
        let steps2 = <div className='steps2'><div className='steps2-line'><div className='steps-field-label'>新的密码：</div><Input onChange={(e)=>inputChange(e,'password1')}  maxLength={20}/></div><div className='steps2-line'><div className='steps-field-label'>再次输入密码：</div><Input onChange={(e)=>inputChange(e,'password')}  maxLength={20}/></div></div>
        let steps3 = <Result status="success" title="密码修改成功" subTitle="在您下次登录时，请用新密码登录"/>
        let _initStepsContent =  [
            {
                key: 0,
                title: '输入原密码',
                content: steps1,
            },
            {
                key: 1,
                title: '输入新密码',
                content: steps2,
            },
            {
                key: 2,
                title: '修改完成',
                content: steps3,
            },
        ]
        setStepsContent(_initStepsContent)
    }

    const next = () => {
        setStepsIndex(stepsIndex + 1);

    };
    const prev = () => {
        setStepsIndex(stepsIndex - 1);
    };


    return (
        <div className="account-content">
            <div className="profile-cover" style={{backgroundImage:"url(/picture/profile-bg.jpg)"}}>
                <div className="profile-container">
                    <div className="avatar-description">
                        <div className="avatar">
                            <Cropper/>
                        </div>
                        <div className="description">
                            <div className='account-detail'>
                                <h3>{returnDefaultValue(currentUser.name)}</h3>
                                <span className='account-status'>{userStatus(user.state)}用户</span>
                            </div>
                            <small>
                                {
                                    !(isEmptyObject(log)) ?
                                        <span>{`您上次【${formatDate_zh_CN(log.date)}】在:${log.city}(${log.ip})，进行:${log.detail}操作，如不是您所为，请及时修改密码。`}</span> :
                                        <span>Hi，这是您第一次使用吧？如有需要帮助的请及时联系运营团队。</span>
                                }
                            </small>
                        </div>
                    </div>
                    <div className="edit-avatar">
                        {/*<Button type="primary" icon={<EditOutlined />}>*/}
                        {/*    更换头像*/}
                        {/*</Button>*/}
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
                                    onChange={(e)=>inputChange(e,'autograph')} value={form.autograph}
                                    style={{ height: 120, resize: 'none' }}
                                    placeholder="disable resize"
                                />
                                <div className='input-control-btn'>
                                    <CheckOutlined loading={loading.autograph} onClick={() => handleEditInputSubmit('autograph')} className='input-control-btn-save'/>
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
                    <Steps current={stepsIndex} items={stepsContent} />
                    <div>{stepsContent[stepsIndex].content}</div>
                    <div className='steps-footer'>
                        {stepsIndex < steps.length - 1 && (
                            <Button type="primary" onClick={() => next()}>
                                下一步
                            </Button>
                        )}
                        {stepsIndex > 0 && stepsIndex < steps.length - 1  &&(
                            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                                上一步
                            </Button>
                        )}
                    </div>
                </div>
            </Row>
        </div>
    )
}

export default Account;