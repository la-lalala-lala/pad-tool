import { useDispatch, useSelector } from "react-redux"
import { setToken } from "@/redux/modules/global"
import { State } from "@/types/redux"

const Home = () => {
    const dispatch = useDispatch()
    const {token} = useSelector((state:State) => state.global)

    const handleClick = () => {
        dispatch(setToken('123456789'))
    }

    return (
        <div>
            {token}
            <button onClick={handleClick}>修改token</button>
        </div>
    )
}

export default Home