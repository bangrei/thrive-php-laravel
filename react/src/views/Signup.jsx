import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { setToken, setUser, createUser } from "../redux/actions/userAction.js";
import { useDispatch } from "react-redux";

const Signup = () => {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();

    const dispatch = useDispatch();
    
    const [errors, setErrors] = useState(null);
    const [role, setRole] = useState("Admin");

    const onSubmit = (ev) => {
        ev.preventDefault();
        setErrors(null);
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value,
            role: role
        };
        api.post("/signup", payload)
            .then(({ data }) => {
                if (!data.success) {
                    if (data.errors) {
                        return setErrors(data.errors);
                    }
                    return setErrors({
                        email: [data.message],
                    });
                }
                dispatch(createUser({ user: data.user }));
                dispatch(setToken({ token: data.token }));
                dispatch(setUser({ user: data.user }));
            })
            .catch((error) => {
                const response = error.response;
                if (response && response.status === 422) {
                    if (response.data.errors) {
                        setErrors(response.data.errors);
                    } else {
                        setErrors({
                            email: [response.data.message],
                        });
                    }
                }
            });
    };
    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <h1>Sign up</h1>
                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}
                <form onSubmit={onSubmit}>
                    <input ref={nameRef} type="text" placeholder="Full Name" />
                    <input
                        ref={emailRef}
                        type="email"
                        placeholder="Email Address"
                    />
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="Password"
                    />
                    <input
                        ref={passwordConfirmationRef}
                        type="password"
                        placeholder="Password Confirmation"
                    />
                    <div className="radio">
                        <div className="radio-title">Role</div>
                        <div className="radio-content">
                            <div className="radio-item">
                                <input
                                    name="role"
                                    type="radio"
                                    value="Super Admin"
                                    onClick={(e) => setRole(e.target.value)}
                                />
                                <label htmlFor="role">Super Admin</label>
                            </div>
                            <div className="radio-item">
                                <input
                                    name="role"
                                    type="radio"
                                    value="Admin"
                                    onClick={(e) => setRole(e.target.value)}
                                />
                                <label htmlFor="role">Admin</label>
                            </div>
                        </div>
                    </div>
                    <button className="btn block">Create an account</button>
                    <p className="foot-note">
                        Already Registered? <Link to="/login">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signup;
