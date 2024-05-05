import React, { Suspense } from 'react';
import { Spin } from 'antd';

/**
 * @description 路由懒加载
 * @param 需要访问的组件
 * @returns
 */
const lazyLoad = (Comp:React.LazyExoticComponent<() => JSX.Element>) => {
    return (
        <>
            <Suspense fallback={
                <Spin
                    size="large"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%"
                    }}
                />
            }>
                <Comp />
            </Suspense>
        </>
    );
}

export default lazyLoad