import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
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
