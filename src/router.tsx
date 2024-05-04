import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Template from "@/pages/template";
import Login from "@/pages/login";

const Router = () => {

    return (
        <Suspense>
            <Routes>
                <Route path='/backstage/*' element={<Template/>}/>
                <Route path='/' element={<Login/>}/>
            </Routes>
        </Suspense>
    )
}

export default Router
