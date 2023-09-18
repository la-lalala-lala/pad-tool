import "./index.less"
import {Button,Row,Col} from "antd";
import {EditOutlined} from "@ant-design/icons";
import React from "react";
const Account = () => {
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
                <Row>
                    <Col span={12}>col-12</Col>
                    <Col span={12}>col-12</Col>
                </Row>
            </div>
            <Row className="password-autograph">
                <div className="autograph">
                    <h6 className="card-title">个性签名</h6>
                    col-12
                </div>
                <div className="autograph">
                    <h6 className="card-title">安全设置</h6>
                    col-12
                </div>
            </Row>
        </div>
    )
}

export default Account;