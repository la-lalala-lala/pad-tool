import React, { Suspense } from 'react';
import { Spin } from 'antd';

/**
 * @description 路由懒加载
 * @param 需要访问的组件
 * @returns
 */
export const lazyLoadByFunction = (Component:React.LazyExoticComponent<() => JSX.Element>) => {
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
                <Component/>
            </Suspense>
        </>
    );
}

/**
 * @description 路由懒加载
 * @param 需要访问的组件
 * @returns
 */
export const lazyLoadByString = (element:React.LazyExoticComponent<() => JSX.Element>) => {
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
                {element}
            </Suspense>
        </>
    );
}