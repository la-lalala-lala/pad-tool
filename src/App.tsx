import Router from './router'
import {BrowserRouter} from 'react-router-dom'
import NotificationContext from '@/utils/notification-context'
import {notification} from "antd";
import React from "react";

function App() {

    const [api, contextHolder] = notification.useNotification();

    // 全局的弹窗组件
    const openNotification = (placement: string,type = 'info') => {
        api[type]({
            message: 'Notification Title',
            description: placement,
        });
    };

    return (
      <BrowserRouter>
          <NotificationContext.Provider value={openNotification}>
              {contextHolder}
              <Router/>
          </NotificationContext.Provider>
      </BrowserRouter>
  )}
export default App
