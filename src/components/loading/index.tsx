// components/Loading/index.tsx
import { LoadingOutlined } from '@ant-design/icons';
import {Spin} from "antd"
import "./index.less"
const Loading = ({tip = "Loading"}: {tip?: string}) => {
    return <Spin tip={tip} size="large" indicator={<LoadingOutlined spin />} fullscreen className="request-loading"></Spin>
}

export default Loading