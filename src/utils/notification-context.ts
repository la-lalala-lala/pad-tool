import React, {Context, createContext} from 'react'

/// 弹窗上下文
export const NotificationContext = createContext(null)

// 打开弹窗
export const openNotificationWithIcon = (context, message: string, description: string, type = 'error') => {
    context(message,description,type)
};