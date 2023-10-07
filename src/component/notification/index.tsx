import React, {useEffect} from "react";
import {notification} from 'antd'
const Notification = ({type,message,description}) => {

    const [api,contextHolder] = notification.useNotification()
    useEffect(() => {
        if (type){
            api[type]({
                message,description,placeement:'topRight'
            })
        }
    },[type,description])

    return <>
        {contextHolder}
    </>
}
export default Notification;