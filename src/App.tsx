import { BrowserRouter } from "react-router-dom"
import RootRouter from "@/routers/RootRouter"
import AuthRouter from "@/utils/authRouter"

const App = () => {
    return (
        <BrowserRouter>
            <AuthRouter>
                <RootRouter/>
            </AuthRouter>
        </BrowserRouter>
    )
}

export default App