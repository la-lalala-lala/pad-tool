import React, {useState, forwardRef, useImperativeHandle, useRef, useEffect} from 'react';


const EditNewsView = (props,ref) => {
    // 暴露方法给父组件
    useImperativeHandle(ref,()=>({
        handleDisplay
    }))

    /**
     * 初始化数据
     * @param val
     */
    const handleDisplay = async (val: number) => {
        console.log("---->",val)
    }

    return (
        <div>
            修改动态
        </div>
    )

}

export default forwardRef(EditNewsView)