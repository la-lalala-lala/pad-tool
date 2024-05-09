import React, { useState } from 'react';
import { Flex, Radio } from 'antd';
import './index.less'

const Log = () => {

    const [value, setValue] = useState('light-theme');

    const onChange = (e) => {
       const themeVal = e.target.value;
       console.log('theme:', themeVal);
       setValue(themeVal);
        // 主要通过切换body的class来切换css变量，可以先默认给一个主题
        let body = document.getElementsByTagName('body')[0];
        if('light-theme' === themeVal){
            body.className = 'light-theme';
        } else {
            body.className = 'dark-theme';
        }
    };

    return (
        <div className='log-page'>
            <Flex vertical gap="middle">
                <Radio.Group onChange={e => onChange(e)} value={value} buttonStyle="solid">
                    <Radio.Button value="light-theme">light-theme</Radio.Button>
                    <Radio.Button value="b" disabled>
                        Shanghai
                    </Radio.Button>
                    <Radio.Button value="dark-theme">dark-theme</Radio.Button>
                </Radio.Group>
            </Flex>
            <div className='lab-doc'>
                wewr
            </div>
        </div>
    )
}

export default Log