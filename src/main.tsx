import React from 'react'
import ReactDOM from 'react-dom/client'
import {ConfigProvider} from 'antd';
import App from '@/App.tsx'
import "antd/dist/reset.css"
import { Provider } from 'react-redux'
import { store, persistor } from "@/redux"
import { PersistGate } from 'redux-persist/integration/react'
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <ConfigProvider locale={zhCN}>
                <App />
            </ConfigProvider>
        </PersistGate>
    </Provider>
)