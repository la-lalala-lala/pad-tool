import React, { useState } from 'react';
import {Button, Flex, Radio} from 'antd';
import './index.less'
import {useDispatch} from "react-redux";
import {setPlan} from "@/redux/modules/global"
import {useNavigate} from "react-router-dom";

const Home = (props) => {
    const {openDrawer} = props;
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [value, setValue] = useState('light-theme');

    const onChange = (e) => {
        console.log('000')
        navigate(`/backstage/notebook/5`)
        //openDrawer("props")
       // const themeVal = e.target.value;
       // dispatch(setPlan(["12312312","2334432"]))
       // setValue(themeVal);
       //  // 主要通过切换body的class来切换css变量，可以先默认给一个主题
       //  let body = document.getElementsByTagName('body')[0];
       //  if('light-theme' === themeVal){
       //      body.className = 'light-theme';
       //  } else {
       //      body.className = 'dark-theme';
       //  }
    };

    return (
        <div className='home-page'>
            <Button onClick={e => onChange(e)}>href</Button>
        </div>
    )
}

export default Home