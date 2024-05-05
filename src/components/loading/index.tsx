// components/Loading/index.tsx
import {Spin} from "antd"

const Loading = ({tip = "Loading"}: {tip?: string}) => {
    return <Spin tip={tip} size="large" className="request-loading"></Spin>
}

export default Loading