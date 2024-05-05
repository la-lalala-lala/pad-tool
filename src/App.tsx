import { HashRouter } from "react-router-dom"
import Router from "@/routers/index"
import AuthRouter from "@/utils/authRouter"

const App = () => {
    return (
        <HashRouter>
            <AuthRouter>
                <Router />
            </AuthRouter>
        </HashRouter>
    )
}

export default App