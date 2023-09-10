import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {ConfigProvider,theme} from 'antd';
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'
import './index.css'
/**
 * 入口
 */
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <ConfigProvider locale={zhCN}>
        <App />
    </ConfigProvider>
);
