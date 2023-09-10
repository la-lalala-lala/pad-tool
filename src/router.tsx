import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from "@/pages/editor";
import Template from "@/pages/template";

const Router = () => {


    return (
        <Suspense>
            <Routes>
                <Route path='/backstage/*' element={<Template/>}/>
            </Routes>
        </Suspense>
    )
}

export default Router
