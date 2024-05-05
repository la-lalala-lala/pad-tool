// login.tsx
import LoginForm from "@/components/loginForm"
import logo from "@/assets/react.svg"

const Login = () => {
    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-form">
                    <div className="login-logo">
                        <img className="login-icon" src={logo} alt="logo" />
                        <span className="logo-text">My-React-Admin</span>
                    </div>
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default Login