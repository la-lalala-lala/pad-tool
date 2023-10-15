import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {ConfigProvider} from 'antd';
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'
import './index.css'
import { Provider } from 'react-redux'
import { store, persistor } from "@/redux"
import { PersistGate } from 'redux-persist/integration/react'
/**
 * 入口
 */

type ThemeData = {
    borderRadius: number;
    colorPrimary: string;
};
const defaultData: ThemeData = {
    borderRadius: 6,
    colorPrimary: '#ff470d',
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <ConfigProvider locale={zhCN}
                    theme={{ token: { colorPrimary: defaultData.colorPrimary, borderRadius: defaultData.borderRadius } }}>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </ConfigProvider>
);
