import React, { useState } from 'react';
import {Button, Flex, Radio} from 'antd';
import './index.less'
import {useDispatch} from "react-redux";
import {setPlan} from "@/redux/modules/global"
import {useNavigate} from "react-router-dom";

const Note = (props) => {
    const {openDrawer} = props;
    const dispatch = useDispatch()

    return (
        <div className='note-page'>
            笔记
        </div>
    )
}

export default Note