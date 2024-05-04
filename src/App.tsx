import Router from './router'
import {BrowserRouter} from 'react-router-dom'
import {NotificationContext} from '@/utils/notification-context'
import {notification} from "antd";
import React from "react";
import AuthRouter from "@/routers/utils/auth-router";

function App() {

    const [api, contextHolder] = notification.useNotification();

    // 全局的弹窗组件
    const openNotification = (message: string,description: string,type = 'info') => {
        api[type]({
            message: message,
            description: description,
        });
    };

    return (
      <BrowserRouter>
          <NotificationContext.Provider value={openNotification}>
              {contextHolder}
              <AuthRouter>
                  <Router/>
              </AuthRouter>
          </NotificationContext.Provider>
      </BrowserRouter>
  )}
export default App
